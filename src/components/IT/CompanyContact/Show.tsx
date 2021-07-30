import React, { useEffect } from 'react'
import { Immutable, Draft } from 'immer'
import { useImmerReducer } from 'use-immer'
import tw from 'twin.macro'
import { HashSet } from 'prelude-ts'
import { executeCircuit } from '../../../main/circuit'
import { types } from '../../../main/types'
import { Container, Item, none } from '../../../main/commons'
import * as Grid from './grids/Show'
import { withRouter, Link } from 'react-router-dom'
import { circuits } from '../../../main/circuits'
import { iff, when } from '../../../main/utils'
import { db } from '../../../main/dexie'
import { useCallback } from 'react'
import { updateVariable } from '../../../main/mutation'
import { useLiveQuery } from 'dexie-react-hooks'
import { DiffRow, CompanyRow, CompanyContactRow, ContactRow } from '../../../main/rows'
import { Company, CompanyVariable, CompanyContactVariable, Contact, ContactVariable } from '../../../main/variables'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: CompanyContactVariable
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 
    | ['variable', 'company', Company]
    | ['variable', 'contact', Contact]
    | ['variable', 'role', string]
    | ['variable', 'email', string]
    | ['variable', 'telephone', string]
    | ['variable', 'mobile', string]

    | ['replace', 'variable', CompanyContactVariable]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new CompanyContactVariable(-1, { company: new Company(-1), contact: new Contact(-1), role: '', email: '', telephone: '', mobile: '' })
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
                    case 'company': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'contact': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'role': {
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

    const companyContactType = types['CompanyContact']
    
    
    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.CompanyContact.toArray()
            var composedVariables = HashSet.of<Immutable<CompanyContactVariable>>().addAll(rows ? rows.map(x => CompanyContactRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as CompanyContactVariable])
            }
        }
    }, [state.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

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

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'company': {
                dispatch(['variable', event.target.name, new Company(parseInt(String(event.target.value)))])
                break
            }
            case 'contact': {
                dispatch(['variable', event.target.name, new Contact(parseInt(String(event.target.value)))])
                break
            }
            case 'role': {
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
        }
    }



    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createCompanyContact, {
            company: state.variable.values.company.hashCode(),
            contact: state.variable.values.contact.hashCode(),
            role: state.variable.values.role,
            email: state.variable.values.email,
            telephone: state.variable.values.telephone,
            mobile: state.variable.values.mobile
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteCompanyContact, {
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
                        'create': `Create Company Contact`,
                        'update': `Update Company Contact`,
                        'show': `Company Contact`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/company-contact-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/company-contact-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/company-contact-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{companyContactType.keys.company}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.company.hashCode()} name='company'>
                                    <option value='' selected disabled hidden>Select Company</option>
                                    {companyList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(companyList.filter(x => x.id.hashCode() === state.variable.values.company.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = companyList.filter(x => x.id.hashCode() === state.variable.values.company.hashCode()).toArray()[0] as CompanyVariable
                                            return <Link to={`/company/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/company/${state.variable.values.company.hashCode()}`}>{state.variable.values.company.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{companyContactType.keys.contact}</Label>
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
                        <Label>{companyContactType.keys.role}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.role} name='role' />,
                                <div className='font-bold text-xl'>{state.variable.values.role}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{companyContactType.keys.email}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.email} name='email' />,
                                <div className='font-bold text-xl'>{state.variable.values.email}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{companyContactType.keys.telephone}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.telephone} name='telephone' />,
                                <div className='font-bold text-xl'>{state.variable.values.telephone}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{companyContactType.keys.mobile}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.mobile} name='mobile' />,
                                <div className='font-bold text-xl'>{state.variable.values.mobile}</div>
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
