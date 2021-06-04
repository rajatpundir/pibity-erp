import { NonPrimitiveType } from './types'
import { Decimal } from './variables';

export type ProductRow = {
    readonly typeName: 'Product'
    variableName: string
    values: {
        name: Text
        orderable: Boolean
        consumable: Boolean
        producable: Boolean
    }
}

export type UOMRow = {
    readonly typeName: 'UOM'
    readonly variableName: string
    values: {
        product: Text
        name: Text
        conversionRate: Decimal
    }
}

export type IndentRow = {
    readonly typeName: 'Indent'
    readonly variableName: string
    values: {
    }
}


export type IndentItemRow = {
    readonly typeName: 'IndentItem'
    readonly variableName: string
    values: {
        indent: Text
        product: Text
        quantity: Number
        // assertion(uom.product == product && product.orderable == true && quantity > 0)
        uom: Text
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

export type SupplierRow = {
    readonly typeName: 'Supplier'
    readonly variableName: string
    values: {}
}

export type SupplierProductRow = {
    readonly typeName: 'SupplierProduct'
    readonly variableName: string
    values: {
        supplier: Text
        product: Text
    }
}

export type QuotationRow = {
    readonly typeName: 'Quotation'
    readonly variableName: string
    values: {
        indent: Text
        supplier: Text
    }
}

export type QuotationItemRow = {
    readonly typeName: 'QuotationItem'
    readonly variableName: string
    values: {
        quotation: Text
        indentItem: Text
        quantity: Number
    }
}

export type PurchaseOrderRow = {
    readonly typeName: 'PurchaseOrder'
    readonly variableName: string
    values: {
        quotation: Text
    }
}

export type PurchaseOrderItemRow = {
    readonly typeName: 'PurchaseOrderItem'
    readonly variableName: string
    values: {
        purchaseOrder: Text
        quotationItem: Text
        quantity: Number
        price: Decimal
        received: number
    }
}

export type PurchaseInvoiceRow = {
    readonly typeName: 'PurchaseInvoice'
    readonly variableName: string
    values: {
        purchaseOrder: Text
    }
}

export type PurchaseInvoiceItemRow = {
    readonly typeName: 'PurchaseInvoiceItem'
    readonly variableName: string
    values: {
        purchaseInvoice: Text
        purchaseOrderItem: Text
        quantity: Number
        approved: Number
        rejected: Number
    }
}

export type MaterialApprovalSlipRow = {
    readonly typeName: 'MaterialApprovalSlip'
    readonly variableName: string
    values: {
        purchaseInvoice: Text
    }
}

export type MaterialApprovalSlipItemRow = {
    readonly typeName: 'MaterialApprovalSlipItem'
    readonly variableName: string
    values: {
        materialApprovalSlip: Text
        purchaseInvoiceItem: Text
        quantity: Number
        requisted: Number
    }
}

export type MaterialRejectionSlipRow = {
    readonly typeName: 'MaterialRejectionSlip'
    readonly variableName: string
    values: {
        purchaseInvoice: Text
    }
}

export type MaterialRejectionSlipItemRow = {
    readonly typeName: 'MaterialRejectionSlipItem'
    readonly variableName: string
    values: {
        materialRejectionSlip: Text
        purchaseInvoiceItem: Text
        quantity: Number
        returned: Number
    }
}

export type MaterialReturnSlipRow = {
    readonly typeName: 'MaterialReturnSlip'
    readonly variableName: string
    values: {
        materialRejectionSlip: Text
    }
}

export type MaterialReturnSlipItemRow = {
    readonly typeName: 'MaterialReturnSlipItem'
    readonly variableName: string
    values: {
        materialReturnSlip: Text
        materialRejectionSlipItem: Text
        quantity: Number
    }
}

export type MaterialRequistionSlipRow = {
    readonly typeName: 'MaterialRequistionSlip'
    readonly variableName: string
    values: {
        materialApprovalSlip: Text
    }
}

export type MaterialRequistionSlipItemRow = {
    readonly typeName: 'MaterialRequistionSlipItem'
    readonly variableName: string
    values: {
        materialRequistionSlip: Text
        materialApprovalSlipItem: Text
        quantity: Number
        consumed: Number
    }
}

export type BOMRow = {
    readonly typeName: 'BOM'
    readonly variableName: string
    values: {}
}

export type BOMItemRow = {
    readonly typeName: 'BOMItem'
    readonly variableName: string
    values: {
        bom: Text
        product: Text
        quantity: Number
        uom: Text
    }
}

export type ProductionPreparationSlipRow = {
    readonly typeName: 'ProductionPreparationSlip'
    readonly variableName: string
    values: {
        bom: Text       
        approved: Number
        scrapped: Number
    }
}

export type ProductionPreparationSlipItemRow = {
    readonly typeName: 'ProductionPreparationSlipItem'
    readonly variableName: string
    values: {
        productionPreparationSlip: Text
        bomItem : Text       
        materialRequistionSlipItem: Text
        scrapped: Number
    }
}

export type ScrapMaterialSlipRow = {
    readonly typeName: 'ScrapMaterialSlip'
    readonly variableName: string
    values: {
        productionPreparationSlip: Text      
        quantity: Number
    }
}

export type TransferMaterialSlipRow = {
    readonly typeName: 'TransferMaterialSlip'
    readonly variableName: string
    values: {
        productionPreparationSlip: Text      
        quantity: Number
        transferred: Number
    }
}

export type WarehouseAcceptanceSlipRow = {
    readonly typeName: 'WarehouseAcceptanceSlip'
    readonly variableName: string
    values: {
        transferMaterialSlip: Text      
        quantity: Number        
    }
}
