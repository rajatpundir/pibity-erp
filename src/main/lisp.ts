import faker from 'faker'

type NumericType = 'Number' | 'Decimal'

type NumericArg = number | LispExpression

type ComparatorType = NumericType | 'Text'

type ComparatorArg = string | NumericArg

type LogicalArg = boolean | LispExpression

type ControlFlowType = 'Number' | 'Decimal' | 'Boolean' | 'Text'

export type LispExpression = {
    expectedReturnType?: 'Number' | 'Decimal' | 'Text'
    op: '+' | '*' | '-' | '/' | '^' | '%'
    types: Array<NumericType>
    args: ReadonlyArray<NumericArg>
} | {
    expectedReturnType?: 'Boolean' | 'Text'
    op: '==' | '>' | '<' | '>=' | '<='
    types: Array<ComparatorType>
    args: ReadonlyArray<ComparatorArg>
} | {
    expectedReturnType?: 'Boolean' | 'Text'
    op: 'and' | 'or' | 'not'
    types: ['Boolean']
    args: ReadonlyArray<LogicalArg>
} | {
    expectedReturnType?: 'Number' | 'Decimal' | 'Boolean' | 'Text'
    op: 'if'
    types: Array<ControlFlowType>
    args: [boolean | LispExpression, LispExpression, LispExpression]
} | {
    expectedReturnType?: 'Number' | 'Decimal' | 'Boolean' | 'Text'
    op: 'id'
    types: [ControlFlowType]
    args: [string | number | boolean]
} | {
    expectedReturnType?: 'Text'
    op: '++'
    types: Array<ControlFlowType>
    args: ReadonlyArray<string | number | boolean | LispExpression>
} | {
    expectedReturnType?: 'Number' | 'Decimal' | 'Boolean' | 'Text'
    op: '.'
    types: []
    args: ReadonlyArray<string>
} | {
    expectedReturnType?: 'Boolean' | 'Text'
    op: 'regex'
    types: Array<ControlFlowType>
    args: ReadonlyArray<string | number | boolean | LispExpression>
} | {
    expectedReturnType?: 'Text'
    op: 'fake'
    types: []
    args: [string]
}

export type SymbolValue = {
    type: 'Text'
    value: string
    values?: Symbols
} | {
    type: 'Number' | 'Decimal'
    value: number
    values?: Symbols
} | {
    type: 'Boolean'
    value: boolean
    values?: Symbols
}

export type Symbols = { [index: string]: SymbolValue }

export function evaluateExpression(expression: LispExpression, symbols: Symbols): string | number | boolean {
    console.log(expression, symbols, '**********')
    switch (expression.op) {
        case '+': return add(expression, symbols)
        case '*': return multiply(expression, symbols)
        case '-': return subtract(expression, symbols)
        case '/': return divide(expression, symbols)
        case '^': return power(expression, symbols)
        case '%': return modulus(expression, symbols)
        case '==': return compare(expression, symbols)
        case '>': return compare(expression, symbols)
        case '<': return compare(expression, symbols)
        case '>=': return compare(expression, symbols)
        case '<=': return compare(expression, symbols)
        case 'and': return and(expression, symbols)
        case 'or': return or(expression, symbols)
        case 'not': return not(expression, symbols)
        case 'if': return ifThenElse(expression, symbols)
        case 'id': return id(expression)
        case '.': return dot(expression, symbols)
        case '++': return concat(expression, symbols)
        case 'regex': return regex(expression, symbols)
        case 'fake': return fake(expression)
        default: return "Operator not defined"
    }
}

function add(expression: LispExpression, symbols: Symbols): number | string {
    if (expression.op === '+') {
        const { expectedReturnType, types, args } = expression
        if (types.length !== 0 && args.length !== 0 && expectedReturnType !== undefined) {
            if (args.length > types.length) {
                const typeCount = types.length
                for (let i = 0; i < args.length - typeCount; i++) {
                    types.push(types[typeCount - 1])
                }
            }
            const evaluatedArgs: Array<number> = args.map((arg: NumericArg, index) => {
                const type: NumericType = types[index]
                if (typeof arg === 'object') {
                    switch (type) {
                        case 'Number': {
                            if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%' || arg.op === 'id' || arg.op === '.')
                                return parseInt(String(evaluateExpression({ ...arg, expectedReturnType: type }, symbols)))
                            else if (arg.op === 'if' && (arg.types[0] === 'Number' || arg.types[0] === 'Decimal'))
                                return parseInt(String(evaluateExpression({ ...arg, expectedReturnType: type }, symbols)))
                            else
                                return 0
                        }
                        case 'Decimal': {
                            if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%' || arg.op === 'id' || arg.op === '.')
                                return parseFloat(String(evaluateExpression({ ...arg, expectedReturnType: type }, symbols)))
                            else if (arg.op === 'if' && (arg.types[0] === 'Number' || arg.types[0] === 'Decimal'))
                                return parseFloat(String(evaluateExpression({ ...arg, expectedReturnType: type }, symbols)))
                            else
                                return 0
                        }
                        default: return 0
                    }
                } else {
                    switch (type) {
                        case 'Number': return parseInt(String(arg))
                        case 'Decimal': return parseFloat(String(arg))
                        default: return arg
                    }
                }
            })
            if (evaluatedArgs.length !== 0) {
                const result = evaluatedArgs.reduce((acc, x) => Number(acc) + Number(x), 0)
                switch (expectedReturnType) {
                    case 'Number': return parseInt(String(result))
                    case 'Decimal': return result
                    case 'Text': return String(result)
                }
            }
        }
    }
    return 0
}

