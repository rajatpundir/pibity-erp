
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
// | Inden
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
        return `${this.variableName}`;
    }
}

export class ProductVariable {
    readonly typeName = 'Product'
    variableName: Product
    values: {
        // UNQ(SKU)
        name: Text
        orderable: Boolean
        consumable: Boolean
        producable: Boolean
    }

    constructor(variableName: string, name: Text, orderable: Boolean, consumable: Boolean, producable: Boolean) {
        this.variableName = new Product(variableName)
        this.values = { name, orderable, consumable, producable }
    }

    equals(other: ProductVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return `${JSON.stringify(this)}`;
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
        return `${this.variableName}`;
    }
}

export class UOMVariable {
    readonly typeName = 'UOM'
    variableName: UOM
    values: {
        // UNQ(product, name)
        product: Product
        name: Text
        conversionRate: Decimal
    }

    constructor(variableName: string, product: Product, name: Text, conversionRate: Decimal) {
        this.variableName = new UOM(variableName)
        this.values = { product, name, conversionRate }
    }

    equals(other: UOMVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return `${JSON.stringify(this)}`;
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
        return `${this.variableName}`;
    }
}

export class IndentVariable {
    readonly typeName = 'Indent'
    variableName: Indent
    values: {
        timestamp: Timestamp // redundant field
        // subspace: Subspace
        // approver: Subspace
        approved: Boolean
    }

    constructor(variableName: string, timestamp: Timestamp, approved: Boolean) {
        this.variableName = new Indent(variableName)
        this.values = { timestamp, approved }
    }

    equals(other: IndentVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return `${JSON.stringify(this)}`;
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
        return `${this.variableName}`;
    }
}

export class IndentItemVariable {
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

    constructor(variableName: string, indent: Indent, product: Product, quantity: Number, uom: UOM, ordered: Number, received: Number, approved: Number, rejected: Number, returned: Number, requisted: Number, consumed: Number) {
        this.variableName = new IndentItem(variableName)
        this.values = { indent, product, quantity, uom, ordered, received, approved, rejected, returned, requisted, consumed }
    }

    equals(other: IndentItemVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return `${JSON.stringify(this)}`;
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
        return `${this.variableName}`;
    }
}

export class SupplierVariable {
    readonly typeName = 'Supplier'
    variableName: Supplier
    values: {}

    constructor(variableName: string) {
        this.variableName = new Supplier(variableName)
        this.values = {}
    }

    equals(other: SupplierVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return `${JSON.stringify(this)}`;
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
        return `${this.variableName}`;
    }
}

export class SupplierProductVariable {
    readonly typeName = 'SupplierProduct'
    variableName: SupplierProduct
    values: {
        // UNQ(supplier, product)
        supplier: Supplier
        product: Product
    }

    constructor(variableName: string, supplier: Supplier, product: Product) {
        this.variableName = new SupplierProduct(variableName)
        this.values = { supplier, product }
    }

    equals(other: SupplierProductVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return `${JSON.stringify(this)}`;
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
        return `${this.variableName}`;
    }
}

export class QuotationVariable {
    readonly typeName = 'Quotation'
    variableName: Quotation
    values: {
        indent: Indent
        supplier: Supplier
    }

    constructor(variableName: string, indent: Indent, supplier: Supplier) {
        this.variableName = new Quotation(variableName)
        this.values = { indent, supplier }
    }

    equals(other: QuotationVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return `${JSON.stringify(this)}`;
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
        return `${this.variableName}`;
    }
}

export class QuotationItemVariable {
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

    constructor(variableName: string, quotation: Quotation, indentItem: IndentItem, quantity: Number) {
        this.variableName = new QuotationItem(variableName)
        this.values = { quotation, indentItem, quantity }
    }

    equals(other: QuotationItemVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return `${JSON.stringify(this)}`;
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
        return `${this.variableName}`;
    }
}

export class PurchaseOrderVariable {
    readonly typeName = 'PurchaseOrder'
    variableName: PurchaseOrder
    values: {
        quotation: Quotation
    }

    constructor(variableName: string, quotation: Quotation) {
        this.variableName = new PurchaseOrder(variableName)
        this.values = { quotation }
    }

    equals(other: PurchaseOrderVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return `${JSON.stringify(this)}`;
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
        return `${this.variableName}`;
    }
}

export class PurchaseOrderItemVariable {
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

    constructor(variableName: string, purchaseOrder: PurchaseOrder, quotationItem: QuotationItem, quantity: Number, price: Decimal, received: Number) {
        this.variableName = new PurchaseOrderItem(variableName)
        this.values = { purchaseOrder, quotationItem, quantity, price, received }
    }

    equals(other: PurchaseOrderItemVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return `${JSON.stringify(this)}`;
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
        return `${this.variableName}`;
    }
}

export class PurchaseInvoiceVariable {
    readonly typeName = 'PurchaseInvoice'
    variableName: PurchaseInvoice
    values: {
        purchaseOrder: PurchaseOrder
    }

    constructor(variableName: string, purchaseOrder: PurchaseOrder) {
        this.variableName = new PurchaseInvoice(variableName)
        this.values = { purchaseOrder }
    }

