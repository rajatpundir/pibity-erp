import { HashSet, Vector } from 'prelude-ts'
import { Immutable } from 'immer'
import tw from 'twin.macro'
import { Container, Item, TableContainer, Cell, validateLayout, Area, GridLayout } from './commons'
import { Variable } from './variables'

const body: Area = new Area('body')
const footer: Area = new Area('footer')

const layouts: { [index: string]: GridLayout } = {
    table: validateLayout({
        rowGap: '0rem',
        columnGap: '0rem',
        layout_mobile: {
            rows: Vector.of('1fr', '3rem'),
            columns: Vector.of('1fr'),
            areas: Vector.of(
                Vector.of(body),
                Vector.of(footer)
            )
        },
        layout_sm: {
            rows: Vector.of('1fr', '3rem'),
            columns: Vector.of('1fr'),
            areas: Vector.of(
                Vector.of(body),
                Vector.of(footer)
            )
        },
        layout_md: {
            rows: Vector.of('1fr', '3rem'),
            columns: Vector.of('1fr'),
            areas: Vector.of(
                Vector.of(body),
                Vector.of(footer)
            )
        },
        layout_lg: {
            rows: Vector.of('1fr', '3rem'),
            columns: Vector.of('1fr'),
            areas: Vector.of(
                Vector.of(body),
                Vector.of(footer)
            )
        },
        layout_xl: {
            rows: Vector.of('1fr', '3rem'),
            columns: Vector.of('1fr'),
            areas: Vector.of(
                Vector.of(body),
                Vector.of(footer)
            )
        }
    }),
    body: validateLayout({
        rowGap: '0rem',
        columnGap: '0rem',
        layout_mobile: {
            rows: Vector.of('1fr'),
            columns: Vector.of('1fr'),
            areas: Vector.of()
        },
        layout_sm: {
            rows: Vector.of('1fr'),
            columns: Vector.of('1fr'),
            areas: Vector.of()
        },
        layout_md: {
            rows: Vector.of('1fr'),
            columns: Vector.of('1fr'),
            areas: Vector.of()
        },
        layout_lg: {
            rows: Vector.of('1fr'),
            columns: Vector.of('1fr'),
            areas: Vector.of()
        },
        layout_xl: {
            rows: Vector.of('1fr'),
            columns: Vector.of('1fr'),
            areas: Vector.of()
        }
    }),
    footer: validateLayout({
        rowGap: '0rem',
        columnGap: '0rem',
        layout_mobile: {
            rows: Vector.of('1fr'),
            columns: Vector.of('1fr', '1fr'),
            areas: Vector.of()
        },
        layout_sm: {
            rows: Vector.of('1fr'),
            columns: Vector.of('1fr', '1fr'),
            areas: Vector.of()
        },
        layout_md: {
            rows: Vector.of('1fr'),
            columns: Vector.of('1fr', '1fr'),
            areas: Vector.of()
        },
        layout_lg: {
            rows: Vector.of('1fr'),
            columns: Vector.of('1fr', '1fr'),
            areas: Vector.of()
        },
        layout_xl: {
            rows: Vector.of('1fr'),
            columns: Vector.of('1fr', '1fr'),
            areas: Vector.of()
        }
    })
}

function getCells(variables: Immutable<HashSet<Variable>>, start: number, end: number): Vector<unknown> {
    var counter = 0
    var cells = Vector.of()
    variables.toArray().slice(start, end).forEach((variable, rowIndex) => {
        const keys: Array<string> = Object.keys(variable.values)
        if (rowIndex % 2 === 0) {
            cells = cells.append(<Cell key={counter} className="pl-4 pt-4 pb-4 border-b-2 w-full font-bold" row={`${rowIndex + 2}/${rowIndex + 3}`} column="1/2">{variable.variableName.toString()}</Cell>)
            counter += 1
            keys.slice(0, keys.length).forEach((key, columnIndex) => {
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
        } else {
            cells = cells.append(<Cell key={counter} className="pl-4 pt-4 pb-4 border-b-2 w-full font-bold bg-gray-50" row={`${rowIndex + 2}/${rowIndex + 3}`} column="1/2">{variable.variableName.toString()}</Cell>)
            counter += 1
            keys.slice(0, keys.length).forEach((key, columnIndex) => {
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
        }
    })
    return cells
}

type TableProps = {
    area: Area
    state: Immutable<{
        limit: number
        offset: number
        page: number
    }>
    dispatch: React.Dispatch<{
        type: 'limit' | 'offset' | 'page'
        payload: number
    }>
    variables: Immutable<HashSet<any>>
    columns: Vector<string>
}

export function Table(props: TableProps) {
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
            payload: parseInt(event.target.value)
        })
    }

    const setPage = async (event: React.MouseEvent<HTMLButtonElement>) => {
        props.dispatch({
            type: 'offset',
            payload: Math.min(Math.ceil(props.variables.length() / props.state.limit) - 1, parseInt(String(props.state.page)) - 1)
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
    
    return (<Container area={props.area} layout={layouts.table} >
        <TableContainer area={body} className="border-l-2 border-r-2 border-t-2 rounded-tl-xl rounded-tr-xl border-gray-300">
            <Cell row="1/2" column="1/2" className="bg-gray-800 rounded-tl-lg pl-4">
                <Column>{props.columns.toArray()[0]}</Column>
            </Cell>
            {
                props.columns.toArray().slice(1, props.columns.length() - 1).map((columnName, index) => {
                    return (<Cell key={columnName} row="1/2" column={`${index + 2}/${index + 3}`} className="bg-gray-800 -mx-1">
                        <Column>{columnName}</Column>
                    </Cell>)
                })
            }
            <Cell row="1/2" column={`${props.columns.length()}/${props.columns.length() + 1}`} className="bg-gray-800 rounded-tr-lg">
                <Column>{props.columns.toArray()[props.columns.length() - 1]}</Column>
            </Cell>
            {
                props.variables.length() !== 0 && start < props.variables.length()
                    ? getCells(props.variables, start, end)
                    : <Cell className="pt-4 pb-4 border-b-2 w-full font-bold text-center bg-gray-50" row="2/3" column={`1/${props.columns.length()}`}>No records found at specified page.</Cell>
            }
        </TableContainer>
        <Container area={footer} layout={layouts.footer} className="bg-gray-100 border-l-2 border-r-2 border-b-2 border-gray-300">
            <Item align='center' className="mx-6 whitespace-nowrap">
                <span className="mx-2">
                    Page: <Input type='number' onChange={changePage} value={props.state.page} /> / {Math.ceil(props.variables.length() / props.state.limit)}
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
        </Container>
    </Container>)
}

const Column = tw.div`text-white font-medium text-xl py-3 text-left`

export const Input = tw.input`p-1.5 text-gray-500 leading-tight border border-gray-400 shadow-inner hover:border-gray-600 w-10 h-6 rounded-sm inline-block`