function multiply(expression: LispExpression, symbols: Symbols): number | string {
    if (expression.op === '*') {
        const { expectedReturnType, types, args } = expression
        if (types.length !== 0 && args.length !== 0 && expectedReturnType !== undefined) {
            if (args.length > types.length) {
                const typeCount = types.length
                for (let i = 0; i < args.length - typeCount; i++) {
                    types.push(types[typeCount - 1])
                }
            }
            const evaluatedArgs: Array<number> = args.map((arg: NumericArg, index) => {
                const type: NumericType = types[index]
                if (typeof arg === 'object') {
                    switch (type) {
                        case 'Number': {
                            if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%' || arg.op === 'id' || arg.op === '.')
                                return parseInt(String(evaluateExpression({ ...arg, expectedReturnType: type }, symbols)))
                            else if (arg.op === 'if' && (arg.types[0] === 'Number' || arg.types[0] === 'Decimal'))
                                return parseInt(String(evaluateExpression({ ...arg, expectedReturnType: type }, symbols)))
                            else
                                return 0
                        }
                        case 'Decimal': {
                            if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%' || arg.op === 'id' || arg.op === '.')
                                return parseFloat(String(evaluateExpression({ ...arg, expectedReturnType: type }, symbols)))
                            else if (arg.op === 'if' && (arg.types[0] === 'Number' || arg.types[0] === 'Decimal'))
                                return parseFloat(String(evaluateExpression({ ...arg, expectedReturnType: type }, symbols)))
                            else
                                return 0
                        }
                        default: return 0
                    }
                } else {
                    switch (type) {
                        case 'Number': return parseInt(String(arg))
                        case 'Decimal': return parseFloat(String(arg))
                        default: return arg
                    }
                }
            })
            if (evaluatedArgs.length !== 0) {
                const result = evaluatedArgs.reduce((acc, x) => Number(acc) * Number(x), 1)
                switch (expectedReturnType) {
                    case 'Number': return parseInt(String(result))
                    case 'Decimal': return result
                    case 'Text': return String(result)
                }
            }
        }
    }
    return 0
}

function subtract(expression: LispExpression, symbols: Symbols): number | string {
    if (expression.op === '-') {
        const { expectedReturnType, types, args } = expression
        if (types.length !== 0 && args.length !== 0 && expectedReturnType !== undefined) {
            if (args.length > types.length) {
                const typeCount = types.length
                for (let i = 0; i < args.length - typeCount; i++) {
                    types.push(types[typeCount - 1])
                }
            }
            const evaluatedArgs: Array<number> = args.map((arg: NumericArg, index) => {
                const type: NumericType = types[index]
                if (typeof arg === 'object') {
                    switch (type) {
                        case 'Number': {
                            if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%' || arg.op === 'id' || arg.op === '.')
                                return parseInt(String(evaluateExpression({ ...arg, expectedReturnType: type }, symbols)))
                            else if (arg.op === 'if' && (arg.types[0] === 'Number' || arg.types[0] === 'Decimal'))
                                return parseInt(String(evaluateExpression({ ...arg, expectedReturnType: type }, symbols)))
                            else
                                return 0
                        }
                        case 'Decimal': {
                            if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%' || arg.op === 'id' || arg.op === '.')
                                return parseFloat(String(evaluateExpression({ ...arg, expectedReturnType: type }, symbols)))
                            else if (arg.op === 'if' && (arg.types[0] === 'Number' || arg.types[0] === 'Decimal'))
                                return parseFloat(String(evaluateExpression({ ...arg, expectedReturnType: type }, symbols)))
                            else
                                return 0
                        }
                        default: return 0
                    }
                } else {
                    switch (type) {
                        case 'Number': return parseInt(String(arg))
                        case 'Decimal': return parseFloat(String(arg))
                        default: return arg
                    }
                }
            })
            if (evaluatedArgs.length !== 0) {
                const initialValue = Number(evaluatedArgs.shift())
                const result = evaluatedArgs.reduce((acc, x) => Number(acc) - Number(x), initialValue)
                switch (expectedReturnType) {
                    case 'Number': return parseInt(String(result))
                    case 'Decimal': return result
                    case 'Text': return String(result)
                }
            }
        }
    }
    return 0
}

