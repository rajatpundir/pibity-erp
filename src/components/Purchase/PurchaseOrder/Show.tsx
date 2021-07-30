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
import { DiffRow, PurchaseOrderRow, PurchaseOrderItemRow, QuotationRow, QuotationItemRow } from '../../../main/rows'
import { PurchaseOrder, PurchaseOrderVariable, PurchaseOrderItem, PurchaseOrderItemVariable, Quotation, QuotationVariable, QuotationItem, QuotationItemVariable } from '../../../main/variables'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: PurchaseOrderVariable
    purchaseOrderItemList: {
        typeName: 'PurchaseOrderItem'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<Array<string>>
        variable: PurchaseOrderItemVariable
        variables: HashSet<Immutable<PurchaseOrderItemVariable>>
    }
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 
    | ['variable', 'quotation', Quotation]

    | ['purchaseOrderItemList', 'limit', number]
    | ['purchaseOrderItemList', 'offset', number]
    | ['purchaseOrderItemList', 'page', number]
    | ['purchaseOrderItemList', 'query', Args]
    | ['purchaseOrderItemList', 'variable', 'purchaseOrder', PurchaseOrder]
    | ['purchaseOrderItemList', 'variable', 'quotationItem', QuotationItem]
    | ['purchaseOrderItemList', 'variable', 'quantity', number]
    | ['purchaseOrderItemList', 'variable', 'price', number]
    | ['purchaseOrderItemList', 'variable', 'received', number]
    | ['purchaseOrderItemList', 'addVariable']
    | ['replace', 'variable', PurchaseOrderVariable]
    | ['replace', 'purchaseOrderItemList', HashSet<PurchaseOrderItemVariable>]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new PurchaseOrderVariable(-1, { quotation: new Quotation(-1) }),
        purchaseOrderItemList: {
            typeName: 'PurchaseOrderItem',
            query: getQuery('PurchaseOrderItem'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'purchaseOrder'], ['values', 'quotationItem'], ['values', 'quantity'], ['values', 'price'], ['values', 'received']),
            variable: new PurchaseOrderItemVariable(-1, { purchaseOrder: new PurchaseOrder(-1), quotationItem: new QuotationItem(-1), quantity: 0, price: 0, received: 0 }),
            variables: HashSet.of<PurchaseOrderItemVariable>()
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
                    case 'quotation': {
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
            
            case 'purchaseOrderItemList': {
                switch (action[1]) {
                    case 'limit': {
                        state[action[0]].limit = Math.max(initialState.purchaseOrderItemList.limit, action[2])
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
                            case 'purchaseOrder': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'quotationItem': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'quantity': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'price': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'received': {
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
                        state.purchaseOrderItemList.variables = state.purchaseOrderItemList.variables.add(new PurchaseOrderItemVariable(-1, {purchaseOrder: new PurchaseOrder(state.purchaseOrderItemList.variable.values.purchaseOrder.hashCode()), quotationItem: new QuotationItem(state.purchaseOrderItemList.variable.values.quotationItem.hashCode()), quantity: state.purchaseOrderItemList.variable.values.quantity, price: state.purchaseOrderItemList.variable.values.price, received: state.purchaseOrderItemList.variable.values.received}))
                        state.purchaseOrderItemList.variable = initialState.purchaseOrderItemList.variable
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
                    case 'purchaseOrderItemList': {
                        state.purchaseOrderItemList.variables = action[2]
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

    const purchaseOrderType = types['PurchaseOrder']
    const purchaseOrderItemType = types['PurchaseOrderItem']
    
    const [addPurchaseOrderItemDrawer, toggleAddPurchaseOrderItemDrawer] = useState(false)
    const [purchaseOrderItemFilter, togglePurchaseOrderItemFilter] = useState(false)
    
    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.PurchaseOrder.toArray()
            var composedVariables = HashSet.of<Immutable<PurchaseOrderVariable>>().addAll(rows ? rows.map(x => PurchaseOrderRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as PurchaseOrderVariable])

                const purchaseOrderItemRows = await db.PurchaseOrderItem.toArray()
                var composedPurchaseOrderItemVariables = HashSet.of<Immutable<PurchaseOrderItemVariable>>().addAll(purchaseOrderItemRows ? purchaseOrderItemRows.map(x => PurchaseOrderItemRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedPurchaseOrderItemVariables = composedPurchaseOrderItemVariables.filter(x => !diff.variables[state.purchaseOrderItemList.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.purchaseOrderItemList.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.purchaseOrderItemList.variable.typeName].replace)
                })
                dispatch(['replace', 'purchaseOrderItemList', composedPurchaseOrderItemVariables.filter(variable => variable.values.purchaseOrder.hashCode() === props.match.params[0]) as HashSet<PurchaseOrderItemVariable>])
            }
        }
    }, [state.variable.typeName, state.purchaseOrderItemList.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

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

    const quotationRows = useLiveQuery(() => db.Quotation.toArray())?.map(x => QuotationRow.toVariable(x))
    var quotationList = HashSet.of<Immutable<QuotationVariable>>().addAll(quotationRows ? quotationRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        quotationList = quotationList.filter(x => !diff.variables.Quotation.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.Quotation.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.Quotation.replace)
    })

    const quotationItemRows = useLiveQuery(() => db.QuotationItem.toArray())?.map(x => QuotationItemRow.toVariable(x))
    var quotationItemList = HashSet.of<Immutable<QuotationItemVariable>>().addAll(quotationItemRows ? quotationItemRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        quotationItemList = quotationItemList.filter(x => !diff.variables.QuotationItem.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.QuotationItem.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.QuotationItem.replace)
    })

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'quotation': {
                dispatch(['variable', event.target.name, new Quotation(parseInt(String(event.target.value)))])
                break
            }
        }
    }
    const onPurchaseOrderItemInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'purchaseOrder': {
                dispatch(['purchaseOrderItemList', 'variable', event.target.name, new PurchaseOrder(parseInt(String(event.target.value)))])
                break
            }
            case 'quotationItem': {
                dispatch(['purchaseOrderItemList', 'variable', event.target.name, new QuotationItem(parseInt(String(event.target.value)))])
                break
            }
            case 'quantity': {
                dispatch(['purchaseOrderItemList', 'variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
            case 'price': {
                dispatch(['purchaseOrderItemList', 'variable', event.target.name, parseFloat(String(event.target.value))])
                break
            }
            case 'received': {
                dispatch(['purchaseOrderItemList', 'variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
        }
    }

    const updateItemsQuery = (list: 'purchaseOrderItemList') => {
        const fx = (args: Args) => {
            switch (list) {
                case 'purchaseOrderItemList': {
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

    const updatePage = (list: 'purchaseOrderItemList') => {
        const fx = (args: ['limit', number] | ['offset', number] | ['page', number]) => {
            dispatch([list, args[0], args[1]])
        }
        return fx
    }

    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createPurchaseOrder, {
            quotation: state.variable.values.quotation.hashCode(),
            purchaseOrderItemList: state.purchaseOrderItemList.variables.toArray().map(variable => {
                return {
                    purchaseOrder: variable.values.purchaseOrder.hashCode(),
                    quotationItem: variable.values.quotationItem.hashCode(),
                    quantity: variable.values.quantity,
                    price: variable.values.price,
                    received: variable.values.received
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deletePurchaseOrder, {
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
                        'create': `Create Purchase Order`,
                        'update': `Update Purchase Order`,
                        'show': `Purchase Order`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/purchase-order-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/purchase-order-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/purchase-order-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{purchaseOrderType.keys.quotation}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.quotation.hashCode()} name='quotation'>
                                    <option value='' selected disabled hidden>Select Quotation</option>
                                    {quotationList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(quotationList.filter(x => x.id.hashCode() === state.variable.values.quotation.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = quotationList.filter(x => x.id.hashCode() === state.variable.values.quotation.hashCode()).toArray()[0] as QuotationVariable
                                            return <Link to={`/quotation/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/quotation/${state.variable.values.quotation.hashCode()}`}>{state.variable.values.quotation.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                </Container>
                <Container area={Grid.purchaseOrderItemArea} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title> Purchase Order Item List</Title>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <button onClick={() => toggleAddPurchaseOrderItemDrawer(true)} className='text-3xl font-bold text-white bg-gray-800 rounded-md px-2 h-10 focus:outline-none'>+</button>,
                                undefined
                            )
                        }
                    </Item>
                    <Item area={Grid2.filter} justify='end' align='center' className='flex'>
                        <Button onClick={() => togglePurchaseOrderItemFilter(true)}>Filter</Button>
                        <Drawer open={purchaseOrderItemFilter} onClose={() => togglePurchaseOrderItemFilter(false)} anchor={'right'}>
                            <Filter typeName='PurchaseOrderItem' query={state['purchaseOrderItemList'].query} updateQuery={updateItemsQuery('purchaseOrderItemList')} />
                        </Drawer>
                        <Drawer open={addPurchaseOrderItemDrawer} onClose={() => toggleAddPurchaseOrderItemDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add {purchaseOrderItemType.name}</div>
                                <Container area={none} layout={Grid.layouts.uom} className=''>
                                    <Item>
                                        <Label>{purchaseOrderItemType.keys.purchaseOrder}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onPurchaseOrderItemInputChange} value={state.purchaseOrderItemList.variable.values.purchaseOrder.hashCode()} name='purchaseOrder'>
                                                    <option value='' selected disabled hidden>Select Purchase Order</option>
                                                    {purchaseOrderList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(purchaseOrderList.filter(x => x.id.hashCode() === state.purchaseOrderItemList.variable.values.purchaseOrder.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = purchaseOrderList.filter(x => x.id.hashCode() === state.purchaseOrderItemList.variable.values.purchaseOrder.hashCode()).toArray()[0] as PurchaseOrderVariable
                                                            return <Link to={`/purchase-order/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/purchase-order/${state.purchaseOrderItemList.variable.values.purchaseOrder.hashCode()}`}>{state.purchaseOrderItemList.variable.values.purchaseOrder.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{purchaseOrderItemType.keys.quotationItem}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onPurchaseOrderItemInputChange} value={state.purchaseOrderItemList.variable.values.quotationItem.hashCode()} name='quotationItem'>
                                                    <option value='' selected disabled hidden>Select Quotation Item</option>
                                                    {quotationItemList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(quotationItemList.filter(x => x.id.hashCode() === state.purchaseOrderItemList.variable.values.quotationItem.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = quotationItemList.filter(x => x.id.hashCode() === state.purchaseOrderItemList.variable.values.quotationItem.hashCode()).toArray()[0] as QuotationItemVariable
                                                            return <Link to={`/quotation-item/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/quotation-item/${state.purchaseOrderItemList.variable.values.quotationItem.hashCode()}`}>{state.purchaseOrderItemList.variable.values.quotationItem.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{purchaseOrderItemType.keys.quantity}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='number' onChange={onPurchaseOrderItemInputChange} value={state.purchaseOrderItemList.variable.values.quantity} name='quantity' />,
                                                <div className='font-bold text-xl'>{state.purchaseOrderItemList.variable.values.quantity}</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{purchaseOrderItemType.keys.price}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='number' onChange={onPurchaseOrderItemInputChange} value={state.purchaseOrderItemList.variable.values.price} name='price' />,
                                                <div className='font-bold text-xl'>{state.purchaseOrderItemList.variable.values.price}</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{purchaseOrderItemType.keys.received}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='number' onChange={onPurchaseOrderItemInputChange} value={state.purchaseOrderItemList.variable.values.received} name='received' />,
                                                <div className='font-bold text-xl'>{state.purchaseOrderItemList.variable.values.received}</div>
                                            )
                                        }
                                    </Item>
                                    <Item justify='center' align='center'>
                                        <Button onClick={() => dispatch(['purchaseOrderItemList', 'addVariable'])}>Add</Button>
                                    </Item>
                                </Container>
                            </div>
                        </Drawer>
                    </Item>
                    <Table area={Grid2.table} state={state['purchaseOrderItemList']} updatePage={updatePage('purchaseOrderItemList')} variables={state.purchaseOrderItemList.variables.filter(variable => applyFilter(state['purchaseOrderItemList'].query, variable)).toArray()} columns={state['purchaseOrderItemList'].columns.toArray()} />
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
