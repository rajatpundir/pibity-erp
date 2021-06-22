import { Vector } from 'prelude-ts'
import { CircuitName, circuits } from './circuits'
import { executeFunction } from './function'
import { FunctionName, functions } from './functions'
import { DiffVariable, mergeDiffs } from './layers'
import { executeMapper, MapperName, mappers } from './mapper'
import { NonPrimitiveType } from './types'

type CircuitInput =
    | {
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

export async function executeCircuit(circuit: Circuit, args: object, overlay: Vector<DiffVariable> = Vector.of()): Promise<[object, boolean, DiffVariable]> {
    const computationResults = {}
    var outputs = {}
    var diffs = Vector.of<DiffVariable>()
    for (const computationName in circuit.computations) {
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
                        default: {
                            const _exhaustiveCheck: never = connection;
                            return _exhaustiveCheck;
                        }
                    }
                })
                const [result, symbolFlag, diff] = await executeFunction(fx, functionArgs, overlay.appendAll(diffs))
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
                        default: {
                            const _exhaustiveCheck: never = connection;
                            return _exhaustiveCheck;
                        }
                    }
                })
                const [result, symbolFlag, diff] = await executeCircuit(computationCircuit, circuitArgs, overlay.appendAll(diffs))
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
                for (const queryParam of mapper.queryParams) {
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
                        default: {
                            const _exhaustiveCheck: never = connection;
                            return _exhaustiveCheck;
                        }
                    }
                }
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
                                        if (typeof computationResults[z[1]][z[2]] === 'object')
                                            x[y] = computationResults[z[1]][z[2]]['variableName']
                                        else
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
                                        if (typeof computationResults[z[1]][z[2]] === 'object')
                                            x[y] = computationResults[z[1]][z[2]]['variableName']
                                        else
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
                const [result, symbolFlag, diff] = await executeMapper(mapper, { queryParams: queryParams, args: mapperArgs }, overlay.appendAll(diffs))
                if (!symbolFlag) {
                    return [outputs, false, mergeDiffs(diffs.toArray())]
                }
                computationResults[computationName] = result
                diffs = diffs.append(diff)
                break
            }
        }
        Object.keys(circuit.outputs).forEach(outputName => {
            const output = circuit.outputs[outputName]
            if (computationName === output[0]) {
                if (!Array.isArray(computationResults[computationName])) {
                    outputs[outputName] = computationResults[computationName][output[1]]
                } else {
                    outputs[outputName] = computationResults[computationName]
                }
            }
        })
    }
    return [outputs, true, mergeDiffs(diffs.toArray())]
}