function divide(expression: LispExpression, symbols: Symbols): number | string {
    if (expression.op === '/') {
        const { expectedReturnType, types, args } = expression
        if (types.length !== 0 && args.length !== 0 && expectedReturnType !== undefined) {
            if (args.length > types.length) {
                const typeCount = types.length
                for (let i = 0; i < args.length - typeCount; i++) {
                    types.push(types[typeCount - 1])
                }
            }
            const evaluatedArgs: Array<number> = args.map((arg: NumericArg, index) => {
                const type: NumericType = types[index]
                if (typeof arg === 'object') {
                    switch (type) {
                        case 'Number': {
                            if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%' || arg.op === 'id' || arg.op === '.')
                                return parseInt(String(evaluateExpression({ ...arg, expectedReturnType: type }, symbols)))
                            else if (arg.op === 'if' && (arg.types[0] === 'Number' || arg.types[0] === 'Decimal'))
                                return parseInt(String(evaluateExpression({ ...arg, expectedReturnType: type }, symbols)))
                            else
                                return 0
                        }
                        case 'Decimal': {
                            if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%' || arg.op === 'id' || arg.op === '.')
                                return parseFloat(String(evaluateExpression({ ...arg, expectedReturnType: type }, symbols)))
                            else if (arg.op === 'if' && (arg.types[0] === 'Number' || arg.types[0] === 'Decimal'))
                                return parseFloat(String(evaluateExpression({ ...arg, expectedReturnType: type }, symbols)))
                            else
                                return 0
                        }
                        default: return 0
                    }
                } else {
                    switch (type) {
                        case 'Number': return parseInt(String(arg))
                        case 'Decimal': return parseFloat(String(arg))
                        default: return arg
                    }
                }
            })
            if (evaluatedArgs.length !== 0) {
                const initialValue = Number(evaluatedArgs.shift())
                const result = evaluatedArgs.reduce((acc, x) => Number(acc) / Number(x), initialValue)
                switch (expectedReturnType) {
                    case 'Number': return parseInt(String(result))
                    case 'Decimal': return result
                    case 'Text': return String(result)
                }
            }
        }
    }
    return 0
}

function power(expression: LispExpression, symbols: Symbols): number | string {
    if (expression.op === '^') {
        const { expectedReturnType, types, args } = expression
        if (types.length !== 0 && args.length !== 0 && expectedReturnType !== undefined) {
            if (args.length > types.length) {
                const typeCount = types.length
                for (let i = 0; i < args.length - typeCount; i++) {
                    types.push(types[typeCount - 1])
                }
            }
            const evaluatedArgs: Array<number> = args.map((arg: NumericArg, index) => {
                const type: NumericType = types[index]
                if (typeof arg === 'object') {
                    switch (type) {
                        case 'Number': {
                            if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%' || arg.op === 'id' || arg.op === '.')
                                return parseInt(String(evaluateExpression({ ...arg, expectedReturnType: type }, symbols)))
                            else if (arg.op === 'if' && (arg.types[0] === 'Number' || arg.types[0] === 'Decimal'))
                                return parseInt(String(evaluateExpression({ ...arg, expectedReturnType: type }, symbols)))
                            else
                                return 0
                        }
                        case 'Decimal': {
                            if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%' || arg.op === 'id' || arg.op === '.')
                                return parseFloat(String(evaluateExpression({ ...arg, expectedReturnType: type }, symbols)))
                            else if (arg.op === 'if' && (arg.types[0] === 'Number' || arg.types[0] === 'Decimal'))
                                return parseFloat(String(evaluateExpression({ ...arg, expectedReturnType: type }, symbols)))
                            else
                                return 0
                        }
                        default: return 0
                    }
                } else {
                    switch (type) {
                        case 'Number': return parseInt(String(arg))
                        case 'Decimal': return parseFloat(String(arg))
                        default: return arg
                    }
                }
            })
            if (evaluatedArgs.length >= 2) {
                const first = Number(evaluatedArgs.shift())
                const second = Number(evaluatedArgs.shift())
                const result = evaluatedArgs.reduce((acc, x) => Number(acc) ** Number(x), first ** second)
                switch (expectedReturnType) {
                    case 'Number': return parseInt(String(result))
                    case 'Decimal': return result
                    case 'Text': return String(result)
                }
            }
        }
    }
    return 0
}

function modulus(expression: LispExpression, symbols: Symbols): number | string {
    if (expression.op === '%') {
        const { expectedReturnType, types, args } = expression
        if (types.length !== 0 && args.length !== 0 && expectedReturnType !== undefined) {
            if (args.length > types.length) {
                const typeCount = types.length
                for (let i = 0; i < args.length - typeCount; i++) {
                    types.push(types[typeCount - 1])
                }
            }
            const evaluatedArgs: Array<number> = args.map((arg: NumericArg, index) => {
                const type: NumericType = types[index]
                if (typeof arg === 'object') {
                    switch (type) {
                        case 'Number': {
                            if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%' || arg.op === 'id' || arg.op === '.')
                                return parseInt(String(evaluateExpression({ ...arg, expectedReturnType: type }, symbols)))
                            else if (arg.op === 'if' && (arg.types[0] === 'Number' || arg.types[0] === 'Decimal'))
                                return parseInt(String(evaluateExpression({ ...arg, expectedReturnType: type }, symbols)))
                            else
                                return 0
                        }
                        case 'Decimal': {
                            if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%' || arg.op === 'id' || arg.op === '.')
                                return parseFloat(String(evaluateExpression({ ...arg, expectedReturnType: type }, symbols)))
                            else if (arg.op === 'if' && (arg.types[0] === 'Number' || arg.types[0] === 'Decimal'))
                                return parseFloat(String(evaluateExpression({ ...arg, expectedReturnType: type }, symbols)))
                            else
                                return 0
                        }
                        default: return 0
                    }
                } else {
                    switch (type) {
                        case 'Number': return parseInt(String(arg))
                        case 'Decimal': return parseFloat(String(arg))
                        default: return arg
                    }
                }
            })
            if (evaluatedArgs.length >= 2) {
                const first = Number(evaluatedArgs.shift())
                const second = Number(evaluatedArgs.shift())
                const result = evaluatedArgs.reduce((acc, x) => Number(acc) % Number(x), first % second)
                switch (expectedReturnType) {
                    case 'Number': return parseInt(String(result))
                    case 'Decimal': return result
                    case 'Text': return String(result)
                }
            }
        }
    }
    return 0
}


