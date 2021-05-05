import { Vector } from 'prelude-ts'
import create from 'zustand'
import { Layer, Diff, applyAllDiff } from './layers'

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

const diff1: Diff = {
    id: 1,
    active: true,
    Product: {
        replace: Vector.of(
            {
                variableName: "PC",
                values: {
                    x: 2
                }
            }
        ),
        remove: Vector.of("Books")
    },
    Supplier: {
        replace: Vector.of(),
        remove: Vector.of()
    }
}

const diff2: Diff = {
    id: 2,
    active: true,
    Product: {
        replace: Vector.of(),
        remove: Vector.of()
    },
    Supplier: {
        replace: Vector.of(
            {
                variableName: "XYZ",
                values: {
                    product: "Laptop"
                }
            }),
        remove: Vector.of()
    }
}

const diffs: Array<Diff> = [diff1, diff2]

type State = {
    base: Layer,
    diffs: Array<Diff>
    variables: () => Layer
    addDiff: (diff: Diff) => void
}

export const store = create<State>((set, get) => ({
    base: base,
    diffs: diffs,
    variables: () => applyAllDiff(get().base, get().diffs),
    addDiff: (diff) => {
        const diffs = get().diffs
        diffs.push(diff)
        set({diffs: diffs})
    }
}))
