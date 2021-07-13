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
    | 'createCountry'
    | 'deleteCountry'
    | 'createState'
    | 'deleteState'
    | 'createDistrict'
    | 'deleteDistrict'
    | 'createSubdistrict'
    | 'deleteSubdistrict'
    | 'createPostalCode'
    | 'deletePostalCode'
    | 'createAddress'
    | 'deleteAddress'
    | 'createCompanyAddress'
    | 'deleteCompanyAddress'
    | 'createCompanyTag'
    | 'deleteCompanyTag'
    | 'createMappingCompanyTag'
    | 'deleteMappingCompanyTag'
    | 'createContactAddress'
    | 'deleteContactAddress'
    | 'createCompanyContact'
    | 'deleteCompanyContact'
    | 'createCurrencyRate'
    | 'deleteCurrencyRate'
    | 'createMemo'
    | 'deleteMemo'
    | 'createBankBranch'
    | 'deleteBankBranch'
    | 'createBankAccount'
    | 'deleteBankAccount'
    | 'createCompanyBankAccount'
    | 'deleteCompanyBankAccount'
    | 'createBankAccountCompany'
    | 'deleteBankAccountCompany'
    | 'createProductCategory'
    | 'deleteProductCategory'
    | 'createCompanyProduct'
    | 'deleteCompanyProduct'
    | 'createProductCompany'
    | 'deleteProductCompany'
    | 'createProductTag'
    | 'deleteProductTag'
    | 'createMappingProductTag'
    | 'deleteMappingProductTag'
    | 'createUOM'
    | 'deleteUOM'
    | 'createIndentItem'
    | 'deleteIndentItem'
    | 'createQuotationItem'
    | 'deleteQuotationItem'
    | 'createPurchaseOrderItem'
    | 'deletePurchaseOrderItem'
    | 'createPurchaseInvoiceItem'
    | 'deletePurchaseInvoiceItem'
    | 'createMaterialApprovalSlipItem'
    | 'deleteMaterialApprovalSlipItem'
    | 'createMaterialRejectionSlipItem'
    | 'deleteMaterialRejectionSlipItem'
    | 'createMaterialReturnSlipItem'
    | 'deleteMaterialReturnSlipItem'
    | 'createMaterialRequistionSlipItem'
    | 'deleteMaterialRequistionSlipItem'
    | 'createBOMItem'
    | 'deleteBOMItem'
    | 'createProductionPreparationSlipItem'
    | 'deleteProductionPreparationSlipItem'

