import React from 'react'
import { Immutable, Draft } from 'immer'
import { useImmerReducer } from 'use-immer'
import tw from 'twin.macro'
import { types } from '../../../main/types'
import { Container, Item, none } from '../../../main/commons'
import { TransferMaterialSlip, WarehouseAcceptanceSlipVariable } from '../../../main/variables'
import * as Grid from './grids/Show'
import { withRouter } from 'react-router-dom'
import { executeCircuit } from '../../../main/circuit'
import { circuits } from '../../../main/circuits'
import { getState } from '../../../main/store'
import { useStore } from '../../../main/store'
import { iff, when } from '../../../main/utils'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: WarehouseAcceptanceSlipVariable
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
    | ['saveVariable']

    | ['variable', 'values', 'transferMaterialSlip', TransferMaterialSlip]
    | ['variable', 'values', 'quantity', number]


function Component(props) {

    const warehouseAcceptanceSlips = useStore(state => state.variables.WarehouseAcceptanceSlip.filter(x => x.variableName.toString() === props.match.params[0]))


    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: warehouseAcceptanceSlips.length() === 1 ? warehouseAcceptanceSlips.toArray()[0] : new WarehouseAcceptanceSlipVariable('', { transferMaterialSlip: new TransferMaterialSlip(''), quantity: 0 }),
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
                const [result, symbolFlag, diff] = executeCircuit(circuits.createWarehouseAcceptanceSlip, {
                    transferMaterialSlip: state.variable.values.transferMaterialSlip,
                    quantity: state.variable.values.quantity
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
                            case 'transferMaterialSlip': {
                                state[action[0]][action[1]][action[2]] = action[3]
                                break
                            }
                            case 'quantity': {
                                state[action[0]][action[1]][action[2]] = action[3]
                                break
                            }
                        }
                    }
                }
                break
            }
        }
    }

    const [state, dispatch] = useImmerReducer<State, Action>(reducer, initialState)

    const transferMaterialSlips = useStore(store => store.variables.TransferMaterialSlip)

    const warehouseAcceptanceSlip = types['WarehouseAcceptanceSlip']

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            default: {
                switch (event.target.name) {
                    case 'transferMaterialSlip': {
                        dispatch(['variable', 'values', event.target.name, new TransferMaterialSlip(event.target.value)])
                        break
                    }
                    case 'quantity': {
                        dispatch(['variable', 'values', event.target.name, parseInt(event.target.value)])
                        break
                    }
                }
            }
        }
    }

    return iff(state.mode === 'create' || warehouseAcceptanceSlips.length() === 1,
        () => {
            return <Container area={none} layout={Grid.layouts.main}>
                <Item area={Grid.header}>
                    <Title>{when(state.mode, {
                        'create': `Create ${warehouseAcceptanceSlip.name}`,
                        'update': `Update ${warehouseAcceptanceSlip.name}`,
                        'show': `${warehouseAcceptanceSlip.name}`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                dispatch(['saveVariable'])
                                props.history.push('/warehouse-receipts')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        dispatch(['resetVariable', initialState])
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        dispatch(['saveVariable'])
                                        props.history.push('/warehouse-receipts')
                                    }}>Save</Button>
                                </>,
                                <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{warehouseAcceptanceSlip.keys.transferMaterialSlip.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.transferMaterialSlip.toString()} name='transferMaterialSlip'>
                                    <option value='' selected disabled hidden>Select item</option>
                                    {transferMaterialSlips.toArray().map(x => <option value={x.variableName.toString()}>{x.variableName.toString()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{state.variable.values.transferMaterialSlip.toString()}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{warehouseAcceptanceSlip.keys.quantity.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='number' onChange={onVariableInputChange} value={state.variable.values.quantity} name='quantity' />,
                                <div className='font-bold text-xl'>{state.variable.values.quantity.toString()}</div>
                            )
                        }
                    </Item>
                </Container>
            </Container>
        }, <div>Variable not found</div>)
}

export default withRouter(Component)

const Title = tw.div`py-8 text-4xl text-gray-800 font-bold mx-1 whitespace-nowrap`

const Label = tw.label`w-1/2 whitespace-nowrap`

const Input = tw.input`p-1.5 text-gray-500 leading-tight border border-gray-400 shadow-inner hover:border-gray-600 w-full rounded-sm`

const Select = tw.select`p-1.5 text-gray-500 leading-tight border border-gray-400 shadow-inner hover:border-gray-600 w-full rounded-sm`

const Button = tw.button`bg-gray-900 text-white text-center font-bold p-2 mx-1 uppercase w-40 h-full max-w-sm rounded-lg focus:outline-none inline-block`
