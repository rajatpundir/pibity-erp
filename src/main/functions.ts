import { Function } from './function'

export const functions: Record<string, Function> = {
    add: {
        inputs: {
            a: {
                type: 'Number',
                default: 2
            },
            b: {
                type: 'Decimal',
                default: 3.14
            }
        },
        outputs: {
            c: {
                type: 'Number',
                value: {
                    expectedReturnType: 'Number',
                    op: '+',
                    types: ['Number', 'Decimal'],
                    args: [{
                        op: '.',
                        types: [],
                        args: ['a']
                    }, {
                        op: '.',
                        types: [],
                        args: ['b']
                    }]
                }
            },
            d: {
                type: 'Decimal',
                value: {
                    expectedReturnType: 'Decimal',
                    op: '*',
                    types: ['Number', 'Decimal'],
                    args: [{
                        op: '.',
                        types: [],
                        args: ['a']
                    }, {
                        op: '.',
                        types: [],
                        args: ['b']
                    }]
                }
            }
        }
    },
    createProduct: {
        inputs: {
            sku: {
                type: 'Text'
            },
            name: {
                type: 'Text'
            },
            x: {
                type: 'Boolean'
            },
            y: {
                type: 'Boolean'
            },
            z: {
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
                    args: ['sku']
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
                        args: ['x']
                    },
                    consumable: {
                        expectedReturnType: 'Boolean',
                        op: '.',
                        types: [],
                        args: ['y']
                    },
                    producable: {
                        expectedReturnType: 'Boolean',
                        op: '.',
                        types: [],
                        args: ['z']
                    },
                }
            }
        }
    },
    updateProduct: {
        inputs: {
            sku: {
                type: 'Text'
            },
            name: {
                type: 'Text'
            },
            x: {
                type: 'Boolean'
            },
            y: {
                type: 'Boolean'
            },
            z: {
                type: 'Boolean'
            }
        },
        outputs: {
            product: {
                type: 'Product',
                op: 'update',
                variableName: {
                    expectedReturnType: 'Text',
                    op: '.',
                    types: [],
                    args: ['sku']
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
                        args: ['x']
                    },
                    consumable: {
                        expectedReturnType: 'Boolean',
                        op: '.',
                        types: [],
                        args: ['y']
                    },
                    producable: {
                        expectedReturnType: 'Boolean',
                        op: '.',
                        types: [],
                        args: ['z']
                    },
                }
            }
        }
    }
}