function compare(expression: LispExpression, symbols: Symbols): boolean | string {
    if (expression.op === '==' || expression.op === '>' || expression.op === '<' || expression.op === '>=' || expression.op === '<=') {
        const { expectedReturnType, types, args } = expression
        if (types.length !== 0 && args.length !== 0 && expectedReturnType !== undefined) {
            if (args.length > types.length) {
                const typeCount = types.length
                for (let i = 0; i < args.length - typeCount; i++) {
                    types.push(types[typeCount - 1])
                }
            }
            if (types.includes('Text')) {
                const evaluatedArgs: Array<string> = args.map((arg, index) => {
                    const type: ComparatorType = types[index]
                    if (typeof arg === 'object') {
                        switch (type) {
                            case 'Text': return String(evaluateExpression({ ...arg, expectedReturnType: type }, symbols))
                            case 'Decimal': {
                                if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%' || arg.op === 'id' || arg.op === '.')
                                    return String(Number(evaluateExpression({ ...arg, expectedReturnType: type }, symbols)))
                                else if (arg.op === 'if' && (arg.types[0] === 'Number' || arg.types[0] === 'Decimal'))
                                    return String(evaluateExpression({ ...arg, expectedReturnType: type }, symbols))
                                else return "0"
                            }
                            case 'Number': {
                                if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%' || arg.op === 'id' || arg.op === '.')
                                    return String(parseInt(String(evaluateExpression({ ...arg, expectedReturnType: type }, symbols))))
                                else if (arg.op === 'if' && (arg.types[0] === 'Number' || arg.types[0] === 'Decimal'))
                                    return String(evaluateExpression({ ...arg, expectedReturnType: type }, symbols))
                                else return "0"
                            }
                            default: return ""
                        }
                    } else {
                        return String(arg)
                    }
                })
                if (evaluatedArgs.length !== 0) {
                    const zippedWithArgs: Array<[string, string]> = evaluatedArgs.slice(0, evaluatedArgs.length - 1).map((arg, index) => {
                        return [arg, evaluatedArgs[index + 1]]
                    })
                    const result: Boolean = zippedWithArgs.reduce((acc, [x, y]) => {
                        switch (expression.op) {
                            case '==': return acc && (x === y)
                            case '>': return acc && (x > y)
                            case '<': return acc && (x < y)
                            case '>=': return acc && (x >= y)
                            case '<=': return acc && (x <= y)
                            default: return false
                        }
                    }, true)
                    switch (expectedReturnType) {
                        case 'Boolean': return result.valueOf()
                        case 'Text': return String(result.valueOf())
                    }
                }
                return false
            } else if (types.includes('Decimal')) {
                const evaluatedArgs: Array<number> = args.map((arg, index) => {
                    const type: ComparatorType = types[index]
                    if (typeof arg === 'object') {
                        switch (type) {
                            case 'Text': return parseFloat(String(evaluateExpression({ ...arg, expectedReturnType: type }, symbols)))
                            case 'Decimal': {
                                if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%' || arg.op === 'id' || arg.op === '.')
                                    return Number(evaluateExpression({ ...arg, expectedReturnType: type }, symbols))
                                else if (arg.op === 'if' && (arg.types[0] === 'Number' || arg.types[0] === 'Decimal'))
                                    return Number(evaluateExpression({ ...arg, expectedReturnType: type }, symbols))
                                else return 0
                            }
                            case 'Number': {
                                if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%' || arg.op === 'id' || arg.op === '.')
                                    return parseInt(String(evaluateExpression({ ...arg, expectedReturnType: type }, symbols)))
                                else if (arg.op === 'if' && (arg.types[0] === 'Number' || arg.types[0] === 'Decimal'))
                                    return parseInt(String(evaluateExpression({ ...arg, expectedReturnType: type }, symbols)))
                                else return 0
                            }
                            default: return 0
                        }
                    } else {
                        switch (type) {
                            case 'Text': return parseFloat(String(arg))
                            case 'Decimal': return parseFloat(String(arg))
                            case 'Number': return parseInt(String(arg))
                            default: return 0
                        }
                    }
                })
                if (evaluatedArgs.length !== 0) {
                    const zippedWithArgs: Array<[number, number]> = evaluatedArgs.slice(0, evaluatedArgs.length - 1).map((arg, index) => {
                        return [arg, evaluatedArgs[index + 1]]
                    })
                    const result: Boolean = zippedWithArgs.reduce((acc, [x, y]) => {
                        switch (expression.op) {
                            case '==': return acc && (x === y)
                            case '>': return acc && (x > y)
                            case '<': return acc && (x < y)
                            case '>=': return acc && (x >= y)
                            case '<=': return acc && (x <= y)
                            default: return false
                        }
                    }, true)
                    switch (expectedReturnType) {
                        case 'Boolean': return result.valueOf()
                        case 'Text': return String(result.valueOf())
                    }
                }
                return false
            } else {
                const evaluatedArgs: Array<number> = args.map((arg, index) => {
                    const type: ComparatorType = types[index]
                    if (typeof arg === 'object') {
                        switch (type) {
                            case 'Text': return parseInt(String(evaluateExpression({ ...arg, expectedReturnType: type }, symbols)))
                            case 'Decimal': {
                                if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%' || arg.op === 'id' || arg.op === '.')
                                    return parseInt(String(evaluateExpression({ ...arg, expectedReturnType: type }, symbols)))
                                else if (arg.op === 'if' && (arg.types[0] === 'Number' || arg.types[0] === 'Decimal'))
                                    return parseInt(String(evaluateExpression({ ...arg, expectedReturnType: type }, symbols)))
                                else return 0
                            }
                            case 'Number': {
                                if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%' || arg.op === 'id' || arg.op === '.')
                                    return parseInt(String(evaluateExpression({ ...arg, expectedReturnType: type }, symbols)))
                                else if (arg.op === 'if' && (arg.types[0] === 'Number' || arg.types[0] === 'Decimal'))
                                    return parseInt(String(evaluateExpression({ ...arg, expectedReturnType: type }, symbols)))
                                else return 0
                            }
                            default: return 0
                        }
                    } else {
                        switch (type) {
                            case 'Text': return parseInt(String(arg))
                            case 'Decimal': return parseInt(String(arg))
                            case 'Number': return parseInt(String(arg))
                            default: return 0
                        }
                    }
                })
                if (evaluatedArgs.length !== 0) {
                    const zippedWithArgs: Array<[number, number]> = evaluatedArgs.slice(0, evaluatedArgs.length - 1).map((arg, index) => {
                        return [arg, evaluatedArgs[index + 1]]
                    })
                    const result: Boolean = zippedWithArgs.reduce((acc, [x, y]) => {
                        switch (expression.op) {
                            case '==': return acc && (x === y)
                            case '>': return acc && (x > y)
                            case '<': return acc && (x < y)
                            case '>=': return acc && (x >= y)
                            case '<=': return acc && (x <= y)
                            default: return false
                        }
                    }, true)
                    switch (expectedReturnType) {
                        case 'Boolean': return result.valueOf()
                        case 'Text': return String(result.valueOf())
                    }
                }
                return false
            }
        }
        return false
    } else {
        return false
    }
}

