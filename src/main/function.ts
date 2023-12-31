import { Vector } from "prelude-ts"
import { getReplaceVariableDiff, getRemoveVariableDiff, mergeDiffs, getVariable, DiffVariable } from "./layers"
import { evaluateExpression, LispExpression, Symbols, SymbolValue } from "./lisp"
import { counter } from "./mutation"
import { PrimitiveType, NonPrimitiveType, types, Key } from './types'
import { replaceVariable } from "./variables"

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
        default?: number
        values?: { [index: string]: LispExpression }
    }

type FunctionOutput =
    | {
        type: PrimitiveType
        value: LispExpression
    }
    | {
        op: 'create'
        type: NonPrimitiveType
        values: { [index: string]: LispExpression }
    }
    | {
        op: 'update'
        type: NonPrimitiveType
        id: LispExpression
        values: { [index: string]: LispExpression }
    }
    | {
        op: 'delete'
        type: NonPrimitiveType
        id: LispExpression
    }

export type Function = {
    inputs: Record<string, FunctionInput>
    outputs: Record<string, FunctionOutput>
}

function getSymbolPaths(expression: LispExpression): Array<ReadonlyArray<string>> {
    var symbolPaths: Array<ReadonlyArray<string>> = []
    if (expression.op === '.') {
        symbolPaths.push(expression.args)
    } else {
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
    }
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
            const type = types[fi.type]
            Object.keys(type.keys).forEach(keyName => {
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
            if (fo.op !== 'create') {
                getSymbolPaths(fo.id).forEach(x => symbolPaths.push(x))
            }
            if (fo.op !== 'delete') {
                const type = types[fo.type]
                Object.keys(type.keys).forEach(keyName => {
                    if (fo.values !== undefined) {
                        if (keyName in fo.values) {
                            const valueExpression = fo.values[keyName]
                            getSymbolPaths(valueExpression).forEach(x => symbolPaths.push(x))
                        }
                    }
                })

            }
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

async function getSymbols(symbolPaths: Array<Array<string>>, typeName: NonPrimitiveType, id: number, overlay: Vector<DiffVariable>): Promise<[SymbolValue, boolean]> {
    const type = types[typeName]
    const symbolValue: SymbolValue = {
        type: 'Number',
        value: id
    }
    var symbolFlag = true
    if (symbolPaths.length !== 0 && symbolPaths.filter(x => x.length !== 0).length !== 0) {
        symbolValue.values = {}
        const variable = await getVariable(typeName, id, overlay)
        if (variable === undefined) {
            symbolFlag = false
        } else {
            for (const keyName in type) {
                if (symbolFlag && symbolPaths.filter(x => x[0] === keyName)) {
                    const key: Key = type[keyName]
                    if (symbolValue['values'] !== undefined && key.type !== 'Formula') {
                        switch (key.type) {
                            case 'Text': {
                                symbolValue.values[keyName] = {
                                    type: key.type,
                                    value: variable.values[keyName]
                                }
                                break
                            }
                            case 'Number':
                            case 'Date':
                            case 'Timestamp':
                            case 'Time': {
                                symbolValue.values[keyName] = {
                                    type: 'Number',
                                    value: variable.values[keyName]
                                }
                                break
                            }
                            case 'Decimal': {
                                symbolValue.values[keyName] = {
                                    type: 'Decimal',
                                    value: variable.values[keyName]
                                }
                                break
                            }
                            case 'Boolean': {
                                symbolValue.values[keyName] = {
                                    type: key.type,
                                    value: variable.values[keyName]
                                }
                                break
                            }
                            // default: {
                            //     const subSymbols = await getSymbols(symbolPaths.filter(x => x[0] === keyName).map(x => x.slice(1)), key.type, variable.values[keyName].toString(), overlay)
                            //     symbolValue.values[keyName] = subSymbols[0]
                            //     symbolFlag = symbolFlag && subSymbols[1]
                            // }
                        }
                    }
                }
            }
        }
    }
    return [symbolValue, symbolFlag]
}

async function getSymbolsForFunction(fx: Function, args: object, overlay: Vector<DiffVariable>): Promise<[Symbols, boolean]> {
    const symbolPaths = getSymbolPathsForFunction(fx)
    const symbols: Symbols = {}
    var symbolFlag = true
    Object.keys(fx.inputs).forEach(async inputName => {
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
                        const subSymbols = await getSymbols(symbolPaths.filter(x => x[0] === inputName).map(x => x.slice(1)), fi.type, inputName in args ? parseInt(args[inputName]) : (fi.default ? fi.default : -1), overlay)
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

export async function executeFunction(fx: Function, args: object, overlay: Vector<DiffVariable>): Promise<[object, boolean, DiffVariable]> {
    console.log('function', args)
    const [symbols, symbolFlag] = await getSymbolsForFunction(fx, args, overlay)
    const result = {}
    var diffs: Vector<DiffVariable> = Vector.of()
    if (symbolFlag) {
        for (const outputName in fx.outputs) {
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
                    switch (fo.op) {
                        case 'create': {
                            const createdVariable = {
                                typeName: fo.type,
                                values: {}
                            }
                            for (const keyName in types[fo.type].keys) {
                                const key: Key = types[fo.type].keys[keyName]
                                switch (key.type) {
                                    case 'Text': {
                                        createdVariable.values[keyName] = String(evaluateExpression(fo.values[keyName], symbols))
                                        break
                                    }
                                    case 'Number':
                                    case 'Date':
                                    case 'Timestamp':
                                    case 'Time': {
                                        createdVariable.values[keyName] = parseInt(String(evaluateExpression(fo.values[keyName], symbols)))
                                        break
                                    }
                                    case 'Decimal': {
                                        createdVariable.values[keyName] = parseFloat(String(evaluateExpression(fo.values[keyName], symbols)))
                                        break
                                    }
                                    case 'Boolean': {
                                        createdVariable.values[keyName] = Boolean(evaluateExpression(fo.values[keyName], symbols)).valueOf()
                                        break
                                    }
                                    case 'Formula': {
                                        // evaluate Formula here?
                                        break
                                    }
                                    // default: {
                                    //     const referencedVariable = await getVariable(key.type, parseInt(String(evaluateExpression(fo.values[keyName], symbols))), overlay)
                                    //     if (referencedVariable !== undefined) {
                                    //         createdVariable.values[keyName] = referencedVariable.id.toString()
                                    //     } else {
                                    //         // Information is not present, return with symbolFlag as false
                                    //         result[outputName] = createdVariable
                                    //         return ([result, false, mergeDiffs(diffs.toArray())])
                                    //     }
                                    // }
                                }
                            }
                            result[outputName] = createdVariable
                            const replacedVariable = replaceVariable(createdVariable.typeName, counter.getId(), createdVariable.values)
                            diffs = diffs.append(getReplaceVariableDiff(replacedVariable))
                            console.log(replacedVariable)
                            break
                        }
                        case 'update': {
                            const id: number = parseInt(String(evaluateExpression(fo.id, symbols)))
                            const updatedVariable = {
                                typeName: fo.type,
                                id: id,
                                values: {}
                            }
                            const variable = await getVariable(fo.type, id, overlay)
                            if (variable !== undefined) {
                                Object.keys(variable.values).forEach(keyName => {
                                    updatedVariable.values[keyName] = variable.values[keyName]
                                })
                                for (const keyName in fo.values) {
                                    const key: Key = types[fo.type].keys[keyName]
                                    switch (key.type) {
                                        case 'Text': {
                                            updatedVariable.values[keyName] = String(evaluateExpression(fo.values[keyName], symbols))
                                            break
                                        }
                                        case 'Number':
                                        case 'Date':
                                        case 'Timestamp':
                                        case 'Time': {
                                            updatedVariable.values[keyName] = parseInt(String(evaluateExpression(fo.values[keyName], symbols)))
                                            break
                                        }
                                        case 'Decimal': {
                                            updatedVariable.values[keyName] = parseFloat(String(evaluateExpression(fo.values[keyName], symbols)))
                                            break
                                        }
                                        case 'Boolean': {
                                            updatedVariable.values[keyName] = Boolean(evaluateExpression(fo.values[keyName], symbols)).valueOf()
                                            break
                                        }
                                        case 'Formula': {
                                            // TODO.
                                            break
                                        }
                                        // default: {
                                        //     const referencedVariable = await getVariable(key.type, parseInt(String(evaluateExpression(fo.values[keyName], symbols))), overlay)
                                        //     if (referencedVariable !== undefined) {
                                        //         updatedVariable.values[keyName] = referencedVariable.id.toString()
                                        //     } else {
                                        //         // Information is not present, return with symbolFlag as false
                                        //         result[outputName] = {
                                        //             typeName: updatedVariable.typeName,
                                        //             variableName: updatedVariable.id.toString(),
                                        //             values: updatedVariable.values
                                        //         }
                                        //         return [result, false, mergeDiffs(diffs.toArray())]
                                        //     }
                                        // }
                                    }
                                }
                                result[outputName] = {
                                    typeName: updatedVariable.typeName,
                                    variableName: updatedVariable.id.toString(),
                                    values: updatedVariable.values
                                }
                                const replacedVariable = replaceVariable(updatedVariable.typeName, updatedVariable.id, updatedVariable.values)
                                diffs = diffs.append(getReplaceVariableDiff(replacedVariable))
                            } else {
                                // 1. Information is not present in Dexie, then no issue since user did not had the variable in first place.
                                // 2. Care must be taken to not refer the the FunctionOutput in Circuit which has an update operation since it may not have been actually performed due to lack of information.
                            }
                            break
                        }
                        case 'delete': {
                            const id: number = parseInt(String(evaluateExpression(fo.id, symbols)))
                            // Note: Care must be taken to not refer the the FunctionOutput in Circuit which is deleted.
                            // Note. Generate Diff in Zustand Store to update variable
                            diffs = diffs.append(getRemoveVariableDiff(fo.type, id))
                            break
                        }
                    }
                }
            }
        }
        Object.keys(fx.inputs).forEach(async inputName => {
            const fi = fx.inputs[inputName]
            switch (fi.type) {
                case 'Text':
                case 'Number':
                case 'Decimal':
                case 'Boolean':
                case 'Date':
                case 'Timestamp':
                case 'Time': { break }
                default: {
                    if (fi.values !== undefined) {
                        const updatedVariable = {
                            typeName: fi.type,
                            id: parseInt(String(symbols[inputName].value)),
                            values: {}
                        }
                        const variable = await getVariable(fi.type, parseInt(String(symbols[inputName].value)), overlay)
                        if (variable !== undefined) {
                            Object.keys(variable.values).forEach(keyName => {
                                updatedVariable.values[keyName] = variable.values[keyName]
                            })
                            if (fi.values !== undefined) {
                                for (const keyName in fi.values) {
                                    const key: Key = types[fi.type].keys[keyName]
                                    if (fi.values !== undefined) {
                                        switch (key.type) {
                                            case 'Text': {
                                                updatedVariable.values[keyName] = String(evaluateExpression(fi.values[keyName], symbols))
                                                break
                                            }
                                            case 'Number':
                                            case 'Date':
                                            case 'Timestamp':
                                            case 'Time': {
                                                updatedVariable.values[keyName] = parseInt(String(evaluateExpression(fi.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Decimal': {
                                                updatedVariable.values[keyName] = parseFloat(String(evaluateExpression(fi.values[keyName], symbols)))
                                                break
                                            }
                                            case 'Boolean': {
                                                updatedVariable.values[keyName] = Boolean(evaluateExpression(fi.values[keyName], symbols)).valueOf()
                                                break
                                            }
                                            case 'Formula': {
                                                // Re-evaluate formula expression here, maybe.
                                                break
                                            }
                                            // default: {
                                            //     const referencedVariable = await getVariable(key.type, parseInt(String(evaluateExpression(fi.values[keyName], symbols))), overlay)
                                            //     if (referencedVariable !== undefined) {
                                            //         updatedVariable.values[keyName] = referencedVariable.id.toString()
                                            //     } else {
                                            //         // Information is not present, return with symbolFlag as false
                                            //         return [result, false, mergeDiffs(diffs.toArray())]
                                            //     }
                                            // }
                                        }
                                    }
                                }
                            }
                            const replacedVariable = replaceVariable(updatedVariable.typeName, updatedVariable.id, updatedVariable.values)
                            diffs = diffs.append(getReplaceVariableDiff(replacedVariable))
                        }
                    }
                }
            }
        })
    }
    return [result, symbolFlag, mergeDiffs(diffs.toArray())]
}
