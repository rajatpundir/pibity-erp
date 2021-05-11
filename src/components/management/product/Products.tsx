import { Immutable, Draft } from 'immer'
import { useImmerReducer } from "use-immer"
import { Container, Item, none } from '../../../main/commons'
import { Table } from '../../../main/Table'
import * as Grid from './grids/Products'
import tw from 'twin.macro'
import { store } from '../../../main/store'
import { Vector } from 'prelude-ts'
import { types, Key } from '../../../main/types'

type State = Immutable<{
    typeName: 'Product'
    query: {}
    limit: number
    offset: number
    page: string
}>

export type Action =
    | {
        type: 'reset' | 'query' | 'limit' | 'offset' | 'page'
        payload: string | number
    }

export type Query = {
    variableName: {
        checked: boolean
        operator: 'equals' | 'like'
        value: string
    }
    | {
        checked: boolean
        operator: 'between' | 'notBetween'
        value: [string, string]
    }
    | {
        checked: boolean
        operator: 'in'
        value: Array<string>
    }
    values: {
        [index: string]: {
            checked: boolean
            type: 'Text'
            operator: 'equals' | 'like'
            value: string
        }
        | {
            checked: boolean
            type: 'Text'
            operator: 'between' | 'notBetween'
            value: [string, string]
        }
        | {
            checked: boolean
            type: 'Text'
            operator: 'in'
            value: Array<string>
        }
        | {
            checked: boolean
            type: 'Number'
            operator: 'equals' | 'greaterThanEquals' | 'greaterThan' | 'lessThanEquals' | 'lessThan'
            value: number
        }
        | {
            checked: boolean
            type: 'Number'
            operator: 'between' | 'notBetween'
            value: [number, number]
        }
        | {
            checked: boolean
            type: 'Number'
            operator: 'in'
            value: Array<number>
        }
        | {
            checked: boolean
            type: 'Decimal'
            operator: 'equals' | 'greaterThanEquals' | 'greaterThan' | 'lessThanEquals' | 'lessThan'
            value: number
        }
        | {
            checked: boolean
            type: 'Decimal'
            operator: 'between' | 'notBetween'
            value: [number, number]
        }
        | {
            checked: boolean
            type: 'Decimal'
            operator: 'in'
            value: Array<number>
        }
        | {
            checked: boolean
            type: 'Boolean'
            operator: 'equals'
            value: boolean
        }
        | {
            checked: boolean
            type: 'Date'
            operator: 'equals' | 'greaterThanEquals' | 'greaterThan' | 'lessThanEquals' | 'lessThan'
            value: number
        }
        | {
            checked: boolean
            type: 'Date'
            operator: 'between' | 'notBetween'
            value: [number, number]
        }
        | {
            checked: boolean
            type: 'Date'
            operator: 'in'
            value: Array<number>
        }
        | {
            checked: boolean
            type: 'Timestamp'
            operator: 'equals' | 'greaterThanEquals' | 'greaterThan' | 'lessThanEquals' | 'lessThan'
            value: number
        }
        | {
            checked: boolean
            type: 'Timestamp'
            operator: 'between' | 'notBetween'
            value: [number, number]
        }
        | {
            checked: boolean
            type: 'Timestamp'
            operator: 'in'
            value: Array<number>
        }
        | {
            checked: boolean
            type: 'Time'
            operator: 'equals' | 'greaterThanEquals' | 'greaterThan' | 'lessThanEquals' | 'lessThan'
            value: number
        }
        | {
            checked: boolean
            type: 'Time'
            operator: 'between' | 'notBetween'
            value: [number, number]
        }
        | {
            checked: boolean
            type: 'Time'
            operator: 'in'
            value: Array<number>
        }
        | {
            checked: boolean
            type: string
            value: Query
        }
    }
}

const initialState: State = {
    typeName: 'Product',
    query: {},
    limit: 5,
    offset: 0,
    page: '1'
}

function reducer(state: Draft<State>, action: Action) {
    switch (action.type) {
        case 'reset':
            return initialState;
        case 'query': {
            if (typeof action.payload == 'object') {
                state.query = action.payload
            }
            return;
        }
        case 'limit': {
            if (typeof action.payload == 'number') {
                state.limit = Math.max(initialState.limit, action.payload)
            }
            return;
        }
        case 'offset': {
            if (typeof action.payload == 'number') {
                state.offset = Math.max(0, action.payload)
                state.page = String(Math.max(0, action.payload) + 1)
            }
            return;
        }
        case 'page': {
            if (typeof action.payload == 'string') {
                state.page = action.payload
            }
            return;
        }
    }
}

export default function Products() {
    const [state, dispatch] = useImmerReducer<State, Action>(reducer, initialState)
    const variables = store(state => state.variables.Product)

    const keys = types['Product'].keys

    const query: Query = {
        variableName: {
            checked: false,
            operator: 'equals',
            value: ''
        },
        values: {}
    }

    const x: Query = Object.keys(keys).reduce((acc: Query, keyName: string) => {
        const key: Key = keys[keyName]
        switch (key.type) {
            case 'Text': {
                acc.values[keyName] = {
                    checked: false,
                    type: key.type,
                    operator: 'equals',
                    value: ''
                }
                return acc
            }
            case 'Number': {
                acc.values[keyName] = {
                    checked: false,
                    type: key.type,
                    operator: 'equals',
                    value: 0
                }
                return acc
            }
            case 'Decimal': {
                acc.values[keyName] = {
                    checked: false,
                    type: key.type,
                    operator: 'equals',
                    value: 0
                }
                return acc
            }
            case 'Boolean': {
                acc.values[keyName] = {
                    checked: false,
                    type: key.type,
                    operator: 'equals',
                    value: false
                }
                return acc
            }
            case 'Date': {
                acc.values[keyName] = {
                    checked: false,
                    type: key.type,
                    operator: 'equals',
                    value: -1
                }
                return acc
            }
            case 'Timestamp': {
                acc.values[keyName] = {
                    checked: false,
                    type: key.type,
                    operator: 'equals',
                    value: -1
                }
                return acc
            }
            case 'Time': {
                acc.values[keyName] = {
                    checked: false,
                    type: key.type,
                    operator: 'equals',
                    value: -1
                }
                return acc
            }
            default: {
                acc.values[keyName] = {
                    checked: false,
                    type: key.type,
                    value: {
                        variableName: {
                            checked: false,
                            operator: 'equals',
                            value: ''
                        },
                        values: {}
                    }
                }
                return acc
            }
        }
    }, query)

    console.log(x)

    const columns: Vector<string> = Vector.of("SKU", "Name", "Orderable", "Consumable", "Producable")
    return (
        <Container area={none} layout={Grid.layouts.main}>
            <Item area={Grid.header}>
                <Title>Products</Title>
            </Item>
            <Table area={Grid.table} state={state} dispatch={dispatch} variables={variables} columns={columns} />
        </Container>
    )
}

const Title = tw.div`py-8 text-4xl text-gray-800 font-bold mx-1`
