import React from 'react'
import { Immutable, Draft } from 'immer'
import { useImmerReducer } from 'use-immer'
import tw from 'twin.macro'
import { types } from '../../../main/types'
import { Container, Item, none } from '../../../main/commons'
import { TransferMaterialSlipVariable, ProductionPreparationSlip } from '../../../main/variables'
import * as Grid from './grids/Create'
import { withRouter } from 'react-router-dom'

type State = Immutable<{
    variable: TransferMaterialSlipVariable
}>

export type Action =
    | ['resetVariable']
    | ['saveVariable']

    | ['variable', 'values', 'productionPreparationSlip', ProductionPreparationSlip]
    | ['variable', 'values', 'quantity', number]

const initialState: State = {
    variable: new TransferMaterialSlipVariable('', { productionPreparationSlip: new ProductionPreparationSlip(''), quantity: 0, transferred: 0 }),
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

    const transferMaterialSlip = types['TransferMaterialSlip']

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

    return (
        <>
            <Container area={none} layout={Grid.layouts.main}>
                <Item area={Grid.header}>
                    <Title>Create {transferMaterialSlip.name}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center'>
                    <Button onClick={async () => {
                        await dispatch(['saveVariable'])
                        props.history.push('/materials-transferred')
                    }}>Save</Button>
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{transferMaterialSlip.keys.productionPreparationSlip.name}</Label>
                        <Input type='text' onChange={onVariableInputChange} value={state.variable.values.productionPreparationSlip.toString()} name='productionPreparationSlip' />
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

export default withRouter(Component)

const Title = tw.div`py-8 text-4xl text-gray-800 font-bold mx-1 whitespace-nowrap`

const Label = tw.label`w-1/2 whitespace-nowrap`

const Input = tw.input`p-1.5 text-gray-500 leading-tight border border-gray-400 shadow-inner hover:border-gray-600 w-full rounded-sm`

const Button = tw.button`bg-gray-900 text-white text-center font-bold p-2 mx-1 uppercase w-40 h-full max-w-sm rounded-lg focus:outline-none inline-block`
