import { immerable, Immutable } from 'immer'
import { HashSet } from 'prelude-ts'
import { DiffVariable } from './layers'
import { Number, Decimal, ProductVariable, UOMVariable, IndentVariable, IndentItemVariable, SupplierVariable, SupplierProductVariable, QuotationVariable, QuotationItemVariable, PurchaseOrderVariable, PurchaseOrderItemVariable, PurchaseInvoiceVariable, PurchaseInvoiceItemVariable, MaterialApprovalSlipVariable, MaterialApprovalSlipItemVariable, MaterialRejectionSlipVariable, MaterialRejectionSlipItemVariable, MaterialReturnSlipVariable, MaterialReturnSlipItemVariable, MaterialRequistionSlipVariable, MaterialRequistionSlipItemVariable, BOMVariable, BOMItemVariable, ProductionPreparationSlipVariable, ProductionPreparationSlipItemVariable, ScrapMaterialSlipVariable, TransferMaterialSlipVariable, WarehouseAcceptanceSlipVariable, Product, UOM, Indent, IndentItem, Supplier, Quotation, QuotationItem, PurchaseOrder, PurchaseOrderItem, PurchaseInvoice, PurchaseInvoiceItem, MaterialApprovalSlip, MaterialApprovalSlipItem, MaterialRejectionSlip, MaterialRejectionSlipItem, MaterialReturnSlip, MaterialRequistionSlip, MaterialRequistionSlipItem, BOM, ProductionPreparationSlip, TransferMaterialSlip, MaterialReturnSlipItem, BOMItem, ProductionPreparationSlipItem, ScrapMaterialSlip, WarehouseAcceptanceSlip, SupplierProduct } from './variables'

export type Row =
    | ProductRow
    | UOMRow
    | IndentRow
    | IndentItemRow
    | SupplierRow
    | SupplierProductRow
    | QuotationRow
    | QuotationItemRow
    | PurchaseOrderRow
    | PurchaseOrderItemRow
    | PurchaseInvoiceRow
    | PurchaseInvoiceItemRow
    | MaterialApprovalSlipRow
    | MaterialApprovalSlipItemRow
    | MaterialRejectionSlipRow
    | MaterialRejectionSlipItemRow
    | MaterialReturnSlipRow
    | MaterialReturnSlipItemRow
    | MaterialRequistionSlipRow
    | MaterialRequistionSlipItemRow
    | BOMRow
    | BOMItemRow
    | ProductionPreparationSlipRow
    | ProductionPreparationSlipItemRow
    | ScrapMaterialSlipRow
    | TransferMaterialSlipRow
    | WarehouseAcceptanceSlipRow

export class ProductRow {
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

    static toVariable(row: ProductRow): ProductVariable {
        return new ProductVariable(row.variableName, row.values)
    }
}

export class UOMRow {
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

    static toVariable(row: UOMRow): UOMVariable {
        return new UOMVariable(row.variableName, {
            product: new Product(row.values.product),
            name: row.values.name,
            conversionRate: row.values.conversionRate
        })
    }
}

export class IndentRow {
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

    static toVariable(row: IndentRow): IndentVariable {
        return new IndentVariable(row.variableName, row.values)
    }
}

export class IndentItemRow {
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

    static toVariable(row: IndentItemRow): IndentItemVariable {
        return new IndentItemVariable(row.variableName, {
            indent: new Indent(row.values.indent),
            product: new Product(row.values.product),
            quantity: row.values.quantity,
            uom: new UOM(row.values.uom),
            ordered: row.values.ordered,
            received: row.values.received,
            approved: row.values.approved,
            rejected: row.values.rejected,
            returned: row.values.returned,
            requisted: row.values.requisted,
            consumed: row.values.consumed
        })
    }
}

export class SupplierRow {
    readonly typeName = 'Supplier'
    variableName: string
    values: {}

