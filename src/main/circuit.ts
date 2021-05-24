import { Vector } from 'prelude-ts'
import { executeFunction } from './function'
import { FunctionName, functions } from './functions'
import { Diff, mergeDiffs } from './layers'
import { executeMapper, MapperName, mappers } from './mapper'
import { NonPrimitiveType } from './types'

type CircuitName = 
| 'circuit1'

export const circuits: Record<string, Circuit> = {
    circuit1: {
        inputs: {
            a: {
                type: 'Number'
            },
            b: {
                type: 'Number'
            },
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
        computations: {
            c1: {
                order: 1,
                type: 'function',
                exec: 'fun1',
                connect: {
                    a: ['input', 'a'],
                    b: ['input', 'b']
                }
            },
            c2: {
                order: 2,
                type: 'function',
                exec: 'fun2',
                connect: {
                    c: ['input', 'c'],
                    d: ['input', 'd'],
                    e: ['computation', 'c1', 'f1o2']
                }
            },
            c3: {
                order: 3,
                type: 'function',
                exec: 'fun3',
                connect: {
                    p: ['input', 'e'],
                    x: ['computation', 'c1', 'f1o1'],
                    y: ['computation', 'c1', 'f1o2'],
                    z: ['computation', 'c2', 'f2o1']
                }
            },
            c4: {
                order: 3,
                type: 'function',
                exec: 'fun4',
                connect: {
                    m: ['computation', 'c3', 'f3o1'],
                    n: ['computation', 'c3', 'f3o2'],
                    o: ['computation', 'c2', 'f2o1'],
                    p: ['computation', 'c2', 'f2o2']
                }
            }
        },
        outputs: {
            m: ['c1', 'f1o2'],
            n: ['c2', 'f2o1'],
            o: ['c3', 'f3o2'],
            p: ['c4', 'f4o1'],
            q: ['c4', 'f4o2']
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
    connect: Record<string, ['input', string] | ['computation', string, string] >
}
| {
    order: number
    type: 'circuit'
    exec: CircuitName
    connect: Record<string, ['input', string] | ['computation', string, string] >
}
| {
    order: number
    type: 'mapper'
    exec: MapperName
    connect: {
        queryParams: Record<string, ['input', string] | ['computation', string, string]>
        args: ['input' | 'computation', string]
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
        switch(computation.type) {
            case 'function': {
                const fx = functions[computation.exec]
                const functionArgs = {}
                Object.keys(fx.inputs).forEach(inputName => {
                    const connection = computation.connect[inputName]
                    switch(connection[0]) {
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
                    switch(connection[0]) {
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
                    switch(connection[0]) {
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
                var mapperArgs = []
                const argsConnections = computation.connect.args
                switch(argsConnections[0]) {
                    case 'input': {
                        mapperArgs = args[argsConnections[1]]
                        break
                    }
                    case 'computation': {
                        mapperArgs = computationResults[argsConnections[1]]
                        break
                    }
                }
                const [result, symbolFlag, diff] = executeMapper(mapper, {queryParams: queryParams, args: mapperArgs})
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
        outputs[outputName] = computationResults[output[0]][output[1]]
    })
    return [outputs, true, mergeDiffs(diffs.toArray())]
}
