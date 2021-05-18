import { evaluateExpression, LispExpression, Symbols, SymbolValue } from "./lisp"
import { getState } from "./store"
import { PrimitiveType, NonPrimitiveType, types, Key } from './types'
import { getVariableName, } from "./variables"

type FunctionInput =
    | {
        type: 'Text'
        default?: string
    }
    | {
        type: 'Number' | 'Decimal' | 'Date' | 'Timestamp' | 'Time'
        default?: number
    }
    | {
        type: 'Boolean'
        default?: boolean
    }
    | {
        type: NonPrimitiveType
        default?: string
        variableName?: LispExpression
        values?: { [index: string]: LispExpression }
    }

type FunctionOutput =
    {
        type: PrimitiveType
        value: LispExpression
    }
    | {
        op: 'create' | 'update' | 'delete'
        type: NonPrimitiveType
        variableName: LispExpression
        values: { [index: string]: LispExpression }
    }

type Function = {
    inputs: { [index: string]: FunctionInput }
    outputs: { [index: string]: FunctionOutput }
}

type Functions = { [index: string]: Function }

export const functions: Functions = {
    add: {
        inputs: {
            a: {
                type: 'Number',
                default: 2
            },
            b: {
                type: 'Decimal',
                default: 3.14
            }
        },
        outputs: {
            c: {
                type: 'Number',
                value: {
                    expectedReturnType: 'Number',
                    op: '+',
                    types: ['Number', 'Decimal'],
                    args: [{
                        op: '.',
                        types: [],
                        args: ['a']
                    }, {
                        op: '.',
                        types: [],
                        args: ['b']
                    }]
                }
            },
            d: {
                type: 'Decimal',
                value: {
                    expectedReturnType: 'Decimal',
                    op: '*',
                    types: ['Number', 'Decimal'],
                    args: [{
                        op: '.',
                        types: [],
                        args: ['a']
                    }, {
                        op: '.',
                        types: [],
                        args: ['b']
                    }]
                }
            }
        }
    }
}

function getSymbolPaths(expression: LispExpression): Array<ReadonlyArray<string>> {
    var symbolPaths: Array<ReadonlyArray<string>> = []
    expression.args.forEach(arg => {
        if (typeof arg === 'object') {
            if (arg.op === '.') {
                symbolPaths.push(arg.args)
            } else {
                getSymbolPaths(arg).forEach(x => {
                    symbolPaths.push(x)
                })
            }
        }
    })
    return symbolPaths
}

function getSymbolPathsForFunctionInput(fi: FunctionInput): Array<ReadonlyArray<string>> {
    const symbolPaths: Array<ReadonlyArray<string>> = []
    switch (fi.type) {
        case 'Text':
        case 'Number':
        case 'Decimal':
        case 'Boolean':
        case 'Date':
        case 'Timestamp':
        case 'Time': {
            break
        }
        default: {
            if (fi.variableName !== undefined) {
                getSymbolPaths(fi.variableName).forEach(x => symbolPaths.push(x))
            }
            const type = types[fi.type]
            Object.keys(type).forEach(keyName => {
                if (fi.values !== undefined) {
                    if (keyName in fi.values) {
                        const valueExpression = fi.values[keyName]
                        getSymbolPaths(valueExpression).forEach(x => symbolPaths.push(x))
                    }
                }
            })
            break
        }
    }
    return symbolPaths
}

function getSymbolPathsForFunctionOutput(fo: FunctionOutput): Array<ReadonlyArray<string>> {
    const symbolPaths: Array<ReadonlyArray<string>> = []
    switch (fo.type) {
        case 'Text':
        case 'Number':
        case 'Decimal':
        case 'Boolean':
        case 'Date':
        case 'Timestamp':
        case 'Time': {
            getSymbolPaths(fo.value).forEach(x => symbolPaths.push(x))
            break
        }
        default: {
            getSymbolPaths(fo.variableName).forEach(x => symbolPaths.push(x))
            const type = types[fo.type]
            Object.keys(type).forEach(keyName => {
                if (fo.values !== undefined) {
                    if (keyName in fo.values) {
                        const valueExpression = fo.values[keyName]
                        getSymbolPaths(valueExpression).forEach(x => symbolPaths.push(x))
                    }
                }
            })
            break
        }
    }
    return symbolPaths
}

function getSymbolPathsForFunction(fx: Function): Array<ReadonlyArray<string>> {
    const symbolPaths: Array<ReadonlyArray<string>> = []
    Object.keys(fx.inputs).forEach(inputName => {
        const fi = fx.inputs[inputName]
        getSymbolPathsForFunctionInput(fi).forEach(x => symbolPaths.push(x))
    })
    Object.keys(fx.outputs).forEach(outputName => {
        const fo = fx.outputs[outputName]
        getSymbolPathsForFunctionOutput(fo).forEach(x => symbolPaths.push(x))
    })
    return symbolPaths
}


