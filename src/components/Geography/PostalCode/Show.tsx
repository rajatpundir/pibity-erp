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
import { DiffRow, AddressRow, PostalCodeRow, SubdistrictRow } from '../../../main/rows'
import { AddressVariable, PostalCode, PostalCodeVariable, Subdistrict, SubdistrictVariable } from '../../../main/variables'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: PostalCodeVariable
    addressList: {
        typeName: 'Address'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<Array<string>>
        variable: AddressVariable
        variables: HashSet<Immutable<AddressVariable>>
    }
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 
    | ['variable', 'subdistrict', Subdistrict]
    | ['variable', 'name', string]

    | ['addressList', 'limit', number]
    | ['addressList', 'offset', number]
    | ['addressList', 'page', number]
    | ['addressList', 'query', Args]
    | ['addressList', 'variable', 'postalCode', PostalCode]
    | ['addressList', 'variable', 'line1', string]
    | ['addressList', 'variable', 'line2', string]
    | ['addressList', 'variable', 'latitude', number]
    | ['addressList', 'variable', 'longitude', number]
    | ['addressList', 'addVariable']
    | ['replace', 'variable', PostalCodeVariable]
    | ['replace', 'addressList', HashSet<AddressVariable>]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new PostalCodeVariable(-1, { subdistrict: new Subdistrict(-1), name: '' }),
        addressList: {
            typeName: 'Address',
            query: getQuery('Address'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'postalCode'], ['values', 'line1'], ['values', 'line2'], ['values', 'latitude'], ['values', 'longitude']),
            variable: new AddressVariable(-1, { postalCode: new PostalCode(-1), line1: '', line2: '', latitude: 0, longitude: 0 }),
            variables: HashSet.of<AddressVariable>()
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
                    case 'subdistrict': {
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
            
            case 'addressList': {
                switch (action[1]) {
                    case 'limit': {
                        state[action[0]].limit = Math.max(initialState.addressList.limit, action[2])
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
                            case 'postalCode': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'line1': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'line2': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'latitude': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'longitude': {
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
                        state.addressList.variables = state.addressList.variables.add(new AddressVariable(-1, {postalCode: new PostalCode(state.addressList.variable.values.postalCode.hashCode()), line1: state.addressList.variable.values.line1, line2: state.addressList.variable.values.line2, latitude: state.addressList.variable.values.latitude, longitude: state.addressList.variable.values.longitude}))
                        state.addressList.variable = initialState.addressList.variable
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
                    case 'addressList': {
                        state.addressList.variables = action[2]
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

    const postalCodeType = types['PostalCode']
    const addressType = types['Address']
    
    const [addAddressDrawer, toggleAddAddressDrawer] = useState(false)
    const [addressFilter, toggleAddressFilter] = useState(false)
    
    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.PostalCode.toArray()
            var composedVariables = HashSet.of<Immutable<PostalCodeVariable>>().addAll(rows ? rows.map(x => PostalCodeRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as PostalCodeVariable])

                const addressRows = await db.Address.toArray()
                var composedAddressVariables = HashSet.of<Immutable<AddressVariable>>().addAll(addressRows ? addressRows.map(x => AddressRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedAddressVariables = composedAddressVariables.filter(x => !diff.variables[state.addressList.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.addressList.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.addressList.variable.typeName].replace)
                })
                dispatch(['replace', 'addressList', composedAddressVariables.filter(variable => variable.values.postalCode.hashCode() === props.match.params[0]) as HashSet<AddressVariable>])
            }
        }
    }, [state.variable.typeName, state.addressList.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

    const addressRows = useLiveQuery(() => db.Address.toArray())?.map(x => AddressRow.toVariable(x))
    var addressList = HashSet.of<Immutable<AddressVariable>>().addAll(addressRows ? addressRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        addressList = addressList.filter(x => !diff.variables.Address.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.Address.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.Address.replace)
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
            case 'subdistrict': {
                dispatch(['variable', event.target.name, new Subdistrict(parseInt(String(event.target.value)))])
                break
            }
            case 'name': {
                dispatch(['variable', event.target.name, String(event.target.value)])
                break
            }
        }
    }
    const onAddressInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'postalCode': {
                dispatch(['addressList', 'variable', event.target.name, new PostalCode(parseInt(String(event.target.value)))])
                break
            }
            case 'line1': {
                dispatch(['addressList', 'variable', event.target.name, String(event.target.value)])
                break
            }
            case 'line2': {
                dispatch(['addressList', 'variable', event.target.name, String(event.target.value)])
                break
            }
            case 'latitude': {
                dispatch(['addressList', 'variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
            case 'longitude': {
                dispatch(['addressList', 'variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
        }
    }

    const updateItemsQuery = (list: 'addressList') => {
        const fx = (args: Args) => {
            switch (list) {
                case 'addressList': {
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

    const updatePage = (list: 'addressList') => {
        const fx = (args: ['limit', number] | ['offset', number] | ['page', number]) => {
            dispatch([list, args[0], args[1]])
        }
        return fx
    }

    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createPostalCode, {
            subdistrict: state.variable.values.subdistrict.hashCode(),
            name: state.variable.values.name,
            addressList: state.addressList.variables.toArray().map(variable => {
                return {
                    postalCode: variable.values.postalCode.hashCode(),
                    line1: variable.values.line1,
                    line2: variable.values.line2,
                    latitude: variable.values.latitude,
                    longitude: variable.values.longitude
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deletePostalCode, {
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
                        'create': `Create Postal Code`,
                        'update': `Update Postal Code`,
                        'show': `Postal Code`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/postal-code-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/postal-code-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/postal-code-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{postalCodeType.keys.subdistrict}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.subdistrict.hashCode()} name='subdistrict'>
                                    <option value='' selected disabled hidden>Select Subdistrict</option>
                                    {subdistrictList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(subdistrictList.filter(x => x.id.hashCode() === state.variable.values.subdistrict.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = subdistrictList.filter(x => x.id.hashCode() === state.variable.values.subdistrict.hashCode()).toArray()[0] as SubdistrictVariable
                                            return <Link to={`/subdistrict/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/subdistrict/${state.variable.values.subdistrict.hashCode()}`}>{state.variable.values.subdistrict.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{postalCodeType.keys.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.name} name='name' />,
                                <div className='font-bold text-xl'>{state.variable.values.name}</div>
                            )
                        }
                    </Item>
                </Container>
                <Container area={Grid.addressArea} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title> Address List</Title>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <button onClick={() => toggleAddAddressDrawer(true)} className='text-3xl font-bold text-white bg-gray-800 rounded-md px-2 h-10 focus:outline-none'>+</button>,
                                undefined
                            )
                        }
                    </Item>
                    <Item area={Grid2.filter} justify='end' align='center' className='flex'>
                        <Button onClick={() => toggleAddressFilter(true)}>Filter</Button>
                        <Drawer open={addressFilter} onClose={() => toggleAddressFilter(false)} anchor={'right'}>
                            <Filter typeName='Address' query={state['addressList'].query} updateQuery={updateItemsQuery('addressList')} />
                        </Drawer>
                        <Drawer open={addAddressDrawer} onClose={() => toggleAddAddressDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add {addressType.name}</div>
                                <Container area={none} layout={Grid.layouts.uom} className=''>
                                    <Item>
                                        <Label>{addressType.keys.postalCode}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onAddressInputChange} value={state.addressList.variable.values.postalCode.hashCode()} name='postalCode'>
                                                    <option value='' selected disabled hidden>Select Postal Code</option>
                                                    {postalCodeList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(postalCodeList.filter(x => x.id.hashCode() === state.addressList.variable.values.postalCode.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = postalCodeList.filter(x => x.id.hashCode() === state.addressList.variable.values.postalCode.hashCode()).toArray()[0] as PostalCodeVariable
                                                            return <Link to={`/postal-code/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/postal-code/${state.addressList.variable.values.postalCode.hashCode()}`}>{state.addressList.variable.values.postalCode.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{addressType.keys.line1}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='text' onChange={onAddressInputChange} value={state.addressList.variable.values.line1} name='line1' />,
                                                <div className='font-bold text-xl'>{state.addressList.variable.values.line1}</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{addressType.keys.line2}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='text' onChange={onAddressInputChange} value={state.addressList.variable.values.line2} name='line2' />,
                                                <div className='font-bold text-xl'>{state.addressList.variable.values.line2}</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{addressType.keys.latitude}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='number' onChange={onAddressInputChange} value={state.addressList.variable.values.latitude} name='latitude' />,
                                                <div className='font-bold text-xl'>{state.addressList.variable.values.latitude}</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{addressType.keys.longitude}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='number' onChange={onAddressInputChange} value={state.addressList.variable.values.longitude} name='longitude' />,
                                                <div className='font-bold text-xl'>{state.addressList.variable.values.longitude}</div>
                                            )
                                        }
                                    </Item>
                                    <Item justify='center' align='center'>
                                        <Button onClick={() => dispatch(['addressList', 'addVariable'])}>Add</Button>
                                    </Item>
                                </Container>
                            </div>
                        </Drawer>
                    </Item>
                    <Table area={Grid2.table} state={state['addressList']} updatePage={updatePage('addressList')} variables={state.addressList.variables.filter(variable => applyFilter(state['addressList'].query, variable)).toArray()} columns={state['addressList'].columns.toArray()} />
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
