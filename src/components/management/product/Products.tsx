import { Draft, Immutable } from 'immer'
import { Vector } from 'prelude-ts'
import tw from 'twin.macro'
import { useImmerReducer } from 'use-immer'
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
    columns: Vector<string>
}>

export type Action =
    | ['limit', number]
    | ['offset', number]
    | ['page', number]
    | ['query', Args]

const initialState: State = {
    typeName: 'Product',
    query: getQuery('Product'),
    limit: 5,
    offset: 0,
    page: 1,
    columns: Vector.of('name', 'orderable', 'consumable', 'producable')
}

function reducer(state: Draft<State>, action: Action) {
    switch (action[0]) {
        case 'query': {
            updateQuery(state.query, action[1])
            break
        }
        case 'limit': {
            state.limit = Math.max(initialState.limit, action[1])
            return;
        }
        case 'offset': {
            state.offset = Math.max(0, action[1])
            state.page = Math.max(0, action[1]) + 1
            return;
        }
        case 'page': {
            state.page = action[1]
            return;
        }
    }
}

export default function Products() {
    const [state, dispatch] = useImmerReducer<State, Action>(reducer, initialState)
    const variables = useStore(state => state.variables.Product).filter(variable => applyFilter(state.query, variable))
    const [open, setOpen] = useState(false)

    const updateQuery = (args: Args) => {
        dispatch(['query', args])
    }

    const updatePage = (args: ['limit', number] | ['offset', number] | ['page', number]) => {
        dispatch([args[0], args[1]])
    }

    return (
        <Container area={none} layout={Grid.layouts.main} className='p-10'>
            <Item area={Grid.header}>
                <div className='inline-block'>
                    <Title>Products</Title>
                </div>
                <div className='inline-block'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </div>
            </Item>
            <Item area={Grid.filter} justify='end' align='center'>
                <Button onClick={() => setOpen(true)}>Filter</Button>
                <Drawer open={open} onClose={() => setOpen(false)} anchor={'right'}>
                    <Filter typeName={state.typeName} query={state.query} updateQuery={updateQuery} />
                </Drawer>
            </Item>
            <Table area={Grid.table} state={state} updatePage={updatePage} variables={variables} showVariableName={true} columns={state.columns} />
        </Container>
    )
}

const Title = tw.div`py-8 text-4xl text-gray-800 font-bold mx-1 inline-block`

const Button = tw.button`bg-gray-900 text-white text-center font-bold p-2 mx-1 uppercase w-40 h-full max-w-sm rounded-lg focus:outline-none`
