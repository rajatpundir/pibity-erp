import { immerable } from 'immer'
import { BOMItemRow, BOMRow, IndentItemRow, IndentRow, MaterialApprovalSlipItemRow, MaterialApprovalSlipRow, MaterialRejectionSlipItemRow, MaterialRejectionSlipRow, MaterialRequistionSlipItemRow, MaterialRequistionSlipRow, MaterialReturnSlipItemRow, MaterialReturnSlipRow, ProductionPreparationSlipItemRow, ProductionPreparationSlipRow, ProductRow, PurchaseInvoiceItemRow, PurchaseInvoiceRow, PurchaseOrderItemRow, PurchaseOrderRow, QuotationItemRow, QuotationRow, ScrapMaterialSlipRow, SupplierProductRow, SupplierRow, TransferMaterialSlipRow, UOMRow, WarehouseAcceptanceSlipRow } from './rows'
import { NonPrimitiveType } from './types'

export type Text = string
export type Number = number
export type Decimal = number
export type Boolean = boolean
export type Date = number
export type Timestamp = number
export type Time = number

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

export type VariableName =
    | Product
    | UOM
    | Indent
    | IndentItem
    | Supplier
    | SupplierProduct
    | Quotation
    | QuotationItem
    | PurchaseOrder
    | PurchaseOrderItem
    | PurchaseInvoice
    | PurchaseInvoiceItem
    | MaterialApprovalSlip
    | MaterialApprovalSlipItem
    | MaterialRejectionSlip
    | MaterialRejectionSlipItem
    | MaterialReturnSlip
    | MaterialReturnSlipItem
    | MaterialRequistionSlip
    | MaterialRequistionSlipItem
    | BOM
    | BOMItem
    | ProductionPreparationSlip
    | ProductionPreparationSlipItem
    | ScrapMaterialSlip
    | TransferMaterialSlip
    | WarehouseAcceptanceSlip

export class Product {
    constructor(private variableName: string) { }

    equals(other: Product): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class ProductVariable {
    [immerable] = true
    readonly typeName = 'Product'
    variableName: Product
    values: {
        // UNQ(SKU)
        name: Text
        orderable: Boolean
        consumable: Boolean
        producable: Boolean
    }

    constructor(variableName: string, values: { name: Text, orderable: Boolean, consumable: Boolean, producable: Boolean }) {
        this.variableName = new Product(variableName)
        this.values = values
    }

    equals(other: ProductVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName.equals(other.variableName)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): ProductRow {
        return new ProductRow(this.variableName.toString(), this.values)
    }
}

export class UOM {
    constructor(private variableName: string) { }

    equals(other: UOM): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class UOMVariable {
    [immerable] = true
    readonly typeName = 'UOM'
    variableName: UOM
    values: {
        // UNQ(product, name)
        product: Product
        name: Text
        conversionRate: Decimal
    }

    constructor(variableName: string, values: { product: Product, name: Text, conversionRate: Decimal }) {
        this.variableName = new UOM(variableName)
        this.values = values
    }

    equals(other: UOMVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.product.equals(other.values.product) && this.values.name === other.values.name
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): UOMRow {
        return new UOMRow(this.variableName.toString(), {
            product: this.values.product.toString(),
            name: this.values.name,
            conversionRate: this.values.conversionRate
        })
    }
}

export class Indent {
    constructor(private variableName: string) { }

    equals(other: Indent): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class IndentVariable {
    [immerable] = true
    readonly typeName = 'Indent'
    variableName: Indent
    values: {
        // timestamp: Timestamp // redundant field
        // subspace: Subspace
        // approver: Subspace
        // approved: Boolean
    }

    constructor(variableName: string, values: {}) {
        this.variableName = new Indent(variableName)
        this.values = values
    }

    equals(other: IndentVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName.equals(other.variableName)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): IndentRow {
        return new IndentRow(this.variableName.toString(), this.values)
    }
}

export class IndentItem {
    constructor(private variableName: string) { }

