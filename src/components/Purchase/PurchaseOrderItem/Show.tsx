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
import { DiffRow, PurchaseOrderRow, PurchaseOrderItemRow, QuotationItemRow } from '../../../main/rows'
import { PurchaseOrder, PurchaseOrderVariable, PurchaseOrderItem, PurchaseOrderItemVariable, QuotationItem, QuotationItemVariable } from '../../../main/variables'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: PurchaseOrderItemVariable
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 
    | ['variable', 'purchaseOrder', PurchaseOrder]
    | ['variable', 'quotationItem', QuotationItem]
    | ['variable', 'quantity', number]
    | ['variable', 'price', number]
    | ['variable', 'received', number]

    | ['replace', 'variable', PurchaseOrderItemVariable]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new PurchaseOrderItemVariable(-1, { purchaseOrder: new PurchaseOrder(-1), quotationItem: new QuotationItem(-1), quantity: 0, price: 0, received: 0 })
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
                    case 'purchaseOrder': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'quotationItem': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'quantity': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'price': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'received': {
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

    const purchaseOrderItemType = types['PurchaseOrderItem']
    
    
    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.PurchaseOrderItem.toArray()
            var composedVariables = HashSet.of<Immutable<PurchaseOrderItemVariable>>().addAll(rows ? rows.map(x => PurchaseOrderItemRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as PurchaseOrderItemVariable])
            }
        }
    }, [state.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

    const purchaseOrderRows = useLiveQuery(() => db.PurchaseOrder.toArray())?.map(x => PurchaseOrderRow.toVariable(x))
    var purchaseOrderList = HashSet.of<Immutable<PurchaseOrderVariable>>().addAll(purchaseOrderRows ? purchaseOrderRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        purchaseOrderList = purchaseOrderList.filter(x => !diff.variables.PurchaseOrder.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.PurchaseOrder.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.PurchaseOrder.replace)
    })

    const purchaseOrderItemRows = useLiveQuery(() => db.PurchaseOrderItem.toArray())?.map(x => PurchaseOrderItemRow.toVariable(x))
    var purchaseOrderItemList = HashSet.of<Immutable<PurchaseOrderItemVariable>>().addAll(purchaseOrderItemRows ? purchaseOrderItemRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        purchaseOrderItemList = purchaseOrderItemList.filter(x => !diff.variables.PurchaseOrderItem.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.PurchaseOrderItem.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.PurchaseOrderItem.replace)
    })

    const quotationItemRows = useLiveQuery(() => db.QuotationItem.toArray())?.map(x => QuotationItemRow.toVariable(x))
    var quotationItemList = HashSet.of<Immutable<QuotationItemVariable>>().addAll(quotationItemRows ? quotationItemRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        quotationItemList = quotationItemList.filter(x => !diff.variables.QuotationItem.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.QuotationItem.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.QuotationItem.replace)
    })

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'purchaseOrder': {
                dispatch(['variable', event.target.name, new PurchaseOrder(parseInt(String(event.target.value)))])
                break
            }
            case 'quotationItem': {
                dispatch(['variable', event.target.name, new QuotationItem(parseInt(String(event.target.value)))])
                break
            }
            case 'quantity': {
                dispatch(['variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
            case 'price': {
                dispatch(['variable', event.target.name, parseFloat(String(event.target.value))])
                break
            }
            case 'received': {
                dispatch(['variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
        }
    }



    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createPurchaseOrderItem, {
            purchaseOrder: state.variable.values.purchaseOrder.hashCode(),
            quotationItem: state.variable.values.quotationItem.hashCode(),
            quantity: state.variable.values.quantity,
            price: state.variable.values.price,
            received: state.variable.values.received
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deletePurchaseOrderItem, {
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
                        'create': `Create Purchase Order Item`,
                        'update': `Update Purchase Order Item`,
                        'show': `Purchase Order Item`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/purchase-order-item-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/purchase-order-item-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/purchase-order-item-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{purchaseOrderItemType.keys.purchaseOrder}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.purchaseOrder.hashCode()} name='purchaseOrder'>
                                    <option value='' selected disabled hidden>Select Purchase Order</option>
                                    {purchaseOrderList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(purchaseOrderList.filter(x => x.id.hashCode() === state.variable.values.purchaseOrder.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = purchaseOrderList.filter(x => x.id.hashCode() === state.variable.values.purchaseOrder.hashCode()).toArray()[0] as PurchaseOrderVariable
                                            return <Link to={`/purchase-order/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/purchase-order/${state.variable.values.purchaseOrder.hashCode()}`}>{state.variable.values.purchaseOrder.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{purchaseOrderItemType.keys.quotationItem}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.quotationItem.hashCode()} name='quotationItem'>
                                    <option value='' selected disabled hidden>Select Quotation Item</option>
                                    {quotationItemList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(quotationItemList.filter(x => x.id.hashCode() === state.variable.values.quotationItem.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = quotationItemList.filter(x => x.id.hashCode() === state.variable.values.quotationItem.hashCode()).toArray()[0] as QuotationItemVariable
                                            return <Link to={`/quotation-item/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/quotation-item/${state.variable.values.quotationItem.hashCode()}`}>{state.variable.values.quotationItem.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{purchaseOrderItemType.keys.quantity}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='number' onChange={onVariableInputChange} value={state.variable.values.quantity} name='quantity' />,
                                <div className='font-bold text-xl'>{state.variable.values.quantity}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{purchaseOrderItemType.keys.price}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='number' onChange={onVariableInputChange} value={state.variable.values.price} name='price' />,
                                <div className='font-bold text-xl'>{state.variable.values.price}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{purchaseOrderItemType.keys.received}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='number' onChange={onVariableInputChange} value={state.variable.values.received} name='received' />,
                                <div className='font-bold text-xl'>{state.variable.values.received}</div>
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
