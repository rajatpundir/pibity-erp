import { Draft, Immutable } from 'immer'
import { Vector } from 'prelude-ts'
import tw from 'twin.macro'
import { useImmerReducer } from "use-immer"
import { Container, Item, none } from '../../../main/commons'
import { Table } from '../../../main/Table'
import * as Grid from './grids/Products'
import { Query, Filter, Args, getQuery, updateQuery, applyFilter } from '../../../main/Filter'
import Drawer from '@material-ui/core/Drawer'
import { useState } from 'react'
import { useStore } from '../../../main/useStore'

type State = Immutable<{
    typeName: 'Product'
    query: Query
    limit: number
    offset: number
    page: number
}>

export type Action =
    | {
        type: 'reset' | 'limit' | 'offset' | 'page'
        payload: number
    }
    | {
        type: 'query'
        payload: Args
    }

const initialState: State = {
    typeName: 'Product',
    query: getQuery('Product'),
    limit: 5,
    offset: 0,
    page: 1
}

function reducer(state: Draft<State>, action: Action) {
    switch (action.type) {
        case 'reset':
            return initialState;
        case 'query': {
            if (typeof action.payload === 'object') {
                updateQuery(state.query, action.payload)
            }
            return;
        }
        case 'limit': {
            if (typeof action.payload === 'number') {
                state.limit = Math.max(initialState.limit, action.payload)
            }
            return;
        }
        case 'offset': {
            if (typeof action.payload === 'number') {
                state.offset = Math.max(0, action.payload)
                state.page = Math.max(0, action.payload) + 1
            }
            return;
        }
        case 'page': {
            if (typeof action.payload === 'number') {
                state.page = action.payload
            }
            return;
        }
    }
}

export default function Products() {
    const [state, dispatch] = useImmerReducer<State, Action>(reducer, initialState)
    const variables = useStore(state => state.variables.Product).filter(variable => applyFilter(state.query, variable))
    const columns: Vector<string> = Vector.of("SKU", "Name", "Orderable", "Consumable", "Producable")
    const [open, setOpen] = useState(false)
    return (
        <Container area={none} layout={Grid.layouts.main} className="p-10">
            <Item area={Grid.filter} justify='end' align='center'>
                <Button onClick={() => setOpen(true)}>Filter</Button>
                <Drawer open={open} onClose={() => setOpen(false)} anchor={'right'}>
                    <Filter query={state.query} dispatch={dispatch} />
                </Drawer>
            </Item>
            <Item area={Grid.header}>
                <Title>Products</Title>
            </Item>
            <Table area={Grid.table} state={state} dispatch={dispatch} variables={variables} columns={columns} />
        </Container>
    )
}

const Title = tw.div`py-8 text-4xl text-gray-800 font-bold mx-1`

const Button = tw.button`bg-gray-900 text-white text-center font-bold p-2 mx-1 uppercase w-40 h-full max-w-sm rounded-lg focus:outline-none`
