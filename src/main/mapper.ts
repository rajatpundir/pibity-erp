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
    | 'createCountries'
    | 'deleteCountries'

    | 'createStates'
    | 'deleteStates'

    | 'createDistricts'
    | 'deleteDistricts'

    | 'createSubdistricts'
    | 'deleteSubdistricts'

    | 'createPostalCodes'
    | 'deletePostalCodes'

    | 'createAddresses'
    | 'deleteAddresses'

    | 'createBankBranches'
    | 'deleteBankBranches'

    | 'createBankAccounts'
    | 'deleteBankAccounts'

    | 'createCompanyAddresses'
    | 'deleteCompanyAddresses'

    | 'createCompanyContacts'
    | 'deleteCompanyContacts'

    | 'createCompanyBankAccounts'
    | 'deleteCompanyBankAccounts'

    | 'createBankAccountCompanies'
    | 'deleteBankAccountCompanies'

    | 'createUOMs'
    | 'deleteUOMs'

    | 'createIndentItems'
    | 'deleteIndentItems'

    | 'createProductCompanies'
    | 'deleteProductCompanies'

    | 'createCompanyProducts'
    | 'deleteCompanyProducts'

    | 'createQuotationItems'
    | 'deleteQuotationItems'

    | 'createPurchaseOrderItems'
    | 'deletePurchaseOrderItems'

    | 'createPurchaseInvoiceItems'
    | 'deletePurchaseInvoiceItems'

    | 'createMaterialApprovalSlipItems'
    | 'deleteMaterialApprovalSlipItems'

    | 'createMaterialRejectionSlipItems'
    | 'deleteMaterialRejectionSlipItems'

    | 'createMaterialReturnSlipItems'
    | 'deleteMaterialReturnSlipItems'

    | 'createMaterialRequistionSlipItems'
    | 'deleteMaterialRequistionSlipItems'

    | 'createBOMItems'
    | 'deleteBOMItems'

    | 'createProductionPreparationSlipItems'
    | 'deleteProductionPreparationSlipItems'