    constructor(variableName: string, values: {}) {
        this.variableName = variableName
        this.values = values
    }

    static toVariable(row: SupplierRow): SupplierVariable {
        return new SupplierVariable(row.variableName, row.values)
    }
}

export class SupplierProductRow {
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

    static toVariable(row: SupplierProductRow): SupplierProductVariable {
        return new SupplierProductVariable(row.variableName, {
            supplier: new Supplier(row.values.supplier),
            product: new Product(row.values.product)
        })
    }
}

export class QuotationRow {
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

    static toVariable(row: QuotationRow): QuotationVariable {
        return new QuotationVariable(row.variableName, {
            indent: new Indent(row.values.indent),
            supplier: new Supplier(row.values.supplier)
        })
    }
}

export class QuotationItemRow {
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

    static toVariable(row: QuotationItemRow): QuotationItemVariable {
        return new QuotationItemVariable(row.variableName, {
            quotation: new Quotation(row.values.quotation),
            indentItem: new IndentItem(row.values.indentItem),
            quantity: row.values.quantity
        })
    }
}

export class PurchaseOrderRow {
    readonly typeName = 'PurchaseOrder'
    readonly variableName: string
    values: {
        quotation: string
    }

    constructor(variableName: string, values: { quotation: string }) {
        this.variableName = variableName
        this.values = values
    }

    static toVariable(row: PurchaseOrderRow): PurchaseOrderVariable {
        return new PurchaseOrderVariable(row.variableName, {
            quotation: new Quotation(row.values.quotation)
        })
    }
}

export class PurchaseOrderItemRow {
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

    static toVariable(row: PurchaseOrderItemRow): PurchaseOrderItemVariable {
        return new PurchaseOrderItemVariable(row.variableName, {
            purchaseOrder: new PurchaseOrder(row.values.purchaseOrder),
            quotationItem: new QuotationItem(row.values.quotationItem),
            quantity: row.values.quantity,
            price: row.values.price,
            received: row.values.received
        })
    }
}

export class PurchaseInvoiceRow {
    readonly typeName = 'PurchaseInvoice'
    readonly variableName: string
    values: {
        purchaseOrder: string
    }

    constructor(variableName: string, values: { purchaseOrder: string }) {
        this.variableName = variableName
        this.values = values
    }

