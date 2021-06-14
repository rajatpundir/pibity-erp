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
import { MaterialApprovalSlip, MaterialApprovalSlipItem, MaterialApprovalSlipItemVariable, MaterialApprovalSlipVariable, MaterialRequistionSlip, MaterialRequistionSlipItemVariable, MaterialRequistionSlipVariable } from '../../../main/variables'
import * as Grid from './grids/Show'
import * as Grid2 from './grids/List'
import { withRouter } from 'react-router-dom'
import { executeCircuit } from '../../../main/circuit'
import { circuits } from '../../../main/circuits'
import { iff, when } from '../../../main/utils'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../main/dexie'
import { DiffRow, MaterialApprovalSlipItemRow, MaterialApprovalSlipRow, MaterialRequistionSlipItemRow, MaterialRequistionSlipRow } from '../../../main/rows'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: MaterialRequistionSlipVariable
    items: {
        typeName: 'MaterialRequistionSlipItem'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<Array<string>>
        variable: MaterialRequistionSlipItemVariable
        variables: HashSet<Immutable<MaterialRequistionSlipItemVariable>>
    }
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]

    | ['variable', 'values', 'materialApprovalSlip', MaterialApprovalSlip]

    | ['items', 'limit', number]
    | ['items', 'offset', number]
    | ['items', 'page', number]
    | ['items', 'query', Args]
    | ['items', 'variable', 'values', 'materialApprovalSlipItem', MaterialApprovalSlipItem]
    | ['items', 'variable', 'values', 'quantity', number]
    | ['items', 'addVariable']

    | ['replace', 'variable', MaterialRequistionSlipVariable]
    | ['replace', 'items', HashSet<MaterialRequistionSlipItemVariable>]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new MaterialRequistionSlipVariable('', { materialApprovalSlip: new MaterialApprovalSlip('') }),
        items: {
            typeName: 'MaterialRequistionSlipItem',
            query: getQuery('MaterialRequistionSlipItem'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'materialApprovalSlipItem'], ['values', 'quantity']),
            variable: new MaterialRequistionSlipItemVariable('', { materialRequistionSlip: new MaterialRequistionSlip(''), materialApprovalSlipItem: new MaterialApprovalSlipItem(''), quantity: 0, consumed: 0 }),
            variables: HashSet.of()
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
                    case 'values': {
                        switch (action[2]) {
                            case 'materialApprovalSlip': {
                                state[action[0]][action[1]][action[2]] = action[3]
                                break
                            }
                        }
                    }
                }
                break
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
                            case 'materialApprovalSlipItem': {
                                state[action[0]][action[1]][action[2]][action[3]] = action[4]
                                break
                            }
                            case 'quantity': {
                                state[action[0]][action[1]][action[2]][action[3]] = action[4]
                                break
                            }
                        }
                        break
                    }
                    case 'addVariable': {
                        state.items.variables = state.items.variables.add(new MaterialRequistionSlipItemVariable('', { materialRequistionSlip: new MaterialRequistionSlip(''), materialApprovalSlipItem: new MaterialApprovalSlipItem(state.items.variable.values.materialApprovalSlipItem.toString()), quantity: state.items.variable.values.quantity, consumed: 0 }))
                        state.items.variable = initialState.items.variable
                        break
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
                }
                break
            }
        }
    }

    const [state, dispatch] = useImmerReducer<State, Action>(reducer, initialState)

    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.materialRequistionSlips.toArray()
            var composedVariables = HashSet.of<Immutable<MaterialRequistionSlipVariable>>().addAll(rows ? rows.map(x => MaterialRequistionSlipRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.variableName.toString() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as MaterialRequistionSlipVariable])
                const itemRows = await db.materialRequistionSlipItems.toArray()
                var composedItemVariables = HashSet.of<Immutable<MaterialRequistionSlipItemVariable>>().addAll(itemRows ? itemRows.map(x => MaterialRequistionSlipItemRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedItemVariables = composedItemVariables.filter(x => !diff.variables[state.items.variable.typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).addAll(diff.variables[state.items.variable.typeName].replace)
                })
                const items = composedItemVariables.filter(variable => variable.values.materialRequistionSlip.toString() === props.match.params[0])
                dispatch(['replace', 'items', items as HashSet<MaterialRequistionSlipItemVariable>])
            }
        }
    }, [state.variable.typeName, state.items.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

    const rows = useLiveQuery(() => db.materialApprovalSlips.toArray())?.map(x => MaterialApprovalSlipRow.toVariable(x))
    var materialApprovalSlips = HashSet.of<Immutable<MaterialApprovalSlipVariable>>().addAll(rows ? rows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        materialApprovalSlips = materialApprovalSlips.filter(x => !diff.variables.MaterialApprovalSlip.remove.anyMatch(y => x.variableName.toString() === y.toString())).addAll(diff.variables.MaterialApprovalSlip.replace)
    })

    const itemRows = useLiveQuery(() => db.materialApprovalSlipItems.where({ materialApprovalSlip: state.variable.values.materialApprovalSlip.toString() }).toArray())?.map(x => MaterialApprovalSlipItemRow.toVariable(x))
    var items = HashSet.of<Immutable<MaterialApprovalSlipItemVariable>>().addAll(itemRows ? itemRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        items = items.filter(x => !diff.variables.MaterialApprovalSlipItem.remove.anyMatch(y => x.variableName.toString() === y.toString())).addAll(diff.variables.MaterialApprovalSlipItem.replace)
        items = items.filter(x => x.values.materialApprovalSlip.toString() === state.variable.values.materialApprovalSlip.toString())
    })

    const materialRequistionSlip = types['MaterialRequistionSlip']
    const item = types['MaterialRequistionSlipItem']

    const [addItemDrawer, toggleAddItemDrawer] = useState(false)
    const [itemFilter, toggleItemFilter] = useState(false)

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            default: {
                switch (event.target.name) {
                    case 'materialApprovalSlip': {
                        dispatch(['variable', 'values', event.target.name, new MaterialApprovalSlip(event.target.value)])
                        break
                    }
                }
            }
        }
    }

    const onItemInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            default: {
                switch (event.target.name) {
                    case 'materialApprovalSlipItem': {
                        dispatch(['items', 'variable', 'values', event.target.name, new MaterialApprovalSlipItem(event.target.value)])
                        break
                    }
                    case 'quantity': {
                        dispatch(['items', 'variable', 'values', event.target.name, parseInt(event.target.value)])
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

    const saveVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createMaterialRequistionSlip, {
            materialApprovalSlip: state.variable.values.materialApprovalSlip.toString(),
            items: state.items.variables.toArray().map(item => {
                return {
                    materialApprovalSlipItem: item.values.materialApprovalSlipItem.toString(),
                    quantity: item.values.quantity
                }
            })
        })
        console.log(result, symbolFlag)
        if (symbolFlag) {
            db.diffs.put(diff.toRow())
        }
    }

    const deleteVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteMaterialRequistionSlip, {
            variableName: state.variable.variableName.toString()
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
                        'create': `Create ${materialRequistionSlip.name}`,
                        'update': `Update ${materialRequistionSlip.name}`,
                        'show': `${materialRequistionSlip.name}`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await saveVariable()
                                props.history.push('/requistions')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await saveVariable()
                                        props.history.push('/requistions')
                                    }}>Save</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/requistions')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{materialRequistionSlip.keys.materialApprovalSlip.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.materialApprovalSlip.toString()} name='materialApprovalSlip'>
                                    <option value='' selected disabled hidden>Select Material Approval Slip</option>
                                    {materialApprovalSlips.toArray().map(x => <option value={x.variableName.toString()}>{x.variableName.toString()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{state.variable.values.materialApprovalSlip.toString()}</div>
                            )
                        }
                    </Item>
                </Container>
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
                            <Filter typeName='MaterialRequistionSlipItem' query={state['items'].query} updateQuery={updateItemsQuery('items')} />
                        </Drawer>
                        <Drawer open={addItemDrawer} onClose={() => toggleAddItemDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add Item</div>
                                <Container area={none} layout={Grid.layouts.uom} className=''>
                                    <Item>
                                        <Label>{item.keys.materialApprovalSlipItem.name}</Label>
                                        <Select onChange={onItemInputChange} value={state.items.variable.values.materialApprovalSlipItem.toString()} name='materialApprovalSlipItem'>
                                            <option value='' selected disabled hidden>Select Item</option>
                                            {items.toArray().map(x => <option value={x.variableName.toString()}>{x.variableName.toString()}</option>)}
                                        </Select>
                                    </Item>
                                    <Item>
                                        <Label>{item.keys.quantity.name}</Label>
                                        <Input type='number' onChange={onItemInputChange} value={state.items.variable.values.quantity} name='quantity' />
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
