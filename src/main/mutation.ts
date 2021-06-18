import { Immutable } from 'immer';
import { DiffVariable, getRemoveVariableDiff, getReplaceVariableDiff, getVariable, mergeDiffs } from './layers'
import { NonPrimitiveType } from './types';
import { when } from './utils';
import { Variable, ProductVariable, UOMVariable, IndentVariable, IndentItemVariable, SupplierVariable, SupplierProductVariable, QuotationVariable, QuotationItemVariable, PurchaseOrderVariable, PurchaseOrderItemVariable, PurchaseInvoiceVariable, PurchaseInvoiceItemVariable, MaterialApprovalSlipVariable, MaterialApprovalSlipItemVariable, MaterialRejectionSlipVariable, MaterialRejectionSlipItemVariable, MaterialReturnSlipVariable, MaterialReturnSlipItemVariable, MaterialRequistionSlipVariable, MaterialRequistionSlipItemVariable, BOMVariable, BOMItemVariable, ProductionPreparationSlipVariable, ProductionPreparationSlipItemVariable, ScrapMaterialSlipVariable, TransferMaterialSlipVariable, WarehouseAcceptanceSlipVariable, Product, UOM, Indent, IndentItem, Supplier, Quotation, QuotationItem, PurchaseOrder, PurchaseOrderItem, PurchaseInvoice, PurchaseInvoiceItem, MaterialApprovalSlip, MaterialApprovalSlipItem, MaterialRejectionSlip, MaterialRejectionSlipItem, MaterialReturnSlip, MaterialRequistionSlip, MaterialRequistionSlipItem, BOM, ProductionPreparationSlip, TransferMaterialSlip } from './variables'

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