    static toVariable(row: PurchaseInvoiceRow): PurchaseInvoiceVariable {
        return new PurchaseInvoiceVariable(row.variableName, {
            purchaseOrder: new PurchaseOrder(row.values.purchaseOrder)
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

    static toVariable(row: PurchaseInvoiceItemRow): PurchaseInvoiceItemVariable {
        return new PurchaseInvoiceItemVariable(row.variableName, {
            purchaseInvoice: new PurchaseInvoice(row.values.purchaseInvoice),
            purchaseOrderItem: new PurchaseOrderItem(row.values.purchaseOrderItem),
            quantity: row.values.quantity,
            approved: row.values.approved,
            rejected: row.values.rejected
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

    static toVariable(row: MaterialApprovalSlipRow): MaterialApprovalSlipVariable {
        return new MaterialApprovalSlipVariable(row.variableName, {
            purchaseInvoice: new PurchaseInvoice(row.values.purchaseInvoice)
        })
    }
}

export class MaterialApprovalSlipItemRow {
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

    static toVariable(row: MaterialApprovalSlipItemRow): MaterialApprovalSlipItemVariable {
        return new MaterialApprovalSlipItemVariable(row.variableName, {
            materialApprovalSlip: new MaterialApprovalSlip(row.values.materialApprovalSlip),
            purchaseInvoiceItem: new PurchaseInvoiceItem(row.values.purchaseInvoiceItem),
            quantity: row.values.quantity,
            requisted: row.values.requisted
        })
    }
}

export class MaterialRejectionSlipRow {
    readonly typeName = 'MaterialRejectionSlip'
    readonly variableName: string
    values: {
        purchaseInvoice: string
    }

    constructor(variableName: string, values: { purchaseInvoice: string }) {
        this.variableName = variableName
        this.values = values
    }

    static toVariable(row: MaterialRejectionSlipRow): MaterialRejectionSlipVariable {
        return new MaterialRejectionSlipVariable(row.variableName, {
            purchaseInvoice: new PurchaseInvoice(row.values.purchaseInvoice)
        })
    }
}

export class MaterialRejectionSlipItemRow {
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

    static toVariable(row: MaterialRejectionSlipItemRow): MaterialRejectionSlipItemVariable {
        return new MaterialRejectionSlipItemVariable(row.variableName, {
            materialRejectionSlip: new MaterialRejectionSlip(row.values.materialRejectionSlip),
            purchaseInvoiceItem: new PurchaseInvoiceItem(row.values.purchaseInvoiceItem),
            quantity: row.values.quantity,
            returned: row.values.returned
        })
    }
}

export class MaterialReturnSlipRow {
    readonly typeName = 'MaterialReturnSlip'
    readonly variableName: string
    values: {
        materialRejectionSlip: string
    }

    constructor(variableName: string, values: { materialRejectionSlip: string }) {
        this.variableName = variableName
        this.values = values
    }

    static toVariable(row: MaterialReturnSlipRow): MaterialReturnSlipVariable {
        return new MaterialReturnSlipVariable(row.variableName, {
            materialRejectionSlip: new MaterialRejectionSlip(row.values.materialRejectionSlip)
        })
    }
}

export class MaterialReturnSlipItemRow {
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

    static toVariable(row: MaterialReturnSlipItemRow): MaterialReturnSlipItemVariable {
        return new MaterialReturnSlipItemVariable(row.variableName, {
            materialReturnSlip: new MaterialReturnSlip(row.values.materialReturnSlip),
            materialRejectionSlipItem: new MaterialRejectionSlipItem(row.values.materialRejectionSlipItem),
            quantity: row.values.quantity
        })
    }
}

export class MaterialRequistionSlipRow {
    readonly typeName = 'MaterialRequistionSlip'
    readonly variableName: string
    values: {
        materialApprovalSlip: string
    }

    constructor(variableName: string, values: { materialApprovalSlip: string }) {
        this.variableName = variableName
        this.values = values
    }

    static toVariable(row: MaterialRequistionSlipRow): MaterialRequistionSlipVariable {
        return new MaterialRequistionSlipVariable(row.variableName, {
            materialApprovalSlip: new MaterialApprovalSlip(row.values.materialApprovalSlip)
        })
    }
}

export class MaterialRequistionSlipItemRow {
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

    static toVariable(row: MaterialRequistionSlipItemRow): MaterialRequistionSlipItemVariable {
        return new MaterialRequistionSlipItemVariable(row.variableName, {
            materialRequistionSlip: new MaterialRequistionSlip(row.values.materialRequistionSlip),
            materialApprovalSlipItem: new MaterialApprovalSlipItem(row.values.materialApprovalSlipItem),
            quantity: row.values.quantity,
            consumed: row.values.consumed
        })
    }
}

export class BOMRow {
    readonly typeName = 'BOM'
    readonly variableName: string
    values: {}

    constructor(variableName: string, values: {}) {
        this.variableName = variableName
        this.values = values
    }

    static toVariable(row: BOMRow): BOMVariable {
        return new BOMVariable(row.variableName, row.values)
    }
}

export class BOMItemRow {
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

    static toVariable(row: BOMItemRow): BOMItemVariable {
        return new BOMItemVariable(row.variableName, {
            bom: new BOM(row.values.bom),
            product: new Product(row.values.product),
            quantity: row.values.quantity,
            uom: new UOM(row.values.uom)
        })
    }
}

export class ProductionPreparationSlipRow {
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

    static toVariable(row: ProductionPreparationSlipRow): ProductionPreparationSlipVariable {
        return new ProductionPreparationSlipVariable(row.variableName, {
            bom: new BOM(row.values.bom),
            approved: row.values.approved,
            scrapped: row.values.scrapped
        })
    }
}

export class ProductionPreparationSlipItemRow {
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

    static toVariable(row: ProductionPreparationSlipItemRow): ProductionPreparationSlipItemVariable {
        return new ProductionPreparationSlipItemVariable(row.variableName, {
            productionPreparationSlip: new ProductionPreparationSlip(row.values.productionPreparationSlip),
            bomItem: row.values.bomItem,
            materialRequistionSlipItem: new MaterialRequistionSlipItem(row.values.materialRequistionSlipItem)
        })
    }
}

export class ScrapMaterialSlipRow {
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

    static toVariable(row: ScrapMaterialSlipRow): ScrapMaterialSlipVariable {
        return new ScrapMaterialSlipVariable(row.variableName, {
            productionPreparationSlip: new ProductionPreparationSlip(row.values.productionPreparationSlip),
            quantity: row.values.quantity
        })
    }
}

export class TransferMaterialSlipRow {
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

    static toVariable(row: TransferMaterialSlipRow): TransferMaterialSlipVariable {
        return new TransferMaterialSlipVariable(row.variableName, {
            productionPreparationSlip: new ProductionPreparationSlip(row.values.productionPreparationSlip),
            quantity: row.values.quantity,
            transferred: row.values.transferred
        })
    }
}

export class WarehouseAcceptanceSlipRow {
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

    static toVariable(row: WarehouseAcceptanceSlipRow): WarehouseAcceptanceSlipVariable {
        return new WarehouseAcceptanceSlipVariable(row.variableName, {
            transferMaterialSlip: new TransferMaterialSlip(row.values.transferMaterialSlip),
            quantity: row.values.quantity
        })
    }
}

export class DiffRow {
    readonly id?: number
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
            replace: Array<ProductRow>,
            remove: Array<string>
        },
        UOM: {
            replace: Array<UOMRow>,
            remove: Array<string>
        },
        Indent: {
            replace: Array<IndentRow>,
            remove: Array<string>
        },
        IndentItem: {
            replace: Array<IndentItemRow>,
            remove: Array<string>
        },
        Supplier: {
            replace: Array<SupplierRow>,
            remove: Array<string>
        },
        SupplierProduct: {
            replace: Array<SupplierProductRow>,
            remove: Array<string>
        },
        Quotation: {
            replace: Array<QuotationRow>,
            remove: Array<string>
        },
        QuotationItem: {
            replace: Array<QuotationItemRow>,
            remove: Array<string>
        },
        PurchaseOrder: {
            replace: Array<PurchaseOrderRow>,
            remove: Array<string>
        },
        PurchaseOrderItem: {
            replace: Array<PurchaseOrderItemRow>,
            remove: Array<string>
        },
        PurchaseInvoice: {
            replace: Array<PurchaseInvoiceRow>,
            remove: Array<string>
        },
        PurchaseInvoiceItem: {
            replace: Array<PurchaseInvoiceItemRow>,
            remove: Array<string>
        },
        MaterialApprovalSlip: {
            replace: Array<MaterialApprovalSlipRow>,
            remove: Array<string>
        },
        MaterialApprovalSlipItem: {
            replace: Array<MaterialApprovalSlipItemRow>,
            remove: Array<string>
        },
        MaterialRejectionSlip: {
            replace: Array<MaterialRejectionSlipRow>,
            remove: Array<string>
        },
        MaterialRejectionSlipItem: {
            replace: Array<MaterialRejectionSlipItemRow>,
            remove: Array<string>
        },
        MaterialReturnSlip: {
            replace: Array<MaterialReturnSlipRow>,
            remove: Array<string>
        },
        MaterialReturnSlipItem: {
            replace: Array<MaterialReturnSlipItemRow>,
            remove: Array<string>
        },
        MaterialRequistionSlip: {
            replace: Array<MaterialRequistionSlipRow>,
            remove: Array<string>
        },
        MaterialRequistionSlipItem: {
            replace: Array<MaterialRequistionSlipItemRow>,
            remove: Array<string>
        },
        BOM: {
            replace: Array<BOMRow>,
            remove: Array<string>
        },
        BOMItem: {
            replace: Array<BOMItemRow>,
            remove: Array<string>
        },
        ProductionPreparationSlip: {
            replace: Array<ProductionPreparationSlipRow>,
            remove: Array<string>
        },
        ProductionPreparationSlipItem: {
            replace: Array<ProductionPreparationSlipItemRow>,
            remove: Array<string>
        },
        ScrapMaterialSlip: {
            replace: Array<ScrapMaterialSlipRow>,
            remove: Array<string>
        },
        TransferMaterialSlip: {
            replace: Array<TransferMaterialSlipRow>,
            remove: Array<string>
        },
        WarehouseAcceptanceSlip: {
            replace: Array<WarehouseAcceptanceSlipRow>,
            remove: Array<string>
        }
    }) {
        this.active = true
        this.variables = variables
    }

    static toVariable(diff: Immutable<DiffRow>): DiffVariable {
        return new DiffVariable(diff.id, diff.active, {
            Product: {
                replace: HashSet.of<ProductVariable>().addAll(diff.variables.Product.replace.map(x => ProductRow.toVariable(x))),
                remove: HashSet.of<Product>().addAll(diff.variables.Product.remove.map(x => new Product(x)))
            },
            UOM: {
                replace: HashSet.of<UOMVariable>().addAll(diff.variables.UOM.replace.map(x => UOMRow.toVariable(x))),
                remove: HashSet.of<UOM>().addAll(diff.variables.UOM.remove.map(x => new UOM(x)))
            },
            Indent: {
                replace: HashSet.of<IndentVariable>().addAll(diff.variables.Indent.replace.map(x => IndentRow.toVariable(x))),
                remove: HashSet.of<Indent>().addAll(diff.variables.Indent.remove.map(x => new Indent(x)))
            },
            IndentItem: {
                replace: HashSet.of<IndentItemVariable>().addAll(diff.variables.IndentItem.replace.map(x => IndentItemRow.toVariable(x))),
                remove: HashSet.of<IndentItem>().addAll(diff.variables.IndentItem.remove.map(x => new IndentItem(x)))
            },
            Supplier: {
                replace: HashSet.of<SupplierVariable>().addAll(diff.variables.Supplier.replace.map(x => SupplierRow.toVariable(x))),
                remove: HashSet.of<Supplier>().addAll(diff.variables.Supplier.remove.map(x => new Supplier(x)))
            },
            SupplierProduct: {
                replace: HashSet.of<SupplierProductVariable>().addAll(diff.variables.SupplierProduct.replace.map(x => SupplierProductRow.toVariable(x))),
                remove: HashSet.of<SupplierProduct>().addAll(diff.variables.SupplierProduct.remove.map(x => new SupplierProduct(x)))
            },
            Quotation: {
                replace: HashSet.of<QuotationVariable>().addAll(diff.variables.Quotation.replace.map(x => QuotationRow.toVariable(x))),
                remove: HashSet.of<Quotation>().addAll(diff.variables.Quotation.remove.map(x => new Quotation(x)))
            },
            QuotationItem: {
                replace: HashSet.of<QuotationItemVariable>().addAll(diff.variables.QuotationItem.replace.map(x => QuotationItemRow.toVariable(x))),
                remove: HashSet.of<QuotationItem>().addAll(diff.variables.QuotationItem.remove.map(x => new QuotationItem(x)))
            },
            PurchaseOrder: {
                replace: HashSet.of<PurchaseOrderVariable>().addAll(diff.variables.PurchaseOrder.replace.map(x => PurchaseOrderRow.toVariable(x))),
                remove: HashSet.of<PurchaseOrder>().addAll(diff.variables.PurchaseOrder.remove.map(x => new PurchaseOrder(x)))
            },
            PurchaseOrderItem: {
                replace: HashSet.of<PurchaseOrderItemVariable>().addAll(diff.variables.PurchaseOrderItem.replace.map(x => PurchaseOrderItemRow.toVariable(x))),
                remove: HashSet.of<PurchaseOrderItem>().addAll(diff.variables.PurchaseOrderItem.remove.map(x => new PurchaseOrderItem(x)))
            },
            PurchaseInvoice: {
                replace: HashSet.of<PurchaseInvoiceVariable>().addAll(diff.variables.PurchaseInvoice.replace.map(x => PurchaseInvoiceRow.toVariable(x))),
                remove: HashSet.of<PurchaseInvoice>().addAll(diff.variables.PurchaseInvoice.remove.map(x => new PurchaseInvoice(x)))
            },
            PurchaseInvoiceItem: {
                replace: HashSet.of<PurchaseInvoiceItemVariable>().addAll(diff.variables.PurchaseInvoiceItem.replace.map(x => PurchaseInvoiceItemRow.toVariable(x))),
                remove: HashSet.of<PurchaseInvoiceItem>().addAll(diff.variables.PurchaseInvoiceItem.remove.map(x => new PurchaseInvoiceItem(x)))
            },
            MaterialApprovalSlip: {
                replace: HashSet.of<MaterialApprovalSlipVariable>().addAll(diff.variables.MaterialApprovalSlip.replace.map(x => MaterialApprovalSlipRow.toVariable(x))),
                remove: HashSet.of<MaterialApprovalSlip>().addAll(diff.variables.MaterialApprovalSlip.remove.map(x => new MaterialApprovalSlip(x)))
            },
            MaterialApprovalSlipItem: {
                replace: HashSet.of<MaterialApprovalSlipItemVariable>().addAll(diff.variables.MaterialApprovalSlipItem.replace.map(x => MaterialApprovalSlipItemRow.toVariable(x))),
                remove: HashSet.of<MaterialApprovalSlipItem>().addAll(diff.variables.MaterialApprovalSlipItem.remove.map(x => new MaterialApprovalSlipItem(x)))
            },
            MaterialRejectionSlip: {
                replace: HashSet.of<MaterialRejectionSlipVariable>().addAll(diff.variables.MaterialRejectionSlip.replace.map(x => MaterialRejectionSlipRow.toVariable(x))),
                remove: HashSet.of<MaterialRejectionSlip>().addAll(diff.variables.MaterialRejectionSlip.remove.map(x => new MaterialRejectionSlip(x)))
            },
            MaterialRejectionSlipItem: {
                replace: HashSet.of<MaterialRejectionSlipItemVariable>().addAll(diff.variables.MaterialRejectionSlipItem.replace.map(x => MaterialRejectionSlipItemRow.toVariable(x))),
                remove: HashSet.of<MaterialRejectionSlipItem>().addAll(diff.variables.MaterialRejectionSlipItem.remove.map(x => new MaterialRejectionSlipItem(x)))
            },
            MaterialReturnSlip: {
                replace: HashSet.of<MaterialReturnSlipVariable>().addAll(diff.variables.MaterialReturnSlip.replace.map(x => MaterialReturnSlipRow.toVariable(x))),
                remove: HashSet.of<MaterialReturnSlip>().addAll(diff.variables.MaterialReturnSlip.remove.map(x => new MaterialReturnSlip(x)))
            },
            MaterialReturnSlipItem: {
                replace: HashSet.of<MaterialReturnSlipItemVariable>().addAll(diff.variables.MaterialReturnSlipItem.replace.map(x => MaterialReturnSlipItemRow.toVariable(x))),
                remove: HashSet.of<MaterialReturnSlipItem>().addAll(diff.variables.MaterialReturnSlipItem.remove.map(x => new MaterialReturnSlipItem(x)))
            },
            MaterialRequistionSlip: {
                replace: HashSet.of<MaterialRequistionSlipVariable>().addAll(diff.variables.MaterialRequistionSlip.replace.map(x => MaterialRequistionSlipRow.toVariable(x))),
                remove: HashSet.of<MaterialRequistionSlip>().addAll(diff.variables.MaterialRequistionSlip.remove.map(x => new MaterialRequistionSlip(x)))
            },
            MaterialRequistionSlipItem: {
                replace: HashSet.of<MaterialRequistionSlipItemVariable>().addAll(diff.variables.MaterialRequistionSlipItem.replace.map(x => MaterialRequistionSlipItemRow.toVariable(x))),
                remove: HashSet.of<MaterialRequistionSlipItem>().addAll(diff.variables.MaterialRequistionSlipItem.remove.map(x => new MaterialRequistionSlipItem(x)))
            },
            BOM: {
                replace: HashSet.of<BOMVariable>().addAll(diff.variables.BOM.replace.map(x => BOMRow.toVariable(x))),
                remove: HashSet.of<BOM>().addAll(diff.variables.BOM.remove.map(x => new BOM(x)))
            },
            BOMItem: {
                replace: HashSet.of<BOMItemVariable>().addAll(diff.variables.BOMItem.replace.map(x => BOMItemRow.toVariable(x))),
                remove: HashSet.of<BOMItem>().addAll(diff.variables.BOMItem.remove.map(x => new BOMItem(x)))
            },
            ProductionPreparationSlip: {
                replace: HashSet.of<ProductionPreparationSlipVariable>().addAll(diff.variables.ProductionPreparationSlip.replace.map(x => ProductionPreparationSlipRow.toVariable(x))),
                remove: HashSet.of<ProductionPreparationSlip>().addAll(diff.variables.ProductionPreparationSlip.remove.map(x => new ProductionPreparationSlip(x)))
            },
            ProductionPreparationSlipItem: {
                replace: HashSet.of<ProductionPreparationSlipItemVariable>().addAll(diff.variables.ProductionPreparationSlipItem.replace.map(x => ProductionPreparationSlipItemRow.toVariable(x))),
                remove: HashSet.of<ProductionPreparationSlipItem>().addAll(diff.variables.ProductionPreparationSlipItem.remove.map(x => new ProductionPreparationSlipItem(x)))
            },
            ScrapMaterialSlip: {
                replace: HashSet.of<ScrapMaterialSlipVariable>().addAll(diff.variables.ScrapMaterialSlip.replace.map(x => ScrapMaterialSlipRow.toVariable(x))),
                remove: HashSet.of<ScrapMaterialSlip>().addAll(diff.variables.ScrapMaterialSlip.remove.map(x => new ScrapMaterialSlip(x)))
            },
            TransferMaterialSlip: {
                replace: HashSet.of<TransferMaterialSlipVariable>().addAll(diff.variables.TransferMaterialSlip.replace.map(x => TransferMaterialSlipRow.toVariable(x))),
                remove: HashSet.of<TransferMaterialSlip>().addAll(diff.variables.TransferMaterialSlip.remove.map(x => new TransferMaterialSlip(x)))
            },
            WarehouseAcceptanceSlip: {
                replace: HashSet.of<WarehouseAcceptanceSlipVariable>().addAll(diff.variables.WarehouseAcceptanceSlip.replace.map(x => WarehouseAcceptanceSlipRow.toVariable(x))),
                remove: HashSet.of<WarehouseAcceptanceSlip>().addAll(diff.variables.WarehouseAcceptanceSlip.remove.map(x => new WarehouseAcceptanceSlip(x)))
            }
        })
    }
}
