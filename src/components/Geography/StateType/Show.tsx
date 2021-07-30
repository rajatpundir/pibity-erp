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
import { DiffRow, CountryRow, DistrictRow, StateTypeRow } from '../../../main/rows'
import { Country, CountryVariable, DistrictVariable, StateType, StateTypeVariable } from '../../../main/variables'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: StateTypeVariable
    districtList: {
        typeName: 'District'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<Array<string>>
        variable: DistrictVariable
        variables: HashSet<Immutable<DistrictVariable>>
    }
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 
    | ['variable', 'country', Country]
    | ['variable', 'name', string]

    | ['districtList', 'limit', number]
    | ['districtList', 'offset', number]
    | ['districtList', 'page', number]
    | ['districtList', 'query', Args]
    | ['districtList', 'variable', 'state', StateType]
    | ['districtList', 'variable', 'name', string]
    | ['districtList', 'addVariable']
    | ['replace', 'variable', StateTypeVariable]
    | ['replace', 'districtList', HashSet<DistrictVariable>]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new StateTypeVariable(-1, { country: new Country(-1), name: '' }),
        districtList: {
            typeName: 'District',
            query: getQuery('District'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'state'], ['values', 'name']),
            variable: new DistrictVariable(-1, { state: new StateType(-1), name: '' }),
            variables: HashSet.of<DistrictVariable>()
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
                    default: {
                        const _exhaustiveCheck: never = action;
                        return _exhaustiveCheck;
                    }
                }
                break
            }
            
            case 'districtList': {
                switch (action[1]) {
                    case 'limit': {
                        state[action[0]].limit = Math.max(initialState.districtList.limit, action[2])
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
                            case 'state': {
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
                        state.districtList.variables = state.districtList.variables.add(new DistrictVariable(-1, {state: new StateType(state.districtList.variable.values.state.hashCode()), name: state.districtList.variable.values.name}))
                        state.districtList.variable = initialState.districtList.variable
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
                    case 'districtList': {
                        state.districtList.variables = action[2]
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

    const stateTypeType = types['StateType']
    const districtType = types['District']
    
    const [addDistrictDrawer, toggleAddDistrictDrawer] = useState(false)
    const [districtFilter, toggleDistrictFilter] = useState(false)
    
    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.StateType.toArray()
            var composedVariables = HashSet.of<Immutable<StateTypeVariable>>().addAll(rows ? rows.map(x => StateTypeRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as StateTypeVariable])

                const districtRows = await db.District.toArray()
                var composedDistrictVariables = HashSet.of<Immutable<DistrictVariable>>().addAll(districtRows ? districtRows.map(x => DistrictRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedDistrictVariables = composedDistrictVariables.filter(x => !diff.variables[state.districtList.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.districtList.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.districtList.variable.typeName].replace)
                })
                dispatch(['replace', 'districtList', composedDistrictVariables.filter(variable => variable.values.state.hashCode() === props.match.params[0]) as HashSet<DistrictVariable>])
            }
        }
    }, [state.variable.typeName, state.districtList.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

    const countryRows = useLiveQuery(() => db.Country.toArray())?.map(x => CountryRow.toVariable(x))
    var countryList = HashSet.of<Immutable<CountryVariable>>().addAll(countryRows ? countryRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        countryList = countryList.filter(x => !diff.variables.Country.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.Country.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.Country.replace)
    })

    const districtRows = useLiveQuery(() => db.District.toArray())?.map(x => DistrictRow.toVariable(x))
    var districtList = HashSet.of<Immutable<DistrictVariable>>().addAll(districtRows ? districtRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        districtList = districtList.filter(x => !diff.variables.District.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.District.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.District.replace)
    })

    const stateTypeRows = useLiveQuery(() => db.StateType.toArray())?.map(x => StateTypeRow.toVariable(x))
    var stateTypeList = HashSet.of<Immutable<StateTypeVariable>>().addAll(stateTypeRows ? stateTypeRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        stateTypeList = stateTypeList.filter(x => !diff.variables.StateType.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.StateType.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.StateType.replace)
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
        }
    }
    const onDistrictInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'state': {
                dispatch(['districtList', 'variable', event.target.name, new StateType(parseInt(String(event.target.value)))])
                break
            }
            case 'name': {
                dispatch(['districtList', 'variable', event.target.name, String(event.target.value)])
                break
            }
        }
    }

    const updateItemsQuery = (list: 'districtList') => {
        const fx = (args: Args) => {
            switch (list) {
                case 'districtList': {
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

    const updatePage = (list: 'districtList') => {
        const fx = (args: ['limit', number] | ['offset', number] | ['page', number]) => {
            dispatch([list, args[0], args[1]])
        }
        return fx
    }

    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createStateType, {
            country: state.variable.values.country.hashCode(),
            name: state.variable.values.name,
            districtList: state.districtList.variables.toArray().map(variable => {
                return {
                    state: variable.values.state.hashCode(),
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteStateType, {
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
                        'create': `Create State Type`,
                        'update': `Update State Type`,
                        'show': `State Type`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/state-type-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/state-type-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/state-type-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{stateTypeType.keys.country}</Label>
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
                        <Label>{stateTypeType.keys.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.name} name='name' />,
                                <div className='font-bold text-xl'>{state.variable.values.name}</div>
                            )
                        }
                    </Item>
                </Container>
                <Container area={Grid.districtArea} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title> District List</Title>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <button onClick={() => toggleAddDistrictDrawer(true)} className='text-3xl font-bold text-white bg-gray-800 rounded-md px-2 h-10 focus:outline-none'>+</button>,
                                undefined
                            )
                        }
                    </Item>
                    <Item area={Grid2.filter} justify='end' align='center' className='flex'>
                        <Button onClick={() => toggleDistrictFilter(true)}>Filter</Button>
                        <Drawer open={districtFilter} onClose={() => toggleDistrictFilter(false)} anchor={'right'}>
                            <Filter typeName='District' query={state['districtList'].query} updateQuery={updateItemsQuery('districtList')} />
                        </Drawer>
                        <Drawer open={addDistrictDrawer} onClose={() => toggleAddDistrictDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add {districtType.name}</div>
                                <Container area={none} layout={Grid.layouts.uom} className=''>
                                    <Item>
                                        <Label>{districtType.keys.state}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onDistrictInputChange} value={state.districtList.variable.values.state.hashCode()} name='state'>
                                                    <option value='' selected disabled hidden>Select State</option>
                                                    {stateTypeList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(stateTypeList.filter(x => x.id.hashCode() === state.districtList.variable.values.state.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = stateTypeList.filter(x => x.id.hashCode() === state.districtList.variable.values.state.hashCode()).toArray()[0] as StateTypeVariable
                                                            return <Link to={`/state-type/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/state-type/${state.districtList.variable.values.state.hashCode()}`}>{state.districtList.variable.values.state.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{districtType.keys.name}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='text' onChange={onDistrictInputChange} value={state.districtList.variable.values.name} name='name' />,
                                                <div className='font-bold text-xl'>{state.districtList.variable.values.name}</div>
                                            )
                                        }
                                    </Item>
                                    <Item justify='center' align='center'>
                                        <Button onClick={() => dispatch(['districtList', 'addVariable'])}>Add</Button>
                                    </Item>
                                </Container>
                            </div>
                        </Drawer>
                    </Item>
                    <Table area={Grid2.table} state={state['districtList']} updatePage={updatePage('districtList')} variables={state.districtList.variables.filter(variable => applyFilter(state['districtList'].query, variable)).toArray()} columns={state['districtList'].columns.toArray()} />
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