function and(expression: LispExpression, symbols: Symbols): boolean | string {
    if (expression.op === 'and') {
        const { expectedReturnType, args } = expression
        const evaluatedArgs: Array<boolean> = args.map(arg => {
            if (typeof arg === 'object') {
                if (arg.op === '==' || arg.op === '>' || arg.op === '<' || arg.op === '>=' || arg.op === '<=' || arg.op === 'and' || arg.op === 'or' || arg.op === 'not' || arg.op === 'id' || arg.op === '.' || arg.op === 'regex')
                    return Boolean(evaluateExpression({ ...arg, expectedReturnType: 'Boolean' }, symbols)).valueOf()
                else if (arg.op === 'if' && arg.types[0] === 'Boolean')
                    return Boolean(evaluateExpression({ ...arg, expectedReturnType: 'Boolean' }, symbols))
                else
                    return false
            } else {
                return arg
            }
        })
        const result: Boolean = evaluatedArgs.reduce((acc, x) => acc && x, true)
        switch (expectedReturnType) {
            case 'Boolean': return result.valueOf()
            case 'Text': return String(result.valueOf())
            default: return true
        }
    } else {
        return false
    }
}

function or(expression: LispExpression, symbols: Symbols): boolean | string {
    if (expression.op === 'or') {
        const { expectedReturnType, args } = expression
        const evaluatedArgs: Array<boolean> = args.map(arg => {
            if (typeof arg === 'object') {
                if (arg.op === '==' || arg.op === '>' || arg.op === '<' || arg.op === '>=' || arg.op === '<=' || arg.op === 'and' || arg.op === 'or' || arg.op === 'not' || arg.op === 'id' || arg.op === '.' || arg.op === 'regex')
                    return Boolean(evaluateExpression({ ...arg, expectedReturnType: 'Boolean' }, symbols)).valueOf()
                else if (arg.op === 'if' && arg.types[0] === 'Boolean')
                    return Boolean(evaluateExpression({ ...arg, expectedReturnType: 'Boolean' }, symbols))
                else
                    return false
            } else {
                return arg
            }
        })
        const result: Boolean = evaluatedArgs.reduce((acc, x) => acc || x, false)
        switch (expectedReturnType) {
            case 'Boolean': return result.valueOf()
            case 'Text': return String(result.valueOf())
            default: return false
        }
    } else {
        return false
    }
}

function not(expression: LispExpression, symbols: Symbols): boolean | string {
    if (expression.op === 'not') {
        const { expectedReturnType, args } = expression
        const evaluatedArgs: Array<boolean> = args.map(arg => {
            if (typeof arg === 'object') {
                if (arg.op === '==' || arg.op === '>' || arg.op === '<' || arg.op === '>=' || arg.op === '<=' || arg.op === 'and' || arg.op === 'or' || arg.op === 'not' || arg.op === 'id' || arg.op === '.' || arg.op === 'regex')
                    return Boolean(evaluateExpression({ ...arg, expectedReturnType: 'Boolean' }, symbols)).valueOf()
                else if (arg.op === 'if' && arg.types[0] === 'Boolean')
                    return Boolean(evaluateExpression({ ...arg, expectedReturnType: 'Boolean' }, symbols))
                else
                    return false
            } else {
                return arg
            }
        })
        const result: Boolean = !evaluatedArgs[0]
        switch (expectedReturnType) {
            case 'Boolean': return result.valueOf()
            case 'Text': return String(result.valueOf())
            default: return false
        }
    } else {
        return false
    }
}


