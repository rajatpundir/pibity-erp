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

export type Variable = 
| ProductVariable
| UOMVariable
| IndentVariable
| IndentItemVariable
| SupplierVariable
| SupplierProductVariable
| QuotationVariable
| QuotationItemVariable
| PurchaseOrderVariable
| PurchaseOrderItemVariable
| PurchaseInvoiceVariable
| PurchaseInvoiceItemVariable
| MaterialApprovalSlipVariable
| MaterialApprovalSlipItemVariable
| MaterialRejectionSlipVariable
| MaterialRejectionSlipItemVariable
| MaterialReturnSlipVariable
| MaterialReturnSlipItemVariable
| MaterialRequistionSlipVariable
| MaterialRequistionSlipItemVariable
| BOMVariable
| BOMItemVariable
| ProductionPreparationSlipVariable
| ProductionPreparationSlipItemVariable
| ScrapMaterialSlipVariable
| TransferMaterialSlipVariable
| WarehouseAcceptanceSlipVariable

// type VariableName =
// | Product
// | UOM
// | Indent
// | IndentItem
// | Supplier
// | SupplierProduct
// | Quotation
// | QuotationItem
// | PurchaseOrder
// | PurchaseOrderItem
// | PurchaseInvoice
// | PurchaseInvoiceItem
// | MaterialApprovalSlip
// | MaterialApprovalSlipItem
// | MaterialRejectionSlip
// | MaterialRejectionSlipItem
// | MaterialReturnSlip
// | MaterialReturnSlipItem
// | MaterialRequistionSlip
// | MaterialRequistionSlipItem
// | BOM
// | BOMItem
// | ProductionPreparationSlip
// | ProductionPreparationSlipItem
// | ScrapMaterialSlip
// | TransferMaterialSlip
// | WarehouseAcceptanceSlip

