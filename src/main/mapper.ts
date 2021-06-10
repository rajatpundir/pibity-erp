import { Immutable } from 'immer'
import { Vector } from 'prelude-ts'
import { FunctionName, functions } from "./functions"
import { NonPrimitiveType, types } from "./types"
import { Variable } from "./variables"
import { Query, getQuery, applyFilter } from './Filter'
import { executeFunction } from "./function"
import { DiffVariable, getVariables, mergeDiffs } from "./layers"

export type Mapper = {
    query: boolean
    queryParams: Array<string>
    functionName: FunctionName
    functionInput: string
}

export type MapperName =
    | 'createUOMs'
    | 'createIndentItems'
    | 'createQuotationItems'
    | 'createPurchaseOrderItems'
    | 'createPurchaseInvoiceItems'
    | 'createMaterialApprovalSlipItems'
    | 'createMaterialRejectionSlipItems'
    | 'createMaterialReturnSlipItems'
    | 'createMaterialRequistionSlipItems'
    | 'createBOMItems'
    | 'createProductionPreparationSlipItems'

export const mappers: Record<MapperName, Mapper> = {
    createUOMs: {
        query: false,
        queryParams: [],
        functionName: 'createUOM',
        functionInput: 'product'
    },
    createIndentItems: {
        query: false,
        queryParams: [],
        functionName: 'createIndentItem',
        functionInput: 'indent'
    },
    createQuotationItems: {
        query: false,
        queryParams: [],
        functionName: 'createQuotationItem',
        functionInput: 'quotation'
    },
    createPurchaseOrderItems: {
        query: false,
        queryParams: [],
        functionName: 'createPurchaseOrderItem',
        functionInput: 'purchaseOrder'
    },
    createPurchaseInvoiceItems: {
        query: false,
        queryParams: [],
        functionName: 'createPurchaseInvoiceItem',
        functionInput: 'purchaseInvoice'
    },
    createMaterialApprovalSlipItems: {
        query: false,
        queryParams: [],
        functionName: 'createMaterialApprovalSlipItem',
        functionInput: 'materialApprovalSlip'
    },
    createMaterialRejectionSlipItems: {
        query: false,
        queryParams: [],
        functionName: 'createMaterialRejectionSlipItem',
        functionInput: 'materialRejectionSlip'
    },
    createMaterialReturnSlipItems: {
        query: false,
        queryParams: [],
        functionName: 'createMaterialReturnSlipItem',
        functionInput: 'materialReturnSlip'
    },
    createMaterialRequistionSlipItems: {
        query: false,
        queryParams: [],
        functionName: 'createMaterialRequistionSlipItem',
        functionInput: 'materialRequistionSlip'
    },
    createBOMItems: {
        query: false,
        queryParams: [],
        functionName: 'createBOMItem',
        functionInput: 'bom'
    },
    createProductionPreparationSlipItems: {
        query: false,
        queryParams: [],
        functionName: 'createProductionPreparationSlipItem',
        functionInput: 'productionPreparationSlip'
    }
}

type MapperArgs = {
    queryParams: object
    args: Array<object>
}

export function isNonPrimitive(typeName: string): typeName is NonPrimitiveType {
    return Object.keys(types).includes(typeName)
}

export async function executeMapper(mapper: Mapper, args: MapperArgs, overlay: Vector<DiffVariable>): Promise<[Array<object>, boolean, DiffVariable]> {
    const fx = functions[mapper.functionName]
    const fi = fx.inputs[mapper.functionInput]
    console.log(args, '--mapper--', overlay)
    var result = Vector.of<object>()
    var diffs = Vector.of<DiffVariable>()
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

            const unfilteredVariables = await getVariables(fi.type)
            const variables: Array<Immutable<Variable>> = unfilteredVariables.filter(variable => applyFilter(query, variable))
            // Note. Await does not work inside forEach loop.
            variables.forEach(async (variable, index) => {
                if (index < args.args.length) {
                    const functionArgs = args.args[index]
                    functionArgs[mapper.functionInput] = variable.variableName.toString()
                    const [functionResult, symbolFlag, diff] = await executeFunction(fx, functionArgs, overlay)
                    if (!symbolFlag) {
                        return [result, false, mergeDiffs(diffs.toArray())]
                    }
                    result = result.append(functionResult)
                    diffs = diffs.append(diff)
                } else {
                    const functionArgs = args.args[args.args.length - 1]
                    functionArgs[mapper.functionInput] = variable.variableName.toString()
                    const [functionResult, symbolFlag, diff] = await executeFunction(fx, functionArgs, overlay)
                    if (!symbolFlag) {
                        return [result, false, mergeDiffs(diffs.toArray())]
                    }
                    result = result.append(functionResult)
                    diffs = diffs.append(diff)
                }
            })
        } else {
            for (const key in args.args) {
                const arg = args.args[key]
                const [functionResult, symbolFlag, diff] = await executeFunction(fx, arg, overlay)
                console.log('$$', functionResult, symbolFlag, diff)
                if (!symbolFlag) {
                    return [result.toArray(), false, mergeDiffs(diffs.toArray())]
                }
                result = result.append(functionResult)
                diffs = diffs.append(diff)
            }
        }
    }
    return [result.toArray(), true, mergeDiffs(diffs.toArray())]
}
