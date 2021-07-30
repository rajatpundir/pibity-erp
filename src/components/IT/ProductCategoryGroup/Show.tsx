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
import { DiffRow, ProductCategoryRow, ProductCategoryGroupRow } from '../../../main/rows'
import { ProductCategory, ProductCategoryVariable, ProductCategoryGroup, ProductCategoryGroupVariable } from '../../../main/variables'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: ProductCategoryGroupVariable
    productCategoryList: {
        typeName: 'ProductCategory'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<Array<string>>
        variable: ProductCategoryVariable
        variables: HashSet<Immutable<ProductCategoryVariable>>
    }
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 
    | ['variable', 'parent', ProductCategoryGroup]
    | ['variable', 'name', string]
    | ['variable', 'length', number]

    | ['productCategoryList', 'limit', number]
    | ['productCategoryList', 'offset', number]
    | ['productCategoryList', 'page', number]
    | ['productCategoryList', 'query', Args]
    | ['productCategoryList', 'variable', 'parent', ProductCategory]
    | ['productCategoryList', 'variable', 'group', ProductCategoryGroup]
    | ['productCategoryList', 'variable', 'name', string]
    | ['productCategoryList', 'variable', 'code', string]
    | ['productCategoryList', 'variable', 'derivedCode', string]
    | ['productCategoryList', 'variable', 'childCount', number]
    | ['productCategoryList', 'addVariable']
    | ['replace', 'variable', ProductCategoryGroupVariable]
    | ['replace', 'productCategoryList', HashSet<ProductCategoryVariable>]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new ProductCategoryGroupVariable(-1, { parent: new ProductCategoryGroup(-1), name: '', length: 0 }),
        productCategoryList: {
            typeName: 'ProductCategory',
            query: getQuery('ProductCategory'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'parent'], ['values', 'group'], ['values', 'name'], ['values', 'code'], ['values', 'derivedCode'], ['values', 'childCount']),
            variable: new ProductCategoryVariable(-1, { parent: new ProductCategory(-1), group: new ProductCategoryGroup(-1), name: '', code: '', derivedCode: '', childCount: 0 }),
            variables: HashSet.of<ProductCategoryVariable>()
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
                    case 'parent': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'name': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'length': {
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
            
            case 'productCategoryList': {
                switch (action[1]) {
                    case 'limit': {
                        state[action[0]].limit = Math.max(initialState.productCategoryList.limit, action[2])
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
                            case 'parent': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'group': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'name': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'code': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'derivedCode': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'childCount': {
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
                        state.productCategoryList.variables = state.productCategoryList.variables.add(new ProductCategoryVariable(-1, {parent: new ProductCategory(state.productCategoryList.variable.values.parent.hashCode()), group: new ProductCategoryGroup(state.productCategoryList.variable.values.group.hashCode()), name: state.productCategoryList.variable.values.name, code: state.productCategoryList.variable.values.code, derivedCode: state.productCategoryList.variable.values.derivedCode, childCount: state.productCategoryList.variable.values.childCount}))
                        state.productCategoryList.variable = initialState.productCategoryList.variable
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
                    case 'productCategoryList': {
                        state.productCategoryList.variables = action[2]
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

    const productCategoryGroupType = types['ProductCategoryGroup']
    const productCategoryType = types['ProductCategory']
    
    const [addProductCategoryDrawer, toggleAddProductCategoryDrawer] = useState(false)
    const [productCategoryFilter, toggleProductCategoryFilter] = useState(false)
    
    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.ProductCategoryGroup.toArray()
            var composedVariables = HashSet.of<Immutable<ProductCategoryGroupVariable>>().addAll(rows ? rows.map(x => ProductCategoryGroupRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as ProductCategoryGroupVariable])

                const productCategoryRows = await db.ProductCategory.toArray()
                var composedProductCategoryVariables = HashSet.of<Immutable<ProductCategoryVariable>>().addAll(productCategoryRows ? productCategoryRows.map(x => ProductCategoryRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedProductCategoryVariables = composedProductCategoryVariables.filter(x => !diff.variables[state.productCategoryList.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.productCategoryList.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.productCategoryList.variable.typeName].replace)
                })
                dispatch(['replace', 'productCategoryList', composedProductCategoryVariables.filter(variable => variable.values.group.hashCode() === props.match.params[0]) as HashSet<ProductCategoryVariable>])
            }
        }
    }, [state.variable.typeName, state.productCategoryList.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

    const productCategoryRows = useLiveQuery(() => db.ProductCategory.toArray())?.map(x => ProductCategoryRow.toVariable(x))
    var productCategoryList = HashSet.of<Immutable<ProductCategoryVariable>>().addAll(productCategoryRows ? productCategoryRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        productCategoryList = productCategoryList.filter(x => !diff.variables.ProductCategory.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.ProductCategory.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.ProductCategory.replace)
    })

    const productCategoryGroupRows = useLiveQuery(() => db.ProductCategoryGroup.toArray())?.map(x => ProductCategoryGroupRow.toVariable(x))
    var productCategoryGroupList = HashSet.of<Immutable<ProductCategoryGroupVariable>>().addAll(productCategoryGroupRows ? productCategoryGroupRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        productCategoryGroupList = productCategoryGroupList.filter(x => !diff.variables.ProductCategoryGroup.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.ProductCategoryGroup.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.ProductCategoryGroup.replace)
    })

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'parent': {
                dispatch(['variable', event.target.name, new ProductCategoryGroup(parseInt(String(event.target.value)))])
                break
            }
            case 'name': {
                dispatch(['variable', event.target.name, String(event.target.value)])
                break
            }
            case 'length': {
                dispatch(['variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
        }
    }
    const onProductCategoryInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'parent': {
                dispatch(['productCategoryList', 'variable', event.target.name, new ProductCategory(parseInt(String(event.target.value)))])
                break
            }
            case 'group': {
                dispatch(['productCategoryList', 'variable', event.target.name, new ProductCategoryGroup(parseInt(String(event.target.value)))])
                break
            }
            case 'name': {
                dispatch(['productCategoryList', 'variable', event.target.name, String(event.target.value)])
                break
            }
            case 'code': {
                dispatch(['productCategoryList', 'variable', event.target.name, String(event.target.value)])
                break
            }
            case 'derivedCode': {
                dispatch(['productCategoryList', 'variable', event.target.name, String(event.target.value)])
                break
            }
            case 'childCount': {
                dispatch(['productCategoryList', 'variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
        }
    }

    const updateItemsQuery = (list: 'productCategoryList') => {
        const fx = (args: Args) => {
            switch (list) {
                case 'productCategoryList': {
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

    const updatePage = (list: 'productCategoryList') => {
        const fx = (args: ['limit', number] | ['offset', number] | ['page', number]) => {
            dispatch([list, args[0], args[1]])
        }
        return fx
    }

    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createProductCategoryGroup, {
            parent: state.variable.values.parent.hashCode(),
            name: state.variable.values.name,
            length: state.variable.values.length,
            productCategoryList: state.productCategoryList.variables.toArray().map(variable => {
                return {
                    parent: variable.values.parent.hashCode(),
                    group: variable.values.group.hashCode(),
                    name: variable.values.name,
                    code: variable.values.code,
                    derivedCode: variable.values.derivedCode,
                    childCount: variable.values.childCount
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteProductCategoryGroup, {
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
                        'create': `Create Product Category Group`,
                        'update': `Update Product Category Group`,
                        'show': `Product Category Group`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/product-category-group-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/product-category-group-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/product-category-group-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{productCategoryGroupType.keys.parent}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.parent.hashCode()} name='parent'>
                                    <option value='' selected disabled hidden>Select Parent</option>
                                    {productCategoryGroupList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(productCategoryGroupList.filter(x => x.id.hashCode() === state.variable.values.parent.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = productCategoryGroupList.filter(x => x.id.hashCode() === state.variable.values.parent.hashCode()).toArray()[0] as ProductCategoryGroupVariable
                                            return <Link to={`/product-category-group/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/product-category-group/${state.variable.values.parent.hashCode()}`}>{state.variable.values.parent.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{productCategoryGroupType.keys.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.name} name='name' />,
                                <div className='font-bold text-xl'>{state.variable.values.name}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{productCategoryGroupType.keys.length}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='number' onChange={onVariableInputChange} value={state.variable.values.length} name='length' />,
                                <div className='font-bold text-xl'>{state.variable.values.length}</div>
                            )
                        }
                    </Item>
                </Container>
                <Container area={Grid.productCategoryArea} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title> Product Category List</Title>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <button onClick={() => toggleAddProductCategoryDrawer(true)} className='text-3xl font-bold text-white bg-gray-800 rounded-md px-2 h-10 focus:outline-none'>+</button>,
                                undefined
                            )
                        }
                    </Item>
                    <Item area={Grid2.filter} justify='end' align='center' className='flex'>
                        <Button onClick={() => toggleProductCategoryFilter(true)}>Filter</Button>
                        <Drawer open={productCategoryFilter} onClose={() => toggleProductCategoryFilter(false)} anchor={'right'}>
                            <Filter typeName='ProductCategory' query={state['productCategoryList'].query} updateQuery={updateItemsQuery('productCategoryList')} />
                        </Drawer>
                        <Drawer open={addProductCategoryDrawer} onClose={() => toggleAddProductCategoryDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add {productCategoryType.name}</div>
                                <Container area={none} layout={Grid.layouts.uom} className=''>
                                    <Item>
                                        <Label>{productCategoryType.keys.parent}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onProductCategoryInputChange} value={state.productCategoryList.variable.values.parent.hashCode()} name='parent'>
                                                    <option value='' selected disabled hidden>Select Parent</option>
                                                    {productCategoryList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(productCategoryList.filter(x => x.id.hashCode() === state.productCategoryList.variable.values.parent.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = productCategoryList.filter(x => x.id.hashCode() === state.productCategoryList.variable.values.parent.hashCode()).toArray()[0] as ProductCategoryVariable
                                                            return <Link to={`/product-category/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/product-category/${state.productCategoryList.variable.values.parent.hashCode()}`}>{state.productCategoryList.variable.values.parent.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{productCategoryType.keys.group}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onProductCategoryInputChange} value={state.productCategoryList.variable.values.group.hashCode()} name='group'>
                                                    <option value='' selected disabled hidden>Select Group</option>
                                                    {productCategoryGroupList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(productCategoryGroupList.filter(x => x.id.hashCode() === state.productCategoryList.variable.values.group.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = productCategoryGroupList.filter(x => x.id.hashCode() === state.productCategoryList.variable.values.group.hashCode()).toArray()[0] as ProductCategoryGroupVariable
                                                            return <Link to={`/product-category-group/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/product-category-group/${state.productCategoryList.variable.values.group.hashCode()}`}>{state.productCategoryList.variable.values.group.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{productCategoryType.keys.name}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='text' onChange={onProductCategoryInputChange} value={state.productCategoryList.variable.values.name} name='name' />,
                                                <div className='font-bold text-xl'>{state.productCategoryList.variable.values.name}</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{productCategoryType.keys.code}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='text' onChange={onProductCategoryInputChange} value={state.productCategoryList.variable.values.code} name='code' />,
                                                <div className='font-bold text-xl'>{state.productCategoryList.variable.values.code}</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{productCategoryType.keys.derivedCode}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <div className='font-bold text-xl'>{state.productCategoryList.variable.values.derivedCode}</div>,
                                                <div className='font-bold text-xl'>{state.productCategoryList.variable.values.derivedCode}</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{productCategoryType.keys.childCount}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='number' onChange={onProductCategoryInputChange} value={state.productCategoryList.variable.values.childCount} name='childCount' />,
                                                <div className='font-bold text-xl'>{state.productCategoryList.variable.values.childCount}</div>
                                            )
                                        }
                                    </Item>
                                    <Item justify='center' align='center'>
                                        <Button onClick={() => dispatch(['productCategoryList', 'addVariable'])}>Add</Button>
                                    </Item>
                                </Container>
                            </div>
                        </Drawer>
                    </Item>
                    <Table area={Grid2.table} state={state['productCategoryList']} updatePage={updatePage('productCategoryList')} variables={state.productCategoryList.variables.filter(variable => applyFilter(state['productCategoryList'].query, variable)).toArray()} columns={state['productCategoryList'].columns.toArray()} />
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
