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
    | 'CompanyProduct'
    | 'ProductTagGroup'
    | 'ProductTag'
    | 'MappingProductTag'
    | 'UOM'
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
    recursive: boolean
    keys: Record<string, Key>
}

export const types = {
    Region: {
        name: 'Region ID',
        url: 'region',
        recursive: false,
        keys: {
            name: {
                order: 0,
                name: 'Region',
                type: 'Text'
            }
        }
    },
    Country: {
        name: 'Country ID',
        url: 'country',
        recursive: false,
        keys: {
            region: {
                order: 0,
                name: 'Region',
                type: 'Region'
            },
            name: {
                order: 1,
                name: 'Country',
                type: 'Text'
            }
        }
    },
    State: {
        name: 'State ID',
        url: 'state',
        recursive: false,
        keys: {
            country: {
                order: 0,
                name: 'Country',
                type: 'Country'
            },
            name: {
                order: 1,
                name: 'State',
                type: 'Text'
            }
        }
    },
    District: {
        name: 'District ID',
        url: 'district',
        recursive: false,
        keys: {
            state: {
                order: 0,
                name: 'State',
                type: 'State'
            },
            name: {
                order: 1,
                name: 'District',
                type: 'Text'
            }
        }
    },
    Subdistrict: {
        name: 'Subdistrict ID',
        url: 'subdistrict',
        recursive: false,
        keys: {
            district: {
                order: 0,
                name: 'District',
                type: 'District'
            },
            name: {
                order: 1,
                name: 'Subdistrict',
                type: 'Text'
            }
        }
    },
    PostalCode: {
        name: 'Postal Code ID',
        url: 'postal-code',
        recursive: false,
        keys: {
            subdistrict: {
                order: 0,
                name: 'Subdistrict',
                type: 'Subdistrict'
            },
            name: {
                order: 1,
                name: 'Postal Code',
                type: 'Text'
            }
        }
    },
    Address: {
        name: 'Address ID',
        url: 'address',
        recursive: false,
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
        name: 'Company ID',
        url: 'company',
        recursive: false,
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
        recursive: false,
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
        name: 'Company Tag Group ID',
        url: 'company-tag-group',
        recursive: false,
        keys: {
            name: {
                order: 0,
                name: 'Tag Group',
                type: 'Text'
            }
        }
    },
    CompanyTag: {
        name: 'Company Tag ID',
        url: 'company-tag',
        recursive: false,
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
        recursive: false,
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
        name: 'Contact ID',
        url: 'contact',
        recursive: false,
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
        recursive: false,
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
        recursive: false,
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
        name: 'Currency ID',
        url: 'currency',
        recursive: false,
        keys: {
            name: {
                order: 0,
                name: 'Currency',
                type: 'Text'
            }
        }
    },
    CurrencyRate: {
        name: 'Currency Rate',
        recursive: false,
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
        recursive: false,
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
        name: 'Bank ID',
        url: 'bank',
        recursive: false,
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
        name: 'Bank Branch ID',
        url: 'bank-branch',
        recursive: false,
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
        name: 'Bank Account ID',
        url: 'bank-account',
        recursive: false,
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
        recursive: false,
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
        recursive: false,
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
        name: 'Product Category Group ID',
        url: 'product-catgory-group',
        recursive: true,
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
        name: 'ProductCategory ID',
        url: 'product-catgory',
        recursive: true,
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
        name: 'Product ID',
        url: 'product',
        recursive: false,
        keys: {
            name: {
                order: 1,
                name: 'Name',
                type: 'Text'
            },
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
    CompanyProduct: {
        name: 'Company Product',
        recursive: false,
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
    ProductTagGroup: {
        name: 'Product Tag Group ID',
        url: 'product-tag-group',
        recursive: false,
        keys: {
            name: {
                order: 0,
                name: 'Tag Group',
                type: 'Text'
            }
        }
    },
    ProductTag: {
        name: 'Product Tag ID',
        url: 'product-tag',
        recursive: false,
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
        recursive: false,
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
        recursive: false,
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
        name: 'Indent ID',
        url: 'indent',
        recursive: false,
        keys: {}
    },
    IndentItem: {
        name: 'Indent Item',
        recursive: false,
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
    Quotation: {
        name: 'Quotation ID',
        url: 'quotation',
        recursive: false,
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
        recursive: false,
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
        name: 'Purchase Order ID',
        url: 'purchase-order',
        recursive: false,
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
        recursive: false,
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
        name: 'Purchase Invoice ID',
        url: 'purchase-invoice',
        recursive: false,
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
        recursive: false,
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
        name: 'Material Approval Slip ID',
        url: 'material-approved',
        recursive: false,
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
        recursive: false,
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
        name: 'Material Rejection Slip ID',
        url: 'material-rejected',
        recursive: false,
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
        recursive: false,
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
        name: 'Material Return Note ID',
        url: 'return',
        recursive: false,
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
        recursive: false,
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
        name: 'Material Requistion Slip ID',
        url: 'requistion',
        recursive: false,
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
        recursive: false,
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
        name: 'Bill of Material ID',
        url: 'bom',
        recursive: false,
        keys: {
            name: {
                order: 0,
                name: 'BOM',
                type: 'Text'
            }
        }
    },
    BOMItem: {
        name: 'BOM Item',
        recursive: false,
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
        recursive: false,
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
        recursive: false,
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
        name: 'Scrap Material Slip ID',
        url: 'material-scrapped',
        recursive: false,
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
        name: 'Transfer Material Slip ID',
        url: 'material-transferred',
        recursive: false,
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
        name: 'Warehouse Receipt ID',
        url: 'warehouse-receipt',
        recursive: false,
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
