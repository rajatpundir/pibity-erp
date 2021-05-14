import { Immutable, Draft } from 'immer'
import { useImmerReducer } from "use-immer"
import { Container, Item, none, TableContainer, Cell } from '../../../main/commons'
import { Table } from '../../../main/Table'
import * as Grid from './grids/Products'
import tw from 'twin.macro'
import { store } from '../../../main/store'
import { Vector } from 'prelude-ts'
import { types, Key } from '../../../main/types'
import Switch from '@material-ui/core/Switch'
import Checkbox from '@material-ui/core/Checkbox'
import { toDate } from 'date-fns'
import parse from 'date-fns/parse'
import getTime from 'date-fns/getTime'
import formatISO from 'date-fns/formatISO'
import parseISO from 'date-fns/parseISO'
import React from 'react'
import { evaluateExpression, LispExpression, Symbols } from '../../../main/lisp'
import { Variable, getVariableName } from '../../../main/variables'

type State = Immutable<{
    typeName: 'Product'
    query: Query
    limit: number
    offset: number
    page: number
}>

export type Action =
    | {
        type: 'reset' | 'limit' | 'offset' | 'page'
        payload: number
    }
    | {
        type: 'query'
        payload: Args
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

export function getSymbolPaths(expression: LispExpression): Vector<Vector<string>> {
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
                        default: { }
                    }
                }
                return acc
            }, {})
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
                        args: [query.variableName.value[1], {
                            op: '.',
                            types: [],
                            args: J(['variableName'], parent)
                        }]
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

type Args =
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

type S = ['values', string, undefined] | ['values', string, S]

function R(x: S, args: Args): ['values', string, Args] {
    if (x[2] === undefined) {
        return ['values', x[1], args]
    } else {
        return ['values', x[1], R(x[2], args)]
    }
}

function T(parent: S, keyName: string): S {
    if (parent[2] === undefined) {
        return (['values', parent[1], ['values', keyName, undefined]])
    } else {
        return (['values', parent[1], T(parent[2], keyName)])
    }
}

function Y(args: Args, parent?: S): Args {
    return (parent ? R(parent, args) : args)
}

function H(parent: S, path: Array<string>): Array<string> {
    if (parent[2] === undefined) {
        return (['values', parent[1], ...path])
    } else {
        return (['values', parent[1], ...H(parent[2], path)])
    }
}

function J(path: Array<string>, parent?: S): Array<string> {
    return (parent ? H(parent, path) : path)
}

