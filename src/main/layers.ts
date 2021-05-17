import { Vector } from 'prelude-ts'
import { ProductVariable, Product, isoVariableName, BOMItemVariable, BOMVariable, IndentItemVariable, MaterialApprovalSlipItemVariable, MaterialApprovalSlipVariable, MaterialRejectionSlipItemVariable, MaterialRejectionSlipVariable, MaterialRequistionSlipItemVariable, MaterialRequistionSlipVariable, MaterialReturnSlipItemVariable, MaterialReturnSlipVariable, ProductionPreparationSlipItemVariable, ProductionPreparationSlipVariable, PurchaseInvoiceItemVariable, PurchaseInvoiceVariable, PurchaseOrderItemVariable, PurchaseOrderVariable, QuotationItemVariable, QuotationVariable, ScrapMaterialSlipVariable, SupplierProductVariable, SupplierVariable, TransferMaterialSlipVariable, UOMVariable, WarehouseAcceptanceSlipVariable, BOM, BOMItem, Indent, IndentItem, MaterialApprovalSlip, MaterialApprovalSlipItem, MaterialRejectionSlip, MaterialRejectionSlipItem, MaterialRequistionSlip, MaterialRequistionSlipItem, MaterialReturnSlip, MaterialReturnSlipItem, ProductionPreparationSlip, ProductionPreparationSlipItem, PurchaseInvoice, PurchaseInvoiceItem, PurchaseOrder, PurchaseOrderItem, Quotation, QuotationItem, ScrapMaterialSlip, Supplier, SupplierProduct, TransferMaterialSlip, UOM, WarehouseAcceptanceSlip, IndentVariable } from './variables'

export type Layer = {
    Product: Vector<ProductVariable>
    UOM: Vector<UOMVariable>
    Indent: Vector<IndentVariable>
    IndentItem: Vector<IndentItemVariable>
    Supplier: Vector<SupplierVariable>
    SupplierProduct: Vector<SupplierProductVariable>
    Quotation: Vector<QuotationVariable>
    QuotationItem: Vector<QuotationItemVariable>
    PurchaseOrder: Vector<PurchaseOrderVariable>
    PurchaseOrderItem: Vector<PurchaseOrderItemVariable>
    PurchaseInvoice: Vector<PurchaseInvoiceVariable>
    PurchaseInvoiceItem: Vector<PurchaseInvoiceItemVariable>
    MaterialApprovalSlip: Vector<MaterialApprovalSlipVariable>
    MaterialApprovalSlipItem: Vector<MaterialApprovalSlipItemVariable>
    MaterialRejectionSlip: Vector<MaterialRejectionSlipVariable>
    MaterialRejectionSlipItem: Vector<MaterialRejectionSlipItemVariable>
    MaterialReturnSlip: Vector<MaterialReturnSlipVariable>
    MaterialReturnSlipItem: Vector<MaterialReturnSlipItemVariable>
    MaterialRequistionSlip: Vector<MaterialRequistionSlipVariable>
    MaterialRequistionSlipItem: Vector<MaterialRequistionSlipItemVariable>
    BOM: Vector<BOMVariable>
    BOMItem: Vector<BOMItemVariable>
    ProductionPreparationSlip: Vector<ProductionPreparationSlipVariable>
    ProductionPreparationSlipItem: Vector<ProductionPreparationSlipItemVariable>
    ScrapMaterialSlip: Vector<ScrapMaterialSlipVariable>
    TransferMaterialSlip: Vector<TransferMaterialSlipVariable>
    WarehouseAcceptanceSlip: Vector<WarehouseAcceptanceSlipVariable>
}

