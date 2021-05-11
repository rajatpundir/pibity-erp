import { Newtype, iso } from 'newtype-ts'

// Primitive Types
export type Text = string
export type Number = bigint
export type Decimal = number
export type Boolean = boolean
export type Date = bigint
export type Timestamp = bigint
export type Time = bigint
export type Formula = string

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

type Types = {
    [index: string]: {
        keys: {
            [index: string]: {
                order: number
                type: KeyType
            }
        }
    }
}

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

export interface Variable {
    typeName: string
    variableName: any
    values: object
}

export interface Product extends Newtype<{ readonly Product: unique symbol }, string> { }
export const isoProduct = iso<Product>()
export interface ProductVariable extends Variable {
    typeName: 'Product'
    variableName: Product
    values: {
        // UNQ(SKU)
        name: Text
        orderable: Boolean
        consumable: Boolean
        producable: Boolean
    }
}

export interface UOM extends Newtype<{ readonly UOM: unique symbol }, string> { }
export const isoUOM = iso<UOM>()
export interface UOMVariable extends Variable {
    typeName: 'UOM'
    variableName: UOM
    values: {
        // UNQ(product, name)
        product: Product
        name: Text
        conversionRate: Decimal
    }
}

export interface Indent extends Newtype<{ readonly Indent: unique symbol }, string> { }
export const isoIndent = iso<Indent>()
export interface IndentVariable extends Variable {
    typeName: 'Indent'
    variableName: Indent
    values: {
        timestamp: Timestamp // redundant field
        // subspace: Subspace
        // approver: Subspace
        approved: Boolean
    }
}

export interface IndentItem extends Newtype<{ readonly IndentItem: unique symbol }, string> { }
export const isoIndentItem = iso<IndentItem>()
export interface IndentItemVariable extends Variable {
    typeName: 'IndentItem'
    variableName: IndentItem
    values: {
        // UNQ(indent, product)
        indent: Indent
        product: Product
        quantity: Number
        // assertion(uom.product == product && product.orderable == true && quantity > 0)
        uom: UOM
        // assertion((ordered - rejected) <= quantity && (ordered - rejected) >= 0)
        // assertion(ordered >= 0 && received >=0 && approved >= 0 && rejected >= 0 && returned >= 0 && requisted >= 0 && consumed >= 0)
        ordered: Number
        // assertion(received <= ordered)
        received: Number
        // assertion((approved + rejected) <= received)
        approved: Number
        rejected: Number
        // assertion(returned <= rejected)
        returned: Number
        // assertion(requisted <= approved)
        requisted: Number
        // assertion(consumed <= requisted)
        consumed: Number
    }
}

export interface Supplier extends Newtype<{ readonly Supplier: unique symbol }, string> { }
export const isoSupplier = iso<Supplier>()
export interface SupplierVariable extends Variable {
    typeName: 'Supplier'
    variableName: Supplier
    values: {

    }
}

export interface SupplierProduct extends Newtype<{ readonly SupplierProduct: unique symbol }, string> { }
export const isoSupplierProduct = iso<SupplierProduct>()
export interface SupplierProductVariable extends Variable {
    typeName: 'SupplierProduct'
    variableName: SupplierProduct
    values: {
        // UNQ(supplier, product)
        supplier: Supplier
        product: Product
    }
}

export interface Quotation extends Newtype<{ readonly Quotation: unique symbol }, string> { }
export const isoQuotation = iso<Quotation>()
export interface QuotationVariable extends Variable {
    typeName: 'Quotation'
    variableName: Quotation
    values: {
        indent: Indent
        supplier: Supplier
    }
}

export interface QuotationItem extends Newtype<{ readonly QuotationItem: unique symbol }, string> { }
export const isoQuotationItem = iso<QuotationItem>()
export interface QuotationItemVariable extends Variable {
    typeName: 'QuotationItem'
    variableName: QuotationItem
    values: {
        // UNQ(quotation, indentItem)
        quotation: Quotation
        // assertion(quotation.indent == indentItem.indent)
        indentItem: IndentItem
        // assertion(quantity <= (indentItem.quantity - (ordered - rejected)) && quantity > 0)
        quantity: Number
    }
}

export interface PurchaseOrder extends Newtype<{ readonly PurchaseOrder: unique symbol }, string> { }
export const isoPurchaseOrder = iso<PurchaseOrder>()
export interface PurchaseOrderVariable extends Variable {
    typeName: 'PurchaseOrder'
    variableName: PurchaseOrder
    values: {
        quotation: Quotation
    }
}

