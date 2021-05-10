import { Immutable, Draft } from 'immer'
import { useImmerReducer } from "use-immer"
import { Container, Item, none, TableContainer, Cell, Table, getCells, Area } from '../../../main/commons'
import * as Grid from './grids/Products'
import tw from 'twin.macro'
import { store } from '../../../main/store'
import { Vector } from 'prelude-ts'
import { Variable } from '../../../main/types'

type State = Immutable<{
    typeName: 'Product'
    query: {}
    limit: number
    offset: number
    page: string
}>

export type Action =
    | {
        type: 'reset' | 'query' | 'limit' | 'offset' | 'page'
        payload: string | number
    }

const initialState: State = {
    typeName: 'Product',
    query: {},
    limit: 5,
    offset: 0,
    page: '1'
}

function reducer(state: Draft<State>, action: Action) {
    switch (action.type) {
        case 'reset':
            return initialState;
        case 'query': {
            if (typeof action.payload == 'object') {
                state.query = action.payload
            }
            return;
        }
        case 'limit': {
            if (typeof action.payload == 'number') {
                state.limit = Math.max(initialState.limit, action.payload)
            }
            return;
        }
        case 'offset': {
            if (typeof action.payload == 'number') {
                state.offset = Math.max(0, action.payload)
                state.page = String(Math.max(0, action.payload) + 1)
            }
            return;
        }
        case 'page': {
            if (typeof action.payload == 'string') {
                state.page = action.payload
            }
            return;
        }
    }
}

export default function Products() {
    const [state, dispatch] = useImmerReducer<State, Action>(reducer, initialState)
    const variables = store(state => state.variables.Product)
    const columns: Vector<string> = Vector.of("SKU", "Name", "Orderable", "Consumable", "Producable")
    return (
        <Container area={none} layout={Grid.layouts.main} className="bg-gray-100 rounded-lg shadow-lg border-gray-200 border-2">
            {/* <Item area={Grid.header}>
                <Title>Products</Title>
            </Item> */}
            <Table area={Grid.header} state={state} dispatch={dispatch} variables={variables} columns={columns} />
            <Table area={Grid.table} state={state} dispatch={dispatch} variables={variables} columns={columns} />
        </Container>
    )
}

const Title = tw.div`py-8 text-4xl text-gray-900 font-bold mx-1`
