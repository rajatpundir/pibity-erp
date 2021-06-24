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

    | 'createServiceArea'
    | 'deleteServiceArea'

    | 'createCompanyType'
    | 'deleteCompanyType'

    | 'createBank'
    | 'deleteBank'

    | 'createBankBranch'
    | 'deleteBankBranch'

    | 'createBankAccount'
    | 'deleteBankAccount'

    | 'createSupplier'
    | 'deleteSupplier'

    | 'createSupplierAddress'
    | 'deleteSupplierAddress'

    | 'createSupplierContact'
    | 'deleteSupplierContact'

    | 'createSupplierBankAccount'
    | 'deleteSupplierBankAccount'

    | 'createProduct'
    | 'deleteProduct'

    | 'createUOM'
    | 'deleteUOM'

    | 'createIndent'
    | 'deleteIndent'

    | 'createIndentItem'
    | 'deleteIndentItem'

    | 'createSupplierProduct'
    | 'deleteSupplierProduct'

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
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
            }
        }
    },
    createServiceArea: {
        inputs: {
            variableName: {
                type: 'Text'
            }
        },
        outputs: {
            serviceArea: {
                type: 'ServiceArea',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
            }
        }
    },
    deleteServiceArea: {
        inputs: {
            variableName: {
                type: 'ServiceArea'
            }
        },
        outputs: {
            serviceArea: {
                type: 'ServiceArea',
                op: 'delete',
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
            }
        }
    },
    createCompanyType: {
        inputs: {
            variableName: {
                type: 'Text'
            }
        },
        outputs: {
            companyType: {
                type: 'CompanyType',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
            }
        }
    },
    deleteCompanyType: {
        inputs: {
            variableName: {
                type: 'CompanyType'
            }
        },
        outputs: {
            companyType: {
                type: 'CompanyType',
                op: 'delete',
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
            }
        }
    },
    createSupplier: {
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
            companyType: {
                type: 'CompanyType'
            },
            serviceArea: {
                type: 'ServiceArea'
            },
            gstin: {
                type: 'Text'
            },
            name: {
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
            supplier: {
                type: 'Supplier',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
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
    deleteSupplier: {
        inputs: {
            variableName: {
                type: 'Supplier'
            }
        },
        outputs: {
            supplier: {
                type: 'Supplier',
                op: 'delete',
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
            }
        }
    },
    createSupplierAddress: {
        inputs: {
            supplier: {
                type: 'Supplier'
            },
            name: {
                type: 'Text'
            },
            address: {
                type: 'Address'
            }
        },
        outputs: {
            supplierAddress: {
                type: 'SupplierAddress',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
                values: {
                    supplier: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['supplier']
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
    deleteSupplierAddress: {
        inputs: {
            variableName: {
                type: 'SupplierAddress'
            }
        },
        outputs: {
            supplierAddress: {
                type: 'SupplierAddress',
                op: 'delete',
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
            }
        }
    },
    createSupplierContact: {
        inputs: {
            supplier: {
                type: 'Supplier'
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
            supplierContact: {
                type: 'SupplierContact',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
                values: {
                    supplier: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['supplier']
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
    deleteSupplierContact: {
        inputs: {
            variableName: {
                type: 'SupplierContact'
            }
        },
        outputs: {
            supplierContact: {
                type: 'SupplierContact',
                op: 'delete',
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
            }
        }
    },
    createSupplierBankAccount: {
        inputs: {
            supplier: {
                type: 'Supplier'
            },
            bankAccount: {
                type: 'BankAccount'
            }
        },
        outputs: {
            supplierBankAccount: {
                type: 'SupplierBankAccount',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
                values: {
                    supplier: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['supplier']
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
    deleteSupplierBankAccount: {
        inputs: {
            variableName: {
                type: 'SupplierBankAccount'
            }
        },
        outputs: {
            supplierBankAccount: {
                type: 'SupplierBankAccount',
                op: 'delete',
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
            }
        }
    },
    createIndent: {
        inputs: {},
        outputs: {
            indent: {
                type: 'Indent',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
            }
        }
    },
    createSupplierProduct: {
        inputs: {
            supplier: {
                type: 'Supplier'
            },
            product: {
                type: 'Product'
            }
        },
        outputs: {
            supplierProduct: {
                type: 'SupplierProduct',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
                values: {
                    supplier: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['supplier']
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
    deleteSupplierProduct: {
        inputs: {
            variableName: {
                type: 'SupplierProduct'
            }
        },
        outputs: {
            supplierProduct: {
                type: 'SupplierProduct',
                op: 'delete',
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
            }
        }
    },
    createQuotation: {
        inputs: {
            indent: {
                type: 'Indent'
            },
            supplier: {
                type: 'Supplier'
            }
        },
        outputs: {
            quotation: {
                type: 'Quotation',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
                values: {
                    indent: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['indent']
                    },
                    supplier: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['supplier']
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
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
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
            }
        }
    }
}
