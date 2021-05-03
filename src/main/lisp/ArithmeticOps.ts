import { LispExpression, NumericType, NumericArg } from './LispUtils'
import { validateOrEvaluateExpression } from './LispUtils'

export function add(expression: LispExpression): number | string {
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
                            if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%')
                                return parseInt(String(validateOrEvaluateExpression({ ...arg, expectedReturnType: type })))
                            else
                                return 0
                        }
                        case 'Decimal': {
                            if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%')
                                return parseFloat(String(validateOrEvaluateExpression({ ...arg, expectedReturnType: type })))
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

export function multiply(expression: LispExpression): number | string {
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
                            if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%')
                                return parseInt(String(validateOrEvaluateExpression({ ...arg, expectedReturnType: type })))
                            else
                                return 0
                        }
                        case 'Decimal': {
                            if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%')
                                return parseFloat(String(validateOrEvaluateExpression({ ...arg, expectedReturnType: type })))
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

export function subtract(expression: LispExpression): number | string {
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
                            if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%')
                                return parseInt(String(validateOrEvaluateExpression({ ...arg, expectedReturnType: type })))
                            else
                                return 0
                        }
                        case 'Decimal': {
                            if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%')
                                return parseFloat(String(validateOrEvaluateExpression({ ...arg, expectedReturnType: type })))
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

export function divide(expression: LispExpression): number | string {
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
                            if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%')
                                return parseInt(String(validateOrEvaluateExpression({ ...arg, expectedReturnType: type })))
                            else
                                return 0
                        }
                        case 'Decimal': {
                            if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%')
                                return parseFloat(String(validateOrEvaluateExpression({ ...arg, expectedReturnType: type })))
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

export function power(expression: LispExpression): number | string {
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
                            if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%')
                                return parseInt(String(validateOrEvaluateExpression({ ...arg, expectedReturnType: type })))
                            else
                                return 0
                        }
                        case 'Decimal': {
                            if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%')
                                return parseFloat(String(validateOrEvaluateExpression({ ...arg, expectedReturnType: type })))
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

export function modulus(expression: LispExpression): number | string {
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
                            if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%')
                                return parseInt(String(validateOrEvaluateExpression({ ...arg, expectedReturnType: type })))
                            else
                                return 0
                        }
                        case 'Decimal': {
                            if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%')
                                return parseFloat(String(validateOrEvaluateExpression({ ...arg, expectedReturnType: type })))
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
