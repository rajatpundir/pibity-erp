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
import { Quotation, QuotationItem, PurchaseOrder, PurchaseOrderItemVariable, PurchaseOrderVariable, QuotationItemVariable, QuotationVariable } from '../../../main/variables'
import * as Grid from './grids/Show'
import * as Grid2 from './grids/List'
import { withRouter } from 'react-router-dom'
import { executeCircuit } from '../../../main/circuit'
import { circuits } from '../../../main/circuits'
import { iff, when } from '../../../main/utils'
import { getVariable } from '../../../main/layers'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../main/dexie'
import { DiffRow, PurchaseOrderItemRow, PurchaseOrderRow, QuotationItemRow, QuotationRow } from '../../../main/rows'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: PurchaseOrderVariable
    items: {
        typeName: 'PurchaseOrderItem'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<Array<string>>
        variable: PurchaseOrderItemVariable
        variables: HashSet<Immutable<PurchaseOrderItemVariable>>
    }
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]


    | ['variable', 'values', 'quotation', Quotation]

    | ['items', 'limit', number]
    | ['items', 'offset', number]
    | ['items', 'page', number]
    | ['items', 'query', Args]
    | ['items', 'variable', 'values', 'quotationItem', QuotationItem]
    | ['items', 'variable', 'values', 'quantity', number]
    | ['items', 'addVariable']

    | ['replace', 'variable', PurchaseOrderVariable]
    | ['replace', 'items', HashSet<PurchaseOrderItemVariable>]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new PurchaseOrderVariable('', { quotation: new Quotation('') }),
        items: {
            typeName: 'PurchaseOrderItem',
            query: getQuery('PurchaseOrderItem'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'quotationItem'], ['values', 'quotationItem', 'values', 'quotation'], ['values', 'quantity']),
            variable: new PurchaseOrderItemVariable('', { purchaseOrder: new PurchaseOrder(''), quotationItem: new QuotationItem(''), quantity: 0, price: 0, received: 0 }),
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
                            case 'quotation': {
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
                            case 'quotationItem': {
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
                        state.items.variables = state.items.variables.add(new PurchaseOrderItemVariable('', { purchaseOrder: new PurchaseOrder(state.items.variable.values.purchaseOrder.toString()), quotationItem: new QuotationItem(state.items.variable.values.quotationItem.toString()), quantity: 0, price: 0, received: 0 }))
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

    useEffect(() => {
        async function setVariable() {
            if (props.match.params[0]) {               
                const rows = await db.purchaseOrders.toArray()
                var composedVariables = HashSet.of<Immutable<PurchaseOrderVariable>>().addAll(rows ? rows.map(x => PurchaseOrderRow.toVariable(x)) : [])
                const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
                diffs?.forEach(diff => {
                    composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).addAll(diff.variables[state.variable.typeName].replace)
                })
                const variables = composedVariables.filter(variable => variable.variableName.toString() === props.match.params[0])
                if (variables.length() === 1) {
                    const variable = variables.toArray()[0]
                    dispatch(['replace', 'variable', variable as PurchaseOrderVariable])
                    const itemRows = await db.purchaseOrderItems.toArray()
                    var composedItemVariables = HashSet.of<Immutable<PurchaseOrderItemVariable>>().addAll(itemRows ? itemRows.map(x => PurchaseOrderItemRow.toVariable(x)) : [])
                    diffs?.forEach(diff => {
                        composedItemVariables = composedItemVariables.filter(x => !diff.variables[state.items.variable.typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).addAll(diff.variables[state.items.variable.typeName].replace)
                    })
                    console.log('cc', composedItemVariables)
                    const items = composedItemVariables.filter(variable => variable.values.purchaseOrder.toString() === props.match.params[0])
                    dispatch(['replace', 'items', items as HashSet<PurchaseOrderItemVariable>])
                }
            }
        }
        setVariable()
    }, [state.variable.typeName, state.items.variable.typeName, props.match.params, dispatch])

    const rows = useLiveQuery(() => db.quotations.toArray())?.map(x => QuotationRow.toVariable(x))
    var quotations = HashSet.of<Immutable<QuotationVariable>>().addAll(rows ? rows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        quotations = quotations.filter(x => !diff.variables.Quotation.remove.anyMatch(y => x.variableName.toString() === y.toString())).addAll(diff.variables.Quotation.replace)
    })

    const itemRows = useLiveQuery(() => db.quotationItems.where({ quotation: state.variable.values.quotation.toString() }).toArray())?.map(x => QuotationItemRow.toVariable(x))
    var items = HashSet.of<Immutable<QuotationItemVariable>>().addAll(itemRows ? itemRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        items = items.filter(x => !diff.variables.IndentItem.remove.anyMatch(y => x.variableName.toString() === y.toString())).addAll(diff.variables.QuotationItem.replace)
        items = items.filter(x => x.values.quotation.toString() === state.variable.values.quotation.toString())
    })

    // const quotations = useLiveQuery(() => db.quotations.toArray())
    // const items = useLiveQuery(() => db.quotationItems.where({ quotation: state.variable.values.quotation.toString() }).toArray())

    const purchaseOrder = types['PurchaseOrder']
    const item = types['PurchaseOrderItem']

    const [addItemDrawer, toggleAddItemDrawer] = useState(false)
    const [itemFilter, toggleItemFilter] = useState(false)

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            default: {
                switch (event.target.name) {
                    case 'quotation': {
                        dispatch(['variable', 'values', event.target.name, new Quotation(event.target.value)])
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
                    case 'quotationItem': {
                        dispatch(['items', 'variable', 'values', event.target.name, new QuotationItem(event.target.value)])
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createPurchaseOrder, {
            quotation: state.variable.values.quotation,
            items: state.items.variables.toArray().map(item => {
                return {
                    quotationItem: item.values.quotationItem.toString(),
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
                        'create': `Create ${purchaseOrder.name}`,
                        'update': `Update ${purchaseOrder.name}`,
                        'show': `${purchaseOrder.name}`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await saveVariable()
                                props.history.push('/purchase-orders')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        dispatch(['resetVariable', initialState])
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await saveVariable()
                                        props.history.push('/purchase-orders')
                                    }}>Save</Button>
                                </>,
                                <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{purchaseOrder.keys.quotation.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.quotation.toString()} name='quotation'>
                                    <option value='' selected disabled hidden>Select Quotation</option>
                                    {quotations.toArray().map(x => <option value={x.variableName.toString()}>{x.variableName.toString()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{state.variable.values.quotation.toString()}</div>
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
                            <Filter typeName='PurchaseOrderItem' query={state['items'].query} updateQuery={updateItemsQuery('items')} />
                        </Drawer>
                        <Drawer open={addItemDrawer} onClose={() => toggleAddItemDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add Item</div>
                                <Container area={none} layout={Grid.layouts.uom} className=''>
                                    <Item>
                                        <Label>{item.keys.quotationItem.name}</Label>
                                        <Select onChange={onItemInputChange} value={state.items.variable.values.quotationItem.toString()} name='quotationItem'>
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
