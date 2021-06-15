import { DiffVariable, getRemoveVariableDiff, getReplaceVariableDiff, getVariable, mergeDiffs } from "./layers";
import { NonPrimitiveType } from "./types";
import { when } from "./utils";
import { ProductVariable, UOMVariable, IndentVariable, IndentItemVariable, SupplierVariable, SupplierProductVariable, QuotationVariable, QuotationItemVariable, PurchaseOrderVariable, PurchaseOrderItemVariable, PurchaseInvoiceVariable, PurchaseInvoiceItemVariable, MaterialApprovalSlipVariable, MaterialApprovalSlipItemVariable, MaterialRejectionSlipVariable, MaterialRejectionSlipItemVariable, MaterialReturnSlipVariable, MaterialReturnSlipItemVariable, MaterialRequistionSlipVariable, MaterialRequistionSlipItemVariable, BOMVariable, BOMItemVariable, ProductionPreparationSlipVariable, ProductionPreparationSlipItemVariable, ScrapMaterialSlipVariable, TransferMaterialSlipVariable, WarehouseAcceptanceSlipVariable, Product, UOM, Indent, IndentItem, Supplier, Quotation, QuotationItem, PurchaseOrder, PurchaseOrderItem, PurchaseInvoice, PurchaseInvoiceItem, MaterialApprovalSlip, MaterialApprovalSlipItem, MaterialRejectionSlip, MaterialRejectionSlipItem, MaterialReturnSlip, MaterialRequistionSlip, MaterialRequistionSlipItem, BOM, ProductionPreparationSlip, TransferMaterialSlip, Variable, MaterialReturnSlipItem, SupplierProduct, BOMItem, ProductionPreparationSlipItem, ScrapMaterialSlip, WarehouseAcceptanceSlip } from './variables'

