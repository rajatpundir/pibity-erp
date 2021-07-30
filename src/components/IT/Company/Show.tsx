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
import { DiffRow, AddressRow, BankAccountRow, CompanyRow, CompanyAddressRow, CompanyBankAccountRow, CompanyContactRow, CompanyTagRow, ContactRow, CurrencyRow, MappingCompanyTagRow, MemoRow } from '../../../main/rows'
import { Address, AddressVariable, BankAccount, BankAccountVariable, Company, CompanyVariable, CompanyAddressVariable, CompanyBankAccountVariable, CompanyContactVariable, CompanyTag, CompanyTagVariable, Contact, ContactVariable, Currency, CurrencyVariable, MappingCompanyTagVariable, MemoVariable } from '../../../main/variables'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: CompanyVariable
    companyAddressList: {
        typeName: 'CompanyAddress'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<Array<string>>
        variable: CompanyAddressVariable
        variables: HashSet<Immutable<CompanyAddressVariable>>
    }
    mappingCompanyTagList: {
        typeName: 'MappingCompanyTag'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<Array<string>>
        variable: MappingCompanyTagVariable
        variables: HashSet<Immutable<MappingCompanyTagVariable>>
    }
    companyContactList: {
        typeName: 'CompanyContact'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<Array<string>>
        variable: CompanyContactVariable
        variables: HashSet<Immutable<CompanyContactVariable>>
    }
    memoList: {
        typeName: 'Memo'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<Array<string>>
        variable: MemoVariable
        variables: HashSet<Immutable<MemoVariable>>
    }
    companyBankAccountList: {
        typeName: 'CompanyBankAccount'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<Array<string>>
        variable: CompanyBankAccountVariable
        variables: HashSet<Immutable<CompanyBankAccountVariable>>
    }
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 
    | ['variable', 'name', string]
    | ['variable', 'email', string]
    | ['variable', 'telephone', string]
    | ['variable', 'mobile', string]
    | ['variable', 'website', string]
    | ['variable', 'gstin', string]
    | ['variable', 'pan', string]
    | ['variable', 'iec', string]

    | ['companyAddressList', 'limit', number]
    | ['companyAddressList', 'offset', number]
    | ['companyAddressList', 'page', number]
    | ['companyAddressList', 'query', Args]
    | ['companyAddressList', 'variable', 'company', Company]
    | ['companyAddressList', 'variable', 'name', string]
    | ['companyAddressList', 'variable', 'address', Address]
    | ['companyAddressList', 'addVariable']

    | ['mappingCompanyTagList', 'limit', number]
    | ['mappingCompanyTagList', 'offset', number]
    | ['mappingCompanyTagList', 'page', number]
    | ['mappingCompanyTagList', 'query', Args]
    | ['mappingCompanyTagList', 'variable', 'company', Company]
    | ['mappingCompanyTagList', 'variable', 'tag', CompanyTag]
    | ['mappingCompanyTagList', 'addVariable']

    | ['companyContactList', 'limit', number]
    | ['companyContactList', 'offset', number]
    | ['companyContactList', 'page', number]
    | ['companyContactList', 'query', Args]
    | ['companyContactList', 'variable', 'company', Company]
    | ['companyContactList', 'variable', 'contact', Contact]
    | ['companyContactList', 'variable', 'role', string]
    | ['companyContactList', 'variable', 'email', string]
    | ['companyContactList', 'variable', 'telephone', string]
    | ['companyContactList', 'variable', 'mobile', string]
    | ['companyContactList', 'addVariable']

    | ['memoList', 'limit', number]
    | ['memoList', 'offset', number]
    | ['memoList', 'page', number]
    | ['memoList', 'query', Args]
    | ['memoList', 'variable', 'company', Company]
    | ['memoList', 'variable', 'currency', Currency]
    | ['memoList', 'variable', 'amount', number]
    | ['memoList', 'variable', 'unsettled', number]
    | ['memoList', 'addVariable']

    | ['companyBankAccountList', 'limit', number]
    | ['companyBankAccountList', 'offset', number]
    | ['companyBankAccountList', 'page', number]
    | ['companyBankAccountList', 'query', Args]
    | ['companyBankAccountList', 'variable', 'company', Company]
    | ['companyBankAccountList', 'variable', 'bankAccount', BankAccount]
    | ['companyBankAccountList', 'addVariable']
    | ['replace', 'variable', CompanyVariable]
    | ['replace', 'companyAddressList', HashSet<CompanyAddressVariable>]
    | ['replace', 'mappingCompanyTagList', HashSet<MappingCompanyTagVariable>]
    | ['replace', 'companyContactList', HashSet<CompanyContactVariable>]
    | ['replace', 'memoList', HashSet<MemoVariable>]
    | ['replace', 'companyBankAccountList', HashSet<CompanyBankAccountVariable>]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new CompanyVariable(-1, { name: '', email: '', telephone: '', mobile: '', website: '', gstin: '', pan: '', iec: '' }),
        companyAddressList: {
            typeName: 'CompanyAddress',
            query: getQuery('CompanyAddress'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'company'], ['values', 'name'], ['values', 'address']),
            variable: new CompanyAddressVariable(-1, { company: new Company(-1), name: '', address: new Address(-1) }),
            variables: HashSet.of<CompanyAddressVariable>()
        },
        mappingCompanyTagList: {
            typeName: 'MappingCompanyTag',
            query: getQuery('MappingCompanyTag'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'company'], ['values', 'tag']),
            variable: new MappingCompanyTagVariable(-1, { company: new Company(-1), tag: new CompanyTag(-1) }),
            variables: HashSet.of<MappingCompanyTagVariable>()
        },
        companyContactList: {
            typeName: 'CompanyContact',
            query: getQuery('CompanyContact'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'company'], ['values', 'contact'], ['values', 'role'], ['values', 'email'], ['values', 'telephone'], ['values', 'mobile']),
            variable: new CompanyContactVariable(-1, { company: new Company(-1), contact: new Contact(-1), role: '', email: '', telephone: '', mobile: '' }),
            variables: HashSet.of<CompanyContactVariable>()
        },
        memoList: {
            typeName: 'Memo',
            query: getQuery('Memo'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'company'], ['values', 'currency'], ['values', 'amount'], ['values', 'unsettled']),
            variable: new MemoVariable(-1, { company: new Company(-1), currency: new Currency(-1), amount: 0, unsettled: 0 }),
            variables: HashSet.of<MemoVariable>()
        },
        companyBankAccountList: {
            typeName: 'CompanyBankAccount',
            query: getQuery('CompanyBankAccount'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'company'], ['values', 'bankAccount']),
            variable: new CompanyBankAccountVariable(-1, { company: new Company(-1), bankAccount: new BankAccount(-1) }),
            variables: HashSet.of<CompanyBankAccountVariable>()
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
                    case 'email': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'telephone': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'mobile': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'website': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'gstin': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'pan': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'iec': {
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
            
            case 'companyAddressList': {
                switch (action[1]) {
                    case 'limit': {
                        state[action[0]].limit = Math.max(initialState.companyAddressList.limit, action[2])
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
                            case 'name': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'address': {
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
                        state.companyAddressList.variables = state.companyAddressList.variables.add(new CompanyAddressVariable(-1, {company: new Company(state.companyAddressList.variable.values.company.hashCode()), name: state.companyAddressList.variable.values.name, address: new Address(state.companyAddressList.variable.values.address.hashCode())}))
                        state.companyAddressList.variable = initialState.companyAddressList.variable
                        break
                    }
                    default: {
                        const _exhaustiveCheck: never = action
                        return _exhaustiveCheck
                    }
                }
                break
            }
            case 'mappingCompanyTagList': {
                switch (action[1]) {
                    case 'limit': {
                        state[action[0]].limit = Math.max(initialState.mappingCompanyTagList.limit, action[2])
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
                        state.mappingCompanyTagList.variables = state.mappingCompanyTagList.variables.add(new MappingCompanyTagVariable(-1, {company: new Company(state.mappingCompanyTagList.variable.values.company.hashCode()), tag: new CompanyTag(state.mappingCompanyTagList.variable.values.tag.hashCode())}))
                        state.mappingCompanyTagList.variable = initialState.mappingCompanyTagList.variable
                        break
                    }
                    default: {
                        const _exhaustiveCheck: never = action
                        return _exhaustiveCheck
                    }
                }
                break
            }
            case 'companyContactList': {
                switch (action[1]) {
                    case 'limit': {
                        state[action[0]].limit = Math.max(initialState.companyContactList.limit, action[2])
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
                            case 'contact': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'role': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'email': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'telephone': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'mobile': {
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
                        state.companyContactList.variables = state.companyContactList.variables.add(new CompanyContactVariable(-1, {company: new Company(state.companyContactList.variable.values.company.hashCode()), contact: new Contact(state.companyContactList.variable.values.contact.hashCode()), role: state.companyContactList.variable.values.role, email: state.companyContactList.variable.values.email, telephone: state.companyContactList.variable.values.telephone, mobile: state.companyContactList.variable.values.mobile}))
                        state.companyContactList.variable = initialState.companyContactList.variable
                        break
                    }
                    default: {
                        const _exhaustiveCheck: never = action
                        return _exhaustiveCheck
                    }
                }
                break
            }
            case 'memoList': {
                switch (action[1]) {
                    case 'limit': {
                        state[action[0]].limit = Math.max(initialState.memoList.limit, action[2])
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
                            case 'currency': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'amount': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'unsettled': {
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
                        state.memoList.variables = state.memoList.variables.add(new MemoVariable(-1, {company: new Company(state.memoList.variable.values.company.hashCode()), currency: new Currency(state.memoList.variable.values.currency.hashCode()), amount: state.memoList.variable.values.amount, unsettled: state.memoList.variable.values.unsettled}))
                        state.memoList.variable = initialState.memoList.variable
                        break
                    }
                    default: {
                        const _exhaustiveCheck: never = action
                        return _exhaustiveCheck
                    }
                }
                break
            }
            case 'companyBankAccountList': {
                switch (action[1]) {
                    case 'limit': {
                        state[action[0]].limit = Math.max(initialState.companyBankAccountList.limit, action[2])
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
                            case 'bankAccount': {
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
                        state.companyBankAccountList.variables = state.companyBankAccountList.variables.add(new CompanyBankAccountVariable(-1, {company: new Company(state.companyBankAccountList.variable.values.company.hashCode()), bankAccount: new BankAccount(state.companyBankAccountList.variable.values.bankAccount.hashCode())}))
                        state.companyBankAccountList.variable = initialState.companyBankAccountList.variable
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
                    case 'companyAddressList': {
                        state.companyAddressList.variables = action[2]
                        break
                    }
                    case 'mappingCompanyTagList': {
                        state.mappingCompanyTagList.variables = action[2]
                        break
                    }
                    case 'companyContactList': {
                        state.companyContactList.variables = action[2]
                        break
                    }
                    case 'memoList': {
                        state.memoList.variables = action[2]
                        break
                    }
                    case 'companyBankAccountList': {
                        state.companyBankAccountList.variables = action[2]
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

    const companyType = types['Company']
    const companyAddressType = types['CompanyAddress']
    const mappingCompanyTagType = types['MappingCompanyTag']
    const companyContactType = types['CompanyContact']
    const memoType = types['Memo']
    const companyBankAccountType = types['CompanyBankAccount']
    
    const [addCompanyAddressDrawer, toggleAddCompanyAddressDrawer] = useState(false)
    const [companyAddressFilter, toggleCompanyAddressFilter] = useState(false)

    const [addMappingCompanyTagDrawer, toggleAddMappingCompanyTagDrawer] = useState(false)
    const [mappingCompanyTagFilter, toggleMappingCompanyTagFilter] = useState(false)

    const [addCompanyContactDrawer, toggleAddCompanyContactDrawer] = useState(false)
    const [companyContactFilter, toggleCompanyContactFilter] = useState(false)

    const [addMemoDrawer, toggleAddMemoDrawer] = useState(false)
    const [memoFilter, toggleMemoFilter] = useState(false)

    const [addCompanyBankAccountDrawer, toggleAddCompanyBankAccountDrawer] = useState(false)
    const [companyBankAccountFilter, toggleCompanyBankAccountFilter] = useState(false)
    
    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.Company.toArray()
            var composedVariables = HashSet.of<Immutable<CompanyVariable>>().addAll(rows ? rows.map(x => CompanyRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as CompanyVariable])

                const companyAddressRows = await db.CompanyAddress.toArray()
                var composedCompanyAddressVariables = HashSet.of<Immutable<CompanyAddressVariable>>().addAll(companyAddressRows ? companyAddressRows.map(x => CompanyAddressRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedCompanyAddressVariables = composedCompanyAddressVariables.filter(x => !diff.variables[state.companyAddressList.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.companyAddressList.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.companyAddressList.variable.typeName].replace)
                })
                dispatch(['replace', 'companyAddressList', composedCompanyAddressVariables.filter(variable => variable.values.company.hashCode() === props.match.params[0]) as HashSet<CompanyAddressVariable>])

                const mappingCompanyTagRows = await db.MappingCompanyTag.toArray()
                var composedMappingCompanyTagVariables = HashSet.of<Immutable<MappingCompanyTagVariable>>().addAll(mappingCompanyTagRows ? mappingCompanyTagRows.map(x => MappingCompanyTagRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedMappingCompanyTagVariables = composedMappingCompanyTagVariables.filter(x => !diff.variables[state.mappingCompanyTagList.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.mappingCompanyTagList.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.mappingCompanyTagList.variable.typeName].replace)
                })
                dispatch(['replace', 'mappingCompanyTagList', composedMappingCompanyTagVariables.filter(variable => variable.values.company.hashCode() === props.match.params[0]) as HashSet<MappingCompanyTagVariable>])

                const companyContactRows = await db.CompanyContact.toArray()
                var composedCompanyContactVariables = HashSet.of<Immutable<CompanyContactVariable>>().addAll(companyContactRows ? companyContactRows.map(x => CompanyContactRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedCompanyContactVariables = composedCompanyContactVariables.filter(x => !diff.variables[state.companyContactList.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.companyContactList.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.companyContactList.variable.typeName].replace)
                })
                dispatch(['replace', 'companyContactList', composedCompanyContactVariables.filter(variable => variable.values.company.hashCode() === props.match.params[0]) as HashSet<CompanyContactVariable>])

                const memoRows = await db.Memo.toArray()
                var composedMemoVariables = HashSet.of<Immutable<MemoVariable>>().addAll(memoRows ? memoRows.map(x => MemoRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedMemoVariables = composedMemoVariables.filter(x => !diff.variables[state.memoList.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.memoList.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.memoList.variable.typeName].replace)
                })
                dispatch(['replace', 'memoList', composedMemoVariables.filter(variable => variable.values.company.hashCode() === props.match.params[0]) as HashSet<MemoVariable>])

                const companyBankAccountRows = await db.CompanyBankAccount.toArray()
                var composedCompanyBankAccountVariables = HashSet.of<Immutable<CompanyBankAccountVariable>>().addAll(companyBankAccountRows ? companyBankAccountRows.map(x => CompanyBankAccountRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedCompanyBankAccountVariables = composedCompanyBankAccountVariables.filter(x => !diff.variables[state.companyBankAccountList.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.companyBankAccountList.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.companyBankAccountList.variable.typeName].replace)
                })
                dispatch(['replace', 'companyBankAccountList', composedCompanyBankAccountVariables.filter(variable => variable.values.company.hashCode() === props.match.params[0]) as HashSet<CompanyBankAccountVariable>])
            }
        }
    }, [state.variable.typeName, state.companyAddressList.variable.typeName, state.mappingCompanyTagList.variable.typeName, state.companyContactList.variable.typeName, state.memoList.variable.typeName, state.companyBankAccountList.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

    const addressRows = useLiveQuery(() => db.Address.toArray())?.map(x => AddressRow.toVariable(x))
    var addressList = HashSet.of<Immutable<AddressVariable>>().addAll(addressRows ? addressRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        addressList = addressList.filter(x => !diff.variables.Address.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.Address.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.Address.replace)
    })

    const bankAccountRows = useLiveQuery(() => db.BankAccount.toArray())?.map(x => BankAccountRow.toVariable(x))
    var bankAccountList = HashSet.of<Immutable<BankAccountVariable>>().addAll(bankAccountRows ? bankAccountRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        bankAccountList = bankAccountList.filter(x => !diff.variables.BankAccount.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.BankAccount.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.BankAccount.replace)
    })

    const companyRows = useLiveQuery(() => db.Company.toArray())?.map(x => CompanyRow.toVariable(x))
    var companyList = HashSet.of<Immutable<CompanyVariable>>().addAll(companyRows ? companyRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        companyList = companyList.filter(x => !diff.variables.Company.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.Company.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.Company.replace)
    })

    const companyAddressRows = useLiveQuery(() => db.CompanyAddress.toArray())?.map(x => CompanyAddressRow.toVariable(x))
    var companyAddressList = HashSet.of<Immutable<CompanyAddressVariable>>().addAll(companyAddressRows ? companyAddressRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        companyAddressList = companyAddressList.filter(x => !diff.variables.CompanyAddress.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.CompanyAddress.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.CompanyAddress.replace)
    })

    const companyBankAccountRows = useLiveQuery(() => db.CompanyBankAccount.toArray())?.map(x => CompanyBankAccountRow.toVariable(x))
    var companyBankAccountList = HashSet.of<Immutable<CompanyBankAccountVariable>>().addAll(companyBankAccountRows ? companyBankAccountRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        companyBankAccountList = companyBankAccountList.filter(x => !diff.variables.CompanyBankAccount.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.CompanyBankAccount.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.CompanyBankAccount.replace)
    })

    const companyContactRows = useLiveQuery(() => db.CompanyContact.toArray())?.map(x => CompanyContactRow.toVariable(x))
    var companyContactList = HashSet.of<Immutable<CompanyContactVariable>>().addAll(companyContactRows ? companyContactRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        companyContactList = companyContactList.filter(x => !diff.variables.CompanyContact.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.CompanyContact.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.CompanyContact.replace)
    })

    const companyTagRows = useLiveQuery(() => db.CompanyTag.toArray())?.map(x => CompanyTagRow.toVariable(x))
    var companyTagList = HashSet.of<Immutable<CompanyTagVariable>>().addAll(companyTagRows ? companyTagRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        companyTagList = companyTagList.filter(x => !diff.variables.CompanyTag.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.CompanyTag.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.CompanyTag.replace)
    })

    const contactRows = useLiveQuery(() => db.Contact.toArray())?.map(x => ContactRow.toVariable(x))
    var contactList = HashSet.of<Immutable<ContactVariable>>().addAll(contactRows ? contactRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        contactList = contactList.filter(x => !diff.variables.Contact.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.Contact.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.Contact.replace)
    })

    const currencyRows = useLiveQuery(() => db.Currency.toArray())?.map(x => CurrencyRow.toVariable(x))
    var currencyList = HashSet.of<Immutable<CurrencyVariable>>().addAll(currencyRows ? currencyRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        currencyList = currencyList.filter(x => !diff.variables.Currency.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.Currency.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.Currency.replace)
    })

    const mappingCompanyTagRows = useLiveQuery(() => db.MappingCompanyTag.toArray())?.map(x => MappingCompanyTagRow.toVariable(x))
    var mappingCompanyTagList = HashSet.of<Immutable<MappingCompanyTagVariable>>().addAll(mappingCompanyTagRows ? mappingCompanyTagRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        mappingCompanyTagList = mappingCompanyTagList.filter(x => !diff.variables.MappingCompanyTag.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.MappingCompanyTag.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.MappingCompanyTag.replace)
    })

    const memoRows = useLiveQuery(() => db.Memo.toArray())?.map(x => MemoRow.toVariable(x))
    var memoList = HashSet.of<Immutable<MemoVariable>>().addAll(memoRows ? memoRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        memoList = memoList.filter(x => !diff.variables.Memo.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.Memo.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.Memo.replace)
    })

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'name': {
                dispatch(['variable', event.target.name, String(event.target.value)])
                break
            }
            case 'email': {
                dispatch(['variable', event.target.name, String(event.target.value)])
                break
            }
            case 'telephone': {
                dispatch(['variable', event.target.name, String(event.target.value)])
                break
            }
            case 'mobile': {
                dispatch(['variable', event.target.name, String(event.target.value)])
                break
            }
            case 'website': {
                dispatch(['variable', event.target.name, String(event.target.value)])
                break
            }
            case 'gstin': {
                dispatch(['variable', event.target.name, String(event.target.value)])
                break
            }
            case 'pan': {
                dispatch(['variable', event.target.name, String(event.target.value)])
                break
            }
            case 'iec': {
                dispatch(['variable', event.target.name, String(event.target.value)])
                break
            }
        }
    }
    const onCompanyAddressInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'company': {
                dispatch(['companyAddressList', 'variable', event.target.name, new Company(parseInt(String(event.target.value)))])
                break
            }
            case 'name': {
                dispatch(['companyAddressList', 'variable', event.target.name, String(event.target.value)])
                break
            }
            case 'address': {
                dispatch(['companyAddressList', 'variable', event.target.name, new Address(parseInt(String(event.target.value)))])
                break
            }
        }
    }

    const onMappingCompanyTagInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'company': {
                dispatch(['mappingCompanyTagList', 'variable', event.target.name, new Company(parseInt(String(event.target.value)))])
                break
            }
            case 'tag': {
                dispatch(['mappingCompanyTagList', 'variable', event.target.name, new CompanyTag(parseInt(String(event.target.value)))])
                break
            }
        }
    }

    const onCompanyContactInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'company': {
                dispatch(['companyContactList', 'variable', event.target.name, new Company(parseInt(String(event.target.value)))])
                break
            }
            case 'contact': {
                dispatch(['companyContactList', 'variable', event.target.name, new Contact(parseInt(String(event.target.value)))])
                break
            }
            case 'role': {
                dispatch(['companyContactList', 'variable', event.target.name, String(event.target.value)])
                break
            }
            case 'email': {
                dispatch(['companyContactList', 'variable', event.target.name, String(event.target.value)])
                break
            }
            case 'telephone': {
                dispatch(['companyContactList', 'variable', event.target.name, String(event.target.value)])
                break
            }
            case 'mobile': {
                dispatch(['companyContactList', 'variable', event.target.name, String(event.target.value)])
                break
            }
        }
    }

    const onMemoInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'company': {
                dispatch(['memoList', 'variable', event.target.name, new Company(parseInt(String(event.target.value)))])
                break
            }
            case 'currency': {
                dispatch(['memoList', 'variable', event.target.name, new Currency(parseInt(String(event.target.value)))])
                break
            }
            case 'amount': {
                dispatch(['memoList', 'variable', event.target.name, parseFloat(String(event.target.value))])
                break
            }
            case 'unsettled': {
                dispatch(['memoList', 'variable', event.target.name, parseFloat(String(event.target.value))])
                break
            }
        }
    }

    const onCompanyBankAccountInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'company': {
                dispatch(['companyBankAccountList', 'variable', event.target.name, new Company(parseInt(String(event.target.value)))])
                break
            }
            case 'bankAccount': {
                dispatch(['companyBankAccountList', 'variable', event.target.name, new BankAccount(parseInt(String(event.target.value)))])
                break
            }
        }
    }

    const updateItemsQuery = (list: 'companyAddressList' | 'mappingCompanyTagList' | 'companyContactList' | 'memoList' | 'companyBankAccountList') => {
        const fx = (args: Args) => {
            switch (list) {
                case 'companyAddressList': {
                    dispatch([list, 'query', args])
                    break
                }
                case 'mappingCompanyTagList': {
                    dispatch([list, 'query', args])
                    break
                }
                case 'companyContactList': {
                    dispatch([list, 'query', args])
                    break
                }
                case 'memoList': {
                    dispatch([list, 'query', args])
                    break
                }
                case 'companyBankAccountList': {
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

    const updatePage = (list: 'companyAddressList' | 'mappingCompanyTagList' | 'companyContactList' | 'memoList' | 'companyBankAccountList') => {
        const fx = (args: ['limit', number] | ['offset', number] | ['page', number]) => {
            dispatch([list, args[0], args[1]])
        }
        return fx
    }

    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createCompany, {
            name: state.variable.values.name,
            email: state.variable.values.email,
            telephone: state.variable.values.telephone,
            mobile: state.variable.values.mobile,
            website: state.variable.values.website,
            gstin: state.variable.values.gstin,
            pan: state.variable.values.pan,
            iec: state.variable.values.iec,
            companyAddressList: state.companyAddressList.variables.toArray().map(variable => {
                return {
                    company: variable.values.company.hashCode(),
                    name: variable.values.name,
                    address: variable.values.address.hashCode()
                }
            }),
            mappingCompanyTagList: state.mappingCompanyTagList.variables.toArray().map(variable => {
                return {
                    company: variable.values.company.hashCode(),
                    tag: variable.values.tag.hashCode()
                }
            }),
            companyContactList: state.companyContactList.variables.toArray().map(variable => {
                return {
                    company: variable.values.company.hashCode(),
                    contact: variable.values.contact.hashCode(),
                    role: variable.values.role,
                    email: variable.values.email,
                    telephone: variable.values.telephone,
                    mobile: variable.values.mobile
                }
            }),
            memoList: state.memoList.variables.toArray().map(variable => {
                return {
                    company: variable.values.company.hashCode(),
                    currency: variable.values.currency.hashCode(),
                    amount: variable.values.amount,
                    unsettled: variable.values.unsettled
                }
            }),
            companyBankAccountList: state.companyBankAccountList.variables.toArray().map(variable => {
                return {
                    company: variable.values.company.hashCode(),
                    bankAccount: variable.values.bankAccount.hashCode()
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteCompany, {
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
                                props.history.push('/company-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/company-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/company-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{companyType.keys.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.name} name='name' />,
                                <div className='font-bold text-xl'>{state.variable.values.name}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{companyType.keys.email}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.email} name='email' />,
                                <div className='font-bold text-xl'>{state.variable.values.email}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{companyType.keys.telephone}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.telephone} name='telephone' />,
                                <div className='font-bold text-xl'>{state.variable.values.telephone}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{companyType.keys.mobile}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.mobile} name='mobile' />,
                                <div className='font-bold text-xl'>{state.variable.values.mobile}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{companyType.keys.website}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.website} name='website' />,
                                <div className='font-bold text-xl'>{state.variable.values.website}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{companyType.keys.gstin}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.gstin} name='gstin' />,
                                <div className='font-bold text-xl'>{state.variable.values.gstin}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{companyType.keys.pan}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.pan} name='pan' />,
                                <div className='font-bold text-xl'>{state.variable.values.pan}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{companyType.keys.iec}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.iec} name='iec' />,
                                <div className='font-bold text-xl'>{state.variable.values.iec}</div>
                            )
                        }
                    </Item>
                </Container>
                <Container area={Grid.companyAddressArea} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title> Company Address List</Title>
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
                            <Filter typeName='CompanyAddress' query={state['companyAddressList'].query} updateQuery={updateItemsQuery('companyAddressList')} />
                        </Drawer>
                        <Drawer open={addCompanyAddressDrawer} onClose={() => toggleAddCompanyAddressDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add {companyAddressType.name}</div>
                                <Container area={none} layout={Grid.layouts.uom} className=''>
                                    <Item>
                                        <Label>{companyAddressType.keys.company}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onCompanyAddressInputChange} value={state.companyAddressList.variable.values.company.hashCode()} name='company'>
                                                    <option value='' selected disabled hidden>Select Company</option>
                                                    {companyList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(companyList.filter(x => x.id.hashCode() === state.companyAddressList.variable.values.company.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = companyList.filter(x => x.id.hashCode() === state.companyAddressList.variable.values.company.hashCode()).toArray()[0] as CompanyVariable
                                                            return <Link to={`/company/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/company/${state.companyAddressList.variable.values.company.hashCode()}`}>{state.companyAddressList.variable.values.company.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{companyAddressType.keys.name}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='text' onChange={onCompanyAddressInputChange} value={state.companyAddressList.variable.values.name} name='name' />,
                                                <div className='font-bold text-xl'>{state.companyAddressList.variable.values.name}</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{companyAddressType.keys.address}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onCompanyAddressInputChange} value={state.companyAddressList.variable.values.address.hashCode()} name='address'>
                                                    <option value='' selected disabled hidden>Select Address</option>
                                                    {addressList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(addressList.filter(x => x.id.hashCode() === state.companyAddressList.variable.values.address.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = addressList.filter(x => x.id.hashCode() === state.companyAddressList.variable.values.address.hashCode()).toArray()[0] as AddressVariable
                                                            return <Link to={`/address/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/address/${state.companyAddressList.variable.values.address.hashCode()}`}>{state.companyAddressList.variable.values.address.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item justify='center' align='center'>
                                        <Button onClick={() => dispatch(['companyAddressList', 'addVariable'])}>Add</Button>
                                    </Item>
                                </Container>
                            </div>
                        </Drawer>
                    </Item>
                    <Table area={Grid2.table} state={state['companyAddressList']} updatePage={updatePage('companyAddressList')} variables={state.companyAddressList.variables.filter(variable => applyFilter(state['companyAddressList'].query, variable)).toArray()} columns={state['companyAddressList'].columns.toArray()} />
                </Container > 

                <Container area={Grid.mappingCompanyTagArea} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title> Mapping Company Tag List</Title>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <button onClick={() => toggleAddMappingCompanyTagDrawer(true)} className='text-3xl font-bold text-white bg-gray-800 rounded-md px-2 h-10 focus:outline-none'>+</button>,
                                undefined
                            )
                        }
                    </Item>
                    <Item area={Grid2.filter} justify='end' align='center' className='flex'>
                        <Button onClick={() => toggleMappingCompanyTagFilter(true)}>Filter</Button>
                        <Drawer open={mappingCompanyTagFilter} onClose={() => toggleMappingCompanyTagFilter(false)} anchor={'right'}>
                            <Filter typeName='MappingCompanyTag' query={state['mappingCompanyTagList'].query} updateQuery={updateItemsQuery('mappingCompanyTagList')} />
                        </Drawer>
                        <Drawer open={addMappingCompanyTagDrawer} onClose={() => toggleAddMappingCompanyTagDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add {mappingCompanyTagType.name}</div>
                                <Container area={none} layout={Grid.layouts.uom} className=''>
                                    <Item>
                                        <Label>{mappingCompanyTagType.keys.company}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onMappingCompanyTagInputChange} value={state.mappingCompanyTagList.variable.values.company.hashCode()} name='company'>
                                                    <option value='' selected disabled hidden>Select Company</option>
                                                    {companyList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(companyList.filter(x => x.id.hashCode() === state.mappingCompanyTagList.variable.values.company.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = companyList.filter(x => x.id.hashCode() === state.mappingCompanyTagList.variable.values.company.hashCode()).toArray()[0] as CompanyVariable
                                                            return <Link to={`/company/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/company/${state.mappingCompanyTagList.variable.values.company.hashCode()}`}>{state.mappingCompanyTagList.variable.values.company.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{mappingCompanyTagType.keys.tag}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onMappingCompanyTagInputChange} value={state.mappingCompanyTagList.variable.values.tag.hashCode()} name='tag'>
                                                    <option value='' selected disabled hidden>Select Tag</option>
                                                    {companyTagList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(companyTagList.filter(x => x.id.hashCode() === state.mappingCompanyTagList.variable.values.tag.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = companyTagList.filter(x => x.id.hashCode() === state.mappingCompanyTagList.variable.values.tag.hashCode()).toArray()[0] as CompanyTagVariable
                                                            return <Link to={`/company-tag/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/company-tag/${state.mappingCompanyTagList.variable.values.tag.hashCode()}`}>{state.mappingCompanyTagList.variable.values.tag.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item justify='center' align='center'>
                                        <Button onClick={() => dispatch(['mappingCompanyTagList', 'addVariable'])}>Add</Button>
                                    </Item>
                                </Container>
                            </div>
                        </Drawer>
                    </Item>
                    <Table area={Grid2.table} state={state['mappingCompanyTagList']} updatePage={updatePage('mappingCompanyTagList')} variables={state.mappingCompanyTagList.variables.filter(variable => applyFilter(state['mappingCompanyTagList'].query, variable)).toArray()} columns={state['mappingCompanyTagList'].columns.toArray()} />
                </Container > 

                <Container area={Grid.companyContactArea} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title> Company Contact List</Title>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <button onClick={() => toggleAddCompanyContactDrawer(true)} className='text-3xl font-bold text-white bg-gray-800 rounded-md px-2 h-10 focus:outline-none'>+</button>,
                                undefined
                            )
                        }
                    </Item>
                    <Item area={Grid2.filter} justify='end' align='center' className='flex'>
                        <Button onClick={() => toggleCompanyContactFilter(true)}>Filter</Button>
                        <Drawer open={companyContactFilter} onClose={() => toggleCompanyContactFilter(false)} anchor={'right'}>
                            <Filter typeName='CompanyContact' query={state['companyContactList'].query} updateQuery={updateItemsQuery('companyContactList')} />
                        </Drawer>
                        <Drawer open={addCompanyContactDrawer} onClose={() => toggleAddCompanyContactDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add {companyContactType.name}</div>
                                <Container area={none} layout={Grid.layouts.uom} className=''>
                                    <Item>
                                        <Label>{companyContactType.keys.company}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onCompanyContactInputChange} value={state.companyContactList.variable.values.company.hashCode()} name='company'>
                                                    <option value='' selected disabled hidden>Select Company</option>
                                                    {companyList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(companyList.filter(x => x.id.hashCode() === state.companyContactList.variable.values.company.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = companyList.filter(x => x.id.hashCode() === state.companyContactList.variable.values.company.hashCode()).toArray()[0] as CompanyVariable
                                                            return <Link to={`/company/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/company/${state.companyContactList.variable.values.company.hashCode()}`}>{state.companyContactList.variable.values.company.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{companyContactType.keys.contact}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onCompanyContactInputChange} value={state.companyContactList.variable.values.contact.hashCode()} name='contact'>
                                                    <option value='' selected disabled hidden>Select Contact</option>
                                                    {contactList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(contactList.filter(x => x.id.hashCode() === state.companyContactList.variable.values.contact.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = contactList.filter(x => x.id.hashCode() === state.companyContactList.variable.values.contact.hashCode()).toArray()[0] as ContactVariable
                                                            return <Link to={`/contact/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/contact/${state.companyContactList.variable.values.contact.hashCode()}`}>{state.companyContactList.variable.values.contact.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{companyContactType.keys.role}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='text' onChange={onCompanyContactInputChange} value={state.companyContactList.variable.values.role} name='role' />,
                                                <div className='font-bold text-xl'>{state.companyContactList.variable.values.role}</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{companyContactType.keys.email}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='text' onChange={onCompanyContactInputChange} value={state.companyContactList.variable.values.email} name='email' />,
                                                <div className='font-bold text-xl'>{state.companyContactList.variable.values.email}</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{companyContactType.keys.telephone}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='text' onChange={onCompanyContactInputChange} value={state.companyContactList.variable.values.telephone} name='telephone' />,
                                                <div className='font-bold text-xl'>{state.companyContactList.variable.values.telephone}</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{companyContactType.keys.mobile}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='text' onChange={onCompanyContactInputChange} value={state.companyContactList.variable.values.mobile} name='mobile' />,
                                                <div className='font-bold text-xl'>{state.companyContactList.variable.values.mobile}</div>
                                            )
                                        }
                                    </Item>
                                    <Item justify='center' align='center'>
                                        <Button onClick={() => dispatch(['companyContactList', 'addVariable'])}>Add</Button>
                                    </Item>
                                </Container>
                            </div>
                        </Drawer>
                    </Item>
                    <Table area={Grid2.table} state={state['companyContactList']} updatePage={updatePage('companyContactList')} variables={state.companyContactList.variables.filter(variable => applyFilter(state['companyContactList'].query, variable)).toArray()} columns={state['companyContactList'].columns.toArray()} />
                </Container > 

                <Container area={Grid.memoArea} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title> Memo List</Title>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <button onClick={() => toggleAddMemoDrawer(true)} className='text-3xl font-bold text-white bg-gray-800 rounded-md px-2 h-10 focus:outline-none'>+</button>,
                                undefined
                            )
                        }
                    </Item>
                    <Item area={Grid2.filter} justify='end' align='center' className='flex'>
                        <Button onClick={() => toggleMemoFilter(true)}>Filter</Button>
                        <Drawer open={memoFilter} onClose={() => toggleMemoFilter(false)} anchor={'right'}>
                            <Filter typeName='Memo' query={state['memoList'].query} updateQuery={updateItemsQuery('memoList')} />
                        </Drawer>
                        <Drawer open={addMemoDrawer} onClose={() => toggleAddMemoDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add {memoType.name}</div>
                                <Container area={none} layout={Grid.layouts.uom} className=''>
                                    <Item>
                                        <Label>{memoType.keys.company}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onMemoInputChange} value={state.memoList.variable.values.company.hashCode()} name='company'>
                                                    <option value='' selected disabled hidden>Select Company</option>
                                                    {companyList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(companyList.filter(x => x.id.hashCode() === state.memoList.variable.values.company.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = companyList.filter(x => x.id.hashCode() === state.memoList.variable.values.company.hashCode()).toArray()[0] as CompanyVariable
                                                            return <Link to={`/company/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/company/${state.memoList.variable.values.company.hashCode()}`}>{state.memoList.variable.values.company.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{memoType.keys.currency}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onMemoInputChange} value={state.memoList.variable.values.currency.hashCode()} name='currency'>
                                                    <option value='' selected disabled hidden>Select Currency</option>
                                                    {currencyList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(currencyList.filter(x => x.id.hashCode() === state.memoList.variable.values.currency.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = currencyList.filter(x => x.id.hashCode() === state.memoList.variable.values.currency.hashCode()).toArray()[0] as CurrencyVariable
                                                            return <Link to={`/currency/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/currency/${state.memoList.variable.values.currency.hashCode()}`}>{state.memoList.variable.values.currency.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{memoType.keys.amount}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='number' onChange={onMemoInputChange} value={state.memoList.variable.values.amount} name='amount' />,
                                                <div className='font-bold text-xl'>{state.memoList.variable.values.amount}</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{memoType.keys.unsettled}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='number' onChange={onMemoInputChange} value={state.memoList.variable.values.unsettled} name='unsettled' />,
                                                <div className='font-bold text-xl'>{state.memoList.variable.values.unsettled}</div>
                                            )
                                        }
                                    </Item>
                                    <Item justify='center' align='center'>
                                        <Button onClick={() => dispatch(['memoList', 'addVariable'])}>Add</Button>
                                    </Item>
                                </Container>
                            </div>
                        </Drawer>
                    </Item>
                    <Table area={Grid2.table} state={state['memoList']} updatePage={updatePage('memoList')} variables={state.memoList.variables.filter(variable => applyFilter(state['memoList'].query, variable)).toArray()} columns={state['memoList'].columns.toArray()} />
                </Container > 

                <Container area={Grid.companyBankAccountArea} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title> Company Bank Account List</Title>
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
                            <Filter typeName='CompanyBankAccount' query={state['companyBankAccountList'].query} updateQuery={updateItemsQuery('companyBankAccountList')} />
                        </Drawer>
                        <Drawer open={addCompanyBankAccountDrawer} onClose={() => toggleAddCompanyBankAccountDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add {companyBankAccountType.name}</div>
                                <Container area={none} layout={Grid.layouts.uom} className=''>
                                    <Item>
                                        <Label>{companyBankAccountType.keys.company}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onCompanyBankAccountInputChange} value={state.companyBankAccountList.variable.values.company.hashCode()} name='company'>
                                                    <option value='' selected disabled hidden>Select Company</option>
                                                    {companyList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(companyList.filter(x => x.id.hashCode() === state.companyBankAccountList.variable.values.company.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = companyList.filter(x => x.id.hashCode() === state.companyBankAccountList.variable.values.company.hashCode()).toArray()[0] as CompanyVariable
                                                            return <Link to={`/company/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/company/${state.companyBankAccountList.variable.values.company.hashCode()}`}>{state.companyBankAccountList.variable.values.company.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{companyBankAccountType.keys.bankAccount}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onCompanyBankAccountInputChange} value={state.companyBankAccountList.variable.values.bankAccount.hashCode()} name='bankAccount'>
                                                    <option value='' selected disabled hidden>Select Bank Account</option>
                                                    {bankAccountList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(bankAccountList.filter(x => x.id.hashCode() === state.companyBankAccountList.variable.values.bankAccount.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = bankAccountList.filter(x => x.id.hashCode() === state.companyBankAccountList.variable.values.bankAccount.hashCode()).toArray()[0] as BankAccountVariable
                                                            return <Link to={`/bank-account/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/bank-account/${state.companyBankAccountList.variable.values.bankAccount.hashCode()}`}>{state.companyBankAccountList.variable.values.bankAccount.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item justify='center' align='center'>
                                        <Button onClick={() => dispatch(['companyBankAccountList', 'addVariable'])}>Add</Button>
                                    </Item>
                                </Container>
                            </div>
                        </Drawer>
                    </Item>
                    <Table area={Grid2.table} state={state['companyBankAccountList']} updatePage={updatePage('companyBankAccountList')} variables={state.companyBankAccountList.variables.filter(variable => applyFilter(state['companyBankAccountList'].query, variable)).toArray()} columns={state['companyBankAccountList'].columns.toArray()} />
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
