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
import { DiffRow, AddressRow, BankRow, BankAccountRow, BankBranchRow, CurrencyRow } from '../../../main/rows'
import { Address, AddressVariable, Bank, BankVariable, BankAccountVariable, BankBranch, BankBranchVariable, Currency, CurrencyVariable } from '../../../main/variables'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: BankBranchVariable
    bankAccountList: {
        typeName: 'BankAccount'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<Array<string>>
        variable: BankAccountVariable
        variables: HashSet<Immutable<BankAccountVariable>>
    }
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 
    | ['variable', 'bank', Bank]
    | ['variable', 'name', string]
    | ['variable', 'ifsc', string]
    | ['variable', 'address', Address]

    | ['bankAccountList', 'limit', number]
    | ['bankAccountList', 'offset', number]
    | ['bankAccountList', 'page', number]
    | ['bankAccountList', 'query', Args]
    | ['bankAccountList', 'variable', 'bank', Bank]
    | ['bankAccountList', 'variable', 'bankBranch', BankBranch]
    | ['bankAccountList', 'variable', 'accountNumber', string]
    | ['bankAccountList', 'variable', 'accountName', string]
    | ['bankAccountList', 'variable', 'currency', Currency]
    | ['bankAccountList', 'addVariable']
    | ['replace', 'variable', BankBranchVariable]
    | ['replace', 'bankAccountList', HashSet<BankAccountVariable>]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new BankBranchVariable(-1, { bank: new Bank(-1), name: '', ifsc: '', address: new Address(-1) }),
        bankAccountList: {
            typeName: 'BankAccount',
            query: getQuery('BankAccount'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'bank'], ['values', 'bankBranch'], ['values', 'accountNumber'], ['values', 'accountName'], ['values', 'currency']),
            variable: new BankAccountVariable(-1, { bank: new Bank(-1), bankBranch: new BankBranch(-1), accountNumber: '', accountName: '', currency: new Currency(-1) }),
            variables: HashSet.of<BankAccountVariable>()
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
                    case 'bank': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'name': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'ifsc': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'address': {
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
            
            case 'bankAccountList': {
                switch (action[1]) {
                    case 'limit': {
                        state[action[0]].limit = Math.max(initialState.bankAccountList.limit, action[2])
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
                            case 'bank': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'bankBranch': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'accountNumber': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'accountName': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'currency': {
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
                        state.bankAccountList.variables = state.bankAccountList.variables.add(new BankAccountVariable(-1, {bank: new Bank(state.bankAccountList.variable.values.bank.hashCode()), bankBranch: new BankBranch(state.bankAccountList.variable.values.bankBranch.hashCode()), accountNumber: state.bankAccountList.variable.values.accountNumber, accountName: state.bankAccountList.variable.values.accountName, currency: new Currency(state.bankAccountList.variable.values.currency.hashCode())}))
                        state.bankAccountList.variable = initialState.bankAccountList.variable
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
                    case 'bankAccountList': {
                        state.bankAccountList.variables = action[2]
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

    const bankBranchType = types['BankBranch']
    const bankAccountType = types['BankAccount']
    
    const [addBankAccountDrawer, toggleAddBankAccountDrawer] = useState(false)
    const [bankAccountFilter, toggleBankAccountFilter] = useState(false)
    
    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.BankBranch.toArray()
            var composedVariables = HashSet.of<Immutable<BankBranchVariable>>().addAll(rows ? rows.map(x => BankBranchRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as BankBranchVariable])

                const bankAccountRows = await db.BankAccount.toArray()
                var composedBankAccountVariables = HashSet.of<Immutable<BankAccountVariable>>().addAll(bankAccountRows ? bankAccountRows.map(x => BankAccountRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedBankAccountVariables = composedBankAccountVariables.filter(x => !diff.variables[state.bankAccountList.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.bankAccountList.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.bankAccountList.variable.typeName].replace)
                })
                dispatch(['replace', 'bankAccountList', composedBankAccountVariables.filter(variable => variable.values.bankBranch.hashCode() === props.match.params[0]) as HashSet<BankAccountVariable>])
            }
        }
    }, [state.variable.typeName, state.bankAccountList.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

    const addressRows = useLiveQuery(() => db.Address.toArray())?.map(x => AddressRow.toVariable(x))
    var addressList = HashSet.of<Immutable<AddressVariable>>().addAll(addressRows ? addressRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        addressList = addressList.filter(x => !diff.variables.Address.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.Address.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.Address.replace)
    })

    const bankRows = useLiveQuery(() => db.Bank.toArray())?.map(x => BankRow.toVariable(x))
    var bankList = HashSet.of<Immutable<BankVariable>>().addAll(bankRows ? bankRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        bankList = bankList.filter(x => !diff.variables.Bank.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.Bank.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.Bank.replace)
    })

    const bankAccountRows = useLiveQuery(() => db.BankAccount.toArray())?.map(x => BankAccountRow.toVariable(x))
    var bankAccountList = HashSet.of<Immutable<BankAccountVariable>>().addAll(bankAccountRows ? bankAccountRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        bankAccountList = bankAccountList.filter(x => !diff.variables.BankAccount.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.BankAccount.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.BankAccount.replace)
    })

    const bankBranchRows = useLiveQuery(() => db.BankBranch.toArray())?.map(x => BankBranchRow.toVariable(x))
    var bankBranchList = HashSet.of<Immutable<BankBranchVariable>>().addAll(bankBranchRows ? bankBranchRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        bankBranchList = bankBranchList.filter(x => !diff.variables.BankBranch.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.BankBranch.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.BankBranch.replace)
    })

    const currencyRows = useLiveQuery(() => db.Currency.toArray())?.map(x => CurrencyRow.toVariable(x))
    var currencyList = HashSet.of<Immutable<CurrencyVariable>>().addAll(currencyRows ? currencyRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        currencyList = currencyList.filter(x => !diff.variables.Currency.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.Currency.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.Currency.replace)
    })

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'bank': {
                dispatch(['variable', event.target.name, new Bank(parseInt(String(event.target.value)))])
                break
            }
            case 'name': {
                dispatch(['variable', event.target.name, String(event.target.value)])
                break
            }
            case 'ifsc': {
                dispatch(['variable', event.target.name, String(event.target.value)])
                break
            }
            case 'address': {
                dispatch(['variable', event.target.name, new Address(parseInt(String(event.target.value)))])
                break
            }
        }
    }
    const onBankAccountInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'bank': {
                dispatch(['bankAccountList', 'variable', event.target.name, new Bank(parseInt(String(event.target.value)))])
                break
            }
            case 'bankBranch': {
                dispatch(['bankAccountList', 'variable', event.target.name, new BankBranch(parseInt(String(event.target.value)))])
                break
            }
            case 'accountNumber': {
                dispatch(['bankAccountList', 'variable', event.target.name, String(event.target.value)])
                break
            }
            case 'accountName': {
                dispatch(['bankAccountList', 'variable', event.target.name, String(event.target.value)])
                break
            }
            case 'currency': {
                dispatch(['bankAccountList', 'variable', event.target.name, new Currency(parseInt(String(event.target.value)))])
                break
            }
        }
    }

    const updateItemsQuery = (list: 'bankAccountList') => {
        const fx = (args: Args) => {
            switch (list) {
                case 'bankAccountList': {
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

    const updatePage = (list: 'bankAccountList') => {
        const fx = (args: ['limit', number] | ['offset', number] | ['page', number]) => {
            dispatch([list, args[0], args[1]])
        }
        return fx
    }

    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createBankBranch, {
            bank: state.variable.values.bank.hashCode(),
            name: state.variable.values.name,
            ifsc: state.variable.values.ifsc,
            address: state.variable.values.address.hashCode(),
            bankAccountList: state.bankAccountList.variables.toArray().map(variable => {
                return {
                    bank: variable.values.bank.hashCode(),
                    bankBranch: variable.values.bankBranch.hashCode(),
                    accountNumber: variable.values.accountNumber,
                    accountName: variable.values.accountName,
                    currency: variable.values.currency.hashCode()
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteBankBranch, {
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
                        'create': `Create Bank Branch`,
                        'update': `Update Bank Branch`,
                        'show': `Bank Branch`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/bank-branch-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/bank-branch-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/bank-branch-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{bankBranchType.keys.bank}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.bank.hashCode()} name='bank'>
                                    <option value='' selected disabled hidden>Select Bank</option>
                                    {bankList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(bankList.filter(x => x.id.hashCode() === state.variable.values.bank.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = bankList.filter(x => x.id.hashCode() === state.variable.values.bank.hashCode()).toArray()[0] as BankVariable
                                            return <Link to={`/bank/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/bank/${state.variable.values.bank.hashCode()}`}>{state.variable.values.bank.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{bankBranchType.keys.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.name} name='name' />,
                                <div className='font-bold text-xl'>{state.variable.values.name}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{bankBranchType.keys.ifsc}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.ifsc} name='ifsc' />,
                                <div className='font-bold text-xl'>{state.variable.values.ifsc}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{bankBranchType.keys.address}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.address.hashCode()} name='address'>
                                    <option value='' selected disabled hidden>Select Address</option>
                                    {addressList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(addressList.filter(x => x.id.hashCode() === state.variable.values.address.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = addressList.filter(x => x.id.hashCode() === state.variable.values.address.hashCode()).toArray()[0] as AddressVariable
                                            return <Link to={`/address/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/address/${state.variable.values.address.hashCode()}`}>{state.variable.values.address.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                </Container>
                <Container area={Grid.bankAccountArea} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title> Bank Account List</Title>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <button onClick={() => toggleAddBankAccountDrawer(true)} className='text-3xl font-bold text-white bg-gray-800 rounded-md px-2 h-10 focus:outline-none'>+</button>,
                                undefined
                            )
                        }
                    </Item>
                    <Item area={Grid2.filter} justify='end' align='center' className='flex'>
                        <Button onClick={() => toggleBankAccountFilter(true)}>Filter</Button>
                        <Drawer open={bankAccountFilter} onClose={() => toggleBankAccountFilter(false)} anchor={'right'}>
                            <Filter typeName='BankAccount' query={state['bankAccountList'].query} updateQuery={updateItemsQuery('bankAccountList')} />
                        </Drawer>
                        <Drawer open={addBankAccountDrawer} onClose={() => toggleAddBankAccountDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add {bankAccountType.name}</div>
                                <Container area={none} layout={Grid.layouts.uom} className=''>
                                    <Item>
                                        <Label>{bankAccountType.keys.bank}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onBankAccountInputChange} value={state.bankAccountList.variable.values.bank.hashCode()} name='bank'>
                                                    <option value='' selected disabled hidden>Select Bank</option>
                                                    {bankList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(bankList.filter(x => x.id.hashCode() === state.bankAccountList.variable.values.bank.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = bankList.filter(x => x.id.hashCode() === state.bankAccountList.variable.values.bank.hashCode()).toArray()[0] as BankVariable
                                                            return <Link to={`/bank/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/bank/${state.bankAccountList.variable.values.bank.hashCode()}`}>{state.bankAccountList.variable.values.bank.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{bankAccountType.keys.bankBranch}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onBankAccountInputChange} value={state.bankAccountList.variable.values.bankBranch.hashCode()} name='bankBranch'>
                                                    <option value='' selected disabled hidden>Select Bank Branch</option>
                                                    {bankBranchList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(bankBranchList.filter(x => x.id.hashCode() === state.bankAccountList.variable.values.bankBranch.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = bankBranchList.filter(x => x.id.hashCode() === state.bankAccountList.variable.values.bankBranch.hashCode()).toArray()[0] as BankBranchVariable
                                                            return <Link to={`/bank-branch/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/bank-branch/${state.bankAccountList.variable.values.bankBranch.hashCode()}`}>{state.bankAccountList.variable.values.bankBranch.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{bankAccountType.keys.accountNumber}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='text' onChange={onBankAccountInputChange} value={state.bankAccountList.variable.values.accountNumber} name='accountNumber' />,
                                                <div className='font-bold text-xl'>{state.bankAccountList.variable.values.accountNumber}</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{bankAccountType.keys.accountName}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='text' onChange={onBankAccountInputChange} value={state.bankAccountList.variable.values.accountName} name='accountName' />,
                                                <div className='font-bold text-xl'>{state.bankAccountList.variable.values.accountName}</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{bankAccountType.keys.currency}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onBankAccountInputChange} value={state.bankAccountList.variable.values.currency.hashCode()} name='currency'>
                                                    <option value='' selected disabled hidden>Select Currency</option>
                                                    {currencyList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(currencyList.filter(x => x.id.hashCode() === state.bankAccountList.variable.values.currency.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = currencyList.filter(x => x.id.hashCode() === state.bankAccountList.variable.values.currency.hashCode()).toArray()[0] as CurrencyVariable
                                                            return <Link to={`/currency/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/currency/${state.bankAccountList.variable.values.currency.hashCode()}`}>{state.bankAccountList.variable.values.currency.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item justify='center' align='center'>
                                        <Button onClick={() => dispatch(['bankAccountList', 'addVariable'])}>Add</Button>
                                    </Item>
                                </Container>
                            </div>
                        </Drawer>
                    </Item>
                    <Table area={Grid2.table} state={state['bankAccountList']} updatePage={updatePage('bankAccountList')} variables={state.bankAccountList.variables.filter(variable => applyFilter(state['bankAccountList'].query, variable)).toArray()} columns={state['bankAccountList'].columns.toArray()} />
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
