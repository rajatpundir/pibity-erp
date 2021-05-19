import { HashSet } from 'prelude-ts'
import { Immutable } from 'immer'
import { ProductVariable, UOMVariable, IndentVariable, IndentItemVariable, SupplierVariable, SupplierProductVariable, QuotationVariable, QuotationItemVariable, PurchaseOrderVariable, PurchaseOrderItemVariable, PurchaseInvoiceVariable, PurchaseInvoiceItemVariable, MaterialApprovalSlipVariable, MaterialApprovalSlipItemVariable, MaterialRejectionSlipVariable, MaterialRejectionSlipItemVariable, MaterialReturnSlipVariable, MaterialReturnSlipItemVariable, MaterialRequistionSlipVariable, MaterialRequistionSlipItemVariable, BOMVariable, BOMItemVariable, ProductionPreparationSlipVariable, ProductionPreparationSlipItemVariable, ScrapMaterialSlipVariable, TransferMaterialSlipVariable, WarehouseAcceptanceSlipVariable, Product, UOM, Indent, IndentItem, Supplier, SupplierProduct, Quotation, QuotationItem, PurchaseOrder, PurchaseOrderItem, PurchaseInvoice, PurchaseInvoiceItem, MaterialApprovalSlip, MaterialApprovalSlipItem, MaterialRejectionSlip, MaterialRejectionSlipItem, MaterialReturnSlip, MaterialReturnSlipItem, MaterialRequistionSlip, MaterialRequistionSlipItem, BOM, BOMItem, ProductionPreparationSlip, ProductionPreparationSlipItem, ScrapMaterialSlip, TransferMaterialSlip, WarehouseAcceptanceSlip, Variable } from './variables'
import { NonPrimitiveType } from './types'

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
    variables: {
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
}

export const base: Layer = {
    Product: HashSet.of(),
    UOM: HashSet.of(),
    Indent: HashSet.of(),
    IndentItem: HashSet.of(),
    Supplier: HashSet.of(),
    SupplierProduct: HashSet.of(),
    Quotation: HashSet.of(),
    QuotationItem: HashSet.of(),
    PurchaseOrder: HashSet.of(),
    PurchaseOrderItem: HashSet.of(),
    PurchaseInvoice: HashSet.of(),
    PurchaseInvoiceItem: HashSet.of(),
    MaterialApprovalSlip: HashSet.of(),
    MaterialApprovalSlipItem: HashSet.of(),
    MaterialRejectionSlip: HashSet.of(),
    MaterialRejectionSlipItem: HashSet.of(),
    MaterialReturnSlip: HashSet.of(),
    MaterialReturnSlipItem: HashSet.of(),
    MaterialRequistionSlip: HashSet.of(),
    MaterialRequistionSlipItem: HashSet.of(),
    BOM: HashSet.of(),
    BOMItem: HashSet.of(),
    ProductionPreparationSlip: HashSet.of(),
    ProductionPreparationSlipItem: HashSet.of(),
    ScrapMaterialSlip: HashSet.of(),
    TransferMaterialSlip: HashSet.of(),
    WarehouseAcceptanceSlip: HashSet.of()
}

export const noDiff: Diff = {
    id: -1,
    active: true,
    variables: {
        Product: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        UOM: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        Indent: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        IndentItem: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        Supplier: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        SupplierProduct: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        Quotation: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        QuotationItem: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        PurchaseOrder: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        PurchaseOrderItem: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        PurchaseInvoice: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        PurchaseInvoiceItem: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        MaterialApprovalSlip: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        MaterialApprovalSlipItem: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        MaterialRejectionSlip: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        MaterialRejectionSlipItem: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        MaterialReturnSlip: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        MaterialReturnSlipItem: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        MaterialRequistionSlip: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        MaterialRequistionSlipItem: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        BOM: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        BOMItem: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        ProductionPreparationSlip: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        ProductionPreparationSlipItem: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        ScrapMaterialSlip: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        TransferMaterialSlip: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        WarehouseAcceptanceSlip: {
            replace: HashSet.of(),
            remove: HashSet.of()
        }
    }
}


