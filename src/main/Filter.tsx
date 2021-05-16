import Checkbox from '@material-ui/core/Checkbox'
import Switch from '@material-ui/core/Switch'
import { toDate } from 'date-fns'
import formatISO from 'date-fns/formatISO'
import getTime from 'date-fns/getTime'
import parse from 'date-fns/parse'
import parseISO from 'date-fns/parseISO'
import { Immutable } from 'immer'
import React from 'react'
import { Area, Cell, TableContainer } from './commons'
import tw from 'twin.macro'
import { evaluateExpression, LispExpression, Symbols } from './lisp'
import { Vector } from 'prelude-ts'
import { getVariableName, Variable } from './variables'
import { Key, types } from './types'

const Input = tw.input`p-1.5 text-gray-500 leading-tight border border-gray-400 shadow-inner hover:border-gray-600 w-full h-6 rounded-sm inline-block`

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

export type Args =
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
    | ['values', string, Args]

export type S = ['values', string, undefined] | ['values', string, S]

function R(x: S, args: Args): ['values', string, Args] {
    if (x[2] === undefined) {
        return ['values', x[1], args]
    } else {
        return ['values', x[1], R(x[2], args)]
    }
}

export function T(parent: S, keyName: string): S {
    if (parent[2] === undefined) {
        return (['values', parent[1], ['values', keyName, undefined]])
    } else {
        return (['values', parent[1], T(parent[2], keyName)])
    }
}

function Y(args: Args, parent?: S): Args {
    return (parent ? R(parent, args) : args)
}

export type Action =
    | {
        type: 'query'
        payload: Args
    }


type FilterProps = {
    area: Area
    query: Immutable<Query>
    dispatch: React.Dispatch<Action>
}

export function Filter(props: FilterProps) {
    return (<TableContainer area={props.area} className="overflow-x-scroll overflow-y-scroll">
        <FilterRows query={props.query} dispatch={props.dispatch} startRow={0} startColumn={0} />
    </TableContainer>)
}

type FilterRowsProps = {
    query: Immutable<Query>
    dispatch: React.Dispatch<Action>
    startRow: number
    startColumn: number
    parent?: S
}

