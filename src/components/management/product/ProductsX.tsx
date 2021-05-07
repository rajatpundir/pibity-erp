import React from 'react'
import { Immutable, Draft } from 'immer'
import { useImmerReducer } from "use-immer"
import { Container, Item, none, Table, Cell } from '../../../main/commons'
import * as Grid from './grids/ProductsX'
import tw from 'twin.macro'
import { store } from '../../../main/store'
import { isoProduct, ProductVariable } from '../../../main/types'
import { Vector } from 'prelude-ts'

type State = Immutable<{
    typeName: 'Product'
    query: {}
    limit: number
    offset: number
    page: string
}>

export type Action =
    | {
        type: string
        payload: string | number | object
    }

const initialState: State = {
    typeName: 'Product',
    query: {},
    limit: 3,
    offset: 0,
    page: '0'
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
                state.limit = action.payload
            }
            return;
        }
        case 'offset': {
            if (typeof action.payload == 'number') {
                state.offset = action.payload
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

export default function ProductsX() {
    const [state, dispatch] = useImmerReducer<State, Action>(reducer, initialState)
    const products = store(state => state.variables.Product)
    const start = state.limit * state.offset
    const end = start + state.limit

    const firstPage = async (event: React.MouseEvent<HTMLButtonElement>) => {
        dispatch({
            type: 'offset',
            payload: 0
        })
    }

    const prevPage = async (event: React.MouseEvent<HTMLButtonElement>) => {
        dispatch({
            type: 'offset',
            payload: Math.max(0, parseInt(String(state.offset - 1)))
        })
    }

    const nextPage = async (event: React.MouseEvent<HTMLButtonElement>) => {
        dispatch({
            type: 'offset',
            payload: Math.min(Math.floor(products.length() / state.limit) - 1, parseInt(String(state.offset + 1)))
        })
    }

    const lastPage = async (event: React.MouseEvent<HTMLButtonElement>) => {
        dispatch({
            type: 'offset',
            payload: Math.floor(products.length() / state.limit) - 1
        })
    }

    const changePage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: 'page',
            payload: event.target.value
        })
    }

    const rowUp = async (event: React.MouseEvent<HTMLButtonElement>) => {
        dispatch({
            type: 'limit',
            payload: state.limit + 5
        })
    }

    const rowDown = async (event: React.MouseEvent<HTMLButtonElement>) => {
        dispatch({
            type: 'limit',
            payload: Math.max(5, state.limit - 5)
        })
    }

    return (
        <Container area={none} layout={Grid.layouts.main} className="bg-gray-100 rounded-lg shadow-lg border-gray-200 border-2">
            <Item area={Grid.header}>
                <Title>Products</Title>
            </Item>
            <Table area={Grid.body} className="border-gray-900">
                <Cell row="1/2" column="1/2" className="bg-black rounded-tl-lg pl-2">
                    <Column>SKU</Column>
                </Cell>
                <Cell row="1/2" column="2/3" className="bg-black">
                    <Column>Name</Column>
                </Cell>
                <Cell row="1/2" column="3/4" className="bg-black">
                    <Column>Orderable</Column>
                </Cell>
                <Cell row="1/2" column="4/5" className="bg-black">
                    <Column>Consumable</Column>
                </Cell>
                <Cell row="1/2" column="5/6" className="bg-black rounded-tr-lg">
                    <Column>Producable</Column>
                </Cell>
                {
                    getCells(products, start, end)
                }
            </Table>
            <Container area={Grid.footer} layout={Grid.layouts.footer} className="bg-gray-100">
                <Item align='center' className="mx-6">
                    <span className="mx-2">
                        Page: <Input onChange={changePage} value={state.offset + 1} /> / {Math.ceil(products.length() / state.limit)}
                        <button className="align-text-bottom">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </span>
                    <span className="mx-2">
                        {start + 1}-{end} of {products.length()}
                    </span>
                    <span className="mx-2">
                        Rows: {state.limit}
                        <button onClick={rowUp}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                            </svg>
                        </button>
                        <button onClick={rowDown}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                            </svg>
                        </button>
                    </span>
                </Item>
                <Item justify='end' align='center' className="mx-8">
                    <button onClick={firstPage}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                    </button>
                    <button onClick={prevPage}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button onClick={nextPage}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                    <button onClick={lastPage}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                    </button>
                </Item>
            </Container>
        </Container>
    )
}

function getCells(products: Vector<ProductVariable>, start: number, end: number): Vector<unknown> {
    var counter = 0
    var cells = Vector.of()
    products.toArray().slice(start, end).forEach((product, index) => {
        if (index % 2 === 0) {
            cells = cells.append(<Cell key={counter} className="pl-2 pt-4 pb-4 border-b-2 w-full font-bold" row={`${index + 2}/${index + 3}`} column="1/2">{isoProduct.unwrap(product.variableName)}</Cell>)
            counter += 1
            cells = cells.append(<Cell key={counter} className="pt-4 pb-4 border-b-2 w-full" justify='start' row={`${index + 2}/${index + 3}`} column="2/3">{product.values.name}</Cell>)
            counter += 1
            cells = cells.append(<Cell key={counter} className="pt-4 pb-4 border-b-2 w-full" row={`${index + 2}/${index + 3}`} column="3/4">{product.values.orderable ? 'Yes' : 'No'}</Cell>)
            counter += 1
            cells = cells.append(<Cell key={counter} className="pt-4 pb-4 border-b-2 w-full" row={`${index + 2}/${index + 3}`} column="4/5">{product.values.consumable ? 'Yes' : 'No'}</Cell>)
            counter += 1
            cells = cells.append(<Cell key={counter} className="pr-2 pt-4 pb-4 border-b-2 w-full" row={`${index + 2}/${index + 3}`} column="5/6">{product.values.producable ? 'Yes' : 'No'}</Cell>)
            counter += 1

        } else {
            cells = cells.append(<Cell key={counter} className="pl-2 pt-4 pb-4 border-b-2 w-full font-bold bg-gray-50" row={`${index + 2}/${index + 3}`} column="1/2">{isoProduct.unwrap(product.variableName)}</Cell>)
            counter += 1
            cells = cells.append(<Cell key={counter} className="pt-4 pb-4 border-b-2 w-full bg-gray-50" justify='start' row={`${index + 2}/${index + 3}`} column="2/3">{product.values.name}</Cell>)
            counter += 1
            cells = cells.append(<Cell key={counter} className="pt-4 pb-4 border-b-2 w-full bg-gray-50" row={`${index + 2}/${index + 3}`} column="3/4">{product.values.orderable ? 'Yes' : 'No'}</Cell>)
            counter += 1
            cells = cells.append(<Cell key={counter} className="pt-4 pb-4 border-b-2 w-full bg-gray-50" row={`${index + 2}/${index + 3}`} column="4/5">{product.values.consumable ? 'Yes' : 'No'}</Cell>)
            counter += 1
            cells = cells.append(<Cell key={counter} className="pr-2 pt-4 pb-4 border-b-2 w-full bg-gray-50" row={`${index + 2}/${index + 3}`} column="5/6">{product.values.producable ? 'Yes' : 'No'}</Cell>)
            counter += 1

        }
    })
    return cells
}

const Title = tw.div`py-8 text-4xl text-gray-900 font-bold mx-1`

const Column = tw.div`text-white font-medium text-xl py-3 text-left`

const Input = tw.input`p-1.5 text-gray-500 leading-tight border border-gray-400 shadow-inner hover:border-gray-600 w-8 h-6 rounded-sm inline-block`
