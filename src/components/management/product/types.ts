import { Immutable, Draft } from 'immer';
import { ProductVariable } from '../../../types'

export type State = Immutable<{
    variable: ProductVariable
}>

export type ResetAction = {
    type: 'reset'
}

export type NameAction = {
    type: 'variableName'
    payload: string
}

export type Action = ResetAction | NameAction