    equals(other: IndentItem): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class IndentItemVariable {
    [immerable] = true
    readonly typeName = 'IndentItem'
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

    constructor(variableName: string, values: { indent: Indent, product: Product, quantity: Number, uom: UOM, ordered: Number, received: Number, approved: Number, rejected: Number, returned: Number, requisted: Number, consumed: Number }) {
        this.variableName = new IndentItem(variableName)
        this.values = values
    }

    equals(other: IndentItemVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.indent.equals(other.values.indent) && this.values.product.equals(other.values.product)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): IndentItemRow {
        return new IndentItemRow(this.variableName.toString(), {
            indent: this.values.indent.toString(),
            product: this.values.product.toString(),
            quantity: this.values.quantity,
            uom: this.values.uom.toString(),
            ordered: this.values.ordered,
            received: this.values.received,
            approved: this.values.approved,
            rejected: this.values.rejected,
            returned: this.values.returned,
            requisted: this.values.requisted,
            consumed: this.values.consumed,
        })
    }
}

export class Supplier {
    constructor(private variableName: string) { }

    equals(other: Supplier): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class SupplierVariable {
    [immerable] = true
    readonly typeName = 'Supplier'
    variableName: Supplier
    values: {}

    constructor(variableName: string, values: {}) {
        this.variableName = new Supplier(variableName)
        this.values = values
    }

    equals(other: SupplierVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName.equals(other.variableName)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): SupplierRow {
        return new SupplierRow(this.variableName.toString(), this.values)
    }
}

export class SupplierProduct {
    constructor(private variableName: string) { }

    equals(other: SupplierProduct): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class SupplierProductVariable {
    [immerable] = true
    readonly typeName = 'SupplierProduct'
    variableName: SupplierProduct
    values: {
        // UNQ(supplier, product)
        supplier: Supplier
        product: Product
    }

    constructor(variableName: string, values: { supplier: Supplier, product: Product }) {
        this.variableName = new SupplierProduct(variableName)
        this.values = values
    }

    equals(other: SupplierProductVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.supplier.equals(other.values.supplier) && this.values.product.equals(other.values.product)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): SupplierProductRow {
        return new SupplierProductRow(this.variableName.toString(), {
            supplier: this.values.supplier.toString(),
            product: this.values.product.toString()
        })
    }
}

export class Quotation {
    constructor(private variableName: string) { }

    equals(other: Quotation): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class QuotationVariable {
    [immerable] = true
    readonly typeName = 'Quotation'
    variableName: Quotation
    values: {
        indent: Indent
        supplier: Supplier
    }

    constructor(variableName: string, values: { indent: Indent, supplier: Supplier }) {
        this.variableName = new Quotation(variableName)
        this.values = values
    }

    equals(other: QuotationVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName.equals(other.variableName)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): QuotationRow {
        return new QuotationRow(this.variableName.toString(), {
            indent: this.values.indent.toString(),
            supplier: this.values.supplier.toString()
        })
    }
}

export class QuotationItem {
    constructor(private variableName: string) { }

    equals(other: QuotationItem): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class QuotationItemVariable {
    [immerable] = true
    readonly typeName = 'QuotationItem'
    variableName: QuotationItem
    values: {
        // UNQ(quotation, indentItem)
        quotation: Quotation
        // assertion(quotation.indent == indentItem.indent)
        indentItem: IndentItem
        // assertion(quantity <= (indentItem.quantity - (ordered - rejected)) && quantity > 0)
        quantity: Number
    }

    constructor(variableName: string, values: { quotation: Quotation, indentItem: IndentItem, quantity: Number }) {
        this.variableName = new QuotationItem(variableName)
        this.values = values
    }

    equals(other: QuotationItemVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.quotation.equals(other.values.quotation) && this.values.indentItem.equals(other.values.indentItem)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): QuotationItemRow {
        return new QuotationItemRow(this.variableName.toString(), {
            quotation: this.values.quotation.toString(),
            indentItem: this.values.indentItem.toString(),
            quantity: this.values.quantity
        })
    }
}

export class PurchaseOrder {
    constructor(private variableName: string) { }

    equals(other: PurchaseOrder): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class PurchaseOrderVariable {
    [immerable] = true
    readonly typeName = 'PurchaseOrder'
    variableName: PurchaseOrder
    values: {
        quotation: Quotation
    }

    constructor(variableName: string, values: { quotation: Quotation }) {
        this.variableName = new PurchaseOrder(variableName)
        this.values = values
    }

    equals(other: PurchaseOrderVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName.equals(other.variableName)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): PurchaseOrderRow {
        return new PurchaseOrderRow(this.variableName.toString(), {
            quotation: this.values.quotation.toString()
        })
    }
}

export class PurchaseOrderItem {
    constructor(private variableName: string) { }

