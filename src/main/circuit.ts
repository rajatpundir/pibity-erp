import { Vector } from "prelude-ts"
import { executeFunction } from "./function"
import { FunctionName, functions } from "./functions"
import { Diff, mergeDiffs } from "./layers"
import { executeMapper, MapperName, mappers } from "./mapper"
import { NonPrimitiveType } from "./types"

type CircuitName = 
| 'circuit1'

export const circuits: Record<string, Circuit> = {

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

function executeCircuit(circuit: Circuit, args: object): [object, boolean, Diff] {
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
