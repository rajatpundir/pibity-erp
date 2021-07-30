import React, { useEffect } from 'react'
import { Immutable, Draft } from 'immer'
import { useImmerReducer } from 'use-immer'
import tw from 'twin.macro'
import { HashSet } from 'prelude-ts'
import { executeCircuit } from '../../../main/circuit'
import { types } from '../../../main/types'
import { Container, Item, none } from '../../../main/commons'
import * as Grid from './grids/Show'
import { withRouter, Link } from 'react-router-dom'
import { circuits } from '../../../main/circuits'
import { iff, when } from '../../../main/utils'
import { db } from '../../../main/dexie'
import { useCallback } from 'react'
import { updateVariable } from '../../../main/mutation'
import { useLiveQuery } from 'dexie-react-hooks'
import { DiffRow, PurchaseInvoiceRow, PurchaseInvoiceItemRow, PurchaseOrderItemRow } from '../../../main/rows'
import { PurchaseInvoice, PurchaseInvoiceVariable, PurchaseInvoiceItemVariable, PurchaseOrderItem, PurchaseOrderItemVariable } from '../../../main/variables'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: PurchaseInvoiceItemVariable
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 
    | ['variable', 'purchaseInvoice', PurchaseInvoice]
    | ['variable', 'purchaseOrderItem', PurchaseOrderItem]
    | ['variable', 'quantity', number]
    | ['variable', 'approved', number]
    | ['variable', 'rejected', number]

    | ['replace', 'variable', PurchaseInvoiceItemVariable]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new PurchaseInvoiceItemVariable(-1, { purchaseInvoice: new PurchaseInvoice(-1), purchaseOrderItem: new PurchaseOrderItem(-1), quantity: 0, approved: 0, rejected: 0 })
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
                    case 'purchaseInvoice': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'purchaseOrderItem': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'quantity': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'approved': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'rejected': {
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

    const purchaseInvoiceItemType = types['PurchaseInvoiceItem']
    
    
    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.PurchaseInvoiceItem.toArray()
            var composedVariables = HashSet.of<Immutable<PurchaseInvoiceItemVariable>>().addAll(rows ? rows.map(x => PurchaseInvoiceItemRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as PurchaseInvoiceItemVariable])
            }
        }
    }, [state.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

    const purchaseInvoiceRows = useLiveQuery(() => db.PurchaseInvoice.toArray())?.map(x => PurchaseInvoiceRow.toVariable(x))
    var purchaseInvoiceList = HashSet.of<Immutable<PurchaseInvoiceVariable>>().addAll(purchaseInvoiceRows ? purchaseInvoiceRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        purchaseInvoiceList = purchaseInvoiceList.filter(x => !diff.variables.PurchaseInvoice.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.PurchaseInvoice.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.PurchaseInvoice.replace)
    })

    const purchaseInvoiceItemRows = useLiveQuery(() => db.PurchaseInvoiceItem.toArray())?.map(x => PurchaseInvoiceItemRow.toVariable(x))
    var purchaseInvoiceItemList = HashSet.of<Immutable<PurchaseInvoiceItemVariable>>().addAll(purchaseInvoiceItemRows ? purchaseInvoiceItemRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        purchaseInvoiceItemList = purchaseInvoiceItemList.filter(x => !diff.variables.PurchaseInvoiceItem.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.PurchaseInvoiceItem.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.PurchaseInvoiceItem.replace)
    })

    const purchaseOrderItemRows = useLiveQuery(() => db.PurchaseOrderItem.toArray())?.map(x => PurchaseOrderItemRow.toVariable(x))
    var purchaseOrderItemList = HashSet.of<Immutable<PurchaseOrderItemVariable>>().addAll(purchaseOrderItemRows ? purchaseOrderItemRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        purchaseOrderItemList = purchaseOrderItemList.filter(x => !diff.variables.PurchaseOrderItem.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.PurchaseOrderItem.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.PurchaseOrderItem.replace)
    })

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'purchaseInvoice': {
                dispatch(['variable', event.target.name, new PurchaseInvoice(parseInt(String(event.target.value)))])
                break
            }
            case 'purchaseOrderItem': {
                dispatch(['variable', event.target.name, new PurchaseOrderItem(parseInt(String(event.target.value)))])
                break
            }
            case 'quantity': {
                dispatch(['variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
            case 'approved': {
                dispatch(['variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
            case 'rejected': {
                dispatch(['variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
        }
    }



    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createPurchaseInvoiceItem, {
            purchaseInvoice: state.variable.values.purchaseInvoice.hashCode(),
            purchaseOrderItem: state.variable.values.purchaseOrderItem.hashCode(),
            quantity: state.variable.values.quantity,
            approved: state.variable.values.approved,
            rejected: state.variable.values.rejected
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deletePurchaseInvoiceItem, {
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
                        'create': `Create Purchase Invoice Item`,
                        'update': `Update Purchase Invoice Item`,
                        'show': `Purchase Invoice Item`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/purchase-invoice-item-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/purchase-invoice-item-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/purchase-invoice-item-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{purchaseInvoiceItemType.keys.purchaseInvoice}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.purchaseInvoice.hashCode()} name='purchaseInvoice'>
                                    <option value='' selected disabled hidden>Select Purchase Invoice</option>
                                    {purchaseInvoiceList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(purchaseInvoiceList.filter(x => x.id.hashCode() === state.variable.values.purchaseInvoice.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = purchaseInvoiceList.filter(x => x.id.hashCode() === state.variable.values.purchaseInvoice.hashCode()).toArray()[0] as PurchaseInvoiceVariable
                                            return <Link to={`/purchase-invoice/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/purchase-invoice/${state.variable.values.purchaseInvoice.hashCode()}`}>{state.variable.values.purchaseInvoice.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{purchaseInvoiceItemType.keys.purchaseOrderItem}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.purchaseOrderItem.hashCode()} name='purchaseOrderItem'>
                                    <option value='' selected disabled hidden>Select Purchase Order Item</option>
                                    {purchaseOrderItemList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(purchaseOrderItemList.filter(x => x.id.hashCode() === state.variable.values.purchaseOrderItem.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = purchaseOrderItemList.filter(x => x.id.hashCode() === state.variable.values.purchaseOrderItem.hashCode()).toArray()[0] as PurchaseOrderItemVariable
                                            return <Link to={`/purchase-order-item/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/purchase-order-item/${state.variable.values.purchaseOrderItem.hashCode()}`}>{state.variable.values.purchaseOrderItem.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{purchaseInvoiceItemType.keys.quantity}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='number' onChange={onVariableInputChange} value={state.variable.values.quantity} name='quantity' />,
                                <div className='font-bold text-xl'>{state.variable.values.quantity}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{purchaseInvoiceItemType.keys.approved}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='number' onChange={onVariableInputChange} value={state.variable.values.approved} name='approved' />,
                                <div className='font-bold text-xl'>{state.variable.values.approved}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{purchaseInvoiceItemType.keys.rejected}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='number' onChange={onVariableInputChange} value={state.variable.values.rejected} name='rejected' />,
                                <div className='font-bold text-xl'>{state.variable.values.rejected}</div>
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
