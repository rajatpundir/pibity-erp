import { immerable } from 'immer'
import { HashSet } from 'prelude-ts'
import { DiffVariable } from './layers'
import { Number, Decimal, ProductVariable, UOMVariable, IndentVariable, IndentItemVariable, SupplierVariable, SupplierProductVariable, QuotationVariable, QuotationItemVariable, PurchaseOrderVariable, PurchaseOrderItemVariable, PurchaseInvoiceVariable, PurchaseInvoiceItemVariable, MaterialApprovalSlipVariable, MaterialApprovalSlipItemVariable, MaterialRejectionSlipVariable, MaterialRejectionSlipItemVariable, MaterialReturnSlipVariable, MaterialReturnSlipItemVariable, MaterialRequistionSlipVariable, MaterialRequistionSlipItemVariable, BOMVariable, BOMItemVariable, ProductionPreparationSlipVariable, ProductionPreparationSlipItemVariable, ScrapMaterialSlipVariable, TransferMaterialSlipVariable, WarehouseAcceptanceSlipVariable, Product, UOM, Indent, IndentItem, Supplier, Quotation, QuotationItem, PurchaseOrder, PurchaseOrderItem, PurchaseInvoice, PurchaseInvoiceItem, MaterialApprovalSlip, MaterialApprovalSlipItem, MaterialRejectionSlip, MaterialRejectionSlipItem, MaterialReturnSlip, MaterialRequistionSlip, MaterialRequistionSlipItem, BOM, ProductionPreparationSlip, TransferMaterialSlip, MaterialReturnSlipItem, BOMItem, ProductionPreparationSlipItem, ScrapMaterialSlip, WarehouseAcceptanceSlip, SupplierProduct } from './variables'

export class ProductRow {
    [immerable] = true
    readonly typeName = 'Product'
    variableName: string
    values: {
        // UNQ(SKU)
        name: string
        orderable: boolean
        consumable: boolean
        producable: boolean
    }

    constructor(variableName: string, values: { name: string, orderable: boolean, consumable: boolean, producable: boolean }) {
        this.variableName = variableName
        this.values = values
    }

    equals(other: ProductRow): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toVariable(): ProductVariable {
        return new ProductVariable(this.variableName, this.values)
    }
}

export class UOMRow {
    [immerable] = true
    readonly typeName = 'UOM'
    readonly variableName: string
    readonly product: string
    readonly name: string
    values: {
        // UNQ(product, name)
        product: string
        name: string
        conversionRate: Decimal
    }

    constructor(variableName: string, values: { product: string, name: string, conversionRate: Decimal }) {
        this.variableName = variableName
        this.values = values
        this.product = values.product
        this.name = values.name
    }

    equals(other: UOMRow): boolean {
        if (!other) {
            return false;
        }
        return this.values.product === other.values.product && this.values.name === other.values.name
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toVariable(): UOMVariable {
        return new UOMVariable(this.variableName, {
            product: new Product(this.values.product),
            name: this.values.name,
            conversionRate: this.values.conversionRate
        })
    }
}

export class IndentRow {
    [immerable] = true
    readonly typeName = 'Indent'
    readonly variableName: string
    values: {
        // timestamp: Timestamp // redundant field
        // subspace: Subspace
        // approver: Subspace
        // approved: boolean
    }

    constructor(variableName: string, values: {}) {
        this.variableName = variableName
        this.values = values
    }

