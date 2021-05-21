import { Function } from './function'

export type FunctionName =
    | 'createProduct'
    | 'updateProduct'
    | 'deleteProduct'
    | 'mapProduct'
    | 'fun1'
    | 'fun2'
    | 'fun3'
    | 'fun4'

export const functions: Record<FunctionName, Function> = {
    fun1: {
        inputs: {
            a: {
                type: 'Number'
            },
            b: {
                type: 'Number'
            }
        },
        outputs: {
            f1o1: {
                type: 'Number',
                value: {
                    expectedReturnType: 'Number',
                    op: '+',
                    types: ['Number'],
                    args: [
                        {
                            op: '.',
                            types: [],
                            args: [ 'a']
                        },
                        {
                            op: '.',
                            types: [],
                            args: ['b']
                        }
                    ]
                }
            },
            f1o2: {
                type: 'Number',
                value: {
                    expectedReturnType: 'Number',
                    op: '*',
                    types: ['Number'],
                    args: [
                        {
                            op: '.',
                            types: [],
                            args: [ 'a']
                        },
                        {
                            op: '.',
                            types: [],
                            args: ['b']
                        }
                    ]
                }
            }
        }
    },
    fun2: {
        inputs: {
            c: {
                type: 'Number'
            },
            d: {
                type: 'Number'
            },
            e: {
                type: 'Number'
            }
        },
        outputs: {
            f2o1: {
                type: 'Number',
                value: {
                    expectedReturnType: 'Number',
                    op: '*',
                    types: ['Number'],
                    args: [
                        {
                            op: '.',
                            types: [],
                            args: [ 'c']
                        },
                        {
                            op: '.',
                            types: [],
                            args: ['d']
                        },
                        {
                            op: '.',
                            types: [],
                            args: ['e']
                        }
                    ]
                }
            },
            f2o2: {
                type: 'Number',
                value: {
                    expectedReturnType: 'Number',
                    op: '*',
                    types: ['Number'],
                    args: [
                        {
                            op: '.',
                            types: [],
                            args: [ 'c']
                        },
                        {
                            op: '.',
                            types: [],
                            args: ['d']
                        }
                    ]
                }
            }
        }
    },
    fun3: {
        inputs: {
            p: {
                type: 'Number'
            },
            x: {
                type: 'Number'
            },
            y: {
                type: 'Number'
            },
            z: {
                type: 'Number'
            }
        },
        outputs: {
            f3o1: {
                type: 'Number',
                value: {
                    expectedReturnType: 'Number',
                    op: '*',
                    types: ['Number'],
                    args: [
                        {
                            op: '.',
                            types: [],
                            args: [ 'x']
                        },
                        {
                            op: '.',
                            types: [],
                            args: ['p']
                        }
                    ]
                }
            },
            f3o2: {
                type: 'Number',
                value: {
                    expectedReturnType: 'Number',
                    op: '+',
                    types: ['Number'],
                    args: [
                        {
                            op: '.',
                            types: [],
                            args: [ 'p']
                        },
                        {
                            op: '.',
                            types: [],
                            args: ['x']
                        },
                        {
                            op: '.',
                            types: [],
                            args: ['y']
                        },
                        {
                            op: '.',
                            types: [],
                            args: ['z']
                        }
                    ]
                }
            }
        }
    },
    fun4: {
        inputs: {
            m: {
                type: 'Number'
            },
            n: {
                type: 'Number'
            },
            o: {
                type: 'Number'
            },
            p: {
                type: 'Number'
            }
        },
        outputs: {
            f4o1: {
                type: 'Number',
                value: {
                    expectedReturnType: 'Number',
                    op: '+',
                    types: ['Number'],
                    args: [
                        {
                            op: '.',
                            types: [],
                            args: [ 'm']
                        },
                        {
                            op: '.',
                            types: [],
                            args: ['n']
                        },
                        {
                            op: '.',
                            types: [],
                            args: ['o']
                        }
                    ]
                }
            },
            f4o2: {
                type: 'Number',
                value: {
                    expectedReturnType: 'Number',
                    op: '+',
                    types: ['Number'],
                    args: [
                        {
                            op: '.',
                            types: [],
                            args: [ 'o']
                        },
                        {
                            op: '.',
                            types: [],
                            args: ['n']
                        },
                        {
                            op: '.',
                            types: [],
                            args: ['o']
                        }
                    ]
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
    },
    deleteProduct: {
        inputs: {
            sku: {
                type: 'Text'
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
                    args: ['sku']
                },
                values: {}
            }
        }
    },
    mapProduct: {
        inputs: {
            abc: {
                type: 'Text',
                default: 'whatever'
            },
            product: {
                type: 'Product',
                variableName: {
                    expectedReturnType: 'Text',
                    op: '++',
                    types: ['Text'],
                    args: [{
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['product']
                    }, '+']
                },
                values: {
                    name: {
                        expectedReturnType: 'Text',
                        op: '.',
                        types: [],
                        args: ['abc']
                    }
                }
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
                    args: ['product']
                },
                values: {}
            }
        }
    }
}
