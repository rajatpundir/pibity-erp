import React from 'react';
import { Draft } from 'immer';
import { useImmerReducer } from "use-immer";
import { State, Action } from './types'
import { isoProduct } from '../../../types'
import * as FormInput from '../../../constants/formInputs'
import { H1 } from './styles'

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
            <H1 fontSize={12} color="orange">Product Name: {state.variable.variableName}</H1>
            <form onSubmit={onSubmit}>
                <input type='number' onChange={onChange}></input>
                <button></button>
            </form>
        </>
    )
}
