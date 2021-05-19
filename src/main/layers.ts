import { HashSet } from 'prelude-ts'
import { Immutable } from 'immer'
import { ProductVariable, UOMVariable, IndentVariable, IndentItemVariable, SupplierVariable, SupplierProductVariable, QuotationVariable, QuotationItemVariable, PurchaseOrderVariable, PurchaseOrderItemVariable, PurchaseInvoiceVariable, PurchaseInvoiceItemVariable, MaterialApprovalSlipVariable, MaterialApprovalSlipItemVariable, MaterialRejectionSlipVariable, MaterialRejectionSlipItemVariable, MaterialReturnSlipVariable, MaterialReturnSlipItemVariable, MaterialRequistionSlipVariable, MaterialRequistionSlipItemVariable, BOMVariable, BOMItemVariable, ProductionPreparationSlipVariable, ProductionPreparationSlipItemVariable, ScrapMaterialSlipVariable, TransferMaterialSlipVariable, WarehouseAcceptanceSlipVariable, Product, UOM, Indent, IndentItem, Supplier, SupplierProduct, Quotation, QuotationItem, PurchaseOrder, PurchaseOrderItem, PurchaseInvoice, PurchaseInvoiceItem, MaterialApprovalSlip, MaterialApprovalSlipItem, MaterialRejectionSlip, MaterialRejectionSlipItem, MaterialReturnSlip, MaterialReturnSlipItem, MaterialRequistionSlip, MaterialRequistionSlipItem, BOM, BOMItem, ProductionPreparationSlip, ProductionPreparationSlipItem, ScrapMaterialSlip, TransferMaterialSlip, WarehouseAcceptanceSlip, Variable } from './variables'

export type Layer = {
    Product: HashSet<Immutable<ProductVariable>>
    UOM: HashSet<Immutable<UOMVariable>>
    Indent: HashSet<Immutable<IndentVariable>>
    IndentItem: HashSet<Immutable<IndentItemVariable>>
    Supplier: HashSet<Immutable<SupplierVariable>>
    SupplierProduct: HashSet<Immutable<SupplierProductVariable>>
    Quotation: HashSet<Immutable<QuotationVariable>>
    QuotationItem: HashSet<Immutable<QuotationItemVariable>>
    PurchaseOrder: HashSet<Immutable<PurchaseOrderVariable>>
    PurchaseOrderItem: HashSet<Immutable<PurchaseOrderItemVariable>>
    PurchaseInvoice: HashSet<Immutable<PurchaseInvoiceVariable>>
    PurchaseInvoiceItem: HashSet<Immutable<PurchaseInvoiceItemVariable>>
    MaterialApprovalSlip: HashSet<Immutable<MaterialApprovalSlipVariable>>
    MaterialApprovalSlipItem: HashSet<Immutable<MaterialApprovalSlipItemVariable>>
    MaterialRejectionSlip: HashSet<Immutable<MaterialRejectionSlipVariable>>
    MaterialRejectionSlipItem: HashSet<Immutable<MaterialRejectionSlipItemVariable>>
    MaterialReturnSlip: HashSet<Immutable<MaterialReturnSlipVariable>>
    MaterialReturnSlipItem: HashSet<Immutable<MaterialReturnSlipItemVariable>>
    MaterialRequistionSlip: HashSet<Immutable<MaterialRequistionSlipVariable>>
    MaterialRequistionSlipItem: HashSet<Immutable<MaterialRequistionSlipItemVariable>>
    BOM: HashSet<Immutable<BOMVariable>>
    BOMItem: HashSet<Immutable<BOMItemVariable>>
    ProductionPreparationSlip: HashSet<Immutable<ProductionPreparationSlipVariable>>
    ProductionPreparationSlipItem: HashSet<Immutable<ProductionPreparationSlipItemVariable>>
    ScrapMaterialSlip: HashSet<Immutable<ScrapMaterialSlipVariable>>
    TransferMaterialSlip: HashSet<Immutable<TransferMaterialSlipVariable>>
    WarehouseAcceptanceSlip: HashSet<Immutable<WarehouseAcceptanceSlipVariable>>
}

