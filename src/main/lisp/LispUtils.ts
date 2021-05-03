import { add, multiply, subtract, divide, power, modulus } from './ArithmeticOps'

export type NumericType = 'Number' | 'Decimal'

export type NumericArg = number | LispExpression

export type ComparatorType = NumericType | 'Text'

export type ComparatorArg = string | NumericArg

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
}


// | {
//     op: 'and' | 'or' | 'not' | 'if' | 'let' | '.' | 'id' | '++'
//     types: Array<NumericType>
//     args: Array<NumericArg>
// }

export function validateOrEvaluateExpression(expression: LispExpression): string | number {
    switch (expression.op) {
        case '+': return add(expression)
        case '*': return multiply(expression)
        case '-': return subtract(expression)
        case '/': return divide(expression)
        case '^': return power(expression)
        case '%': return modulus(expression)
        default: return ""
    }
}