function FilterRows(props: FilterRowsProps) {
    var startRow: number = props.startRow
    var startColumn: number = props.startColumn
    return (<>
        <Cell className="px-1" row={`${startRow + 1}/${startRow + 2}`} column={`${startColumn + 1}/${startColumn + 2}`}>
            <Checkbox className="w-2"
                checked={props.query.variableName.checked}
                color='primary'
                inputProps={{ 'aria-label': 'secondary checkbox' }}
                onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                    props.dispatch({
                        type: 'query',
                        payload: Y(['variableName', 'checked', event.target.checked], props.parent)
                    })
                }}
            />
        </Cell>
        <Cell className="px-1" row={`${startRow + 1}/${startRow + 2}`} column={`${startColumn + 2}/${startColumn + 3}`}>ID</Cell>
        <Cell className="px-1" row={`${startRow + 1}/${startRow + 2}`} column={`${startColumn + 3}/${startColumn + 4}`}>
            {
                props.query.variableName.checked ? <select value={props.query.variableName.operator}
                    onChange={async (event) => {
                        switch (event.target.value) {
                            case 'equals':
                            case 'like': {
                                props.dispatch({
                                    type: 'query',
                                    payload: Y(['variableName', 'operator', event.target.value, ''], props.parent)
                                })
                                return
                            }
                            case 'between':
                            case 'notBetween': {
                                props.dispatch({
                                    type: 'query',
                                    payload: Y(['variableName', 'operator', event.target.value, ['', '']], props.parent)
                                })
                                return
                            }
                            case 'in': {
                                props.dispatch({
                                    type: 'query',
                                    payload: Y(['variableName', 'operator', event.target.value, ['']], props.parent)
                                })
                                return
                            }
                        }
                    }}
                >
                    <option value="equals">equals</option>
                    <option value="between">between</option>
                    <option value="notBetween">not between</option>
                    <option value="in">in</option>
                    <option value="like">regex</option>
                </select> : undefined
            }
        </Cell>
        <Cell className="px-1" row={`${startRow + 1}/${startRow + 2}`} column={`${startColumn + 4}/${startColumn + 5}`}>
            {
                props.query.variableName.checked ?
                    (() => {
                        const operator = props.query.variableName.operator
                        switch (operator) {
                            case 'equals':
                            case 'like': {
                                return (<Input className="m-1" value={props.query.variableName.value}
                                    onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                        props.dispatch({
                                            type: 'query',
                                            payload: Y(['variableName', operator, event.target.value], props.parent)
                                        })
                                    }} />)
                            }
                            case 'between':
                            case 'notBetween': {
                                return (
                                    <div className="flex">
                                        <Input className="m-1"
                                            value={props.query.variableName.value[0]}
                                            onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                props.dispatch({
                                                    type: 'query',
                                                    payload: Y(['variableName', operator, [event.target.value, props.query.variableName.value[1]]], props.parent)
                                                })
                                            }} />
                                        <Input className="m-1"
                                            value={props.query.variableName.value[1]}
                                            onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                props.dispatch({
                                                    type: 'query',
                                                    payload: Y(['variableName', operator, [props.query.variableName.value[0], event.target.value]], props.parent)
                                                })
                                            }} />
                                    </div>
                                )
                            }
                            case 'in': {
                                if (props.query.variableName.operator === "in") {
                                    const values = props.query.variableName.value
                                    return (<div className="flex">
                                        {
                                            props.query.variableName.value.map((_value, index) => {
                                                return (
                                                    <Input className="m-1"
                                                        value={props.query.variableName.value[index]}
                                                        onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                            if (index === 0) {
                                                                props.dispatch({
                                                                    type: 'query',
                                                                    payload: Y(['variableName', operator,
                                                                        [
                                                                            event.target.value,
                                                                            ...values.slice(index + 1, props.query.variableName.value.length)
                                                                        ]], props.parent)
                                                                })
                                                            } else if (index === values.length - 1) {
                                                                props.dispatch({
                                                                    type: 'query',
                                                                    payload: Y(['variableName', operator,
                                                                        [...values.slice(0, index),
                                                                        event.target.value
                                                                        ]], props.parent)
                                                                })
                                                            } else {
                                                                props.dispatch({
                                                                    type: 'query',
                                                                    payload: Y(['variableName', operator,
                                                                        [...values.slice(0, index),
                                                                        event.target.value,
                                                                        ...values.slice(index + 1, props.query.variableName.value.length)
                                                                        ]], props.parent)
                                                                })
                                                            }
                                                        }} />
                                                )
                                            })
                                        }
                                        <button onClick={async () => {
                                            props.dispatch({
                                                type: 'query',
                                                payload: Y(['variableName', operator, [...values, '']], props.parent)
                                            })
                                        }}
                                            className="focus:outline-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                            </svg>
                                        </button>
                                        <button onClick={async () => {
                                            if (values.length !== 1) {
                                                props.dispatch({
                                                    type: 'query',
                                                    payload: Y(['variableName', operator, [...values.slice(0, values.length - 1)]], props.parent)
                                                })
                                            }
                                        }} className="focus:outline-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                                            </svg>
                                        </button>
                                    </div>)
                                }
                                return
                            }
                        }
                    })()
                    : undefined
            }
        </Cell>
        {
            Object.keys(props.query.values).flatMap((keyName, index) => {
                const value = props.query.values[keyName]
                if ('operator' in value) {
                    switch (value.type) {
                        case 'Text': {
                            return (<>
                                <Cell className="px-1" row={`${startRow + index + 2}/${startRow + index + 3}`} column={`${startColumn + 1}/${startColumn + 2}`}>
                                    <Checkbox className="w-2"
                                        checked={value.checked}
                                        color='primary'
                                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                                        onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                            props.dispatch({
                                                type: 'query',
                                                payload: Y(['values', keyName, 'checked', event.target.checked], props.parent)
                                            })
                                        }}
                                    />
                                </Cell>
                                <Cell className="px-1" row={`${startRow + index + 2}/${startRow + index + 3}`} column={`${startColumn + 2}/${startColumn + 3}`}>{keyName}</Cell>
                                <Cell className="px-1" row={`${startRow + index + 2}/${startRow + index + 3}`} column={`${startColumn + 3}/${startColumn + 4}`}>
                                    {
                                        value.checked ? <select value={value.operator}
                                            onChange={async (event) => {
                                                switch (event.target.value) {
                                                    case 'equals':
                                                    case 'like': {
                                                        props.dispatch({
                                                            type: 'query',
                                                            payload: Y(['values', keyName, 'operator', event.target.value, ''], props.parent)
                                                        })
                                                        return
                                                    }
                                                    case 'between':
                                                    case 'notBetween': {
                                                        props.dispatch({
                                                            type: 'query',
                                                            payload: Y(['values', keyName, 'operator', event.target.value, ['', '']], props.parent)
                                                        })
                                                        return
                                                    }
                                                    case 'in': {
                                                        props.dispatch({
                                                            type: 'query',
                                                            payload: Y(['values', keyName, 'operator', event.target.value, ['']], props.parent)
                                                        })
                                                        return
                                                    }
                                                }
                                            }}
                                        >
                                            <option value="equals">equals</option>
                                            <option value="between">between</option>
                                            <option value="notBetween">not between</option>
                                            <option value="in">in</option>
                                            <option value="like">regex</option>
                                        </select> : undefined
                                    }
                                </Cell>
                                <Cell className="px-1" row={`${startRow + index + 2}/${startRow + index + 3}`} column={`${startColumn + 4}/${startColumn + 5}`}>
                                    {
                                        value.checked ? (() => {
                                            const operator = value.operator
                                            switch (operator) {
                                                case 'equals':
                                                case 'like': {
                                                    return (<Input className="m-1" value={value.value}
                                                        onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                            props.dispatch({
                                                                type: 'query',
                                                                payload: Y(['values', keyName, operator, event.target.value], props.parent)
                                                            })
                                                        }} />)
                                                }
                                                case 'between':
                                                case 'notBetween': {
                                                    return (
                                                        <div className="flex">
                                                            <Input className="m-1" value={value.value[0]}
                                                                onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                                    props.dispatch({
                                                                        type: 'query',
                                                                        payload: Y(['values', keyName, operator, [event.target.value, value.value[1]]], props.parent)
                                                                    })
                                                                }} />
                                                            <Input className="m-1" value={value.value[1]}
                                                                onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                                    props.dispatch({
                                                                        type: 'query',
                                                                        payload: Y(['values', keyName, operator, [value.value[0], event.target.value]], props.parent)
                                                                    })
                                                                }} />
                                                        </div>
                                                    )
                                                }
                                                case 'in': {
                                                    if (value.operator === "in") {
                                                        const values = value.value
                                                        return (<div className="flex">
                                                            {
                                                                value.value.map((_v, index) => {
                                                                    return (
                                                                        <Input className="m-1" value={values[index]}
                                                                            onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                                                if (index === 0) {
                                                                                    props.dispatch({
                                                                                        type: 'query',
                                                                                        payload: Y(['values', keyName, operator,
                                                                                            [
                                                                                                event.target.value,
                                                                                                ...values.slice(index + 1, values.length)
                                                                                            ]], props.parent)
                                                                                    })
                                                                                } else if (index === values.length - 1) {
                                                                                    props.dispatch({
                                                                                        type: 'query',
                                                                                        payload: Y(['values', keyName, operator,
                                                                                            [...values.slice(0, index),
                                                                                            event.target.value
                                                                                            ]], props.parent)
                                                                                    })
                                                                                } else {
                                                                                    props.dispatch({
                                                                                        type: 'query',
                                                                                        payload: Y(['values', keyName, operator,
                                                                                            [...values.slice(0, index),
                                                                                            event.target.value,
                                                                                            ...values.slice(index + 1, values.length)
                                                                                            ]], props.parent)
                                                                                    })
                                                                                }
                                                                            }} />
                                                                    )
                                                                })
                                                            }
                                                            <button onClick={async () => {
                                                                props.dispatch({
                                                                    type: 'query',
                                                                    payload: Y(['values', keyName, operator, [...values, '']], props.parent)
                                                                })
                                                            }}
                                                                className="focus:outline-none">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                                                </svg>
                                                            </button>
                                                            <button onClick={async () => {
                                                                if (values.length !== 1) {
                                                                    props.dispatch({
                                                                        type: 'query',
                                                                        payload: Y(['values', keyName, operator, [...values.slice(0, values.length - 1)]], props.parent)
                                                                    })
                                                                }
                                                            }} className="focus:outline-none">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                                                                </svg>
                                                            </button>
                                                        </div>)
                                                    }
                                                    return
                                                }
                                            }
                                        })() : undefined
                                    }
                                </Cell>
                            </>)
                        }
                        case 'Number': {
                            return (<>
                                <Cell className="px-1" row={`${startRow + index + 2}/${startRow + index + 3}`} column={`${startColumn + 1}/${startColumn + 2}`}>
                                    <Checkbox className="w-2"
                                        checked={value.checked}
                                        color='primary'
                                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                                        onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                            props.dispatch({
                                                type: 'query',
                                                payload: Y(['values', keyName, 'checked', event.target.checked], props.parent)
                                            })
                                        }}
                                    />
                                </Cell>
                                <Cell className="px-1" row={`${startRow + index + 2}/${startRow + index + 3}`} column={`${startColumn + 2}/${startColumn + 3}`}>{keyName}</Cell>
                                <Cell className="px-1" row={`${startRow + index + 2}/${startRow + index + 3}`} column={`${startColumn + 3}/${startColumn + 4}`}>
                                    {
                                        value.checked ? <select value={value.operator}
                                            onChange={async (event) => {
                                                switch (event.target.value) {
                                                    case 'lessThan':
                                                    case 'lessThanEquals':
                                                    case 'equals':
                                                    case 'greaterThanEquals':
                                                    case 'greaterThan': {
                                                        props.dispatch({
                                                            type: 'query',
                                                            payload: Y(['values', keyName, 'operator', event.target.value, 0], props.parent)
                                                        })
                                                        return
                                                    }
                                                    case 'between':
                                                    case 'notBetween': {
                                                        props.dispatch({
                                                            type: 'query',
                                                            payload: Y(['values', keyName, 'operator', event.target.value, [0, 0]], props.parent)
                                                        })
                                                        return
                                                    }
                                                    case 'in': {
                                                        props.dispatch({
                                                            type: 'query',
                                                            payload: Y(['values', keyName, 'operator', event.target.value, [0]], props.parent)
                                                        })
                                                        return
                                                    }
                                                }
                                            }}
                                        >
                                            <option value="equals">equals</option>
                                            <option value="greaterThanEquals">greater than equals</option>
                                            <option value="lessThanEquals">less than equals</option>
                                            <option value="greaterThan">greater than</option>
                                            <option value="lessThan">less than</option>
                                            <option value="between">between</option>
                                            <option value="notBetween">not between</option>
                                            <option value="in">in</option>
                                        </select> : undefined
                                    }
                                </Cell>
                                <Cell className="px-1" row={`${startRow + index + 2}/${startRow + index + 3}`} column={`${startColumn + 4}/${startColumn + 5}`}>
                                    {
                                        value.checked ? (() => {
                                            const operator = value.operator
                                            switch (operator) {
                                                case 'lessThan':
                                                case 'lessThanEquals':
                                                case 'equals':
                                                case 'greaterThanEquals':
                                                case 'greaterThan': {
                                                    return (<Input className="m-1" type='number' value={value.value as number}
                                                        onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                            props.dispatch({
                                                                type: 'query',
                                                                payload: Y(['values', keyName, operator, parseInt(event.target.value)], props.parent)
                                                            })
                                                        }} />)
                                                }
                                                case 'between':
                                                case 'notBetween': {
                                                    return (
                                                        <div className="flex">
                                                            <Input className="m-1" type='number' value={value.value[0]}
                                                                onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                                    props.dispatch({
                                                                        type: 'query',
                                                                        payload: Y(['values', keyName, operator, [parseInt(event.target.value), value.value[1]]], props.parent)
                                                                    })
                                                                }} />
                                                            <Input className="m-1" type='number' value={value.value[1]}
                                                                onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                                    props.dispatch({
                                                                        type: 'query',
                                                                        payload: Y(['values', keyName, operator, [value.value[0], parseInt(event.target.value)]], props.parent)
                                                                    })
                                                                }} />
                                                        </div>
                                                    )
                                                }
                                                case 'in': {
                                                    if (value.operator === "in") {
                                                        const values = value.value
                                                        return (<div className="flex">
                                                            {
                                                                value.value.map((_v, index) => {
                                                                    return (
                                                                        <Input className="m-1" type='number' value={values[index]}
                                                                            onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                                                if (index === 0) {
                                                                                    props.dispatch({
                                                                                        type: 'query',
                                                                                        payload: Y(['values', keyName, operator,
                                                                                            [
                                                                                                parseInt(event.target.value),
                                                                                                ...values.slice(index + 1, values.length)
                                                                                            ]], props.parent)
                                                                                    })
                                                                                } else if (index === values.length - 1) {
                                                                                    props.dispatch({
                                                                                        type: 'query',
                                                                                        payload: Y(['values', keyName, operator,
                                                                                            [...values.slice(0, index),
                                                                                            parseInt(event.target.value)
                                                                                            ]], props.parent)
                                                                                    })
                                                                                } else {
                                                                                    props.dispatch({
                                                                                        type: 'query',
                                                                                        payload: Y(['values', keyName, operator,
                                                                                            [...values.slice(0, index),
                                                                                            parseInt(event.target.value),
                                                                                            ...values.slice(index + 1, values.length)
                                                                                            ]], props.parent)
                                                                                    })
                                                                                }
                                                                            }} />
                                                                    )
                                                                })
                                                            }
                                                            <button onClick={async () => {
                                                                props.dispatch({
                                                                    type: 'query',
                                                                    payload: Y(['values', keyName, operator, [...values, 0]], props.parent)
                                                                })
                                                            }}
                                                                className="focus:outline-none">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                                                </svg>
                                                            </button>
                                                            <button onClick={async () => {
                                                                if (values.length !== 1) {
                                                                    props.dispatch({
                                                                        type: 'query',
                                                                        payload: Y(['values', keyName, operator, [...values.slice(0, values.length - 1)]], props.parent)
                                                                    })
                                                                }
                                                            }} className="focus:outline-none">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                                                                </svg>
                                                            </button>
                                                        </div>)
                                                    }
                                                    return
                                                }
                                            }
                                        })() : undefined
                                    }
                                </Cell>
                            </>)
                        }
                        case 'Decimal': {
                            return (<>
                                <Cell className="px-1" row={`${startRow + index + 2}/${startRow + index + 3}`} column={`${startColumn + 1}/${startColumn + 2}`}>
                                    <Checkbox className="w-2"
                                        checked={value.checked}
                                        color='primary'
                                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                                        onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                            props.dispatch({
                                                type: 'query',
                                                payload: Y(['values', keyName, 'checked', event.target.checked], props.parent)
                                            })
                                        }}
                                    />
                                </Cell>
                                <Cell className="px-1" row={`${startRow + index + 2}/${startRow + index + 3}`} column={`${startColumn + 2}/${startColumn + 3}`}>{keyName}</Cell>
                                <Cell className="px-1" row={`${startRow + index + 2}/${startRow + index + 3}`} column={`${startColumn + 3}/${startColumn + 4}`}>
                                    {
                                        value.checked ? <select value={value.operator}
                                            onChange={async (event) => {
                                                switch (event.target.value) {
                                                    case 'lessThan':
                                                    case 'lessThanEquals':
                                                    case 'equals':
                                                    case 'greaterThanEquals':
                                                    case 'greaterThan': {
                                                        props.dispatch({
                                                            type: 'query',
                                                            payload: Y(['values', keyName, 'operator', event.target.value, 0], props.parent)
                                                        })
                                                        return
                                                    }
                                                    case 'between':
                                                    case 'notBetween': {
                                                        props.dispatch({
                                                            type: 'query',
                                                            payload: Y(['values', keyName, 'operator', event.target.value, [0, 0]], props.parent)
                                                        })
                                                        return
                                                    }
                                                    case 'in': {
                                                        props.dispatch({
                                                            type: 'query',
                                                            payload: Y(['values', keyName, 'operator', event.target.value, [0]], props.parent)
                                                        })
                                                        return
                                                    }
                                                }
                                            }}
                                        >
                                            <option value="equals">equals</option>
                                            <option value="greaterThanEquals">greater than equals</option>
                                            <option value="lessThanEquals">less than equals</option>
                                            <option value="greaterThan">greater than</option>
                                            <option value="lessThan">less than</option>
                                            <option value="between">between</option>
                                            <option value="notBetween">not between</option>
                                            <option value="in">in</option>
                                        </select> : undefined
                                    }
                                </Cell>
                                <Cell className="px-1" row={`${startRow + index + 2}/${startRow + index + 3}`} column={`${startColumn + 4}/${startColumn + 5}`}>
                                    {
                                        value.checked ? (() => {
                                            const operator = value.operator
                                            switch (operator) {
                                                case 'lessThan':
                                                case 'lessThanEquals':
                                                case 'equals':
                                                case 'greaterThanEquals':
                                                case 'greaterThan': {
                                                    return (<Input className="m-1" type='number' value={value.value as number}
                                                        onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                            props.dispatch({
                                                                type: 'query',
                                                                payload: Y(['values', keyName, operator, parseFloat(event.target.value)], props.parent)
                                                            })
                                                        }} />)
                                                }
                                                case 'between':
                                                case 'notBetween': {
                                                    return (
                                                        <div className="flex">
                                                            <Input className="m-1" type='number' value={value.value[0]}
                                                                onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                                    props.dispatch({
                                                                        type: 'query',
                                                                        payload: Y(['values', keyName, operator, [parseFloat(event.target.value), value.value[1]]], props.parent)
                                                                    })
                                                                }} />
                                                            <Input className="m-1" type='number' value={value.value[1]}
                                                                onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                                    props.dispatch({
                                                                        type: 'query',
                                                                        payload: Y(['values', keyName, operator, [value.value[0], parseFloat(event.target.value)]], props.parent)
                                                                    })
                                                                }} />
                                                        </div>
                                                    )
                                                }
                                                case 'in': {
                                                    if (value.operator === "in") {
                                                        const values = value.value
                                                        return (<div className="flex">
                                                            {
                                                                value.value.map((_v, index) => {
                                                                    return (
                                                                        <Input className="m-1" type='number' value={values[index]}
                                                                            onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                                                if (index === 0) {
                                                                                    props.dispatch({
                                                                                        type: 'query',
                                                                                        payload: Y(['values', keyName, operator,
                                                                                            [
                                                                                                parseFloat(event.target.value),
                                                                                                ...values.slice(index + 1, values.length)
                                                                                            ]], props.parent)
                                                                                    })
                                                                                } else if (index === values.length - 1) {
                                                                                    props.dispatch({
                                                                                        type: 'query',
                                                                                        payload: Y(['values', keyName, operator,
                                                                                            [...values.slice(0, index),
                                                                                            Number(event.target.value)
                                                                                            ]], props.parent)
                                                                                    })
                                                                                } else {
                                                                                    props.dispatch({
                                                                                        type: 'query',
                                                                                        payload: Y(['values', keyName, operator,
                                                                                            [...values.slice(0, index),
                                                                                            Number(event.target.value),
                                                                                            ...values.slice(index + 1, values.length)
                                                                                            ]], props.parent)
                                                                                    })
                                                                                }
                                                                            }} />
                                                                    )
                                                                })
                                                            }
                                                            <button onClick={async () => {
                                                                props.dispatch({
                                                                    type: 'query',
                                                                    payload: Y(['values', keyName, operator, [...values, 0]], props.parent)
                                                                })
                                                            }}
                                                                className="focus:outline-none">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                                                </svg>
                                                            </button>
                                                            <button onClick={async () => {
                                                                if (values.length !== 1) {
                                                                    props.dispatch({
                                                                        type: 'query',
                                                                        payload: Y(['values', keyName, operator, [...values.slice(0, values.length - 1)]], props.parent)
                                                                    })
                                                                }
                                                            }} className="focus:outline-none">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                                                                </svg>
                                                            </button>
                                                        </div>)
                                                    }
                                                    return
                                                }
                                            }
                                        })() : undefined
                                    }
                                </Cell>
                            </>)
                        }
                        case 'Boolean': {
                            return (<>
                                <Cell className="px-1" row={`${startRow + index + 2}/${startRow + index + 3}`} column={`${startColumn + 1}/${startColumn + 2}`}>
                                    <Checkbox className="w-2"
                                        checked={value.checked}
                                        color='primary'
                                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                                        onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                            props.dispatch({
                                                type: 'query',
                                                payload: Y(['values', keyName, 'checked', event.target.checked], props.parent)
                                            })
                                        }}
                                    />
                                </Cell>
                                <Cell className="px-1" row={`${startRow + index + 2}/${startRow + index + 3}`} column={`${startColumn + 2}/${startColumn + 3}`}>{keyName}</Cell>
                                <Cell className="px-1" row={`${startRow + index + 2}/${startRow + index + 3}`} column={`${startColumn + 3}/${startColumn + 4}`}>
                                    {
                                        value.checked ? <select defaultValue={value.operator}>
                                            <option value="equals">equals</option>
                                        </select> : undefined
                                    }
                                </Cell>
                                <Cell className="px-1" row={`${startRow + index + 2}/${startRow + index + 3}`} column={`${startColumn + 4}/${startColumn + 5}`}>
                                    {
                                        value.checked ? <Switch color='primary' checked={value.value} name='producable'
                                            onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                props.dispatch({
                                                    type: 'query',
                                                    payload: Y(['values', keyName, 'equals', event.target.checked], props.parent)
                                                })
                                            }} /> : undefined
                                    }
                                </Cell>
                            </>)
                        }
                        case 'Date': {
                            return (<>
                                <Cell className="px-1" row={`${startRow + index + 2}/${startRow + index + 3}`} column={`${startColumn + 1}/${startColumn + 2}`}>
                                    <Checkbox className="w-2"
                                        checked={value.checked}
                                        color='primary'
                                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                                        onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                            props.dispatch({
                                                type: 'query',
                                                payload: Y(['values', keyName, 'checked', event.target.checked], props.parent)
                                            })
                                        }}
                                    />
                                </Cell>
                                <Cell className="px-1" row={`${startRow + index + 2}/${startRow + index + 3}`} column={`${startColumn + 2}/${startColumn + 3}`}>{keyName}</Cell>
                                <Cell className="px-1" row={`${startRow + index + 2}/${startRow + index + 3}`} column={`${startColumn + 3}/${startColumn + 4}`}>
                                    {
                                        value.checked ? <select value={value.operator}
                                            onChange={async (event) => {
                                                switch (event.target.value) {
                                                    case 'lessThan':
                                                    case 'lessThanEquals':
                                                    case 'equals':
                                                    case 'greaterThanEquals':
                                                    case 'greaterThan': {
                                                        props.dispatch({
                                                            type: 'query',
                                                            payload: Y(['values', keyName, 'operator', event.target.value, Date.now()], props.parent)
                                                        })
                                                        return
                                                    }
                                                    case 'between':
                                                    case 'notBetween': {
                                                        props.dispatch({
                                                            type: 'query',
                                                            payload: Y(['values', keyName, 'operator', event.target.value,
                                                                [new Date(new Date().setDate(new Date().getDate() - (new Date().getDay() === 6 ? 5 : (new Date().getDay() === 0 ? 6 : (new Date().getDay() === 1 ? 7 : 1))))).setHours(0, 0, 0), Date.now()]])
                                                        })
                                                        return
                                                    }
                                                    case 'in': {
                                                        props.dispatch({
                                                            type: 'query',
                                                            payload: Y(['values', keyName, 'operator', event.target.value, [Date.now()]], props.parent)
                                                        })
                                                        return
                                                    }
                                                }
                                            }}
                                        >
                                            <option value="equals">equals</option>
                                            <option value="greaterThanEquals">greater than equals</option>
                                            <option value="lessThanEquals">less than equals</option>
                                            <option value="greaterThan">greater than</option>
                                            <option value="lessThan">less than</option>
                                            <option value="between">between</option>
                                            <option value="notBetween">not between</option>
                                            <option value="in">in</option>
                                        </select> : undefined
                                    }
                                </Cell>
                                <Cell className="px-1" row={`${startRow + index + 2}/${startRow + index + 3}`} column={`${startColumn + 4}/${startColumn + 5}`}>
                                    {
                                        value.checked ? (() => {
                                            const operator = value.operator
                                            switch (operator) {
                                                case 'lessThan':
                                                case 'lessThanEquals':
                                                case 'equals':
                                                case 'greaterThanEquals':
                                                case 'greaterThan': {
                                                    return (<Input className="m-1" type="date"
                                                        value={formatISO(toDate(value.value as number)).substr(0, 10)}
                                                        onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                            props.dispatch({
                                                                type: 'query',
                                                                payload: Y(['values', keyName, operator, getTime(parseISO(event.target.value))], props.parent)
                                                            })
                                                        }}
                                                    />)
                                                }
                                                case 'between':
                                                case 'notBetween': {
                                                    return (
                                                        <div className="flex">
                                                            <Input className="m-1" type="date"
                                                                value={formatISO(toDate(value.value[0])).substr(0, 10)}
                                                                onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                                    props.dispatch({
                                                                        type: 'query',
                                                                        payload: Y(['values', keyName, operator, [getTime(parseISO(event.target.value)), value.value[1]]], props.parent)
                                                                    })
                                                                }} />
                                                            <Input className="m-1" type="date"
                                                                value={formatISO(toDate(value.value[1])).substr(0, 10)}
                                                                onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                                    props.dispatch({
                                                                        type: 'query',
                                                                        payload: Y(['values', keyName, operator, [value.value[0], getTime(parseISO(event.target.value))]], props.parent)
                                                                    })
                                                                }} />
                                                        </div>
                                                    )
                                                }
                                                case 'in': {
                                                    if (value.operator === "in") {
                                                        const values = value.value
                                                        return (<div className="flex">
                                                            {
                                                                value.value.map((_v, index) => {
                                                                    return (
                                                                        <Input className="m-1" type="date"
                                                                            value={formatISO(toDate(values[index])).substr(0, 10)}
                                                                            onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                                                if (index === 0) {
                                                                                    props.dispatch({
                                                                                        type: 'query',
                                                                                        payload: Y(['values', keyName, operator,
                                                                                            [
                                                                                                getTime(parseISO(event.target.value)),
                                                                                                ...values.slice(index + 1, values.length)
                                                                                            ]], props.parent)
                                                                                    })
                                                                                } else if (index === values.length - 1) {
                                                                                    props.dispatch({
                                                                                        type: 'query',
                                                                                        payload: Y(['values', keyName, operator,
                                                                                            [...values.slice(0, index),
                                                                                            getTime(parseISO(event.target.value))
                                                                                            ]], props.parent)
                                                                                    })
                                                                                } else {
                                                                                    props.dispatch({
                                                                                        type: 'query',
                                                                                        payload: Y(['values', keyName, operator,
                                                                                            [...values.slice(0, index),
                                                                                            getTime(parseISO(event.target.value)),
                                                                                            ...values.slice(index + 1, values.length)
                                                                                            ]], props.parent)
                                                                                    })
                                                                                }
                                                                            }} />
                                                                    )
                                                                })
                                                            }
                                                            <button onClick={async () => {
                                                                props.dispatch({
                                                                    type: 'query',
                                                                    payload: Y(['values', keyName, operator, [...values, getTime(new Date())]], props.parent)
                                                                })
                                                            }}
                                                                className="focus:outline-none">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                                                </svg>
                                                            </button>
                                                            <button onClick={async () => {
                                                                if (values.length !== 1) {
                                                                    props.dispatch({
                                                                        type: 'query',
                                                                        payload: Y(['values', keyName, operator, [...values.slice(0, values.length - 1)]], props.parent)
                                                                    })
                                                                }
                                                            }} className="focus:outline-none">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                                                                </svg>
                                                            </button>
                                                        </div>)
                                                    }
                                                    return
                                                }
                                            }
                                        })() : undefined
                                    }
                                </Cell>
                            </>)
                        }
                        case 'Timestamp': {
                            return (<>
                                <Cell className="px-1" row={`${startRow + index + 2}/${startRow + index + 3}`} column={`${startColumn + 1}/${startColumn + 2}`}>
                                    <Checkbox className="w-2"
                                        checked={value.checked}
                                        color='primary'
                                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                                        onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                            props.dispatch({
                                                type: 'query',
                                                payload: Y(['values', keyName, 'checked', event.target.checked], props.parent)
                                            })
                                        }}
                                    />
                                </Cell>
                                <Cell className="px-1" row={`${startRow + index + 2}/${startRow + index + 3}`} column={`${startColumn + 2}/${startColumn + 3}`}>{keyName}</Cell>
                                <Cell className="px-1" row={`${startRow + index + 2}/${startRow + index + 3}`} column={`${startColumn + 3}/${startColumn + 4}`}>
                                    {
                                        value.checked ? <select value={value.operator}
                                            onChange={async (event) => {
                                                switch (event.target.value) {
                                                    case 'lessThan':
                                                    case 'lessThanEquals':
                                                    case 'equals':
                                                    case 'greaterThanEquals':
                                                    case 'greaterThan': {
                                                        props.dispatch({
                                                            type: 'query',
                                                            payload: Y(['values', keyName, 'operator', event.target.value, Date.now()], props.parent)
                                                        })
                                                        return
                                                    }
                                                    case 'between':
                                                    case 'notBetween': {
                                                        props.dispatch({
                                                            type: 'query',
                                                            payload: Y(['values', keyName, 'operator', event.target.value,
                                                                [new Date(new Date().setDate(new Date().getDate() - (new Date().getDay() === 6 ? 5 : (new Date().getDay() === 0 ? 6 : (new Date().getDay() === 1 ? 7 : 1))))).setHours(0, 0, 0), Date.now()]])
                                                        })
                                                        return
                                                    }
                                                    case 'in': {
                                                        props.dispatch({
                                                            type: 'query',
                                                            payload: Y(['values', keyName, 'operator', event.target.value, [Date.now()]], props.parent)
                                                        })
                                                        return
                                                    }
                                                }
                                            }}
                                        >
                                            <option value="equals">equals</option>
                                            <option value="greaterThanEquals">greater than equals</option>
                                            <option value="lessThanEquals">less than equals</option>
                                            <option value="greaterThan">greater than</option>
                                            <option value="lessThan">less than</option>
                                            <option value="between">between</option>
                                            <option value="notBetween">not between</option>
                                            <option value="in">in</option>
                                        </select> : undefined
                                    }
                                </Cell>
                                <Cell className="px-1" row={`${startRow + index + 2}/${startRow + index + 3}`} column={`${startColumn + 4}/${startColumn + 5}`}>
                                    {
                                        value.checked ? (() => {
                                            const operator = value.operator
                                            switch (operator) {
                                                case 'lessThan':
                                                case 'lessThanEquals':
                                                case 'equals':
                                                case 'greaterThanEquals':
                                                case 'greaterThan': {
                                                    return (<Input className="m-1" type="datetime-local"
                                                        value={formatISO(toDate(value.value as number)).substr(0, 16)}
                                                        onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                            props.dispatch({
                                                                type: 'query',
                                                                payload: Y(['values', keyName, operator, getTime(parseISO(event.target.value))], props.parent)
                                                            })
                                                        }}
                                                    />)
                                                }
                                                case 'between':
                                                case 'notBetween': {
                                                    return (
                                                        <div className="flex">
                                                            <Input className="m-1" type="datetime-local"
                                                                value={formatISO(toDate(value.value[0])).substr(0, 16)}
                                                                onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                                    props.dispatch({
                                                                        type: 'query',
                                                                        payload: Y(['values', keyName, operator, [getTime(parseISO(event.target.value)), value.value[1]]], props.parent)
                                                                    })
                                                                }} />
                                                            <Input className="m-1" type="datetime-local"
                                                                value={formatISO(toDate(value.value[1])).substr(0, 16)}
                                                                onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                                    props.dispatch({
                                                                        type: 'query',
                                                                        payload: Y(['values', keyName, operator, [value.value[0], getTime(parseISO(event.target.value))]], props.parent)
                                                                    })
                                                                }} />
                                                        </div>
                                                    )
                                                }
                                                case 'in': {
                                                    if (value.operator === "in") {
                                                        const values = value.value
                                                        return (<div className="flex">
                                                            {
                                                                value.value.map((_v, index) => {
                                                                    return (
                                                                        <Input className="m-1" type="datetime-local"
                                                                            value={formatISO(toDate(values[index])).substr(0, 16)}
                                                                            onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                                                if (index === 0) {
                                                                                    props.dispatch({
                                                                                        type: 'query',
                                                                                        payload: Y(['values', keyName, operator,
                                                                                            [
                                                                                                getTime(parseISO(event.target.value)),
                                                                                                ...values.slice(index + 1, values.length)
                                                                                            ]], props.parent)
                                                                                    })
                                                                                } else if (index === values.length - 1) {
                                                                                    props.dispatch({
                                                                                        type: 'query',
                                                                                        payload: Y(['values', keyName, operator,
                                                                                            [...values.slice(0, index),
                                                                                            getTime(parseISO(event.target.value))
                                                                                            ]], props.parent)
                                                                                    })
                                                                                } else {
                                                                                    props.dispatch({
                                                                                        type: 'query',
                                                                                        payload: Y(['values', keyName, operator,
                                                                                            [...values.slice(0, index),
                                                                                            getTime(parseISO(event.target.value)),
                                                                                            ...values.slice(index + 1, values.length)
                                                                                            ]], props.parent)
                                                                                    })
                                                                                }
                                                                            }} />
                                                                    )
                                                                })
                                                            }
                                                            <button onClick={async () => {
                                                                props.dispatch({
                                                                    type: 'query',
                                                                    payload: Y(['values', keyName, operator, [...values, getTime(new Date())]], props.parent)
                                                                })
                                                            }}
                                                                className="focus:outline-none">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                                                </svg>
                                                            </button>
                                                            <button onClick={async () => {
                                                                if (values.length !== 1) {
                                                                    props.dispatch({
                                                                        type: 'query',
                                                                        payload: Y(['values', keyName, operator, [...values.slice(0, values.length - 1)]], props.parent)
                                                                    })
                                                                }
                                                            }} className="focus:outline-none">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                                                                </svg>
                                                            </button>
                                                        </div>)
                                                    }
                                                    return
                                                }
                                            }
                                        })() : undefined
                                    }
                                </Cell>
                            </>)
                        }
                        case 'Time': {
                            return (<>
                                <Cell className="px-1" row={`${startRow + index + 2}/${startRow + index + 3}`} column={`${startColumn + 1}/${startColumn + 2}`}>
                                    <Checkbox className="w-2"
                                        checked={value.checked}
                                        color='primary'
                                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                                        onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                            props.dispatch({
                                                type: 'query',
                                                payload: Y(['values', keyName, 'checked', event.target.checked], props.parent)
                                            })
                                        }}
                                    />
                                </Cell>
                                <Cell className="px-1" row={`${startRow + index + 2}/${startRow + index + 3}`} column={`${startColumn + 2}/${startColumn + 3}`}>{keyName}</Cell>
                                <Cell className="px-1" row={`${startRow + index + 2}/${startRow + index + 3}`} column={`${startColumn + 3}/${startColumn + 4}`}>
                                    {
                                        value.checked ? <select value={value.operator}
                                            onChange={async (event) => {
                                                switch (event.target.value) {
                                                    case 'lessThan':
                                                    case 'lessThanEquals':
                                                    case 'equals':
                                                    case 'greaterThanEquals':
                                                    case 'greaterThan': {
                                                        props.dispatch({
                                                            type: 'query',
                                                            payload: Y(['values', keyName, 'operator', event.target.value, Date.now()], props.parent)
                                                        })
                                                        return
                                                    }
                                                    case 'between':
                                                    case 'notBetween': {
                                                        props.dispatch({
                                                            type: 'query',
                                                            payload: Y(['values', keyName, 'operator', event.target.value,
                                                                [new Date(new Date().setDate(new Date().getDate() - (new Date().getDay() === 6 ? 5 : (new Date().getDay() === 0 ? 6 : (new Date().getDay() === 1 ? 7 : 1))))).setHours(0, 0, 0), Date.now()]])
                                                        })
                                                        return
                                                    }
                                                    case 'in': {
                                                        props.dispatch({
                                                            type: 'query',
                                                            payload: Y(['values', keyName, 'operator', event.target.value, [Date.now()]], props.parent)
                                                        })
                                                        return
                                                    }
                                                }
                                            }}
                                        >
                                            <option value="equals">equals</option>
                                            <option value="greaterThanEquals">greater than equals</option>
                                            <option value="lessThanEquals">less than equals</option>
                                            <option value="greaterThan">greater than</option>
                                            <option value="lessThan">less than</option>
                                            <option value="between">between</option>
                                            <option value="notBetween">not between</option>
                                            <option value="in">in</option>
                                        </select> : undefined
                                    }
                                </Cell>
                                <Cell className="px-1" row={`${startRow + index + 2}/${startRow + index + 3}`} column={`${startColumn + 4}/${startColumn + 5}`}>
                                    {
                                        value.checked ? (() => {
                                            const operator = value.operator
                                            switch (operator) {
                                                case 'lessThan':
                                                case 'lessThanEquals':
                                                case 'equals':
                                                case 'greaterThanEquals':
                                                case 'greaterThan': {
                                                    return (<Input className="m-1" type="time"
                                                        value={formatISO(toDate(value.value as number)).substr(11, 5)}
                                                        onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                            props.dispatch({
                                                                type: 'query',
                                                                payload: Y(['values', keyName, operator, getTime(parse(event.target.value, 'HH:mm', new Date()))], props.parent)
                                                            })
                                                        }}
                                                    />)
                                                }
                                                case 'between':
                                                case 'notBetween': {
                                                    return (
                                                        <div className="flex">
                                                            <Input className="m-1" type="time"
                                                                value={formatISO(toDate(value.value[0])).substr(11, 5)}
                                                                onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                                    props.dispatch({
                                                                        type: 'query',
                                                                        payload: Y(['values', keyName, operator, [getTime(parse(event.target.value, 'HH:mm', new Date())), value.value[1]]], props.parent)
                                                                    })
                                                                }} />
                                                            <Input className="m-1" type="time"
                                                                value={formatISO(toDate(value.value[1])).substr(11, 5)}
                                                                onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                                    props.dispatch({
                                                                        type: 'query',
                                                                        payload: Y(['values', keyName, operator, [value.value[0], getTime(parse(event.target.value, 'HH:mm', new Date()))]], props.parent)
                                                                    })
                                                                }} />
                                                        </div>
                                                    )
                                                }
                                                case 'in': {
                                                    if (value.operator === "in") {
                                                        const values = value.value
                                                        return (<div className="flex">
                                                            {
                                                                value.value.map((_v, index) => {
                                                                    return (
                                                                        <Input className="m-1" type="time"
                                                                            value={formatISO(toDate(values[index])).substr(11, 5)}
                                                                            onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                                                if (index === 0) {
                                                                                    props.dispatch({
                                                                                        type: 'query',
                                                                                        payload: Y(['values', keyName, operator,
                                                                                            [
                                                                                                getTime(parse(event.target.value, 'HH:mm', new Date())),
                                                                                                ...values.slice(index + 1, values.length)
                                                                                            ]], props.parent)
                                                                                    })
                                                                                } else if (index === values.length - 1) {
                                                                                    props.dispatch({
                                                                                        type: 'query',
                                                                                        payload: Y(['values', keyName, operator,
                                                                                            [...values.slice(0, index),
                                                                                            getTime(parse(event.target.value, 'HH:mm', new Date()))
                                                                                            ]], props.parent)
                                                                                    })
                                                                                } else {
                                                                                    props.dispatch({
                                                                                        type: 'query',
                                                                                        payload: Y(['values', keyName, operator,
                                                                                            [...values.slice(0, index),
                                                                                            getTime(parse(event.target.value, 'HH:mm', new Date())),
                                                                                            ...values.slice(index + 1, values.length)
                                                                                            ]], props.parent)
                                                                                    })
                                                                                }
                                                                            }} />
                                                                    )
                                                                })
                                                            }
                                                            <button onClick={async () => {
                                                                props.dispatch({
                                                                    type: 'query',
                                                                    payload: Y(['values', keyName, operator, [...values, getTime(new Date())]], props.parent)
                                                                })
                                                            }}
                                                                className="focus:outline-none">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                                                </svg>
                                                            </button>
                                                            <button onClick={async () => {
                                                                if (values.length !== 1) {
                                                                    props.dispatch({
                                                                        type: 'query',
                                                                        payload: Y(['values', keyName, operator, [...values.slice(0, values.length - 1)]], props.parent)
                                                                    })
                                                                }
                                                            }} className="focus:outline-none">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                                                                </svg>
                                                            </button>
                                                        </div>)
                                                    }
                                                    return
                                                }
                                            }
                                        })() : undefined
                                    }
                                </Cell>
                            </>)
                        }
                    }
                } else {
                    return (<>
                        <Cell className="px-1" row={`${startRow + index + 2}/${startRow + index + 3}`} column={`${startColumn + 1}/${startColumn + 2}`}>
                            <Checkbox className="w-2"
                                checked={value.checked}
                                color='primary'
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                                onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                    props.dispatch({
                                        type: 'query',
                                        payload: Y(['values', keyName, 'checked', event.target.checked], props.parent)
                                    })
                                }}
                            />
                        </Cell>
                        <Cell className="px-1" row={`${startRow + index + 2}/${startRow + index + 3}`} column={`${startColumn + 2}/${startColumn + 3}`}>{keyName}</Cell>
                        {
                            value.checked ? (() => {
                                const x = <FilterRows query={value.value} dispatch={props.dispatch} startRow={startRow + index + 1} startColumn={startColumn + 2} parent={props.parent ? T(props.parent, keyName) : ['values', keyName, undefined]} />
                                startRow += getNestedRowCount(value.value)
                                return x
                            })() : undefined
                        }
                    </>)
                }
            })
        }
    </>)
}

