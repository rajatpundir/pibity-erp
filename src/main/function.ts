import { Immutable } from "immer"
import { HashSet } from "prelude-ts"
import { Diff, getReplaceVariableDiff, getRemoveVariableDiff, mergeDiffs } from "./layers"
import { evaluateExpression, LispExpression, Symbols, SymbolValue } from "./lisp"
import { getState } from "./store"
import { PrimitiveType, NonPrimitiveType, types, Key } from './types'
import { replaceVariable, Variable } from "./variables"

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
    inputs: Record<string, FunctionInput>
    outputs: Record<string, FunctionOutput>
}

export const functions: Record<string, Function> = {
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


function getSymbols(symbolPaths: Array<Array<string>>, typeName: NonPrimitiveType, variableName: string): [SymbolValue, boolean] {
    const type = types[typeName]
    const symbolValue: SymbolValue = {
        type: 'Text',
        value: variableName
    }
    var symbolFlag = true
    if (symbolPaths.length !== 0) {
        symbolValue.values = {}
        const unfilteredVariables: HashSet<Immutable<Variable>> = getState().variables[typeName]
        const variables = unfilteredVariables.filter(x => x.toString() === variableName)
        if (variables.length() === 1) {
            Object.keys(type).forEach(keyName => {
                if (symbolFlag && symbolPaths.filter(x => x[0] === keyName)) {
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
                                const subSymbols = getSymbols(symbolPaths.filter(x => x[0] === keyName).map(x => x.slice(1)), key.type, variables[0].values[keyName].toString())
                                symbolValue.values[keyName] = subSymbols[0]
                                symbolFlag = symbolFlag && subSymbols[1]
                            }
                        }
                    }
                }
            })
        } else {
            // Note: Variable not found in Zustand Store (Base + Diff)
            // Resolution: 
            // 1. Check Dexie for variable and load into Zustand Store
            // 2. Information is not present, set symbolFlag to false
            symbolFlag = false
        }
    }
    return [symbolValue, symbolFlag]
}

function getSymbolsForFunction(fx: Function, args: object): [Symbols, boolean] {
    const symbolPaths = getSymbolPathsForFunction(fx)
    const symbols: Symbols = {}
    var symbolFlag = true
    Object.keys(fx.inputs).forEach(inputName => {
        if (symbolFlag && symbolPaths.filter(x => x[0] === inputName).length !== 0) {
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
                        const subSymbols = getSymbols(symbolPaths.filter(x => x[0] === inputName).map(x => x.slice(1)), fi.type, inputName in args ? String(args[inputName]) : (fi.default ? fi.default : ''))
                        symbols[inputName] = subSymbols[0]
                        symbolFlag = symbolFlag && subSymbols[1]
                    }
                    break
                }
            }
        }
    })
    return [symbols, symbolFlag]
}

export function executeFunction(fx: Function, args: object): [object, boolean] {
    const [symbols, symbolFlag] = getSymbolsForFunction(fx, args)
    const result = {}
    const diffs: Array<Diff> = []
    if (symbolFlag) {
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
                                typeName: fo.type,
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
                                        const referencedVariableName = String(evaluateExpression(fo.values[keyName], symbols))
                                        const unfilteredVariables: HashSet<Immutable<Variable>> = getState().variables[key.type]
                                        const variables = unfilteredVariables.filter(x => x.toString() === referencedVariableName)
                                        if (variables.length() === 1) {
                                            variable.values[keyName] = variables[0].variableName.toString()
                                        } else {
                                            // Note: Variable not found in Zustand Store (Base + Diff)
                                            // Resolution: 
                                            // 1. Check Dexie for variable and load into Zustand Store
                                            // 2. Information is not present, return with symbolFlag as false
                                            result[outputName] = variable
                                            return ([result, false])
                                        }
                                    }
                                }
                            })
                            result[outputName] = variable
                            // Note. Generate Diff in Zustand Store to create variable
                            const replacedVariable = replaceVariable(variable.typeName, variable.variableName, variable.values)
                            diffs.push(getReplaceVariableDiff(replacedVariable))
                            break
                        }
                        case 'update': {
                            const unfilteredVariables: HashSet<Immutable<Variable>> = getState().variables[fo.type]
                            const variables = unfilteredVariables.filter(x => x.toString() === variableName)
                            if (variables.length() === 1) {
                                const variable: Immutable<Variable> = variables[0]
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
                                            const referencedVariableName = String(evaluateExpression(fo.values[keyName], symbols))
                                            const unfilteredVariables: HashSet<Immutable<Variable>> = getState().variables[key.type]
                                            const variables = unfilteredVariables.filter(x => x.toString() === referencedVariableName)
                                            if (variables.length() === 1) {
                                                variable.values[keyName] = variables[0].variableName.toString()
                                            } else {
                                                // Note: Referenced variable not found in Zustand Store (Base + Diff)
                                                // Resolution: 
                                                // 1. Check Dexie for variable and load into Zustand Store
                                                // 2. Information is not present, return with symbolFlag as false
                                                result[outputName] = {
                                                    typeName: variable.typeName,
                                                    variableName: variable.variableName.toString(),
                                                    values: variable.values
                                                }
                                                return [result, false]
                                            }
                                        }
                                    }
                                })
                                result[outputName] = {
                                    typeName: variable.typeName,
                                    variableName: variable.variableName.toString(),
                                    values: variable.values
                                }
                                // Note. Generate Diff in Zustand Store to update variable
                                const replacedVariable = replaceVariable(variable.typeName, variable.variableName.toString(), variable.values)
                                diffs.push(getReplaceVariableDiff(replacedVariable))
                            } else {
                                // Note: Variable not found in Zustand Store (Base + Diff)
                                // Resolution: 
                                // 1. Check Dexie for variable and load into Zustand Store
                                // 2. If Information is not present in Dexie, then no issue since user did not had the variable in first place.
                                // 3. Care must be taken to not refer the the FunctionOutput in Circuit which has an update operation since it may not have been actually performed due to lack of information.
                            }
                            break
                        }
                        case 'delete': {
                            // Note: Care must be taken to not refer the the FunctionOutput in Circuit which is deleted.
                            // Note. Generate Diff in Zustand Store to update variable
                            diffs.push(getRemoveVariableDiff(fo.type, variableName))
                            break
                        }
                    }
                }
            }
        })
    }
    if(symbolFlag) {
        getState().addDiff(mergeDiffs(diffs))
    }
    return [result, symbolFlag]
}
