import React, { useState } from 'react'
import { Immutable, Draft } from 'immer'
import { useImmerReducer } from 'use-immer'
import tw from 'twin.macro'
import { HashSet, Vector } from 'prelude-ts'
import { Drawer } from '@material-ui/core'
import { circuits, executeCircuit } from '../../../main/circuit'
import { getState } from '../../../main/store'
import { types } from '../../../main/types'
import { Container, Item, none } from '../../../main/commons'
import { Table } from '../../../main/Table'
import { Query, Filter, Args, getQuery, updateQuery, applyFilter } from '../../../main/Filter'
import { Decimal, Indent, IndentItem, IndentItemVariable, IndentVariable, Product, PurchaseOrder, PurchaseOrderItemVariable, PurchaseOrderVariable, Quotation, QuotationItem, Supplier, UOM } from '../../../main/variables'
import * as Grid from './grids/PurchaseOrder'
import * as Grid2 from './grids/PurchaseOrders'

type State = Immutable<{
    variable: PurchaseOrderVariable
    items: {
        typeName: 'PurchaseOrderItem'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<string>
        variable: PurchaseOrderItemVariable
        variables: HashSet<PurchaseOrderItemVariable>
    }
}>

export type Action =
    | ['resetVariable']
    | ['saveVariable']

    | ['variable', 'values', 'quotation', Quotation]

    | ['items', 'limit', number]
    | ['items', 'offset', number]
    | ['items', 'page', number]
    | ['items', 'query', Args]
    | ['items', 'variable', 'values', 'purchaseOrder', PurchaseOrder]
    | ['items', 'variable', 'values', 'quotationItem', QuotationItem]
    | ['items', 'variable', 'values', 'quantity', number]
    | ['items', 'variable', 'values', 'price', Decimal]
    | ['items', 'variable', 'values', 'received', number]
    | ['items', 'addVariable']

const initialState: State = {
    variable: new PurchaseOrderVariable('', { quotation: new Quotation('') }),
    items: {
        typeName: 'PurchaseOrderItem',
        query: getQuery('PurchaseOrderItem'),
        limit: 5,
        offset: 0,
        page: 1,
        columns: Vector.of('quotationItem', 'quantity', 'price', 'received'),
        variable: new PurchaseOrderItemVariable('', { purchaseOrder: new PurchaseOrder(''), quotationItem: new QuotationItem(''), quantity: 0, price: 0, received: 0 }),
        variables: HashSet.of()
    }
}

