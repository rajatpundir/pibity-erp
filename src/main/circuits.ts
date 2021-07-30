import { Circuit } from "./circuit"

export type CircuitName = 
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

export const circuits: Record<CircuitName, Circuit> = {
    createRegion: {
        inputs: {
            name: {
                type: 'Text'
            },
            countryList: {
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
                exec: 'createCountryForRegion',
                connect: {
                    queryParams: {},
                    args: ['input', 'countryList'],
                    overrides: {
                        "region": ['computation', 'c1', 'variable']
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
                exec: 'deleteCountryForRegion',
                connect: {
                    queryParams: {
                        "region": ['input', 'id']
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
            stateTypeList: {
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
                exec: 'createStateTypeForCountry',
                connect: {
                    queryParams: {},
                    args: ['input', 'stateTypeList'],
                    overrides: {
                        "country": ['computation', 'c1', 'variable']
                    }
                }
            }
        },
        outputs: {
            country: ['c1', 'variable'],
            stateTypeList: ['c2', '']
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
                exec: 'deleteStateTypeForCountry',
                connect: {
                    queryParams: {
                        "country": ['input', 'id']
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
    createStateType: {
        inputs: {
            country: {
                type: 'Country'
            },
            name: {
                type: 'Text'
            },
            districtList: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createStateType',
                connect: {
                    country: ['input', 'country'],
                    name: ['input', 'name']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createDistrictForStateType',
                connect: {
                    queryParams: {},
                    args: ['input', 'districtList'],
                    overrides: {
                        "state": ['computation', 'c1', 'variable']
                    }
                }
            }
        },
        outputs: {
            stateType: ['c1', 'variable'],
            districtList: ['c2', '']
        }
    },
    deleteStateType: {
        inputs: {
            id: {
                type: 'StateType'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteDistrictForStateType',
                connect: {
                    queryParams: {
                        "state": ['input', 'id']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'function',
                exec: 'deleteStateType',
                connect: {
                    id: ['input', 'id']
                }
            }
        },
        outputs: {
            stateType: ['c2', 'variable']
        }
    },
    createDistrict: {
        inputs: {
            state: {
                type: 'StateType'
            },
            name: {
                type: 'Text'
            },
            subdistrictList: {
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
                exec: 'createSubdistrictForDistrict',
                connect: {
                    queryParams: {},
                    args: ['input', 'subdistrictList'],
                    overrides: {
                        "district": ['computation', 'c1', 'variable']
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
                exec: 'deleteSubdistrictForDistrict',
                connect: {
                    queryParams: {
                        "district": ['input', 'id']
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
            postalCodeList: {
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
                exec: 'createPostalCodeForSubdistrict',
                connect: {
                    queryParams: {},
                    args: ['input', 'postalCodeList'],
                    overrides: {
                        "subdistrict": ['computation', 'c1', 'variable']
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
                exec: 'deletePostalCodeForSubdistrict',
                connect: {
                    queryParams: {
                        "subdistrict": ['input', 'id']
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
            addressList: {
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
                exec: 'createAddressForPostalCode',
                connect: {
                    queryParams: {},
                    args: ['input', 'addressList'],
                    overrides: {
                        "postalCode": ['computation', 'c1', 'variable']
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
                exec: 'deleteAddressForPostalCode',
                connect: {
                    queryParams: {
                        "postalCode": ['input', 'id']
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
                type: 'Number'
            },
            longitude: {
                type: 'Number'
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
            },
            items: {
                type: []
            }
        },
        computations: {
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
            companyAddressList: {
                type: []
            },
            mappingCompanyTagList: {
                type: []
            },
            companyContactList: {
                type: []
            },
            memoList: {
                type: []
            },
            companyBankAccountList: {
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
                exec: 'createCompanyAddressForCompany',
                connect: {
                    queryParams: {},
                    args: ['input', 'companyAddressList'],
                    overrides: {
                        "company": ['computation', 'c1', 'variable']
                    }
                }
            },
            c3: {
                order: 3,
                type: 'mapper',
                exec: 'createMappingCompanyTagForCompany',
                connect: {
                    queryParams: {},
                    args: ['input', 'mappingCompanyTagList'],
                    overrides: {
                        "company": ['computation', 'c1', 'variable']
                    }
                }
            },
            c4: {
                order: 4,
                type: 'mapper',
                exec: 'createCompanyContactForCompany',
                connect: {
                    queryParams: {},
                    args: ['input', 'companyContactList'],
                    overrides: {
                        "company": ['computation', 'c1', 'variable']
                    }
                }
            },
            c5: {
                order: 5,
                type: 'mapper',
                exec: 'createMemoForCompany',
                connect: {
                    queryParams: {},
                    args: ['input', 'memoList'],
                    overrides: {
                        "company": ['computation', 'c1', 'variable']
                    }
                }
            },
            c6: {
                order: 6,
                type: 'mapper',
                exec: 'createCompanyBankAccountForCompany',
                connect: {
                    queryParams: {},
                    args: ['input', 'companyBankAccountList'],
                    overrides: {
                        "company": ['computation', 'c1', 'variable']
                    }
                }
            }
        },
        outputs: {
            company: ['c1', 'variable'],
            companyAddressList: ['c2', ''],
            mappingCompanyTagList: ['c3', ''],
            companyContactList: ['c4', ''],
            memoList: ['c5', ''],
            companyBankAccountList: ['c6', '']
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
                exec: 'deleteCompanyAddressForCompany',
                connect: {
                    queryParams: {
                        "company": ['input', 'id']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'deleteMappingCompanyTagForCompany',
                connect: {
                    queryParams: {
                        "company": ['input', 'id']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c3: {
                order: 3,
                type: 'mapper',
                exec: 'deleteCompanyContactForCompany',
                connect: {
                    queryParams: {
                        "company": ['input', 'id']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c4: {
                order: 4,
                type: 'mapper',
                exec: 'deleteMemoForCompany',
                connect: {
                    queryParams: {
                        "company": ['input', 'id']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c5: {
                order: 5,
                type: 'mapper',
                exec: 'deleteCompanyBankAccountForCompany',
                connect: {
                    queryParams: {
                        "company": ['input', 'id']
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
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createCompanyAddress',
                connect: {
                    company: ['input', 'company'],
                    name: ['input', 'name'],
                    address: ['input', 'address']
                }
            }
        },
        outputs: {
            companyAddress: ['c1', 'variable']
        }
    },
    deleteCompanyAddress: {
        inputs: {
            id: {
                type: 'CompanyAddress'
            },
            items: {
                type: []
            }
        },
        computations: {
        },
        outputs: {
            companyAddress: ['c1', 'variable']
        }
    },
    createCompanyTagGroup: {
        inputs: {
            name: {
                type: 'Text'
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
            }
        },
        outputs: {
            companyTagGroup: ['c1', 'variable']
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
        },
        outputs: {
            companyTagGroup: ['c1', 'variable']
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
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createCompanyTag',
                connect: {
                    group: ['input', 'group'],
                    name: ['input', 'name']
                }
            }
        },
        outputs: {
            companyTag: ['c1', 'variable']
        }
    },
    deleteCompanyTag: {
        inputs: {
            id: {
                type: 'CompanyTag'
            },
            items: {
                type: []
            }
        },
        computations: {
        },
        outputs: {
            companyTag: ['c1', 'variable']
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
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createMappingCompanyTag',
                connect: {
                    company: ['input', 'company'],
                    tag: ['input', 'tag']
                }
            }
        },
        outputs: {
            mappingCompanyTag: ['c1', 'variable']
        }
    },
    deleteMappingCompanyTag: {
        inputs: {
            id: {
                type: 'MappingCompanyTag'
            },
            items: {
                type: []
            }
        },
        computations: {
        },
        outputs: {
            mappingCompanyTag: ['c1', 'variable']
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
            contactAddressList: {
                type: []
            },
            companyContactList: {
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
                exec: 'createContactAddressForContact',
                connect: {
                    queryParams: {},
                    args: ['input', 'contactAddressList'],
                    overrides: {
                        "contact": ['computation', 'c1', 'variable']
                    }
                }
            },
            c3: {
                order: 3,
                type: 'mapper',
                exec: 'createCompanyContactForContact',
                connect: {
                    queryParams: {},
                    args: ['input', 'companyContactList'],
                    overrides: {
                        "contact": ['computation', 'c1', 'variable']
                    }
                }
            }
        },
        outputs: {
            contact: ['c1', 'variable'],
            contactAddressList: ['c2', ''],
            companyContactList: ['c3', '']
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
                exec: 'deleteContactAddressForContact',
                connect: {
                    queryParams: {
                        "contact": ['input', 'id']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'deleteCompanyContactForContact',
                connect: {
                    queryParams: {
                        "contact": ['input', 'id']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c3: {
                order: 3,
                type: 'function',
                exec: 'deleteContact',
                connect: {
                    id: ['input', 'id']
                }
            }
        },
        outputs: {
            contact: ['c3', 'variable']
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
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createContactAddress',
                connect: {
                    contact: ['input', 'contact'],
                    name: ['input', 'name'],
                    address: ['input', 'address']
                }
            }
        },
        outputs: {
            contactAddress: ['c1', 'variable']
        }
    },
    deleteContactAddress: {
        inputs: {
            id: {
                type: 'ContactAddress'
            },
            items: {
                type: []
            }
        },
        computations: {
        },
        outputs: {
            contactAddress: ['c1', 'variable']
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
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createCompanyContact',
                connect: {
                    company: ['input', 'company'],
                    contact: ['input', 'contact'],
                    role: ['input', 'role'],
                    email: ['input', 'email'],
                    telephone: ['input', 'telephone'],
                    mobile: ['input', 'mobile']
                }
            }
        },
        outputs: {
            companyContact: ['c1', 'variable']
        }
    },
    deleteCompanyContact: {
        inputs: {
            id: {
                type: 'CompanyContact'
            },
            items: {
                type: []
            }
        },
        computations: {
        },
        outputs: {
            companyContact: ['c1', 'variable']
        }
    },
    createCurrency: {
        inputs: {
            name: {
                type: 'Text'
            },
            currencyRateList: {
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
                exec: 'createCurrencyRateForCurrency',
                connect: {
                    queryParams: {},
                    args: ['input', 'currencyRateList'],
                    overrides: {
                        "currency": ['computation', 'c1', 'variable']
                    }
                }
            }
        },
        outputs: {
            currency: ['c1', 'variable'],
            currencyRateList: ['c2', '']
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
                exec: 'deleteCurrencyRateForCurrency',
                connect: {
                    queryParams: {
                        "currency": ['input', 'id']
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
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createCurrencyRate',
                connect: {
                    currency: ['input', 'currency'],
                    conversionRate: ['input', 'conversionRate'],
                    startTime: ['input', 'startTime'],
                    endTime: ['input', 'endTime']
                }
            }
        },
        outputs: {
            currencyRate: ['c1', 'variable']
        }
    },
    deleteCurrencyRate: {
        inputs: {
            id: {
                type: 'CurrencyRate'
            },
            items: {
                type: []
            }
        },
        computations: {
        },
        outputs: {
            currencyRate: ['c1', 'variable']
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
            },
            items: {
                type: []
            }
        },
        computations: {
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
            bankBranchList: {
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
                exec: 'createBankBranchForBank',
                connect: {
                    queryParams: {},
                    args: ['input', 'bankBranchList'],
                    overrides: {
                        "bank": ['computation', 'c1', 'variable']
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
                exec: 'deleteBankBranchForBank',
                connect: {
                    queryParams: {
                        "bank": ['input', 'id']
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
            bankAccountList: {
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
                exec: 'createBankAccountForBankBranch',
                connect: {
                    queryParams: {},
                    args: ['input', 'bankAccountList'],
                    overrides: {
                        "bankBranch": ['computation', 'c1', 'variable']
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
                exec: 'deleteBankAccountForBankBranch',
                connect: {
                    queryParams: {
                        "bankBranch": ['input', 'id']
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
            bankTransactionList: {
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
                order: 2,
                type: 'mapper',
                exec: 'createBankTransactionForBankAccount',
                connect: {
                    queryParams: {},
                    args: ['input', 'bankTransactionList'],
                    overrides: {
                        "bankAccount": ['computation', 'c1', 'variable']
                    }
                }
            }
        },
        outputs: {
            bankAccount: ['c1', 'variable'],
            bankTransactionList: ['c2', '']
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
                order: 1,
                type: 'mapper',
                exec: 'deleteBankTransactionForBankAccount',
                connect: {
                    queryParams: {
                        "bankAccount": ['input', 'id']
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
            },
            items: {
                type: []
            }
        },
        computations: {
        },
        outputs: {
            bankTransaction: ['c1', 'variable']
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
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createCompanyBankAccount',
                connect: {
                    company: ['input', 'company'],
                    bankAccount: ['input', 'bankAccount']
                }
            }
        },
        outputs: {
            companyBankAccount: ['c1', 'variable']
        }
    },
    deleteCompanyBankAccount: {
        inputs: {
            id: {
                type: 'CompanyBankAccount'
            },
            items: {
                type: []
            }
        },
        computations: {
        },
        outputs: {
            companyBankAccount: ['c1', 'variable']
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
            },
            productCategoryList: {
                type: []
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
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createProductCategoryForProductCategoryGroup',
                connect: {
                    queryParams: {},
                    args: ['input', 'productCategoryList'],
                    overrides: {
                        "group": ['computation', 'c1', 'variable']
                    }
                }
            }
        },
        outputs: {
            productCategoryGroup: ['c1', 'variable'],
            productCategoryList: ['c2', '']
        }
    },
    deleteProductCategoryGroup: {
        inputs: {
            id: {
                type: 'ProductCategoryGroup'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteProductCategoryForProductCategoryGroup',
                connect: {
                    queryParams: {
                        "group": ['input', 'id']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'function',
                exec: 'deleteProductCategoryGroup',
                connect: {
                    id: ['input', 'id']
                }
            }
        },
        outputs: {
            productCategoryGroup: ['c2', 'variable']
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
            },
            productCategoryList: {
                type: []
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
                    childCount: ['input', 'childCount']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createProductCategoryForProductCategory',
                connect: {
                    queryParams: {},
                    args: ['input', 'productCategoryList'],
                    overrides: {
                        "parent": ['computation', 'c1', 'variable']
                    }
                }
            }
        },
        outputs: {
            productCategory: ['c1', 'variable'],
            productCategoryList: ['c2', '']
        }
    },
    deleteProductCategory: {
        inputs: {
            id: {
                type: 'ProductCategory'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteProductCategoryForProductCategory',
                connect: {
                    queryParams: {
                        "parent": ['input', 'id']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'function',
                exec: 'deleteProductCategory',
                connect: {
                    id: ['input', 'id']
                }
            }
        },
        outputs: {
            productCategory: ['c2', 'variable']
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
            companyProductList: {
                type: []
            },
            mappingProductTagList: {
                type: []
            },
            uomList: {
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
                    code: ['input', 'code']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createCompanyProductForProduct',
                connect: {
                    queryParams: {},
                    args: ['input', 'companyProductList'],
                    overrides: {
                        "company": ['computation', 'c1', 'variable']
                    }
                }
            },
            c3: {
                order: 3,
                type: 'mapper',
                exec: 'createMappingProductTagForProduct',
                connect: {
                    queryParams: {},
                    args: ['input', 'mappingProductTagList'],
                    overrides: {
                        "product": ['computation', 'c1', 'variable']
                    }
                }
            },
            c4: {
                order: 4,
                type: 'mapper',
                exec: 'createUomForProduct',
                connect: {
                    queryParams: {},
                    args: ['input', 'uomList'],
                    overrides: {
                        "product": ['computation', 'c1', 'variable']
                    }
                }
            }
        },
        outputs: {
            product: ['c1', 'variable'],
            companyProductList: ['c2', ''],
            mappingProductTagList: ['c3', ''],
            uomList: ['c4', '']
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
                exec: 'deleteCompanyProductForProduct',
                connect: {
                    queryParams: {
                        "company": ['input', 'id']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'deleteMappingProductTagForProduct',
                connect: {
                    queryParams: {
                        "product": ['input', 'id']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c3: {
                order: 3,
                type: 'mapper',
                exec: 'deleteUomForProduct',
                connect: {
                    queryParams: {
                        "product": ['input', 'id']
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
            product: ['c4', 'variable']
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
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createCompanyProduct',
                connect: {
                    company: ['input', 'company'],
                    product: ['input', 'product']
                }
            }
        },
        outputs: {
            companyProduct: ['c1', 'variable']
        }
    },
    deleteCompanyProduct: {
        inputs: {
            id: {
                type: 'CompanyProduct'
            },
            items: {
                type: []
            }
        },
        computations: {
        },
        outputs: {
            companyProduct: ['c1', 'variable']
        }
    },
    createProductTagGroup: {
        inputs: {
            name: {
                type: 'Text'
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
            }
        },
        outputs: {
            productTagGroup: ['c1', 'variable']
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
        },
        outputs: {
            productTagGroup: ['c1', 'variable']
        }
    },
    createProductTag: {
        inputs: {
            group: {
                type: 'ProductTagGroup'
            },
            name: {
                type: 'Text'
            },
            mappingProductTagList: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createProductTag',
                connect: {
                    group: ['input', 'group'],
                    name: ['input', 'name']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createMappingProductTagForProductTag',
                connect: {
                    queryParams: {},
                    args: ['input', 'mappingProductTagList'],
                    overrides: {
                        "tag": ['computation', 'c1', 'variable']
                    }
                }
            }
        },
        outputs: {
            productTag: ['c1', 'variable'],
            mappingProductTagList: ['c2', '']
        }
    },
    deleteProductTag: {
        inputs: {
            id: {
                type: 'ProductTag'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteMappingProductTagForProductTag',
                connect: {
                    queryParams: {
                        "tag": ['input', 'id']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'function',
                exec: 'deleteProductTag',
                connect: {
                    id: ['input', 'id']
                }
            }
        },
        outputs: {
            productTag: ['c2', 'variable']
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
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createMappingProductTag',
                connect: {
                    product: ['input', 'product'],
                    tag: ['input', 'tag']
                }
            }
        },
        outputs: {
            mappingProductTag: ['c1', 'variable']
        }
    },
    deleteMappingProductTag: {
        inputs: {
            id: {
                type: 'MappingProductTag'
            },
            items: {
                type: []
            }
        },
        computations: {
        },
        outputs: {
            mappingProductTag: ['c1', 'variable']
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
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createUom',
                connect: {
                    product: ['input', 'product'],
                    name: ['input', 'name'],
                    conversionRate: ['input', 'conversionRate']
                }
            }
        },
        outputs: {
            uom: ['c1', 'variable']
        }
    },
    deleteUom: {
        inputs: {
            id: {
                type: 'Uom'
            },
            items: {
                type: []
            }
        },
        computations: {
        },
        outputs: {
            uom: ['c1', 'variable']
        }
    },
    createIndent: {
        inputs: {
            indentItemList: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createIndent',
                connect: {                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createIndentItemForIndent',
                connect: {
                    queryParams: {},
                    args: ['input', 'indentItemList'],
                    overrides: {
                        "indent": ['computation', 'c1', 'variable']
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
                exec: 'deleteIndentItemForIndent',
                connect: {
                    queryParams: {
                        "indent": ['input', 'id']
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
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createIndentItem',
                connect: {
                    indent: ['input', 'indent'],
                    product: ['input', 'product'],
                    quantity: ['input', 'quantity'],
                    uom: ['input', 'uom'],
                    ordered: ['input', 'ordered'],
                    received: ['input', 'received'],
                    approved: ['input', 'approved'],
                    rejected: ['input', 'rejected'],
                    returned: ['input', 'returned'],
                    requisted: ['input', 'requisted'],
                    consumed: ['input', 'consumed']
                }
            }
        },
        outputs: {
            indentItem: ['c1', 'variable']
        }
    },
    deleteIndentItem: {
        inputs: {
            id: {
                type: 'IndentItem'
            },
            items: {
                type: []
            }
        },
        computations: {
        },
        outputs: {
            indentItem: ['c1', 'variable']
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
            quotationItemList: {
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
                exec: 'createQuotationItemForQuotation',
                connect: {
                    queryParams: {},
                    args: ['input', 'quotationItemList'],
                    overrides: {
                        "quotation": ['computation', 'c1', 'variable']
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
                exec: 'deleteQuotationItemForQuotation',
                connect: {
                    queryParams: {
                        "quotation": ['input', 'id']
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
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createQuotationItem',
                connect: {
                    quotation: ['input', 'quotation'],
                    indentItem: ['input', 'indentItem'],
                    quantity: ['input', 'quantity']
                }
            }
        },
        outputs: {
            quotationItem: ['c1', 'variable']
        }
    },
    deleteQuotationItem: {
        inputs: {
            id: {
                type: 'QuotationItem'
            },
            items: {
                type: []
            }
        },
        computations: {
        },
        outputs: {
            quotationItem: ['c1', 'variable']
        }
    },
    createPurchaseOrder: {
        inputs: {
            quotation: {
                type: 'Quotation'
            },
            purchaseOrderItemList: {
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
                exec: 'createPurchaseOrderItemForPurchaseOrder',
                connect: {
                    queryParams: {},
                    args: ['input', 'purchaseOrderItemList'],
                    overrides: {
                        "purchaseOrder": ['computation', 'c1', 'variable']
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
                exec: 'deletePurchaseOrderItemForPurchaseOrder',
                connect: {
                    queryParams: {
                        "purchaseOrder": ['input', 'id']
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
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createPurchaseOrderItem',
                connect: {
                    purchaseOrder: ['input', 'purchaseOrder'],
                    quotationItem: ['input', 'quotationItem'],
                    quantity: ['input', 'quantity'],
                    price: ['input', 'price'],
                    received: ['input', 'received']
                }
            }
        },
        outputs: {
            purchaseOrderItem: ['c1', 'variable']
        }
    },
    deletePurchaseOrderItem: {
        inputs: {
            id: {
                type: 'PurchaseOrderItem'
            },
            items: {
                type: []
            }
        },
        computations: {
        },
        outputs: {
            purchaseOrderItem: ['c1', 'variable']
        }
    },
    createPurchaseInvoice: {
        inputs: {
            purchaseOrder: {
                type: 'PurchaseOrder'
            },
            purchaseInvoiceItemList: {
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
                exec: 'createPurchaseInvoiceItemForPurchaseInvoice',
                connect: {
                    queryParams: {},
                    args: ['input', 'purchaseInvoiceItemList'],
                    overrides: {
                        "purchaseInvoice": ['computation', 'c1', 'variable']
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
                exec: 'deletePurchaseInvoiceItemForPurchaseInvoice',
                connect: {
                    queryParams: {
                        "purchaseInvoice": ['input', 'id']
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
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createPurchaseInvoiceItem',
                connect: {
                    purchaseInvoice: ['input', 'purchaseInvoice'],
                    purchaseOrderItem: ['input', 'purchaseOrderItem'],
                    quantity: ['input', 'quantity'],
                    approved: ['input', 'approved'],
                    rejected: ['input', 'rejected']
                }
            }
        },
        outputs: {
            purchaseInvoiceItem: ['c1', 'variable']
        }
    },
    deletePurchaseInvoiceItem: {
        inputs: {
            id: {
                type: 'PurchaseInvoiceItem'
            },
            items: {
                type: []
            }
        },
        computations: {
        },
        outputs: {
            purchaseInvoiceItem: ['c1', 'variable']
        }
    },
    createMaterialApprovalSlip: {
        inputs: {
            purchaseInvoice: {
                type: 'PurchaseInvoice'
            },
            materialApprovalSlipItemList: {
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
                exec: 'createMaterialApprovalSlipItemForMaterialApprovalSlip',
                connect: {
                    queryParams: {},
                    args: ['input', 'materialApprovalSlipItemList'],
                    overrides: {
                        "materialApprovalSlip": ['computation', 'c1', 'variable']
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
                exec: 'deleteMaterialApprovalSlipItemForMaterialApprovalSlip',
                connect: {
                    queryParams: {
                        "materialApprovalSlip": ['input', 'id']
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
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createMaterialApprovalSlipItem',
                connect: {
                    materialApprovalSlip: ['input', 'materialApprovalSlip'],
                    purchaseInvoiceItem: ['input', 'purchaseInvoiceItem'],
                    quantity: ['input', 'quantity'],
                    requisted: ['input', 'requisted']
                }
            }
        },
        outputs: {
            materialApprovalSlipItem: ['c1', 'variable']
        }
    },
    deleteMaterialApprovalSlipItem: {
        inputs: {
            id: {
                type: 'MaterialApprovalSlipItem'
            },
            items: {
                type: []
            }
        },
        computations: {
        },
        outputs: {
            materialApprovalSlipItem: ['c1', 'variable']
        }
    },
    createMaterialRejectionSlip: {
        inputs: {
            purchaseInvoice: {
                type: 'PurchaseInvoice'
            },
            materialRejectionSlipItemList: {
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
                exec: 'createMaterialRejectionSlipItemForMaterialRejectionSlip',
                connect: {
                    queryParams: {},
                    args: ['input', 'materialRejectionSlipItemList'],
                    overrides: {
                        "materialRejectionSlip": ['computation', 'c1', 'variable']
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
                exec: 'deleteMaterialRejectionSlipItemForMaterialRejectionSlip',
                connect: {
                    queryParams: {
                        "materialRejectionSlip": ['input', 'id']
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
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createMaterialRejectionSlipItem',
                connect: {
                    materialRejectionSlip: ['input', 'materialRejectionSlip'],
                    purchaseInvoiceItem: ['input', 'purchaseInvoiceItem'],
                    quantity: ['input', 'quantity'],
                    returned: ['input', 'returned']
                }
            }
        },
        outputs: {
            materialRejectionSlipItem: ['c1', 'variable']
        }
    },
    deleteMaterialRejectionSlipItem: {
        inputs: {
            id: {
                type: 'MaterialRejectionSlipItem'
            },
            items: {
                type: []
            }
        },
        computations: {
        },
        outputs: {
            materialRejectionSlipItem: ['c1', 'variable']
        }
    },
    createMaterialReturnSlip: {
        inputs: {
            materialRejectionSlip: {
                type: 'MaterialRejectionSlip'
            },
            materialReturnSlipItemList: {
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
                exec: 'createMaterialReturnSlipItemForMaterialReturnSlip',
                connect: {
                    queryParams: {},
                    args: ['input', 'materialReturnSlipItemList'],
                    overrides: {
                        "materialReturnSlip": ['computation', 'c1', 'variable']
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
                exec: 'deleteMaterialReturnSlipItemForMaterialReturnSlip',
                connect: {
                    queryParams: {
                        "materialReturnSlip": ['input', 'id']
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
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createMaterialReturnSlipItem',
                connect: {
                    materialReturnSlip: ['input', 'materialReturnSlip'],
                    materialRejectionSlipItem: ['input', 'materialRejectionSlipItem'],
                    quantity: ['input', 'quantity']
                }
            }
        },
        outputs: {
            materialReturnSlipItem: ['c1', 'variable']
        }
    },
    deleteMaterialReturnSlipItem: {
        inputs: {
            id: {
                type: 'MaterialReturnSlipItem'
            },
            items: {
                type: []
            }
        },
        computations: {
        },
        outputs: {
            materialReturnSlipItem: ['c1', 'variable']
        }
    },
    createMaterialRequistionSlip: {
        inputs: {
            materialApprovalSlip: {
                type: 'MaterialApprovalSlip'
            },
            materialRequistionSlipItemList: {
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
                exec: 'createMaterialRequistionSlipItemForMaterialRequistionSlip',
                connect: {
                    queryParams: {},
                    args: ['input', 'materialRequistionSlipItemList'],
                    overrides: {
                        "materialRequistionSlip": ['computation', 'c1', 'variable']
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
                exec: 'deleteMaterialRequistionSlipItemForMaterialRequistionSlip',
                connect: {
                    queryParams: {
                        "materialRequistionSlip": ['input', 'id']
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
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createMaterialRequistionSlipItem',
                connect: {
                    materialRequistionSlip: ['input', 'materialRequistionSlip'],
                    materialApprovalSlipItem: ['input', 'materialApprovalSlipItem'],
                    quantity: ['input', 'quantity'],
                    consumed: ['input', 'consumed']
                }
            }
        },
        outputs: {
            materialRequistionSlipItem: ['c1', 'variable']
        }
    },
    deleteMaterialRequistionSlipItem: {
        inputs: {
            id: {
                type: 'MaterialRequistionSlipItem'
            },
            items: {
                type: []
            }
        },
        computations: {
        },
        outputs: {
            materialRequistionSlipItem: ['c1', 'variable']
        }
    },
    createBom: {
        inputs: {
            name: {
                type: 'Text'
            },
            bomItemList: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createBom',
                connect: {
                    name: ['input', 'name']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createBomItemForBom',
                connect: {
                    queryParams: {},
                    args: ['input', 'bomItemList'],
                    overrides: {
                        "bom": ['computation', 'c1', 'variable']
                    }
                }
            }
        },
        outputs: {
            bom: ['c1', 'variable'],
            bomItemList: ['c2', '']
        }
    },
    deleteBom: {
        inputs: {
            id: {
                type: 'Bom'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteBomItemForBom',
                connect: {
                    queryParams: {
                        "bom": ['input', 'id']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'function',
                exec: 'deleteBom',
                connect: {
                    id: ['input', 'id']
                }
            }
        },
        outputs: {
            bom: ['c2', 'variable']
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
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createBomItem',
                connect: {
                    bom: ['input', 'bom'],
                    product: ['input', 'product'],
                    quantity: ['input', 'quantity'],
                    uom: ['input', 'uom']
                }
            }
        },
        outputs: {
            bomItem: ['c1', 'variable']
        }
    },
    deleteBomItem: {
        inputs: {
            id: {
                type: 'BomItem'
            },
            items: {
                type: []
            }
        },
        computations: {
        },
        outputs: {
            bomItem: ['c1', 'variable']
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
            },
            productionPreparationSlipItemList: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createProductionPreparationSlip',
                connect: {
                    bom: ['input', 'bom'],
                    approved: ['input', 'approved'],
                    scrapped: ['input', 'scrapped']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createProductionPreparationSlipItemForProductionPreparationSlip',
                connect: {
                    queryParams: {},
                    args: ['input', 'productionPreparationSlipItemList'],
                    overrides: {
                        "productionPreparationSlip": ['computation', 'c1', 'variable']
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
                exec: 'deleteProductionPreparationSlipItemForProductionPreparationSlip',
                connect: {
                    queryParams: {
                        "productionPreparationSlip": ['input', 'id']
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
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createProductionPreparationSlipItem',
                connect: {
                    productionPreparationSlip: ['input', 'productionPreparationSlip'],
                    bomItem: ['input', 'bomItem'],
                    materialRequistionSlipItem: ['input', 'materialRequistionSlipItem']
                }
            }
        },
        outputs: {
            productionPreparationSlipItem: ['c1', 'variable']
        }
    },
    deleteProductionPreparationSlipItem: {
        inputs: {
            id: {
                type: 'ProductionPreparationSlipItem'
            },
            items: {
                type: []
            }
        },
        computations: {
        },
        outputs: {
            productionPreparationSlipItem: ['c1', 'variable']
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
            },
            items: {
                type: []
            }
        },
        computations: {
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
            },
            transferred: {
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
                    quantity: ['input', 'quantity'],
                    transferred: ['input', 'transferred']
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
            },
            items: {
                type: []
            }
        },
        computations: {
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
            },
            items: {
                type: []
            }
        },
        computations: {
        },
        outputs: {
            warehouseAcceptanceSlip: ['c1', 'variable']
        }
    }
}