export function updateVariable(variable: Immutable<Variable>, values: object, updatedVariableName?: string): [Variable, DiffVariable] {
    let updatedVariable: Variable
    switch (variable.typeName) {
        case 'Product': {
            updatedVariable = new ProductVariable(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString(), {
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name,
                orderable: values['orderable'] !== undefined ? Boolean(values['orderable']).valueOf() : variable.values.orderable,
                consumable: values['consumable'] !== undefined ? Boolean(values['consumable']).valueOf() : variable.values.consumable,
                producable: values['producable'] !== undefined ? Boolean(values['producable']).valueOf() : variable.values.orderable,
            })
            break
        }
        case 'UOM': {
            updatedVariable = new UOMVariable(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString(), {
                product: values['product'] !== undefined ? new Product(String(values['product'])) : new Product(variable.values.product.toString()),
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name,
                conversionRate: values['conversionRate'] !== undefined ? parseInt(values['conversionRate']) : variable.values.conversionRate
            })
            break
        }
        case 'Indent': {
            updatedVariable = new IndentVariable(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString(), {})
            break
        }
        case 'IndentItem': {
            updatedVariable = new IndentItemVariable(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString(), {
                indent: values['indent'] !== undefined ? new Indent(String(values['indent'])) : new Indent(variable.values.indent.toString()),
                product: values['product'] !== undefined ? new Product(String(values['product'])) : new Product(variable.values.product.toString()),
                quantity: values['quantity'] !== undefined ? parseInt(values['quantity']) : variable.values.quantity,
                uom: values['uom'] !== undefined ? new UOM(String(values['uom'])) : new UOM(variable.values.uom.toString()),
                ordered: values['ordered'] !== undefined ? parseInt(values['ordered']) : variable.values.ordered,
                received: values['received'] !== undefined ? parseInt(values['received']) : variable.values.received,
                approved: values['approved'] !== undefined ? parseInt(values['approved']) : variable.values.approved,
                rejected: values['rejected'] !== undefined ? parseInt(values['rejected']) : variable.values.rejected,
                returned: values['returned'] !== undefined ? parseInt(values['returned']) : variable.values.returned,
                requisted: values['requisted'] !== undefined ? parseInt(values['requisted']) : variable.values.requisted,
                consumed: values['consumed'] !== undefined ? parseInt(values['consumed']) : variable.values.consumed
            })
            break
        }
        case 'Supplier': {
            updatedVariable = new SupplierVariable(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString(), {})
            break
        }
        case 'SupplierProduct': {
            updatedVariable = new SupplierProductVariable(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString(), {
                supplier: values['supplier'] !== undefined ? new Supplier(String(values['supplier'])) : new Supplier(variable.values.supplier.toString()),
                product: values['product'] !== undefined ? new Product(String(values['product'])) : new Product(variable.values.product.toString())
            })
            break
        }
        case 'Quotation': {
            updatedVariable = new QuotationVariable(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString(), {
                indent: values['indent'] !== undefined ? new Indent(String(values['indent'])) : new Indent(variable.values.indent.toString()),
                supplier: values['supplier'] !== undefined ? new Supplier(String(values['supplier'])) : new Supplier(variable.values.supplier.toString())
            })
            break
        }
        case 'QuotationItem': {
            updatedVariable = new QuotationItemVariable(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString(), {
                quotation: values['quotation'] !== undefined ? new Quotation(String(values['quotation'])) : new Quotation(variable.values.quotation.toString()),
                indentItem: values['indentItem'] !== undefined ? new IndentItem(String(values['indentItem'])) : new IndentItem(variable.values.indentItem.toString()),
                quantity: values['quantity'] !== undefined ? parseInt(values['quantity']) : variable.values.quantity
            })
            break
        }
        case 'PurchaseOrder': {
            updatedVariable = new PurchaseOrderVariable(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString(), {
                quotation: values['quotation'] !== undefined ? new Quotation(String(values['quotation'])) : new Quotation(variable.values.quotation.toString())
            })
            break
        }
        case 'PurchaseOrderItem': {
            updatedVariable = new PurchaseOrderItemVariable(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString(), {
                purchaseOrder: values['purchaseOrder'] !== undefined ? new PurchaseOrder(String(values['purchaseOrder'])) : new PurchaseOrder(variable.values.purchaseOrder.toString()),
                quotationItem: values['quotationItem'] !== undefined ? new QuotationItem(String(values['quotationItem'])) : new QuotationItem(variable.values.quotationItem.toString()),
                quantity: values['quantity'] !== undefined ? parseInt(values['quantity']) : variable.values.quantity,
                price: values['price'] !== undefined ? parseFloat(values['price']) : variable.values.price,
                received: values['received'] !== undefined ? parseInt(values['received']) : variable.values.received
            })
            break
        }
        case 'PurchaseInvoice': {
            updatedVariable = new PurchaseInvoiceVariable(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString(), {
                purchaseOrder: values['purchaseOrder'] !== undefined ? new PurchaseOrder(String(values['purchaseOrder'])) : new PurchaseOrder(variable.values.purchaseOrder.toString())
            })
            break
        }
        case 'PurchaseInvoiceItem': {
            updatedVariable = new PurchaseInvoiceItemVariable(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString(), {
                purchaseInvoice: values['purchaseInvoice'] !== undefined ? new PurchaseInvoice(String(values['purchaseInvoice'])) : new PurchaseInvoice(variable.values.purchaseInvoice.toString()),
                purchaseOrderItem: values['purchaseOrderItem'] !== undefined ? new PurchaseOrderItem(String(values['purchaseOrderItem'])) : new PurchaseOrderItem(variable.values.purchaseOrderItem.toString()),
                quantity: values['quantity'] !== undefined ? parseInt(values['quantity']) : variable.values.quantity,
                approved: values['approved'] !== undefined ? parseInt(values['approved']) : variable.values.approved,
                rejected: values['rejected'] !== undefined ? parseInt(values['rejected']) : variable.values.rejected
            })
            break
        }
        case 'MaterialApprovalSlip': {
            updatedVariable = new MaterialApprovalSlipVariable(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString(), {
                purchaseInvoice: values['purchaseInvoice'] !== undefined ? new PurchaseInvoice(String(values['purchaseInvoice'])) : new PurchaseInvoice(variable.values.purchaseInvoice.toString())
            })
            break
        }
        case 'MaterialApprovalSlipItem': {
            updatedVariable = new MaterialApprovalSlipItemVariable(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString(), {
                materialApprovalSlip: values['materialApprovalSlip'] !== undefined ? new MaterialApprovalSlip(String(values['materialApprovalSlip'])) : new MaterialApprovalSlip(variable.values.materialApprovalSlip.toString()),
                purchaseInvoiceItem: values['purchaseInvoiceItem'] !== undefined ? new PurchaseInvoiceItem(String(values['purchaseInvoiceItem'])) : new PurchaseInvoiceItem(variable.values.purchaseInvoiceItem.toString()),
                quantity: values['quantity'] !== undefined ? parseInt(values['quantity']) : variable.values.quantity,
                requisted: values['requisted'] !== undefined ? parseInt(values['requisted']) : variable.values.requisted
            })
            break
        }
        case 'MaterialRejectionSlip': {
            updatedVariable = new MaterialRejectionSlipVariable(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString(), {
                purchaseInvoice: values['purchaseInvoice'] !== undefined ? new PurchaseInvoice(String(values['purchaseInvoice'])) : new PurchaseInvoice(variable.values.purchaseInvoice.toString())
            })
            break
        }
        case 'MaterialRejectionSlipItem': {
            updatedVariable = new MaterialRejectionSlipItemVariable(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString(), {
                materialRejectionSlip: values['materialRejectionSlip'] !== undefined ? new MaterialRejectionSlip(String(values['materialRejectionSlip'])) : new MaterialRejectionSlip(variable.values.materialRejectionSlip.toString()),
                purchaseInvoiceItem: values['purchaseInvoiceItem'] !== undefined ? new PurchaseInvoiceItem(String(values['purchaseInvoiceItem'])) : new PurchaseInvoiceItem(variable.values.purchaseInvoiceItem.toString()),
                quantity: values['quantity'] !== undefined ? parseInt(values['quantity']) : variable.values.quantity,
                returned: values['returned'] !== undefined ? parseInt(values['returned']) : variable.values.returned
            })
            break
        }
        case 'MaterialReturnSlip': {
            updatedVariable = new MaterialReturnSlipVariable(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString(), {
                materialRejectionSlip: values['materialRejectionSlip'] !== undefined ? new MaterialRejectionSlip(String(values['materialRejectionSlip'])) : new MaterialRejectionSlip(variable.values.materialRejectionSlip.toString())
            })
            break
        }
        case 'MaterialReturnSlipItem': {
            updatedVariable = new MaterialReturnSlipItemVariable(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString(), {
                materialReturnSlip: values['materialReturnSlip'] !== undefined ? new MaterialReturnSlip(String(values['materialReturnSlip'])) : new MaterialReturnSlip(variable.values.materialReturnSlip.toString()),
                materialRejectionSlipItem: values['materialRejectionSlipItem'] !== undefined ? new MaterialRejectionSlipItem(String(values['materialRejectionSlipItem'])) : new MaterialRejectionSlipItem(variable.values.materialRejectionSlipItem.toString()),
                quantity: values['quantity'] !== undefined ? parseInt(values['quantity']) : variable.values.quantity
            })
            break
        }
        case 'MaterialRequistionSlip': {
            updatedVariable = new MaterialRequistionSlipVariable(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString(), {
                materialApprovalSlip: values['materialApprovalSlip'] !== undefined ? new MaterialApprovalSlip(String(values['materialApprovalSlip'])) : new MaterialApprovalSlip(variable.values.materialApprovalSlip.toString())
            })
            break
        }
        case 'MaterialRequistionSlipItem': {
            updatedVariable = new MaterialRequistionSlipItemVariable(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString(), {
                materialRequistionSlip: values['materialRequistionSlip'] !== undefined ? new MaterialRequistionSlip(String(values['materialRequistionSlip'])) : new MaterialRequistionSlip(variable.values.materialRequistionSlip.toString()),
                materialApprovalSlipItem: values['materialApprovalSlipItem'] !== undefined ? new MaterialApprovalSlipItem(String(values['materialApprovalSlipItem'])) : new MaterialApprovalSlipItem(variable.values.materialApprovalSlipItem.toString()),
                quantity: values['quantity'] !== undefined ? parseInt(values['quantity']) : variable.values.quantity,
                consumed: values['consumed'] !== undefined ? parseInt(values['consumed']) : variable.values.consumed
            })
            break
        }
        case 'BOM': {
            updatedVariable = new BOMVariable(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString(), {})
            break
        }
        case 'BOMItem': {
            updatedVariable = new BOMItemVariable(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString(), {
                bom: values['bom'] !== undefined ? new BOM(String(values['bom'])) : new BOM(variable.values.bom.toString()),
                product: values['product'] !== undefined ? new Product(String(values['product'])) : new Product(variable.values.product.toString()),
                quantity: values['quantity'] !== undefined ? parseInt(values['quantity']) : variable.values.quantity,
                uom: values['uom'] !== undefined ? new UOM(String(values['uom'])) : new UOM(variable.values.uom.toString())
            })
            break
        }
        case 'ProductionPreparationSlip': {
            updatedVariable = new ProductionPreparationSlipVariable(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString(), {
                bom: values['bom'] !== undefined ? new BOM(String(values['bom'])) : new BOM(variable.values.bom.toString()),
                approved: values['approved'] !== undefined ? parseInt(values['approved']) : variable.values.approved,
                scrapped: values['scrapped'] !== undefined ? parseInt(values['scrapped']) : variable.values.scrapped
            })
            break
        }
        case 'ProductionPreparationSlipItem': {
            updatedVariable = new ProductionPreparationSlipItemVariable(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString(), {
                productionPreparationSlip: values['productionPreparationSlip'] !== undefined ? new ProductionPreparationSlip(String(values['productionPreparationSlip'])) : new ProductionPreparationSlip(variable.values.productionPreparationSlip.toString()),
                bomItem: values['bomItem'] !== undefined ? String(values['bomItem']) : variable.values.bomItem,
                materialRequistionSlipItem: values['materialRequistionSlipItem'] !== undefined ? new MaterialRequistionSlipItem(String(values['materialRequistionSlipItem'])) : new MaterialRequistionSlipItem(variable.values.materialRequistionSlipItem.toString())
            })
            break
        }
        case 'ScrapMaterialSlip': {
            updatedVariable = new ScrapMaterialSlipVariable(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString(), {
                productionPreparationSlip: values['productionPreparationSlip'] !== undefined ? new ProductionPreparationSlip(String(values['productionPreparationSlip'])) : new ProductionPreparationSlip(variable.values.productionPreparationSlip.toString()),
                quantity: values['quantity'] !== undefined ? parseInt(values['quantity']) : variable.values.quantity
            })
            break
        }
        case 'TransferMaterialSlip': {
            updatedVariable = new TransferMaterialSlipVariable(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString(), {
                productionPreparationSlip: values['productionPreparationSlip'] !== undefined ? new ProductionPreparationSlip(String(values['productionPreparationSlip'])) : new ProductionPreparationSlip(variable.values.productionPreparationSlip.toString()),
                quantity: values['quantity'] !== undefined ? parseInt(values['quantity']) : variable.values.quantity,
                transferred: values['transferred'] !== undefined ? parseInt(values['transferred']) : variable.values.transferred
            })
            break
        }
        case 'WarehouseAcceptanceSlip': {
            updatedVariable = new WarehouseAcceptanceSlipVariable(updatedVariableName !== undefined ? updatedVariableName : variable.variableName.toString(), {
                transferMaterialSlip: values['transferMaterialSlip'] !== undefined ? new TransferMaterialSlip(String(values['transferMaterialSlip'])) : new TransferMaterialSlip(variable.values.transferMaterialSlip.toString()),
                quantity: values['quantity'] !== undefined ? parseInt(values['quantity']) : variable.values.quantity
            })
            break
        }
    }
    // Note. Also update references if variable name was updated and include the updates in diff.
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
