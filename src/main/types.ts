

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
    | 'Product'
    | 'UOM'
    | 'Indent'
    | 'IndentItem'
    | 'Supplier'
    | 'SupplierProduct'
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
    keys: Record<string, Key>
}

export const types: Record<NonPrimitiveType, Type> = {
    Product: {
        name: 'Product',
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
        keys: {
            approved: {
                order: 0,
                name: 'Approved',
                type: 'Boolean'
            }
        }
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
                name: 'Quality',
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
            returned: {
                order: 7,
                name: 'Returned',
                type: 'Number'
            },
            requisted: {
                order: 8,
                name: 'Requisted',
                type: 'Number'
            },
            consumed: {
                order: 9,
                name: 'Consumed',
                type: 'Number'
            }
        }
    },
    Supplier: {
        name: 'Supplier',
        keys: {}
    },
    SupplierProduct: {
        name: 'Supplier Product',
        keys: {
            supplier: {
                order: 0,
                name: 'Supplier',
                type: 'Supplier'
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
        keys: {
            indent: {
                order: 0,
                name: 'Indent',
                type: 'Indent'
            },
            supplier: {
                order: 1,
                name: 'Supplier',
                type: 'Supplier'
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
            approved: {
                order: 2,
                name: 'Approved',
                type: 'Number'
            },
            rejected: {
                order: 3,
                name: 'Rejected',
                type: 'Number'
            }
        }
    },
    MaterialApprovalSlip: {
        name: 'Material Approval Slip',
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
        name: 'Material Return Slip',
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
                name: 'Material Return Slip Item',
                type: 'MaterialReturnSlipItem'
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
        name: 'BOM',
        keys: {
            product: {
                order: 0,
                name: 'Product',
                type: 'Product'
            },
            quantity: {
                order: 1,
                name: 'Quantity',
                type: 'Number'
            },
            uom: {
                order: 2,
                name: 'uom',
                type: 'UOM'
            }
        }
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
        name: 'TransferMaterialSlip',
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
            transfered: {
                order: 2,
                name: 'Transfered',
                type: 'Number'
            }
        }
    },
    WarehouseAcceptanceSlip: {
        name: 'Warehouse Acceptance Slip',
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
