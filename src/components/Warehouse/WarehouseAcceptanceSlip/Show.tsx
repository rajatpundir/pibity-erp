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
import { DiffRow, TransferMaterialSlipRow, WarehouseAcceptanceSlipRow } from '../../../main/rows'
import { TransferMaterialSlip, TransferMaterialSlipVariable, WarehouseAcceptanceSlip, WarehouseAcceptanceSlipVariable } from '../../../main/variables'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: WarehouseAcceptanceSlipVariable
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 
    | ['variable', 'transferMaterialSlip', TransferMaterialSlip]
    | ['variable', 'quantity', number]

    | ['replace', 'variable', WarehouseAcceptanceSlipVariable]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new WarehouseAcceptanceSlipVariable(-1, { transferMaterialSlip: new TransferMaterialSlip(-1), quantity: 0 })
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
                    case 'transferMaterialSlip': {
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

    const warehouseAcceptanceSlipType = types['WarehouseAcceptanceSlip']
    
    
    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.WarehouseAcceptanceSlip.toArray()
            var composedVariables = HashSet.of<Immutable<WarehouseAcceptanceSlipVariable>>().addAll(rows ? rows.map(x => WarehouseAcceptanceSlipRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as WarehouseAcceptanceSlipVariable])
            }
        }
    }, [state.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

    const transferMaterialSlipRows = useLiveQuery(() => db.TransferMaterialSlip.toArray())?.map(x => TransferMaterialSlipRow.toVariable(x))
    var transferMaterialSlipList = HashSet.of<Immutable<TransferMaterialSlipVariable>>().addAll(transferMaterialSlipRows ? transferMaterialSlipRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        transferMaterialSlipList = transferMaterialSlipList.filter(x => !diff.variables.TransferMaterialSlip.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.TransferMaterialSlip.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.TransferMaterialSlip.replace)
    })

    const warehouseAcceptanceSlipRows = useLiveQuery(() => db.WarehouseAcceptanceSlip.toArray())?.map(x => WarehouseAcceptanceSlipRow.toVariable(x))
    var warehouseAcceptanceSlipList = HashSet.of<Immutable<WarehouseAcceptanceSlipVariable>>().addAll(warehouseAcceptanceSlipRows ? warehouseAcceptanceSlipRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        warehouseAcceptanceSlipList = warehouseAcceptanceSlipList.filter(x => !diff.variables.WarehouseAcceptanceSlip.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.WarehouseAcceptanceSlip.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.WarehouseAcceptanceSlip.replace)
    })

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'transferMaterialSlip': {
                dispatch(['variable', event.target.name, new TransferMaterialSlip(parseInt(String(event.target.value)))])
                break
            }
            case 'quantity': {
                dispatch(['variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
        }
    }



    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createWarehouseAcceptanceSlip, {
            transferMaterialSlip: state.variable.values.transferMaterialSlip.hashCode(),
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteWarehouseAcceptanceSlip, {
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
                        'create': `Create Warehouse Acceptance Slip`,
                        'update': `Update Warehouse Acceptance Slip`,
                        'show': `Warehouse Acceptance Slip`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/warehouse-acceptance-slip-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/warehouse-acceptance-slip-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/warehouse-acceptance-slip-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{warehouseAcceptanceSlipType.keys.transferMaterialSlip}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.transferMaterialSlip.hashCode()} name='transferMaterialSlip'>
                                    <option value='' selected disabled hidden>Select Transfer Material Slip</option>
                                    {transferMaterialSlipList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(transferMaterialSlipList.filter(x => x.id.hashCode() === state.variable.values.transferMaterialSlip.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = transferMaterialSlipList.filter(x => x.id.hashCode() === state.variable.values.transferMaterialSlip.hashCode()).toArray()[0] as TransferMaterialSlipVariable
                                            return <Link to={`/transfer-material-slip/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/transfer-material-slip/${state.variable.values.transferMaterialSlip.hashCode()}`}>{state.variable.values.transferMaterialSlip.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{warehouseAcceptanceSlipType.keys.quantity}</Label>
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
