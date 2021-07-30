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
import { DiffRow, CountryRow, RegionRow, StateTypeRow } from '../../../main/rows'
import { Country, CountryVariable, Region, RegionVariable, StateType, StateTypeVariable } from '../../../main/variables'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: CountryVariable
    stateTypeList: {
        typeName: 'StateType'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<Array<string>>
        variable: StateTypeVariable
        variables: HashSet<Immutable<StateTypeVariable>>
    }
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 
    | ['variable', 'region', Region]
    | ['variable', 'name', string]

    | ['stateTypeList', 'limit', number]
    | ['stateTypeList', 'offset', number]
    | ['stateTypeList', 'page', number]
    | ['stateTypeList', 'query', Args]
    | ['stateTypeList', 'variable', 'country', Country]
    | ['stateTypeList', 'variable', 'name', string]
    | ['stateTypeList', 'addVariable']
    | ['replace', 'variable', CountryVariable]
    | ['replace', 'stateTypeList', HashSet<StateTypeVariable>]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new CountryVariable(-1, { region: new Region(-1), name: '' }),
        stateTypeList: {
            typeName: 'StateType',
            query: getQuery('StateType'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'country'], ['values', 'name']),
            variable: new StateTypeVariable(-1, { country: new Country(-1), name: '' }),
            variables: HashSet.of<StateTypeVariable>()
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
                    case 'region': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'name': {
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
            
            case 'stateTypeList': {
                switch (action[1]) {
                    case 'limit': {
                        state[action[0]].limit = Math.max(initialState.stateTypeList.limit, action[2])
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
                            case 'country': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'name': {
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
                        state.stateTypeList.variables = state.stateTypeList.variables.add(new StateTypeVariable(-1, {country: new Country(state.stateTypeList.variable.values.country.hashCode()), name: state.stateTypeList.variable.values.name}))
                        state.stateTypeList.variable = initialState.stateTypeList.variable
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
                    case 'stateTypeList': {
                        state.stateTypeList.variables = action[2]
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

    const countryType = types['Country']
    const stateTypeType = types['StateType']
    
    const [addStateTypeDrawer, toggleAddStateTypeDrawer] = useState(false)
    const [stateTypeFilter, toggleStateTypeFilter] = useState(false)
    
    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.Country.toArray()
            var composedVariables = HashSet.of<Immutable<CountryVariable>>().addAll(rows ? rows.map(x => CountryRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as CountryVariable])

                const stateTypeRows = await db.StateType.toArray()
                var composedStateTypeVariables = HashSet.of<Immutable<StateTypeVariable>>().addAll(stateTypeRows ? stateTypeRows.map(x => StateTypeRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedStateTypeVariables = composedStateTypeVariables.filter(x => !diff.variables[state.stateTypeList.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.stateTypeList.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.stateTypeList.variable.typeName].replace)
                })
                dispatch(['replace', 'stateTypeList', composedStateTypeVariables.filter(variable => variable.values.country.hashCode() === props.match.params[0]) as HashSet<StateTypeVariable>])
            }
        }
    }, [state.variable.typeName, state.stateTypeList.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

    const countryRows = useLiveQuery(() => db.Country.toArray())?.map(x => CountryRow.toVariable(x))
    var countryList = HashSet.of<Immutable<CountryVariable>>().addAll(countryRows ? countryRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        countryList = countryList.filter(x => !diff.variables.Country.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.Country.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.Country.replace)
    })

    const regionRows = useLiveQuery(() => db.Region.toArray())?.map(x => RegionRow.toVariable(x))
    var regionList = HashSet.of<Immutable<RegionVariable>>().addAll(regionRows ? regionRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        regionList = regionList.filter(x => !diff.variables.Region.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.Region.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.Region.replace)
    })

    const stateTypeRows = useLiveQuery(() => db.StateType.toArray())?.map(x => StateTypeRow.toVariable(x))
    var stateTypeList = HashSet.of<Immutable<StateTypeVariable>>().addAll(stateTypeRows ? stateTypeRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        stateTypeList = stateTypeList.filter(x => !diff.variables.StateType.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.StateType.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.StateType.replace)
    })

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'region': {
                dispatch(['variable', event.target.name, new Region(parseInt(String(event.target.value)))])
                break
            }
            case 'name': {
                dispatch(['variable', event.target.name, String(event.target.value)])
                break
            }
        }
    }
    const onStateTypeInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'country': {
                dispatch(['stateTypeList', 'variable', event.target.name, new Country(parseInt(String(event.target.value)))])
                break
            }
            case 'name': {
                dispatch(['stateTypeList', 'variable', event.target.name, String(event.target.value)])
                break
            }
        }
    }

    const updateItemsQuery = (list: 'stateTypeList') => {
        const fx = (args: Args) => {
            switch (list) {
                case 'stateTypeList': {
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

    const updatePage = (list: 'stateTypeList') => {
        const fx = (args: ['limit', number] | ['offset', number] | ['page', number]) => {
            dispatch([list, args[0], args[1]])
        }
        return fx
    }

    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createCountry, {
            region: state.variable.values.region.hashCode(),
            name: state.variable.values.name,
            stateTypeList: state.stateTypeList.variables.toArray().map(variable => {
                return {
                    country: variable.values.country.hashCode(),
                    name: variable.values.name
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteCountry, {
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
                        'create': `Create Country`,
                        'update': `Update Country`,
                        'show': `Country`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/country-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/country-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/country-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{countryType.keys.region}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.region.hashCode()} name='region'>
                                    <option value='' selected disabled hidden>Select Region</option>
                                    {regionList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(regionList.filter(x => x.id.hashCode() === state.variable.values.region.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = regionList.filter(x => x.id.hashCode() === state.variable.values.region.hashCode()).toArray()[0] as RegionVariable
                                            return <Link to={`/region/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/region/${state.variable.values.region.hashCode()}`}>{state.variable.values.region.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{countryType.keys.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.name} name='name' />,
                                <div className='font-bold text-xl'>{state.variable.values.name}</div>
                            )
                        }
                    </Item>
                </Container>
                <Container area={Grid.stateTypeArea} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title> State Type List</Title>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <button onClick={() => toggleAddStateTypeDrawer(true)} className='text-3xl font-bold text-white bg-gray-800 rounded-md px-2 h-10 focus:outline-none'>+</button>,
                                undefined
                            )
                        }
                    </Item>
                    <Item area={Grid2.filter} justify='end' align='center' className='flex'>
                        <Button onClick={() => toggleStateTypeFilter(true)}>Filter</Button>
                        <Drawer open={stateTypeFilter} onClose={() => toggleStateTypeFilter(false)} anchor={'right'}>
                            <Filter typeName='StateType' query={state['stateTypeList'].query} updateQuery={updateItemsQuery('stateTypeList')} />
                        </Drawer>
                        <Drawer open={addStateTypeDrawer} onClose={() => toggleAddStateTypeDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add {stateTypeType.name}</div>
                                <Container area={none} layout={Grid.layouts.uom} className=''>
                                    <Item>
                                        <Label>{stateTypeType.keys.country}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onStateTypeInputChange} value={state.stateTypeList.variable.values.country.hashCode()} name='country'>
                                                    <option value='' selected disabled hidden>Select Country</option>
                                                    {countryList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(countryList.filter(x => x.id.hashCode() === state.stateTypeList.variable.values.country.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = countryList.filter(x => x.id.hashCode() === state.stateTypeList.variable.values.country.hashCode()).toArray()[0] as CountryVariable
                                                            return <Link to={`/country/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/country/${state.stateTypeList.variable.values.country.hashCode()}`}>{state.stateTypeList.variable.values.country.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{stateTypeType.keys.name}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='text' onChange={onStateTypeInputChange} value={state.stateTypeList.variable.values.name} name='name' />,
                                                <div className='font-bold text-xl'>{state.stateTypeList.variable.values.name}</div>
                                            )
                                        }
                                    </Item>
                                    <Item justify='center' align='center'>
                                        <Button onClick={() => dispatch(['stateTypeList', 'addVariable'])}>Add</Button>
                                    </Item>
                                </Container>
                            </div>
                        </Drawer>
                    </Item>
                    <Table area={Grid2.table} state={state['stateTypeList']} updatePage={updatePage('stateTypeList')} variables={state.stateTypeList.variables.filter(variable => applyFilter(state['stateTypeList'].query, variable)).toArray()} columns={state['stateTypeList'].columns.toArray()} />
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
