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
import { DiffRow, BomRow, BomItemRow, ProductRow, UomRow } from '../../../main/rows'
import { Bom, BomVariable, BomItemVariable, Product, ProductVariable, Uom, UomVariable } from '../../../main/variables'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: BomItemVariable
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 
    | ['variable', 'bom', Bom]
    | ['variable', 'product', Product]
    | ['variable', 'quantity', number]
    | ['variable', 'uom', Uom]

    | ['replace', 'variable', BomItemVariable]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new BomItemVariable(-1, { bom: new Bom(-1), product: new Product(-1), quantity: 0, uom: new Uom(-1) })
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

    const bomItemType = types['BomItem']
    
    
    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.BomItem.toArray()
            var composedVariables = HashSet.of<Immutable<BomItemVariable>>().addAll(rows ? rows.map(x => BomItemRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as BomItemVariable])
            }
        }
    }, [state.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

    const bomRows = useLiveQuery(() => db.Bom.toArray())?.map(x => BomRow.toVariable(x))
    var bomList = HashSet.of<Immutable<BomVariable>>().addAll(bomRows ? bomRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        bomList = bomList.filter(x => !diff.variables.Bom.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.Bom.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.Bom.replace)
    })

    const bomItemRows = useLiveQuery(() => db.BomItem.toArray())?.map(x => BomItemRow.toVariable(x))
    var bomItemList = HashSet.of<Immutable<BomItemVariable>>().addAll(bomItemRows ? bomItemRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        bomItemList = bomItemList.filter(x => !diff.variables.BomItem.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.BomItem.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.BomItem.replace)
    })

    const productRows = useLiveQuery(() => db.Product.toArray())?.map(x => ProductRow.toVariable(x))
    var productList = HashSet.of<Immutable<ProductVariable>>().addAll(productRows ? productRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        productList = productList.filter(x => !diff.variables.Product.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.Product.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.Product.replace)
    })

    const uomRows = useLiveQuery(() => db.Uom.toArray())?.map(x => UomRow.toVariable(x))
    var uomList = HashSet.of<Immutable<UomVariable>>().addAll(uomRows ? uomRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        uomList = uomList.filter(x => !diff.variables.Uom.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.Uom.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.Uom.replace)
    })

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'bom': {
                dispatch(['variable', event.target.name, new Bom(parseInt(String(event.target.value)))])
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
                dispatch(['variable', event.target.name, new Uom(parseInt(String(event.target.value)))])
                break
            }
        }
    }



    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createBomItem, {
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteBomItem, {
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
                        'create': `Create Bom Item`,
                        'update': `Update Bom Item`,
                        'show': `Bom Item`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/bom-item-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/bom-item-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/bom-item-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{bomItemType.keys.bom}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.bom.hashCode()} name='bom'>
                                    <option value='' selected disabled hidden>Select BOM</option>
                                    {bomList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(bomList.filter(x => x.id.hashCode() === state.variable.values.bom.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = bomList.filter(x => x.id.hashCode() === state.variable.values.bom.hashCode()).toArray()[0] as BomVariable
                                            return <Link to={`/bom/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/bom/${state.variable.values.bom.hashCode()}`}>{state.variable.values.bom.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{bomItemType.keys.product}</Label>
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
                        <Label>{bomItemType.keys.quantity}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='number' onChange={onVariableInputChange} value={state.variable.values.quantity} name='quantity' />,
                                <div className='font-bold text-xl'>{state.variable.values.quantity}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{bomItemType.keys.uom}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.uom.hashCode()} name='uom'>
                                    <option value='' selected disabled hidden>Select Uom</option>
                                    {uomList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(uomList.filter(x => x.id.hashCode() === state.variable.values.uom.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = uomList.filter(x => x.id.hashCode() === state.variable.values.uom.hashCode()).toArray()[0] as UomVariable
                                            return <Link to={`/uom/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/uom/${state.variable.values.uom.hashCode()}`}>{state.variable.values.uom.hashCode()}</Link>)
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
