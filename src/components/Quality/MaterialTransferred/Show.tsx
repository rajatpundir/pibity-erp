import React, { useState } from 'react'
import { Immutable, Draft } from 'immer'
import { useImmerReducer } from 'use-immer'
import tw from 'twin.macro'
import { types } from '../../../main/types'
import { Container, Item, none } from '../../../main/commons'
import { TransferMaterialSlipVariable, ProductionPreparationSlip } from '../../../main/variables'
import * as Grid from './grids/Show'
import { withRouter } from 'react-router-dom'
import { executeCircuit } from '../../../main/circuit'
import { circuits } from '../../../main/circuits'
import { getState } from '../../../main/store'
import { useStore } from '../../../main/useStore'

type State = Immutable<{
    variable: TransferMaterialSlipVariable
}>

export type Action =
    | ['resetVariable', State]
    | ['saveVariable']

    | ['variable', 'values', 'productionPreparationSlip', ProductionPreparationSlip]
    | ['variable', 'values', 'quantity', number]



const initialState: State = {
    variable: new TransferMaterialSlipVariable('', { productionPreparationSlip: new ProductionPreparationSlip(''), quantity: 0, transferred: 0 }),
}

function reducer(state: Draft<State>, action: Action) {
    switch (action[0]) {
        case 'resetVariable': {
            return action[1]
        }
        case 'saveVariable': {
            const [result, symbolFlag, diff] = executeCircuit(circuits.createTransferMaterialSlip, {
                productionPreparationSlip: state.variable.values.productionPreparationSlip.toString(),
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
                        case 'productionPreparationSlip': {
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

function Component(props) {
    const [state, dispatch] = useImmerReducer<State, Action>(reducer, initialState)
    const transferMaterialSlips = useStore(state => state.variables.TransferMaterialSlip.filter(x => x.variableName.toString() === props.match.params[0]))


    const productionPreparationSlips = useStore(state => state.variables.ProductionPreparationSlip)

    const transferMaterialSlip = types['TransferMaterialSlip']

    const [editMode, toggleEditMode] = useState(false)

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            default: {
                switch (event.target.name) {
                    case 'productionPreparationSlip': {
                        dispatch(['variable', 'values', event.target.name, new ProductionPreparationSlip(event.target.value)])
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

    if (transferMaterialSlips.length() === 1) {
        if (editMode) {
            return (
                <>
                    <Container area={none} layout={Grid.layouts.main}>
                        <Item area={Grid.header}>
                            <Title>Update{transferMaterialSlip.name}</Title>
                        </Item>
                        <Item area={Grid.button} justify='end' align='center'>
                            <Button onClick={async () => {
                                 dispatch(['saveVariable'])
                                props.history.push('/materials-transferred')
                            }}>Save</Button>
                        </Item>
                        <Container area={Grid.details} layout={Grid.layouts.details}>
                            <Item>
                                <Label>{transferMaterialSlip.keys.productionPreparationSlip.name}</Label>
                                <Select onChange={onVariableInputChange} value={state.variable.values.productionPreparationSlip.toString()} name='productionPreparationSlip'>
                                    <option value='' selected disabled hidden>Select Material Production Preparation Slip</option>
                                    {productionPreparationSlips.toArray().map(x => <option value={x.variableName.toString()}>{x.variableName.toString()}</option>)}
                                </Select>
                            </Item>
                            <Item>
                                <Label>{transferMaterialSlip.keys.quantity.name}</Label>
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.quantity} name='quantity' />
                            </Item>
                        </Container>
                    </Container>
                </>
            )
        } else {
            return (
                <>
                    <Container area={none} layout={Grid.layouts.main}>
                        <Item area={Grid.header}>
                            <Title>Update{transferMaterialSlip.name}</Title>
                        </Item>
                        <Item area={Grid.button} justify='end' align='center'>
                            <Button onClick={async () => {
                                 dispatch(['saveVariable'])
                                props.history.push('/materials-transferred')
                            }}>Save</Button>
                        </Item>
                        <Container area={Grid.details} layout={Grid.layouts.details}>
                            <Item>
                                <Label>{transferMaterialSlip.keys.productionPreparationSlip.name}</Label>
                                <Select onChange={onVariableInputChange} value={state.variable.values.productionPreparationSlip.toString()} name='productionPreparationSlip'>
                                    <option value='' selected disabled hidden>Select Material Production Preparation Slip</option>
                                    {productionPreparationSlips.toArray().map(x => <option value={x.variableName.toString()}>{x.variableName.toString()}</option>)}
                                </Select>
                            </Item>
                            <Item>
                                <Label>{transferMaterialSlip.keys.quantity.name}</Label>
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.quantity} name='quantity' />
                            </Item>
                        </Container>
                    </Container>
                </>
            )
        }
    } else {
        return (<div>Variable not found</div>)
    }
}

export default withRouter(Component)

const Title = tw.div`py-8 text-4xl text-gray-800 font-bold mx-1 whitespace-nowrap`

const Label = tw.label`w-1/2 whitespace-nowrap`

const Input = tw.input`p-1.5 text-gray-500 leading-tight border border-gray-400 shadow-inner hover:border-gray-600 w-full rounded-sm`

const Select = tw.select`p-1.5 text-gray-500 leading-tight border border-gray-400 shadow-inner hover:border-gray-600 w-full rounded-sm`

const Button = tw.button`bg-gray-900 text-white text-center font-bold p-2 mx-1 uppercase w-40 h-full max-w-sm rounded-lg focus:outline-none inline-block`