function ifThenElse(expression: LispExpression, symbols: Symbols): string | number | boolean {
    const { expectedReturnType, types, args } = expression
    if (expression.op === 'if' && types.length === 1 && args.length === 3 && expectedReturnType !== undefined) {
        if (typeof args[0] === 'object') {
            if (args[0].op === '==' || args[0].op === '>' || args[0].op === '<' || args[0].op === '>=' || args[0].op === '<=' || args[0].op === 'and' || args[0].op === 'or' || args[0].op === 'not' || args[0].op === 'if' || args[0].op === 'id' || args[0].op === '.' || args[0].op === 'regex') {
                const condition = Boolean(evaluateExpression({ ...args[0], expectedReturnType: 'Boolean' }, symbols)).valueOf()
                if (condition) {
                    const arg = args[1]
                    if (typeof arg === 'object') {
                        switch (types[0]) {
                            case 'Text': return String(evaluateExpression({ ...arg, expectedReturnType: types[0] }, symbols))
                            case 'Number': {
                                if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%' || arg.op === 'id' || arg.op === '.')
                                    return parseInt(String(evaluateExpression({ ...arg, expectedReturnType: types[0] }, symbols)))
                                else if (arg.op === 'if' && (arg.types[0] === 'Number' || arg.types[0] === 'Decimal'))
                                    return parseInt(String(evaluateExpression({ ...arg, expectedReturnType: types[0] }, symbols)))
                                else
                                    return 0
                            }
                            case 'Decimal': {
                                if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%' || arg.op === 'id' || arg.op === '.')
                                    return parseFloat(String(evaluateExpression({ ...arg, expectedReturnType: types[0] }, symbols)))
                                else if (arg.op === 'if' && (arg.types[0] === 'Number' || arg.types[0] === 'Decimal'))
                                    return parseFloat(String(evaluateExpression({ ...arg, expectedReturnType: types[0] }, symbols)))
                                else
                                    return 0
                            }
                            case 'Boolean': {
                                if (arg.op === '==' || arg.op === '>' || arg.op === '<' || arg.op === '>=' || arg.op === '<=' || arg.op === 'and' || arg.op === 'or' || arg.op === 'not' || arg.op === 'id' || arg.op === '.' || arg.op === 'regex')
                                    return Boolean(evaluateExpression({ ...arg, expectedReturnType: types[0] }, symbols))
                                else if (arg.op === 'if' && arg.types[0] === 'Boolean')
                                    return Boolean(evaluateExpression({ ...arg, expectedReturnType: types[0] }, symbols))
                                else
                                    return false
                            }
                        }
                    } else {
                        switch (types[0]) {
                            case 'Text': return String(arg)
                            case 'Number': return parseInt(String(arg))
                            case 'Decimal': return parseFloat(String(arg))
                            case 'Boolean': return Boolean(arg)
                        }
                    }
                } else {
                    const arg = args[2]
                    if (typeof arg === 'object') {
                        switch (types[0]) {
                            case 'Text': return String(evaluateExpression({ ...arg, expectedReturnType: types[0] }, symbols))
                            case 'Number': {
                                if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%' || arg.op === 'id' || arg.op === '.')
                                    return parseInt(String(evaluateExpression({ ...arg, expectedReturnType: types[0] }, symbols)))
                                else if (arg.op === 'if' && (arg.types[0] === 'Number' || arg.types[0] === 'Decimal'))
                                    return parseInt(String(evaluateExpression({ ...arg, expectedReturnType: types[0] }, symbols)))
                                else
                                    return 0
                            }
                            case 'Decimal': {
                                if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%' || arg.op === 'id' || arg.op === '.')
                                    return parseFloat(String(evaluateExpression({ ...arg, expectedReturnType: types[0] }, symbols)))
                                else if (arg.op === 'if' && (arg.types[0] === 'Number' || arg.types[0] === 'Decimal'))
                                    return parseFloat(String(evaluateExpression({ ...arg, expectedReturnType: types[0] }, symbols)))
                                else
                                    return 0
                            }
                            case 'Boolean': {
                                if (arg.op === '==' || arg.op === '>' || arg.op === '<' || arg.op === '>=' || arg.op === '<=' || arg.op === 'and' || arg.op === 'or' || arg.op === 'not' || arg.op === 'id' || arg.op === '.' || arg.op === 'regex')
                                    return Boolean(evaluateExpression({ ...arg, expectedReturnType: types[0] }, symbols))
                                else if (arg.op === 'if' && arg.types[0] === 'Boolean')
                                    return Boolean(evaluateExpression({ ...arg, expectedReturnType: types[0] }, symbols))
                                else
                                    return false
                            }
                        }
                    } else {
                        switch (types[0]) {
                            case 'Text': return String(arg)
                            case 'Number': return parseInt(String(arg))
                            case 'Decimal': return parseFloat(String(arg))
                            case 'Boolean': return Boolean(arg)
                        }
                    }
                }
            }
            else
                return 0
        } else {
            const condition = Boolean(args[0]).valueOf()
            if (condition) {
                const arg = args[1]
                if (typeof arg === 'object') {
                    switch (types[0]) {
                        case 'Text': return String(evaluateExpression({ ...arg, expectedReturnType: types[0] }, symbols))
                        case 'Number': {
                            if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%' || arg.op === 'id' || arg.op === '.')
                                return parseInt(String(evaluateExpression({ ...arg, expectedReturnType: types[0] }, symbols)))
                            else if (arg.op === 'if' && (arg.types[0] === 'Number' || arg.types[0] === 'Decimal'))
                                return parseInt(String(evaluateExpression({ ...arg, expectedReturnType: types[0] }, symbols)))
                            else
                                return 0
                        }
                        case 'Decimal': {
                            if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%' || arg.op === 'id' || arg.op === '.')
                                return parseFloat(String(evaluateExpression({ ...arg, expectedReturnType: types[0] }, symbols)))
                            else if (arg.op === 'if' && (arg.types[0] === 'Number' || arg.types[0] === 'Decimal'))
                                return parseFloat(String(evaluateExpression({ ...arg, expectedReturnType: types[0] }, symbols)))
                            else
                                return 0
                        }
                        case 'Boolean': {
                            if (arg.op === '==' || arg.op === '>' || arg.op === '<' || arg.op === '>=' || arg.op === '<=' || arg.op === 'and' || arg.op === 'or' || arg.op === 'not' || arg.op === 'id' || arg.op === '.' || arg.op === 'regex')
                                return Boolean(evaluateExpression({ ...arg, expectedReturnType: types[0] }, symbols))
                            else if (arg.op === 'if' && arg.types[0] === 'Boolean')
                                return Boolean(evaluateExpression({ ...arg, expectedReturnType: types[0] }, symbols))
                            else
                                return false
                        }
                    }
                } else {
                    switch (types[0]) {
                        case 'Text': return String(arg)
                        case 'Number': return parseInt(String(arg))
                        case 'Decimal': return parseFloat(String(arg))
                        case 'Boolean': return Boolean(arg)
                    }
                }
            } else {
                const arg = args[2]
                if (typeof arg === 'object') {
                    switch (types[0]) {
                        case 'Text': return String(evaluateExpression({ ...arg, expectedReturnType: types[0] }, symbols))
                        case 'Number': {
                            if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%' || arg.op === 'id' || arg.op === '.')
                                return parseInt(String(evaluateExpression({ ...arg, expectedReturnType: types[0] }, symbols)))
                            else if (arg.op === 'if' && (arg.types[0] === 'Number' || arg.types[0] === 'Decimal'))
                                return parseInt(String(evaluateExpression({ ...arg, expectedReturnType: types[0] }, symbols)))
                            else
                                return 0
                        }
                        case 'Decimal': {
                            if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%' || arg.op === 'id' || arg.op === '.')
                                return parseFloat(String(evaluateExpression({ ...arg, expectedReturnType: types[0] }, symbols)))
                            else if (arg.op === 'if' && (arg.types[0] === 'Number' || arg.types[0] === 'Decimal'))
                                return parseFloat(String(evaluateExpression({ ...arg, expectedReturnType: types[0] }, symbols)))
                            else
                                return 0
                        }
                        case 'Boolean': {
                            if (arg.op === '==' || arg.op === '>' || arg.op === '<' || arg.op === '>=' || arg.op === '<=' || arg.op === 'and' || arg.op === 'or' || arg.op === 'not' || arg.op === 'id' || arg.op === '.' || arg.op === 'regex')
                                return Boolean(evaluateExpression({ ...arg, expectedReturnType: types[0] }, symbols))
                            else if (arg.op === 'if' && arg.types[0] === 'Boolean')
                                return Boolean(evaluateExpression({ ...arg, expectedReturnType: types[0] }, symbols))
                            else
                                return false
                        }
                    }
                } else {
                    switch (types[0]) {
                        case 'Text': return String(arg)
                        case 'Number': return parseInt(String(arg))
                        case 'Decimal': return parseFloat(String(arg))
                        case 'Boolean': return Boolean(arg)
                    }
                }
            }
        }
    } else {
        return 0
    }
}

