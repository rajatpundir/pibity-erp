import { immerable } from 'immer'
import { Number, Decimal, ProductVariable, UOMVariable, IndentVariable, IndentItemVariable, SupplierVariable, SupplierProductVariable, QuotationVariable, QuotationItemVariable, PurchaseOrderVariable, PurchaseOrderItemVariable, PurchaseInvoiceVariable, PurchaseInvoiceItemVariable, MaterialApprovalSlipVariable, MaterialApprovalSlipItemVariable, MaterialRejectionSlipVariable, MaterialRejectionSlipItemVariable, MaterialReturnSlipVariable, MaterialReturnSlipItemVariable, MaterialRequistionSlipVariable, MaterialRequistionSlipItemVariable, BOMVariable, BOMItemVariable, ProductionPreparationSlipVariable, ProductionPreparationSlipItemVariable, ScrapMaterialSlipVariable, TransferMaterialSlipVariable, WarehouseAcceptanceSlipVariable, Product, UOM, Indent, IndentItem, Supplier, Quotation, QuotationItem, PurchaseOrder, PurchaseOrderItem, PurchaseInvoice, PurchaseInvoiceItem, MaterialApprovalSlip, MaterialApprovalSlipItem, MaterialRejectionSlip, MaterialRejectionSlipItem, MaterialReturnSlip, MaterialRequistionSlip, MaterialRequistionSlipItem, BOM, ProductionPreparationSlip, TransferMaterialSlip } from './variables'

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
    readonly parent: string
    values: {
        // UNQ(product, name)
        product: string
        name: string
        conversionRate: Decimal
    }

    constructor(variableName: string, values: { product: string, name: string, conversionRate: Decimal }) {
        this.variableName = variableName
        this.values = values
        this.parent = values.product
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
    readonly parent: string
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
        this.parent = values.indent
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
    readonly parent: string
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
        this.parent = values.quotation
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
    readonly parent: string
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
        this.parent = values.purchaseOrder
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
    readonly parent: string
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
        this.parent = values.purchaseInvoice
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
    readonly parent: string
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
        this.parent = values.materialApprovalSlip
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
    readonly parent: string
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
        this.parent = values.materialRejectionSlip
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
    readonly parent: string
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
        this.parent = values.materialReturnSlip
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
    readonly parent: string
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
        this.parent = values.materialRequistionSlip
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
    readonly parent: string
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
        this.parent = values.bom
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
    readonly parent: string
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
        this.parent = values.productionPreparationSlip
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
