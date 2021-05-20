import { Immutable } from "immer"
import { HashSet } from "prelude-ts"
import { FunctionName, functions } from "./functions"
import { getState } from "./store"
import { NonPrimitiveType, types } from "./types"
import { Variable } from "./variables"
import { Query, Filter, Args, getQuery, updateQuery, applyFilter } from './Filter'

export type Mapper = {
    query: boolean
    queryParams: Array<string>
    functionName: FunctionName
    functionInput: string
}

export const mappers: Record<string, Mapper> = {
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

function isNonPrimitive(typeName: string): typeName is NonPrimitiveType {
    return Object.keys(types.keys).includes(typeName)
}

function executeMapper(mapper: Mapper, args: MapperArgs) {
    const fx = functions[mapper.functionName]
    const fi = fx.inputs[mapper.functionInput]
    if (isNonPrimitive(fi.type)) {
        if (mapper.query) {
            const query: Query = getQuery(fi.type)
            Object.keys(args.queryParams).forEach(queryParam => {
                if (queryParam in query.values) {
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
                }
            })
            const unfilteredVariables: HashSet<Immutable<Variable>> = getState().variables[fi.type]
            const variables: Array<Immutable<Variable>> = unfilteredVariables.filter(variable => applyFilter(query, variable)).toArray()
            variables.forEach((variable, index) => {
                
            })
        } else {

        }
    }
}
