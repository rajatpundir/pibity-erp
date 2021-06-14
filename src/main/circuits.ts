import { Circuit } from "./circuit"

export type CircuitName =
    | 'createProduct'
    | 'deleteProduct'
    | 'createIndent'
    | 'deleteIndent'
    | 'createSupplier'
    | 'deleteSupplier'
    | 'createQuotation'
    | 'deleteQuotation'
    | 'createPurchaseOrder'
    | 'deletePurchaseOrder'
    | 'createPurchaseInvoice'
    | 'deletePurchaseInvoice'
    | 'createMaterialApprovalSlip'
    | 'deleteMaterialApprovalSlip'
    | 'createMaterialRejectionSlip'
    | 'deleteMaterialRejectionSlip'
    | 'createMaterialReturnSlip'
    | 'deleteMaterialReturnSlip'
    | 'createMaterialRequistionSlip'
    | 'deleteMaterialRequistionSlip'
    | 'createBOM'
    | 'deleteBOM'
    | 'createProductionPreparationSlip'
    | 'deleteProductionPreparationSlip'
    | 'createScrapMaterialSlip'
    | 'deleteScrapMaterialSlip'
    | 'createTransferMaterialSlip'
    | 'deleteTransferMaterialSlip'
    | 'createWarehouseAcceptanceSlip'
    | 'deleteWarehouseAcceptanceSlip'

