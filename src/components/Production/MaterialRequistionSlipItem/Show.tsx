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
import { DiffRow, MaterialApprovalSlipItemRow, MaterialRequistionSlipRow, MaterialRequistionSlipItemRow } from '../../../main/rows'
import { MaterialApprovalSlipItem, MaterialApprovalSlipItemVariable, MaterialRequistionSlip, MaterialRequistionSlipVariable, MaterialRequistionSlipItem, MaterialRequistionSlipItemVariable } from '../../../main/variables'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: MaterialRequistionSlipItemVariable
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 
    | ['variable', 'materialRequistionSlip', MaterialRequistionSlip]
    | ['variable', 'materialApprovalSlipItem', MaterialApprovalSlipItem]
    | ['variable', 'quantity', number]
    | ['variable', 'consumed', number]

    | ['replace', 'variable', MaterialRequistionSlipItemVariable]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new MaterialRequistionSlipItemVariable(-1, { materialRequistionSlip: new MaterialRequistionSlip(-1), materialApprovalSlipItem: new MaterialApprovalSlipItem(-1), quantity: 0, consumed: 0 })
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
                    case 'materialRequistionSlip': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'materialApprovalSlipItem': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'quantity': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'consumed': {
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

    const materialRequistionSlipItemType = types['MaterialRequistionSlipItem']
    
    
    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.MaterialRequistionSlipItem.toArray()
            var composedVariables = HashSet.of<Immutable<MaterialRequistionSlipItemVariable>>().addAll(rows ? rows.map(x => MaterialRequistionSlipItemRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as MaterialRequistionSlipItemVariable])
            }
        }
    }, [state.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

    const materialApprovalSlipItemRows = useLiveQuery(() => db.MaterialApprovalSlipItem.toArray())?.map(x => MaterialApprovalSlipItemRow.toVariable(x))
    var materialApprovalSlipItemList = HashSet.of<Immutable<MaterialApprovalSlipItemVariable>>().addAll(materialApprovalSlipItemRows ? materialApprovalSlipItemRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        materialApprovalSlipItemList = materialApprovalSlipItemList.filter(x => !diff.variables.MaterialApprovalSlipItem.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.MaterialApprovalSlipItem.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.MaterialApprovalSlipItem.replace)
    })

    const materialRequistionSlipRows = useLiveQuery(() => db.MaterialRequistionSlip.toArray())?.map(x => MaterialRequistionSlipRow.toVariable(x))
    var materialRequistionSlipList = HashSet.of<Immutable<MaterialRequistionSlipVariable>>().addAll(materialRequistionSlipRows ? materialRequistionSlipRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        materialRequistionSlipList = materialRequistionSlipList.filter(x => !diff.variables.MaterialRequistionSlip.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.MaterialRequistionSlip.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.MaterialRequistionSlip.replace)
    })

    const materialRequistionSlipItemRows = useLiveQuery(() => db.MaterialRequistionSlipItem.toArray())?.map(x => MaterialRequistionSlipItemRow.toVariable(x))
    var materialRequistionSlipItemList = HashSet.of<Immutable<MaterialRequistionSlipItemVariable>>().addAll(materialRequistionSlipItemRows ? materialRequistionSlipItemRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        materialRequistionSlipItemList = materialRequistionSlipItemList.filter(x => !diff.variables.MaterialRequistionSlipItem.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.MaterialRequistionSlipItem.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.MaterialRequistionSlipItem.replace)
    })

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'materialRequistionSlip': {
                dispatch(['variable', event.target.name, new MaterialRequistionSlip(parseInt(String(event.target.value)))])
                break
            }
            case 'materialApprovalSlipItem': {
                dispatch(['variable', event.target.name, new MaterialApprovalSlipItem(parseInt(String(event.target.value)))])
                break
            }
            case 'quantity': {
                dispatch(['variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
            case 'consumed': {
                dispatch(['variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
        }
    }



    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createMaterialRequistionSlipItem, {
            materialRequistionSlip: state.variable.values.materialRequistionSlip.hashCode(),
            materialApprovalSlipItem: state.variable.values.materialApprovalSlipItem.hashCode(),
            quantity: state.variable.values.quantity,
            consumed: state.variable.values.consumed
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteMaterialRequistionSlipItem, {
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
                        'create': `Create Material Requistion Slip Item`,
                        'update': `Update Material Requistion Slip Item`,
                        'show': `Material Requistion Slip Item`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/material-requistion-slip-item-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/material-requistion-slip-item-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/material-requistion-slip-item-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{materialRequistionSlipItemType.keys.materialRequistionSlip}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.materialRequistionSlip.hashCode()} name='materialRequistionSlip'>
                                    <option value='' selected disabled hidden>Select Material Requistion Slip</option>
                                    {materialRequistionSlipList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(materialRequistionSlipList.filter(x => x.id.hashCode() === state.variable.values.materialRequistionSlip.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = materialRequistionSlipList.filter(x => x.id.hashCode() === state.variable.values.materialRequistionSlip.hashCode()).toArray()[0] as MaterialRequistionSlipVariable
                                            return <Link to={`/material-requistion-slip/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/material-requistion-slip/${state.variable.values.materialRequistionSlip.hashCode()}`}>{state.variable.values.materialRequistionSlip.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{materialRequistionSlipItemType.keys.materialApprovalSlipItem}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.materialApprovalSlipItem.hashCode()} name='materialApprovalSlipItem'>
                                    <option value='' selected disabled hidden>Select Material Approval Slip Item</option>
                                    {materialApprovalSlipItemList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(materialApprovalSlipItemList.filter(x => x.id.hashCode() === state.variable.values.materialApprovalSlipItem.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = materialApprovalSlipItemList.filter(x => x.id.hashCode() === state.variable.values.materialApprovalSlipItem.hashCode()).toArray()[0] as MaterialApprovalSlipItemVariable
                                            return <Link to={`/material-approval-slip-item/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/material-approval-slip-item/${state.variable.values.materialApprovalSlipItem.hashCode()}`}>{state.variable.values.materialApprovalSlipItem.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{materialRequistionSlipItemType.keys.quantity}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='number' onChange={onVariableInputChange} value={state.variable.values.quantity} name='quantity' />,
                                <div className='font-bold text-xl'>{state.variable.values.quantity}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{materialRequistionSlipItemType.keys.consumed}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='number' onChange={onVariableInputChange} value={state.variable.values.consumed} name='consumed' />,
                                <div className='font-bold text-xl'>{state.variable.values.consumed}</div>
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