export const mappers: Record<MapperName, Mapper> = {
    createCountry: {
        query: false,
        queryParams: [],
        functionName: 'createCountry',
        functionInput: 'region'
    },
    deleteCountry: {
        query: true,
        queryParams: ['region'],
        functionName: 'deleteCountry',
        functionInput: 'id'
    },
    createState: {
        query: false,
        queryParams: [],
        functionName: 'createState',
        functionInput: 'country'
    },
    deleteState: {
        query: true,
        queryParams: ['country'],
        functionName: 'deleteState',
        functionInput: 'id'
    },
    createDistrict: {
        query: false,
        queryParams: [],
        functionName: 'createDistrict',
        functionInput: 'state'
    },
    deleteDistrict: {
        query: true,
        queryParams: ['state'],
        functionName: 'deleteDistrict',
        functionInput: 'id'
    },
    createSubdistrict: {
        query: false,
        queryParams: [],
        functionName: 'createSubdistrict',
        functionInput: 'district'
    },
    deleteSubdistrict: {
        query: true,
        queryParams: ['district'],
        functionName: 'deleteSubdistrict',
        functionInput: 'id'
    },
    createPostalCode: {
        query: false,
        queryParams: [],
        functionName: 'createPostalCode',
        functionInput: 'subdistrict'
    },
    deletePostalCode: {
        query: true,
        queryParams: ['subdistrict'],
        functionName: 'deletePostalCode',
        functionInput: 'id'
    },
    createAddress: {
        query: false,
        queryParams: [],
        functionName: 'createAddress',
        functionInput: 'postalCode'
    },
    deleteAddress: {
        query: true,
        queryParams: ['postalCode'],
        functionName: 'deleteAddress',
        functionInput: 'id'
    },
    createCompanyAddress: {
        query: false,
        queryParams: [],
        functionName: 'createCompanyAddress',
        functionInput: 'company'
    },
    deleteCompanyAddress: {
        query: true,
        queryParams: ['company'],
        functionName: 'deleteCompanyAddress',
        functionInput: 'id'
    },
    createCompanyTag: {
        query: false,
        queryParams: [],
        functionName: 'createCompanyTag',
        functionInput: 'group'
    },
    deleteCompanyTag: {
        query: true,
        queryParams: ['group'],
        functionName: 'deleteCompanyTag',
        functionInput: 'id'
    },
    createMappingCompanyTag: {
        query: false,
        queryParams: [],
        functionName: 'createMappingCompanyTag',
        functionInput: 'company'
    },
    deleteMappingCompanyTag: {
        query: true,
        queryParams: ['company'],
        functionName: 'deleteMappingCompanyTag',
        functionInput: 'id'
    },
    createContactAddress: {
        query: false,
        queryParams: [],
        functionName: 'createContactAddress',
        functionInput: 'contact'
    },
    deleteContactAddress: {
        query: true,
        queryParams: ['contact'],
        functionName: 'deleteContactAddress',
        functionInput: 'id'
    },
    createCompanyContact: {
        query: false,
        queryParams: [],
        functionName: 'createCompanyContact',
        functionInput: 'company'
    },
    deleteCompanyContact: {
        query: true,
        queryParams: ['company'],
        functionName: 'deleteCompanyContact',
        functionInput: 'id'
    },
    createCurrencyRate: {
        query: false,
        queryParams: [],
        functionName: 'createCurrencyRate',
        functionInput: 'currency'
    },
    deleteCurrencyRate: {
        query: true,
        queryParams: ['currency'],
        functionName: 'deleteCurrencyRate',
        functionInput: 'id'
    },
    createMemo: {
        query: false,
        queryParams: [],
        functionName: 'createMemo',
        functionInput: 'company'
    },
    deleteMemo: {
        query: true,
        queryParams: ['company'],
        functionName: 'deleteMemo',
        functionInput: 'id'
    },
    createBankBranch: {
        query: false,
        queryParams: [],
        functionName: 'createBankBranch',
        functionInput: 'bank'
    },
    deleteBankBranch: {
        query: true,
        queryParams: ['bank'],
        functionName: 'deleteBankBranch',
        functionInput: 'id'
    },
    createBankAccount: {
        query: false,
        queryParams: [],
        functionName: 'createBankAccount',
        functionInput: 'bankBranch'
    },
    deleteBankAccount: {
        query: true,
        queryParams: ['bankBranch'],
        functionName: 'deleteBankAccount',
        functionInput: 'id'
    },
    createCompanyBankAccount: {
        query: false,
        queryParams: [],
        functionName: 'createCompanyBankAccount',
        functionInput: 'company'
    },
    deleteCompanyBankAccount: {
        query: true,
        queryParams: ['company'],
        functionName: 'deleteCompanyBankAccount',
        functionInput: 'id'
    },
    createBankAccountCompany: {
        query: false,
        queryParams: [],
        functionName: 'createCompanyBankAccount',
        functionInput: 'bankAccount'
    },
    deleteBankAccountCompany: {
        query: true,
        queryParams: ['bankAccount'],
        functionName: 'deleteCompanyBankAccount',
        functionInput: 'id'
    },
    createProductCategory: {
        query: false,
        queryParams: [],
        functionName: 'createProductCategory',
        functionInput: 'parent'
    },
    deleteProductCategory: {
        query: true,
        queryParams: ['parent'],
        functionName: 'deleteProductCategory',
        functionInput: 'id'
    },
    createCompanyProduct: {
        query: false,
        queryParams: [],
        functionName: 'createCompanyProduct',
        functionInput: 'company'
    },
    deleteCompanyProduct: {
        query: true,
        queryParams: ['company'],
        functionName: 'deleteCompanyProduct',
        functionInput: 'id'
    },
    createProductCompany: {
        query: false,
        queryParams: [],
        functionName: 'createCompanyProduct',
        functionInput: 'product'
    },
    deleteProductCompany: {
        query: true,
        queryParams: ['product'],
        functionName: 'deleteCompanyProduct',
        functionInput: 'id'
    },
    createProductTag: {
        query: false,
        queryParams: [],
        functionName: 'createProductTag',
        functionInput: 'group'
    },
    deleteProductTag: {
        query: true,
        queryParams: ['group'],
        functionName: 'deleteProductTag',
        functionInput: 'id'
    },
    createMappingProductTag: {
        query: false,
        queryParams: [],
        functionName: 'createMappingProductTag',
        functionInput: 'product'
    },
    deleteMappingProductTag: {
        query: true,
        queryParams: ['product'],
        functionName: 'deleteMappingProductTag',
        functionInput: 'id'
    },
    createUOM: {
        query: false,
        queryParams: [],
        functionName: 'createUOM',
        functionInput: 'product'
    },
    deleteUOM: {
        query: true,
        queryParams: ['product'],
        functionName: 'deleteUOM',
        functionInput: 'id'
    },
    createIndentItem: {
        query: false,
        queryParams: [],
        functionName: 'createIndentItem',
        functionInput: 'indent'
    },
    deleteIndentItem: {
        query: true,
        queryParams: ['indent'],
        functionName: 'deleteIndentItem',
        functionInput: 'id'
    },
    createQuotationItem: {
        query: false,
        queryParams: [],
        functionName: 'createQuotationItem',
        functionInput: 'quotation'
    },
    deleteQuotationItem: {
        query: true,
        queryParams: ['quotation'],
        functionName: 'deleteQuotationItem',
        functionInput: 'id'
    },
    createPurchaseOrderItem: {
        query: false,
        queryParams: [],
        functionName: 'createPurchaseOrderItem',
        functionInput: 'purchaseOrder'
    },
    deletePurchaseOrderItem: {
        query: true,
        queryParams: ['purchaseOrder'],
        functionName: 'deletePurchaseOrderItem',
        functionInput: 'id'
    },
    createPurchaseInvoiceItem: {
        query: false,
        queryParams: [],
        functionName: 'createPurchaseInvoiceItem',
        functionInput: 'purchaseInvoice'
    },
    deletePurchaseInvoiceItem: {
        query: true,
        queryParams: ['purchaseInvoice'],
        functionName: 'deletePurchaseInvoiceItem',
        functionInput: 'id'
    },
    createMaterialApprovalSlipItem: {
        query: false,
        queryParams: [],
        functionName: 'createMaterialApprovalSlipItem',
        functionInput: 'materialApprovalSlip'
    },
    deleteMaterialApprovalSlipItem: {
        query: true,
        queryParams: ['materialApprovalSlip'],
        functionName: 'deleteMaterialApprovalSlipItem',
        functionInput: 'id'
    },
    createMaterialRejectionSlipItem: {
        query: false,
        queryParams: [],
        functionName: 'createMaterialRejectionSlipItem',
        functionInput: 'materialRejectionSlip'
    },
    deleteMaterialRejectionSlipItem: {
        query: true,
        queryParams: ['materialRejectionSlip'],
        functionName: 'deleteMaterialRejectionSlipItem',
        functionInput: 'id'
    },
    createMaterialReturnSlipItem: {
        query: false,
        queryParams: [],
        functionName: 'createMaterialReturnSlipItem',
        functionInput: 'materialReturnSlip'
    },
    deleteMaterialReturnSlipItem: {
        query: true,
        queryParams: ['materialReturnSlip'],
        functionName: 'deleteMaterialReturnSlipItem',
        functionInput: 'id'
    },
    createMaterialRequistionSlipItem: {
        query: false,
        queryParams: [],
        functionName: 'createMaterialRequistionSlipItem',
        functionInput: 'materialRequistionSlip'
    },
    deleteMaterialRequistionSlipItem: {
        query: true,
        queryParams: ['materialRequistionSlip'],
        functionName: 'deleteMaterialRequistionSlipItem',
        functionInput: 'id'
    },
    createBOMItem: {
        query: false,
        queryParams: [],
        functionName: 'createBOMItem',
        functionInput: 'bom'
    },
    deleteBOMItem: {
        query: true,
        queryParams: ['bom'],
        functionName: 'deleteBOMItem',
        functionInput: 'id'
    },
    createProductionPreparationSlipItem: {
        query: false,
        queryParams: [],
        functionName: 'createProductionPreparationSlipItem',
        functionInput: 'productionPreparationSlip'
    },
    deleteProductionPreparationSlipItem: {
        query: true,
        queryParams: ['productionPreparationSlip'],
        functionName: 'deleteProductionPreparationSlipItem',
        functionInput: 'id'
    }
}

type MapperArgs = {
    queryParams: object
    args: Array<object>
}

export function isNonPrimitive(typeName: string): typeName is NonPrimitiveType {
    return Object.keys(types).includes(typeName)
}

// Note. Not only a function, mapper should also be based on a circuit.
// This will allow recursive creation and deletion of hierarchies.
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
                        value.value.id.value = String(args.queryParams[queryParam])
                        value.value.id.checked = true
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
                    functionArgs[mapper.functionInput] = variable.id.toString()
                    const [functionResult, symbolFlag, diff] = await executeFunction(fx, functionArgs, overlay)
                    if (!symbolFlag) {
                        return [result, false, mergeDiffs(diffs.toArray())]
                    }
                    result.push(functionResult)
                    diffs = diffs.append(diff)
                } else {
                    const functionArgs = args.args[args.args.length - 1]
                    functionArgs[mapper.functionInput] = variable.id.toString()
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