export const mappers: Record<MapperName, Mapper> = {
    createCountries: {
        query: false,
        queryParams: [],
        functionName: 'createCountry',
        functionInput: 'region'
    },
    deleteCountries: {
        query: true,
        queryParams: ['region'],
        functionName: 'deleteCountry',
        functionInput: 'variableName'
    },
    createStates: {
        query: false,
        queryParams: [],
        functionName: 'createState',
        functionInput: 'country'
    },
    deleteStates: {
        query: true,
        queryParams: ['country'],
        functionName: 'deleteState',
        functionInput: 'variableName'
    },
    createDistricts: {
        query: false,
        queryParams: [],
        functionName: 'createDistrict',
        functionInput: 'state'
    },
    deleteDistricts: {
        query: true,
        queryParams: ['state'],
        functionName: 'deleteDistrict',
        functionInput: 'variableName'
    },
    createSubdistricts: {
        query: false,
        queryParams: [],
        functionName: 'createSubdistrict',
        functionInput: 'district'
    },
    deleteSubdistricts: {
        query: true,
        queryParams: ['district'],
        functionName: 'deleteSubdistrict',
        functionInput: 'variableName'
    },
    createPostalCodes: {
        query: false,
        queryParams: [],
        functionName: 'createPostalCode',
        functionInput: 'subdistrict'
    },
    deletePostalCodes: {
        query: true,
        queryParams: ['subdistrict'],
        functionName: 'deletePostalCode',
        functionInput: 'variableName'
    },
    createAddresses: {
        query: false,
        queryParams: [],
        functionName: 'createAddress',
        functionInput: 'postalCode'
    },
    deleteAddresses: {
        query: true,
        queryParams: ['postalCode'],
        functionName: 'deleteAddress',
        functionInput: 'variableName'
    },
    createBankBranches: {
        query: false,
        queryParams: [],
        functionName: 'createBankBranch',
        functionInput: 'bank'
    },
    deleteBankBranches: {
        query: true,
        queryParams: ['bank'],
        functionName: 'deleteBankBranch',
        functionInput: 'variableName'
    },
    createBankAccounts: {
        query: false,
        queryParams: [],
        functionName: 'createBankAccount',
        functionInput: 'bankBranch'
    },
    deleteBankAccounts: {
        query: true,
        queryParams: ['bankBranch'],
        functionName: 'deleteBankAccount',
        functionInput: 'variableName'
    },
    createCompanyAddresses: {
        query: false,
        queryParams: [],
        functionName: 'createCompanyAddress',
        functionInput: 'company'
    },
    deleteCompanyAddresses: {
        query: true,
        queryParams: ['company'],
        functionName: 'deleteCompanyAddress',
        functionInput: 'variableName'
    },
    createCompanyContacts: {
        query: false,
        queryParams: [],
        functionName: 'createCompanyContact',
        functionInput: 'company'
    },
    deleteCompanyContacts: {
        query: true,
        queryParams: ['company'],
        functionName: 'deleteCompanyContact',
        functionInput: 'variableName'
    },
    createCompanyBankAccounts: {
        query: false,
        queryParams: [],
        functionName: 'createCompanyBankAccount',
        functionInput: 'company'
    },
    deleteCompanyBankAccounts: {
        query: true,
        queryParams: ['region'],
        functionName: 'deleteCompanyBankAccount',
        functionInput: 'company'
    },
    createBankAccountCompanies: {
        query: false,
        queryParams: [],
        functionName: 'createCompanyBankAccount',
        functionInput: 'bankAccount'
    },
    deleteBankAccountCompanies: {
        query: true,
        queryParams: ['bankAccount'],
        functionName: 'deleteCompanyBankAccount',
        functionInput: 'variableName'
    },
    createUOMs: {
        query: false,
        queryParams: [],
        functionName: 'createUOM',
        functionInput: 'product'
    },
    deleteUOMs: {
        query: true,
        queryParams: ['product'],
        functionName: 'deleteUOM',
        functionInput: 'variableName'
    },
    createIndentItems: {
        query: false,
        queryParams: [],
        functionName: 'createIndentItem',
        functionInput: 'indent'
    },
    deleteIndentItems: {
        query: true,
        queryParams: ['indent'],
        functionName: 'deleteIndentItem',
        functionInput: 'variableName'
    },
    createCompanyProducts: {
        query: false,
        queryParams: [],
        functionName: 'createCompanyProduct',
        functionInput: 'company'
    },
    deleteCompanyProducts: {
        query: true,
        queryParams: ['company'],
        functionName: 'deleteCompanyProduct',
        functionInput: 'variableName'
    },
    createProductCompanies: {
        query: false,
        queryParams: [],
        functionName: 'createCompanyProduct',
        functionInput: 'product'
    },
    deleteProductCompanies: {
        query: true,
        queryParams: ['product'],
        functionName: 'deleteCompanyProduct',
        functionInput: 'variableName'
    },
    createQuotationItems: {
        query: false,
        queryParams: [],
        functionName: 'createQuotationItem',
        functionInput: 'quotation'
    },
    deleteQuotationItems: {
        query: true,
        queryParams: ['quotation'],
        functionName: 'deleteQuotationItem',
        functionInput: 'variableName'
    },
    createPurchaseOrderItems: {
        query: false,
        queryParams: [],
        functionName: 'createPurchaseOrderItem',
        functionInput: 'purchaseOrder'
    },
    deletePurchaseOrderItems: {
        query: true,
        queryParams: ['purchaseOrder'],
        functionName: 'deletePurchaseOrderItem',
        functionInput: 'variableName'
    },
    createPurchaseInvoiceItems: {
        query: false,
        queryParams: [],
        functionName: 'createPurchaseInvoiceItem',
        functionInput: 'purchaseInvoice'
    },
    deletePurchaseInvoiceItems: {
        query: true,
        queryParams: ['purchaseInvoice'],
        functionName: 'deletePurchaseInvoiceItem',
        functionInput: 'variableName'
    },
    createMaterialApprovalSlipItems: {
        query: false,
        queryParams: [],
        functionName: 'createMaterialApprovalSlipItem',
        functionInput: 'materialApprovalSlip'
    },
    deleteMaterialApprovalSlipItems: {
        query: true,
        queryParams: ['materialApprovalSlip'],
        functionName: 'deleteMaterialApprovalSlipItem',
        functionInput: 'variableName'
    },
    createMaterialRejectionSlipItems: {
        query: false,
        queryParams: [],
        functionName: 'createMaterialRejectionSlipItem',
        functionInput: 'materialRejectionSlip'
    },
    deleteMaterialRejectionSlipItems: {
        query: true,
        queryParams: ['materialRejectionSlip'],
        functionName: 'deleteMaterialRejectionSlipItem',
        functionInput: 'variableName'
    },
    createMaterialReturnSlipItems: {
        query: false,
        queryParams: [],
        functionName: 'createMaterialReturnSlipItem',
        functionInput: 'materialReturnSlip'
    },
    deleteMaterialReturnSlipItems: {
        query: true,
        queryParams: ['materialReturnSlip'],
        functionName: 'deleteMaterialReturnSlipItem',
        functionInput: 'variableName'
    },
    createMaterialRequistionSlipItems: {
        query: false,
        queryParams: [],
        functionName: 'createMaterialRequistionSlipItem',
        functionInput: 'materialRequistionSlip'
    },
    deleteMaterialRequistionSlipItems: {
        query: true,
        queryParams: ['materialRequistionSlip'],
        functionName: 'deleteMaterialRequistionSlipItem',
        functionInput: 'variableName'
    },
    createBOMItems: {
        query: false,
        queryParams: [],
        functionName: 'createBOMItem',
        functionInput: 'bom'
    },
    deleteBOMItems: {
        query: true,
        queryParams: ['bom'],
        functionName: 'deleteBOMItem',
        functionInput: 'variableName'
    },
    createProductionPreparationSlipItems: {
        query: false,
        queryParams: [],
        functionName: 'createProductionPreparationSlipItem',
        functionInput: 'productionPreparationSlip'
    },
    deleteProductionPreparationSlipItems: {
        query: true,
        queryParams: ['productionPreparationSlip'],
        functionName: 'deleteProductionPreparationSlipItem',
        functionInput: 'variableName'
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
    console.log('mapper', args)
    const fx = functions[mapper.functionName]
    const fi = fx.inputs[mapper.functionInput]
    var result: Array<object> = []
    var diffs = Vector.of<DiffVariable>()
    if (isNonPrimitive(fi.type)) {
        if (mapper.query) {
            const query: Query = getQuery(fi.type)
            for (const queryParam in args.queryParams) {
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
                        value.value.variableName.checked = true
                    }
                    query[queryParam] = value
                }
            }
            const unfilteredVariables = await getVariables(fi.type, overlay)
            const variables: Array<Immutable<Variable>> = unfilteredVariables.filter(variable => applyFilter(query, variable)).toArray()
            for (let index = 0; index < variables.length; index++) {
                const variable = variables[index]
                if (index < args.args.length) {
                    const functionArgs = args.args[index]
                    functionArgs[mapper.functionInput] = variable.variableName.toString()
                    const [functionResult, symbolFlag, diff] = await executeFunction(fx, functionArgs, overlay)
                    if (!symbolFlag) {
                        return [result, false, mergeDiffs(diffs.toArray())]
                    }
                    result.push(functionResult)
                    diffs = diffs.append(diff)
                } else {
                    const functionArgs = args.args[args.args.length - 1]
                    functionArgs[mapper.functionInput] = variable.variableName.toString()
                    const [functionResult, symbolFlag, diff] = await executeFunction(fx, functionArgs, overlay)
                    if (!symbolFlag) {
                        return [result, false, mergeDiffs(diffs.toArray())]
                    }
                    result.push(functionResult)
                    diffs = diffs.append(diff)
                }
            }
        } else {
            for (const key in args.args) {
                const arg = args.args[key]
                const [functionResult, symbolFlag, diff] = await executeFunction(fx, arg, overlay)
                if (!symbolFlag) {
                    return [result, false, mergeDiffs(diffs.toArray())]
                }
                result.push(functionResult)
                diffs = diffs.append(diff)
            }
        }
    }
    return [result, true, mergeDiffs(diffs.toArray())]
}
