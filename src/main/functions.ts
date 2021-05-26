import { Function } from './function'

export type FunctionName =
    | 'createProduct'
    | 'createUOM'
    | 'createIndent'
    | 'createIndentItem'

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
    }
}