    equals(other: PurchaseOrderItem): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class PurchaseOrderItemVariable {
    [immerable] = true
    readonly typeName = 'PurchaseOrderItem'
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

    constructor(variableName: string, values: { purchaseOrder: PurchaseOrder, quotationItem: QuotationItem, quantity: Number, price: Decimal, received: Number }) {
        this.variableName = new PurchaseOrderItem(variableName)
        this.values = values
    }

    equals(other: PurchaseOrderItemVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.purchaseOrder.equals(other.values.purchaseOrder) && this.values.quotationItem.equals(other.values.quotationItem)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): PurchaseOrderItemRow {
        return new PurchaseOrderItemRow(this.variableName.toString(), {
            purchaseOrder: this.values.purchaseOrder.toString(),
            quotationItem: this.values.quotationItem.toString(),
            quantity: this.values.quantity,
            price: this.values.price,
            received: this.values.received
        })
    }
}

export class PurchaseInvoice {
    constructor(private variableName: string) { }

    equals(other: PurchaseInvoice): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class PurchaseInvoiceVariable {
    [immerable] = true
    readonly typeName = 'PurchaseInvoice'
    variableName: PurchaseInvoice
    values: {
        purchaseOrder: PurchaseOrder
    }

    constructor(variableName: string, values: { purchaseOrder: PurchaseOrder }) {
        this.variableName = new PurchaseInvoice(variableName)
        this.values = values
    }

    equals(other: PurchaseInvoiceVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName.equals(other.variableName)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): PurchaseInvoiceRow {
        return new PurchaseInvoiceRow(this.variableName.toString(), {
            purchaseOrder: this.values.purchaseOrder.toString()
        })
    }
}

export class PurchaseInvoiceItem {
    constructor(private variableName: string) { }

    equals(other: PurchaseInvoiceItem): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class PurchaseInvoiceItemVariable {
    [immerable] = true
    readonly typeName = 'PurchaseInvoiceItem'
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

    constructor(variableName: string, values: { purchaseInvoice: PurchaseInvoice, purchaseOrderItem: PurchaseOrderItem, quantity: Number, approved: Number, rejected: Number }) {
        this.variableName = new PurchaseInvoiceItem(variableName)
        this.values = values
    }

    equals(other: PurchaseInvoiceItemVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.purchaseInvoice.equals(other.values.purchaseInvoice) && this.values.purchaseOrderItem.equals(other.values.purchaseOrderItem)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): PurchaseInvoiceItemRow {
        return new PurchaseInvoiceItemRow(this.variableName.toString(), {
            purchaseInvoice: this.values.purchaseInvoice.toString(),
            purchaseOrderItem: this.values.purchaseOrderItem.toString(),
            quantity: this.values.quantity,
            approved: this.values.approved,
            rejected: this.values.approved
        })
    }
}

export class MaterialApprovalSlip {
    constructor(private variableName: string) { }

    equals(other: MaterialApprovalSlip): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class MaterialApprovalSlipVariable {
    [immerable] = true
    readonly typeName = 'MaterialApprovalSlip'
    variableName: MaterialApprovalSlip
    values: {
        purchaseInvoice: PurchaseInvoice
    }

    constructor(variableName: string, values: { purchaseInvoice: PurchaseInvoice }) {
        this.variableName = new MaterialApprovalSlip(variableName)
        this.values = values
    }

    equals(other: MaterialApprovalSlipVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName.equals(other.variableName)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): MaterialApprovalSlipRow {
        return new MaterialApprovalSlipRow(this.variableName.toString(), {
            purchaseInvoice: this.values.purchaseInvoice.toString()
        })
    }
}

export class MaterialApprovalSlipItem {
    constructor(private variableName: string) { }

