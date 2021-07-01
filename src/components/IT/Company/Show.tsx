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
import { Address, AddressVariable, BankAccount, BankAccountVariable, Company, CompanyAddressVariable, CompanyBankAccountVariable, CompanyProductVariable, CompanyType, CompanyTypeVariable, CompanyVariable, Product, ProductVariable, ServiceArea, ServiceAreaVariable } from '../../../main/variables'
import * as Grid from './grids/Show'
import * as Grid2 from './grids/List'
import { withRouter, Link } from 'react-router-dom'
import { circuits } from '../../../main/circuits'
import { iff, when } from '../../../main/utils'
import { db } from '../../../main/dexie'
import { DiffRow, CompanyRow, CompanyAddressRow, CompanyBankAccountRow, CompanyProductRow, CompanyTypeRow, ServiceAreaRow, AddressRow, BankAccountRow, ProductRow } from '../../../main/rows'
import { useCallback } from 'react'
import { updateVariable } from '../../../main/mutation'
import { useLiveQuery } from 'dexie-react-hooks'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: CompanyVariable
    updatedVariableName: Company
    addresses: {
        typeName: 'CompanyAddress'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<Array<string>>
        variable: CompanyAddressVariable
        variables: HashSet<Immutable<CompanyAddressVariable>>
    }
    bankAccounts: {
        typeName: 'CompanyBankAccount'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<Array<string>>
        variable: CompanyBankAccountVariable
        variables: HashSet<Immutable<CompanyBankAccountVariable>>
    }
    products: {
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

    | ['variable', 'variableName', Company]
    | ['variable', 'values', 'email', string]
    | ['variable', 'values', 'telephone', string]
    | ['variable', 'values', 'mobile', string]
    | ['variable', 'values', 'website', string]
    | ['variable', 'values', 'companyType', CompanyType]
    | ['variable', 'values', 'serviceArea', ServiceArea]
    | ['variable', 'values', 'gstin', string]
    | ['variable', 'values', 'pan', string]
    | ['variable', 'values', 'iec', string]

    | ['addresses', 'limit', number]
    | ['addresses', 'offset', number]
    | ['addresses', 'page', number]
    | ['addresses', 'query', Args]
    | ['addresses', 'variable', 'values', 'company', Company]
    | ['addresses', 'variable', 'values', 'name', string]
    | ['addresses', 'variable', 'values', 'address', Address]
    | ['addresses', 'addVariable']

    | ['bankAccounts', 'limit', number]
    | ['bankAccounts', 'offset', number]
    | ['bankAccounts', 'page', number]
    | ['bankAccounts', 'query', Args]
    | ['bankAccounts', 'variable', 'values', 'company', Company]
    | ['bankAccounts', 'variable', 'values', 'bankAccount', BankAccount]
    | ['bankAccounts', 'addVariable']

    | ['products', 'limit', number]
    | ['products', 'offset', number]
    | ['products', 'page', number]
    | ['products', 'query', Args]
    | ['products', 'variable', 'values', 'company', Company]
    | ['products', 'variable', 'values', 'product', Product]
    | ['products', 'addVariable']

    | ['replace', 'variable', CompanyVariable]
    | ['replace', 'addresses', HashSet<CompanyAddressVariable>]
    | ['replace', 'bankAccounts', HashSet<CompanyBankAccountVariable>]
    | ['replace', 'products', HashSet<CompanyProductVariable>]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new CompanyVariable('', { email: '', telephone: '', mobile: '', website: '', companyType: new CompanyType(''), serviceArea: new ServiceArea(''), gstin: '', pan: '', iec: '' }),
        updatedVariableName: new Company(''),
        addresses: {
            typeName: 'CompanyAddress',
            query: getQuery('CompanyAddress'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'name'], ['values', 'address'], ['values', 'address', 'values', 'line1'], ['values', 'address', 'values', 'line2']),
            variable: new CompanyAddressVariable('', { company: new Company(''), name: '', address: new Address('') }),
            variables: HashSet.of<CompanyAddressVariable>()
        },
        bankAccounts: {
            typeName: 'CompanyBankAccount',
            query: getQuery('CompanyBankAccount'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'bankAccount'], ['values', 'bankAccount', 'values', 'accountNumber']),
            variable: new CompanyBankAccountVariable('', { company: new Company(''), bankAccount: new BankAccount('') }),
            variables: HashSet.of<CompanyBankAccountVariable>()
        },
        products: {
            typeName: 'CompanyProduct',
            query: getQuery('CompanyProduct'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'product']),
            variable: new CompanyProductVariable('', { company: new Company(''), product: new Product('') }),
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
                        state.updatedVariableName = action[2]
                        break
                    }
                    case 'values': {
                        switch (action[2]) {
                            case 'email': {
                                state[action[0]][action[1]][action[2]] = action[3]
                                break
                            }
                            case 'telephone': {
                                state[action[0]][action[1]][action[2]] = action[3]
                                break
                            }
                            case 'mobile': {
                                state[action[0]][action[1]][action[2]] = action[3]
                                break
                            }
                            case 'website': {
                                state[action[0]][action[1]][action[2]] = action[3]
                                break
                            }
                            case 'companyType': {
                                state[action[0]][action[1]][action[2]] = action[3]
                                break
                            }
                            case 'serviceArea': {
                                state[action[0]][action[1]][action[2]] = action[3]
                                break
                            }
                            case 'gstin': {
                                state[action[0]][action[1]][action[2]] = action[3]
                                break
                            }
                            case 'pan': {
                                state[action[0]][action[1]][action[2]] = action[3]
                                break
                            }
                            case 'iec': {
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
            case 'addresses': {
                switch (action[1]) {
                    case 'limit': {
                        state[action[0]].limit = Math.max(initialState.addresses.limit, action[2])
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
                            case 'address': {
                                state[action[0]][action[1]][action[2]][action[3]] = action[4]
                                break
                            }
                        }
                        break
                    }
                    case 'addVariable': {
                        state.addresses.variables = state.addresses.variables.add(new CompanyAddressVariable('', {
                            company: new Company(''),
                            name: state.addresses.variable.values.name,
                            address: new Address(state.addresses.variable.values.address.toString())
                        }))
                        state.addresses.variable = initialState.addresses.variable
                        break
                    }
                    default: {
                        const _exhaustiveCheck: never = action
                        return _exhaustiveCheck
                    }
                }
                break
            }
            case 'bankAccounts': {
                switch (action[1]) {
                    case 'limit': {
                        state[action[0]].limit = Math.max(initialState.bankAccounts.limit, action[2])
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
                            case 'bankAccount': {
                                state[action[0]][action[1]][action[2]][action[3]] = action[4]
                                break
                            }
                        }
                        break
                    }
                    case 'addVariable': {
                        state.bankAccounts.variables = state.bankAccounts.variables.add(new CompanyBankAccountVariable('', {
                            company: new Company(''),
                            bankAccount: new BankAccount(state.bankAccounts.variable.values.bankAccount.toString())
                        }))
                        state.bankAccounts.variable = initialState.bankAccounts.variable
                        break
                    }
                    default: {
                        const _exhaustiveCheck: never = action
                        return _exhaustiveCheck
                    }
                }
                break
            }
            case 'products': {
                switch (action[1]) {
                    case 'limit': {
                        state[action[0]].limit = Math.max(initialState.products.limit, action[2])
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
                            case 'product': {
                                state[action[0]][action[1]][action[2]][action[3]] = action[4]
                                break
                            }
                        }
                        break
                    }
                    case 'addVariable': {
                        state.products.variables = state.products.variables.add(new CompanyProductVariable('', {
                            company: new Company(''),
                            product: new Product(state.products.variable.values.product.toString())
                        }))
                        state.products.variable = initialState.products.variable
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
                        state.updatedVariableName = action[2].variableName
                        break
                    }
                    case 'addresses': {
                        state.addresses.variables = action[2]
                        break
                    }
                    case 'bankAccounts': {
                        state.bankAccounts.variables = action[2]
                        break
                    }
                    case 'products': {
                        state.products.variables = action[2]
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

    const company = types['Company']
    const companyAddress = types['CompanyAddress']
    const companyBankAccount = types['CompanyBankAccount']
    const companyProduct = types['CompanyProduct']

    const [addCompanyAddressDrawer, toggleAddCompanyAddressDrawer] = useState(false)
    const [companyAddressFilter, toggleCompanyAddressFilter] = useState(false)

    const [addCompanyBankAccountDrawer, toggleAddCompanyBankAccountDrawer] = useState(false)
    const [companyBankAccountFilter, toggleCompanyBankAccountFilter] = useState(false)

    const [addCompanyProductDrawer, toggleAddCompanyProductDrawer] = useState(false)
    const [companyProductFilter, toggleCompanyProductFilter] = useState(false)

    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.companies.toArray()
            var composedVariables = HashSet.of<Immutable<CompanyVariable>>().addAll(rows ? rows.map(x => CompanyRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.variableName.toString() === x.variableName.toString())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.variableName.toString() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as CompanyVariable])

                const addressRows = await db.companyAddresses.toArray()
                var composedCompanyAddressVariables = HashSet.of<Immutable<CompanyAddressVariable>>().addAll(addressRows ? addressRows.map(x => CompanyAddressRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedCompanyAddressVariables = composedCompanyAddressVariables.filter(x => !diff.variables[state.addresses.variable.typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).filter(x => !diff.variables[state.addresses.variable.typeName].replace.anyMatch(y => y.variableName.toString() === x.variableName.toString())).addAll(diff.variables[state.addresses.variable.typeName].replace)
                })
                dispatch(['replace', 'addresses', composedCompanyAddressVariables.filter(variable => variable.values.company.toString() === props.match.params[0]) as HashSet<CompanyAddressVariable>])

                const bankAccountRows = await db.companyBankAccounts.toArray()
                var composedCompanyBankAccountVariables = HashSet.of<Immutable<CompanyBankAccountVariable>>().addAll(bankAccountRows ? bankAccountRows.map(x => CompanyBankAccountRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedCompanyBankAccountVariables = composedCompanyBankAccountVariables.filter(x => !diff.variables[state.bankAccounts.variable.typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).filter(x => !diff.variables[state.bankAccounts.variable.typeName].replace.anyMatch(y => y.variableName.toString() === x.variableName.toString())).addAll(diff.variables[state.bankAccounts.variable.typeName].replace)
                })
                dispatch(['replace', 'bankAccounts', composedCompanyBankAccountVariables.filter(variable => variable.values.company.toString() === props.match.params[0]) as HashSet<CompanyBankAccountVariable>])

                const productRows = await db.companyProducts.toArray()
                var composedCompanyProductVariables = HashSet.of<Immutable<CompanyProductVariable>>().addAll(productRows ? productRows.map(x => CompanyProductRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedCompanyProductVariables = composedCompanyProductVariables.filter(x => !diff.variables[state.products.variable.typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).filter(x => !diff.variables[state.products.variable.typeName].replace.anyMatch(y => y.variableName.toString() === x.variableName.toString())).addAll(diff.variables[state.products.variable.typeName].replace)
                })
                dispatch(['replace', 'products', composedCompanyProductVariables.filter(variable => variable.values.company.toString() === props.match.params[0]) as HashSet<CompanyProductVariable>])
            }
        }
    }, [state.variable.typeName, state.addresses.variable.typeName, state.bankAccounts.variable.typeName, state.products.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])


    const companyTypeRows = useLiveQuery(() => db.companyTypes.toArray())?.map(x => CompanyTypeRow.toVariable(x))
    var companyTypes = HashSet.of<Immutable<CompanyTypeVariable>>().addAll(companyTypeRows ? companyTypeRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        companyTypes = companyTypes.filter(x => !diff.variables.CompanyType.remove.anyMatch(y => x.variableName.toString() === y.toString())).filter(x => !diff.variables.CompanyType.replace.anyMatch(y => y.variableName.toString() === x.variableName.toString())).addAll(diff.variables.CompanyType.replace)
    })

    const serviceAreaRows = useLiveQuery(() => db.serviceAreas.toArray())?.map(x => ServiceAreaRow.toVariable(x))
    var serviceAreas = HashSet.of<Immutable<ServiceAreaVariable>>().addAll(serviceAreaRows ? serviceAreaRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        serviceAreas = serviceAreas.filter(x => !diff.variables.ServiceArea.remove.anyMatch(y => x.variableName.toString() === y.toString())).filter(x => !diff.variables.ServiceArea.replace.anyMatch(y => y.variableName.toString() === x.variableName.toString())).addAll(diff.variables.ServiceArea.replace)
    })

    const addressRows = useLiveQuery(() => db.addresses.toArray())?.map(x => AddressRow.toVariable(x))
    var addresses = HashSet.of<Immutable<AddressVariable>>().addAll(addressRows ? addressRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        addresses = addresses.filter(x => !diff.variables.Address.remove.anyMatch(y => x.variableName.toString() === y.toString())).filter(x => !diff.variables.Address.replace.anyMatch(y => y.variableName.toString() === x.variableName.toString())).addAll(diff.variables.Address.replace)
    })

    const bankAccountRows = useLiveQuery(() => db.bankAccounts.toArray())?.map(x => BankAccountRow.toVariable(x))
    var bankAccounts = HashSet.of<Immutable<BankAccountVariable>>().addAll(bankAccountRows ? bankAccountRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        bankAccounts = bankAccounts.filter(x => !diff.variables.BankAccount.remove.anyMatch(y => x.variableName.toString() === y.toString())).filter(x => !diff.variables.BankAccount.replace.anyMatch(y => y.variableName.toString() === x.variableName.toString())).addAll(diff.variables.BankAccount.replace)
    })

    const productRows = useLiveQuery(() => db.products.toArray())?.map(x => ProductRow.toVariable(x))
    var products = HashSet.of<Immutable<ProductVariable>>().addAll(productRows ? productRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        products = products.filter(x => !diff.variables.Product.remove.anyMatch(y => x.variableName.toString() === y.toString())).filter(x => !diff.variables.Product.replace.anyMatch(y => y.variableName.toString() === x.variableName.toString())).addAll(diff.variables.Product.replace)
    })

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'variableName': {
                dispatch(['variable', 'variableName', new Company(event.target.value)])
                break
            }
            default: {
                switch (event.target.name) {
                    case 'email': {
                        dispatch(['variable', 'values', event.target.name, event.target.value])
                        break
                    }
                    case 'telephone': {
                        dispatch(['variable', 'values', event.target.name, event.target.value])
                        break
                    }
                    case 'mobile': {
                        dispatch(['variable', 'values', event.target.name, event.target.value])
                        break
                    }
                    case 'website': {
                        dispatch(['variable', 'values', event.target.name, event.target.value])
                        break
                    }
                    case 'companyType': {
                        dispatch(['variable', 'values', event.target.name, new CompanyType(event.target.value)])
                        break
                    }
                    case 'serviceArea': {
                        dispatch(['variable', 'values', event.target.name, new ServiceArea(event.target.value)])
                        break
                    }
                    case 'gstin': {
                        dispatch(['variable', 'values', event.target.name, event.target.value])
                        break
                    }
                    case 'pan': {
                        dispatch(['variable', 'values', event.target.name, event.target.value])
                        break
                    }
                    case 'iec': {
                        dispatch(['variable', 'values', event.target.name, event.target.value])
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
                    case 'name': {
                        dispatch(['addresses', 'variable', 'values', event.target.name, event.target.value])
                        break
                    }
                    case 'address': {
                        dispatch(['addresses', 'variable', 'values', event.target.name, new Address(event.target.value)])
                        break
                    }
                }
            }
        }
    }

    const onCompanyBankAccountInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            default: {
                switch (event.target.name) {
                    case 'bankAccount': {
                        dispatch(['bankAccounts', 'variable', 'values', event.target.name, new BankAccount(event.target.value)])
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
                    case 'product': {
                        dispatch(['products', 'variable', 'values', event.target.name, new Product(event.target.value)])
                        break
                    }
                }
            }
        }
    }

    const updateItemsQuery = (list: 'addresses' | 'bankAccounts' | 'products') => {
        const fx = (args: Args) => {
            switch (list) {
                case 'addresses': {
                    dispatch([list, 'query', args])
                    break
                }
                case 'bankAccounts': {
                    dispatch([list, 'query', args])
                    break
                }
                case 'products': {
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

    const updatePage = (list: 'addresses' | 'bankAccounts' | 'products') => {
        const fx = (args: ['limit', number] | ['offset', number] | ['page', number]) => {
            dispatch([list, args[0], args[1]])
        }
        return fx
    }

    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createCompany, {
            variableName: state.variable.variableName.toString(),
            email: state.variable.values.email,
            telephone: state.variable.values.telephone,
            mobile: state.variable.values.mobile,
            website: state.variable.values.website,
            companyType: state.variable.values.companyType.toString(),
            serviceArea: state.variable.values.serviceArea.toString(),
            gstin: state.variable.values.gstin,
            pan: state.variable.values.pan,
            iec: state.variable.values.iec,
            addresses: state.addresses.variables.toArray().map(state => {
                return {
                    name: state.values.name,
                    address: state.values.address.toString()
                }
            }),
            contacts: [{}],
            bankAccounts: state.bankAccounts.variables.toArray().map(state => {
                return {
                    bankAccount: state.values.bankAccount.toString()
                }
            }),
            products: state.products.variables.toArray().map(state => {
                return {
                    product: state.values.product.toString()
                }
            })
        })
        console.log(result, symbolFlag, diff)
        if (symbolFlag) {
            db.diffs.put(diff.toRow())
        }
    }

    const modifyVariable = async () => {
        const [, diff] = await iff(state.variable.variableName.toString() !== state.updatedVariableName.toString(),
            updateVariable(state.variable, state.variable.toRow().values, state.updatedVariableName.toString()),
            updateVariable(state.variable, state.variable.toRow().values)
        )
        console.log(diff)
        db.diffs.put(diff.toRow())
    }

    const deleteVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteCompany, {
            variableName: state.variable.variableName.toString(),
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
                        'create': `Create Company`,
                        'update': `Update Company`,
                        'show': `Company`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/companies')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/companies')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/companies')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{company.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.updatedVariableName.toString()} name='variableName' />,
                                <div className='font-bold text-xl'>{state.variable.variableName.toString()}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{company.keys.email.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.email} name='email' />,
                                <div className='font-bold text-xl'>{state.variable.values.email}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{company.keys.telephone.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.telephone} name='telephone' />,
                                <div className='font-bold text-xl'>{state.variable.values.telephone}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{company.keys.mobile.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.mobile} name='mobile' />,
                                <div className='font-bold text-xl'>{state.variable.values.mobile}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{company.keys.website.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.website} name='website' />,
                                <div className='font-bold text-xl'>{state.variable.values.website}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{company.keys.companyType.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.companyType.toString()} name='companyType'>
                                    <option value='' selected disabled hidden>Select Company Type</option>
                                    {companyTypes.toArray().map(x => <option value={x.variableName.toString()}>{x.variableName.toString()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{state.variable.values.companyType.toString()}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{company.keys.serviceArea.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.serviceArea.toString()} name='serviceArea'>
                                    <option value='' selected disabled hidden>Select Service Area</option>
                                    {serviceAreas.toArray().map(x => <option value={x.variableName.toString()}>{x.variableName.toString()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{state.variable.values.serviceArea.toString()}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{company.keys.gstin.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.gstin} name='gstin' />,
                                <div className='font-bold text-xl'>{state.variable.values.gstin}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{company.keys.pan.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.pan} name='pan' />,
                                <div className='font-bold text-xl'>{state.variable.values.pan}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{company.keys.iec.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.iec} name='iec' />,
                                <div className='font-bold text-xl'>{state.variable.values.iec}</div>
                            )
                        }
                    </Item>
                </Container>

                <Container area={Grid.addresses} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title>Addresses</Title>
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
                            <Filter typeName='CompanyAddress' query={state['addresses'].query} updateQuery={updateItemsQuery('addresses')} />
                        </Drawer>
                        <Drawer open={addCompanyAddressDrawer} onClose={() => toggleAddCompanyAddressDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add {companyAddress.name}</div>
                                <Container area={none} layout={Grid.layouts.uom} className=''>
                                    <Item>
                                        <Label>{companyAddress.keys.name.name}</Label>
                                        <Input type='text' onChange={onCompanyAddressInputChange} name='name' />
                                    </Item>
                                    <Item>
                                        <Label>{companyAddress.keys.address.name}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onCompanyAddressInputChange} value={state.addresses.variable.values.address.toString()} name='address'>
                                                    <option value='' selected disabled hidden>Select Address</option>
                                                    {addresses.toArray().map(x => <option value={x.variableName.toString()}>{x.variableName.toString()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    <Link to={`/address/${state.addresses.variable.values.address.toString()}`}>{state.addresses.variable.values.address.toString()}</Link>
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item justify='center' align='center'>
                                        <Button onClick={() => dispatch(['addresses', 'addVariable'])}>Add</Button>
                                    </Item>
                                </Container>
                            </div>
                        </Drawer>
                    </Item>
                    <Table area={Grid2.table} state={state['addresses']} updatePage={updatePage('addresses')} variables={state.addresses.variables.filter(variable => applyFilter(state['addresses'].query, variable)).toArray()} columns={state['addresses'].columns.toArray()} />
                </Container >

                <Container area={Grid.bankAccounts} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title>Bank Accounts</Title>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <button onClick={() => toggleAddCompanyBankAccountDrawer(true)} className='text-3xl font-bold text-white bg-gray-800 rounded-md px-2 h-10 focus:outline-none'>+</button>,
                                undefined
                            )
                        }
                    </Item>
                    <Item area={Grid2.filter} justify='end' align='center' className='flex'>
                        <Button onClick={() => toggleCompanyBankAccountFilter(true)}>Filter</Button>
                        <Drawer open={companyBankAccountFilter} onClose={() => toggleCompanyBankAccountFilter(false)} anchor={'right'}>
                            <Filter typeName='CompanyBankAccount' query={state['bankAccounts'].query} updateQuery={updateItemsQuery('bankAccounts')} />
                        </Drawer>
                        <Drawer open={addCompanyBankAccountDrawer} onClose={() => toggleAddCompanyBankAccountDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add {companyBankAccount.name}</div>
                                <Container area={none} layout={Grid.layouts.uom} className=''>
                                    {/* <Item>
                                        <Label>{companyBankAccount.keys.name.name}</Label>
                                        <Input type='text' onChange={onCompanyBankAccountInputChange} name='name' />
                                    </Item> */}
                                    <Item>
                                        <Label>{companyBankAccount.keys.bankAccount.name}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onCompanyBankAccountInputChange} value={state.bankAccounts.variable.values.bankAccount.toString()} name='bankAccount'>
                                                    <option value='' selected disabled hidden>Select Bank Account</option>
                                                    {bankAccounts.toArray().map(x => <option value={x.variableName.toString()}>{x.variableName.toString()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    <Link to={`/bank-account/${state.bankAccounts.variable.values.bankAccount.toString()}`}>{state.bankAccounts.variable.values.bankAccount.toString()}</Link>
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item justify='center' align='center'>
                                        <Button onClick={() => dispatch(['bankAccounts', 'addVariable'])}>Add</Button>
                                    </Item>
                                </Container>
                            </div>
                        </Drawer>
                    </Item>
                    <Table area={Grid2.table} state={state['bankAccounts']} updatePage={updatePage('bankAccounts')} variables={state.bankAccounts.variables.filter(variable => applyFilter(state['bankAccounts'].query, variable)).toArray()} columns={state['bankAccounts'].columns.toArray()} />
                </Container >

                <Container area={Grid.products} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title>Products</Title>
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
                            <Filter typeName='CompanyProduct' query={state['products'].query} updateQuery={updateItemsQuery('products')} />
                        </Drawer>
                        <Drawer open={addCompanyProductDrawer} onClose={() => toggleAddCompanyProductDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add {companyProduct.name}</div>
                                <Container area={none} layout={Grid.layouts.uom} className=''>
                                    <Item>
                                        <Label>{companyProduct.keys.product.name}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onCompanyProductInputChange} value={state.products.variable.values.product.toString()} name='product'>
                                                    <option value='' selected disabled hidden>Select Products</option>
                                                    {products.toArray().map(x => <option value={x.variableName.toString()}>{x.variableName.toString()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    <Link to={`/product/${state.products.variable.values.product.toString()}`}>{state.products.variable.values.product.toString()}</Link>
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item justify='center' align='center'>
                                        <Button onClick={() => dispatch(['products', 'addVariable'])}>Add</Button>
                                    </Item>
                                </Container>
                            </div>
                        </Drawer>
                    </Item>
                    <Table area={Grid2.table} state={state['products']} updatePage={updatePage('products')} variables={state.products.variables.filter(variable => applyFilter(state['products'].query, variable)).toArray()} columns={state['products'].columns.toArray()} />
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
