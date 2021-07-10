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
import { Address, AddressVariable, Bank, BankBranchVariable, BankVariable, Country, CountryVariable } from '../../../main/variables'
import * as Grid from './grids/Show'
import * as Grid2 from './grids/List'
import { withRouter, Link } from 'react-router-dom'
import { circuits } from '../../../main/circuits'
import { iff, when } from '../../../main/utils'
import { db } from '../../../main/dexie'
import { DiffRow, CountryRow, BankRow, BankBranchRow, AddressRow } from '../../../main/rows'
import { useCallback } from 'react'
import { updateVariable } from '../../../main/mutation'
import { useLiveQuery } from 'dexie-react-hooks'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: BankVariable
    updatedVariableName: Bank
    items: {
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

    | ['variable', 'values', 'country', Country]
    | ['variable', 'values', 'name', string]
    | ['variable', 'values', 'website', string]

    | ['items', 'limit', number]
    | ['items', 'offset', number]
    | ['items', 'page', number]
    | ['items', 'query', Args]
    | ['items', 'variable', 'values', 'bank', Bank]
    | ['items', 'variable', 'values', 'name', string]
    | ['items', 'variable', 'values', 'ifsc', string]
    | ['items', 'variable', 'values', 'address', Address]
    | ['items', 'addVariable']

    | ['replace', 'variable', BankVariable]
    | ['replace', 'items', HashSet<BankBranchVariable>]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new BankVariable('', { country: new Country(''), name: '', website: '' }),
        updatedVariableName: new Bank(''),
        items: {
            typeName: 'BankBranch',
            query: getQuery('BankBranch'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['variableName'], ['values', 'name'], ['values', 'ifsc']),
            variable: new BankBranchVariable('', { bank: new Bank(''), name: '', ifsc: '', address: new Address('') }),
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
                    case 'values': {
                        switch (action[2]) {
                            case 'country': {
                                state[action[0]][action[1]][action[2]] = action[3]
                                break
                            }
                            case 'name': {
                                state[action[0]][action[1]][action[2]] = action[3]
                                break
                            }
                            case 'website': {
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
                            case 'bank': {
                                state[action[0]][action[1]][action[2]][action[3]] = action[4]
                                break
                            }
                            case 'name': {
                                state[action[0]][action[1]][action[2]][action[3]] = action[4]
                                break
                            }
                            case 'ifsc': {
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
                        state.items.variables = state.items.variables.add(new BankBranchVariable('', { bank: new Bank(''), name: state.items.variable.values.name, ifsc: state.items.variable.values.ifsc, address: new Address(state.items.variable.values.address.toString()) }))
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
                        state.updatedVariableName = action[2].id
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

    const bank = types['Bank']
    const item = types['BankBranch']

    const [addItemDrawer, toggleAddItemDrawer] = useState(false)
    const [itemFilter, toggleItemFilter] = useState(false)

    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.Bank.toArray()
            var composedVariables = HashSet.of<Immutable<BankVariable>>().addAll(rows ? rows.map(x => BankRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.toString() === y.toString())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.toString() === x.id.toString())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.toString() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as BankVariable])
                const itemRows = await db.BankBranch.toArray()
                var composedItemVariables = HashSet.of<Immutable<BankBranchVariable>>().addAll(itemRows ? itemRows.map(x => BankBranchRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedItemVariables = composedItemVariables.filter(x => !diff.variables[state.items.variable.typeName].remove.anyMatch(y => x.id.toString() === y.toString())).filter(x => !diff.variables[state.items.variable.typeName].replace.anyMatch(y => y.id.toString() === x.id.toString())).addAll(diff.variables[state.items.variable.typeName].replace)
                })
                const items = composedItemVariables.filter(variable => variable.values.bank.toString() === props.match.params[0])
                dispatch(['replace', 'items', items as HashSet<BankBranchVariable>])
            }
        }
    }, [state.variable.typeName, state.items.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

    const rows = useLiveQuery(() => db.Country.orderBy('name').toArray())?.map(x => CountryRow.toVariable(x))
    var countries = HashSet.of<Immutable<CountryVariable>>().addAll(rows ? rows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        countries = countries.filter(x => !diff.variables.Country.remove.anyMatch(y => x.id.toString() === y.toString())).filter(x => !diff.variables.Country.replace.anyMatch(y => y.id.toString() === x.id.toString())).addAll(diff.variables.Country.replace)
    })

    const addressRows = useLiveQuery(() => db.Address.toArray())?.map(x => AddressRow.toVariable(x))
    var addresses = HashSet.of<Immutable<AddressVariable>>().addAll(addressRows ? addressRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        addresses = addresses.filter(x => !diff.variables.Address.remove.anyMatch(y => x.id.toString() === y.toString())).filter(x => !diff.variables.Address.replace.anyMatch(y => y.id.toString() === x.id.toString())).addAll(diff.variables.Address.replace)
    })

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            default: {
                switch (event.target.name) {
                    case 'country': {
                        dispatch(['variable', 'values', event.target.name, new Country(event.target.value)])
                        break
                    }
                    case 'name': {
                        dispatch(['variable', 'values', event.target.name, event.target.value])
                        break
                    }
                    case 'website': {
                        dispatch(['variable', 'values', event.target.name, event.target.value])
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
                    case 'bank': {
                        dispatch(['items', 'variable', 'values', event.target.name, new Bank(event.target.value)])
                        break
                    }
                    case 'name': {
                        dispatch(['items', 'variable', 'values', event.target.name, event.target.value])
                        break
                    }
                    case 'ifsc': {
                        dispatch(['items', 'variable', 'values', event.target.name, event.target.value])
                        break
                    }
                    case 'address': {
                        dispatch(['items', 'variable', 'values', event.target.name, new Address(event.target.value)])
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createBank, {
            country: state.variable.values.country.toString(),
            name: state.variable.values.name,
            website: state.variable.values.website,
            items: state.items.variables.toArray().map(state => {
                return {
                    bank: state.values.bank.toString(),
                    name: state.values.name,
                    ifsc: state.values.ifsc,
                    address: state.values.address.toString(),
                }
            })
        })
        console.log(result, symbolFlag, diff)
        if (symbolFlag) {
            db.diffs.put(diff.toRow())
        }
    }

    const modifyVariable = async () => {
        const [, diff] = await iff(state.variable.id.toString() !== state.updatedVariableName.toString(),
            updateVariable(state.variable, state.variable.toRow().values, state.updatedVariableName.toString()),
            updateVariable(state.variable, state.variable.toRow().values)
        )
        console.log(diff)
        db.diffs.put(diff.toRow())
    }

    const deleteVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteBank, {
            variableName: state.variable.id.toString(),
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
                                props.history.push('/banks')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/banks')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/banks')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{bank.keys.country.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.country.toString()} name='country'>
                                    <option value='' selected disabled hidden>Select Country</option>
                                    {countries.toArray().map(x => <option value={x.id.toString()}>{x.values.name}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(countries.filter(x => x.id.toString() === state.variable.values.country.toString()).length() !== 0,
                                        () => {
                                            const referencedVariable = countries.filter(x => x.id.toString() === state.variable.values.country.toString()).toArray()[0] as CountryVariable
                                            return <Link to={`/country/${referencedVariable.id.toString()}`}>{referencedVariable.values.name}</Link>
                                        }, <Link to={`/country/${state.variable.values.country.toString()}`}>{state.variable.values.country.toString()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{bank.keys.name.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.name} name='name' />,
                                <div className='font-bold text-xl'>{state.variable.values.name}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{bank.keys.website.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.website} name='website' />,
                                <div className='font-bold text-xl'>{state.variable.values.website}</div>
                            )
                        }
                    </Item>
                </Container>
                <Container area={Grid.uom} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title>{item.name}es</Title>
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
                                        <Label>{item.keys.name.name}</Label>
                                        <Input type='text' onChange={onItemInputChange} name='name' />
                                    </Item>
                                    <Item>
                                        <Label>{item.keys.ifsc.name}</Label>
                                        <Input type='text' onChange={onItemInputChange} name='ifsc' />
                                    </Item>
                                    <Item>
                                        <Label>{item.keys.address.name}</Label>
                                        <Select onChange={onItemInputChange} value={state.items.variable.values.address.toString()} name='address'>
                                            <option value='' selected disabled hidden>Select Address</option>
                                            {addresses.toArray().map(x => <option value={x.id.toString()}>{x.id.toString()}</option>)}
                                        </Select>
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
