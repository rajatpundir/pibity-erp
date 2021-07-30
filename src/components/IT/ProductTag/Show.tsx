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
import { DiffRow, MappingProductTagRow, ProductRow, ProductTagRow, ProductTagGroupRow } from '../../../main/rows'
import { MappingProductTag, MappingProductTagVariable, Product, ProductVariable, ProductTag, ProductTagVariable, ProductTagGroup, ProductTagGroupVariable } from '../../../main/variables'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: ProductTagVariable
    mappingProductTagList: {
        typeName: 'MappingProductTag'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<Array<string>>
        variable: MappingProductTagVariable
        variables: HashSet<Immutable<MappingProductTagVariable>>
    }
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 
    | ['variable', 'group', ProductTagGroup]
    | ['variable', 'name', string]

    | ['mappingProductTagList', 'limit', number]
    | ['mappingProductTagList', 'offset', number]
    | ['mappingProductTagList', 'page', number]
    | ['mappingProductTagList', 'query', Args]
    | ['mappingProductTagList', 'variable', 'product', Product]
    | ['mappingProductTagList', 'variable', 'tag', ProductTag]
    | ['mappingProductTagList', 'addVariable']
    | ['replace', 'variable', ProductTagVariable]
    | ['replace', 'mappingProductTagList', HashSet<MappingProductTagVariable>]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new ProductTagVariable(-1, { group: new ProductTagGroup(-1), name: '' }),
        mappingProductTagList: {
            typeName: 'MappingProductTag',
            query: getQuery('MappingProductTag'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'product'], ['values', 'tag']),
            variable: new MappingProductTagVariable(-1, { product: new Product(-1), tag: new ProductTag(-1) }),
            variables: HashSet.of<MappingProductTagVariable>()
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
                    case 'group': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'name': {
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
            
            case 'mappingProductTagList': {
                switch (action[1]) {
                    case 'limit': {
                        state[action[0]].limit = Math.max(initialState.mappingProductTagList.limit, action[2])
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
                            case 'product': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'tag': {
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
                        state.mappingProductTagList.variables = state.mappingProductTagList.variables.add(new MappingProductTagVariable(-1, {product: new Product(state.mappingProductTagList.variable.values.product.hashCode()), tag: new ProductTag(state.mappingProductTagList.variable.values.tag.hashCode())}))
                        state.mappingProductTagList.variable = initialState.mappingProductTagList.variable
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
                    case 'mappingProductTagList': {
                        state.mappingProductTagList.variables = action[2]
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

    const productTagType = types['ProductTag']
    const mappingProductTagType = types['MappingProductTag']
    
    const [addMappingProductTagDrawer, toggleAddMappingProductTagDrawer] = useState(false)
    const [mappingProductTagFilter, toggleMappingProductTagFilter] = useState(false)
    
    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.ProductTag.toArray()
            var composedVariables = HashSet.of<Immutable<ProductTagVariable>>().addAll(rows ? rows.map(x => ProductTagRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as ProductTagVariable])

                const mappingProductTagRows = await db.MappingProductTag.toArray()
                var composedMappingProductTagVariables = HashSet.of<Immutable<MappingProductTagVariable>>().addAll(mappingProductTagRows ? mappingProductTagRows.map(x => MappingProductTagRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedMappingProductTagVariables = composedMappingProductTagVariables.filter(x => !diff.variables[state.mappingProductTagList.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.mappingProductTagList.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.mappingProductTagList.variable.typeName].replace)
                })
                dispatch(['replace', 'mappingProductTagList', composedMappingProductTagVariables.filter(variable => variable.values.tag.hashCode() === props.match.params[0]) as HashSet<MappingProductTagVariable>])
            }
        }
    }, [state.variable.typeName, state.mappingProductTagList.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

    const mappingProductTagRows = useLiveQuery(() => db.MappingProductTag.toArray())?.map(x => MappingProductTagRow.toVariable(x))
    var mappingProductTagList = HashSet.of<Immutable<MappingProductTagVariable>>().addAll(mappingProductTagRows ? mappingProductTagRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        mappingProductTagList = mappingProductTagList.filter(x => !diff.variables.MappingProductTag.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.MappingProductTag.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.MappingProductTag.replace)
    })

    const productRows = useLiveQuery(() => db.Product.toArray())?.map(x => ProductRow.toVariable(x))
    var productList = HashSet.of<Immutable<ProductVariable>>().addAll(productRows ? productRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        productList = productList.filter(x => !diff.variables.Product.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.Product.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.Product.replace)
    })

    const productTagRows = useLiveQuery(() => db.ProductTag.toArray())?.map(x => ProductTagRow.toVariable(x))
    var productTagList = HashSet.of<Immutable<ProductTagVariable>>().addAll(productTagRows ? productTagRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        productTagList = productTagList.filter(x => !diff.variables.ProductTag.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.ProductTag.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.ProductTag.replace)
    })

    const productTagGroupRows = useLiveQuery(() => db.ProductTagGroup.toArray())?.map(x => ProductTagGroupRow.toVariable(x))
    var productTagGroupList = HashSet.of<Immutable<ProductTagGroupVariable>>().addAll(productTagGroupRows ? productTagGroupRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        productTagGroupList = productTagGroupList.filter(x => !diff.variables.ProductTagGroup.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.ProductTagGroup.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.ProductTagGroup.replace)
    })

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'group': {
                dispatch(['variable', event.target.name, new ProductTagGroup(parseInt(String(event.target.value)))])
                break
            }
            case 'name': {
                dispatch(['variable', event.target.name, String(event.target.value)])
                break
            }
        }
    }
    const onMappingProductTagInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'product': {
                dispatch(['mappingProductTagList', 'variable', event.target.name, new Product(parseInt(String(event.target.value)))])
                break
            }
            case 'tag': {
                dispatch(['mappingProductTagList', 'variable', event.target.name, new ProductTag(parseInt(String(event.target.value)))])
                break
            }
        }
    }

    const updateItemsQuery = (list: 'mappingProductTagList') => {
        const fx = (args: Args) => {
            switch (list) {
                case 'mappingProductTagList': {
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

    const updatePage = (list: 'mappingProductTagList') => {
        const fx = (args: ['limit', number] | ['offset', number] | ['page', number]) => {
            dispatch([list, args[0], args[1]])
        }
        return fx
    }

    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createProductTag, {
            group: state.variable.values.group.hashCode(),
            name: state.variable.values.name,
            mappingProductTagList: state.mappingProductTagList.variables.toArray().map(variable => {
                return {
                    product: variable.values.product.hashCode(),
                    tag: variable.values.tag.hashCode()
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteProductTag, {
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
                        'create': `Create Product Tag`,
                        'update': `Update Product Tag`,
                        'show': `Product Tag`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/product-tag-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/product-tag-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/product-tag-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{productTagType.keys.group}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.group.hashCode()} name='group'>
                                    <option value='' selected disabled hidden>Select Group</option>
                                    {productTagGroupList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(productTagGroupList.filter(x => x.id.hashCode() === state.variable.values.group.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = productTagGroupList.filter(x => x.id.hashCode() === state.variable.values.group.hashCode()).toArray()[0] as ProductTagGroupVariable
                                            return <Link to={`/product-tag-group/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/product-tag-group/${state.variable.values.group.hashCode()}`}>{state.variable.values.group.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{productTagType.keys.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.name} name='name' />,
                                <div className='font-bold text-xl'>{state.variable.values.name}</div>
                            )
                        }
                    </Item>
                </Container>
                <Container area={Grid.mappingProductTagArea} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title> Mapping Product Tag List</Title>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <button onClick={() => toggleAddMappingProductTagDrawer(true)} className='text-3xl font-bold text-white bg-gray-800 rounded-md px-2 h-10 focus:outline-none'>+</button>,
                                undefined
                            )
                        }
                    </Item>
                    <Item area={Grid2.filter} justify='end' align='center' className='flex'>
                        <Button onClick={() => toggleMappingProductTagFilter(true)}>Filter</Button>
                        <Drawer open={mappingProductTagFilter} onClose={() => toggleMappingProductTagFilter(false)} anchor={'right'}>
                            <Filter typeName='MappingProductTag' query={state['mappingProductTagList'].query} updateQuery={updateItemsQuery('mappingProductTagList')} />
                        </Drawer>
                        <Drawer open={addMappingProductTagDrawer} onClose={() => toggleAddMappingProductTagDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add {mappingProductTagType.name}</div>
                                <Container area={none} layout={Grid.layouts.uom} className=''>
                                    <Item>
                                        <Label>{mappingProductTagType.keys.product}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onMappingProductTagInputChange} value={state.mappingProductTagList.variable.values.product.hashCode()} name='product'>
                                                    <option value='' selected disabled hidden>Select Product</option>
                                                    {productList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(productList.filter(x => x.id.hashCode() === state.mappingProductTagList.variable.values.product.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = productList.filter(x => x.id.hashCode() === state.mappingProductTagList.variable.values.product.hashCode()).toArray()[0] as ProductVariable
                                                            return <Link to={`/product/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/product/${state.mappingProductTagList.variable.values.product.hashCode()}`}>{state.mappingProductTagList.variable.values.product.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{mappingProductTagType.keys.tag}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onMappingProductTagInputChange} value={state.mappingProductTagList.variable.values.tag.hashCode()} name='tag'>
                                                    <option value='' selected disabled hidden>Select Tag</option>
                                                    {productTagList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(productTagList.filter(x => x.id.hashCode() === state.mappingProductTagList.variable.values.tag.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = productTagList.filter(x => x.id.hashCode() === state.mappingProductTagList.variable.values.tag.hashCode()).toArray()[0] as ProductTagVariable
                                                            return <Link to={`/product-tag/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/product-tag/${state.mappingProductTagList.variable.values.tag.hashCode()}`}>{state.mappingProductTagList.variable.values.tag.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item justify='center' align='center'>
                                        <Button onClick={() => dispatch(['mappingProductTagList', 'addVariable'])}>Add</Button>
                                    </Item>
                                </Container>
                            </div>
                        </Drawer>
                    </Item>
                    <Table area={Grid2.table} state={state['mappingProductTagList']} updatePage={updatePage('mappingProductTagList')} variables={state.mappingProductTagList.variables.filter(variable => applyFilter(state['mappingProductTagList'].query, variable)).toArray()} columns={state['mappingProductTagList'].columns.toArray()} />
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
