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
import { DiffRow, CompanyRow, CompanyProductRow, MappingProductTagRow, ProductRow, ProductCategoryRow, ProductTagRow, UOMRow } from '../../../main/rows'
import { Company, CompanyVariable, CompanyProduct, CompanyProductVariable, MappingProductTag, MappingProductTagVariable, Product, ProductVariable, ProductCategory, ProductCategoryVariable, ProductTag, ProductTagVariable, UOM, UOMVariable } from '../../../main/variables'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: ProductVariable
    companyProductList: {
        typeName: 'CompanyProduct'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<Array<string>>
        variable: CompanyProductVariable
        variables: HashSet<Immutable<CompanyProductVariable>>
    }
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
    uOMList: {
        typeName: 'UOM'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<Array<string>>
        variable: UOMVariable
        variables: HashSet<Immutable<UOMVariable>>
    }
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 
    | ['variable', 'name', string]
    | ['variable', 'category', ProductCategory]
    | ['variable', 'code', string]
    | ['variable', 'sku', string]

    | ['companyProductList', 'limit', number]
    | ['companyProductList', 'offset', number]
    | ['companyProductList', 'page', number]
    | ['companyProductList', 'query', Args]
    | ['companyProductList', 'variable', 'company', Company]
    | ['companyProductList', 'variable', 'product', Product]
    | ['companyProductList', 'addVariable']

    | ['mappingProductTagList', 'limit', number]
    | ['mappingProductTagList', 'offset', number]
    | ['mappingProductTagList', 'page', number]
    | ['mappingProductTagList', 'query', Args]
    | ['mappingProductTagList', 'variable', 'product', Product]
    | ['mappingProductTagList', 'variable', 'tag', ProductTag]
    | ['mappingProductTagList', 'addVariable']

    | ['uOMList', 'limit', number]
    | ['uOMList', 'offset', number]
    | ['uOMList', 'page', number]
    | ['uOMList', 'query', Args]
    | ['uOMList', 'variable', 'product', Product]
    | ['uOMList', 'variable', 'name', string]
    | ['uOMList', 'variable', 'conversionRate', number]
    | ['uOMList', 'addVariable']
    | ['replace', 'variable', ProductVariable]
    | ['replace', 'companyProductList', HashSet<CompanyProductVariable>]
    | ['replace', 'mappingProductTagList', HashSet<MappingProductTagVariable>]
    | ['replace', 'uOMList', HashSet<UOMVariable>]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new ProductVariable(-1, { name: '', category: new ProductCategory(-1), code: '', sku: '' }),
        companyProductList: {
            typeName: 'CompanyProduct',
            query: getQuery('CompanyProduct'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'company'], ['values', 'product']),
            variable: new CompanyProductVariable(-1, { company: new Company(-1), product: new Product(-1) }),
            variables: HashSet.of<CompanyProductVariable>()
        },
        mappingProductTagList: {
            typeName: 'MappingProductTag',
            query: getQuery('MappingProductTag'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'product'], ['values', 'tag']),
            variable: new MappingProductTagVariable(-1, { product: new Product(-1), tag: new ProductTag(-1) }),
            variables: HashSet.of<MappingProductTagVariable>()
        },
        uOMList: {
            typeName: 'UOM',
            query: getQuery('UOM'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'product'], ['values', 'name'], ['values', 'conversionRate']),
            variable: new UOMVariable(-1, { product: new Product(-1), name: '', conversionRate: 0 }),
            variables: HashSet.of<UOMVariable>()
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
                    case 'name': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'category': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'code': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'sku': {
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
            
            case 'companyProductList': {
                switch (action[1]) {
                    case 'limit': {
                        state[action[0]].limit = Math.max(initialState.companyProductList.limit, action[2])
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
                            case 'company': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'product': {
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
                        state.companyProductList.variables = state.companyProductList.variables.add(new CompanyProductVariable(-1, {company: new Company(state.companyProductList.variable.values.company.hashCode()), product: new Product(state.companyProductList.variable.values.product.hashCode())}))
                        state.companyProductList.variable = initialState.companyProductList.variable
                        break
                    }
                    default: {
                        const _exhaustiveCheck: never = action
                        return _exhaustiveCheck
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
            case 'uOMList': {
                switch (action[1]) {
                    case 'limit': {
                        state[action[0]].limit = Math.max(initialState.uOMList.limit, action[2])
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
                            case 'name': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'conversionRate': {
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
                        state.uOMList.variables = state.uOMList.variables.add(new UOMVariable(-1, {product: new Product(state.uOMList.variable.values.product.hashCode()), name: state.uOMList.variable.values.name, conversionRate: state.uOMList.variable.values.conversionRate}))
                        state.uOMList.variable = initialState.uOMList.variable
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
                    case 'companyProductList': {
                        state.companyProductList.variables = action[2]
                        break
                    }
                    case 'mappingProductTagList': {
                        state.mappingProductTagList.variables = action[2]
                        break
                    }
                    case 'uOMList': {
                        state.uOMList.variables = action[2]
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

    const productType = types['Product']
    const companyProductType = types['CompanyProduct']
    const mappingProductTagType = types['MappingProductTag']
    const uOMType = types['UOM']
    
    const [addCompanyProductDrawer, toggleAddCompanyProductDrawer] = useState(false)
    const [companyProductFilter, toggleCompanyProductFilter] = useState(false)

    const [addMappingProductTagDrawer, toggleAddMappingProductTagDrawer] = useState(false)
    const [mappingProductTagFilter, toggleMappingProductTagFilter] = useState(false)

    const [addUOMDrawer, toggleAddUOMDrawer] = useState(false)
    const [uOMFilter, toggleUOMFilter] = useState(false)
    
    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.Product.toArray()
            var composedVariables = HashSet.of<Immutable<ProductVariable>>().addAll(rows ? rows.map(x => ProductRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as ProductVariable])

                const companyProductRows = await db.CompanyProduct.toArray()
                var composedCompanyProductVariables = HashSet.of<Immutable<CompanyProductVariable>>().addAll(companyProductRows ? companyProductRows.map(x => CompanyProductRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedCompanyProductVariables = composedCompanyProductVariables.filter(x => !diff.variables[state.companyProductList.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.companyProductList.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.companyProductList.variable.typeName].replace)
                })
                dispatch(['replace', 'companyProductList', composedCompanyProductVariables.filter(variable => variable.values.company.hashCode() === props.match.params[0]) as HashSet<CompanyProductVariable>])

                const mappingProductTagRows = await db.MappingProductTag.toArray()
                var composedMappingProductTagVariables = HashSet.of<Immutable<MappingProductTagVariable>>().addAll(mappingProductTagRows ? mappingProductTagRows.map(x => MappingProductTagRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedMappingProductTagVariables = composedMappingProductTagVariables.filter(x => !diff.variables[state.mappingProductTagList.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.mappingProductTagList.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.mappingProductTagList.variable.typeName].replace)
                })
                dispatch(['replace', 'mappingProductTagList', composedMappingProductTagVariables.filter(variable => variable.values.product.hashCode() === props.match.params[0]) as HashSet<MappingProductTagVariable>])

                const uOMRows = await db.UOM.toArray()
                var composedUOMVariables = HashSet.of<Immutable<UOMVariable>>().addAll(uOMRows ? uOMRows.map(x => UOMRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedUOMVariables = composedUOMVariables.filter(x => !diff.variables[state.uOMList.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.uOMList.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.uOMList.variable.typeName].replace)
                })
                dispatch(['replace', 'uOMList', composedUOMVariables.filter(variable => variable.values.product.hashCode() === props.match.params[0]) as HashSet<UOMVariable>])
            }
        }
    }, [state.variable.typeName, state.companyProductList.variable.typeName, state.mappingProductTagList.variable.typeName, state.uOMList.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

    const companyRows = useLiveQuery(() => db.Company.toArray())?.map(x => CompanyRow.toVariable(x))
    var companyList = HashSet.of<Immutable<CompanyVariable>>().addAll(companyRows ? companyRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        companyList = companyList.filter(x => !diff.variables.Company.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.Company.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.Company.replace)
    })

    const companyProductRows = useLiveQuery(() => db.CompanyProduct.toArray())?.map(x => CompanyProductRow.toVariable(x))
    var companyProductList = HashSet.of<Immutable<CompanyProductVariable>>().addAll(companyProductRows ? companyProductRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        companyProductList = companyProductList.filter(x => !diff.variables.CompanyProduct.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.CompanyProduct.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.CompanyProduct.replace)
    })

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

    const productCategoryRows = useLiveQuery(() => db.ProductCategory.toArray())?.map(x => ProductCategoryRow.toVariable(x))
    var productCategoryList = HashSet.of<Immutable<ProductCategoryVariable>>().addAll(productCategoryRows ? productCategoryRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        productCategoryList = productCategoryList.filter(x => !diff.variables.ProductCategory.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.ProductCategory.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.ProductCategory.replace)
    })

    const productTagRows = useLiveQuery(() => db.ProductTag.toArray())?.map(x => ProductTagRow.toVariable(x))
    var productTagList = HashSet.of<Immutable<ProductTagVariable>>().addAll(productTagRows ? productTagRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        productTagList = productTagList.filter(x => !diff.variables.ProductTag.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.ProductTag.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.ProductTag.replace)
    })

    const uOMRows = useLiveQuery(() => db.UOM.toArray())?.map(x => UOMRow.toVariable(x))
    var uOMList = HashSet.of<Immutable<UOMVariable>>().addAll(uOMRows ? uOMRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        uOMList = uOMList.filter(x => !diff.variables.UOM.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.UOM.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.UOM.replace)
    })

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'name': {
                dispatch(['variable', event.target.name, String(event.target.value)])
                break
            }
            case 'category': {
                dispatch(['variable', event.target.name, new ProductCategory(parseInt(String(event.target.value)))])
                break
            }
            case 'code': {
                dispatch(['variable', event.target.name, String(event.target.value)])
                break
            }
            case 'sku': {
                dispatch(['variable', event.target.name, String(event.target.value)])
                break
            }
        }
    }
    const onCompanyProductInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'company': {
                dispatch(['companyProductList', 'variable', event.target.name, new Company(parseInt(String(event.target.value)))])
                break
            }
            case 'product': {
                dispatch(['companyProductList', 'variable', event.target.name, new Product(parseInt(String(event.target.value)))])
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

    const onUOMInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'product': {
                dispatch(['uOMList', 'variable', event.target.name, new Product(parseInt(String(event.target.value)))])
                break
            }
            case 'name': {
                dispatch(['uOMList', 'variable', event.target.name, String(event.target.value)])
                break
            }
            case 'conversionRate': {
                dispatch(['uOMList', 'variable', event.target.name, parseFloat(String(event.target.value))])
                break
            }
        }
    }

    const updateItemsQuery = (list: 'companyProductList' | 'mappingProductTagList' | 'uOMList') => {
        const fx = (args: Args) => {
            switch (list) {
                case 'companyProductList': {
                    dispatch([list, 'query', args])
                    break
                }
                case 'mappingProductTagList': {
                    dispatch([list, 'query', args])
                    break
                }
                case 'uOMList': {
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

    const updatePage = (list: 'companyProductList' | 'mappingProductTagList' | 'uOMList') => {
        const fx = (args: ['limit', number] | ['offset', number] | ['page', number]) => {
            dispatch([list, args[0], args[1]])
        }
        return fx
    }

    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createProduct, {
            name: state.variable.values.name,
            category: state.variable.values.category.hashCode(),
            code: state.variable.values.code,
            sku: state.variable.values.sku,
            companyProductList: state.companyProductList.variables.toArray().map(variable => {
                return {
                    company: variable.values.company.hashCode(),
                    product: variable.values.product.hashCode()
                }
            }),
            mappingProductTagList: state.mappingProductTagList.variables.toArray().map(variable => {
                return {
                    product: variable.values.product.hashCode(),
                    tag: variable.values.tag.hashCode()
                }
            }),
            uOMList: state.uOMList.variables.toArray().map(variable => {
                return {
                    product: variable.values.product.hashCode(),
                    name: variable.values.name,
                    conversionRate: variable.values.conversionRate
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteProduct, {
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
                        'create': `Create Product`,
                        'update': `Update Product`,
                        'show': `Product`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/product-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/product-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/product-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{productType.keys.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.name} name='name' />,
                                <div className='font-bold text-xl'>{state.variable.values.name}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{productType.keys.category}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.category.hashCode()} name='category'>
                                    <option value='' selected disabled hidden>Select Category</option>
                                    {productCategoryList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(productCategoryList.filter(x => x.id.hashCode() === state.variable.values.category.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = productCategoryList.filter(x => x.id.hashCode() === state.variable.values.category.hashCode()).toArray()[0] as ProductCategoryVariable
                                            return <Link to={`/product-category/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/product-category/${state.variable.values.category.hashCode()}`}>{state.variable.values.category.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{productType.keys.code}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.code} name='code' />,
                                <div className='font-bold text-xl'>{state.variable.values.code}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{productType.keys.sku}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <div className='font-bold text-xl'>{state.variable.values.sku}</div>,
                                <div className='font-bold text-xl'>{state.variable.values.sku}</div>
                            )
                        }
                    </Item>
                </Container>
                <Container area={Grid.companyProductArea} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title> Company Product List</Title>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <button onClick={() => toggleAddCompanyProductDrawer(true)} className='text-3xl font-bold text-white bg-gray-800 rounded-md px-2 h-10 focus:outline-none'>+</button>,
                                undefined
                            )
                        }
                    </Item>
                    <Item area={Grid2.filter} justify='end' align='center' className='flex'>
                        <Button onClick={() => toggleCompanyProductFilter(true)}>Filter</Button>
                        <Drawer open={companyProductFilter} onClose={() => toggleCompanyProductFilter(false)} anchor={'right'}>
                            <Filter typeName='CompanyProduct' query={state['companyProductList'].query} updateQuery={updateItemsQuery('companyProductList')} />
                        </Drawer>
                        <Drawer open={addCompanyProductDrawer} onClose={() => toggleAddCompanyProductDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add {companyProductType.name}</div>
                                <Container area={none} layout={Grid.layouts.uom} className=''>
                                    <Item>
                                        <Label>{companyProductType.keys.company}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onCompanyProductInputChange} value={state.companyProductList.variable.values.company.hashCode()} name='company'>
                                                    <option value='' selected disabled hidden>Select Company</option>
                                                    {companyList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(companyList.filter(x => x.id.hashCode() === state.companyProductList.variable.values.company.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = companyList.filter(x => x.id.hashCode() === state.companyProductList.variable.values.company.hashCode()).toArray()[0] as CompanyVariable
                                                            return <Link to={`/company/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/company/${state.companyProductList.variable.values.company.hashCode()}`}>{state.companyProductList.variable.values.company.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{companyProductType.keys.product}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onCompanyProductInputChange} value={state.companyProductList.variable.values.product.hashCode()} name='product'>
                                                    <option value='' selected disabled hidden>Select Product</option>
                                                    {productList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(productList.filter(x => x.id.hashCode() === state.companyProductList.variable.values.product.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = productList.filter(x => x.id.hashCode() === state.companyProductList.variable.values.product.hashCode()).toArray()[0] as ProductVariable
                                                            return <Link to={`/product/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/product/${state.companyProductList.variable.values.product.hashCode()}`}>{state.companyProductList.variable.values.product.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item justify='center' align='center'>
                                        <Button onClick={() => dispatch(['companyProductList', 'addVariable'])}>Add</Button>
                                    </Item>
                                </Container>
                            </div>
                        </Drawer>
                    </Item>
                    <Table area={Grid2.table} state={state['companyProductList']} updatePage={updatePage('companyProductList')} variables={state.companyProductList.variables.filter(variable => applyFilter(state['companyProductList'].query, variable)).toArray()} columns={state['companyProductList'].columns.toArray()} />
                </Container > 

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

                <Container area={Grid.uOMArea} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title> U O M List</Title>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <button onClick={() => toggleAddUOMDrawer(true)} className='text-3xl font-bold text-white bg-gray-800 rounded-md px-2 h-10 focus:outline-none'>+</button>,
                                undefined
                            )
                        }
                    </Item>
                    <Item area={Grid2.filter} justify='end' align='center' className='flex'>
                        <Button onClick={() => toggleUOMFilter(true)}>Filter</Button>
                        <Drawer open={uOMFilter} onClose={() => toggleUOMFilter(false)} anchor={'right'}>
                            <Filter typeName='UOM' query={state['uOMList'].query} updateQuery={updateItemsQuery('uOMList')} />
                        </Drawer>
                        <Drawer open={addUOMDrawer} onClose={() => toggleAddUOMDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add {uOMType.name}</div>
                                <Container area={none} layout={Grid.layouts.uom} className=''>
                                    <Item>
                                        <Label>{uOMType.keys.product}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onUOMInputChange} value={state.uOMList.variable.values.product.hashCode()} name='product'>
                                                    <option value='' selected disabled hidden>Select Product</option>
                                                    {productList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(productList.filter(x => x.id.hashCode() === state.uOMList.variable.values.product.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = productList.filter(x => x.id.hashCode() === state.uOMList.variable.values.product.hashCode()).toArray()[0] as ProductVariable
                                                            return <Link to={`/product/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/product/${state.uOMList.variable.values.product.hashCode()}`}>{state.uOMList.variable.values.product.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{uOMType.keys.name}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='text' onChange={onUOMInputChange} value={state.uOMList.variable.values.name} name='name' />,
                                                <div className='font-bold text-xl'>{state.uOMList.variable.values.name}</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{uOMType.keys.conversionRate}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='number' onChange={onUOMInputChange} value={state.uOMList.variable.values.conversionRate} name='conversionRate' />,
                                                <div className='font-bold text-xl'>{state.uOMList.variable.values.conversionRate}</div>
                                            )
                                        }
                                    </Item>
                                    <Item justify='center' align='center'>
                                        <Button onClick={() => dispatch(['uOMList', 'addVariable'])}>Add</Button>
                                    </Item>
                                </Container>
                            </div>
                        </Drawer>
                    </Item>
                    <Table area={Grid2.table} state={state['uOMList']} updatePage={updatePage('uOMList')} variables={state.uOMList.variables.filter(variable => applyFilter(state['uOMList'].query, variable)).toArray()} columns={state['uOMList'].columns.toArray()} />
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
