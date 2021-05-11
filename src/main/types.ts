
type KeyType =
    | 'Text'
    | 'Number'
    | 'Decimal'
    | 'Boolean'
    | 'Date'
    | 'Timestamp'
    | 'Time'
    | 'Formula'
    | 'Blob'

    | 'Product'
    | 'UOM'
    | 'Indent'
    | 'IndentItem'
    | 'Supplier'
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
    type: KeyType
}

type Type = {
    keys: {
        [index: string]: Key
    }
}

type Types = { [index: string]: Type }

export const types: Types = {
    Product: {
        keys: {
            name: {
                order: 0,
                type: 'Text'
            },
            orderable: {
                order: 1,
                type: 'Boolean'
            },
            consumable: {
                order: 2,
                type: 'Boolean'
            },
            producable: {
                order: 3,
                type: 'Boolean'
            }
        }
    },
    UOM: {
        keys: {
            product: {
                order: 0,
                type: 'Product'
            },
            name: {
                order: 1,
                type: 'Text'
            },
            conversionRate: {
                order: 3,
                type: 'Decimal'
            }
        }
    },
    Indent: {
        keys: {
            approved: {
                order: 0,
                type: 'Boolean'
            }
        }
    },
    IndentItem: {
        keys: {
            indent: {
                order: 0,
                type: 'Indent'
            },
            product: {
                order: 1,
                type: 'Product'
            },
            quantity: {
                order: 2,
                type: 'Number'
            },
            uom: {
                order: 3,
                type: 'UOM'
            },
            ordered: {
                order: 4,
                type: 'Number'
            },
            received: {
                order: 5,
                type: 'Number'
            },
            approved: {
                order: 6,
                type: 'Number'
            },
            returned: {
                order: 7,
                type: 'Number'
            },
            requisted: {
                order: 8,
                type: 'Number'
            },
            consumed: {
                order: 9,
                type: 'Number'
            }
        }
    },
    Supplier: {
        keys: {}
    },
    SupplierProduct: {
        keys: {
            supplier: {
                order: 0,
                type: 'Supplier'
            },
            product: {
                order: 1,
                type: 'Product'
            }
        }
    },
    Quotation: {
        keys: {
            indent: {
                order: 0,
                type: 'Indent'
            },
            supplier: {
                order: 1,
                type: 'Supplier'
            }
        }
    },
    QuotationItem: {
        keys: {
            quotation: {
                order: 0,
                type: 'Quotation'
            },
            indentItem: {
                order: 1,
                type: 'IndentItem'
            },
            quantity: {
                order: 2,
                type: 'Number'
            }
        }
    },
    PurchaseOrder: {
        keys: {
            quotation: {
                order: 0,
                type: 'Quotation'
            }
        }
    },
    PurchaseOrderItem: {
        keys: {
            purchaseOrder: {
                order: 0,
                type: 'PurchaseOrder'
            },
            quotationItem: {
                order: 1,
                type: 'QuotationItem'
            },
            quantity: {
                order: 2,
                type: 'Number'
            },
            price: {
                order: 3,
                type: 'Decimal'
            },
            received: {
                order: 4,
                type: 'Number'
            }
        }
    },
    PurchaseInvoice: {
        keys: {
            purchaseOrder: {
                order: 0,
                type: 'PurchaseOrder'
            }
        }
    },
    PurchaseInvoiceItem: {
        keys: {
            purchaseInvoice: {
                order: 0,
                type: 'PurchaseInvoice'
            },
            purchaseOrderItem: {
                order: 1,
                type: 'PurchaseOrderItem'
            },
            approved: {
                order: 2,
                type: 'Number'
            },
            rejected: {
                order: 3,
                type: 'Number'
            }
        }
    },
    MaterialApprovalSlip: {
        keys: {
            purchaseInvoice: {
                order: 0,
                type: 'PurchaseInvoice'
            }
        }
    },
    MaterialApprovalSlipItem: {
        keys: {
            materialApprovalSlip: {
                order: 0,
                type: 'MaterialApprovalSlip'
            },
            purchaseInvoiceItem: {
                order: 1,
                type: 'PurchaseInvoiceItem'
            },
            quantity: {
                order: 2,
                type: 'Number'
            },
            requisted: {
                order: 3,
                type: 'Number'
            }
        }
    },
    MaterialRejectionSlip: {
        keys: {
            purchaseInvoice: {
                order: 0,
                type: 'PurchaseInvoice'
            }
        }
    },
    MaterialRejectionSlipItem: {
        keys: {
            materialRejectionSlip: {
                order: 0,
                type: 'MaterialRejectionSlip'
            },
            purchaseInvoiceItem: {
                order: 1,
                type: 'PurchaseInvoiceItem'
            },
            quantity: {
                order: 2,
                type: 'Number'
            },
            returned: {
                order: 3,
                type: 'Number'
            }
        }
    },
    MaterialReturnSlip: {
        keys: {
            materialRejectionSlip: {
                order: 0,
                type: 'MaterialRejectionSlip'
            }
        }
    },
    MaterialReturnSlipItem: {
        keys: {
            materialReturnSlip: {
                order: 0,
                type: 'MaterialReturnSlip'
            },
            materialRejectionSlipItem: {
                order: 1,
                type: 'MaterialReturnSlipItem'
            },
            quantity: {
                order: 2,
                type: 'Number'
            }
        }
    },
    MaterialRequistionSlip: {
        keys: {
            materialApprovalSlip: {
                order: 0,
                type: 'MaterialApprovalSlip'
            }
        }
    },
    MaterialRequistionSlipItem: {
        keys: {
            materialRequistionSlip: {
                order: 0,
                type: 'MaterialRequistionSlip'
            },
            materialApprovalSlipItem: {
                order: 1,
                type: 'MaterialApprovalSlipItem'
            },
            quantity: {
                order: 2,
                type: 'Number'
            },
            consumed: {
                order: 3,
                type: 'Number'
            }
        }
    },
    BOM: {
        keys: {
            product: {
                order: 0,
                type: 'Product'
            },
            quantity: {
                order: 1,
                type: 'Number'
            },
            uom: {
                order: 2,
                type: 'UOM'
            }
        }
    },
    BOMItem: {
        keys: {
            bom: {
                order: 0,
                type: 'BOM'
            },
            product: {
                order: 1,
                type: 'Product'
            },
            quantity: {
                order: 2,
                type: 'Number'
            },
            uom: {
                order: 3,
                type: 'UOM'
            }
        }
    },
    ProductionPreparationSlip: {
        keys: {
            bom: {
                order: 0,
                type: 'BOM'
            },
            approved: {
                order: 1,
                type: 'Number'
            },
            scrapped: {
                order: 2,
                type: 'Number'
            }
        }
    },
    ProductionPreparationSlipItem: {
        keys: {
            productionPreparationSlip: {
                order: 0,
                type: 'ProductionPreparationSlip'
            },
            bomItem: {
                order: 1,
                type: 'Text'
            },
            materialRequistionSlipItem: {
                order: 2,
                type: 'MaterialRequistionSlipItem'
            }
        }
    },
    ScarpMaterialSlip: {
        keys: {
            productionPreparationSlip: {
                order: 0,
                type: 'ProductionPreparationSlip'
            },
            quantity: {
                order: 1,
                type: 'Number'
            }
        }
    },
    TransferMaterialSlip: {
        keys: {
            productionPreparationSlip: {
                order: 0,
                type: 'ProductionPreparationSlip'
            },
            quantity: {
                order: 1,
                type: 'Number'
            },
            transfered: {
                order: 2,
                type: 'Number'
            }
        }
    },
    WarehouseAcceptanceSlip: {
        keys: {
            transferMaterialSlip: {
                order: 0,
                type: 'TransferMaterialSlip'
            },
            quantity: {
                order: 1,
                type: 'Number'
            }
        }
    }

}