export type Diff = {
    id: number
    active: boolean
    Product: {
        replace: Vector<ProductVariable>
        remove: Vector<Product>
    }
    UOM: {
        replace: Vector<UOMVariable>,
        remove: Vector<UOM>
    },
    Indent: {
        replace: Vector<IndentVariable>,
        remove: Vector<Indent>
    },
    IndentItem: {
        replace: Vector<IndentItemVariable>,
        remove: Vector<IndentItem>
    },
    Supplier: {
        replace: Vector<SupplierVariable>,
        remove: Vector<Supplier>
    },
    SupplierProduct: {
        replace: Vector<SupplierProductVariable>,
        remove: Vector<SupplierProduct>
    },
    Quotation: {
        replace: Vector<QuotationVariable>,
        remove: Vector<Quotation>
    },
    QuotationItem: {
        replace: Vector<QuotationItemVariable>,
        remove: Vector<QuotationItem>
    },
    PurchaseOrder: {
        replace: Vector<PurchaseOrderVariable>,
        remove: Vector<PurchaseOrder>
    },
    PurchaseOrderItem: {
        replace: Vector<PurchaseOrderItemVariable>,
        remove: Vector<PurchaseOrderItem>
    },
    PurchaseInvoice: {
        replace: Vector<PurchaseInvoiceVariable>,
        remove: Vector<PurchaseInvoice>
    },
    PurchaseInvoiceItem: {
        replace: Vector<PurchaseInvoiceItemVariable>,
        remove: Vector<PurchaseInvoiceItem>
    },
    MaterialApprovalSlip: {
        replace: Vector<MaterialApprovalSlipVariable>,
        remove: Vector<MaterialApprovalSlip>
    },
    MaterialApprovalSlipItem: {
        replace: Vector<MaterialApprovalSlipItemVariable>,
        remove: Vector<MaterialApprovalSlipItem>
    },
    MaterialRejectionSlip: {
        replace: Vector<MaterialRejectionSlipVariable>,
        remove: Vector<MaterialRejectionSlip>
    },
    MaterialRejectionSlipItem: {
        replace: Vector<MaterialRejectionSlipItemVariable>,
        remove: Vector<MaterialRejectionSlipItem>
    },
    MaterialReturnSlip: {
        replace: Vector<MaterialReturnSlipVariable>,
        remove: Vector<MaterialReturnSlip>
    },
    MaterialReturnSlipItem: {
        replace: Vector<MaterialReturnSlipItemVariable>,
        remove: Vector<MaterialReturnSlipItem>
    },
    MaterialRequistionSlip: {
        replace: Vector<MaterialRequistionSlipVariable>,
        remove: Vector<MaterialRequistionSlip>
    },
    MaterialRequistionSlipItem: {
        replace: Vector<MaterialRequistionSlipItemVariable>,
        remove: Vector<MaterialRequistionSlipItem>
    },
    BOM: {
        replace: Vector<BOMVariable>,
        remove: Vector<BOM>
    },
    BOMItem: {
        replace: Vector<BOMItemVariable>,
        remove: Vector<BOMItem>
    },
    ProductionPreparationSlip: {
        replace: Vector<ProductionPreparationSlipVariable>,
        remove: Vector<ProductionPreparationSlip>
    },
    ProductionPreparationSlipItem: {
        replace: Vector<ProductionPreparationSlipItemVariable>,
        remove: Vector<ProductionPreparationSlipItem>
    },
    ScrapMaterialSlip: {
        replace: Vector<ScrapMaterialSlipVariable>,
        remove: Vector<ScrapMaterialSlip>
    },
    TransferMaterialSlip: {
        replace: Vector<TransferMaterialSlipVariable>,
        remove: Vector<TransferMaterialSlip>
    },
    WarehouseAcceptanceSlip: {
        replace: Vector<WarehouseAcceptanceSlipVariable>,
        remove: Vector<WarehouseAcceptanceSlip>
    }
}

