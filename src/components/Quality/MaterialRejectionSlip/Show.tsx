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
import { DiffRow, MaterialRejectionSlipRow, MaterialRejectionSlipItemRow, PurchaseInvoiceRow, PurchaseInvoiceItemRow } from '../../../main/rows'
import { MaterialRejectionSlip, MaterialRejectionSlipVariable, MaterialRejectionSlipItemVariable, PurchaseInvoice, PurchaseInvoiceVariable, PurchaseInvoiceItem, PurchaseInvoiceItemVariable } from '../../../main/variables'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: MaterialRejectionSlipVariable
    materialRejectionSlipItemList: {
        typeName: 'MaterialRejectionSlipItem'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<Array<string>>
        variable: MaterialRejectionSlipItemVariable
        variables: HashSet<Immutable<MaterialRejectionSlipItemVariable>>
    }
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 
    | ['variable', 'purchaseInvoice', PurchaseInvoice]

    | ['materialRejectionSlipItemList', 'limit', number]
    | ['materialRejectionSlipItemList', 'offset', number]
    | ['materialRejectionSlipItemList', 'page', number]
    | ['materialRejectionSlipItemList', 'query', Args]
    | ['materialRejectionSlipItemList', 'variable', 'materialRejectionSlip', MaterialRejectionSlip]
    | ['materialRejectionSlipItemList', 'variable', 'purchaseInvoiceItem', PurchaseInvoiceItem]
    | ['materialRejectionSlipItemList', 'variable', 'quantity', number]
    | ['materialRejectionSlipItemList', 'variable', 'returned', number]
    | ['materialRejectionSlipItemList', 'addVariable']
    | ['replace', 'variable', MaterialRejectionSlipVariable]
    | ['replace', 'materialRejectionSlipItemList', HashSet<MaterialRejectionSlipItemVariable>]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new MaterialRejectionSlipVariable(-1, { purchaseInvoice: new PurchaseInvoice(-1) }),
        materialRejectionSlipItemList: {
            typeName: 'MaterialRejectionSlipItem',
            query: getQuery('MaterialRejectionSlipItem'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'materialRejectionSlip'], ['values', 'purchaseInvoiceItem'], ['values', 'quantity'], ['values', 'returned']),
            variable: new MaterialRejectionSlipItemVariable(-1, { materialRejectionSlip: new MaterialRejectionSlip(-1), purchaseInvoiceItem: new PurchaseInvoiceItem(-1), quantity: 0, returned: 0 }),
            variables: HashSet.of<MaterialRejectionSlipItemVariable>()
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
            
            case 'materialRejectionSlipItemList': {
                switch (action[1]) {
                    case 'limit': {
                        state[action[0]].limit = Math.max(initialState.materialRejectionSlipItemList.limit, action[2])
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
                            case 'materialRejectionSlip': {
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
                            case 'returned': {
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
                        state.materialRejectionSlipItemList.variables = state.materialRejectionSlipItemList.variables.add(new MaterialRejectionSlipItemVariable(-1, {materialRejectionSlip: new MaterialRejectionSlip(state.materialRejectionSlipItemList.variable.values.materialRejectionSlip.hashCode()), purchaseInvoiceItem: new PurchaseInvoiceItem(state.materialRejectionSlipItemList.variable.values.purchaseInvoiceItem.hashCode()), quantity: state.materialRejectionSlipItemList.variable.values.quantity, returned: state.materialRejectionSlipItemList.variable.values.returned}))
                        state.materialRejectionSlipItemList.variable = initialState.materialRejectionSlipItemList.variable
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
                    case 'materialRejectionSlipItemList': {
                        state.materialRejectionSlipItemList.variables = action[2]
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

    const materialRejectionSlipType = types['MaterialRejectionSlip']
    const materialRejectionSlipItemType = types['MaterialRejectionSlipItem']
    
    const [addMaterialRejectionSlipItemDrawer, toggleAddMaterialRejectionSlipItemDrawer] = useState(false)
    const [materialRejectionSlipItemFilter, toggleMaterialRejectionSlipItemFilter] = useState(false)
    
    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.MaterialRejectionSlip.toArray()
            var composedVariables = HashSet.of<Immutable<MaterialRejectionSlipVariable>>().addAll(rows ? rows.map(x => MaterialRejectionSlipRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as MaterialRejectionSlipVariable])

                const materialRejectionSlipItemRows = await db.MaterialRejectionSlipItem.toArray()
                var composedMaterialRejectionSlipItemVariables = HashSet.of<Immutable<MaterialRejectionSlipItemVariable>>().addAll(materialRejectionSlipItemRows ? materialRejectionSlipItemRows.map(x => MaterialRejectionSlipItemRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedMaterialRejectionSlipItemVariables = composedMaterialRejectionSlipItemVariables.filter(x => !diff.variables[state.materialRejectionSlipItemList.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.materialRejectionSlipItemList.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.materialRejectionSlipItemList.variable.typeName].replace)
                })
                dispatch(['replace', 'materialRejectionSlipItemList', composedMaterialRejectionSlipItemVariables.filter(variable => variable.values.materialRejectionSlip.hashCode() === props.match.params[0]) as HashSet<MaterialRejectionSlipItemVariable>])
            }
        }
    }, [state.variable.typeName, state.materialRejectionSlipItemList.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

    const materialRejectionSlipRows = useLiveQuery(() => db.MaterialRejectionSlip.toArray())?.map(x => MaterialRejectionSlipRow.toVariable(x))
    var materialRejectionSlipList = HashSet.of<Immutable<MaterialRejectionSlipVariable>>().addAll(materialRejectionSlipRows ? materialRejectionSlipRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        materialRejectionSlipList = materialRejectionSlipList.filter(x => !diff.variables.MaterialRejectionSlip.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.MaterialRejectionSlip.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.MaterialRejectionSlip.replace)
    })

    const materialRejectionSlipItemRows = useLiveQuery(() => db.MaterialRejectionSlipItem.toArray())?.map(x => MaterialRejectionSlipItemRow.toVariable(x))
    var materialRejectionSlipItemList = HashSet.of<Immutable<MaterialRejectionSlipItemVariable>>().addAll(materialRejectionSlipItemRows ? materialRejectionSlipItemRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        materialRejectionSlipItemList = materialRejectionSlipItemList.filter(x => !diff.variables.MaterialRejectionSlipItem.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.MaterialRejectionSlipItem.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.MaterialRejectionSlipItem.replace)
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
    const onMaterialRejectionSlipItemInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'materialRejectionSlip': {
                dispatch(['materialRejectionSlipItemList', 'variable', event.target.name, new MaterialRejectionSlip(parseInt(String(event.target.value)))])
                break
            }
            case 'purchaseInvoiceItem': {
                dispatch(['materialRejectionSlipItemList', 'variable', event.target.name, new PurchaseInvoiceItem(parseInt(String(event.target.value)))])
                break
            }
            case 'quantity': {
                dispatch(['materialRejectionSlipItemList', 'variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
            case 'returned': {
                dispatch(['materialRejectionSlipItemList', 'variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
        }
    }

    const updateItemsQuery = (list: 'materialRejectionSlipItemList') => {
        const fx = (args: Args) => {
            switch (list) {
                case 'materialRejectionSlipItemList': {
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

    const updatePage = (list: 'materialRejectionSlipItemList') => {
        const fx = (args: ['limit', number] | ['offset', number] | ['page', number]) => {
            dispatch([list, args[0], args[1]])
        }
        return fx
    }

    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createMaterialRejectionSlip, {
            purchaseInvoice: state.variable.values.purchaseInvoice.hashCode(),
            materialRejectionSlipItemList: state.materialRejectionSlipItemList.variables.toArray().map(variable => {
                return {
                    materialRejectionSlip: variable.values.materialRejectionSlip.hashCode(),
                    purchaseInvoiceItem: variable.values.purchaseInvoiceItem.hashCode(),
                    quantity: variable.values.quantity,
                    returned: variable.values.returned
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteMaterialRejectionSlip, {
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
                        'create': `Create Material Rejection Slip`,
                        'update': `Update Material Rejection Slip`,
                        'show': `Material Rejection Slip`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/material-rejection-slip-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/material-rejection-slip-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/material-rejection-slip-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{materialRejectionSlipType.keys.purchaseInvoice}</Label>
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
                <Container area={Grid.materialRejectionSlipItemArea} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title> Material Rejection Slip Item List</Title>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <button onClick={() => toggleAddMaterialRejectionSlipItemDrawer(true)} className='text-3xl font-bold text-white bg-gray-800 rounded-md px-2 h-10 focus:outline-none'>+</button>,
                                undefined
                            )
                        }
                    </Item>
                    <Item area={Grid2.filter} justify='end' align='center' className='flex'>
                        <Button onClick={() => toggleMaterialRejectionSlipItemFilter(true)}>Filter</Button>
                        <Drawer open={materialRejectionSlipItemFilter} onClose={() => toggleMaterialRejectionSlipItemFilter(false)} anchor={'right'}>
                            <Filter typeName='MaterialRejectionSlipItem' query={state['materialRejectionSlipItemList'].query} updateQuery={updateItemsQuery('materialRejectionSlipItemList')} />
                        </Drawer>
                        <Drawer open={addMaterialRejectionSlipItemDrawer} onClose={() => toggleAddMaterialRejectionSlipItemDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add {materialRejectionSlipItemType.name}</div>
                                <Container area={none} layout={Grid.layouts.uom} className=''>
                                    <Item>
                                        <Label>{materialRejectionSlipItemType.keys.materialRejectionSlip}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onMaterialRejectionSlipItemInputChange} value={state.materialRejectionSlipItemList.variable.values.materialRejectionSlip.hashCode()} name='materialRejectionSlip'>
                                                    <option value='' selected disabled hidden>Select Material Rejection Slip</option>
                                                    {materialRejectionSlipList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(materialRejectionSlipList.filter(x => x.id.hashCode() === state.materialRejectionSlipItemList.variable.values.materialRejectionSlip.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = materialRejectionSlipList.filter(x => x.id.hashCode() === state.materialRejectionSlipItemList.variable.values.materialRejectionSlip.hashCode()).toArray()[0] as MaterialRejectionSlipVariable
                                                            return <Link to={`/material-rejection-slip/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/material-rejection-slip/${state.materialRejectionSlipItemList.variable.values.materialRejectionSlip.hashCode()}`}>{state.materialRejectionSlipItemList.variable.values.materialRejectionSlip.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{materialRejectionSlipItemType.keys.purchaseInvoiceItem}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onMaterialRejectionSlipItemInputChange} value={state.materialRejectionSlipItemList.variable.values.purchaseInvoiceItem.hashCode()} name='purchaseInvoiceItem'>
                                                    <option value='' selected disabled hidden>Select Purchase Invoice Item</option>
                                                    {purchaseInvoiceItemList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(purchaseInvoiceItemList.filter(x => x.id.hashCode() === state.materialRejectionSlipItemList.variable.values.purchaseInvoiceItem.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = purchaseInvoiceItemList.filter(x => x.id.hashCode() === state.materialRejectionSlipItemList.variable.values.purchaseInvoiceItem.hashCode()).toArray()[0] as PurchaseInvoiceItemVariable
                                                            return <Link to={`/purchase-invoice-item/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/purchase-invoice-item/${state.materialRejectionSlipItemList.variable.values.purchaseInvoiceItem.hashCode()}`}>{state.materialRejectionSlipItemList.variable.values.purchaseInvoiceItem.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{materialRejectionSlipItemType.keys.quantity}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='number' onChange={onMaterialRejectionSlipItemInputChange} value={state.materialRejectionSlipItemList.variable.values.quantity} name='quantity' />,
                                                <div className='font-bold text-xl'>{state.materialRejectionSlipItemList.variable.values.quantity}</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{materialRejectionSlipItemType.keys.returned}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='number' onChange={onMaterialRejectionSlipItemInputChange} value={state.materialRejectionSlipItemList.variable.values.returned} name='returned' />,
                                                <div className='font-bold text-xl'>{state.materialRejectionSlipItemList.variable.values.returned}</div>
                                            )
                                        }
                                    </Item>
                                    <Item justify='center' align='center'>
                                        <Button onClick={() => dispatch(['materialRejectionSlipItemList', 'addVariable'])}>Add</Button>
                                    </Item>
                                </Container>
                            </div>
                        </Drawer>
                    </Item>
                    <Table area={Grid2.table} state={state['materialRejectionSlipItemList']} updatePage={updatePage('materialRejectionSlipItemList')} variables={state.materialRejectionSlipItemList.variables.filter(variable => applyFilter(state['materialRejectionSlipItemList'].query, variable)).toArray()} columns={state['materialRejectionSlipItemList'].columns.toArray()} />
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
