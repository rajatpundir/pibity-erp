import { Vector } from 'prelude-ts'
import create from 'zustand'
import { Layer, Diff, compose } from './layers'
import { devtools } from 'zustand/middleware'

const base: Layer = {
    Product: Vector.of(),
    Supplier: Vector.of()
}

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
    diffs: [],
    variables: base,
    addDiff: (diff) => {
        const x = { ...diff, id: get().counter }
        get().diffs.push(x)
        set({ variables: compose(get().variables, get().diffs) })
        get().counter += 1
        return x
    }
})))