function getNestedRowCount(query: Immutable<Query>): number {
    var count: number = Object.keys(query.values).length
    Object.keys(query.values).forEach(keyName => {
        const value = query.values[keyName]
        if ('operator' in value) {

        } else {
            count += getNestedRowCount(value.value)
        }
    })
    return count
}

function H(parent: S, path: Array<string>): Array<string> {
    if (parent[2] === undefined) {
        return (['values', parent[1], ...path])
    } else {
        return (['values', parent[1], ...H(parent[2], path)])
    }
}

export function J(path: Array<string>, parent?: S): Array<string> {
    return (parent ? H(parent, path) : path)
}

export function getQuery(typeName: string): Query {
    return Object.keys(types[typeName].keys).reduce((acc: Query, keyName: string) => {
        const key: Key = types[typeName].keys[keyName]
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
                    value: true
                }
                return acc
            }
            case 'Date': {
                acc.values[keyName] = {
                    checked: false,
                    type: key.type,
                    operator: 'equals',
                    value: getTime(new Date())
                }
                return acc
            }
            case 'Timestamp': {
                acc.values[keyName] = {
                    checked: false,
                    type: key.type,
                    operator: 'equals',
                    value: getTime(new Date())
                }
                return acc
            }
            case 'Time': {
                acc.values[keyName] = {
                    checked: false,
                    type: key.type,
                    operator: 'equals',
                    value: getTime(new Date())
                }
                return acc
            }
            default: {
                acc.values[keyName] = {
                    checked: false,
                    type: key.type,
                    value: getQuery(key.type)
                }
                return acc
            }
        }
    }, {
        variableName: {
            checked: false,
            operator: 'equals',
            value: ''
        },
        values: {}
    })
}

