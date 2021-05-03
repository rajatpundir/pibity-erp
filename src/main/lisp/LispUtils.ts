import { add, multiply, subtract, divide, power, modulus } from './ArithmeticOps'
import { compare } from './ComparisonOps'
import { and, or, not } from './LogicalOps'

export type NumericType = 'Number' | 'Decimal'

export type NumericArg = number | LispExpression

export type ComparatorType = NumericType | 'Text'

export type ComparatorArg = string | NumericArg

export type LogicalArg = boolean | LispExpression

export type LispExpression = {
    expectedReturnType?: 'Number' | 'Decimal' | 'Text'
    op: '+' | '*' | '-' | '/' | '^' | '%'
    types: Array<NumericType>
    args: Array<NumericArg>
} | {
    expectedReturnType?: 'Boolean' | 'Text'
    op: '==' | '>' | '<' | '>=' | '<='
    types: Array<ComparatorType>
    args: Array<ComparatorArg>
} | {
    expectedReturnType?: 'Boolean' | 'Text'
    op: 'and' | 'or' | 'not'
    types: ['Boolean']
    args: Array<LogicalArg>
}

// | {
//     op: 'if' | 'let' | '.' | 'id' | '++'
//     types: Array<NumericType>
//     args: Array<NumericArg>
// }

export function validateOrEvaluateExpression(expression: LispExpression): string | number | boolean {
    switch (expression.op) {
        case '+': return add(expression)
        case '*': return multiply(expression)
        case '-': return subtract(expression)
        case '/': return divide(expression)
        case '^': return power(expression)
        case '%': return modulus(expression)
        case '==': return compare(expression)
        case '>': return compare(expression)
        case '<': return compare(expression)
        case '>=': return compare(expression)
        case '<=': return compare(expression)
        case 'and': return and(expression)
        case 'or': return or(expression)
        case 'not': return not(expression)
        default: return "Operator not defined"
    }
}
