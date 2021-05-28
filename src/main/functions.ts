import { Function } from './function'

export type FunctionName =
    | 'createProduct'
    | 'createUOM'
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
                    op: '.',
                    types: [],
                    args: ['']
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
    createIndent: {
        inputs: {},
        outputs: {
            product: {
                type: 'Indent',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'id',
                    types: ['Text'],
                    args: ['']
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
            uom: {
                type: 'IndentItem',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['']
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
                    op: 'id',
                    types: ['Text'],
                    args: ['']
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
                    op: 'id',
                    types: ['Text'],
                    args: ['']
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
                    op: 'id',
                    types: ['Text'],
                    args: ['']
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
    createPurchaseOrderItem: {
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
                    op: 'id',
                    types: ['Text'],
                    args: ['']
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
                    op: 'id',
                    types: ['Text'],
                    args: ['']
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
                type: 'Decimal'
            },
            approved: {
                type: 'Decimal'
            },
            rejected: {
                type: 'Decimal'
            }
        },
        outputs: {
            purchaseInvoiceItem: {
                type: 'PurchaseInvoiceItem',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'id',
                    types: ['Text'],
                    args: ['']
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
                        expectedReturnType: 'Decimal',
                        op: '.',
                        types: [],
                        args: ['quantity']
                    },
                    approved: {
                        expectedReturnType: 'Decimal',
                        op: '.',
                        types: [],
                        args: ['approved']
                    },
                    rejected: {
                        expectedReturnType: 'Decimal',
                        op: '.',
                        types: [],
                        args: ['rejected']
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
            MaterialApprovalSlip: {
                type: 'MaterialApprovalSlip',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'id',
                    types: ['Text'],
                    args: ['']
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
            MaterialApprovalSlip: {
                type: 'MaterialApprovalSlip'
            },
            purchaseInvoiceItem: {
                type: 'PurchaseInvoiceItem'
            },
            quantity: {
                type: 'Decimal'
            },
            requisted: {
                type: 'Decimal'
            }
        },
        outputs: {
            MaterialApprovalSlipItem: {
                type: 'MaterialApprovalSlipItem',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'id',
                    types: ['Text'],
                    args: ['']
                },
                values: {
                    MaterialApprovalSlip: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['MaterialApprovalSlip']
                    },
                    purchaseInvoiceItem: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['purchaseInvoiceItem']
                    },
                    quantity: {
                        expectedReturnType: 'Decimal',
                        op: '.',
                        types: [],
                        args: ['quantity']
                    },
                    requisted: {
                        expectedReturnType: 'Decimal',
                        op: '.',
                        types: [],
                        args: ['approved']
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
            MaterialRejectionSlip: {
                type: 'MaterialRejectionSlip',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'id',
                    types: ['Text'],
                    args: ['']
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
            MaterialRejectionSlip: {
                type: 'MaterialRejectionSlip'
            },
            purchaseInvoiceItem: {
                type: 'PurchaseInvoiceItem'
            },
            quantity: {
                type: 'Decimal'
            },
            returned: {
                type: 'Decimal'
            }
        },
        outputs: {
            MaterialRejectionSlipItem: {
                type: 'MaterialRejectionSlipItem',
                op: 'create',
                variableName: {
                    expectedReturnType: 'Text',
                    op: 'id',
                    types: ['Text'],
                    args: ['']
                },
                values: {
                    MaterialRejectionSlip: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['MaterialRejectionSlip']
                    },
                    purchaseInvoiceItem: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['purchaseInvoiceItem']
                    },
                    quantity: {
                        expectedReturnType: 'Decimal',
                        op: '.',
                        types: [],
                        args: ['quantity']
                    },
                    returned: {
                        expectedReturnType: 'Decimal',
                        op: '.',
                        types: [],
                        args: ['approved']
                    }
                }
            }
        }
    }
}
