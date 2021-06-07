import React, { useState } from 'react'
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
import { useStore } from '../../../main/store'
import { iff, when } from '../../../main/utils'
import { db } from '../../../main/dexie'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: ProductVariable
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
    | ['saveVariable']

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

function Component(props) {

    const products = useStore(store => store.variables.Product.filter(x => x.variableName.toString() === props.match.params[0]))
    const items: HashSet<Immutable<UOMVariable>> = useStore(store => store.variables.UOM.filter(x => x.values.product.toString() === props.match.params[0]))

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: products.length() === 1 ? products.toArray()[0] : new ProductVariable('', { name: '', orderable: true, consumable: true, producable: false }),
        uoms: {
            typeName: 'UOM',
            query: getQuery('UOM'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'name'], ['values', 'conversionRate']),
            variable: new UOMVariable('', { product: new Product(''), name: '', conversionRate: 1 }),
            variables: props.match.params[0] ? items : HashSet.of<UOMVariable>()
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
                // const [result, symbolFlag, diff] = executeCircuit(circuits.createProduct, {
                //     sku: state.variable.variableName.toString(),
                //     name: state.variable.values.name,
                //     orderable: state.variable.values.orderable,
                //     consumable: state.variable.values.consumable,
                //     producable: state.variable.values.producable,
                //     uoms: state.uoms.variables.toArray().map(uom => {
                //         return {
                //             name: uom.values.name,
                //             conversionRate: uom.values.conversionRate
                //         }
                //     })
                // })
                // console.log(result, symbolFlag)
                // if (symbolFlag) {
                //     getState().addDiff(diff)
                // }
                break
            }
            case 'variable': {
                switch (action[1]) {
                    case 'variableName': {
                        state[action[0]][action[1]] = action[2]
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
        }
    }

    const [state, dispatch] = useImmerReducer<State, Action>(reducer, initialState)

    const product = types['Product']
    const uom = types['UOM']

    const [addUOMDrawer, toggleAddUOMDrawer] = useState(false)
    const [uomFilter, toggleUOMFilter] = useState(false)

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

    return iff(state.mode === 'create' || products.length() === 1,
        () => {
            return <Container area={none} layout={Grid.layouts.main}>
                <Item area={Grid.header}>
                    <Title>{when(state.mode, {
                        'create': `Create ${product.name}`,
                        'update': `Update ${product.name}`,
                        'show': `${product.name}`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await db.products.put(state.variable.toRow())
                                // await dispatch(['saveVariable'])
                                props.history.push('/products')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        dispatch(['resetVariable', initialState])
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await db.products.put(state.variable.toRow())
                                        // await dispatch(['saveVariable'])
                                        props.history.push('/products')
                                    }}>Save</Button>
                                </>,
                                <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{product.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.variableName.toString()} name='variableName' />,
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
                    <Table area={Grid2.table} state={state['uoms']} updatePage={updatePage('uoms')} variables={state.uoms.variables.filter(variable => applyFilter(state['uoms'].query, variable))} columns={state['uoms'].columns.toArray()} />
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
