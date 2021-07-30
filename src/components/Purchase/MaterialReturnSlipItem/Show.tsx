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
import { DiffRow, MaterialRejectionSlipItemRow, MaterialReturnSlipRow, MaterialReturnSlipItemRow } from '../../../main/rows'
import { MaterialRejectionSlipItem, MaterialRejectionSlipItemVariable, MaterialReturnSlip, MaterialReturnSlipVariable, MaterialReturnSlipItemVariable } from '../../../main/variables'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: MaterialReturnSlipItemVariable
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 
    | ['variable', 'materialReturnSlip', MaterialReturnSlip]
    | ['variable', 'materialRejectionSlipItem', MaterialRejectionSlipItem]
    | ['variable', 'quantity', number]

    | ['replace', 'variable', MaterialReturnSlipItemVariable]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new MaterialReturnSlipItemVariable(-1, { materialReturnSlip: new MaterialReturnSlip(-1), materialRejectionSlipItem: new MaterialRejectionSlipItem(-1), quantity: 0 })
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
                    case 'materialReturnSlip': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'materialRejectionSlipItem': {
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

    const materialReturnSlipItemType = types['MaterialReturnSlipItem']
    
    
    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.MaterialReturnSlipItem.toArray()
            var composedVariables = HashSet.of<Immutable<MaterialReturnSlipItemVariable>>().addAll(rows ? rows.map(x => MaterialReturnSlipItemRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as MaterialReturnSlipItemVariable])
            }
        }
    }, [state.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

    const materialRejectionSlipItemRows = useLiveQuery(() => db.MaterialRejectionSlipItem.toArray())?.map(x => MaterialRejectionSlipItemRow.toVariable(x))
    var materialRejectionSlipItemList = HashSet.of<Immutable<MaterialRejectionSlipItemVariable>>().addAll(materialRejectionSlipItemRows ? materialRejectionSlipItemRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        materialRejectionSlipItemList = materialRejectionSlipItemList.filter(x => !diff.variables.MaterialRejectionSlipItem.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.MaterialRejectionSlipItem.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.MaterialRejectionSlipItem.replace)
    })

    const materialReturnSlipRows = useLiveQuery(() => db.MaterialReturnSlip.toArray())?.map(x => MaterialReturnSlipRow.toVariable(x))
    var materialReturnSlipList = HashSet.of<Immutable<MaterialReturnSlipVariable>>().addAll(materialReturnSlipRows ? materialReturnSlipRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        materialReturnSlipList = materialReturnSlipList.filter(x => !diff.variables.MaterialReturnSlip.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.MaterialReturnSlip.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.MaterialReturnSlip.replace)
    })

    const materialReturnSlipItemRows = useLiveQuery(() => db.MaterialReturnSlipItem.toArray())?.map(x => MaterialReturnSlipItemRow.toVariable(x))
    var materialReturnSlipItemList = HashSet.of<Immutable<MaterialReturnSlipItemVariable>>().addAll(materialReturnSlipItemRows ? materialReturnSlipItemRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        materialReturnSlipItemList = materialReturnSlipItemList.filter(x => !diff.variables.MaterialReturnSlipItem.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.MaterialReturnSlipItem.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.MaterialReturnSlipItem.replace)
    })

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'materialReturnSlip': {
                dispatch(['variable', event.target.name, new MaterialReturnSlip(parseInt(String(event.target.value)))])
                break
            }
            case 'materialRejectionSlipItem': {
                dispatch(['variable', event.target.name, new MaterialRejectionSlipItem(parseInt(String(event.target.value)))])
                break
            }
            case 'quantity': {
                dispatch(['variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
        }
    }



    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createMaterialReturnSlipItem, {
            materialReturnSlip: state.variable.values.materialReturnSlip.hashCode(),
            materialRejectionSlipItem: state.variable.values.materialRejectionSlipItem.hashCode(),
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteMaterialReturnSlipItem, {
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
                        'create': `Create Material Return Slip Item`,
                        'update': `Update Material Return Slip Item`,
                        'show': `Material Return Slip Item`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/material-return-slip-item-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/material-return-slip-item-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/material-return-slip-item-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{materialReturnSlipItemType.keys.materialReturnSlip}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.materialReturnSlip.hashCode()} name='materialReturnSlip'>
                                    <option value='' selected disabled hidden>Select Material Return Slip</option>
                                    {materialReturnSlipList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(materialReturnSlipList.filter(x => x.id.hashCode() === state.variable.values.materialReturnSlip.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = materialReturnSlipList.filter(x => x.id.hashCode() === state.variable.values.materialReturnSlip.hashCode()).toArray()[0] as MaterialReturnSlipVariable
                                            return <Link to={`/material-return-slip/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/material-return-slip/${state.variable.values.materialReturnSlip.hashCode()}`}>{state.variable.values.materialReturnSlip.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{materialReturnSlipItemType.keys.materialRejectionSlipItem}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.materialRejectionSlipItem.hashCode()} name='materialRejectionSlipItem'>
                                    <option value='' selected disabled hidden>Select Material Rejection Slip Item</option>
                                    {materialRejectionSlipItemList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(materialRejectionSlipItemList.filter(x => x.id.hashCode() === state.variable.values.materialRejectionSlipItem.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = materialRejectionSlipItemList.filter(x => x.id.hashCode() === state.variable.values.materialRejectionSlipItem.hashCode()).toArray()[0] as MaterialRejectionSlipItemVariable
                                            return <Link to={`/material-rejection-slip-item/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/material-rejection-slip-item/${state.variable.values.materialRejectionSlipItem.hashCode()}`}>{state.variable.values.materialRejectionSlipItem.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{materialReturnSlipItemType.keys.quantity}</Label>
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
