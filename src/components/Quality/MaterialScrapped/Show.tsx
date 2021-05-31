import React from 'react'
import { Immutable, Draft } from 'immer'
import { useImmerReducer } from 'use-immer'
import tw from 'twin.macro'
import { types } from '../../../main/types'
import { Container, Item, none } from '../../../main/commons'
import { ScrapMaterialSlipVariable, ProductionPreparationSlip } from '../../../main/variables'
import * as Grid from './grids/Create'
import { withRouter } from 'react-router-dom'
import { executeCircuit } from '../../../main/circuit'
import { circuits } from '../../../main/circuits'
import { getState } from '../../../main/store'
import { useStore } from '../../../main/useStore'

type State = Immutable<{
    variable: ScrapMaterialSlipVariable
}>

export type Action =
    | ['resetVariable']
    | ['saveVariable']

    | ['variable', 'values', 'productionPreparationSlip', ProductionPreparationSlip]
    | ['variable', 'values', 'quantity', number]

    | ['replace', 'variable', ScrapMaterialSlipVariable]

const initialState: State = {
    variable: new ScrapMaterialSlipVariable('', { productionPreparationSlip: new ProductionPreparationSlip(''), quantity: 0 }),
}

function reducer(state: Draft<State>, action: Action) {
    switch (action[0]) {
        case 'resetVariable': {
            return initialState
        }
        case 'saveVariable': {
            const [result, symbolFlag, diff] = executeCircuit(circuits.createScrapMaterialSlip, {
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
    const scrapMaterialSlipVariables= useStore(state => state.variables.ScrapMaterialSlip.filter(x=> x.variableName.toString() === props.match.params[0]))     
    dispatch(['replace', 'variable', scrapMaterialSlipVariables[0]])

    const productionPreparationSlips = useStore(state => state.variables.ProductionPreparationSlip)

    const scrapMaterialSlip = types['ScrapMaterialSlip']

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

    return (
        <>
            <Container area={none} layout={Grid.layouts.main}>
                <Item area={Grid.header}>
                    <Title>Create {scrapMaterialSlip.name}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center'>
                    <Button onClick={async () => {
                        await dispatch(['saveVariable'])
                        props.history.push('/materials-scrapped')
                    }}>Save</Button>
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{scrapMaterialSlip.keys.productionPreparationSlip.name}</Label>
                        <Select onChange={onVariableInputChange} value={state.variable.values.productionPreparationSlip.toString()} name='productionPreparationSlip'>
                            <option value='' selected disabled hidden>Select Material Production Preparation Slip</option>
                            {productionPreparationSlips.toArray().map(x => <option value={x.variableName.toString()}>{x.variableName.toString()}</option>)}
                        </Select>
                    </Item>
                    <Item>
                        <Label>{scrapMaterialSlip.keys.quantity.name}</Label>
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
