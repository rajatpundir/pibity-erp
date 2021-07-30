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
import { DiffRow, AddressRow, PostalCodeRow } from '../../../main/rows'
import { Address, AddressVariable, PostalCode, PostalCodeVariable } from '../../../main/variables'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: AddressVariable
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 
    | ['variable', 'postalCode', PostalCode]
    | ['variable', 'line1', string]
    | ['variable', 'line2', string]
    | ['variable', 'latitude', number]
    | ['variable', 'longitude', number]

    | ['replace', 'variable', AddressVariable]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new AddressVariable(-1, { postalCode: new PostalCode(-1), line1: '', line2: '', latitude: 0, longitude: 0 })
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
                    case 'postalCode': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'line1': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'line2': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'latitude': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'longitude': {
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

    const addressType = types['Address']
    
    
    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.Address.toArray()
            var composedVariables = HashSet.of<Immutable<AddressVariable>>().addAll(rows ? rows.map(x => AddressRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as AddressVariable])
            }
        }
    }, [state.variable.typeName, props.match.params, dispatch])

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

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'postalCode': {
                dispatch(['variable', event.target.name, new PostalCode(parseInt(String(event.target.value)))])
                break
            }
            case 'line1': {
                dispatch(['variable', event.target.name, String(event.target.value)])
                break
            }
            case 'line2': {
                dispatch(['variable', event.target.name, String(event.target.value)])
                break
            }
            case 'latitude': {
                dispatch(['variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
            case 'longitude': {
                dispatch(['variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
        }
    }



    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createAddress, {
            postalCode: state.variable.values.postalCode.hashCode(),
            line1: state.variable.values.line1,
            line2: state.variable.values.line2,
            latitude: state.variable.values.latitude,
            longitude: state.variable.values.longitude
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteAddress, {
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
                        'create': `Create Address`,
                        'update': `Update Address`,
                        'show': `Address`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/address-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/address-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/address-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{addressType.keys.postalCode}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.postalCode.hashCode()} name='postalCode'>
                                    <option value='' selected disabled hidden>Select Postal Code</option>
                                    {postalCodeList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(postalCodeList.filter(x => x.id.hashCode() === state.variable.values.postalCode.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = postalCodeList.filter(x => x.id.hashCode() === state.variable.values.postalCode.hashCode()).toArray()[0] as PostalCodeVariable
                                            return <Link to={`/postal-code/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/postal-code/${state.variable.values.postalCode.hashCode()}`}>{state.variable.values.postalCode.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{addressType.keys.line1}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.line1} name='line1' />,
                                <div className='font-bold text-xl'>{state.variable.values.line1}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{addressType.keys.line2}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.line2} name='line2' />,
                                <div className='font-bold text-xl'>{state.variable.values.line2}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{addressType.keys.latitude}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='number' onChange={onVariableInputChange} value={state.variable.values.latitude} name='latitude' />,
                                <div className='font-bold text-xl'>{state.variable.values.latitude}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{addressType.keys.longitude}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='number' onChange={onVariableInputChange} value={state.variable.values.longitude} name='longitude' />,
                                <div className='font-bold text-xl'>{state.variable.values.longitude}</div>
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