export function createVariable(typeName: NonPrimitiveType, variableName: string, values: object): [Variable, DiffVariable] {
    const variable: Variable = when(typeName, {
        'Product': () => new ProductVariable(variableName, {
            name: String(values['name']),
            orderable: Boolean(values['orderable']).valueOf(),
            consumable: Boolean(values['consumable']).valueOf(),
            producable: Boolean(values['producable']).valueOf()
        }) as Variable,
        'UOM': () => new UOMVariable(variableName, {
            product: new Product(values['product']),
            name: String(values['name']),
            conversionRate: parseFloat(String(values['conversionRate']))
        }),
        'Indent': () => new IndentVariable(variableName, {}),
        'IndentItem': () => new IndentItemVariable(variableName, {
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
        }),
        'Supplier': () => new SupplierVariable(variableName, {}),
        'SupplierProduct': () => new SupplierProductVariable(variableName, {
            supplier: new Supplier(values['supplier']),
            product: new Product(values['product'])
        }),
        'Quotation': () => new QuotationVariable(variableName, {
            indent: new Indent(values['indent']),
            supplier: new Supplier(values['supplier'])
        }),
        'QuotationItem': () => new QuotationItemVariable(variableName, {
            quotation: new Quotation(values['quotation']),
            indentItem: new IndentItem(values['indentItem']),
            quantity: parseInt(String(values['quantity']))
        }),
        'PurchaseOrder': () => new PurchaseOrderVariable(variableName, {
            quotation: new Quotation(values['quotation'])
        }),
        'PurchaseOrderItem': () => new PurchaseOrderItemVariable(variableName, {
            purchaseOrder: new PurchaseOrder(values['purchaseOrder']),
            quotationItem: new QuotationItem(values['quotationItem']),
            quantity: parseInt(String(values['quantity'])),
            price: parseFloat(String(values['price'])),
            received: parseInt(String(values['received']))
        }),
        'PurchaseInvoice': () => new PurchaseInvoiceVariable(variableName, {
            purchaseOrder: new PurchaseOrder(values['purchaseOrder'])
        }),
        'PurchaseInvoiceItem': () => new PurchaseInvoiceItemVariable(variableName, {
            purchaseInvoice: new PurchaseInvoice(values['purchaseInvoice']),
            purchaseOrderItem: new PurchaseOrderItem(values['purchaseOrderItem']),
            quantity: parseInt(String(values['quantity'])),
            approved: parseInt(String(values['approved'])),
            rejected: parseInt(String(values['rejected']))
        }),
        'MaterialApprovalSlip': () => new MaterialApprovalSlipVariable(variableName, {
            purchaseInvoice: new PurchaseInvoice(values['purchaseInvoice'])
        }),
        'MaterialApprovalSlipItem': () => new MaterialApprovalSlipItemVariable(variableName, {
            materialApprovalSlip: new MaterialApprovalSlip(values['materialApprovalSlip']),
            purchaseInvoiceItem: new PurchaseInvoiceItem(values['purchaseInvoiceItem']),
            quantity: parseInt(String(values['quantity'])),
            requisted: parseInt(String(values['requisted']))
        }),
        'MaterialRejectionSlip': () => new MaterialRejectionSlipVariable(variableName, {
            purchaseInvoice: new PurchaseInvoice(values['purchaseInvoice'])
        }),
        'MaterialRejectionSlipItem': () => new MaterialRejectionSlipItemVariable(variableName, {
            materialRejectionSlip: new MaterialRejectionSlip(values['materialRejectionSlip']),
            purchaseInvoiceItem: new PurchaseInvoiceItem(values['purchaseInvoiceItem']),
            quantity: parseInt(String(values['quantity'])),
            returned: parseInt(String(values['returned']))
        }),
        'MaterialReturnSlip': () => new MaterialReturnSlipVariable(variableName, {
            materialRejectionSlip: new MaterialRejectionSlip(values['materialRejectionSlip'])
        }),
        'MaterialReturnSlipItem': () => new MaterialReturnSlipItemVariable(variableName, {
            materialReturnSlip: new MaterialReturnSlip(values['materialReturnSlip']),
            materialRejectionSlipItem: new MaterialRejectionSlipItem(values['materialRejectionSlipItem']),
            quantity: parseInt(String(values['quantity']))
        }),
        'MaterialRequistionSlip': () => new MaterialRequistionSlipVariable(variableName, {
            materialApprovalSlip: new MaterialApprovalSlip(values['materialApprovalSlip'])
        }),
        'MaterialRequistionSlipItem': () => new MaterialRequistionSlipItemVariable(variableName, {
            materialRequistionSlip: new MaterialRequistionSlip(values['materialRequistionSlip']),
            materialApprovalSlipItem: new MaterialApprovalSlipItem(values['materialApprovalSlipItem']),
            quantity: parseInt(String(values['quantity'])),
            consumed: parseInt(String(values['consumed']))
        }),
        'BOM': () => new BOMVariable(variableName, {}),
        'BOMItem': () => new BOMItemVariable(variableName, {
            bom: new BOM(values['bom']),
            product: new Product(values['product']),
            quantity: parseInt(String(values['quantity'])),
            uom: new UOM(values['uom'])
        }),
        'ProductionPreparationSlip': () => new ProductionPreparationSlipVariable(variableName, {
            bom: new BOM(values['bom']),
            approved: parseInt(String(values['approved'])),
            scrapped: parseInt(String(values['scrapped']))
        }),
        'ProductionPreparationSlipItem': () => new ProductionPreparationSlipItemVariable(variableName, {
            productionPreparationSlip: new ProductionPreparationSlip(values['productionPreparationSlip']),
            bomItem: String(values['bomItem']),
            materialRequistionSlipItem: new MaterialRequistionSlipItem(values['materialRequistionSlipItem'])
        }),
        'ScrapMaterialSlip': () => new ScrapMaterialSlipVariable(variableName, {
            productionPreparationSlip: new ProductionPreparationSlip(values['productionPreparationSlip']),
            quantity: parseInt(String(values['quantity']))
        }),
        'TransferMaterialSlip': () => new TransferMaterialSlipVariable(variableName, {
            productionPreparationSlip: new ProductionPreparationSlip(values['productionPreparationSlip']),
            quantity: parseInt(String(values['quantity'])),
            transferred: parseInt(String(values['quatransferedntity']))
        }),
        'WarehouseAcceptanceSlip': () => new WarehouseAcceptanceSlipVariable(variableName, {
            transferMaterialSlip: new TransferMaterialSlip(values['transferMaterialSlip']),
            quantity: parseInt(String(values['quantity']))
        })
    })
    return [variable, getReplaceVariableDiff(variable)]
}

