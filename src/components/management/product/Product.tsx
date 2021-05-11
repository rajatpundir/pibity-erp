import React from 'react'
import { Immutable, Draft } from 'immer'
import { useImmerReducer } from "use-immer"
import { isoProduct } from '../../../main/variables'
import { ProductVariable } from '../../../main/variables'
import tw from 'twin.macro'
import Switch from '@material-ui/core/Switch';
import { Container, Item, none } from '../../../main/commons'
import * as Grid from './grids/Product'
import { store, noDiff } from '../../../main/store'
import { Vector } from 'prelude-ts'

type State = Immutable<{
    variable: ProductVariable
}>

export type Action =
    | {
        type: string
        payload?: string | boolean
    }

const initialState: State = {
    variable: {
        typeName: 'Product',
        variableName: isoProduct.wrap(''),
        values: {
            name: '',
            orderable: true,
            consumable: true,
            producable: false
        }
    }
}

function reducer(state: Draft<State>, action: Action) {
    switch (action.type) {
        case 'reset':
            return initialState;
        case 'variableName': {
            if (action.payload != null) {
                state.variable.variableName = isoProduct.wrap(String(action.payload))
            }
            return;
        }
        case 'sku': {
            if (action.payload != null) {
                state.variable.values.name = String(action.payload)
            }
            return;
        }
        case 'orderable': {
            if (action.payload != null) {
                state.variable.values.orderable = Boolean(action.payload)
            }
            return;
        }
        case 'consumable': {
            if (action.payload != null) {
                state.variable.values.consumable = !!action.payload
            }
            return;
        }
        case 'producable': {
            if (action.payload != null) {
                state.variable.values.producable = !!action.payload
            }
            return;
        }
    }
}

export default function Product() {
    const [state, dispatch] = useImmerReducer<State, Action>(reducer, initialState)
    const addDiff = store(state => state.addDiff)
    const onInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: event.target.name,
            payload: String(event.target.value)
        })
    }

    const onSwitchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: event.target.name,
            payload: event.target.checked
        })
    }

    const onSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault()
        addDiff({
            ...noDiff,
            Product: {
                replace: Vector.of(state.variable),
                remove: Vector.of()
            }
        })
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
                    <Input type='text' onChange={onInputChange} value={isoProduct.unwrap(state.variable.variableName)} name='variableName' />
                </Item>
                <Item>
                    <Label>Product Name</Label>
                    <Input type='text' onChange={onInputChange} value={state.variable.values.name} name='sku' />
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
