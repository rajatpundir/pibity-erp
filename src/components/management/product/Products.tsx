import { Immutable, Draft } from 'immer'
import { useImmerReducer } from "use-immer"
import { Container, Item, none, Table, Cell, TableFooter, getCells, Area } from '../../../main/commons'
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
    const products = store(state => state.variables.Product)
    const columns: Vector<string> = Vector.of("SKU", "Name", "Orderable", "Consumable", "Producable")
    return (
        <Container area={none} layout={Grid.layouts.main} className="bg-gray-100 rounded-lg shadow-lg border-gray-200 border-2">
            <Item area={Grid.header}>
                <Title>Products</Title>
            </Item>
            {
                getTable(Grid.body, state, dispatch, columns, products)
            }
        </Container>
    )
}

const Title = tw.div`py-8 text-4xl text-gray-900 font-bold mx-1`















// Make this a React Component instead
function getTable(area: Area, state: State, dispatch: React.Dispatch<Action>, columns: Vector<string>, variables: Vector<Variable>) {
    const start = Math.min(state.limit * state.offset, variables.length())
    const end = Math.min(start + state.limit, variables.length())
    return (<>
        <Table area={area} className="border-gray-200 border-l-2 border-r-2 border-t-2 rounded-tl-lg rounded-tr-lg">
            <Cell row="1/2" column="1/2" className="bg-black rounded-tl-lg pl-2">
                <Column>{columns.toArray()[0]}</Column>
            </Cell>
            {
                columns.toArray().slice(1, columns.length() - 1).map((columnName, index) => {
                    return (<Cell key={columnName} row="1/2" column={`${index + 2}/${index + 3}`} className="bg-black">
                        <Column>{columnName}</Column>
                    </Cell>)
                })
            }
            <Cell row="1/2" column={`${columns.length()}/${columns.length() + 1}`} className="bg-black rounded-tr-lg">
                <Column>{columns.toArray()[columns.length() - 1]}</Column>
            </Cell>
            {
                variables.length() !== 0 && start < variables.length()
                    ? getCells(variables, start, end)
                    : <Cell className="pt-4 pb-4 border-b-2 w-full font-bold text-center" row="2/3" column="1/6">No records found at specified page.</Cell>
            }
        </Table>
        <TableFooter area={Grid.footer} layout={Grid.layouts.footer} state={state} dispatch={dispatch} variables={variables} />
    </>)
}

const Column = tw.div`text-white font-medium text-xl py-3 text-left`