function updateQuery(query: Query, args: Args) {
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

function getQuery(typeName: string): Query {
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
                    value: false
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

const initialState: State = {
    typeName: 'Product',
    query: getQuery('Product'),
    limit: 5,
    offset: 0,
    page: 1
}

function reducer(state: Draft<State>, action: Action) {
    switch (action.type) {
        case 'reset':
            return initialState;
        case 'query': {
            if (typeof action.payload === 'object') {
                updateQuery(state.query, action.payload)
            }
            return;
        }
        case 'limit': {
            if (typeof action.payload === 'number') {
                state.limit = Math.max(initialState.limit, action.payload)
            }
            return;
        }
        case 'offset': {
            if (typeof action.payload === 'number') {
                state.offset = Math.max(0, action.payload)
                state.page = Math.max(0, action.payload) + 1
            }
            return;
        }
        case 'page': {
            if (typeof action.payload === 'number') {
                state.page = action.payload
            }
            return;
        }
    }
}

export default function Products() {
    const [state, dispatch] = useImmerReducer<State, Action>(reducer, initialState)
    const variables = store(state => state.variables.Product).filter(variable => {
        return Boolean(evaluateExpression(getExpression(state.query), getSymbols(getSymbolPaths(getExpression(state.query)), variable))).valueOf()
    })
    const columns: Vector<string> = Vector.of("SKU", "Name", "Orderable", "Consumable", "Producable")
    return (
        <Container area={none} layout={Grid.layouts.main} className="overflow-x-scroll overflow-y-scroll">
            {
                getFilter(state.query, dispatch)
            }
            <Item area={Grid.header}>
                <Title>Products</Title>
            </Item>
            <Table area={Grid.table} state={state} dispatch={dispatch} variables={variables} columns={columns} />
        </Container>
    )
}

const Title = tw.div`py-8 text-4xl text-gray-800 font-bold mx-1`

const Input = tw.input`p-1.5 text-gray-500 leading-tight border border-gray-400 shadow-inner hover:border-gray-600 w-full h-6 rounded-sm inline-block`

function getFilter(query: Immutable<Query>, dispatch: React.Dispatch<Action>, parent?: S) {
    return (<TableContainer area={Grid.query}>
        <Cell row="1/2" column="1/2">
            <Checkbox
                checked={query.variableName.checked}
                color='primary'
                inputProps={{ 'aria-label': 'secondary checkbox' }}
                onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                    dispatch({
                        type: 'query',
                        payload: Y(['variableName', 'checked', event.target.checked], parent)
                    })
                }}
            />
        </Cell>
        <Cell row="1/2" column="2/3">ID</Cell>
        <Cell row="1/2" column="3/4">
            <select value={query.variableName.operator}
                onChange={async (event) => {
                    switch (event.target.value) {
                        case 'equals':
                        case 'like': {
                            dispatch({
                                type: 'query',
                                payload: Y(['variableName', 'operator', event.target.value, ''], parent)
                            })
                            return
                        }
                        case 'between':
                        case 'notBetween': {
                            dispatch({
                                type: 'query',
                                payload: Y(['variableName', 'operator', event.target.value, ['', '']], parent)
                            })
                            return
                        }
                        case 'in': {
                            dispatch({
                                type: 'query',
                                payload: Y(['variableName', 'operator', event.target.value, ['']], parent)
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
                    const operator = query.variableName.operator
                    switch (operator) {
                        case 'equals':
                        case 'like': {
                            return (<Input value={query.variableName.value}
                                onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                    dispatch({
                                        type: 'query',
                                        payload: Y(['variableName', operator, event.target.value], parent)
                                    })
                                }} />)
                        }
                        case 'between':
                        case 'notBetween': {
                            return (
                                <>
                                    <Input value={query.variableName.value[0]}
                                        onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                            dispatch({
                                                type: 'query',
                                                payload: Y(['variableName', operator, [event.target.value, query.variableName.value[1]]], parent)
                                            })
                                        }} />
                                    <Input value={query.variableName.value[1]}
                                        onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                            dispatch({
                                                type: 'query',
                                                payload: Y(['variableName', operator, [query.variableName.value[0], event.target.value]], parent)
                                            })
                                        }} />
                                </>
                            )
                        }
                        case 'in': {
                            if (query.variableName.operator === "in") {
                                const values = query.variableName.value
                                return (<>
                                    {
                                        query.variableName.value.map((value, index) => {
                                            return (
                                                <Input value={query.variableName.value[index]}
                                                    onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                        if (index === 0) {
                                                            dispatch({
                                                                type: 'query',
                                                                payload: Y(['variableName', operator,
                                                                    [
                                                                        event.target.value,
                                                                        ...values.slice(index + 1, query.variableName.value.length)
                                                                    ]], parent)
                                                            })
                                                        } else if (index === values.length - 1) {
                                                            dispatch({
                                                                type: 'query',
                                                                payload: Y(['variableName', operator,
                                                                    [...values.slice(0, index),
                                                                    event.target.value
                                                                    ]], parent)
                                                            })
                                                        } else {
                                                            dispatch({
                                                                type: 'query',
                                                                payload: Y(['variableName', operator,
                                                                    [...values.slice(0, index),
                                                                    event.target.value,
                                                                    ...values.slice(index + 1, query.variableName.value.length)
                                                                    ]], parent)
                                                            })
                                                        }
                                                    }} />
                                            )
                                        })
                                    }
                                    <button onClick={async () => {
                                        dispatch({
                                            type: 'query',
                                            payload: Y(['variableName', operator, [...values, '']], parent)
                                        })
                                    }}
                                        className="focus:outline-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                        </svg>
                                    </button>
                                    <button onClick={async () => {
                                        if (values.length !== 1) {
                                            dispatch({
                                                type: 'query',
                                                payload: Y(['variableName', operator, [...values.slice(0, values.length - 1)]], parent)
                                            })
                                        }
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
            Object.keys(query.values).flatMap((keyName, index) => {
                const value = query.values[keyName]
                if ('operator' in value) {
                    switch (value.type) {
                        case 'Text': {
                            return (<>
                                <Cell row={`${index + 2}/${index + 3}`} column="1/2">
                                    <Checkbox
                                        checked={value.checked}
                                        color='primary'
                                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                                        onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                            dispatch({
                                                type: 'query',
                                                payload: Y(['values', keyName, 'checked', event.target.checked], parent)
                                            })
                                        }}
                                    />
                                </Cell>
                                <Cell row={`${index + 2}/${index + 3}`} column="2/3">{keyName}</Cell>
                                <Cell row={`${index + 2}/${index + 3}`} column="3/4">
                                    <select value={value.operator}
                                        onChange={async (event) => {
                                            switch (event.target.value) {
                                                case 'equals':
                                                case 'like': {
                                                    dispatch({
                                                        type: 'query',
                                                        payload: Y(['values', keyName, 'operator', event.target.value, ''], parent)
                                                    })
                                                    return
                                                }
                                                case 'between':
                                                case 'notBetween': {
                                                    dispatch({
                                                        type: 'query',
                                                        payload: Y(['values', keyName, 'operator', event.target.value, ['', '']], parent)
                                                    })
                                                    return
                                                }
                                                case 'in': {
                                                    dispatch({
                                                        type: 'query',
                                                        payload: Y(['values', keyName, 'operator', event.target.value, ['']], parent)
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
                                <Cell row={`${index + 2}/${index + 3}`} column="4/5">
                                    {
                                        (() => {
                                            const operator = value.operator
                                            switch (operator) {
                                                case 'equals':
                                                case 'like': {
                                                    return (<Input value={value.value}
                                                        onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                            dispatch({
                                                                type: 'query',
                                                                payload: Y(['values', keyName, operator, event.target.value], parent)
                                                            })
                                                        }} />)
                                                }
                                                case 'between':
                                                case 'notBetween': {
                                                    return (
                                                        <>
                                                            <Input value={value.value[0]}
                                                                onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                                    dispatch({
                                                                        type: 'query',
                                                                        payload: Y(['values', keyName, operator, [event.target.value, value.value[1]]], parent)
                                                                    })
                                                                }} />
                                                            <Input value={value.value[1]}
                                                                onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                                    dispatch({
                                                                        type: 'query',
                                                                        payload: Y(['values', keyName, operator, [value.value[0], event.target.value]], parent)
                                                                    })
                                                                }} />
                                                        </>
                                                    )
                                                }
                                                case 'in': {
                                                    if (value.operator === "in") {
                                                        const values = value.value
                                                        return (<>
                                                            {
                                                                value.value.map((v, index) => {
                                                                    return (
                                                                        <Input value={values[index]}
                                                                            onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                                                if (index === 0) {
                                                                                    dispatch({
                                                                                        type: 'query',
                                                                                        payload: Y(['values', keyName, operator,
                                                                                            [
                                                                                                event.target.value,
                                                                                                ...values.slice(index + 1, values.length)
                                                                                            ]], parent)
                                                                                    })
                                                                                } else if (index === values.length - 1) {
                                                                                    dispatch({
                                                                                        type: 'query',
                                                                                        payload: Y(['values', keyName, operator,
                                                                                            [...values.slice(0, index),
                                                                                            event.target.value
                                                                                            ]], parent)
                                                                                    })
                                                                                } else {
                                                                                    dispatch({
                                                                                        type: 'query',
                                                                                        payload: Y(['values', keyName, operator,
                                                                                            [...values.slice(0, index),
                                                                                            event.target.value,
                                                                                            ...values.slice(index + 1, values.length)
                                                                                            ]], parent)
                                                                                    })
                                                                                }
                                                                            }} />
                                                                    )
                                                                })
                                                            }
                                                            <button onClick={async () => {
                                                                dispatch({
                                                                    type: 'query',
                                                                    payload: Y(['values', keyName, operator, [...values, '']], parent)
                                                                })
                                                            }}
                                                                className="focus:outline-none">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                                                </svg>
                                                            </button>
                                                            <button onClick={async () => {
                                                                if (values.length !== 1) {
                                                                    dispatch({
                                                                        type: 'query',
                                                                        payload: Y(['values', keyName, operator, [...values.slice(0, values.length - 1)]], parent)
                                                                    })
                                                                }
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
                            </>)
                        }
                        case 'Number': {
                            return (<>
                                <Cell row={`${index + 2}/${index + 3}`} column="1/2">
                                    <Checkbox
                                        checked={value.checked}
                                        color='primary'
                                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                                        onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                            dispatch({
                                                type: 'query',
                                                payload: Y(['values', keyName, 'checked', event.target.checked], parent)
                                            })
                                        }}
                                    />
                                </Cell>
                                <Cell row={`${index + 2}/${index + 3}`} column="2/3">{keyName}</Cell>
                                <Cell row={`${index + 2}/${index + 3}`} column="3/4">
                                    <select value={value.operator}
                                        onChange={async (event) => {
                                            switch (event.target.value) {
                                                case 'lessThan':
                                                case 'lessThanEquals':
                                                case 'equals':
                                                case 'greaterThanEquals':
                                                case 'greaterThan': {
                                                    dispatch({
                                                        type: 'query',
                                                        payload: Y(['values', keyName, 'operator', event.target.value, 0], parent)
                                                    })
                                                    return
                                                }
                                                case 'between':
                                                case 'notBetween': {
                                                    dispatch({
                                                        type: 'query',
                                                        payload: Y(['values', keyName, 'operator', event.target.value, [0, 0]], parent)
                                                    })
                                                    return
                                                }
                                                case 'in': {
                                                    dispatch({
                                                        type: 'query',
                                                        payload: Y(['values', keyName, 'operator', event.target.value, [0]], parent)
                                                    })
                                                    return
                                                }
                                            }
                                        }}
                                    >
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
                                    {
                                        (() => {
                                            const operator = value.operator
                                            switch (operator) {
                                                case 'lessThan':
                                                case 'lessThanEquals':
                                                case 'equals':
                                                case 'greaterThanEquals':
                                                case 'greaterThan': {
                                                    return (<Input type='number' value={value.value as number}
                                                        onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                            dispatch({
                                                                type: 'query',
                                                                payload: Y(['values', keyName, operator, parseInt(event.target.value)], parent)
                                                            })
                                                        }} />)
                                                }
                                                case 'between':
                                                case 'notBetween': {
                                                    return (
                                                        <>
                                                            <Input type='number' value={value.value[0]}
                                                                onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                                    dispatch({
                                                                        type: 'query',
                                                                        payload: Y(['values', keyName, operator, [parseInt(event.target.value), value.value[1]]], parent)
                                                                    })
                                                                }} />
                                                            <Input type='number' value={value.value[1]}
                                                                onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                                    dispatch({
                                                                        type: 'query',
                                                                        payload: Y(['values', keyName, operator, [value.value[0], parseInt(event.target.value)]], parent)
                                                                    })
                                                                }} />
                                                        </>
                                                    )
                                                }
                                                case 'in': {
                                                    if (value.operator === "in") {
                                                        const values = value.value
                                                        return (<>
                                                            {
                                                                value.value.map((v, index) => {
                                                                    return (
                                                                        <Input type='number' value={values[index]}
                                                                            onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                                                if (index === 0) {
                                                                                    dispatch({
                                                                                        type: 'query',
                                                                                        payload: Y(['values', keyName, operator,
                                                                                            [
                                                                                                parseInt(event.target.value),
                                                                                                ...values.slice(index + 1, values.length)
                                                                                            ]], parent)
                                                                                    })
                                                                                } else if (index === values.length - 1) {
                                                                                    dispatch({
                                                                                        type: 'query',
                                                                                        payload: Y(['values', keyName, operator,
                                                                                            [...values.slice(0, index),
                                                                                            parseInt(event.target.value)
                                                                                            ]], parent)
                                                                                    })
                                                                                } else {
                                                                                    dispatch({
                                                                                        type: 'query',
                                                                                        payload: Y(['values', keyName, operator,
                                                                                            [...values.slice(0, index),
                                                                                            parseInt(event.target.value),
                                                                                            ...values.slice(index + 1, values.length)
                                                                                            ]], parent)
                                                                                    })
                                                                                }
                                                                            }} />
                                                                    )
                                                                })
                                                            }
                                                            <button onClick={async () => {
                                                                dispatch({
                                                                    type: 'query',
                                                                    payload: Y(['values', keyName, operator, [...values, 0]], parent)
                                                                })
                                                            }}
                                                                className="focus:outline-none">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                                                </svg>
                                                            </button>
                                                            <button onClick={async () => {
                                                                if (values.length !== 1) {
                                                                    dispatch({
                                                                        type: 'query',
                                                                        payload: Y(['values', keyName, operator, [...values.slice(0, values.length - 1)]], parent)
                                                                    })
                                                                }
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
                            </>)
                        }
                        case 'Decimal': {
                            return (<>
                                <Cell row={`${index + 2}/${index + 3}`} column="1/2">
                                    <Checkbox
                                        checked={value.checked}
                                        color='primary'
                                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                                        onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                            dispatch({
                                                type: 'query',
                                                payload: Y(['values', keyName, 'checked', event.target.checked], parent)
                                            })
                                        }}
                                    />
                                </Cell>
                                <Cell row={`${index + 2}/${index + 3}`} column="2/3">{keyName}</Cell>
                                <Cell row={`${index + 2}/${index + 3}`} column="3/4">
                                    <select value={value.operator}
                                        onChange={async (event) => {
                                            switch (event.target.value) {
                                                case 'lessThan':
                                                case 'lessThanEquals':
                                                case 'equals':
                                                case 'greaterThanEquals':
                                                case 'greaterThan': {
                                                    dispatch({
                                                        type: 'query',
                                                        payload: Y(['values', keyName, 'operator', event.target.value, 0], parent)
                                                    })
                                                    return
                                                }
                                                case 'between':
                                                case 'notBetween': {
                                                    dispatch({
                                                        type: 'query',
                                                        payload: Y(['values', keyName, 'operator', event.target.value, [0, 0]], parent)
                                                    })
                                                    return
                                                }
                                                case 'in': {
                                                    dispatch({
                                                        type: 'query',
                                                        payload: Y(['values', keyName, 'operator', event.target.value, [0]], parent)
                                                    })
                                                    return
                                                }
                                            }
                                        }}
                                    >
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
                                    {
                                        (() => {
                                            const operator = value.operator
                                            switch (operator) {
                                                case 'lessThan':
                                                case 'lessThanEquals':
                                                case 'equals':
                                                case 'greaterThanEquals':
                                                case 'greaterThan': {
                                                    return (<Input type='number' value={value.value as number}
                                                        onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                            dispatch({
                                                                type: 'query',
                                                                payload: Y(['values', keyName, operator, parseFloat(event.target.value)], parent)
                                                            })
                                                        }} />)
                                                }
                                                case 'between':
                                                case 'notBetween': {
                                                    return (
                                                        <>
                                                            <Input type='number' value={value.value[0]}
                                                                onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                                    dispatch({
                                                                        type: 'query',
                                                                        payload: Y(['values', keyName, operator, [parseFloat(event.target.value), value.value[1]]], parent)
                                                                    })
                                                                }} />
                                                            <Input type='number' value={value.value[1]}
                                                                onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                                    dispatch({
                                                                        type: 'query',
                                                                        payload: Y(['values', keyName, operator, [value.value[0], parseFloat(event.target.value)]], parent)
                                                                    })
                                                                }} />
                                                        </>
                                                    )
                                                }
                                                case 'in': {
                                                    if (value.operator === "in") {
                                                        const values = value.value
                                                        return (<>
                                                            {
                                                                value.value.map((v, index) => {
                                                                    return (
                                                                        <Input type='number' value={values[index]}
                                                                            onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                                                if (index === 0) {
                                                                                    dispatch({
                                                                                        type: 'query',
                                                                                        payload: Y(['values', keyName, operator,
                                                                                            [
                                                                                                parseFloat(event.target.value),
                                                                                                ...values.slice(index + 1, values.length)
                                                                                            ]], parent)
                                                                                    })
                                                                                } else if (index === values.length - 1) {
                                                                                    dispatch({
                                                                                        type: 'query',
                                                                                        payload: Y(['values', keyName, operator,
                                                                                            [...values.slice(0, index),
                                                                                            Number(event.target.value)
                                                                                            ]], parent)
                                                                                    })
                                                                                } else {
                                                                                    dispatch({
                                                                                        type: 'query',
                                                                                        payload: Y(['values', keyName, operator,
                                                                                            [...values.slice(0, index),
                                                                                            Number(event.target.value),
                                                                                            ...values.slice(index + 1, values.length)
                                                                                            ]], parent)
                                                                                    })
                                                                                }
                                                                            }} />
                                                                    )
                                                                })
                                                            }
                                                            <button onClick={async () => {
                                                                dispatch({
                                                                    type: 'query',
                                                                    payload: Y(['values', keyName, operator, [...values, 0]], parent)
                                                                })
                                                            }}
                                                                className="focus:outline-none">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                                                </svg>
                                                            </button>
                                                            <button onClick={async () => {
                                                                if (values.length !== 1) {
                                                                    dispatch({
                                                                        type: 'query',
                                                                        payload: Y(['values', keyName, operator, [...values.slice(0, values.length - 1)]], parent)
                                                                    })
                                                                }
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
                            </>)
                        }
                        case 'Boolean': {
                            return (<>
                                <Cell row={`${index + 2}/${index + 3}`} column="1/2">
                                    <Checkbox
                                        checked={value.checked}
                                        color='primary'
                                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                                        onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                            dispatch({
                                                type: 'query',
                                                payload: Y(['values', keyName, 'checked', event.target.checked], parent)
                                            })
                                        }}
                                    />
                                </Cell>
                                <Cell row={`${index + 2}/${index + 3}`} column="2/3">{keyName}</Cell>
                                <Cell row={`${index + 2}/${index + 3}`} column="3/4">
                                    <select defaultValue={value.operator}>
                                        <option value="equals">=</option>
                                    </select>
                                </Cell>
                                <Cell row={`${index + 2}/${index + 3}`} column="4/5">
                                    <Switch color='primary' checked={value.value} name='producable'
                                        onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                            dispatch({
                                                type: 'query',
                                                payload: Y(['values', keyName, 'equals', event.target.checked], parent)
                                            })
                                        }} />
                                </Cell>
                            </>)
                        }
                        case 'Date': {
                            return (<>
                                <Cell row={`${index + 2}/${index + 3}`} column="1/2">
                                    <Checkbox
                                        checked={value.checked}
                                        color='primary'
                                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                                        onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                            dispatch({
                                                type: 'query',
                                                payload: Y(['values', keyName, 'checked', event.target.checked], parent)
                                            })
                                        }}
                                    />
                                </Cell>
                                <Cell row={`${index + 2}/${index + 3}`} column="2/3">{keyName}</Cell>
                                <Cell row={`${index + 2}/${index + 3}`} column="3/4">
                                    <select value={value.operator}
                                        onChange={async (event) => {
                                            switch (event.target.value) {
                                                case 'lessThan':
                                                case 'lessThanEquals':
                                                case 'equals':
                                                case 'greaterThanEquals':
                                                case 'greaterThan': {
                                                    dispatch({
                                                        type: 'query',
                                                        payload: Y(['values', keyName, 'operator', event.target.value, Date.now()], parent)
                                                    })
                                                    return
                                                }
                                                case 'between':
                                                case 'notBetween': {
                                                    dispatch({
                                                        type: 'query',
                                                        payload: Y(['values', keyName, 'operator', event.target.value,
                                                            [new Date(new Date().setDate(new Date().getDate() - (new Date().getDay() === 6 ? 5 : (new Date().getDay() === 0 ? 6 : (new Date().getDay() === 1 ? 7 : 1))))).setHours(0, 0, 0), Date.now()]])
                                                    })
                                                    return
                                                }
                                                case 'in': {
                                                    dispatch({
                                                        type: 'query',
                                                        payload: Y(['values', keyName, 'operator', event.target.value, [Date.now()]], parent)
                                                    })
                                                    return
                                                }
                                            }
                                        }}
                                    >
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
                                    {
                                        (() => {
                                            const operator = value.operator
                                            switch (operator) {
                                                case 'lessThan':
                                                case 'lessThanEquals':
                                                case 'equals':
                                                case 'greaterThanEquals':
                                                case 'greaterThan': {
                                                    return (<Input type="date"
                                                        value={formatISO(toDate(value.value as number)).substr(0, 10)}
                                                        onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                            dispatch({
                                                                type: 'query',
                                                                payload: Y(['values', keyName, operator, getTime(parseISO(event.target.value))], parent)
                                                            })
                                                        }}
                                                    />)
                                                }
                                                case 'between':
                                                case 'notBetween': {
                                                    return (
                                                        <>
                                                            <Input type="date"
                                                                value={formatISO(toDate(value.value[0])).substr(0, 10)}
                                                                onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                                    dispatch({
                                                                        type: 'query',
                                                                        payload: Y(['values', keyName, operator, [getTime(parseISO(event.target.value)), value.value[1]]], parent)
                                                                    })
                                                                }} />
                                                            <Input type="date"
                                                                value={formatISO(toDate(value.value[1])).substr(0, 10)}
                                                                onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                                    dispatch({
                                                                        type: 'query',
                                                                        payload: Y(['values', keyName, operator, [value.value[0], getTime(parseISO(event.target.value))]], parent)
                                                                    })
                                                                }} />
                                                        </>
                                                    )
                                                }
                                                case 'in': {
                                                    if (value.operator === "in") {
                                                        const values = value.value
                                                        return (<>
                                                            {
                                                                value.value.map((v, index) => {
                                                                    return (
                                                                        <Input type="date"
                                                                            value={formatISO(toDate(values[index])).substr(0, 10)}
                                                                            onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                                                if (index === 0) {
                                                                                    dispatch({
                                                                                        type: 'query',
                                                                                        payload: Y(['values', keyName, operator,
                                                                                            [
                                                                                                getTime(parseISO(event.target.value)),
                                                                                                ...values.slice(index + 1, values.length)
                                                                                            ]], parent)
                                                                                    })
                                                                                } else if (index === values.length - 1) {
                                                                                    dispatch({
                                                                                        type: 'query',
                                                                                        payload: Y(['values', keyName, operator,
                                                                                            [...values.slice(0, index),
                                                                                            getTime(parseISO(event.target.value))
                                                                                            ]], parent)
                                                                                    })
                                                                                } else {
                                                                                    dispatch({
                                                                                        type: 'query',
                                                                                        payload: Y(['values', keyName, operator,
                                                                                            [...values.slice(0, index),
                                                                                            getTime(parseISO(event.target.value)),
                                                                                            ...values.slice(index + 1, values.length)
                                                                                            ]], parent)
                                                                                    })
                                                                                }
                                                                            }} />
                                                                    )
                                                                })
                                                            }
                                                            <button onClick={async () => {
                                                                dispatch({
                                                                    type: 'query',
                                                                    payload: Y(['values', keyName, operator, [...values, getTime(new Date())]], parent)
                                                                })
                                                            }}
                                                                className="focus:outline-none">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                                                </svg>
                                                            </button>
                                                            <button onClick={async () => {
                                                                if (values.length !== 1) {
                                                                    dispatch({
                                                                        type: 'query',
                                                                        payload: Y(['values', keyName, operator, [...values.slice(0, values.length - 1)]], parent)
                                                                    })
                                                                }
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
                            </>)
                        }
                        case 'Timestamp': {
                            return (<>
                                <Cell row={`${index + 2}/${index + 3}`} column="1/2">
                                    <Checkbox
                                        checked={value.checked}
                                        color='primary'
                                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                                        onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                            dispatch({
                                                type: 'query',
                                                payload: Y(['values', keyName, 'checked', event.target.checked], parent)
                                            })
                                        }}
                                    />
                                </Cell>
                                <Cell row={`${index + 2}/${index + 3}`} column="2/3">{keyName}</Cell>
                                <Cell row={`${index + 2}/${index + 3}`} column="3/4">
                                    <select value={value.operator}
                                        onChange={async (event) => {
                                            switch (event.target.value) {
                                                case 'lessThan':
                                                case 'lessThanEquals':
                                                case 'equals':
                                                case 'greaterThanEquals':
                                                case 'greaterThan': {
                                                    dispatch({
                                                        type: 'query',
                                                        payload: Y(['values', keyName, 'operator', event.target.value, Date.now()], parent)
                                                    })
                                                    return
                                                }
                                                case 'between':
                                                case 'notBetween': {
                                                    dispatch({
                                                        type: 'query',
                                                        payload: Y(['values', keyName, 'operator', event.target.value,
                                                            [new Date(new Date().setDate(new Date().getDate() - (new Date().getDay() === 6 ? 5 : (new Date().getDay() === 0 ? 6 : (new Date().getDay() === 1 ? 7 : 1))))).setHours(0, 0, 0), Date.now()]])
                                                    })
                                                    return
                                                }
                                                case 'in': {
                                                    dispatch({
                                                        type: 'query',
                                                        payload: Y(['values', keyName, 'operator', event.target.value, [Date.now()]], parent)
                                                    })
                                                    return
                                                }
                                            }
                                        }}
                                    >
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
                                    {
                                        (() => {
                                            const operator = value.operator
                                            switch (operator) {
                                                case 'lessThan':
                                                case 'lessThanEquals':
                                                case 'equals':
                                                case 'greaterThanEquals':
                                                case 'greaterThan': {
                                                    return (<Input type="datetime-local"
                                                        value={formatISO(toDate(value.value as number)).substr(0, 16)}
                                                        onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                            dispatch({
                                                                type: 'query',
                                                                payload: Y(['values', keyName, operator, getTime(parseISO(event.target.value))], parent)
                                                            })
                                                        }}
                                                    />)
                                                }
                                                case 'between':
                                                case 'notBetween': {
                                                    return (
                                                        <>
                                                            <Input type="datetime-local"
                                                                value={formatISO(toDate(value.value[0])).substr(0, 16)}
                                                                onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                                    dispatch({
                                                                        type: 'query',
                                                                        payload: Y(['values', keyName, operator, [getTime(parseISO(event.target.value)), value.value[1]]], parent)
                                                                    })
                                                                }} />
                                                            <Input type="datetime-local"
                                                                value={formatISO(toDate(value.value[1])).substr(0, 16)}
                                                                onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                                    dispatch({
                                                                        type: 'query',
                                                                        payload: Y(['values', keyName, operator, [value.value[0], getTime(parseISO(event.target.value))]], parent)
                                                                    })
                                                                }} />
                                                        </>
                                                    )
                                                }
                                                case 'in': {
                                                    if (value.operator === "in") {
                                                        const values = value.value
                                                        return (<>
                                                            {
                                                                value.value.map((v, index) => {
                                                                    return (
                                                                        <Input type="datetime-local"
                                                                            value={formatISO(toDate(values[index])).substr(0, 16)}
                                                                            onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                                                if (index === 0) {
                                                                                    dispatch({
                                                                                        type: 'query',
                                                                                        payload: Y(['values', keyName, operator,
                                                                                            [
                                                                                                getTime(parseISO(event.target.value)),
                                                                                                ...values.slice(index + 1, values.length)
                                                                                            ]], parent)
                                                                                    })
                                                                                } else if (index === values.length - 1) {
                                                                                    dispatch({
                                                                                        type: 'query',
                                                                                        payload: Y(['values', keyName, operator,
                                                                                            [...values.slice(0, index),
                                                                                            getTime(parseISO(event.target.value))
                                                                                            ]], parent)
                                                                                    })
                                                                                } else {
                                                                                    dispatch({
                                                                                        type: 'query',
                                                                                        payload: Y(['values', keyName, operator,
                                                                                            [...values.slice(0, index),
                                                                                            getTime(parseISO(event.target.value)),
                                                                                            ...values.slice(index + 1, values.length)
                                                                                            ]], parent)
                                                                                    })
                                                                                }
                                                                            }} />
                                                                    )
                                                                })
                                                            }
                                                            <button onClick={async () => {
                                                                dispatch({
                                                                    type: 'query',
                                                                    payload: Y(['values', keyName, operator, [...values, getTime(new Date())]], parent)
                                                                })
                                                            }}
                                                                className="focus:outline-none">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                                                </svg>
                                                            </button>
                                                            <button onClick={async () => {
                                                                if (values.length !== 1) {
                                                                    dispatch({
                                                                        type: 'query',
                                                                        payload: Y(['values', keyName, operator, [...values.slice(0, values.length - 1)]], parent)
                                                                    })
                                                                }
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
                            </>)
                        }
                        case 'Time': {
                            return (<>
                                <Cell row={`${index + 2}/${index + 3}`} column="1/2">
                                    <Checkbox
                                        checked={value.checked}
                                        color='primary'
                                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                                        onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                            dispatch({
                                                type: 'query',
                                                payload: Y(['values', keyName, 'checked', event.target.checked], parent)
                                            })
                                        }}
                                    />
                                </Cell>
                                <Cell row={`${index + 2}/${index + 3}`} column="2/3">{keyName}</Cell>
                                <Cell row={`${index + 2}/${index + 3}`} column="3/6">{keyName}</Cell>
                                <Cell row={`${index + 2}/${index + 3}`} column="3/4">
                                    <select value={value.operator}
                                        onChange={async (event) => {
                                            switch (event.target.value) {
                                                case 'lessThan':
                                                case 'lessThanEquals':
                                                case 'equals':
                                                case 'greaterThanEquals':
                                                case 'greaterThan': {
                                                    dispatch({
                                                        type: 'query',
                                                        payload: Y(['values', keyName, 'operator', event.target.value, Date.now()], parent)
                                                    })
                                                    return
                                                }
                                                case 'between':
                                                case 'notBetween': {
                                                    dispatch({
                                                        type: 'query',
                                                        payload: Y(['values', keyName, 'operator', event.target.value,
                                                            [new Date(new Date().setDate(new Date().getDate() - (new Date().getDay() === 6 ? 5 : (new Date().getDay() === 0 ? 6 : (new Date().getDay() === 1 ? 7 : 1))))).setHours(0, 0, 0), Date.now()]])
                                                    })
                                                    return
                                                }
                                                case 'in': {
                                                    dispatch({
                                                        type: 'query',
                                                        payload: Y(['values', keyName, 'operator', event.target.value, [Date.now()]], parent)
                                                    })
                                                    return
                                                }
                                            }
                                        }}
                                    >
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
                                    {
                                        (() => {
                                            const operator = value.operator
                                            switch (operator) {
                                                case 'lessThan':
                                                case 'lessThanEquals':
                                                case 'equals':
                                                case 'greaterThanEquals':
                                                case 'greaterThan': {
                                                    return (<Input type="time"
                                                        value={formatISO(toDate(value.value as number)).substr(11, 5)}
                                                        onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                            dispatch({
                                                                type: 'query',
                                                                payload: Y(['values', keyName, operator, getTime(parse(event.target.value, 'HH:mm', new Date()))], parent)
                                                            })
                                                        }}
                                                    />)
                                                }
                                                case 'between':
                                                case 'notBetween': {
                                                    return (
                                                        <>
                                                            <Input type="time"
                                                                value={formatISO(toDate(value.value[0])).substr(11, 5)}
                                                                onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                                    dispatch({
                                                                        type: 'query',
                                                                        payload: Y(['values', keyName, operator, [getTime(parse(event.target.value, 'HH:mm', new Date())), value.value[1]]], parent)
                                                                    })
                                                                }} />
                                                            <Input type="time"
                                                                value={formatISO(toDate(value.value[1])).substr(11, 5)}
                                                                onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                                    dispatch({
                                                                        type: 'query',
                                                                        payload: Y(['values', keyName, operator, [value.value[0], getTime(parse(event.target.value, 'HH:mm', new Date()))]], parent)
                                                                    })
                                                                }} />
                                                        </>
                                                    )
                                                }
                                                case 'in': {
                                                    if (value.operator === "in") {
                                                        const values = value.value
                                                        return (<>
                                                            {
                                                                value.value.map((v, index) => {
                                                                    return (
                                                                        <Input type="time"
                                                                            value={formatISO(toDate(values[index])).substr(11, 5)}
                                                                            onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                                                if (index === 0) {
                                                                                    dispatch({
                                                                                        type: 'query',
                                                                                        payload: Y(['values', keyName, operator,
                                                                                            [
                                                                                                getTime(parse(event.target.value, 'HH:mm', new Date())),
                                                                                                ...values.slice(index + 1, values.length)
                                                                                            ]], parent)
                                                                                    })
                                                                                } else if (index === values.length - 1) {
                                                                                    dispatch({
                                                                                        type: 'query',
                                                                                        payload: Y(['values', keyName, operator,
                                                                                            [...values.slice(0, index),
                                                                                            getTime(parse(event.target.value, 'HH:mm', new Date()))
                                                                                            ]], parent)
                                                                                    })
                                                                                } else {
                                                                                    dispatch({
                                                                                        type: 'query',
                                                                                        payload: Y(['values', keyName, operator,
                                                                                            [...values.slice(0, index),
                                                                                            getTime(parse(event.target.value, 'HH:mm', new Date())),
                                                                                            ...values.slice(index + 1, values.length)
                                                                                            ]], parent)
                                                                                    })
                                                                                }
                                                                            }} />
                                                                    )
                                                                })
                                                            }
                                                            <button onClick={async () => {
                                                                dispatch({
                                                                    type: 'query',
                                                                    payload: Y(['values', keyName, operator, [...values, getTime(new Date())]], parent)
                                                                })
                                                            }}
                                                                className="focus:outline-none">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                                                </svg>
                                                            </button>
                                                            <button onClick={async () => {
                                                                if (values.length !== 1) {
                                                                    dispatch({
                                                                        type: 'query',
                                                                        payload: Y(['values', keyName, operator, [...values.slice(0, values.length - 1)]], parent)
                                                                    })
                                                                }
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
                            </>)
                        }
                    }
                } else {
                    return (<>
                        <Cell row={`${index + 2}/${index + 3}`} column="1/2">
                            <Checkbox
                                checked={value.checked}
                                color='primary'
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                                onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                    dispatch({
                                        type: 'query',
                                        payload: Y(['values', keyName, 'checked', event.target.checked], parent)
                                    })
                                }}
                            />
                        </Cell>
                        <Cell row={`${index + 2}/${index + 3}`} column="2/3">{keyName}</Cell>
                        <Cell row={`${index + 2}/${index + 3}`} column="3/5">
                            {
                                getFilter(value.value, dispatch, parent ? T(parent, keyName) : ['values', keyName, undefined])
                            }
                        </Cell>
                    </>)
                }
                return []
            })
        }
    </TableContainer>)
}
