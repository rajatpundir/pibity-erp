import { LispExpression } from "./lisp"

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
    | 'Company'
    | 'CompanyAddress'
    | 'CompanyTagGroup'
    | 'CompanyTag'
    | 'MappingCompanyTag'
    | 'Contact'
    | 'ContactAddress'
    | 'CompanyContact'
    | 'Currency'
    | 'CurrencyRate'
    | 'Memo'
    | 'Bank'
    | 'BankBranch'
    | 'BankAccount'
    | 'BankTransaction'
    | 'CompanyBankAccount'
    | 'ProductCategoryGroup'
    | 'ProductCategory'
    | 'Product'
    | 'ProductTagGroup'
    | 'ProductTag'
    | 'MappingProductTag'
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
    type: PrimitiveType
} | {
    order: number
    name: string
    type: 'Formula'
    returnType: PrimitiveType
    expression: LispExpression
}

export type Type = {
    name: string
    url?: string,
    keys: Record<string, Key>
}

export const types = {
    Region: {
        name: 'Region',
        url: 'region',
        keys: {}
    },
    Country: {
        name: 'Country',
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
    Company: {
        name: 'Company',
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
    CompanyTagGroup: {
        name: 'Company Tag Group',
        url: 'company-tag-group',
        keys: {}
    },
    CompanyTag: {
        name: 'Company Tag',
        url: 'company-tag',
        keys: {
            group: {
                order: 0,
                name: 'Group',
                type: 'CompanyTagGroup'
            },
            name: {
                order: 1,
                name: 'Name',
                type: 'Text'
            }
        }
    },
    MappingCompanyTag: {
        name: 'Mapping(Company-Tag)',
        keys: {
            company: {
                order: 0,
                name: 'Company',
                type: 'Company'
            },
            tag: {
                order: 1,
                name: 'Tag',
                type: 'CompanyTag'
            }
        }
    },
    Contact: {
        name: 'Contact',
        url: 'contact',
        keys: {
            name: {
                order: 1,
                name: 'Name',
                type: 'Text'
            },
            email: {
                order: 2,
                name: 'Email',
                type: 'Text'
            },
            telephone: {
                order: 3,
                name: 'Telephone',
                type: 'Text'
            },
            mobile: {
                order: 4,
                name: 'Mobile',
                type: 'Text'
            },
            website: {
                order: 5,
                name: 'Website',
                type: 'Text'
            }
        }
    },
    ContactAddress: {
        name: 'Contact Address',
        keys: {
            contact: {
                order: 0,
                name: 'Contact',
                type: 'Contact'
            },
            address: {
                order: 1,
                name: 'Address',
                type: 'Address'
            }
        }
    },
    CompanyContact: {
        name: 'Company Contact',
        keys: {
            company: {
                order: 0,
                name: 'Company',
                type: 'Company'
            },
            contact: {
                order: 1,
                name: 'Contact',
                type: 'Text'
            },
            role: {
                order: 2,
                name: 'Role',
                type: 'Text'
            },
            email: {
                order: 2,
                name: 'Email',
                type: 'Text'
            },
            telephone: {
                order: 3,
                name: 'Telephone',
                type: 'Text'
            },
            mobile: {
                order: 4,
                name: 'Mobile',
                type: 'Text'
            }
        }
    },
    Currency: {
        name: 'Currency',
        url: 'currency',
        keys: {}
    },
    CurrencyRate: {
        name: 'Currency Rate',
        keys: {
            currency: {
                order: 0,
                name: 'Currency',
                type: 'Currency'
            },
            conversionRate: {
                order: 1,
                name: 'Conversion Rate',
                type: 'Decimal'
            },
            startTime: {
                order: 2,
                name: 'Start Time',
                type: 'Timestamp'
            },
            endTime: {
                order: 3,
                name: 'End Time',
                type: 'Timestamp'
            }
        }
    },
    Memo: {
        name: 'Memo',
        keys: {
            company: {
                order: 0,
                name: 'Company',
                type: 'Company'
            },
            currency: {
                order: 1,
                name: 'Currency',
                type: 'Currency'
            },
            amount: {
                order: 2,
                name: 'Amount',
                type: 'Decimal'
            },
            unsettled: {
                order: 3,
                name: 'Unsettled',
                type: 'Timestamp'
            }
        }
    },
    Bank: {
        name: 'Bank',
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
        url: 'bank-account',
        keys: {
            bank: {
                order: 0,
                name: 'Bank',
                type: 'Bank'
            },
            bankBranch: {
                order: 1,
                name: 'Bank Branch',
                type: 'BankBranch'
            },
            accountNumber: {
                order: 2,
                name: 'Account Number',
                type: 'Text'
            },
            accountName: {
                order: 3,
                name: 'Account Name',
                type: 'Text'
            },
            currency: {
                order: 4,
                name: 'Currency',
                type: 'Currency'
            }
        }
    },
    BankTransaction: {
        name: 'Bank Transaction',
        keys: {
            timestamp: {
                order: 0,
                name: 'Timestamp',
                type: 'Timestamp'
            },
            memo: {
                order: 1,
                name: 'Memo',
                type: 'Memo'
            },
            currencyRate: {
                order: 2,
                name: 'Currency Rate',
                type: 'CurrencyRate'
            },
            bankAccount: {
                order: 3,
                name: 'Bank Account',
                type: 'BankAccount'
            },
            interactedAccount: {
                order: 4,
                name: 'Sender / Receiver',
                type: 'BankAccount'
            },
            credit: {
                order: 4,
                name: 'Credit',
                type: 'Decimal'
            },
            debit: {
                order: 5,
                name: 'Debit',
                type: 'Decimal'
            }
        }
    },
    CompanyBankAccount: {
        name: 'Company Bank Account',
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
    ProductCategoryGroup: {
        name: 'Product Category Group',
        url: 'product-catgory-group',
        keys: {
            parent: {
                order: 0,
                name: 'Parent',
                type: 'ProductCategoryGroup'
            },
            name: {
                order: 1,
                name: 'Name',
                type: 'Text'
            },
            length: {
                order: 2,
                name: 'Length',
                type: 'Number'
            }
        }
    },
    ProductCategory: {
        name: 'ProductCategory',
        url: 'product-catgory',
        keys: {
            parent: {
                order: 0,
                name: 'Parent',
                type: 'ProductCategory'
            },
            group: {
                order: 1,
                name: 'Group',
                type: 'ProductCategoryGroup'
            },
            name: {
                order: 2,
                name: 'Name',
                type: 'Text'
            },
            code: {
                order: 3,
                name: 'Code',
                type: 'Text'
            },
            derivedCode: {
                order: 4,
                name: 'Derived Code',
                type: 'Formula',
                returnType: 'Text',
                expression: {
                    op: '++',
                    types: ['Text'],
                    args: [{
                        op: '.',
                        types: [],
                        args: ['parent', 'derivedCode']
                    }, {
                        op: '.',
                        types: [],
                        args: ['code']
                    }]
                }
            },
            childCount: {
                order: 5,
                name: 'Child Count',
                type: 'Number'
            }
        }
    },
    Product: {
        name: 'Product',
        url: 'product',
        keys: {
            category: {
                order: 0,
                name: 'Category',
                type: 'ProductCategory'
            },
            code: {
                order: 1,
                name: 'Code',
                type: 'Text'
            },
            sku: {
                order: 2,
                name: 'SKU',
                type: 'Formula',
                returnType: 'Text',
                expression: {
                    op: '++',
                    types: ['Text'],
                    args: [{
                        op: '.',
                        types: [],
                        args: ['parent', 'derivedCode']
                    }, {
                        op: '.',
                        types: [],
                        args: ['code']
                    }]
                }
            }
        }
    },
    ProductTagGroup: {
        name: 'Product Tag Group',
        url: 'product-tag-group',
        keys: {}
    },
    ProductTag: {
        name: 'Product Tag',
        url: 'product-tag',
        keys: {
            group: {
                order: 0,
                name: 'Group',
                type: 'ProductTagGroup'
            },
            name: {
                order: 1,
                name: 'Name',
                type: 'Text'
            }
        }
    },
    MappingProductTag: {
        name: 'Mapping(Product-Tag)',
        keys: {
            product: {
                order: 0,
                name: 'Product',
                type: 'Product'
            },
            tag: {
                order: 1,
                name: 'Tag',
                type: 'ProductTag'
            }
        }
    },
    UOM: {
        name: 'Unit of Measure',
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
        url: 'indent',
        keys: {}
    },
    IndentItem: {
        name: 'Indent Item',
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
        url: 'bom',
        keys: {}
    },
    BOMItem: {
        name: 'BOM Item',
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
