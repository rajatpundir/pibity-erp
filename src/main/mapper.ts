import { Immutable } from "immer"
import { HashSet, Vector } from 'prelude-ts'
import { FunctionName, functions } from "./functions"
import { getState } from "./store"
import { NonPrimitiveType, types } from "./types"
import { Variable } from "./variables"
import { Query, getQuery, applyFilter } from './Filter'
import { executeFunction } from "./function"
import { Diff, mergeDiffs } from "./layers"

export type Mapper = {
    query: boolean
    queryParams: Array<string>
    functionName: FunctionName
    functionInput: string
}

type MapperName =
    | 'mapper1'

export const mappers: Record<MapperName, Mapper> = {
    mapper1: {
        query: true,
        queryParams: ['orderable'],
        functionName: 'mapProduct',
        functionInput: 'product'
    }
}

type MapperArgs = {
    queryParams: object
    args: Array<object>
}

export function isNonPrimitive(typeName: string): typeName is NonPrimitiveType {
    return Object.keys(types).includes(typeName)
}

export function executeMapper(mapper: Mapper, args: MapperArgs): [Array<object>, boolean, Diff] {
    const fx = functions[mapper.functionName]
    const fi = fx.inputs[mapper.functionInput]
    var result = Vector.of<object>()
    var diffs = Vector.of<Diff>()
    if (isNonPrimitive(fi.type)) {
        if (mapper.query) {
            const query: Query = getQuery(fi.type)
            Object.keys(args.queryParams).forEach(queryParam => {
                if (mapper.queryParams.includes(queryParam) && Object.keys(query.values).includes(queryParam)) {
                    const value = query.values[queryParam]
                    value.checked = true
                    if ('operator' in value) {
                        switch (value.type) {
                            case 'Text': {
                                value.value = String(args.queryParams[queryParam])
                                break
                            }
                            case 'Number':
                            case 'Date':
                            case 'Timestamp':
                            case 'Time': {
                                value.value = parseInt(String(args.queryParams[queryParam]))
                                break
                            }
                            case 'Decimal': {
                                value.value = parseFloat(String(args.queryParams[queryParam]))
                                break
                            }
                            case 'Boolean': {
                                value.value = Boolean(String(args.queryParams[queryParam])).valueOf()
                                break
                            }
                        }
                    } else {
                        value.value.variableName.value = String(args.queryParams[queryParam])
                    }
                    query[queryParam] = value
                }
            })
            const unfilteredVariables: HashSet<Immutable<Variable>> = getState().variables[fi.type]
            const variables: Array<Immutable<Variable>> = unfilteredVariables.filter(variable => applyFilter(query, variable)).toArray()
            variables.forEach((variable, index) => {
                if (index < args.args.length) {
                    const functionArgs = args.args[index]
                    functionArgs[mapper.functionInput] = variable.variableName.toString()
                    const [functionResult, executionFlag, diff] = executeFunction(fx, functionArgs)
                    if (!executionFlag) {
                        return [result, false, mergeDiffs(diffs.toArray())]
                    }
                    result = result.append(functionResult)
                    diffs = diffs.append(diff)
                } else {
                    const functionArgs = args.args[args.args.length - 1]
                    functionArgs[mapper.functionInput] = variable.variableName.toString()
                    const [functionResult, symbolFlag, diff] = executeFunction(fx, functionArgs)
                    if (!symbolFlag) {
                        return [result, false, mergeDiffs(diffs.toArray())]
                    }
                    result = result.append(functionResult)
                    diffs = diffs.append(diff)
                }
            })
        } else {
            args.args.forEach(arg => {
                const [functionResult, symbolFlag, diff] = executeFunction(fx, arg)
                if (!symbolFlag) {
                    return [result, false, mergeDiffs(diffs.toArray())]
                }
                result = result.append(functionResult)
                diffs = diffs.append(diff)
            })
        }
    }
    return [result.toArray(), true, mergeDiffs(diffs.toArray())]
}
