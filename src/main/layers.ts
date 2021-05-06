import { Vector } from 'prelude-ts'
import { ProductVariable, Product, isoProduct } from './types'

type Variable = {
    variableName: string
    values: object
}

export type Layer = {
    Product: Vector<ProductVariable>
    Supplier: Vector<Variable>
}

export type Diff = {
    id: number
    active: boolean
    Product: {
        replace: Vector<ProductVariable>
        remove: Vector<Product>
    }
    Supplier: {
        replace: Vector<Variable>
        remove: Vector<string>
    }
}

export function applyDiff(layer: Readonly<Layer>, diff: Diff): Layer {
    if (diff.active === false)
        return layer
    else {
        const result: Layer = {
            Product: layer.Product
                .filter(x => !diff.Product.remove.map(y => isoProduct.unwrap(y)).contains(isoProduct.unwrap(x.variableName)))
                .filter(x => !diff.Product.replace.anyMatch(y => isoProduct.unwrap(y.variableName) === isoProduct.unwrap(x.variableName)))
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

export function compose(base: Readonly<Layer>, diffs: Array<Diff>) {
    var result: Layer = base
    diffs.forEach(diff => {
        result = applyDiff(result, diff)
    })
    return result
}
