import React, { useEffect, useState } from 'react'
import { Immutable, Draft } from 'immer'
import { useImmerReducer } from 'use-immer'
import tw from 'twin.macro'
import Switch from '@material-ui/core/Switch'
import { HashSet, Vector } from 'prelude-ts'
import { Drawer } from '@material-ui/core'
import { executeCircuit } from '../../../main/circuit'
import { types } from '../../../main/types'
import { Container, Item, none } from '../../../main/commons'
import { Table } from '../../../main/Table'
import { Query, Filter, Args, getQuery, updateQuery, applyFilter } from '../../../main/Filter'
import { Company, CompanyProductVariable, CompanyVariable, Product, ProductVariable, UOMVariable } from '../../../main/variables'
import * as Grid from './grids/Show'
import * as Grid2 from './grids/List'
import { withRouter, Link } from 'react-router-dom'
import { circuits } from '../../../main/circuits'
import { iff, when } from '../../../main/utils'
import { db } from '../../../main/dexie'
import { CompanyProductRow, CompanyRow, DiffRow, ProductRow, UOMRow } from '../../../main/rows'
import { useCallback } from 'react'
import { updateVariable } from '../../../main/mutation'
import { useLiveQuery } from 'dexie-react-hooks'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: ProductVariable
    uoms: {
        typeName: 'UOM'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<Array<string>>
        variable: UOMVariable
        variables: HashSet<Immutable<UOMVariable>>
    }
    companies: {
        typeName: 'CompanyProduct'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<Array<string>>
        variable: CompanyProductVariable
        variables: HashSet<Immutable<CompanyProductVariable>>
    }
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]

    | ['variable', 'variableName', Product]
    | ['variable', 'values', 'name', string]
    | ['variable', 'values', 'orderable', boolean]
    | ['variable', 'values', 'consumable', boolean]
    | ['variable', 'values', 'producable', boolean]

    | ['uoms', 'limit', number]
    | ['uoms', 'offset', number]
    | ['uoms', 'page', number]
    | ['uoms', 'query', Args]
    | ['uoms', 'variable', 'values', 'name', string]
    | ['uoms', 'variable', 'values', 'conversionRate', number]
    | ['uoms', 'addVariable']

    | ['companies', 'limit', number]
    | ['companies', 'offset', number]
    | ['companies', 'page', number]
    | ['companies', 'query', Args]
    | ['companies', 'variable', 'values', 'company', Company]
    | ['companies', 'addVariable']

    | ['replace', 'variable', ProductVariable]
    | ['replace', 'uoms', HashSet<UOMVariable>]
    | ['replace', 'companies', HashSet<CompanyProductVariable>]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new ProductVariable(-1, { name: -1, orderable: true, consumable: true, producable: false }),
        uoms: {
            typeName: 'UOM',
            query: getQuery('UOM'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'name'], ['values', 'conversionRate']),
            variable: new UOMVariable(-1, { product: new Product(-1), name: -1, conversionRate: 1 }),
            variables: HashSet.of<UOMVariable>()
        },
        companies: {
            typeName: 'CompanyProduct',
            query: getQuery('CompanyProduct'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'company']),
            variable: new CompanyProductVariable(-1, { company: new Company(-1), product: new Product(-1) }),
            variables: HashSet.of<CompanyProductVariable>()
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
                    case 'variableName': {
                        if (state.mode === 'create') {
                            state[action[0]][action[1]] = action[2]
                        }
                        break
                    }
                    case 'values': {
                        switch (action[2]) {
                            case 'name': {
                                state[action[0]][action[1]][action[2]] = action[3]
                                break
                            }
                            case 'orderable':
                            case 'consumable':
                            case 'producable': {
                                state[action[0]][action[1]][action[2]] = action[3]
                                break
                            }
                            default: {
                                const _exhaustiveCheck: never = action;
                                return _exhaustiveCheck;
                            }
                        }
                    }
                }
                break
            }
            case 'uoms': {
                switch (action[1]) {
                    case 'limit': {
                        state[action[0]].limit = Math.max(initialState.uoms.limit, action[2])
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
                        switch (action[3]) {
                            case 'name': {
                                state[action[0]][action[1]][action[2]][action[3]] = action[4]
                                break
                            }
                            case 'conversionRate': {
                                state[action[0]][action[1]][action[2]][action[3]] = action[4]
                                break
                            }
                        }
                        break
                    }
                    case 'addVariable': {
                        state.uoms.variables = state.uoms.variables.add(new UOMVariable(-1, { product: new Product(-1), name: state.uoms.variable.values.name, conversionRate: state.uoms.variable.values.conversionRate }))
                        state.uoms.variable = initialState.uoms.variable
                        break
                    }
                    default: {
                        const _exhaustiveCheck: never = action;
                        return _exhaustiveCheck;
                    }
                }
                break
            }
            case 'companies': {
                switch (action[1]) {
                    case 'limit': {
                        state[action[0]].limit = Math.max(initialState.companies.limit, action[2])
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
                        switch (action[3]) {
                            case 'company': {
                                state[action[0]][action[1]][action[2]][action[3]] = action[4]
                                break
                            }
                        }
                        break
                    }
                    case 'addVariable': {
                        state.companies.variables = state.companies.variables.add(new CompanyProductVariable(-1, { company: new Company(state.companies.variable.values.company.hashCode()), product: new Product(-1) }))
                        state.companies.variable = initialState.companies.variable
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
                    case 'uoms': {
                        state.uoms.variables = action[2]
                        break
                    }
                    case 'companies': {
                        state.companies.variables = action[2]
                        break
                    }
                    default: {
                        const _exhaustiveCheck: never = action;
                        return _exhaustiveCheck;
                    }
                }
                break
            }
            default: {
                const _exhaustiveCheck: never = action;
                return _exhaustiveCheck;
            }
        }
    }

    const [state, dispatch] = useImmerReducer<State, Action>(reducer, initialState)

    const product = types['Product']
    const uom = types['UOM']
    const companyProduct = types['CompanyProduct']

    const [addUOMDrawer, toggleAddUOMDrawer] = useState(false)
    const [uomFilter, toggleUOMFilter] = useState(false)

    const [addCompanyProductDrawer, toggleAddCompanyProductDrawer] = useState(false)
    const [companyProductFilter, toggleCompanyProductFilter] = useState(false)

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

                const itemRows = await db.UOM.toArray()
                var composedItemVariables = HashSet.of<Immutable<UOMVariable>>().addAll(itemRows ? itemRows.map(x => UOMRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedItemVariables = composedItemVariables.filter(x => !diff.variables[state.uoms.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.uoms.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.uoms.variable.typeName].replace)
                })
                const items = composedItemVariables.filter(variable => variable.values.product.hashCode() === props.match.params[0])
                dispatch(['replace', 'uoms', items as HashSet<UOMVariable>])

                const companyProductRows = await db.CompanyProduct.toArray()
                var composedCompanyProductVariables = HashSet.of<Immutable<CompanyProductVariable>>().addAll(companyProductRows ? companyProductRows.map(x => CompanyProductRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedCompanyProductVariables = composedCompanyProductVariables.filter(x => !diff.variables[state.companies.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.companies.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.companies.variable.typeName].replace)
                })
                dispatch(['replace', 'companies', composedCompanyProductVariables.filter(variable => variable.values.product.hashCode() === props.match.params[0]) as HashSet<CompanyProductVariable>])
            }
        }
    }, [state.variable.typeName, state.uoms.variable.typeName, state.companies.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

    const companyRows = useLiveQuery(() => db.Company.toArray())?.map(x => CompanyRow.toVariable(x))
    var companies = HashSet.of<Immutable<CompanyVariable>>().addAll(companyRows ? companyRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        companies = companies.filter(x => !diff.variables.Company.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.Company.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.Company.replace)
    })

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        switch (event.target.name) {
            case 'variableName': {
                dispatch(['variable', 'variableName', new Product(parseInt(event.target.value))])
                break
            }
            default: {
                switch (event.target.name) {
                    case 'name': {
                        dispatch(['variable', 'values', event.target.name, event.target.value])
                        break
                    }
                }
            }
        }
    }

    const onVariableSwitchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        switch (event.target.name) {
            case 'orderable':
            case 'consumable':
            case 'producable': {
                dispatch(['variable', 'values', event.target.name, event.target.checked])
                break
            }
        }
    }

    const onUOMInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        switch (event.target.name) {
            default: {
                switch (event.target.name) {
                    case 'name': {
                        dispatch(['uoms', 'variable', 'values', event.target.name, event.target.value])
                        break
                    }
                    case 'conversionRate': {
                        dispatch(['uoms', 'variable', 'values', event.target.name, parseFloat(event.target.value)])
                        break
                    }
                }
            }
        }
    }

    const onCompanyProductInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            default: {
                switch (event.target.name) {
                    case 'company': {
                        dispatch(['companies', 'variable', 'values', event.target.name, new Company(parseInt(event.target.value))])
                        break
                    }
                }
            }
        }
    }

    const updateItemsQuery = (list: 'uoms' | 'companies') => {
        const fx = (args: Args) => {
            switch (list) {
                case 'uoms': {
                    dispatch([list, 'query', args])
                    break
                }
                case 'companies': {
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

    const updatePage = (list: 'uoms' | 'companies') => {
        const fx = (args: ['limit', number] | ['offset', number] | ['page', number]) => {
            dispatch([list, args[0], args[1]])
        }
        return fx
    }

    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createProduct, {
            sku: state.variable.id.hashCode(),
            name: state.variable.values.name,
            orderable: state.variable.values.orderable,
            consumable: state.variable.values.consumable,
            producable: state.variable.values.producable,
            uoms: state.uoms.variables.toArray().map(state => {
                return {
                    name: state.values.name,
                    conversionRate: state.values.conversionRate
                }
            }),
            companies: state.companies.variables.toArray().map(state => {
                return {
                    company: state.values.company.hashCode()
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
            variableName: state.variable.id.hashCode(),
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
                                props.history.push('/products')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/products')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/products')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{product.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.updatedVariableName.hashCode()} name='variableName' />,
                                <div className='font-bold text-xl'>{state.variable.id.hashCode()}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{product.keys.name.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.name} name='name' />,
                                <div className='font-bold text-xl'>{state.variable.values.name}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <InlineLabel>{product.keys.orderable.name}</InlineLabel>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Switch color='primary' onChange={onVariableSwitchChange} checked={state.variable.values.orderable} name='orderable' />,
                                <div className='font-bold text-xl'>{state.variable.values.orderable ? 'Yes' : 'No'}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <InlineLabel>{product.keys.consumable.name}</InlineLabel>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Switch color='primary' onChange={onVariableSwitchChange} checked={state.variable.values.consumable} name='consumable' />,
                                <div className='font-bold text-xl'>{state.variable.values.consumable ? 'Yes' : 'No'}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <InlineLabel>{product.keys.producable.name}</InlineLabel>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Switch color='primary' onChange={onVariableSwitchChange} checked={state.variable.values.producable} name='producable' />,
                                <div className='font-bold text-xl'>{state.variable.values.producable ? 'Yes' : 'No'}</div>
                            )
                        }
                    </Item>
                </Container>

                <Container area={Grid.uoms} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title>{uom.name}s</Title>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <button onClick={() => toggleAddUOMDrawer(true)} className='text-3xl font-bold text-white bg-gray-800 rounded-md px-2 h-10 focus:outline-none'>+</button>,
                                undefined
                            )
                        }
                    </Item>
                    <Item area={Grid2.filter} justify='end' align='center' className='flex'>
                        <Button onClick={() => toggleUOMFilter(true)}>Filter</Button>
                        <Drawer open={uomFilter} onClose={() => toggleUOMFilter(false)} anchor={'right'}>
                            <Filter typeName='UOM' query={state['uoms'].query} updateQuery={updateItemsQuery('uoms')} />
                        </Drawer>
                        <Drawer open={addUOMDrawer} onClose={() => toggleAddUOMDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add UOM</div>
                                <Container area={none} layout={Grid.layouts.uom}>
                                    <Item>
                                        <Label>{uom.keys.name.name}</Label>
                                        <Input type='text' onChange={onUOMInputChange} name='name' />
                                    </Item>
                                    <Item>
                                        <Label>{uom.keys.conversionRate.name}</Label>
                                        <Input type='text' onChange={onUOMInputChange} value={state.uoms.variable.values.conversionRate} name='conversionRate' />
                                    </Item>
                                    <Item justify='center' align='center'>
                                        <Button onClick={() => dispatch(['uoms', 'addVariable'])}>Add</Button>
                                    </Item>
                                </Container>
                            </div>
                        </Drawer>
                    </Item>
                    <Table area={Grid2.table} state={state['uoms']} updatePage={updatePage('uoms')} variables={state.uoms.variables.filter(variable => applyFilter(state['uoms'].query, variable)).toArray()} columns={state['uoms'].columns.toArray()} />
                </Container >

                <Container area={Grid.companies} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title>Companies</Title>
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
                            <Filter typeName='CompanyProduct' query={state['companies'].query} updateQuery={updateItemsQuery('companies')} />
                        </Drawer>
                        <Drawer open={addCompanyProductDrawer} onClose={() => toggleAddCompanyProductDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add Company</div>
                                <Container area={none} layout={Grid.layouts.uom}>
                                    <Item>
                                        <Label>{companyProduct.keys.company.name}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onCompanyProductInputChange} value={state.companies.variable.values.company.hashCode()} name='company'>
                                                    <option value='' selected disabled hidden>Select Company</option>
                                                    {companies.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(companies.filter(x => x.id.hashCode() === state.companies.variable.values.company.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = companies.filter(x => x.id.hashCode() === state.companies.variable.values.company.hashCode()).toArray()[0] as CompanyVariable
                                                            return <Link to={`/region/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/region/${state.companies.variable.values.company.hashCode()}`}>{state.companies.variable.values.company.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item justify='center' align='center'>
                                        <Button onClick={() => dispatch(['companies', 'addVariable'])}>Add</Button>
                                    </Item>
                                </Container>
                            </div>
                        </Drawer>
                    </Item>
                    <Table area={Grid2.table} state={state['companies']} updatePage={updatePage('companies')} variables={state.companies.variables.filter(variable => applyFilter(state['companies'].query, variable)).toArray()} columns={state['companies'].columns.toArray()} />
                </Container >

            </Container>
        }, <div>Variable not found</div>)
}

export default withRouter(Component)

const Title = tw.div`py-8 text-4xl text-gray-800 font-bold mx-1 whitespace-nowrap`

const Label = tw.label`w-1/2 whitespace-nowrap`

const InlineLabel = tw.label`inline-block w-1/2`

const Select = tw.select`p-1.5 text-gray-500 leading-tight border border-gray-400 shadow-inner hover:border-gray-600 w-full rounded-sm`

const Input = tw.input`p-1.5 text-gray-500 leading-tight border border-gray-400 shadow-inner hover:border-gray-600 w-full rounded-sm`

const Button = tw.button`bg-gray-900 text-white text-center font-bold p-2 mx-1 uppercase w-40 h-full max-w-sm rounded-lg focus:outline-none inline-block`
