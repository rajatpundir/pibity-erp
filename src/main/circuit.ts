import { Vector } from "prelude-ts"
import { executeFunction } from "./function"
import { FunctionName, functions } from "./functions"
import { Diff, mergeDiffs } from "./layers"
import { MapperName, mappers } from "./mapper"
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

type CircuitOutput = Record<string, [string, string]>

export type Circuit = {
    inputs: Record<string, CircuitInput>
    computations: Record<string, CircuitComputation>
    outputs: Record<string, CircuitOutput>
}

function executeCircuit(circuit: Circuit, args: object) {
    const computationResults = {}
    var outputs = {}
    var diffs = Vector.of<Diff>()
    Object.keys(circuit.computations).forEach(computationName => {
        const computation = circuit.computations[computationName]
        switch(computation.type) {
            case 'function': {
                const fx = functions[computation.exec]
                const functionArgs = {}
                Object.keys(computation.connect).forEach(connectionName => {
                    const connection = computation.connect[connectionName]
                    switch(connection[0]) {
                        case 'input': {
                            functionArgs[connectionName] = args[connection[1]]
                            break
                        }
                        case 'computation': {
                            functionArgs[connectionName] = computationResults[connection[1]][connection[2]]
                            break
                        }
                    }
                })
                const [functionResult, symbolFlag, diff] = executeFunction(fx, functionArgs)
                if (!symbolFlag) {
                    return [outputs, false, mergeDiffs(diffs.toArray())]
                }
                computationResults[computationName] = functionResult
                diffs = diffs.append(diff)
                break
            }
            case 'mapper': {
                const mapper = mappers[computation.exec]
                break
            }
            case 'circuit': {
                const computationCircuit = circuits[computation.exec]
                break
            }
        }
    })
}
