import { Function } from './function'

export type FunctionName =

    | 'createRegion'
    | 'deleteRegion'

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

    | 'createBank'
    | 'deleteBank'

    | 'createBankBranch'
    | 'deleteBankBranch'

    | 'createBankAccount'
    | 'deleteBankAccount'

    | 'createCompany'
    | 'deleteCompany'

    | 'createCompanyAddress'
    | 'deleteCompanyAddress'

    | 'createCompanyContact'
    | 'deleteCompanyContact'

    | 'createCompanyBankAccount'
    | 'deleteCompanyBankAccount'

    | 'createProduct'
    | 'deleteProduct'

    | 'createUOM'
    | 'deleteUOM'

    | 'createIndent'
    | 'deleteIndent'

    | 'createIndentItem'
    | 'deleteIndentItem'

    | 'createCompanyProduct'
    | 'deleteCompanyProduct'

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

    | 'createBOM'
    | 'deleteBOM'

    | 'createBOMItem'
    | 'deleteBOMItem'

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

export const functions: Record<FunctionName, Function> = {
    createRegion: {
        inputs: {
            variableName: {
                type: 'Text'
            }
        },
        outputs: {
            region: {
                type: 'Region',
                op: 'create',
                values: {}
            }
        }
    },
    deleteRegion: {
        inputs: {
            variableName: {
                type: 'Region'
            }
        },
        outputs: {
            region: {
                type: 'Region',
                op: 'delete',
                id: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
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
            country: {
                type: 'Country',
                op: 'create',
                values: {
                    region: {
                        expectedReturnType: 'Text',
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
            variableName: {
                type: 'Country'
            }
        },
        outputs: {
            country: {
                type: 'Country',
                op: 'delete',
                id: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                }
            }
        }
    },
    createState: {
        inputs: {
            country: {
                type: 'Country'
            },
            name: {
                type: 'Text'
            }
        },
        outputs: {
            state: {
                type: 'State',
                op: 'create',
                values: {
                    country: {
                        expectedReturnType: 'Text',
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
    deleteState: {
        inputs: {
            variableName: {
                type: 'State'
            }
        },
        outputs: {
            state: {
                type: 'State',
                op: 'delete',
                id: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                }
            }
        }
    },
    createDistrict: {
        inputs: {
            state: {
                type: 'State'
            },
            name: {
                type: 'Text'
            }
        },
        outputs: {
            district: {
                type: 'District',
                op: 'create',
                values: {
                    state: {
                        expectedReturnType: 'Text',
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
            variableName: {
                type: 'District'
            }
        },
        outputs: {
            district: {
                type: 'District',
                op: 'delete',
                id: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
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
            subdistrict: {
                type: 'Subdistrict',
                op: 'create',
                values: {
                    district: {
                        expectedReturnType: 'Text',
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
            variableName: {
                type: 'Subdistrict'
            }
        },
        outputs: {
            subdistrict: {
                type: 'Subdistrict',
                op: 'delete',
                id: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
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
            postalCode: {
                type: 'PostalCode',
                op: 'create',
                values: {
                    subdistrict: {
                        expectedReturnType: 'Text',
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
            variableName: {
                type: 'PostalCode'
            }
        },
        outputs: {
            postalCode: {
                type: 'PostalCode',
                op: 'delete',
                id: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
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
                type: 'Decimal'
            },
            longitude: {
                type: 'Decimal'
            }
        },
        outputs: {
            address: {
                type: 'Address',
                op: 'create',
                values: {
                    postalCode: {
                        expectedReturnType: 'Text',
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
                        expectedReturnType: 'Decimal',
                        op: '.',
                        types: [],
                        args: ['latitude']
                    },
                    longitude: {
                        expectedReturnType: 'Decimal',
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
            variableName: {
                type: 'Address'
            }
        },
        outputs: {
            address: {
                type: 'Address',
                op: 'delete',
                id: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
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
            bank: {
                type: 'Bank',
                op: 'create',
                values: {
                    country: {
                        expectedReturnType: 'Text',
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
            variableName: {
                type: 'Bank'
            }
        },
        outputs: {
            bank: {
                type: 'Bank',
                op: 'delete',
                id: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
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
            bankBranch: {
                type: 'BankBranch',
                op: 'create',
                values: {
                    bank: {
                        expectedReturnType: 'Text',
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
                        expectedReturnType: 'Text',
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
            variableName: {
                type: 'BankBranch'
            }
        },
        outputs: {
            bankBranch: {
                type: 'BankBranch',
                op: 'delete',
                id: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
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
            }
        },
        outputs: {
            bankAccount: {
                type: 'BankAccount',
                op: 'create',
                values: {
                    bank: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['bank']
                    },
                    bankBranch: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['bankBranch']
                    },
                    accountNumber: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['accountNumber']
                    }
                }
            }
        }
    },
    deleteBankAccount: {
        inputs: {
            variableName: {
                type: 'BankAccount'
            }
        },
        outputs: {
            bankAccount: {
                type: 'BankAccount',
                op: 'delete',
                id: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                }
            }
        }
    },
    createCompany: {
        inputs: {
            variableName: {
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
            company: {
                type: 'Company',
                op: 'create',
                values: {
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
                    companyType: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['companyType']
                    },
                    serviceArea: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['serviceArea']
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
            variableName: {
                type: 'Company'
            }
        },
        outputs: {
            company: {
                type: 'Company',
                op: 'delete',
                id: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
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
            companyAddress: {
                type: 'CompanyAddress',
                op: 'create',
                values: {
                    company: {
                        expectedReturnType: 'Text',
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
                        expectedReturnType: 'Text',
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
            variableName: {
                type: 'CompanyAddress'
            }
        },
        outputs: {
            companyAddress: {
                type: 'CompanyAddress',
                op: 'delete',
                id: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                }
            }
        }
    },
    createCompanyContact: {
        inputs: {
            company: {
                type: 'Company'
            },
            name: {
                type: 'Text'
            },
            designation: {
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
            companyContact: {
                type: 'CompanyContact',
                op: 'create',
                values: {
                    company: {
                        expectedReturnType: 'Text',
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
                    designation: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['designation']
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
            variableName: {
                type: 'CompanyContact'
            }
        },
        outputs: {
            companyContact: {
                type: 'CompanyContact',
                op: 'delete',
                id: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
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
            companyBankAccount: {
                type: 'CompanyBankAccount',
                op: 'create',
                values: {
                    company: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['company']
                    },
                    bankAccount: {
                        expectedReturnType: 'Text',
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
            variableName: {
                type: 'CompanyBankAccount'
            }
        },
        outputs: {
            companyBankAccount: {
                type: 'CompanyBankAccount',
                op: 'delete',
                id: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                }
            }
        }
    },
    createProduct: {
        inputs: {
            variableName: {
                type: 'Text'
            },
            name: {
                type: 'Text'
            },
            orderable: {
                type: 'Boolean'
            },
            consumable: {
                type: 'Boolean'
            },
            producable: {
                type: 'Boolean'
            }
        },
        outputs: {
            product: {
                type: 'Product',
                op: 'create',
                values: {
                    name: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['name']
                    },
                    orderable: {
                        expectedReturnType: 'Boolean',
                        op: '.',
                        types: [],
                        args: ['orderable']
                    },
                    consumable: {
                        expectedReturnType: 'Boolean',
                        op: '.',
                        types: [],
                        args: ['consumable']
                    },
                    producable: {
                        expectedReturnType: 'Boolean',
                        op: '.',
                        types: [],
                        args: ['producable']
                    }
                }
            }
        }
    },
    deleteProduct: {
        inputs: {
            variableName: {
                type: 'Product'
            }
        },
        outputs: {
            product: {
                type: 'Product',
                op: 'delete',
                id: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                }
            }
        }
    },
    createUOM: {
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
            uom: {
                type: 'UOM',
                op: 'create',
                values: {
                    product: {
                        expectedReturnType: 'Text',
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
    deleteUOM: {
        inputs: {
            variableName: {
                type: 'UOM'
            }
        },
        outputs: {
            uom: {
                type: 'UOM',
                op: 'delete',
                id: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                }
            }
        }
    },
    createIndent: {
        inputs: {},
        outputs: {
            indent: {
                type: 'Indent',
                op: 'create',
                values: {}
            }
        }
    },
    deleteIndent: {
        inputs: {
            variableName: {
                type: 'Indent'
            }
        },
        outputs: {
            indent: {
                type: 'Indent',
                op: 'delete',
                id: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
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
                type: 'Decimal'
            },
            uom: {
                type: 'UOM'
            }
        },
        outputs: {
            indentItem: {
                type: 'IndentItem',
                op: 'create',
                values: {
                    indent: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['indent']
                    },
                    product: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['product']
                    },
                    quantity: {
                        expectedReturnType: 'Decimal',
                        op: '.',
                        types: [],
                        args: ['quantity']
                    },
                    uom: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['uom']
                    },
                    ordered: {
                        expectedReturnType: 'Number',
                        op: 'id',
                        types: ['Number'],
                        args: [0]
                    },
                    received: {
                        expectedReturnType: 'Number',
                        op: 'id',
                        types: ['Number'],
                        args: [0]
                    },
                    approved: {
                        expectedReturnType: 'Number',
                        op: 'id',
                        types: ['Number'],
                        args: [0]
                    },
                    rejected: {
                        expectedReturnType: 'Number',
                        op: 'id',
                        types: ['Number'],
                        args: [0]
                    },
                    returned: {
                        expectedReturnType: 'Number',
                        op: 'id',
                        types: ['Number'],
                        args: [0]
                    },
                    requisted: {
                        expectedReturnType: 'Number',
                        op: 'id',
                        types: ['Number'],
                        args: [0]
                    },
                    consumed: {
                        expectedReturnType: 'Number',
                        op: 'id',
                        types: ['Number'],
                        args: [0]
                    }
                }
            }
        }
    },
    deleteIndentItem: {
        inputs: {
            variableName: {
                type: 'IndentItem'
            }
        },
        outputs: {
            indentItem: {
                type: 'IndentItem',
                op: 'delete',
                id: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
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
            companyProduct: {
                type: 'CompanyProduct',
                op: 'create',
                values: {
                    company: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['company']
                    },
                    product: {
                        expectedReturnType: 'Text',
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
            variableName: {
                type: 'CompanyProduct'
            }
        },
        outputs: {
            companyProduct: {
                type: 'CompanyProduct',
                op: 'delete',
                id: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
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
            quotation: {
                type: 'Quotation',
                op: 'create',
                values: {
                    indent: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['indent']
                    },
                    company: {
                        expectedReturnType: 'Text',
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
            variableName: {
                type: 'Quotation'
            }
        },
        outputs: {
            quotation: {
                type: 'Quotation',
                op: 'delete',
                id: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
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
                type: 'Decimal'
            }
        },
        outputs: {
            quotationItem: {
                type: 'QuotationItem',
                op: 'create',
                values: {
                    quotation: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['quotation']
                    },
                    indentItem: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['indentItem']
                    },
                    quantity: {
                        expectedReturnType: 'Decimal',
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
            variableName: {
                type: 'QuotationItem'
            }
        },
        outputs: {
            quotationItem: {
                type: 'QuotationItem',
                op: 'delete',
                id: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
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
            purchaseOrder: {
                type: 'PurchaseOrder',
                op: 'create',
                values: {
                    quotation: {
                        expectedReturnType: 'Text',
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
            variableName: {
                type: 'PurchaseOrder'
            }
        },
        outputs: {
            purchaseOrder: {
                type: 'PurchaseOrder',
                op: 'delete',
                id: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
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
            }
        },
        outputs: {
            purchaseOrderItem: {
                type: 'PurchaseOrderItem',
                op: 'create',
                values: {
                    purchaseOrder: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['purchaseOrder']
                    },
                    quotationItem: {
                        expectedReturnType: 'Text',
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
                        op: 'id',
                        types: ['Number'],
                        args: [0]
                    }
                }
            }
        }
    },
    deletePurchaseOrderItem: {
        inputs: {
            variableName: {
                type: 'PurchaseOrderItem'
            }
        },
        outputs: {
            purchaseOrderItem: {
                type: 'PurchaseOrderItem',
                op: 'delete',
                id: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
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
            purchaseInvoice: {
                type: 'PurchaseInvoice',
                op: 'create',
                values: {
                    purchaseOrder: {
                        expectedReturnType: 'Text',
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
            variableName: {
                type: 'PurchaseInvoice'
            }
        },
        outputs: {
            purchaseInvoice: {
                type: 'PurchaseInvoice',
                op: 'delete',
                id: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
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
            }
        },
        outputs: {
            purchaseInvoiceItem: {
                type: 'PurchaseInvoiceItem',
                op: 'create',
                values: {
                    purchaseInvoice: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['purchaseInvoice']
                    },
                    purchaseOrderItem: {
                        expectedReturnType: 'Text',
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
                        op: 'id',
                        types: ['Number'],
                        args: [0]
                    },
                    rejected: {
                        expectedReturnType: 'Number',
                        op: 'id',
                        types: ['Number'],
                        args: [0]
                    }
                }
            }
        }
    },
    deletePurchaseInvoiceItem: {
        inputs: {
            variableName: {
                type: 'PurchaseInvoiceItem'
            }
        },
        outputs: {
            purchaseInvoiceItem: {
                type: 'PurchaseInvoiceItem',
                op: 'delete',
                id: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
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
            materialApprovalSlip: {
                type: 'MaterialApprovalSlip',
                op: 'create',
                values: {
                    purchaseInvoice: {
                        expectedReturnType: 'Text',
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
            variableName: {
                type: 'MaterialApprovalSlip'
            }
        },
        outputs: {
            materialApprovalSlip: {
                type: 'MaterialApprovalSlip',
                op: 'delete',
                id: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
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
            }
        },
        outputs: {
            materialApprovalSlipItem: {
                type: 'MaterialApprovalSlipItem',
                op: 'create',
                values: {
                    materialApprovalSlip: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['materialApprovalSlip']
                    },
                    purchaseInvoiceItem: {
                        expectedReturnType: 'Text',
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
                        op: 'id',
                        types: ['Number'],
                        args: [0]
                    }
                }
            }
        }
    },
    deleteMaterialApprovalSlipItem: {
        inputs: {
            variableName: {
                type: 'MaterialApprovalSlipItem'
            }
        },
        outputs: {
            materialApprovalSlipItem: {
                type: 'MaterialApprovalSlipItem',
                op: 'delete',
                id: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
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
            materialRejectionSlip: {
                type: 'MaterialRejectionSlip',
                op: 'create',
                values: {
                    purchaseInvoice: {
                        expectedReturnType: 'Text',
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
            variableName: {
                type: 'MaterialRejectionSlip'
            }
        },
        outputs: {
            materialRejectionSlip: {
                type: 'MaterialRejectionSlip',
                op: 'delete',
                id: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
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
            }
        },
        outputs: {
            materialRejectionSlipItem: {
                type: 'MaterialRejectionSlipItem',
                op: 'create',
                values: {
                    materialRejectionSlip: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['materialRejectionSlip']
                    },
                    purchaseInvoiceItem: {
                        expectedReturnType: 'Text',
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
                        op: 'id',
                        types: ['Number'],
                        args: [0]
                    }
                }
            }
        }
    },
    deleteMaterialRejectionSlipItem: {
        inputs: {
            variableName: {
                type: 'MaterialRejectionSlipItem'
            }
        },
        outputs: {
            materialRejectionSlipItem: {
                type: 'MaterialRejectionSlipItem',
                op: 'delete',
                id: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
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
            materialReturnSlip: {
                type: 'MaterialReturnSlip',
                op: 'create',
                values: {
                    materialRejectionSlip: {
                        expectedReturnType: 'Text',
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
            variableName: {
                type: 'MaterialReturnSlip'
            }
        },
        outputs: {
            materialReturnSlip: {
                type: 'MaterialReturnSlip',
                op: 'delete',
                id: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
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
            materialReturnSlipItem: {
                type: 'MaterialReturnSlipItem',
                op: 'create',
                values: {
                    materialReturnSlip: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['materialReturnSlip']
                    },
                    materialRejectionSlipItem: {
                        expectedReturnType: 'Text',
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
            variableName: {
                type: 'MaterialReturnSlipItem'
            }
        },
        outputs: {
            materialReturnSlipItem: {
                type: 'MaterialReturnSlipItem',
                op: 'delete',
                id: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
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
            materialRequistionSlip: {
                type: 'MaterialRequistionSlip',
                op: 'create',
                values: {
                    materialApprovalSlip: {
                        expectedReturnType: 'Text',
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
            variableName: {
                type: 'MaterialRequistionSlip'
            }
        },
        outputs: {
            materialRequistionSlip: {
                type: 'MaterialRequistionSlip',
                op: 'delete',
                id: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
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
            }
        },
        outputs: {
            materialRequistionSlipItem: {
                type: 'MaterialRequistionSlipItem',
                op: 'create',
                values: {
                    materialRequistionSlip: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['materialRequistionSlip']
                    },
                    materialApprovalSlipItem: {
                        expectedReturnType: 'Text',
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
                        op: 'id',
                        types: ['Number'],
                        args: [0]
                    }
                }
            }
        }
    },
    deleteMaterialRequistionSlipItem: {
        inputs: {
            variableName: {
                type: 'MaterialRequistionSlipItem'
            }
        },
        outputs: {
            materialRequistionSlipItem: {
                type: 'MaterialRequistionSlipItem',
                op: 'delete',
                id: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                }
            }
        }
    },
    createBOM: {
        inputs: {
            variableName: {
                type: 'Text'
            }
        },
        outputs: {
            bom: {
                type: 'BOM',
                op: 'create',
                values: {}
            }
        }
    },
    deleteBOM: {
        inputs: {
            variableName: {
                type: 'BOM'
            }
        },
        outputs: {
            bom: {
                type: 'BOM',
                op: 'delete',
                id: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                }
            }
        }
    },
    createBOMItem: {
        inputs: {
            bom: {
                type: 'BOM'
            },
            product: {
                type: 'Product'
            },
            quantity: {
                type: 'Decimal'
            },
            uom: {
                type: 'UOM'
            }
        },
        outputs: {
            bomItem: {
                type: 'BOMItem',
                op: 'create',
                values: {
                    bom: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['bom']
                    },
                    product: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['product']
                    },
                    quantity: {
                        expectedReturnType: 'Decimal',
                        op: '.',
                        types: [],
                        args: ['quantity']
                    },
                    uom: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['uom']
                    }
                }
            }
        }
    },
    deleteBOMItem: {
        inputs: {
            variableName: {
                type: 'BOMItem'
            }
        },
        outputs: {
            bomItem: {
                type: 'BOMItem',
                op: 'delete',
                id: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                }
            }
        }
    },
    createProductionPreparationSlip: {
        inputs: {
            bom: {
                type: 'BOM'
            }
        },
        outputs: {
            productionPreparationSlip: {
                type: 'ProductionPreparationSlip',
                op: 'create',
                values: {
                    bom: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['bom']
                    },
                    approved: {
                        expectedReturnType: 'Number',
                        op: 'id',
                        types: ['Number'],
                        args: [0]
                    },
                    scrapped: {
                        expectedReturnType: 'Number',
                        op: 'id',
                        types: ['Number'],
                        args: [0]
                    }
                }
            }
        }
    },
    deleteProductionPreparationSlip: {
        inputs: {
            variableName: {
                type: 'ProductionPreparationSlip'
            }
        },
        outputs: {
            productionPreparationSlip: {
                type: 'ProductionPreparationSlip',
                op: 'delete',
                id: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
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
            bomItem: {
                type: 'ProductionPreparationSlipItem',
                op: 'create',
                values: {
                    productionPreparationSlip: {
                        expectedReturnType: 'Text',
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
                        expectedReturnType: 'Text',
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
            variableName: {
                type: 'ProductionPreparationSlipItem'
            }
        },
        outputs: {
            productionPreparationSlipItem: {
                type: 'ProductionPreparationSlipItem',
                op: 'delete',
                id: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
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
            scrapMaterialSlip: {
                type: 'ScrapMaterialSlip',
                op: 'create',
                values: {
                    productionPreparationSlip: {
                        expectedReturnType: 'Text',
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
            variableName: {
                type: 'ScrapMaterialSlip'
            }
        },
        outputs: {
            scrapMaterialSlip: {
                type: 'ScrapMaterialSlip',
                op: 'delete',
                id: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
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
            }
        },
        outputs: {
            transferMaterialSlip: {
                type: 'TransferMaterialSlip',
                op: 'create',
                values: {
                    productionPreparationSlip: {
                        expectedReturnType: 'Text',
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
                        op: 'id',
                        types: ['Number'],
                        args: [0]
                    }
                }
            }
        }
    },
    deleteTransferMaterialSlip: {
        inputs: {
            variableName: {
                type: 'TransferMaterialSlip'
            }
        },
        outputs: {
            transferMaterialSlip: {
                type: 'TransferMaterialSlip',
                op: 'delete',
                id: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
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
            warehouseAcceptanceSlip: {
                type: 'WarehouseAcceptanceSlip',
                op: 'create',
                values: {
                    transferMaterialSlip: {
                        expectedReturnType: 'Text',
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
            variableName: {
                type: 'WarehouseAcceptanceSlip'
            }
        },
        outputs: {
            warehouseAcceptanceSlip: {
                type: 'WarehouseAcceptanceSlip',
                op: 'delete',
                id: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                }
            }
        }
    }
}
