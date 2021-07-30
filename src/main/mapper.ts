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
    | 'createCountryForRegion'
    | 'deleteCountryForRegion'

    | 'createStateTypeForCountry'
    | 'deleteStateTypeForCountry'

    | 'createDistrictForStateType'
    | 'deleteDistrictForStateType'

    | 'createSubdistrictForDistrict'
    | 'deleteSubdistrictForDistrict'

    | 'createPostalCodeForSubdistrict'
    | 'deletePostalCodeForSubdistrict'

    | 'createAddressForPostalCode'
    | 'deleteAddressForPostalCode'

    | 'createCompanyAddressForCompany'
    | 'deleteCompanyAddressForCompany'
    | 'createMappingCompanyTagForCompany'
    | 'deleteMappingCompanyTagForCompany'
    | 'createCompanyContactForCompany'
    | 'deleteCompanyContactForCompany'
    | 'createMemoForCompany'
    | 'deleteMemoForCompany'
    | 'createCompanyBankAccountForCompany'
    | 'deleteCompanyBankAccountForCompany'

    | 'createContactAddressForContact'
    | 'deleteContactAddressForContact'
    | 'createCompanyContactForContact'
    | 'deleteCompanyContactForContact'

    | 'createCurrencyRateForCurrency'
    | 'deleteCurrencyRateForCurrency'

    | 'createBankBranchForBank'
    | 'deleteBankBranchForBank'

    | 'createBankAccountForBankBranch'
    | 'deleteBankAccountForBankBranch'

    | 'createBankTransactionForBankAccount'
    | 'deleteBankTransactionForBankAccount'

    | 'createProductCategoryForProductCategoryGroup'
    | 'deleteProductCategoryForProductCategoryGroup'

    | 'createProductCategoryForProductCategory'
    | 'deleteProductCategoryForProductCategory'

    | 'createCompanyProductForProduct'
    | 'deleteCompanyProductForProduct'
    | 'createMappingProductTagForProduct'
    | 'deleteMappingProductTagForProduct'
    | 'createUomForProduct'
    | 'deleteUomForProduct'

    | 'createMappingProductTagForProductTag'
    | 'deleteMappingProductTagForProductTag'

    | 'createIndentItemForIndent'
    | 'deleteIndentItemForIndent'

    | 'createQuotationItemForQuotation'
    | 'deleteQuotationItemForQuotation'

    | 'createPurchaseOrderItemForPurchaseOrder'
    | 'deletePurchaseOrderItemForPurchaseOrder'

    | 'createPurchaseInvoiceItemForPurchaseInvoice'
    | 'deletePurchaseInvoiceItemForPurchaseInvoice'

    | 'createMaterialApprovalSlipItemForMaterialApprovalSlip'
    | 'deleteMaterialApprovalSlipItemForMaterialApprovalSlip'

    | 'createMaterialRejectionSlipItemForMaterialRejectionSlip'
    | 'deleteMaterialRejectionSlipItemForMaterialRejectionSlip'

    | 'createMaterialReturnSlipItemForMaterialReturnSlip'
    | 'deleteMaterialReturnSlipItemForMaterialReturnSlip'

    | 'createMaterialRequistionSlipItemForMaterialRequistionSlip'
    | 'deleteMaterialRequistionSlipItemForMaterialRequistionSlip'

    | 'createBomItemForBom'
    | 'deleteBomItemForBom'

    | 'createProductionPreparationSlipItemForProductionPreparationSlip'
    | 'deleteProductionPreparationSlipItemForProductionPreparationSlip'

