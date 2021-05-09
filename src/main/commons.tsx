import styled from '@emotion/styled'
import { Vector } from 'prelude-ts'
import { Newtype, iso } from 'newtype-ts'
import { Immutable } from 'immer'
import tw from 'twin.macro'
import { Variable } from './types'

export interface Area extends Newtype<{ readonly Area: unique symbol }, string> { }
export const isoArea = iso<Area>()

export const none: Area = isoArea.wrap('.')

const breakpoints: { [index: string]: number } = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280
}

function getTemplateRows(layout: Layout): string {
    return layout.rows.fold('', (acc, x) => `${acc} ${x}`)
}

function getTemplateColumns(layout: Layout): string {
    return layout.columns.fold('', (acc, x) => `${acc} ${x}`)
}

function getTemplateAreas(layout: Layout): string {
    return isoArea.unwrap(layout.areas.map(row => row.fold(isoArea.wrap(''), (acc, x) => isoArea.wrap(`${isoArea.unwrap(acc)} ${isoArea.unwrap(x)}`))).fold(isoArea.wrap(''), (acc, x) => isoArea.wrap(`${isoArea.unwrap(acc)}"${isoArea.unwrap(x)}" `)))
}

export function validateLayout(layout: GridLayout): GridLayout {
    console.assert(layout.layout_mobile.areas.foldLeft(true, (acc, x) => acc && x.length() === layout.layout_mobile.columns.length())
        && layout.layout_sm.areas.foldLeft(true, (acc, x) => acc && x.length() === layout.layout_sm.columns.length())
        && layout.layout_md.areas.foldLeft(true, (acc, x) => acc && x.length() === layout.layout_md.columns.length())
        && layout.layout_lg.areas.foldLeft(true, (acc, x) => acc && x.length() === layout.layout_lg.columns.length())
        && layout.layout_xl.areas.foldLeft(true, (acc, x) => acc && x.length() === layout.layout_xl.columns.length())
        , 'Error in defining Grid Layout')
    return layout
}

type Layout = {
    rows: Vector<string>
    columns: Vector<string>
    areas: Vector<Vector<Area>>
}

export type GridLayout = {
    margin?: number
    rowGap: string
    columnGap: string
    autoFlow?: 'row' | 'column'
    justify?: 'start' | 'center' | 'end' | 'stretch'
    align?: 'start' | 'center' | 'end' | 'stretch'
    layout_mobile: Layout,
    layout_sm: Layout,
    layout_md: Layout,
    layout_lg: Layout,
    layout_xl: Layout
}

type GridContainer = {
    area: Area
    layout: GridLayout
}

export const Container = styled.div<GridContainer>`
    grid-area: ${props => isoArea.unwrap(props.area)};
    margin: ${props => props.layout.margin ? props.layout.margin + 'rem' : '0rem'};
    display: grid;
    grid-template-rows: ${props => getTemplateRows(props.layout.layout_mobile)};
    grid-template-columns: ${props => getTemplateColumns(props.layout.layout_mobile)};
    grid-template-areas: ${props => getTemplateAreas(props.layout.layout_mobile)};
    gap: ${props => props.layout.columnGap} ${props => props.layout.rowGap};
    justify-items: ${props => props.layout.justify ? props.layout.justify : 'stretch'};
    align-items: ${props => props.layout.align ? props.layout.align : 'stretch'};
    grid-auto-flow: ${props => props.layout.autoFlow ? props.layout.autoFlow : 'row'};
    @media (min-width: ${breakpoints.sm}px) {
        /* background-color: aquamarine; */
        grid-template-rows: ${props => getTemplateRows(props.layout.layout_sm)};
        grid-template-columns: ${props => getTemplateColumns(props.layout.layout_sm)};
        grid-template-areas: ${props => getTemplateAreas(props.layout.layout_sm)};
    }
    @media (min-width: ${breakpoints.md}px) {
        /* background-color: red; */
        grid-template-rows: ${props => getTemplateRows(props.layout.layout_md)};
        grid-template-columns: ${props => getTemplateColumns(props.layout.layout_md)};
        grid-template-areas: ${props => getTemplateAreas(props.layout.layout_md)};
    }
    @media (min-width: ${breakpoints.lg}px) {
        /* background-color: green; */
        grid-template-rows: ${props => getTemplateRows(props.layout.layout_lg)};
        grid-template-columns: ${props => getTemplateColumns(props.layout.layout_lg)};
        grid-template-areas: ${props => getTemplateAreas(props.layout.layout_lg)};
    }
    @media (min-width: ${breakpoints.xl}px) {
        /* background-color: yellow; */
        grid-template-rows: ${props => getTemplateRows(props.layout.layout_xl)};
        grid-template-columns: ${props => getTemplateColumns(props.layout.layout_xl)};
        grid-template-areas: ${props => getTemplateAreas(props.layout.layout_xl)};
    }
`

