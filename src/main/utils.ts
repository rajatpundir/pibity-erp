
type X<T> = T | (() => X<T>)

function R<V>(expr: X<V>): V {
    if (typeof expr === 'function') {
        return R((expr as () => X<V>)())
    } else {
        return (expr as V)
    }
}

export function when<T extends string, V>(expression: X<T>, guards: { [key in T]: X<V> }): V {
    const expr = typeof expression === 'function' ? R(expression as () => X<T>) : (expression as T)
    return typeof guards[expr] === 'function' ? R(guards[expr] as () => X<V>) : (guards[expr] as V)
}

export function iff<V>(predicate: X<boolean>, expr1: X<V>, expr2: X<V>): V {
    if (typeof predicate === 'function' ? R(predicate) : predicate) {
        return typeof expr1 === 'function' ? R(expr1 as () => X<V>) : (expr1 as V)
    } else {
        return typeof expr2 === 'function' ? R(expr2 as () => X<V>) : (expr2 as V)
    }
}
