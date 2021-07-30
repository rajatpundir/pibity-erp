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
import { DiffRow, CurrencyRow, CurrencyRateRow } from '../../../main/rows'
import { Currency, CurrencyVariable, CurrencyRate, CurrencyRateVariable } from '../../../main/variables'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: CurrencyVariable
    currencyRateList: {
        typeName: 'CurrencyRate'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<Array<string>>
        variable: CurrencyRateVariable
        variables: HashSet<Immutable<CurrencyRateVariable>>
    }
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 
    | ['variable', 'name', string]

    | ['currencyRateList', 'limit', number]
    | ['currencyRateList', 'offset', number]
    | ['currencyRateList', 'page', number]
    | ['currencyRateList', 'query', Args]
    | ['currencyRateList', 'variable', 'currency', Currency]
    | ['currencyRateList', 'variable', 'conversionRate', number]
    | ['currencyRateList', 'variable', 'startTime', number]
    | ['currencyRateList', 'variable', 'endTime', number]
    | ['currencyRateList', 'addVariable']
    | ['replace', 'variable', CurrencyVariable]
    | ['replace', 'currencyRateList', HashSet<CurrencyRateVariable>]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new CurrencyVariable(-1, { name: '' }),
        currencyRateList: {
            typeName: 'CurrencyRate',
            query: getQuery('CurrencyRate'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'currency'], ['values', 'conversionRate'], ['values', 'startTime'], ['values', 'endTime']),
            variable: new CurrencyRateVariable(-1, { currency: new Currency(-1), conversionRate: 0, startTime: 0, endTime: 0 }),
            variables: HashSet.of<CurrencyRateVariable>()
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
                    case 'name': {
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
            
            case 'currencyRateList': {
                switch (action[1]) {
                    case 'limit': {
                        state[action[0]].limit = Math.max(initialState.currencyRateList.limit, action[2])
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
                            case 'currency': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'conversionRate': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'startTime': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'endTime': {
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
                        state.currencyRateList.variables = state.currencyRateList.variables.add(new CurrencyRateVariable(-1, {currency: new Currency(state.currencyRateList.variable.values.currency.hashCode()), conversionRate: state.currencyRateList.variable.values.conversionRate, startTime: state.currencyRateList.variable.values.startTime, endTime: state.currencyRateList.variable.values.endTime}))
                        state.currencyRateList.variable = initialState.currencyRateList.variable
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
                    case 'currencyRateList': {
                        state.currencyRateList.variables = action[2]
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

    const currencyType = types['Currency']
    const currencyRateType = types['CurrencyRate']
    
    const [addCurrencyRateDrawer, toggleAddCurrencyRateDrawer] = useState(false)
    const [currencyRateFilter, toggleCurrencyRateFilter] = useState(false)
    
    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.Currency.toArray()
            var composedVariables = HashSet.of<Immutable<CurrencyVariable>>().addAll(rows ? rows.map(x => CurrencyRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as CurrencyVariable])

                const currencyRateRows = await db.CurrencyRate.toArray()
                var composedCurrencyRateVariables = HashSet.of<Immutable<CurrencyRateVariable>>().addAll(currencyRateRows ? currencyRateRows.map(x => CurrencyRateRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedCurrencyRateVariables = composedCurrencyRateVariables.filter(x => !diff.variables[state.currencyRateList.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.currencyRateList.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.currencyRateList.variable.typeName].replace)
                })
                dispatch(['replace', 'currencyRateList', composedCurrencyRateVariables.filter(variable => variable.values.currency.hashCode() === props.match.params[0]) as HashSet<CurrencyRateVariable>])
            }
        }
    }, [state.variable.typeName, state.currencyRateList.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

    const currencyRows = useLiveQuery(() => db.Currency.toArray())?.map(x => CurrencyRow.toVariable(x))
    var currencyList = HashSet.of<Immutable<CurrencyVariable>>().addAll(currencyRows ? currencyRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        currencyList = currencyList.filter(x => !diff.variables.Currency.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.Currency.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.Currency.replace)
    })

    const currencyRateRows = useLiveQuery(() => db.CurrencyRate.toArray())?.map(x => CurrencyRateRow.toVariable(x))
    var currencyRateList = HashSet.of<Immutable<CurrencyRateVariable>>().addAll(currencyRateRows ? currencyRateRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        currencyRateList = currencyRateList.filter(x => !diff.variables.CurrencyRate.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.CurrencyRate.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.CurrencyRate.replace)
    })

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'name': {
                dispatch(['variable', event.target.name, String(event.target.value)])
                break
            }
        }
    }
    const onCurrencyRateInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'currency': {
                dispatch(['currencyRateList', 'variable', event.target.name, new Currency(parseInt(String(event.target.value)))])
                break
            }
            case 'conversionRate': {
                dispatch(['currencyRateList', 'variable', event.target.name, parseFloat(String(event.target.value))])
                break
            }
            case 'startTime': {
                dispatch(['currencyRateList', 'variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
            case 'endTime': {
                dispatch(['currencyRateList', 'variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
        }
    }

    const updateItemsQuery = (list: 'currencyRateList') => {
        const fx = (args: Args) => {
            switch (list) {
                case 'currencyRateList': {
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

    const updatePage = (list: 'currencyRateList') => {
        const fx = (args: ['limit', number] | ['offset', number] | ['page', number]) => {
            dispatch([list, args[0], args[1]])
        }
        return fx
    }

    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createCurrency, {
            name: state.variable.values.name,
            currencyRateList: state.currencyRateList.variables.toArray().map(variable => {
                return {
                    currency: variable.values.currency.hashCode(),
                    conversionRate: variable.values.conversionRate,
                    startTime: variable.values.startTime,
                    endTime: variable.values.endTime
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteCurrency, {
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
                        'create': `Create Currency`,
                        'update': `Update Currency`,
                        'show': `Currency`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/currency-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/currency-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/currency-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{currencyType.keys.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.name} name='name' />,
                                <div className='font-bold text-xl'>{state.variable.values.name}</div>
                            )
                        }
                    </Item>
                </Container>
                <Container area={Grid.currencyRateArea} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title> Currency Rate List</Title>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <button onClick={() => toggleAddCurrencyRateDrawer(true)} className='text-3xl font-bold text-white bg-gray-800 rounded-md px-2 h-10 focus:outline-none'>+</button>,
                                undefined
                            )
                        }
                    </Item>
                    <Item area={Grid2.filter} justify='end' align='center' className='flex'>
                        <Button onClick={() => toggleCurrencyRateFilter(true)}>Filter</Button>
                        <Drawer open={currencyRateFilter} onClose={() => toggleCurrencyRateFilter(false)} anchor={'right'}>
                            <Filter typeName='CurrencyRate' query={state['currencyRateList'].query} updateQuery={updateItemsQuery('currencyRateList')} />
                        </Drawer>
                        <Drawer open={addCurrencyRateDrawer} onClose={() => toggleAddCurrencyRateDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add {currencyRateType.name}</div>
                                <Container area={none} layout={Grid.layouts.uom} className=''>
                                    <Item>
                                        <Label>{currencyRateType.keys.currency}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onCurrencyRateInputChange} value={state.currencyRateList.variable.values.currency.hashCode()} name='currency'>
                                                    <option value='' selected disabled hidden>Select Currency</option>
                                                    {currencyList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(currencyList.filter(x => x.id.hashCode() === state.currencyRateList.variable.values.currency.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = currencyList.filter(x => x.id.hashCode() === state.currencyRateList.variable.values.currency.hashCode()).toArray()[0] as CurrencyVariable
                                                            return <Link to={`/currency/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/currency/${state.currencyRateList.variable.values.currency.hashCode()}`}>{state.currencyRateList.variable.values.currency.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{currencyRateType.keys.conversionRate}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='number' onChange={onCurrencyRateInputChange} value={state.currencyRateList.variable.values.conversionRate} name='conversionRate' />,
                                                <div className='font-bold text-xl'>{state.currencyRateList.variable.values.conversionRate}</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{currencyRateType.keys.startTime}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='number' onChange={onCurrencyRateInputChange} value={state.currencyRateList.variable.values.startTime} name='startTime' />,
                                                <div className='font-bold text-xl'>{state.currencyRateList.variable.values.startTime}</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{currencyRateType.keys.endTime}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='number' onChange={onCurrencyRateInputChange} value={state.currencyRateList.variable.values.endTime} name='endTime' />,
                                                <div className='font-bold text-xl'>{state.currencyRateList.variable.values.endTime}</div>
                                            )
                                        }
                                    </Item>
                                    <Item justify='center' align='center'>
                                        <Button onClick={() => dispatch(['currencyRateList', 'addVariable'])}>Add</Button>
                                    </Item>
                                </Container>
                            </div>
                        </Drawer>
                    </Item>
                    <Table area={Grid2.table} state={state['currencyRateList']} updatePage={updatePage('currencyRateList')} variables={state.currencyRateList.variables.filter(variable => applyFilter(state['currencyRateList'].query, variable)).toArray()} columns={state['currencyRateList'].columns.toArray()} />
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
