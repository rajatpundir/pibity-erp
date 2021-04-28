import React from 'react';
import { Draft } from 'immer';
import { useImmerReducer } from "use-immer";
import { State, Action } from './types'
import { isoProduct } from '../../../main/types'
import tw from 'twin.macro'
import { Switch } from "@chakra-ui/react"
import styled from '@emotion/styled';
import { GridContainer, none } from '../../../main/commons'
import * as Grid1 from './grid'

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
            <GridContainer area={none} layout={Grid1.layout}>
                <Grid1.GridItem area={Grid1.header}>
                    <Button>ABC</Button>
                </Grid1.GridItem>
                <Grid1.GridItem area={Grid1.button}>
                    <Button>DEF</Button>
                </Grid1.GridItem>
                <Grid1.GridItem area={Grid1.details}>
                    <input type='number' defaultValue='234' />
                </Grid1.GridItem>
                <GridContainer area={Grid1.uom} layout={Grid1.layout}>
                    <Something>ZXC</Something>
                    <Grid1.GridItem area={Grid1.header}>
                        <Button>ABC</Button>
                    </Grid1.GridItem>
                    <Grid1.GridItem area={Grid1.button}>
                        <Button>DEF</Button>
                    </Grid1.GridItem>
                    <GridContainer area={Grid1.uom} layout={Grid1.layout}>
                        <Something>ZXC</Something>
                        <Grid1.GridItem area={Grid1.header}>
                            <Button>ABC</Button>
                        </Grid1.GridItem>
                        <Grid1.GridItem area={Grid1.button}>
                            <Button>DEF</Button>
                        </Grid1.GridItem>
                        <GridContainer area={Grid1.uom} layout={Grid1.layout}>
                            <Something>ZXC</Something>
                            <Grid1.GridItem area={Grid1.header}>
                                <Button>ABC</Button>
                            </Grid1.GridItem>
                            <Grid1.GridItem area={Grid1.button}>
                                <Button>DEF</Button>
                            </Grid1.GridItem>
                        </GridContainer>
                    </GridContainer>
                </GridContainer>
            </GridContainer>
        </div>
    )
}

const Something = styled.div`
    height: 5rem;
    background-color: hotpink;
`

const Button = styled.button`
  height: 100%;
  width: 100%;
  background-color: hotpink;
  font-size: 24px;
  border-radius: 4px;
  color: black;
  font-weight: bold;
  &:hover {
    color: white;
  }
`
