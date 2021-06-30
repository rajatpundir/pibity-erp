import React, { useEffect } from 'react'
import { Immutable, Draft } from 'immer'
import { useImmerReducer } from 'use-immer'
import tw from 'twin.macro'
import { HashSet } from 'prelude-ts'
import { executeCircuit } from '../../../main/circuit'
import { types } from '../../../main/types'
import { Container, Item, none } from '../../../main/commons'
import { Bank, BankAccount, BankAccountVariable, BankBranch, BankBranchVariable, BankVariable } from '../../../main/variables'
import * as Grid from './grids/Show'
import { withRouter, Link } from 'react-router-dom'
import { circuits } from '../../../main/circuits'
import { iff, when } from '../../../main/utils'
import { db } from '../../../main/dexie'
import { DiffRow, BankRow, BankBranchRow, BankAccountRow } from '../../../main/rows'
import { useCallback } from 'react'
import { updateVariable } from '../../../main/mutation'
import { useLiveQuery } from 'dexie-react-hooks'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: BankAccountVariable
    updatedVariableName: BankAccount
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]

    | ['variable', 'values', 'bank', Bank]
    | ['variable', 'values', 'bankBranch', BankBranch]
    | ['variable', 'values', 'accountNumber', string]

    | ['replace', 'variable', BankAccountVariable]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new BankAccountVariable('', { bank: new Bank(''), bankBranch: new BankBranch(''), accountNumber: '' }),
        updatedVariableName: new BankAccount('')
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
            case 'replace': {
                switch (action[1]) {
                    case 'variable': {
                        state.variable = action[2]
                        state.updatedVariableName = action[2].variableName
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

    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.bankAccounts.toArray()
            var composedVariables = HashSet.of<Immutable<BankAccountVariable>>().addAll(rows ? rows.map(x => BankAccountRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.variableName.toString() === x.variableName.toString())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.variableName.toString() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as BankAccountVariable])
            }
        }
    }, [state.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

    const rows = useLiveQuery(() => db.banks.orderBy('name').toArray())?.map(x => BankRow.toVariable(x))
    var banks = HashSet.of<Immutable<BankVariable>>().addAll(rows ? rows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        banks = banks.filter(x => !diff.variables.Bank.remove.anyMatch(y => x.variableName.toString() === y.toString())).filter(x => !diff.variables.Bank.replace.anyMatch(y => y.variableName.toString() === x.variableName.toString())).addAll(diff.variables.Bank.replace)
    })

    const bankBranchRows = useLiveQuery(() => db.bankBranches.where({ bank: state.variable.values.bank.toString() }).toArray())?.map(x => BankBranchRow.toVariable(x))
    var bankBranches = HashSet.of<Immutable<BankBranchVariable>>().addAll(bankBranchRows ? bankBranchRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        bankBranches = bankBranches.filter(x => !diff.variables.BankBranch.remove.anyMatch(y => x.variableName.toString() === y.toString())).filter(x => !diff.variables.BankBranch.replace.anyMatch(y => y.variableName.toString() === x.variableName.toString())).addAll(diff.variables.BankBranch.replace)
        bankBranches = bankBranches.filter(x => x.values.bank.toString() === state.variable.values.bank.toString())
    })

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            default: {
                switch (event.target.name) {
                    case 'bank': {
                        dispatch(['variable', 'values', event.target.name, new Bank(event.target.value)])
                        break
                    }
                    case 'bankBranch': {
                        dispatch(['variable', 'values', event.target.name, new BankBranch(event.target.value)])
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

    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createBankAccount, {
            bank: state.variable.values.bank.toString(),
            bankBranch: state.variable.values.bankBranch.toString(),
            accountNumber: state.variable.values.accountNumber
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteBankAccount, {
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
                                <Select onChange={onVariableInputChange} value={state.variable.values.bank.toString()} name='bank'>
                                    <option value='' selected disabled hidden>Select Bank</option>
                                    {banks.toArray().map(x => <option value={x.variableName.toString()}>{x.values.name}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(banks.filter(x => x.variableName.toString() === state.variable.values.bank.toString()).length() !== 0,
                                        () => {
                                            const referencedVariable = banks.filter(x => x.variableName.toString() === state.variable.values.bank.toString()).toArray()[0] as BankVariable
                                            return <Link to={`/bank/${referencedVariable.variableName.toString()}`}>{referencedVariable.values.name}</Link>
                                        }, <Link to={`/bank/${state.variable.values.bank.toString()}`}>{state.variable.values.bank.toString()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{bankAccount.keys.bankBranch.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.bankBranch.toString()} name='bankBranch'>
                                    <option value='' selected disabled hidden>Select Bank Branch</option>
                                    {bankBranches.toArray().map(x => <option value={x.variableName.toString()}>{x.values.name}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(bankBranches.filter(x => x.variableName.toString() === state.variable.values.bankBranch.toString()).length() !== 0,
                                        () => {
                                            const referencedVariable = bankBranches.filter(x => x.variableName.toString() === state.variable.values.bankBranch.toString()).toArray()[0] as BankBranchVariable
                                            return <Link to={`/bank-branch/${referencedVariable.variableName.toString()}`}>{referencedVariable.values.name}</Link>
                                        }, <Link to={`/bank-branch/${state.variable.values.bankBranch.toString()}`}>{state.variable.values.bankBranch.toString()}</Link>)
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
