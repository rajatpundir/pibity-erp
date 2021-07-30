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
import { DiffRow, IndentItemRow, QuotationRow, QuotationItemRow } from '../../../main/rows'
import { IndentItem, IndentItemVariable, Quotation, QuotationVariable, QuotationItem, QuotationItemVariable } from '../../../main/variables'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: QuotationItemVariable
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 
    | ['variable', 'quotation', Quotation]
    | ['variable', 'indentItem', IndentItem]
    | ['variable', 'quantity', number]

    | ['replace', 'variable', QuotationItemVariable]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new QuotationItemVariable(-1, { quotation: new Quotation(-1), indentItem: new IndentItem(-1), quantity: 0 })
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
                    case 'quotation': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'indentItem': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'quantity': {
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

    const quotationItemType = types['QuotationItem']
    
    
    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.QuotationItem.toArray()
            var composedVariables = HashSet.of<Immutable<QuotationItemVariable>>().addAll(rows ? rows.map(x => QuotationItemRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as QuotationItemVariable])
            }
        }
    }, [state.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

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
            case 'quotation': {
                dispatch(['variable', event.target.name, new Quotation(parseInt(String(event.target.value)))])
                break
            }
            case 'indentItem': {
                dispatch(['variable', event.target.name, new IndentItem(parseInt(String(event.target.value)))])
                break
            }
            case 'quantity': {
                dispatch(['variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
        }
    }



    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createQuotationItem, {
            quotation: state.variable.values.quotation.hashCode(),
            indentItem: state.variable.values.indentItem.hashCode(),
            quantity: state.variable.values.quantity
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteQuotationItem, {
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
                        'create': `Create Quotation Item`,
                        'update': `Update Quotation Item`,
                        'show': `Quotation Item`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/quotation-item-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/quotation-item-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/quotation-item-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{quotationItemType.keys.quotation}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.quotation.hashCode()} name='quotation'>
                                    <option value='' selected disabled hidden>Select Quotation</option>
                                    {quotationList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(quotationList.filter(x => x.id.hashCode() === state.variable.values.quotation.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = quotationList.filter(x => x.id.hashCode() === state.variable.values.quotation.hashCode()).toArray()[0] as QuotationVariable
                                            return <Link to={`/quotation/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/quotation/${state.variable.values.quotation.hashCode()}`}>{state.variable.values.quotation.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{quotationItemType.keys.indentItem}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.indentItem.hashCode()} name='indentItem'>
                                    <option value='' selected disabled hidden>Select Indent Item</option>
                                    {indentItemList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(indentItemList.filter(x => x.id.hashCode() === state.variable.values.indentItem.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = indentItemList.filter(x => x.id.hashCode() === state.variable.values.indentItem.hashCode()).toArray()[0] as IndentItemVariable
                                            return <Link to={`/indent-item/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/indent-item/${state.variable.values.indentItem.hashCode()}`}>{state.variable.values.indentItem.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{quotationItemType.keys.quantity}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='number' onChange={onVariableInputChange} value={state.variable.values.quantity} name='quantity' />,
                                <div className='font-bold text-xl'>{state.variable.values.quantity}</div>
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
