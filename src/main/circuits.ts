import { Circuit } from "./circuit"

export type CircuitName =
    | 'createProduct'
    | 'createIndent'
    | 'createSupplier'
    | 'createQuotation'
    | 'createPurchaseOrder'
    | 'createPurchaseInvoice'
    | 'createMaterialApprovalSlip'
    | 'createMaterialRejectionSlip'
    | 'createMaterialReturnSlip'
    | 'createMaterialRequistionSlip'
    | 'createBOM'
    | 'createProductionPreparationSlip'
    | 'createScrapMaterialSlip'
    | 'createTransferMaterialSlip'
    | 'createWarehouseAcceptanceSlip'

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
    }
}
