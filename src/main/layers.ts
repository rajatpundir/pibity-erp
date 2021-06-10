import { HashSet, Vector } from 'prelude-ts'
import { immerable, Immutable } from 'immer'
import { Variable, VariableName, ProductVariable, UOMVariable, IndentVariable, IndentItemVariable, SupplierVariable, SupplierProductVariable, QuotationVariable, QuotationItemVariable, PurchaseOrderVariable, PurchaseOrderItemVariable, PurchaseInvoiceVariable, PurchaseInvoiceItemVariable, MaterialApprovalSlipVariable, MaterialApprovalSlipItemVariable, MaterialRejectionSlipVariable, MaterialRejectionSlipItemVariable, MaterialReturnSlipVariable, MaterialReturnSlipItemVariable, MaterialRequistionSlipVariable, MaterialRequistionSlipItemVariable, BOMVariable, BOMItemVariable, ProductionPreparationSlipVariable, ProductionPreparationSlipItemVariable, ScrapMaterialSlipVariable, TransferMaterialSlipVariable, WarehouseAcceptanceSlipVariable, Product, UOM, Indent, IndentItem, Supplier, SupplierProduct, Quotation, QuotationItem, PurchaseOrder, PurchaseOrderItem, PurchaseInvoice, PurchaseInvoiceItem, MaterialApprovalSlip, MaterialApprovalSlipItem, MaterialRejectionSlip, MaterialRejectionSlipItem, MaterialReturnSlip, MaterialReturnSlipItem, MaterialRequistionSlip, MaterialRequistionSlipItem, BOM, BOMItem, ProductionPreparationSlip, ProductionPreparationSlipItem, ScrapMaterialSlip, TransferMaterialSlip, WarehouseAcceptanceSlip } from './variables'
import { NonPrimitiveType } from './types'
import { BOMItemRow, BOMRow, DiffRow, IndentItemRow, IndentRow, MaterialApprovalSlipItemRow, MaterialApprovalSlipRow, MaterialRejectionSlipItemRow, MaterialRejectionSlipRow, MaterialRequistionSlipItemRow, MaterialRequistionSlipRow, MaterialReturnSlipItemRow, MaterialReturnSlipRow, ProductionPreparationSlipItemRow, ProductionPreparationSlipRow, ProductRow, PurchaseInvoiceItemRow, PurchaseInvoiceRow, PurchaseOrderItemRow, PurchaseOrderRow, QuotationItemRow, QuotationRow, ScrapMaterialSlipRow, SupplierProductRow, SupplierRow, TransferMaterialSlipRow, UOMRow, WarehouseAcceptanceSlipRow } from './rows'
import { db } from './dexie'
import { when } from './utils'

