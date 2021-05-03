import { LispExpression } from './LispUtils'
import { validateOrEvaluateExpression } from './LispUtils'

export function and(expression: LispExpression): boolean | string {
    if (expression.op === 'and') {
        const { expectedReturnType, args } = expression
        const evaluatedArgs: Array<boolean> = args.map(arg => {
            if (typeof arg === 'object') {
                if (arg.op === '==' || arg.op === '>' || arg.op === '<' || arg.op === '>=' || arg.op === '<=' || arg.op === 'and' || arg.op === 'or' || arg.op === 'not')
                    return Boolean(validateOrEvaluateExpression({ ...arg, expectedReturnType: 'Boolean' })).valueOf()
                else
                    return false
            } else {
                return arg
            }
        })
        if (evaluatedArgs.length !== 0) {
            const result: Boolean = evaluatedArgs.reduce((acc, x) => acc && x, true)
            switch (expectedReturnType) {
                case 'Boolean': return result.valueOf()
                case 'Text': return String(result.valueOf())
            }
        }
        return false
    } else {
        return false
    }
}

export function or(expression: LispExpression): boolean | string {
    if (expression.op === 'or') {
        const { expectedReturnType, args } = expression
        const evaluatedArgs: Array<boolean> = args.map(arg => {
            if (typeof arg === 'object') {
                if (arg.op === '==' || arg.op === '>' || arg.op === '<' || arg.op === '>=' || arg.op === '<=' || arg.op === 'and' || arg.op === 'or' || arg.op === 'not')
                    return Boolean(validateOrEvaluateExpression({ ...arg, expectedReturnType: 'Boolean' })).valueOf()
                else
                    return false
            } else {
                return arg
            }
        })
        if (evaluatedArgs.length !== 0) {
            const result: Boolean = evaluatedArgs.reduce((acc, x) => acc || x, false)
            switch (expectedReturnType) {
                case 'Boolean': return result.valueOf()
                case 'Text': return String(result.valueOf())
            }
        }
        return false
    } else {
        return false
    }
}

export function not(expression: LispExpression): boolean | string {
    if (expression.op === 'not') {
        const { expectedReturnType, args } = expression
        const evaluatedArgs: Array<boolean> = args.map(arg => {
            if (typeof arg === 'object') {
                if (arg.op === '==' || arg.op === '>' || arg.op === '<' || arg.op === '>=' || arg.op === '<=' || arg.op === 'and' || arg.op === 'or' || arg.op === 'not')
                    return Boolean(validateOrEvaluateExpression({ ...arg, expectedReturnType: 'Boolean' })).valueOf()
                else
                    return false
            } else {
                return arg
            }
        })
        if (evaluatedArgs.length !== 0) {
            const result: Boolean = !evaluatedArgs[0]
            switch (expectedReturnType) {
                case 'Boolean': return result.valueOf()
                case 'Text': return String(result.valueOf())
            }
        }
        return false
    } else {
        return false
    }
}