export interface PurchaseOrderItem extends Newtype<{ readonly PurchaseOrderItem: unique symbol }, string> { }
export const isoPurchaseOrderItem = iso<PurchaseOrderItem>()
export interface PurchaseOrderItemVariable extends Variable {
    typeName: 'PurchaseOrderItem'
    variableName: PurchaseOrderItem
    values: {
        // UNQ(purchaseOrder, quotationItem)
        purchaseOrder: PurchaseOrder
        // assertion(purchaseOrder.quotation == quotationItem.quotation)
        quotationItem: QuotationItem
        // assertion(quantity <= quotationItem.quantity && quantity > 0)
        quantity: Number // { quotationItem.indentItem.ordered += quantity }
        price: Decimal
        // assertion(received >= 0 && received <= quantity)
        received: Number
    }
}

export interface PurchaseInvoice extends Newtype<{ readonly PurchaseInvoice: unique symbol }, string> { }
export const isoPurchaseInvoice = iso<PurchaseInvoice>()
export interface PurchaseInvoiceVariable extends Variable {
    typeName: 'PurchaseInvoice'
    variableName: PurchaseInvoice
    values: {
        purchaseOrder: PurchaseOrder
    }
}

export interface PurchaseInvoiceItem extends Newtype<{ readonly PurchaseInvoiceItem: unique symbol }, string> { }
export const isoPurchaseInvoiceItem = iso<PurchaseInvoiceItem>()
export interface PurchaseInvoiceItemVariable extends Variable {
    typeName: 'PurchaseInvoiceItem'
    variableName: PurchaseInvoiceItem
    values: {
        // UNQ(purchaseInvoice, purchaseOrderItem)
        purchaseInvoice: PurchaseInvoice
        // assertion(purchaseInvoice.purchaseOrder == purchaseOrderItem.purchaseOrder)
        purchaseOrderItem: PurchaseOrderItem
        // assertion(quantity <= purchaseOrderItem.quantity && quantity > 0)
        quantity: Number // { purchaseOrderItem.received += quantity && purchaseOrderItem.quotationOrderItem.indentOrderItem.received += quantity }
        // assertion((approved + rejected) <= quantity && approved >= 0 && rejeted >= 0)
        approved: Number
        rejected: Number
    }
}

export interface MaterialApprovalSlip extends Newtype<{ readonly MaterialApprovalSlip: unique symbol }, string> { }
export const isoMaterialApprovalSlip = iso<MaterialApprovalSlip>()
export interface MaterialApprovalSlipVariable extends Variable {
    typeName: 'MaterialApprovalSlip'
    variableName: MaterialApprovalSlip
    values: {
        purchaseInvoice: PurchaseInvoice
    }
}

export interface MaterialApprovalSlipItem extends Newtype<{ readonly MaterialApprovalSlipItem: unique symbol }, string> { }
export const isoMaterialApprovalSlipItem = iso<MaterialApprovalSlipItem>()
export interface MaterialApprovalSlipItemVariable extends Variable {
    typeName: 'MaterialApprovalSlipItem'
    variableName: MaterialApprovalSlipItem
    values: {
        // UNQ(materialApprovalSlip, purchaseInvoiceItem)
        materialApprovalSlip: MaterialApprovalSlip
        // assertion(materialApprovalSlip.purchaseInvoice == purchaseInvoiceItem.purchaseInvoice)
        purchaseInvoiceItem: PurchaseInvoiceItem
        // assertion(quantity <= purchaseInvoiceItem.quantity && quantity > 0)
        quantity: Number // { purchaseInvoiceItem.approved += quantity && purchaseInvoiceItem.purchaseOrderItem.quotationItem.indentItem.approved += quantity }
        // assertion(requisted <= quantity && requisted >= 0)
        requisted: Number
    }
}

export interface MaterialRejectionSlip extends Newtype<{ readonly MaterialRejectionSlip: unique symbol }, string> { }
export const isoMaterialRejectionSlip = iso<MaterialRejectionSlip>()
export interface MaterialRejectionSlipVariable extends Variable {
    typeName: 'MaterialRejectionSlip'
    variableName: MaterialRejectionSlip
    values: {
        purchaseInvoice: PurchaseInvoice
    }
}

