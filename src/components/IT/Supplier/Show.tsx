import React from 'react'
import { Immutable, Draft } from 'immer'
import { useImmerReducer } from 'use-immer'
import tw from 'twin.macro'
import { types } from '../../../main/types'
import { Container, Item, none } from '../../../main/commons'
import { Supplier, SupplierVariable } from '../../../main/variables'
import * as Grid from './grids/Create'
import { withRouter } from 'react-router-dom'
import { circuits } from '../../../main/circuits'
import { executeCircuit } from '../../../main/circuit'
import { getState } from '../../../main/store'
import { useStore } from '../../../main/useStore'
import { useState } from 'react'


type State = Immutable<{
    variable: SupplierVariable
}>

export type Action =
    | ['resetVariable', State]
    | ['saveVariable']

    | ['variable', 'variableName', Supplier]

const initialState: State = {
    variable: new SupplierVariable('', {}),
}

function reducer(state: Draft<State>, action: Action) {
    switch (action[0]) {
        case 'resetVariable': {
            return action[1]
        }
        case 'saveVariable': {
            const [result, symbolFlag, diff] = executeCircuit(circuits.createSupplier, {
                name: state.variable.variableName.toString()
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
            }
            break
        }
    }
}

function Component(props) {
    const [state, dispatch] = useImmerReducer<State, Action>(reducer, initialState)
    const suppliers = useStore(state => state.variables.Supplier.filter(x => x.variableName.toString() === props.match.params[0]))

    const supplier = types['Supplier']
    const [editMode, toggleEditMode] = useState(false)

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        switch (event.target.name) {
            case 'variableName': {
                dispatch(['variable', 'variableName', new Supplier(event.target.value)])
                break
            }
        }
    }
    if (suppliers.length() === 1) {
        if (editMode) {
            return (
                <>
                    <Container area={none} layout={Grid.layouts.main}>
                        <Item area={Grid.header}>
                            <Title>Update{supplier.name}</Title>
                        </Item>
                        <Item area={Grid.button} justify='end' align='center'>
                            <Button onClick={() => {
                                toggleEditMode(!editMode)
                                dispatch(['resetVariable', initialState])
                            }}>Cancel</Button>
                            <Button onClick={async () => {
                                await dispatch(['saveVariable'])
                                props.history.push('/suppliers')
                            }}>Save</Button>
                        </Item>
                        <Container area={Grid.details} layout={Grid.layouts.details}>
                            <Item>
                                <Label>{supplier.name}</Label>
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.variableName.toString()} name='variableName' />
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
                            <Title>Update{supplier.name}</Title>
                        </Item>
                        <Item area={Grid.button} justify='end' align='center'>
                            <Button onClick={() => toggleEditMode(!editMode)}>Edit</Button>
                        </Item>
                        <Container area={Grid.details} layout={Grid.layouts.details}>
                            <Item>
                                <Label>{supplier.name}</Label>
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.variableName.toString()} name='variableName' />
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

const Button = tw.button`bg-gray-900 text-white text-center font-bold p-2 mx-1 uppercase w-40 h-full max-w-sm rounded-lg focus:outline-none inline-block`
