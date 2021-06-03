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
import { Indent, IndentItemVariable, IndentVariable, Product, UOM, UOMVariable } from '../../../main/variables'
import * as Grid from './grids/Create'
import * as Grid2 from './grids/List'
import { withRouter } from 'react-router-dom'
import { executeCircuit } from '../../../main/circuit'
import { circuits } from '../../../main/circuits'
import { getState } from '../../../main/store'
import { useStore } from '../../../main/useStore'
import { iff, when } from '../../../main/utils'

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
    | ['saveVariable']

    | ['items', 'limit', number]
    | ['items', 'offset', number]
    | ['items', 'page', number]
    | ['items', 'query', Args]
    | ['items', 'variable', 'values', 'product', Product]
    | ['items', 'variable', 'values', 'quantity', number]
    | ['items', 'variable', 'values', 'uom', UOM]
    | ['items', 'addVariable']

function Component(props) {

    const indents = useStore(state => state.variables.Indent.filter(x => x.variableName.toString() === props.match.params[0]))
    const items: HashSet<Immutable<IndentItemVariable>> = useStore(store => store.variables.IndentItem.filter(x => x.values.indent.toString() === props.match.params[0]))
    
    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: indents.length() === 1 ? indents.toArray()[0] : new IndentVariable('', {}),
        items: {
            typeName: 'IndentItem',
            query: getQuery('IndentItem'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'product'], ['values', 'quantity'], ['values', 'uom', 'values', 'name'], ['values', 'ordered'], ['values', 'received'], ['values', 'approved'], ['values', 'rejected'], ['values', 'returned'], ['values', 'requisted'], ['values', 'consumed']),
            variable: new IndentItemVariable('', { indent: new Indent(''), product: new Product(''), quantity: 0, uom: new UOM(''), ordered: 0, received: 0, approved: 0, rejected: 0, returned: 0, requisted: 0, consumed: 0 }),
            variables: items
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
                const [result, symbolFlag, diff] = executeCircuit(circuits.createIndent, {
                    items: state.items.variables.toArray().map(item => {
                        return {
                            product: item.values.product.toString(),
                            quantity: item.values.quantity,
                            item: item.values.uom.toString()
                        }
                    })
                })
                console.log(result, symbolFlag)
                if (symbolFlag) {
                    getState().addDiff(diff)
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
                        }
                        break
                    }
                    case 'addVariable': {
                        state.items.variables = state.items.variables.add(new IndentItemVariable('', { indent: new Indent(state.items.variable.values.indent.toString()), product: new Product(state.items.variable.values.product.toString()), quantity: state.items.variable.values.quantity, uom: new UOM(state.items.variable.values.uom.toString()), ordered: state.items.variable.values.ordered, received: state.items.variable.values.received, approved: state.items.variable.values.approved, rejected: state.items.variable.values.rejected, returned: state.items.variable.values.returned, requisted: state.items.variable.values.requisted, consumed: state.items.variable.values.consumed }))
                        state.items.variable = initialState.items.variable
                        break
                    }
                }
                break
            }
        }
    }

    const [state, dispatch] = useImmerReducer<State, Action>(reducer, initialState)

    const products = useStore(store => store.variables.Product)
    const uoms: HashSet<Immutable<UOMVariable>> = useStore(store => store.variables.UOM.filter(x => x.values.product.toString() === state.items.variable.values.product.toString()))


    const indent = types['Indent']
    const item = types['IndentItem']

    const [addItemDrawer, toggleAddItemDrawer] = useState(false)
    const [itemFilter, toggleItemFilter] = useState(false)

    const onItemInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            default: {
                switch (event.target.name) {
                    case 'product': {
                        dispatch(['items', 'variable', 'values', event.target.name, new Product(event.target.value)])
                        break
                    }
                    case 'quantity': {
                        dispatch(['items', 'variable', 'values', event.target.name, parseInt(event.target.value)])
                        break
                    }
                    case 'uom': {
                        dispatch(['items', 'variable', 'values', event.target.name, new UOM(event.target.value)])
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
                        'create': `Create ${indent.name}`,
                        'update': `Update ${indent.name}`,
                        'show': `${indent.name}`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            undefined,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        dispatch(['resetVariable', initialState])
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await dispatch(['saveVariable'])
                                        props.history.push('/indents')
                                    }}>Save</Button>
                                </>,
                                <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>))
                    }
                </Item>
                <Container area={Grid.uom} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title>{item.name}s</Title>
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
                                        <Label>{item.keys.product.name}</Label>
                                        <Select onChange={onItemInputChange} value={state.items.variable.values.product.toString()} name='product'>
                                            <option value='' selected disabled hidden>Select Product</option>
                                            {products.toArray().map(x => <option value={x.variableName.toString()}>{x.variableName.toString()}</option>)}
                                        </Select>
                                    </Item>
                                    <Item>
                                        <Label>{item.keys.quantity.name}</Label>
                                        <Input type='number' onChange={onItemInputChange} value={state.items.variable.values.quantity} name='quantity' />
                                    </Item>
                                    <Item>
                                        <Label>{item.keys.uom.name}</Label>
                                        <Select onChange={onItemInputChange} value={state.items.variable.values.uom.toString()} name='uom'>
                                            <option value='' selected disabled hidden>Select Item</option>
                                            {uoms.toArray().map(x => <option value={x.variableName.toString()}>{x.values.name}</option>)}
                                        </Select>
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