export const circuits: Record<CircuitName, Circuit> = {
    createProduct: {
        inputs: {
            sku: {
                type: 'Text'
            },
            name: {
                type: 'Text'
            },
            orderable: {
                type: 'Boolean'
            },
            consumable: {
                type: 'Boolean'
            },
            producable: {
                type: 'Boolean'
            },
            uoms: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createProduct',
                connect: {
                    variableName: ['input', 'sku'],
                    name: ['input', 'name'],
                    orderable: ['input', 'orderable'],
                    consumable: ['input', 'consumable'],
                    producable: ['input', 'producable']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createUOMs',
                connect: {
                    queryParams: {},
                    args: ['input', 'uoms'],
                    overrides: {
                        product: ['input', 'sku']
                    }
                }
            }
        },
        outputs: {
            product: ['c1', 'product'],
            uoms: ['c2', '']
        }
    },
    deleteProduct: {
        inputs: {
            variableName: {
                type: 'Text'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteUOMs',
                connect: {
                    queryParams: {
                        'product': ['input', 'variableName']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'function',
                exec: 'deleteProduct',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            product: ['c2', 'product']
        }
    },
    createIndent: {
        inputs: {
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createIndent',
                connect: {}
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createIndentItems',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        indent: ['computation', 'c1', 'indent']
                    }
                }
            }
        },
        outputs: {
            indent: ['c1', 'indent'],
            items: ['c2', '']
        }
    },
    deleteIndent: {
        inputs: {
            variableName: {
                type: 'Text'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteIndentItems',
                connect: {
                    queryParams: {
                        'indent': ['input', 'variableName']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'function',
                exec: 'deleteIndent',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            indent: ['c2', 'indent']
        }
    },
    createSupplier: {
        inputs: {
            name: {
                type: 'Text'
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createSupplier',
                connect: {
                    variableName: ['input', 'name']
                }
            }
        },
        outputs: {
            supplier: ['c1', 'supplier']
        }
    },
    deleteSupplier: {
        inputs: {
            variableName: {
                type: 'Text'
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'deleteSupplier',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            supplier: ['c1', 'supplier']
        }
    },
    createQuotation: {
        inputs: {
            indent: {
                type: 'Indent'
            },
            supplier: {
                type: 'Supplier'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createQuotation',
                connect: {
                    indent: ['input', 'indent'],
                    supplier: ['input', 'supplier']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createQuotationItems',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        quotation: ['computation', 'c1', 'quotation']
                    }
                }
            }
        },
        outputs: {
            quotation: ['c1', 'quotation'],
            items: ['c2', '']
        }
    },
    deleteQuotation: {
        inputs: {
            variableName: {
                type: 'Text'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteQuotationItems',
                connect: {
                    queryParams: {
                        'quotation': ['input', 'variableName']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'function',
                exec: 'deleteQuotation',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            quotation: ['c2', 'quotation']
        }
    },
    createPurchaseOrder: {
        inputs: {
            quotation: {
                type: 'Quotation'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createPurchaseOrder',
                connect: {
                    quotation: ['input', 'quotation']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createPurchaseOrderItems',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        purchaseOrder: ['computation', 'c1', 'purchaseOrder']
                    }
                }
            }
        },
        outputs: {
            purchaseOrder: ['c1', 'purchaseOrder'],
            items: ['c2', '']
        }
    },
    deletePurchaseOrder: {
        inputs: {
            variableName: {
                type: 'Text'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deletePurchaseOrderItems',
                connect: {
                    queryParams: {
                        'purchaseOrder': ['input', 'variableName']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'function',
                exec: 'deletePurchaseOrder',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            purchaseOrder: ['c2', 'purchaseOrder']
        }
    },
    createPurchaseInvoice: {
        inputs: {
            purchaseOrder: {
                type: 'PurchaseOrder'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createPurchaseInvoice',
                connect: {
                    purchaseOrder: ['input', 'purchaseOrder']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createPurchaseInvoiceItems',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        purchaseInvoice: ['computation', 'c1', 'purchaseInvoice']
                    }
                }
            }
        },
        outputs: {
            purchaseInvoice: ['c1', 'purchaseInvoice'],
            items: ['c2', '']
        }
    },
    deletePurchaseInvoice: {
        inputs: {
            variableName: {
                type: 'Text'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deletePurchaseInvoiceItems',
                connect: {
                    queryParams: {
                        'purchaseInvoice': ['input', 'variableName']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'function',
                exec: 'deletePurchaseInvoice',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            purchaseInvoice: ['c2', 'purchaseInvoice']
        }
    },
    createMaterialApprovalSlip: {
        inputs: {
            purchaseInvoice: {
                type: 'PurchaseInvoice'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createMaterialApprovalSlip',
                connect: {
                    purchaseInvoice: ['input', 'purchaseInvoice']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createMaterialApprovalSlipItems',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        materialApprovalSlip: ['computation', 'c1', 'materialApprovalSlip']
                    }
                }
            }
        },
        outputs: {
            materialApprovalSlip: ['c1', 'materialApprovalSlip'],
            items: ['c2', '']
        }
    },
    deleteMaterialApprovalSlip: {
        inputs: {
            variableName: {
                type: 'Text'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteMaterialApprovalSlipItems',
                connect: {
                    queryParams: {
                        'materialApprovalSlip': ['input', 'variableName']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'function',
                exec: 'deleteMaterialApprovalSlip',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            materialApprovalSlip: ['c2', 'materialApprovalSlip']
        }
    },
    createMaterialRejectionSlip: {
        inputs: {
            purchaseInvoice: {
                type: 'PurchaseInvoice'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createMaterialRejectionSlip',
                connect: {
                    purchaseInvoice: ['input', 'purchaseInvoice']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createMaterialRejectionSlipItems',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        materialRejectionSlip: ['computation', 'c1', 'materialRejectionSlip']
                    }
                }
            }
        },
        outputs: {
            materialRejectionSlip: ['c1', 'materialRejectionSlip'],
            items: ['c2', '']
        }
    },
    deleteMaterialRejectionSlip: {
        inputs: {
            variableName: {
                type: 'Text'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteMaterialRejectionSlipItems',
                connect: {
                    queryParams: {
                        'materialRejectionSlip': ['input', 'variableName']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'function',
                exec: 'deleteMaterialRejectionSlip',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            materialRejectionSlip: ['c2', 'materialRejectionSlip']
        }
    },
    createMaterialReturnSlip: {
        inputs: {
            materialRejectionSlip: {
                type: 'MaterialRejectionSlip'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createMaterialReturnSlip',
                connect: {
                    materialRejectionSlip: ['input', 'materialRejectionSlip']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createMaterialReturnSlipItems',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        materialReturnSlip: ['computation', 'c1', 'materialReturnSlip']
                    }
                }
            }
        },
        outputs: {
            materialReturnSlip: ['c1', 'materialReturnSlip'],
            items: ['c2', '']
        }
    },
    deleteMaterialReturnSlip: {
        inputs: {
            variableName: {
                type: 'Text'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteMaterialReturnSlipItems',
                connect: {
                    queryParams: {
                        'materialReturnSlip': ['input', 'variableName']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'function',
                exec: 'deleteMaterialReturnSlip',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            materialReturnSlip: ['c2', 'materialReturnSlip']
        }
    },
    createMaterialRequistionSlip: {
        inputs: {
            materialApprovalSlip: {
                type: 'MaterialApprovalSlip'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createMaterialRequistionSlip',
                connect: {
                    materialApprovalSlip: ['input', 'materialApprovalSlip']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createMaterialRequistionSlipItems',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        materialRequistionSlip: ['computation', 'c1', 'materialRequistionSlip']
                    }
                }
            }
        },
        outputs: {
            materialRequistionSlip: ['c1', 'materialRequistionSlip'],
            items: ['c2', '']
        }
    },
    deleteMaterialRequistionSlip: {
        inputs: {
            variableName: {
                type: 'Text'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteMaterialRequistionSlipItems',
                connect: {
                    queryParams: {
                        'materialRequistionSlip': ['input', 'variableName']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'function',
                exec: 'deleteMaterialRequistionSlip',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            materialRequistionSlip: ['c2', 'materialRequistionSlip']
        }
    },
    createBOM: {
        inputs: {
            variableName: {
                type: 'Text'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createBOM',
                connect: {
                    variableName: ['input', 'variableName']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createBOMItems',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        bom: ['computation', 'c1', 'bom']
                    }
                }
            }
        },
        outputs: {
            bom: ['c1', 'bom'],
            items: ['c2', '']
        }
    },
    deleteBOM: {
        inputs: {
            variableName: {
                type: 'Text'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteBOMItems',
                connect: {
                    queryParams: {
                        'bom': ['input', 'variableName']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'function',
                exec: 'deleteBOM',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            bom: ['c2', 'bom']
        }
    },
    createProductionPreparationSlip: {
        inputs: {
            bom: {
                type: 'BOM'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createProductionPreparationSlip',
                connect: {
                    bom: ['input', 'bom']
                }
            },
            c2: {
                order: 2,
                type: 'mapper',
                exec: 'createProductionPreparationSlipItems',
                connect: {
                    queryParams: {},
                    args: ['input', 'items'],
                    overrides: {
                        productionPreparationSlip: ['computation', 'c1', 'productionPreparationSlip']
                    }
                }
            }
        },
        outputs: {
            productionPreparationSlip: ['c1', 'productionPreparationSlip'],
            items: ['c2', '']
        }
    },
    deleteProductionPreparationSlip: {
        inputs: {
            variableName: {
                type: 'Text'
            },
            items: {
                type: []
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'mapper',
                exec: 'deleteProductionPreparationSlipItems',
                connect: {
                    queryParams: {
                        'productionPreparationSlip': ['input', 'variableName']
                    },
                    args: ['input', 'items'],
                    overrides: {}
                }
            },
            c2: {
                order: 2,
                type: 'function',
                exec: 'deleteProductionPreparationSlip',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            productionPreparationSlip: ['c2', 'productionPreparationSlip']
        }
    },
    createScrapMaterialSlip: {
        inputs: {
            productionPreparationSlip: {
                type: 'ProductionPreparationSlip'
            },
            quantity: {
                type: 'Number'
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createScrapMaterialSlip',
                connect: {
                    productionPreparationSlip: ['input', 'productionPreparationSlip'],
                    quantity: ['input', 'quantity']
                }
            }
        },
        outputs: {
            scrapMaterialSlip: ['c1', 'scrapMaterialSlip']
        }
    },
    deleteScrapMaterialSlip: {
        inputs: {
            variableName: {
                type: 'Text'
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'deleteScrapMaterialSlip',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            scrapMaterialSlip: ['c1', 'scrapMaterialSlip']
        }
    },
    createTransferMaterialSlip: {
        inputs: {
            productionPreparationSlip: {
                type: 'ProductionPreparationSlip'
            },
            quantity: {
                type: 'Number'
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createTransferMaterialSlip',
                connect: {
                    productionPreparationSlip: ['input', 'productionPreparationSlip'],
                    quantity: ['input', 'quantity']
                }
            }
        },
        outputs: {
            transferMaterialSlip: ['c1', 'transferMaterialSlip']
        }
    },
    deleteTransferMaterialSlip: {
        inputs: {
            variableName: {
                type: 'Text'
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'deleteTransferMaterialSlip',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            transferMaterialSlip: ['c1', 'transferMaterialSlip']
        }
    },
    createWarehouseAcceptanceSlip: {
        inputs: {
            transferMaterialSlip: {
                type: 'TransferMaterialSlip'
            },
            quantity: {
                type: 'Number'
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'createWarehouseAcceptanceSlip',
                connect: {
                    transferMaterialSlip: ['input', 'transferMaterialSlip'],
                    quantity: ['input', 'quantity']
                }
            }
        },
        outputs: {
            warehouseAcceptanceSlip: ['c1', 'warehouseAcceptanceSlip']
        }
    },
    deleteWarehouseAcceptanceSlip: {
        inputs: {
            variableName: {
                type: 'Text'
            }
        },
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'deleteWarehouseAcceptanceSlip',
                connect: {
                    variableName: ['input', 'variableName']
                }
            }
        },
        outputs: {
            warehouseAcceptanceSlip: ['c1', 'warehouseAcceptanceSlip']
        }
    }
}
