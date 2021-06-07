import create from 'zustand/vanilla'
import createStore from 'zustand'
import { Layer, Diff, compose, base } from './layers'
import { devtools } from 'zustand/middleware'

type State = {
    counter: number
    base: Layer
    diffs: Array<Diff>
    variables: Layer
    addDiff: (diff: Diff) => Diff
}

// Note: fields in store should be mutable, or change is not reflected where they are used.
// Store is limited to per page open, use Local Storage to sync store every few seconds.
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

// export const { getState, setState, subscribe, destroy } = store

export const useStore = createStore(store)
