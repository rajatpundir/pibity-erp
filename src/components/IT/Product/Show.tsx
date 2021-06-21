import React, { useEffect, useState } from 'react'
import { Immutable, Draft } from 'immer'
import { useImmerReducer } from 'use-immer'
import tw from 'twin.macro'
import Switch from '@material-ui/core/Switch'
import { HashSet, Vector } from 'prelude-ts'
import { Drawer } from '@material-ui/core'
import { executeCircuit } from '../../../main/circuit'
import { types } from '../../../main/types'
import { Container, Item, none } from '../../../main/commons'
import { Table } from '../../../main/Table'
import { Query, Filter, Args, getQuery, updateQuery, applyFilter } from '../../../main/Filter'
import { Product, ProductVariable, UOMVariable } from '../../../main/variables'
import * as Grid from './grids/Show'
import * as Grid2 from './grids/List'
import { withRouter } from 'react-router-dom'
import { circuits } from '../../../main/circuits'
import { iff, when } from '../../../main/utils'
import { db } from '../../../main/dexie'
import { DiffRow, ProductRow, UOMRow } from '../../../main/rows'
import { useCallback } from 'react'
import { updateVariable } from '../../../main/mutation'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: ProductVariable
    updatedVariableName: Product
    uoms: {
        typeName: 'UOM'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<Array<string>>
        variable: UOMVariable
        variables: HashSet<Immutable<UOMVariable>>
    }
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]

    | ['variable', 'variableName', Product]
    | ['variable', 'values', 'name', string]
    | ['variable', 'values', 'orderable', boolean]
    | ['variable', 'values', 'consumable', boolean]
    | ['variable', 'values', 'producable', boolean]

    | ['uoms', 'limit', number]
    | ['uoms', 'offset', number]
    | ['uoms', 'page', number]
    | ['uoms', 'query', Args]
    | ['uoms', 'variable', 'values', 'name', string]
    | ['uoms', 'variable', 'values', 'conversionRate', number]
    | ['uoms', 'addVariable']

    | ['replace', 'variable', ProductVariable]
    | ['replace', 'uoms', HashSet<UOMVariable>]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new ProductVariable('', { name: '', orderable: true, consumable: true, producable: false }),
        updatedVariableName: new Product(''),
        uoms: {
            typeName: 'UOM',
            query: getQuery('UOM'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'name'], ['values', 'conversionRate']),
            variable: new UOMVariable('', { product: new Product(''), name: '', conversionRate: 1 }),
            variables: HashSet.of<UOMVariable>()
        }
    }

    function reducer(state: Draft<State>, action: Action) {
        switch (action[0]) {
            case 'toggleMode': {
                state.mode = when(state.mode, {
                    'create': 'create',
                    'update': 'show',
                    'show': 'update'
                })
                break
            }
            case 'resetVariable': {
                return action[1]
            }
            case 'variable': {
                switch (action[1]) {
                    case 'variableName': {
                        if (state.mode === 'create') {
                            state[action[0]][action[1]] = action[2]
                        }
                        state.updatedVariableName = action[2]
                        break
                    }
                    case 'values': {
                        switch (action[2]) {
                            case 'name': {
                                state[action[0]][action[1]][action[2]] = action[3]
                                break
                            }
                            case 'orderable':
                            case 'consumable':
                            case 'producable': {
                                state[action[0]][action[1]][action[2]] = action[3]
                                break
                            }
                        }
                    }
                }
                break
            }
            case 'uoms': {
                switch (action[1]) {
                    case 'limit': {
                        state[action[0]].limit = Math.max(initialState.uoms.limit, action[2])
                        break
                    }
                    case 'offset': {
                        state[action[0]].offset = Math.max(0, action[2])
                        state[action[0]].page = Math.max(0, action[2]) + 1
                        break
                    }
                    case 'page': {
                        state[action[0]].page = action[2]
                        break
                    }
                    case 'query': {
                        updateQuery(state[action[0]].query, action[2])
                        break
                    }
                    case 'variable': {
                        switch (action[3]) {
                            case 'name': {
                                state[action[0]][action[1]][action[2]][action[3]] = action[4]
                                break
                            }
                            case 'conversionRate': {
                                state[action[0]][action[1]][action[2]][action[3]] = action[4]
                                break
                            }
                        }
                        break
                    }
                    case 'addVariable': {
                        state.uoms.variables = state.uoms.variables.add(new UOMVariable('', { product: new Product(''), name: state.uoms.variable.values.name, conversionRate: state.uoms.variable.values.conversionRate }))
                        state.uoms.variable = initialState.uoms.variable
                        break
                    }
                }
                break
            }
            case 'replace': {
                switch (action[1]) {
                    case 'variable': {
                        state.variable = action[2]
                        state.updatedVariableName = action[2].variableName
                        break
                    }
                    case 'uoms': {
                        state.uoms.variables = action[2]
                        break
                    }
                }
                break
            }
        }
    }

    const [state, dispatch] = useImmerReducer<State, Action>(reducer, initialState)

    const product = types['Product']
    const uom = types['UOM']

    const [addUOMDrawer, toggleAddUOMDrawer] = useState(false)
    const [uomFilter, toggleUOMFilter] = useState(false)

    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.products.toArray()
            var composedVariables = HashSet.of<Immutable<ProductVariable>>().addAll(rows ? rows.map(x => ProductRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.variableName.toString() === x.variableName.toString())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.variableName.toString() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as ProductVariable])
                const itemRows = await db.uoms.toArray()
                var composedItemVariables = HashSet.of<Immutable<UOMVariable>>().addAll(itemRows ? itemRows.map(x => UOMRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedItemVariables = composedItemVariables.filter(x => !diff.variables[state.uoms.variable.typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).filter(x => !diff.variables[state.uoms.variable.typeName].replace.anyMatch(y => y.variableName.toString() === x.variableName.toString())).addAll(diff.variables[state.uoms.variable.typeName].replace)
                })
                const items = composedItemVariables.filter(variable => variable.values.product.toString() === props.match.params[0])
                dispatch(['replace', 'uoms', items as HashSet<UOMVariable>])
            }
        }
    }, [state.variable.typeName, state.uoms.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        switch (event.target.name) {
            case 'variableName': {
                dispatch(['variable', 'variableName', new Product(event.target.value)])
                break
            }
            default: {
                switch (event.target.name) {
                    case 'name': {
                        dispatch(['variable', 'values', event.target.name, event.target.value])
                        break
                    }
                }
            }
        }
    }

    const onVariableSwitchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        switch (event.target.name) {
            case 'orderable':
            case 'consumable':
            case 'producable': {
                dispatch(['variable', 'values', event.target.name, event.target.checked])
                break
            }
        }
    }

    const onUOMInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        switch (event.target.name) {
            default: {
                switch (event.target.name) {
                    case 'name': {
                        dispatch(['uoms', 'variable', 'values', event.target.name, event.target.value])
                        break
                    }
                    case 'conversionRate': {
                        dispatch(['uoms', 'variable', 'values', event.target.name, parseFloat(event.target.value)])
                        break
                    }
                }
            }
        }
    }

    const updateItemsQuery = (list: 'uoms') => {
        const fx = (args: Args) => {
            dispatch([list, 'query', args])
        }
        return fx
    }

    const updatePage = (list: 'uoms') => {
        const fx = (args: ['limit', number] | ['offset', number] | ['page', number]) => {
            dispatch([list, args[0], args[1]])
        }
        return fx
    }

    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createProduct, {
            sku: state.variable.variableName.toString(),
            name: state.variable.values.name,
            orderable: state.variable.values.orderable,
            consumable: state.variable.values.consumable,
            producable: state.variable.values.producable,
            uoms: state.uoms.variables.toArray().map(uom => {
                return {
                    name: uom.values.name,
                    conversionRate: uom.values.conversionRate
                }
            })
        })
        console.log(result, symbolFlag, diff)
        if (symbolFlag) {
            db.diffs.put(diff.toRow())
        }
    }

    const modifyVariable = async () => {
        const [, diff] = await iff(state.variable.variableName.toString() !== state.updatedVariableName.toString(),
            updateVariable(state.variable, state.variable.toRow().values, state.updatedVariableName.toString()),
            updateVariable(state.variable, state.variable.toRow().values)
        )
        console.log(diff)
        db.diffs.put(diff.toRow())
    }

    const deleteVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteProduct, {
            variableName: state.variable.variableName.toString(),
            items: [{}]
        })
        console.log(result, symbolFlag, diff)
        if (symbolFlag) {
            db.diffs.put(diff.toRow())
        }
    }

    return iff(true,
        () => {
            return <Container area={none} layout={Grid.layouts.main}>
                <Item area={Grid.header}>
                    <Title>{when(state.mode, {
                        'create': `Create Product`,
                        'update': `Update Product`,
                        'show': `Product`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/products')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/products')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/products')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{product.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.updatedVariableName.toString()} name='variableName' />,
                                <div className='font-bold text-xl'>{state.variable.variableName.toString()}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{product.keys.name.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.name} name='name' />,
                                <div className='font-bold text-xl'>{state.variable.values.name}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <InlineLabel>{product.keys.orderable.name}</InlineLabel>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Switch color='primary' onChange={onVariableSwitchChange} checked={state.variable.values.orderable} name='orderable' />,
                                <div className='font-bold text-xl'>{state.variable.values.orderable ? 'Yes' : 'No'}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <InlineLabel>{product.keys.consumable.name}</InlineLabel>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Switch color='primary' onChange={onVariableSwitchChange} checked={state.variable.values.consumable} name='consumable' />,
                                <div className='font-bold text-xl'>{state.variable.values.consumable ? 'Yes' : 'No'}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <InlineLabel>{product.keys.producable.name}</InlineLabel>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Switch color='primary' onChange={onVariableSwitchChange} checked={state.variable.values.producable} name='producable' />,
                                <div className='font-bold text-xl'>{state.variable.values.producable ? 'Yes' : 'No'}</div>
                            )
                        }
                    </Item>
                </Container>
                <Container area={Grid.uom} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title>{uom.name}s</Title>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <button onClick={() => toggleAddUOMDrawer(true)} className='text-3xl font-bold text-white bg-gray-800 rounded-md px-2 h-10 focus:outline-none'>+</button>,
                                undefined
                            )
                        }
                    </Item>
                    <Item area={Grid2.filter} justify='end' align='center' className='flex'>
                        <Button onClick={() => toggleUOMFilter(true)}>Filter</Button>
                        <Drawer open={uomFilter} onClose={() => toggleUOMFilter(false)} anchor={'right'}>
                            <Filter typeName='UOM' query={state['uoms'].query} updateQuery={updateItemsQuery('uoms')} />
                        </Drawer>
                        <Drawer open={addUOMDrawer} onClose={() => toggleAddUOMDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add UOM</div>
                                <Container area={none} layout={Grid.layouts.uom} className=''>
                                    <Item>
                                        <Label>{uom.keys.name.name}</Label>
                                        <Input type='text' onChange={onUOMInputChange} name='name' />
                                    </Item>
                                    <Item>
                                        <Label>{uom.keys.conversionRate.name}</Label>
                                        <Input type='text' onChange={onUOMInputChange} value={state.uoms.variable.values.conversionRate} name='conversionRate' />
                                    </Item>
                                    <Item justify='center' align='center'>
                                        <Button onClick={() => dispatch(['uoms', 'addVariable'])}>Add</Button>
                                    </Item>
                                </Container>
                            </div>
                        </Drawer>
                    </Item>
                    <Table area={Grid2.table} state={state['uoms']} updatePage={updatePage('uoms')} variables={state.uoms.variables.filter(variable => applyFilter(state['uoms'].query, variable)).toArray()} columns={state['uoms'].columns.toArray()} />
                </Container >
            </Container>
        }, <div>Variable not found</div>)
}

export default withRouter(Component)

const Title = tw.div`py-8 text-4xl text-gray-800 font-bold mx-1 whitespace-nowrap`

const Label = tw.label`w-1/2 whitespace-nowrap`

const InlineLabel = tw.label`inline-block w-1/2`

const Input = tw.input`p-1.5 text-gray-500 leading-tight border border-gray-400 shadow-inner hover:border-gray-600 w-full rounded-sm`

const Button = tw.button`bg-gray-900 text-white text-center font-bold p-2 mx-1 uppercase w-40 h-full max-w-sm rounded-lg focus:outline-none inline-block`