export type GridItem = {
    area?: Area
    justify?: 'start' | 'center' | 'end' | 'stretch'
    align?: 'start' | 'center' | 'end' | 'stretch'
}

export const Item = styled.div<GridItem>`
    grid-area: ${props => props.area ? isoArea.unwrap(props.area) : '.'};
    justify-self: ${props => props.justify ? props.justify : 'stretch'};
    align-self: ${props => props.align ? props.align : 'stretch'};
    /* background-color: aquamarine; */
`

type TableContainer = {
    area: Area
    margin?: number
    rowGap?: string
    columnGap?: string
    autoFlow?: 'row' | 'column'
    justify?: 'start' | 'center' | 'end' | 'stretch'
    align?: 'start' | 'center' | 'end' | 'stretch'
}

export const Table = styled.div<TableContainer>`
    grid-area: ${props => isoArea.unwrap(props.area)};
    margin: ${props => props.margin ? props.margin + 'rem' : '0rem'};
    display: grid;
    gap: ${props => props.columnGap ? props.columnGap : '0rem'} ${props => props.rowGap ? props.rowGap : '0rem'};
    justify-items: ${props => props.justify ? props.justify : 'stretch'};
    align-items: ${props => props.align ? props.align : 'stretch'};
    grid-auto-flow: ${props => props.autoFlow ? props.autoFlow : 'row'};
`

export type CellItem = {
    row: string
    column: string
    justify?: 'start' | 'center' | 'end' | 'stretch'
    align?: 'start' | 'center' | 'end' | 'stretch'
}

export const Cell = styled.div<CellItem>`
    grid-row: ${props => props.row};
    grid-column: ${props => props.column};
    justify-self: ${props => props.justify ? props.justify : 'stretch'};
    align-self: ${props => props.align ? props.align : 'stretch'};
    /* background-color: aquamarine; */
`


const Input = tw.input`p-1.5 text-gray-500 leading-tight border border-gray-400 shadow-inner hover:border-gray-600 w-8 h-6 rounded-sm inline-block`

export function getCells(variables: Vector<Variable>, start: number, end: number): Vector<unknown> {
    var counter = 0
    var cells = Vector.of()
    variables.toArray().slice(start, end).forEach((variable, rowIndex) => {
        const keys: Array<string> = Object.keys(variable.values)
        if (rowIndex % 2 === 0) {
            cells = cells.append(<Cell key={counter} className="pl-2 pt-4 pb-4 border-b-2 w-full font-bold" row={`${rowIndex + 2}/${rowIndex + 3}`} column="1/2">{variable.variableName}</Cell>)
            counter += 1
            keys.slice(0, keys.length - 1).forEach((key, columnIndex) => {
                const value = variable.values[key]
                switch (typeof value) {
                    case 'boolean': {
                        cells = cells.append(<Cell key={counter} className="pt-4 pb-4 border-b-2 w-full" justify='start' row={`${rowIndex + 2}/${rowIndex + 3}`} column={`${columnIndex + 2}/${columnIndex + 3}`}>{value ? 'Yes' : 'No'}</Cell>)
                        counter += 1
                        return
                    }
                    default: {
                        cells = cells.append(<Cell key={counter} className="pt-4 pb-4 border-b-2 w-full" justify='start' row={`${rowIndex + 2}/${rowIndex + 3}`} column={`${columnIndex + 2}/${columnIndex + 3}`}>{value}</Cell>)
                        counter += 1
                    }
                }
            })
            const value = variable.values[keys[keys.length - 1]]
            switch (typeof value) {
                case 'boolean': {
                    cells = cells.append(<Cell key={counter} className="pr-2 pt-4 pb-4 border-b-2 w-full" justify='start' row={`${rowIndex + 2}/${rowIndex + 3}`} column={`${keys.length + 1}/${keys.length + 2}`}>{value ? 'Yes' : 'No'}</Cell>)
                    counter += 1
                    return
                }
                default: {
                    cells = cells.append(<Cell key={counter} className="pr-2 pt-4 pb-4 border-b-2 w-full" justify='start' row={`${rowIndex + 2}/${rowIndex + 3}`} column={`${keys.length + 1}/${keys.length + 2}`}>{value}</Cell>)
                    counter += 1
                }
            }
        } else {
            cells = cells.append(<Cell key={counter} className="pl-2 pt-4 pb-4 border-b-2 w-full font-bold bg-gray-50" row={`${rowIndex + 2}/${rowIndex + 3}`} column="1/2">{variable.variableName}</Cell>)
            counter += 1
            keys.slice(0, keys.length - 1).forEach((key, columnIndex) => {
                const value = variable.values[key]
                switch (typeof value) {
                    case 'boolean': {
                        cells = cells.append(<Cell key={counter} className="pt-4 pb-4 border-b-2 w-full bg-gray-50" justify='start' row={`${rowIndex + 2}/${rowIndex + 3}`} column={`${columnIndex + 2}/${columnIndex + 3}`}>{value ? 'Yes' : 'No'}</Cell>)
                        counter += 1
                        return
                    }
                    default: {
                        cells = cells.append(<Cell key={counter} className="pt-4 pb-4 border-b-2 w-full bg-gray-50" justify='start' row={`${rowIndex + 2}/${rowIndex + 3}`} column={`${columnIndex + 2}/${columnIndex + 3}`}>{value}</Cell>)
                        counter += 1
                    }
                }
            })
            const value = variable.values[keys[keys.length - 1]]
            switch (typeof value) {
                case 'boolean': {
                    cells = cells.append(<Cell key={counter} className="pr-2 pt-4 pb-4 border-b-2 w-full bg-gray-50" justify='start' row={`${rowIndex + 2}/${rowIndex + 3}`} column={`${keys.length + 1}/${keys.length + 2}`}>{value ? 'Yes' : 'No'}</Cell>)
                    counter += 1
                    return
                }
                default: {
                    cells = cells.append(<Cell key={counter} className="pr-2 pt-4 pb-4 border-b-2 w-full bg-gray-50" justify='start' row={`${rowIndex + 2}/${rowIndex + 3}`} column={`${keys.length + 1}/${keys.length + 2}`}>{value}</Cell>)
                    counter += 1
                }
            }
        }
    })
    return cells
}