export type Diff = {
    id: number
    active: boolean
    Product: {
        replace: HashSet<Immutable<ProductVariable>>
        remove: HashSet<Immutable<Product>>
    }
    UOM: {
        replace: HashSet<Immutable<UOMVariable>>,
        remove: HashSet<Immutable<UOM>>
    },
    Indent: {
        replace: HashSet<Immutable<IndentVariable>>,
        remove: HashSet<Immutable<Indent>>
    },
    IndentItem: {
        replace: HashSet<Immutable<IndentItemVariable>>,
        remove: HashSet<Immutable<IndentItem>>
    },
    Supplier: {
        replace: HashSet<Immutable<SupplierVariable>>,
        remove: HashSet<Immutable<Supplier>>
    },
    SupplierProduct: {
        replace: HashSet<Immutable<SupplierProductVariable>>,
        remove: HashSet<Immutable<SupplierProduct>>
    },
    Quotation: {
        replace: HashSet<Immutable<QuotationVariable>>,
        remove: HashSet<Immutable<Quotation>>
    },
    QuotationItem: {
        replace: HashSet<Immutable<QuotationItemVariable>>,
        remove: HashSet<Immutable<QuotationItem>>
    },
    PurchaseOrder: {
        replace: HashSet<Immutable<PurchaseOrderVariable>>,
        remove: HashSet<Immutable<PurchaseOrder>>
    },
    PurchaseOrderItem: {
        replace: HashSet<Immutable<PurchaseOrderItemVariable>>,
        remove: HashSet<Immutable<PurchaseOrderItem>>
    },
    PurchaseInvoice: {
        replace: HashSet<Immutable<PurchaseInvoiceVariable>>,
        remove: HashSet<Immutable<PurchaseInvoice>>
    },
    PurchaseInvoiceItem: {
        replace: HashSet<Immutable<PurchaseInvoiceItemVariable>>,
        remove: HashSet<Immutable<PurchaseInvoiceItem>>
    },
    MaterialApprovalSlip: {
        replace: HashSet<Immutable<MaterialApprovalSlipVariable>>,
        remove: HashSet<Immutable<MaterialApprovalSlip>>
    },
    MaterialApprovalSlipItem: {
        replace: HashSet<Immutable<MaterialApprovalSlipItemVariable>>,
        remove: HashSet<Immutable<MaterialApprovalSlipItem>>
    },
    MaterialRejectionSlip: {
        replace: HashSet<Immutable<MaterialRejectionSlipVariable>>,
        remove: HashSet<Immutable<MaterialRejectionSlip>>
    },
    MaterialRejectionSlipItem: {
        replace: HashSet<Immutable<MaterialRejectionSlipItemVariable>>,
        remove: HashSet<Immutable<MaterialRejectionSlipItem>>
    },
    MaterialReturnSlip: {
        replace: HashSet<Immutable<MaterialReturnSlipVariable>>,
        remove: HashSet<Immutable<MaterialReturnSlip>>
    },
    MaterialReturnSlipItem: {
        replace: HashSet<Immutable<MaterialReturnSlipItemVariable>>,
        remove: HashSet<Immutable<MaterialReturnSlipItem>>
    },
    MaterialRequistionSlip: {
        replace: HashSet<Immutable<MaterialRequistionSlipVariable>>,
        remove: HashSet<Immutable<MaterialRequistionSlip>>
    },
    MaterialRequistionSlipItem: {
        replace: HashSet<Immutable<MaterialRequistionSlipItemVariable>>,
        remove: HashSet<Immutable<MaterialRequistionSlipItem>>
    },
    BOM: {
        replace: HashSet<Immutable<BOMVariable>>,
        remove: HashSet<Immutable<BOM>>
    },
    BOMItem: {
        replace: HashSet<Immutable<BOMItemVariable>>,
        remove: HashSet<Immutable<BOMItem>>
    },
    ProductionPreparationSlip: {
        replace: HashSet<Immutable<ProductionPreparationSlipVariable>>,
        remove: HashSet<Immutable<ProductionPreparationSlip>>
    },
    ProductionPreparationSlipItem: {
        replace: HashSet<Immutable<ProductionPreparationSlipItemVariable>>,
        remove: HashSet<Immutable<ProductionPreparationSlipItem>>
    },
    ScrapMaterialSlip: {
        replace: HashSet<Immutable<ScrapMaterialSlipVariable>>,
        remove: HashSet<Immutable<ScrapMaterialSlip>>
    },
    TransferMaterialSlip: {
        replace: HashSet<Immutable<TransferMaterialSlipVariable>>,
        remove: HashSet<Immutable<TransferMaterialSlip>>
    },
    WarehouseAcceptanceSlip: {
        replace: HashSet<Immutable<WarehouseAcceptanceSlipVariable>>,
        remove: HashSet<Immutable<WarehouseAcceptanceSlip>>
    }
}

export function applyDiff(layer: Readonly<Layer>, diff: Diff): Layer {
    if (diff.active === false)
        return layer
    else {
        return Object.keys(layer).reduce((acc, typeName) => {
            acc[typeName] = layer[typeName].filter((x: Immutable<Variable>) => !diff[typeName].remove.contains(x.variableName)).addAll(diff[typeName].replace)
            return acc
        }, { ...layer })
    }
}

export function compose(base: Readonly<Layer>, diffs: Array<Diff>) {
    var result: Layer = base
    diffs.forEach(diff => {
        result = applyDiff(result, diff)
    })
    return result
}
