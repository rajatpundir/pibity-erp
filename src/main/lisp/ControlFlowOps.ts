import { LispExpression } from './LispUtils'
import { validateOrEvaluateExpression } from './LispUtils'

export function ifThenElse(expression: LispExpression): string | number | boolean {
    const { expectedReturnType, types, args } = expression
    if (expression.op == 'if' && types.length === 1 && args.length === 3 && expectedReturnType !== undefined) {
        console.log('something')
        if (typeof args[0] == 'object') {
            if (args[0].op === '==' || args[0].op === '>' || args[0].op === '<' || args[0].op === '>=' || args[0].op === '<=' || args[0].op === 'and' || args[0].op === 'or' || args[0].op === 'not') {
                const condition = Boolean(validateOrEvaluateExpression({ ...args[0], expectedReturnType: 'Boolean' })).valueOf()
                if (condition) {
                    const arg = args[1]
                    if (typeof arg == 'object') {
                        switch (types[0]) {
                            case 'Text': return String(validateOrEvaluateExpression({ ...arg, expectedReturnType: types[0] }))
                            case 'Number': {
                                if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%')
                                    return parseInt(String(validateOrEvaluateExpression({ ...arg, expectedReturnType: types[0] })))
                                else
                                    return 0
                            }
                            case 'Decimal': {
                                if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%')
                                    return parseFloat(String(validateOrEvaluateExpression({ ...arg, expectedReturnType: types[0] })))
                                else
                                    return 0
                            }
                            case 'Boolean': {
                                if (arg.op === '==' || arg.op === '>' || arg.op === '<' || arg.op === '>=' || arg.op === '<=' || arg.op === 'and' || arg.op === 'or' || arg.op === 'not')
                                    return Boolean(validateOrEvaluateExpression({ ...arg, expectedReturnType: types[0] }))
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
                    if (typeof arg == 'object') {
                        switch (types[0]) {
                            case 'Text': return String(validateOrEvaluateExpression({ ...arg, expectedReturnType: types[0] }))
                            case 'Number': {
                                if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%')
                                    return parseInt(String(validateOrEvaluateExpression({ ...arg, expectedReturnType: types[0] })))
                                else
                                    return 0
                            }
                            case 'Decimal': {
                                if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%')
                                    return parseFloat(String(validateOrEvaluateExpression({ ...arg, expectedReturnType: types[0] })))
                                else
                                    return 0
                            }
                            case 'Boolean': {
                                if (arg.op === '==' || arg.op === '>' || arg.op === '<' || arg.op === '>=' || arg.op === '<=' || arg.op === 'and' || arg.op === 'or' || arg.op === 'not')
                                    return Boolean(validateOrEvaluateExpression({ ...arg, expectedReturnType: types[0] }))
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
            const condition = Boolean(args[0]).valueOf()
            if (condition) {
                const arg = args[1]
                if (typeof arg == 'object') {
                    switch (types[0]) {
                        case 'Text': return String(validateOrEvaluateExpression({ ...arg, expectedReturnType: types[0] }))
                        case 'Number': {
                            if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%')
                                return parseInt(String(validateOrEvaluateExpression({ ...arg, expectedReturnType: types[0] })))
                            else
                                return 0
                        }
                        case 'Decimal': {
                            if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%')
                                return parseFloat(String(validateOrEvaluateExpression({ ...arg, expectedReturnType: types[0] })))
                            else
                                return 0
                        }
                        case 'Boolean': {
                            if (arg.op === '==' || arg.op === '>' || arg.op === '<' || arg.op === '>=' || arg.op === '<=' || arg.op === 'and' || arg.op === 'or' || arg.op === 'not')
                                return Boolean(validateOrEvaluateExpression({ ...arg, expectedReturnType: types[0] }))
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
                if (typeof arg == 'object') {
                    switch (types[0]) {
                        case 'Text': return String(validateOrEvaluateExpression({ ...arg, expectedReturnType: types[0] }))
                        case 'Number': {
                            if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%')
                                return parseInt(String(validateOrEvaluateExpression({ ...arg, expectedReturnType: types[0] })))
                            else
                                return 0
                        }
                        case 'Decimal': {
                            if (arg.op === '+' || arg.op === '*' || arg.op === '-' || arg.op === '/' || arg.op === '^' || arg.op === '%')
                                return parseFloat(String(validateOrEvaluateExpression({ ...arg, expectedReturnType: types[0] })))
                            else
                                return 0
                        }
                        case 'Boolean': {
                            if (arg.op === '==' || arg.op === '>' || arg.op === '<' || arg.op === '>=' || arg.op === '<=' || arg.op === 'and' || arg.op === 'or' || arg.op === 'not')
                                return Boolean(validateOrEvaluateExpression({ ...arg, expectedReturnType: types[0] }))
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
        return 0
    } else {
        return 0
    }
}
