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
    variable: CurrencyRateVariable
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 
    | ['variable', 'currency', Currency]
    | ['variable', 'conversionRate', number]
    | ['variable', 'startTime', number]
    | ['variable', 'endTime', number]

    | ['replace', 'variable', CurrencyRateVariable]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new CurrencyRateVariable(-1, { currency: new Currency(-1), conversionRate: 0, startTime: 0, endTime: 0 })
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
                    case 'currency': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'conversionRate': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'startTime': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'endTime': {
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
            
            case 'replace': {
                switch (action[1]) {
                    case 'variable': {
                        state.variable = action[2]
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

    const currencyRateType = types['CurrencyRate']
    
    
    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.CurrencyRate.toArray()
            var composedVariables = HashSet.of<Immutable<CurrencyRateVariable>>().addAll(rows ? rows.map(x => CurrencyRateRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as CurrencyRateVariable])
            }
        }
    }, [state.variable.typeName, props.match.params, dispatch])

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
            case 'currency': {
                dispatch(['variable', event.target.name, new Currency(parseInt(String(event.target.value)))])
                break
            }
            case 'conversionRate': {
                dispatch(['variable', event.target.name, parseFloat(String(event.target.value))])
                break
            }
            case 'startTime': {
                dispatch(['variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
            case 'endTime': {
                dispatch(['variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
        }
    }



    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createCurrencyRate, {
            currency: state.variable.values.currency.hashCode(),
            conversionRate: state.variable.values.conversionRate,
            startTime: state.variable.values.startTime,
            endTime: state.variable.values.endTime
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteCurrencyRate, {
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
                        'create': `Create Currency Rate`,
                        'update': `Update Currency Rate`,
                        'show': `Currency Rate`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/currency-rate-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/currency-rate-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/currency-rate-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{currencyRateType.keys.currency}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.currency.hashCode()} name='currency'>
                                    <option value='' selected disabled hidden>Select Currency</option>
                                    {currencyList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(currencyList.filter(x => x.id.hashCode() === state.variable.values.currency.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = currencyList.filter(x => x.id.hashCode() === state.variable.values.currency.hashCode()).toArray()[0] as CurrencyVariable
                                            return <Link to={`/currency/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/currency/${state.variable.values.currency.hashCode()}`}>{state.variable.values.currency.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{currencyRateType.keys.conversionRate}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='number' onChange={onVariableInputChange} value={state.variable.values.conversionRate} name='conversionRate' />,
                                <div className='font-bold text-xl'>{state.variable.values.conversionRate}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{currencyRateType.keys.startTime}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='number' onChange={onVariableInputChange} value={state.variable.values.startTime} name='startTime' />,
                                <div className='font-bold text-xl'>{state.variable.values.startTime}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{currencyRateType.keys.endTime}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='number' onChange={onVariableInputChange} value={state.variable.values.endTime} name='endTime' />,
                                <div className='font-bold text-xl'>{state.variable.values.endTime}</div>
                            )
                        }
                    </Item>
                </Container>

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
