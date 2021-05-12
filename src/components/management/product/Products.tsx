import { Immutable, Draft } from 'immer'
import { useImmerReducer } from "use-immer"
import { Container, Item, none, TableContainer, Cell } from '../../../main/commons'
import { Table, Input } from '../../../main/Table'
import * as Grid from './grids/Products'
import tw from 'twin.macro'
import { store } from '../../../main/store'
import { Vector } from 'prelude-ts'
import { types, Key } from '../../../main/types'
import Switch from '@material-ui/core/Switch'
import Checkbox from '@material-ui/core/Checkbox'
import { button } from './grids/Product'

type State = Immutable<{
    typeName: 'Product'
    query: Query
    limit: number
    offset: number
    page: string
}>


export type Action =
    | {
        type: 'reset' | 'limit' | 'offset' | 'page'
        payload: string | number
    }
    | {
        type: 'query'
        payload: Q
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

type Q =
    | ['variableName', 'checked', boolean]
    | ['variableName', 'operator', 'equals' | 'like', string]
    | ['variableName', 'operator', 'between' | 'notBetween', [string, string]]
    | ['variableName', 'operator', 'in', Array<string>]
    | ['variableName', 'equals' | 'like', string]
    | ['variableName', 'between' | 'notBetween', [string, string]]
    | ['variableName', 'in', Array<string>]
    | ['values', string, 'checked', boolean]
    | ['values', string, 'operator', 'equals' | 'like', string]
    | ['values', string, 'operator', 'between' | 'notBetween', [string, string]]
    | ['values', string, 'operator', 'in', Array<string>]
    | ['values', string, 'equals' | 'like', string]
    | ['values', string, 'between' | 'notBetween', [string, string]]
    | ['values', string, 'in', Array<string>]
    | ['values', string, 'operator', 'equals' | 'greaterThanEquals' | 'greaterThan' | 'lessThanEquals' | 'lessThan', number]
    | ['values', string, 'operator', 'between' | 'notBetween', [number, number]]
    | ['values', string, 'operator', 'in', Array<number>]
    | ['values', string, 'equals' | 'greaterThanEquals' | 'greaterThan' | 'lessThanEquals' | 'lessThan', number]
    | ['values', string, 'between' | 'notBetween', [number, number]]
    | ['values', string, 'in', Array<number>]
    | ['values', string, 'equals', boolean]
    | ['values', string, Q]

function updateQuery(query: Query, args: Q) {
    switch (args[0]) {
        case 'variableName': {
            switch (args[1]) {
                case 'checked': {
                    query.variableName.checked = args[2]
                    return
                }
                case 'operator': {
                    query.variableName.operator = args[2]
                    query.variableName.value = args[3]
                    return
                }
                default: {
                    query.variableName.value = args[2]
                    return
                }
            }
        }
        case 'values': {
            if (args[1] in query.values) {
                const value = query.values[args[1]]
                switch (args[2]) {
                    case 'checked': {
                        value.checked = args[3]
                        return
                    }
                    case 'operator': {
                        if ('operator' in value) {
                            value.operator = args[3]
                            value.value = args[4]
                        }
                        return
                    }
                    default: {
                        if ('operator' in value) {
                            if (!Array.isArray(args[2]) && args[3] !== undefined) {
                                value.value = args[3]
                            }
                        } else {
                            if (Array.isArray(args[2])) {
                                updateQuery(value.value, args[2])
                            }
                        }
                    }
                }
            }
            return
        }
    }
}

const initialState: State = {
    typeName: 'Product',
    query: Object.keys(types['Product'].keys).reduce((acc: Query, keyName: string) => {
        const key: Key = types['Product'].keys[keyName]
        switch (key.type) {
            case 'Text': {
                acc.values[keyName] = {
                    checked: false,
                    type: key.type,
                    operator: 'equals',
                    value: 'yy'
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
    }, {
        variableName: {
            checked: true,
            operator: 'equals',
            value: ''
        },
        values: {}
    }),
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
                updateQuery(state.query, action.payload)
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


{/* <Checkbox checked={state.query.variableName.checked}
// onChange={handleChange}
inputProps={{ 'aria-label': 'secondary checkbox' }}/> */}

export default function Products() {
    const [state, dispatch] = useImmerReducer<State, Action>(reducer, initialState)
    const variables = store(state => state.variables.Product)

    const columns: Vector<string> = Vector.of("SKU", "Name", "Orderable", "Consumable", "Producable")
    return (
        <Container area={none} layout={Grid.layouts.main}>
            <TableContainer area={Grid.query}>
                <Cell row="1/2" column="1/2">
                    <Checkbox
                        checked={state.query.variableName.checked}
                        color='primary'
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                        onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                            dispatch({
                                type: 'query',
                                payload: ['variableName', 'checked', event.target.checked]
                            })
                        }}
                    />
                </Cell>
                <Cell row="1/2" column="2/3">SKU</Cell>
                <Cell row="1/2" column="3/4">
                    <select value={state.query.variableName.operator}
                        onChange={async (event) => {
                            switch (event.target.value) {
                                case 'equals':
                                case 'like': {
                                    dispatch({
                                        type: 'query',
                                        payload: ['variableName', 'operator', event.target.value, '']
                                    })
                                    return
                                }
                                case 'between':
                                case 'notBetween': {
                                    dispatch({
                                        type: 'query',
                                        payload: ['variableName', 'operator', event.target.value, ['', '']]
                                    })
                                    return
                                }
                                case 'in': {
                                    dispatch({
                                        type: 'query',
                                        payload: ['variableName', 'operator', event.target.value, ['']]
                                    })
                                    return
                                }
                            }
                        }}
                    >
                        <option value="equals">=</option>
                        <option value="like">LIKE</option>
                        <option value="between">BETWEEN</option>
                        <option value="notBetween">NOT BETWEEN</option>
                        <option value="in">IN</option>
                    </select>
                </Cell>
                <Cell row="1/2" column="4/5">
                    {
                        (() => {
                            const operator = state.query.variableName.operator
                            switch (operator) {
                                case 'equals':
                                case 'like': {
                                    return (<Input value={state.query.variableName.value}
                                        onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                            dispatch({
                                                type: 'query',
                                                payload: ['variableName', operator, event.target.value]
                                            })
                                        }} />)
                                }
                                case 'between':
                                case 'notBetween': {
                                    return (
                                        <>
                                            <Input value={state.query.variableName.value[0]}
                                                onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                    dispatch({
                                                        type: 'query',
                                                        payload: ['variableName', operator, [event.target.value, state.query.variableName.value[1]]]
                                                    })
                                                }} />
                                            <Input value={state.query.variableName.value[1]}
                                                onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                    dispatch({
                                                        type: 'query',
                                                        payload: ['variableName', operator, [state.query.variableName.value[0], event.target.value]]
                                                    })
                                                }} />
                                        </>
                                    )
                                }
                                case 'in': {
                                    if (state.query.variableName.operator == "in") {
                                        const values = state.query.variableName.value
                                        return (<>
                                            {
                                                state.query.variableName.value.map((value, index) => {
                                                    return (
                                                        <Input value={state.query.variableName.value[index]}
                                                            onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                                if (index === 0) {
                                                                    dispatch({
                                                                        type: 'query',
                                                                        payload: ['variableName', operator,
                                                                            [
                                                                                event.target.value,
                                                                                ...values.slice(index + 1, state.query.variableName.value.length)
                                                                            ]]
                                                                    })
                                                                } else if (index === values.length - 1) {
                                                                    dispatch({
                                                                        type: 'query',
                                                                        payload: ['variableName', operator,
                                                                            [...values.slice(0, index),
                                                                            event.target.value
                                                                            ]]
                                                                    })
                                                                } else {
                                                                    dispatch({
                                                                        type: 'query',
                                                                        payload: ['variableName', operator,
                                                                            [...values.slice(0, index),
                                                                            event.target.value,
                                                                            ...values.slice(index + 1, state.query.variableName.value.length)
                                                                            ]]
                                                                    })
                                                                }
                                                            }} />
                                                    )
                                                })
                                            }
                                            <button onClick={async () => {
                                                dispatch({
                                                    type: 'query',
                                                    payload: ['variableName', operator, [...values, '']]
                                                })
                                            }}
                                                className="focus:outline-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                                </svg>
                                            </button>
                                            <button onClick={async () => {
                                                dispatch({
                                                    type: 'query',
                                                    payload: ['variableName', operator, [...values.slice(0, values.length - 1)]]
                                                })
                                            }} className="focus:outline-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                                                </svg>
                                            </button>
                                        </>)
                                    }
                                    return
                                }
                            }
                        })()
                    }
                </Cell>
                {
                    Object.keys(state.query.values).flatMap((keyName, index) => {
                        const value = state.query.values[keyName]
                        if ('operator' in value) {
                            switch (value.type) {
                                case 'Text': {
                                    return (<>
                                        <Cell row={`${index + 2}/${index + 3}`} column="1/2">{value.checked ? 'Yes' : 'No'}</Cell>
                                        <Cell row={`${index + 2}/${index + 3}`} column="2/3">{keyName}</Cell>
                                        <Cell row={`${index + 2}/${index + 3}`} column="3/4">
                                            <select value={value.operator}>
                                                <option value="equals">=</option>
                                                <option value="like">LIKE</option>
                                                <option value="between">BETWEEN</option>
                                                <option value="notBetween">NOT BETWEEN</option>
                                                <option value="in">IN</option>
                                            </select>
                                        </Cell>
                                        <Cell row={`${index + 2}/${index + 3}`} column="4/5">
                                            <Input value={state.query.variableName.value}
                                                onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                    dispatch({
                                                        type: 'query',
                                                        payload: ['variableName', 'equals', event.target.value]
                                                    })
                                                }}
                                            />
                                        </Cell>
                                    </>)
                                }
                                case 'Number': {
                                    return (<>
                                        <Cell row={`${index + 2}/${index + 3}`} column="1/2">{value.checked ? 'Yes' : 'No'}</Cell>
                                        <Cell row={`${index + 2}/${index + 3}`} column="2/3">{keyName}</Cell>
                                        <Cell row={`${index + 2}/${index + 3}`} column="3/4">
                                            <select value={value.operator}>
                                                <option value="lessThan">&#60;</option>
                                                <option value="lessThanEquals">&#8804;</option>
                                                <option value="equals">=</option>
                                                <option value="greaterThanEquals">&#8805;</option>
                                                <option value="greaterThan">&#62;</option>
                                                <option value="between">BETWEEN</option>
                                                <option value="notBetween">NOT BETWEEN</option>
                                                <option value="in">IN</option>
                                            </select>
                                        </Cell>
                                        <Cell row={`${index + 2}/${index + 3}`} column="4/5">
                                            <Input value={state.query.variableName.value}></Input>
                                        </Cell>
                                    </>)
                                }
                                case 'Decimal': {
                                    return (<>
                                        <Cell row={`${index + 2}/${index + 3}`} column="1/2">{value.checked ? 'Yes' : 'No'}</Cell>
                                        <Cell row={`${index + 2}/${index + 3}`} column="2/3">{keyName}</Cell>
                                        <Cell row={`${index + 2}/${index + 3}`} column="3/4">
                                            <select value={value.operator}>
                                                <option value="lessThan">&#60;</option>
                                                <option value="lessThanEquals">&#8804;</option>
                                                <option value="equals">=</option>
                                                <option value="greaterThanEquals">&#8805;</option>
                                                <option value="greaterThan">&#62;</option>
                                                <option value="between">BETWEEN</option>
                                                <option value="notBetween">NOT BETWEEN</option>
                                                <option value="in">IN</option>
                                            </select>
                                        </Cell>
                                        <Cell row={`${index + 2}/${index + 3}`} column="4/5">
                                            <Input value={state.query.variableName.value}></Input>
                                        </Cell>
                                    </>)
                                }
                                case 'Boolean': {
                                    return (<>
                                        <Cell row={`${index + 2}/${index + 3}`} column="1/2">{value.checked ? 'Yes' : 'No'}</Cell>
                                        <Cell row={`${index + 2}/${index + 3}`} column="2/3">{keyName}</Cell>
                                        <Cell row={`${index + 2}/${index + 3}`} column="3/4">
                                            <select value={value.operator}>
                                                <option value="equals">=</option>
                                            </select>
                                        </Cell>
                                        <Cell row={`${index + 2}/${index + 3}`} column="4/5">
                                            <Switch color='primary' checked={value.value} name='producable'
                                                onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                    dispatch({
                                                        type: 'query',
                                                        payload: ['values', keyName, 'equals', event.target.checked]
                                                    })
                                                }} />
                                        </Cell>
                                    </>)
                                }
                                case 'Date': {
                                    return (<>
                                        <Cell row={`${index + 2}/${index + 3}`} column="1/2">{value.checked ? 'Yes' : 'No'}</Cell>
                                        <Cell row={`${index + 2}/${index + 3}`} column="2/3">{keyName}</Cell>
                                        <Cell row={`${index + 2}/${index + 3}`} column="3/4">
                                            <select value={value.operator}>
                                                <option value="lessThan">&#60;</option>
                                                <option value="lessThanEquals">&#8804;</option>
                                                <option value="equals">=</option>
                                                <option value="greaterThanEquals">&#8805;</option>
                                                <option value="greaterThan">&#62;</option>
                                                <option value="between">BETWEEN</option>
                                                <option value="notBetween">NOT BETWEEN</option>
                                                <option value="in">IN</option>
                                            </select>
                                        </Cell>
                                        <Cell row={`${index + 2}/${index + 3}`} column="4/5">
                                            <Input value={state.query.variableName.value}></Input>
                                        </Cell>
                                    </>)
                                }
                                case 'Timestamp': {
                                    return (<>
                                        <Cell row={`${index + 2}/${index + 3}`} column="1/2">{value.checked ? 'Yes' : 'No'}</Cell>
                                        <Cell row={`${index + 2}/${index + 3}`} column="2/3">{keyName}</Cell>
                                        <Cell row={`${index + 2}/${index + 3}`} column="3/4">
                                            <select value={value.operator}>
                                                <option value="lessThan">&#60;</option>
                                                <option value="lessThanEquals">&#8804;</option>
                                                <option value="equals">=</option>
                                                <option value="greaterThanEquals">&#8805;</option>
                                                <option value="greaterThan">&#62;</option>
                                                <option value="between">BETWEEN</option>
                                                <option value="notBetween">NOT BETWEEN</option>
                                                <option value="in">IN</option>
                                            </select>
                                        </Cell>
                                        <Cell row={`${index + 2}/${index + 3}`} column="4/5">
                                            <Input value={state.query.variableName.value}></Input>
                                        </Cell>
                                    </>)
                                }
                                case 'Time': {
                                    return (<>
                                        <Cell row={`${index + 2}/${index + 3}`} column="1/2">{value.checked ? 'Yes' : 'No'}</Cell>
                                        <Cell row={`${index + 2}/${index + 3}`} column="2/3">{keyName}</Cell>
                                        <Cell row={`${index + 2}/${index + 3}`} column="3/4">
                                            <select value={value.operator}>
                                                <option value="lessThan">&#60;</option>
                                                <option value="lessThanEquals">&#8804;</option>
                                                <option value="equals">=</option>
                                                <option value="greaterThanEquals">&#8805;</option>
                                                <option value="greaterThan">&#62;</option>
                                                <option value="between">BETWEEN</option>
                                                <option value="notBetween">NOT BETWEEN</option>
                                                <option value="in">IN</option>
                                            </select>
                                        </Cell>
                                        <Cell row={`${index + 2}/${index + 3}`} column="4/5">
                                            <Input value={state.query.variableName.value}></Input>
                                        </Cell>
                                    </>)
                                }
                            }
                        } else {
                            return
                        }

                    })
                }
            </TableContainer>
            <Item area={Grid.header}>
                <Title>Products</Title>
            </Item>
            <Table area={Grid.table} state={state} dispatch={dispatch} variables={variables} columns={columns} />
        </Container>
    )
}

const Title = tw.div`py-8 text-4xl text-gray-800 font-bold mx-1`

const Button = tw.button`bg-gray-900 text-white text-center font-bold p-2 mx-1 uppercase w-40 h-full max-w-sm rounded-lg focus:outline-none`