export interface MaterialRejectionSlipItem extends Newtype<{ readonly MaterialRejectionSlipItem: unique symbol }, string> { }
export const isoMaterialRejectionSlipItem = iso<MaterialRejectionSlipItem>()
export interface MaterialRejectionSlipItemVariable extends Variable {
    typeName: 'MaterialRejectionSlipItem'
    variableName: MaterialRejectionSlipItem
    values: {
        // UNQ(materialRejectionSlip, purchaseInvoiceItem)
        materialRejectionSlip: MaterialRejectionSlip
        // assertion(materialRejectionSlip.purchaseInvoice == purchaseInvoiceItem.purchaseInvoice)
        purchaseInvoiceItem: PurchaseInvoiceItem
        // assertion(quantity <= purchaseInvoiceItem.quantity && quantity > 0)
        quantity: Number // { purchaseInvoiceItem.rejected += quantity && purchaseInvoiceItem.purchaseOrderItem.quotationItem.indentItem.rejected += quantity  }
        // assertion(returned <= quantity && returned >= 0)
        returned: Number
    }
}

export interface MaterialReturnSlip extends Newtype<{ readonly MaterialReturnSlip: unique symbol }, string> { }
export const isoMaterialReturnSlip = iso<MaterialReturnSlip>()
export interface MaterialReturnSlipVariable extends Variable {
    typeName: 'MaterialReturnSlip'
    variableName: MaterialReturnSlip
    values: {
        materialRejectionSlip: MaterialRejectionSlip
    }
}

export interface MaterialReturnSlipItem extends Newtype<{ readonly MaterialReturnSlipItem: unique symbol }, string> { }
export const isoMaterialReturnSlipItem = iso<MaterialReturnSlipItem>()
export interface MaterialReturnSlipItemVariable extends Variable {
    typeName: 'MaterialReturnSlipItem'
    variableName: MaterialReturnSlipItem
    values: {
        // UNQ(materialReturnSlip, materialRejectionSlipItem)
        materialReturnSlip: MaterialReturnSlip
        // assertion(materialReturnSlip.materialRejectionSlip == materialRejectionSlipItem.materialRejectionSlip)
        materialRejectionSlipItem: MaterialReturnSlipItem
        // assertion(quantity <= materialRejectionSlipItem.quantity && quantity > 0)
        quantity: Number // { materialRejectionSlipItem.returned += quantity && materialRejectionSlipItem.purchaseInvoiceItem.purchaseOrderItem.quotationItem.indentItem.returned += quantity }
    }
}

export interface MaterialRequistionSlip extends Newtype<{ readonly MaterialRequistionSlip: unique symbol }, string> { }
export const isoMaterialRequistionSlip = iso<MaterialRequistionSlip>()
export interface MaterialRequistionSlipVariable extends Variable {
    typeName: 'MaterialRequistionSlip'
    variableName: MaterialRequistionSlip
    values: {
        materialApprovalSlip: MaterialApprovalSlip
    }
}

export interface MaterialRequistionSlipItem extends Newtype<{ readonly MaterialRequistionSlipItem: unique symbol }, string> { }
export const isoMaterialRequistionSlipItem = iso<MaterialRequistionSlipItem>()
export interface MaterialRequistionSlipItemVariable extends Variable {
    typeName: 'MaterialRequistionSlipItem'
    variableName: MaterialRequistionSlipItem
    values: {
        // UNQ(materialRequistionSlip, materialApprovalSlipItem)
        materialRequistionSlip: MaterialRequistionSlip
        // assertion(materialRequistionSlip.materialApprovalSlip == materialApprovalSlipItem.materialApprovalSlip)
        materialApprovalSlipItem: MaterialApprovalSlipItem
        // assertion(quantity <= materialApprovalSlipItem.quantity && quantity > 0)
        quantity: Number // { materialApprovalSlipItem.requisted += quantity && materialApprovalSlipItem.purchaseInvoiceItem.purchaseOrderItem.quotationItem.indentItem.requisted += quantity }
        // assertion(consumed <= quantity && consumed >= 0)
        consumed: Number
    }
}

export interface BOM extends Newtype<{ readonly BOM: unique symbol }, string> { }
export const isoBOM = iso<BOM>()
export interface BOMVariable extends Variable {
    typeName: 'BOM'
    variableName: BOM
    values: {
        // assertion(product.producable == true)
        product: Product
        quantity: Number
        // assertion(uom.product == product)
        uom: UOM
    }
}

