
export type KeyType = PrimitiveType | NonPrimitiveType

export type PrimitiveType =
    | 'Text'
    | 'Number'
    | 'Decimal'
    | 'Boolean'
    | 'Date'
    | 'Timestamp'
    | 'Time'
// | 'Formula'
// | 'Blob'

export type NonPrimitiveType =
    | 'Region'
    | 'Country'
    | 'State'
    | 'District'
    | 'Subdistrict'
    | 'PostalCode'
    | 'Address'
    | 'ServiceArea'
    | 'CompanyType'
    | 'Bank'
    | 'BankBranch'
    | 'BankAccount'
    | 'Company'
    | 'CompanyAddress'
    | 'CompanyContact'
    | 'CompanyBankAccount'
    | 'Product'
    | 'UOM'
    | 'CompanyProduct'
    | 'Indent'
    | 'IndentItem'
    | 'Quotation'
    | 'QuotationItem'
    | 'PurchaseOrder'
    | 'PurchaseOrderItem'
    | 'PurchaseInvoice'
    | 'PurchaseInvoiceItem'
    | 'MaterialApprovalSlip'
    | 'MaterialApprovalSlipItem'
    | 'MaterialRejectionSlip'
    | 'MaterialRejectionSlipItem'
    | 'MaterialReturnSlip'
    | 'MaterialReturnSlipItem'
    | 'MaterialRequistionSlip'
    | 'MaterialRequistionSlipItem'
    | 'BOM'
    | 'BOMItem'
    | 'ProductionPreparationSlip'
    | 'ProductionPreparationSlipItem'
    | 'ScrapMaterialSlip'
    | 'TransferMaterialSlip'
    | 'WarehouseAcceptanceSlip'

export type Key = {
    order: number
    name: string
    type: KeyType
}

export type Type = {
    name: string
    autoId: boolean
    url?: string,
    keys: Record<string, Key>
}

