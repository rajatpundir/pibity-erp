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
import { DiffRow, BOMRow, MaterialRequistionSlipItemRow, ProductionPreparationSlipRow, ProductionPreparationSlipItemRow } from '../../../main/rows'
import { BOM, BOMVariable, MaterialRequistionSlipItem, MaterialRequistionSlipItemVariable, ProductionPreparationSlip, ProductionPreparationSlipVariable, ProductionPreparationSlipItem, ProductionPreparationSlipItemVariable } from '../../../main/variables'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: ProductionPreparationSlipVariable
    productionPreparationSlipItemList: {
        typeName: 'ProductionPreparationSlipItem'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<Array<string>>
        variable: ProductionPreparationSlipItemVariable
        variables: HashSet<Immutable<ProductionPreparationSlipItemVariable>>
    }
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 
    | ['variable', 'bom', BOM]
    | ['variable', 'approved', number]
    | ['variable', 'scrapped', number]

    | ['productionPreparationSlipItemList', 'limit', number]
    | ['productionPreparationSlipItemList', 'offset', number]
    | ['productionPreparationSlipItemList', 'page', number]
    | ['productionPreparationSlipItemList', 'query', Args]
    | ['productionPreparationSlipItemList', 'variable', 'productionPreparationSlip', ProductionPreparationSlip]
    | ['productionPreparationSlipItemList', 'variable', 'bomItem', string]
    | ['productionPreparationSlipItemList', 'variable', 'materialRequistionSlipItem', MaterialRequistionSlipItem]
    | ['productionPreparationSlipItemList', 'addVariable']
    | ['replace', 'variable', ProductionPreparationSlipVariable]
    | ['replace', 'productionPreparationSlipItemList', HashSet<ProductionPreparationSlipItemVariable>]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new ProductionPreparationSlipVariable(-1, { bom: new BOM(-1), approved: 0, scrapped: 0 }),
        productionPreparationSlipItemList: {
            typeName: 'ProductionPreparationSlipItem',
            query: getQuery('ProductionPreparationSlipItem'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'productionPreparationSlip'], ['values', 'bomItem'], ['values', 'materialRequistionSlipItem']),
            variable: new ProductionPreparationSlipItemVariable(-1, { productionPreparationSlip: new ProductionPreparationSlip(-1), bomItem: '', materialRequistionSlipItem: new MaterialRequistionSlipItem(-1) }),
            variables: HashSet.of<ProductionPreparationSlipItemVariable>()
        }
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
                    case 'approved': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'scrapped': {
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
            
            case 'productionPreparationSlipItemList': {
                switch (action[1]) {
                    case 'limit': {
                        state[action[0]].limit = Math.max(initialState.productionPreparationSlipItemList.limit, action[2])
                        break
                    }
                    case 'offset': {
                        state[action[0]].offset = Math.max(0, action[2])
                        state[action[0]].page = Math.max(0, action[2]) + 1
                        break
                    }
                    case 'page': {
                        state[action[0]].page = action[2]
                        break
                    }
                    case 'query': {
                        updateQuery(state[action[0]].query, action[2])
                        break
                    }
                    case 'variable': {
                        switch (action[2]) {
                            case 'productionPreparationSlip': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'bomItem': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'materialRequistionSlipItem': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            default: {
                                const _exhaustiveCheck: never = action;
                                return _exhaustiveCheck;
                            }
                        }
                        break
                    }
                    case 'addVariable': {
                        state.productionPreparationSlipItemList.variables = state.productionPreparationSlipItemList.variables.add(new ProductionPreparationSlipItemVariable(-1, {productionPreparationSlip: new ProductionPreparationSlip(state.productionPreparationSlipItemList.variable.values.productionPreparationSlip.hashCode()), bomItem: state.productionPreparationSlipItemList.variable.values.bomItem, materialRequistionSlipItem: new MaterialRequistionSlipItem(state.productionPreparationSlipItemList.variable.values.materialRequistionSlipItem.hashCode())}))
                        state.productionPreparationSlipItemList.variable = initialState.productionPreparationSlipItemList.variable
                        break
                    }
                    default: {
                        const _exhaustiveCheck: never = action
                        return _exhaustiveCheck
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
                    case 'productionPreparationSlipItemList': {
                        state.productionPreparationSlipItemList.variables = action[2]
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

    const productionPreparationSlipType = types['ProductionPreparationSlip']
    const productionPreparationSlipItemType = types['ProductionPreparationSlipItem']
    
    const [addProductionPreparationSlipItemDrawer, toggleAddProductionPreparationSlipItemDrawer] = useState(false)
    const [productionPreparationSlipItemFilter, toggleProductionPreparationSlipItemFilter] = useState(false)
    
    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.ProductionPreparationSlip.toArray()
            var composedVariables = HashSet.of<Immutable<ProductionPreparationSlipVariable>>().addAll(rows ? rows.map(x => ProductionPreparationSlipRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as ProductionPreparationSlipVariable])

                const productionPreparationSlipItemRows = await db.ProductionPreparationSlipItem.toArray()
                var composedProductionPreparationSlipItemVariables = HashSet.of<Immutable<ProductionPreparationSlipItemVariable>>().addAll(productionPreparationSlipItemRows ? productionPreparationSlipItemRows.map(x => ProductionPreparationSlipItemRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedProductionPreparationSlipItemVariables = composedProductionPreparationSlipItemVariables.filter(x => !diff.variables[state.productionPreparationSlipItemList.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.productionPreparationSlipItemList.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.productionPreparationSlipItemList.variable.typeName].replace)
                })
                dispatch(['replace', 'productionPreparationSlipItemList', composedProductionPreparationSlipItemVariables.filter(variable => variable.values.productionPreparationSlip.hashCode() === props.match.params[0]) as HashSet<ProductionPreparationSlipItemVariable>])
            }
        }
    }, [state.variable.typeName, state.productionPreparationSlipItemList.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

    const bOMRows = useLiveQuery(() => db.BOM.toArray())?.map(x => BOMRow.toVariable(x))
    var bOMList = HashSet.of<Immutable<BOMVariable>>().addAll(bOMRows ? bOMRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        bOMList = bOMList.filter(x => !diff.variables.BOM.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.BOM.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.BOM.replace)
    })

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
            case 'bom': {
                dispatch(['variable', event.target.name, new BOM(parseInt(String(event.target.value)))])
                break
            }
            case 'approved': {
                dispatch(['variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
            case 'scrapped': {
                dispatch(['variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
        }
    }
    const onProductionPreparationSlipItemInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'productionPreparationSlip': {
                dispatch(['productionPreparationSlipItemList', 'variable', event.target.name, new ProductionPreparationSlip(parseInt(String(event.target.value)))])
                break
            }
            case 'bomItem': {
                dispatch(['productionPreparationSlipItemList', 'variable', event.target.name, String(event.target.value)])
                break
            }
            case 'materialRequistionSlipItem': {
                dispatch(['productionPreparationSlipItemList', 'variable', event.target.name, new MaterialRequistionSlipItem(parseInt(String(event.target.value)))])
                break
            }
        }
    }

    const updateItemsQuery = (list: 'productionPreparationSlipItemList') => {
        const fx = (args: Args) => {
            switch (list) {
                case 'productionPreparationSlipItemList': {
                    dispatch([list, 'query', args])
                    break
                }
                default: {
                    const _exhaustiveCheck: never = list
                    return _exhaustiveCheck
                }
            }
        }
        return fx
    }

    const updatePage = (list: 'productionPreparationSlipItemList') => {
        const fx = (args: ['limit', number] | ['offset', number] | ['page', number]) => {
            dispatch([list, args[0], args[1]])
        }
        return fx
    }

    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createProductionPreparationSlip, {
            bom: state.variable.values.bom.hashCode(),
            approved: state.variable.values.approved,
            scrapped: state.variable.values.scrapped,
            productionPreparationSlipItemList: state.productionPreparationSlipItemList.variables.toArray().map(variable => {
                return {
                    productionPreparationSlip: variable.values.productionPreparationSlip.hashCode(),
                    bomItem: variable.values.bomItem,
                    materialRequistionSlipItem: variable.values.materialRequistionSlipItem.hashCode()
                }
            })
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteProductionPreparationSlip, {
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
                        'create': `Create Production Preparation Slip`,
                        'update': `Update Production Preparation Slip`,
                        'show': `Production Preparation Slip`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/production-preparation-slip-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/production-preparation-slip-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/production-preparation-slip-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{productionPreparationSlipType.keys.bom}</Label>
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
                        <Label>{productionPreparationSlipType.keys.approved}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='number' onChange={onVariableInputChange} value={state.variable.values.approved} name='approved' />,
                                <div className='font-bold text-xl'>{state.variable.values.approved}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{productionPreparationSlipType.keys.scrapped}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='number' onChange={onVariableInputChange} value={state.variable.values.scrapped} name='scrapped' />,
                                <div className='font-bold text-xl'>{state.variable.values.scrapped}</div>
                            )
                        }
                    </Item>
                </Container>
                <Container area={Grid.productionPreparationSlipItemArea} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title> Production Preparation Slip Item List</Title>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <button onClick={() => toggleAddProductionPreparationSlipItemDrawer(true)} className='text-3xl font-bold text-white bg-gray-800 rounded-md px-2 h-10 focus:outline-none'>+</button>,
                                undefined
                            )
                        }
                    </Item>
                    <Item area={Grid2.filter} justify='end' align='center' className='flex'>
                        <Button onClick={() => toggleProductionPreparationSlipItemFilter(true)}>Filter</Button>
                        <Drawer open={productionPreparationSlipItemFilter} onClose={() => toggleProductionPreparationSlipItemFilter(false)} anchor={'right'}>
                            <Filter typeName='ProductionPreparationSlipItem' query={state['productionPreparationSlipItemList'].query} updateQuery={updateItemsQuery('productionPreparationSlipItemList')} />
                        </Drawer>
                        <Drawer open={addProductionPreparationSlipItemDrawer} onClose={() => toggleAddProductionPreparationSlipItemDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add {productionPreparationSlipItemType.name}</div>
                                <Container area={none} layout={Grid.layouts.uom} className=''>
                                    <Item>
                                        <Label>{productionPreparationSlipItemType.keys.productionPreparationSlip}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onProductionPreparationSlipItemInputChange} value={state.productionPreparationSlipItemList.variable.values.productionPreparationSlip.hashCode()} name='productionPreparationSlip'>
                                                    <option value='' selected disabled hidden>Select Production Preparation Slip</option>
                                                    {productionPreparationSlipList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(productionPreparationSlipList.filter(x => x.id.hashCode() === state.productionPreparationSlipItemList.variable.values.productionPreparationSlip.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = productionPreparationSlipList.filter(x => x.id.hashCode() === state.productionPreparationSlipItemList.variable.values.productionPreparationSlip.hashCode()).toArray()[0] as ProductionPreparationSlipVariable
                                                            return <Link to={`/production-preparation-slip/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/production-preparation-slip/${state.productionPreparationSlipItemList.variable.values.productionPreparationSlip.hashCode()}`}>{state.productionPreparationSlipItemList.variable.values.productionPreparationSlip.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{productionPreparationSlipItemType.keys.bomItem}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='text' onChange={onProductionPreparationSlipItemInputChange} value={state.productionPreparationSlipItemList.variable.values.bomItem} name='bomItem' />,
                                                <div className='font-bold text-xl'>{state.productionPreparationSlipItemList.variable.values.bomItem}</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{productionPreparationSlipItemType.keys.materialRequistionSlipItem}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onProductionPreparationSlipItemInputChange} value={state.productionPreparationSlipItemList.variable.values.materialRequistionSlipItem.hashCode()} name='materialRequistionSlipItem'>
                                                    <option value='' selected disabled hidden>Select Material Requistion Slip Item</option>
                                                    {materialRequistionSlipItemList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(materialRequistionSlipItemList.filter(x => x.id.hashCode() === state.productionPreparationSlipItemList.variable.values.materialRequistionSlipItem.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = materialRequistionSlipItemList.filter(x => x.id.hashCode() === state.productionPreparationSlipItemList.variable.values.materialRequistionSlipItem.hashCode()).toArray()[0] as MaterialRequistionSlipItemVariable
                                                            return <Link to={`/material-requistion-slip-item/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/material-requistion-slip-item/${state.productionPreparationSlipItemList.variable.values.materialRequistionSlipItem.hashCode()}`}>{state.productionPreparationSlipItemList.variable.values.materialRequistionSlipItem.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item justify='center' align='center'>
                                        <Button onClick={() => dispatch(['productionPreparationSlipItemList', 'addVariable'])}>Add</Button>
                                    </Item>
                                </Container>
                            </div>
                        </Drawer>
                    </Item>
                    <Table area={Grid2.table} state={state['productionPreparationSlipItemList']} updatePage={updatePage('productionPreparationSlipItemList')} variables={state.productionPreparationSlipItemList.variables.filter(variable => applyFilter(state['productionPreparationSlipItemList'].query, variable)).toArray()} columns={state['productionPreparationSlipItemList'].columns.toArray()} />
                </Container > 
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
