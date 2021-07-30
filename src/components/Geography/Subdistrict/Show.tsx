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
import { DiffRow, DistrictRow, PostalCodeRow, SubdistrictRow } from '../../../main/rows'
import { District, DistrictVariable, PostalCode, PostalCodeVariable, Subdistrict, SubdistrictVariable } from '../../../main/variables'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: SubdistrictVariable
    postalCodeList: {
        typeName: 'PostalCode'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<Array<string>>
        variable: PostalCodeVariable
        variables: HashSet<Immutable<PostalCodeVariable>>
    }
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 
    | ['variable', 'district', District]
    | ['variable', 'name', string]

    | ['postalCodeList', 'limit', number]
    | ['postalCodeList', 'offset', number]
    | ['postalCodeList', 'page', number]
    | ['postalCodeList', 'query', Args]
    | ['postalCodeList', 'variable', 'subdistrict', Subdistrict]
    | ['postalCodeList', 'variable', 'name', string]
    | ['postalCodeList', 'addVariable']
    | ['replace', 'variable', SubdistrictVariable]
    | ['replace', 'postalCodeList', HashSet<PostalCodeVariable>]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new SubdistrictVariable(-1, { district: new District(-1), name: '' }),
        postalCodeList: {
            typeName: 'PostalCode',
            query: getQuery('PostalCode'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'subdistrict'], ['values', 'name']),
            variable: new PostalCodeVariable(-1, { subdistrict: new Subdistrict(-1), name: '' }),
            variables: HashSet.of<PostalCodeVariable>()
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
                    case 'district': {
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
            
            case 'postalCodeList': {
                switch (action[1]) {
                    case 'limit': {
                        state[action[0]].limit = Math.max(initialState.postalCodeList.limit, action[2])
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
                            case 'subdistrict': {
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
                        state.postalCodeList.variables = state.postalCodeList.variables.add(new PostalCodeVariable(-1, {subdistrict: new Subdistrict(state.postalCodeList.variable.values.subdistrict.hashCode()), name: state.postalCodeList.variable.values.name}))
                        state.postalCodeList.variable = initialState.postalCodeList.variable
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
                    case 'postalCodeList': {
                        state.postalCodeList.variables = action[2]
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

    const subdistrictType = types['Subdistrict']
    const postalCodeType = types['PostalCode']
    
    const [addPostalCodeDrawer, toggleAddPostalCodeDrawer] = useState(false)
    const [postalCodeFilter, togglePostalCodeFilter] = useState(false)
    
    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.Subdistrict.toArray()
            var composedVariables = HashSet.of<Immutable<SubdistrictVariable>>().addAll(rows ? rows.map(x => SubdistrictRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as SubdistrictVariable])

                const postalCodeRows = await db.PostalCode.toArray()
                var composedPostalCodeVariables = HashSet.of<Immutable<PostalCodeVariable>>().addAll(postalCodeRows ? postalCodeRows.map(x => PostalCodeRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedPostalCodeVariables = composedPostalCodeVariables.filter(x => !diff.variables[state.postalCodeList.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.postalCodeList.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.postalCodeList.variable.typeName].replace)
                })
                dispatch(['replace', 'postalCodeList', composedPostalCodeVariables.filter(variable => variable.values.subdistrict.hashCode() === props.match.params[0]) as HashSet<PostalCodeVariable>])
            }
        }
    }, [state.variable.typeName, state.postalCodeList.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

    const districtRows = useLiveQuery(() => db.District.toArray())?.map(x => DistrictRow.toVariable(x))
    var districtList = HashSet.of<Immutable<DistrictVariable>>().addAll(districtRows ? districtRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        districtList = districtList.filter(x => !diff.variables.District.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.District.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.District.replace)
    })

    const postalCodeRows = useLiveQuery(() => db.PostalCode.toArray())?.map(x => PostalCodeRow.toVariable(x))
    var postalCodeList = HashSet.of<Immutable<PostalCodeVariable>>().addAll(postalCodeRows ? postalCodeRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        postalCodeList = postalCodeList.filter(x => !diff.variables.PostalCode.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.PostalCode.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.PostalCode.replace)
    })

    const subdistrictRows = useLiveQuery(() => db.Subdistrict.toArray())?.map(x => SubdistrictRow.toVariable(x))
    var subdistrictList = HashSet.of<Immutable<SubdistrictVariable>>().addAll(subdistrictRows ? subdistrictRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        subdistrictList = subdistrictList.filter(x => !diff.variables.Subdistrict.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.Subdistrict.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.Subdistrict.replace)
    })

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'district': {
                dispatch(['variable', event.target.name, new District(parseInt(String(event.target.value)))])
                break
            }
            case 'name': {
                dispatch(['variable', event.target.name, String(event.target.value)])
                break
            }
        }
    }
    const onPostalCodeInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'subdistrict': {
                dispatch(['postalCodeList', 'variable', event.target.name, new Subdistrict(parseInt(String(event.target.value)))])
                break
            }
            case 'name': {
                dispatch(['postalCodeList', 'variable', event.target.name, String(event.target.value)])
                break
            }
        }
    }

    const updateItemsQuery = (list: 'postalCodeList') => {
        const fx = (args: Args) => {
            switch (list) {
                case 'postalCodeList': {
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

    const updatePage = (list: 'postalCodeList') => {
        const fx = (args: ['limit', number] | ['offset', number] | ['page', number]) => {
            dispatch([list, args[0], args[1]])
        }
        return fx
    }

    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createSubdistrict, {
            district: state.variable.values.district.hashCode(),
            name: state.variable.values.name,
            postalCodeList: state.postalCodeList.variables.toArray().map(variable => {
                return {
                    subdistrict: variable.values.subdistrict.hashCode(),
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteSubdistrict, {
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
                        'create': `Create Subdistrict`,
                        'update': `Update Subdistrict`,
                        'show': `Subdistrict`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/subdistrict-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/subdistrict-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/subdistrict-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{subdistrictType.keys.district}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.district.hashCode()} name='district'>
                                    <option value='' selected disabled hidden>Select District</option>
                                    {districtList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(districtList.filter(x => x.id.hashCode() === state.variable.values.district.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = districtList.filter(x => x.id.hashCode() === state.variable.values.district.hashCode()).toArray()[0] as DistrictVariable
                                            return <Link to={`/district/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/district/${state.variable.values.district.hashCode()}`}>{state.variable.values.district.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{subdistrictType.keys.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.name} name='name' />,
                                <div className='font-bold text-xl'>{state.variable.values.name}</div>
                            )
                        }
                    </Item>
                </Container>
                <Container area={Grid.postalCodeArea} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title> Postal Code List</Title>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <button onClick={() => toggleAddPostalCodeDrawer(true)} className='text-3xl font-bold text-white bg-gray-800 rounded-md px-2 h-10 focus:outline-none'>+</button>,
                                undefined
                            )
                        }
                    </Item>
                    <Item area={Grid2.filter} justify='end' align='center' className='flex'>
                        <Button onClick={() => togglePostalCodeFilter(true)}>Filter</Button>
                        <Drawer open={postalCodeFilter} onClose={() => togglePostalCodeFilter(false)} anchor={'right'}>
                            <Filter typeName='PostalCode' query={state['postalCodeList'].query} updateQuery={updateItemsQuery('postalCodeList')} />
                        </Drawer>
                        <Drawer open={addPostalCodeDrawer} onClose={() => toggleAddPostalCodeDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add {postalCodeType.name}</div>
                                <Container area={none} layout={Grid.layouts.uom} className=''>
                                    <Item>
                                        <Label>{postalCodeType.keys.subdistrict}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onPostalCodeInputChange} value={state.postalCodeList.variable.values.subdistrict.hashCode()} name='subdistrict'>
                                                    <option value='' selected disabled hidden>Select Subdistrict</option>
                                                    {subdistrictList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(subdistrictList.filter(x => x.id.hashCode() === state.postalCodeList.variable.values.subdistrict.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = subdistrictList.filter(x => x.id.hashCode() === state.postalCodeList.variable.values.subdistrict.hashCode()).toArray()[0] as SubdistrictVariable
                                                            return <Link to={`/subdistrict/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/subdistrict/${state.postalCodeList.variable.values.subdistrict.hashCode()}`}>{state.postalCodeList.variable.values.subdistrict.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{postalCodeType.keys.name}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='text' onChange={onPostalCodeInputChange} value={state.postalCodeList.variable.values.name} name='name' />,
                                                <div className='font-bold text-xl'>{state.postalCodeList.variable.values.name}</div>
                                            )
                                        }
                                    </Item>
                                    <Item justify='center' align='center'>
                                        <Button onClick={() => dispatch(['postalCodeList', 'addVariable'])}>Add</Button>
                                    </Item>
                                </Container>
                            </div>
                        </Drawer>
                    </Item>
                    <Table area={Grid2.table} state={state['postalCodeList']} updatePage={updatePage('postalCodeList')} variables={state.postalCodeList.variables.filter(variable => applyFilter(state['postalCodeList'].query, variable)).toArray()} columns={state['postalCodeList'].columns.toArray()} />
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
