import React, { useState } from 'react'
import { Immutable, Draft } from 'immer'
import { useImmerReducer } from 'use-immer'
import tw from 'twin.macro'
import { HashSet, Vector } from 'prelude-ts'
import { Drawer } from '@material-ui/core'
import { types } from '../../../main/types'
import { Container, Item, none } from '../../../main/commons'
import { Table } from '../../../main/Table'
import { Query, Filter, Args, getQuery, updateQuery, applyFilter } from '../../../main/Filter'
import { Indent, IndentItem, Quotation, QuotationItemVariable, QuotationVariable, Supplier } from '../../../main/variables'
import * as Grid from './grids/Show'
import * as Grid2 from './grids/List'
import { withRouter } from 'react-router-dom'
import { useStore } from '../../../main/store'
import { executeCircuit } from '../../../main/circuit'
import { circuits } from '../../../main/circuits'

import { iff, when } from '../../../main/utils'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: QuotationVariable
    items: {
        typeName: 'QuotationItem'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<Array<string>>
        variable: QuotationItemVariable
        variables: HashSet<Immutable<QuotationItemVariable>>
    }
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
    | ['saveVariable']

    | ['variable', 'values', 'indent', Indent]
    | ['variable', 'values', 'supplier', Supplier]

    | ['items', 'limit', number]
    | ['items', 'offset', number]
    | ['items', 'page', number]
    | ['items', 'query', Args]
    | ['items', 'variable', 'values', 'indentItem', IndentItem]
    | ['items', 'variable', 'values', 'quantity', number]
    | ['items', 'addVariable']

function Component(props) {

    const quotations = useStore(state => state.variables.Quotation.filter(x => x.variableName.toString() === props.match.params[0]))
    const quotationItems: HashSet<Immutable<QuotationItemVariable>> = useStore(store => store.variables.QuotationItem.filter(x => x.values.quotation.toString() === props.match.params[0]))

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: quotations.length() === 1 ? quotations.toArray()[0] : new QuotationVariable('', { indent: new Indent(''), supplier: new Supplier(''), }),
        items: {
            typeName: 'QuotationItem',
            query: getQuery('QuotationItem'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'indentItem'], ['values', 'quantity']),
            variable: new QuotationItemVariable('', { quotation: new Quotation(''), indentItem: new IndentItem(''), quantity: 0 }),
            variables: props.match.params[0] ? quotationItems : HashSet.of<QuotationItemVariable>()
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
            case 'saveVariable': {
                const [result, symbolFlag, diff] = executeCircuit(circuits.createQuotation, {
                    indent: state.variable.values.indent.toString(),
                    supplier: state.variable.values.supplier.toString(),
                    items: state.items.variables.toArray().map(item => {
                        return {
                            indentItem: item.values.indentItem.toString(),
                            quantity: item.values.quantity
                        }
                    })
                })
                console.log(result, symbolFlag)
                if (symbolFlag) {
                    getState().addDiff(diff)
                }
                break
            }
            case 'variable': {
                switch (action[1]) {
                    case 'values': {
                        switch (action[2]) {
                            case 'indent': {
                                state[action[0]][action[1]][action[2]] = action[3]
                                break
                            }
                            case 'supplier': {
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
                            case 'indentItem': {
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
                        state.items.variables = state.items.variables.add(new QuotationItemVariable('', { quotation: new Quotation(state.items.variable.values.quotation.toString()), indentItem: new IndentItem(state.items.variable.values.indentItem.toString()), quantity: state.items.variable.values.quantity }))
                        state.items.variable = initialState.items.variable
                        break
                    }
                }
                break
            }
        }
    }

    const [state, dispatch] = useImmerReducer<State, Action>(reducer, initialState)

    const indents = useStore(store => store.variables.Indent)
    const suppliers = useStore(store => store.variables.Supplier)
    const items = useStore(store => store.variables.IndentItem.filter(x => x.values.indent.toString() === state.variable.values.indent.toString()))

    const quotation = types['Quotation']
    const item = types['QuotationItem']

    const [addItemDrawer, toggleAddItemDrawer] = useState(false)
    const [itemFilter, toggleItemFilter] = useState(false)

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            default: {
                switch (event.target.name) {
                    case 'indent': {
                        dispatch(['variable', 'values', event.target.name, new Indent(event.target.value)])
                        break
                    }
                    case 'supplier': {
                        dispatch(['variable', 'values', event.target.name, new Supplier(event.target.value)])
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
                    case 'indentItem': {
                        dispatch(['items', 'variable', 'values', event.target.name, new IndentItem(event.target.value)])
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

    return iff(state.mode === 'create' || indents.length() === 1,
        () => {
            return <Container area={none} layout={Grid.layouts.main}>
                <Item area={Grid.header}>
                    <Title>{when(state.mode, {
                        'create': `Create ${quotation.name}`,
                        'update': `Update ${quotation.name}`,
                        'show': `${quotation.name}`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                dispatch(['saveVariable'])
                                props.history.push('/quotations')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        dispatch(['resetVariable', initialState])
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        dispatch(['saveVariable'])
                                        props.history.push('/quotations')
                                    }}>Save</Button>
                                </>,
                                <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{quotation.keys.indent.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.indent.toString()} name='indent'>
                                    <option value='' selected disabled hidden>Select Indent</option>
                                    {indents.toArray().map(x => <option value={x.variableName.toString()}>{x.variableName.toString()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{state.variable.values.indent.toString()}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{quotation.keys.supplier.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.supplier.toString()} name='supplier'>
                                    <option value='' selected disabled hidden>Select Supplier</option>
                                    {suppliers.toArray().map(x => <option value={x.variableName.toString()}>{x.variableName.toString()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{state.variable.values.supplier.toString()}</div>
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
                            <Filter typeName='IndentItem' query={state['items'].query} updateQuery={updateItemsQuery('items')} />
                        </Drawer>
                        <Drawer open={addItemDrawer} onClose={() => toggleAddItemDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add Item</div>
                                <Container area={none} layout={Grid.layouts.uom} className=''>
                                    <Item>
                                        <Label>{item.keys.indentItem.name}</Label>
                                        <Select onChange={onItemInputChange} value={state.items.variable.values.indentItem.toString()} name='indentItem'>
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
