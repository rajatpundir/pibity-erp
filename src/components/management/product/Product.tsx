import React from 'react'
import { Immutable, Draft } from 'immer'
import { useImmerReducer } from "use-immer"
import tw from 'twin.macro'
import Switch from '@material-ui/core/Switch'
import { Container, Item, none } from '../../../main/commons'
import * as Grid from './grids/Product'
import { getReplaceVariableDiff } from '../../../main/layers'
import { useStore } from '../../../main/useStore'
import { Product, ProductVariable } from '../../../main/variables'

type State = Immutable<{
    variable: ProductVariable
}>

export type Action =
    | ['reset']
    | ['variable', 'variableName', Product]
    | ['variable', 'values', 'name', string]
    | ['variable', 'values', 'orderable', boolean]
    | ['variable', 'values', 'consumable', boolean]
    | ['variable', 'values', 'producable', boolean]

const initialState: State = {
    variable: new ProductVariable('', { name: '', orderable: true, consumable: true, producable: false })
}

function reducer(state: Draft<State>, action: Action) {
    switch (action[0]) {
        case 'reset':
            return initialState;
        case 'variable': {
            switch (action[1]) {
                case 'variableName': {
                    state[action[0]][action[1]] = action[2]
                    return
                }
                case 'values': {
                    switch (action[2]) {
                        case 'name': {
                            state[action[0]][action[1]][action[2]] = action[3]
                            return
                        }
                        case 'orderable':
                        case 'consumable':
                        case 'producable': {
                            state[action[0]][action[1]][action[2]] = action[3]
                            return
                        }
                    }
                }
            }
        }
    }
}

export default function ProductX() {
    const [state, dispatch] = useImmerReducer<State, Action>(reducer, initialState)
    const addDiff = useStore(state => state.addDiff)

    const onInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

    const onSwitchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        switch (event.target.name) {
            case 'orderable':
            case 'consumable':
            case 'producable': {
                dispatch(['variable', 'values', event.target.name, event.target.checked])
                break
            }
        }
    }

    const onSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault()
        addDiff(getReplaceVariableDiff(state.variable))
    }

    return (
        <Container area={none} layout={Grid.layouts.main}>
            <Item area={Grid.header}>
                <Title>Create Product</Title>
            </Item>
            <Item area={Grid.button} justify='end' align='center'>
                <Button onClick={onSubmit}>Save</Button>
            </Item>
            <Container area={Grid.details} layout={Grid.layouts.details}>
                <Item>
                    <Label>SKU</Label>
                    <Input type='text' onChange={onInputChange} value={state.variable.variableName.toString()} name='variableName' />
                </Item>
                <Item>
                    <Label>Product Name</Label>
                    <Input type='text' onChange={onInputChange} value={state.variable.values.name} name='name' />
                </Item>
                <Item>
                    <InlineLabel>Orderable</InlineLabel>
                    <Switch color='primary' onChange={onSwitchChange} checked={state.variable.values.orderable} name='orderable' />
                </Item>
                <Item>
                    <InlineLabel>Consumable</InlineLabel>
                    <Switch color='primary' onChange={onSwitchChange} checked={state.variable.values.consumable} name='consumable' />
                </Item>
                <Item>
                    <InlineLabel>Producable</InlineLabel>
                    <Switch color='primary' onChange={onSwitchChange} checked={state.variable.values.producable} name='producable' />
                </Item>
            </Container>
        </Container>
    )
}

const Title = tw.div`py-8 text-4xl text-gray-800 font-bold mx-1`

const Label = tw.label`w-1/2 whitespace-nowrap`

const InlineLabel = tw.label`inline-block w-1/2 mx-2`

const Input = tw.input`p-1.5 text-gray-500 leading-tight border border-gray-400 shadow-inner hover:border-gray-600 w-full rounded-sm`

const Button = tw.button`bg-gray-900 text-white text-center font-bold p-2 mx-1 uppercase w-40 h-full max-w-sm rounded-lg focus:outline-none`
