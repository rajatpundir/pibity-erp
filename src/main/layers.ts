import { HashSet } from 'prelude-ts'
import { Immutable } from 'immer'
import { ProductVariable, UOMVariable, IndentVariable, IndentItemVariable, SupplierVariable, SupplierProductVariable, QuotationVariable, QuotationItemVariable, PurchaseOrderVariable, PurchaseOrderItemVariable, PurchaseInvoiceVariable, PurchaseInvoiceItemVariable, MaterialApprovalSlipVariable, MaterialApprovalSlipItemVariable, MaterialRejectionSlipVariable, MaterialRejectionSlipItemVariable, MaterialReturnSlipVariable, MaterialReturnSlipItemVariable, MaterialRequistionSlipVariable, MaterialRequistionSlipItemVariable, BOMVariable, BOMItemVariable, ProductionPreparationSlipVariable, ProductionPreparationSlipItemVariable, ScrapMaterialSlipVariable, TransferMaterialSlipVariable, WarehouseAcceptanceSlipVariable, Product, UOM, Indent, IndentItem, Supplier, SupplierProduct, Quotation, QuotationItem, PurchaseOrder, PurchaseOrderItem, PurchaseInvoice, PurchaseInvoiceItem, MaterialApprovalSlip, MaterialApprovalSlipItem, MaterialRejectionSlip, MaterialRejectionSlipItem, MaterialReturnSlip, MaterialReturnSlipItem, MaterialRequistionSlip, MaterialRequistionSlipItem, BOM, BOMItem, ProductionPreparationSlip, ProductionPreparationSlipItem, ScrapMaterialSlip, TransferMaterialSlip, WarehouseAcceptanceSlip } from './variables'

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
        const result: Layer = {
            Product: layer.Product.filter(x => !diff.Product.remove.contains(x.variableName)).addAll(diff.Product.replace),
            UOM: layer.UOM.filter(x => !diff.UOM.remove.contains(x.variableName)).addAll(diff.UOM.replace),
            Indent: layer.Indent.filter(x => !diff.Indent.remove.contains(x.variableName)).addAll(diff.Indent.replace),
            IndentItem: layer.IndentItem.filter(x => !diff.IndentItem.remove.contains(x.variableName)).addAll(diff.IndentItem.replace),
            Supplier: layer.Supplier.filter(x => !diff.Supplier.remove.contains(x.variableName)).addAll(diff.Supplier.replace),
            SupplierProduct: layer.SupplierProduct.filter(x => !diff.SupplierProduct.remove.contains(x.variableName)).addAll(diff.SupplierProduct.replace),
            Quotation: layer.Quotation.filter(x => !diff.Quotation.remove.contains(x.variableName)).addAll(diff.Quotation.replace),
            QuotationItem: layer.QuotationItem.filter(x => !diff.QuotationItem.remove.contains(x.variableName)).addAll(diff.QuotationItem.replace),
            PurchaseOrder: layer.PurchaseOrder.filter(x => !diff.PurchaseOrder.remove.contains(x.variableName)).addAll(diff.PurchaseOrder.replace),
            PurchaseOrderItem: layer.PurchaseOrderItem.filter(x => !diff.PurchaseOrderItem.remove.contains(x.variableName)).addAll(diff.PurchaseOrderItem.replace),
            PurchaseInvoice: layer.PurchaseInvoice.filter(x => !diff.PurchaseInvoice.remove.contains(x.variableName)).addAll(diff.PurchaseInvoice.replace),
            PurchaseInvoiceItem: layer.PurchaseInvoiceItem.filter(x => !diff.PurchaseInvoiceItem.remove.contains(x.variableName)).addAll(diff.PurchaseInvoiceItem.replace),
            MaterialApprovalSlip: layer.MaterialApprovalSlip.filter(x => !diff.MaterialApprovalSlip.remove.contains(x.variableName)).addAll(diff.MaterialApprovalSlip.replace),
            MaterialApprovalSlipItem: layer.MaterialApprovalSlipItem.filter(x => !diff.MaterialApprovalSlipItem.remove.contains(x.variableName)).addAll(diff.MaterialApprovalSlipItem.replace),
            MaterialRejectionSlip: layer.MaterialRejectionSlip.filter(x => !diff.MaterialRejectionSlip.remove.contains(x.variableName)).addAll(diff.MaterialRejectionSlip.replace),
            MaterialRejectionSlipItem: layer.MaterialRejectionSlipItem.filter(x => !diff.MaterialRejectionSlipItem.remove.contains(x.variableName)).addAll(diff.MaterialRejectionSlipItem.replace),
            MaterialReturnSlip: layer.MaterialReturnSlip.filter(x => !diff.MaterialReturnSlip.remove.contains(x.variableName)).addAll(diff.MaterialReturnSlip.replace),
            MaterialReturnSlipItem: layer.MaterialReturnSlipItem.filter(x => !diff.MaterialReturnSlipItem.remove.contains(x.variableName)).addAll(diff.MaterialReturnSlipItem.replace),
            MaterialRequistionSlip: layer.MaterialRequistionSlip.filter(x => !diff.MaterialRequistionSlip.remove.contains(x.variableName)).addAll(diff.MaterialRequistionSlip.replace),
            MaterialRequistionSlipItem: layer.MaterialRequistionSlipItem.filter(x => !diff.MaterialRequistionSlipItem.remove.contains(x.variableName)).addAll(diff.MaterialRequistionSlipItem.replace),
            BOM: layer.BOM.filter(x => !diff.BOM.remove.contains(x.variableName)).addAll(diff.BOM.replace),
            BOMItem: layer.BOMItem.filter(x => !diff.BOMItem.remove.contains(x.variableName)).addAll(diff.BOMItem.replace),
            ProductionPreparationSlip: layer.ProductionPreparationSlip.filter(x => !diff.ProductionPreparationSlip.remove.contains(x.variableName)).addAll(diff.ProductionPreparationSlip.replace),
            ProductionPreparationSlipItem: layer.ProductionPreparationSlipItem.filter(x => !diff.ProductionPreparationSlipItem.remove.contains(x.variableName)).addAll(diff.ProductionPreparationSlipItem.replace),
            ScrapMaterialSlip: layer.ScrapMaterialSlip.filter(x => !diff.ScrapMaterialSlip.remove.contains(x.variableName)).addAll(diff.ScrapMaterialSlip.replace),
            TransferMaterialSlip: layer.TransferMaterialSlip.filter(x => !diff.TransferMaterialSlip.remove.contains(x.variableName)).addAll(diff.TransferMaterialSlip.replace),
            WarehouseAcceptanceSlip: layer.WarehouseAcceptanceSlip.filter(x => !diff.WarehouseAcceptanceSlip.remove.contains(x.variableName)).addAll(diff.WarehouseAcceptanceSlip.replace)
        }
        return result
    }
}

export function compose(base: Readonly<Layer>, diffs: Array<Diff>) {
    var result: Layer = base
    diffs.forEach(diff => {
        result = applyDiff(result, diff)
    })
    return result
}
