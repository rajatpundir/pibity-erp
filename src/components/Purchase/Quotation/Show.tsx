import React, { useEffect, useState } from 'react'
import { Immutable, Draft } from 'immer'
import { useImmerReducer } from 'use-immer'
import tw from 'twin.macro'
import { HashSet, Vector } from 'prelude-ts'
import { Drawer } from '@material-ui/core'
import { executeCircuit } from '../../../main/circuit'
import { types } from '../../../main/types'
import { Container, Item, none } from '../../../main/commons'
import { Table } from '../../../main/Table'
import { Query, Filter, Args, getQuery, updateQuery, applyFilter } from '../../../main/Filter'
import * as Grid from './grids/Show'
import * as Grid2 from './grids/List'
import { withRouter, Link } from 'react-router-dom'
import { circuits } from '../../../main/circuits'
import { iff, when } from '../../../main/utils'
import { db } from '../../../main/dexie'
import { useCallback } from 'react'
import { updateVariable } from '../../../main/mutation'
import { useLiveQuery } from 'dexie-react-hooks'
import { DiffRow, CompanyRow, IndentRow, IndentItemRow, QuotationRow, QuotationItemRow } from '../../../main/rows'
import { Company, CompanyVariable, Indent, IndentVariable, IndentItem, IndentItemVariable, Quotation, QuotationVariable, QuotationItemVariable } from '../../../main/variables'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: QuotationVariable
    quotationItemList: {
        typeName: 'QuotationItem'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<Array<string>>
        variable: QuotationItemVariable
        variables: HashSet<Immutable<QuotationItemVariable>>
    }
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 
    | ['variable', 'indent', Indent]
    | ['variable', 'company', Company]

    | ['quotationItemList', 'limit', number]
    | ['quotationItemList', 'offset', number]
    | ['quotationItemList', 'page', number]
    | ['quotationItemList', 'query', Args]
    | ['quotationItemList', 'variable', 'quotation', Quotation]
    | ['quotationItemList', 'variable', 'indentItem', IndentItem]
    | ['quotationItemList', 'variable', 'quantity', number]
    | ['quotationItemList', 'addVariable']
    | ['replace', 'variable', QuotationVariable]
    | ['replace', 'quotationItemList', HashSet<QuotationItemVariable>]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new QuotationVariable(-1, { indent: new Indent(-1), company: new Company(-1) }),
        quotationItemList: {
            typeName: 'QuotationItem',
            query: getQuery('QuotationItem'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'quotation'], ['values', 'indentItem'], ['values', 'quantity']),
            variable: new QuotationItemVariable(-1, { quotation: new Quotation(-1), indentItem: new IndentItem(-1), quantity: 0 }),
            variables: HashSet.of<QuotationItemVariable>()
        }
    }
    
    function reducer(state: Draft<State>, action: Action) {
        switch (action[0]) {
            case 'toggleMode': {
                state.mode = when(state.mode, {
                    'create': 'create',
                    'update': 'show',
                    'show': 'update'
                })
                break
            }
            case 'resetVariable': {
                return action[1]
            }
            case 'variable': {
                switch (action[1]) {
                    case 'indent': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'company': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    default: {
                        const _exhaustiveCheck: never = action;
                        return _exhaustiveCheck;
                    }
                }
                break
            }
            
            case 'quotationItemList': {
                switch (action[1]) {
                    case 'limit': {
                        state[action[0]].limit = Math.max(initialState.quotationItemList.limit, action[2])
                        break
                    }
                    case 'offset': {
                        state[action[0]].offset = Math.max(0, action[2])
                        state[action[0]].page = Math.max(0, action[2]) + 1
                        break
                    }
                    case 'page': {
                        state[action[0]].page = action[2]
                        break
                    }
                    case 'query': {
                        updateQuery(state[action[0]].query, action[2])
                        break
                    }
                    case 'variable': {
                        switch (action[2]) {
                            case 'quotation': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'indentItem': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'quantity': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            default: {
                                const _exhaustiveCheck: never = action;
                                return _exhaustiveCheck;
                            }
                        }
                        break
                    }
                    case 'addVariable': {
                        state.quotationItemList.variables = state.quotationItemList.variables.add(new QuotationItemVariable(-1, {quotation: new Quotation(state.quotationItemList.variable.values.quotation.hashCode()), indentItem: new IndentItem(state.quotationItemList.variable.values.indentItem.hashCode()), quantity: state.quotationItemList.variable.values.quantity}))
                        state.quotationItemList.variable = initialState.quotationItemList.variable
                        break
                    }
                    default: {
                        const _exhaustiveCheck: never = action
                        return _exhaustiveCheck
                    }
                }
                break
            }
            case 'replace': {
                switch (action[1]) {
                    case 'variable': {
                        state.variable = action[2]
                        break
                    }
                    case 'quotationItemList': {
                        state.quotationItemList.variables = action[2]
                        break
                    }
                    default: {
                        const _exhaustiveCheck: never = action
                        return _exhaustiveCheck
                    }
                }
                break
            }
            default: {
                const _exhaustiveCheck: never = action
                return _exhaustiveCheck
            }
        }
    }

    const [state, dispatch] = useImmerReducer<State, Action>(reducer, initialState)

    const quotationType = types['Quotation']
    const quotationItemType = types['QuotationItem']
    
    const [addQuotationItemDrawer, toggleAddQuotationItemDrawer] = useState(false)
    const [quotationItemFilter, toggleQuotationItemFilter] = useState(false)
    
    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.Quotation.toArray()
            var composedVariables = HashSet.of<Immutable<QuotationVariable>>().addAll(rows ? rows.map(x => QuotationRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as QuotationVariable])

                const quotationItemRows = await db.QuotationItem.toArray()
                var composedQuotationItemVariables = HashSet.of<Immutable<QuotationItemVariable>>().addAll(quotationItemRows ? quotationItemRows.map(x => QuotationItemRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedQuotationItemVariables = composedQuotationItemVariables.filter(x => !diff.variables[state.quotationItemList.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.quotationItemList.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.quotationItemList.variable.typeName].replace)
                })
                dispatch(['replace', 'quotationItemList', composedQuotationItemVariables.filter(variable => variable.values.quotation.hashCode() === props.match.params[0]) as HashSet<QuotationItemVariable>])
            }
        }
    }, [state.variable.typeName, state.quotationItemList.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

    const companyRows = useLiveQuery(() => db.Company.toArray())?.map(x => CompanyRow.toVariable(x))
    var companyList = HashSet.of<Immutable<CompanyVariable>>().addAll(companyRows ? companyRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        companyList = companyList.filter(x => !diff.variables.Company.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.Company.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.Company.replace)
    })

    const indentRows = useLiveQuery(() => db.Indent.toArray())?.map(x => IndentRow.toVariable(x))
    var indentList = HashSet.of<Immutable<IndentVariable>>().addAll(indentRows ? indentRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        indentList = indentList.filter(x => !diff.variables.Indent.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.Indent.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.Indent.replace)
    })

    const indentItemRows = useLiveQuery(() => db.IndentItem.toArray())?.map(x => IndentItemRow.toVariable(x))
    var indentItemList = HashSet.of<Immutable<IndentItemVariable>>().addAll(indentItemRows ? indentItemRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        indentItemList = indentItemList.filter(x => !diff.variables.IndentItem.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.IndentItem.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.IndentItem.replace)
    })

    const quotationRows = useLiveQuery(() => db.Quotation.toArray())?.map(x => QuotationRow.toVariable(x))
    var quotationList = HashSet.of<Immutable<QuotationVariable>>().addAll(quotationRows ? quotationRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        quotationList = quotationList.filter(x => !diff.variables.Quotation.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.Quotation.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.Quotation.replace)
    })

    const quotationItemRows = useLiveQuery(() => db.QuotationItem.toArray())?.map(x => QuotationItemRow.toVariable(x))
    var quotationItemList = HashSet.of<Immutable<QuotationItemVariable>>().addAll(quotationItemRows ? quotationItemRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        quotationItemList = quotationItemList.filter(x => !diff.variables.QuotationItem.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.QuotationItem.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.QuotationItem.replace)
    })

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'indent': {
                dispatch(['variable', event.target.name, new Indent(parseInt(String(event.target.value)))])
                break
            }
            case 'company': {
                dispatch(['variable', event.target.name, new Company(parseInt(String(event.target.value)))])
                break
            }
        }
    }
    const onQuotationItemInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'quotation': {
                dispatch(['quotationItemList', 'variable', event.target.name, new Quotation(parseInt(String(event.target.value)))])
                break
            }
            case 'indentItem': {
                dispatch(['quotationItemList', 'variable', event.target.name, new IndentItem(parseInt(String(event.target.value)))])
                break
            }
            case 'quantity': {
                dispatch(['quotationItemList', 'variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
        }
    }

    const updateItemsQuery = (list: 'quotationItemList') => {
        const fx = (args: Args) => {
            switch (list) {
                case 'quotationItemList': {
                    dispatch([list, 'query', args])
                    break
                }
                default: {
                    const _exhaustiveCheck: never = list
                    return _exhaustiveCheck
                }
            }
        }
        return fx
    }

    const updatePage = (list: 'quotationItemList') => {
        const fx = (args: ['limit', number] | ['offset', number] | ['page', number]) => {
            dispatch([list, args[0], args[1]])
        }
        return fx
    }

    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createQuotation, {
            indent: state.variable.values.indent.hashCode(),
            company: state.variable.values.company.hashCode(),
            quotationItemList: state.quotationItemList.variables.toArray().map(variable => {
                return {
                    quotation: variable.values.quotation.hashCode(),
                    indentItem: variable.values.indentItem.hashCode(),
                    quantity: variable.values.quantity
                }
            })
        })
        console.log(result, symbolFlag, diff)
        if (symbolFlag) {
            db.diffs.put(diff.toRow())
        }
    }

    const modifyVariable = async () => {
        const [, diff] = await updateVariable(state.variable, state.variable.toRow().values)
        console.log(diff)
        db.diffs.put(diff.toRow())
    }

    const deleteVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteQuotation, {
            id: state.variable.id.hashCode(),
            items: [{}]
        })
        console.log(result, symbolFlag, diff)
        if (symbolFlag) {
            db.diffs.put(diff.toRow())
        }
    }

    return iff(true,
        () => {
            return <Container area={none} layout={Grid.layouts.main}>
                <Item area={Grid.header}>
                    <Title>{when(state.mode, {
                        'create': `Create Quotation`,
                        'update': `Update Quotation`,
                        'show': `Quotation`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/quotation-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/quotation-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/quotation-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{quotationType.keys.indent}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.indent.hashCode()} name='indent'>
                                    <option value='' selected disabled hidden>Select Indent</option>
                                    {indentList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(indentList.filter(x => x.id.hashCode() === state.variable.values.indent.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = indentList.filter(x => x.id.hashCode() === state.variable.values.indent.hashCode()).toArray()[0] as IndentVariable
                                            return <Link to={`/indent/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/indent/${state.variable.values.indent.hashCode()}`}>{state.variable.values.indent.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{quotationType.keys.company}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.company.hashCode()} name='company'>
                                    <option value='' selected disabled hidden>Select Company</option>
                                    {companyList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(companyList.filter(x => x.id.hashCode() === state.variable.values.company.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = companyList.filter(x => x.id.hashCode() === state.variable.values.company.hashCode()).toArray()[0] as CompanyVariable
                                            return <Link to={`/company/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/company/${state.variable.values.company.hashCode()}`}>{state.variable.values.company.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                </Container>
                <Container area={Grid.quotationItemArea} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title> Quotation Item List</Title>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <button onClick={() => toggleAddQuotationItemDrawer(true)} className='text-3xl font-bold text-white bg-gray-800 rounded-md px-2 h-10 focus:outline-none'>+</button>,
                                undefined
                            )
                        }
                    </Item>
                    <Item area={Grid2.filter} justify='end' align='center' className='flex'>
                        <Button onClick={() => toggleQuotationItemFilter(true)}>Filter</Button>
                        <Drawer open={quotationItemFilter} onClose={() => toggleQuotationItemFilter(false)} anchor={'right'}>
                            <Filter typeName='QuotationItem' query={state['quotationItemList'].query} updateQuery={updateItemsQuery('quotationItemList')} />
                        </Drawer>
                        <Drawer open={addQuotationItemDrawer} onClose={() => toggleAddQuotationItemDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add {quotationItemType.name}</div>
                                <Container area={none} layout={Grid.layouts.uom} className=''>
                                    <Item>
                                        <Label>{quotationItemType.keys.quotation}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onQuotationItemInputChange} value={state.quotationItemList.variable.values.quotation.hashCode()} name='quotation'>
                                                    <option value='' selected disabled hidden>Select Quotation</option>
                                                    {quotationList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(quotationList.filter(x => x.id.hashCode() === state.quotationItemList.variable.values.quotation.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = quotationList.filter(x => x.id.hashCode() === state.quotationItemList.variable.values.quotation.hashCode()).toArray()[0] as QuotationVariable
                                                            return <Link to={`/quotation/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/quotation/${state.quotationItemList.variable.values.quotation.hashCode()}`}>{state.quotationItemList.variable.values.quotation.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{quotationItemType.keys.indentItem}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onQuotationItemInputChange} value={state.quotationItemList.variable.values.indentItem.hashCode()} name='indentItem'>
                                                    <option value='' selected disabled hidden>Select Indent Item</option>
                                                    {indentItemList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(indentItemList.filter(x => x.id.hashCode() === state.quotationItemList.variable.values.indentItem.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = indentItemList.filter(x => x.id.hashCode() === state.quotationItemList.variable.values.indentItem.hashCode()).toArray()[0] as IndentItemVariable
                                                            return <Link to={`/indent-item/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/indent-item/${state.quotationItemList.variable.values.indentItem.hashCode()}`}>{state.quotationItemList.variable.values.indentItem.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{quotationItemType.keys.quantity}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='number' onChange={onQuotationItemInputChange} value={state.quotationItemList.variable.values.quantity} name='quantity' />,
                                                <div className='font-bold text-xl'>{state.quotationItemList.variable.values.quantity}</div>
                                            )
                                        }
                                    </Item>
                                    <Item justify='center' align='center'>
                                        <Button onClick={() => dispatch(['quotationItemList', 'addVariable'])}>Add</Button>
                                    </Item>
                                </Container>
                            </div>
                        </Drawer>
                    </Item>
                    <Table area={Grid2.table} state={state['quotationItemList']} updatePage={updatePage('quotationItemList')} variables={state.quotationItemList.variables.filter(variable => applyFilter(state['quotationItemList'].query, variable)).toArray()} columns={state['quotationItemList'].columns.toArray()} />
                </Container > 
            </Container>
        }, <div>Variable not found</div>)
}

export default withRouter(Component)

const Title = tw.div`py-8 text-4xl text-gray-800 font-bold mx-1 whitespace-nowrap`

const Label = tw.label`w-1/2 whitespace-nowrap`

// const InlineLabel = tw.label`inline-block w-1/2`

const Select = tw.select`p-1.5 text-gray-500 leading-tight border border-gray-400 shadow-inner hover:border-gray-600 w-full rounded-sm`

const Input = tw.input`p-1.5 text-gray-500 leading-tight border border-gray-400 shadow-inner hover:border-gray-600 w-full rounded-sm`

const Button = tw.button`bg-gray-900 text-white text-center font-bold p-2 mx-1 uppercase w-40 h-full max-w-sm rounded-lg focus:outline-none inline-block`
