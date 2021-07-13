import React, { useEffect, useState } from 'react'
import { Immutable, Draft } from 'immer'
import { useImmerReducer } from 'use-immer'
import tw from 'twin.macro'
import { HashSet, Vector } from 'prelude-ts'
import { executeCircuit } from '../../../main/circuit'
import { types } from '../../../main/types'
import { Container, Item, none } from '../../../main/commons'
import { Address, AddressVariable, Company, CompanyAddressVariable, CompanyVariable, PostalCode, PostalCodeVariable } from '../../../main/variables'
import * as Grid from './grids/Show'
import * as Grid2 from './grids/List'
import { withRouter, Link } from 'react-router-dom'
import { circuits } from '../../../main/circuits'
import { iff, when } from '../../../main/utils'
import { db } from '../../../main/dexie'
import { DiffRow, PostalCodeRow, AddressRow, CompanyAddressRow, CompanyRow } from '../../../main/rows'
import { useCallback } from 'react'
import { updateVariable } from '../../../main/mutation'
import { useLiveQuery } from 'dexie-react-hooks'
import { Query, Filter, Args, getQuery, updateQuery, applyFilter } from '../../../main/Filter'
import { Drawer } from '@material-ui/core'
import { Table } from '../../../main/Table'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: AddressVariable
    companies: {
        typeName: 'CompanyAddress'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<Array<string>>
        variable: CompanyAddressVariable
        variables: HashSet<Immutable<CompanyAddressVariable>>
    }
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]

    | ['variable', 'values', 'postalCode', PostalCode]
    | ['variable', 'values', 'line1', string]
    | ['variable', 'values', 'line2', string]
    | ['variable', 'values', 'latitude', number]
    | ['variable', 'values', 'longitude', number]

    | ['companies', 'limit', number]
    | ['companies', 'offset', number]
    | ['companies', 'page', number]
    | ['companies', 'query', Args]
    | ['companies', 'variable', 'values', 'company', Company]
    | ['companies', 'addVariable']

    | ['replace', 'variable', AddressVariable]
    | ['replace', 'companies', HashSet<CompanyAddressVariable>]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new AddressVariable(-1, { postalCode: new PostalCode(-1), line1: '', line2: '', latitude: 0, longitude: 0 }),
        companies: {
            typeName: 'CompanyAddress',
            query: getQuery('CompanyAddress'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'company']),
            variable: new CompanyAddressVariable(-1, { company: new Company(-1), name: '', address: new Address(-1) }),
            variables: HashSet.of<CompanyAddressVariable>()
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
                    case 'values': {
                        switch (action[2]) {
                            case 'postalCode': {
                                state[action[0]][action[1]][action[2]] = action[3]
                                break
                            }
                            case 'line1': {
                                state[action[0]][action[1]][action[2]] = action[3]
                                break
                            }
                            case 'line2': {
                                state[action[0]][action[1]][action[2]] = action[3]
                                break
                            }
                            case 'latitude': {
                                state[action[0]][action[1]][action[2]] = action[3]
                                break
                            }
                            case 'longitude': {
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
                        state.companies.variables = state.companies.variables.add(new CompanyAddressVariable(-1, { company: new Company(state.companies.variable.values.company.hashCode()), name: '', address: new Address(-1) }))
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
                    case 'companies': {
                        state.companies.variables = action[2]
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

    const address = types['Address']
    const companyAddress = types['CompanyAddress']

    const [addCompanyAddressDrawer, toggleAddCompanyAddressDrawer] = useState(false)
    const [companyAddressFilter, toggleCompanyAddressFilter] = useState(false)

    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.Address.toArray()
            var composedVariables = HashSet.of<Immutable<AddressVariable>>().addAll(rows ? rows.map(x => AddressRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as AddressVariable])

                const companyAddressRows = await db.CompanyAddress.toArray()
                var composedCompanyAddressVariables = HashSet.of<Immutable<CompanyAddressVariable>>().addAll(companyAddressRows ? companyAddressRows.map(x => CompanyAddressRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedCompanyAddressVariables = composedCompanyAddressVariables.filter(x => !diff.variables[state.companies.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.companies.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.companies.variable.typeName].replace)
                })
                dispatch(['replace', 'companies', composedCompanyAddressVariables.filter(variable => variable.values.address.hashCode() === props.match.params[0]) as HashSet<CompanyAddressVariable>])
            }
        }
    }, [state.variable.typeName, state.companies.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

    const rows = useLiveQuery(() => db.PostalCode.orderBy('name').toArray())?.map(x => PostalCodeRow.toVariable(x))
    var postalCodes = HashSet.of<Immutable<PostalCodeVariable>>().addAll(rows ? rows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        postalCodes = postalCodes.filter(x => !diff.variables.PostalCode.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.PostalCode.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.PostalCode.replace)
    })

    const companyRows = useLiveQuery(() => db.Company.toArray())?.map(x => CompanyRow.toVariable(x))
    var companies = HashSet.of<Immutable<CompanyVariable>>().addAll(companyRows ? companyRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        companies = companies.filter(x => !diff.variables.Company.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.Company.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.Company.replace)
    })

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            default: {
                switch (event.target.name) {
                    case 'postalCode': {
                        dispatch(['variable', 'values', event.target.name, new PostalCode(parseInt(event.target.value))])
                        break
                    }
                    case 'line1': {
                        dispatch(['variable', 'values', event.target.name, event.target.value])
                        break
                    }
                    case 'line2': {
                        dispatch(['variable', 'values', event.target.name, event.target.value])
                        break
                    }
                    case 'latitude': {
                        dispatch(['variable', 'values', event.target.name, parseFloat(event.target.value)])
                        break
                    }
                    case 'longitude': {
                        dispatch(['variable', 'values', event.target.name, parseFloat(event.target.value)])
                        break
                    }
                }
            }
        }
    }

    const onCompanyAddressInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    const updateItemsQuery = (list: 'companies') => {
        const fx = (args: Args) => {
            switch (list) {
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

    const updatePage = (list: 'companies') => {
        const fx = (args: ['limit', number] | ['offset', number] | ['page', number]) => {
            dispatch([list, args[0], args[1]])
        }
        return fx
    }

    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createAddress, {
            postalCode: state.variable.values.postalCode.hashCode(),
            line1: state.variable.values.line1,
            line2: state.variable.values.line2,
            latitude: state.variable.values.latitude,
            longitude: state.variable.values.longitude,
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteAddress, {
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
                        'create': `Create Address`,
                        'update': `Update Address`,
                        'show': `Address`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/addresses')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/addresses')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/addresses')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{address.keys.postalCode.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.postalCode.hashCode()} name='postalCode'>
                                    <option value='' selected disabled hidden>Select Postal Code</option>
                                    {postalCodes.toArray().map(x => <option value={x.id.hashCode()}>{x.values.name}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(postalCodes.filter(x => x.id.hashCode() === state.variable.values.postalCode.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = postalCodes.filter(x => x.id.hashCode() === state.variable.values.postalCode.hashCode()).toArray()[0] as PostalCodeVariable
                                            return <Link to={`/postal-code/${referencedVariable.id.hashCode()}`}>{referencedVariable.values.name}</Link>
                                        }, <Link to={`/postal-code/${state.variable.values.postalCode.hashCode()}`}>{state.variable.values.postalCode.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{address.keys.line1.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.line1} name='line1' />,
                                <div className='font-bold text-xl'>{state.variable.values.line1}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{address.keys.line2.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.line2} name='line2' />,
                                <div className='font-bold text-xl'>{state.variable.values.line2}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{address.keys.latitude.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='number' onChange={onVariableInputChange} value={state.variable.values.latitude} name='latitude' />,
                                <div className='font-bold text-xl'>{state.variable.values.latitude}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{address.keys.longitude.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='number' onChange={onVariableInputChange} value={state.variable.values.longitude} name='longitude' />,
                                <div className='font-bold text-xl'>{state.variable.values.longitude}</div>
                            )
                        }
                    </Item>
                </Container>

                <Container area={Grid.companies} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title>Companies</Title>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <button onClick={() => toggleAddCompanyAddressDrawer(true)} className='text-3xl font-bold text-white bg-gray-800 rounded-md px-2 h-10 focus:outline-none'>+</button>,
                                undefined
                            )
                        }
                    </Item>
                    <Item area={Grid2.filter} justify='end' align='center' className='flex'>
                        <Button onClick={() => toggleCompanyAddressFilter(true)}>Filter</Button>
                        <Drawer open={companyAddressFilter} onClose={() => toggleCompanyAddressFilter(false)} anchor={'right'}>
                            <Filter typeName='CompanyAddress' query={state['companies'].query} updateQuery={updateItemsQuery('companies')} />
                        </Drawer>
                        <Drawer open={addCompanyAddressDrawer} onClose={() => toggleAddCompanyAddressDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add Company</div>
                                <Container area={none} layout={Grid.layouts.uom}>
                                    <Item>
                                        <Label>{companyAddress.keys.company.name}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onCompanyAddressInputChange} value={state.companies.variable.values.company.hashCode()} name='company'>
                                                    <option value='' selected disabled hidden>Select Company</option>
                                                    {companies.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(companies.filter(x => x.id.hashCode() === state.companies.variable.values.company.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = companies.filter(x => x.id.hashCode() === state.companies.variable.values.company.hashCode()).toArray()[0] as CompanyVariable
                                                            return <Link to={`/company/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/company/${state.companies.variable.values.company.hashCode()}`}>{state.companies.variable.values.company.hashCode()}</Link>)
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

// const InlineLabel = tw.label`inline-block w-1/2`

const Select = tw.select`p-1.5 text-gray-500 leading-tight border border-gray-400 shadow-inner hover:border-gray-600 w-full rounded-sm`

const Input = tw.input`p-1.5 text-gray-500 leading-tight border border-gray-400 shadow-inner hover:border-gray-600 w-full rounded-sm`

const Button = tw.button`bg-gray-900 text-white text-center font-bold p-2 mx-1 uppercase w-40 h-full max-w-sm rounded-lg focus:outline-none inline-block`
