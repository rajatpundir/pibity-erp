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
import { DiffRow, AddressRow, ContactRow, ContactAddressRow } from '../../../main/rows'
import { Address, AddressVariable, Contact, ContactVariable, ContactAddress, ContactAddressVariable } from '../../../main/variables'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: ContactAddressVariable
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 
    | ['variable', 'contact', Contact]
    | ['variable', 'name', string]
    | ['variable', 'address', Address]

    | ['replace', 'variable', ContactAddressVariable]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new ContactAddressVariable(-1, { contact: new Contact(-1), name: '', address: new Address(-1) })
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
                    case 'contact': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'name': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'address': {
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

    const contactAddressType = types['ContactAddress']
    
    
    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.ContactAddress.toArray()
            var composedVariables = HashSet.of<Immutable<ContactAddressVariable>>().addAll(rows ? rows.map(x => ContactAddressRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as ContactAddressVariable])
            }
        }
    }, [state.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

    const addressRows = useLiveQuery(() => db.Address.toArray())?.map(x => AddressRow.toVariable(x))
    var addressList = HashSet.of<Immutable<AddressVariable>>().addAll(addressRows ? addressRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        addressList = addressList.filter(x => !diff.variables.Address.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.Address.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.Address.replace)
    })

    const contactRows = useLiveQuery(() => db.Contact.toArray())?.map(x => ContactRow.toVariable(x))
    var contactList = HashSet.of<Immutable<ContactVariable>>().addAll(contactRows ? contactRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        contactList = contactList.filter(x => !diff.variables.Contact.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.Contact.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.Contact.replace)
    })

    const contactAddressRows = useLiveQuery(() => db.ContactAddress.toArray())?.map(x => ContactAddressRow.toVariable(x))
    var contactAddressList = HashSet.of<Immutable<ContactAddressVariable>>().addAll(contactAddressRows ? contactAddressRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        contactAddressList = contactAddressList.filter(x => !diff.variables.ContactAddress.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.ContactAddress.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.ContactAddress.replace)
    })

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'contact': {
                dispatch(['variable', event.target.name, new Contact(parseInt(String(event.target.value)))])
                break
            }
            case 'name': {
                dispatch(['variable', event.target.name, String(event.target.value)])
                break
            }
            case 'address': {
                dispatch(['variable', event.target.name, new Address(parseInt(String(event.target.value)))])
                break
            }
        }
    }



    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createContactAddress, {
            contact: state.variable.values.contact.hashCode(),
            name: state.variable.values.name,
            address: state.variable.values.address.hashCode()
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteContactAddress, {
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
                        'create': `Create Contact Address`,
                        'update': `Update Contact Address`,
                        'show': `Contact Address`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/contact-address-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/contact-address-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/contact-address-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{contactAddressType.keys.contact}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.contact.hashCode()} name='contact'>
                                    <option value='' selected disabled hidden>Select Contact</option>
                                    {contactList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(contactList.filter(x => x.id.hashCode() === state.variable.values.contact.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = contactList.filter(x => x.id.hashCode() === state.variable.values.contact.hashCode()).toArray()[0] as ContactVariable
                                            return <Link to={`/contact/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/contact/${state.variable.values.contact.hashCode()}`}>{state.variable.values.contact.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{contactAddressType.keys.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.name} name='name' />,
                                <div className='font-bold text-xl'>{state.variable.values.name}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{contactAddressType.keys.address}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.address.hashCode()} name='address'>
                                    <option value='' selected disabled hidden>Select Address</option>
                                    {addressList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(addressList.filter(x => x.id.hashCode() === state.variable.values.address.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = addressList.filter(x => x.id.hashCode() === state.variable.values.address.hashCode()).toArray()[0] as AddressVariable
                                            return <Link to={`/address/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/address/${state.variable.values.address.hashCode()}`}>{state.variable.values.address.hashCode()}</Link>)
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