export function updateQuery(query: Query, args: Args) {
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

function getExpression(query: Immutable<Query>, parent?: S): LispExpression {
    const expression: LispExpression = {
        expectedReturnType: 'Boolean',
        op: 'and',
        types: ['Boolean'],
        args: []
    }
    if (query.variableName.checked === true) {
        switch (query.variableName.operator) {
            case 'equals': {
                expression.args = [...expression.args, {
                    op: '==',
                    types: ['Text'],
                    args: [query.variableName.value, {
                        op: '.',
                        types: [],
                        args: J(['variableName'], parent)
                    }]
                }]
                break
            }
            case 'like': {

                break
            }
            case 'between': {
                expression.args = [...expression.args, {
                    op: 'and',
                    types: ['Boolean'],
                    args: [{
                        op: '<=',
                        types: ['Text'],
                        args: [query.variableName.value[0], {
                            op: '.',
                            types: [],
                            args: J(['variableName'], parent)
                        }]
                    }, {
                        op: '>=',
                        types: ['Text'],
                        args: [query.variableName.value[1], {
                            op: '.',
                            types: [],
                            args: J(['variableName'], parent)
                        }]
                    }]
                }]
                break
            }
            case 'notBetween': {
                expression.args = [...expression.args, {
                    op: 'or',
                    types: ['Boolean'],
                    args: [{
                        op: '<',
                        types: ['Text'],
                        args: [{
                            op: '.',
                            types: [],
                            args: J(['variableName'], parent)
                        }, query.variableName.value[0]]
                    }, {
                        op: '>',
                        types: ['Text'],
                        args: [{
                            op: '.',
                            types: [],
                            args: J(['variableName'], parent)
                        }, query.variableName.value[1]]
                    }]
                }]
                break
            }
            case 'in': {
                expression.args = [...expression.args, {
                    op: 'or',
                    types: ['Boolean'],
                    args: query.variableName.value.map(x => {
                        return ({
                            op: '==',
                            types: ['Text'],
                            args: [x, {
                                op: '.',
                                types: [],
                                args: J(['variableName'], parent)
                            }]
                        })
                    })
                }]
                break
            }
        }
    }
    const valuesExpression: LispExpression = {
        op: 'and',
        types: ['Boolean'],
        args: []
    }
    Object.keys(query.values).forEach(keyName => {
        const value = query.values[keyName]
        if (value.checked) {
            if ('operator' in value) {
                switch (value.type) {
                    case 'Text': {
                        switch (value.operator) {
                            case 'equals': {
                                valuesExpression.args = [...valuesExpression.args, {
                                    op: '==',
                                    types: ['Text'],
                                    args: [value.value, {
                                        op: '.',
                                        types: [],
                                        args: J(['values', keyName], parent)
                                    }]
                                }]
                                break
                            }
                            case 'like': {

                                break
                            }
                            case 'between': {
                                valuesExpression.args = [...valuesExpression.args, {
                                    op: 'and',
                                    types: ['Boolean'],
                                    args: [{
                                        op: '<=',
                                        types: ['Text'],
                                        args: [value.value[0], {
                                            op: '.',
                                            types: [],
                                            args: J(['values', keyName], parent)
                                        }]
                                    }, {
                                        op: '>=',
                                        types: ['Text'],
                                        args: [value.value[1], {
                                            op: '.',
                                            types: [],
                                            args: J(['values', keyName], parent)
                                        }]
                                    }]
                                }]
                                break
                            }
                            case 'notBetween': {
                                valuesExpression.args = [...valuesExpression.args, {
                                    op: 'or',
                                    types: ['Boolean'],
                                    args: [{
                                        op: '<',
                                        types: ['Text'],
                                        args: [{
                                            op: '.',
                                            types: [],
                                            args: J(['values', keyName], parent)
                                        }, value.value[0]]
                                    }, {
                                        op: '>',
                                        types: ['Text'],
                                        args: [{
                                            op: '.',
                                            types: [],
                                            args: J(['values', keyName], parent)
                                        }, value.value[1]]
                                    }]
                                }]
                                break
                            }
                            case 'in': {
                                expression.args = [...expression.args, {
                                    op: 'or',
                                    types: ['Boolean'],
                                    args: value.value.map(x => {
                                        return ({
                                            op: '==',
                                            types: ['Text'],
                                            args: [x, {
                                                op: '.',
                                                types: [],
                                                args: J(['values', keyName], parent)
                                            }]
                                        })
                                    })
                                }]
                                break
                            }
                        }
                        break
                    }
                    case 'Date':
                    case 'Timestamp':
                    case 'Time':
                    case 'Number': {
                        switch (value.operator) {
                            case 'equals': {
                                valuesExpression.args = [...valuesExpression.args, {
                                    op: '==',
                                    types: ['Number'],
                                    args: [value.value, {
                                        op: '.',
                                        types: [],
                                        args: J(['values', keyName], parent)
                                    }]
                                }]
                                break
                            }
                            case 'greaterThanEquals': {
                                valuesExpression.args = [...valuesExpression.args, {
                                    op: '>=',
                                    types: ['Number'],
                                    args: [{
                                        op: '.',
                                        types: [],
                                        args: J(['values', keyName], parent)
                                    }, value.value,]
                                }]
                                break
                            }
                            case 'greaterThan': {
                                valuesExpression.args = [...valuesExpression.args, {
                                    op: '>',
                                    types: ['Number'],
                                    args: [{
                                        op: '.',
                                        types: [],
                                        args: J(['values', keyName], parent)
                                    }, value.value,]
                                }]
                                break
                            }
                            case 'lessThanEquals': {
                                valuesExpression.args = [...valuesExpression.args, {
                                    op: '<=',
                                    types: ['Number'],
                                    args: [{
                                        op: '.',
                                        types: [],
                                        args: J(['values', keyName], parent)
                                    }, value.value,]
                                }]
                                break
                            }
                            case 'lessThan': {
                                valuesExpression.args = [...valuesExpression.args, {
                                    op: '<',
                                    types: ['Number'],
                                    args: [{
                                        op: '.',
                                        types: [],
                                        args: J(['values', keyName], parent)
                                    }, value.value,]
                                }]
                                break
                            }
                            case 'between': {
                                valuesExpression.args = [...valuesExpression.args, {
                                    op: 'and',
                                    types: ['Boolean'],
                                    args: [{
                                        op: '<=',
                                        types: ['Number'],
                                        args: [value.value[0], {
                                            op: '.',
                                            types: [],
                                            args: J(['values', keyName], parent)
                                        }]
                                    }, {
                                        op: '>=',
                                        types: ['Number'],
                                        args: [value.value[1], {
                                            op: '.',
                                            types: [],
                                            args: J(['values', keyName], parent)
                                        }]
                                    }]
                                }]
                                break
                            }
                            case 'notBetween': {
                                valuesExpression.args = [...valuesExpression.args, {
                                    op: 'or',
                                    types: ['Boolean'],
                                    args: [{
                                        op: '<',
                                        types: ['Number'],
                                        args: [{
                                            op: '.',
                                            types: [],
                                            args: J(['values', keyName], parent)
                                        }, value.value[0]]
                                    }, {
                                        op: '>',
                                        types: ['Number'],
                                        args: [value.value[1], {
                                            op: '.',
                                            types: [],
                                            args: J(['values', keyName], parent)
                                        }]
                                    }]
                                }]
                                break
                            }
                            case 'in': {
                                expression.args = [...expression.args, {
                                    op: 'or',
                                    types: ['Boolean'],
                                    args: value.value.map(x => {
                                        return ({
                                            op: '==',
                                            types: ['Number'],
                                            args: [x, {
                                                op: '.',
                                                types: [],
                                                args: J(['values', keyName], parent)
                                            }]
                                        })
                                    })
                                }]
                                break
                            }
                        }
                        break
                    }
                    case 'Decimal': {
                        switch (value.operator) {
                            case 'equals': {
                                valuesExpression.args = [...valuesExpression.args, {
                                    op: '==',
                                    types: ['Decimal'],
                                    args: [value.value, {
                                        op: '.',
                                        types: [],
                                        args: J(['values', keyName], parent)
                                    }]
                                }]
                                break
                            }
                            case 'greaterThanEquals': {
                                valuesExpression.args = [...valuesExpression.args, {
                                    op: '>=',
                                    types: ['Decimal'],
                                    args: [{
                                        op: '.',
                                        types: [],
                                        args: J(['values', keyName], parent)
                                    }, value.value,]
                                }]
                                break
                            }
                            case 'greaterThan': {
                                valuesExpression.args = [...valuesExpression.args, {
                                    op: '>',
                                    types: ['Decimal'],
                                    args: [{
                                        op: '.',
                                        types: [],
                                        args: J(['values', keyName], parent)
                                    }, value.value,]
                                }]
                                break
                            }
                            case 'lessThanEquals': {
                                valuesExpression.args = [...valuesExpression.args, {
                                    op: '<=',
                                    types: ['Decimal'],
                                    args: [{
                                        op: '.',
                                        types: [],
                                        args: J(['values', keyName], parent)
                                    }, value.value,]
                                }]
                                break
                            }
                            case 'lessThan': {
                                valuesExpression.args = [...valuesExpression.args, {
                                    op: '<',
                                    types: ['Decimal'],
                                    args: [{
                                        op: '.',
                                        types: [],
                                        args: J(['values', keyName], parent)
                                    }, value.value,]
                                }]
                                break
                            }
                            case 'between': {
                                valuesExpression.args = [...valuesExpression.args, {
                                    op: 'and',
                                    types: ['Boolean'],
                                    args: [{
                                        op: '<=',
                                        types: ['Decimal'],
                                        args: [value.value[0], {
                                            op: '.',
                                            types: [],
                                            args: J(['values', keyName], parent)
                                        }]
                                    }, {
                                        op: '>=',
                                        types: ['Decimal'],
                                        args: [value.value[1], {
                                            op: '.',
                                            types: [],
                                            args: J(['values', keyName], parent)
                                        }]
                                    }]
                                }]
                                break
                            }
                            case 'notBetween': {
                                valuesExpression.args = [...valuesExpression.args, {
                                    op: 'or',
                                    types: ['Boolean'],
                                    args: [{
                                        op: '<',
                                        types: ['Decimal'],
                                        args: [{
                                            op: '.',
                                            types: [],
                                            args: J(['values', keyName], parent)
                                        }, value.value[0]]
                                    }, {
                                        op: '>',
                                        types: ['Decimal'],
                                        args: [value.value[1], {
                                            op: '.',
                                            types: [],
                                            args: J(['values', keyName], parent)
                                        }]
                                    }]
                                }]
                                break
                            }
                            case 'in': {
                                expression.args = [...expression.args, {
                                    op: 'or',
                                    types: ['Boolean'],
                                    args: value.value.map(x => {
                                        return ({
                                            op: '==',
                                            types: ['Decimal'],
                                            args: [x, {
                                                op: '.',
                                                types: [],
                                                args: J(['values', keyName], parent)
                                            }]
                                        })
                                    })
                                }]
                                break
                            }
                        }
                        break
                    }
                    case 'Boolean': {
                        switch (value.operator) {
                            case 'equals': {
                                valuesExpression.args = [...valuesExpression.args, {
                                    op: '==',
                                    types: ['Text'],
                                    args: [String(value.value), {
                                        op: '.',
                                        types: [],
                                        args: J(['values', keyName], parent)
                                    }]
                                }]
                                break
                            }
                        }
                        break
                    }
                }
            } else {
                valuesExpression.args = [...valuesExpression.args, getExpression(value.value, parent ? T(parent, keyName) : ['values', keyName, undefined])]
            }
        }
    })
    expression.args = [...expression.args, valuesExpression]
    return expression
}

function getSymbolPaths(expression: LispExpression): Vector<Vector<string>> {
    var symbolPaths: Vector<Vector<string>> = Vector.of()
    expression.args.forEach(arg => {
        if (typeof arg === 'object') {
            if (arg.op === '.') {
                symbolPaths = symbolPaths.append(Vector.of<string>().appendAll(arg.args))
            } else {
                getSymbolPaths(arg).forEach(x => {
                    symbolPaths = symbolPaths.append(x)
                })
            }
        }
    })
    return symbolPaths
}

function getSymbols(symbolPaths: Vector<Vector<string>>, variable: Variable): Symbols {
    const type = types[variable.typeName]
    return {
        variableName: {
            type: 'Text',
            value: getVariableName(variable),
        },
        values: {
            type: 'Text',
            value: '',
            values: Object.keys(variable.values).reduce((acc, keyName) => {
                if (symbolPaths.anyMatch(path => path.toArray()[0] === 'values' && path.toArray()[1] === keyName)) {
                    const keyType = type.keys[keyName].type
                    switch (keyType) {
                        case 'Text':
                        case 'Number':
                        case 'Decimal': {
                            acc[keyName] = {
                                type: keyType,
                                value: variable.values[keyName]
                            }
                            break
                        }
                        case 'Boolean': {
                            acc[keyName] = {
                                type: keyType,
                                value: variable.values[keyName]
                            }
                            break
                        }
                        case 'Date':
                        case 'Timestamp':
                        case 'Time': {
                            acc[keyName] = {
                                type: 'Number',
                                value: variable.values[keyName]
                            }
                            break
                        }
                        default: {
                            symbolPaths.filter(x => x.toArray()[0] === 'values' && x.toArray[1] === keyName).map(x => Vector.of().appendAll(x.toArray().slice(2)))
                        }
                    }
                }
                return acc
            }, {})
        }
    }
}

export function applyFilter(query: Immutable<Query>, variable: Variable): boolean {
    return Boolean(evaluateExpression(getExpression(query), getSymbols(getSymbolPaths(getExpression(query)), variable))).valueOf()
}
