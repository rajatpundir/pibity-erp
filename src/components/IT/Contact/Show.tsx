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
import { DiffRow, AddressRow, CompanyRow, CompanyContactRow, ContactRow, ContactAddressRow } from '../../../main/rows'
import { Address, AddressVariable, Company, CompanyVariable, CompanyContact, CompanyContactVariable, Contact, ContactVariable, ContactAddress, ContactAddressVariable } from '../../../main/variables'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: ContactVariable
    contactAddressList: {
        typeName: 'ContactAddress'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<Array<string>>
        variable: ContactAddressVariable
        variables: HashSet<Immutable<ContactAddressVariable>>
    }
    companyContactList: {
        typeName: 'CompanyContact'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<Array<string>>
        variable: CompanyContactVariable
        variables: HashSet<Immutable<CompanyContactVariable>>
    }
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 
    | ['variable', 'name', string]
    | ['variable', 'email', string]
    | ['variable', 'telephone', string]
    | ['variable', 'mobile', string]
    | ['variable', 'website', string]

    | ['contactAddressList', 'limit', number]
    | ['contactAddressList', 'offset', number]
    | ['contactAddressList', 'page', number]
    | ['contactAddressList', 'query', Args]
    | ['contactAddressList', 'variable', 'contact', Contact]
    | ['contactAddressList', 'variable', 'name', string]
    | ['contactAddressList', 'variable', 'address', Address]
    | ['contactAddressList', 'addVariable']

    | ['companyContactList', 'limit', number]
    | ['companyContactList', 'offset', number]
    | ['companyContactList', 'page', number]
    | ['companyContactList', 'query', Args]
    | ['companyContactList', 'variable', 'company', Company]
    | ['companyContactList', 'variable', 'contact', Contact]
    | ['companyContactList', 'variable', 'role', string]
    | ['companyContactList', 'variable', 'email', string]
    | ['companyContactList', 'variable', 'telephone', string]
    | ['companyContactList', 'variable', 'mobile', string]
    | ['companyContactList', 'addVariable']
    | ['replace', 'variable', ContactVariable]
    | ['replace', 'contactAddressList', HashSet<ContactAddressVariable>]
    | ['replace', 'companyContactList', HashSet<CompanyContactVariable>]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new ContactVariable(-1, { name: '', email: '', telephone: '', mobile: '', website: '' }),
        contactAddressList: {
            typeName: 'ContactAddress',
            query: getQuery('ContactAddress'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'contact'], ['values', 'name'], ['values', 'address']),
            variable: new ContactAddressVariable(-1, { contact: new Contact(-1), name: '', address: new Address(-1) }),
            variables: HashSet.of<ContactAddressVariable>()
        },
        companyContactList: {
            typeName: 'CompanyContact',
            query: getQuery('CompanyContact'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'company'], ['values', 'contact'], ['values', 'role'], ['values', 'email'], ['values', 'telephone'], ['values', 'mobile']),
            variable: new CompanyContactVariable(-1, { company: new Company(-1), contact: new Contact(-1), role: '', email: '', telephone: '', mobile: '' }),
            variables: HashSet.of<CompanyContactVariable>()
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
                    case 'email': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'telephone': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'mobile': {
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
            
            case 'contactAddressList': {
                switch (action[1]) {
                    case 'limit': {
                        state[action[0]].limit = Math.max(initialState.contactAddressList.limit, action[2])
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
                            case 'contact': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'name': {
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
                        state.contactAddressList.variables = state.contactAddressList.variables.add(new ContactAddressVariable(-1, {contact: new Contact(state.contactAddressList.variable.values.contact.hashCode()), name: state.contactAddressList.variable.values.name, address: new Address(state.contactAddressList.variable.values.address.hashCode())}))
                        state.contactAddressList.variable = initialState.contactAddressList.variable
                        break
                    }
                    default: {
                        const _exhaustiveCheck: never = action
                        return _exhaustiveCheck
                    }
                }
                break
            }
            case 'companyContactList': {
                switch (action[1]) {
                    case 'limit': {
                        state[action[0]].limit = Math.max(initialState.companyContactList.limit, action[2])
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
                            case 'company': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'contact': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'role': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'email': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'telephone': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'mobile': {
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
                        state.companyContactList.variables = state.companyContactList.variables.add(new CompanyContactVariable(-1, {company: new Company(state.companyContactList.variable.values.company.hashCode()), contact: new Contact(state.companyContactList.variable.values.contact.hashCode()), role: state.companyContactList.variable.values.role, email: state.companyContactList.variable.values.email, telephone: state.companyContactList.variable.values.telephone, mobile: state.companyContactList.variable.values.mobile}))
                        state.companyContactList.variable = initialState.companyContactList.variable
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
                    case 'contactAddressList': {
                        state.contactAddressList.variables = action[2]
                        break
                    }
                    case 'companyContactList': {
                        state.companyContactList.variables = action[2]
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

    const contactType = types['Contact']
    const contactAddressType = types['ContactAddress']
    const companyContactType = types['CompanyContact']
    
    const [addContactAddressDrawer, toggleAddContactAddressDrawer] = useState(false)
    const [contactAddressFilter, toggleContactAddressFilter] = useState(false)

    const [addCompanyContactDrawer, toggleAddCompanyContactDrawer] = useState(false)
    const [companyContactFilter, toggleCompanyContactFilter] = useState(false)
    
    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.Contact.toArray()
            var composedVariables = HashSet.of<Immutable<ContactVariable>>().addAll(rows ? rows.map(x => ContactRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as ContactVariable])

                const contactAddressRows = await db.ContactAddress.toArray()
                var composedContactAddressVariables = HashSet.of<Immutable<ContactAddressVariable>>().addAll(contactAddressRows ? contactAddressRows.map(x => ContactAddressRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedContactAddressVariables = composedContactAddressVariables.filter(x => !diff.variables[state.contactAddressList.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.contactAddressList.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.contactAddressList.variable.typeName].replace)
                })
                dispatch(['replace', 'contactAddressList', composedContactAddressVariables.filter(variable => variable.values.contact.hashCode() === props.match.params[0]) as HashSet<ContactAddressVariable>])

                const companyContactRows = await db.CompanyContact.toArray()
                var composedCompanyContactVariables = HashSet.of<Immutable<CompanyContactVariable>>().addAll(companyContactRows ? companyContactRows.map(x => CompanyContactRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedCompanyContactVariables = composedCompanyContactVariables.filter(x => !diff.variables[state.companyContactList.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.companyContactList.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.companyContactList.variable.typeName].replace)
                })
                dispatch(['replace', 'companyContactList', composedCompanyContactVariables.filter(variable => variable.values.contact.hashCode() === props.match.params[0]) as HashSet<CompanyContactVariable>])
            }
        }
    }, [state.variable.typeName, state.contactAddressList.variable.typeName, state.companyContactList.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

    const addressRows = useLiveQuery(() => db.Address.toArray())?.map(x => AddressRow.toVariable(x))
    var addressList = HashSet.of<Immutable<AddressVariable>>().addAll(addressRows ? addressRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        addressList = addressList.filter(x => !diff.variables.Address.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.Address.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.Address.replace)
    })

    const companyRows = useLiveQuery(() => db.Company.toArray())?.map(x => CompanyRow.toVariable(x))
    var companyList = HashSet.of<Immutable<CompanyVariable>>().addAll(companyRows ? companyRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        companyList = companyList.filter(x => !diff.variables.Company.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.Company.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.Company.replace)
    })

    const companyContactRows = useLiveQuery(() => db.CompanyContact.toArray())?.map(x => CompanyContactRow.toVariable(x))
    var companyContactList = HashSet.of<Immutable<CompanyContactVariable>>().addAll(companyContactRows ? companyContactRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        companyContactList = companyContactList.filter(x => !diff.variables.CompanyContact.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.CompanyContact.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.CompanyContact.replace)
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
            case 'name': {
                dispatch(['variable', event.target.name, String(event.target.value)])
                break
            }
            case 'email': {
                dispatch(['variable', event.target.name, String(event.target.value)])
                break
            }
            case 'telephone': {
                dispatch(['variable', event.target.name, String(event.target.value)])
                break
            }
            case 'mobile': {
                dispatch(['variable', event.target.name, String(event.target.value)])
                break
            }
            case 'website': {
                dispatch(['variable', event.target.name, String(event.target.value)])
                break
            }
        }
    }
    const onContactAddressInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'contact': {
                dispatch(['contactAddressList', 'variable', event.target.name, new Contact(parseInt(String(event.target.value)))])
                break
            }
            case 'name': {
                dispatch(['contactAddressList', 'variable', event.target.name, String(event.target.value)])
                break
            }
            case 'address': {
                dispatch(['contactAddressList', 'variable', event.target.name, new Address(parseInt(String(event.target.value)))])
                break
            }
        }
    }

    const onCompanyContactInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'company': {
                dispatch(['companyContactList', 'variable', event.target.name, new Company(parseInt(String(event.target.value)))])
                break
            }
            case 'contact': {
                dispatch(['companyContactList', 'variable', event.target.name, new Contact(parseInt(String(event.target.value)))])
                break
            }
            case 'role': {
                dispatch(['companyContactList', 'variable', event.target.name, String(event.target.value)])
                break
            }
            case 'email': {
                dispatch(['companyContactList', 'variable', event.target.name, String(event.target.value)])
                break
            }
            case 'telephone': {
                dispatch(['companyContactList', 'variable', event.target.name, String(event.target.value)])
                break
            }
            case 'mobile': {
                dispatch(['companyContactList', 'variable', event.target.name, String(event.target.value)])
                break
            }
        }
    }

    const updateItemsQuery = (list: 'contactAddressList' | 'companyContactList') => {
        const fx = (args: Args) => {
            switch (list) {
                case 'contactAddressList': {
                    dispatch([list, 'query', args])
                    break
                }
                case 'companyContactList': {
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

    const updatePage = (list: 'contactAddressList' | 'companyContactList') => {
        const fx = (args: ['limit', number] | ['offset', number] | ['page', number]) => {
            dispatch([list, args[0], args[1]])
        }
        return fx
    }

    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createContact, {
            name: state.variable.values.name,
            email: state.variable.values.email,
            telephone: state.variable.values.telephone,
            mobile: state.variable.values.mobile,
            website: state.variable.values.website,
            contactAddressList: state.contactAddressList.variables.toArray().map(variable => {
                return {
                    contact: variable.values.contact.hashCode(),
                    name: variable.values.name,
                    address: variable.values.address.hashCode()
                }
            }),
            companyContactList: state.companyContactList.variables.toArray().map(variable => {
                return {
                    company: variable.values.company.hashCode(),
                    contact: variable.values.contact.hashCode(),
                    role: variable.values.role,
                    email: variable.values.email,
                    telephone: variable.values.telephone,
                    mobile: variable.values.mobile
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteContact, {
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
                        'create': `Create Contact`,
                        'update': `Update Contact`,
                        'show': `Contact`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/contact-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/contact-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/contact-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{contactType.keys.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.name} name='name' />,
                                <div className='font-bold text-xl'>{state.variable.values.name}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{contactType.keys.email}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.email} name='email' />,
                                <div className='font-bold text-xl'>{state.variable.values.email}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{contactType.keys.telephone}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.telephone} name='telephone' />,
                                <div className='font-bold text-xl'>{state.variable.values.telephone}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{contactType.keys.mobile}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.mobile} name='mobile' />,
                                <div className='font-bold text-xl'>{state.variable.values.mobile}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{contactType.keys.website}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.website} name='website' />,
                                <div className='font-bold text-xl'>{state.variable.values.website}</div>
                            )
                        }
                    </Item>
                </Container>
                <Container area={Grid.contactAddressArea} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title> Contact Address List</Title>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <button onClick={() => toggleAddContactAddressDrawer(true)} className='text-3xl font-bold text-white bg-gray-800 rounded-md px-2 h-10 focus:outline-none'>+</button>,
                                undefined
                            )
                        }
                    </Item>
                    <Item area={Grid2.filter} justify='end' align='center' className='flex'>
                        <Button onClick={() => toggleContactAddressFilter(true)}>Filter</Button>
                        <Drawer open={contactAddressFilter} onClose={() => toggleContactAddressFilter(false)} anchor={'right'}>
                            <Filter typeName='ContactAddress' query={state['contactAddressList'].query} updateQuery={updateItemsQuery('contactAddressList')} />
                        </Drawer>
                        <Drawer open={addContactAddressDrawer} onClose={() => toggleAddContactAddressDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add {contactAddressType.name}</div>
                                <Container area={none} layout={Grid.layouts.uom} className=''>
                                    <Item>
                                        <Label>{contactAddressType.keys.contact}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onContactAddressInputChange} value={state.contactAddressList.variable.values.contact.hashCode()} name='contact'>
                                                    <option value='' selected disabled hidden>Select Contact</option>
                                                    {contactList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(contactList.filter(x => x.id.hashCode() === state.contactAddressList.variable.values.contact.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = contactList.filter(x => x.id.hashCode() === state.contactAddressList.variable.values.contact.hashCode()).toArray()[0] as ContactVariable
                                                            return <Link to={`/contact/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/contact/${state.contactAddressList.variable.values.contact.hashCode()}`}>{state.contactAddressList.variable.values.contact.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{contactAddressType.keys.name}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='text' onChange={onContactAddressInputChange} value={state.contactAddressList.variable.values.name} name='name' />,
                                                <div className='font-bold text-xl'>{state.contactAddressList.variable.values.name}</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{contactAddressType.keys.address}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onContactAddressInputChange} value={state.contactAddressList.variable.values.address.hashCode()} name='address'>
                                                    <option value='' selected disabled hidden>Select Address</option>
                                                    {addressList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(addressList.filter(x => x.id.hashCode() === state.contactAddressList.variable.values.address.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = addressList.filter(x => x.id.hashCode() === state.contactAddressList.variable.values.address.hashCode()).toArray()[0] as AddressVariable
                                                            return <Link to={`/address/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/address/${state.contactAddressList.variable.values.address.hashCode()}`}>{state.contactAddressList.variable.values.address.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item justify='center' align='center'>
                                        <Button onClick={() => dispatch(['contactAddressList', 'addVariable'])}>Add</Button>
                                    </Item>
                                </Container>
                            </div>
                        </Drawer>
                    </Item>
                    <Table area={Grid2.table} state={state['contactAddressList']} updatePage={updatePage('contactAddressList')} variables={state.contactAddressList.variables.filter(variable => applyFilter(state['contactAddressList'].query, variable)).toArray()} columns={state['contactAddressList'].columns.toArray()} />
                </Container > 

                <Container area={Grid.companyContactArea} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title> Company Contact List</Title>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <button onClick={() => toggleAddCompanyContactDrawer(true)} className='text-3xl font-bold text-white bg-gray-800 rounded-md px-2 h-10 focus:outline-none'>+</button>,
                                undefined
                            )
                        }
                    </Item>
                    <Item area={Grid2.filter} justify='end' align='center' className='flex'>
                        <Button onClick={() => toggleCompanyContactFilter(true)}>Filter</Button>
                        <Drawer open={companyContactFilter} onClose={() => toggleCompanyContactFilter(false)} anchor={'right'}>
                            <Filter typeName='CompanyContact' query={state['companyContactList'].query} updateQuery={updateItemsQuery('companyContactList')} />
                        </Drawer>
                        <Drawer open={addCompanyContactDrawer} onClose={() => toggleAddCompanyContactDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add {companyContactType.name}</div>
                                <Container area={none} layout={Grid.layouts.uom} className=''>
                                    <Item>
                                        <Label>{companyContactType.keys.company}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onCompanyContactInputChange} value={state.companyContactList.variable.values.company.hashCode()} name='company'>
                                                    <option value='' selected disabled hidden>Select Company</option>
                                                    {companyList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(companyList.filter(x => x.id.hashCode() === state.companyContactList.variable.values.company.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = companyList.filter(x => x.id.hashCode() === state.companyContactList.variable.values.company.hashCode()).toArray()[0] as CompanyVariable
                                                            return <Link to={`/company/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/company/${state.companyContactList.variable.values.company.hashCode()}`}>{state.companyContactList.variable.values.company.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{companyContactType.keys.contact}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onCompanyContactInputChange} value={state.companyContactList.variable.values.contact.hashCode()} name='contact'>
                                                    <option value='' selected disabled hidden>Select Contact</option>
                                                    {contactList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(contactList.filter(x => x.id.hashCode() === state.companyContactList.variable.values.contact.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = contactList.filter(x => x.id.hashCode() === state.companyContactList.variable.values.contact.hashCode()).toArray()[0] as ContactVariable
                                                            return <Link to={`/contact/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/contact/${state.companyContactList.variable.values.contact.hashCode()}`}>{state.companyContactList.variable.values.contact.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{companyContactType.keys.role}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='text' onChange={onCompanyContactInputChange} value={state.companyContactList.variable.values.role} name='role' />,
                                                <div className='font-bold text-xl'>{state.companyContactList.variable.values.role}</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{companyContactType.keys.email}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='text' onChange={onCompanyContactInputChange} value={state.companyContactList.variable.values.email} name='email' />,
                                                <div className='font-bold text-xl'>{state.companyContactList.variable.values.email}</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{companyContactType.keys.telephone}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='text' onChange={onCompanyContactInputChange} value={state.companyContactList.variable.values.telephone} name='telephone' />,
                                                <div className='font-bold text-xl'>{state.companyContactList.variable.values.telephone}</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{companyContactType.keys.mobile}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='text' onChange={onCompanyContactInputChange} value={state.companyContactList.variable.values.mobile} name='mobile' />,
                                                <div className='font-bold text-xl'>{state.companyContactList.variable.values.mobile}</div>
                                            )
                                        }
                                    </Item>
                                    <Item justify='center' align='center'>
                                        <Button onClick={() => dispatch(['companyContactList', 'addVariable'])}>Add</Button>
                                    </Item>
                                </Container>
                            </div>
                        </Drawer>
                    </Item>
                    <Table area={Grid2.table} state={state['companyContactList']} updatePage={updatePage('companyContactList')} variables={state.companyContactList.variables.filter(variable => applyFilter(state['companyContactList'].query, variable)).toArray()} columns={state['companyContactList'].columns.toArray()} />
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
