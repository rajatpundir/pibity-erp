import { Immutable, Draft } from 'immer';
import { ProductVariable } from '../../../main/types'

export type State = Immutable<{
    variable: ProductVariable
}>

export type Action =
    | {
        type: string
        payload?: string | boolean
    }
