import React from 'react'
import { Immutable, Draft } from 'immer'
import { useImmerReducer } from 'use-immer'
import tw from 'twin.macro'
import { types } from '../../../main/types'
import { Container, Item, none } from '../../../main/commons'
import {  WarehouseAcceptanceSlipVariable, TransferMaterialSlip } from '../../../main/variables'
import * as Grid from './grids/Create'
import { withRouter } from 'react-router-dom'
import { executeCircuit } from '../../../main/circuit'
import { circuits } from '../../../main/circuits'
import { getState } from '../../../main/store'
import { useStore } from '../../../main/useStore'

type State = Immutable<{
    variable: WarehouseAcceptanceSlipVariable
}>

export type Action =
    | ['resetVariable']
    | ['saveVariable']

    | ['variable', 'values', 'transferMaterialSlip', TransferMaterialSlip]
    | ['variable', 'values', 'quantity', number]

const initialState: State = {
    variable: new WarehouseAcceptanceSlipVariable('', { transferMaterialSlip: new TransferMaterialSlip(''), quantity: 0 }),
}

function reducer(state: Draft<State>, action: Action) {
    switch (action[0]) {
        case 'resetVariable': {
            return initialState
        }
        case 'saveVariable': {
            const [result, symbolFlag, diff] = executeCircuit(circuits.createWarehouseAcceptanceSlip, {
                transferMaterialSlip: state.variable.values.transferMaterialSlip.toString(),
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

function Component(props) {
    const [state, dispatch] = useImmerReducer<State, Action>(reducer, initialState)

    const transferMaterialSlips = useStore(state => state.variables.TransferMaterialSlip)

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

    return (
        <>
            <Container area={none} layout={Grid.layouts.main}>
                <Item area={Grid.header}>
                    <Title>Create {warehouseAcceptanceSlip.name}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center'>
                    <Button onClick={async () => {
                         dispatch(['saveVariable'])
                        props.history.push('/warehouse-receipts')
                    }}>Save</Button>
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{warehouseAcceptanceSlip.keys.transferMaterialSlip.name}</Label>
                        <Select onChange={onVariableInputChange} value={state.variable.values.transferMaterialSlip.toString()} name='transferMaterialSlip'>
                            <option value='' selected disabled hidden>Select Material Transfer Slip</option>
                            {transferMaterialSlips.toArray().map(x => <option value={x.variableName.toString()}>{x.variableName.toString()}</option>)}
                        </Select>
                    </Item>
                    <Item>
                        <Label>{warehouseAcceptanceSlip.keys.quantity.name}</Label>
                        <Input type='text' onChange={onVariableInputChange} value={state.variable.values.quantity} name='quantity' />
                    </Item>
                </Container>
            </Container>
        </>
    )
}

export default withRouter(Component)

const Title = tw.div`py-8 text-4xl text-gray-800 font-bold mx-1 whitespace-nowrap`

const Label = tw.label`w-1/2 whitespace-nowrap`

const Input = tw.input`p-1.5 text-gray-500 leading-tight border border-gray-400 shadow-inner hover:border-gray-600 w-full rounded-sm`

const Select = tw.select`p-1.5 text-gray-500 leading-tight border border-gray-400 shadow-inner hover:border-gray-600 w-full rounded-sm`

const Button = tw.button`bg-gray-900 text-white text-center font-bold p-2 mx-1 uppercase w-40 h-full max-w-sm rounded-lg focus:outline-none inline-block`