export interface BOMItem extends Newtype<{ readonly BOMItem: unique symbol }, string> { }
export const isoBOMItem = iso<BOMItem>()
export interface BOMItemVariable extends Variable {
    typeName: 'BOMItem'
    variableName: BOMItem
    values: {
        // UNQ(bom, product)
        bom: BOM
        // assertion(product.consumable == true)
        product: Product
        // assertion(quantity > 0 && uom.product == product)
        quantity: Number
        uom: UOM
    }
}

export interface ProductionPreparationSlip extends Newtype<{ readonly ProductionPreparationSlip: unique symbol }, string> { }
export const isoProductionPreparationSlip = iso<ProductionPreparationSlip>()
export interface ProductionPreparationSlipVariable extends Variable {
    typeName: 'ProductionPreparationSlip'
    variableName: ProductionPreparationSlip
    values: {
        bom: BOM
        // assertion((approved + scrapped) <= quantity && approved >= 0 && scrapped >= 0)
        approved: Number
        scrapped: Number
    }
}

export interface ProductionPreparationSlipItem extends Newtype<{ readonly ProductionPreparationSlipItem: unique symbol }, string> { }
export const isoProductionPreparationSlipItem = iso<ProductionPreparationSlipItem>()
export interface ProductionPreparationSlipItemVariable extends Variable {
    typeName: 'ProductionPreparationSlipItem'
    variable: ProductionPreparationSlipItem
    values: {
        // UNQ(productionPreparationSlip, bomItem)
        productionPreparationSlip: ProductionPreparationSlip
        bomItem: string
        // assertion(bomItem.product == materialRequistionSlipItem.materialApprovalSlipItem.purchaseInvoiceItem.purchaseOrderItem.quotationItem.indentItem.product)
        materialRequistionSlipItem: MaterialRequistionSlipItem
        // { materialRequistionSlipItem.consumed += bomItem.quantity * materialRequistionSlipItem.materialApprovalSlipItem.purchaseInvoiceItem.purchaseOrderItem.quotationItem.indentItem.uom.conversionRate / bomItem.product.uom.conversionRate }
        // { materialRequistionSlipItem.materialApprovalSlipItem.purchaseInvoiceItem.purchaseOrderItem.quotationItem.indentItem.consumed += bomItem.quantity * materialRequistionSlipItem.materialApprovalSlipItem.purchaseInvoiceItem.purchaseOrderItem.quotationItem.indentItem.uom.conversionRate / bomItem.product.uom.conversionRate }
    }
}

export interface ScrapMaterialSlip extends Newtype<{ readonly ScrapMaterialSlip: unique symbol }, string> { }
export const isoScrapMaterialSlip = iso<ScrapMaterialSlip>()
export interface ScrapMaterialSlipVariable extends Variable {
    typeName: 'ScrapMaterialSlip'
    variable: ScrapMaterialSlip
    values: {
        productionPreparationSlip: ProductionPreparationSlip
        // assertion(quantity <= productionPreparationSlip.bom.quantity && quantity > 0)
        quantity: Number // { productionPreparationSlip.scrapped += quantity }
    }
}

export interface TransferMaterialSlip extends Newtype<{ readonly TransferMaterialSlip: unique symbol }, string> { }
export const isoTransferMaterialSlip = iso<TransferMaterialSlip>()
export interface TransferMaterialSlipVariable extends Variable {
    typeName: 'TransferMaterialSlip'
    variable: TransferMaterialSlip
    values: {
        productionPreparationSlip: ProductionPreparationSlip
        // assertion(quantity <= productionPreparationSlip.bom.quantity && quantity > 0)
        quantity: Number // { productionPreparationSlip.approved += quantity }
        // assertion(transfered <= quantity && transfered >= 0)
        transfered: Number
    }
}

export interface WarehouseAcceptanceSlip extends Newtype<{ readonly WarehouseAcceptanceSlip: unique symbol }, string> { }
export const isoWarehouseAcceptanceSlip = iso<WarehouseAcceptanceSlip>()
export interface WarehouseAcceptanceSlipVariable extends Variable {
    typeName: 'WarehouseAcceptanceSlip'
    variableName: WarehouseAcceptanceSlip
    values: {
        transferMaterialSlip: TransferMaterialSlip
        // assertion(quantity <= transferMaterialSlip.quantity && quantity > 0)
        quantity: Number // { transferMaterialSlip.transfered += quantity }
    }
}