    equals(other: PurchaseInvoiceVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return `${JSON.stringify(this)}`;
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
        return `${this.variableName}`;
    }
}

export class PurchaseInvoiceItemVariable {
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

    constructor(variableName: string, purchaseInvoice: PurchaseInvoice, purchaseOrderItem: PurchaseOrderItem, quantity: Number, approved: Number, rejected: Number) {
        this.variableName = new PurchaseInvoiceItem(variableName)
        this.values = { purchaseInvoice, purchaseOrderItem, quantity, approved, rejected }
    }

    equals(other: PurchaseInvoiceItemVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return `${JSON.stringify(this)}`;
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
        return `${this.variableName}`;
    }
}

export class MaterialApprovalSlipVariable {
    readonly typeName = 'MaterialApprovalSlip'
    variableName: MaterialApprovalSlip
    values: {
        purchaseInvoice: PurchaseInvoice
    }

    constructor(variableName: string, purchaseInvoice: PurchaseInvoice) {
        this.variableName = new MaterialApprovalSlip(variableName)
        this.values = { purchaseInvoice }
    }

    equals(other: MaterialApprovalSlipVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return `${JSON.stringify(this)}`;
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
        return `${this.variableName}`;
    }
}

export class MaterialApprovalSlipItemVariable {
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

    constructor(variableName: string, materialApprovalSlip: MaterialApprovalSlip, purchaseInvoiceItem: PurchaseInvoiceItem, quantity: Number, requisted: Number) {
        this.variableName = new MaterialApprovalSlipItem(variableName)
        this.values = { materialApprovalSlip, purchaseInvoiceItem, quantity, requisted }
    }

    equals(other: MaterialApprovalSlipItemVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return `${JSON.stringify(this)}`;
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
        return `${this.variableName}`;
    }
}

export class MaterialRejectionSlipVariable {
    readonly typeName = 'MaterialRejectionSlip'
    variableName: MaterialRejectionSlip
    values: {
        purchaseInvoice: PurchaseInvoice
    }

    constructor(variableName: string, purchaseInvoice: PurchaseInvoice) {
        this.variableName = new MaterialRejectionSlip(variableName)
        this.values = { purchaseInvoice }
    }

    equals(other: MaterialRejectionSlipVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return `${JSON.stringify(this)}`;
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
        return `${this.variableName}`;
    }
}

export class MaterialRejectionSlipItemVariable {
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

    constructor(variableName: string, materialRejectionSlip: MaterialRejectionSlip, purchaseInvoiceItem: PurchaseInvoiceItem, quantity: Number, returned: Number) {
        this.variableName = new MaterialRejectionSlipItem(variableName)
        this.values = { materialRejectionSlip, purchaseInvoiceItem, quantity, returned }
    }

    equals(other: MaterialRejectionSlipItemVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return `${JSON.stringify(this)}`;
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
        return `${this.variableName}`;
    }
}

export class MaterialReturnSlipVariable {
    readonly typeName = 'MaterialReturnSlip'
    variableName: MaterialReturnSlip
    values: {
        materialRejectionSlip: MaterialRejectionSlip
    }

    constructor(variableName: string, materialRejectionSlip: MaterialRejectionSlip) {
        this.variableName = new MaterialReturnSlip(variableName)
        this.values = { materialRejectionSlip }
    }

    equals(other: MaterialReturnSlipVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return `${JSON.stringify(this)}`;
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
        return `${this.variableName}`;
    }
}

export class MaterialReturnSlipItemVariable {
    readonly typeName = 'MaterialReturnSlipItem'
    variableName: MaterialReturnSlipItem
    values: {
        // UNQ(materialReturnSlip, materialRejectionSlipItem)
        materialReturnSlip: MaterialReturnSlip
        // assertion(materialReturnSlip.materialRejectionSlip == materialRejectionSlipItem.materialRejectionSlip)
        materialRejectionSlipItem: MaterialReturnSlipItem
        // assertion(quantity <= materialRejectionSlipItem.quantity && quantity > 0)
        quantity: Number // { materialRejectionSlipItem.returned += quantity && materialRejectionSlipItem.purchaseInvoiceItem.purchaseOrderItem.quotationItem.indentItem.returned += quantity }
    }

    constructor(variableName: string, materialReturnSlip: MaterialReturnSlip, materialRejectionSlipItem: MaterialReturnSlipItem, quantity: Number) {
        this.variableName = new MaterialReturnSlipItem(variableName)
        this.values = { materialReturnSlip, materialRejectionSlipItem, quantity }
    }

    equals(other: MaterialReturnSlipItemVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return `${JSON.stringify(this)}`;
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
        return `${this.variableName}`;
    }
}

export class MaterialRequistionSlipVariable {
    readonly typeName = 'MaterialRequistionSlip'
    variableName: MaterialRequistionSlip
    values: {
        materialApprovalSlip: MaterialApprovalSlip
    }

    constructor(variableName: string, materialApprovalSlip: MaterialApprovalSlip) {
        this.variableName = new MaterialRequistionSlip(variableName)
        this.values = { materialApprovalSlip }
    }