function id(expression: LispExpression): string | number | boolean {
    if (expression.op === 'id' && expression.types.length === 1 && expression.args.length === 1 && expression.expectedReturnType !== undefined) {
        const { expectedReturnType, types, args } = expression
        const type = types[0]
        const arg = args[0]
        switch (expectedReturnType) {
            case 'Text': {
                switch (type) {
                    case 'Text': return String(arg)
                    case 'Number': return String(parseInt(String(arg)))
                    case 'Decimal': return String(parseFloat(String(arg)))
                    case 'Boolean': return String(Boolean(arg).valueOf())
                    default: return ""
                }
            }
            case 'Number': {
                switch (type) {
                    case 'Text': return parseInt(String(arg))
                    case 'Number': return parseInt(String(arg))
                    case 'Decimal': return parseInt(String(arg))
                    case 'Boolean': return parseInt(String(Boolean(arg).valueOf()))
                    default: return 0
                }
            }
            case 'Decimal': {
                switch (type) {
                    case 'Text': return parseFloat(String(arg))
                    case 'Number': return parseFloat(String(parseInt(String(arg))))
                    case 'Decimal': return parseFloat(String(arg))
                    case 'Boolean': return parseFloat(String(Boolean(arg).valueOf()))
                    default: return 0
                }
            }
            case 'Boolean': {
                switch (type) {
                    case 'Text': return Boolean(String(arg)).valueOf()
                    case 'Number': return Boolean(parseInt(String(arg))).valueOf()
                    case 'Decimal': return Boolean(parseFloat(String(arg))).valueOf()
                    case 'Boolean': return Boolean(arg).valueOf()
                    default: return false
                }
            }
            default: return 0
        }
    }
    else
        return 0
}

