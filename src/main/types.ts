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
    | 'StateType'
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
    | 'Uom'
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
    | 'Bom'
    | 'BomItem'
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
    },
    uniqueConstraints: {
       'uc1': ['name']
    },
    assertions: {},
    lists: {
       Country: 'region'
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
    },
    uniqueConstraints: {
       'uc1': ['region', 'name']
    },
    assertions: {},
    lists: {
       StateType: 'country'
    }
},
StateType: {
    name: 'StateType ID',
    url: 'state-type',
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
    },
    uniqueConstraints: {
       'uc1': ['country', 'name']
    },
    assertions: {},
    lists: {
       District: 'state'
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
            type: 'StateType'
         },
         name: {
            order: 1,
            name: 'District',
            type: 'Text'
         }
    },
    uniqueConstraints: {
       'uc1': ['state', 'name']
    },
    assertions: {},
    lists: {
       Subdistrict: 'district'
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
    },
    uniqueConstraints: {
       'uc1': ['district', 'name']
    },
    assertions: {},
    lists: {
       PostalCode: 'subdistrict'
    }
},
PostalCode: {
    name: 'PostalCode ID',
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
    },
    uniqueConstraints: {
       'uc1': ['subdistrict', 'name']
    },
    assertions: {},
    lists: {
       Address: 'postalCode'
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
    },
    uniqueConstraints: {
       'uc1': ['postalCode', 'line1', 'line2']
    },
    assertions: {},
    lists: {}
},
Company: {
    name: 'Company ID',
    url: 'company',
    recursive: false,
    keys: {
         name: {
            order: 0,
            name: 'Company',
            type: 'Text'
         },
         email: {
            order: 1,
            name: 'Email',
            type: 'Text'
         },
         telephone: {
            order: 2,
            name: 'Telephone',
            type: 'Text'
         },
         mobile: {
            order: 3,
            name: 'Mobile',
            type: 'Text'
         },
         website: {
            order: 4,
            name: 'Website',
            type: 'Text'
         },
         gstin: {
            order: 5,
            name: 'GSTIN',
            type: 'Text'
         },
         pan: {
            order: 6,
            name: 'PAN',
            type: 'Text'
         },
         iec: {
            order: 7,
            name: 'IEC',
            type: 'Text'
         }
    },
    uniqueConstraints: {
       'uc1': ['name']
    },
    assertions: {},
    lists: {
       CompanyAddress: 'company',
       MappingCompanyTag: 'company',
       CompanyContact: 'company',
       Memo: 'company',
       CompanyBankAccount: 'company'
    }
},
CompanyAddress: {
    name: 'CompanyAddress ID',
    url: 'company-address',
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
    },
    uniqueConstraints: {
       'uc1': ['company', 'name'],
       'uc2': ['company', 'address']
    },
    assertions: {},
    lists: {}
},
CompanyTagGroup: {
    name: 'CompanyTagGroup ID',
    url: 'company-tag-group',
    recursive: false,
    keys: {
         name: {
            order: 0,
            name: 'Tag Group',
            type: 'Text'
         }
    },
    uniqueConstraints: {
       'uc1': ['name']
    },
    assertions: {},
    lists: {}
},
CompanyTag: {
    name: 'CompanyTag ID',
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
    },
    uniqueConstraints: {
       'uc1': ['group', 'name']
    },
    assertions: {},
    lists: {}
},
MappingCompanyTag: {
    name: 'MappingCompanyTag ID',
    url: 'mapping-company-tag',
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
    },
    uniqueConstraints: {
       'uc1': ['company', 'tag']
    },
    assertions: {},
    lists: {}
},
Contact: {
    name: 'Contact ID',
    url: 'contact',
    recursive: false,
    keys: {
         name: {
            order: 0,
            name: 'Name',
            type: 'Text'
         },
         email: {
            order: 1,
            name: 'Email',
            type: 'Text'
         },
         telephone: {
            order: 2,
            name: 'Telephone',
            type: 'Text'
         },
         mobile: {
            order: 3,
            name: 'Mobile',
            type: 'Text'
         },
         website: {
            order: 4,
            name: 'Website',
            type: 'Text'
         }
    },
    uniqueConstraints: {
       'uc1': ['name']
    },
    assertions: {},
    lists: {
       ContactAddress: 'contact',
       CompanyContact: 'contact'
    }
},
ContactAddress: {
    name: 'ContactAddress ID',
    url: 'contact-address',
    recursive: false,
    keys: {
         contact: {
            order: 0,
            name: 'Contact',
            type: 'Contact'
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
    },
    uniqueConstraints: {
       'uc1': ['contact', 'name'],
       'uc2': ['contact', 'address']
    },
    assertions: {},
    lists: {}
},
CompanyContact: {
    name: 'CompanyContact ID',
    url: 'company-contact',
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
            type: 'Contact'
         },
         role: {
            order: 2,
            name: 'Role',
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
            name: 'Mobile',
            type: 'Text'
         }
    },
    uniqueConstraints: {
       'uc1': ['company', 'contact']
    },
    assertions: {},
    lists: {}
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
    },
    uniqueConstraints: {
       'uc1': ['name']
    },
    assertions: {},
    lists: {
       CurrencyRate: 'currency'
    }
},
CurrencyRate: {
    name: 'CurrencyRate ID',
    url: 'currency-rate',
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
    },
    uniqueConstraints: {},
    assertions: {},
    lists: {}
},
Memo: {
    name: 'Memo ID',
    url: 'memo',
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
            type: 'Decimal'
         }
    },
    uniqueConstraints: {},
    assertions: {},
    lists: {}
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
    },
    uniqueConstraints: {
       'uc1': ['country', 'name']
    },
    assertions: {},
    lists: {
       BankBranch: 'bank'
    }
},
BankBranch: {
    name: 'BankBranch ID',
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
    },
    uniqueConstraints: {
       'uc1': ['bank', 'name'],
       'uc2': ['bank', 'ifsc']
    },
    assertions: {},
    lists: {
       BankAccount: 'bankBranch'
    }
},
BankAccount: {
    name: 'BankAccount ID',
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
    },
    uniqueConstraints: {
       'uc1': ['bank', 'accountNumber']
    },
    assertions: {},
    lists: {
       BankTransaction: 'bankAccount'
    }
},
BankTransaction: {
    name: 'BankTransaction ID',
    url: 'bank-transaction',
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
         fromToAccount: {
            order: 4,
            name: 'Sender / Receiver',
            type: 'BankAccount'
         },
         credit: {
            order: 5,
            name: 'Credit',
            type: 'Decimal'
         },
         debit: {
            order: 6,
            name: 'Debit',
            type: 'Decimal'
         }
    },
    uniqueConstraints: {},
    assertions: {},
    lists: {}
},
CompanyBankAccount: {
    name: 'CompanyBankAccount ID',
    url: 'company-bank-account',
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
    },
    uniqueConstraints: {
       'uc1': ['company', 'bankAccount']
    },
    assertions: {},
    lists: {}
},
ProductCategoryGroup: {
    name: 'ProductCategoryGroup ID',
    url: 'product-category-group',
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
    },
    uniqueConstraints: {
       'uc1': ['parent']
    },
    assertions: {},
    lists: {
       ProductCategory: 'group'
    }
},
ProductCategory: {
    name: 'ProductCategory ID',
    url: 'product-category',
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
            expression: {"op":"++","types":["Text"],"args":[{"op":".","types":[],"args":["parent","derivedCode"]},{"op":".","types":[],"args":["code"]}]}
         },
         childCount: {
            order: 5,
            name: 'Child Count',
            type: 'Number'
         }
    },
    uniqueConstraints: {
       'uc1': ['parent', 'name'],
       'uc2': ['parent', 'code']
    },
    assertions: {},
    lists: {
       ProductCategory: 'parent'
    }
},
Product: {
    name: 'Product ID',
    url: 'product',
    recursive: false,
    keys: {
         name: {
            order: 0,
            name: 'Name',
            type: 'Text'
         },
         category: {
            order: 1,
            name: 'Category',
            type: 'ProductCategory'
         },
         code: {
            order: 2,
            name: 'Code',
            type: 'Text'
         },
         sku: {
            order: 3,
            name: 'SKU',
            type: 'Formula',
            returnType: 'Text',
            expression: {"op":"++","types":["Text"],"args":[{"op":".","types":[],"args":["parent","derivedCode"]},{"op":".","types":[],"args":["code"]}]}
         }
    },
    uniqueConstraints: {
       'uc1': ['name']
    },
    assertions: {},
    lists: {
       CompanyProduct: 'company',
       MappingProductTag: 'product',
       Uom: 'product'
    }
},
CompanyProduct: {
    name: 'CompanyProduct ID',
    url: 'company-product',
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
    },
    uniqueConstraints: {
       'uc1': ['company', 'product']
    },
    assertions: {},
    lists: {}
},
ProductTagGroup: {
    name: 'ProductTagGroup ID',
    url: 'product-tag-group',
    recursive: false,
    keys: {
         name: {
            order: 0,
            name: 'Tag Group',
            type: 'Text'
         }
    },
    uniqueConstraints: {
       'uc1': ['name']
    },
    assertions: {},
    lists: {}
},
ProductTag: {
    name: 'ProductTag ID',
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
    },
    uniqueConstraints: {
       'uc1': ['group', 'name']
    },
    assertions: {},
    lists: {
       MappingProductTag: 'tag'
    }
},
MappingProductTag: {
    name: 'MappingProductTag ID',
    url: 'mapping-product-tag',
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
    },
    uniqueConstraints: {
       'uc1': ['product', 'tag']
    },
    assertions: {},
    lists: {}
},
Uom: {
    name: 'Uom ID',
    url: 'uom',
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
            order: 2,
            name: 'Conversion Rate',
            type: 'Decimal'
         }
    },
    uniqueConstraints: {
       'uc1': ['product', 'name']
    },
    assertions: {},
    lists: {}
},
Indent: {
    name: 'Indent ID',
    url: 'indent',
    recursive: false,
    keys: {

    },
    uniqueConstraints: {},
    assertions: {},
    lists: {
       IndentItem: 'indent'
    }
},
IndentItem: {
    name: 'IndentItem ID',
    url: 'indent-item',
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
            name: 'Uom',
            type: 'Uom'
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
    },
    uniqueConstraints: {
       'uc1': ['indent', 'product']
    },
    assertions: {},
    lists: {}
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
    },
    uniqueConstraints: {},
    assertions: {},
    lists: {
       QuotationItem: 'quotation'
    }
},
QuotationItem: {
    name: 'QuotationItem ID',
    url: 'quotation-item',
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
    },
    uniqueConstraints: {
       'uc1': ['quotation', 'indentItem']
    },
    assertions: {},
    lists: {}
},
PurchaseOrder: {
    name: 'PurchaseOrder ID',
    url: 'purchase-order',
    recursive: false,
    keys: {
         quotation: {
            order: 0,
            name: 'Quotation',
            type: 'Quotation'
         }
    },
    uniqueConstraints: {},
    assertions: {},
    lists: {
       PurchaseOrderItem: 'purchaseOrder'
    }
},
PurchaseOrderItem: {
    name: 'PurchaseOrderItem ID',
    url: 'purchase-order-item',
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
    },
    uniqueConstraints: {
       'uc1': ['purchaseOrder', 'quotationItem']
    },
    assertions: {},
    lists: {}
},
PurchaseInvoice: {
    name: 'PurchaseInvoice ID',
    url: 'purchase-invoice',
    recursive: false,
    keys: {
         purchaseOrder: {
            order: 0,
            name: 'Purchase Order',
            type: 'PurchaseOrder'
         }
    },
    uniqueConstraints: {},
    assertions: {},
    lists: {
       PurchaseInvoiceItem: 'purchaseInvoice'
    }
},
PurchaseInvoiceItem: {
    name: 'PurchaseInvoiceItem ID',
    url: 'purchase-invoice-item',
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
    },
    uniqueConstraints: {
       'uc1': ['purchaseInvoice', 'purchaseOrderItem']
    },
    assertions: {},
    lists: {}
},
MaterialApprovalSlip: {
    name: 'MaterialApprovalSlip ID',
    url: 'material-approval-slip',
    recursive: false,
    keys: {
         purchaseInvoice: {
            order: 0,
            name: 'Purchase Invoice',
            type: 'PurchaseInvoice'
         }
    },
    uniqueConstraints: {},
    assertions: {},
    lists: {
       MaterialApprovalSlipItem: 'materialApprovalSlip'
    }
},
MaterialApprovalSlipItem: {
    name: 'MaterialApprovalSlipItem ID',
    url: 'material-approval-slip-item',
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
    },
    uniqueConstraints: {
       'uc1': ['materialApprovalSlip', 'purchaseInvoiceItem']
    },
    assertions: {},
    lists: {}
},
MaterialRejectionSlip: {
    name: 'MaterialRejectionSlip ID',
    url: 'material-rejection-slip',
    recursive: false,
    keys: {
         purchaseInvoice: {
            order: 0,
            name: 'Purchase Invoice',
            type: 'PurchaseInvoice'
         }
    },
    uniqueConstraints: {},
    assertions: {},
    lists: {
       MaterialRejectionSlipItem: 'materialRejectionSlip'
    }
},
MaterialRejectionSlipItem: {
    name: 'MaterialRejectionSlipItem ID',
    url: 'material-rejection-slip-item',
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
    },
    uniqueConstraints: {
       'uc1': ['materialRejectionSlip', 'purchaseInvoiceItem']
    },
    assertions: {},
    lists: {}
},
MaterialReturnSlip: {
    name: 'MaterialReturnSlip ID',
    url: 'material-return-slip',
    recursive: false,
    keys: {
         materialRejectionSlip: {
            order: 0,
            name: 'Material Rejection Slip',
            type: 'MaterialRejectionSlip'
         }
    },
    uniqueConstraints: {},
    assertions: {},
    lists: {
       MaterialReturnSlipItem: 'materialReturnSlip'
    }
},
MaterialReturnSlipItem: {
    name: 'MaterialReturnSlipItem ID',
    url: 'material-return-slip-item',
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
    },
    uniqueConstraints: {
       'uc1': ['materialReturnSlip', 'materialRejectionSlipItem']
    },
    assertions: {},
    lists: {}
},
MaterialRequistionSlip: {
    name: 'MaterialRequistionSlip ID',
    url: 'material-requistion-slip',
    recursive: false,
    keys: {
         materialApprovalSlip: {
            order: 0,
            name: 'Material Approval Slip',
            type: 'MaterialApprovalSlip'
         }
    },
    uniqueConstraints: {},
    assertions: {},
    lists: {
       MaterialRequistionSlipItem: 'materialRequistionSlip'
    }
},
MaterialRequistionSlipItem: {
    name: 'MaterialRequistionSlipItem ID',
    url: 'material-requistion-slip-item',
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
    },
    uniqueConstraints: {
       'uc1': ['materialRequistionSlip', 'materialApprovalSlipItem']
    },
    assertions: {},
    lists: {}
},
Bom: {
    name: 'Bom ID',
    url: 'bom',
    recursive: false,
    keys: {
         name: {
            order: 0,
            name: 'BOM',
            type: 'Text'
         }
    },
    uniqueConstraints: {
       'uc1': ['name']
    },
    assertions: {},
    lists: {
       BomItem: 'bom'
    }
},
BomItem: {
    name: 'BomItem ID',
    url: 'bom-item',
    recursive: false,
    keys: {
         bom: {
            order: 0,
            name: 'BOM',
            type: 'Bom'
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
            name: 'Uom',
            type: 'Uom'
         }
    },
    uniqueConstraints: {
       'uc1': ['bom', 'product']
    },
    assertions: {},
    lists: {}
},
ProductionPreparationSlip: {
    name: 'ProductionPreparationSlip ID',
    url: 'production-preparation-slip',
    recursive: false,
    keys: {
         bom: {
            order: 0,
            name: 'BOM',
            type: 'Bom'
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
    },
    uniqueConstraints: {},
    assertions: {},
    lists: {
       ProductionPreparationSlipItem: 'productionPreparationSlip'
    }
},
ProductionPreparationSlipItem: {
    name: 'ProductionPreparationSlipItem ID',
    url: 'production-preparation-slip-item',
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
    },
    uniqueConstraints: {
       'uc1': ['productionPreparationSlip', 'bomItem']
    },
    assertions: {},
    lists: {}
},
ScrapMaterialSlip: {
    name: 'ScrapMaterialSlip ID',
    url: 'scrap-material-slip',
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
    },
    uniqueConstraints: {},
    assertions: {},
    lists: {}
},
TransferMaterialSlip: {
    name: 'TransferMaterialSlip ID',
    url: 'transfer-material-slip',
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
    },
    uniqueConstraints: {},
    assertions: {},
    lists: {}
},
WarehouseAcceptanceSlip: {
    name: 'WarehouseAcceptanceSlip ID',
    url: 'warehouse-acceptance-slip',
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
    },
    uniqueConstraints: {},
    assertions: {},
    lists: {}
}}