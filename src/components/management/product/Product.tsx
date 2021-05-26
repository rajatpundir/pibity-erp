import React, { useState } from 'react'
import { Immutable, Draft } from 'immer'
import { useImmerReducer } from 'use-immer'
import tw from 'twin.macro'
import Switch from '@material-ui/core/Switch'
import { HashSet, Vector } from 'prelude-ts'
import { Drawer } from '@material-ui/core'
import { circuits, executeCircuit } from '../../../main/circuit'
import { getState } from '../../../main/store'
import { types } from '../../../main/types'
import { Container, Item, none } from '../../../main/commons'
import { Table } from '../../../main/Table'
import { Query, Filter, Args, getQuery, updateQuery, applyFilter } from '../../../main/Filter'
import { Product, ProductVariable, UOMVariable } from '../../../main/variables'
import * as Grid from './grids/Product'
import * as Grid2 from './grids/Products'

type State = Immutable<{
    variable: ProductVariable
    uoms: {
        typeName: 'UOM'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<string>
        variable: UOMVariable
        variables: HashSet<UOMVariable>
    }
}>

export type Action =
    | ['resetVariable']
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

const initialState: State = {
    variable: new ProductVariable('', { name: '', orderable: true, consumable: true, producable: false }),
    uoms: {
        typeName: 'UOM',
        query: getQuery('UOM'),
        limit: 5,
        offset: 0,
        page: 1,
        columns: Vector.of('name', 'conversionRate'),
        variable: new UOMVariable('', { product: new Product(''), name: '', conversionRate: 0 }),
        variables: HashSet.of()
    }
}

function reducer(state: Draft<State>, action: Action) {
    switch (action[0]) {
        case 'resetVariable': {
            return initialState
        }
        case 'saveVariable': {
            const [result, symbolFlag, diff] = executeCircuit(circuits.createProduct, {
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
            console.log(result, symbolFlag)
            if (symbolFlag) {
                getState().addDiff(diff)
            }
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

export default function ProductX() {
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

    const updateQuery = (list: 'uoms') => {
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

    return (
        <>
            <Container area={none} layout={Grid.layouts.main}>
                <Item area={Grid.header}>
                    <Title>Create Product</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center'>
                    <Button onClick={() => dispatch(['saveVariable'])}>Save</Button>
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{product.name}</Label>
                        <Input type='text' onChange={onVariableInputChange} value={state.variable.variableName.toString()} name='variableName' />
                    </Item>
                    <Item>
                        <Label>{product.keys.name.name}</Label>
                        <Input type='text' onChange={onVariableInputChange} value={state.variable.values.name} name='name' />
                    </Item>
                    <Item>
                        <InlineLabel>{product.keys.orderable.name}</InlineLabel>
                        <Switch color='primary' onChange={onVariableSwitchChange} checked={state.variable.values.orderable} name='orderable' />
                    </Item>
                    <Item>
                        <InlineLabel>{product.keys.consumable.name}</InlineLabel>
                        <Switch color='primary' onChange={onVariableSwitchChange} checked={state.variable.values.consumable} name='consumable' />
                    </Item>
                    <Item>
                        <InlineLabel>{product.keys.producable.name}</InlineLabel>
                        <Switch color='primary' onChange={onVariableSwitchChange} checked={state.variable.values.producable} name='producable' />
                    </Item>
                </Container>
                <Container area={Grid.uom} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header}>
                        <Title>{uom.name}s</Title>
                    </Item>
                    <Item area={Grid2.filter} justify='end' align='center' className='flex'>
                        <Button onClick={() => toggleAddUOMDrawer(true)}>Add</Button>
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
                        <Button onClick={() => toggleUOMFilter(true)}>Filter</Button>
                        <Drawer open={uomFilter} onClose={() => toggleUOMFilter(false)} anchor={'right'}>
                            <Filter typeName='UOM' query={state['uoms'].query} updateQuery={updateQuery('uoms')} />
                        </Drawer>
                    </Item>
                    <Table area={Grid2.table} state={state['uoms']} updatePage={updatePage('uoms')} variables={state.uoms.variables.filter(variable => applyFilter(state['uoms'].query, variable))} showVariableName={false} columns={state['uoms'].columns} />
                </Container >
            </Container>
        </>
    )
}

const Title = tw.div`py-8 text-4xl text-gray-800 font-bold mx-1 whitespace-nowrap`

const Label = tw.label`w-1/2 whitespace-nowrap`

const InlineLabel = tw.label`inline-block w-1/2 mx-2`

const Input = tw.input`p-1.5 text-gray-500 leading-tight border border-gray-400 shadow-inner hover:border-gray-600 w-full rounded-sm`

const Button = tw.button`bg-gray-900 text-white text-center font-bold p-2 mx-1 uppercase w-40 h-full max-w-sm rounded-lg focus:outline-none inline-block`
