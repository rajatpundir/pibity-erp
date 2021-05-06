import { Vector } from 'prelude-ts'
import create from 'zustand'
import { Layer, Diff, compose } from './layers'
import { devtools } from 'zustand/middleware'

const base: Layer = {
    Product: Vector.of(),
    Supplier: Vector.of(
        {
            variableName: "ABC",
            values: {
                z: 2
            }
        }
    )
}

// const diff1: Diff = {
//     id: 1,
//     active: true,
//     Product: {
//         replace: Vector.of(
//             {
//                 variableName: "PC",
//                 values: {
//                     x: 2
//                 }
//             }
//         ),
//         remove: Vector.of("Books")
//     },
//     Supplier: {
//         replace: Vector.of(),
//         remove: Vector.of()
//     }
// }

// const diff2: Diff = {
//     id: 2,
//     active: true,
//     Product: {
//         replace: Vector.of(),
//         remove: Vector.of()
//     },
//     Supplier: {
//         replace: Vector.of(
//             {
//                 variableName: "XYZ",
//                 values: {
//                     product: "Laptop"
//                 }
//             }),
//         remove: Vector.of()
//     }
// }

const diffs: Array<Diff> = []

type State = {
    counter: number
    base: Layer
    diffs: Array<Diff>
    variables: Layer
    addDiff: (diff: Diff) => Diff
}

// Note: fileds in store should be mutable, or change is not reflected where they are used
export const store = create<State>(devtools((set, get) => ({
    counter: 0,
    base: base,
    diffs: diffs,
    variables: base,
    addDiff: (diff) => {
        const x = {...diff, id: get().counter}
        get().diffs.push(x)
        set({variables: compose(get().base, get().diffs)})
        get().counter += 1
        return x
    }
})))