    equals(other: MaterialApprovalSlipItem): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class MaterialApprovalSlipItemVariable {
    [immerable] = true
    readonly typeName = 'MaterialApprovalSlipItem'
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

    constructor(variableName: string, values: { materialApprovalSlip: MaterialApprovalSlip, purchaseInvoiceItem: PurchaseInvoiceItem, quantity: Number, requisted: Number }) {
        this.variableName = new MaterialApprovalSlipItem(variableName)
        this.values = values
    }

    equals(other: MaterialApprovalSlipItemVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.materialApprovalSlip.equals(other.values.materialApprovalSlip) && this.values.purchaseInvoiceItem.equals(other.values.purchaseInvoiceItem)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): MaterialApprovalSlipItemRow {
        return new MaterialApprovalSlipItemRow(this.variableName.toString(), {
            materialApprovalSlip: this.values.materialApprovalSlip.toString(),
            purchaseInvoiceItem: this.values.purchaseInvoiceItem.toString(),
            quantity: this.values.quantity,
            requisted: this.values.requisted
        })
    }
}

export class MaterialRejectionSlip {
    constructor(private variableName: string) { }

    equals(other: MaterialRejectionSlip): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class MaterialRejectionSlipVariable {
    [immerable] = true
    readonly typeName = 'MaterialRejectionSlip'
    variableName: MaterialRejectionSlip
    values: {
        purchaseInvoice: PurchaseInvoice
    }

    constructor(variableName: string, values: { purchaseInvoice: PurchaseInvoice }) {
        this.variableName = new MaterialRejectionSlip(variableName)
        this.values = values
    }

    equals(other: MaterialRejectionSlipVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName.equals(other.variableName)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): MaterialRejectionSlipRow {
        return new MaterialRejectionSlipRow(this.variableName.toString(), {
            purchaseInvoice: this.values.purchaseInvoice.toString()
        })
    }
}

export class MaterialRejectionSlipItem {
    constructor(private variableName: string) { }

    equals(other: MaterialRejectionSlipItem): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class MaterialRejectionSlipItemVariable {
    [immerable] = true
    readonly typeName = 'MaterialRejectionSlipItem'
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

    constructor(variableName: string, values: { materialRejectionSlip: MaterialRejectionSlip, purchaseInvoiceItem: PurchaseInvoiceItem, quantity: Number, returned: Number }) {
        this.variableName = new MaterialRejectionSlipItem(variableName)
        this.values = values
    }

    equals(other: MaterialRejectionSlipItemVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.materialRejectionSlip.equals(other.values.materialRejectionSlip) && this.values.purchaseInvoiceItem.equals(other.values.purchaseInvoiceItem)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): MaterialRejectionSlipItemRow {
        return new MaterialRejectionSlipItemRow(this.variableName.toString(), {
            materialRejectionSlip: this.values.materialRejectionSlip.toString(),
            purchaseInvoiceItem: this.values.purchaseInvoiceItem.toString(),
            quantity: this.values.quantity,
            returned: this.values.returned
        })
    }
}

export class MaterialReturnSlip {
    constructor(private variableName: string) { }

    equals(other: MaterialReturnSlip): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class MaterialReturnSlipVariable {
    [immerable] = true
    readonly typeName = 'MaterialReturnSlip'
    variableName: MaterialReturnSlip
    values: {
        materialRejectionSlip: MaterialRejectionSlip
    }

    constructor(variableName: string, values: { materialRejectionSlip: MaterialRejectionSlip }) {
        this.variableName = new MaterialReturnSlip(variableName)
        this.values = values
    }

    equals(other: MaterialReturnSlipVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName.equals(other.variableName)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): MaterialReturnSlipRow {
        return new MaterialReturnSlipRow(this.variableName.toString(), {
            materialRejectionSlip: this.values.materialRejectionSlip.toString()
        })
    }
}

export class MaterialReturnSlipItem {
    constructor(private variableName: string) { }