export function updateVariable(variable: Variable, values: object, updatedVariableName?: string): [Variable, DiffVariable] {
    let updatedVariable: Variable
    switch (variable.typeName) {
        case 'Product': {
            updatedVariable = variable
            updatedVariable.variableName = new Product(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString())
            if (values['name'] !== undefined) updatedVariable.values.name = String(values['name'])
            if (values['orderable'] !== undefined) updatedVariable.values.orderable = Boolean(values['orderable']).valueOf()
            if (values['consumable'] !== undefined) updatedVariable.values.consumable = Boolean(values['consumable']).valueOf()
            if (values['producable'] !== undefined) updatedVariable.values.producable = Boolean(values['producable']).valueOf()
            break
        }
        case 'UOM': {
            updatedVariable = variable
            updatedVariable.variableName = new UOM(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString())
            if (values['product'] !== undefined) updatedVariable.values.product = new Product(String(values['product']))
            if (values['name'] !== undefined) updatedVariable.values.name = String(values['name'])
            if (values['conversionRate'] !== undefined) updatedVariable.values.conversionRate = parseInt(values['conversionRate'])
            break
        }
        case 'Indent': {
            updatedVariable = variable
            updatedVariable.variableName = new Indent(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString())
            break
        }
        case 'IndentItem': {
            updatedVariable = variable
            updatedVariable.variableName = new IndentItem(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString())
            if (values['indent'] !== undefined) updatedVariable.values.indent = new Indent(String(values['indent']))
            if (values['product'] !== undefined) updatedVariable.values.product = new Product(String(values['product']))
            if (values['quantity'] !== undefined) updatedVariable.values.quantity = parseInt(values['quantity'])
            if (values['uom'] !== undefined) updatedVariable.values.uom = new UOM(String(values['uom']))
            if (values['ordered'] !== undefined) updatedVariable.values.ordered = parseInt(values['ordered'])
            if (values['received'] !== undefined) updatedVariable.values.received = parseInt(values['received'])
            if (values['approved'] !== undefined) updatedVariable.values.approved = parseInt(values['approved'])
            if (values['rejected'] !== undefined) updatedVariable.values.rejected = parseInt(values['rejected'])
            if (values['returned'] !== undefined) updatedVariable.values.returned = parseInt(values['returned'])
            if (values['requisted'] !== undefined) updatedVariable.values.requisted = parseInt(values['requisted'])
            if (values['consumed'] !== undefined) updatedVariable.values.consumed = parseInt(values['consumed'])
            break
        }
        case 'Supplier': {
            updatedVariable = variable
            updatedVariable.variableName = new Supplier(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString())
            break
        }
        case 'SupplierProduct': {
            updatedVariable = variable
            updatedVariable.variableName = new SupplierProduct(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString())
            if (values['supplier'] !== undefined) updatedVariable.values.supplier = new Supplier(String(values['supplier']))
            if (values['product'] !== undefined) updatedVariable.values.product = new Product(String(values['product']))
            break
        }
        case 'Quotation': {
            updatedVariable = variable
            updatedVariable.variableName = new Quotation(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString())
            if (values['indent'] !== undefined) updatedVariable.values.indent = new Indent(String(values['indent']))
            if (values['supplier'] !== undefined) updatedVariable.values.supplier = new Supplier(String(values['supplier']))
            break
        }
        case 'QuotationItem': {
            updatedVariable = variable
            updatedVariable.variableName = new QuotationItem(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString())
            if (values['quotation'] !== undefined) updatedVariable.values.quotation = new Quotation(String(values['quotation']))
            if (values['indentItem'] !== undefined) updatedVariable.values.indentItem = new IndentItem(String(values['indentItem']))
            if (values['quantity'] !== undefined) updatedVariable.values.quantity = parseInt(values['quantity'])
            break
        }
        case 'PurchaseOrder': {
            updatedVariable = variable
            updatedVariable.variableName = new PurchaseOrder(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString())
            if (values['quotation'] !== undefined) updatedVariable.values.quotation = new Quotation(String(values['quotation']))
            break
        }
        case 'PurchaseOrderItem': {
            updatedVariable = variable
            updatedVariable.variableName = new PurchaseOrderItem(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString())
            if (values['purchaseOrder'] !== undefined) updatedVariable.values.purchaseOrder = new PurchaseOrder(String(values['purchaseOrder']))
            if (values['quotationItem'] !== undefined) updatedVariable.values.quotationItem = new QuotationItem(String(values['quotationItem']))
            if (values['quantity'] !== undefined) updatedVariable.values.quantity = parseInt(values['quantity'])
            if (values['price'] !== undefined) updatedVariable.values.price = parseFloat(values['price'])
            if (values['received'] !== undefined) updatedVariable.values.received = parseInt(values['received'])
            break
        }
        case 'PurchaseInvoice': {
            updatedVariable = variable
            updatedVariable.variableName = new PurchaseInvoice(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString())
            if (values['purchaseOrder'] !== undefined) updatedVariable.values.purchaseOrder = new PurchaseOrder(String(values['purchaseOrder']))
            break
        }
        case 'PurchaseInvoiceItem': {
            updatedVariable = variable
            updatedVariable.variableName = new PurchaseInvoiceItem(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString())
            if (values['purchaseInvoice'] !== undefined) updatedVariable.values.purchaseInvoice = new PurchaseInvoice(String(values['purchaseInvoice']))
            if (values['purchaseOrderItem'] !== undefined) updatedVariable.values.purchaseOrderItem = new PurchaseOrderItem(String(values['purchaseOrderItem']))
            if (values['quantity'] !== undefined) updatedVariable.values.quantity = parseInt(values['quantity'])
            if (values['approved'] !== undefined) updatedVariable.values.approved = parseInt(values['approved'])
            if (values['rejected'] !== undefined) updatedVariable.values.rejected = parseInt(values['rejected'])
            break
        }
        case 'MaterialApprovalSlip': {
            updatedVariable = variable
            updatedVariable.variableName = new MaterialApprovalSlip(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString())
            if (values['purchaseInvoice'] !== undefined) updatedVariable.values.purchaseInvoice = new PurchaseInvoice(String(values['purchaseInvoice']))
            break
        }
        case 'MaterialApprovalSlipItem': {
            updatedVariable = variable
            updatedVariable.variableName = new MaterialApprovalSlipItem(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString())
            if (values['materialApprovalSlip'] !== undefined) updatedVariable.values.materialApprovalSlip = new MaterialApprovalSlip(String(values['materialApprovalSlip']))
            if (values['purchaseInvoiceItem'] !== undefined) updatedVariable.values.purchaseInvoiceItem = new PurchaseInvoiceItem(String(values['purchaseInvoiceItem']))
            if (values['quantity'] !== undefined) updatedVariable.values.quantity = parseInt(values['quantity'])
            if (values['requisted'] !== undefined) updatedVariable.values.requisted = parseInt(values['requisted'])
            break
        }
        case 'MaterialRejectionSlip': {
            updatedVariable = variable
            updatedVariable.variableName = new MaterialRejectionSlip(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString())
            if (values['purchaseInvoice'] !== undefined) updatedVariable.values.purchaseInvoice = new PurchaseInvoice(String(values['purchaseInvoice']))
            break
        }
        case 'MaterialRejectionSlipItem': {
            updatedVariable = variable
            updatedVariable.variableName = new MaterialRejectionSlipItem(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString())
            if (values['materialRejectionSlip'] !== undefined) updatedVariable.values.materialRejectionSlip = new MaterialRejectionSlip(String(values['materialRejectionSlip']))
            if (values['purchaseInvoiceItem'] !== undefined) updatedVariable.values.purchaseInvoiceItem = new PurchaseInvoiceItem(String(values['purchaseInvoiceItem']))
            if (values['quantity'] !== undefined) updatedVariable.values.quantity = parseInt(values['quantity'])
            if (values['returned'] !== undefined) updatedVariable.values.returned = parseInt(values['returned'])
            break
        }
        case 'MaterialReturnSlip': {
            updatedVariable = variable
            updatedVariable.variableName = new MaterialReturnSlip(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString())
            if (values['materialRejectionSlip'] !== undefined) updatedVariable.values.materialRejectionSlip = new MaterialRejectionSlip(String(values['materialRejectionSlip']))
            break
        }
        case 'MaterialReturnSlipItem': {
            updatedVariable = variable
            updatedVariable.variableName = new MaterialReturnSlipItem(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString())
            if (values['materialReturnSlip'] !== undefined) updatedVariable.values.materialReturnSlip = new MaterialReturnSlip(String(values['materialReturnSlip']))
            if (values['materialRejectionSlipItem'] !== undefined) updatedVariable.values.materialRejectionSlipItem = new MaterialRejectionSlipItem(String(values['materialRejectionSlipItem']))
            if (values['quantity'] !== undefined) updatedVariable.values.quantity = parseInt(values['quantity'])
            break
        }
        case 'MaterialRequistionSlip': {
            updatedVariable = variable
            updatedVariable.variableName = new MaterialRequistionSlip(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString())
            if (values['materialApprovalSlip'] !== undefined) updatedVariable.values.materialApprovalSlip = new MaterialApprovalSlip(String(values['materialApprovalSlip']))
            break
        }
        case 'MaterialRequistionSlipItem': {
            updatedVariable = variable
            updatedVariable.variableName = new MaterialRequistionSlipItem(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString())
            if (values['materialRequistionSlip'] !== undefined) updatedVariable.values.materialRequistionSlip = new MaterialRequistionSlip(String(values['materialRequistionSlip']))
            if (values['materialApprovalSlipItem'] !== undefined) updatedVariable.values.materialApprovalSlipItem = new MaterialApprovalSlipItem(String(values['materialApprovalSlipItem']))
            if (values['quantity'] !== undefined) updatedVariable.values.quantity = parseInt(values['quantity'])
            if (values['consumed'] !== undefined) updatedVariable.values.consumed = parseInt(values['consumed'])
            break
        }
        case 'BOM': {
            updatedVariable = variable
            updatedVariable.variableName = new BOM(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString())
            break
        }
        case 'BOMItem': {
            updatedVariable = variable
            updatedVariable.variableName = new BOMItem(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString())
            if (values['bom'] !== undefined) updatedVariable.values.bom = new BOM(String(values['bom']))
            if (values['product'] !== undefined) updatedVariable.values.product = new Product(String(values['product']))
            if (values['quantity'] !== undefined) updatedVariable.values.quantity = parseInt(values['quantity'])
            if (values['uom'] !== undefined) updatedVariable.values.uom = new UOM(String(values['uom']))
            break
        }
        case 'ProductionPreparationSlip': {
            updatedVariable = variable
            updatedVariable.variableName = new ProductionPreparationSlip(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString())
            if (values['bom'] !== undefined) updatedVariable.values.bom = new BOM(String(values['bom']))
            if (values['approved'] !== undefined) updatedVariable.values.approved = parseInt(values['approved'])
            if (values['scrapped'] !== undefined) updatedVariable.values.scrapped = parseInt(values['scrapped'])
            break
        }
        case 'ProductionPreparationSlipItem': {
            updatedVariable = variable
            updatedVariable.variableName = new ProductionPreparationSlipItem(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString())
            if (values['productionPreparationSlip'] !== undefined) updatedVariable.values.productionPreparationSlip = new ProductionPreparationSlip(String(values['productionPreparationSlip']))
            if (values['bomItem'] !== undefined) updatedVariable.values.bomItem = String(values['bomItem'])
            if (values['materialRequistionSlipItem'] !== undefined) updatedVariable.values.materialRequistionSlipItem = new MaterialRequistionSlipItem(String(values['materialRequistionSlipItem']))
            break
        }
        case 'ScrapMaterialSlip': {
            updatedVariable = variable
            updatedVariable.variableName = new ScrapMaterialSlip(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString())
            if (values['productionPreparationSlip'] !== undefined) updatedVariable.values.productionPreparationSlip = new ProductionPreparationSlip(String(values['productionPreparationSlip']))
            if (values['quantity'] !== undefined) updatedVariable.values.quantity = parseInt(values['quantity'])
            break
        }
        case 'TransferMaterialSlip': {
            updatedVariable = variable
            updatedVariable.variableName = new TransferMaterialSlip(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString())
            if (values['productionPreparationSlip'] !== undefined) updatedVariable.values.productionPreparationSlip = new ProductionPreparationSlip(String(values['productionPreparationSlip']))
            if (values['quantity'] !== undefined) updatedVariable.values.quantity = parseInt(values['quantity'])
            if (values['transferred'] !== undefined) updatedVariable.values.transferred = parseInt(values['transferred'])
            break
        }
        case 'WarehouseAcceptanceSlip': {
            updatedVariable = variable
            updatedVariable.variableName = new WarehouseAcceptanceSlip(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString())
            if (values['transferMaterialSlip'] !== undefined) updatedVariable.values.transferMaterialSlip = new TransferMaterialSlip(String(values['transferMaterialSlip']))
            if (values['quantity'] !== undefined) updatedVariable.values.quantity = parseInt(values['quantity'])
            break
        }
    }
    return [updatedVariable, mergeDiffs([getRemoveVariableDiff(variable.typeName, variable.variableName.toString()), getReplaceVariableDiff(updatedVariable)])]
}