type DiffVariables = {
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

export class DiffVariable {
    [immerable] = true
    // readonly id: number
    active: boolean
    variables: DiffVariables

    constructor(id: number = -1, active: boolean = true, variables: DiffVariables = {
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
    }) {
        // this.id = id
        this.active = active
        this.variables = variables
    }

    equals(other: DiffVariable): boolean {
        if (!other) {
            return false;
        }
        return false
        // return this.id === other.id
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): DiffRow {
        return new DiffRow({
            Product: {
                replace: this.variables.Product.replace.toArray().map(x => x.toRow()),
                remove: this.variables.Product.remove.toArray().map(x => x.toString())
            },
            UOM: {
                replace: this.variables.UOM.replace.toArray().map(x => x.toRow()),
                remove: this.variables.UOM.remove.toArray().map(x => x.toString())
            },
            Indent: {
                replace: this.variables.Indent.replace.toArray().map(x => x.toRow()),
                remove: this.variables.Indent.remove.toArray().map(x => x.toString())
            },
            IndentItem: {
                replace: this.variables.IndentItem.replace.toArray().map(x => x.toRow()),
                remove: this.variables.IndentItem.remove.toArray().map(x => x.toString())
            },
            Supplier: {
                replace: this.variables.Supplier.replace.toArray().map(x => x.toRow()),
                remove: this.variables.Supplier.remove.toArray().map(x => x.toString())
            },
            SupplierProduct: {
                replace: this.variables.SupplierProduct.replace.toArray().map(x => x.toRow()),
                remove: this.variables.SupplierProduct.remove.toArray().map(x => x.toString())
            },
            Quotation: {
                replace: this.variables.Quotation.replace.toArray().map(x => x.toRow()),
                remove: this.variables.Quotation.remove.toArray().map(x => x.toString())
            },
            QuotationItem: {
                replace: this.variables.QuotationItem.replace.toArray().map(x => x.toRow()),
                remove: this.variables.QuotationItem.remove.toArray().map(x => x.toString())
            },
            PurchaseOrder: {
                replace: this.variables.PurchaseOrder.replace.toArray().map(x => x.toRow()),
                remove: this.variables.PurchaseOrder.remove.toArray().map(x => x.toString())
            },
            PurchaseOrderItem: {
                replace: this.variables.PurchaseOrderItem.replace.toArray().map(x => x.toRow()),
                remove: this.variables.PurchaseOrderItem.remove.toArray().map(x => x.toString())
            },
            PurchaseInvoice: {
                replace: this.variables.PurchaseInvoice.replace.toArray().map(x => x.toRow()),
                remove: this.variables.PurchaseInvoice.remove.toArray().map(x => x.toString())
            },
            PurchaseInvoiceItem: {
                replace: this.variables.PurchaseInvoiceItem.replace.toArray().map(x => x.toRow()),
                remove: this.variables.PurchaseInvoiceItem.remove.toArray().map(x => x.toString())
            },
            MaterialApprovalSlip: {
                replace: this.variables.MaterialApprovalSlip.replace.toArray().map(x => x.toRow()),
                remove: this.variables.MaterialApprovalSlip.remove.toArray().map(x => x.toString())
            },
            MaterialApprovalSlipItem: {
                replace: this.variables.MaterialApprovalSlipItem.replace.toArray().map(x => x.toRow()),
                remove: this.variables.MaterialApprovalSlipItem.remove.toArray().map(x => x.toString())
            },
            MaterialRejectionSlip: {
                replace: this.variables.MaterialRejectionSlip.replace.toArray().map(x => x.toRow()),
                remove: this.variables.MaterialRejectionSlip.remove.toArray().map(x => x.toString())
            },
            MaterialRejectionSlipItem: {
                replace: this.variables.MaterialRejectionSlipItem.replace.toArray().map(x => x.toRow()),
                remove: this.variables.MaterialRejectionSlipItem.remove.toArray().map(x => x.toString())
            },
            MaterialReturnSlip: {
                replace: this.variables.MaterialReturnSlip.replace.toArray().map(x => x.toRow()),
                remove: this.variables.MaterialReturnSlip.remove.toArray().map(x => x.toString())
            },
            MaterialReturnSlipItem: {
                replace: this.variables.MaterialReturnSlipItem.replace.toArray().map(x => x.toRow()),
                remove: this.variables.MaterialReturnSlipItem.remove.toArray().map(x => x.toString())
            },
            MaterialRequistionSlip: {
                replace: this.variables.MaterialRequistionSlip.replace.toArray().map(x => x.toRow()),
                remove: this.variables.MaterialRequistionSlip.remove.toArray().map(x => x.toString())
            },
            MaterialRequistionSlipItem: {
                replace: this.variables.MaterialRequistionSlipItem.replace.toArray().map(x => x.toRow()),
                remove: this.variables.MaterialRequistionSlipItem.remove.toArray().map(x => x.toString())
            },
            BOM: {
                replace: this.variables.BOM.replace.toArray().map(x => x.toRow()),
                remove: this.variables.BOM.remove.toArray().map(x => x.toString())
            },
            BOMItem: {
                replace: this.variables.BOMItem.replace.toArray().map(x => x.toRow()),
                remove: this.variables.BOMItem.remove.toArray().map(x => x.toString())
            },
            ProductionPreparationSlip: {
                replace: this.variables.ProductionPreparationSlip.replace.toArray().map(x => x.toRow()),
                remove: this.variables.ProductionPreparationSlip.remove.toArray().map(x => x.toString())
            },
            ProductionPreparationSlipItem: {
                replace: this.variables.ProductionPreparationSlipItem.replace.toArray().map(x => x.toRow()),
                remove: this.variables.ProductionPreparationSlipItem.remove.toArray().map(x => x.toString())
            },
            ScrapMaterialSlip: {
                replace: this.variables.ScrapMaterialSlip.replace.toArray().map(x => x.toRow()),
                remove: this.variables.ScrapMaterialSlip.remove.toArray().map(x => x.toString())
            },
            TransferMaterialSlip: {
                replace: this.variables.TransferMaterialSlip.replace.toArray().map(x => x.toRow()),
                remove: this.variables.TransferMaterialSlip.remove.toArray().map(x => x.toString())
            },
            WarehouseAcceptanceSlip: {
                replace: this.variables.WarehouseAcceptanceSlip.replace.toArray().map(x => x.toRow()),
                remove: this.variables.WarehouseAcceptanceSlip.remove.toArray().map(x => x.toString())
            }
        })
    }
}

export function getReplaceVariableDiff(variable: Immutable<Variable>): DiffVariable {
    const diff: DiffVariable = new DiffVariable()
    switch (variable.typeName) {
        case 'Product': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'UOM': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'Indent': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'IndentItem': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'Supplier': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'SupplierProduct': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'Quotation': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'QuotationItem': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'PurchaseOrder': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'PurchaseOrderItem': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'PurchaseInvoice': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'PurchaseInvoiceItem': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'MaterialApprovalSlip': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'MaterialApprovalSlipItem': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'MaterialRejectionSlip': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'MaterialRejectionSlipItem': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'MaterialReturnSlip': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'MaterialReturnSlipItem': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'MaterialRequistionSlip': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'MaterialRequistionSlipItem': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'BOM': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'BOMItem': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'ProductionPreparationSlip': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'ProductionPreparationSlipItem': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'ScrapMaterialSlip': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'TransferMaterialSlip': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'WarehouseAcceptanceSlip': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
    }
    return diff
}

export function getRemoveVariableDiff(typeName: NonPrimitiveType, variableName: string): DiffVariable {
    const diff: DiffVariable = new DiffVariable()
    switch (typeName) {
        case 'Product': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new Product(variableName))
            break
        }
        case 'UOM': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new UOM(variableName))
            break
        }
        case 'Indent': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new Indent(variableName))
            break
        }
        case 'IndentItem': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new IndentItem(variableName))
            break
        }
        case 'Supplier': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new Supplier(variableName))
            break
        }
        case 'SupplierProduct': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new SupplierProduct(variableName))
            break
        }
        case 'Quotation': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new Quotation(variableName))
            break
        }
        case 'QuotationItem': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new QuotationItem(variableName))
            break
        }
        case 'PurchaseOrder': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new PurchaseOrder(variableName))
            break
        }
        case 'PurchaseOrderItem': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new PurchaseOrderItem(variableName))
            break
        }
        case 'PurchaseInvoice': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new PurchaseInvoice(variableName))
            break
        }
        case 'PurchaseInvoiceItem': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new PurchaseInvoiceItem(variableName))
            break
        }
        case 'MaterialApprovalSlip': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new MaterialApprovalSlip(variableName))
            break
        }
        case 'MaterialApprovalSlipItem': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new MaterialApprovalSlipItem(variableName))
            break
        }
        case 'MaterialRejectionSlip': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new MaterialRejectionSlip(variableName))
            break
        }
        case 'MaterialRejectionSlipItem': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new MaterialRejectionSlipItem(variableName))
            break
        }
        case 'MaterialReturnSlip': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new MaterialReturnSlip(variableName))
            break
        }
        case 'MaterialReturnSlipItem': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new MaterialReturnSlipItem(variableName))
            break
        }
        case 'MaterialRequistionSlip': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new MaterialRequistionSlip(variableName))
            break
        }
        case 'MaterialRequistionSlipItem': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new MaterialRequistionSlipItem(variableName))
            break
        }
        case 'BOM': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new BOM(variableName))
            break
        }
        case 'BOMItem': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new BOMItem(variableName))
            break
        }
        case 'ProductionPreparationSlip': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new ProductionPreparationSlip(variableName))
            break
        }
        case 'ProductionPreparationSlipItem': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new ProductionPreparationSlipItem(variableName))
            break
        }
        case 'ScrapMaterialSlip': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new ScrapMaterialSlip(variableName))
            break
        }
        case 'TransferMaterialSlip': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new TransferMaterialSlip(variableName))
            break
        }
        case 'WarehouseAcceptanceSlip': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new WarehouseAcceptanceSlip(variableName))
            break
        }
    }
    return diff
}

