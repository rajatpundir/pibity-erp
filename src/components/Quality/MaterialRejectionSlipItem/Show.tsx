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
import { DiffRow, MaterialRejectionSlipRow, MaterialRejectionSlipItemRow, PurchaseInvoiceItemRow } from '../../../main/rows'
import { MaterialRejectionSlip, MaterialRejectionSlipVariable, MaterialRejectionSlipItemVariable, PurchaseInvoiceItem, PurchaseInvoiceItemVariable } from '../../../main/variables'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: MaterialRejectionSlipItemVariable
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 
    | ['variable', 'materialRejectionSlip', MaterialRejectionSlip]
    | ['variable', 'purchaseInvoiceItem', PurchaseInvoiceItem]
    | ['variable', 'quantity', number]
    | ['variable', 'returned', number]

    | ['replace', 'variable', MaterialRejectionSlipItemVariable]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new MaterialRejectionSlipItemVariable(-1, { materialRejectionSlip: new MaterialRejectionSlip(-1), purchaseInvoiceItem: new PurchaseInvoiceItem(-1), quantity: 0, returned: 0 })
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
                    case 'materialRejectionSlip': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'purchaseInvoiceItem': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'quantity': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'returned': {
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

    const materialRejectionSlipItemType = types['MaterialRejectionSlipItem']
    
    
    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.MaterialRejectionSlipItem.toArray()
            var composedVariables = HashSet.of<Immutable<MaterialRejectionSlipItemVariable>>().addAll(rows ? rows.map(x => MaterialRejectionSlipItemRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as MaterialRejectionSlipItemVariable])
            }
        }
    }, [state.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

    const materialRejectionSlipRows = useLiveQuery(() => db.MaterialRejectionSlip.toArray())?.map(x => MaterialRejectionSlipRow.toVariable(x))
    var materialRejectionSlipList = HashSet.of<Immutable<MaterialRejectionSlipVariable>>().addAll(materialRejectionSlipRows ? materialRejectionSlipRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        materialRejectionSlipList = materialRejectionSlipList.filter(x => !diff.variables.MaterialRejectionSlip.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.MaterialRejectionSlip.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.MaterialRejectionSlip.replace)
    })

    const materialRejectionSlipItemRows = useLiveQuery(() => db.MaterialRejectionSlipItem.toArray())?.map(x => MaterialRejectionSlipItemRow.toVariable(x))
    var materialRejectionSlipItemList = HashSet.of<Immutable<MaterialRejectionSlipItemVariable>>().addAll(materialRejectionSlipItemRows ? materialRejectionSlipItemRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        materialRejectionSlipItemList = materialRejectionSlipItemList.filter(x => !diff.variables.MaterialRejectionSlipItem.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.MaterialRejectionSlipItem.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.MaterialRejectionSlipItem.replace)
    })

    const purchaseInvoiceItemRows = useLiveQuery(() => db.PurchaseInvoiceItem.toArray())?.map(x => PurchaseInvoiceItemRow.toVariable(x))
    var purchaseInvoiceItemList = HashSet.of<Immutable<PurchaseInvoiceItemVariable>>().addAll(purchaseInvoiceItemRows ? purchaseInvoiceItemRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        purchaseInvoiceItemList = purchaseInvoiceItemList.filter(x => !diff.variables.PurchaseInvoiceItem.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.PurchaseInvoiceItem.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.PurchaseInvoiceItem.replace)
    })

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'materialRejectionSlip': {
                dispatch(['variable', event.target.name, new MaterialRejectionSlip(parseInt(String(event.target.value)))])
                break
            }
            case 'purchaseInvoiceItem': {
                dispatch(['variable', event.target.name, new PurchaseInvoiceItem(parseInt(String(event.target.value)))])
                break
            }
            case 'quantity': {
                dispatch(['variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
            case 'returned': {
                dispatch(['variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
        }
    }



    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createMaterialRejectionSlipItem, {
            materialRejectionSlip: state.variable.values.materialRejectionSlip.hashCode(),
            purchaseInvoiceItem: state.variable.values.purchaseInvoiceItem.hashCode(),
            quantity: state.variable.values.quantity,
            returned: state.variable.values.returned
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteMaterialRejectionSlipItem, {
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
                        'create': `Create Material Rejection Slip Item`,
                        'update': `Update Material Rejection Slip Item`,
                        'show': `Material Rejection Slip Item`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/material-rejection-slip-item-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/material-rejection-slip-item-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/material-rejection-slip-item-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{materialRejectionSlipItemType.keys.materialRejectionSlip}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.materialRejectionSlip.hashCode()} name='materialRejectionSlip'>
                                    <option value='' selected disabled hidden>Select Material Rejection Slip</option>
                                    {materialRejectionSlipList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(materialRejectionSlipList.filter(x => x.id.hashCode() === state.variable.values.materialRejectionSlip.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = materialRejectionSlipList.filter(x => x.id.hashCode() === state.variable.values.materialRejectionSlip.hashCode()).toArray()[0] as MaterialRejectionSlipVariable
                                            return <Link to={`/material-rejection-slip/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/material-rejection-slip/${state.variable.values.materialRejectionSlip.hashCode()}`}>{state.variable.values.materialRejectionSlip.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{materialRejectionSlipItemType.keys.purchaseInvoiceItem}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.purchaseInvoiceItem.hashCode()} name='purchaseInvoiceItem'>
                                    <option value='' selected disabled hidden>Select Purchase Invoice Item</option>
                                    {purchaseInvoiceItemList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(purchaseInvoiceItemList.filter(x => x.id.hashCode() === state.variable.values.purchaseInvoiceItem.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = purchaseInvoiceItemList.filter(x => x.id.hashCode() === state.variable.values.purchaseInvoiceItem.hashCode()).toArray()[0] as PurchaseInvoiceItemVariable
                                            return <Link to={`/purchase-invoice-item/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/purchase-invoice-item/${state.variable.values.purchaseInvoiceItem.hashCode()}`}>{state.variable.values.purchaseInvoiceItem.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{materialRejectionSlipItemType.keys.quantity}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='number' onChange={onVariableInputChange} value={state.variable.values.quantity} name='quantity' />,
                                <div className='font-bold text-xl'>{state.variable.values.quantity}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{materialRejectionSlipItemType.keys.returned}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='number' onChange={onVariableInputChange} value={state.variable.values.returned} name='returned' />,
                                <div className='font-bold text-xl'>{state.variable.values.returned}</div>
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
