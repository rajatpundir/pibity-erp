import React from 'react';
import { Draft } from 'immer';
import { useImmerReducer } from "use-immer";
import { State, Action } from './types'
import { isoProduct } from '../../../main/types'
import tw from 'twin.macro'
import Switch from '@material-ui/core/Switch';
import { GridContainer, GridItem, none } from '../../../main/commons'
import * as Grid1 from './grids/main'
import * as Grid2 from './grids/details'

const initialState: State = {
    variable: {
        typeName: 'Product',
        variableName: isoProduct.wrap(''),
        values: {
            sku: '',
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
                state.variable.values.sku = String(action.payload)
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

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        dispatch({
            type: 'reset'
        })
    }

    return (
        <GridContainer area={none} layout={Grid1.layout} className="bg-gray-100">
            <GridItem area={Grid1.header}>
                <Title className="mx-3">Create Product</Title>
            </GridItem>
            <GridItem area={Grid1.button} className=" justify-self-center">
                <Button>Save</Button>
            </GridItem>
            <GridContainer area={Grid1.details} layout={Grid2.layout}>
                <GridItem area={none}>
                    <Label>Product Name</Label>
                    <Input type='text' onChange={onInputChange} value={isoProduct.unwrap(state.variable.variableName)} name='variableName' />
                </GridItem>
                <GridItem area={none}>
                    <Label>SKU</Label>
                    <Input type='text' onChange={onInputChange} value={state.variable.values.sku} name='sku' />
                </GridItem>
                <GridItem area={none}>
                    <InlineLabel>Orderable</InlineLabel>
                    <Switch color="primary" onChange={onSwitchChange} checked={state.variable.values.orderable} name='orderable' />
                </GridItem>
                <GridItem area={none}>
                    <InlineLabel>Consumable</InlineLabel>
                    <Switch color="primary" onChange={onSwitchChange} checked={state.variable.values.consumable} name='consumable' />
                </GridItem>
                <GridItem area={none}>
                    <InlineLabel>Producable</InlineLabel>
                    <Switch color="primary" onChange={onSwitchChange} checked={state.variable.values.producable} name='producable' />
                </GridItem>
            </GridContainer>
        </GridContainer>
    )
}

const Title = tw.div`py-8 text-4xl text-gray-900 font-bold`

const Label = tw.label`w-1/2`

const InlineLabel = tw.label`inline-block w-1/2`

const Input = tw.input`p-1.5 rounded-none text-gray-500 leading-tight border border-gray-400 shadow-inner hover:border-gray-600 w-full h-auto`

const Button = tw.button`bg-gray-900 text-white text-center font-bold p-2 uppercase w-40 h-full max-w-sm`
