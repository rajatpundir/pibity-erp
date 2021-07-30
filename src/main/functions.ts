import { Function } from './function'

export type FunctionName =
    | 'createRegion'
    | 'deleteRegion' 
    | 'createCountry'
    | 'deleteCountry' 
    | 'createStateType'
    | 'deleteStateType' 
    | 'createDistrict'
    | 'deleteDistrict' 
    | 'createSubdistrict'
    | 'deleteSubdistrict' 
    | 'createPostalCode'
    | 'deletePostalCode' 
    | 'createAddress'
    | 'deleteAddress' 
    | 'createCompany'
    | 'deleteCompany' 
    | 'createCompanyAddress'
    | 'deleteCompanyAddress' 
    | 'createCompanyTagGroup'
    | 'deleteCompanyTagGroup' 
    | 'createCompanyTag'
    | 'deleteCompanyTag' 
    | 'createMappingCompanyTag'
    | 'deleteMappingCompanyTag' 
    | 'createContact'
    | 'deleteContact' 
    | 'createContactAddress'
    | 'deleteContactAddress' 
    | 'createCompanyContact'
    | 'deleteCompanyContact' 
    | 'createCurrency'
    | 'deleteCurrency' 
    | 'createCurrencyRate'
    | 'deleteCurrencyRate' 
    | 'createMemo'
    | 'deleteMemo' 
    | 'createBank'
    | 'deleteBank' 
    | 'createBankBranch'
    | 'deleteBankBranch' 
    | 'createBankAccount'
    | 'deleteBankAccount' 
    | 'createBankTransaction'
    | 'deleteBankTransaction' 
    | 'createCompanyBankAccount'
    | 'deleteCompanyBankAccount' 
    | 'createProductCategoryGroup'
    | 'deleteProductCategoryGroup' 
    | 'createProductCategory'
    | 'deleteProductCategory' 
    | 'createProduct'
    | 'deleteProduct' 
    | 'createCompanyProduct'
    | 'deleteCompanyProduct' 
    | 'createProductTagGroup'
    | 'deleteProductTagGroup' 
    | 'createProductTag'
    | 'deleteProductTag' 
    | 'createMappingProductTag'
    | 'deleteMappingProductTag' 
    | 'createUom'
    | 'deleteUom' 
    | 'createIndent'
    | 'deleteIndent' 
    | 'createIndentItem'
    | 'deleteIndentItem' 
    | 'createQuotation'
    | 'deleteQuotation' 
    | 'createQuotationItem'
    | 'deleteQuotationItem' 
    | 'createPurchaseOrder'
    | 'deletePurchaseOrder' 
    | 'createPurchaseOrderItem'
    | 'deletePurchaseOrderItem' 
    | 'createPurchaseInvoice'
    | 'deletePurchaseInvoice' 
    | 'createPurchaseInvoiceItem'
    | 'deletePurchaseInvoiceItem' 
    | 'createMaterialApprovalSlip'
    | 'deleteMaterialApprovalSlip' 
    | 'createMaterialApprovalSlipItem'
    | 'deleteMaterialApprovalSlipItem' 
    | 'createMaterialRejectionSlip'
    | 'deleteMaterialRejectionSlip' 
    | 'createMaterialRejectionSlipItem'
    | 'deleteMaterialRejectionSlipItem' 
    | 'createMaterialReturnSlip'
    | 'deleteMaterialReturnSlip' 
    | 'createMaterialReturnSlipItem'
    | 'deleteMaterialReturnSlipItem' 
    | 'createMaterialRequistionSlip'
    | 'deleteMaterialRequistionSlip' 
    | 'createMaterialRequistionSlipItem'
    | 'deleteMaterialRequistionSlipItem' 
    | 'createBom'
    | 'deleteBom' 
    | 'createBomItem'
    | 'deleteBomItem' 
    | 'createProductionPreparationSlip'
    | 'deleteProductionPreparationSlip' 
    | 'createProductionPreparationSlipItem'
    | 'deleteProductionPreparationSlipItem' 
    | 'createScrapMaterialSlip'
    | 'deleteScrapMaterialSlip' 
    | 'createTransferMaterialSlip'
    | 'deleteTransferMaterialSlip' 
    | 'createWarehouseAcceptanceSlip'
    | 'deleteWarehouseAcceptanceSlip' 

