import React, { useEffect, useState } from 'react'
import { Immutable, Draft } from 'immer'
import { useImmerReducer } from 'use-immer'
import tw from 'twin.macro'
import { HashSet, Vector } from 'prelude-ts'
import { Drawer } from '@material-ui/core'
import { types } from '../../../main/types'
import { Container, Item, none } from '../../../main/commons'
import { Table } from '../../../main/Table'
import { Query, Filter, Args, getQuery, updateQuery, applyFilter } from '../../../main/Filter'
import { PurchaseInvoice, PurchaseInvoiceItem, MaterialRejectionSlip, MaterialRejectionSlipItemVariable, MaterialRejectionSlipVariable, PurchaseInvoiceItemVariable, PurchaseInvoiceVariable } from '../../../main/variables'
import * as Grid from './grids/Show'
import * as Grid2 from './grids/List'
import { withRouter } from 'react-router-dom'
import { executeCircuit } from '../../../main/circuit'
import { circuits } from '../../../main/circuits'
import { iff, when } from '../../../main/utils'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../main/dexie'
import { DiffRow, MaterialRejectionSlipItemRow, MaterialRejectionSlipRow, PurchaseInvoiceItemRow, PurchaseInvoiceRow } from '../../../main/rows'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: MaterialRejectionSlipVariable
    items: {
        typeName: 'MaterialRejectionSlipItem'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<Array<string>>
        variable: MaterialRejectionSlipItemVariable
        variables: HashSet<Immutable<MaterialRejectionSlipItemVariable>>
    }
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]


    | ['variable', 'values', 'purchaseInvoice', PurchaseInvoice]

    | ['items', 'limit', number]
    | ['items', 'offset', number]
    | ['items', 'page', number]
    | ['items', 'query', Args]
    | ['items', 'variable', 'values', 'purchaseInvoiceItem', PurchaseInvoiceItem]
    | ['items', 'variable', 'values', 'quantity', number]
    | ['items', 'addVariable']

    | ['replace', 'variable', MaterialRejectionSlipVariable]
    | ['replace', 'items', HashSet<MaterialRejectionSlipItemVariable>]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new MaterialRejectionSlipVariable('', { purchaseInvoice: new PurchaseInvoice('') }),
        items: {
            typeName: 'MaterialRejectionSlipItem',
            query: getQuery('MaterialRejectionSlipItem'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'purchaseInvoiceItem'], ['values', 'purchaseInvoiceItem', 'values', 'purchaseInvoice'], ['values', 'quantity']),
            variable: new MaterialRejectionSlipItemVariable('', { materialRejectionSlip: new MaterialRejectionSlip(''), purchaseInvoiceItem: new PurchaseInvoiceItem(''), quantity: 0, returned: 0 }),
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
                            case 'purchaseInvoice': {
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
                            case 'purchaseInvoiceItem': {
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
                        state.items.variables = state.items.variables.add(new MaterialRejectionSlipItemVariable('', { materialRejectionSlip: new MaterialRejectionSlip(state.items.variable.values.materialRejectionSlip.toString()), purchaseInvoiceItem: new PurchaseInvoiceItem(state.items.variable.values.purchaseInvoiceItem.toString()), quantity: 0, returned: 0 }))
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
                        state.items.variables = HashSet.of<MaterialRejectionSlipItemVariable>().addAll(action[2])
                        break
                    }
                }
                break
            }
        }
    }

    const [state, dispatch] = useImmerReducer<State, Action>(reducer, initialState)
    useEffect(() => {
        async function setVariable() {
            if (props.match.params[0]) {
                console.log(props.match.params[0])
                const rows = await db.materialRejectionSlips.toArray()
                var composedVariables = HashSet.of<Immutable<MaterialRejectionSlipVariable>>().addAll(rows ? rows.map(x => MaterialRejectionSlipRow.toVariable(x)) : [])
                const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
                diffs?.forEach(diff => {
                    composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).addAll(diff.variables[state.variable.typeName].replace)
                })
                const variables = composedVariables.filter(variable => variable.variableName.toString() === props.match.params[0])
                if (variables.length() === 1) {
                    const variable = variables.toArray()[0]
                    dispatch(['replace', 'variable', variable as MaterialRejectionSlipVariable])
                    const itemRows = await db.materialRejectionSlipItems.toArray()
                    var composedItemVariables = HashSet.of<Immutable<MaterialRejectionSlipItemVariable>>().addAll(itemRows ? itemRows.map(x => MaterialRejectionSlipItemRow.toVariable(x)) : [])
                    diffs?.forEach(diff => {
                        composedItemVariables = composedItemVariables.filter(x => !diff.variables[state.items.variable.typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).addAll(diff.variables[state.items.variable.typeName].replace)
                    })
                    console.log('cc', composedItemVariables)
                    const items = composedItemVariables.filter(variable => variable.values.materialRejectionSlip.toString() === props.match.params[0])
                    dispatch(['replace', 'items', items as HashSet<MaterialRejectionSlipItemVariable>])
                }
            }
        }
        setVariable()
    }, [state.variable.typeName, state.items.variable.typeName, props.match.params, dispatch])

    const rows = useLiveQuery(() => db.purchaseInvoices.toArray())?.map(x => PurchaseInvoiceRow.toVariable(x))
    var purchaseInvoices = HashSet.of<Immutable<PurchaseInvoiceVariable>>().addAll(rows ? rows : [])     
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        purchaseInvoices = purchaseInvoices.filter(x => !diff.variables.PurchaseInvoice.remove.anyMatch(y => x.variableName.toString() === y.toString())).addAll(diff.variables.PurchaseInvoice.replace)
    })

    const itemRows = useLiveQuery(() => db.purchaseInvoiceItems.where({ purchaseInvoice: state.variable.values.purchaseInvoice.toString() }).toArray())?.map(x => PurchaseInvoiceItemRow.toVariable(x))
    var items = HashSet.of<Immutable<PurchaseInvoiceItemVariable>>().addAll(itemRows ? itemRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        items = items.filter(x => !diff.variables.PurchaseInvoiceItem.remove.anyMatch(y => x.variableName.toString() === y.toString())).addAll(diff.variables.PurchaseInvoiceItem.replace)
        items = items.filter(x => x.values.purchaseInvoice.toString() === state.variable.values.purchaseInvoice.toString())
    })

    const materialRejectionSlip = types['MaterialRejectionSlip']
    const item = types['MaterialRejectionSlipItem']

    const [addItemDrawer, toggleAddItemDrawer] = useState(false)
    const [itemFilter, toggleItemFilter] = useState(false)

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            default: {
                switch (event.target.name) {
                    case 'purchaseInvoice': {
                        dispatch(['variable', 'values', event.target.name, new PurchaseInvoice(event.target.value)])
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
                    case 'purchaseInvoiceItem': {
                        dispatch(['items', 'variable', 'values', event.target.name, new PurchaseInvoiceItem(event.target.value)])
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createMaterialRejectionSlip, {
            purchaseInvoice: state.variable.values.purchaseInvoice,
            items: state.items.variables.toArray().map(item => {
                return {
                    purchaseInvoiceItem: item.values.purchaseInvoiceItem.toString(),
                    quantity: item.values.quantity
                }
            })
        })
        console.log(result, symbolFlag)
        if (symbolFlag) {
            db.diffs.put(diff.toRow())
        }
    }

    return iff(true,
        () => {
            return <Container area={none} layout={Grid.layouts.main}>
                <Item area={Grid.header}>
                    <Title>{when(state.mode, {
                        'create': `Create ${materialRejectionSlip.name}`,
                        'update': `Update ${materialRejectionSlip.name}`,
                        'show': `${materialRejectionSlip.name}`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await saveVariable()
                                props.history.push('/materials-rejected')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        dispatch(['resetVariable', initialState])
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await saveVariable()
                                        props.history.push('/materials-rejected')
                                    }}>Save</Button>
                                </>,
                                <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{materialRejectionSlip.keys.purchaseInvoice.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.purchaseInvoice.toString()} name='purchaseInvoice'>
                                    <option value='' selected disabled hidden>Select item</option>
                                    {purchaseInvoices.toArray().map(x => <option value={x.variableName.toString()}>{x.variableName.toString()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{state.variable.values.purchaseInvoice.toString()}</div>
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
                            <Filter typeName='MaterialRejectionSlipItem' query={state['items'].query} updateQuery={updateItemsQuery('items')} />
                        </Drawer>
                        <Drawer open={addItemDrawer} onClose={() => toggleAddItemDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add Item</div>
                                <Container area={none} layout={Grid.layouts.uom} className=''>
                                    <Item>
                                        <Label>{item.keys.purchaseInvoiceItem.name}</Label>
                                        <Select onChange={onItemInputChange} value={state.items.variable.values.purchaseInvoiceItem.toString()} name='purchaseInvoiceItem'>
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
                    <Table area={Grid2.table} state={state['items']} updatePage={updatePage('items')} variables={state.items.variables.filter(variable => applyFilter(state['items'].query, variable))} columns={state['items'].columns.toArray()} />
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
