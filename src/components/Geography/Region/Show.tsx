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
import { DiffRow, CountryRow, RegionRow } from '../../../main/rows'
import { CountryVariable, Region, RegionVariable } from '../../../main/variables'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: RegionVariable
    countryList: {
        typeName: 'Country'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<Array<string>>
        variable: CountryVariable
        variables: HashSet<Immutable<CountryVariable>>
    }
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 
    | ['variable', 'name', string]

    | ['countryList', 'limit', number]
    | ['countryList', 'offset', number]
    | ['countryList', 'page', number]
    | ['countryList', 'query', Args]
    | ['countryList', 'variable', 'region', Region]
    | ['countryList', 'variable', 'name', string]
    | ['countryList', 'addVariable']
    | ['replace', 'variable', RegionVariable]
    | ['replace', 'countryList', HashSet<CountryVariable>]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new RegionVariable(-1, { name: '' }),
        countryList: {
            typeName: 'Country',
            query: getQuery('Country'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'region'], ['values', 'name']),
            variable: new CountryVariable(-1, { region: new Region(-1), name: '' }),
            variables: HashSet.of<CountryVariable>()
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
            
            case 'countryList': {
                switch (action[1]) {
                    case 'limit': {
                        state[action[0]].limit = Math.max(initialState.countryList.limit, action[2])
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
                            case 'region': {
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
                        state.countryList.variables = state.countryList.variables.add(new CountryVariable(-1, {region: new Region(state.countryList.variable.values.region.hashCode()), name: state.countryList.variable.values.name}))
                        state.countryList.variable = initialState.countryList.variable
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
                    case 'countryList': {
                        state.countryList.variables = action[2]
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

    const regionType = types['Region']
    const countryType = types['Country']
    
    const [addCountryDrawer, toggleAddCountryDrawer] = useState(false)
    const [countryFilter, toggleCountryFilter] = useState(false)
    
    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.Region.toArray()
            var composedVariables = HashSet.of<Immutable<RegionVariable>>().addAll(rows ? rows.map(x => RegionRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as RegionVariable])

                const countryRows = await db.Country.toArray()
                var composedCountryVariables = HashSet.of<Immutable<CountryVariable>>().addAll(countryRows ? countryRows.map(x => CountryRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedCountryVariables = composedCountryVariables.filter(x => !diff.variables[state.countryList.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.countryList.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.countryList.variable.typeName].replace)
                })
                dispatch(['replace', 'countryList', composedCountryVariables.filter(variable => variable.values.region.hashCode() === props.match.params[0]) as HashSet<CountryVariable>])
            }
        }
    }, [state.variable.typeName, state.countryList.variable.typeName, props.match.params, dispatch])

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

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'name': {
                dispatch(['variable', event.target.name, String(event.target.value)])
                break
            }
        }
    }
    const onCountryInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'region': {
                dispatch(['countryList', 'variable', event.target.name, new Region(parseInt(String(event.target.value)))])
                break
            }
            case 'name': {
                dispatch(['countryList', 'variable', event.target.name, String(event.target.value)])
                break
            }
        }
    }

    const updateItemsQuery = (list: 'countryList') => {
        const fx = (args: Args) => {
            switch (list) {
                case 'countryList': {
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

    const updatePage = (list: 'countryList') => {
        const fx = (args: ['limit', number] | ['offset', number] | ['page', number]) => {
            dispatch([list, args[0], args[1]])
        }
        return fx
    }

    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createRegion, {
            name: state.variable.values.name,
            countryList: state.countryList.variables.toArray().map(variable => {
                return {
                    region: variable.values.region.hashCode(),
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteRegion, {
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
                        'create': `Create Region`,
                        'update': `Update Region`,
                        'show': `Region`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/region-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/region-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/region-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{regionType.keys.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.name} name='name' />,
                                <div className='font-bold text-xl'>{state.variable.values.name}</div>
                            )
                        }
                    </Item>
                </Container>
                <Container area={Grid.countryArea} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title> Country List</Title>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <button onClick={() => toggleAddCountryDrawer(true)} className='text-3xl font-bold text-white bg-gray-800 rounded-md px-2 h-10 focus:outline-none'>+</button>,
                                undefined
                            )
                        }
                    </Item>
                    <Item area={Grid2.filter} justify='end' align='center' className='flex'>
                        <Button onClick={() => toggleCountryFilter(true)}>Filter</Button>
                        <Drawer open={countryFilter} onClose={() => toggleCountryFilter(false)} anchor={'right'}>
                            <Filter typeName='Country' query={state['countryList'].query} updateQuery={updateItemsQuery('countryList')} />
                        </Drawer>
                        <Drawer open={addCountryDrawer} onClose={() => toggleAddCountryDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add {countryType.name}</div>
                                <Container area={none} layout={Grid.layouts.uom} className=''>
                                    <Item>
                                        <Label>{countryType.keys.region}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onCountryInputChange} value={state.countryList.variable.values.region.hashCode()} name='region'>
                                                    <option value='' selected disabled hidden>Select Region</option>
                                                    {regionList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(regionList.filter(x => x.id.hashCode() === state.countryList.variable.values.region.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = regionList.filter(x => x.id.hashCode() === state.countryList.variable.values.region.hashCode()).toArray()[0] as RegionVariable
                                                            return <Link to={`/region/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/region/${state.countryList.variable.values.region.hashCode()}`}>{state.countryList.variable.values.region.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{countryType.keys.name}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='text' onChange={onCountryInputChange} value={state.countryList.variable.values.name} name='name' />,
                                                <div className='font-bold text-xl'>{state.countryList.variable.values.name}</div>
                                            )
                                        }
                                    </Item>
                                    <Item justify='center' align='center'>
                                        <Button onClick={() => dispatch(['countryList', 'addVariable'])}>Add</Button>
                                    </Item>
                                </Container>
                            </div>
                        </Drawer>
                    </Item>
                    <Table area={Grid2.table} state={state['countryList']} updatePage={updatePage('countryList')} variables={state.countryList.variables.filter(variable => applyFilter(state['countryList'].query, variable)).toArray()} columns={state['countryList'].columns.toArray()} />
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
