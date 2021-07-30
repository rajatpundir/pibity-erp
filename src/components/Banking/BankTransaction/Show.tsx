import React, { useEffect } from 'react'
import { Immutable, Draft } from 'immer'
import { useImmerReducer } from 'use-immer'
import tw from 'twin.macro'
import { HashSet } from 'prelude-ts'
import { executeCircuit } from '../../../main/circuit'
import { types } from '../../../main/types'
import { Container, Item, none } from '../../../main/commons'
import * as Grid from './grids/Show'
import { withRouter, Link } from 'react-router-dom'
import { circuits } from '../../../main/circuits'
import { iff, when } from '../../../main/utils'
import { db } from '../../../main/dexie'
import { useCallback } from 'react'
import { updateVariable } from '../../../main/mutation'
import { useLiveQuery } from 'dexie-react-hooks'
import { DiffRow, BankAccountRow, BankTransactionRow, CurrencyRateRow, MemoRow } from '../../../main/rows'
import { BankAccount, BankAccountVariable, BankTransactionVariable, CurrencyRate, CurrencyRateVariable, Memo, MemoVariable } from '../../../main/variables'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: BankTransactionVariable
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 
    | ['variable', 'timestamp', number]
    | ['variable', 'memo', Memo]
    | ['variable', 'currencyRate', CurrencyRate]
    | ['variable', 'bankAccount', BankAccount]
    | ['variable', 'fromToAccount', BankAccount]
    | ['variable', 'credit', number]
    | ['variable', 'debit', number]

    | ['replace', 'variable', BankTransactionVariable]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new BankTransactionVariable(-1, { timestamp: 0, memo: new Memo(-1), currencyRate: new CurrencyRate(-1), bankAccount: new BankAccount(-1), fromToAccount: new BankAccount(-1), credit: 0, debit: 0 })
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
                    case 'timestamp': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'memo': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'currencyRate': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'bankAccount': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'fromToAccount': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'credit': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'debit': {
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
            
            case 'replace': {
                switch (action[1]) {
                    case 'variable': {
                        state.variable = action[2]
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

    const bankTransactionType = types['BankTransaction']
    
    
    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.BankTransaction.toArray()
            var composedVariables = HashSet.of<Immutable<BankTransactionVariable>>().addAll(rows ? rows.map(x => BankTransactionRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as BankTransactionVariable])
            }
        }
    }, [state.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

    const bankAccountRows = useLiveQuery(() => db.BankAccount.toArray())?.map(x => BankAccountRow.toVariable(x))
    var bankAccountList = HashSet.of<Immutable<BankAccountVariable>>().addAll(bankAccountRows ? bankAccountRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        bankAccountList = bankAccountList.filter(x => !diff.variables.BankAccount.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.BankAccount.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.BankAccount.replace)
    })

    const bankTransactionRows = useLiveQuery(() => db.BankTransaction.toArray())?.map(x => BankTransactionRow.toVariable(x))
    var bankTransactionList = HashSet.of<Immutable<BankTransactionVariable>>().addAll(bankTransactionRows ? bankTransactionRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        bankTransactionList = bankTransactionList.filter(x => !diff.variables.BankTransaction.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.BankTransaction.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.BankTransaction.replace)
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
            case 'timestamp': {
                dispatch(['variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
            case 'memo': {
                dispatch(['variable', event.target.name, new Memo(parseInt(String(event.target.value)))])
                break
            }
            case 'currencyRate': {
                dispatch(['variable', event.target.name, new CurrencyRate(parseInt(String(event.target.value)))])
                break
            }
            case 'bankAccount': {
                dispatch(['variable', event.target.name, new BankAccount(parseInt(String(event.target.value)))])
                break
            }
            case 'fromToAccount': {
                dispatch(['variable', event.target.name, new BankAccount(parseInt(String(event.target.value)))])
                break
            }
            case 'credit': {
                dispatch(['variable', event.target.name, parseFloat(String(event.target.value))])
                break
            }
            case 'debit': {
                dispatch(['variable', event.target.name, parseFloat(String(event.target.value))])
                break
            }
        }
    }



    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createBankTransaction, {
            timestamp: state.variable.values.timestamp,
            memo: state.variable.values.memo.hashCode(),
            currencyRate: state.variable.values.currencyRate.hashCode(),
            bankAccount: state.variable.values.bankAccount.hashCode(),
            fromToAccount: state.variable.values.fromToAccount.hashCode(),
            credit: state.variable.values.credit,
            debit: state.variable.values.debit
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteBankTransaction, {
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
                        'create': `Create Bank Transaction`,
                        'update': `Update Bank Transaction`,
                        'show': `Bank Transaction`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/bank-transaction-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/bank-transaction-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/bank-transaction-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{bankTransactionType.keys.timestamp}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='number' onChange={onVariableInputChange} value={state.variable.values.timestamp} name='timestamp' />,
                                <div className='font-bold text-xl'>{state.variable.values.timestamp}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{bankTransactionType.keys.memo}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.memo.hashCode()} name='memo'>
                                    <option value='' selected disabled hidden>Select Memo</option>
                                    {memoList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(memoList.filter(x => x.id.hashCode() === state.variable.values.memo.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = memoList.filter(x => x.id.hashCode() === state.variable.values.memo.hashCode()).toArray()[0] as MemoVariable
                                            return <Link to={`/memo/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/memo/${state.variable.values.memo.hashCode()}`}>{state.variable.values.memo.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{bankTransactionType.keys.currencyRate}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.currencyRate.hashCode()} name='currencyRate'>
                                    <option value='' selected disabled hidden>Select Currency Rate</option>
                                    {currencyRateList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(currencyRateList.filter(x => x.id.hashCode() === state.variable.values.currencyRate.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = currencyRateList.filter(x => x.id.hashCode() === state.variable.values.currencyRate.hashCode()).toArray()[0] as CurrencyRateVariable
                                            return <Link to={`/currency-rate/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/currency-rate/${state.variable.values.currencyRate.hashCode()}`}>{state.variable.values.currencyRate.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{bankTransactionType.keys.bankAccount}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.bankAccount.hashCode()} name='bankAccount'>
                                    <option value='' selected disabled hidden>Select Bank Account</option>
                                    {bankAccountList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(bankAccountList.filter(x => x.id.hashCode() === state.variable.values.bankAccount.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = bankAccountList.filter(x => x.id.hashCode() === state.variable.values.bankAccount.hashCode()).toArray()[0] as BankAccountVariable
                                            return <Link to={`/bank-account/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/bank-account/${state.variable.values.bankAccount.hashCode()}`}>{state.variable.values.bankAccount.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{bankTransactionType.keys.fromToAccount}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.fromToAccount.hashCode()} name='fromToAccount'>
                                    <option value='' selected disabled hidden>Select Sender / Receiver</option>
                                    {bankAccountList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(bankAccountList.filter(x => x.id.hashCode() === state.variable.values.fromToAccount.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = bankAccountList.filter(x => x.id.hashCode() === state.variable.values.fromToAccount.hashCode()).toArray()[0] as BankAccountVariable
                                            return <Link to={`/bank-account/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/bank-account/${state.variable.values.fromToAccount.hashCode()}`}>{state.variable.values.fromToAccount.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{bankTransactionType.keys.credit}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='number' onChange={onVariableInputChange} value={state.variable.values.credit} name='credit' />,
                                <div className='font-bold text-xl'>{state.variable.values.credit}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{bankTransactionType.keys.debit}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='number' onChange={onVariableInputChange} value={state.variable.values.debit} name='debit' />,
                                <div className='font-bold text-xl'>{state.variable.values.debit}</div>
                            )
                        }
                    </Item>
                </Container>

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