    equals(other: MaterialRequistionSlipVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return `${JSON.stringify(this)}`;
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
        return `${this.variableName}`;
    }
}

export class MaterialRequistionSlipItemVariable {
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

    constructor(variableName: string, materialRequistionSlip: MaterialRequistionSlip, materialApprovalSlipItem: MaterialApprovalSlipItem, quantity: Number, consumed: Number) {
        this.variableName = new MaterialRequistionSlipItem(variableName)
        this.values = { materialRequistionSlip, materialApprovalSlipItem, quantity, consumed }
    }

    equals(other: MaterialRequistionSlipItemVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return `${JSON.stringify(this)}`;
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
        return `${this.variableName}`;
    }
}

export class BOMVariable {
    readonly typeName = 'BOM'
    variableName: BOM
    values: {
        // assertion(product.producable == true)
        product: Product
        quantity: Number
        // assertion(uom.product == product)
        uom: UOM
    }

    constructor(variableName: string, product: Product, quantity: Number, uom: UOM) {
        this.variableName = new BOM(variableName)
        this.values = { product, quantity, uom }
    }

    equals(other: BOMVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return `${JSON.stringify(this)}`;
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
        return `${this.variableName}`;
    }
}

export class BOMItemVariable {
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

    constructor(variableName: string, bom: BOM, product: Product, quantity: Number, uom: UOM) {
        this.variableName = new BOMItem(variableName)
        this.values = { bom, product, quantity, uom }
    }

    equals(other: BOMItemVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return `${JSON.stringify(this)}`;
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
        return `${this.variableName}`;
    }
}

export class ProductionPreparationSlipVariable {
    readonly typeName = 'ProductionPreparationSlip'
    variableName: ProductionPreparationSlip
    values: {
        bom: BOM
        // assertion((approved + scrapped) <= quantity && approved >= 0 && scrapped >= 0)
        approved: Number
        scrapped: Number
    }

    constructor(variableName: string, bom: BOM, approved: Number, scrapped: Number) {
        this.variableName = new ProductionPreparationSlip(variableName)
        this.values = { bom, approved, scrapped }
    }

    equals(other: ProductionPreparationSlipVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return `${JSON.stringify(this)}`;
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
        return `${this.variableName}`;
    }
}

export class ProductionPreparationSlipItemVariable {
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

    constructor(variableName: string, productionPreparationSlip: ProductionPreparationSlip, bomItem: string, materialRequistionSlipItem: MaterialRequistionSlipItem) {
        this.variableName = new ProductionPreparationSlipItem(variableName)
        this.values = { productionPreparationSlip, bomItem, materialRequistionSlipItem }
    }

    equals(other: ProductionPreparationSlipItemVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return `${JSON.stringify(this)}`;
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
        return `${this.variableName}`;
    }
}

export class ScrapMaterialSlipVariable {
    readonly typeName = 'ScrapMaterialSlip'
    variableName: ScrapMaterialSlip
    values: {
        productionPreparationSlip: ProductionPreparationSlip
        // assertion(quantity <= productionPreparationSlip.bom.quantity && quantity > 0)
        quantity: Number // { productionPreparationSlip.scrapped += quantity }
    }

    constructor(variableName: string, productionPreparationSlip: ProductionPreparationSlip, quantity: Number) {
        this.variableName = new ScrapMaterialSlip(variableName)
        this.values = { productionPreparationSlip, quantity }
    }

    equals(other: ScrapMaterialSlipVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return `${JSON.stringify(this)}`;
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
        return `${this.variableName}`;
    }
}

export class TransferMaterialSlipVariable {
    readonly typeName = 'TransferMaterialSlip'
    variableName: TransferMaterialSlip
    values: {
        productionPreparationSlip: ProductionPreparationSlip
        // assertion(quantity <= productionPreparationSlip.bom.quantity && quantity > 0)
        quantity: Number // { productionPreparationSlip.approved += quantity }
        // assertion(transfered <= quantity && transfered >= 0)
        transfered: Number
    }

    constructor(variableName: string, productionPreparationSlip: ProductionPreparationSlip, quantity: Number, transfered: Number) {
        this.variableName = new TransferMaterialSlip(variableName)
        this.values = { productionPreparationSlip, quantity, transfered }
    }

    equals(other: TransferMaterialSlipVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return `${JSON.stringify(this)}`;
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
        return `${this.variableName}`;
    }
}

export class WarehouseAcceptanceSlipVariable {
    readonly typeName = 'WarehouseAcceptanceSlip'
    variableName: WarehouseAcceptanceSlip
    values: {
        transferMaterialSlip: TransferMaterialSlip
        // assertion(quantity <= transferMaterialSlip.quantity && quantity > 0)
        quantity: Number // { transferMaterialSlip.transfered += quantity }
    }

    constructor(variableName: string, transferMaterialSlip: TransferMaterialSlip, quantity: Number) {
        this.variableName = new WarehouseAcceptanceSlip(variableName)
        this.values = { transferMaterialSlip, quantity }
    }

    equals(other: WarehouseAcceptanceSlipVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return `${JSON.stringify(this)}`;
    }
}