    equals(other: MaterialReturnSlipItem): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class MaterialReturnSlipItemVariable {
    [immerable] = true
    readonly typeName = 'MaterialReturnSlipItem'
    variableName: MaterialReturnSlipItem
    values: {
        // UNQ(materialReturnSlip, materialRejectionSlipItem)
        materialReturnSlip: MaterialReturnSlip
        // assertion(materialReturnSlip.materialRejectionSlip == materialRejectionSlipItem.materialRejectionSlip)
        materialRejectionSlipItem: MaterialRejectionSlipItem
        // assertion(quantity <= materialRejectionSlipItem.quantity && quantity > 0)
        quantity: Number // { materialRejectionSlipItem.returned += quantity && materialRejectionSlipItem.purchaseInvoiceItem.purchaseOrderItem.quotationItem.indentItem.returned += quantity }
    }

    constructor(variableName: string, values: { materialReturnSlip: MaterialReturnSlip, materialRejectionSlipItem: MaterialRejectionSlipItem, quantity: Number }) {
        this.variableName = new MaterialReturnSlipItem(variableName)
        this.values = values
    }

    equals(other: MaterialReturnSlipItemVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.materialReturnSlip.equals(other.values.materialReturnSlip) && this.values.materialRejectionSlipItem.equals(other.values.materialRejectionSlipItem)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): MaterialReturnSlipItemRow {
        return new MaterialReturnSlipItemRow(this.variableName.toString(), {
            materialReturnSlip: this.values.materialReturnSlip.toString(),
            materialRejectionSlipItem: this.values.materialRejectionSlipItem.toString(),
            quantity: this.values.quantity
        })
    }
}

export class MaterialRequistionSlip {
    constructor(private variableName: string) { }

    equals(other: MaterialRequistionSlip): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class MaterialRequistionSlipVariable {
    [immerable] = true
    readonly typeName = 'MaterialRequistionSlip'
    variableName: MaterialRequistionSlip
    values: {
        materialApprovalSlip: MaterialApprovalSlip
    }

    constructor(variableName: string, values: { materialApprovalSlip: MaterialApprovalSlip }) {
        this.variableName = new MaterialRequistionSlip(variableName)
        this.values = values
    }

    equals(other: MaterialRequistionSlipVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName.equals(other.variableName)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): MaterialRequistionSlipRow {
        return new MaterialRequistionSlipRow(this.variableName.toString(), {
            materialApprovalSlip: this.values.materialApprovalSlip.toString()
        })
    }
}

export class MaterialRequistionSlipItem {
    constructor(private variableName: string) { }

    equals(other: MaterialRequistionSlipItem): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class MaterialRequistionSlipItemVariable {
    [immerable] = true
    readonly typeName = 'MaterialRequistionSlipItem'
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

    constructor(variableName: string, values: { materialRequistionSlip: MaterialRequistionSlip, materialApprovalSlipItem: MaterialApprovalSlipItem, quantity: Number, consumed: Number }) {
        this.variableName = new MaterialRequistionSlipItem(variableName)
        this.values = values
    }

    equals(other: MaterialRequistionSlipItemVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.materialRequistionSlip.equals(other.values.materialRequistionSlip) && this.values.materialApprovalSlipItem.equals(other.values.materialApprovalSlipItem)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): MaterialRequistionSlipItemRow {
        return new MaterialRequistionSlipItemRow(this.variableName.toString(), {
            materialRequistionSlip: this.values.materialRequistionSlip.toString(),
            materialApprovalSlipItem: this.values.materialApprovalSlipItem.toString(),
            quantity: this.values.quantity,
            consumed: this.values.consumed
        })
    }
}

export class BOM {
    constructor(private variableName: string) { }

    equals(other: BOM): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class BOMVariable {
    [immerable] = true
    readonly typeName = 'BOM'
    variableName: BOM
    values: {}

    constructor(variableName: string, values: {}) {
        this.variableName = new BOM(variableName)
        this.values = values
    }

    equals(other: BOMVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName.equals(other.variableName)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): BOMRow {
        return new BOMRow(this.variableName.toString(), this.values)
    }
}

export class BOMItem {
    constructor(private variableName: string) { }

    equals(other: BOMItem): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class BOMItemVariable {
    [immerable] = true
    readonly typeName = 'BOMItem'
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

    constructor(variableName: string, values: { bom: BOM, product: Product, quantity: Number, uom: UOM }) {
        this.variableName = new BOMItem(variableName)
        this.values = values
    }

    equals(other: BOMItemVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.bom.equals(other.values.bom) && this.values.product.equals(other.values.product)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): BOMItemRow {
        return new BOMItemRow(this.variableName.toString(), {
            bom: this.values.bom.toString(),
            product: this.values.product.toString(),
            quantity: this.values.quantity,
            uom: this.values.uom.toString()
        })
    }
}

export class ProductionPreparationSlip {
    constructor(private variableName: string) { }