function reducer(state: Draft<State>, action: Action) {
    switch (action[0]) {
        case 'resetVariable': {
            return initialState
        }
        // case 'saveVariable': {
        //     const [result, symbolFlag, diff] = executeCircuit(circuits.createIndent, {
        //         items: state.items.variables.toArray().map(item => {
        //             return {
        //                 product: item.values.product.toString(),
        //                 quantity: item.values.quantity,
        //                 uom: item.values.uom.toString()
        //             }
        //         })
        //     })
        //     console.log(result, symbolFlag)
        //     if (symbolFlag) {
        //         getState().addDiff(diff)
        //     }
        //     break
        // }
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
                        case 'purchaseOrder': {
                            state[action[0]][action[1]][action[2]][action[3]] = action[4]
                            break
                        }
                        case 'quotationItem': {
                            state[action[0]][action[1]][action[2]][action[3]] = action[4]
                            break
                        }
                        case 'quantity': {
                            state[action[0]][action[1]][action[2]][action[3]] = action[4]
                            break
                        }
                        case 'price': {
                            state[action[0]][action[1]][action[2]][action[3]] = action[4]
                            break
                        }
                        case 'received': {
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
    }
}

export default function PurchaseOrderX() {
    const [state, dispatch] = useImmerReducer<State, Action>(reducer, initialState)

    const purchaseOrder = types['PurchaseOrder']
    const item = types['PurchaseOrderItem']

    const [addItemDrawer, toggleAddItemDrawer] = useState(false)
    const [itemFilter, toggleItemFilter] = useState(false)

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

    const onItemInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        switch (event.target.name) {
            default: {
                switch (event.target.name) {
                    case 'purchaseOrder': {
                        dispatch(['items', 'variable', 'values', event.target.name, new PurchaseOrder(event.target.value)])
                        break
                    }
                    case 'quotationItem': {
                        dispatch(['items', 'variable', 'values', event.target.name, new QuotationItem(event.target.value)])
                        break
                    }
                    case 'quantity': {
                        dispatch(['items', 'variable', 'values', event.target.name, parseInt(event.target.value)])
                        break
                    }
                    case 'price': {
                        dispatch(['items', 'variable', 'values', event.target.name, parseFloat(event.target.value)])
                        break
                    }
                    case 'received': {
                        dispatch(['items', 'variable', 'values', event.target.name, parseInt(event.target.value)])
                        break
                    }
                }
            }
        }
    }

    const updateQuery = (list: 'items') => {
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

    return (
        <>
            <Container area={none} layout={Grid.layouts.main}>
                <Item area={Grid.header}>
                    <Title>Create {PurchaseOrder.name}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center'>
                    <Button onClick={() => dispatch(['saveVariable'])}>Save</Button>
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                <Item>
                        <Label>{purchaseOrder.keys.quotation.name}</Label>
                        <Input type='text' onChange={onVariableInputChange} value={state.variable.values.quotation.toString()} name='quotation' />
                    </Item>
                </Container>
                <Container area={Grid.uom} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header}>
                        <Title>{item.name}s</Title>
                    </Item>
                    <Item area={Grid2.filter} justify='end' align='center' className='flex'>
                        <Button onClick={() => toggleAddItemDrawer(true)}>Add</Button>
                        <Drawer open={addItemDrawer} onClose={() => toggleAddItemDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add UOM</div>
                                <Container area={none} layout={Grid.layouts.uom} className=''>
                                    <Item>
                                        <Label>{item.keys.quotationItem.name}</Label>
                                        <Input type='text' onChange={onItemInputChange} name='quotationItem' />
                                    </Item>
                                    <Item>
                                        <Label>{item.keys.quantity.name}</Label>
                                        <Input type='number' onChange={onItemInputChange} name='quantity' />
                                    </Item>
                                    <Item>
                                        <Label>{item.keys.price.name}</Label>
                                        <Input type='text' onChange={onItemInputChange} name='price' />
                                    </Item>
                                    <Item>
                                        <Label>{item.keys.received.name}</Label>
                                        <Input type='number' onChange={onItemInputChange} name='received' />
                                    </Item>
                                    <Item justify='center' align='center'>
                                        <Button onClick={() => dispatch(['items', 'addVariable'])}>Add</Button>
                                    </Item>
                                </Container>
                            </div>
                        </Drawer>
                        <Button onClick={() => toggleItemFilter(true)}>Filter</Button>
                        <Drawer open={itemFilter} onClose={() => toggleItemFilter(false)} anchor={'right'}>
                            <Filter typeName='PurchaseOrderItem' query={state['items'].query} updateQuery={updateQuery('items')} />
                        </Drawer>
                    </Item>
                    <Table area={Grid2.table} state={state['items']} updatePage={updatePage('items')} variables={state.items.variables.filter(variable => applyFilter(state['items'].query, variable))} showVariableName={false} columns={state['items'].columns} />
                </Container >
            </Container>
        </>
    )
}

const Title = tw.div`py-8 text-4xl text-gray-800 font-bold mx-1 whitespace-nowrap`

const Label = tw.label`w-1/2 whitespace-nowrap`

const Input = tw.input`p-1.5 text-gray-500 leading-tight border border-gray-400 shadow-inner hover:border-gray-600 w-full rounded-sm`

const Button = tw.button`bg-gray-900 text-white text-center font-bold p-2 mx-1 uppercase w-40 h-full max-w-sm rounded-lg focus:outline-none inline-block`