export async function getVariable(typeName: NonPrimitiveType, variableName: string, overlay: Vector<DiffVariable> = Vector.of()): Promise<Variable | undefined> {
    const diffs: Array<DiffVariable> = (await db.diffs.orderBy('id').reverse().toArray()).map(x => DiffRow.toVariable(x))
    return when(typeName, {
        'Product': async () => {
            console.log('&', typeName, variableName)
            overlay.reverse().forEach(diff => {
                console.log('&&&&&&', diff)
                diff.variables.Product.replace.forEach(variable => {
                    console.log('&$#', variable)
                    if (variable.variableName.toString() === variableName) {
                        console.log('&&&&&&1', typeName, variableName, variable)
                        return variable
                    }
                })
                if (diff.variables.Product.remove.anyMatch(x => x.toString() === variableName)) {
                    console.log('&&&&&&2', typeName, variableName, undefined)
                    return undefined
                }
            })
            diffs.forEach(diff => {
                console.log('&&&&&&', diff)
                diff.variables.Product.replace.forEach(variable => {
                    console.log('&$#', variable)
                    if (variable.variableName.toString() === variableName) {
                        console.log('&&&&&&1', typeName, variableName, variable)
                        return variable
                    }
                })
                if (diff.variables.Product.remove.anyMatch(x => x.toString() === variableName)) {
                    console.log('&&&&&&2', typeName, variableName, undefined)
                    return undefined
                }
            })
            const row = await db.products.get(variableName)
            if (row !== undefined) {
                console.log('&&&&&&3', typeName, variableName, row)
                return ProductRow.toVariable(row) as Variable
            } else {
                console.log('&&&&&&4', typeName, variableName, row)
                return undefined
            }
        },
        'UOM': async () => {
            diffs.forEach(diff => {
                diff.variables[typeName].replace.forEach(variable => {
                    if (variable.variableName.toString() === variableName) {
                        return variable
                    }
                })
                if (diff.variables[typeName].remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            })
            const row = await db.uoms.get(variableName)
            if (row !== undefined) {
                return UOMRow.toVariable(row)
            } else {
                return undefined
            }
        },
        'Indent': async () => {
            diffs.forEach(diff => {
                diff.variables[typeName].replace.forEach(variable => {
                    if (variable.variableName.toString() === variableName) {
                        return variable
                    }
                })
                if (diff.variables[typeName].remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            })
            const row = await db.indents.get(variableName)
            if (row !== undefined) {
                return IndentRow.toVariable(row)
            } else {
                return undefined
            }
        },
        'IndentItem': async () => {
            diffs.forEach(diff => {
                diff.variables[typeName].replace.forEach(variable => {
                    if (variable.variableName.toString() === variableName) {
                        return variable
                    }
                })
                if (diff.variables[typeName].remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            })
            const row = await db.indentItems.get(variableName)
            if (row !== undefined) {
                return IndentItemRow.toVariable(row)
            } else {
                return undefined
            }
        },
        'Supplier': async () => {
            diffs.forEach(diff => {
                diff.variables[typeName].replace.forEach(variable => {
                    if (variable.variableName.toString() === variableName) {
                        return variable
                    }
                })
                if (diff.variables[typeName].remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            })
            const row = await db.suppliers.get(variableName)
            if (row !== undefined) {
                return SupplierRow.toVariable(row)
            } else {
                return undefined
            }
        },
        'SupplierProduct': async () => {
            diffs.forEach(diff => {
                diff.variables[typeName].replace.forEach(variable => {
                    if (variable.variableName.toString() === variableName) {
                        return variable
                    }
                })
                if (diff.variables[typeName].remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            })
            const row = await db.supplierProducts.get(variableName)
            if (row !== undefined) {
                return SupplierProductRow.toVariable(row)
            } else {
                return undefined
            }
        },
        'Quotation': async () => {
            diffs.forEach(diff => {
                diff.variables[typeName].replace.forEach(variable => {
                    if (variable.variableName.toString() === variableName) {
                        return variable
                    }
                })
                if (diff.variables[typeName].remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            })
            const row = await db.quotations.get(variableName)
            if (row !== undefined) {
                return QuotationRow.toVariable(row)
            } else {
                return undefined
            }
        },
        'QuotationItem': async () => {
            diffs.forEach(diff => {
                diff.variables[typeName].replace.forEach(variable => {
                    if (variable.variableName.toString() === variableName) {
                        return variable
                    }
                })
                if (diff.variables[typeName].remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            })
            const row = await db.quotationItems.get(variableName)
            if (row !== undefined) {
                return QuotationItemRow.toVariable(row)
            } else {
                return undefined
            }
        },
        'PurchaseOrder': async () => {
            diffs.forEach(diff => {
                diff.variables[typeName].replace.forEach(variable => {
                    if (variable.variableName.toString() === variableName) {
                        return variable
                    }
                })
                if (diff.variables[typeName].remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            })
            const row = await db.purchaseOrders.get(variableName)
            if (row !== undefined) {
                return PurchaseOrderRow.toVariable(row)
            } else {
                return undefined
            }
        },
        'PurchaseOrderItem': async () => {
            diffs.forEach(diff => {
                diff.variables[typeName].replace.forEach(variable => {
                    if (variable.variableName.toString() === variableName) {
                        return variable
                    }
                })
                if (diff.variables[typeName].remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            })
            const row = await db.purchaseOrderItems.get(variableName)
            if (row !== undefined) {
                return PurchaseOrderItemRow.toVariable(row)
            } else {
                return undefined
            }
        },
        'PurchaseInvoice': async () => {
            diffs.forEach(diff => {
                diff.variables[typeName].replace.forEach(variable => {
                    if (variable.variableName.toString() === variableName) {
                        return variable
                    }
                })
                if (diff.variables[typeName].remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            })
            const row = await db.purchaseInvoices.get(variableName)
            if (row !== undefined) {
                return PurchaseInvoiceRow.toVariable(row)
            } else {
                return undefined
            }
        },
        'PurchaseInvoiceItem': async () => {
            diffs.forEach(diff => {
                diff.variables[typeName].replace.forEach(variable => {
                    if (variable.variableName.toString() === variableName) {
                        return variable
                    }
                })
                if (diff.variables[typeName].remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            })
            const row = await db.purchaseInvoiceItems.get(variableName)
            if (row !== undefined) {
                return PurchaseInvoiceItemRow.toVariable(row)
            } else {
                return undefined
            }
        },
        'MaterialApprovalSlip': async () => {
            diffs.forEach(diff => {
                diff.variables[typeName].replace.forEach(variable => {
                    if (variable.variableName.toString() === variableName) {
                        return variable
                    }
                })
                if (diff.variables[typeName].remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            })
            const row = await db.materialApprovalSlips.get(variableName)
            if (row !== undefined) {
                return MaterialApprovalSlipRow.toVariable(row)
            } else {
                return undefined
            }
        },
        'MaterialApprovalSlipItem': async () => {
            diffs.forEach(diff => {
                diff.variables[typeName].replace.forEach(variable => {
                    if (variable.variableName.toString() === variableName) {
                        return variable
                    }
                })
                if (diff.variables[typeName].remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            })
            const row = await db.materialApprovalSlipItems.get(variableName)
            if (row !== undefined) {
                return MaterialApprovalSlipItemRow.toVariable(row)
            } else {
                return undefined
            }
        },
        'MaterialRejectionSlip': async () => {
            diffs.forEach(diff => {
                diff.variables[typeName].replace.forEach(variable => {
                    if (variable.variableName.toString() === variableName) {
                        return variable
                    }
                })
                if (diff.variables[typeName].remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            })
            const row = await db.materialRejectionSlips.get(variableName)
            if (row !== undefined) {
                return MaterialRejectionSlipRow.toVariable(row)
            } else {
                return undefined
            }
        },
        'MaterialRejectionSlipItem': async () => {
            diffs.forEach(diff => {
                diff.variables[typeName].replace.forEach(variable => {
                    if (variable.variableName.toString() === variableName) {
                        return variable
                    }
                })
                if (diff.variables[typeName].remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            })
            const row = await db.materialRejectionSlipItems.get(variableName)
            if (row !== undefined) {
                return MaterialRejectionSlipItemRow.toVariable(row)
            } else {
                return undefined
            }
        },
        'MaterialReturnSlip': async () => {
            diffs.forEach(diff => {
                diff.variables[typeName].replace.forEach(variable => {
                    if (variable.variableName.toString() === variableName) {
                        return variable
                    }
                })
                if (diff.variables[typeName].remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            })
            const row = await db.materialReturnSlips.get(variableName)
            if (row !== undefined) {
                return MaterialReturnSlipRow.toVariable(row)
            } else {
                return undefined
            }
        },
        'MaterialReturnSlipItem': async () => {
            diffs.forEach(diff => {
                diff.variables[typeName].replace.forEach(variable => {
                    if (variable.variableName.toString() === variableName) {
                        return variable
                    }
                })
                if (diff.variables[typeName].remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            })
            const row = await db.materialReturnSlipItems.get(variableName)
            if (row !== undefined) {
                return MaterialReturnSlipItemRow.toVariable(row)
            } else {
                return undefined
            }
        },
        'MaterialRequistionSlip': async () => {
            diffs.forEach(diff => {
                diff.variables[typeName].replace.forEach(variable => {
                    if (variable.variableName.toString() === variableName) {
                        return variable
                    }
                })
                if (diff.variables[typeName].remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            })
            const row = await db.materialRequistionSlips.get(variableName)
            if (row !== undefined) {
                return MaterialRequistionSlipRow.toVariable(row)
            } else {
                return undefined
            }
        },
        'MaterialRequistionSlipItem': async () => {
            diffs.forEach(diff => {
                diff.variables[typeName].replace.forEach(variable => {
                    if (variable.variableName.toString() === variableName) {
                        return variable
                    }
                })
                if (diff.variables[typeName].remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            })
            const row = await db.materialRequistionSlipItems.get(variableName)
            if (row !== undefined) {
                return MaterialRequistionSlipItemRow.toVariable(row)
            } else {
                return undefined
            }
        },
        'BOM': async () => {
            diffs.forEach(diff => {
                diff.variables[typeName].replace.forEach(variable => {
                    if (variable.variableName.toString() === variableName) {
                        return variable
                    }
                })
                if (diff.variables[typeName].remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            })
            const row = await db.boms.get(variableName)
            if (row !== undefined) {
                return BOMRow.toVariable(row)
            } else {
                return undefined
            }
        },
        'BOMItem': async () => {
            diffs.forEach(diff => {
                diff.variables[typeName].replace.forEach(variable => {
                    if (variable.variableName.toString() === variableName) {
                        return variable
                    }
                })
                if (diff.variables[typeName].remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            })
            const row = await db.bomItems.get(variableName)
            if (row !== undefined) {
                return BOMItemRow.toVariable(row)
            } else {
                return undefined
            }
        },
        'ProductionPreparationSlip': async () => {
            diffs.forEach(diff => {
                diff.variables[typeName].replace.forEach(variable => {
                    if (variable.variableName.toString() === variableName) {
                        return variable
                    }
                })
                if (diff.variables[typeName].remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            })
            const row = await db.productionPreparationSlips.get(variableName)
            if (row !== undefined) {
                return ProductionPreparationSlipRow.toVariable(row)
            } else {
                return undefined
            }
        },
        'ProductionPreparationSlipItem': async () => {
            diffs.forEach(diff => {
                diff.variables[typeName].replace.forEach(variable => {
                    if (variable.variableName.toString() === variableName) {
                        return variable
                    }
                })
                if (diff.variables[typeName].remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            })
            const row = await db.productionPreparationSlipItems.get(variableName)
            if (row !== undefined) {
                return ProductionPreparationSlipItemRow.toVariable(row)
            } else {
                return undefined
            }
        },
        'ScrapMaterialSlip': async () => {
            diffs.forEach(diff => {
                diff.variables[typeName].replace.forEach(variable => {
                    if (variable.variableName.toString() === variableName) {
                        return variable
                    }
                })
                if (diff.variables[typeName].remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            })
            const row = await db.scrapMaterialSlips.get(variableName)
            if (row !== undefined) {
                return ScrapMaterialSlipRow.toVariable(row)
            } else {
                return undefined
            }
        },
        'TransferMaterialSlip': async () => {
            diffs.forEach(diff => {
                diff.variables[typeName].replace.forEach(variable => {
                    if (variable.variableName.toString() === variableName) {
                        return variable
                    }
                })
                if (diff.variables[typeName].remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            })
            const row = await db.transferMaterialSlips.get(variableName)
            if (row !== undefined) {
                return TransferMaterialSlipRow.toVariable(row)
            } else {
                return undefined
            }
        },
        'WarehouseAcceptanceSlip': async () => {
            diffs.forEach(diff => {
                diff.variables[typeName].replace.forEach(variable => {
                    if (variable.variableName.toString() === variableName) {
                        return variable
                    }
                })
                if (diff.variables[typeName].remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            })
            const row = await db.warehouseAcceptanceSlips.get(variableName)
            if (row !== undefined) {
                return WarehouseAcceptanceSlipRow.toVariable(row)
            } else {
                return undefined
            }
        }
    })
}

export async function getVariables(typeName: NonPrimitiveType): Promise<Array<Immutable<Variable>>> {
    return when(typeName, {
        'Product': (await db.products.toArray()).map(x => ProductRow.toVariable(x)),
        'UOM': (await db.uoms.toArray()).map(x => UOMRow.toVariable(x)),
        'Indent': (await db.indents.toArray()).map(x => IndentRow.toVariable(x)),
        'IndentItem': (await db.indentItems.toArray()).map(x => IndentItemRow.toVariable(x)),
        'Supplier': (await db.suppliers.toArray()).map(x => SupplierRow.toVariable(x)),
        'SupplierProduct': (await db.supplierProducts.toArray()).map(x => SupplierProductRow.toVariable(x)),
        'Quotation': (await db.quotations.toArray()).map(x => QuotationRow.toVariable(x)),
        'QuotationItem': (await db.quotationItems.toArray()).map(x => QuotationItemRow.toVariable(x)),
        'PurchaseOrder': (await db.purchaseOrders.toArray()).map(x => PurchaseOrderRow.toVariable(x)),
        'PurchaseOrderItem': (await db.purchaseOrderItems.toArray()).map(x => PurchaseOrderItemRow.toVariable(x)),
        'PurchaseInvoice': (await db.purchaseInvoices.toArray()).map(x => PurchaseInvoiceRow.toVariable(x)),
        'PurchaseInvoiceItem': (await db.purchaseInvoiceItems.toArray()).map(x => PurchaseInvoiceItemRow.toVariable(x)),
        'MaterialApprovalSlip': (await db.materialApprovalSlips.toArray()).map(x => MaterialApprovalSlipRow.toVariable(x)),
        'MaterialApprovalSlipItem': (await db.materialApprovalSlipItems.toArray()).map(x => MaterialApprovalSlipItemRow.toVariable(x)),
        'MaterialRejectionSlip': (await db.materialRejectionSlips.toArray()).map(x => MaterialRejectionSlipRow.toVariable(x)),
        'MaterialRejectionSlipItem': (await db.materialRejectionSlipItems.toArray()).map(x => MaterialRejectionSlipItemRow.toVariable(x)),
        'MaterialReturnSlip': (await db.materialReturnSlips.toArray()).map(x => MaterialReturnSlipRow.toVariable(x)),
        'MaterialReturnSlipItem': (await db.materialReturnSlipItems.toArray()).map(x => MaterialReturnSlipItemRow.toVariable(x)),
        'MaterialRequistionSlip': (await db.materialRequistionSlips.toArray()).map(x => MaterialRequistionSlipRow.toVariable(x)),
        'MaterialRequistionSlipItem': (await db.materialRequistionSlipItems.toArray()).map(x => MaterialRequistionSlipItemRow.toVariable(x)),
        'BOM': (await db.boms.toArray()).map(x => BOMRow.toVariable(x)),
        'BOMItem': (await db.bomItems.toArray()).map(x => BOMItemRow.toVariable(x)),
        'ProductionPreparationSlip': (await db.productionPreparationSlips.toArray()).map(x => ProductionPreparationSlipRow.toVariable(x)),
        'ProductionPreparationSlipItem': (await db.productionPreparationSlipItems.toArray()).map(x => ProductionPreparationSlipItemRow.toVariable(x)),
        'ScrapMaterialSlip': (await db.scrapMaterialSlips.toArray()).map(x => ScrapMaterialSlipRow.toVariable(x)),
        'TransferMaterialSlip': (await db.transferMaterialSlips.toArray()).map(x => TransferMaterialSlipRow.toVariable(x)),
        'WarehouseAcceptanceSlip': (await db.warehouseAcceptanceSlips.toArray()).map(x => WarehouseAcceptanceSlipRow.toVariable(x))
    })
}

export function mergeDiffs(diffs: ReadonlyArray<DiffVariable>): DiffVariable {
    const result = diffs.reduce((acc, diff) => {
        Object.keys(diff.variables).forEach(typeName => {
            acc.variables[typeName].replace = acc.variables[typeName].replace.filter((x: Variable) => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).addAll(diff.variables[typeName].replace)
            acc.variables[typeName].remove = acc.variables[typeName].remove.filter((x: VariableName) => !diff.variables[typeName].replace.anyMatch(y => x.toString() === y.variableName.toString())).addAll(diff.variables[typeName].remove)
        })
        return acc
    }, new DiffVariable())
    return result
}
