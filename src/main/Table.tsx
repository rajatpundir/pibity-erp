import { HashSet, Vector } from 'prelude-ts'
import { Immutable } from 'immer'
import tw from 'twin.macro'
import { Container, Item, TableContainer, Cell, validateLayout, Area, GridLayout } from './commons'
import { Variable } from './variables'
import { NonPrimitiveType, Type, types } from './types'
import { getState } from './store'
import { Link } from 'react-router-dom'

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

function W(type: Type, path: Array<string>): string {
    if (path.length !== 0) {
        switch (path[0]) {
            case 'variableName': {
                return type.name
            }
            case 'values': {
                if (path[1] !== undefined) {
                    if (Object.keys(type.keys).includes(path[1])) {
                        const key = type.keys[path[1]]
                        if (path[2] === undefined) {
                            return key.name
                        } else {
                            return W(types[key.type], path.slice(2))
                        }
                    }
                }
            }
        }
    }
    return ''
}

function Q(variable: Immutable<Variable>, path: Array<string>): [string, string] {
    const type = types[variable.typeName] as Type
    if (path.length !== 0) {
        switch (path[0]) {
            case 'variableName': {
                return [variable.variableName.toString(), type.url ? type.url : '']
            }
            case 'values': {
                if (path[1] !== undefined) {
                    if (Object.keys(variable.values).includes(path[1])) {
                        const value = variable.values[path[1]]
                        if (path[2] === undefined) {
                            if (typeof value === 'object') {
                                const keyType = types[type.keys[path[1]].type] as Type
                                return [value.toString(), keyType.url ? keyType.url : '']
                            } else {
                                if (typeof value === 'boolean') {
                                    return [value ? 'Yes' : 'No', '']
                                } else {
                                    return [value, '']
                                }
                            }
                        } else {
                            if (typeof path === 'object') {
                                if (Object.keys(type.keys).includes(path[1])) {
                                    const referencedVariableName: string = value.toString()
                                    const unfilteredVariables: HashSet<Immutable<Variable>> = getState().variables[types[variable.typeName].keys[path[1]].type]
                                    const variables = unfilteredVariables.filter(x => x.variableName.toString() === referencedVariableName)
                                    if (variables.length() === 1) {
                                        return Q(variables.toArray()[0], path.slice(2))
                                    } else {
                                        // Note: Referenced variable not found in Zustand Store (Base + Diff)
                                        // Resolution: 
                                        // 1. Check Dexie for variable and load into Zustand Store
                                        // 2. If not found in Dexie, check backend and load it into Dexie/Zustand
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return ['', '']
}

function getCells(columns: Array<Array<string>>, variables: Immutable<HashSet<Variable>>, start: number, end: number) {
    var cells = Vector.of()
    variables.toArray().slice(start, end).forEach((variable, rowIndex) => {
        if (rowIndex % 2 !== 0) {
            columns.forEach((path, columnIndex) => {
                const cellValue = Q(variable, path)
                if (columns.length === 1) {
                    cells = cells.append(<Cell key={`${rowIndex},${columnIndex}`} className="pl-4 pt-4 pb-4 border-b-2 w-full font-bold"
                        row={`${rowIndex + 2}/${rowIndex + 3}`} column={`${columnIndex + 1}/${columnIndex + 2}`}>
                        {cellValue[1] === '' ? cellValue[0] : <Link to={`${cellValue[1]}/${cellValue[0]}`}>{cellValue[0]}</Link>} </Cell>)
                } else {
                    if (columnIndex === 0) {
                        const cellValue = Q(variable, path)
                        cells = cells.append(<Cell key={`${rowIndex},${columnIndex}`} className="pl-4 pt-4 pb-4 border-b-2 w-full font-bold" row={`${rowIndex + 2}/${rowIndex + 3}`} column={`${columnIndex + 1}/${columnIndex + 2}`}>
                            {cellValue[1] === '' ? cellValue[0] : <Link to={`${cellValue[1]}/${cellValue[0]}`}>{cellValue[0]}</Link>} </Cell>)
                    } else if (columnIndex === columns.length - 1) {
                        cells = cells.append(<Cell key={`${rowIndex},${columnIndex}`} className="pt-4 pb-4 border-b-2 w-full" justify='start' row={`${rowIndex + 2}/${rowIndex + 3}`} column={`${columnIndex + 1}/${columnIndex + 2}`}>
                            {cellValue[1] === '' ? cellValue[0] : <Link to={`${cellValue[1]}/${cellValue[0]}`}>{cellValue[0]}</Link>} </Cell>)
                    } else {
                        cells = cells.append(<Cell key={`${rowIndex},${columnIndex}`} className="pt-4 pb-4 border-b-2 w-full" justify='start' row={`${rowIndex + 2}/${rowIndex + 3}`} column={`${columnIndex + 1}/${columnIndex + 2}`}>
                            {cellValue[1] === '' ? cellValue[0] : <Link to={`${cellValue[1]}/${cellValue[0]}`}>{cellValue[0]}</Link>} </Cell>)
                    }
                }
            })
        } else {
            columns.forEach((path, columnIndex) => {
                const cellValue = Q(variable, path)
                if (columns.length === 1) {
                    cells = cells.append(<Cell key={`${rowIndex},${columnIndex}`} className="pl-4 pt-4 pb-4 border-b-2 w-full font-bold bg-gray-50" row={`${rowIndex + 2}/${rowIndex + 3}`} column={`${columnIndex + 1}/${columnIndex + 2}`}>
                        {cellValue[1] === '' ? cellValue[0] : <Link to={`${cellValue[1]}/${cellValue[0]}`}>{cellValue[0]}</Link>} </Cell>)
                } else {
                    if (columnIndex === 0) {
                        cells = cells.append(<Cell key={`${rowIndex},${columnIndex}`} className="pl-4 pt-4 pb-4 border-b-2 w-full font-bold bg-gray-50" row={`${rowIndex + 2}/${rowIndex + 3}`} column={`${columnIndex + 1}/${columnIndex + 2}`}>
                            {cellValue[1] === '' ? cellValue[0] : <Link to={`${cellValue[1]}/${cellValue[0]}`}>{cellValue[0]}</Link>} </Cell>)
                    } else if (columnIndex === columns.length - 1) {
                        cells = cells.append(<Cell key={`${rowIndex},${columnIndex}`} className="pt-4 pb-4 border-b-2 w-full bg-gray-50" justify='start' row={`${rowIndex + 2}/${rowIndex + 3}`} column={`${columnIndex + 1}/${columnIndex + 2}`}>
                            {cellValue[1] === '' ? cellValue[0] : <Link to={`${cellValue[1]}/${cellValue[0]}`}>{cellValue[0]}</Link>} </Cell>)
                    } else {
                        cells = cells.append(<Cell key={`${rowIndex},${columnIndex}`} className="pt-4 pb-4 border-b-2 w-full bg-gray-50" justify='start' row={`${rowIndex + 2}/${rowIndex + 3}`} column={`${columnIndex + 1}/${columnIndex + 2}`}>
                            {cellValue[1] === '' ? cellValue[0] : <Link to={`${cellValue[1]}/${cellValue[0]}`}>{cellValue[0]}</Link>} </Cell>)
                    }
                }
            })
        }
    })
    Array.from(Array((end - start) - variables.toArray().slice(start, end).length), (_, i) => i + 1).forEach( i => {
        const rowIndex = variables.toArray().slice(start, end).length + i
        if(i % 2 !== 0) {
            columns.forEach((path, columnIndex) => {
                if (columns.length === 1) {
                    cells = cells.append(<Cell key={`${rowIndex},${columnIndex}`} className="pl-4 pt-4 pb-4 border-b-2 w-full font-bold" row={`${rowIndex + 2}/${rowIndex + 3}`} column={`${columnIndex + 1}/${columnIndex + 2}`}>&#160;</Cell>)
                } else {
                    if (columnIndex === 0) {
                        cells = cells.append(<Cell key={`${rowIndex},${columnIndex}`} className="pl-4 pt-4 pb-4 border-b-2 w-full font-bold" row={`${rowIndex + 2}/${rowIndex + 3}`} column={`${columnIndex + 1}/${columnIndex + 2}`}>&#160;</Cell>)
                    } else if (columnIndex === columns.length - 1) {
                        cells = cells.append(<Cell key={`${rowIndex},${columnIndex}`} className="pt-4 pb-4 border-b-2 w-full" justify='start' row={`${rowIndex + 2}/${rowIndex + 3}`} column={`${columnIndex + 1}/${columnIndex + 2}`}>&#160;</Cell>)
                    } else {
                        cells = cells.append(<Cell key={`${rowIndex},${columnIndex}`} className="pt-4 pb-4 border-b-2 w-full" justify='start' row={`${rowIndex + 2}/${rowIndex + 3}`} column={`${columnIndex + 1}/${columnIndex + 2}`}>&#160;</Cell>)
                    }
                }
            })
        } else {
            columns.forEach((path, columnIndex) => {
                if (columns.length === 1) {
                    cells = cells.append(<Cell key={`${rowIndex},${columnIndex}`} className="pl-4 pt-4 pb-4 border-b-2 w-full font-bold bg-gray-50" row={`${rowIndex + 2}/${rowIndex + 3}`} column={`${columnIndex + 1}/${columnIndex + 2}`}>&#160;</Cell>)
                } else {
                    if (columnIndex === 0) {
                        cells = cells.append(<Cell key={`${rowIndex},${columnIndex}`} className="pl-4 pt-4 pb-4 border-b-2 w-full font-bold bg-gray-50" row={`${rowIndex + 2}/${rowIndex + 3}`} column={`${columnIndex + 1}/${columnIndex + 2}`}>&#160;</Cell>)
                    } else if (columnIndex === columns.length - 1) {
                        cells = cells.append(<Cell key={`${rowIndex},${columnIndex}`} className="pt-4 pb-4 border-b-2 w-full bg-gray-50" justify='start' row={`${rowIndex + 2}/${rowIndex + 3}`} column={`${columnIndex + 1}/${columnIndex + 2}`}>&#160;</Cell>)
                    } else {
                        cells = cells.append(<Cell key={`${rowIndex},${columnIndex}`} className="pt-4 pb-4 border-b-2 w-full bg-gray-50" justify='start' row={`${rowIndex + 2}/${rowIndex + 3}`} column={`${columnIndex + 1}/${columnIndex + 2}`}>&#160;</Cell>)
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
        typeName: NonPrimitiveType
        limit: number
        offset: number
        page: number
    }>
    updatePage: (args: ['limit', number] | ['offset', number] | ['page', number]) => void
    variables: Immutable<HashSet<any>>
    columns: Array<Array<string>>
}

export function Table(props: TableProps) {
    const start = Math.min(props.state.limit * props.state.offset, props.variables.length())
    const end = start + props.state.limit

    const firstPage = async (event: React.MouseEvent<HTMLButtonElement>) => {
        props.updatePage(['offset', 0])
    }

    const prevPage = async (event: React.MouseEvent<HTMLButtonElement>) => {
        props.updatePage(['offset', props.state.offset - 1])
    }

    const nextPage = async (event: React.MouseEvent<HTMLButtonElement>) => {
        props.updatePage(['offset', Math.min(Math.ceil(props.variables.length() / props.state.limit) - 1, props.state.offset + 1)])
    }

    const lastPage = async (event: React.MouseEvent<HTMLButtonElement>) => {
        props.updatePage(['offset', Math.ceil(props.variables.length() / props.state.limit) - 1])
    }

    const changePage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        props.updatePage(['page', parseInt(event.target.value)])
    }

    const setPage = async (event: React.MouseEvent<HTMLButtonElement>) => {
        props.updatePage(['offset', Math.min(Math.ceil(props.variables.length() / props.state.limit) - 1, parseInt(String(props.state.page)) - 1)])
    }

    const rowUp = async (event: React.MouseEvent<HTMLButtonElement>) => {
        props.updatePage(['limit', props.state.limit + 5])
    }

    const rowDown = async (event: React.MouseEvent<HTMLButtonElement>) => {
        props.updatePage(['limit', props.state.limit - 5])
    }

    return (<Container area={props.area} layout={layouts.table} >
        <TableContainer area={body} className="border-l-2 border-r-2 border-t-2 rounded-tl-xl rounded-tr-xl border-gray-300">
            {
                props.columns.map((path, index) => {
                    if (props.columns.length === 1) {
                        return (<Cell row="1/2" column="1/2" className="bg-gray-800 rounded-tl-lg rounded-tr-lg pl-4">
                            <Column>{W(types[props.state.typeName] as Type, path)}</Column>
                        </Cell>)
                    } else {
                        if (index === 0) {
                            return (<Cell key={index} row="1/2" column={`${index + 1}/${index + 2}`} className="bg-gray-800 rounded-tl-lg pl-4">
                                <Column>{W(types[props.state.typeName] as Type, path)}</Column>
                            </Cell>)
                        } else if (index === props.columns.length - 1) {
                            return (<Cell key={index} row="1/2" column={`${index + 1}/${index + 2}`} className="bg-gray-800 rounded-tr-lg">
                                <Column>{W(types[props.state.typeName] as Type, path)}</Column>
                            </Cell>)
                        } else {
                            return (<Cell key={index} row="1/2" column={`${index + 1}/${index + 2}`} className="bg-gray-800 -mx-1">
                                <Column>{W(types[props.state.typeName] as Type, path)}</Column>
                            </Cell>)
                        }
                    }
                })
            }
            {
                props.variables.length() !== 0 && start < props.variables.length()
                    ? getCells(props.columns, props.variables, start, end)
                    : <Cell className="pt-4 pb-4 border-b-2 w-full font-bold text-center bg-gray-50" row="2/3" column={`1/${props.columns.length + 1}`}>No records found at specified page.</Cell>
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
            <Item justify='end' align='center' className="mx-8 whitespace-nowrap">
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
