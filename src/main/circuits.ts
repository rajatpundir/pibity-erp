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
    | 'createCompany'
    | 'deleteCompany'
    | 'createCompanyTagGroup'
    | 'deleteCompanyTagGroup'
    | 'createContact'
    | 'deleteContact'
    | 'createCurrency'
    | 'deleteCurrency'
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
    | 'createProductCategoryGroup'
    | 'deleteProductCategoryGroup'
    | 'createProductCategory'
    | 'deleteProductCategory'
    | 'createProduct'
    | 'deleteProduct'
    | 'createProductTagGroup'
    | 'deleteProductTagGroup'
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
                exec: 'createRegion',
                connect: {
                    name: ['input', 'name']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createCountry',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        region: ['computation', 'c1', 'variable']
                    }
                }
            }
        },
        outputs: {
            region: ['c1', 'variable'],
            countryList: ['c2', '']
        }
    },
    deleteRegion: {
        inputs: {
            id: {
                type: 'Region'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteCountry',
                connect: {
                    queryParams: {
                        region: ['input', 'id']
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
                    id: ['input', 'id']
                }
            }
        },
        outputs: {
            region: ['c2', 'variable']
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
                exec: 'createState',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        country: ['computation', 'c1', 'variable']
                    }
                }
            }
        },
        outputs: {
            country: ['c1', 'variable'],
            stateList: ['c2', '']
        }
    },
    deleteCountry: {
        inputs: {
            id: {
                type: 'Country'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteState',
                connect: {
                    queryParams: {
                        country: ['input', 'id']
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
                    id: ['input', 'id']
                }
            }
        },
        outputs: {
            country: ['c2', 'variable']
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
                exec: 'createDistrict',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        state: ['computation', 'c1', 'variable']
                    }
                }
            }
        },
        outputs: {
            state: ['c1', 'variable'],
            districtList: ['c2', '']
        }
    },
    deleteState: {
        inputs: {
            id: {
                type: 'State'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteDistrict',
                connect: {
                    queryParams: {
                        state: ['input', 'id']
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
                    id: ['input', 'id']
                }
            }
        },
        outputs: {
            state: ['c2', 'variable']
        }
    },
    createDistrict: {
        inputs: {
            state: {
                type: 'State'
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
                exec: 'createDistrict',
                connect: {
                    state: ['input', 'state'],
                    name: ['input', 'name']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createSubdistrict',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        district: ['computation', 'c1', 'variable']
                    }
                }
            }
        },
        outputs: {
            district: ['c1', 'variable'],
            subdistrictList: ['c2', '']
        }
    },
    deleteDistrict: {
        inputs: {
            id: {
                type: 'District'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteSubdistrict',
                connect: {
                    queryParams: {
                        'district': ['input', 'id']
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
                    id: ['input', 'id']
                }
            }
        },
        outputs: {
            district: ['c2', 'variable']
        }
    },
    createSubdistrict: {
        inputs: {
            district: {
                type: 'District'
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
                exec: 'createSubdistrict',
                connect: {
                    district: ['input', 'district'],
                    name: ['input', 'name']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createPostalCode',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        subdistrict: ['computation', 'c1', 'variable']
                    }
                }
            }
        },
        outputs: {
            subdistrict: ['c1', 'variable'],
            postalCodeList: ['c2', '']
        }
    },
    deleteSubdistrict: {
        inputs: {
            id: {
                type: 'Subdistrict'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deletePostalCode',
                connect: {
                    queryParams: {
                        subdistrict: ['input', 'id']
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
                    id: ['input', 'id']
                }
            }
        },
        outputs: {
            subdistrict: ['c2', 'variable']
        }
    },
    createPostalCode: {
        inputs: {
            subdistrict: {
                type: 'Subdistrict'
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
                exec: 'createPostalCode',
                connect: {
                    subdistrict: ['input', 'subdistrict'],
                    name: ['input', 'name']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createAddress',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        postalCode: ['computation', 'c1', 'variable']
                    }
                }
            }
        },
        outputs: {
            postalCode: ['c1', 'variable'],
            addressList: ['c2', '']
        }
    },
    deletePostalCode: {
        inputs: {
            id: {
                type: 'PostalCode'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteAddress',
                connect: {
                    queryParams: {
                        region: ['input', 'id']
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
                    id: ['input', 'id']
                }
            }
        },
        outputs: {
            postalCode: ['c2', 'variable']
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
            address: ['c1', 'variable']
        }
    },
    deleteAddress: {
        inputs: {
            id: {
                type: 'Address'
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'deleteAddress',
                connect: {
                    id: ['input', 'id']
                }
            }
        },
        outputs: {
            address: ['c1', 'variable']
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
            },
            addresses: {
                type: []
            },
            tags: {
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
                exec: 'createCompany',
                connect: {
                    name: ['input', 'name'],
                    email: ['input', 'email'],
                    telephone: ['input', 'telephone'],
                    mobile: ['input', 'mobile'],
                    website: ['input', 'website'],
                    gstin: ['input', 'gstin'],
                    pan: ['input', 'pan'],
                    iec: ['input', 'iec']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createCompanyAddress',
                connect: {
                    queryParams: {},
                    args: ['input', 'addresses'],
                    overrides: {
                        company: ['computation', 'c1', 'variable']
                    }
                }
            },
            c3: {
                order: 3,
                type: 'mapper',
                exec: 'createMappingCompanyTag',
                connect: {
                    queryParams: {},
                    args: ['input', 'tags'],
                    overrides: {
                        company: ['computation', 'c1', 'variable']
                    }
                }
            },
            c4: {
                order: 4,
                type: 'mapper',
                exec: 'createCompanyContact',
                connect: {
                    queryParams: {},
                    args: ['input', 'contacts'],
                    overrides: {
                        company: ['computation', 'c1', 'variable']
                    }
                }
            },
            c5: {
                order: 5,
                type: 'mapper',
                exec: 'createCompanyBankAccount',
                connect: {
                    queryParams: {},
                    args: ['input', 'bankAccounts'],
                    overrides: {
                        company: ['computation', 'c1', 'variable']
                    }
                }
            },
            c6: {
                order: 6,
                type: 'mapper',
                exec: 'createCompanyProduct',
                connect: {
                    queryParams: {},
                    args: ['input', 'products'],
                    overrides: {
                        company: ['computation', 'c1', 'variable']
                    }
                }
            }
        },
        outputs: {
            company: ['c1', 'variable'],
            companyAddressList: ['c2', ''],
            mappingCompanyTagList: ['c3', ''],
            companyContactList: ['c4', ''],
            companyBankAccountList: ['c5', ''],
            companyProductList: ['c6', '']
        }
    },
    deleteCompany: {
        inputs: {
            id: {
                type: 'Company'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteCompanyAddress',
                connect: {
                    queryParams: {
                        company: ['input', 'id']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'deleteMappingCompanyTag',
                connect: {
                    queryParams: {
                        company: ['input', 'id']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c3: {
                order: 3,
                type: 'mapper',
                exec: 'deleteCompanyContact',
                connect: {
                    queryParams: {
                        company: ['input', 'id']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c4: {
                order: 4,
                type: 'mapper',
                exec: 'deleteCompanyBankAccount',
                connect: {
                    queryParams: {
                        company: ['input', 'id']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c5: {
                order: 5,
                type: 'mapper',
                exec: 'deleteCompanyProduct',
                connect: {
                    queryParams: {
                        company: ['input', 'id']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c6: {
                order: 6,
                type: 'function',
                exec: 'deleteCompany',
                connect: {
                    id: ['input', 'id']
                }
            }
        },
        outputs: {
            company: ['c6', 'variable']
        }
    },
    createCompanyTagGroup: {
        inputs: {
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
                exec: 'createCompanyTagGroup',
                connect: {
                    name: ['input', 'name']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createCompanyTag',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        group: ['computation', 'c1', 'variable']
                    }
                }
            }
        },
        outputs: {
            companyTagGroup: ['c1', 'variable'],
            companyTagList: ['c2', '']
        }
    },
    deleteCompanyTagGroup: {
        inputs: {
            id: {
                type: 'CompanyTagGroup'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteCompanyTag',
                connect: {
                    queryParams: {
                        group: ['input', 'id']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'function',
                exec: 'deleteCompanyTagGroup',
                connect: {
                    id: ['input', 'id']
                }
            }
        },
        outputs: {
            companyTagGroup: ['c2', 'variable']
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
            },
            addresses: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createContact',
                connect: {
                    name: ['input', 'name'],
                    email: ['input', 'email'],
                    telephone: ['input', 'telephone'],
                    mobile: ['input', 'mobile'],
                    website: ['input', 'website']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createContactAddress',
                connect: {
                    queryParams: {},
                    args: ['input', 'addresses'],
                    overrides: {
                        contact: ['computation', 'c1', 'variable']
                    }
                }
            }
        },
        outputs: {
            contact: ['c1', 'variable'],
            contactAddressList: ['c2', '']
        }
    },
    deleteContact: {
        inputs: {
            id: {
                type: 'Contact'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteContactAddress',
                connect: {
                    queryParams: {
                        contact: ['input', 'id']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'function',
                exec: 'deleteContact',
                connect: {
                    id: ['input', 'id']
                }
            }
        },
        outputs: {
            contact: ['c2', 'variable']
        }
    },
    createCurrency: {
        inputs: {
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
                exec: 'createCurrency',
                connect: {
                    name: ['input', 'name']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createCurrencyRate',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        currency: ['computation', 'c1', 'variable']
                    }
                }
            }
        },
        outputs: {
            currency: ['c1', 'variable'],
            currencyRatList: ['c2', '']
        }
    },
    deleteCurrency: {
        inputs: {
            id: {
                type: 'Currency'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteCurrencyRate',
                connect: {
                    queryParams: {
                        currency: ['input', 'id']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'function',
                exec: 'deleteCurrency',
                connect: {
                    id: ['input', 'id']
                }
            }
        },
        outputs: {
            currency: ['c2', 'variable']
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
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createMemo',
                connect: {
                    company: ['input', 'company'],
                    currency: ['input', 'currency'],
                    amount: ['input', 'amount'],
                    unsettled: ['input', 'unsettled']
                }
            }
        },
        outputs: {
            memo: ['c1', 'variable']
        }
    },
    deleteMemo: {
        inputs: {
            id: {
                type: 'Memo'
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'deleteMemo',
                connect: {
                    id: ['input', 'id']
                }
            }
        },
        outputs: {
            memo: ['c1', 'variable']
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
                    country: ['input', 'country'],
                    name: ['input', 'name'],
                    website: ['input', 'website']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createBankBranch',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        bank: ['computation', 'c1', 'variable']
                    }
                }
            }
        },
        outputs: {
            bank: ['c1', 'variable'],
            bankBranchList: ['c2', '']
        }
    },
    deleteBank: {
        inputs: {
            id: {
                type: 'Bank'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteBankBranch',
                connect: {
                    queryParams: {
                        bank: ['input', 'id']
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
                    id: ['input', 'id']
                }
            }
        },
        outputs: {
            bank: ['c2', 'variable']
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
                    bank: ['input', 'bank'],
                    name: ['input', 'name'],
                    ifsc: ['input', 'ifsc'],
                    address: ['input', 'address']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createBankAccount',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        bank: ['input', 'bank'],
                        bankBranch: ['computation', 'c1', 'variable']
                    }
                }
            }
        },
        outputs: {
            bankBranch: ['c1', 'variable'],
            bankAccountList: ['c2', '']
        }
    },
    deleteBankBranch: {
        inputs: {
            id: {
                type: 'BankBranch'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteBankAccount',
                connect: {
                    queryParams: {
                        bankBranch: ['input', 'id']
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
                    id: ['input', 'id']
                }
            }
        },
        outputs: {
            bankBranch: ['c2', 'variable']
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
            },
            companies: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createBankAccount',
                connect: {
                    bank: ['input', 'bank'],
                    bankBranch: ['input', 'bankBranch'],
                    accountNumber: ['input', 'accountNumber'],
                    accountName: ['input', 'accountName'],
                    currency: ['input', 'currency']
                }
            },
            c2: {
                order: 3,
                type: 'mapper',
                exec: 'createBankAccountCompany',
                connect: {
                    queryParams: {},
                    args: ['input', 'companies'],
                    overrides: {
                        bankAccount: ['computation', 'c1', 'variable']
                    }
                }
            }
        },
        outputs: {
            bankAccount: ['c1', 'variable'],
            bankAccountCompanyList: ['c2', '']
        }
    },
    deleteBankAccount: {
        inputs: {
            id: {
                type: 'BankAccount'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 2,
                type: 'mapper',
                exec: 'deleteBankAccountCompany',
                connect: {
                    queryParams: {
                        'bankAccount': ['input', 'id']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'function',
                exec: 'deleteBankAccount',
                connect: {
                    id: ['input', 'id']
                }
            }
        },
        outputs: {
            bankAccount: ['c2', 'variable']
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
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createBankTransaction',
                connect: {
                    timestamp: ['input', 'timestamp'],
                    memo: ['input', 'memo'],
                    currencyRate: ['input', 'currencyRate'],
                    bankAccount: ['input', 'bankAccount'],
                    fromToAccount: ['input', 'fromToAccount'],
                    credit: ['input', 'credit'],
                    debit: ['input', 'debit']
                }
            }
        },
        outputs: {
            bankTransaction: ['c1', 'variable']
        }
    },
    deleteBankTransaction: {
        inputs: {
            id: {
                type: 'BankTransaction'
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'deleteBankTransaction',
                connect: {
                    id: ['input', 'id']
                }
            }
        },
        outputs: {
            bankTransaction: ['c1', 'variable']
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
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createProductCategoryGroup',
                connect: {
                    parent: ['input', 'parent'],
                    name: ['input', 'name'],
                    length: ['input', 'length']
                }
            }
        },
        outputs: {
            productCategoryGroup: ['c1', 'variable']
        }
    },
    deleteProductCategoryGroup: {
        inputs: {
            id: {
                type: 'ProductCategoryGroup'
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'deleteProductCategoryGroup',
                connect: {
                    id: ['input', 'id']
                }
            }
        },
        outputs: {
            productCategoryGroup: ['c1', 'variable']
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
            derivedCode: {
                type: 'Text'
            },
            childCount: {
                type: 'Number'
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createProductCategory',
                connect: {
                    parent: ['input', 'parent'],
                    group: ['input', 'group'],
                    name: ['input', 'name'],
                    code: ['input', 'code'],
                    derivedCode: ['input', 'derivedCode'],
                    childCount: ['input', 'childCount']
                }
            }
        },
        outputs: {
            productCategory: ['c1', 'variable']
        }
    },
    deleteProductCategory: {
        inputs: {
            id: {
                type: 'ProductCategory'
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'deleteProductCategory',
                connect: {
                    id: ['input', 'id']
                }
            }
        },
        outputs: {
            productCategory: ['c1', 'variable']
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
            },
            sku: {
                type: 'Text'
            },
            uoms: {
                type: []
            },
            companies: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createProduct',
                connect: {
                    name: ['input', 'name'],
                    category: ['input', 'category'],
                    code: ['input', 'code'],
                    sku: ['input', 'sku']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createUOM',
                connect: {
                    queryParams: {},
                    args: ['input', 'uoms'],
                    overrides: {
                        product: ['computation', 'c1', 'variable']
                    }
                }
            },
            c3: {
                order: 3,
                type: 'mapper',
                exec: 'createProductCompany',
                connect: {
                    queryParams: {},
                    args: ['input', 'companies'],
                    overrides: {
                        product: ['computation', 'c1', 'variable']
                    }
                }
            },
            c4: {
                order: 4,
                type: 'mapper',
                exec: 'createMappingProductTag',
                connect: {
                    queryParams: {},
                    args: ['input', 'tags'],
                    overrides: {
                        product: ['computation', 'c1', 'variable']
                    }
                }
            }
        },
        outputs: {
            product: ['c1', 'variable'],
            uomList: ['c2', ''],
            createproductCompanyList: ['c3', ''],
            mappingProductTagList: ['c4', '']
        }
    },
    deleteProduct: {
        inputs: {
            id: {
                type: 'Product'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteUOM',
                connect: {
                    queryParams: {
                        'product': ['input', 'id']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'deleteProductCompany',
                connect: {
                    queryParams: {
                        'product': ['input', 'id']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c3: {
                order: 3,
                type: 'mapper',
                exec: 'deleteMappingProductTag',
                connect: {
                    queryParams: {
                        company: ['input', 'id']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c4: {
                order: 4,
                type: 'function',
                exec: 'deleteProduct',
                connect: {
                    id: ['input', 'id']
                }
            }
        },
        outputs: {
            product: ['c3', 'variable']
        }
    },
    createProductTagGroup: {
        inputs: {
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
                exec: 'createProductTagGroup',
                connect: {
                    name: ['input', 'name']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createProductTag',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        group: ['computation', 'c1', 'variable']
                    }
                }
            }
        },
        outputs: {
            productTagGroup: ['c1', 'variable'],
            productTagList: ['c2', '']
        }
    },
    deleteProductTagGroup: {
        inputs: {
            id: {
                type: 'ProductTagGroup'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteProductTag',
                connect: {
                    queryParams: {
                        group: ['input', 'id']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'function',
                exec: 'deleteProductTagGroup',
                connect: {
                    id: ['input', 'id']
                }
            }
        },
        outputs: {
            productTagGroup: ['c2', 'variable']
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
                exec: 'createIndentItem',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        indent: ['computation', 'c1', 'variable']
                    }
                }
            }
        },
        outputs: {
            indent: ['c1', 'variable'],
            indentItemList: ['c2', '']
        }
    },
    deleteIndent: {
        inputs: {
            id: {
                type: 'Indent'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteIndentItem',
                connect: {
                    queryParams: {
                        'indent': ['input', 'id']
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
                    id: ['input', 'id']
                }
            }
        },
        outputs: {
            indent: ['c2', 'variable']
        }
    },
    createQuotation: {
        inputs: {
            indent: {
                type: 'Indent'
            },
            company: {
                type: 'Company'
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
                    company: ['input', 'company']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createQuotationItem',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        quotation: ['computation', 'c1', 'variable']
                    }
                }
            }
        },
        outputs: {
            quotation: ['c1', 'variable'],
            quotationItemList: ['c2', '']
        }
    },
    deleteQuotation: {
        inputs: {
            id: {
                type: 'Quotation'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteQuotationItem',
                connect: {
                    queryParams: {
                        'quotation': ['input', 'id']
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
                    id: ['input', 'id']
                }
            }
        },
        outputs: {
            quotation: ['c2', 'variable']
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
                exec: 'createPurchaseOrderItem',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        purchaseOrder: ['computation', 'c1', 'variable']
                    }
                }
            }
        },
        outputs: {
            purchaseOrder: ['c1', 'variable'],
            purchaseOrderItemList: ['c2', '']
        }
    },
    deletePurchaseOrder: {
        inputs: {
            id: {
                type: 'PurchaseOrder'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deletePurchaseOrderItem',
                connect: {
                    queryParams: {
                        'purchaseOrder': ['input', 'id']
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
                    id: ['input', 'id']
                }
            }
        },
        outputs: {
            purchaseOrder: ['c2', 'variable']
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
                exec: 'createPurchaseInvoiceItem',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        purchaseInvoice: ['computation', 'c1', 'variable']
                    }
                }
            }
        },
        outputs: {
            purchaseInvoice: ['c1', 'variable'],
            purchaseInvoiceItemList: ['c2', '']
        }
    },
    deletePurchaseInvoice: {
        inputs: {
            id: {
                type: 'PurchaseInvoice'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deletePurchaseInvoiceItem',
                connect: {
                    queryParams: {
                        'purchaseInvoice': ['input', 'id']
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
                    id: ['input', 'id']
                }
            }
        },
        outputs: {
            purchaseInvoice: ['c2', 'variable']
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
                exec: 'createMaterialApprovalSlipItem',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        materialApprovalSlip: ['computation', 'c1', 'variable']
                    }
                }
            }
        },
        outputs: {
            materialApprovalSlip: ['c1', 'variable'],
            materialApprovalSlipItemList: ['c2', '']
        }
    },
    deleteMaterialApprovalSlip: {
        inputs: {
            id: {
                type: 'MaterialApprovalSlip'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteMaterialApprovalSlipItem',
                connect: {
                    queryParams: {
                        'materialApprovalSlip': ['input', 'id']
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
                    id: ['input', 'id']
                }
            }
        },
        outputs: {
            materialApprovalSlip: ['c2', 'variable']
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
                exec: 'createMaterialRejectionSlipItem',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        materialRejectionSlip: ['computation', 'c1', 'variable']
                    }
                }
            }
        },
        outputs: {
            materialRejectionSlip: ['c1', 'variable'],
            materialRejectionSlipItemList: ['c2', '']
        }
    },
    deleteMaterialRejectionSlip: {
        inputs: {
            id: {
                type: 'MaterialRejectionSlip'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteMaterialRejectionSlipItem',
                connect: {
                    queryParams: {
                        'materialRejectionSlip': ['input', 'id']
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
                    id: ['input', 'id']
                }
            }
        },
        outputs: {
            materialRejectionSlip: ['c2', 'variable']
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
                exec: 'createMaterialReturnSlipItem',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        materialReturnSlip: ['computation', 'c1', 'variable']
                    }
                }
            }
        },
        outputs: {
            materialReturnSlip: ['c1', 'variable'],
            materialReturnSlipItemList: ['c2', '']
        }
    },
    deleteMaterialReturnSlip: {
        inputs: {
            id: {
                type: 'MaterialReturnSlip'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteMaterialReturnSlipItem',
                connect: {
                    queryParams: {
                        'materialReturnSlip': ['input', 'id']
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
                    id: ['input', 'id']
                }
            }
        },
        outputs: {
            materialReturnSlip: ['c2', 'variable']
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
                exec: 'createMaterialRequistionSlipItem',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        materialRequistionSlip: ['computation', 'c1', 'variable']
                    }
                }
            }
        },
        outputs: {
            materialRequistionSlip: ['c1', 'variable'],
            materialRequistionSlipItemList: ['c2', '']
        }
    },
    deleteMaterialRequistionSlip: {
        inputs: {
            id: {
                type: 'MaterialRequistionSlip'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteMaterialRequistionSlipItem',
                connect: {
                    queryParams: {
                        'materialRequistionSlip': ['input', 'id']
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
                    id: ['input', 'id']
                }
            }
        },
        outputs: {
            materialRequistionSlip: ['c2', 'variable']
        }
    },
    createBOM: {
        inputs: {
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
                exec: 'createBOM',
                connect: {
                    name: ['input', 'name']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createBOMItem',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        bom: ['computation', 'c1', 'variable']
                    }
                }
            }
        },
        outputs: {
            bom: ['c1', 'variable'],
            bomItemList: ['c2', '']
        }
    },
    deleteBOM: {
        inputs: {
            id: {
                type: 'BOM'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteBOMItem',
                connect: {
                    queryParams: {
                        'bom': ['input', 'id']
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
                    id: ['input', 'id']
                }
            }
        },
        outputs: {
            bom: ['c2', 'variable']
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
                exec: 'createProductionPreparationSlipItem',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        productionPreparationSlip: ['computation', 'c1', 'variable']
                    }
                }
            }
        },
        outputs: {
            productionPreparationSlip: ['c1', 'variable'],
            productionPreparationSlipItemList: ['c2', '']
        }
    },
    deleteProductionPreparationSlip: {
        inputs: {
            id: {
                type: 'ProductionPreparationSlip'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteProductionPreparationSlipItem',
                connect: {
                    queryParams: {
                        'productionPreparationSlip': ['input', 'id']
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
                    id: ['input', 'id']
                }
            }
        },
        outputs: {
            productionPreparationSlip: ['c2', 'variable']
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
            scrapMaterialSlip: ['c1', 'variable']
        }
    },
    deleteScrapMaterialSlip: {
        inputs: {
            id: {
                type: 'ScrapMaterialSlip'
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'deleteScrapMaterialSlip',
                connect: {
                    id: ['input', 'id']
                }
            }
        },
        outputs: {
            scrapMaterialSlip: ['c1', 'variable']
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
            transferMaterialSlip: ['c1', 'variable']
        }
    },
    deleteTransferMaterialSlip: {
        inputs: {
            id: {
                type: 'TransferMaterialSlip'
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'deleteTransferMaterialSlip',
                connect: {
                    id: ['input', 'id']
                }
            }
        },
        outputs: {
            transferMaterialSlip: ['c1', 'variable']
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
            warehouseAcceptanceSlip: ['c1', 'variable']
        }
    },
    deleteWarehouseAcceptanceSlip: {
        inputs: {
            id: {
                type: 'WarehouseAcceptanceSlip'
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'deleteWarehouseAcceptanceSlip',
                connect: {
                    id: ['input', 'id']
                }
            }
        },
        outputs: {
            warehouseAcceptanceSlip: ['c1', 'variable']
        }
    }
}