export function deleteVariable(typeName: NonPrimitiveType, variableName: string): DiffVariable {
    return getRemoveVariableDiff(typeName, variableName)
}

export type Multiqueue = Record<string, ReadonlyArray<
    | {
        typeName: NonPrimitiveType
        op: 'create'
        variableName: string
        values: object
    } | {
        typeName: NonPrimitiveType
        op: 'update'
        variableName: string
        updatedVariableName?: string
        active?: boolean
        values: object
    } | {
        typeName: NonPrimitiveType
        op: 'delete'
        variableName: string
    }>>

export async function executeQueue(multiqueue: Multiqueue): Promise<[Record<string, Array<any>>, DiffVariable]> {
    const diffs: Array<DiffVariable> = []
    const result: Record<string, Array<any>> = {}
    for (const queueName in multiqueue) {
        const queue = multiqueue[queueName]
        result[queueName] = []
        var symbolFlag = true
        for (const mutation of queue) {
            if (symbolFlag) {
                switch (mutation.op) {
                    case 'create': {
                        const [variable, diff] = createVariable(mutation.typeName, mutation.variableName, mutation.values)
                        result[queueName].push(variable)
                        diffs.push(diff)
                        break
                    }
                    case 'update': {
                        const variable = await getVariable(mutation.typeName, mutation.variableName)
                        if (variable !== undefined) {
                            const [updatedVariable, diff] = updateVariable(variable, mutation.values, mutation.updatedVariableName)
                            result[queueName].push(updatedVariable)
                            diffs.push(diff)
                        } else {
                            result[queueName].push({})
                            symbolFlag = false
                        }
                        break
                    }
                    case 'delete': {
                        const variable = await getVariable(mutation.typeName, mutation.variableName)
                        if (variable !== undefined) {
                            result[queueName].push(variable)
                        } else {
                            result[queueName].push({})
                        }
                        const diff = deleteVariable(mutation.typeName, mutation.variableName)
                        diffs.push(diff)
                        break
                    }
                }
            }
        }
    }
    return [result, mergeDiffs(diffs)]
}
