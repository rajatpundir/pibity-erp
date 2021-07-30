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
import { DiffRow, BankAccountRow, CompanyRow, CompanyBankAccountRow } from '../../../main/rows'
import { BankAccount, BankAccountVariable, Company, CompanyVariable, CompanyBankAccount, CompanyBankAccountVariable } from '../../../main/variables'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: CompanyBankAccountVariable
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 
    | ['variable', 'company', Company]
    | ['variable', 'bankAccount', BankAccount]

    | ['replace', 'variable', CompanyBankAccountVariable]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new CompanyBankAccountVariable(-1, { company: new Company(-1), bankAccount: new BankAccount(-1) })
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
                    case 'company': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'bankAccount': {
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

    const companyBankAccountType = types['CompanyBankAccount']
    
    
    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.CompanyBankAccount.toArray()
            var composedVariables = HashSet.of<Immutable<CompanyBankAccountVariable>>().addAll(rows ? rows.map(x => CompanyBankAccountRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as CompanyBankAccountVariable])
            }
        }
    }, [state.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

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

    const companyBankAccountRows = useLiveQuery(() => db.CompanyBankAccount.toArray())?.map(x => CompanyBankAccountRow.toVariable(x))
    var companyBankAccountList = HashSet.of<Immutable<CompanyBankAccountVariable>>().addAll(companyBankAccountRows ? companyBankAccountRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        companyBankAccountList = companyBankAccountList.filter(x => !diff.variables.CompanyBankAccount.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.CompanyBankAccount.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.CompanyBankAccount.replace)
    })

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'company': {
                dispatch(['variable', event.target.name, new Company(parseInt(String(event.target.value)))])
                break
            }
            case 'bankAccount': {
                dispatch(['variable', event.target.name, new BankAccount(parseInt(String(event.target.value)))])
                break
            }
        }
    }



    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createCompanyBankAccount, {
            company: state.variable.values.company.hashCode(),
            bankAccount: state.variable.values.bankAccount.hashCode()
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteCompanyBankAccount, {
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
                        'create': `Create Company Bank Account`,
                        'update': `Update Company Bank Account`,
                        'show': `Company Bank Account`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/company-bank-account-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/company-bank-account-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/company-bank-account-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{companyBankAccountType.keys.company}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.company.hashCode()} name='company'>
                                    <option value='' selected disabled hidden>Select Company</option>
                                    {companyList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(companyList.filter(x => x.id.hashCode() === state.variable.values.company.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = companyList.filter(x => x.id.hashCode() === state.variable.values.company.hashCode()).toArray()[0] as CompanyVariable
                                            return <Link to={`/company/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/company/${state.variable.values.company.hashCode()}`}>{state.variable.values.company.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{companyBankAccountType.keys.bankAccount}</Label>
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
