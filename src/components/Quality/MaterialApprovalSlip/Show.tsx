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
import { DiffRow, MaterialApprovalSlipRow, MaterialApprovalSlipItemRow, PurchaseInvoiceRow, PurchaseInvoiceItemRow } from '../../../main/rows'
import { MaterialApprovalSlip, MaterialApprovalSlipVariable, MaterialApprovalSlipItem, MaterialApprovalSlipItemVariable, PurchaseInvoice, PurchaseInvoiceVariable, PurchaseInvoiceItem, PurchaseInvoiceItemVariable } from '../../../main/variables'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: MaterialApprovalSlipVariable
    materialApprovalSlipItemList: {
        typeName: 'MaterialApprovalSlipItem'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<Array<string>>
        variable: MaterialApprovalSlipItemVariable
        variables: HashSet<Immutable<MaterialApprovalSlipItemVariable>>
    }
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 
    | ['variable', 'purchaseInvoice', PurchaseInvoice]

    | ['materialApprovalSlipItemList', 'limit', number]
    | ['materialApprovalSlipItemList', 'offset', number]
    | ['materialApprovalSlipItemList', 'page', number]
    | ['materialApprovalSlipItemList', 'query', Args]
    | ['materialApprovalSlipItemList', 'variable', 'materialApprovalSlip', MaterialApprovalSlip]
    | ['materialApprovalSlipItemList', 'variable', 'purchaseInvoiceItem', PurchaseInvoiceItem]
    | ['materialApprovalSlipItemList', 'variable', 'quantity', number]
    | ['materialApprovalSlipItemList', 'variable', 'requisted', number]
    | ['materialApprovalSlipItemList', 'addVariable']
    | ['replace', 'variable', MaterialApprovalSlipVariable]
    | ['replace', 'materialApprovalSlipItemList', HashSet<MaterialApprovalSlipItemVariable>]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new MaterialApprovalSlipVariable(-1, { purchaseInvoice: new PurchaseInvoice(-1) }),
        materialApprovalSlipItemList: {
            typeName: 'MaterialApprovalSlipItem',
            query: getQuery('MaterialApprovalSlipItem'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'materialApprovalSlip'], ['values', 'purchaseInvoiceItem'], ['values', 'quantity'], ['values', 'requisted']),
            variable: new MaterialApprovalSlipItemVariable(-1, { materialApprovalSlip: new MaterialApprovalSlip(-1), purchaseInvoiceItem: new PurchaseInvoiceItem(-1), quantity: 0, requisted: 0 }),
            variables: HashSet.of<MaterialApprovalSlipItemVariable>()
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
                    case 'purchaseInvoice': {
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
            
            case 'materialApprovalSlipItemList': {
                switch (action[1]) {
                    case 'limit': {
                        state[action[0]].limit = Math.max(initialState.materialApprovalSlipItemList.limit, action[2])
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
                            case 'materialApprovalSlip': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'purchaseInvoiceItem': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'quantity': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'requisted': {
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
                        state.materialApprovalSlipItemList.variables = state.materialApprovalSlipItemList.variables.add(new MaterialApprovalSlipItemVariable(-1, {materialApprovalSlip: new MaterialApprovalSlip(state.materialApprovalSlipItemList.variable.values.materialApprovalSlip.hashCode()), purchaseInvoiceItem: new PurchaseInvoiceItem(state.materialApprovalSlipItemList.variable.values.purchaseInvoiceItem.hashCode()), quantity: state.materialApprovalSlipItemList.variable.values.quantity, requisted: state.materialApprovalSlipItemList.variable.values.requisted}))
                        state.materialApprovalSlipItemList.variable = initialState.materialApprovalSlipItemList.variable
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
                    case 'materialApprovalSlipItemList': {
                        state.materialApprovalSlipItemList.variables = action[2]
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

    const materialApprovalSlipType = types['MaterialApprovalSlip']
    const materialApprovalSlipItemType = types['MaterialApprovalSlipItem']
    
    const [addMaterialApprovalSlipItemDrawer, toggleAddMaterialApprovalSlipItemDrawer] = useState(false)
    const [materialApprovalSlipItemFilter, toggleMaterialApprovalSlipItemFilter] = useState(false)
    
    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.MaterialApprovalSlip.toArray()
            var composedVariables = HashSet.of<Immutable<MaterialApprovalSlipVariable>>().addAll(rows ? rows.map(x => MaterialApprovalSlipRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as MaterialApprovalSlipVariable])

                const materialApprovalSlipItemRows = await db.MaterialApprovalSlipItem.toArray()
                var composedMaterialApprovalSlipItemVariables = HashSet.of<Immutable<MaterialApprovalSlipItemVariable>>().addAll(materialApprovalSlipItemRows ? materialApprovalSlipItemRows.map(x => MaterialApprovalSlipItemRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedMaterialApprovalSlipItemVariables = composedMaterialApprovalSlipItemVariables.filter(x => !diff.variables[state.materialApprovalSlipItemList.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.materialApprovalSlipItemList.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.materialApprovalSlipItemList.variable.typeName].replace)
                })
                dispatch(['replace', 'materialApprovalSlipItemList', composedMaterialApprovalSlipItemVariables.filter(variable => variable.values.materialApprovalSlip.hashCode() === props.match.params[0]) as HashSet<MaterialApprovalSlipItemVariable>])
            }
        }
    }, [state.variable.typeName, state.materialApprovalSlipItemList.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

    const materialApprovalSlipRows = useLiveQuery(() => db.MaterialApprovalSlip.toArray())?.map(x => MaterialApprovalSlipRow.toVariable(x))
    var materialApprovalSlipList = HashSet.of<Immutable<MaterialApprovalSlipVariable>>().addAll(materialApprovalSlipRows ? materialApprovalSlipRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        materialApprovalSlipList = materialApprovalSlipList.filter(x => !diff.variables.MaterialApprovalSlip.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.MaterialApprovalSlip.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.MaterialApprovalSlip.replace)
    })

    const materialApprovalSlipItemRows = useLiveQuery(() => db.MaterialApprovalSlipItem.toArray())?.map(x => MaterialApprovalSlipItemRow.toVariable(x))
    var materialApprovalSlipItemList = HashSet.of<Immutable<MaterialApprovalSlipItemVariable>>().addAll(materialApprovalSlipItemRows ? materialApprovalSlipItemRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        materialApprovalSlipItemList = materialApprovalSlipItemList.filter(x => !diff.variables.MaterialApprovalSlipItem.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.MaterialApprovalSlipItem.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.MaterialApprovalSlipItem.replace)
    })

    const purchaseInvoiceRows = useLiveQuery(() => db.PurchaseInvoice.toArray())?.map(x => PurchaseInvoiceRow.toVariable(x))
    var purchaseInvoiceList = HashSet.of<Immutable<PurchaseInvoiceVariable>>().addAll(purchaseInvoiceRows ? purchaseInvoiceRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        purchaseInvoiceList = purchaseInvoiceList.filter(x => !diff.variables.PurchaseInvoice.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.PurchaseInvoice.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.PurchaseInvoice.replace)
    })

    const purchaseInvoiceItemRows = useLiveQuery(() => db.PurchaseInvoiceItem.toArray())?.map(x => PurchaseInvoiceItemRow.toVariable(x))
    var purchaseInvoiceItemList = HashSet.of<Immutable<PurchaseInvoiceItemVariable>>().addAll(purchaseInvoiceItemRows ? purchaseInvoiceItemRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        purchaseInvoiceItemList = purchaseInvoiceItemList.filter(x => !diff.variables.PurchaseInvoiceItem.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.PurchaseInvoiceItem.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.PurchaseInvoiceItem.replace)
    })

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'purchaseInvoice': {
                dispatch(['variable', event.target.name, new PurchaseInvoice(parseInt(String(event.target.value)))])
                break
            }
        }
    }
    const onMaterialApprovalSlipItemInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'materialApprovalSlip': {
                dispatch(['materialApprovalSlipItemList', 'variable', event.target.name, new MaterialApprovalSlip(parseInt(String(event.target.value)))])
                break
            }
            case 'purchaseInvoiceItem': {
                dispatch(['materialApprovalSlipItemList', 'variable', event.target.name, new PurchaseInvoiceItem(parseInt(String(event.target.value)))])
                break
            }
            case 'quantity': {
                dispatch(['materialApprovalSlipItemList', 'variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
            case 'requisted': {
                dispatch(['materialApprovalSlipItemList', 'variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
        }
    }

    const updateItemsQuery = (list: 'materialApprovalSlipItemList') => {
        const fx = (args: Args) => {
            switch (list) {
                case 'materialApprovalSlipItemList': {
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

    const updatePage = (list: 'materialApprovalSlipItemList') => {
        const fx = (args: ['limit', number] | ['offset', number] | ['page', number]) => {
            dispatch([list, args[0], args[1]])
        }
        return fx
    }

    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createMaterialApprovalSlip, {
            purchaseInvoice: state.variable.values.purchaseInvoice.hashCode(),
            materialApprovalSlipItemList: state.materialApprovalSlipItemList.variables.toArray().map(variable => {
                return {
                    materialApprovalSlip: variable.values.materialApprovalSlip.hashCode(),
                    purchaseInvoiceItem: variable.values.purchaseInvoiceItem.hashCode(),
                    quantity: variable.values.quantity,
                    requisted: variable.values.requisted
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteMaterialApprovalSlip, {
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
                        'create': `Create Material Approval Slip`,
                        'update': `Update Material Approval Slip`,
                        'show': `Material Approval Slip`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/material-approval-slip-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/material-approval-slip-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/material-approval-slip-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{materialApprovalSlipType.keys.purchaseInvoice}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.purchaseInvoice.hashCode()} name='purchaseInvoice'>
                                    <option value='' selected disabled hidden>Select Purchase Invoice</option>
                                    {purchaseInvoiceList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(purchaseInvoiceList.filter(x => x.id.hashCode() === state.variable.values.purchaseInvoice.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = purchaseInvoiceList.filter(x => x.id.hashCode() === state.variable.values.purchaseInvoice.hashCode()).toArray()[0] as PurchaseInvoiceVariable
                                            return <Link to={`/purchase-invoice/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/purchase-invoice/${state.variable.values.purchaseInvoice.hashCode()}`}>{state.variable.values.purchaseInvoice.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                </Container>
                <Container area={Grid.materialApprovalSlipItemArea} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title> Material Approval Slip Item List</Title>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <button onClick={() => toggleAddMaterialApprovalSlipItemDrawer(true)} className='text-3xl font-bold text-white bg-gray-800 rounded-md px-2 h-10 focus:outline-none'>+</button>,
                                undefined
                            )
                        }
                    </Item>
                    <Item area={Grid2.filter} justify='end' align='center' className='flex'>
                        <Button onClick={() => toggleMaterialApprovalSlipItemFilter(true)}>Filter</Button>
                        <Drawer open={materialApprovalSlipItemFilter} onClose={() => toggleMaterialApprovalSlipItemFilter(false)} anchor={'right'}>
                            <Filter typeName='MaterialApprovalSlipItem' query={state['materialApprovalSlipItemList'].query} updateQuery={updateItemsQuery('materialApprovalSlipItemList')} />
                        </Drawer>
                        <Drawer open={addMaterialApprovalSlipItemDrawer} onClose={() => toggleAddMaterialApprovalSlipItemDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add {materialApprovalSlipItemType.name}</div>
                                <Container area={none} layout={Grid.layouts.uom} className=''>
                                    <Item>
                                        <Label>{materialApprovalSlipItemType.keys.materialApprovalSlip}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onMaterialApprovalSlipItemInputChange} value={state.materialApprovalSlipItemList.variable.values.materialApprovalSlip.hashCode()} name='materialApprovalSlip'>
                                                    <option value='' selected disabled hidden>Select Material Approval Slip</option>
                                                    {materialApprovalSlipList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(materialApprovalSlipList.filter(x => x.id.hashCode() === state.materialApprovalSlipItemList.variable.values.materialApprovalSlip.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = materialApprovalSlipList.filter(x => x.id.hashCode() === state.materialApprovalSlipItemList.variable.values.materialApprovalSlip.hashCode()).toArray()[0] as MaterialApprovalSlipVariable
                                                            return <Link to={`/material-approval-slip/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/material-approval-slip/${state.materialApprovalSlipItemList.variable.values.materialApprovalSlip.hashCode()}`}>{state.materialApprovalSlipItemList.variable.values.materialApprovalSlip.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{materialApprovalSlipItemType.keys.purchaseInvoiceItem}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onMaterialApprovalSlipItemInputChange} value={state.materialApprovalSlipItemList.variable.values.purchaseInvoiceItem.hashCode()} name='purchaseInvoiceItem'>
                                                    <option value='' selected disabled hidden>Select Purchase Invoice Item</option>
                                                    {purchaseInvoiceItemList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(purchaseInvoiceItemList.filter(x => x.id.hashCode() === state.materialApprovalSlipItemList.variable.values.purchaseInvoiceItem.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = purchaseInvoiceItemList.filter(x => x.id.hashCode() === state.materialApprovalSlipItemList.variable.values.purchaseInvoiceItem.hashCode()).toArray()[0] as PurchaseInvoiceItemVariable
                                                            return <Link to={`/purchase-invoice-item/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/purchase-invoice-item/${state.materialApprovalSlipItemList.variable.values.purchaseInvoiceItem.hashCode()}`}>{state.materialApprovalSlipItemList.variable.values.purchaseInvoiceItem.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{materialApprovalSlipItemType.keys.quantity}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='number' onChange={onMaterialApprovalSlipItemInputChange} value={state.materialApprovalSlipItemList.variable.values.quantity} name='quantity' />,
                                                <div className='font-bold text-xl'>{state.materialApprovalSlipItemList.variable.values.quantity}</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{materialApprovalSlipItemType.keys.requisted}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='number' onChange={onMaterialApprovalSlipItemInputChange} value={state.materialApprovalSlipItemList.variable.values.requisted} name='requisted' />,
                                                <div className='font-bold text-xl'>{state.materialApprovalSlipItemList.variable.values.requisted}</div>
                                            )
                                        }
                                    </Item>
                                    <Item justify='center' align='center'>
                                        <Button onClick={() => dispatch(['materialApprovalSlipItemList', 'addVariable'])}>Add</Button>
                                    </Item>
                                </Container>
                            </div>
                        </Drawer>
                    </Item>
                    <Table area={Grid2.table} state={state['materialApprovalSlipItemList']} updatePage={updatePage('materialApprovalSlipItemList')} variables={state.materialApprovalSlipItemList.variables.filter(variable => applyFilter(state['materialApprovalSlipItemList'].query, variable)).toArray()} columns={state['materialApprovalSlipItemList'].columns.toArray()} />
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
