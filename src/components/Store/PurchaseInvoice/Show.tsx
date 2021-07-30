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
import { DiffRow, PurchaseInvoiceRow, PurchaseInvoiceItemRow, PurchaseOrderRow, PurchaseOrderItemRow } from '../../../main/rows'
import { PurchaseInvoice, PurchaseInvoiceVariable, PurchaseInvoiceItem, PurchaseInvoiceItemVariable, PurchaseOrder, PurchaseOrderVariable, PurchaseOrderItem, PurchaseOrderItemVariable } from '../../../main/variables'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: PurchaseInvoiceVariable
    purchaseInvoiceItemList: {
        typeName: 'PurchaseInvoiceItem'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<Array<string>>
        variable: PurchaseInvoiceItemVariable
        variables: HashSet<Immutable<PurchaseInvoiceItemVariable>>
    }
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 
    | ['variable', 'purchaseOrder', PurchaseOrder]

    | ['purchaseInvoiceItemList', 'limit', number]
    | ['purchaseInvoiceItemList', 'offset', number]
    | ['purchaseInvoiceItemList', 'page', number]
    | ['purchaseInvoiceItemList', 'query', Args]
    | ['purchaseInvoiceItemList', 'variable', 'purchaseInvoice', PurchaseInvoice]
    | ['purchaseInvoiceItemList', 'variable', 'purchaseOrderItem', PurchaseOrderItem]
    | ['purchaseInvoiceItemList', 'variable', 'quantity', number]
    | ['purchaseInvoiceItemList', 'variable', 'approved', number]
    | ['purchaseInvoiceItemList', 'variable', 'rejected', number]
    | ['purchaseInvoiceItemList', 'addVariable']
    | ['replace', 'variable', PurchaseInvoiceVariable]
    | ['replace', 'purchaseInvoiceItemList', HashSet<PurchaseInvoiceItemVariable>]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new PurchaseInvoiceVariable(-1, { purchaseOrder: new PurchaseOrder(-1) }),
        purchaseInvoiceItemList: {
            typeName: 'PurchaseInvoiceItem',
            query: getQuery('PurchaseInvoiceItem'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'purchaseInvoice'], ['values', 'purchaseOrderItem'], ['values', 'quantity'], ['values', 'approved'], ['values', 'rejected']),
            variable: new PurchaseInvoiceItemVariable(-1, { purchaseInvoice: new PurchaseInvoice(-1), purchaseOrderItem: new PurchaseOrderItem(-1), quantity: 0, approved: 0, rejected: 0 }),
            variables: HashSet.of<PurchaseInvoiceItemVariable>()
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
                    case 'purchaseOrder': {
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
            
            case 'purchaseInvoiceItemList': {
                switch (action[1]) {
                    case 'limit': {
                        state[action[0]].limit = Math.max(initialState.purchaseInvoiceItemList.limit, action[2])
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
                            case 'purchaseInvoice': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'purchaseOrderItem': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'quantity': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'approved': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'rejected': {
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
                        state.purchaseInvoiceItemList.variables = state.purchaseInvoiceItemList.variables.add(new PurchaseInvoiceItemVariable(-1, {purchaseInvoice: new PurchaseInvoice(state.purchaseInvoiceItemList.variable.values.purchaseInvoice.hashCode()), purchaseOrderItem: new PurchaseOrderItem(state.purchaseInvoiceItemList.variable.values.purchaseOrderItem.hashCode()), quantity: state.purchaseInvoiceItemList.variable.values.quantity, approved: state.purchaseInvoiceItemList.variable.values.approved, rejected: state.purchaseInvoiceItemList.variable.values.rejected}))
                        state.purchaseInvoiceItemList.variable = initialState.purchaseInvoiceItemList.variable
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
                    case 'purchaseInvoiceItemList': {
                        state.purchaseInvoiceItemList.variables = action[2]
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

    const purchaseInvoiceType = types['PurchaseInvoice']
    const purchaseInvoiceItemType = types['PurchaseInvoiceItem']
    
    const [addPurchaseInvoiceItemDrawer, toggleAddPurchaseInvoiceItemDrawer] = useState(false)
    const [purchaseInvoiceItemFilter, togglePurchaseInvoiceItemFilter] = useState(false)
    
    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.PurchaseInvoice.toArray()
            var composedVariables = HashSet.of<Immutable<PurchaseInvoiceVariable>>().addAll(rows ? rows.map(x => PurchaseInvoiceRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as PurchaseInvoiceVariable])

                const purchaseInvoiceItemRows = await db.PurchaseInvoiceItem.toArray()
                var composedPurchaseInvoiceItemVariables = HashSet.of<Immutable<PurchaseInvoiceItemVariable>>().addAll(purchaseInvoiceItemRows ? purchaseInvoiceItemRows.map(x => PurchaseInvoiceItemRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedPurchaseInvoiceItemVariables = composedPurchaseInvoiceItemVariables.filter(x => !diff.variables[state.purchaseInvoiceItemList.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.purchaseInvoiceItemList.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.purchaseInvoiceItemList.variable.typeName].replace)
                })
                dispatch(['replace', 'purchaseInvoiceItemList', composedPurchaseInvoiceItemVariables.filter(variable => variable.values.purchaseInvoice.hashCode() === props.match.params[0]) as HashSet<PurchaseInvoiceItemVariable>])
            }
        }
    }, [state.variable.typeName, state.purchaseInvoiceItemList.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

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

    const purchaseOrderRows = useLiveQuery(() => db.PurchaseOrder.toArray())?.map(x => PurchaseOrderRow.toVariable(x))
    var purchaseOrderList = HashSet.of<Immutable<PurchaseOrderVariable>>().addAll(purchaseOrderRows ? purchaseOrderRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        purchaseOrderList = purchaseOrderList.filter(x => !diff.variables.PurchaseOrder.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.PurchaseOrder.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.PurchaseOrder.replace)
    })

    const purchaseOrderItemRows = useLiveQuery(() => db.PurchaseOrderItem.toArray())?.map(x => PurchaseOrderItemRow.toVariable(x))
    var purchaseOrderItemList = HashSet.of<Immutable<PurchaseOrderItemVariable>>().addAll(purchaseOrderItemRows ? purchaseOrderItemRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        purchaseOrderItemList = purchaseOrderItemList.filter(x => !diff.variables.PurchaseOrderItem.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.PurchaseOrderItem.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.PurchaseOrderItem.replace)
    })

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'purchaseOrder': {
                dispatch(['variable', event.target.name, new PurchaseOrder(parseInt(String(event.target.value)))])
                break
            }
        }
    }
    const onPurchaseInvoiceItemInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'purchaseInvoice': {
                dispatch(['purchaseInvoiceItemList', 'variable', event.target.name, new PurchaseInvoice(parseInt(String(event.target.value)))])
                break
            }
            case 'purchaseOrderItem': {
                dispatch(['purchaseInvoiceItemList', 'variable', event.target.name, new PurchaseOrderItem(parseInt(String(event.target.value)))])
                break
            }
            case 'quantity': {
                dispatch(['purchaseInvoiceItemList', 'variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
            case 'approved': {
                dispatch(['purchaseInvoiceItemList', 'variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
            case 'rejected': {
                dispatch(['purchaseInvoiceItemList', 'variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
        }
    }

    const updateItemsQuery = (list: 'purchaseInvoiceItemList') => {
        const fx = (args: Args) => {
            switch (list) {
                case 'purchaseInvoiceItemList': {
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

    const updatePage = (list: 'purchaseInvoiceItemList') => {
        const fx = (args: ['limit', number] | ['offset', number] | ['page', number]) => {
            dispatch([list, args[0], args[1]])
        }
        return fx
    }

    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createPurchaseInvoice, {
            purchaseOrder: state.variable.values.purchaseOrder.hashCode(),
            purchaseInvoiceItemList: state.purchaseInvoiceItemList.variables.toArray().map(variable => {
                return {
                    purchaseInvoice: variable.values.purchaseInvoice.hashCode(),
                    purchaseOrderItem: variable.values.purchaseOrderItem.hashCode(),
                    quantity: variable.values.quantity,
                    approved: variable.values.approved,
                    rejected: variable.values.rejected
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deletePurchaseInvoice, {
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
                        'create': `Create Purchase Invoice`,
                        'update': `Update Purchase Invoice`,
                        'show': `Purchase Invoice`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/purchase-invoice-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/purchase-invoice-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/purchase-invoice-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{purchaseInvoiceType.keys.purchaseOrder}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.purchaseOrder.hashCode()} name='purchaseOrder'>
                                    <option value='' selected disabled hidden>Select Purchase Order</option>
                                    {purchaseOrderList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(purchaseOrderList.filter(x => x.id.hashCode() === state.variable.values.purchaseOrder.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = purchaseOrderList.filter(x => x.id.hashCode() === state.variable.values.purchaseOrder.hashCode()).toArray()[0] as PurchaseOrderVariable
                                            return <Link to={`/purchase-order/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/purchase-order/${state.variable.values.purchaseOrder.hashCode()}`}>{state.variable.values.purchaseOrder.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                </Container>
                <Container area={Grid.purchaseInvoiceItemArea} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title> Purchase Invoice Item List</Title>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <button onClick={() => toggleAddPurchaseInvoiceItemDrawer(true)} className='text-3xl font-bold text-white bg-gray-800 rounded-md px-2 h-10 focus:outline-none'>+</button>,
                                undefined
                            )
                        }
                    </Item>
                    <Item area={Grid2.filter} justify='end' align='center' className='flex'>
                        <Button onClick={() => togglePurchaseInvoiceItemFilter(true)}>Filter</Button>
                        <Drawer open={purchaseInvoiceItemFilter} onClose={() => togglePurchaseInvoiceItemFilter(false)} anchor={'right'}>
                            <Filter typeName='PurchaseInvoiceItem' query={state['purchaseInvoiceItemList'].query} updateQuery={updateItemsQuery('purchaseInvoiceItemList')} />
                        </Drawer>
                        <Drawer open={addPurchaseInvoiceItemDrawer} onClose={() => toggleAddPurchaseInvoiceItemDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add {purchaseInvoiceItemType.name}</div>
                                <Container area={none} layout={Grid.layouts.uom} className=''>
                                    <Item>
                                        <Label>{purchaseInvoiceItemType.keys.purchaseInvoice}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onPurchaseInvoiceItemInputChange} value={state.purchaseInvoiceItemList.variable.values.purchaseInvoice.hashCode()} name='purchaseInvoice'>
                                                    <option value='' selected disabled hidden>Select Purchase Invoice</option>
                                                    {purchaseInvoiceList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(purchaseInvoiceList.filter(x => x.id.hashCode() === state.purchaseInvoiceItemList.variable.values.purchaseInvoice.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = purchaseInvoiceList.filter(x => x.id.hashCode() === state.purchaseInvoiceItemList.variable.values.purchaseInvoice.hashCode()).toArray()[0] as PurchaseInvoiceVariable
                                                            return <Link to={`/purchase-invoice/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/purchase-invoice/${state.purchaseInvoiceItemList.variable.values.purchaseInvoice.hashCode()}`}>{state.purchaseInvoiceItemList.variable.values.purchaseInvoice.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{purchaseInvoiceItemType.keys.purchaseOrderItem}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onPurchaseInvoiceItemInputChange} value={state.purchaseInvoiceItemList.variable.values.purchaseOrderItem.hashCode()} name='purchaseOrderItem'>
                                                    <option value='' selected disabled hidden>Select Purchase Order Item</option>
                                                    {purchaseOrderItemList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(purchaseOrderItemList.filter(x => x.id.hashCode() === state.purchaseInvoiceItemList.variable.values.purchaseOrderItem.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = purchaseOrderItemList.filter(x => x.id.hashCode() === state.purchaseInvoiceItemList.variable.values.purchaseOrderItem.hashCode()).toArray()[0] as PurchaseOrderItemVariable
                                                            return <Link to={`/purchase-order-item/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/purchase-order-item/${state.purchaseInvoiceItemList.variable.values.purchaseOrderItem.hashCode()}`}>{state.purchaseInvoiceItemList.variable.values.purchaseOrderItem.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{purchaseInvoiceItemType.keys.quantity}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='number' onChange={onPurchaseInvoiceItemInputChange} value={state.purchaseInvoiceItemList.variable.values.quantity} name='quantity' />,
                                                <div className='font-bold text-xl'>{state.purchaseInvoiceItemList.variable.values.quantity}</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{purchaseInvoiceItemType.keys.approved}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='number' onChange={onPurchaseInvoiceItemInputChange} value={state.purchaseInvoiceItemList.variable.values.approved} name='approved' />,
                                                <div className='font-bold text-xl'>{state.purchaseInvoiceItemList.variable.values.approved}</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{purchaseInvoiceItemType.keys.rejected}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='number' onChange={onPurchaseInvoiceItemInputChange} value={state.purchaseInvoiceItemList.variable.values.rejected} name='rejected' />,
                                                <div className='font-bold text-xl'>{state.purchaseInvoiceItemList.variable.values.rejected}</div>
                                            )
                                        }
                                    </Item>
                                    <Item justify='center' align='center'>
                                        <Button onClick={() => dispatch(['purchaseInvoiceItemList', 'addVariable'])}>Add</Button>
                                    </Item>
                                </Container>
                            </div>
                        </Drawer>
                    </Item>
                    <Table area={Grid2.table} state={state['purchaseInvoiceItemList']} updatePage={updatePage('purchaseInvoiceItemList')} variables={state.purchaseInvoiceItemList.variables.filter(variable => applyFilter(state['purchaseInvoiceItemList'].query, variable)).toArray()} columns={state['purchaseInvoiceItemList'].columns.toArray()} />
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
