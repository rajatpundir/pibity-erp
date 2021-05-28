import { Draft, Immutable } from 'immer'
import { Vector } from 'prelude-ts'
import tw from 'twin.macro'
import { useImmerReducer } from 'use-immer'
import { Container, Item, none } from '../../../main/commons'
import { Table } from '../../../main/Table'
import * as Grid from './grids/List'
import { Query, Filter, Args, getQuery, updateQuery, applyFilter } from '../../../main/Filter'
import Drawer from '@material-ui/core/Drawer'
import { useState } from 'react'
import { useStore } from '../../../main/useStore'
import { types } from '../../../main/types'
import { withRouter } from 'react-router-dom'

type State = Immutable<{
    typeName: 'PurchaseInvoice'
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
    typeName: 'PurchaseInvoice',
    query: getQuery('PurchaseInvoice'),
    limit: 5,
    offset: 0,
    page: 1,
    columns: Vector.of<string>()
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

function Component(props) {
    const [state, dispatch] = useImmerReducer<State, Action>(reducer, initialState)
    const variables = useStore(state => state.variables.Product).filter(variable => applyFilter(state.query, variable))
    const [open, setOpen] = useState(false)
    const type = types[state.typeName]

    const updateQuery = (args: Args) => {
        dispatch(['query', args])
    }

    const updatePage = (args: ['limit', number] | ['offset', number] | ['page', number]) => {
        dispatch([args[0], args[1]])
    }

    return (
        <Container area={none} layout={Grid.layouts.main} className='p-10'>
            <Item area={Grid.header} align='center' className='flex'>
                <Title>{type.name}s</Title>
                <button onClick={() => { props.history.push('/purchase-invoice') }} className='text-3xl font-bold text-white bg-gray-800 rounded-md px-2'>+</button>
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

export default withRouter(Component)

const Title = tw.div`text-4xl text-gray-800 font-bold mx-1 inline-block whitespace-nowrap`

const Button = tw.button`bg-gray-900 text-white text-center font-bold p-2 mx-1 uppercase w-40 h-full max-w-sm rounded-lg focus:outline-none`
