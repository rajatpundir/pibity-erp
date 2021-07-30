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
import { DiffRow, BankRow, BankAccountRow, BankBranchRow, BankTransactionRow, CurrencyRow, CurrencyRateRow, MemoRow } from '../../../main/rows'
import { Bank, BankVariable, BankAccount, BankAccountVariable, BankBranch, BankBranchVariable, BankTransactionVariable, Currency, CurrencyVariable, CurrencyRate, CurrencyRateVariable, Memo, MemoVariable } from '../../../main/variables'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: BankAccountVariable
    bankTransactionList: {
        typeName: 'BankTransaction'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<Array<string>>
        variable: BankTransactionVariable
        variables: HashSet<Immutable<BankTransactionVariable>>
    }
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 
    | ['variable', 'bank', Bank]
    | ['variable', 'bankBranch', BankBranch]
    | ['variable', 'accountNumber', string]
    | ['variable', 'accountName', string]
    | ['variable', 'currency', Currency]

    | ['bankTransactionList', 'limit', number]
    | ['bankTransactionList', 'offset', number]
    | ['bankTransactionList', 'page', number]
    | ['bankTransactionList', 'query', Args]
    | ['bankTransactionList', 'variable', 'timestamp', number]
    | ['bankTransactionList', 'variable', 'memo', Memo]
    | ['bankTransactionList', 'variable', 'currencyRate', CurrencyRate]
    | ['bankTransactionList', 'variable', 'bankAccount', BankAccount]
    | ['bankTransactionList', 'variable', 'fromToAccount', BankAccount]
    | ['bankTransactionList', 'variable', 'credit', number]
    | ['bankTransactionList', 'variable', 'debit', number]
    | ['bankTransactionList', 'addVariable']
    | ['replace', 'variable', BankAccountVariable]
    | ['replace', 'bankTransactionList', HashSet<BankTransactionVariable>]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new BankAccountVariable(-1, { bank: new Bank(-1), bankBranch: new BankBranch(-1), accountNumber: '', accountName: '', currency: new Currency(-1) }),
        bankTransactionList: {
            typeName: 'BankTransaction',
            query: getQuery('BankTransaction'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'timestamp'], ['values', 'memo'], ['values', 'currencyRate'], ['values', 'bankAccount'], ['values', 'fromToAccount'], ['values', 'credit'], ['values', 'debit']),
            variable: new BankTransactionVariable(-1, { timestamp: 0, memo: new Memo(-1), currencyRate: new CurrencyRate(-1), bankAccount: new BankAccount(-1), fromToAccount: new BankAccount(-1), credit: 0, debit: 0 }),
            variables: HashSet.of<BankTransactionVariable>()
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
                    case 'bankBranch': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'accountNumber': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'accountName': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'currency': {
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
            
            case 'bankTransactionList': {
                switch (action[1]) {
                    case 'limit': {
                        state[action[0]].limit = Math.max(initialState.bankTransactionList.limit, action[2])
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
                            case 'timestamp': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'memo': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'currencyRate': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'bankAccount': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'fromToAccount': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'credit': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'debit': {
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
                        state.bankTransactionList.variables = state.bankTransactionList.variables.add(new BankTransactionVariable(-1, {timestamp: state.bankTransactionList.variable.values.timestamp, memo: new Memo(state.bankTransactionList.variable.values.memo.hashCode()), currencyRate: new CurrencyRate(state.bankTransactionList.variable.values.currencyRate.hashCode()), bankAccount: new BankAccount(state.bankTransactionList.variable.values.bankAccount.hashCode()), fromToAccount: new BankAccount(state.bankTransactionList.variable.values.fromToAccount.hashCode()), credit: state.bankTransactionList.variable.values.credit, debit: state.bankTransactionList.variable.values.debit}))
                        state.bankTransactionList.variable = initialState.bankTransactionList.variable
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
                    case 'bankTransactionList': {
                        state.bankTransactionList.variables = action[2]
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

    const bankAccountType = types['BankAccount']
    const bankTransactionType = types['BankTransaction']
    
    const [addBankTransactionDrawer, toggleAddBankTransactionDrawer] = useState(false)
    const [bankTransactionFilter, toggleBankTransactionFilter] = useState(false)
    
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

                const bankTransactionRows = await db.BankTransaction.toArray()
                var composedBankTransactionVariables = HashSet.of<Immutable<BankTransactionVariable>>().addAll(bankTransactionRows ? bankTransactionRows.map(x => BankTransactionRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedBankTransactionVariables = composedBankTransactionVariables.filter(x => !diff.variables[state.bankTransactionList.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.bankTransactionList.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.bankTransactionList.variable.typeName].replace)
                })
                dispatch(['replace', 'bankTransactionList', composedBankTransactionVariables.filter(variable => variable.values.bankAccount.hashCode() === props.match.params[0]) as HashSet<BankTransactionVariable>])
            }
        }
    }, [state.variable.typeName, state.bankTransactionList.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

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

    const bankTransactionRows = useLiveQuery(() => db.BankTransaction.toArray())?.map(x => BankTransactionRow.toVariable(x))
    var bankTransactionList = HashSet.of<Immutable<BankTransactionVariable>>().addAll(bankTransactionRows ? bankTransactionRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        bankTransactionList = bankTransactionList.filter(x => !diff.variables.BankTransaction.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.BankTransaction.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.BankTransaction.replace)
    })

    const currencyRows = useLiveQuery(() => db.Currency.toArray())?.map(x => CurrencyRow.toVariable(x))
    var currencyList = HashSet.of<Immutable<CurrencyVariable>>().addAll(currencyRows ? currencyRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        currencyList = currencyList.filter(x => !diff.variables.Currency.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.Currency.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.Currency.replace)
    })

    const currencyRateRows = useLiveQuery(() => db.CurrencyRate.toArray())?.map(x => CurrencyRateRow.toVariable(x))
    var currencyRateList = HashSet.of<Immutable<CurrencyRateVariable>>().addAll(currencyRateRows ? currencyRateRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        currencyRateList = currencyRateList.filter(x => !diff.variables.CurrencyRate.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.CurrencyRate.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.CurrencyRate.replace)
    })

    const memoRows = useLiveQuery(() => db.Memo.toArray())?.map(x => MemoRow.toVariable(x))
    var memoList = HashSet.of<Immutable<MemoVariable>>().addAll(memoRows ? memoRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        memoList = memoList.filter(x => !diff.variables.Memo.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.Memo.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.Memo.replace)
    })

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'bank': {
                dispatch(['variable', event.target.name, new Bank(parseInt(String(event.target.value)))])
                break
            }
            case 'bankBranch': {
                dispatch(['variable', event.target.name, new BankBranch(parseInt(String(event.target.value)))])
                break
            }
            case 'accountNumber': {
                dispatch(['variable', event.target.name, String(event.target.value)])
                break
            }
            case 'accountName': {
                dispatch(['variable', event.target.name, String(event.target.value)])
                break
            }
            case 'currency': {
                dispatch(['variable', event.target.name, new Currency(parseInt(String(event.target.value)))])
                break
            }
        }
    }
    const onBankTransactionInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'timestamp': {
                dispatch(['bankTransactionList', 'variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
            case 'memo': {
                dispatch(['bankTransactionList', 'variable', event.target.name, new Memo(parseInt(String(event.target.value)))])
                break
            }
            case 'currencyRate': {
                dispatch(['bankTransactionList', 'variable', event.target.name, new CurrencyRate(parseInt(String(event.target.value)))])
                break
            }
            case 'bankAccount': {
                dispatch(['bankTransactionList', 'variable', event.target.name, new BankAccount(parseInt(String(event.target.value)))])
                break
            }
            case 'fromToAccount': {
                dispatch(['bankTransactionList', 'variable', event.target.name, new BankAccount(parseInt(String(event.target.value)))])
                break
            }
            case 'credit': {
                dispatch(['bankTransactionList', 'variable', event.target.name, parseFloat(String(event.target.value))])
                break
            }
            case 'debit': {
                dispatch(['bankTransactionList', 'variable', event.target.name, parseFloat(String(event.target.value))])
                break
            }
        }
    }

    const updateItemsQuery = (list: 'bankTransactionList') => {
        const fx = (args: Args) => {
            switch (list) {
                case 'bankTransactionList': {
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

    const updatePage = (list: 'bankTransactionList') => {
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
            accountName: state.variable.values.accountName,
            currency: state.variable.values.currency.hashCode(),
            bankTransactionList: state.bankTransactionList.variables.toArray().map(variable => {
                return {
                    timestamp: variable.values.timestamp,
                    memo: variable.values.memo.hashCode(),
                    currencyRate: variable.values.currencyRate.hashCode(),
                    bankAccount: variable.values.bankAccount.hashCode(),
                    fromToAccount: variable.values.fromToAccount.hashCode(),
                    credit: variable.values.credit,
                    debit: variable.values.debit
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
                                props.history.push('/bank-account-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/bank-account-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/bank-account-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{bankAccountType.keys.bank}</Label>
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
                        <Label>{bankAccountType.keys.bankBranch}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.bankBranch.hashCode()} name='bankBranch'>
                                    <option value='' selected disabled hidden>Select Bank Branch</option>
                                    {bankBranchList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(bankBranchList.filter(x => x.id.hashCode() === state.variable.values.bankBranch.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = bankBranchList.filter(x => x.id.hashCode() === state.variable.values.bankBranch.hashCode()).toArray()[0] as BankBranchVariable
                                            return <Link to={`/bank-branch/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/bank-branch/${state.variable.values.bankBranch.hashCode()}`}>{state.variable.values.bankBranch.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{bankAccountType.keys.accountNumber}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.accountNumber} name='accountNumber' />,
                                <div className='font-bold text-xl'>{state.variable.values.accountNumber}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{bankAccountType.keys.accountName}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.accountName} name='accountName' />,
                                <div className='font-bold text-xl'>{state.variable.values.accountName}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{bankAccountType.keys.currency}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.currency.hashCode()} name='currency'>
                                    <option value='' selected disabled hidden>Select Currency</option>
                                    {currencyList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(currencyList.filter(x => x.id.hashCode() === state.variable.values.currency.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = currencyList.filter(x => x.id.hashCode() === state.variable.values.currency.hashCode()).toArray()[0] as CurrencyVariable
                                            return <Link to={`/currency/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/currency/${state.variable.values.currency.hashCode()}`}>{state.variable.values.currency.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                </Container>
                <Container area={Grid.bankTransactionArea} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title> Bank Transaction List</Title>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <button onClick={() => toggleAddBankTransactionDrawer(true)} className='text-3xl font-bold text-white bg-gray-800 rounded-md px-2 h-10 focus:outline-none'>+</button>,
                                undefined
                            )
                        }
                    </Item>
                    <Item area={Grid2.filter} justify='end' align='center' className='flex'>
                        <Button onClick={() => toggleBankTransactionFilter(true)}>Filter</Button>
                        <Drawer open={bankTransactionFilter} onClose={() => toggleBankTransactionFilter(false)} anchor={'right'}>
                            <Filter typeName='BankTransaction' query={state['bankTransactionList'].query} updateQuery={updateItemsQuery('bankTransactionList')} />
                        </Drawer>
                        <Drawer open={addBankTransactionDrawer} onClose={() => toggleAddBankTransactionDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add {bankTransactionType.name}</div>
                                <Container area={none} layout={Grid.layouts.uom} className=''>
                                    <Item>
                                        <Label>{bankTransactionType.keys.timestamp}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='number' onChange={onBankTransactionInputChange} value={state.bankTransactionList.variable.values.timestamp} name='timestamp' />,
                                                <div className='font-bold text-xl'>{state.bankTransactionList.variable.values.timestamp}</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{bankTransactionType.keys.memo}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onBankTransactionInputChange} value={state.bankTransactionList.variable.values.memo.hashCode()} name='memo'>
                                                    <option value='' selected disabled hidden>Select Memo</option>
                                                    {memoList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(memoList.filter(x => x.id.hashCode() === state.bankTransactionList.variable.values.memo.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = memoList.filter(x => x.id.hashCode() === state.bankTransactionList.variable.values.memo.hashCode()).toArray()[0] as MemoVariable
                                                            return <Link to={`/memo/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/memo/${state.bankTransactionList.variable.values.memo.hashCode()}`}>{state.bankTransactionList.variable.values.memo.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{bankTransactionType.keys.currencyRate}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onBankTransactionInputChange} value={state.bankTransactionList.variable.values.currencyRate.hashCode()} name='currencyRate'>
                                                    <option value='' selected disabled hidden>Select Currency Rate</option>
                                                    {currencyRateList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(currencyRateList.filter(x => x.id.hashCode() === state.bankTransactionList.variable.values.currencyRate.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = currencyRateList.filter(x => x.id.hashCode() === state.bankTransactionList.variable.values.currencyRate.hashCode()).toArray()[0] as CurrencyRateVariable
                                                            return <Link to={`/currency-rate/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/currency-rate/${state.bankTransactionList.variable.values.currencyRate.hashCode()}`}>{state.bankTransactionList.variable.values.currencyRate.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{bankTransactionType.keys.bankAccount}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onBankTransactionInputChange} value={state.bankTransactionList.variable.values.bankAccount.hashCode()} name='bankAccount'>
                                                    <option value='' selected disabled hidden>Select Bank Account</option>
                                                    {bankAccountList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(bankAccountList.filter(x => x.id.hashCode() === state.bankTransactionList.variable.values.bankAccount.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = bankAccountList.filter(x => x.id.hashCode() === state.bankTransactionList.variable.values.bankAccount.hashCode()).toArray()[0] as BankAccountVariable
                                                            return <Link to={`/bank-account/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/bank-account/${state.bankTransactionList.variable.values.bankAccount.hashCode()}`}>{state.bankTransactionList.variable.values.bankAccount.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{bankTransactionType.keys.fromToAccount}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onBankTransactionInputChange} value={state.bankTransactionList.variable.values.fromToAccount.hashCode()} name='fromToAccount'>
                                                    <option value='' selected disabled hidden>Select Sender / Receiver</option>
                                                    {bankAccountList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(bankAccountList.filter(x => x.id.hashCode() === state.bankTransactionList.variable.values.fromToAccount.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = bankAccountList.filter(x => x.id.hashCode() === state.bankTransactionList.variable.values.fromToAccount.hashCode()).toArray()[0] as BankAccountVariable
                                                            return <Link to={`/bank-account/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/bank-account/${state.bankTransactionList.variable.values.fromToAccount.hashCode()}`}>{state.bankTransactionList.variable.values.fromToAccount.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{bankTransactionType.keys.credit}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='number' onChange={onBankTransactionInputChange} value={state.bankTransactionList.variable.values.credit} name='credit' />,
                                                <div className='font-bold text-xl'>{state.bankTransactionList.variable.values.credit}</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{bankTransactionType.keys.debit}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='number' onChange={onBankTransactionInputChange} value={state.bankTransactionList.variable.values.debit} name='debit' />,
                                                <div className='font-bold text-xl'>{state.bankTransactionList.variable.values.debit}</div>
                                            )
                                        }
                                    </Item>
                                    <Item justify='center' align='center'>
                                        <Button onClick={() => dispatch(['bankTransactionList', 'addVariable'])}>Add</Button>
                                    </Item>
                                </Container>
                            </div>
                        </Drawer>
                    </Item>
                    <Table area={Grid2.table} state={state['bankTransactionList']} updatePage={updatePage('bankTransactionList')} variables={state.bankTransactionList.variables.filter(variable => applyFilter(state['bankTransactionList'].query, variable)).toArray()} columns={state['bankTransactionList'].columns.toArray()} />
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
