import { Vector } from 'prelude-ts'

type Variable = {
    variableName: string
    values: object
}

export type Layer = {
    Product: Vector<Variable>
    Supplier: Vector<Variable>
}

export type Diff = {
    active: boolean
    Product: {
        replace: Vector<Variable>
        remove: Vector<string>
    }
    Supplier: {
        replace: Vector<Variable>
        remove: Vector<string>
    }
}

export function applyDiff(layer: Layer, diff: Diff): Layer {
    if (diff.active === false)
        return layer
    else {
        const result: Layer = {
            Product: layer.Product
                .filter(x => !diff.Product.remove.contains(x.variableName))
                .filter(x => !diff.Product.replace.anyMatch(y => y.variableName === x.variableName))
                .appendAll(diff.Product.replace)
            ,
            Supplier: layer.Supplier
                .filter(x => !diff.Supplier.remove.contains(x.variableName))
                .filter(x => !diff.Supplier.replace.anyMatch(y => y.variableName === x.variableName))
                .appendAll(diff.Supplier.replace)
        }
        return result
    }
}

export function applyAllDiff(base: Layer, diffs: Vector<Diff>) {
    var result: Layer = base
    diffs.forEach(diff => {
        result = applyDiff(result, diff)
    })
    return result
}