function getSymbols(symbolPaths: Array<Array<string>>, typeName: NonPrimitiveType, variableName: string): SymbolValue {
    const type = types[typeName]
    const symbolValue: SymbolValue = {
        type: 'Text',
        value: variableName
    }
    if (symbolPaths.length !== 0) {
        symbolValue.values = {}
        switch (typeName) {
            case 'Product': {
                const variables = getState().variables[typeName].filter(x => getVariableName(x) === variableName)
                if (variables.length() === 1) {
                    Object.keys(type).forEach(keyName => {
                        if (symbolPaths.filter(x => x[0] === keyName)) {
                            const key: Key = type[keyName]
                            if (symbolValue['values'] !== undefined) {
                                switch (key.type) {
                                    case 'Text': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Number':
                                    case 'Date':
                                    case 'Timestamp':
                                    case 'Time': {
                                        symbolValue.values[keyName] = {
                                            type: 'Number',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Decimal': {
                                        symbolValue.values[keyName] = {
                                            type: 'Decimal',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Boolean': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    default: {
                                        symbolValue.values[keyName] = getSymbols(symbolPaths.filter(x => x[0] === keyName).map(x => x.slice(1)),
                                            key.type,
                                            getVariableName(variables[0].values[keyName]))
                                    }
                                }
                            }
                        }
                    })
                } else {

                }
                break
            }
            case 'UOM': {
                const variables = getState().variables[typeName].filter(x => getVariableName(x) === variableName)
                if (variables.length() === 1) {
                    Object.keys(type).forEach(keyName => {
                        if (symbolPaths.filter(x => x[0] === keyName)) {
                            const key: Key = type[keyName]
                            if (symbolValue['values'] !== undefined) {
                                switch (key.type) {
                                    case 'Text': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Number':
                                    case 'Date':
                                    case 'Timestamp':
                                    case 'Time': {
                                        symbolValue.values[keyName] = {
                                            type: 'Number',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Decimal': {
                                        symbolValue.values[keyName] = {
                                            type: 'Decimal',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Boolean': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    default: {
                                        symbolValue.values[keyName] = getSymbols(symbolPaths.filter(x => x[0] === keyName).map(x => x.slice(1)),
                                            key.type,
                                            getVariableName(variables[0].values[keyName]))
                                    }
                                }
                            }
                        }
                    })
                } else {

                }
                break
            }
            case 'Indent': {
                const variables = getState().variables[typeName].filter(x => getVariableName(x) === variableName)
                if (variables.length() === 1) {
                    Object.keys(type).forEach(keyName => {
                        if (symbolPaths.filter(x => x[0] === keyName)) {
                            const key: Key = type[keyName]
                            if (symbolValue['values'] !== undefined) {
                                switch (key.type) {
                                    case 'Text': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Number':
                                    case 'Date':
                                    case 'Timestamp':
                                    case 'Time': {
                                        symbolValue.values[keyName] = {
                                            type: 'Number',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Decimal': {
                                        symbolValue.values[keyName] = {
                                            type: 'Decimal',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Boolean': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    default: {
                                        symbolValue.values[keyName] = getSymbols(symbolPaths.filter(x => x[0] === keyName).map(x => x.slice(1)),
                                            key.type,
                                            getVariableName(variables[0].values[keyName]))
                                    }
                                }
                            }
                        }
                    })
                } else {

                }
                break
            }
            case 'IndentItem': {
                const variables = getState().variables[typeName].filter(x => getVariableName(x) === variableName)
                if (variables.length() === 1) {
                    Object.keys(type).forEach(keyName => {
                        if (symbolPaths.filter(x => x[0] === keyName)) {
                            const key: Key = type[keyName]
                            if (symbolValue['values'] !== undefined) {
                                switch (key.type) {
                                    case 'Text': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Number':
                                    case 'Date':
                                    case 'Timestamp':
                                    case 'Time': {
                                        symbolValue.values[keyName] = {
                                            type: 'Number',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Decimal': {
                                        symbolValue.values[keyName] = {
                                            type: 'Decimal',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Boolean': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    default: {
                                        symbolValue.values[keyName] = getSymbols(symbolPaths.filter(x => x[0] === keyName).map(x => x.slice(1)),
                                            key.type,
                                            getVariableName(variables[0].values[keyName]))
                                    }
                                }
                            }
                        }
                    })
                } else {

                }
                break
            }
            case 'Supplier': {
                const variables = getState().variables[typeName].filter(x => getVariableName(x) === variableName)
                if (variables.length() === 1) {
                    Object.keys(type).forEach(keyName => {
                        if (symbolPaths.filter(x => x[0] === keyName)) {
                            const key: Key = type[keyName]
                            if (symbolValue['values'] !== undefined) {
                                switch (key.type) {
                                    case 'Text': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Number':
                                    case 'Date':
                                    case 'Timestamp':
                                    case 'Time': {
                                        symbolValue.values[keyName] = {
                                            type: 'Number',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Decimal': {
                                        symbolValue.values[keyName] = {
                                            type: 'Decimal',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Boolean': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    default: {
                                        symbolValue.values[keyName] = getSymbols(symbolPaths.filter(x => x[0] === keyName).map(x => x.slice(1)),
                                            key.type,
                                            getVariableName(variables[0].values[keyName]))
                                    }
                                }
                            }
                        }
                    })
                } else {

                }
                break
            }
            case 'SupplierProduct': {
                const variables = getState().variables[typeName].filter(x => getVariableName(x) === variableName)
                if (variables.length() === 1) {
                    Object.keys(type).forEach(keyName => {
                        if (symbolPaths.filter(x => x[0] === keyName)) {
                            const key: Key = type[keyName]
                            if (symbolValue['values'] !== undefined) {
                                switch (key.type) {
                                    case 'Text': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Number':
                                    case 'Date':
                                    case 'Timestamp':
                                    case 'Time': {
                                        symbolValue.values[keyName] = {
                                            type: 'Number',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Decimal': {
                                        symbolValue.values[keyName] = {
                                            type: 'Decimal',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Boolean': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    default: {
                                        symbolValue.values[keyName] = getSymbols(symbolPaths.filter(x => x[0] === keyName).map(x => x.slice(1)),
                                            key.type,
                                            getVariableName(variables[0].values[keyName]))
                                    }
                                }
                            }
                        }
                    })
                } else {

                }
                break
            }
            case 'Quotation': {
                const variables = getState().variables[typeName].filter(x => getVariableName(x) === variableName)
                if (variables.length() === 1) {
                    Object.keys(type).forEach(keyName => {
                        if (symbolPaths.filter(x => x[0] === keyName)) {
                            const key: Key = type[keyName]
                            if (symbolValue['values'] !== undefined) {
                                switch (key.type) {
                                    case 'Text': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Number':
                                    case 'Date':
                                    case 'Timestamp':
                                    case 'Time': {
                                        symbolValue.values[keyName] = {
                                            type: 'Number',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Decimal': {
                                        symbolValue.values[keyName] = {
                                            type: 'Decimal',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Boolean': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    default: {
                                        symbolValue.values[keyName] = getSymbols(symbolPaths.filter(x => x[0] === keyName).map(x => x.slice(1)),
                                            key.type,
                                            getVariableName(variables[0].values[keyName]))
                                    }
                                }
                            }
                        }
                    })
                } else {

                }
                break
            }
            case 'QuotationItem': {
                const variables = getState().variables[typeName].filter(x => getVariableName(x) === variableName)
                if (variables.length() === 1) {
                    Object.keys(type).forEach(keyName => {
                        if (symbolPaths.filter(x => x[0] === keyName)) {
                            const key: Key = type[keyName]
                            if (symbolValue['values'] !== undefined) {
                                switch (key.type) {
                                    case 'Text': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Number':
                                    case 'Date':
                                    case 'Timestamp':
                                    case 'Time': {
                                        symbolValue.values[keyName] = {
                                            type: 'Number',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Decimal': {
                                        symbolValue.values[keyName] = {
                                            type: 'Decimal',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Boolean': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    default: {
                                        symbolValue.values[keyName] = getSymbols(symbolPaths.filter(x => x[0] === keyName).map(x => x.slice(1)),
                                            key.type,
                                            getVariableName(variables[0].values[keyName]))
                                    }
                                }
                            }
                        }
                    })
                } else {

                }
                break
            }
            case 'PurchaseOrder': {
                const variables = getState().variables[typeName].filter(x => getVariableName(x) === variableName)
                if (variables.length() === 1) {
                    Object.keys(type).forEach(keyName => {
                        if (symbolPaths.filter(x => x[0] === keyName)) {
                            const key: Key = type[keyName]
                            if (symbolValue['values'] !== undefined) {
                                switch (key.type) {
                                    case 'Text': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Number':
                                    case 'Date':
                                    case 'Timestamp':
                                    case 'Time': {
                                        symbolValue.values[keyName] = {
                                            type: 'Number',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Decimal': {
                                        symbolValue.values[keyName] = {
                                            type: 'Decimal',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Boolean': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    default: {
                                        symbolValue.values[keyName] = getSymbols(symbolPaths.filter(x => x[0] === keyName).map(x => x.slice(1)),
                                            key.type,
                                            getVariableName(variables[0].values[keyName]))
                                    }
                                }
                            }
                        }
                    })
                } else {

                }
                break
            }
            case 'PurchaseOrderItem': {
                const variables = getState().variables[typeName].filter(x => getVariableName(x) === variableName)
                if (variables.length() === 1) {
                    Object.keys(type).forEach(keyName => {
                        if (symbolPaths.filter(x => x[0] === keyName)) {
                            const key: Key = type[keyName]
                            if (symbolValue['values'] !== undefined) {
                                switch (key.type) {
                                    case 'Text': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Number':
                                    case 'Date':
                                    case 'Timestamp':
                                    case 'Time': {
                                        symbolValue.values[keyName] = {
                                            type: 'Number',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Decimal': {
                                        symbolValue.values[keyName] = {
                                            type: 'Decimal',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Boolean': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    default: {
                                        symbolValue.values[keyName] = getSymbols(symbolPaths.filter(x => x[0] === keyName).map(x => x.slice(1)),
                                            key.type,
                                            getVariableName(variables[0].values[keyName]))
                                    }
                                }
                            }
                        }
                    })
                } else {

                }
                break
            }
            case 'PurchaseInvoice': {
                const variables = getState().variables[typeName].filter(x => getVariableName(x) === variableName)
                if (variables.length() === 1) {
                    Object.keys(type).forEach(keyName => {
                        if (symbolPaths.filter(x => x[0] === keyName)) {
                            const key: Key = type[keyName]
                            if (symbolValue['values'] !== undefined) {
                                switch (key.type) {
                                    case 'Text': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Number':
                                    case 'Date':
                                    case 'Timestamp':
                                    case 'Time': {
                                        symbolValue.values[keyName] = {
                                            type: 'Number',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Decimal': {
                                        symbolValue.values[keyName] = {
                                            type: 'Decimal',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Boolean': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    default: {
                                        symbolValue.values[keyName] = getSymbols(symbolPaths.filter(x => x[0] === keyName).map(x => x.slice(1)),
                                            key.type,
                                            getVariableName(variables[0].values[keyName]))
                                    }
                                }
                            }
                        }
                    })
                } else {

                }
                break
            }
            case 'PurchaseInvoiceItem': {
                const variables = getState().variables[typeName].filter(x => getVariableName(x) === variableName)
                if (variables.length() === 1) {
                    Object.keys(type).forEach(keyName => {
                        if (symbolPaths.filter(x => x[0] === keyName)) {
                            const key: Key = type[keyName]
                            if (symbolValue['values'] !== undefined) {
                                switch (key.type) {
                                    case 'Text': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Number':
                                    case 'Date':
                                    case 'Timestamp':
                                    case 'Time': {
                                        symbolValue.values[keyName] = {
                                            type: 'Number',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Decimal': {
                                        symbolValue.values[keyName] = {
                                            type: 'Decimal',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Boolean': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    default: {
                                        symbolValue.values[keyName] = getSymbols(symbolPaths.filter(x => x[0] === keyName).map(x => x.slice(1)),
                                            key.type,
                                            getVariableName(variables[0].values[keyName]))
                                    }
                                }
                            }
                        }
                    })
                } else {

                }
                break
            }
            case 'MaterialApprovalSlip': {
                const variables = getState().variables[typeName].filter(x => getVariableName(x) === variableName)
                if (variables.length() === 1) {
                    Object.keys(type).forEach(keyName => {
                        if (symbolPaths.filter(x => x[0] === keyName)) {
                            const key: Key = type[keyName]
                            if (symbolValue['values'] !== undefined) {
                                switch (key.type) {
                                    case 'Text': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Number':
                                    case 'Date':
                                    case 'Timestamp':
                                    case 'Time': {
                                        symbolValue.values[keyName] = {
                                            type: 'Number',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Decimal': {
                                        symbolValue.values[keyName] = {
                                            type: 'Decimal',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Boolean': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    default: {
                                        symbolValue.values[keyName] = getSymbols(symbolPaths.filter(x => x[0] === keyName).map(x => x.slice(1)),
                                            key.type,
                                            getVariableName(variables[0].values[keyName]))
                                    }
                                }
                            }
                        }
                    })
                } else {

                }
                break
            }
            case 'MaterialApprovalSlipItem': {
                const variables = getState().variables[typeName].filter(x => getVariableName(x) === variableName)
                if (variables.length() === 1) {
                    Object.keys(type).forEach(keyName => {
                        if (symbolPaths.filter(x => x[0] === keyName)) {
                            const key: Key = type[keyName]
                            if (symbolValue['values'] !== undefined) {
                                switch (key.type) {
                                    case 'Text': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Number':
                                    case 'Date':
                                    case 'Timestamp':
                                    case 'Time': {
                                        symbolValue.values[keyName] = {
                                            type: 'Number',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Decimal': {
                                        symbolValue.values[keyName] = {
                                            type: 'Decimal',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Boolean': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    default: {
                                        symbolValue.values[keyName] = getSymbols(symbolPaths.filter(x => x[0] === keyName).map(x => x.slice(1)),
                                            key.type,
                                            getVariableName(variables[0].values[keyName]))
                                    }
                                }
                            }
                        }
                    })
                } else {

                }
                break
            }
            case 'MaterialRejectionSlip': {
                const variables = getState().variables[typeName].filter(x => getVariableName(x) === variableName)
                if (variables.length() === 1) {
                    Object.keys(type).forEach(keyName => {
                        if (symbolPaths.filter(x => x[0] === keyName)) {
                            const key: Key = type[keyName]
                            if (symbolValue['values'] !== undefined) {
                                switch (key.type) {
                                    case 'Text': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Number':
                                    case 'Date':
                                    case 'Timestamp':
                                    case 'Time': {
                                        symbolValue.values[keyName] = {
                                            type: 'Number',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Decimal': {
                                        symbolValue.values[keyName] = {
                                            type: 'Decimal',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Boolean': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    default: {
                                        symbolValue.values[keyName] = getSymbols(symbolPaths.filter(x => x[0] === keyName).map(x => x.slice(1)),
                                            key.type,
                                            getVariableName(variables[0].values[keyName]))
                                    }
                                }
                            }
                        }
                    })
                } else {

                }
                break
            }
            case 'MaterialRejectionSlipItem': {
                const variables = getState().variables[typeName].filter(x => getVariableName(x) === variableName)
                if (variables.length() === 1) {
                    Object.keys(type).forEach(keyName => {
                        if (symbolPaths.filter(x => x[0] === keyName)) {
                            const key: Key = type[keyName]
                            if (symbolValue['values'] !== undefined) {
                                switch (key.type) {
                                    case 'Text': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Number':
                                    case 'Date':
                                    case 'Timestamp':
                                    case 'Time': {
                                        symbolValue.values[keyName] = {
                                            type: 'Number',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Decimal': {
                                        symbolValue.values[keyName] = {
                                            type: 'Decimal',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Boolean': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    default: {
                                        symbolValue.values[keyName] = getSymbols(symbolPaths.filter(x => x[0] === keyName).map(x => x.slice(1)),
                                            key.type,
                                            getVariableName(variables[0].values[keyName]))
                                    }
                                }
                            }
                        }
                    })
                } else {

                }
                break
            }
            case 'MaterialReturnSlip': {
                const variables = getState().variables[typeName].filter(x => getVariableName(x) === variableName)
                if (variables.length() === 1) {
                    Object.keys(type).forEach(keyName => {
                        if (symbolPaths.filter(x => x[0] === keyName)) {
                            const key: Key = type[keyName]
                            if (symbolValue['values'] !== undefined) {
                                switch (key.type) {
                                    case 'Text': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Number':
                                    case 'Date':
                                    case 'Timestamp':
                                    case 'Time': {
                                        symbolValue.values[keyName] = {
                                            type: 'Number',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Decimal': {
                                        symbolValue.values[keyName] = {
                                            type: 'Decimal',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Boolean': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    default: {
                                        symbolValue.values[keyName] = getSymbols(symbolPaths.filter(x => x[0] === keyName).map(x => x.slice(1)),
                                            key.type,
                                            getVariableName(variables[0].values[keyName]))
                                    }
                                }
                            }
                        }
                    })
                } else {

                }
                break
            }
            case 'MaterialReturnSlipItem': {
                const variables = getState().variables[typeName].filter(x => getVariableName(x) === variableName)
                if (variables.length() === 1) {
                    Object.keys(type).forEach(keyName => {
                        if (symbolPaths.filter(x => x[0] === keyName)) {
                            const key: Key = type[keyName]
                            if (symbolValue['values'] !== undefined) {
                                switch (key.type) {
                                    case 'Text': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Number':
                                    case 'Date':
                                    case 'Timestamp':
                                    case 'Time': {
                                        symbolValue.values[keyName] = {
                                            type: 'Number',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Decimal': {
                                        symbolValue.values[keyName] = {
                                            type: 'Decimal',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Boolean': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    default: {
                                        symbolValue.values[keyName] = getSymbols(symbolPaths.filter(x => x[0] === keyName).map(x => x.slice(1)),
                                            key.type,
                                            getVariableName(variables[0].values[keyName]))
                                    }
                                }
                            }
                        }
                    })
                } else {

                }
                break
            }
            case 'MaterialRequistionSlip': {
                const variables = getState().variables[typeName].filter(x => getVariableName(x) === variableName)
                if (variables.length() === 1) {
                    Object.keys(type).forEach(keyName => {
                        if (symbolPaths.filter(x => x[0] === keyName)) {
                            const key: Key = type[keyName]
                            if (symbolValue['values'] !== undefined) {
                                switch (key.type) {
                                    case 'Text': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Number':
                                    case 'Date':
                                    case 'Timestamp':
                                    case 'Time': {
                                        symbolValue.values[keyName] = {
                                            type: 'Number',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Decimal': {
                                        symbolValue.values[keyName] = {
                                            type: 'Decimal',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Boolean': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    default: {
                                        symbolValue.values[keyName] = getSymbols(symbolPaths.filter(x => x[0] === keyName).map(x => x.slice(1)),
                                            key.type,
                                            getVariableName(variables[0].values[keyName]))
                                    }
                                }
                            }
                        }
                    })
                } else {

                }
                break
            }
            case 'MaterialRequistionSlipItem': {
                const variables = getState().variables[typeName].filter(x => getVariableName(x) === variableName)
                if (variables.length() === 1) {
                    Object.keys(type).forEach(keyName => {
                        if (symbolPaths.filter(x => x[0] === keyName)) {
                            const key: Key = type[keyName]
                            if (symbolValue['values'] !== undefined) {
                                switch (key.type) {
                                    case 'Text': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Number':
                                    case 'Date':
                                    case 'Timestamp':
                                    case 'Time': {
                                        symbolValue.values[keyName] = {
                                            type: 'Number',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Decimal': {
                                        symbolValue.values[keyName] = {
                                            type: 'Decimal',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Boolean': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    default: {
                                        symbolValue.values[keyName] = getSymbols(symbolPaths.filter(x => x[0] === keyName).map(x => x.slice(1)),
                                            key.type,
                                            getVariableName(variables[0].values[keyName]))
                                    }
                                }
                            }
                        }
                    })
                } else {

                }
                break
            }
            case 'BOM': {
                const variables = getState().variables[typeName].filter(x => getVariableName(x) === variableName)
                if (variables.length() === 1) {
                    Object.keys(type).forEach(keyName => {
                        if (symbolPaths.filter(x => x[0] === keyName)) {
                            const key: Key = type[keyName]
                            if (symbolValue['values'] !== undefined) {
                                switch (key.type) {
                                    case 'Text': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Number':
                                    case 'Date':
                                    case 'Timestamp':
                                    case 'Time': {
                                        symbolValue.values[keyName] = {
                                            type: 'Number',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Decimal': {
                                        symbolValue.values[keyName] = {
                                            type: 'Decimal',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Boolean': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    default: {
                                        symbolValue.values[keyName] = getSymbols(symbolPaths.filter(x => x[0] === keyName).map(x => x.slice(1)),
                                            key.type,
                                            getVariableName(variables[0].values[keyName]))
                                    }
                                }
                            }
                        }
                    })
                } else {

                }
                break
            }
            case 'BOMItem': {
                const variables = getState().variables[typeName].filter(x => getVariableName(x) === variableName)
                if (variables.length() === 1) {
                    Object.keys(type).forEach(keyName => {
                        if (symbolPaths.filter(x => x[0] === keyName)) {
                            const key: Key = type[keyName]
                            if (symbolValue['values'] !== undefined) {
                                switch (key.type) {
                                    case 'Text': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Number':
                                    case 'Date':
                                    case 'Timestamp':
                                    case 'Time': {
                                        symbolValue.values[keyName] = {
                                            type: 'Number',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Decimal': {
                                        symbolValue.values[keyName] = {
                                            type: 'Decimal',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Boolean': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    default: {
                                        symbolValue.values[keyName] = getSymbols(symbolPaths.filter(x => x[0] === keyName).map(x => x.slice(1)),
                                            key.type,
                                            getVariableName(variables[0].values[keyName]))
                                    }
                                }
                            }
                        }
                    })
                } else {

                }
                break
            }
            case 'ProductionPreparationSlip': {
                const variables = getState().variables[typeName].filter(x => getVariableName(x) === variableName)
                if (variables.length() === 1) {
                    Object.keys(type).forEach(keyName => {
                        if (symbolPaths.filter(x => x[0] === keyName)) {
                            const key: Key = type[keyName]
                            if (symbolValue['values'] !== undefined) {
                                switch (key.type) {
                                    case 'Text': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Number':
                                    case 'Date':
                                    case 'Timestamp':
                                    case 'Time': {
                                        symbolValue.values[keyName] = {
                                            type: 'Number',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Decimal': {
                                        symbolValue.values[keyName] = {
                                            type: 'Decimal',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Boolean': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    default: {
                                        symbolValue.values[keyName] = getSymbols(symbolPaths.filter(x => x[0] === keyName).map(x => x.slice(1)),
                                            key.type,
                                            getVariableName(variables[0].values[keyName]))
                                    }
                                }
                            }
                        }
                    })
                } else {

                }
                break
            }
            case 'ProductionPreparationSlipItem': {
                const variables = getState().variables[typeName].filter(x => getVariableName(x) === variableName)
                if (variables.length() === 1) {
                    Object.keys(type).forEach(keyName => {
                        if (symbolPaths.filter(x => x[0] === keyName)) {
                            const key: Key = type[keyName]
                            if (symbolValue['values'] !== undefined) {
                                switch (key.type) {
                                    case 'Text': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Number':
                                    case 'Date':
                                    case 'Timestamp':
                                    case 'Time': {
                                        symbolValue.values[keyName] = {
                                            type: 'Number',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Decimal': {
                                        symbolValue.values[keyName] = {
                                            type: 'Decimal',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Boolean': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    default: {
                                        symbolValue.values[keyName] = getSymbols(symbolPaths.filter(x => x[0] === keyName).map(x => x.slice(1)),
                                            key.type,
                                            getVariableName(variables[0].values[keyName]))
                                    }
                                }
                            }
                        }
                    })
                } else {

                }
                break
            }
            case 'ScrapMaterialSlip': {
                const variables = getState().variables[typeName].filter(x => getVariableName(x) === variableName)
                if (variables.length() === 1) {
                    Object.keys(type).forEach(keyName => {
                        if (symbolPaths.filter(x => x[0] === keyName)) {
                            const key: Key = type[keyName]
                            if (symbolValue['values'] !== undefined) {
                                switch (key.type) {
                                    case 'Text': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Number':
                                    case 'Date':
                                    case 'Timestamp':
                                    case 'Time': {
                                        symbolValue.values[keyName] = {
                                            type: 'Number',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Decimal': {
                                        symbolValue.values[keyName] = {
                                            type: 'Decimal',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Boolean': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    default: {
                                        symbolValue.values[keyName] = getSymbols(symbolPaths.filter(x => x[0] === keyName).map(x => x.slice(1)),
                                            key.type,
                                            getVariableName(variables[0].values[keyName]))
                                    }
                                }
                            }
                        }
                    })
                } else {

                }
                break
            }
            case 'TransferMaterialSlip': {
                const variables = getState().variables[typeName].filter(x => getVariableName(x) === variableName)
                if (variables.length() === 1) {
                    Object.keys(type).forEach(keyName => {
                        if (symbolPaths.filter(x => x[0] === keyName)) {
                            const key: Key = type[keyName]
                            if (symbolValue['values'] !== undefined) {
                                switch (key.type) {
                                    case 'Text': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Number':
                                    case 'Date':
                                    case 'Timestamp':
                                    case 'Time': {
                                        symbolValue.values[keyName] = {
                                            type: 'Number',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Decimal': {
                                        symbolValue.values[keyName] = {
                                            type: 'Decimal',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Boolean': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    default: {
                                        symbolValue.values[keyName] = getSymbols(symbolPaths.filter(x => x[0] === keyName).map(x => x.slice(1)),
                                            key.type,
                                            getVariableName(variables[0].values[keyName]))
                                    }
                                }
                            }
                        }
                    })
                } else {

                }
                break
            }
            case 'WarehouseAcceptanceSlip': {
                const variables = getState().variables[typeName].filter(x => getVariableName(x) === variableName)
                if (variables.length() === 1) {
                    Object.keys(type).forEach(keyName => {
                        if (symbolPaths.filter(x => x[0] === keyName)) {
                            const key: Key = type[keyName]
                            if (symbolValue['values'] !== undefined) {
                                switch (key.type) {
                                    case 'Text': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Number':
                                    case 'Date':
                                    case 'Timestamp':
                                    case 'Time': {
                                        symbolValue.values[keyName] = {
                                            type: 'Number',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Decimal': {
                                        symbolValue.values[keyName] = {
                                            type: 'Decimal',
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    case 'Boolean': {
                                        symbolValue.values[keyName] = {
                                            type: key.type,
                                            value: variables[0].values[keyName]
                                        }
                                        break
                                    }
                                    default: {
                                        symbolValue.values[keyName] = getSymbols(symbolPaths.filter(x => x[0] === keyName).map(x => x.slice(1)),
                                            key.type,
                                            getVariableName(variables[0].values[keyName]))
                                    }
                                }
                            }
                        }
                    })
                } else {

                }
                break
            }
            default: {
                console.log('Case not covered for NonPrimitiveType')
            }
        }
    }
    return symbolValue
}

function getSymbolsForFunction(fx: Function, args: object): Symbols {
    const symbolPaths = getSymbolPathsForFunction(fx)
    const symbols: Symbols = {}
    Object.keys(fx.inputs).forEach(inputName => {
        if (symbolPaths.filter(x => x[0] === inputName).length !== 0) {
            const fi = fx.inputs[inputName]
            switch (fi.type) {
                case 'Text': {
                    symbols[inputName] = {
                        type: 'Text',
                        value: inputName in args ? String(args[inputName]) : (fi.default ? fi.default : '')
                    }
                    break
                }
                case 'Number':
                case 'Date':
                case 'Timestamp':
                case 'Time': {
                    symbols[inputName] = {
                        type: 'Number',
                        value: inputName in args ? parseInt(String(args[inputName])) : (fi.default ? fi.default : 0)
                    }
                    break
                }
                case 'Decimal': {
                    symbols[inputName] = {
                        type: 'Decimal',
                        value: inputName in args ? parseFloat(String(args[inputName])) : (fi.default ? fi.default : 0)
                    }
                    break
                }
                case 'Boolean': {
                    symbols[inputName] = {
                        type: 'Boolean',
                        value: inputName in args ? Boolean(args[inputName]).valueOf() : (fi.default ? fi.default : false)
                    }
                    break
                }
                default: {
                    if (inputName in args || fi.default !== undefined) {
                        symbols[inputName] = getSymbols(symbolPaths.filter(x => x[0] === inputName).map(x => x.slice(1)), fi.type, inputName in args ? String(args[inputName]) : (fi.default ? fi.default : ''))
                    }
                    break
                }
            }
        }
    })
    return symbols
}

export function executeFunction(fx: Function, args: object): object {
    const symbols: Symbols = getSymbolsForFunction(fx, args)
    const result = {}
    Object.keys(fx.outputs).forEach(outputName => {
        const fo = fx.outputs[outputName]
        switch (fo.type) {
            case 'Text': {
                result[outputName] = String(evaluateExpression(fo.value, symbols))
                break
            }
            case 'Number':
            case 'Date':
            case 'Timestamp':
            case 'Time': {
                result[outputName] = parseInt(String(evaluateExpression(fo.value, symbols)))
                break
            }
            case 'Decimal': {
                result[outputName] = parseFloat(String(evaluateExpression(fo.value, symbols)))
                break
            }
            case 'Boolean': {
                result[outputName] = Boolean(evaluateExpression(fo.value, symbols)).valueOf()
                break
            }
            default: {
                const variableName = String(evaluateExpression(fo.variableName, symbols))
                switch (fo.op) {
                    case 'create': {
                        const variable = {
                            variableName: variableName,
                            values: {}
                        }
                        Object.keys(fo.type).forEach(keyName => {
                            const key: Key = fo.type[keyName]
                            switch (key.type) {
                                case 'Text': {
                                    variable.values[keyName] = String(evaluateExpression(fo.values[keyName], symbols))
                                    break
                                }
                                case 'Number':
                                case 'Date':
                                case 'Timestamp':
                                case 'Time': {
                                    variable.values[keyName] = parseInt(String(evaluateExpression(fo.values[keyName], symbols)))
                                    break
                                }
                                case 'Decimal': {
                                    variable.values[keyName] = parseFloat(String(evaluateExpression(fo.values[keyName], symbols)))
                                    break
                                }
                                case 'Boolean': {
                                    variable.values[keyName] = Boolean(evaluateExpression(fo.values[keyName], symbols)).valueOf()
                                    break
                                }
                                default: {
                                    switch (key.type) {
                                        case 'Product': {
                                            const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                            if (variables.length() === 1) {
                                                variable.values[keyName] = getVariableName(variables[0].variableName)
                                            } else {

                                            }
                                            break
                                        }
                                        case 'UOM': {
                                            const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                            if (variables.length() === 1) {
                                                variable.values[keyName] = getVariableName(variables[0].variableName)
                                            } else {

                                            }
                                            break
                                        }
                                        case 'Indent': {
                                            const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                            if (variables.length() === 1) {
                                                variable.values[keyName] = getVariableName(variables[0].variableName)
                                            } else {

                                            }
                                            break
                                        }
                                        case 'IndentItem': {
                                            const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                            if (variables.length() === 1) {
                                                variable.values[keyName] = getVariableName(variables[0].variableName)
                                            } else {

                                            }
                                            break
                                        }
                                        case 'Supplier': {
                                            const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                            if (variables.length() === 1) {
                                                variable.values[keyName] = getVariableName(variables[0].variableName)
                                            } else {

                                            }
                                            break
                                        }
                                        case 'SupplierProduct': {
                                            const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                            if (variables.length() === 1) {
                                                variable.values[keyName] = getVariableName(variables[0].variableName)
                                            } else {

                                            }
                                            break
                                        }
                                        case 'Quotation': {
                                            const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                            if (variables.length() === 1) {
                                                variable.values[keyName] = getVariableName(variables[0].variableName)
                                            } else {

                                            }
                                            break
                                        }
                                        case 'QuotationItem': {
                                            const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                            if (variables.length() === 1) {
                                                variable.values[keyName] = getVariableName(variables[0].variableName)
                                            } else {

                                            }
                                            break
                                        }
                                        case 'PurchaseOrder': {
                                            const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                            if (variables.length() === 1) {
                                                variable.values[keyName] = getVariableName(variables[0].variableName)
                                            } else {

                                            }
                                            break
                                        }
                                        case 'PurchaseOrderItem': {
                                            const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                            if (variables.length() === 1) {
                                                variable.values[keyName] = getVariableName(variables[0].variableName)
                                            } else {

                                            }
                                            break
                                        }
                                        case 'PurchaseInvoice': {
                                            const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                            if (variables.length() === 1) {
                                                variable.values[keyName] = getVariableName(variables[0].variableName)
                                            } else {

                                            }
                                            break
                                        }
                                        case 'PurchaseInvoiceItem': {
                                            const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                            if (variables.length() === 1) {
                                                variable.values[keyName] = getVariableName(variables[0].variableName)
                                            } else {

                                            }
                                            break
                                        }
                                        case 'MaterialApprovalSlip': {
                                            const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                            if (variables.length() === 1) {
                                                variable.values[keyName] = getVariableName(variables[0].variableName)
                                            } else {

                                            }
                                            break
                                        }
                                        case 'MaterialApprovalSlipItem': {
                                            const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                            if (variables.length() === 1) {
                                                variable.values[keyName] = getVariableName(variables[0].variableName)
                                            } else {

                                            }
                                            break
                                        }
                                        case 'MaterialRejectionSlip': {
                                            const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                            if (variables.length() === 1) {
                                                variable.values[keyName] = getVariableName(variables[0].variableName)
                                            } else {

                                            }
                                            break
                                        }
                                        case 'MaterialRejectionSlipItem': {
                                            const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                            if (variables.length() === 1) {
                                                variable.values[keyName] = getVariableName(variables[0].variableName)
                                            } else {

                                            }
                                            break
                                        }
                                        case 'MaterialReturnSlip': {
                                            const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                            if (variables.length() === 1) {
                                                variable.values[keyName] = getVariableName(variables[0].variableName)
                                            } else {

                                            }
                                            break
                                        }
                                        case 'MaterialReturnSlipItem': {
                                            const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                            if (variables.length() === 1) {
                                                variable.values[keyName] = getVariableName(variables[0].variableName)
                                            } else {

                                            }
                                            break
                                        }
                                        case 'MaterialRequistionSlip': {
                                            const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                            if (variables.length() === 1) {
                                                variable.values[keyName] = getVariableName(variables[0].variableName)
                                            } else {

                                            }
                                            break
                                        }
                                        case 'MaterialRequistionSlipItem': {
                                            const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                            if (variables.length() === 1) {
                                                variable.values[keyName] = getVariableName(variables[0].variableName)
                                            } else {

                                            }
                                            break
                                        }
                                        case 'BOM': {
                                            const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                            if (variables.length() === 1) {
                                                variable.values[keyName] = getVariableName(variables[0].variableName)
                                            } else {

                                            }
                                            break
                                        }
                                        case 'BOMItem': {
                                            const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                            if (variables.length() === 1) {
                                                variable.values[keyName] = getVariableName(variables[0].variableName)
                                            } else {

                                            }
                                            break
                                        }
                                        case 'ProductionPreparationSlip': {
                                            const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                            if (variables.length() === 1) {
                                                variable.values[keyName] = getVariableName(variables[0].variableName)
                                            } else {

                                            }
                                            break
                                        }
                                        case 'ProductionPreparationSlipItem': {
                                            const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                            if (variables.length() === 1) {
                                                variable.values[keyName] = getVariableName(variables[0].variableName)
                                            } else {

                                            }
                                            break
                                        }
                                        case 'ScrapMaterialSlip': {
                                            const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                            if (variables.length() === 1) {
                                                variable.values[keyName] = getVariableName(variables[0].variableName)
                                            } else {

                                            }
                                            break
                                        }
                                        case 'TransferMaterialSlip': {
                                            const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                            if (variables.length() === 1) {
                                                variable.values[keyName] = getVariableName(variables[0].variableName)
                                            } else {

                                            }
                                            break
                                        }
                                        case 'WarehouseAcceptanceSlip': {
                                            const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                            if (variables.length() === 1) {
                                                variable.values[keyName] = getVariableName(variables[0].variableName)
                                            } else {

                                            }
                                            break
                                        }
                                        default: {
                                            console.log('Case not covered for NonPrimitiveType')
                                        }
                                    }
                                }
                            }
                        })
                        result[outputName] = variable
                        break
                    }
                    case 'update': {
                        switch (fo.type) {
                            case 'Product': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === variableName)
                                if (variables.length() === 1) {
                                    const variable = variables[0]
                                    Object.keys(fo.values).forEach(keyName => {
                                        const key: Key = fo.type[keyName]
                                        switch (key.type) {
                                            case 'Text': {
                                                variable.values[keyName] = String(evaluateExpression(fo.values[keyName], symbols))
                                                break
                                            }
                                            case 'Number':
                                            case 'Date':
                                            case 'Timestamp':
                                            case 'Time': {
                                                variable.values[keyName] = parseInt(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Decimal': {
                                                variable.values[keyName] = parseFloat(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Boolean': {
                                                variable.values[keyName] = Boolean(evaluateExpression(fo.values[keyName], symbols)).valueOf()
                                                break
                                            }
                                            default: {
                                                switch (key.type) {
                                                    case 'Product': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'UOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Indent': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'IndentItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Supplier': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'SupplierProduct': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Quotation': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'QuotationItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrder': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrderItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoice': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoiceItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOMItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ScrapMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'TransferMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'WarehouseAcceptanceSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    default: {
                                                        console.log('Case not covered for NonPrimitiveType')
                                                    }
                                                }
                                            }
                                        }
                                    })
                                } else {

                                }
                                break
                            }
                            case 'UOM': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === variableName)
                                if (variables.length() === 1) {
                                    const variable = variables[0]
                                    Object.keys(fo.values).forEach(keyName => {
                                        const key: Key = fo.type[keyName]
                                        switch (key.type) {
                                            case 'Text': {
                                                variable.values[keyName] = String(evaluateExpression(fo.values[keyName], symbols))
                                                break
                                            }
                                            case 'Number':
                                            case 'Date':
                                            case 'Timestamp':
                                            case 'Time': {
                                                variable.values[keyName] = parseInt(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Decimal': {
                                                variable.values[keyName] = parseFloat(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Boolean': {
                                                variable.values[keyName] = Boolean(evaluateExpression(fo.values[keyName], symbols)).valueOf()
                                                break
                                            }
                                            default: {
                                                switch (key.type) {
                                                    case 'Product': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'UOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Indent': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'IndentItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Supplier': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'SupplierProduct': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Quotation': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'QuotationItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrder': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrderItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoice': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoiceItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOMItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ScrapMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'TransferMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'WarehouseAcceptanceSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    default: {
                                                        console.log('Case not covered for NonPrimitiveType')
                                                    }
                                                }
                                            }
                                        }
                                    })
                                } else {

                                }
                                break
                            }
                            case 'Indent': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === variableName)
                                if (variables.length() === 1) {
                                    const variable = variables[0]
                                    Object.keys(fo.values).forEach(keyName => {
                                        const key: Key = fo.type[keyName]
                                        switch (key.type) {
                                            case 'Text': {
                                                variable.values[keyName] = String(evaluateExpression(fo.values[keyName], symbols))
                                                break
                                            }
                                            case 'Number':
                                            case 'Date':
                                            case 'Timestamp':
                                            case 'Time': {
                                                variable.values[keyName] = parseInt(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Decimal': {
                                                variable.values[keyName] = parseFloat(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Boolean': {
                                                variable.values[keyName] = Boolean(evaluateExpression(fo.values[keyName], symbols)).valueOf()
                                                break
                                            }
                                            default: {
                                                switch (key.type) {
                                                    case 'Product': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'UOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Indent': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'IndentItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Supplier': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'SupplierProduct': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Quotation': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'QuotationItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrder': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrderItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoice': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoiceItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOMItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ScrapMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'TransferMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'WarehouseAcceptanceSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    default: {
                                                        console.log('Case not covered for NonPrimitiveType')
                                                    }
                                                }
                                            }
                                        }
                                    })
                                } else {

                                }
                                break
                            }
                            case 'IndentItem': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === variableName)
                                if (variables.length() === 1) {
                                    const variable = variables[0]
                                    Object.keys(fo.values).forEach(keyName => {
                                        const key: Key = fo.type[keyName]
                                        switch (key.type) {
                                            case 'Text': {
                                                variable.values[keyName] = String(evaluateExpression(fo.values[keyName], symbols))
                                                break
                                            }
                                            case 'Number':
                                            case 'Date':
                                            case 'Timestamp':
                                            case 'Time': {
                                                variable.values[keyName] = parseInt(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Decimal': {
                                                variable.values[keyName] = parseFloat(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Boolean': {
                                                variable.values[keyName] = Boolean(evaluateExpression(fo.values[keyName], symbols)).valueOf()
                                                break
                                            }
                                            default: {
                                                switch (key.type) {
                                                    case 'Product': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'UOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Indent': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'IndentItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Supplier': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'SupplierProduct': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Quotation': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'QuotationItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrder': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrderItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoice': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoiceItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOMItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ScrapMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'TransferMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'WarehouseAcceptanceSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    default: {
                                                        console.log('Case not covered for NonPrimitiveType')
                                                    }
                                                }
                                            }
                                        }
                                    })
                                } else {

                                }
                                break
                            }
                            case 'Supplier': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === variableName)
                                if (variables.length() === 1) {
                                    const variable = variables[0]
                                    Object.keys(fo.values).forEach(keyName => {
                                        const key: Key = fo.type[keyName]
                                        switch (key.type) {
                                            case 'Text': {
                                                variable.values[keyName] = String(evaluateExpression(fo.values[keyName], symbols))
                                                break
                                            }
                                            case 'Number':
                                            case 'Date':
                                            case 'Timestamp':
                                            case 'Time': {
                                                variable.values[keyName] = parseInt(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Decimal': {
                                                variable.values[keyName] = parseFloat(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Boolean': {
                                                variable.values[keyName] = Boolean(evaluateExpression(fo.values[keyName], symbols)).valueOf()
                                                break
                                            }
                                            default: {
                                                switch (key.type) {
                                                    case 'Product': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'UOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Indent': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'IndentItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Supplier': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'SupplierProduct': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Quotation': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'QuotationItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrder': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrderItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoice': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoiceItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOMItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ScrapMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'TransferMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'WarehouseAcceptanceSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    default: {
                                                        console.log('Case not covered for NonPrimitiveType')
                                                    }
                                                }
                                            }
                                        }
                                    })
                                } else {

                                }
                                break
                            }
                            case 'SupplierProduct': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === variableName)
                                if (variables.length() === 1) {
                                    const variable = variables[0]
                                    Object.keys(fo.values).forEach(keyName => {
                                        const key: Key = fo.type[keyName]
                                        switch (key.type) {
                                            case 'Text': {
                                                variable.values[keyName] = String(evaluateExpression(fo.values[keyName], symbols))
                                                break
                                            }
                                            case 'Number':
                                            case 'Date':
                                            case 'Timestamp':
                                            case 'Time': {
                                                variable.values[keyName] = parseInt(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Decimal': {
                                                variable.values[keyName] = parseFloat(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Boolean': {
                                                variable.values[keyName] = Boolean(evaluateExpression(fo.values[keyName], symbols)).valueOf()
                                                break
                                            }
                                            default: {
                                                switch (key.type) {
                                                    case 'Product': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'UOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Indent': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'IndentItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Supplier': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'SupplierProduct': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Quotation': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'QuotationItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrder': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrderItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoice': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoiceItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOMItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ScrapMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'TransferMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'WarehouseAcceptanceSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    default: {
                                                        console.log('Case not covered for NonPrimitiveType')
                                                    }
                                                }
                                            }
                                        }
                                    })
                                } else {

                                }
                                break
                            }
                            case 'Quotation': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === variableName)
                                if (variables.length() === 1) {
                                    const variable = variables[0]
                                    Object.keys(fo.values).forEach(keyName => {
                                        const key: Key = fo.type[keyName]
                                        switch (key.type) {
                                            case 'Text': {
                                                variable.values[keyName] = String(evaluateExpression(fo.values[keyName], symbols))
                                                break
                                            }
                                            case 'Number':
                                            case 'Date':
                                            case 'Timestamp':
                                            case 'Time': {
                                                variable.values[keyName] = parseInt(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Decimal': {
                                                variable.values[keyName] = parseFloat(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Boolean': {
                                                variable.values[keyName] = Boolean(evaluateExpression(fo.values[keyName], symbols)).valueOf()
                                                break
                                            }
                                            default: {
                                                switch (key.type) {
                                                    case 'Product': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'UOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Indent': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'IndentItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Supplier': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'SupplierProduct': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Quotation': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'QuotationItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrder': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrderItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoice': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoiceItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOMItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ScrapMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'TransferMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'WarehouseAcceptanceSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    default: {
                                                        console.log('Case not covered for NonPrimitiveType')
                                                    }
                                                }
                                            }
                                        }
                                    })
                                } else {

                                }
                                break
                            }
                            case 'QuotationItem': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === variableName)
                                if (variables.length() === 1) {
                                    const variable = variables[0]
                                    Object.keys(fo.values).forEach(keyName => {
                                        const key: Key = fo.type[keyName]
                                        switch (key.type) {
                                            case 'Text': {
                                                variable.values[keyName] = String(evaluateExpression(fo.values[keyName], symbols))
                                                break
                                            }
                                            case 'Number':
                                            case 'Date':
                                            case 'Timestamp':
                                            case 'Time': {
                                                variable.values[keyName] = parseInt(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Decimal': {
                                                variable.values[keyName] = parseFloat(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Boolean': {
                                                variable.values[keyName] = Boolean(evaluateExpression(fo.values[keyName], symbols)).valueOf()
                                                break
                                            }
                                            default: {
                                                switch (key.type) {
                                                    case 'Product': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'UOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Indent': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'IndentItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Supplier': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'SupplierProduct': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Quotation': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'QuotationItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrder': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrderItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoice': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoiceItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOMItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ScrapMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'TransferMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'WarehouseAcceptanceSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    default: {
                                                        console.log('Case not covered for NonPrimitiveType')
                                                    }
                                                }
                                            }
                                        }
                                    })
                                } else {

                                }
                                break
                            }
                            case 'PurchaseOrder': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === variableName)
                                if (variables.length() === 1) {
                                    const variable = variables[0]
                                    Object.keys(fo.values).forEach(keyName => {
                                        const key: Key = fo.type[keyName]
                                        switch (key.type) {
                                            case 'Text': {
                                                variable.values[keyName] = String(evaluateExpression(fo.values[keyName], symbols))
                                                break
                                            }
                                            case 'Number':
                                            case 'Date':
                                            case 'Timestamp':
                                            case 'Time': {
                                                variable.values[keyName] = parseInt(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Decimal': {
                                                variable.values[keyName] = parseFloat(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Boolean': {
                                                variable.values[keyName] = Boolean(evaluateExpression(fo.values[keyName], symbols)).valueOf()
                                                break
                                            }
                                            default: {
                                                switch (key.type) {
                                                    case 'Product': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'UOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Indent': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'IndentItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Supplier': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'SupplierProduct': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Quotation': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'QuotationItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrder': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrderItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoice': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoiceItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOMItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ScrapMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'TransferMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'WarehouseAcceptanceSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    default: {
                                                        console.log('Case not covered for NonPrimitiveType')
                                                    }
                                                }
                                            }
                                        }
                                    })
                                } else {

                                }
                                break
                            }
                            case 'PurchaseOrderItem': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === variableName)
                                if (variables.length() === 1) {
                                    const variable = variables[0]
                                    Object.keys(fo.values).forEach(keyName => {
                                        const key: Key = fo.type[keyName]
                                        switch (key.type) {
                                            case 'Text': {
                                                variable.values[keyName] = String(evaluateExpression(fo.values[keyName], symbols))
                                                break
                                            }
                                            case 'Number':
                                            case 'Date':
                                            case 'Timestamp':
                                            case 'Time': {
                                                variable.values[keyName] = parseInt(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Decimal': {
                                                variable.values[keyName] = parseFloat(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Boolean': {
                                                variable.values[keyName] = Boolean(evaluateExpression(fo.values[keyName], symbols)).valueOf()
                                                break
                                            }
                                            default: {
                                                switch (key.type) {
                                                    case 'Product': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'UOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Indent': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'IndentItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Supplier': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'SupplierProduct': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Quotation': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'QuotationItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrder': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrderItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoice': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoiceItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOMItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ScrapMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'TransferMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'WarehouseAcceptanceSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    default: {
                                                        console.log('Case not covered for NonPrimitiveType')
                                                    }
                                                }
                                            }
                                        }
                                    })
                                } else {

                                }
                                break
                            }
                            case 'PurchaseInvoice': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === variableName)
                                if (variables.length() === 1) {
                                    const variable = variables[0]
                                    Object.keys(fo.values).forEach(keyName => {
                                        const key: Key = fo.type[keyName]
                                        switch (key.type) {
                                            case 'Text': {
                                                variable.values[keyName] = String(evaluateExpression(fo.values[keyName], symbols))
                                                break
                                            }
                                            case 'Number':
                                            case 'Date':
                                            case 'Timestamp':
                                            case 'Time': {
                                                variable.values[keyName] = parseInt(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Decimal': {
                                                variable.values[keyName] = parseFloat(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Boolean': {
                                                variable.values[keyName] = Boolean(evaluateExpression(fo.values[keyName], symbols)).valueOf()
                                                break
                                            }
                                            default: {
                                                switch (key.type) {
                                                    case 'Product': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'UOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Indent': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'IndentItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Supplier': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'SupplierProduct': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Quotation': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'QuotationItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrder': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrderItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoice': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoiceItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOMItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ScrapMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'TransferMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'WarehouseAcceptanceSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    default: {
                                                        console.log('Case not covered for NonPrimitiveType')
                                                    }
                                                }
                                            }
                                        }
                                    })
                                } else {

                                }
                                break
                            }
                            case 'PurchaseInvoiceItem': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === variableName)
                                if (variables.length() === 1) {
                                    const variable = variables[0]
                                    Object.keys(fo.values).forEach(keyName => {
                                        const key: Key = fo.type[keyName]
                                        switch (key.type) {
                                            case 'Text': {
                                                variable.values[keyName] = String(evaluateExpression(fo.values[keyName], symbols))
                                                break
                                            }
                                            case 'Number':
                                            case 'Date':
                                            case 'Timestamp':
                                            case 'Time': {
                                                variable.values[keyName] = parseInt(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Decimal': {
                                                variable.values[keyName] = parseFloat(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Boolean': {
                                                variable.values[keyName] = Boolean(evaluateExpression(fo.values[keyName], symbols)).valueOf()
                                                break
                                            }
                                            default: {
                                                switch (key.type) {
                                                    case 'Product': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'UOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Indent': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'IndentItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Supplier': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'SupplierProduct': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Quotation': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'QuotationItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrder': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrderItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoice': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoiceItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOMItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ScrapMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'TransferMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'WarehouseAcceptanceSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    default: {
                                                        console.log('Case not covered for NonPrimitiveType')
                                                    }
                                                }
                                            }
                                        }
                                    })
                                } else {

                                }
                                break
                            }
                            case 'MaterialApprovalSlip': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === variableName)
                                if (variables.length() === 1) {
                                    const variable = variables[0]
                                    Object.keys(fo.values).forEach(keyName => {
                                        const key: Key = fo.type[keyName]
                                        switch (key.type) {
                                            case 'Text': {
                                                variable.values[keyName] = String(evaluateExpression(fo.values[keyName], symbols))
                                                break
                                            }
                                            case 'Number':
                                            case 'Date':
                                            case 'Timestamp':
                                            case 'Time': {
                                                variable.values[keyName] = parseInt(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Decimal': {
                                                variable.values[keyName] = parseFloat(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Boolean': {
                                                variable.values[keyName] = Boolean(evaluateExpression(fo.values[keyName], symbols)).valueOf()
                                                break
                                            }
                                            default: {
                                                switch (key.type) {
                                                    case 'Product': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'UOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Indent': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'IndentItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Supplier': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'SupplierProduct': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Quotation': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'QuotationItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrder': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrderItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoice': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoiceItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOMItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ScrapMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'TransferMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'WarehouseAcceptanceSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    default: {
                                                        console.log('Case not covered for NonPrimitiveType')
                                                    }
                                                }
                                            }
                                        }
                                    })
                                } else {

                                }
                                break
                            }
                            case 'MaterialApprovalSlipItem': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === variableName)
                                if (variables.length() === 1) {
                                    const variable = variables[0]
                                    Object.keys(fo.values).forEach(keyName => {
                                        const key: Key = fo.type[keyName]
                                        switch (key.type) {
                                            case 'Text': {
                                                variable.values[keyName] = String(evaluateExpression(fo.values[keyName], symbols))
                                                break
                                            }
                                            case 'Number':
                                            case 'Date':
                                            case 'Timestamp':
                                            case 'Time': {
                                                variable.values[keyName] = parseInt(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Decimal': {
                                                variable.values[keyName] = parseFloat(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Boolean': {
                                                variable.values[keyName] = Boolean(evaluateExpression(fo.values[keyName], symbols)).valueOf()
                                                break
                                            }
                                            default: {
                                                switch (key.type) {
                                                    case 'Product': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'UOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Indent': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'IndentItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Supplier': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'SupplierProduct': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Quotation': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'QuotationItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrder': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrderItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoice': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoiceItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOMItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ScrapMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'TransferMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'WarehouseAcceptanceSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    default: {
                                                        console.log('Case not covered for NonPrimitiveType')
                                                    }
                                                }
                                            }
                                        }
                                    })
                                } else {

                                }
                                break
                            }
                            case 'MaterialRejectionSlip': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === variableName)
                                if (variables.length() === 1) {
                                    const variable = variables[0]
                                    Object.keys(fo.values).forEach(keyName => {
                                        const key: Key = fo.type[keyName]
                                        switch (key.type) {
                                            case 'Text': {
                                                variable.values[keyName] = String(evaluateExpression(fo.values[keyName], symbols))
                                                break
                                            }
                                            case 'Number':
                                            case 'Date':
                                            case 'Timestamp':
                                            case 'Time': {
                                                variable.values[keyName] = parseInt(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Decimal': {
                                                variable.values[keyName] = parseFloat(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Boolean': {
                                                variable.values[keyName] = Boolean(evaluateExpression(fo.values[keyName], symbols)).valueOf()
                                                break
                                            }
                                            default: {
                                                switch (key.type) {
                                                    case 'Product': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'UOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Indent': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'IndentItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Supplier': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'SupplierProduct': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Quotation': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'QuotationItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrder': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrderItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoice': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoiceItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOMItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ScrapMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'TransferMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'WarehouseAcceptanceSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    default: {
                                                        console.log('Case not covered for NonPrimitiveType')
                                                    }
                                                }
                                            }
                                        }
                                    })
                                } else {

                                }
                                break
                            }
                            case 'MaterialRejectionSlipItem': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === variableName)
                                if (variables.length() === 1) {
                                    const variable = variables[0]
                                    Object.keys(fo.values).forEach(keyName => {
                                        const key: Key = fo.type[keyName]
                                        switch (key.type) {
                                            case 'Text': {
                                                variable.values[keyName] = String(evaluateExpression(fo.values[keyName], symbols))
                                                break
                                            }
                                            case 'Number':
                                            case 'Date':
                                            case 'Timestamp':
                                            case 'Time': {
                                                variable.values[keyName] = parseInt(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Decimal': {
                                                variable.values[keyName] = parseFloat(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Boolean': {
                                                variable.values[keyName] = Boolean(evaluateExpression(fo.values[keyName], symbols)).valueOf()
                                                break
                                            }
                                            default: {
                                                switch (key.type) {
                                                    case 'Product': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'UOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Indent': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'IndentItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Supplier': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'SupplierProduct': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Quotation': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'QuotationItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrder': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrderItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoice': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoiceItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOMItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ScrapMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'TransferMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'WarehouseAcceptanceSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    default: {
                                                        console.log('Case not covered for NonPrimitiveType')
                                                    }
                                                }
                                            }
                                        }
                                    })
                                } else {

                                }
                                break
                            }
                            case 'MaterialReturnSlip': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === variableName)
                                if (variables.length() === 1) {
                                    const variable = variables[0]
                                    Object.keys(fo.values).forEach(keyName => {
                                        const key: Key = fo.type[keyName]
                                        switch (key.type) {
                                            case 'Text': {
                                                variable.values[keyName] = String(evaluateExpression(fo.values[keyName], symbols))
                                                break
                                            }
                                            case 'Number':
                                            case 'Date':
                                            case 'Timestamp':
                                            case 'Time': {
                                                variable.values[keyName] = parseInt(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Decimal': {
                                                variable.values[keyName] = parseFloat(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Boolean': {
                                                variable.values[keyName] = Boolean(evaluateExpression(fo.values[keyName], symbols)).valueOf()
                                                break
                                            }
                                            default: {
                                                switch (key.type) {
                                                    case 'Product': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'UOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Indent': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'IndentItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Supplier': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'SupplierProduct': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Quotation': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'QuotationItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrder': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrderItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoice': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoiceItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOMItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ScrapMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'TransferMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'WarehouseAcceptanceSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    default: {
                                                        console.log('Case not covered for NonPrimitiveType')
                                                    }
                                                }
                                            }
                                        }
                                    })
                                } else {

                                }
                                break
                            }
                            case 'MaterialReturnSlipItem': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === variableName)
                                if (variables.length() === 1) {
                                    const variable = variables[0]
                                    Object.keys(fo.values).forEach(keyName => {
                                        const key: Key = fo.type[keyName]
                                        switch (key.type) {
                                            case 'Text': {
                                                variable.values[keyName] = String(evaluateExpression(fo.values[keyName], symbols))
                                                break
                                            }
                                            case 'Number':
                                            case 'Date':
                                            case 'Timestamp':
                                            case 'Time': {
                                                variable.values[keyName] = parseInt(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Decimal': {
                                                variable.values[keyName] = parseFloat(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Boolean': {
                                                variable.values[keyName] = Boolean(evaluateExpression(fo.values[keyName], symbols)).valueOf()
                                                break
                                            }
                                            default: {
                                                switch (key.type) {
                                                    case 'Product': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'UOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Indent': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'IndentItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Supplier': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'SupplierProduct': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Quotation': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'QuotationItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrder': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrderItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoice': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoiceItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOMItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ScrapMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'TransferMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'WarehouseAcceptanceSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    default: {
                                                        console.log('Case not covered for NonPrimitiveType')
                                                    }
                                                }
                                            }
                                        }
                                    })
                                } else {

                                }
                                break
                            }
                            case 'MaterialRequistionSlip': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === variableName)
                                if (variables.length() === 1) {
                                    const variable = variables[0]
                                    Object.keys(fo.values).forEach(keyName => {
                                        const key: Key = fo.type[keyName]
                                        switch (key.type) {
                                            case 'Text': {
                                                variable.values[keyName] = String(evaluateExpression(fo.values[keyName], symbols))
                                                break
                                            }
                                            case 'Number':
                                            case 'Date':
                                            case 'Timestamp':
                                            case 'Time': {
                                                variable.values[keyName] = parseInt(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Decimal': {
                                                variable.values[keyName] = parseFloat(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Boolean': {
                                                variable.values[keyName] = Boolean(evaluateExpression(fo.values[keyName], symbols)).valueOf()
                                                break
                                            }
                                            default: {
                                                switch (key.type) {
                                                    case 'Product': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'UOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Indent': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'IndentItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Supplier': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'SupplierProduct': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Quotation': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'QuotationItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrder': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrderItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoice': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoiceItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOMItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ScrapMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'TransferMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'WarehouseAcceptanceSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    default: {
                                                        console.log('Case not covered for NonPrimitiveType')
                                                    }
                                                }
                                            }
                                        }
                                    })
                                } else {

                                }
                                break
                            }
                            case 'MaterialRequistionSlipItem': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === variableName)
                                if (variables.length() === 1) {
                                    const variable = variables[0]
                                    Object.keys(fo.values).forEach(keyName => {
                                        const key: Key = fo.type[keyName]
                                        switch (key.type) {
                                            case 'Text': {
                                                variable.values[keyName] = String(evaluateExpression(fo.values[keyName], symbols))
                                                break
                                            }
                                            case 'Number':
                                            case 'Date':
                                            case 'Timestamp':
                                            case 'Time': {
                                                variable.values[keyName] = parseInt(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Decimal': {
                                                variable.values[keyName] = parseFloat(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Boolean': {
                                                variable.values[keyName] = Boolean(evaluateExpression(fo.values[keyName], symbols)).valueOf()
                                                break
                                            }
                                            default: {
                                                switch (key.type) {
                                                    case 'Product': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'UOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Indent': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'IndentItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Supplier': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'SupplierProduct': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Quotation': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'QuotationItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrder': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrderItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoice': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoiceItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOMItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ScrapMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'TransferMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'WarehouseAcceptanceSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    default: {
                                                        console.log('Case not covered for NonPrimitiveType')
                                                    }
                                                }
                                            }
                                        }
                                    })
                                } else {

                                }
                                break
                            }
                            case 'BOM': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === variableName)
                                if (variables.length() === 1) {
                                    const variable = variables[0]
                                    Object.keys(fo.values).forEach(keyName => {
                                        const key: Key = fo.type[keyName]
                                        switch (key.type) {
                                            case 'Text': {
                                                variable.values[keyName] = String(evaluateExpression(fo.values[keyName], symbols))
                                                break
                                            }
                                            case 'Number':
                                            case 'Date':
                                            case 'Timestamp':
                                            case 'Time': {
                                                variable.values[keyName] = parseInt(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Decimal': {
                                                variable.values[keyName] = parseFloat(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Boolean': {
                                                variable.values[keyName] = Boolean(evaluateExpression(fo.values[keyName], symbols)).valueOf()
                                                break
                                            }
                                            default: {
                                                switch (key.type) {
                                                    case 'Product': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'UOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Indent': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'IndentItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Supplier': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'SupplierProduct': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Quotation': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'QuotationItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrder': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrderItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoice': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoiceItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOMItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ScrapMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'TransferMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'WarehouseAcceptanceSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    default: {
                                                        console.log('Case not covered for NonPrimitiveType')
                                                    }
                                                }
                                            }
                                        }
                                    })
                                } else {

                                }
                                break
                            }
                            case 'BOMItem': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === variableName)
                                if (variables.length() === 1) {
                                    const variable = variables[0]
                                    Object.keys(fo.values).forEach(keyName => {
                                        const key: Key = fo.type[keyName]
                                        switch (key.type) {
                                            case 'Text': {
                                                variable.values[keyName] = String(evaluateExpression(fo.values[keyName], symbols))
                                                break
                                            }
                                            case 'Number':
                                            case 'Date':
                                            case 'Timestamp':
                                            case 'Time': {
                                                variable.values[keyName] = parseInt(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Decimal': {
                                                variable.values[keyName] = parseFloat(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Boolean': {
                                                variable.values[keyName] = Boolean(evaluateExpression(fo.values[keyName], symbols)).valueOf()
                                                break
                                            }
                                            default: {
                                                switch (key.type) {
                                                    case 'Product': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'UOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Indent': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'IndentItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Supplier': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'SupplierProduct': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Quotation': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'QuotationItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrder': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrderItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoice': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoiceItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOMItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ScrapMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'TransferMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'WarehouseAcceptanceSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    default: {
                                                        console.log('Case not covered for NonPrimitiveType')
                                                    }
                                                }
                                            }
                                        }
                                    })
                                } else {

                                }
                                break
                            }
                            case 'ProductionPreparationSlip': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === variableName)
                                if (variables.length() === 1) {
                                    const variable = variables[0]
                                    Object.keys(fo.values).forEach(keyName => {
                                        const key: Key = fo.type[keyName]
                                        switch (key.type) {
                                            case 'Text': {
                                                variable.values[keyName] = String(evaluateExpression(fo.values[keyName], symbols))
                                                break
                                            }
                                            case 'Number':
                                            case 'Date':
                                            case 'Timestamp':
                                            case 'Time': {
                                                variable.values[keyName] = parseInt(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Decimal': {
                                                variable.values[keyName] = parseFloat(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Boolean': {
                                                variable.values[keyName] = Boolean(evaluateExpression(fo.values[keyName], symbols)).valueOf()
                                                break
                                            }
                                            default: {
                                                switch (key.type) {
                                                    case 'Product': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'UOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Indent': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'IndentItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Supplier': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'SupplierProduct': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Quotation': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'QuotationItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrder': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrderItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoice': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoiceItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOMItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ScrapMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'TransferMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'WarehouseAcceptanceSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    default: {
                                                        console.log('Case not covered for NonPrimitiveType')
                                                    }
                                                }
                                            }
                                        }
                                    })
                                } else {

                                }
                                break
                            }
                            case 'ProductionPreparationSlipItem': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === variableName)
                                if (variables.length() === 1) {
                                    const variable = variables[0]
                                    Object.keys(fo.values).forEach(keyName => {
                                        const key: Key = fo.type[keyName]
                                        switch (key.type) {
                                            case 'Text': {
                                                variable.values[keyName] = String(evaluateExpression(fo.values[keyName], symbols))
                                                break
                                            }
                                            case 'Number':
                                            case 'Date':
                                            case 'Timestamp':
                                            case 'Time': {
                                                variable.values[keyName] = parseInt(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Decimal': {
                                                variable.values[keyName] = parseFloat(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Boolean': {
                                                variable.values[keyName] = Boolean(evaluateExpression(fo.values[keyName], symbols)).valueOf()
                                                break
                                            }
                                            default: {
                                                switch (key.type) {
                                                    case 'Product': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'UOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Indent': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'IndentItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Supplier': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'SupplierProduct': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Quotation': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'QuotationItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrder': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrderItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoice': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoiceItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOMItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ScrapMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'TransferMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'WarehouseAcceptanceSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    default: {
                                                        console.log('Case not covered for NonPrimitiveType')
                                                    }
                                                }
                                            }
                                        }
                                    })
                                } else {

                                }
                                break
                            }
                            case 'ScrapMaterialSlip': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === variableName)
                                if (variables.length() === 1) {
                                    const variable = variables[0]
                                    Object.keys(fo.values).forEach(keyName => {
                                        const key: Key = fo.type[keyName]
                                        switch (key.type) {
                                            case 'Text': {
                                                variable.values[keyName] = String(evaluateExpression(fo.values[keyName], symbols))
                                                break
                                            }
                                            case 'Number':
                                            case 'Date':
                                            case 'Timestamp':
                                            case 'Time': {
                                                variable.values[keyName] = parseInt(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Decimal': {
                                                variable.values[keyName] = parseFloat(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Boolean': {
                                                variable.values[keyName] = Boolean(evaluateExpression(fo.values[keyName], symbols)).valueOf()
                                                break
                                            }
                                            default: {
                                                switch (key.type) {
                                                    case 'Product': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'UOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Indent': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'IndentItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Supplier': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'SupplierProduct': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Quotation': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'QuotationItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrder': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrderItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoice': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoiceItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOMItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ScrapMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'TransferMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'WarehouseAcceptanceSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    default: {
                                                        console.log('Case not covered for NonPrimitiveType')
                                                    }
                                                }
                                            }
                                        }
                                    })
                                } else {

                                }
                                break
                            }
                            case 'TransferMaterialSlip': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === variableName)
                                if (variables.length() === 1) {
                                    const variable = variables[0]
                                    Object.keys(fo.values).forEach(keyName => {
                                        const key: Key = fo.type[keyName]
                                        switch (key.type) {
                                            case 'Text': {
                                                variable.values[keyName] = String(evaluateExpression(fo.values[keyName], symbols))
                                                break
                                            }
                                            case 'Number':
                                            case 'Date':
                                            case 'Timestamp':
                                            case 'Time': {
                                                variable.values[keyName] = parseInt(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Decimal': {
                                                variable.values[keyName] = parseFloat(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Boolean': {
                                                variable.values[keyName] = Boolean(evaluateExpression(fo.values[keyName], symbols)).valueOf()
                                                break
                                            }
                                            default: {
                                                switch (key.type) {
                                                    case 'Product': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'UOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Indent': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'IndentItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Supplier': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'SupplierProduct': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Quotation': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'QuotationItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrder': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrderItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoice': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoiceItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOMItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ScrapMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'TransferMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'WarehouseAcceptanceSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    default: {
                                                        console.log('Case not covered for NonPrimitiveType')
                                                    }
                                                }
                                            }
                                        }
                                    })
                                } else {

                                }
                                break
                            }
                            case 'WarehouseAcceptanceSlip': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === variableName)
                                if (variables.length() === 1) {
                                    const variable = variables[0]
                                    Object.keys(fo.values).forEach(keyName => {
                                        const key: Key = fo.type[keyName]
                                        switch (key.type) {
                                            case 'Text': {
                                                variable.values[keyName] = String(evaluateExpression(fo.values[keyName], symbols))
                                                break
                                            }
                                            case 'Number':
                                            case 'Date':
                                            case 'Timestamp':
                                            case 'Time': {
                                                variable.values[keyName] = parseInt(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Decimal': {
                                                variable.values[keyName] = parseFloat(String(evaluateExpression(fo.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Boolean': {
                                                variable.values[keyName] = Boolean(evaluateExpression(fo.values[keyName], symbols)).valueOf()
                                                break
                                            }
                                            default: {
                                                switch (key.type) {
                                                    case 'Product': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'UOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Indent': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'IndentItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Supplier': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'SupplierProduct': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'Quotation': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'QuotationItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrder': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseOrderItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoice': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'PurchaseInvoiceItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialApprovalSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRejectionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialReturnSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'MaterialRequistionSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOM': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'BOMItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ProductionPreparationSlipItem': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'ScrapMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'TransferMaterialSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    case 'WarehouseAcceptanceSlip': {
                                                        const variables = getState().variables[key.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[keyName], symbols)))
                                                        if (variables.length() === 1) {
                                                            variable.values[keyName] = getVariableName(variables[0].variableName)
                                                        } else {

                                                        }
                                                        break
                                                    }
                                                    default: {
                                                        console.log('Case not covered for NonPrimitiveType')
                                                    }
                                                }
                                            }
                                        }
                                    })
                                } else {

                                }
                                break
                            }
                            default: {
                                console.log('Case not covered for NonPrimitiveType')
                            }
                        }
                        break
                    }
                    case 'delete': {
                        switch (fo.type) {
                            case 'Product': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[fo.type], symbols)))
                                if (variables.length() === 1) {
                                    result[outputName] = variables[0]
                                } else {

                                }
                                break
                            }
                            case 'UOM': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[fo.type], symbols)))
                                if (variables.length() === 1) {
                                    result[outputName] = variables[0]
                                } else {

                                }
                                break
                            }
                            case 'Indent': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[fo.type], symbols)))
                                if (variables.length() === 1) {
                                    result[outputName] = variables[0]
                                } else {

                                }
                                break
                            }
                            case 'IndentItem': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[fo.type], symbols)))
                                if (variables.length() === 1) {
                                    result[outputName] = variables[0]
                                } else {

                                }
                                break
                            }
                            case 'Supplier': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[fo.type], symbols)))
                                if (variables.length() === 1) {
                                    result[outputName] = variables[0]
                                } else {

                                }
                                break
                            }
                            case 'SupplierProduct': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[fo.type], symbols)))
                                if (variables.length() === 1) {
                                    result[outputName] = variables[0]
                                } else {

                                }
                                break
                            }
                            case 'Quotation': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[fo.type], symbols)))
                                if (variables.length() === 1) {
                                    result[outputName] = variables[0]
                                } else {

                                }
                                break
                            }
                            case 'QuotationItem': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[fo.type], symbols)))
                                if (variables.length() === 1) {
                                    result[outputName] = variables[0]
                                } else {

                                }
                                break
                            }
                            case 'PurchaseOrder': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[fo.type], symbols)))
                                if (variables.length() === 1) {
                                    result[outputName] = variables[0]
                                } else {

                                }
                                break
                            }
                            case 'PurchaseOrderItem': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[fo.type], symbols)))
                                if (variables.length() === 1) {
                                    result[outputName] = variables[0]
                                } else {

                                }
                                break
                            }
                            case 'PurchaseInvoice': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[fo.type], symbols)))
                                if (variables.length() === 1) {
                                    result[outputName] = variables[0]
                                } else {

                                }
                                break
                            }
                            case 'PurchaseInvoiceItem': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[fo.type], symbols)))
                                if (variables.length() === 1) {
                                    result[outputName] = variables[0]
                                } else {

                                }
                                break
                            }
                            case 'MaterialApprovalSlip': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[fo.type], symbols)))
                                if (variables.length() === 1) {
                                    result[outputName] = variables[0]
                                } else {

                                }
                                break
                            }
                            case 'MaterialApprovalSlipItem': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[fo.type], symbols)))
                                if (variables.length() === 1) {
                                    result[outputName] = variables[0]
                                } else {

                                }
                                break
                            }
                            case 'MaterialRejectionSlip': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[fo.type], symbols)))
                                if (variables.length() === 1) {
                                    result[outputName] = variables[0]
                                } else {

                                }
                                break
                            }
                            case 'MaterialRejectionSlipItem': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[fo.type], symbols)))
                                if (variables.length() === 1) {
                                    result[outputName] = variables[0]
                                } else {

                                }
                                break
                            }
                            case 'MaterialReturnSlip': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[fo.type], symbols)))
                                if (variables.length() === 1) {
                                    result[outputName] = variables[0]
                                } else {

                                }
                                break
                            }
                            case 'MaterialReturnSlipItem': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[fo.type], symbols)))
                                if (variables.length() === 1) {
                                    result[outputName] = variables[0]
                                } else {

                                }
                                break
                            }
                            case 'MaterialRequistionSlip': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[fo.type], symbols)))
                                if (variables.length() === 1) {
                                    result[outputName] = variables[0]
                                } else {

                                }
                                break
                            }
                            case 'MaterialRequistionSlipItem': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[fo.type], symbols)))
                                if (variables.length() === 1) {
                                    result[outputName] = variables[0]
                                } else {

                                }
                                break
                            }
                            case 'BOM': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[fo.type], symbols)))
                                if (variables.length() === 1) {
                                    result[outputName] = variables[0]
                                } else {

                                }
                                break
                            }
                            case 'BOMItem': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[fo.type], symbols)))
                                if (variables.length() === 1) {
                                    result[outputName] = variables[0]
                                } else {

                                }
                                break
                            }
                            case 'ProductionPreparationSlip': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[fo.type], symbols)))
                                if (variables.length() === 1) {
                                    result[outputName] = variables[0]
                                } else {

                                }
                                break
                            }
                            case 'ProductionPreparationSlipItem': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[fo.type], symbols)))
                                if (variables.length() === 1) {
                                    result[outputName] = variables[0]
                                } else {

                                }
                                break
                            }
                            case 'ScrapMaterialSlip': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[fo.type], symbols)))
                                if (variables.length() === 1) {
                                    result[outputName] = variables[0]
                                } else {

                                }
                                break
                            }
                            case 'TransferMaterialSlip': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[fo.type], symbols)))
                                if (variables.length() === 1) {
                                    result[outputName] = variables[0]
                                } else {

                                }
                                break
                            }
                            case 'WarehouseAcceptanceSlip': {
                                const variables = getState().variables[fo.type].filter(x => getVariableName(x) === String(evaluateExpression(fo.values[fo.type], symbols)))
                                if (variables.length() === 1) {
                                    result[outputName] = variables[0]
                                } else {

                                }
                                break
                            }
                            default: {
                                console.log('Case not covered for NonPrimitiveType')
                            }
                        }
                        break
                    }
                }
            }
        }
    })
    return result
}
