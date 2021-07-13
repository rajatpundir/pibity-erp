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
import { Address, AddressVariable, Bank, BankAccountVariable, BankBranch, BankBranchVariable, BankVariable } from '../../../main/variables'
import * as Grid from './grids/Show'
import * as Grid2 from './grids/List'
import { withRouter, Link } from 'react-router-dom'
import { circuits } from '../../../main/circuits'
import { iff, when } from '../../../main/utils'
import { db } from '../../../main/dexie'
import { DiffRow, BankRow, BankBranchRow, AddressRow, BankAccountRow } from '../../../main/rows'
import { useCallback } from 'react'
import { updateVariable } from '../../../main/mutation'
import { useLiveQuery } from 'dexie-react-hooks'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: BankBranchVariable
    items: {
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

    | ['variable', 'values', 'bank', Bank]
    | ['variable', 'values', 'name', string]
    | ['variable', 'values', 'ifsc', string]
    | ['variable', 'values', 'address', Address]

    | ['items', 'limit', number]
    | ['items', 'offset', number]
    | ['items', 'page', number]
    | ['items', 'query', Args]
    | ['items', 'variable', 'values', 'accountNumber', string]
    | ['items', 'addVariable']

    | ['replace', 'variable', BankBranchVariable]
    | ['replace', 'items', HashSet<BankAccountVariable>]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new BankBranchVariable(-1, { bank: new Bank(-1), name: '', ifsc: '', address: new Address(-1) }),
        items: {
            typeName: 'BankAccount',
            query: getQuery('BankAccount'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'accountNumber']),
            variable: new BankAccountVariable(-1, { bank: new Bank(-1), bankBranch: new BankBranch(-1), accountNumber: '' }),
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
                    case 'values': {
                        switch (action[2]) {
                            case 'bank': {
                                state[action[0]][action[1]][action[2]] = action[3]
                                break
                            }
                            case 'name': {
                                state[action[0]][action[1]][action[2]] = action[3]
                                break
                            }
                            case 'ifsc': {
                                state[action[0]][action[1]][action[2]] = action[3]
                                break
                            }
                            case 'address': {
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
            case 'items': {
                switch (action[1]) {
                    case 'limit': {
                        state[action[0]].limit = Math.max(initialState.items.limit, action[2])
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
                            case 'accountNumber': {
                                state[action[0]][action[1]][action[2]][action[3]] = action[4]
                                break
                            }
                        }
                        break
                    }
                    case 'addVariable': {
                        state.items.variables = state.items.variables.add(new BankAccountVariable(-1, { bank: new Bank(state.items.variable.values.bank.hashCode()), bankBranch: new BankBranch(state.items.variable.values.bankBranch.hashCode()), accountNumber: state.items.variable.values.accountNumber }))
                        state.items.variable = initialState.items.variable
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
                    case 'items': {
                        state.items.variables = action[2]
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

    const bankBranch = types['BankBranch']
    const item = types['BankAccount']

    const [addItemDrawer, toggleAddItemDrawer] = useState(false)
    const [itemFilter, toggleItemFilter] = useState(false)

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
                const itemRows = await db.BankAccount.toArray()
                var composedItemVariables = HashSet.of<Immutable<BankAccountVariable>>().addAll(itemRows ? itemRows.map(x => BankAccountRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedItemVariables = composedItemVariables.filter(x => !diff.variables[state.items.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.items.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.items.variable.typeName].replace)
                })
                const items = composedItemVariables.filter(variable => variable.values.bankBranch.hashCode() === props.match.params[0])
                dispatch(['replace', 'items', items as HashSet<BankAccountVariable>])
            }
        }
    }, [state.variable.typeName, state.items.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

    const rows = useLiveQuery(() => db.Bank.orderBy('name').toArray())?.map(x => BankRow.toVariable(x))
    var banks = HashSet.of<Immutable<BankVariable>>().addAll(rows ? rows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        banks = banks.filter(x => !diff.variables.Bank.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.Bank.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.Bank.replace)
    })

    const addressRows = useLiveQuery(() => db.Address.toArray())?.map(x => AddressRow.toVariable(x))
    var addresses = HashSet.of<Immutable<AddressVariable>>().addAll(addressRows ? addressRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        addresses = addresses.filter(x => !diff.variables.Address.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.Address.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.Address.replace)
    })

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            default: {
                switch (event.target.name) {
                    case 'bank': {
                        dispatch(['variable', 'values', event.target.name, new Bank(parseInt(event.target.value))])
                        break
                    }
                    case 'name': {
                        dispatch(['variable', 'values', event.target.name, event.target.value])
                        break
                    }
                    case 'ifsc': {
                        dispatch(['variable', 'values', event.target.name, event.target.value])
                        break
                    }
                    case 'address': {
                        dispatch(['variable', 'values', event.target.name, new Address(parseInt(event.target.value))])
                        break
                    }
                }
            }
        }
    }

    const onItemInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            default: {
                switch (event.target.name) {
                    case 'accountNumber': {
                        dispatch(['items', 'variable', 'values', event.target.name, event.target.value])
                        break
                    }
                }
            }
        }
    }

    const updateItemsQuery = (list: 'items') => {
        const fx = (args: Args) => {
            dispatch([list, 'query', args])
        }
        return fx
    }

    const updatePage = (list: 'items') => {
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
            items: state.items.variables.toArray().map(state => {
                return { accountNumber: state.values.accountNumber }
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
                                props.history.push('/bank-branches')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/bank-branches')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/bank-branches')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{bankBranch.keys.bank.name}</Label>
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
                        <Label>{bankBranch.keys.name.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.name} name='name' />,
                                <div className='font-bold text-xl'>{state.variable.values.name}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{bankBranch.keys.ifsc.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.ifsc} name='ifsc' />,
                                <div className='font-bold text-xl'>{state.variable.values.ifsc}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{bankBranch.keys.address.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.address.hashCode()} name='address'>
                                    <option value='' selected disabled hidden>Select Address</option>
                                    {addresses.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    <Link to={`/address/${state.variable.values.address.hashCode()}`}>{state.variable.values.address.hashCode()}</Link>
                                }</div>
                            )
                        }
                    </Item>
                </Container>
                <Container area={Grid.uom} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title>{item.name}s</Title>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <button onClick={() => toggleAddItemDrawer(true)} className='text-3xl font-bold text-white bg-gray-800 rounded-md px-2 h-10 focus:outline-none'>+</button>,
                                undefined
                            )
                        }
                    </Item>
                    <Item area={Grid2.filter} justify='end' align='center' className='flex'>
                        <Button onClick={() => toggleItemFilter(true)}>Filter</Button>
                        <Drawer open={itemFilter} onClose={() => toggleItemFilter(false)} anchor={'right'}>
                            <Filter typeName='BankBranch' query={state['items'].query} updateQuery={updateItemsQuery('items')} />
                        </Drawer>
                        <Drawer open={addItemDrawer} onClose={() => toggleAddItemDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add {item.name}</div>
                                <Container area={none} layout={Grid.layouts.uom} className=''>
                                    <Item>
                                        <Label>{item.keys.accountNumber.name}</Label>
                                        <Input type='text' onChange={onItemInputChange} name='accountNumber' />
                                    </Item>
                                    <Item justify='center' align='center'>
                                        <Button onClick={() => dispatch(['items', 'addVariable'])}>Add</Button>
                                    </Item>
                                </Container>
                            </div>
                        </Drawer>
                    </Item>
                    <Table area={Grid2.table} state={state['items']} updatePage={updatePage('items')} variables={state.items.variables.filter(variable => applyFilter(state['items'].query, variable)).toArray()} columns={state['items'].columns.toArray()} />
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
