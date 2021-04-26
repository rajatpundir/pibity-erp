import React from 'react';
import { Draft } from 'immer';
import { useImmerReducer } from "use-immer";
import { State, Action } from './types'
import { isoProduct } from '../../../main/types'
import { H1 } from './styles'
import tw from 'twin.macro'
import { Switch } from "@chakra-ui/react"

const initialState: State = {
    variable: {
        typeName: 'Product',
        variableName: isoProduct.wrap(''),
        values: {
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
            state.variable.variableName = isoProduct.wrap(action.payload)
            return;
        }
    }
}

export default function Product() {
    const [state, dispatch] = useImmerReducer<State, Action>(reducer, initialState)

    const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: 'variableName',
            payload: event.target.value
        })
    }

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        dispatch({
            type: 'reset'
        })
    }

    return (
        <>
            <GridContainer>
                <GridItem>
                    <Label>Product Name</Label>
                    <Input type='text' />
                </GridItem>
                <GridItem>
                    <Label>SKU</Label>
                    <Input type='text' />
                </GridItem>
                <GridItem>
                    <Label>Orderable</Label>
                    <Switch />
                </GridItem>
                <GridItem>
                    <Label>Consumable</Label>
                    <Input type='' />
                </GridItem>
                <GridItem>
                    <Label>Producable</Label>
                    <Input type='radio' />
                </GridItem>
            </GridContainer>
        </>
    )
}

const GridContainer = tw.div`grid grid-cols-3`

const GridItem = tw.div``

const Input = tw.input``

const Label = tw.label`block`

const Toggle = tw.input`sr-only`