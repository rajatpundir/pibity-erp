import { Circuit } from "./circuit"

export type CircuitName =

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

    | 'createSupplier'
    | 'deleteSupplier'

    | 'createProduct'
    | 'deleteProduct'

    | 'createIndent'
    | 'deleteIndent'

    | 'createQuotation'
    | 'deleteQuotation'

    | 'createPurchaseOrder'
    | 'deletePurchaseOrder'

    | 'createPurchaseInvoice'
    | 'deletePurchaseInvoice'

    | 'createMaterialApprovalSlip'
    | 'deleteMaterialApprovalSlip'

    | 'createMaterialRejectionSlip'
    | 'deleteMaterialRejectionSlip'

    | 'createMaterialReturnSlip'
    | 'deleteMaterialReturnSlip'

    | 'createMaterialRequistionSlip'
    | 'deleteMaterialRequistionSlip'

    | 'createBOM'
    | 'deleteBOM'

    | 'createProductionPreparationSlip'
    | 'deleteProductionPreparationSlip'

    | 'createScrapMaterialSlip'
    | 'deleteScrapMaterialSlip'

    | 'createTransferMaterialSlip'
    | 'deleteTransferMaterialSlip'

    | 'createWarehouseAcceptanceSlip'
    | 'deleteWarehouseAcceptanceSlip'