    equals(other: ProductionPreparationSlip): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class ProductionPreparationSlipVariable {
    [immerable] = true
    readonly typeName = 'ProductionPreparationSlip'
    variableName: ProductionPreparationSlip
    values: {
        bom: BOM
        // assertion((approved + scrapped) <= quantity && approved >= 0 && scrapped >= 0)
        approved: Number
        scrapped: Number
    }

    constructor(variableName: string, values: { bom: BOM, approved: Number, scrapped: Number }) {
        this.variableName = new ProductionPreparationSlip(variableName)
        this.values = values
    }

    equals(other: ProductionPreparationSlipVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName.equals(other.variableName)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): ProductionPreparationSlipRow {
        return new ProductionPreparationSlipRow(this.variableName.toString(), {
            bom: this.values.bom.toString(),
            approved: this.values.approved,
            scrapped: this.values.scrapped
        })
    }
}

export class ProductionPreparationSlipItem {
    constructor(private variableName: string) { }

    equals(other: ProductionPreparationSlipItem): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class ProductionPreparationSlipItemVariable {
    [immerable] = true
    readonly typeName = 'ProductionPreparationSlipItem'
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

    constructor(variableName: string, values: { productionPreparationSlip: ProductionPreparationSlip, bomItem: string, materialRequistionSlipItem: MaterialRequistionSlipItem }) {
        this.variableName = new ProductionPreparationSlipItem(variableName)
        this.values = values
    }

    equals(other: ProductionPreparationSlipItemVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.productionPreparationSlip.equals(other.values.productionPreparationSlip) && this.values.bomItem === other.values.bomItem
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): ProductionPreparationSlipItemRow {
        return new ProductionPreparationSlipItemRow(this.variableName.toString(), {
            productionPreparationSlip: this.values.productionPreparationSlip.toString(),
            bomItem: this.values.bomItem,
            materialRequistionSlipItem: this.values.materialRequistionSlipItem.toString()
        })
    }
}

export class ScrapMaterialSlip {
    constructor(private variableName: string) { }

    equals(other: ScrapMaterialSlip): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class ScrapMaterialSlipVariable {
    [immerable] = true
    readonly typeName = 'ScrapMaterialSlip'
    variableName: ScrapMaterialSlip
    values: {
        productionPreparationSlip: ProductionPreparationSlip
        // assertion(quantity <= productionPreparationSlip.bom.quantity && quantity > 0)
        quantity: Number // { productionPreparationSlip.scrapped += quantity }
    }

    constructor(variableName: string, values: { productionPreparationSlip: ProductionPreparationSlip, quantity: Number }) {
        this.variableName = new ScrapMaterialSlip(variableName)
        this.values = values
    }

    equals(other: ScrapMaterialSlipVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName.equals(other.variableName)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): ScrapMaterialSlipRow {
        return new ScrapMaterialSlipRow(this.variableName.toString(), {
            productionPreparationSlip: this.values.productionPreparationSlip.toString(),
            quantity: this.values.quantity
        })
    }
}

export class TransferMaterialSlip {
    constructor(private variableName: string) { }

    equals(other: TransferMaterialSlip): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class TransferMaterialSlipVariable {
    [immerable] = true
    readonly typeName = 'TransferMaterialSlip'
    variableName: TransferMaterialSlip
    values: {
        productionPreparationSlip: ProductionPreparationSlip
        // assertion(quantity <= productionPreparationSlip.bom.quantity && quantity > 0)
        quantity: Number // { productionPreparationSlip.approved += quantity }
        // assertion(transfered <= quantity && transfered >= 0)
        transferred: Number
    }

    constructor(variableName: string, values: { productionPreparationSlip: ProductionPreparationSlip, quantity: Number, transferred: Number }) {
        this.variableName = new TransferMaterialSlip(variableName)
        this.values = values
    }

    equals(other: TransferMaterialSlipVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName.equals(other.variableName)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): TransferMaterialSlipRow {
        return new TransferMaterialSlipRow(this.variableName.toString(), {
            productionPreparationSlip: this.values.productionPreparationSlip.toString(),
            quantity: this.values.quantity,
            transferred: this.values.transferred
        })
    }
}

export class WarehouseAcceptanceSlip {
    constructor(private variableName: string) { }