export interface Product extends Newtype<{ readonly Product: unique symbol }, string> { }
export interface ProductVariable {
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
export interface UOMVariable {
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
export interface IndentVariable {
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
export interface IndentItemVariable {
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
export interface SupplierVariable {
    typeName: 'Supplier'
    variableName: Supplier
    values: {

    }
}

export interface SupplierProduct extends Newtype<{ readonly SupplierProduct: unique symbol }, string> { }
export interface SupplierProductVariable {
    typeName: 'SupplierProduct'
    variableName: SupplierProduct
    values: {
        // UNQ(supplier, product)
        supplier: Supplier
        product: Product
    }
}

export interface Quotation extends Newtype<{ readonly Quotation: unique symbol }, string> { }
export interface QuotationVariable {
    typeName: 'Quotation'
    variableName: Quotation
    values: {
        indent: Indent
        supplier: Supplier
    }
}

export interface QuotationItem extends Newtype<{ readonly QuotationItem: unique symbol }, string> { }
export interface QuotationItemVariable {
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
export interface PurchaseOrderVariable {
    typeName: 'PurchaseOrder'
    variableName: PurchaseOrder
    values: {
        quotation: Quotation
    }
}

export interface PurchaseOrderItem extends Newtype<{ readonly PurchaseOrderItem: unique symbol }, string> { }
export interface PurchaseOrderItemVariable {
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
export interface PurchaseInvoiceVariable {
    typeName: 'PurchaseInvoice'
    variableName: PurchaseInvoice
    values: {
        purchaseOrder: PurchaseOrder
    }
}

export interface PurchaseInvoiceItem extends Newtype<{ readonly PurchaseInvoiceItem: unique symbol }, string> { }
export interface PurchaseInvoiceItemVariable {
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
export interface MaterialApprovalSlipVariable {
    typeName: 'MaterialApprovalSlip'
    variableName: MaterialApprovalSlip
    values: {
        purchaseInvoice: PurchaseInvoice
    }
}

export interface MaterialApprovalSlipItem extends Newtype<{ readonly MaterialApprovalSlipItem: unique symbol }, string> { }
export interface MaterialApprovalSlipItemVariable {
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
export interface MaterialRejectionSlipVariable {
    typeName: 'MaterialRejectionSlip'
    variableName: MaterialRejectionSlip
    values: {
        purchaseInvoice: PurchaseInvoice
    }
}

export interface MaterialRejectionSlipItem extends Newtype<{ readonly MaterialRejectionSlipItem: unique symbol }, string> { }
export interface MaterialRejectionSlipItemVariable {
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
export interface MaterialReturnSlipVariable {
    typeName: 'MaterialReturnSlip'
    variableName: MaterialReturnSlip
    values: {
        materialRejectionSlip: MaterialRejectionSlip
    }
}

export interface MaterialReturnSlipItem extends Newtype<{ readonly MaterialReturnSlipItem: unique symbol }, string> { }
export interface MaterialReturnSlipItemVariable {
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
export interface MaterialRequistionSlipVariable {
    typeName: 'MaterialRequistionSlip'
    variableName: MaterialRequistionSlip
    values: {
        materialApprovalSlip: MaterialApprovalSlip
    }
}

export interface MaterialRequistionSlipItem extends Newtype<{ readonly MaterialRequistionSlipItem: unique symbol }, string> { }
export interface MaterialRequistionSlipItemVariable {
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
export interface BOMVariable {
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
export interface BOMItemVariable {
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
export interface ProductionPreparationSlipVariable {
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
export interface ProductionPreparationSlipItemVariable {
    typeName: 'ProductionPreparationSlipItem'
    variableName: ProductionPreparationSlipItem
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
export interface ScrapMaterialSlipVariable {
    typeName: 'ScrapMaterialSlip'
    variableName: ScrapMaterialSlip
    values: {
        productionPreparationSlip: ProductionPreparationSlip
        // assertion(quantity <= productionPreparationSlip.bom.quantity && quantity > 0)
        quantity: Number // { productionPreparationSlip.scrapped += quantity }
    }
}

export interface TransferMaterialSlip extends Newtype<{ readonly TransferMaterialSlip: unique symbol }, string> { }
export interface TransferMaterialSlipVariable {
    typeName: 'TransferMaterialSlip'
    variableName: TransferMaterialSlip
    values: {
        productionPreparationSlip: ProductionPreparationSlip
        // assertion(quantity <= productionPreparationSlip.bom.quantity && quantity > 0)
        quantity: Number // { productionPreparationSlip.approved += quantity }
        // assertion(transfered <= quantity && transfered >= 0)
        transfered: Number
    }
}

export interface WarehouseAcceptanceSlip extends Newtype<{ readonly WarehouseAcceptanceSlip: unique symbol }, string> { }
export interface WarehouseAcceptanceSlipVariable {
    typeName: 'WarehouseAcceptanceSlip'
    variableName: WarehouseAcceptanceSlip
    values: {
        transferMaterialSlip: TransferMaterialSlip
        // assertion(quantity <= transferMaterialSlip.quantity && quantity > 0)
        quantity: Number // { transferMaterialSlip.transfered += quantity }
    }
}

export const isoVariableName = {
    'Product': iso<Product>(),
    'UOM': iso<UOM>(),
    'Indent': iso<Indent>(),
    'IndentItem': iso<IndentItem>(),
    'Supplier': iso<Supplier>(),
    'SupplierProduct': iso<SupplierProduct>(),
    'Quotation': iso<Quotation>(),
    'QuotationItem': iso<QuotationItem>(),
    'PurchaseOrder': iso<PurchaseOrder>(),
    'PurchaseOrderItem': iso<PurchaseOrderItem>(),
    'PurchaseInvoice': iso<PurchaseInvoice>(),
    'PurchaseInvoiceItem': iso<PurchaseInvoiceItem>(),
    'MaterialApprovalSlip': iso<MaterialApprovalSlip>(),
    'MaterialApprovalSlipItem': iso<MaterialApprovalSlipItem>(),
    'MaterialRejectionSlip': iso<MaterialRejectionSlip>(),
    'MaterialRejectionSlipItem': iso<MaterialRejectionSlipItem>(),
    'MaterialReturnSlip': iso<MaterialReturnSlip>(),
    'MaterialReturnSlipItem': iso<MaterialReturnSlipItem>(),
    'MaterialRequistionSlip': iso<MaterialRequistionSlip>(),
    'MaterialRequistionSlipItem': iso<MaterialRequistionSlipItem>(),
    'BOM': iso<BOM>(),
    'BOMItem': iso<BOMItem>(),
    'ProductionPreparationSlip': iso<ProductionPreparationSlip>(),
    'ProductionPreparationSlipItem': iso<ProductionPreparationSlipItem>(),
    'ScrapMaterialSlip': iso<ScrapMaterialSlip>(),
    'TransferMaterialSlip': iso<TransferMaterialSlip>(),
    'WarehouseAcceptanceSlip': iso<WarehouseAcceptanceSlip>()
}

export function getVariableName(variable: Variable): string {
    switch (variable.typeName) {
        case 'Product': return iso<Product>().unwrap(variable.variableName)
        case 'UOM': return iso<UOM>().unwrap(variable.variableName)
        case 'Indent': return iso<Indent>().unwrap(variable.variableName)
        case 'IndentItem': return iso<IndentItem>().unwrap(variable.variableName)
        case 'SupplierProduct': return iso<SupplierProduct>().unwrap(variable.variableName)
        case 'Supplier': return iso<Supplier>().unwrap(variable.variableName)
        case 'Quotation': return iso<Quotation>().unwrap(variable.variableName)
        case 'QuotationItem': return iso<QuotationItem>().unwrap(variable.variableName)
        case 'PurchaseOrder': return iso<PurchaseOrder>().unwrap(variable.variableName)
        case 'PurchaseOrderItem': return iso<PurchaseOrderItem>().unwrap(variable.variableName)
        case 'PurchaseInvoice': return iso<PurchaseInvoice>().unwrap(variable.variableName)
        case 'PurchaseInvoiceItem': return iso<PurchaseInvoiceItem>().unwrap(variable.variableName)
        case 'MaterialApprovalSlip': return iso<MaterialApprovalSlip>().unwrap(variable.variableName)
        case 'MaterialApprovalSlipItem': return iso<MaterialApprovalSlipItem>().unwrap(variable.variableName)
        case 'MaterialRejectionSlip': return iso<MaterialRejectionSlip>().unwrap(variable.variableName)
        case 'MaterialRejectionSlipItem': return iso<MaterialRejectionSlipItem>().unwrap(variable.variableName)
        case 'MaterialReturnSlip': return iso<MaterialReturnSlip>().unwrap(variable.variableName)
        case 'MaterialReturnSlipItem': return iso<MaterialReturnSlipItem>().unwrap(variable.variableName)
        case 'MaterialRequistionSlip': return iso<MaterialRequistionSlip>().unwrap(variable.variableName)
        case 'MaterialRequistionSlipItem': return iso<MaterialRequistionSlipItem>().unwrap(variable.variableName)
        case 'BOM': return iso<BOM>().unwrap(variable.variableName)
        case 'BOMItem': return iso<BOMItem>().unwrap(variable.variableName)
        case 'ProductionPreparationSlip': return iso<ProductionPreparationSlip>().unwrap(variable.variableName)
        case 'ProductionPreparationSlipItem': return iso<ProductionPreparationSlipItem>().unwrap(variable.variableName)
        case 'ScrapMaterialSlip': return iso<ScrapMaterialSlip>().unwrap(variable.variableName)
        case 'TransferMaterialSlip': return iso<TransferMaterialSlip>().unwrap(variable.variableName)
        case 'WarehouseAcceptanceSlip': return iso<WarehouseAcceptanceSlip>().unwrap(variable.variableName)
        default: return ''
    }
}
