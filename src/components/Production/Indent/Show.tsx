import React, { useCallback, useEffect, useState } from 'react'
import { Immutable, Draft } from 'immer'
import { useImmerReducer } from 'use-immer'
import tw from 'twin.macro'
import { HashSet, Vector } from 'prelude-ts'
import { Drawer } from '@material-ui/core'
import { types } from '../../../main/types'
import { Container, Item, none } from '../../../main/commons'
import { Table } from '../../../main/Table'
import { Query, Filter, Args, getQuery, updateQuery, applyFilter } from '../../../main/Filter'
import { Indent, IndentItemVariable, IndentVariable, Product, ProductVariable, UOM, UOMVariable } from '../../../main/variables'
import * as Grid from './grids/Show'
import * as Grid2 from './grids/List'
import { withRouter } from 'react-router-dom'
import { executeCircuit } from '../../../main/circuit'
import { circuits } from '../../../main/circuits'
import { iff, when } from '../../../main/utils'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../main/dexie'
import { DiffRow, IndentItemRow, IndentRow, ProductRow, UOMRow } from '../../../main/rows'
import { updateVariable } from '../../../main/mutation'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: IndentVariable
    items: {
        typeName: 'IndentItem'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<Array<string>>
        variable: IndentItemVariable
        variables: HashSet<Immutable<IndentItemVariable>>
    }
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]

    | ['items', 'limit', number]
    | ['items', 'offset', number]
    | ['items', 'page', number]
    | ['items', 'query', Args]
    | ['items', 'variable', 'values', 'product', Product]
    | ['items', 'variable', 'values', 'quantity', number]
    | ['items', 'variable', 'values', 'uom', UOM]
    | ['items', 'addVariable']

    | ['replace', 'variable', IndentVariable]
    | ['replace', 'items', HashSet<IndentItemVariable>]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new IndentVariable(-1, {}),
        items: {
            typeName: 'IndentItem',
            query: getQuery('IndentItem'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'product'], ['values', 'quantity'], ['values', 'uom', 'values', 'name'], ['values', 'ordered'], ['values', 'received'], ['values', 'approved'], ['values', 'rejected'], ['values', 'returned'], ['values', 'requisted'], ['values', 'consumed']),
            variable: new IndentItemVariable(-1, { indent: new Indent(-1), product: new Product(-1), quantity: 0, uom: new UOM(-1), ordered: 0, received: 0, approved: 0, rejected: 0, returned: 0, requisted: 0, consumed: 0 }),
            variables: HashSet.of<IndentItemVariable>()
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
            case 'items': {
                switch (action[1]) {
                    case 'limit': {
                        state[action[0]].limit = Math.max(initialState.items.limit, action[2])
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
                            case 'product': {
                                state[action[0]][action[1]][action[2]][action[3]] = action[4]
                                break
                            }
                            case 'quantity': {
                                state[action[0]][action[1]][action[2]][action[3]] = action[4]
                                break
                            }
                            case 'uom': {
                                state[action[0]][action[1]][action[2]][action[3]] = action[4]
                                break
                            }
                            default: {
                                const _exhaustiveCheck: never = action;
                                return _exhaustiveCheck;
                            }
                        }
                        break
                    }
                    case 'addVariable': {
                        state.items.variables = state.items.variables.add(new IndentItemVariable(-1, { indent: new Indent(state.items.variable.values.indent.hashCode()), product: new Product(state.items.variable.values.product.hashCode()), quantity: state.items.variable.values.quantity, uom: new UOM(state.items.variable.values.uom.hashCode()), ordered: state.items.variable.values.ordered, received: state.items.variable.values.received, approved: state.items.variable.values.approved, rejected: state.items.variable.values.rejected, returned: state.items.variable.values.returned, requisted: state.items.variable.values.requisted, consumed: state.items.variable.values.consumed }))
                        state.items.variable = initialState.items.variable
                        break
                    }
                    default: {
                        const _exhaustiveCheck: never = action;
                        return _exhaustiveCheck;
                    }
                }
                break
            }
            case 'replace': {
                switch (action[1]) {
                    case 'variable': {
                        state.variable = action[2]
                        break
                    }
                    case 'items': {
                        state.items.variables = action[2]
                        break
                    }
                    default: {
                        const _exhaustiveCheck: never = action;
                        return _exhaustiveCheck;
                    }
                }
                break
            }
            default: {
                const _exhaustiveCheck: never = action;
                return _exhaustiveCheck;
            }
        }
    }

    const [state, dispatch] = useImmerReducer<State, Action>(reducer, initialState)

    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.Indent.toArray()
            var composedVariables = HashSet.of<Immutable<IndentVariable>>().addAll(rows ? rows.map(x => IndentRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as IndentVariable])
                const itemRows = await db.IndentItem.toArray()
                var composedItemVariables = HashSet.of<Immutable<IndentItemVariable>>().addAll(itemRows ? itemRows.map(x => IndentItemRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedItemVariables = composedItemVariables.filter(x => !diff.variables[state.items.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.items.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.items.variable.typeName].replace)
                })
                const items = composedItemVariables.filter(variable => variable.values.indent.hashCode() === props.match.params[0])
                dispatch(['replace', 'items', items as HashSet<IndentItemVariable>])
            }
        }
    }, [state.variable.typeName, state.items.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

    const rows = useLiveQuery(() => db.Product.toArray())?.map(x => ProductRow.toVariable(x))
    var products = HashSet.of<Immutable<ProductVariable>>().addAll(rows ? rows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        products = products.filter(x => !diff.variables.Product.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.Product.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.Product.replace)
    })

    const itemRows = useLiveQuery(() => db.UOM.where({ product: state.items.variable.values.product.hashCode() }).toArray())?.map(x => UOMRow.toVariable(x))
    var uoms = HashSet.of<Immutable<UOMVariable>>().addAll(itemRows ? itemRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        uoms = uoms.filter(x => !diff.variables.UOM.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.UOM.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.UOM.replace)
        uoms = uoms.filter(x => x.values.product.hashCode() === state.items.variable.values.product.hashCode())
    })

    const indent = types['Indent']
    const item = types['IndentItem']

    const [addItemDrawer, toggleAddItemDrawer] = useState(false)
    const [itemFilter, toggleItemFilter] = useState(false)

    const onItemInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            default: {
                switch (event.target.name) {
                    case 'product': {
                        dispatch(['items', 'variable', 'values', event.target.name, new Product(parseInt(event.target.value))])
                        break
                    }
                    case 'quantity': {
                        dispatch(['items', 'variable', 'values', event.target.name, parseInt(event.target.value)])
                        break
                    }
                    case 'uom': {
                        dispatch(['items', 'variable', 'values', event.target.name, new UOM(parseInt(event.target.value))])
                        break
                    }
                }
            }
        }
    }

    const updateItemsQuery = (list: 'items') => {
        const fx = (args: Args) => {
            dispatch([list, 'query', args])
        }
        return fx
    }

    const updatePage = (list: 'items') => {
        const fx = (args: ['limit', number] | ['offset', number] | ['page', number]) => {
            dispatch([list, args[0], args[1]])
        }
        return fx
    }

    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createIndent, {
            items: state.items.variables.toArray().map(item => {
                return {
                    product: item.values.product.hashCode(),
                    quantity: item.values.quantity,
                    uom: item.values.uom.hashCode()
                }
            })
        })
        console.log(result, symbolFlag)
        if (symbolFlag) {
            db.diffs.put(diff.toRow())
        }
    }

    const modifyVariable = async () => {
        const [, diff] = await updateVariable(state.variable, state.variable.toRow().values)
        console.log(diff)
        db.diffs.put(diff.toRow())
    }

    const deleteVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteIndent, {
            variableName: state.variable.id.hashCode(),
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
                        'create': `Create ${indent.name}`,
                        'update': `Update ${indent.name}`,
                        'show': `${indent.name}`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/indents')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/indents')
                                    }}>Save</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/indents')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.uom} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title>Items</Title>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <button onClick={() => toggleAddItemDrawer(true)} className='text-3xl font-bold text-white bg-gray-800 rounded-md px-2 h-10 focus:outline-none'>+</button>,
                                undefined
                            )
                        }
                    </Item>
                    <Item area={Grid2.filter} justify='end' align='center' className='flex'>
                        <Button onClick={() => toggleItemFilter(true)}>Filter</Button>
                        <Drawer open={itemFilter} onClose={() => toggleItemFilter(false)} anchor={'right'}>
                            <Filter typeName='IndentItem' query={state['items'].query} updateQuery={updateItemsQuery('items')} />
                        </Drawer>
                        <Drawer open={addItemDrawer} onClose={() => toggleAddItemDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add Item</div>
                                <Container area={none} layout={Grid.layouts.uom}>
                                    <Item>
                                        <Label>{item.keys.product.name}</Label>
                                        <Select onChange={onItemInputChange} value={state.items.variable.values.product.hashCode()} name='product'>
                                            <option value='' selected disabled hidden>Select Product</option>
                                            {products.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                        </Select>
                                    </Item>
                                    <Item>
                                        <Label>{item.keys.quantity.name}</Label>
                                        <Input type='number' onChange={onItemInputChange} value={state.items.variable.values.quantity} name='quantity' />
                                    </Item>
                                    <Item>
                                        <Label>{item.keys.uom.name}</Label>
                                        <Select onChange={onItemInputChange} value={state.items.variable.values.uom.hashCode()} name='uom'>
                                            <option value='' selected disabled hidden>Select Item</option>
                                            {uoms.toArray().map(x => <option value={x.id.hashCode()}>{x.values.name}</option>)}
                                        </Select>
                                    </Item>
                                    <Item justify='center' align='center'>
                                        <Button onClick={() => dispatch(['items', 'addVariable'])}>Add</Button>
                                    </Item>
                                </Container>
                            </div>
                        </Drawer>
                    </Item>
                    <Table area={Grid2.table} state={state['items']} updatePage={updatePage('items')} variables={state.items.variables.filter(variable => applyFilter(state['items'].query, variable)).toArray()} columns={state['items'].columns.toArray()} />
                </Container >
            </Container>
        }, <div>Variable not found</div>)
}

export default withRouter(Component)

const Title = tw.div`py-8 text-4xl text-gray-800 font-bold mx-1 whitespace-nowrap`

const Label = tw.label`w-1/2 whitespace-nowrap`

const Input = tw.input`p-1.5 text-gray-500 leading-tight border border-gray-400 shadow-inner hover:border-gray-600 w-full rounded-sm`

const Select = tw.select`p-1.5 text-gray-500 leading-tight border border-gray-400 shadow-inner hover:border-gray-600 w-full rounded-sm`

const Button = tw.button`bg-gray-900 text-white text-center font-bold p-2 mx-1 uppercase w-40 h-full max-w-sm rounded-lg focus:outline-none inline-block`
