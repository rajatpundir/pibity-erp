
type X<T> = T | (() => X<T>)

function R<V>(expr: X<V>): V {
    if (typeof expr === 'function') {
        const z = expr as () => X<V>
        return R(z())
    } else {
        return expr as V
    }
}

export function when<T extends string, V>(expression: X<T>, cases: { [key in T]: X<V> }): V {
    const expr = typeof expression === 'function' ? R(expression) : expression
    return (typeof cases[expr] === 'function' ? R(cases[expr]) : cases[expr]) as V
}


export function iff<V>(predicate: X<boolean>, expr1: X<V>, expr2: X<V>): V {
    const p = typeof predicate === 'function' ? R(predicate) : predicate
    if(p) {
        return typeof expr1 === 'function' ? R(expr1) : expr1
    } else {
        return typeof expr2 === 'function' ? R(expr2) : expr2
    }
}
