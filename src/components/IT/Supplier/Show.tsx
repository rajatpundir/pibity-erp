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
import { iff, when } from '../../../main/utils'


type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: SupplierVariable
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
    | ['saveVariable']

    | ['variable', 'variableName', Supplier]

function Component(props) {
    const suppliers = useStore(store => store.variables.Supplier.filter(x => x.variableName.toString() === props.match.params[0]))

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: suppliers.length() === 1 ? suppliers.toArray()[0] : new SupplierVariable('', {})
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

    const [state, dispatch] = useImmerReducer<State, Action>(reducer, initialState)

    const supplier = types['Supplier']

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        switch (event.target.name) {
            case 'variableName': {
                dispatch(['variable', 'variableName', new Supplier(event.target.value)])
                break
            }
        }
    }

    return iff(state.mode === 'create' || suppliers.length() === 1,
        () => {
            return <Container area={none} layout={Grid.layouts.main}>
                <Item area={Grid.header}>
                    <Title>{when(state.mode, {
                        'create': `Create ${supplier.name}`,
                        'update': `Update ${supplier.name}`,
                        'show': `${supplier.name}`
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
                                        props.history.push('/suppliers')
                                    }}>Save</Button>
                                </>,
                                <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{supplier.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.variableName.toString()} name='variableName' />,
                                <div className='font-bold text-xl'>{state.variable.variableName.toString()}</div>
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

const Button = tw.button`bg-gray-900 text-white text-center font-bold p-2 mx-1 uppercase w-40 h-full max-w-sm rounded-lg focus:outline-none inline-block`
