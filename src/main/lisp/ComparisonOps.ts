import { LispExpression, ComparatorType } from './LispUtils'
import { validateOrEvaluateExpression } from './LispUtils'

export function compare(expression: LispExpression): boolean | string {
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
                            case 'Text': return String(validateOrEvaluateExpression({ ...arg, expectedReturnType: type }))
                            case 'Decimal': {
                                if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%')
                                    return String(Number(validateOrEvaluateExpression({ ...arg, expectedReturnType: type })))
                                else if (arg.op === 'if' && (arg.types[0] === 'Number' || arg.types[0] === 'Decimal'))
                                    return String(validateOrEvaluateExpression({ ...arg, expectedReturnType: type }))
                                else return "0"
                            }
                            case 'Number': {
                                if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%')
                                    return String(parseInt(String(validateOrEvaluateExpression({ ...arg, expectedReturnType: type }))))
                                else if (arg.op === 'if' && (arg.types[0] === 'Number' || arg.types[0] === 'Decimal'))
                                    return String(validateOrEvaluateExpression({ ...arg, expectedReturnType: type }))
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
                            case 'Text': return parseFloat(String(validateOrEvaluateExpression({ ...arg, expectedReturnType: type })))
                            case 'Decimal': {
                                if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%')
                                    return Number(validateOrEvaluateExpression({ ...arg, expectedReturnType: type }))
                                else if (arg.op === 'if' && (arg.types[0] === 'Number' || arg.types[0] === 'Decimal'))
                                    return Number(validateOrEvaluateExpression({ ...arg, expectedReturnType: type }))
                                else return 0
                            }
                            case 'Number': {
                                if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%')
                                    return parseInt(String(validateOrEvaluateExpression({ ...arg, expectedReturnType: type })))
                                else if (arg.op === 'if' && (arg.types[0] === 'Number' || arg.types[0] === 'Decimal'))
                                    return parseInt(String(validateOrEvaluateExpression({ ...arg, expectedReturnType: type })))
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
                            case 'Text': return parseInt(String(validateOrEvaluateExpression({ ...arg, expectedReturnType: type })))
                            case 'Decimal': {
                                if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%')
                                    return parseInt(String(validateOrEvaluateExpression({ ...arg, expectedReturnType: type })))
                                else if (arg.op === 'if' && (arg.types[0] === 'Number' || arg.types[0] === 'Decimal'))
                                    return parseInt(String(validateOrEvaluateExpression({ ...arg, expectedReturnType: type })))
                                else return 0
                            }
                            case 'Number': {
                                if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%')
                                    return parseInt(String(validateOrEvaluateExpression({ ...arg, expectedReturnType: type })))
                                else if (arg.op === 'if' && (arg.types[0] === 'Number' || arg.types[0] === 'Decimal'))
                                    return parseInt(String(validateOrEvaluateExpression({ ...arg, expectedReturnType: type })))
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
