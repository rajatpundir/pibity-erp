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
import { DiffRow, MaterialRequistionSlipItemRow, ProductionPreparationSlipRow, ProductionPreparationSlipItemRow } from '../../../main/rows'
import { MaterialRequistionSlipItem, MaterialRequistionSlipItemVariable, ProductionPreparationSlip, ProductionPreparationSlipVariable, ProductionPreparationSlipItem, ProductionPreparationSlipItemVariable } from '../../../main/variables'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: ProductionPreparationSlipItemVariable
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 
    | ['variable', 'productionPreparationSlip', ProductionPreparationSlip]
    | ['variable', 'bomItem', string]
    | ['variable', 'materialRequistionSlipItem', MaterialRequistionSlipItem]

    | ['replace', 'variable', ProductionPreparationSlipItemVariable]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new ProductionPreparationSlipItemVariable(-1, { productionPreparationSlip: new ProductionPreparationSlip(-1), bomItem: '', materialRequistionSlipItem: new MaterialRequistionSlipItem(-1) })
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
                    case 'bomItem': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'materialRequistionSlipItem': {
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

    const productionPreparationSlipItemType = types['ProductionPreparationSlipItem']
    
    
    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.ProductionPreparationSlipItem.toArray()
            var composedVariables = HashSet.of<Immutable<ProductionPreparationSlipItemVariable>>().addAll(rows ? rows.map(x => ProductionPreparationSlipItemRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as ProductionPreparationSlipItemVariable])
            }
        }
    }, [state.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

    const materialRequistionSlipItemRows = useLiveQuery(() => db.MaterialRequistionSlipItem.toArray())?.map(x => MaterialRequistionSlipItemRow.toVariable(x))
    var materialRequistionSlipItemList = HashSet.of<Immutable<MaterialRequistionSlipItemVariable>>().addAll(materialRequistionSlipItemRows ? materialRequistionSlipItemRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        materialRequistionSlipItemList = materialRequistionSlipItemList.filter(x => !diff.variables.MaterialRequistionSlipItem.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.MaterialRequistionSlipItem.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.MaterialRequistionSlipItem.replace)
    })

    const productionPreparationSlipRows = useLiveQuery(() => db.ProductionPreparationSlip.toArray())?.map(x => ProductionPreparationSlipRow.toVariable(x))
    var productionPreparationSlipList = HashSet.of<Immutable<ProductionPreparationSlipVariable>>().addAll(productionPreparationSlipRows ? productionPreparationSlipRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        productionPreparationSlipList = productionPreparationSlipList.filter(x => !diff.variables.ProductionPreparationSlip.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.ProductionPreparationSlip.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.ProductionPreparationSlip.replace)
    })

    const productionPreparationSlipItemRows = useLiveQuery(() => db.ProductionPreparationSlipItem.toArray())?.map(x => ProductionPreparationSlipItemRow.toVariable(x))
    var productionPreparationSlipItemList = HashSet.of<Immutable<ProductionPreparationSlipItemVariable>>().addAll(productionPreparationSlipItemRows ? productionPreparationSlipItemRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        productionPreparationSlipItemList = productionPreparationSlipItemList.filter(x => !diff.variables.ProductionPreparationSlipItem.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.ProductionPreparationSlipItem.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.ProductionPreparationSlipItem.replace)
    })

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'productionPreparationSlip': {
                dispatch(['variable', event.target.name, new ProductionPreparationSlip(parseInt(String(event.target.value)))])
                break
            }
            case 'bomItem': {
                dispatch(['variable', event.target.name, String(event.target.value)])
                break
            }
            case 'materialRequistionSlipItem': {
                dispatch(['variable', event.target.name, new MaterialRequistionSlipItem(parseInt(String(event.target.value)))])
                break
            }
        }
    }



    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createProductionPreparationSlipItem, {
            productionPreparationSlip: state.variable.values.productionPreparationSlip.hashCode(),
            bomItem: state.variable.values.bomItem,
            materialRequistionSlipItem: state.variable.values.materialRequistionSlipItem.hashCode()
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteProductionPreparationSlipItem, {
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
                        'create': `Create Production Preparation Slip Item`,
                        'update': `Update Production Preparation Slip Item`,
                        'show': `Production Preparation Slip Item`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/production-preparation-slip-item-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/production-preparation-slip-item-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/production-preparation-slip-item-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{productionPreparationSlipItemType.keys.productionPreparationSlip}</Label>
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
                        <Label>{productionPreparationSlipItemType.keys.bomItem}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.bomItem} name='bomItem' />,
                                <div className='font-bold text-xl'>{state.variable.values.bomItem}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{productionPreparationSlipItemType.keys.materialRequistionSlipItem}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.materialRequistionSlipItem.hashCode()} name='materialRequistionSlipItem'>
                                    <option value='' selected disabled hidden>Select Material Requistion Slip Item</option>
                                    {materialRequistionSlipItemList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(materialRequistionSlipItemList.filter(x => x.id.hashCode() === state.variable.values.materialRequistionSlipItem.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = materialRequistionSlipItemList.filter(x => x.id.hashCode() === state.variable.values.materialRequistionSlipItem.hashCode()).toArray()[0] as MaterialRequistionSlipItemVariable
                                            return <Link to={`/material-requistion-slip-item/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/material-requistion-slip-item/${state.variable.values.materialRequistionSlipItem.hashCode()}`}>{state.variable.values.materialRequistionSlipItem.hashCode()}</Link>)
                                }</div>
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
