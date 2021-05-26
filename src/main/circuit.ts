import { Vector } from 'prelude-ts'
import { executeFunction } from './function'
import { FunctionName, functions } from './functions'
import { Diff, mergeDiffs } from './layers'
import { executeMapper, MapperName, mappers } from './mapper'
import { NonPrimitiveType } from './types'

type CircuitName =
    | 'createProduct'
    | 'createIndent'

export const circuits: Record<string, Circuit> = {
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
            uoms: ['c2', 'uom']
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
            items: ['c2', 'item']
        }
    }
}

type CircuitInput = {
    type: []
}
    | {
        type: 'Text'
        default?: string
    }
    | {
        type: 'Number' | 'Decimal' | 'Date' | 'Timestamp' | 'Time'
        default?: number
    }
    | {
        type: 'Boolean'
        default?: boolean
    }
    | {
        type: NonPrimitiveType
        default?: string
    }

type CircuitComputation = {
    order: number
    type: 'function'
    exec: FunctionName
    connect: Record<string, ['input', string] | ['computation', string, string]>
}
    | {
        order: number
        type: 'circuit'
        exec: CircuitName
        connect: Record<string, ['input', string] | ['computation', string, string]>
    }
    | {
        order: number
        type: 'mapper'
        exec: MapperName
        connect: {
            queryParams: Record<string, ['input', string] | ['computation', string, string]>
            args: ['input' | 'computation', string]
            overrides: Record<string, ['input', string] | ['computation', string, string]>
        }
    }

type CircuitOutput = [string, string]

export type Circuit = {
    inputs: Record<string, CircuitInput>
    computations: Record<string, CircuitComputation>
    outputs: Record<string, CircuitOutput>
}

export function executeCircuit(circuit: Circuit, args: object): [object, boolean, Diff] {
    const computationResults = {}
    var outputs = {}
    var diffs = Vector.of<Diff>()
    Object.keys(circuit.computations).forEach(computationName => {
        const computation = circuit.computations[computationName]
        switch (computation.type) {
            case 'function': {
                const fx = functions[computation.exec]
                const functionArgs = {}
                Object.keys(fx.inputs).forEach(inputName => {
                    const connection = computation.connect[inputName]
                    switch (connection[0]) {
                        case 'input': {
                            functionArgs[inputName] = args[connection[1]]
                            break
                        }
                        case 'computation': {
                            functionArgs[inputName] = computationResults[connection[1]][connection[2]]
                            break
                        }
                    }
                })
                const [result, symbolFlag, diff] = executeFunction(fx, functionArgs)
                if (!symbolFlag) {
                    return [outputs, false, mergeDiffs(diffs.toArray())]
                }
                computationResults[computationName] = result
                diffs = diffs.append(diff)
                break
            }
            case 'circuit': {
                const computationCircuit = circuits[computation.exec]
                const circuitArgs = {}
                Object.keys(computationCircuit.inputs).forEach(inputName => {
                    const connection = computation.connect[inputName]
                    switch (connection[0]) {
                        case 'input': {
                            circuitArgs[inputName] = args[connection[1]]
                            break
                        }
                        case 'computation': {
                            circuitArgs[inputName] = computationResults[connection[1]][connection[2]]
                            break
                        }
                    }
                })
                const [result, symbolFlag, diff] = executeCircuit(computationCircuit, circuitArgs)
                if (!symbolFlag) {
                    return [outputs, false, mergeDiffs(diffs.toArray())]
                }
                computationResults[computationName] = result
                diffs = diffs.append(diff)
                break
            }
            case 'mapper': {
                const mapper = mappers[computation.exec]
                const queryParams = {}
                const queryParamsConnections = computation.connect.queryParams
                Object.keys(mapper.queryParams).forEach(queryParam => {
                    const connection = queryParamsConnections[queryParam]
                    switch (connection[0]) {
                        case 'input': {
                            queryParams[queryParam] = args[connection[1]]
                            break
                        }
                        case 'computation': {
                            queryParams[queryParam] = computationResults[connection[1]][connection[2]]
                            break
                        }
                    }
                })
                var mapperArgs: Array<object> = []
                const argsConnections = computation.connect.args
                switch (argsConnections[0]) {
                    case 'input': {
                        mapperArgs = args[argsConnections[1]].map((x: object) => {
                            Object.keys(computation.connect.overrides).forEach(y => {
                                const z = computation.connect.overrides[y]
                                switch (z[0]) {
                                    case 'input': {
                                        x[y] = args[z[1]]
                                        break
                                    }
                                    case 'computation': {
                                        x[y] = computationResults[z[1]][z[2]]
                                        break
                                    }
                                }
                            })
                            return x
                        })
                        break
                    }
                    case 'computation': {
                        mapperArgs = computationResults[argsConnections[1]].map((x: object) => {
                            Object.keys(computation.connect.overrides).forEach(y => {
                                const z = computation.connect.overrides[y]
                                switch (z[0]) {
                                    case 'input': {
                                        x[y] = args[z[1]]
                                        break
                                    }
                                    case 'computation': {
                                        x[y] = computationResults[z[1]][z[2]]
                                        break
                                    }
                                }
                            })
                            return x
                        })
                        break
                    }
                }
                const [result, symbolFlag, diff] = executeMapper(mapper, { queryParams: queryParams, args: mapperArgs })
                if (!symbolFlag) {
                    return [outputs, false, mergeDiffs(diffs.toArray())]
                }
                computationResults[computationName] = result
                diffs = diffs.append(diff)
                break
            }
        }
    })
    Object.keys(circuit.outputs).forEach(outputName => {
        const output = circuit.outputs[outputName]
        if (!Array.isArray(computationResults[output[0]])) {
            outputs[outputName] = computationResults[output[0]][output[1]]
        } else {
            outputs[outputName] = computationResults[output[0]]
        }
    })
    return [outputs, true, mergeDiffs(diffs.toArray())]
}
