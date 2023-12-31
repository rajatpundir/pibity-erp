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
import { DiffRow, ProductionPreparationSlipRow, TransferMaterialSlipRow } from '../../../main/rows'
import { ProductionPreparationSlip, ProductionPreparationSlipVariable, TransferMaterialSlipVariable } from '../../../main/variables'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: TransferMaterialSlipVariable
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 
    | ['variable', 'productionPreparationSlip', ProductionPreparationSlip]
    | ['variable', 'quantity', number]
    | ['variable', 'transferred', number]

    | ['replace', 'variable', TransferMaterialSlipVariable]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new TransferMaterialSlipVariable(-1, { productionPreparationSlip: new ProductionPreparationSlip(-1), quantity: 0, transferred: 0 })
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
                    case 'productionPreparationSlip': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'quantity': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'transferred': {
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

    const transferMaterialSlipType = types['TransferMaterialSlip']
    
    
    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.TransferMaterialSlip.toArray()
            var composedVariables = HashSet.of<Immutable<TransferMaterialSlipVariable>>().addAll(rows ? rows.map(x => TransferMaterialSlipRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as TransferMaterialSlipVariable])
            }
        }
    }, [state.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

    const productionPreparationSlipRows = useLiveQuery(() => db.ProductionPreparationSlip.toArray())?.map(x => ProductionPreparationSlipRow.toVariable(x))
    var productionPreparationSlipList = HashSet.of<Immutable<ProductionPreparationSlipVariable>>().addAll(productionPreparationSlipRows ? productionPreparationSlipRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        productionPreparationSlipList = productionPreparationSlipList.filter(x => !diff.variables.ProductionPreparationSlip.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.ProductionPreparationSlip.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.ProductionPreparationSlip.replace)
    })

    const transferMaterialSlipRows = useLiveQuery(() => db.TransferMaterialSlip.toArray())?.map(x => TransferMaterialSlipRow.toVariable(x))
    var transferMaterialSlipList = HashSet.of<Immutable<TransferMaterialSlipVariable>>().addAll(transferMaterialSlipRows ? transferMaterialSlipRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        transferMaterialSlipList = transferMaterialSlipList.filter(x => !diff.variables.TransferMaterialSlip.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.TransferMaterialSlip.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.TransferMaterialSlip.replace)
    })

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'productionPreparationSlip': {
                dispatch(['variable', event.target.name, new ProductionPreparationSlip(parseInt(String(event.target.value)))])
                break
            }
            case 'quantity': {
                dispatch(['variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
            case 'transferred': {
                dispatch(['variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
        }
    }



    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createTransferMaterialSlip, {
            productionPreparationSlip: state.variable.values.productionPreparationSlip.hashCode(),
            quantity: state.variable.values.quantity,
            transferred: state.variable.values.transferred
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteTransferMaterialSlip, {
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
                        'create': `Create Transfer Material Slip`,
                        'update': `Update Transfer Material Slip`,
                        'show': `Transfer Material Slip`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/transfer-material-slip-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/transfer-material-slip-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/transfer-material-slip-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{transferMaterialSlipType.keys.productionPreparationSlip}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.productionPreparationSlip.hashCode()} name='productionPreparationSlip'>
                                    <option value='' selected disabled hidden>Select Production Preparation Slip</option>
                                    {productionPreparationSlipList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(productionPreparationSlipList.filter(x => x.id.hashCode() === state.variable.values.productionPreparationSlip.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = productionPreparationSlipList.filter(x => x.id.hashCode() === state.variable.values.productionPreparationSlip.hashCode()).toArray()[0] as ProductionPreparationSlipVariable
                                            return <Link to={`/production-preparation-slip/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/production-preparation-slip/${state.variable.values.productionPreparationSlip.hashCode()}`}>{state.variable.values.productionPreparationSlip.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{transferMaterialSlipType.keys.quantity}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='number' onChange={onVariableInputChange} value={state.variable.values.quantity} name='quantity' />,
                                <div className='font-bold text-xl'>{state.variable.values.quantity}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{transferMaterialSlipType.keys.transferred}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='number' onChange={onVariableInputChange} value={state.variable.values.transferred} name='transferred' />,
                                <div className='font-bold text-xl'>{state.variable.values.transferred}</div>
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