type TableFooterProps = {
    area: Area
    layout: GridLayout
    state: Immutable<{
        limit: number
        offset: number
        page: string
    }>
    dispatch: React.Dispatch<{
        type: 'limit' | 'offset' | 'page'
        payload: string | number
    }>
    variables: Vector<any>
}

export function TableFooter(props: TableFooterProps) {
    const start = Math.min(props.state.limit * props.state.offset, props.variables.length())
    const end = Math.min(start + props.state.limit, props.variables.length())

    const firstPage = async (event: React.MouseEvent<HTMLButtonElement>) => {
        props.dispatch({
            type: 'offset',
            payload: 0
        })
    }

    const prevPage = async (event: React.MouseEvent<HTMLButtonElement>) => {
        props.dispatch({
            type: 'offset',
            payload: props.state.offset - 1
        })
    }

    const nextPage = async (event: React.MouseEvent<HTMLButtonElement>) => {
        props.dispatch({
            type: 'offset',
            payload: Math.min(Math.ceil(props.variables.length() / props.state.limit) - 1, props.state.offset + 1)
        })
    }

    const lastPage = async (event: React.MouseEvent<HTMLButtonElement>) => {
        props.dispatch({
            type: 'offset',
            payload: Math.ceil(props.variables.length() / props.state.limit) - 1
        })
    }

    const changePage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        props.dispatch({
            type: 'page',
            payload: event.target.value
        })
    }

    const setPage = async (event: React.MouseEvent<HTMLButtonElement>) => {
        props.dispatch({
            type: 'offset',
            payload: Math.min(Math.ceil(props.variables.length() / props.state.limit) - 1, parseInt(props.state.page) - 1)
        })
    }

    const rowUp = async (event: React.MouseEvent<HTMLButtonElement>) => {
        props.dispatch({
            type: 'limit',
            payload: props.state.limit + 5
        })
    }

    const rowDown = async (event: React.MouseEvent<HTMLButtonElement>) => {
        props.dispatch({
            type: 'limit',
            payload: props.state.limit - 5
        })
    }

    return (<Container area={props.area} layout={props.layout} className="bg-gray-100 border-gray-200 border-l-2 border-r-2 border-b-2">
        <Item align='center' className="mx-6">
            <span className="mx-2">
                Page: <Input onChange={changePage} value={props.state.page} /> / {Math.ceil(props.variables.length() / props.state.limit)}
                <button onClick={setPage} className="align-text-bottom focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </span>
            <span className="mx-2">
                {props.variables.length() !== 0 ? start + 1 : 0}-{end} of {props.variables.length()}
            </span>
            <span className="mx-2">
                Rows: {props.state.limit}
                <button onClick={rowUp} className="focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                </button>
                <button onClick={rowDown} className="focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                    </svg>
                </button>
            </span>
        </Item>
        <Item justify='end' align='center' className="mx-8">
            <button onClick={firstPage} className="focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
            </button>
            <button onClick={prevPage} className="focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button onClick={nextPage} className="focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
            <button onClick={lastPage} className="focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
            </button>
        </Item>
    </Container>)
}