export const types = {
    Region: {
        name: 'Region',
        autoId: false,
        url: 'region',
        keys: {}
    },
    Country: {
        name: 'Country',
        autoId: true,
        url: 'country',
        keys: {
            region: {
                order: 0,
                name: 'Region',
                type: 'Region'
            },
            name: {
                order: 1,
                name: 'Name',
                type: 'Text'
            }
        }
    },
    State: {
        name: 'State',
        autoId: true,
        url: 'state',
        keys: {
            country: {
                order: 0,
                name: 'Country',
                type: 'Country'
            },
            name: {
                order: 1,
                name: 'Name',
                type: 'Text'
            }
        }
    },
    District: {
        name: 'District',
        autoId: true,
        url: 'district',
        keys: {
            state: {
                order: 0,
                name: 'State',
                type: 'State'
            },
            name: {
                order: 1,
                name: 'Name',
                type: 'Text'
            }
        }
    },
    Subdistrict: {
        name: 'Subdistrict',
        autoId: true,
        url: 'subdistrict',
        keys: {
            district: {
                order: 0,
                name: 'District',
                type: 'District'
            },
            name: {
                order: 1,
                name: 'Name',
                type: 'Text'
            }
        }
    },
    PostalCode: {
        name: 'Postal Code',
        autoId: true,
        url: 'postal-code',
        keys: {
            subdistrict: {
                order: 0,
                name: 'Subdistrict',
                type: 'Subdistrict'
            },
            name: {
                order: 1,
                name: 'Name',
                type: 'Text'
            }
        }
    },
    Address: {
        name: 'Address',
        autoId: true,
        url: 'address',
        keys: {
            postalCode: {
                order: 0,
                name: 'Postal Code',
                type: 'PostalCode'
            },
            line1: {
                order: 1,
                name: 'Address Line 1',
                type: 'Text'
            },
            line2: {
                order: 2,
                name: 'Address Line 2',
                type: 'Text'
            },
            latitude: {
                order: 3,
                name: 'Latitude',
                type: 'Number'
            },
            longitude: {
                order: 4,
                name: 'Longitude',
                type: 'Number'
            }
        }
    },
    ServiceArea: {
        name: 'Service Area',
        autoId: false,
        url: 'service-area',
        keys: {}
    },
    CompanyType: {
        name: 'Company Type',
        autoId: false,
        url: 'company-type',
        keys: {}
    },
    Bank: {
        name: 'Bank',
        autoId: false,
        url: 'bank',
        keys: {
            country: {
                order: 0,
                name: 'Country',
                type: 'Country'
            },
            name: {
                order: 1,
                name: 'Name',
                type: 'Text'
            },
            website: {
                order: 2,
                name: 'Website',
                type: 'Text'
            }
        }
    },
    BankBranch: {
        name: 'Bank Branch',
        autoId: true,
        url: 'bank-branch',
        keys: {
            bank: {
                order: 0,
                name: 'Bank',
                type: 'Bank'
            },
            name: {
                order: 1,
                name: 'Name',
                type: 'Text'
            },
            ifsc: {
                order: 2,
                name: 'IFSC',
                type: 'Text'
            },
            address: {
                order: 3,
                name: 'Address',
                type: 'Address'
            }
        }
    },
    BankAccount: {
        name: 'Bank Account',
        autoId: true,
        url: 'bank-account',
        keys: {
            bankBranch: {
                order: 0,
                name: 'Bank Branch',
                type: 'BankBranch'
            },
            bank: {
                order: 1,
                name: 'Bank',
                type: 'Bank'
            },
            accountNumber: {
                order: 2,
                name: 'Name',
                type: 'Text'
            }
        }
    },
    Company: {
        name: 'Company',
        autoId: false,
        url: 'company',
        keys: {
            email: {
                order: 0,
                name: 'Email',
                type: 'Text'
            },
            telephone: {
                order: 1,
                name: 'Telephone',
                type: 'Text'
            },
            mobile: {
                order: 2,
                name: 'Mobile',
                type: 'Text'
            },
            website: {
                order: 3,
                name: 'Website',
                type: 'Text'
            },
            companyType: {
                order: 4,
                name: 'Compnay Type',
                type: 'CompanyType'
            },
            serviceArea: {
                order: 5,
                name: 'Service Area',
                type: 'ServiceArea'
            },
            gstin: {
                order: 6,
                name: 'GSTIN',
                type: 'Text'
            },
            pan: {
                order: 7,
                name: 'PAN',
                type: 'Text'
            },
            iec: {
                order: 8,
                name: 'IEC',
                type: 'Text'
            }
        }
    },
    CompanyAddress: {
        name: 'Company Address',
        autoId: true,
        keys: {
            company: {
                order: 0,
                name: 'Company',
                type: 'Company'
            },
            name: {
                order: 1,
                name: 'Name',
                type: 'Text'
            },
            address: {
                order: 2,
                name: 'Address',
                type: 'Address'
            }
        }
    },
    CompanyContact: {
        name: 'Company Contact',
        autoId: true,
        keys: {
            company: {
                order: 0,
                name: 'Company',
                type: 'Company'
            },
            name: {
                order: 1,
                name: 'Name',
                type: 'Text'
            },
            designation: {
                order: 2,
                name: 'Designation',
                type: 'Text'
            },
            email: {
                order: 3,
                name: 'Email',
                type: 'Text'
            },
            telephone: {
                order: 4,
                name: 'Telephone',
                type: 'Text'
            },
            mobile: {
                order: 5,
                name: 'Name',
                type: 'Text'
            }
        }
    },
    CompanyBankAccount: {
        name: 'Company Bank Account',
        autoId: true,
        keys: {
            company: {
                order: 0,
                name: 'Company',
                type: 'Company'
            },
            bankAccount: {
                order: 1,
                name: 'Bank Account',
                type: 'BankAccount'
            }
        }
    },
    Product: {
        name: 'SKU',
        autoId: false,
        url: 'product',
        keys: {
            name: {
                order: 0,
                name: 'Name',
                type: 'Text'
            },
            orderable: {
                order: 1,
                name: 'Orderable',
                type: 'Boolean'
            },
            consumable: {
                order: 2,
                name: 'Consumable',
                type: 'Boolean'
            },
            producable: {
                order: 3,
                name: 'Producable',
                type: 'Boolean'
            }
        }
    },
    UOM: {
        name: 'Unit of Measure',
        autoId: true,
        keys: {
            product: {
                order: 0,
                name: 'Product',
                type: 'Product'
            },
            name: {
                order: 1,
                name: 'Name',
                type: 'Text'
            },
            conversionRate: {
                order: 3,
                name: 'Conversion Rate',
                type: 'Decimal'
            }
        }
    },
    Indent: {
        name: 'Indent',
        autoId: true,
        url: 'indent',
        keys: {}
    },
    IndentItem: {
        name: 'Indent Item',
        autoId: true,
        keys: {
            indent: {
                order: 0,
                name: 'Indent',
                type: 'Indent'
            },
            product: {
                order: 1,
                name: 'Product',
                type: 'Product'
            },
            quantity: {
                order: 2,
                name: 'Quantity',
                type: 'Number'
            },
            uom: {
                order: 3,
                name: 'UOM',
                type: 'UOM'
            },
            ordered: {
                order: 4,
                name: 'Ordered',
                type: 'Number'
            },
            received: {
                order: 5,
                name: 'Received',
                type: 'Number'
            },
            approved: {
                order: 6,
                name: 'Approved',
                type: 'Number'
            },
            rejected: {
                order: 7,
                name: 'Rejected',
                type: 'Number'
            },
            returned: {
                order: 8,
                name: 'Returned',
                type: 'Number'
            },
            requisted: {
                order: 9,
                name: 'Requisted',
                type: 'Number'
            },
            consumed: {
                order: 10,
                name: 'Consumed',
                type: 'Number'
            }
        }
    },
    CompanyProduct: {
        name: 'Company Product',
        autoId: true,
        keys: {
            company: {
                order: 0,
                name: 'Company',
                type: 'Company'
            },
            product: {
                order: 1,
                name: 'Product',
                type: 'Product'
            }
        }
    },
    Quotation: {
        name: 'Quotation',
        autoId: true,
        url: 'quotation',
        keys: {
            indent: {
                order: 0,
                name: 'Indent',
                type: 'Indent'
            },
            company: {
                order: 1,
                name: 'Company',
                type: 'Company'
            }
        }
    },
    QuotationItem: {
        name: 'Quotation Item',
        autoId: true,
        keys: {
            quotation: {
                order: 0,
                name: 'Quotation',
                type: 'Quotation'
            },
            indentItem: {
                order: 1,
                name: 'Indent Item',
                type: 'IndentItem'
            },
            quantity: {
                order: 2,
                name: 'Quantity',
                type: 'Number'
            }
        }
    },
    PurchaseOrder: {
        name: 'Purchase Order',
        autoId: true,
        url: 'purchase-order',
        keys: {
            quotation: {
                order: 0,
                name: 'Quotation',
                type: 'Quotation'
            }
        }
    },
    PurchaseOrderItem: {
        name: 'Purchase Order Item',
        autoId: true,
        keys: {
            purchaseOrder: {
                order: 0,
                name: 'Purchase Order',
                type: 'PurchaseOrder'
            },
            quotationItem: {
                order: 1,
                name: 'Quotation Item',
                type: 'QuotationItem'
            },
            quantity: {
                order: 2,
                name: 'Quantity',
                type: 'Number'
            },
            price: {
                order: 3,
                name: 'Price',
                type: 'Decimal'
            },
            received: {
                order: 4,
                name: 'Received',
                type: 'Number'
            }
        }
    },
    PurchaseInvoice: {
        name: 'Purchase Invoice',
        autoId: true,
        url: 'purchase-invoice',
        keys: {
            purchaseOrder: {
                order: 0,
                name: 'Purchase Order',
                type: 'PurchaseOrder'
            }
        }
    },
    PurchaseInvoiceItem: {
        name: 'Purchase Invoice Item',
        autoId: true,
        keys: {
            purchaseInvoice: {
                order: 0,
                name: 'Purchase Invoice',
                type: 'PurchaseInvoice'
            },
            purchaseOrderItem: {
                order: 1,
                name: 'Purchase Order Item',
                type: 'PurchaseOrderItem'
            },
            quantity: {
                order: 2,
                name: 'Quantity',
                type: 'Number'
            },
            approved: {
                order: 3,
                name: 'Approved',
                type: 'Number'
            },
            rejected: {
                order: 4,
                name: 'Rejected',
                type: 'Number'
            }
        }
    },
    MaterialApprovalSlip: {
        name: 'Material Approval Slip',
        autoId: true,
        url: 'material-approved',
        keys: {
            purchaseInvoice: {
                order: 0,
                name: 'Purchase Invoice',
                type: 'PurchaseInvoice'
            }
        }
    },
    MaterialApprovalSlipItem: {
        name: 'Material Approval Slip Item',
        autoId: true,
        keys: {
            materialApprovalSlip: {
                order: 0,
                name: 'Material Approval Slip',
                type: 'MaterialApprovalSlip'
            },
            purchaseInvoiceItem: {
                order: 1,
                name: 'Purchase Invoice Item',
                type: 'PurchaseInvoiceItem'
            },
            quantity: {
                order: 2,
                name: 'Quantity',
                type: 'Number'
            },
            requisted: {
                order: 3,
                name: 'Requisted',
                type: 'Number'
            }
        }
    },
    MaterialRejectionSlip: {
        name: 'Material Rejection Slip',
        autoId: true,
        url: 'material-rejected',
        keys: {
            purchaseInvoice: {
                order: 0,
                name: 'Purchase Invoice',
                type: 'PurchaseInvoice'
            }
        }
    },
    MaterialRejectionSlipItem: {
        name: 'Material Rejection Slip Item',
        autoId: true,
        keys: {
            materialRejectionSlip: {
                order: 0,
                name: 'Material Rejection Slip',
                type: 'MaterialRejectionSlip'
            },
            purchaseInvoiceItem: {
                order: 1,
                name: 'Purchase Invoice Item',
                type: 'PurchaseInvoiceItem'
            },
            quantity: {
                order: 2,
                name: 'Quantity',
                type: 'Number'
            },
            returned: {
                order: 3,
                name: 'Returned',
                type: 'Number'
            }
        }
    },
    MaterialReturnSlip: {
        name: 'Material Return Note',
        autoId: true,
        url: 'return',
        keys: {
            materialRejectionSlip: {
                order: 0,
                name: 'Material Rejection Slip',
                type: 'MaterialRejectionSlip'
            }
        }
    },
    MaterialReturnSlipItem: {
        name: 'Material Return Slip Item',
        autoId: true,
        keys: {
            materialReturnSlip: {
                order: 0,
                name: 'Material Return Slip',
                type: 'MaterialReturnSlip'
            },
            materialRejectionSlipItem: {
                order: 1,
                name: 'Material Rejection Slip Item',
                type: 'MaterialRejectionSlipItem'
            },
            quantity: {
                order: 2,
                name: 'Quantity',
                type: 'Number'
            }
        }
    },
    MaterialRequistionSlip: {
        name: 'Material Requistion Slip',
        autoId: true,
        url: 'requistion',
        keys: {
            materialApprovalSlip: {
                order: 0,
                name: 'Material Approval Slip',
                type: 'MaterialApprovalSlip'
            }
        }
    },
    MaterialRequistionSlipItem: {
        name: 'Material Requistion Slip Item',
        autoId: true,
        keys: {
            materialRequistionSlip: {
                order: 0,
                name: 'Material Requistion Slip',
                type: 'MaterialRequistionSlip'
            },
            materialApprovalSlipItem: {
                order: 1,
                name: 'Material Approval Slip Item',
                type: 'MaterialApprovalSlipItem'
            },
            quantity: {
                order: 2,
                name: 'Quantity',
                type: 'Number'
            },
            consumed: {
                order: 3,
                name: 'Consumed',
                type: 'Number'
            }
        }
    },
    BOM: {
        name: 'Bill of Material',
        autoId: false,
        url: 'bom',
        keys: {}
    },
    BOMItem: {
        name: 'BOM Item',
        autoId: true,
        keys: {
            bom: {
                order: 0,
                name: 'BOM',
                type: 'BOM'
            },
            product: {
                order: 1,
                name: 'Product',
                type: 'Product'
            },
            quantity: {
                order: 2,
                name: 'Quantity',
                type: 'Number'
            },
            uom: {
                order: 3,
                name: 'UOM',
                type: 'UOM'
            }
        }
    },
    ProductionPreparationSlip: {
        name: 'Production Preparation Slip',
        autoId: true,
        keys: {
            bom: {
                order: 0,
                name: 'BOM',
                type: 'BOM'
            },
            approved: {
                order: 1,
                name: 'Approved',
                type: 'Number'
            },
            scrapped: {
                order: 2,
                name: 'Scrapped',
                type: 'Number'
            }
        }
    },
    ProductionPreparationSlipItem: {
        name: 'Production Preparation SlipItem',
        autoId: true,
        keys: {
            productionPreparationSlip: {
                order: 0,
                name: 'Production Preparation Slip',
                type: 'ProductionPreparationSlip'
            },
            bomItem: {
                order: 1,
                name: 'BOM Item',
                type: 'Text'
            },
            materialRequistionSlipItem: {
                order: 2,
                name: 'Material Requistion Slip Item',
                type: 'MaterialRequistionSlipItem'
            }
        }
    },
    ScrapMaterialSlip: {
        name: 'Scrap Material Slip',
        autoId: true,
        url: 'material-scrapped',
        keys: {
            productionPreparationSlip: {
                order: 0,
                name: 'Production Preparation Slip',
                type: 'ProductionPreparationSlip'
            },
            quantity: {
                order: 1,
                name: 'Quantity',
                type: 'Number'
            }
        }
    },
    TransferMaterialSlip: {
        name: 'Transfer Material Slip',
        autoId: true,
        url: 'material-transferred',
        keys: {
            productionPreparationSlip: {
                order: 0,
                name: 'Production Preparation Slip',
                type: 'ProductionPreparationSlip'
            },
            quantity: {
                order: 1,
                name: 'Quantity',
                type: 'Number'
            },
            transferred: {
                order: 2,
                name: 'Transferred',
                type: 'Number'
            }
        }
    },
    WarehouseAcceptanceSlip: {
        name: 'Warehouse Receipt',
        autoId: true,
        url: 'warehouse-receipt',
        keys: {
            transferMaterialSlip: {
                order: 0,
                name: 'Transfer Material Slip',
                type: 'TransferMaterialSlip'
            },
            quantity: {
                order: 1,
                name: 'Quantity',
                type: 'Number'
            }
        }
    }
}