export const functions: Record<FunctionName, Function> = {    createRegion: {
        inputs: {
            name: {
                type: 'Text'
            }
        },
        outputs: {
            variable: {
                type: 'Region',
                op: 'create',
                values: {
                    name: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['name']
                    }
                }
            }
        }
    },
    deleteRegion: {
        inputs: {
            id: {
                type: 'Region'
            }
        },
        outputs: {
            variable: {
                type: 'Region',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createCountry: {
        inputs: {
            region: {
                type: 'Region'
            },
            name: {
                type: 'Text'
            }
        },
        outputs: {
            variable: {
                type: 'Country',
                op: 'create',
                values: {
                    region: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['region']
                    },
                    name: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['name']
                    }
                }
            }
        }
    },
    deleteCountry: {
        inputs: {
            id: {
                type: 'Country'
            }
        },
        outputs: {
            variable: {
                type: 'Country',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createStateType: {
        inputs: {
            country: {
                type: 'Country'
            },
            name: {
                type: 'Text'
            }
        },
        outputs: {
            variable: {
                type: 'StateType',
                op: 'create',
                values: {
                    country: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['country']
                    },
                    name: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['name']
                    }
                }
            }
        }
    },
    deleteStateType: {
        inputs: {
            id: {
                type: 'StateType'
            }
        },
        outputs: {
            variable: {
                type: 'StateType',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createDistrict: {
        inputs: {
            state: {
                type: 'StateType'
            },
            name: {
                type: 'Text'
            }
        },
        outputs: {
            variable: {
                type: 'District',
                op: 'create',
                values: {
                    state: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['state']
                    },
                    name: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['name']
                    }
                }
            }
        }
    },
    deleteDistrict: {
        inputs: {
            id: {
                type: 'District'
            }
        },
        outputs: {
            variable: {
                type: 'District',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createSubdistrict: {
        inputs: {
            district: {
                type: 'District'
            },
            name: {
                type: 'Text'
            }
        },
        outputs: {
            variable: {
                type: 'Subdistrict',
                op: 'create',
                values: {
                    district: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['district']
                    },
                    name: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['name']
                    }
                }
            }
        }
    },
    deleteSubdistrict: {
        inputs: {
            id: {
                type: 'Subdistrict'
            }
        },
        outputs: {
            variable: {
                type: 'Subdistrict',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createPostalCode: {
        inputs: {
            subdistrict: {
                type: 'Subdistrict'
            },
            name: {
                type: 'Text'
            }
        },
        outputs: {
            variable: {
                type: 'PostalCode',
                op: 'create',
                values: {
                    subdistrict: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['subdistrict']
                    },
                    name: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['name']
                    }
                }
            }
        }
    },
    deletePostalCode: {
        inputs: {
            id: {
                type: 'PostalCode'
            }
        },
        outputs: {
            variable: {
                type: 'PostalCode',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createAddress: {
        inputs: {
            postalCode: {
                type: 'PostalCode'
            },
            line1: {
                type: 'Text'
            },
            line2: {
                type: 'Text'
            },
            latitude: {
                type: 'Number'
            },
            longitude: {
                type: 'Number'
            }
        },
        outputs: {
            variable: {
                type: 'Address',
                op: 'create',
                values: {
                    postalCode: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['postalCode']
                    },
                    line1: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['line1']
                    },
                    line2: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['line2']
                    },
                    latitude: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['latitude']
                    },
                    longitude: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['longitude']
                    }
                }
            }
        }
    },
    deleteAddress: {
        inputs: {
            id: {
                type: 'Address'
            }
        },
        outputs: {
            variable: {
                type: 'Address',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createCompany: {
        inputs: {
            name: {
                type: 'Text'
            },
            email: {
                type: 'Text'
            },
            telephone: {
                type: 'Text'
            },
            mobile: {
                type: 'Text'
            },
            website: {
                type: 'Text'
            },
            gstin: {
                type: 'Text'
            },
            pan: {
                type: 'Text'
            },
            iec: {
                type: 'Text'
            }
        },
        outputs: {
            variable: {
                type: 'Company',
                op: 'create',
                values: {
                    name: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['name']
                    },
                    email: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['email']
                    },
                    telephone: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['telephone']
                    },
                    mobile: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['mobile']
                    },
                    website: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['website']
                    },
                    gstin: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['gstin']
                    },
                    pan: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['pan']
                    },
                    iec: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['iec']
                    }
                }
            }
        }
    },
    deleteCompany: {
        inputs: {
            id: {
                type: 'Company'
            }
        },
        outputs: {
            variable: {
                type: 'Company',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createCompanyAddress: {
        inputs: {
            company: {
                type: 'Company'
            },
            name: {
                type: 'Text'
            },
            address: {
                type: 'Address'
            }
        },
        outputs: {
            variable: {
                type: 'CompanyAddress',
                op: 'create',
                values: {
                    company: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['company']
                    },
                    name: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['name']
                    },
                    address: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['address']
                    }
                }
            }
        }
    },
    deleteCompanyAddress: {
        inputs: {
            id: {
                type: 'CompanyAddress'
            }
        },
        outputs: {
            variable: {
                type: 'CompanyAddress',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createCompanyTagGroup: {
        inputs: {
            name: {
                type: 'Text'
            }
        },
        outputs: {
            variable: {
                type: 'CompanyTagGroup',
                op: 'create',
                values: {
                    name: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['name']
                    }
                }
            }
        }
    },
    deleteCompanyTagGroup: {
        inputs: {
            id: {
                type: 'CompanyTagGroup'
            }
        },
        outputs: {
            variable: {
                type: 'CompanyTagGroup',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createCompanyTag: {
        inputs: {
            group: {
                type: 'CompanyTagGroup'
            },
            name: {
                type: 'Text'
            }
        },
        outputs: {
            variable: {
                type: 'CompanyTag',
                op: 'create',
                values: {
                    group: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['group']
                    },
                    name: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['name']
                    }
                }
            }
        }
    },
    deleteCompanyTag: {
        inputs: {
            id: {
                type: 'CompanyTag'
            }
        },
        outputs: {
            variable: {
                type: 'CompanyTag',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createMappingCompanyTag: {
        inputs: {
            company: {
                type: 'Company'
            },
            tag: {
                type: 'CompanyTag'
            }
        },
        outputs: {
            variable: {
                type: 'MappingCompanyTag',
                op: 'create',
                values: {
                    company: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['company']
                    },
                    tag: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['tag']
                    }
                }
            }
        }
    },
    deleteMappingCompanyTag: {
        inputs: {
            id: {
                type: 'MappingCompanyTag'
            }
        },
        outputs: {
            variable: {
                type: 'MappingCompanyTag',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createContact: {
        inputs: {
            name: {
                type: 'Text'
            },
            email: {
                type: 'Text'
            },
            telephone: {
                type: 'Text'
            },
            mobile: {
                type: 'Text'
            },
            website: {
                type: 'Text'
            }
        },
        outputs: {
            variable: {
                type: 'Contact',
                op: 'create',
                values: {
                    name: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['name']
                    },
                    email: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['email']
                    },
                    telephone: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['telephone']
                    },
                    mobile: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['mobile']
                    },
                    website: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['website']
                    }
                }
            }
        }
    },
    deleteContact: {
        inputs: {
            id: {
                type: 'Contact'
            }
        },
        outputs: {
            variable: {
                type: 'Contact',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createContactAddress: {
        inputs: {
            contact: {
                type: 'Contact'
            },
            name: {
                type: 'Text'
            },
            address: {
                type: 'Address'
            }
        },
        outputs: {
            variable: {
                type: 'ContactAddress',
                op: 'create',
                values: {
                    contact: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['contact']
                    },
                    name: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['name']
                    },
                    address: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['address']
                    }
                }
            }
        }
    },
    deleteContactAddress: {
        inputs: {
            id: {
                type: 'ContactAddress'
            }
        },
        outputs: {
            variable: {
                type: 'ContactAddress',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createCompanyContact: {
        inputs: {
            company: {
                type: 'Company'
            },
            contact: {
                type: 'Contact'
            },
            role: {
                type: 'Text'
            },
            email: {
                type: 'Text'
            },
            telephone: {
                type: 'Text'
            },
            mobile: {
                type: 'Text'
            }
        },
        outputs: {
            variable: {
                type: 'CompanyContact',
                op: 'create',
                values: {
                    company: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['company']
                    },
                    contact: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['contact']
                    },
                    role: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['role']
                    },
                    email: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['email']
                    },
                    telephone: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['telephone']
                    },
                    mobile: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['mobile']
                    }
                }
            }
        }
    },
    deleteCompanyContact: {
        inputs: {
            id: {
                type: 'CompanyContact'
            }
        },
        outputs: {
            variable: {
                type: 'CompanyContact',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createCurrency: {
        inputs: {
            name: {
                type: 'Text'
            }
        },
        outputs: {
            variable: {
                type: 'Currency',
                op: 'create',
                values: {
                    name: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['name']
                    }
                }
            }
        }
    },
    deleteCurrency: {
        inputs: {
            id: {
                type: 'Currency'
            }
        },
        outputs: {
            variable: {
                type: 'Currency',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createCurrencyRate: {
        inputs: {
            currency: {
                type: 'Currency'
            },
            conversionRate: {
                type: 'Decimal'
            },
            startTime: {
                type: 'Timestamp'
            },
            endTime: {
                type: 'Timestamp'
            }
        },
        outputs: {
            variable: {
                type: 'CurrencyRate',
                op: 'create',
                values: {
                    currency: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['currency']
                    },
                    conversionRate: {
                        expectedReturnType: 'Decimal',
                        op: '.',
                        types: [],
                        args: ['conversionRate']
                    },
                    startTime: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['startTime']
                    },
                    endTime: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['endTime']
                    }
                }
            }
        }
    },
    deleteCurrencyRate: {
        inputs: {
            id: {
                type: 'CurrencyRate'
            }
        },
        outputs: {
            variable: {
                type: 'CurrencyRate',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createMemo: {
        inputs: {
            company: {
                type: 'Company'
            },
            currency: {
                type: 'Currency'
            },
            amount: {
                type: 'Decimal'
            },
            unsettled: {
                type: 'Decimal'
            }
        },
        outputs: {
            variable: {
                type: 'Memo',
                op: 'create',
                values: {
                    company: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['company']
                    },
                    currency: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['currency']
                    },
                    amount: {
                        expectedReturnType: 'Decimal',
                        op: '.',
                        types: [],
                        args: ['amount']
                    },
                    unsettled: {
                        expectedReturnType: 'Decimal',
                        op: '.',
                        types: [],
                        args: ['unsettled']
                    }
                }
            }
        }
    },
    deleteMemo: {
        inputs: {
            id: {
                type: 'Memo'
            }
        },
        outputs: {
            variable: {
                type: 'Memo',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createBank: {
        inputs: {
            country: {
                type: 'Country'
            },
            name: {
                type: 'Text'
            },
            website: {
                type: 'Text'
            }
        },
        outputs: {
            variable: {
                type: 'Bank',
                op: 'create',
                values: {
                    country: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['country']
                    },
                    name: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['name']
                    },
                    website: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['website']
                    }
                }
            }
        }
    },
    deleteBank: {
        inputs: {
            id: {
                type: 'Bank'
            }
        },
        outputs: {
            variable: {
                type: 'Bank',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createBankBranch: {
        inputs: {
            bank: {
                type: 'Bank'
            },
            name: {
                type: 'Text'
            },
            ifsc: {
                type: 'Text'
            },
            address: {
                type: 'Address'
            }
        },
        outputs: {
            variable: {
                type: 'BankBranch',
                op: 'create',
                values: {
                    bank: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['bank']
                    },
                    name: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['name']
                    },
                    ifsc: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['ifsc']
                    },
                    address: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['address']
                    }
                }
            }
        }
    },
    deleteBankBranch: {
        inputs: {
            id: {
                type: 'BankBranch'
            }
        },
        outputs: {
            variable: {
                type: 'BankBranch',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createBankAccount: {
        inputs: {
            bank: {
                type: 'Bank'
            },
            bankBranch: {
                type: 'BankBranch'
            },
            accountNumber: {
                type: 'Text'
            },
            accountName: {
                type: 'Text'
            },
            currency: {
                type: 'Currency'
            }
        },
        outputs: {
            variable: {
                type: 'BankAccount',
                op: 'create',
                values: {
                    bank: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['bank']
                    },
                    bankBranch: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['bankBranch']
                    },
                    accountNumber: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['accountNumber']
                    },
                    accountName: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['accountName']
                    },
                    currency: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['currency']
                    }
                }
            }
        }
    },
    deleteBankAccount: {
        inputs: {
            id: {
                type: 'BankAccount'
            }
        },
        outputs: {
            variable: {
                type: 'BankAccount',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createBankTransaction: {
        inputs: {
            timestamp: {
                type: 'Timestamp'
            },
            memo: {
                type: 'Memo'
            },
            currencyRate: {
                type: 'CurrencyRate'
            },
            bankAccount: {
                type: 'BankAccount'
            },
            fromToAccount: {
                type: 'BankAccount'
            },
            credit: {
                type: 'Decimal'
            },
            debit: {
                type: 'Decimal'
            }
        },
        outputs: {
            variable: {
                type: 'BankTransaction',
                op: 'create',
                values: {
                    timestamp: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['timestamp']
                    },
                    memo: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['memo']
                    },
                    currencyRate: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['currencyRate']
                    },
                    bankAccount: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['bankAccount']
                    },
                    fromToAccount: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['fromToAccount']
                    },
                    credit: {
                        expectedReturnType: 'Decimal',
                        op: '.',
                        types: [],
                        args: ['credit']
                    },
                    debit: {
                        expectedReturnType: 'Decimal',
                        op: '.',
                        types: [],
                        args: ['debit']
                    }
                }
            }
        }
    },
    deleteBankTransaction: {
        inputs: {
            id: {
                type: 'BankTransaction'
            }
        },
        outputs: {
            variable: {
                type: 'BankTransaction',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createCompanyBankAccount: {
        inputs: {
            company: {
                type: 'Company'
            },
            bankAccount: {
                type: 'BankAccount'
            }
        },
        outputs: {
            variable: {
                type: 'CompanyBankAccount',
                op: 'create',
                values: {
                    company: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['company']
                    },
                    bankAccount: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['bankAccount']
                    }
                }
            }
        }
    },
    deleteCompanyBankAccount: {
        inputs: {
            id: {
                type: 'CompanyBankAccount'
            }
        },
        outputs: {
            variable: {
                type: 'CompanyBankAccount',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createProductCategoryGroup: {
        inputs: {
            parent: {
                type: 'ProductCategoryGroup'
            },
            name: {
                type: 'Text'
            },
            length: {
                type: 'Number'
            }
        },
        outputs: {
            variable: {
                type: 'ProductCategoryGroup',
                op: 'create',
                values: {
                    parent: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['parent']
                    },
                    name: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['name']
                    },
                    length: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['length']
                    }
                }
            }
        }
    },
    deleteProductCategoryGroup: {
        inputs: {
            id: {
                type: 'ProductCategoryGroup'
            }
        },
        outputs: {
            variable: {
                type: 'ProductCategoryGroup',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createProductCategory: {
        inputs: {
            parent: {
                type: 'ProductCategory'
            },
            group: {
                type: 'ProductCategoryGroup'
            },
            name: {
                type: 'Text'
            },
            code: {
                type: 'Text'
            },
            childCount: {
                type: 'Number'
            }
        },
        outputs: {
            variable: {
                type: 'ProductCategory',
                op: 'create',
                values: {
                    parent: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['parent']
                    },
                    group: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['group']
                    },
                    name: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['name']
                    },
                    code: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['code']
                    },
                    childCount: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['childCount']
                    }
                }
            }
        }
    },
    deleteProductCategory: {
        inputs: {
            id: {
                type: 'ProductCategory'
            }
        },
        outputs: {
            variable: {
                type: 'ProductCategory',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createProduct: {
        inputs: {
            name: {
                type: 'Text'
            },
            category: {
                type: 'ProductCategory'
            },
            code: {
                type: 'Text'
            }
        },
        outputs: {
            variable: {
                type: 'Product',
                op: 'create',
                values: {
                    name: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['name']
                    },
                    category: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['category']
                    },
                    code: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['code']
                    }
                }
            }
        }
    },
    deleteProduct: {
        inputs: {
            id: {
                type: 'Product'
            }
        },
        outputs: {
            variable: {
                type: 'Product',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createCompanyProduct: {
        inputs: {
            company: {
                type: 'Company'
            },
            product: {
                type: 'Product'
            }
        },
        outputs: {
            variable: {
                type: 'CompanyProduct',
                op: 'create',
                values: {
                    company: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['company']
                    },
                    product: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['product']
                    }
                }
            }
        }
    },
    deleteCompanyProduct: {
        inputs: {
            id: {
                type: 'CompanyProduct'
            }
        },
        outputs: {
            variable: {
                type: 'CompanyProduct',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createProductTagGroup: {
        inputs: {
            name: {
                type: 'Text'
            }
        },
        outputs: {
            variable: {
                type: 'ProductTagGroup',
                op: 'create',
                values: {
                    name: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['name']
                    }
                }
            }
        }
    },
    deleteProductTagGroup: {
        inputs: {
            id: {
                type: 'ProductTagGroup'
            }
        },
        outputs: {
            variable: {
                type: 'ProductTagGroup',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createProductTag: {
        inputs: {
            group: {
                type: 'ProductTagGroup'
            },
            name: {
                type: 'Text'
            }
        },
        outputs: {
            variable: {
                type: 'ProductTag',
                op: 'create',
                values: {
                    group: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['group']
                    },
                    name: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['name']
                    }
                }
            }
        }
    },
    deleteProductTag: {
        inputs: {
            id: {
                type: 'ProductTag'
            }
        },
        outputs: {
            variable: {
                type: 'ProductTag',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createMappingProductTag: {
        inputs: {
            product: {
                type: 'Product'
            },
            tag: {
                type: 'ProductTag'
            }
        },
        outputs: {
            variable: {
                type: 'MappingProductTag',
                op: 'create',
                values: {
                    product: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['product']
                    },
                    tag: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['tag']
                    }
                }
            }
        }
    },
    deleteMappingProductTag: {
        inputs: {
            id: {
                type: 'MappingProductTag'
            }
        },
        outputs: {
            variable: {
                type: 'MappingProductTag',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createUom: {
        inputs: {
            product: {
                type: 'Product'
            },
            name: {
                type: 'Text'
            },
            conversionRate: {
                type: 'Decimal'
            }
        },
        outputs: {
            variable: {
                type: 'Uom',
                op: 'create',
                values: {
                    product: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['product']
                    },
                    name: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['name']
                    },
                    conversionRate: {
                        expectedReturnType: 'Decimal',
                        op: '.',
                        types: [],
                        args: ['conversionRate']
                    }
                }
            }
        }
    },
    deleteUom: {
        inputs: {
            id: {
                type: 'Uom'
            }
        },
        outputs: {
            variable: {
                type: 'Uom',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createIndent: {
        inputs: {

        },
        outputs: {
            variable: {
                type: 'Indent',
                op: 'create',
                values: {

                }
            }
        }
    },
    deleteIndent: {
        inputs: {
            id: {
                type: 'Indent'
            }
        },
        outputs: {
            variable: {
                type: 'Indent',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createIndentItem: {
        inputs: {
            indent: {
                type: 'Indent'
            },
            product: {
                type: 'Product'
            },
            quantity: {
                type: 'Number'
            },
            uom: {
                type: 'Uom'
            },
            ordered: {
                type: 'Number'
            },
            received: {
                type: 'Number'
            },
            approved: {
                type: 'Number'
            },
            rejected: {
                type: 'Number'
            },
            returned: {
                type: 'Number'
            },
            requisted: {
                type: 'Number'
            },
            consumed: {
                type: 'Number'
            }
        },
        outputs: {
            variable: {
                type: 'IndentItem',
                op: 'create',
                values: {
                    indent: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['indent']
                    },
                    product: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['product']
                    },
                    quantity: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['quantity']
                    },
                    uom: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['uom']
                    },
                    ordered: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['ordered']
                    },
                    received: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['received']
                    },
                    approved: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['approved']
                    },
                    rejected: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['rejected']
                    },
                    returned: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['returned']
                    },
                    requisted: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['requisted']
                    },
                    consumed: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['consumed']
                    }
                }
            }
        }
    },
    deleteIndentItem: {
        inputs: {
            id: {
                type: 'IndentItem'
            }
        },
        outputs: {
            variable: {
                type: 'IndentItem',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createQuotation: {
        inputs: {
            indent: {
                type: 'Indent'
            },
            company: {
                type: 'Company'
            }
        },
        outputs: {
            variable: {
                type: 'Quotation',
                op: 'create',
                values: {
                    indent: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['indent']
                    },
                    company: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['company']
                    }
                }
            }
        }
    },
    deleteQuotation: {
        inputs: {
            id: {
                type: 'Quotation'
            }
        },
        outputs: {
            variable: {
                type: 'Quotation',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createQuotationItem: {
        inputs: {
            quotation: {
                type: 'Quotation'
            },
            indentItem: {
                type: 'IndentItem'
            },
            quantity: {
                type: 'Number'
            }
        },
        outputs: {
            variable: {
                type: 'QuotationItem',
                op: 'create',
                values: {
                    quotation: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['quotation']
                    },
                    indentItem: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['indentItem']
                    },
                    quantity: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['quantity']
                    }
                }
            }
        }
    },
    deleteQuotationItem: {
        inputs: {
            id: {
                type: 'QuotationItem'
            }
        },
        outputs: {
            variable: {
                type: 'QuotationItem',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createPurchaseOrder: {
        inputs: {
            quotation: {
                type: 'Quotation'
            }
        },
        outputs: {
            variable: {
                type: 'PurchaseOrder',
                op: 'create',
                values: {
                    quotation: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['quotation']
                    }
                }
            }
        }
    },
    deletePurchaseOrder: {
        inputs: {
            id: {
                type: 'PurchaseOrder'
            }
        },
        outputs: {
            variable: {
                type: 'PurchaseOrder',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createPurchaseOrderItem: {
        inputs: {
            purchaseOrder: {
                type: 'PurchaseOrder'
            },
            quotationItem: {
                type: 'QuotationItem'
            },
            quantity: {
                type: 'Number'
            },
            price: {
                type: 'Decimal'
            },
            received: {
                type: 'Number'
            }
        },
        outputs: {
            variable: {
                type: 'PurchaseOrderItem',
                op: 'create',
                values: {
                    purchaseOrder: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['purchaseOrder']
                    },
                    quotationItem: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['quotationItem']
                    },
                    quantity: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['quantity']
                    },
                    price: {
                        expectedReturnType: 'Decimal',
                        op: '.',
                        types: [],
                        args: ['price']
                    },
                    received: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['received']
                    }
                }
            }
        }
    },
    deletePurchaseOrderItem: {
        inputs: {
            id: {
                type: 'PurchaseOrderItem'
            }
        },
        outputs: {
            variable: {
                type: 'PurchaseOrderItem',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createPurchaseInvoice: {
        inputs: {
            purchaseOrder: {
                type: 'PurchaseOrder'
            }
        },
        outputs: {
            variable: {
                type: 'PurchaseInvoice',
                op: 'create',
                values: {
                    purchaseOrder: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['purchaseOrder']
                    }
                }
            }
        }
    },
    deletePurchaseInvoice: {
        inputs: {
            id: {
                type: 'PurchaseInvoice'
            }
        },
        outputs: {
            variable: {
                type: 'PurchaseInvoice',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createPurchaseInvoiceItem: {
        inputs: {
            purchaseInvoice: {
                type: 'PurchaseInvoice'
            },
            purchaseOrderItem: {
                type: 'PurchaseOrderItem'
            },
            quantity: {
                type: 'Number'
            },
            approved: {
                type: 'Number'
            },
            rejected: {
                type: 'Number'
            }
        },
        outputs: {
            variable: {
                type: 'PurchaseInvoiceItem',
                op: 'create',
                values: {
                    purchaseInvoice: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['purchaseInvoice']
                    },
                    purchaseOrderItem: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['purchaseOrderItem']
                    },
                    quantity: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['quantity']
                    },
                    approved: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['approved']
                    },
                    rejected: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['rejected']
                    }
                }
            }
        }
    },
    deletePurchaseInvoiceItem: {
        inputs: {
            id: {
                type: 'PurchaseInvoiceItem'
            }
        },
        outputs: {
            variable: {
                type: 'PurchaseInvoiceItem',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createMaterialApprovalSlip: {
        inputs: {
            purchaseInvoice: {
                type: 'PurchaseInvoice'
            }
        },
        outputs: {
            variable: {
                type: 'MaterialApprovalSlip',
                op: 'create',
                values: {
                    purchaseInvoice: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['purchaseInvoice']
                    }
                }
            }
        }
    },
    deleteMaterialApprovalSlip: {
        inputs: {
            id: {
                type: 'MaterialApprovalSlip'
            }
        },
        outputs: {
            variable: {
                type: 'MaterialApprovalSlip',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createMaterialApprovalSlipItem: {
        inputs: {
            materialApprovalSlip: {
                type: 'MaterialApprovalSlip'
            },
            purchaseInvoiceItem: {
                type: 'PurchaseInvoiceItem'
            },
            quantity: {
                type: 'Number'
            },
            requisted: {
                type: 'Number'
            }
        },
        outputs: {
            variable: {
                type: 'MaterialApprovalSlipItem',
                op: 'create',
                values: {
                    materialApprovalSlip: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['materialApprovalSlip']
                    },
                    purchaseInvoiceItem: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['purchaseInvoiceItem']
                    },
                    quantity: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['quantity']
                    },
                    requisted: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['requisted']
                    }
                }
            }
        }
    },
    deleteMaterialApprovalSlipItem: {
        inputs: {
            id: {
                type: 'MaterialApprovalSlipItem'
            }
        },
        outputs: {
            variable: {
                type: 'MaterialApprovalSlipItem',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createMaterialRejectionSlip: {
        inputs: {
            purchaseInvoice: {
                type: 'PurchaseInvoice'
            }
        },
        outputs: {
            variable: {
                type: 'MaterialRejectionSlip',
                op: 'create',
                values: {
                    purchaseInvoice: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['purchaseInvoice']
                    }
                }
            }
        }
    },
    deleteMaterialRejectionSlip: {
        inputs: {
            id: {
                type: 'MaterialRejectionSlip'
            }
        },
        outputs: {
            variable: {
                type: 'MaterialRejectionSlip',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createMaterialRejectionSlipItem: {
        inputs: {
            materialRejectionSlip: {
                type: 'MaterialRejectionSlip'
            },
            purchaseInvoiceItem: {
                type: 'PurchaseInvoiceItem'
            },
            quantity: {
                type: 'Number'
            },
            returned: {
                type: 'Number'
            }
        },
        outputs: {
            variable: {
                type: 'MaterialRejectionSlipItem',
                op: 'create',
                values: {
                    materialRejectionSlip: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['materialRejectionSlip']
                    },
                    purchaseInvoiceItem: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['purchaseInvoiceItem']
                    },
                    quantity: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['quantity']
                    },
                    returned: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['returned']
                    }
                }
            }
        }
    },
    deleteMaterialRejectionSlipItem: {
        inputs: {
            id: {
                type: 'MaterialRejectionSlipItem'
            }
        },
        outputs: {
            variable: {
                type: 'MaterialRejectionSlipItem',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createMaterialReturnSlip: {
        inputs: {
            materialRejectionSlip: {
                type: 'MaterialRejectionSlip'
            }
        },
        outputs: {
            variable: {
                type: 'MaterialReturnSlip',
                op: 'create',
                values: {
                    materialRejectionSlip: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['materialRejectionSlip']
                    }
                }
            }
        }
    },
    deleteMaterialReturnSlip: {
        inputs: {
            id: {
                type: 'MaterialReturnSlip'
            }
        },
        outputs: {
            variable: {
                type: 'MaterialReturnSlip',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createMaterialReturnSlipItem: {
        inputs: {
            materialReturnSlip: {
                type: 'MaterialReturnSlip'
            },
            materialRejectionSlipItem: {
                type: 'MaterialRejectionSlipItem'
            },
            quantity: {
                type: 'Number'
            }
        },
        outputs: {
            variable: {
                type: 'MaterialReturnSlipItem',
                op: 'create',
                values: {
                    materialReturnSlip: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['materialReturnSlip']
                    },
                    materialRejectionSlipItem: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['materialRejectionSlipItem']
                    },
                    quantity: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['quantity']
                    }
                }
            }
        }
    },
    deleteMaterialReturnSlipItem: {
        inputs: {
            id: {
                type: 'MaterialReturnSlipItem'
            }
        },
        outputs: {
            variable: {
                type: 'MaterialReturnSlipItem',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createMaterialRequistionSlip: {
        inputs: {
            materialApprovalSlip: {
                type: 'MaterialApprovalSlip'
            }
        },
        outputs: {
            variable: {
                type: 'MaterialRequistionSlip',
                op: 'create',
                values: {
                    materialApprovalSlip: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['materialApprovalSlip']
                    }
                }
            }
        }
    },
    deleteMaterialRequistionSlip: {
        inputs: {
            id: {
                type: 'MaterialRequistionSlip'
            }
        },
        outputs: {
            variable: {
                type: 'MaterialRequistionSlip',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createMaterialRequistionSlipItem: {
        inputs: {
            materialRequistionSlip: {
                type: 'MaterialRequistionSlip'
            },
            materialApprovalSlipItem: {
                type: 'MaterialApprovalSlipItem'
            },
            quantity: {
                type: 'Number'
            },
            consumed: {
                type: 'Number'
            }
        },
        outputs: {
            variable: {
                type: 'MaterialRequistionSlipItem',
                op: 'create',
                values: {
                    materialRequistionSlip: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['materialRequistionSlip']
                    },
                    materialApprovalSlipItem: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['materialApprovalSlipItem']
                    },
                    quantity: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['quantity']
                    },
                    consumed: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['consumed']
                    }
                }
            }
        }
    },
    deleteMaterialRequistionSlipItem: {
        inputs: {
            id: {
                type: 'MaterialRequistionSlipItem'
            }
        },
        outputs: {
            variable: {
                type: 'MaterialRequistionSlipItem',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createBom: {
        inputs: {
            name: {
                type: 'Text'
            }
        },
        outputs: {
            variable: {
                type: 'Bom',
                op: 'create',
                values: {
                    name: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['name']
                    }
                }
            }
        }
    },
    deleteBom: {
        inputs: {
            id: {
                type: 'Bom'
            }
        },
        outputs: {
            variable: {
                type: 'Bom',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createBomItem: {
        inputs: {
            bom: {
                type: 'Bom'
            },
            product: {
                type: 'Product'
            },
            quantity: {
                type: 'Number'
            },
            uom: {
                type: 'Uom'
            }
        },
        outputs: {
            variable: {
                type: 'BomItem',
                op: 'create',
                values: {
                    bom: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['bom']
                    },
                    product: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['product']
                    },
                    quantity: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['quantity']
                    },
                    uom: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['uom']
                    }
                }
            }
        }
    },
    deleteBomItem: {
        inputs: {
            id: {
                type: 'BomItem'
            }
        },
        outputs: {
            variable: {
                type: 'BomItem',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createProductionPreparationSlip: {
        inputs: {
            bom: {
                type: 'Bom'
            },
            approved: {
                type: 'Number'
            },
            scrapped: {
                type: 'Number'
            }
        },
        outputs: {
            variable: {
                type: 'ProductionPreparationSlip',
                op: 'create',
                values: {
                    bom: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['bom']
                    },
                    approved: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['approved']
                    },
                    scrapped: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['scrapped']
                    }
                }
            }
        }
    },
    deleteProductionPreparationSlip: {
        inputs: {
            id: {
                type: 'ProductionPreparationSlip'
            }
        },
        outputs: {
            variable: {
                type: 'ProductionPreparationSlip',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createProductionPreparationSlipItem: {
        inputs: {
            productionPreparationSlip: {
                type: 'ProductionPreparationSlip'
            },
            bomItem: {
                type: 'Text'
            },
            materialRequistionSlipItem: {
                type: 'MaterialRequistionSlipItem'
            }
        },
        outputs: {
            variable: {
                type: 'ProductionPreparationSlipItem',
                op: 'create',
                values: {
                    productionPreparationSlip: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['productionPreparationSlip']
                    },
                    bomItem: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['bomItem']
                    },
                    materialRequistionSlipItem: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['materialRequistionSlipItem']
                    }
                }
            }
        }
    },
    deleteProductionPreparationSlipItem: {
        inputs: {
            id: {
                type: 'ProductionPreparationSlipItem'
            }
        },
        outputs: {
            variable: {
                type: 'ProductionPreparationSlipItem',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createScrapMaterialSlip: {
        inputs: {
            productionPreparationSlip: {
                type: 'ProductionPreparationSlip'
            },
            quantity: {
                type: 'Number'
            }
        },
        outputs: {
            variable: {
                type: 'ScrapMaterialSlip',
                op: 'create',
                values: {
                    productionPreparationSlip: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['productionPreparationSlip']
                    },
                    quantity: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['quantity']
                    }
                }
            }
        }
    },
    deleteScrapMaterialSlip: {
        inputs: {
            id: {
                type: 'ScrapMaterialSlip'
            }
        },
        outputs: {
            variable: {
                type: 'ScrapMaterialSlip',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createTransferMaterialSlip: {
        inputs: {
            productionPreparationSlip: {
                type: 'ProductionPreparationSlip'
            },
            quantity: {
                type: 'Number'
            },
            transferred: {
                type: 'Number'
            }
        },
        outputs: {
            variable: {
                type: 'TransferMaterialSlip',
                op: 'create',
                values: {
                    productionPreparationSlip: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['productionPreparationSlip']
                    },
                    quantity: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['quantity']
                    },
                    transferred: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['transferred']
                    }
                }
            }
        }
    },
    deleteTransferMaterialSlip: {
        inputs: {
            id: {
                type: 'TransferMaterialSlip'
            }
        },
        outputs: {
            variable: {
                type: 'TransferMaterialSlip',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    },
    createWarehouseAcceptanceSlip: {
        inputs: {
            transferMaterialSlip: {
                type: 'TransferMaterialSlip'
            },
            quantity: {
                type: 'Number'
            }
        },
        outputs: {
            variable: {
                type: 'WarehouseAcceptanceSlip',
                op: 'create',
                values: {
                    transferMaterialSlip: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['transferMaterialSlip']
                    },
                    quantity: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['quantity']
                    }
                }
            }
        }
    },
    deleteWarehouseAcceptanceSlip: {
        inputs: {
            id: {
                type: 'WarehouseAcceptanceSlip'
            }
        },
        outputs: {
            variable: {
                type: 'WarehouseAcceptanceSlip',
                op: 'delete',
                id: {
                    expectedReturnType: 'Number',
                    op: '.',
                    types: [],
                    args: ['id']
                }
            }
        }
    }
}