export function getReplaceVariableDiff(variable: Immutable<Variable>): Diff {
    const diff: Diff = { ...noDiff }
    switch (variable.typeName) {
        case 'Product': {
            diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'UOM': {
            diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'Indent': {
            diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'IndentItem': {
            diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'Supplier': {
            diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'SupplierProduct': {
            diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'Quotation': {
            diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'QuotationItem': {
            diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'PurchaseOrder': {
            diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'PurchaseOrderItem': {
            diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'PurchaseInvoice': {
            diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'PurchaseInvoiceItem': {
            diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'MaterialApprovalSlip': {
            diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'MaterialApprovalSlipItem': {
            diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'MaterialRejectionSlip': {
            diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'MaterialRejectionSlipItem': {
            diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'MaterialReturnSlip': {
            diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'MaterialReturnSlipItem': {
            diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'MaterialRequistionSlip': {
            diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'MaterialRequistionSlipItem': {
            diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'BOM': {
            diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'BOMItem': {
            diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'ProductionPreparationSlip': {
            diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'ProductionPreparationSlipItem': {
            diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'ScrapMaterialSlip': {
            diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'TransferMaterialSlip': {
            diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'WarehouseAcceptanceSlip': {
            diff.variables[variable.typeName].replace.add(variable)
            break
        }
    }
    return diff
}

export function getRemoveVariableDiff(typeName: NonPrimitiveType, variableName: string): Diff {
    const diff: Diff = { ...noDiff }
    switch (typeName) {
        case 'Product': {
            diff.variables[typeName].remove.add(new Product(variableName))
            break
        }
        case 'UOM': {
            diff.variables[typeName].remove.add(new UOM(variableName))
            break
        }
        case 'Indent': {
            diff.variables[typeName].remove.add(new Indent(variableName))
            break
        }
        case 'IndentItem': {
            diff.variables[typeName].remove.add(new IndentItem(variableName))
            break
        }
        case 'Supplier': {
            diff.variables[typeName].remove.add(new Supplier(variableName))
            break
        }
        case 'SupplierProduct': {
            diff.variables[typeName].remove.add(new SupplierProduct(variableName))
            break
        }
        case 'Quotation': {
            diff.variables[typeName].remove.add(new Quotation(variableName))
            break
        }
        case 'QuotationItem': {
            diff.variables[typeName].remove.add(new QuotationItem(variableName))
            break
        }
        case 'PurchaseOrder': {
            diff.variables[typeName].remove.add(new PurchaseOrder(variableName))
            break
        }
        case 'PurchaseOrderItem': {
            diff.variables[typeName].remove.add(new PurchaseOrderItem(variableName))
            break
        }
        case 'PurchaseInvoice': {
            diff.variables[typeName].remove.add(new PurchaseInvoice(variableName))
            break
        }
        case 'PurchaseInvoiceItem': {
            diff.variables[typeName].remove.add(new PurchaseInvoiceItem(variableName))
            break
        }
        case 'MaterialApprovalSlip': {
            diff.variables[typeName].remove.add(new MaterialApprovalSlip(variableName))
            break
        }
        case 'MaterialApprovalSlipItem': {
            diff.variables[typeName].remove.add(new MaterialApprovalSlipItem(variableName))
            break
        }
        case 'MaterialRejectionSlip': {
            diff.variables[typeName].remove.add(new MaterialRejectionSlip(variableName))
            break
        }
        case 'MaterialRejectionSlipItem': {
            diff.variables[typeName].remove.add(new MaterialRejectionSlipItem(variableName))
            break
        }
        case 'MaterialReturnSlip': {
            diff.variables[typeName].remove.add(new MaterialReturnSlip(variableName))
            break
        }
        case 'MaterialReturnSlipItem': {
            diff.variables[typeName].remove.add(new MaterialReturnSlipItem(variableName))
            break
        }
        case 'MaterialRequistionSlip': {
            diff.variables[typeName].remove.add(new MaterialRequistionSlip(variableName))
            break
        }
        case 'MaterialRequistionSlipItem': {
            diff.variables[typeName].remove.add(new MaterialRequistionSlipItem(variableName))
            break
        }
        case 'BOM': {
            diff.variables[typeName].remove.add(new BOM(variableName))
            break
        }
        case 'BOMItem': {
            diff.variables[typeName].remove.add(new BOMItem(variableName))
            break
        }
        case 'ProductionPreparationSlip': {
            diff.variables[typeName].remove.add(new ProductionPreparationSlip(variableName))
            break
        }
        case 'ProductionPreparationSlipItem': {
            diff.variables[typeName].remove.add(new ProductionPreparationSlipItem(variableName))
            break
        }
        case 'ScrapMaterialSlip': {
            diff.variables[typeName].remove.add(new ScrapMaterialSlip(variableName))
            break
        }
        case 'TransferMaterialSlip': {
            diff.variables[typeName].remove.add(new TransferMaterialSlip(variableName))
            break
        }
        case 'WarehouseAcceptanceSlip': {
            diff.variables[typeName].remove.add(new WarehouseAcceptanceSlip(variableName))
            break
        }
    }
    return diff
}

export function applyDiff(layer: Readonly<Layer>, diff: Diff): Layer {
    if (diff.active === false)
        return layer
    else {
        return Object.keys(layer).reduce((acc, typeName) => {
            if (typeName in base) {
                acc[typeName] = layer[typeName].filter((x: Immutable<Variable>) => !diff.variables[typeName].remove.contains(x.variableName)).addAll(diff.variables[typeName].replace)
            }
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

export function mergeDiffs(diffs: ReadonlyArray<Diff>): Diff {
    return diffs.reduce((acc, diff) => {
        Object.keys(diff.variables).forEach(typeName => {
            acc.variables[typeName].replace = acc.variables[typeName].replace.addAll(diff.variables[typeName].replace)
            acc.variables[typeName].remove = acc.variables[typeName].remove.addAll(diff.variables[typeName].remove)
        })
        return acc
    }, { ...noDiff })
}
