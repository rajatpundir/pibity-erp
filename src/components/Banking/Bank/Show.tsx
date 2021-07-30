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
import { DiffRow, AddressRow, BankRow, BankBranchRow, CountryRow } from '../../../main/rows'
import { Address, AddressVariable, Bank, BankVariable, BankBranch, BankBranchVariable, Country, CountryVariable } from '../../../main/variables'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: BankVariable
    bankBranchList: {
        typeName: 'BankBranch'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<Array<string>>
        variable: BankBranchVariable
        variables: HashSet<Immutable<BankBranchVariable>>
    }
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 
    | ['variable', 'country', Country]
    | ['variable', 'name', string]
    | ['variable', 'website', string]

    | ['bankBranchList', 'limit', number]
    | ['bankBranchList', 'offset', number]
    | ['bankBranchList', 'page', number]
    | ['bankBranchList', 'query', Args]
    | ['bankBranchList', 'variable', 'bank', Bank]
    | ['bankBranchList', 'variable', 'name', string]
    | ['bankBranchList', 'variable', 'ifsc', string]
    | ['bankBranchList', 'variable', 'address', Address]
    | ['bankBranchList', 'addVariable']
    | ['replace', 'variable', BankVariable]
    | ['replace', 'bankBranchList', HashSet<BankBranchVariable>]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new BankVariable(-1, { country: new Country(-1), name: '', website: '' }),
        bankBranchList: {
            typeName: 'BankBranch',
            query: getQuery('BankBranch'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'bank'], ['values', 'name'], ['values', 'ifsc'], ['values', 'address']),
            variable: new BankBranchVariable(-1, { bank: new Bank(-1), name: '', ifsc: '', address: new Address(-1) }),
            variables: HashSet.of<BankBranchVariable>()
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
                    case 'country': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'name': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'website': {
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
            
            case 'bankBranchList': {
                switch (action[1]) {
                    case 'limit': {
                        state[action[0]].limit = Math.max(initialState.bankBranchList.limit, action[2])
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
                            case 'name': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'ifsc': {
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
                        state.bankBranchList.variables = state.bankBranchList.variables.add(new BankBranchVariable(-1, {bank: new Bank(state.bankBranchList.variable.values.bank.hashCode()), name: state.bankBranchList.variable.values.name, ifsc: state.bankBranchList.variable.values.ifsc, address: new Address(state.bankBranchList.variable.values.address.hashCode())}))
                        state.bankBranchList.variable = initialState.bankBranchList.variable
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
                    case 'bankBranchList': {
                        state.bankBranchList.variables = action[2]
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

    const bankType = types['Bank']
    const bankBranchType = types['BankBranch']
    
    const [addBankBranchDrawer, toggleAddBankBranchDrawer] = useState(false)
    const [bankBranchFilter, toggleBankBranchFilter] = useState(false)
    
    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.Bank.toArray()
            var composedVariables = HashSet.of<Immutable<BankVariable>>().addAll(rows ? rows.map(x => BankRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as BankVariable])

                const bankBranchRows = await db.BankBranch.toArray()
                var composedBankBranchVariables = HashSet.of<Immutable<BankBranchVariable>>().addAll(bankBranchRows ? bankBranchRows.map(x => BankBranchRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedBankBranchVariables = composedBankBranchVariables.filter(x => !diff.variables[state.bankBranchList.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.bankBranchList.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.bankBranchList.variable.typeName].replace)
                })
                dispatch(['replace', 'bankBranchList', composedBankBranchVariables.filter(variable => variable.values.bank.hashCode() === props.match.params[0]) as HashSet<BankBranchVariable>])
            }
        }
    }, [state.variable.typeName, state.bankBranchList.variable.typeName, props.match.params, dispatch])

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

    const bankBranchRows = useLiveQuery(() => db.BankBranch.toArray())?.map(x => BankBranchRow.toVariable(x))
    var bankBranchList = HashSet.of<Immutable<BankBranchVariable>>().addAll(bankBranchRows ? bankBranchRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        bankBranchList = bankBranchList.filter(x => !diff.variables.BankBranch.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.BankBranch.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.BankBranch.replace)
    })

    const countryRows = useLiveQuery(() => db.Country.toArray())?.map(x => CountryRow.toVariable(x))
    var countryList = HashSet.of<Immutable<CountryVariable>>().addAll(countryRows ? countryRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        countryList = countryList.filter(x => !diff.variables.Country.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.Country.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.Country.replace)
    })

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'country': {
                dispatch(['variable', event.target.name, new Country(parseInt(String(event.target.value)))])
                break
            }
            case 'name': {
                dispatch(['variable', event.target.name, String(event.target.value)])
                break
            }
            case 'website': {
                dispatch(['variable', event.target.name, String(event.target.value)])
                break
            }
        }
    }
    const onBankBranchInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'bank': {
                dispatch(['bankBranchList', 'variable', event.target.name, new Bank(parseInt(String(event.target.value)))])
                break
            }
            case 'name': {
                dispatch(['bankBranchList', 'variable', event.target.name, String(event.target.value)])
                break
            }
            case 'ifsc': {
                dispatch(['bankBranchList', 'variable', event.target.name, String(event.target.value)])
                break
            }
            case 'address': {
                dispatch(['bankBranchList', 'variable', event.target.name, new Address(parseInt(String(event.target.value)))])
                break
            }
        }
    }

    const updateItemsQuery = (list: 'bankBranchList') => {
        const fx = (args: Args) => {
            switch (list) {
                case 'bankBranchList': {
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

    const updatePage = (list: 'bankBranchList') => {
        const fx = (args: ['limit', number] | ['offset', number] | ['page', number]) => {
            dispatch([list, args[0], args[1]])
        }
        return fx
    }

    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createBank, {
            country: state.variable.values.country.hashCode(),
            name: state.variable.values.name,
            website: state.variable.values.website,
            bankBranchList: state.bankBranchList.variables.toArray().map(variable => {
                return {
                    bank: variable.values.bank.hashCode(),
                    name: variable.values.name,
                    ifsc: variable.values.ifsc,
                    address: variable.values.address.hashCode()
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteBank, {
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
                        'create': `Create Bank`,
                        'update': `Update Bank`,
                        'show': `Bank`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/bank-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/bank-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/bank-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{bankType.keys.country}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.country.hashCode()} name='country'>
                                    <option value='' selected disabled hidden>Select Country</option>
                                    {countryList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(countryList.filter(x => x.id.hashCode() === state.variable.values.country.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = countryList.filter(x => x.id.hashCode() === state.variable.values.country.hashCode()).toArray()[0] as CountryVariable
                                            return <Link to={`/country/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/country/${state.variable.values.country.hashCode()}`}>{state.variable.values.country.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{bankType.keys.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.name} name='name' />,
                                <div className='font-bold text-xl'>{state.variable.values.name}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{bankType.keys.website}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.website} name='website' />,
                                <div className='font-bold text-xl'>{state.variable.values.website}</div>
                            )
                        }
                    </Item>
                </Container>
                <Container area={Grid.bankBranchArea} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title> Bank Branch List</Title>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <button onClick={() => toggleAddBankBranchDrawer(true)} className='text-3xl font-bold text-white bg-gray-800 rounded-md px-2 h-10 focus:outline-none'>+</button>,
                                undefined
                            )
                        }
                    </Item>
                    <Item area={Grid2.filter} justify='end' align='center' className='flex'>
                        <Button onClick={() => toggleBankBranchFilter(true)}>Filter</Button>
                        <Drawer open={bankBranchFilter} onClose={() => toggleBankBranchFilter(false)} anchor={'right'}>
                            <Filter typeName='BankBranch' query={state['bankBranchList'].query} updateQuery={updateItemsQuery('bankBranchList')} />
                        </Drawer>
                        <Drawer open={addBankBranchDrawer} onClose={() => toggleAddBankBranchDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add {bankBranchType.name}</div>
                                <Container area={none} layout={Grid.layouts.uom} className=''>
                                    <Item>
                                        <Label>{bankBranchType.keys.bank}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onBankBranchInputChange} value={state.bankBranchList.variable.values.bank.hashCode()} name='bank'>
                                                    <option value='' selected disabled hidden>Select Bank</option>
                                                    {bankList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(bankList.filter(x => x.id.hashCode() === state.bankBranchList.variable.values.bank.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = bankList.filter(x => x.id.hashCode() === state.bankBranchList.variable.values.bank.hashCode()).toArray()[0] as BankVariable
                                                            return <Link to={`/bank/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/bank/${state.bankBranchList.variable.values.bank.hashCode()}`}>{state.bankBranchList.variable.values.bank.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{bankBranchType.keys.name}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='text' onChange={onBankBranchInputChange} value={state.bankBranchList.variable.values.name} name='name' />,
                                                <div className='font-bold text-xl'>{state.bankBranchList.variable.values.name}</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{bankBranchType.keys.ifsc}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='text' onChange={onBankBranchInputChange} value={state.bankBranchList.variable.values.ifsc} name='ifsc' />,
                                                <div className='font-bold text-xl'>{state.bankBranchList.variable.values.ifsc}</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{bankBranchType.keys.address}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onBankBranchInputChange} value={state.bankBranchList.variable.values.address.hashCode()} name='address'>
                                                    <option value='' selected disabled hidden>Select Address</option>
                                                    {addressList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(addressList.filter(x => x.id.hashCode() === state.bankBranchList.variable.values.address.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = addressList.filter(x => x.id.hashCode() === state.bankBranchList.variable.values.address.hashCode()).toArray()[0] as AddressVariable
                                                            return <Link to={`/address/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/address/${state.bankBranchList.variable.values.address.hashCode()}`}>{state.bankBranchList.variable.values.address.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item justify='center' align='center'>
                                        <Button onClick={() => dispatch(['bankBranchList', 'addVariable'])}>Add</Button>
                                    </Item>
                                </Container>
                            </div>
                        </Drawer>
                    </Item>
                    <Table area={Grid2.table} state={state['bankBranchList']} updatePage={updatePage('bankBranchList')} variables={state.bankBranchList.variables.filter(variable => applyFilter(state['bankBranchList'].query, variable)).toArray()} columns={state['bankBranchList'].columns.toArray()} />
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