export function applyDiff(layer: Readonly<Layer>, diff: Diff): Layer {
    if (diff.active === false)
        return layer
    else {
        const result: Layer = {
            Product: layer.Product
                .filter(x => !diff.Product.remove.map(y => isoVariableName['Product'].unwrap(y)).contains(isoVariableName['Product'].unwrap(x.variableName)))
                .filter(x => !diff.Product.replace.anyMatch(y => isoVariableName['Product'].unwrap(y.variableName) === isoVariableName['Product'].unwrap(x.variableName)))
                .appendAll(diff.Product.replace),
            UOM: layer.UOM
                .filter(x => !diff.UOM.remove.map(y => isoVariableName['UOM'].unwrap(y)).contains(isoVariableName['UOM'].unwrap(x.variableName)))
                .filter(x => !diff.UOM.replace.anyMatch(y => isoVariableName['UOM'].unwrap(y.variableName) === isoVariableName['UOM'].unwrap(x.variableName)))
                .appendAll(diff.UOM.replace),
            Indent: layer.Indent
                .filter(x => !diff.Indent.remove.map(y => isoVariableName['Indent'].unwrap(y)).contains(isoVariableName['Indent'].unwrap(x.variableName)))
                .filter(x => !diff.Indent.replace.anyMatch(y => isoVariableName['Indent'].unwrap(y.variableName) === isoVariableName['Indent'].unwrap(x.variableName)))
                .appendAll(diff.Indent.replace),
            IndentItem: layer.IndentItem
                .filter(x => !diff.IndentItem.remove.map(y => isoVariableName['IndentItem'].unwrap(y)).contains(isoVariableName['IndentItem'].unwrap(x.variableName)))
                .filter(x => !diff.IndentItem.replace.anyMatch(y => isoVariableName['IndentItem'].unwrap(y.variableName) === isoVariableName['IndentItem'].unwrap(x.variableName)))
                .appendAll(diff.IndentItem.replace),
            Supplier: layer.Supplier
                .filter(x => !diff.Supplier.remove.map(y => isoVariableName['Supplier'].unwrap(y)).contains(isoVariableName['Supplier'].unwrap(x.variableName)))
                .filter(x => !diff.Supplier.replace.anyMatch(y => isoVariableName['Supplier'].unwrap(y.variableName) === isoVariableName['Supplier'].unwrap(x.variableName)))
                .appendAll(diff.Supplier.replace),
            SupplierProduct: layer.SupplierProduct
                .filter(x => !diff.SupplierProduct.remove.map(y => isoVariableName['SupplierProduct'].unwrap(y)).contains(isoVariableName['SupplierProduct'].unwrap(x.variableName)))
                .filter(x => !diff.SupplierProduct.replace.anyMatch(y => isoVariableName['SupplierProduct'].unwrap(y.variableName) === isoVariableName['SupplierProduct'].unwrap(x.variableName)))
                .appendAll(diff.SupplierProduct.replace),
            Quotation: layer.Quotation
                .filter(x => !diff.Quotation.remove.map(y => isoVariableName['Quotation'].unwrap(y)).contains(isoVariableName['Quotation'].unwrap(x.variableName)))
                .filter(x => !diff.Quotation.replace.anyMatch(y => isoVariableName['Quotation'].unwrap(y.variableName) === isoVariableName['Quotation'].unwrap(x.variableName)))
                .appendAll(diff.Quotation.replace),
            QuotationItem: layer.QuotationItem
                .filter(x => !diff.QuotationItem.remove.map(y => isoVariableName['QuotationItem'].unwrap(y)).contains(isoVariableName['QuotationItem'].unwrap(x.variableName)))
                .filter(x => !diff.QuotationItem.replace.anyMatch(y => isoVariableName['QuotationItem'].unwrap(y.variableName) === isoVariableName['QuotationItem'].unwrap(x.variableName)))
                .appendAll(diff.QuotationItem.replace),
            PurchaseOrder: layer.PurchaseOrder
                .filter(x => !diff.PurchaseOrder.remove.map(y => isoVariableName['PurchaseOrder'].unwrap(y)).contains(isoVariableName['PurchaseOrder'].unwrap(x.variableName)))
                .filter(x => !diff.PurchaseOrder.replace.anyMatch(y => isoVariableName['PurchaseOrder'].unwrap(y.variableName) === isoVariableName['PurchaseOrder'].unwrap(x.variableName)))
                .appendAll(diff.PurchaseOrder.replace),
            PurchaseOrderItem: layer.PurchaseOrderItem
                .filter(x => !diff.PurchaseOrderItem.remove.map(y => isoVariableName['PurchaseOrderItem'].unwrap(y)).contains(isoVariableName['PurchaseOrderItem'].unwrap(x.variableName)))
                .filter(x => !diff.PurchaseOrderItem.replace.anyMatch(y => isoVariableName['PurchaseOrderItem'].unwrap(y.variableName) === isoVariableName['PurchaseOrderItem'].unwrap(x.variableName)))
                .appendAll(diff.PurchaseOrderItem.replace),
            PurchaseInvoice: layer.PurchaseInvoice
                .filter(x => !diff.PurchaseInvoice.remove.map(y => isoVariableName['PurchaseInvoice'].unwrap(y)).contains(isoVariableName['PurchaseInvoice'].unwrap(x.variableName)))
                .filter(x => !diff.PurchaseInvoice.replace.anyMatch(y => isoVariableName['PurchaseInvoice'].unwrap(y.variableName) === isoVariableName['PurchaseInvoice'].unwrap(x.variableName)))
                .appendAll(diff.PurchaseInvoice.replace),
            PurchaseInvoiceItem: layer.PurchaseInvoiceItem
                .filter(x => !diff.PurchaseInvoiceItem.remove.map(y => isoVariableName['PurchaseInvoiceItem'].unwrap(y)).contains(isoVariableName['PurchaseInvoiceItem'].unwrap(x.variableName)))
                .filter(x => !diff.PurchaseInvoiceItem.replace.anyMatch(y => isoVariableName['PurchaseInvoiceItem'].unwrap(y.variableName) === isoVariableName['PurchaseInvoiceItem'].unwrap(x.variableName)))
                .appendAll(diff.PurchaseInvoiceItem.replace),
            MaterialApprovalSlip: layer.MaterialApprovalSlip
                .filter(x => !diff.MaterialApprovalSlip.remove.map(y => isoVariableName['MaterialApprovalSlip'].unwrap(y)).contains(isoVariableName['MaterialApprovalSlip'].unwrap(x.variableName)))
                .filter(x => !diff.MaterialApprovalSlip.replace.anyMatch(y => isoVariableName['MaterialApprovalSlip'].unwrap(y.variableName) === isoVariableName['MaterialApprovalSlip'].unwrap(x.variableName)))
                .appendAll(diff.MaterialApprovalSlip.replace),
            MaterialApprovalSlipItem: layer.MaterialApprovalSlipItem
                .filter(x => !diff.MaterialApprovalSlipItem.remove.map(y => isoVariableName['MaterialApprovalSlipItem'].unwrap(y)).contains(isoVariableName['MaterialApprovalSlipItem'].unwrap(x.variableName)))
                .filter(x => !diff.MaterialApprovalSlipItem.replace.anyMatch(y => isoVariableName['MaterialApprovalSlipItem'].unwrap(y.variableName) === isoVariableName['MaterialApprovalSlipItem'].unwrap(x.variableName)))
                .appendAll(diff.MaterialApprovalSlipItem.replace),
            MaterialRejectionSlip: layer.MaterialRejectionSlip
                .filter(x => !diff.MaterialRejectionSlip.remove.map(y => isoVariableName['MaterialRejectionSlip'].unwrap(y)).contains(isoVariableName['MaterialRejectionSlip'].unwrap(x.variableName)))
                .filter(x => !diff.MaterialRejectionSlip.replace.anyMatch(y => isoVariableName['MaterialRejectionSlip'].unwrap(y.variableName) === isoVariableName['MaterialRejectionSlip'].unwrap(x.variableName)))
                .appendAll(diff.MaterialRejectionSlip.replace),
            MaterialRejectionSlipItem: layer.MaterialRejectionSlipItem
                .filter(x => !diff.MaterialRejectionSlipItem.remove.map(y => isoVariableName['MaterialRejectionSlipItem'].unwrap(y)).contains(isoVariableName['MaterialRejectionSlipItem'].unwrap(x.variableName)))
                .filter(x => !diff.MaterialRejectionSlipItem.replace.anyMatch(y => isoVariableName['MaterialRejectionSlipItem'].unwrap(y.variableName) === isoVariableName['MaterialRejectionSlipItem'].unwrap(x.variableName)))
                .appendAll(diff.MaterialRejectionSlipItem.replace),
            MaterialReturnSlip: layer.MaterialReturnSlip
                .filter(x => !diff.MaterialReturnSlip.remove.map(y => isoVariableName['MaterialReturnSlip'].unwrap(y)).contains(isoVariableName['MaterialReturnSlip'].unwrap(x.variableName)))
                .filter(x => !diff.MaterialReturnSlip.replace.anyMatch(y => isoVariableName['MaterialReturnSlip'].unwrap(y.variableName) === isoVariableName['MaterialReturnSlip'].unwrap(x.variableName)))
                .appendAll(diff.MaterialReturnSlip.replace),
            MaterialReturnSlipItem: layer.MaterialReturnSlipItem
                .filter(x => !diff.MaterialReturnSlipItem.remove.map(y => isoVariableName['MaterialReturnSlipItem'].unwrap(y)).contains(isoVariableName['MaterialReturnSlipItem'].unwrap(x.variableName)))
                .filter(x => !diff.MaterialReturnSlipItem.replace.anyMatch(y => isoVariableName['MaterialReturnSlipItem'].unwrap(y.variableName) === isoVariableName['MaterialReturnSlipItem'].unwrap(x.variableName)))
                .appendAll(diff.MaterialReturnSlipItem.replace),
            MaterialRequistionSlip: layer.MaterialRequistionSlip
                .filter(x => !diff.MaterialRequistionSlip.remove.map(y => isoVariableName['MaterialRequistionSlip'].unwrap(y)).contains(isoVariableName['MaterialRequistionSlip'].unwrap(x.variableName)))
                .filter(x => !diff.MaterialRequistionSlip.replace.anyMatch(y => isoVariableName['MaterialRequistionSlip'].unwrap(y.variableName) === isoVariableName['MaterialRequistionSlip'].unwrap(x.variableName)))
                .appendAll(diff.MaterialRequistionSlip.replace),
            MaterialRequistionSlipItem: layer.MaterialRequistionSlipItem
                .filter(x => !diff.MaterialRequistionSlipItem.remove.map(y => isoVariableName['MaterialRequistionSlipItem'].unwrap(y)).contains(isoVariableName['MaterialRequistionSlipItem'].unwrap(x.variableName)))
                .filter(x => !diff.MaterialRequistionSlipItem.replace.anyMatch(y => isoVariableName['MaterialRequistionSlipItem'].unwrap(y.variableName) === isoVariableName['MaterialRequistionSlipItem'].unwrap(x.variableName)))
                .appendAll(diff.MaterialRequistionSlipItem.replace),
            BOM: layer.BOM
                .filter(x => !diff.BOM.remove.map(y => isoVariableName['BOM'].unwrap(y)).contains(isoVariableName['BOM'].unwrap(x.variableName)))
                .filter(x => !diff.BOM.replace.anyMatch(y => isoVariableName['BOM'].unwrap(y.variableName) === isoVariableName['BOM'].unwrap(x.variableName)))
                .appendAll(diff.BOM.replace),
            BOMItem: layer.BOMItem
                .filter(x => !diff.BOMItem.remove.map(y => isoVariableName['BOMItem'].unwrap(y)).contains(isoVariableName['BOMItem'].unwrap(x.variableName)))
                .filter(x => !diff.BOMItem.replace.anyMatch(y => isoVariableName['BOMItem'].unwrap(y.variableName) === isoVariableName['BOMItem'].unwrap(x.variableName)))
                .appendAll(diff.BOMItem.replace),
            ProductionPreparationSlip: layer.ProductionPreparationSlip
                .filter(x => !diff.ProductionPreparationSlip.remove.map(y => isoVariableName['ProductionPreparationSlip'].unwrap(y)).contains(isoVariableName['ProductionPreparationSlip'].unwrap(x.variableName)))
                .filter(x => !diff.ProductionPreparationSlip.replace.anyMatch(y => isoVariableName['ProductionPreparationSlip'].unwrap(y.variableName) === isoVariableName['ProductionPreparationSlip'].unwrap(x.variableName)))
                .appendAll(diff.ProductionPreparationSlip.replace),
            ProductionPreparationSlipItem: layer.ProductionPreparationSlipItem
                .filter(x => !diff.ProductionPreparationSlipItem.remove.map(y => isoVariableName['ProductionPreparationSlipItem'].unwrap(y)).contains(isoVariableName['ProductionPreparationSlipItem'].unwrap(x.variableName)))
                .filter(x => !diff.ProductionPreparationSlipItem.replace.anyMatch(y => isoVariableName['ProductionPreparationSlipItem'].unwrap(y.variableName) === isoVariableName['ProductionPreparationSlipItem'].unwrap(x.variableName)))
                .appendAll(diff.ProductionPreparationSlipItem.replace),
            ScrapMaterialSlip: layer.ScrapMaterialSlip
                .filter(x => !diff.ScrapMaterialSlip.remove.map(y => isoVariableName['ScrapMaterialSlip'].unwrap(y)).contains(isoVariableName['ScrapMaterialSlip'].unwrap(x.variableName)))
                .filter(x => !diff.ScrapMaterialSlip.replace.anyMatch(y => isoVariableName['ScrapMaterialSlip'].unwrap(y.variableName) === isoVariableName['ScrapMaterialSlip'].unwrap(x.variableName)))
                .appendAll(diff.ScrapMaterialSlip.replace),
            TransferMaterialSlip: layer.TransferMaterialSlip
                .filter(x => !diff.TransferMaterialSlip.remove.map(y => isoVariableName['TransferMaterialSlip'].unwrap(y)).contains(isoVariableName['TransferMaterialSlip'].unwrap(x.variableName)))
                .filter(x => !diff.TransferMaterialSlip.replace.anyMatch(y => isoVariableName['TransferMaterialSlip'].unwrap(y.variableName) === isoVariableName['TransferMaterialSlip'].unwrap(x.variableName)))
                .appendAll(diff.TransferMaterialSlip.replace),
            WarehouseAcceptanceSlip: layer.WarehouseAcceptanceSlip
                .filter(x => !diff.WarehouseAcceptanceSlip.remove.map(y => isoVariableName['WarehouseAcceptanceSlip'].unwrap(y)).contains(isoVariableName['WarehouseAcceptanceSlip'].unwrap(x.variableName)))
                .filter(x => !diff.WarehouseAcceptanceSlip.replace.anyMatch(y => isoVariableName['WarehouseAcceptanceSlip'].unwrap(y.variableName) === isoVariableName['WarehouseAcceptanceSlip'].unwrap(x.variableName)))
                .appendAll(diff.WarehouseAcceptanceSlip.replace)
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