function dot(expression: LispExpression, symbols: Symbols): string | number | boolean {
    if (expression.op === '.' && expression.args.length >= 1 && expression.expectedReturnType !== undefined) {
        const { expectedReturnType, args } = expression
        if (args.length === 1) {
            const symbol = args[0]
            switch (expectedReturnType) {
                case 'Text': {
                    if (symbol in symbols)
                        return String(symbols[symbol].value)
                    else
                        return ""
                }
                case 'Number': {
                    if (symbol in symbols)
                        return parseInt(String(symbols[symbol].value))
                    else
                        return 0
                }
                case 'Decimal': {
                    if (symbol in symbols)
                        return parseFloat(String(symbols[symbol].value))
                    else
                        return 0
                }
                case 'Boolean': {
                    if (symbol in symbols)
                        return Boolean(symbols[symbol].value).valueOf()
                    else
                        return false
                }
            }
        } else {
            const symbol = args[0]
            switch (expectedReturnType) {
                case 'Text': {
                    if (symbol in symbols) {
                        const values = symbols[symbol].values
                        if (values !== undefined)
                            return dot({ ...expression, args: args.slice(1) }, values)
                        else
                            return ""
                    }
                    else
                        return ""
                }
                case 'Number': {
                    if (symbol in symbols) {
                        const values = symbols[symbol].values
                        if (values !== undefined)
                            return dot({ ...expression, args: args.slice(1) }, values)
                        else
                            return 0
                    }
                    else
                        return 0
                }
                case 'Decimal': {
                    if (symbol in symbols) {
                        const values = symbols[symbol].values
                        if (values !== undefined)
                            return dot({ ...expression, args: args.slice(1) }, values)
                        else
                            return 0
                    }
                    else
                        return 0
                }
                case 'Boolean': {
                    if (symbol in symbols) {
                        const values = symbols[symbol].values
                        if (values !== undefined)
                            return dot({ ...expression, args: args.slice(1) }, values)
                        else
                            return false
                    }
                    else
                        return false
                }
            }
        }
    }
    return 0
}

function concat(expression: LispExpression, symbols: Symbols): string {
    if (expression.op === '++' && expression.expectedReturnType !== undefined) {
        const { types, args } = expression
        if (args.length > types.length) {
            const typeCount = types.length
            for (let i = 0; i < args.length - typeCount; i++) {
                types.push(types[typeCount - 1])
            }
        }
        const evaluatedArgs: Array<string> = args.map((arg, index) => {
            const type = types[index]
            if (typeof arg === 'object') {
                return String(evaluateExpression({ ...arg, expectedReturnType: 'Text' }, symbols))
            } else {
                switch (type) {
                    case 'Text': return String(arg)
                    case 'Number': return String(parseInt(String(arg)))
                    case 'Decimal': return String(parseFloat(String(arg)))
                    case 'Boolean': return String(Boolean(arg).valueOf())
                    default: return ""
                }
            }
        })
        return evaluatedArgs.reduce((acc, x) => acc + x, "")
    }
    else
        return ""
}

function regex(expression: LispExpression, symbols: Symbols): boolean | string {
    if (expression.op === 'regex' && expression.expectedReturnType !== undefined) {
        const { expectedReturnType, types, args } = expression
        if (args.length > types.length) {
            const typeCount = types.length
            for (let i = 0; i < args.length - typeCount; i++) {
                types.push(types[typeCount - 1])
            }
        }
        const evaluatedArgs: Array<string> = args.map((arg, index) => {
            const type = types[index]
            if (typeof arg === 'object') {
                return String(evaluateExpression({ ...arg, expectedReturnType: 'Text' }, symbols))
            } else {
                switch (type) {
                    case 'Text': return String(arg)
                    case 'Number': return String(parseInt(String(arg)))
                    case 'Decimal': return String(parseFloat(String(arg)))
                    case 'Boolean': return String(Boolean(arg).valueOf())
                    default: return ""
                }
            }
        })
        if (evaluatedArgs.length !== 0) {
            const pattern = RegExp(evaluatedArgs[0])
            const result = evaluatedArgs.slice(1).reduce((acc: boolean, x) => acc && pattern.test(x), true)
            switch (expectedReturnType) {
                case 'Boolean': return result.valueOf()
                case 'Text': return String(result.valueOf())
                default: return false
            }
        } else
            return false
    }
    else
        return false
}

function fake(expression: LispExpression): string {
    if (expression.op === 'fake')
        return faker.fake(expression.args[0])
    else
        return ""
}
