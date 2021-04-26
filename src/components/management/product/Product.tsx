import React from 'react';
import { Draft } from 'immer';
import { useImmerReducer } from "use-immer";
import { State, Action } from './types'
import { isoProduct } from '../../../main/types'
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
        <div className="font-nunito">
            {/* <G1>
                <G1I1>
                    <Title>Create Product</Title>
                </G1I1>
                <Button>Submit</Button>
            </G1> */}
            <GridContainer>
                <InnerGridContainer>
                    <Label>Product Name</Label>
                    <InnerGridContent>
                        <Input type='text' />
                    </InnerGridContent>
                </InnerGridContainer>
                <InnerGridContainer>
                    <Label>SKU</Label>
                    <InnerGridContent>
                        <Input type='text' />
                    </InnerGridContent>
                </InnerGridContainer>
                <InnerGridContainer>
                    <Label>Orderable</Label>
                    <InnerGridContent>
                        <Switch size="lg" colorScheme="teal" className="focus:border-0" />
                    </InnerGridContent>
                </InnerGridContainer>
                <InnerGridContainer>
                    <Label>Consumable</Label>
                    <InnerGridContent>
                        <Switch size="lg" />
                    </InnerGridContent>
                </InnerGridContainer>
                <InnerGridContainer>
                    <Label>Producable</Label>
                    <InnerGridContent>
                        <Switch size="lg" />
                    </InnerGridContent>
                </InnerGridContainer>
            </GridContainer>
        </div>
    )
}

const Title = tw.div`py-8 text-4xl text-gray-900 font-bold`

const G1 = tw.div`grid grid-cols-8 grid-rows-1 max-h-12
grid-template-areas[]`

const G1I1 = tw.div`col-span-4`

const GridContainer = tw.div`grid grid-cols-1 
md:grid-cols-2 xl:grid-cols-3 
gap-x-6 gap-y-4
text-gray-900 text-xl`

const InnerGridContainer = tw.div`grid grid-cols-3`

const InnerGridContent = tw.div`col-span-2`

const Input = tw.input`p-1.5 rounded-none h-auto text-gray-500 leading-tight border border-gray-400 shadow-inner hover:border-gray-600`

const Label = tw.label``

const Button = tw.button`background-color[black] text-white text-center font-bold p-2 uppercase`
