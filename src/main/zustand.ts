import { Vector } from 'prelude-ts'
import create from 'zustand'
import axios from 'axios'

type Mutation = {
    op: 'create' | 'update' | 'delete'
    variableName: string
    updatedVariableName?: string
    values: object
}

type MutationStore = {
    counter: number
    requests: { [index: number]: Vector<Mutation> }
    responses: object
    push: (mutations: Vector<Mutation>) => Promise<number>
    pop: (requestNumber: number) => void
}

const mutations = create<MutationStore>((set, get) => ({
    counter: 0,
    requests: {},
    responses: {},
    push: async (mutations) => {
        const counter = get().counter
        const requests = get().requests
        requests[counter] = mutations
        set({ counter: counter + 1, requests })
        return (counter)
    },
    pop: async (requestNumber) => {
        delete get().requests[requestNumber]
    }
}))

async function mutateVariables() {
    const [requests, pop] = mutations(state => [state.requests, state.pop])
    if (Object.keys(requests).length != 0) {
        const url = 'http://localhost:8080/api/variables/mutate'
        const response = await axios.post(url, { queue: requests })
        if (response.status == 200) {
            console.log(response.data)
        }
        Object.keys(requests).forEach((key: any) => pop(key));
    }
}

// Check use cases for creation, updation, deletion