export const circuits: Record<CircuitName, Circuit> = {
    createRegion: {
        inputs: {
            variableName: {
                type: 'Text'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createRegion',
                connect: {
                    variableName: ['input', 'variableName']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createCountries',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        region: ['input', 'variableName']
                    }
                }
            }
        },
        outputs: {
            region: ['c1', 'region'],
            countries: ['c2', '']
        }
    },
    deleteRegion: {
        inputs: {
            variableName: {
                type: 'Text'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteCountries',
                connect: {
                    queryParams: {
                        region: ['input', 'variableName']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'function',
                exec: 'deleteRegion',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            region: ['c2', 'region']
        }
    },
    createCountry: {
        inputs: {
            region: {
                type: 'Region'
            },
            name: {
                type: 'Text'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createCountry',
                connect: {
                    region: ['input', 'region'],
                    name: ['input', 'name']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createStates',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        country: ['input', 'name']
                    }
                }
            }
        },
        outputs: {
            country: ['c1', 'country'],
            states: ['c2', '']
        }
    },
    deleteCountry: {
        inputs: {
            variableName: {
                type: 'Text'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteStates',
                connect: {
                    queryParams: {
                        country: ['input', 'variableName']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'function',
                exec: 'deleteCountry',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            country: ['c2', 'country']
        }
    },
    createState: {
        inputs: {
            country: {
                type: 'Country'
            },
            name: {
                type: 'Text'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createState',
                connect: {
                    country: ['input', 'country'],
                    name: ['input', 'name']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createDistricts',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        state: ['input', 'name']
                    }
                }
            }
        },
        outputs: {
            state: ['c1', 'state'],
            districts: ['c2', '']
        }
    },
    deleteState: {
        inputs: {
            variableName: {
                type: 'Text'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteDistricts',
                connect: {
                    queryParams: {
                        state: ['input', 'variableName']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'function',
                exec: 'deleteState',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            state: ['c2', 'state']
        }
    },
    createDistrict: {
        inputs: {
            variableName: {
                type: 'Text'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createDistrict',
                connect: {
                    variableName: ['input', 'variableName']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createSubdistricts',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        district: ['input', 'variableName']
                    }
                }
            }
        },
        outputs: {
            district: ['c1', 'district'],
            subdistricts: ['c2', '']
        }
    },
    deleteDistrict: {
        inputs: {
            variableName: {
                type: 'Text'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteSubdistricts',
                connect: {
                    queryParams: {
                        'district': ['input', 'variableName']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'function',
                exec: 'deleteDistrict',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            district: ['c2', 'district']
        }
    },
    createSubdistrict: {
        inputs: {
            variableName: {
                type: 'Text'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createSubdistrict',
                connect: {
                    variableName: ['input', 'variableName']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createPostalCodes',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        subdistrict: ['input', 'variableName']
                    }
                }
            }
        },
        outputs: {
            subdistrict: ['c1', 'subdistrict'],
            postalCodes: ['c2', '']
        }
    },
    deleteSubdistrict: {
        inputs: {
            variableName: {
                type: 'Text'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deletePostalCodes',
                connect: {
                    queryParams: {
                        subdistrict: ['input', 'variableName']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'function',
                exec: 'deleteSubdistrict',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            subdistrict: ['c2', 'subdistrict']
        }
    },
    createPostalCode: {
        inputs: {
            variableName: {
                type: 'Text'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createPostalCode',
                connect: {
                    variableName: ['input', 'variableName']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createAddresses',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        postalCode: ['input', 'variableName']
                    }
                }
            }
        },
        outputs: {
            postalCode: ['c1', 'postalCode'],
            addresses: ['c2', '']
        }
    },
    deletePostalCode: {
        inputs: {
            variableName: {
                type: 'Text'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteAddresses',
                connect: {
                    queryParams: {
                        region: ['input', 'variableName']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'function',
                exec: 'deletePostalCode',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            postalCode: ['c2', 'postalCode']
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
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createAddress',
                connect: {
                    postalCode: ['input', 'postalCode'],
                    line1: ['input', 'line1'],
                    line2: ['input', 'line2'],
                    latitude: ['input', 'latitude'],
                    longitude: ['input', 'longitude']
                }
            }
        },
        outputs: {
            address: ['c1', 'address']
        }
    },
    deleteAddress: {
        inputs: {
            variableName: {
                type: 'Text'
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'deleteAddress',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            address: ['c1', 'address']
        }
    },
    createServiceArea: {
        inputs: {
            variableName: {
                type: 'Text'
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createServiceArea',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            serviceArea: ['c1', 'serviceArea']
        }
    },
    deleteServiceArea: {
        inputs: {
            variableName: {
                type: 'Text'
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'deleteServiceArea',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            serviceArea: ['c1', 'serviceArea']
        }
    },
    createCompanyType: {
        inputs: {
            variableName: {
                type: 'Text'
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createCompanyType',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            companyType: ['c1', 'companyType']
        }
    },
    deleteCompanyType: {
        inputs: {
            variableName: {
                type: 'Text'
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'deleteCompanyType',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            companyType: ['c1', 'companyType']
        }
    },
    createBank: {
        inputs: {
            variableName: {
                type: 'Text'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createBank',
                connect: {
                    variableName: ['input', 'variableName']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createBankBranches',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        bank: ['input', 'variableName']
                    }
                }
            }
        },
        outputs: {
            bank: ['c1', 'bank'],
            bankBranches: ['c2', '']
        }
    },
    deleteBank: {
        inputs: {
            variableName: {
                type: 'Text'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteBankBranches',
                connect: {
                    queryParams: {
                        bank: ['input', 'variableName']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'function',
                exec: 'deleteBank',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            bank: ['c2', 'bank']
        }
    },
    createBankBranch: {
        inputs: {
            variableName: {
                type: 'Text'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createBankBranch',
                connect: {
                    variableName: ['input', 'variableName']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createBankAccounts',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        bankBranch: ['input', 'variableName']
                    }
                }
            }
        },
        outputs: {
            bankBranch: ['c1', 'bankBranch'],
            bankAccounts: ['c2', '']
        }
    },
    deleteBankBranch: {
        inputs: {
            variableName: {
                type: 'Text'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteBankAccounts',
                connect: {
                    queryParams: {
                        bankBranch: ['input', 'variableName']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'function',
                exec: 'deleteBankBranch',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            bankBranch: ['c2', 'bankBranch']
        }
    },
    createSupplier: {
        inputs: {
            variableName: {
                type: 'Text'
            },
            addresses: {
                type: []
            },
            contacts: {
                type: []
            },
            bankAccounts: {
                type: []
            },
            products: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createSupplier',
                connect: {
                    variableName: ['input', 'variableName']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createSupplierAddresses',
                connect: {
                    queryParams: {},
                    args: ['input', 'addresses'],
                    overrides: {
                        supplier: ['input', 'variableName']
                    }
                }
            },
            c3: {
                order: 3,
                type: 'mapper',
                exec: 'createSupplierContacts',
                connect: {
                    queryParams: {},
                    args: ['input', 'contacts'],
                    overrides: {
                        supplier: ['input', 'variableName']
                    }
                }
            },
            c4: {
                order: 4,
                type: 'mapper',
                exec: 'createSupplierBankAccounts',
                connect: {
                    queryParams: {},
                    args: ['input', 'bankAccounts'],
                    overrides: {
                        supplier: ['input', 'variableName']
                    }
                }
            },
            c5: {
                order: 5,
                type: 'mapper',
                exec: 'createSupplierProducts',
                connect: {
                    queryParams: {},
                    args: ['input', 'products'],
                    overrides: {
                        supplier: ['input', 'variableName']
                    }
                }
            }
        },
        outputs: {
            supplier: ['c1', 'supplier'],
            addresses: ['c2', ''],
            contacts: ['c3', ''],
            bankAccounts: ['c4', ''],
            products: ['c5', '']
        }
    },
    deleteSupplier: {
        inputs: {
            variableName: {
                type: 'Text'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteSupplierAddresses',
                connect: {
                    queryParams: {
                        supplier: ['input', 'variableName']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'deleteSupplierContacts',
                connect: {
                    queryParams: {
                        supplier: ['input', 'variableName']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c3: {
                order: 3,
                type: 'mapper',
                exec: 'deleteSupplierBankAccounts',
                connect: {
                    queryParams: {
                        supplier: ['input', 'variableName']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c4: {
                order: 4,
                type: 'mapper',
                exec: 'deleteSupplierProducts',
                connect: {
                    queryParams: {
                        supplier: ['input', 'variableName']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c5: {
                order: 5,
                type: 'function',
                exec: 'deleteSupplier',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            supplier: ['c5', 'supplier']
        }
    },
    createProduct: {
        inputs: {
            sku: {
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
            },
            uoms: {
                type: []
            },
            suppliers: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createProduct',
                connect: {
                    variableName: ['input', 'sku'],
                    name: ['input', 'name'],
                    orderable: ['input', 'orderable'],
                    consumable: ['input', 'consumable'],
                    producable: ['input', 'producable']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createUOMs',
                connect: {
                    queryParams: {},
                    args: ['input', 'uoms'],
                    overrides: {
                        product: ['input', 'sku']
                    }
                }
            },
            c3: {
                order: 3,
                type: 'mapper',
                exec: 'createProductSuppliers',
                connect: {
                    queryParams: {},
                    args: ['input', 'suppliers'],
                    overrides: {
                        product: ['input', 'sku']
                    }
                }
            }
        },
        outputs: {
            product: ['c1', 'product'],
            uoms: ['c2', ''],
            suppliers: ['c3', '']
        }
    },
    deleteProduct: {
        inputs: {
            variableName: {
                type: 'Text'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteUOMs',
                connect: {
                    queryParams: {
                        'product': ['input', 'variableName']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'deleteProductSuppliers',
                connect: {
                    queryParams: {
                        'product': ['input', 'variableName']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c3: {
                order: 3,
                type: 'function',
                exec: 'deleteProduct',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            product: ['c3', 'product']
        }
    },
    createIndent: {
        inputs: {
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createIndent',
                connect: {}
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createIndentItems',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        indent: ['computation', 'c1', 'indent']
                    }
                }
            }
        },
        outputs: {
            indent: ['c1', 'indent'],
            items: ['c2', '']
        }
    },
    deleteIndent: {
        inputs: {
            variableName: {
                type: 'Text'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteIndentItems',
                connect: {
                    queryParams: {
                        'indent': ['input', 'variableName']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'function',
                exec: 'deleteIndent',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            indent: ['c2', 'indent']
        }
    },
    createQuotation: {
        inputs: {
            indent: {
                type: 'Indent'
            },
            supplier: {
                type: 'Supplier'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createQuotation',
                connect: {
                    indent: ['input', 'indent'],
                    supplier: ['input', 'supplier']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createQuotationItems',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        quotation: ['computation', 'c1', 'quotation']
                    }
                }
            }
        },
        outputs: {
            quotation: ['c1', 'quotation'],
            items: ['c2', '']
        }
    },
    deleteQuotation: {
        inputs: {
            variableName: {
                type: 'Text'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteQuotationItems',
                connect: {
                    queryParams: {
                        'quotation': ['input', 'variableName']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'function',
                exec: 'deleteQuotation',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            quotation: ['c2', 'quotation']
        }
    },
    createPurchaseOrder: {
        inputs: {
            quotation: {
                type: 'Quotation'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createPurchaseOrder',
                connect: {
                    quotation: ['input', 'quotation']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createPurchaseOrderItems',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        purchaseOrder: ['computation', 'c1', 'purchaseOrder']
                    }
                }
            }
        },
        outputs: {
            purchaseOrder: ['c1', 'purchaseOrder'],
            items: ['c2', '']
        }
    },
    deletePurchaseOrder: {
        inputs: {
            variableName: {
                type: 'Text'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deletePurchaseOrderItems',
                connect: {
                    queryParams: {
                        'purchaseOrder': ['input', 'variableName']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'function',
                exec: 'deletePurchaseOrder',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            purchaseOrder: ['c2', 'purchaseOrder']
        }
    },
    createPurchaseInvoice: {
        inputs: {
            purchaseOrder: {
                type: 'PurchaseOrder'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createPurchaseInvoice',
                connect: {
                    purchaseOrder: ['input', 'purchaseOrder']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createPurchaseInvoiceItems',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        purchaseInvoice: ['computation', 'c1', 'purchaseInvoice']
                    }
                }
            }
        },
        outputs: {
            purchaseInvoice: ['c1', 'purchaseInvoice'],
            items: ['c2', '']
        }
    },
    deletePurchaseInvoice: {
        inputs: {
            variableName: {
                type: 'Text'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deletePurchaseInvoiceItems',
                connect: {
                    queryParams: {
                        'purchaseInvoice': ['input', 'variableName']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'function',
                exec: 'deletePurchaseInvoice',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            purchaseInvoice: ['c2', 'purchaseInvoice']
        }
    },
    createMaterialApprovalSlip: {
        inputs: {
            purchaseInvoice: {
                type: 'PurchaseInvoice'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createMaterialApprovalSlip',
                connect: {
                    purchaseInvoice: ['input', 'purchaseInvoice']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createMaterialApprovalSlipItems',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        materialApprovalSlip: ['computation', 'c1', 'materialApprovalSlip']
                    }
                }
            }
        },
        outputs: {
            materialApprovalSlip: ['c1', 'materialApprovalSlip'],
            items: ['c2', '']
        }
    },
    deleteMaterialApprovalSlip: {
        inputs: {
            variableName: {
                type: 'Text'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteMaterialApprovalSlipItems',
                connect: {
                    queryParams: {
                        'materialApprovalSlip': ['input', 'variableName']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'function',
                exec: 'deleteMaterialApprovalSlip',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            materialApprovalSlip: ['c2', 'materialApprovalSlip']
        }
    },
    createMaterialRejectionSlip: {
        inputs: {
            purchaseInvoice: {
                type: 'PurchaseInvoice'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createMaterialRejectionSlip',
                connect: {
                    purchaseInvoice: ['input', 'purchaseInvoice']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createMaterialRejectionSlipItems',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        materialRejectionSlip: ['computation', 'c1', 'materialRejectionSlip']
                    }
                }
            }
        },
        outputs: {
            materialRejectionSlip: ['c1', 'materialRejectionSlip'],
            items: ['c2', '']
        }
    },
    deleteMaterialRejectionSlip: {
        inputs: {
            variableName: {
                type: 'Text'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteMaterialRejectionSlipItems',
                connect: {
                    queryParams: {
                        'materialRejectionSlip': ['input', 'variableName']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'function',
                exec: 'deleteMaterialRejectionSlip',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            materialRejectionSlip: ['c2', 'materialRejectionSlip']
        }
    },
    createMaterialReturnSlip: {
        inputs: {
            materialRejectionSlip: {
                type: 'MaterialRejectionSlip'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createMaterialReturnSlip',
                connect: {
                    materialRejectionSlip: ['input', 'materialRejectionSlip']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createMaterialReturnSlipItems',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        materialReturnSlip: ['computation', 'c1', 'materialReturnSlip']
                    }
                }
            }
        },
        outputs: {
            materialReturnSlip: ['c1', 'materialReturnSlip'],
            items: ['c2', '']
        }
    },
    deleteMaterialReturnSlip: {
        inputs: {
            variableName: {
                type: 'Text'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteMaterialReturnSlipItems',
                connect: {
                    queryParams: {
                        'materialReturnSlip': ['input', 'variableName']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'function',
                exec: 'deleteMaterialReturnSlip',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            materialReturnSlip: ['c2', 'materialReturnSlip']
        }
    },
    createMaterialRequistionSlip: {
        inputs: {
            materialApprovalSlip: {
                type: 'MaterialApprovalSlip'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createMaterialRequistionSlip',
                connect: {
                    materialApprovalSlip: ['input', 'materialApprovalSlip']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createMaterialRequistionSlipItems',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        materialRequistionSlip: ['computation', 'c1', 'materialRequistionSlip']
                    }
                }
            }
        },
        outputs: {
            materialRequistionSlip: ['c1', 'materialRequistionSlip'],
            items: ['c2', '']
        }
    },
    deleteMaterialRequistionSlip: {
        inputs: {
            variableName: {
                type: 'Text'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteMaterialRequistionSlipItems',
                connect: {
                    queryParams: {
                        'materialRequistionSlip': ['input', 'variableName']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'function',
                exec: 'deleteMaterialRequistionSlip',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            materialRequistionSlip: ['c2', 'materialRequistionSlip']
        }
    },
    createBOM: {
        inputs: {
            variableName: {
                type: 'Text'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createBOM',
                connect: {
                    variableName: ['input', 'variableName']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createBOMItems',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        bom: ['computation', 'c1', 'bom']
                    }
                }
            }
        },
        outputs: {
            bom: ['c1', 'bom'],
            items: ['c2', '']
        }
    },
    deleteBOM: {
        inputs: {
            variableName: {
                type: 'Text'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteBOMItems',
                connect: {
                    queryParams: {
                        'bom': ['input', 'variableName']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'function',
                exec: 'deleteBOM',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            bom: ['c2', 'bom']
        }
    },
    createProductionPreparationSlip: {
        inputs: {
            bom: {
                type: 'BOM'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createProductionPreparationSlip',
                connect: {
                    bom: ['input', 'bom']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createProductionPreparationSlipItems',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        productionPreparationSlip: ['computation', 'c1', 'productionPreparationSlip']
                    }
                }
            }
        },
        outputs: {
            productionPreparationSlip: ['c1', 'productionPreparationSlip'],
            items: ['c2', '']
        }
    },
    deleteProductionPreparationSlip: {
        inputs: {
            variableName: {
                type: 'Text'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteProductionPreparationSlipItems',
                connect: {
                    queryParams: {
                        'productionPreparationSlip': ['input', 'variableName']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'function',
                exec: 'deleteProductionPreparationSlip',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            productionPreparationSlip: ['c2', 'productionPreparationSlip']
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
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createScrapMaterialSlip',
                connect: {
                    productionPreparationSlip: ['input', 'productionPreparationSlip'],
                    quantity: ['input', 'quantity']
                }
            }
        },
        outputs: {
            scrapMaterialSlip: ['c1', 'scrapMaterialSlip']
        }
    },
    deleteScrapMaterialSlip: {
        inputs: {
            variableName: {
                type: 'Text'
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'deleteScrapMaterialSlip',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            scrapMaterialSlip: ['c1', 'scrapMaterialSlip']
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
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createTransferMaterialSlip',
                connect: {
                    productionPreparationSlip: ['input', 'productionPreparationSlip'],
                    quantity: ['input', 'quantity']
                }
            }
        },
        outputs: {
            transferMaterialSlip: ['c1', 'transferMaterialSlip']
        }
    },
    deleteTransferMaterialSlip: {
        inputs: {
            variableName: {
                type: 'Text'
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'deleteTransferMaterialSlip',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            transferMaterialSlip: ['c1', 'transferMaterialSlip']
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
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createWarehouseAcceptanceSlip',
                connect: {
                    transferMaterialSlip: ['input', 'transferMaterialSlip'],
                    quantity: ['input', 'quantity']
                }
            }
        },
        outputs: {
            warehouseAcceptanceSlip: ['c1', 'warehouseAcceptanceSlip']
        }
    },
    deleteWarehouseAcceptanceSlip: {
        inputs: {
            variableName: {
                type: 'Text'
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'deleteWarehouseAcceptanceSlip',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            warehouseAcceptanceSlip: ['c1', 'warehouseAcceptanceSlip']
        }
    }
}
