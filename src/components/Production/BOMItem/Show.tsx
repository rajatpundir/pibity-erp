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
import { DiffRow, BOMRow, BOMItemRow, ProductRow, UOMRow } from '../../../main/rows'
import { BOM, BOMVariable, BOMItem, BOMItemVariable, Product, ProductVariable, UOM, UOMVariable } from '../../../main/variables'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: BOMItemVariable
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 
    | ['variable', 'bom', BOM]
    | ['variable', 'product', Product]
    | ['variable', 'quantity', number]
    | ['variable', 'uom', UOM]

    | ['replace', 'variable', BOMItemVariable]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new BOMItemVariable(-1, { bom: new BOM(-1), product: new Product(-1), quantity: 0, uom: new UOM(-1) })
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
                    case 'bom': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'product': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'quantity': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'uom': {
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

    const bOMItemType = types['BOMItem']
    
    
    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.BOMItem.toArray()
            var composedVariables = HashSet.of<Immutable<BOMItemVariable>>().addAll(rows ? rows.map(x => BOMItemRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as BOMItemVariable])
            }
        }
    }, [state.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

    const bOMRows = useLiveQuery(() => db.BOM.toArray())?.map(x => BOMRow.toVariable(x))
    var bOMList = HashSet.of<Immutable<BOMVariable>>().addAll(bOMRows ? bOMRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        bOMList = bOMList.filter(x => !diff.variables.BOM.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.BOM.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.BOM.replace)
    })

    const bOMItemRows = useLiveQuery(() => db.BOMItem.toArray())?.map(x => BOMItemRow.toVariable(x))
    var bOMItemList = HashSet.of<Immutable<BOMItemVariable>>().addAll(bOMItemRows ? bOMItemRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        bOMItemList = bOMItemList.filter(x => !diff.variables.BOMItem.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.BOMItem.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.BOMItem.replace)
    })

    const productRows = useLiveQuery(() => db.Product.toArray())?.map(x => ProductRow.toVariable(x))
    var productList = HashSet.of<Immutable<ProductVariable>>().addAll(productRows ? productRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        productList = productList.filter(x => !diff.variables.Product.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.Product.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.Product.replace)
    })

    const uOMRows = useLiveQuery(() => db.UOM.toArray())?.map(x => UOMRow.toVariable(x))
    var uOMList = HashSet.of<Immutable<UOMVariable>>().addAll(uOMRows ? uOMRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        uOMList = uOMList.filter(x => !diff.variables.UOM.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.UOM.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.UOM.replace)
    })

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'bom': {
                dispatch(['variable', event.target.name, new BOM(parseInt(String(event.target.value)))])
                break
            }
            case 'product': {
                dispatch(['variable', event.target.name, new Product(parseInt(String(event.target.value)))])
                break
            }
            case 'quantity': {
                dispatch(['variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
            case 'uom': {
                dispatch(['variable', event.target.name, new UOM(parseInt(String(event.target.value)))])
                break
            }
        }
    }



    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createBOMItem, {
            bom: state.variable.values.bom.hashCode(),
            product: state.variable.values.product.hashCode(),
            quantity: state.variable.values.quantity,
            uom: state.variable.values.uom.hashCode()
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteBOMItem, {
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
                        'create': `Create B O M Item`,
                        'update': `Update B O M Item`,
                        'show': `B O M Item`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/b-o-m-item-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/b-o-m-item-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/b-o-m-item-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{bOMItemType.keys.bom}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.bom.hashCode()} name='bom'>
                                    <option value='' selected disabled hidden>Select BOM</option>
                                    {bOMList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(bOMList.filter(x => x.id.hashCode() === state.variable.values.bom.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = bOMList.filter(x => x.id.hashCode() === state.variable.values.bom.hashCode()).toArray()[0] as BOMVariable
                                            return <Link to={`/b-o-m/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/b-o-m/${state.variable.values.bom.hashCode()}`}>{state.variable.values.bom.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{bOMItemType.keys.product}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.product.hashCode()} name='product'>
                                    <option value='' selected disabled hidden>Select Product</option>
                                    {productList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(productList.filter(x => x.id.hashCode() === state.variable.values.product.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = productList.filter(x => x.id.hashCode() === state.variable.values.product.hashCode()).toArray()[0] as ProductVariable
                                            return <Link to={`/product/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/product/${state.variable.values.product.hashCode()}`}>{state.variable.values.product.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{bOMItemType.keys.quantity}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='number' onChange={onVariableInputChange} value={state.variable.values.quantity} name='quantity' />,
                                <div className='font-bold text-xl'>{state.variable.values.quantity}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{bOMItemType.keys.uom}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.uom.hashCode()} name='uom'>
                                    <option value='' selected disabled hidden>Select UOM</option>
                                    {uOMList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(uOMList.filter(x => x.id.hashCode() === state.variable.values.uom.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = uOMList.filter(x => x.id.hashCode() === state.variable.values.uom.hashCode()).toArray()[0] as UOMVariable
                                            return <Link to={`/u-o-m/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/u-o-m/${state.variable.values.uom.hashCode()}`}>{state.variable.values.uom.hashCode()}</Link>)
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
