import React, { useEffect, useState } from 'react'
import { Immutable, Draft } from 'immer'
import { useImmerReducer } from 'use-immer'
import tw from 'twin.macro'
import { HashSet, Vector } from 'prelude-ts'
import { executeCircuit } from '../../../main/circuit'
import { types } from '../../../main/types'
import { Container, Item, none } from '../../../main/commons'
import { Bank, BankAccount, BankAccountVariable, BankBranch, BankBranchVariable, BankVariable, Company, CompanyBankAccountVariable, CompanyVariable } from '../../../main/variables'
import * as Grid from './grids/Show'
import * as Grid2 from './grids/List'
import { withRouter, Link } from 'react-router-dom'
import { circuits } from '../../../main/circuits'
import { iff, when } from '../../../main/utils'
import { db } from '../../../main/dexie'
import { DiffRow, BankRow, BankBranchRow, BankAccountRow, CompanyBankAccountRow, CompanyRow } from '../../../main/rows'
import { useCallback } from 'react'
import { updateVariable } from '../../../main/mutation'
import { useLiveQuery } from 'dexie-react-hooks'
import { Query, Filter, Args, getQuery, updateQuery, applyFilter } from '../../../main/Filter'
import { Drawer } from '@material-ui/core'
import { Table } from '../../../main/Table'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: BankAccountVariable
    companies: {
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

    | ['variable', 'values', 'bank', Bank]
    | ['variable', 'values', 'bankBranch', BankBranch]
    | ['variable', 'values', 'accountNumber', string]

    | ['companies', 'limit', number]
    | ['companies', 'offset', number]
    | ['companies', 'page', number]
    | ['companies', 'query', Args]
    | ['companies', 'variable', 'values', 'company', Company]
    | ['companies', 'addVariable']

    | ['replace', 'variable', BankAccountVariable]
    | ['replace', 'companies', HashSet<CompanyBankAccountVariable>]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new BankAccountVariable(-1, { bank: new Bank(-1), bankBranch: new BankBranch(-1), accountNumber: '' }),
        companies: {
            typeName: 'CompanyBankAccount',
            query: getQuery('CompanyBankAccount'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'company']),
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
                    case 'values': {
                        switch (action[2]) {
                            case 'bank': {
                                state[action[0]][action[1]][action[2]] = action[3]
                                break
                            }
                            case 'bankBranch': {
                                state[action[0]][action[1]][action[2]] = action[3]
                                break
                            }
                            case 'accountNumber': {
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
                        state.companies.variables = state.companies.variables.add(new CompanyBankAccountVariable(-1, { company: new Company(state.companies.variable.values.company.hashCode()), bankAccount: new BankAccount(-1) }))
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

    const bankAccount = types['BankAccount']
    const companyBankAccount = types['CompanyBankAccount']

    const [addCompanyBankAccountDrawer, toggleAddCompanyBankAccountDrawer] = useState(false)
    const [companyBankAccountFilter, toggleCompanyBankAccountFilter] = useState(false)

    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.BankAccount.toArray()
            var composedVariables = HashSet.of<Immutable<BankAccountVariable>>().addAll(rows ? rows.map(x => BankAccountRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as BankAccountVariable])

                const companyBankAccountRows = await db.CompanyBankAccount.toArray()
                var composedCompanyBankAccountVariables = HashSet.of<Immutable<CompanyBankAccountVariable>>().addAll(companyBankAccountRows ? companyBankAccountRows.map(x => CompanyBankAccountRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedCompanyBankAccountVariables = composedCompanyBankAccountVariables.filter(x => !diff.variables[state.companies.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.companies.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.companies.variable.typeName].replace)
                })
                dispatch(['replace', 'companies', composedCompanyBankAccountVariables.filter(variable => variable.values.bankAccount.hashCode() === props.match.params[0]) as HashSet<CompanyBankAccountVariable>])
            }
        }
    }, [state.variable.typeName, state.companies.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

    const rows = useLiveQuery(() => db.Bank.orderBy('name').toArray())?.map(x => BankRow.toVariable(x))
    var banks = HashSet.of<Immutable<BankVariable>>().addAll(rows ? rows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        banks = banks.filter(x => !diff.variables.Bank.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.Bank.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.Bank.replace)
    })

    const bankBranchRows = useLiveQuery(() => db.BankBranch.where({ bank: state.variable.values.bank.hashCode() }).toArray())?.map(x => BankBranchRow.toVariable(x))
    var bankBranches = HashSet.of<Immutable<BankBranchVariable>>().addAll(bankBranchRows ? bankBranchRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        bankBranches = bankBranches.filter(x => !diff.variables.BankBranch.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.BankBranch.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.BankBranch.replace)
        bankBranches = bankBranches.filter(x => x.values.bank.hashCode() === state.variable.values.bank.hashCode())
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
                    case 'bank': {
                        dispatch(['variable', 'values', event.target.name, new Bank(parseInt(event.target.value))])
                        break
                    }
                    case 'bankBranch': {
                        dispatch(['variable', 'values', event.target.name, new BankBranch(parseInt(event.target.value))])
                        break
                    }
                    case 'accountNumber': {
                        dispatch(['variable', 'values', event.target.name, event.target.value])
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createBankAccount, {
            bank: state.variable.values.bank.hashCode(),
            bankBranch: state.variable.values.bankBranch.hashCode(),
            accountNumber: state.variable.values.accountNumber,
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteBankAccount, {
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
                        'create': `Create Bank Account`,
                        'update': `Update Bank Account`,
                        'show': `Bank Account`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/bank-accounts')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/bank-accounts')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/bank-accounts')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{bankAccount.keys.bank.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.bank.hashCode()} name='bank'>
                                    <option value='' selected disabled hidden>Select Bank</option>
                                    {banks.toArray().map(x => <option value={x.id.hashCode()}>{x.values.name}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(banks.filter(x => x.id.hashCode() === state.variable.values.bank.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = banks.filter(x => x.id.hashCode() === state.variable.values.bank.hashCode()).toArray()[0] as BankVariable
                                            return <Link to={`/bank/${referencedVariable.id.hashCode()}`}>{referencedVariable.values.name}</Link>
                                        }, <Link to={`/bank/${state.variable.values.bank.hashCode()}`}>{state.variable.values.bank.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{bankAccount.keys.bankBranch.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.bankBranch.hashCode()} name='bankBranch'>
                                    <option value='' selected disabled hidden>Select Bank Branch</option>
                                    {bankBranches.toArray().map(x => <option value={x.id.hashCode()}>{x.values.name}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(bankBranches.filter(x => x.id.hashCode() === state.variable.values.bankBranch.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = bankBranches.filter(x => x.id.hashCode() === state.variable.values.bankBranch.hashCode()).toArray()[0] as BankBranchVariable
                                            return <Link to={`/bank-branch/${referencedVariable.id.hashCode()}`}>{referencedVariable.values.name}</Link>
                                        }, <Link to={`/bank-branch/${state.variable.values.bankBranch.hashCode()}`}>{state.variable.values.bankBranch.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{bankAccount.keys.accountNumber.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.accountNumber} name='accountNumber' />,
                                <div className='font-bold text-xl'>{state.variable.values.accountNumber}</div>
                            )
                        }
                    </Item>
                </Container>

                <Container area={Grid.companies} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title>Companies</Title>
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
                            <Filter typeName='CompanyBankAccount' query={state['companies'].query} updateQuery={updateItemsQuery('companies')} />
                        </Drawer>
                        <Drawer open={addCompanyBankAccountDrawer} onClose={() => toggleAddCompanyBankAccountDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add Company</div>
                                <Container area={none} layout={Grid.layouts.uom}>
                                    <Item>
                                        <Label>{companyBankAccount.keys.company.name}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onCompanyBankAccountInputChange} value={state.companies.variable.values.company.hashCode()} name='company'>
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