export const mappers: Record<MapperName, Mapper> = {
    createCountryForRegion: {
        query: false,
        queryParams: [],
        functionName: 'createCountry',
        functionInput: 'region'
    },
    deleteCountryForRegion: {
        query: true,
        queryParams: ['region'],
        functionName: 'deleteCountry',
        functionInput: 'id'
    },

    createStateTypeForCountry: {
        query: false,
        queryParams: [],
        functionName: 'createStateType',
        functionInput: 'country'
    },
    deleteStateTypeForCountry: {
        query: true,
        queryParams: ['country'],
        functionName: 'deleteStateType',
        functionInput: 'id'
    },

    createDistrictForStateType: {
        query: false,
        queryParams: [],
        functionName: 'createDistrict',
        functionInput: 'state'
    },
    deleteDistrictForStateType: {
        query: true,
        queryParams: ['state'],
        functionName: 'deleteDistrict',
        functionInput: 'id'
    },

    createSubdistrictForDistrict: {
        query: false,
        queryParams: [],
        functionName: 'createSubdistrict',
        functionInput: 'district'
    },
    deleteSubdistrictForDistrict: {
        query: true,
        queryParams: ['district'],
        functionName: 'deleteSubdistrict',
        functionInput: 'id'
    },

    createPostalCodeForSubdistrict: {
        query: false,
        queryParams: [],
        functionName: 'createPostalCode',
        functionInput: 'subdistrict'
    },
    deletePostalCodeForSubdistrict: {
        query: true,
        queryParams: ['subdistrict'],
        functionName: 'deletePostalCode',
        functionInput: 'id'
    },

    createAddressForPostalCode: {
        query: false,
        queryParams: [],
        functionName: 'createAddress',
        functionInput: 'postalCode'
    },
    deleteAddressForPostalCode: {
        query: true,
        queryParams: ['postalCode'],
        functionName: 'deleteAddress',
        functionInput: 'id'
    },

    createCompanyAddressForCompany: {
        query: false,
        queryParams: [],
        functionName: 'createCompanyAddress',
        functionInput: 'company'
    },
    deleteCompanyAddressForCompany: {
        query: true,
        queryParams: ['company'],
        functionName: 'deleteCompanyAddress',
        functionInput: 'id'
    },
    createMappingCompanyTagForCompany: {
        query: false,
        queryParams: [],
        functionName: 'createMappingCompanyTag',
        functionInput: 'company'
    },
    deleteMappingCompanyTagForCompany: {
        query: true,
        queryParams: ['company'],
        functionName: 'deleteMappingCompanyTag',
        functionInput: 'id'
    },
    createCompanyContactForCompany: {
        query: false,
        queryParams: [],
        functionName: 'createCompanyContact',
        functionInput: 'company'
    },
    deleteCompanyContactForCompany: {
        query: true,
        queryParams: ['company'],
        functionName: 'deleteCompanyContact',
        functionInput: 'id'
    },
    createMemoForCompany: {
        query: false,
        queryParams: [],
        functionName: 'createMemo',
        functionInput: 'company'
    },
    deleteMemoForCompany: {
        query: true,
        queryParams: ['company'],
        functionName: 'deleteMemo',
        functionInput: 'id'
    },
    createCompanyBankAccountForCompany: {
        query: false,
        queryParams: [],
        functionName: 'createCompanyBankAccount',
        functionInput: 'company'
    },
    deleteCompanyBankAccountForCompany: {
        query: true,
        queryParams: ['company'],
        functionName: 'deleteCompanyBankAccount',
        functionInput: 'id'
    },

    createContactAddressForContact: {
        query: false,
        queryParams: [],
        functionName: 'createContactAddress',
        functionInput: 'contact'
    },
    deleteContactAddressForContact: {
        query: true,
        queryParams: ['contact'],
        functionName: 'deleteContactAddress',
        functionInput: 'id'
    },
    createCompanyContactForContact: {
        query: false,
        queryParams: [],
        functionName: 'createCompanyContact',
        functionInput: 'contact'
    },
    deleteCompanyContactForContact: {
        query: true,
        queryParams: ['contact'],
        functionName: 'deleteCompanyContact',
        functionInput: 'id'
    },

    createCurrencyRateForCurrency: {
        query: false,
        queryParams: [],
        functionName: 'createCurrencyRate',
        functionInput: 'currency'
    },
    deleteCurrencyRateForCurrency: {
        query: true,
        queryParams: ['currency'],
        functionName: 'deleteCurrencyRate',
        functionInput: 'id'
    },

    createBankBranchForBank: {
        query: false,
        queryParams: [],
        functionName: 'createBankBranch',
        functionInput: 'bank'
    },
    deleteBankBranchForBank: {
        query: true,
        queryParams: ['bank'],
        functionName: 'deleteBankBranch',
        functionInput: 'id'
    },

    createBankAccountForBankBranch: {
        query: false,
        queryParams: [],
        functionName: 'createBankAccount',
        functionInput: 'bankBranch'
    },
    deleteBankAccountForBankBranch: {
        query: true,
        queryParams: ['bankBranch'],
        functionName: 'deleteBankAccount',
        functionInput: 'id'
    },

    createBankTransactionForBankAccount: {
        query: false,
        queryParams: [],
        functionName: 'createBankTransaction',
        functionInput: 'bankAccount'
    },
    deleteBankTransactionForBankAccount: {
        query: true,
        queryParams: ['bankAccount'],
        functionName: 'deleteBankTransaction',
        functionInput: 'id'
    },

    createProductCategoryForProductCategoryGroup: {
        query: false,
        queryParams: [],
        functionName: 'createProductCategory',
        functionInput: 'group'
    },
    deleteProductCategoryForProductCategoryGroup: {
        query: true,
        queryParams: ['group'],
        functionName: 'deleteProductCategory',
        functionInput: 'id'
    },

    createProductCategoryForProductCategory: {
        query: false,
        queryParams: [],
        functionName: 'createProductCategory',
        functionInput: 'parent'
    },
    deleteProductCategoryForProductCategory: {
        query: true,
        queryParams: ['parent'],
        functionName: 'deleteProductCategory',
        functionInput: 'id'
    },

    createCompanyProductForProduct: {
        query: false,
        queryParams: [],
        functionName: 'createCompanyProduct',
        functionInput: 'company'
    },
    deleteCompanyProductForProduct: {
        query: true,
        queryParams: ['company'],
        functionName: 'deleteCompanyProduct',
        functionInput: 'id'
    },
    createMappingProductTagForProduct: {
        query: false,
        queryParams: [],
        functionName: 'createMappingProductTag',
        functionInput: 'product'
    },
    deleteMappingProductTagForProduct: {
        query: true,
        queryParams: ['product'],
        functionName: 'deleteMappingProductTag',
        functionInput: 'id'
    },
    createUomForProduct: {
        query: false,
        queryParams: [],
        functionName: 'createUom',
        functionInput: 'product'
    },
    deleteUomForProduct: {
        query: true,
        queryParams: ['product'],
        functionName: 'deleteUom',
        functionInput: 'id'
    },

    createMappingProductTagForProductTag: {
        query: false,
        queryParams: [],
        functionName: 'createMappingProductTag',
        functionInput: 'tag'
    },
    deleteMappingProductTagForProductTag: {
        query: true,
        queryParams: ['tag'],
        functionName: 'deleteMappingProductTag',
        functionInput: 'id'
    },

    createIndentItemForIndent: {
        query: false,
        queryParams: [],
        functionName: 'createIndentItem',
        functionInput: 'indent'
    },
    deleteIndentItemForIndent: {
        query: true,
        queryParams: ['indent'],
        functionName: 'deleteIndentItem',
        functionInput: 'id'
    },

    createQuotationItemForQuotation: {
        query: false,
        queryParams: [],
        functionName: 'createQuotationItem',
        functionInput: 'quotation'
    },
    deleteQuotationItemForQuotation: {
        query: true,
        queryParams: ['quotation'],
        functionName: 'deleteQuotationItem',
        functionInput: 'id'
    },

    createPurchaseOrderItemForPurchaseOrder: {
        query: false,
        queryParams: [],
        functionName: 'createPurchaseOrderItem',
        functionInput: 'purchaseOrder'
    },
    deletePurchaseOrderItemForPurchaseOrder: {
        query: true,
        queryParams: ['purchaseOrder'],
        functionName: 'deletePurchaseOrderItem',
        functionInput: 'id'
    },

    createPurchaseInvoiceItemForPurchaseInvoice: {
        query: false,
        queryParams: [],
        functionName: 'createPurchaseInvoiceItem',
        functionInput: 'purchaseInvoice'
    },
    deletePurchaseInvoiceItemForPurchaseInvoice: {
        query: true,
        queryParams: ['purchaseInvoice'],
        functionName: 'deletePurchaseInvoiceItem',
        functionInput: 'id'
    },

    createMaterialApprovalSlipItemForMaterialApprovalSlip: {
        query: false,
        queryParams: [],
        functionName: 'createMaterialApprovalSlipItem',
        functionInput: 'materialApprovalSlip'
    },
    deleteMaterialApprovalSlipItemForMaterialApprovalSlip: {
        query: true,
        queryParams: ['materialApprovalSlip'],
        functionName: 'deleteMaterialApprovalSlipItem',
        functionInput: 'id'
    },

    createMaterialRejectionSlipItemForMaterialRejectionSlip: {
        query: false,
        queryParams: [],
        functionName: 'createMaterialRejectionSlipItem',
        functionInput: 'materialRejectionSlip'
    },
    deleteMaterialRejectionSlipItemForMaterialRejectionSlip: {
        query: true,
        queryParams: ['materialRejectionSlip'],
        functionName: 'deleteMaterialRejectionSlipItem',
        functionInput: 'id'
    },

    createMaterialReturnSlipItemForMaterialReturnSlip: {
        query: false,
        queryParams: [],
        functionName: 'createMaterialReturnSlipItem',
        functionInput: 'materialReturnSlip'
    },
    deleteMaterialReturnSlipItemForMaterialReturnSlip: {
        query: true,
        queryParams: ['materialReturnSlip'],
        functionName: 'deleteMaterialReturnSlipItem',
        functionInput: 'id'
    },

    createMaterialRequistionSlipItemForMaterialRequistionSlip: {
        query: false,
        queryParams: [],
        functionName: 'createMaterialRequistionSlipItem',
        functionInput: 'materialRequistionSlip'
    },
    deleteMaterialRequistionSlipItemForMaterialRequistionSlip: {
        query: true,
        queryParams: ['materialRequistionSlip'],
        functionName: 'deleteMaterialRequistionSlipItem',
        functionInput: 'id'
    },

    createBomItemForBom: {
        query: false,
        queryParams: [],
        functionName: 'createBomItem',
        functionInput: 'bom'
    },
    deleteBomItemForBom: {
        query: true,
        queryParams: ['bom'],
        functionName: 'deleteBomItem',
        functionInput: 'id'
    },

    createProductionPreparationSlipItemForProductionPreparationSlip: {
        query: false,
        queryParams: [],
        functionName: 'createProductionPreparationSlipItem',
        functionInput: 'productionPreparationSlip'
    },
    deleteProductionPreparationSlipItemForProductionPreparationSlip: {
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