    equals(other: IndentRow): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toVariable(): IndentVariable {
        return new IndentVariable(this.variableName, this.values)
    }
}

export class IndentItemRow {
    [immerable] = true
    readonly typeName = 'IndentItem'
    readonly variableName: string
    readonly indent: string
    readonly product: string
    values: {
        // UNQ(indent, product)
        indent: string
        product: string
        quantity: Number
        // assertion(uom.product == product && product.orderable == true && quantity > 0)
        uom: string
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

    constructor(variableName: string, values: { indent: string, product: string, quantity: Number, uom: string, ordered: Number, received: Number, approved: Number, rejected: Number, returned: Number, requisted: Number, consumed: Number }) {
        this.variableName = variableName
        this.values = values
        this.indent = values.indent
        this.product = values.product
    }

    equals(other: IndentItemRow): boolean {
        if (!other) {
            return false;
        }
        return this.values.indent === other.values.indent && this.values.product === other.values.product
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toVariable(): IndentItemVariable {
        return new IndentItemVariable(this.variableName, {
            indent: new Indent(this.values.indent),
            product: new Product(this.values.product),
            quantity: this.values.quantity,
            uom: new UOM(this.values.uom),
            ordered: this.values.ordered,
            received: this.values.received,
            approved: this.values.approved,
            rejected: this.values.rejected,
            returned: this.values.returned,
            requisted: this.values.requisted,
            consumed: this.values.consumed
        })
    }
}

export class SupplierRow {
    [immerable] = true
    readonly typeName = 'Supplier'
    variableName: string
    values: {}

    constructor(variableName: string, values: {}) {
        this.variableName = variableName
        this.values = values
    }

    equals(other: SupplierRow): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toVariable(): SupplierVariable {
        return new SupplierVariable(this.variableName, this.values)
    }
}

export class SupplierProductRow {
    [immerable] = true
    readonly typeName = 'SupplierProduct'
    readonly variableName: string
    readonly supplier: string
    readonly product: string
    values: {
        // UNQ(supplier, product)
        supplier: string
        product: string
    }

    constructor(variableName: string, values: { supplier: string, product: string }) {
        this.variableName = variableName
        this.values = values
        this.supplier = values.supplier
        this.product = values.product
    }

    equals(other: SupplierProductRow): boolean {
        if (!other) {
            return false;
        }
        return this.values.supplier === other.values.supplier && this.values.product === other.values.product
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toVariable(): SupplierProductVariable {
        return new SupplierProductVariable(this.variableName, {
            supplier: new Supplier(this.values.supplier),
            product: new Product(this.values.product)
        })
    }
}

export class QuotationRow {
    [immerable] = true
    readonly typeName = 'Quotation'
    readonly variableName: string
    values: {
        indent: string
        supplier: string
    }

    constructor(variableName: string, values: { indent: string, supplier: string }) {
        this.variableName = variableName
        this.values = values
    }

    equals(other: QuotationRow): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toVariable(): QuotationVariable {
        return new QuotationVariable(this.variableName, {
            indent: new Indent(this.values.indent),
            supplier: new Supplier(this.values.supplier)
        })
    }
}

export class QuotationItemRow {
    [immerable] = true
    readonly typeName = 'QuotationItem'
    readonly variableName: string
    readonly quotation: string
    readonly indentItem: string
    values: {
        // UNQ(quotation, indentItem)
        quotation: string
        // assertion(quotation.indent == indentItem.indent)
        indentItem: string
        // assertion(quantity <= (indentItem.quantity - (ordered - rejected)) && quantity > 0)
        quantity: Number
    }

    constructor(variableName: string, values: { quotation: string, indentItem: string, quantity: Number }) {
        this.variableName = variableName
        this.values = values
        this.quotation = values.quotation
        this.indentItem = values.indentItem
    }

    equals(other: QuotationItemRow): boolean {
        if (!other) {
            return false;
        }
        return this.values.quotation === other.values.quotation && this.values.indentItem === other.values.indentItem
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toVariable(): QuotationItemVariable {
        return new QuotationItemVariable(this.variableName, {
            quotation: new Quotation(this.values.quotation),
            indentItem: new IndentItem(this.values.indentItem),
            quantity: this.values.quantity
        })
    }
}

export class PurchaseOrderRow {
    [immerable] = true
    readonly typeName = 'PurchaseOrder'
    readonly variableName: string
    values: {
        quotation: string
    }

    constructor(variableName: string, values: { quotation: string }) {
        this.variableName = variableName
        this.values = values
    }

    equals(other: PurchaseOrderRow): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toVariable(): PurchaseOrderVariable {
        return new PurchaseOrderVariable(this.variableName, {
            quotation: new Quotation(this.values.quotation)
        })
    }
}

export class PurchaseOrderItemRow {
    [immerable] = true
    readonly typeName = 'PurchaseOrderItem'
    readonly variableName: string
    readonly purchaseOrder: string
    readonly quotationItem: string
    values: {
        // UNQ(purchaseOrder, quotationItem)
        purchaseOrder: string
        // assertion(purchaseOrder.quotation == quotationItem.quotation)
        quotationItem: string
        // assertion(quantity <= quotationItem.quantity && quantity > 0)
        quantity: Number // { quotationItem.indentItem.ordered += quantity }
        price: Decimal
        // assertion(received >= 0 && received <= quantity)
        received: Number
    }

    constructor(variableName: string, values: { purchaseOrder: string, quotationItem: string, quantity: Number, price: Decimal, received: Number }) {
        this.variableName = variableName
        this.values = values
        this.purchaseOrder = values.purchaseOrder
        this.quotationItem = values.quotationItem
    }

    equals(other: PurchaseOrderItemRow): boolean {
        if (!other) {
            return false;
        }
        return this.values.purchaseOrder === other.values.purchaseOrder && this.values.quotationItem === other.values.quotationItem
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toVariable(): PurchaseOrderItemVariable {
        return new PurchaseOrderItemVariable(this.variableName, {
            purchaseOrder: new PurchaseOrder(this.values.purchaseOrder),
            quotationItem: new QuotationItem(this.values.quotationItem),
            quantity: this.values.quantity,
            price: this.values.price,
            received: this.values.received
        })
    }
}

export class PurchaseInvoiceRow {
    [immerable] = true
    readonly typeName = 'PurchaseInvoice'
    readonly variableName: string
    values: {
        purchaseOrder: string
    }

    constructor(variableName: string, values: { purchaseOrder: string }) {
        this.variableName = variableName
        this.values = values
    }

    equals(other: PurchaseInvoiceRow): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toVariable(): PurchaseInvoiceVariable {
        return new PurchaseInvoiceVariable(this.variableName, {
            purchaseOrder: new PurchaseOrder(this.values.purchaseOrder)
        })
    }
}

export class PurchaseInvoiceItemRow {
    [immerable] = true
    readonly typeName = 'PurchaseInvoiceItem'
    readonly variableName: string
    readonly purchaseInvoice: string
    readonly purchaseOrderItem: string
    values: {
        // UNQ(purchaseInvoice, purchaseOrderItem)
        purchaseInvoice: string
        // assertion(purchaseInvoice.purchaseOrder == purchaseOrderItem.purchaseOrder)
        purchaseOrderItem: string
        // assertion(quantity <= purchaseOrderItem.quantity && quantity > 0)
        quantity: Number // { purchaseOrderItem.received += quantity && purchaseOrderItem.quotationOrderItem.indentOrderItem.received += quantity }
        // assertion((approved + rejected) <= quantity && approved >= 0 && rejeted >= 0)
        approved: Number
        rejected: Number
    }

    constructor(variableName: string, values: { purchaseInvoice: string, purchaseOrderItem: string, quantity: Number, approved: Number, rejected: Number }) {
        this.variableName = variableName
        this.values = values
        this.purchaseInvoice = values.purchaseInvoice
        this.purchaseOrderItem = values.purchaseOrderItem
    }

    equals(other: PurchaseInvoiceItemRow): boolean {
        if (!other) {
            return false;
        }
        return this.values.purchaseInvoice === other.values.purchaseInvoice && this.values.purchaseOrderItem === other.values.purchaseOrderItem
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toVariable(): PurchaseInvoiceItemVariable {
        return new PurchaseInvoiceItemVariable(this.variableName, {
            purchaseInvoice: new PurchaseInvoice(this.values.purchaseInvoice),
            purchaseOrderItem: new PurchaseOrderItem(this.values.purchaseOrderItem),
            quantity: this.values.quantity,
            approved: this.values.approved,
            rejected: this.values.rejected
        })
    }
}

export class MaterialApprovalSlipRow {
    [immerable] = true
    readonly typeName = 'MaterialApprovalSlip'
    readonly variableName: string
    values: {
        purchaseInvoice: string
    }

    constructor(variableName: string, values: { purchaseInvoice: string }) {
        this.variableName = variableName
        this.values = values
    }

    equals(other: MaterialApprovalSlipRow): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toVariable(): MaterialApprovalSlipVariable {
        return new MaterialApprovalSlipVariable(this.variableName, {
            purchaseInvoice: new PurchaseInvoice(this.values.purchaseInvoice)
        })
    }
}

export class MaterialApprovalSlipItemRow {
    [immerable] = true
    readonly typeName = 'MaterialApprovalSlipItem'
    readonly variableName: string
    readonly materialApprovalSlip: string
    readonly purchaseInvoiceItem: string
    values: {
        // UNQ(materialApprovalSlip, purchaseInvoiceItem)
        materialApprovalSlip: string
        // assertion(materialApprovalSlip.purchaseInvoice == purchaseInvoiceItem.purchaseInvoice)
        purchaseInvoiceItem: string
        // assertion(quantity <= purchaseInvoiceItem.quantity && quantity > 0)
        quantity: Number // { purchaseInvoiceItem.approved += quantity && purchaseInvoiceItem.purchaseOrderItem.quotationItem.indentItem.approved += quantity }
        // assertion(requisted <= quantity && requisted >= 0)
        requisted: Number
    }

    constructor(variableName: string, values: { materialApprovalSlip: string, purchaseInvoiceItem: string, quantity: Number, requisted: Number }) {
        this.variableName = variableName
        this.values = values
        this.materialApprovalSlip = values.materialApprovalSlip
        this.purchaseInvoiceItem = values.purchaseInvoiceItem
    }

    equals(other: MaterialApprovalSlipItemRow): boolean {
        if (!other) {
            return false;
        }
        return this.values.materialApprovalSlip === other.values.materialApprovalSlip && this.values.purchaseInvoiceItem === other.values.purchaseInvoiceItem
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toVariable(): MaterialApprovalSlipItemVariable {
        return new MaterialApprovalSlipItemVariable(this.variableName, {
            materialApprovalSlip: new MaterialApprovalSlip(this.values.materialApprovalSlip),
            purchaseInvoiceItem: new PurchaseInvoiceItem(this.values.purchaseInvoiceItem),
            quantity: this.values.quantity,
            requisted: this.values.requisted
        })
    }
}

export class MaterialRejectionSlipRow {
    [immerable] = true
    readonly typeName = 'MaterialRejectionSlip'
    readonly variableName: string
    values: {
        purchaseInvoice: string
    }

    constructor(variableName: string, values: { purchaseInvoice: string }) {
        this.variableName = variableName
        this.values = values
    }

    equals(other: MaterialRejectionSlipRow): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toVariable(): MaterialRejectionSlipVariable {
        return new MaterialRejectionSlipVariable(this.variableName, {
            purchaseInvoice: new PurchaseInvoice(this.values.purchaseInvoice)
        })
    }
}

export class MaterialRejectionSlipItemRow {
    [immerable] = true
    readonly typeName = 'MaterialRejectionSlipItem'
    readonly variableName: string
    readonly materialRejectionSlip: string
    readonly purchaseInvoiceItem: string
    values: {
        // UNQ(materialRejectionSlip, purchaseInvoiceItem)
        materialRejectionSlip: string
        // assertion(materialRejectionSlip.purchaseInvoice == purchaseInvoiceItem.purchaseInvoice)
        purchaseInvoiceItem: string
        // assertion(quantity <= purchaseInvoiceItem.quantity && quantity > 0)
        quantity: Number // { purchaseInvoiceItem.rejected += quantity && purchaseInvoiceItem.purchaseOrderItem.quotationItem.indentItem.rejected += quantity  }
        // assertion(returned <= quantity && returned >= 0)
        returned: Number
    }

    constructor(variableName: string, values: { materialRejectionSlip: string, purchaseInvoiceItem: string, quantity: Number, returned: Number }) {
        this.variableName = variableName
        this.values = values
        this.materialRejectionSlip = values.materialRejectionSlip
        this.purchaseInvoiceItem = values.purchaseInvoiceItem
    }

    equals(other: MaterialRejectionSlipItemRow): boolean {
        if (!other) {
            return false;
        }
        return this.values.materialRejectionSlip === other.values.materialRejectionSlip && this.values.purchaseInvoiceItem === other.values.purchaseInvoiceItem
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toVariable(): MaterialRejectionSlipItemVariable {
        return new MaterialRejectionSlipItemVariable(this.variableName, {
            materialRejectionSlip: new MaterialRejectionSlip(this.values.materialRejectionSlip),
            purchaseInvoiceItem: new PurchaseInvoiceItem(this.values.purchaseInvoiceItem),
            quantity: this.values.quantity,
            returned: this.values.returned
        })
    }
}

export class MaterialReturnSlipRow {
    [immerable] = true
    readonly typeName = 'MaterialReturnSlip'
    readonly variableName: string
    values: {
        materialRejectionSlip: string
    }

    constructor(variableName: string, values: { materialRejectionSlip: string }) {
        this.variableName = variableName
        this.values = values
    }

    equals(other: MaterialReturnSlipRow): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toVariable(): MaterialReturnSlipVariable {
        return new MaterialReturnSlipVariable(this.variableName, {
            materialRejectionSlip: new MaterialRejectionSlip(this.values.materialRejectionSlip)
        })
    }
}

export class MaterialReturnSlipItemRow {
    [immerable] = true
    readonly typeName = 'MaterialReturnSlipItem'
    readonly variableName: string
    readonly materialReturnSlip: string
    readonly materialRejectionSlipItem: string
    values: {
        // UNQ(materialReturnSlip, materialRejectionSlipItem)
        materialReturnSlip: string
        // assertion(materialReturnSlip.materialRejectionSlip == materialRejectionSlipItem.materialRejectionSlip)
        materialRejectionSlipItem: string
        // assertion(quantity <= materialRejectionSlipItem.quantity && quantity > 0)
        quantity: Number // { materialRejectionSlipItem.returned += quantity && materialRejectionSlipItem.purchaseInvoiceItem.purchaseOrderItem.quotationItem.indentItem.returned += quantity }
    }

    constructor(variableName: string, values: { materialReturnSlip: string, materialRejectionSlipItem: string, quantity: Number }) {
        this.variableName = variableName
        this.values = values
        this.materialReturnSlip = values.materialReturnSlip
        this.materialRejectionSlipItem = values.materialRejectionSlipItem
    }

    equals(other: MaterialReturnSlipItemRow): boolean {
        if (!other) {
            return false;
        }
        return this.values.materialReturnSlip === other.values.materialReturnSlip && this.values.materialRejectionSlipItem === other.values.materialRejectionSlipItem
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toVariable(): MaterialReturnSlipItemVariable {
        return new MaterialReturnSlipItemVariable(this.variableName, {
            materialReturnSlip: new MaterialReturnSlip(this.values.materialReturnSlip),
            materialRejectionSlipItem: new MaterialRejectionSlipItem(this.values.materialRejectionSlipItem),
            quantity: this.values.quantity
        })
    }
}

export class MaterialRequistionSlipRow {
    [immerable] = true
    readonly typeName = 'MaterialRequistionSlip'
    readonly variableName: string
    values: {
        materialApprovalSlip: string
    }

    constructor(variableName: string, values: { materialApprovalSlip: string }) {
        this.variableName = variableName
        this.values = values
    }

    equals(other: MaterialRequistionSlipRow): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toVariable(): MaterialRequistionSlipVariable {
        return new MaterialRequistionSlipVariable(this.variableName, {
            materialApprovalSlip: new MaterialApprovalSlip(this.values.materialApprovalSlip)
        })
    }
}

export class MaterialRequistionSlipItemRow {
    [immerable] = true
    readonly typeName = 'MaterialRequistionSlipItem'
    readonly variableName: string
    readonly materialRequistionSlip: string
    readonly materialApprovalSlipItem: string
    values: {
        // UNQ(materialRequistionSlip, materialApprovalSlipItem)
        materialRequistionSlip: string
        // assertion(materialRequistionSlip.materialApprovalSlip == materialApprovalSlipItem.materialApprovalSlip)
        materialApprovalSlipItem: string
        // assertion(quantity <= materialApprovalSlipItem.quantity && quantity > 0)
        quantity: Number // { materialApprovalSlipItem.requisted += quantity && materialApprovalSlipItem.purchaseInvoiceItem.purchaseOrderItem.quotationItem.indentItem.requisted += quantity }
        // assertion(consumed <= quantity && consumed >= 0)
        consumed: Number
    }

    constructor(variableName: string, values: { materialRequistionSlip: string, materialApprovalSlipItem: string, quantity: Number, consumed: Number }) {
        this.variableName = variableName
        this.values = values
        this.materialRequistionSlip = values.materialRequistionSlip
        this.materialApprovalSlipItem = values.materialApprovalSlipItem
    }

    equals(other: MaterialRequistionSlipItemRow): boolean {
        if (!other) {
            return false;
        }
        return this.values.materialRequistionSlip === other.values.materialRequistionSlip && this.values.materialApprovalSlipItem === other.values.materialApprovalSlipItem
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toVariable(): MaterialRequistionSlipItemVariable {
        return new MaterialRequistionSlipItemVariable(this.variableName, {
            materialRequistionSlip: new MaterialRequistionSlip(this.values.materialRequistionSlip),
            materialApprovalSlipItem: new MaterialApprovalSlipItem(this.values.materialApprovalSlipItem),
            quantity: this.values.quantity,
            consumed: this.values.consumed
        })
    }
}

export class BOMRow {
    [immerable] = true
    readonly typeName = 'BOM'
    readonly variableName: string
    values: {}

    constructor(variableName: string, values: {}) {
        this.variableName = variableName
        this.values = values
    }

    equals(other: BOMRow): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toVariable(): BOMVariable {
        return new BOMVariable(this.variableName, this.values)
    }
}

export class BOMItemRow {
    [immerable] = true
    readonly typeName = 'BOMItem'
    readonly variableName: string
    readonly bom: string
    readonly product: string
    values: {
        // UNQ(bom, product)
        bom: string
        // assertion(product.consumable == true)
        product: string
        // assertion(quantity > 0 && uom.product == product)
        quantity: Number
        uom: string
    }

    constructor(variableName: string, values: { bom: string, product: string, quantity: Number, uom: string }) {
        this.variableName = variableName
        this.values = values
        this.bom = values.bom
        this.product = values.product
    }

    equals(other: BOMItemRow): boolean {
        if (!other) {
            return false;
        }
        return this.values.bom === other.values.bom && this.values.product === other.values.product
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toVariable(): BOMItemVariable {
        return new BOMItemVariable(this.variableName, {
            bom: new BOM(this.values.bom),
            product: new Product(this.values.product),
            quantity: this.values.quantity,
            uom: new UOM(this.values.uom)
        })
    }
}

export class ProductionPreparationSlipRow {
    [immerable] = true
    readonly typeName = 'ProductionPreparationSlip'
    readonly variableName: string
    values: {
        bom: string
        // assertion((approved + scrapped) <= quantity && approved >= 0 && scrapped >= 0)
        approved: Number
        scrapped: Number
    }

    constructor(variableName: string, values: { bom: string, approved: Number, scrapped: Number }) {
        this.variableName = variableName
        this.values = values
    }

    equals(other: ProductionPreparationSlipRow): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toVariable(): ProductionPreparationSlipVariable {
        return new ProductionPreparationSlipVariable(this.variableName, {
            bom: new BOM(this.values.bom),
            approved: this.values.approved,
            scrapped: this.values.scrapped
        })
    }
}

export class ProductionPreparationSlipItemRow {
    [immerable] = true
    readonly typeName = 'ProductionPreparationSlipItem'
    readonly variableName: string
    readonly productionPreparationSlip: string
    readonly bomItem: string
    values: {
        // UNQ(productionPreparationSlip, bomItem)
        productionPreparationSlip: string
        bomItem: string
        // assertion(bomItem.product == materialRequistionSlipItem.materialApprovalSlipItem.purchaseInvoiceItem.purchaseOrderItem.quotationItem.indentItem.product)
        materialRequistionSlipItem: string
        // { materialRequistionSlipItem.consumed += bomItem.quantity * materialRequistionSlipItem.materialApprovalSlipItem.purchaseInvoiceItem.purchaseOrderItem.quotationItem.indentItem.uom.conversionRate / bomItem.product.uom.conversionRate }
        // { materialRequistionSlipItem.materialApprovalSlipItem.purchaseInvoiceItem.purchaseOrderItem.quotationItem.indentItem.consumed += bomItem.quantity * materialRequistionSlipItem.materialApprovalSlipItem.purchaseInvoiceItem.purchaseOrderItem.quotationItem.indentItem.uom.conversionRate / bomItem.product.uom.conversionRate }
    }

    constructor(variableName: string, values: { productionPreparationSlip: string, bomItem: string, materialRequistionSlipItem: string }) {
        this.variableName = variableName
        this.values = values
        this.productionPreparationSlip = values.productionPreparationSlip
        this.bomItem = values.bomItem
    }

    equals(other: ProductionPreparationSlipItemRow): boolean {
        if (!other) {
            return false;
        }
        return this.values.productionPreparationSlip === other.values.productionPreparationSlip && this.values.bomItem === other.values.bomItem
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toVariable(): ProductionPreparationSlipItemVariable {
        return new ProductionPreparationSlipItemVariable(this.variableName, {
            productionPreparationSlip: new ProductionPreparationSlip(this.values.productionPreparationSlip),
            bomItem: this.values.bomItem,
            materialRequistionSlipItem: new MaterialRequistionSlipItem(this.values.materialRequistionSlipItem)
        })
    }
}

export class ScrapMaterialSlipRow {
    [immerable] = true
    readonly typeName = 'ScrapMaterialSlip'
    readonly variableName: string
    values: {
        productionPreparationSlip: string
        // assertion(quantity <= productionPreparationSlip.bom.quantity && quantity > 0)
        quantity: Number // { productionPreparationSlip.scrapped += quantity }
    }

    constructor(variableName: string, values: { productionPreparationSlip: string, quantity: Number }) {
        this.variableName = variableName
        this.values = values
    }

    equals(other: ScrapMaterialSlipRow): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toVariable(): ScrapMaterialSlipVariable {
        return new ScrapMaterialSlipVariable(this.variableName, {
            productionPreparationSlip: new ProductionPreparationSlip(this.values.productionPreparationSlip),
            quantity: this.values.quantity
        })
    }
}

export class TransferMaterialSlipRow {
    [immerable] = true
    readonly typeName = 'TransferMaterialSlip'
    readonly variableName: string
    values: {
        productionPreparationSlip: string
        // assertion(quantity <= productionPreparationSlip.bom.quantity && quantity > 0)
        quantity: Number // { productionPreparationSlip.approved += quantity }
        // assertion(transfered <= quantity && transfered >= 0)
        transferred: Number
    }

    constructor(variableName: string, values: { productionPreparationSlip: string, quantity: Number, transferred: Number }) {
        this.variableName = variableName
        this.values = values
    }

    equals(other: TransferMaterialSlipRow): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toVariable(): TransferMaterialSlipVariable {
        return new TransferMaterialSlipVariable(this.variableName, {
            productionPreparationSlip: new ProductionPreparationSlip(this.values.productionPreparationSlip),
            quantity: this.values.quantity,
            transferred: this.values.transferred
        })
    }
}

export class WarehouseAcceptanceSlipRow {
    [immerable] = true
    readonly typeName = 'WarehouseAcceptanceSlip'
    readonly variableName: string
    values: {
        transferMaterialSlip: string
        // assertion(quantity <= transferMaterialSlip.quantity && quantity > 0)
        quantity: Number // { transferMaterialSlip.transfered += quantity }
    }

    constructor(variableName: string, values: { transferMaterialSlip: string, quantity: Number }) {
        this.variableName = variableName
        this.values = values
    }

    equals(other: WarehouseAcceptanceSlipRow): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toVariable(): WarehouseAcceptanceSlipVariable {
        return new WarehouseAcceptanceSlipVariable(this.variableName, {
            transferMaterialSlip: new TransferMaterialSlip(this.values.transferMaterialSlip),
            quantity: this.values.quantity
        })
    }
}

export class DiffRow {
    [immerable] = true
    readonly id: number
    active: boolean
    variables: {
        Product: {
            replace: Array<ProductRow>
            remove: Array<string>
        }
        UOM: {
            replace: Array<UOMRow>
            remove: Array<string>
        },
        Indent: {
            replace: Array<IndentRow>
            remove: Array<string>
        },
        IndentItem: {
            replace: Array<IndentItemRow>
            remove: Array<string>
        },
        Supplier: {
            replace: Array<SupplierRow>
            remove: Array<string>
        },
        SupplierProduct: {
            replace: Array<SupplierProductRow>
            remove: Array<string>
        },
        Quotation: {
            replace: Array<QuotationRow>
            remove: Array<string>
        },
        QuotationItem: {
            replace: Array<QuotationItemRow>
            remove: Array<string>
        },
        PurchaseOrder: {
            replace: Array<PurchaseOrderRow>
            remove: Array<string>
        },
        PurchaseOrderItem: {
            replace: Array<PurchaseOrderItemRow>
            remove: Array<string>
        },
        PurchaseInvoice: {
            replace: Array<PurchaseInvoiceRow>
            remove: Array<string>
        },
        PurchaseInvoiceItem: {
            replace: Array<PurchaseInvoiceItemRow>
            remove: Array<string>
        },
        MaterialApprovalSlip: {
            replace: Array<MaterialApprovalSlipRow>
            remove: Array<string>
        },
        MaterialApprovalSlipItem: {
            replace: Array<MaterialApprovalSlipItemRow>
            remove: Array<string>
        },
        MaterialRejectionSlip: {
            replace: Array<MaterialRejectionSlipRow>
            remove: Array<string>
        },
        MaterialRejectionSlipItem: {
            replace: Array<MaterialRejectionSlipItemRow>
            remove: Array<string>
        },
        MaterialReturnSlip: {
            replace: Array<MaterialReturnSlipRow>
            remove: Array<string>
        },
        MaterialReturnSlipItem: {
            replace: Array<MaterialReturnSlipItemRow>
            remove: Array<string>
        },
        MaterialRequistionSlip: {
            replace: Array<MaterialRequistionSlipRow>
            remove: Array<string>
        },
        MaterialRequistionSlipItem: {
            replace: Array<MaterialRequistionSlipItemRow>
            remove: Array<string>
        },
        BOM: {
            replace: Array<BOMRow>
            remove: Array<string>
        },
        BOMItem: {
            replace: Array<BOMItemRow>
            remove: Array<string>
        },
        ProductionPreparationSlip: {
            replace: Array<ProductionPreparationSlipRow>
            remove: Array<string>
        },
        ProductionPreparationSlipItem: {
            replace: Array<ProductionPreparationSlipItemRow>
            remove: Array<string>
        },
        ScrapMaterialSlip: {
            replace: Array<ScrapMaterialSlipRow>
            remove: Array<string>
        },
        TransferMaterialSlip: {
            replace: Array<TransferMaterialSlipRow>
            remove: Array<string>
        },
        WarehouseAcceptanceSlip: {
            replace: Array<WarehouseAcceptanceSlipRow>
            remove: Array<string>
        }
    }

    constructor(variables: {
        Product: {
            replace: HashSet<ProductRow>,
            remove: HashSet<string>
        },
        UOM: {
            replace: HashSet<UOMRow>,
            remove: HashSet<string>
        },
        Indent: {
            replace: HashSet<IndentRow>,
            remove: HashSet<string>
        },
        IndentItem: {
            replace: HashSet<IndentItemRow>,
            remove: HashSet<string>
        },
        Supplier: {
            replace: HashSet<SupplierRow>,
            remove: HashSet<string>
        },
        SupplierProduct: {
            replace: HashSet<SupplierProductRow>,
            remove: HashSet<string>
        },
        Quotation: {
            replace: HashSet<QuotationRow>,
            remove: HashSet<string>
        },
        QuotationItem: {
            replace: HashSet<QuotationItemRow>,
            remove: HashSet<string>
        },
        PurchaseOrder: {
            replace: HashSet<PurchaseOrderRow>,
            remove: HashSet<string>
        },
        PurchaseOrderItem: {
            replace: HashSet<PurchaseOrderItemRow>,
            remove: HashSet<string>
        },
        PurchaseInvoice: {
            replace: HashSet<PurchaseInvoiceRow>,
            remove: HashSet<string>
        },
        PurchaseInvoiceItem: {
            replace: HashSet<PurchaseInvoiceItemRow>,
            remove: HashSet<string>
        },
        MaterialApprovalSlip: {
            replace: HashSet<MaterialApprovalSlipRow>,
            remove: HashSet<string>
        },
        MaterialApprovalSlipItem: {
            replace: HashSet<MaterialApprovalSlipItemRow>,
            remove: HashSet<string>
        },
        MaterialRejectionSlip: {
            replace: HashSet<MaterialRejectionSlipRow>,
            remove: HashSet<string>
        },
        MaterialRejectionSlipItem: {
            replace: HashSet<MaterialRejectionSlipItemRow>,
            remove: HashSet<string>
        },
        MaterialReturnSlip: {
            replace: HashSet<MaterialReturnSlipRow>,
            remove: HashSet<string>
        },
        MaterialReturnSlipItem: {
            replace: HashSet<MaterialReturnSlipItemRow>,
            remove: HashSet<string>
        },
        MaterialRequistionSlip: {
            replace: HashSet<MaterialRequistionSlipRow>,
            remove: HashSet<string>
        },
        MaterialRequistionSlipItem: {
            replace: HashSet<MaterialRequistionSlipItemRow>,
            remove: HashSet<string>
        },
        BOM: {
            replace: HashSet<BOMRow>,
            remove: HashSet<string>
        },
        BOMItem: {
            replace: HashSet<BOMItemRow>,
            remove: HashSet<string>
        },
        ProductionPreparationSlip: {
            replace: HashSet<ProductionPreparationSlipRow>,
            remove: HashSet<string>
        },
        ProductionPreparationSlipItem: {
            replace: HashSet<ProductionPreparationSlipItemRow>,
            remove: HashSet<string>
        },
        ScrapMaterialSlip: {
            replace: HashSet<ScrapMaterialSlipRow>,
            remove: HashSet<string>
        },
        TransferMaterialSlip: {
            replace: HashSet<TransferMaterialSlipRow>,
            remove: HashSet<string>
        },
        WarehouseAcceptanceSlip: {
            replace: HashSet<WarehouseAcceptanceSlipRow>,
            remove: HashSet<string>
        }
    }) {
        this.id = -1
        this.active = true
        this.variables = {
            Product: {
                replace: variables.Product.replace.toArray(),
                remove: variables.Product.remove.toArray()
            },
            UOM: {
                replace: variables.UOM.replace.toArray(),
                remove: variables.UOM.remove.toArray()
            },
            Indent: {
                replace: variables.Indent.replace.toArray(),
                remove: variables.Indent.remove.toArray()
            },
            IndentItem: {
                replace: variables.IndentItem.replace.toArray(),
                remove: variables.IndentItem.remove.toArray()
            },
            Supplier: {
                replace: variables.Supplier.replace.toArray(),
                remove: variables.Supplier.remove.toArray()
            },
            SupplierProduct: {
                replace: variables.SupplierProduct.replace.toArray(),
                remove: variables.SupplierProduct.remove.toArray()
            },
            Quotation: {
                replace: variables.Quotation.replace.toArray(),
                remove: variables.Quotation.remove.toArray()
            },
            QuotationItem: {
                replace: variables.QuotationItem.replace.toArray(),
                remove: variables.QuotationItem.remove.toArray()
            },
            PurchaseOrder: {
                replace: variables.PurchaseOrder.replace.toArray(),
                remove: variables.PurchaseOrder.remove.toArray()
            },
            PurchaseOrderItem: {
                replace: variables.PurchaseOrderItem.replace.toArray(),
                remove: variables.PurchaseOrderItem.remove.toArray()
            },
            PurchaseInvoice: {
                replace: variables.PurchaseInvoice.replace.toArray(),
                remove: variables.PurchaseInvoice.remove.toArray()
            },
            PurchaseInvoiceItem: {
                replace: variables.PurchaseInvoiceItem.replace.toArray(),
                remove: variables.PurchaseInvoiceItem.remove.toArray()
            },
            MaterialApprovalSlip: {
                replace: variables.MaterialApprovalSlip.replace.toArray(),
                remove: variables.MaterialApprovalSlip.remove.toArray()
            },
            MaterialApprovalSlipItem: {
                replace: variables.MaterialApprovalSlipItem.replace.toArray(),
                remove: variables.MaterialApprovalSlipItem.remove.toArray()
            },
            MaterialRejectionSlip: {
                replace: variables.MaterialRejectionSlip.replace.toArray(),
                remove: variables.MaterialRejectionSlip.remove.toArray()
            },
            MaterialRejectionSlipItem: {
                replace: variables.MaterialRejectionSlipItem.replace.toArray(),
                remove: variables.MaterialRejectionSlipItem.remove.toArray()
            },
            MaterialReturnSlip: {
                replace: variables.MaterialReturnSlip.replace.toArray(),
                remove: variables.MaterialReturnSlip.remove.toArray()
            },
            MaterialReturnSlipItem: {
                replace: variables.MaterialReturnSlipItem.replace.toArray(),
                remove: variables.MaterialReturnSlipItem.remove.toArray()
            },
            MaterialRequistionSlip: {
                replace: variables.MaterialRequistionSlip.replace.toArray(),
                remove: variables.MaterialRequistionSlip.remove.toArray()
            },
            MaterialRequistionSlipItem: {
                replace: variables.MaterialRequistionSlipItem.replace.toArray(),
                remove: variables.MaterialRequistionSlipItem.remove.toArray()
            },
            BOM: {
                replace: variables.BOM.replace.toArray(),
                remove: variables.BOM.remove.toArray()
            },
            BOMItem: {
                replace: variables.BOMItem.replace.toArray(),
                remove: variables.BOMItem.remove.toArray()
            },
            ProductionPreparationSlip: {
                replace: variables.ProductionPreparationSlip.replace.toArray(),
                remove: variables.ProductionPreparationSlip.remove.toArray()
            },
            ProductionPreparationSlipItem: {
                replace: variables.ProductionPreparationSlipItem.replace.toArray(),
                remove: variables.ProductionPreparationSlipItem.remove.toArray()
            },
            ScrapMaterialSlip: {
                replace: variables.ScrapMaterialSlip.replace.toArray(),
                remove: variables.ScrapMaterialSlip.remove.toArray()
            },
            TransferMaterialSlip: {
                replace: variables.TransferMaterialSlip.replace.toArray(),
                remove: variables.TransferMaterialSlip.remove.toArray()
            },
            WarehouseAcceptanceSlip: {
                replace: variables.WarehouseAcceptanceSlip.replace.toArray(),
                remove: variables.WarehouseAcceptanceSlip.remove.toArray()
            }
        }
    }

    equals(other: DiffRow): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toVariable(): DiffVariable {
        return new DiffVariable(this.id, this.active, {
            Product: {
                replace: HashSet.of<ProductVariable>().addAll(this.variables.Product.replace.map(x => x.toVariable())),
                remove: HashSet.of<Product>().addAll(this.variables.Product.remove.map(x => new Product(x)))
            },
            UOM: {
                replace: HashSet.of<UOMVariable>().addAll(this.variables.UOM.replace.map(x => x.toVariable())),
                remove: HashSet.of<UOM>().addAll(this.variables.UOM.remove.map(x => new UOM(x)))
            },
            Indent: {
                replace: HashSet.of<IndentVariable>().addAll(this.variables.Indent.replace.map(x => x.toVariable())),
                remove: HashSet.of<Indent>().addAll(this.variables.Indent.remove.map(x => new Indent(x)))
            },
            IndentItem: {
                replace: HashSet.of<IndentItemVariable>().addAll(this.variables.IndentItem.replace.map(x => x.toVariable())),
                remove: HashSet.of<IndentItem>().addAll(this.variables.IndentItem.remove.map(x => new IndentItem(x)))
            },
            Supplier: {
                replace: HashSet.of<SupplierVariable>().addAll(this.variables.Supplier.replace.map(x => x.toVariable())),
                remove: HashSet.of<Supplier>().addAll(this.variables.Supplier.remove.map(x => new Supplier(x)))
            },
            SupplierProduct: {
                replace: HashSet.of<SupplierProductVariable>().addAll(this.variables.SupplierProduct.replace.map(x => x.toVariable())),
                remove: HashSet.of<SupplierProduct>().addAll(this.variables.SupplierProduct.remove.map(x => new SupplierProduct(x)))
            },
            Quotation: {
                replace: HashSet.of<QuotationVariable>().addAll(this.variables.Quotation.replace.map(x => x.toVariable())),
                remove: HashSet.of<Quotation>().addAll(this.variables.Quotation.remove.map(x => new Quotation(x)))
            },
            QuotationItem: {
                replace: HashSet.of<QuotationItemVariable>().addAll(this.variables.QuotationItem.replace.map(x => x.toVariable())),
                remove: HashSet.of<QuotationItem>().addAll(this.variables.QuotationItem.remove.map(x => new QuotationItem(x)))
            },
            PurchaseOrder: {
                replace: HashSet.of<PurchaseOrderVariable>().addAll(this.variables.PurchaseOrder.replace.map(x => x.toVariable())),
                remove: HashSet.of<PurchaseOrder>().addAll(this.variables.PurchaseOrder.remove.map(x => new PurchaseOrder(x)))
            },
            PurchaseOrderItem: {
                replace: HashSet.of<PurchaseOrderItemVariable>().addAll(this.variables.PurchaseOrderItem.replace.map(x => x.toVariable())),
                remove: HashSet.of<PurchaseOrderItem>().addAll(this.variables.PurchaseOrderItem.remove.map(x => new PurchaseOrderItem(x)))
            },
            PurchaseInvoice: {
                replace: HashSet.of<PurchaseInvoiceVariable>().addAll(this.variables.PurchaseInvoice.replace.map(x => x.toVariable())),
                remove: HashSet.of<PurchaseInvoice>().addAll(this.variables.PurchaseInvoice.remove.map(x => new PurchaseInvoice(x)))
            },
            PurchaseInvoiceItem: {
                replace: HashSet.of<PurchaseInvoiceItemVariable>().addAll(this.variables.PurchaseInvoiceItem.replace.map(x => x.toVariable())),
                remove: HashSet.of<PurchaseInvoiceItem>().addAll(this.variables.PurchaseInvoiceItem.remove.map(x => new PurchaseInvoiceItem(x)))
            },
            MaterialApprovalSlip: {
                replace: HashSet.of<MaterialApprovalSlipVariable>().addAll(this.variables.MaterialApprovalSlip.replace.map(x => x.toVariable())),
                remove: HashSet.of<MaterialApprovalSlip>().addAll(this.variables.MaterialApprovalSlip.remove.map(x => new MaterialApprovalSlip(x)))
            },
            MaterialApprovalSlipItem: {
                replace: HashSet.of<MaterialApprovalSlipItemVariable>().addAll(this.variables.MaterialApprovalSlipItem.replace.map(x => x.toVariable())),
                remove: HashSet.of<MaterialApprovalSlipItem>().addAll(this.variables.MaterialApprovalSlipItem.remove.map(x => new MaterialApprovalSlipItem(x)))
            },
            MaterialRejectionSlip: {
                replace: HashSet.of<MaterialRejectionSlipVariable>().addAll(this.variables.MaterialRejectionSlip.replace.map(x => x.toVariable())),
                remove: HashSet.of<MaterialRejectionSlip>().addAll(this.variables.MaterialRejectionSlip.remove.map(x => new MaterialRejectionSlip(x)))
            },
            MaterialRejectionSlipItem: {
                replace: HashSet.of<MaterialRejectionSlipItemVariable>().addAll(this.variables.MaterialRejectionSlipItem.replace.map(x => x.toVariable())),
                remove: HashSet.of<MaterialRejectionSlipItem>().addAll(this.variables.MaterialRejectionSlipItem.remove.map(x => new MaterialRejectionSlipItem(x)))
            },
            MaterialReturnSlip: {
                replace: HashSet.of<MaterialReturnSlipVariable>().addAll(this.variables.MaterialReturnSlip.replace.map(x => x.toVariable())),
                remove: HashSet.of<MaterialReturnSlip>().addAll(this.variables.MaterialReturnSlip.remove.map(x => new MaterialReturnSlip(x)))
            },
            MaterialReturnSlipItem: {
                replace: HashSet.of<MaterialReturnSlipItemVariable>().addAll(this.variables.MaterialReturnSlipItem.replace.map(x => x.toVariable())),
                remove: HashSet.of<MaterialReturnSlipItem>().addAll(this.variables.MaterialReturnSlipItem.remove.map(x => new MaterialReturnSlipItem(x)))
            },
            MaterialRequistionSlip: {
                replace: HashSet.of<MaterialRequistionSlipVariable>().addAll(this.variables.MaterialRequistionSlip.replace.map(x => x.toVariable())),
                remove: HashSet.of<MaterialRequistionSlip>().addAll(this.variables.MaterialRequistionSlip.remove.map(x => new MaterialRequistionSlip(x)))
            },
            MaterialRequistionSlipItem: {
                replace: HashSet.of<MaterialRequistionSlipItemVariable>().addAll(this.variables.MaterialRequistionSlipItem.replace.map(x => x.toVariable())),
                remove: HashSet.of<MaterialRequistionSlipItem>().addAll(this.variables.MaterialRequistionSlipItem.remove.map(x => new MaterialRequistionSlipItem(x)))
            },
            BOM: {
                replace: HashSet.of<BOMVariable>().addAll(this.variables.BOM.replace.map(x => x.toVariable())),
                remove: HashSet.of<BOM>().addAll(this.variables.BOM.remove.map(x => new BOM(x)))
            },
            BOMItem: {
                replace: HashSet.of<BOMItemVariable>().addAll(this.variables.BOMItem.replace.map(x => x.toVariable())),
                remove: HashSet.of<BOMItem>().addAll(this.variables.BOMItem.remove.map(x => new BOMItem(x)))
            },
            ProductionPreparationSlip: {
                replace: HashSet.of<ProductionPreparationSlipVariable>().addAll(this.variables.ProductionPreparationSlip.replace.map(x => x.toVariable())),
                remove: HashSet.of<ProductionPreparationSlip>().addAll(this.variables.ProductionPreparationSlip.remove.map(x => new ProductionPreparationSlip(x)))
            },
            ProductionPreparationSlipItem: {
                replace = HashSet.of<ProductionPreparationSlipItemVariable>().addAll(this.variables.ProductionPreparationSlipItem.replace.map(x => x.toVariable())),
                remove: HashSet.of<ProductionPreparationSlipItem>().addAll(this.variables.ProductionPreparationSlipItem.remove.map(x => new ProductionPreparationSlipItem(x)))
            },
            ScrapMaterialSlip: {
                replace: HashSet.of<ScrapMaterialSlipVariable>().addAll(this.variables.ScrapMaterialSlip.replace.map(x => x.toVariable())),
                remove: HashSet.of<ScrapMaterialSlip>().addAll(this.variables.ScrapMaterialSlip.remove.map(x => new ScrapMaterialSlip(x)))
            },
            TransferMaterialSlip: {
                replace: HashSet.of<TransferMaterialSlipVariable>().addAll(this.variables.TransferMaterialSlip.replace.map(x => x.toVariable())),
                remove: HashSet.of<TransferMaterialSlip>().addAll(this.variables.TransferMaterialSlip.remove.map(x => new TransferMaterialSlip(x)))
            },
            WarehouseAcceptanceSlip: {
                replace: HashSet.of<WarehouseAcceptanceSlipVariable>().addAll(this.variables.WarehouseAcceptanceSlip.replace.map(x => x.toVariable())),
                remove: HashSet.of<WarehouseAcceptanceSlip>().addAll(this.variables.WarehouseAcceptanceSlip.remove.map(x => new WarehouseAcceptanceSlip(x)))
            }
        })
    }
}
