import { Function } from './function'

export type FunctionName =
    | 'createProduct'
    | 'deleteProduct'

    | 'createUOM'
    | 'deleteUOM'

    | 'createSupplier'
    | 'deleteSupplier'

    | 'createIndent'
    | 'deleteIndent'

    | 'createIndentItem'
    | 'deleteIndentItem'

    | 'createQuotation'
    | 'deleteQuotation'

    | 'createQuotationItem'
    | 'deleteQuotationItem'

    | 'createPurchaseOrder'
    | 'deletePurchaseOrder'

    | 'createPurchaseOrderItem'
    | 'deletePurchaseOrderItem'

    | 'createPurchaseInvoice'
    | 'deletePurchaseInvoice'

    | 'createPurchaseInvoiceItem'
    | 'deletePurchaseInvoiceItem'

    | 'createMaterialApprovalSlip'
    | 'deleteMaterialApprovalSlip'

    | 'createMaterialApprovalSlipItem'
    | 'deleteMaterialApprovalSlipItem'

    | 'createMaterialRejectionSlip'
    | 'deleteMaterialRejectionSlip'

    | 'createMaterialRejectionSlipItem'
    | 'deleteMaterialRejectionSlipItem'

    | 'createMaterialReturnSlip'
    | 'deleteMaterialReturnSlip'

    | 'createMaterialReturnSlipItem'
    | 'deleteMaterialReturnSlipItem'

    | 'createMaterialRequistionSlip'
    | 'deleteMaterialRequistionSlip'

    | 'createMaterialRequistionSlipItem'
    | 'deleteMaterialRequistionSlipItem'

    | 'createBOM'
    | 'deleteBOM'

    | 'createBOMItem'
    | 'deleteBOMItem'

    | 'createProductionPreparationSlip'
    | 'deleteProductionPreparationSlip'

    | 'createProductionPreparationSlipItem'
    | 'deleteProductionPreparationSlipItem'

    | 'createScrapMaterialSlip'
    | 'deleteScrapMaterialSlip'

    | 'createTransferMaterialSlip'
    | 'deleteTransferMaterialSlip'

    | 'createWarehouseAcceptanceSlip'
    | 'deleteWarehouseAcceptanceSlip'

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
    deleteProduct: {
        inputs: {
            variableName: {
                type: 'Product'
            }
        },
        outputs: {
            product: {
                type: 'Product',
                op: 'delete',
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
    deleteUOM: {
        inputs: {
            variableName: {
                type: 'UOM'
            }
        },
        outputs: {
            uom: {
                type: 'UOM',
                op: 'delete',
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
    deleteSupplier: {
        inputs: {
            variableName: {
                type: 'Supplier'
            }
        },
        outputs: {
            supplier: {
                type: 'Supplier',
                op: 'delete',
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
    deleteIndent: {
        inputs: {
            variableName: {
                type: 'Indent'
            }
        },
        outputs: {
            indent: {
                type: 'Indent',
                op: 'delete',
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
    deleteIndentItem: {
        inputs: {
            variableName: {
                type: 'IndentItem'
            }
        },
        outputs: {
            indentItem: {
                type: 'IndentItem',
                op: 'delete',
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
    deleteQuotation: {
        inputs: {
            variableName: {
                type: 'Quotation'
            }
        },
        outputs: {
            quotation: {
                type: 'Quotation',
                op: 'delete',
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
    deleteQuotationItem: {
        inputs: {
            variableName: {
                type: 'QuotationItem'
            }
        },
        outputs: {
            quotationItem: {
                type: 'QuotationItem',
                op: 'delete',
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
    deletePurchaseOrder: {
        inputs: {
            variableName: {
                type: 'PurchaseOrder'
            }
        },
        outputs: {
            purchaseOrder: {
                type: 'PurchaseOrder',
                op: 'delete',
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
    deletePurchaseOrderItem: {
        inputs: {
            variableName: {
                type: 'PurchaseOrderItem'
            }
        },
        outputs: {
            purchaseOrderItem: {
                type: 'PurchaseOrderItem',
                op: 'delete',
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
    deletePurchaseInvoice: {
        inputs: {
            variableName: {
                type: 'PurchaseInvoice'
            }
        },
        outputs: {
            purchaseInvoice: {
                type: 'PurchaseInvoice',
                op: 'delete',
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
    deletePurchaseInvoiceItem: {
        inputs: {
            variableName: {
                type: 'PurchaseInvoiceItem'
            }
        },
        outputs: {
            purchaseInvoiceItem: {
                type: 'PurchaseInvoiceItem',
                op: 'delete',
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
    deleteMaterialApprovalSlip: {
        inputs: {
            variableName: {
                type: 'MaterialApprovalSlip'
            }
        },
        outputs: {
            materialApprovalSlip: {
                type: 'MaterialApprovalSlip',
                op: 'delete',
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
    deleteMaterialApprovalSlipItem: {
        inputs: {
            variableName: {
                type: 'MaterialApprovalSlipItem'
            }
        },
        outputs: {
            materialApprovalSlipItem: {
                type: 'MaterialApprovalSlipItem',
                op: 'delete',
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
    deleteMaterialRejectionSlip: {
        inputs: {
            variableName: {
                type: 'MaterialRejectionSlip'
            }
        },
        outputs: {
            materialRejectionSlip: {
                type: 'MaterialRejectionSlip',
                op: 'delete',
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
    deleteMaterialRejectionSlipItem: {
        inputs: {
            variableName: {
                type: 'MaterialRejectionSlipItem'
            }
        },
        outputs: {
            materialRejectionSlipItem: {
                type: 'MaterialRejectionSlipItem',
                op: 'delete',
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
    deleteMaterialReturnSlip: {
        inputs: {
            variableName: {
                type: 'MaterialReturnSlip'
            }
        },
        outputs: {
            materialReturnSlip: {
                type: 'MaterialReturnSlip',
                op: 'delete',
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
    deleteMaterialReturnSlipItem: {
        inputs: {
            variableName: {
                type: 'MaterialReturnSlipItem'
            }
        },
        outputs: {
            materialReturnSlipItem: {
                type: 'MaterialReturnSlipItem',
                op: 'delete',
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
    deleteMaterialRequistionSlip: {
        inputs: {
            variableName: {
                type: 'MaterialRequistionSlip'
            }
        },
        outputs: {
            materialRequistionSlip: {
                type: 'MaterialRequistionSlip',
                op: 'delete',
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
    deleteMaterialRequistionSlipItem: {
        inputs: {
            variableName: {
                type: 'MaterialRequistionSlipItem'
            }
        },
        outputs: {
            materialRequistionSlipItem: {
                type: 'MaterialRequistionSlipItem',
                op: 'delete',
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
    deleteBOM: {
        inputs: {
            variableName: {
                type: 'BOM'
            }
        },
        outputs: {
            bom: {
                type: 'BOM',
                op: 'delete',
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
    deleteBOMItem: {
        inputs: {
            variableName: {
                type: 'BOMItem'
            }
        },
        outputs: {
            bomItem: {
                type: 'BOMItem',
                op: 'delete',
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
    deleteProductionPreparationSlip: {
        inputs: {
            variableName: {
                type: 'ProductionPreparationSlip'
            }
        },
        outputs: {
            productionPreparationSlip: {
                type: 'ProductionPreparationSlip',
                op: 'delete',
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
                type: 'ProductionPreparationSlipItem',
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
    deleteProductionPreparationSlipItem: {
        inputs: {
            variableName: {
                type: 'ProductionPreparationSlipItem'
            }
        },
        outputs: {
            productionPreparationSlipItem: {
                type: 'ProductionPreparationSlipItem',
                op: 'delete',
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
    deleteScrapMaterialSlip: {
        inputs: {
            variableName: {
                type: 'ScrapMaterialSlip'
            }
        },
        outputs: {
            scrapMaterialSlip: {
                type: 'ScrapMaterialSlip',
                op: 'delete',
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
    deleteTransferMaterialSlip: {
        inputs: {
            variableName: {
                type: 'TransferMaterialSlip'
            }
        },
        outputs: {
            transferMaterialSlip: {
                type: 'TransferMaterialSlip',
                op: 'delete',
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
    },
    deleteWarehouseAcceptanceSlip: {
        inputs: {
            variableName: {
                type: 'WarehouseAcceptanceSlip'
            }
        },
        outputs: {
            warehouseAcceptanceSlip: {
                type: 'WarehouseAcceptanceSlip',
                op: 'delete',
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['variableName']
                },
                values: {}
            }
        }
    }
}
