import { Function } from './function'

export type FunctionName =
    | 'createProduct'
    | 'createUOM'
    | 'createSupplier'
    | 'createIndent'
    | 'createIndentItem'
    | 'createQuotation'
    | 'createQuotationItem'
    | 'createPurchaseOrder'
    | 'createPurchaseOrderItem'
    | 'createPurchaseInvoice'
    | 'createPurchaseInvoiceItem'
    | 'createMaterialApprovalSlip'
    | 'createMaterialApprovalSlipItem'
    | 'createMaterialRejectionSlip'
    | 'createMaterialRejectionSlipItem'
    | 'createMaterialReturnSlip'
    | 'createMaterialReturnSlipItem'
    | 'createMaterialRequistionSlip'
    | 'createMaterialRequistionSlipItem'
    | 'createBOM'
    | 'createBOMItem'
    | 'createProductionPreparationSlip'
    | 'createProductionPreparationSlipItem'
    | 'createScrapMaterialSlip'
    | 'createTransferMaterialSlip'
    | 'createWarehouseAcceptanceSlip'

export const functions: Record<FunctionName, Function> = {
    createProduct: {
        inputs: {
            variableName: {
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
            }
        },
        outputs: {
            product: {
                type: 'Product',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {
                    name: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['name']
                    },
                    orderable: {
                        expectedReturnType: 'Boolean',
                        op: '.',
                        types: [],
                        args: ['orderable']
                    },
                    consumable: {
                        expectedReturnType: 'Boolean',
                        op: '.',
                        types: [],
                        args: ['consumable']
                    },
                    producable: {
                        expectedReturnType: 'Boolean',
                        op: '.',
                        types: [],
                        args: ['producable']
                    }
                }
            }
        }
    },
    createUOM: {
        inputs: {
            product: {
                type: 'Product'
            },
            name: {
                type: 'Text'
            },
            conversionRate: {
                type: 'Decimal'
            }
        },
        outputs: {
            uom: {
                type: 'UOM',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
                values: {
                    product: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['product']
                    },
                    name: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['name']
                    },
                    conversionRate: {
                        expectedReturnType: 'Decimal',
                        op: '.',
                        types: [],
                        args: ['conversionRate']
                    }
                }
            }
        }
    },
    createSupplier: {
        inputs: {
            variableName: {
                type: 'Text'
            }
        },
        outputs: {
            supplier: {
                type: 'Supplier',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
            }
        }
    },
    createIndent: {
        inputs: {},
        outputs: {
            indent: {
                type: 'Indent',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
                values: {}
            }
        }
    },
    createIndentItem: {
        inputs: {
            indent: {
                type: 'Indent'
            },
            product: {
                type: 'Product'
            },
            quantity: {
                type: 'Decimal'
            },
            uom: {
                type: 'UOM'
            }
        },
        outputs: {
            indentItem: {
                type: 'IndentItem',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
                values: {
                    indent: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['indent']
                    },
                    product: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['product']
                    },
                    quantity: {
                        expectedReturnType: 'Decimal',
                        op: '.',
                        types: [],
                        args: ['quantity']
                    },
                    uom: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['uom']
                    },
                    ordered: {
                        expectedReturnType: 'Number',
                        op: 'id',
                        types: ['Number'],
                        args: [0]
                    },
                    received: {
                        expectedReturnType: 'Number',
                        op: 'id',
                        types: ['Number'],
                        args: [0]
                    },
                    approved: {
                        expectedReturnType: 'Number',
                        op: 'id',
                        types: ['Number'],
                        args: [0]
                    },
                    rejected: {
                        expectedReturnType: 'Number',
                        op: 'id',
                        types: ['Number'],
                        args: [0]
                    },
                    returned: {
                        expectedReturnType: 'Number',
                        op: 'id',
                        types: ['Number'],
                        args: [0]
                    },
                    requisted: {
                        expectedReturnType: 'Number',
                        op: 'id',
                        types: ['Number'],
                        args: [0]
                    },
                    consumed: {
                        expectedReturnType: 'Number',
                        op: 'id',
                        types: ['Number'],
                        args: [0]
                    }
                }
            }
        }
    },
    createQuotation: {
        inputs: {
            indent: {
                type: 'Indent'
            },
            supplier: {
                type: 'Supplier'
            }
        },
        outputs: {
            quotation: {
                type: 'Quotation',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
                values: {
                    indent: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['indent']
                    },
                    supplier: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['supplier']
                    }
                }
            }
        }
    },
    createQuotationItem: {
        inputs: {
            quotation: {
                type: 'Quotation'
            },
            indentItem: {
                type: 'IndentItem'
            },
            quantity: {
                type: 'Decimal'
            }
        },
        outputs: {
            quotationItem: {
                type: 'QuotationItem',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
                values: {
                    quotation: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['quotation']
                    },
                    indentItem: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['indentItem']
                    },
                    quantity: {
                        expectedReturnType: 'Decimal',
                        op: '.',
                        types: [],
                        args: ['quantity']
                    }
                }
            }
        }
    },
    createPurchaseOrder: {
        inputs: {
            quotation: {
                type: 'Quotation'
            }
        },
        outputs: {
            purchaseOrder: {
                type: 'PurchaseOrder',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
                values: {
                    quotation: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['quotation']
                    }
                }
            }
        }
    },
    createPurchaseOrderItem: {
        inputs: {
            purchaseOrder: {
                type: 'PurchaseOrder'
            },
            quotationItem: {
                type: 'QuotationItem'
            },
            quantity: {
                type: 'Number'
            },
            price: {
                type: 'Decimal'
            }
        },
        outputs: {
            purchaseOrderItem: {
                type: 'PurchaseOrderItem',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
                values: {
                    purchaseOrder: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['purchaseOrder']
                    },
                    quotationItem: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['quotationItem']
                    },
                    quantity: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['quantity']
                    },
                    price: {
                        expectedReturnType: 'Decimal',
                        op: '.',
                        types: [],
                        args: ['price']
                    },
                    received: {
                        expectedReturnType: 'Number',
                        op: 'id',
                        types: ['Number'],
                        args: [0]
                    }
                }
            }
        }
    },
    createPurchaseInvoice: {
        inputs: {
            purchaseOrder: {
                type: 'PurchaseOrder'
            }
        },
        outputs: {
            purchaseInvoice: {
                type: 'PurchaseInvoice',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
                values: {
                    purchaseOrder: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['purchaseOrder']
                    }
                }
            }
        }
    },
    createPurchaseInvoiceItem: {
        inputs: {
            purchaseInvoice: {
                type: 'PurchaseInvoice'
            },
            purchaseOrderItem: {
                type: 'PurchaseOrderItem'
            },
            quantity: {
                type: 'Number'
            }
        },
        outputs: {
            purchaseInvoiceItem: {
                type: 'PurchaseInvoiceItem',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
                values: {
                    purchaseInvoice: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['purchaseInvoice']
                    },
                    purchaseOrderItem: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['purchaseOrderItem']
                    },
                    quantity: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['quantity']
                    },
                    approved: {
                        expectedReturnType: 'Number',
                        op: 'id',
                        types: ['Number'],
                        args: [0]
                    },
                    rejected: {
                        expectedReturnType: 'Number',
                        op: 'id',
                        types: ['Number'],
                        args: [0]
                    }
                }
            }
        }
    },
    createMaterialApprovalSlip: {
        inputs: {
            purchaseInvoice: {
                type: 'PurchaseInvoice'
            }
        },
        outputs: {
            materialApprovalSlip: {
                type: 'MaterialApprovalSlip',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
                values: {
                    purchaseInvoice: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['purchaseInvoice']
                    }
                }
            }
        }
    },
    createMaterialApprovalSlipItem: {
        inputs: {
            materialApprovalSlip: {
                type: 'MaterialApprovalSlip'
            },
            purchaseInvoiceItem: {
                type: 'PurchaseInvoiceItem'
            },
            quantity: {
                type: 'Number'
            }
        },
        outputs: {
            materialApprovalSlipItem: {
                type: 'MaterialApprovalSlipItem',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
                values: {
                    materialApprovalSlip: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['materialApprovalSlip']
                    },
                    purchaseInvoiceItem: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['purchaseInvoiceItem']
                    },
                    quantity: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['quantity']
                    },
                    requisted: {
                        expectedReturnType: 'Number',
                        op: 'id',
                        types: ['Number'],
                        args: [0]
                    }
                }
            }
        }
    },
    createMaterialRejectionSlip: {
        inputs: {
            purchaseInvoice: {
                type: 'PurchaseInvoice'
            }
        },
        outputs: {
            materialRejectionSlip: {
                type: 'MaterialRejectionSlip',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
                values: {
                    purchaseInvoice: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['purchaseInvoice']
                    }
                }
            }
        }
    },
    createMaterialRejectionSlipItem: {
        inputs: {
            materialRejectionSlip: {
                type: 'MaterialRejectionSlip'
            },
            purchaseInvoiceItem: {
                type: 'PurchaseInvoiceItem'
            },
            quantity: {
                type: 'Number'
            }
        },
        outputs: {
            materialRejectionSlipItem: {
                type: 'MaterialRejectionSlipItem',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
                values: {
                    materialRejectionSlip: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['materialRejectionSlip']
                    },
                    purchaseInvoiceItem: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['purchaseInvoiceItem']
                    },
                    quantity: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['quantity']
                    },
                    returned: {
                        expectedReturnType: 'Number',
                        op: 'id',
                        types: ['Number'],
                        args: [0]
                    }
                }
            }
        }
    },
    createMaterialReturnSlip: {
        inputs: {
            materialRejectionSlip: {
                type: 'MaterialRejectionSlip'
            }
        },
        outputs: {
            materialReturnSlip: {
                type: 'MaterialReturnSlip',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
                values: {
                    materialRejectionSlip: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['materialRejectionSlip']
                    }
                }
            }
        }
    },
    createMaterialReturnSlipItem: {
        inputs: {
            materialReturnSlip: {
                type: 'MaterialReturnSlip'
            },
            materialRejectionSlipItem: {
                type: 'MaterialRejectionSlipItem'
            },
            quantity: {
                type: 'Number'
            }
        },
        outputs: {
            materialReturnSlipItem: {
                type: 'MaterialReturnSlipItem',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
                values: {
                    materialReturnSlip: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['materialReturnSlip']
                    },
                    materialRejectionSlipItem: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['materialRejectionSlipItem']
                    },
                    quantity: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['quantity']
                    }
                }
            }
        }
    },
    createMaterialRequistionSlip: {
        inputs: {
            materialApprovalSlip: {
                type: 'MaterialApprovalSlip'
            }
        },
        outputs: {
            materialRequistionSlip: {
                type: 'MaterialRequistionSlip',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
                values: {
                    materialApprovalSlip: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['materialApprovalSlip']
                    }
                }
            }
        }
    },
    createMaterialRequistionSlipItem: {
        inputs: {
            materialRequistionSlip: {
                type: 'MaterialRequistionSlip'
            },
            materialApprovalSlipItem: {
                type: 'MaterialApprovalSlipItem'
            },
            quantity: {
                type: 'Number'
            }
        },
        outputs: {
            materialRequistionSlipItem: {
                type: 'MaterialRequistionSlipItem',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
                values: {
                    materialRequistionSlip: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['materialRequistionSlip']
                    },
                    materialApprovalSlipItem: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['materialApprovalSlipItem']
                    },
                    quantity: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['quantity']
                    },
                    consumed: {
                        expectedReturnType: 'Number',
                        op: 'id',
                        types: ['Number'],
                        args: [0]
                    }
                }
            }
        }
    },
    createBOM: {
        inputs: {
            variableName: {
                type: 'Text'
            }
        },
        outputs: {
            bom: {
                type: 'BOM',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
            }
        }
    },
    createBOMItem: {
        inputs: {
            bom: {
                type: 'BOM'
            },
            product: {
                type: 'Product'
            },
            quantity: {
                type: 'Decimal'
            },
            uom: {
                type: 'UOM'
            }
        },
        outputs: {
            bomItem: {
                type: 'BOMItem',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
                values: {
                    bom: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['bom']
                    },
                    product: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['product']
                    },
                    quantity: {
                        expectedReturnType: 'Decimal',
                        op: '.',
                        types: [],
                        args: ['quantity']
                    },
                    uom: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['uom']
                    }
                }
            }
        }
    },
    createProductionPreparationSlip: {
        inputs: {
            bom: {
                type: 'BOM'
            }
        },
        outputs: {
            productionPreparationSlip: {
                type: 'ProductionPreparationSlip',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
                values: {
                    bom: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['bom']
                    },
                    approved: {
                        expectedReturnType: 'Number',
                        op: 'id',
                        types: ['Number'],
                        args: [0]
                    },
                    scrapped: {
                        expectedReturnType: 'Number',
                        op: 'id',
                        types: ['Number'],
                        args: [0]
                    }
                }
            }
        }
    },
    createProductionPreparationSlipItem: {
        inputs: {
            productionPreparationSlip: {
                type: 'ProductionPreparationSlip'
            },
            bomItem: {
                type: 'Text'
            },
            materialRequistionSlipItem: {
                type: 'MaterialRequistionSlipItem'
            }
        },
        outputs: {
            bomItem: {
                type: 'BOMItem',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
                values: {
                    productionPreparationSlip: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['productionPreparationSlip']
                    },
                    bomItem: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['bomItem']
                    },
                    materialRequistionSlipItem: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['materialRequistionSlipItem']
                    }
                }
            }
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
        outputs: {
            scrapMaterialSlip: {
                type: 'ScrapMaterialSlip',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
                values: {
                    productionPreparationSlip: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['productionPreparationSlip']
                    },
                    quantity: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['quantity']
                    }
                }
            }
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
        outputs: {
            transferMaterialSlip: {
                type: 'TransferMaterialSlip',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
                values: {
                    productionPreparationSlip: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['productionPreparationSlip']
                    },
                    quantity: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['quantity']
                    },
                    transferred: {
                        expectedReturnType: 'Number',
                        op: 'id',
                        types: ['Number'],
                        args: [0]
                    }
                }
            }
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
        outputs: {
            warehouseAcceptanceSlip: {
                type: 'WarehouseAcceptanceSlip',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'fake',
                    types: [],
                    args: ['{{datatype.uuid}}']
                },
                values: {
                    transferMaterialSlip: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['transferMaterialSlip']
                    },
                    quantity: {
                        expectedReturnType: 'Number',
                        op: '.',
                        types: [],
                        args: ['quantity']
                    }
                }
            }
        }
    }
}