    equals(other: WarehouseAcceptanceSlip): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class WarehouseAcceptanceSlipVariable {
    [immerable] = true
    readonly typeName = 'WarehouseAcceptanceSlip'
    variableName: WarehouseAcceptanceSlip
    values: {
        transferMaterialSlip: TransferMaterialSlip
        // assertion(quantity <= transferMaterialSlip.quantity && quantity > 0)
        quantity: Number // { transferMaterialSlip.transfered += quantity }
    }

    constructor(variableName: string, values: { transferMaterialSlip: TransferMaterialSlip, quantity: Number }) {
        this.variableName = new WarehouseAcceptanceSlip(variableName)
        this.values = values
    }

    equals(other: WarehouseAcceptanceSlipVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName.equals(other.variableName)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): WarehouseAcceptanceSlipRow {
        return new WarehouseAcceptanceSlipRow(this.variableName.toString(), {
            transferMaterialSlip: this.values.transferMaterialSlip.toString(),
            quantity: this.values.quantity
        })
    }
}

export function replaceVariable(typeName: NonPrimitiveType, variableName: string, values: object) {
    switch (typeName) {
        case 'Product': {
            return new ProductVariable(variableName, {
                name: String(values['name']),
                orderable: Boolean(values['orderable']).valueOf(),
                consumable: Boolean(values['consumable']).valueOf(),
                producable: Boolean(values['producable']).valueOf()
            })
        }
        case 'UOM': {
            return new UOMVariable(variableName, {
                product: new Product(values['product']),
                name: String(values['name']),
                conversionRate: parseFloat(String(values['conversionRate']))
            })
        }
        case 'Indent': {
            return new IndentVariable(variableName, {})
        }
        case 'IndentItem': {
            return new IndentItemVariable(variableName, {
                indent: new Indent(values['indent']),
                product: new Product(values['product']),
                quantity: parseInt(String(values['quantity'])),
                uom: new UOM(values['uom']),
                ordered: parseInt(String(values['ordered'])),
                received: parseInt(String(values['received'])),
                approved: parseInt(String(values['approved'])),
                rejected: parseInt(String(values['rejected'])),
                returned: parseInt(String(values['returned'])),
                requisted: parseInt(String(values['requisted'])),
                consumed: parseInt(String(values['consumed']))
            })
        }
        case 'Supplier': {
            return new SupplierVariable(variableName, {})
        }
        case 'SupplierProduct': {
            return new SupplierProductVariable(variableName, {
                supplier: new Supplier(values['supplier']),
                product: new Product(values['product'])
            })
        }
        case 'Quotation': {
            return new QuotationVariable(variableName, {
                indent: new Indent(values['indent']),
                supplier: new Supplier(values['supplier'])
            })
        }
        case 'QuotationItem': {
            return new QuotationItemVariable(variableName, {
                quotation: new Quotation(values['quotation']),
                indentItem: new IndentItem(values['indentItem']),
                quantity: parseInt(String(values['quantity']))
            })
        }
        case 'PurchaseOrder': {
            return new PurchaseOrderVariable(variableName, {
                quotation: new Quotation(values['quotation'])
            })
        }
        case 'PurchaseOrderItem': {
            return new PurchaseOrderItemVariable(variableName, {
                purchaseOrder: new PurchaseOrder(values['purchaseOrder']),
                quotationItem: new QuotationItem(values['quotationItem']),
                quantity: parseInt(String(values['quantity'])),
                price: parseFloat(String(values['price'])),
                received: parseInt(String(values['received']))
            })
        }
        case 'PurchaseInvoice': {
            return new PurchaseInvoiceVariable(variableName, {
                purchaseOrder: new PurchaseOrder(values['purchaseOrder'])
            })
        }
        case 'PurchaseInvoiceItem': {
            return new PurchaseInvoiceItemVariable(variableName, {
                purchaseInvoice: new PurchaseInvoice(values['purchaseInvoice']),
                purchaseOrderItem: new PurchaseOrderItem(values['purchaseOrderItem']),
                quantity: parseInt(String(values['quantity'])),
                approved: parseInt(String(values['approved'])),
                rejected: parseInt(String(values['rejected']))
            })
        }
        case 'MaterialApprovalSlip': {
            return new MaterialApprovalSlipVariable(variableName, {
                purchaseInvoice: new PurchaseInvoice(values['purchaseInvoice'])
            })
        }
        case 'MaterialApprovalSlipItem': {
            return new MaterialApprovalSlipItemVariable(variableName, {
                materialApprovalSlip: new MaterialApprovalSlip(values['materialApprovalSlip']),
                purchaseInvoiceItem: new PurchaseInvoiceItem(values['purchaseInvoiceItem']),
                quantity: parseInt(String(values['quantity'])),
                requisted: parseInt(String(values['requisted']))
            })
        }
        case 'MaterialRejectionSlip': {
            return new MaterialRejectionSlipVariable(variableName, {
                purchaseInvoice: new PurchaseInvoice(values['purchaseInvoice'])
            })
        }
        case 'MaterialRejectionSlipItem': {
            return new MaterialRejectionSlipItemVariable(variableName, {
                materialRejectionSlip: new MaterialRejectionSlip(values['materialRejectionSlip']),
                purchaseInvoiceItem: new PurchaseInvoiceItem(values['purchaseInvoiceItem']),
                quantity: parseInt(String(values['quantity'])),
                returned: parseInt(String(values['returned']))
            })
        }
        case 'MaterialReturnSlip': {
            return new MaterialReturnSlipVariable(variableName, {
                materialRejectionSlip: new MaterialRejectionSlip(values['materialRejectionSlip'])
            })
        }
        case 'MaterialReturnSlipItem': {
            return new MaterialReturnSlipItemVariable(variableName, {
                materialReturnSlip: new MaterialReturnSlip(values['materialReturnSlip']),
                materialRejectionSlipItem: new MaterialRejectionSlipItem(values['materialRejectionSlipItem']),
                quantity: parseInt(String(values['quantity']))
            })
        }
        case 'MaterialRequistionSlip': {
            return new MaterialRequistionSlipVariable(variableName, {
                materialApprovalSlip: new MaterialApprovalSlip(values['materialApprovalSlip'])
            })
        }
        case 'MaterialRequistionSlipItem': {
            return new MaterialRequistionSlipItemVariable(variableName, {
                materialRequistionSlip: new MaterialRequistionSlip(values['materialRequistionSlip']),
                materialApprovalSlipItem: new MaterialApprovalSlipItem(values['materialApprovalSlipItem']),
                quantity: parseInt(String(values['quantity'])),
                consumed: parseInt(String(values['consumed']))
            })
        }
        case 'BOM': {
            return new BOMVariable(variableName, {})
        }
        case 'BOMItem': {
            return new BOMItemVariable(variableName, {
                bom: new BOM(values['bom']),
                product: new Product(values['product']),
                quantity: parseInt(String(values['quantity'])),
                uom: new UOM(values['uom'])
            })
        }
        case 'ProductionPreparationSlip': {
            return new ProductionPreparationSlipVariable(variableName, {
                bom: new BOM(values['bom']),
                approved: parseInt(String(values['approved'])),
                scrapped: parseInt(String(values['scrapped']))
            })
        }
        case 'ProductionPreparationSlipItem': {
            return new ProductionPreparationSlipItemVariable(variableName, {
                productionPreparationSlip: new ProductionPreparationSlip(values['productionPreparationSlip']),
                bomItem: String(values['bomItem']),
                materialRequistionSlipItem: new MaterialRequistionSlipItem(values['materialRequistionSlipItem'])
            })
        }
        case 'ScrapMaterialSlip': {
            return new ScrapMaterialSlipVariable(variableName, {
                productionPreparationSlip: new ProductionPreparationSlip(values['productionPreparationSlip']),
                quantity: parseInt(String(values['quantity']))
            })
        }
        case 'TransferMaterialSlip': {
            return new TransferMaterialSlipVariable(variableName, {
                productionPreparationSlip: new ProductionPreparationSlip(values['productionPreparationSlip']),
                quantity: parseInt(String(values['quantity'])),
                transferred: parseInt(String(values['quatransferedntity']))
            })
        }
        case 'WarehouseAcceptanceSlip': {
            return new WarehouseAcceptanceSlipVariable(variableName, {
                transferMaterialSlip: new TransferMaterialSlip(values['transferMaterialSlip']),
                quantity: parseInt(String(values['quantity']))
            })
        }
    }
}
