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
import { DiffRow, IndentRow, IndentItemRow, ProductRow, UomRow } from '../../../main/rows'
import { Indent, IndentVariable, IndentItemVariable, Product, ProductVariable, Uom, UomVariable } from '../../../main/variables'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: IndentVariable
    indentItemList: {
        typeName: 'IndentItem'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<Array<string>>
        variable: IndentItemVariable
        variables: HashSet<Immutable<IndentItemVariable>>
    }
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 

    | ['indentItemList', 'limit', number]
    | ['indentItemList', 'offset', number]
    | ['indentItemList', 'page', number]
    | ['indentItemList', 'query', Args]
    | ['indentItemList', 'variable', 'indent', Indent]
    | ['indentItemList', 'variable', 'product', Product]
    | ['indentItemList', 'variable', 'quantity', number]
    | ['indentItemList', 'variable', 'uom', Uom]
    | ['indentItemList', 'variable', 'ordered', number]
    | ['indentItemList', 'variable', 'received', number]
    | ['indentItemList', 'variable', 'approved', number]
    | ['indentItemList', 'variable', 'rejected', number]
    | ['indentItemList', 'variable', 'returned', number]
    | ['indentItemList', 'variable', 'requisted', number]
    | ['indentItemList', 'variable', 'consumed', number]
    | ['indentItemList', 'addVariable']
    | ['replace', 'variable', IndentVariable]
    | ['replace', 'indentItemList', HashSet<IndentItemVariable>]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new IndentVariable(-1, {  }),
        indentItemList: {
            typeName: 'IndentItem',
            query: getQuery('IndentItem'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'indent'], ['values', 'product'], ['values', 'quantity'], ['values', 'uom'], ['values', 'ordered'], ['values', 'received'], ['values', 'approved'], ['values', 'rejected'], ['values', 'returned'], ['values', 'requisted'], ['values', 'consumed']),
            variable: new IndentItemVariable(-1, { indent: new Indent(-1), product: new Product(-1), quantity: 0, uom: new Uom(-1), ordered: 0, received: 0, approved: 0, rejected: 0, returned: 0, requisted: 0, consumed: 0 }),
            variables: HashSet.of<IndentItemVariable>()
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
            
            
            case 'indentItemList': {
                switch (action[1]) {
                    case 'limit': {
                        state[action[0]].limit = Math.max(initialState.indentItemList.limit, action[2])
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
                            case 'indent': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'product': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'quantity': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'uom': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'ordered': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'received': {
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
                            case 'returned': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'requisted': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'consumed': {
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
                        state.indentItemList.variables = state.indentItemList.variables.add(new IndentItemVariable(-1, {indent: new Indent(state.indentItemList.variable.values.indent.hashCode()), product: new Product(state.indentItemList.variable.values.product.hashCode()), quantity: state.indentItemList.variable.values.quantity, uom: new Uom(state.indentItemList.variable.values.uom.hashCode()), ordered: state.indentItemList.variable.values.ordered, received: state.indentItemList.variable.values.received, approved: state.indentItemList.variable.values.approved, rejected: state.indentItemList.variable.values.rejected, returned: state.indentItemList.variable.values.returned, requisted: state.indentItemList.variable.values.requisted, consumed: state.indentItemList.variable.values.consumed}))
                        state.indentItemList.variable = initialState.indentItemList.variable
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
                    case 'indentItemList': {
                        state.indentItemList.variables = action[2]
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

    
    const indentItemType = types['IndentItem']
    
    const [addIndentItemDrawer, toggleAddIndentItemDrawer] = useState(false)
    const [indentItemFilter, toggleIndentItemFilter] = useState(false)
    
    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.Indent.toArray()
            var composedVariables = HashSet.of<Immutable<IndentVariable>>().addAll(rows ? rows.map(x => IndentRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as IndentVariable])

                const indentItemRows = await db.IndentItem.toArray()
                var composedIndentItemVariables = HashSet.of<Immutable<IndentItemVariable>>().addAll(indentItemRows ? indentItemRows.map(x => IndentItemRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedIndentItemVariables = composedIndentItemVariables.filter(x => !diff.variables[state.indentItemList.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.indentItemList.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.indentItemList.variable.typeName].replace)
                })
                dispatch(['replace', 'indentItemList', composedIndentItemVariables.filter(variable => variable.values.indent.hashCode() === props.match.params[0]) as HashSet<IndentItemVariable>])
            }
        }
    }, [state.variable.typeName, state.indentItemList.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

    const indentRows = useLiveQuery(() => db.Indent.toArray())?.map(x => IndentRow.toVariable(x))
    var indentList = HashSet.of<Immutable<IndentVariable>>().addAll(indentRows ? indentRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        indentList = indentList.filter(x => !diff.variables.Indent.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.Indent.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.Indent.replace)
    })

    const indentItemRows = useLiveQuery(() => db.IndentItem.toArray())?.map(x => IndentItemRow.toVariable(x))
    var indentItemList = HashSet.of<Immutable<IndentItemVariable>>().addAll(indentItemRows ? indentItemRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        indentItemList = indentItemList.filter(x => !diff.variables.IndentItem.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.IndentItem.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.IndentItem.replace)
    })

    const productRows = useLiveQuery(() => db.Product.toArray())?.map(x => ProductRow.toVariable(x))
    var productList = HashSet.of<Immutable<ProductVariable>>().addAll(productRows ? productRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        productList = productList.filter(x => !diff.variables.Product.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.Product.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.Product.replace)
    })

    const uomRows = useLiveQuery(() => db.Uom.toArray())?.map(x => UomRow.toVariable(x))
    var uomList = HashSet.of<Immutable<UomVariable>>().addAll(uomRows ? uomRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        uomList = uomList.filter(x => !diff.variables.Uom.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.Uom.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.Uom.replace)
    })


    const onIndentItemInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'indent': {
                dispatch(['indentItemList', 'variable', event.target.name, new Indent(parseInt(String(event.target.value)))])
                break
            }
            case 'product': {
                dispatch(['indentItemList', 'variable', event.target.name, new Product(parseInt(String(event.target.value)))])
                break
            }
            case 'quantity': {
                dispatch(['indentItemList', 'variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
            case 'uom': {
                dispatch(['indentItemList', 'variable', event.target.name, new Uom(parseInt(String(event.target.value)))])
                break
            }
            case 'ordered': {
                dispatch(['indentItemList', 'variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
            case 'received': {
                dispatch(['indentItemList', 'variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
            case 'approved': {
                dispatch(['indentItemList', 'variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
            case 'rejected': {
                dispatch(['indentItemList', 'variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
            case 'returned': {
                dispatch(['indentItemList', 'variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
            case 'requisted': {
                dispatch(['indentItemList', 'variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
            case 'consumed': {
                dispatch(['indentItemList', 'variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
        }
    }

    const updateItemsQuery = (list: 'indentItemList') => {
        const fx = (args: Args) => {
            switch (list) {
                case 'indentItemList': {
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

    const updatePage = (list: 'indentItemList') => {
        const fx = (args: ['limit', number] | ['offset', number] | ['page', number]) => {
            dispatch([list, args[0], args[1]])
        }
        return fx
    }

    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createIndent, {            indentItemList: state.indentItemList.variables.toArray().map(variable => {
                return {
                    indent: variable.values.indent.hashCode(),
                    product: variable.values.product.hashCode(),
                    quantity: variable.values.quantity,
                    uom: variable.values.uom.hashCode(),
                    ordered: variable.values.ordered,
                    received: variable.values.received,
                    approved: variable.values.approved,
                    rejected: variable.values.rejected,
                    returned: variable.values.returned,
                    requisted: variable.values.requisted,
                    consumed: variable.values.consumed
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteIndent, {
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
                        'create': `Create Indent`,
                        'update': `Update Indent`,
                        'show': `Indent`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/indent-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/indent-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/indent-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>

                </Container>
                <Container area={Grid.indentItemArea} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title> Indent Item List</Title>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <button onClick={() => toggleAddIndentItemDrawer(true)} className='text-3xl font-bold text-white bg-gray-800 rounded-md px-2 h-10 focus:outline-none'>+</button>,
                                undefined
                            )
                        }
                    </Item>
                    <Item area={Grid2.filter} justify='end' align='center' className='flex'>
                        <Button onClick={() => toggleIndentItemFilter(true)}>Filter</Button>
                        <Drawer open={indentItemFilter} onClose={() => toggleIndentItemFilter(false)} anchor={'right'}>
                            <Filter typeName='IndentItem' query={state['indentItemList'].query} updateQuery={updateItemsQuery('indentItemList')} />
                        </Drawer>
                        <Drawer open={addIndentItemDrawer} onClose={() => toggleAddIndentItemDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add {indentItemType.name}</div>
                                <Container area={none} layout={Grid.layouts.uom} className=''>
                                    <Item>
                                        <Label>{indentItemType.keys.indent}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onIndentItemInputChange} value={state.indentItemList.variable.values.indent.hashCode()} name='indent'>
                                                    <option value='' selected disabled hidden>Select Indent</option>
                                                    {indentList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(indentList.filter(x => x.id.hashCode() === state.indentItemList.variable.values.indent.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = indentList.filter(x => x.id.hashCode() === state.indentItemList.variable.values.indent.hashCode()).toArray()[0] as IndentVariable
                                                            return <Link to={`/indent/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/indent/${state.indentItemList.variable.values.indent.hashCode()}`}>{state.indentItemList.variable.values.indent.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{indentItemType.keys.product}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onIndentItemInputChange} value={state.indentItemList.variable.values.product.hashCode()} name='product'>
                                                    <option value='' selected disabled hidden>Select Product</option>
                                                    {productList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(productList.filter(x => x.id.hashCode() === state.indentItemList.variable.values.product.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = productList.filter(x => x.id.hashCode() === state.indentItemList.variable.values.product.hashCode()).toArray()[0] as ProductVariable
                                                            return <Link to={`/product/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/product/${state.indentItemList.variable.values.product.hashCode()}`}>{state.indentItemList.variable.values.product.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{indentItemType.keys.quantity}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='number' onChange={onIndentItemInputChange} value={state.indentItemList.variable.values.quantity} name='quantity' />,
                                                <div className='font-bold text-xl'>{state.indentItemList.variable.values.quantity}</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{indentItemType.keys.uom}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onIndentItemInputChange} value={state.indentItemList.variable.values.uom.hashCode()} name='uom'>
                                                    <option value='' selected disabled hidden>Select Uom</option>
                                                    {uomList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(uomList.filter(x => x.id.hashCode() === state.indentItemList.variable.values.uom.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = uomList.filter(x => x.id.hashCode() === state.indentItemList.variable.values.uom.hashCode()).toArray()[0] as UomVariable
                                                            return <Link to={`/uom/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/uom/${state.indentItemList.variable.values.uom.hashCode()}`}>{state.indentItemList.variable.values.uom.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{indentItemType.keys.ordered}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='number' onChange={onIndentItemInputChange} value={state.indentItemList.variable.values.ordered} name='ordered' />,
                                                <div className='font-bold text-xl'>{state.indentItemList.variable.values.ordered}</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{indentItemType.keys.received}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='number' onChange={onIndentItemInputChange} value={state.indentItemList.variable.values.received} name='received' />,
                                                <div className='font-bold text-xl'>{state.indentItemList.variable.values.received}</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{indentItemType.keys.approved}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='number' onChange={onIndentItemInputChange} value={state.indentItemList.variable.values.approved} name='approved' />,
                                                <div className='font-bold text-xl'>{state.indentItemList.variable.values.approved}</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{indentItemType.keys.rejected}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='number' onChange={onIndentItemInputChange} value={state.indentItemList.variable.values.rejected} name='rejected' />,
                                                <div className='font-bold text-xl'>{state.indentItemList.variable.values.rejected}</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{indentItemType.keys.returned}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='number' onChange={onIndentItemInputChange} value={state.indentItemList.variable.values.returned} name='returned' />,
                                                <div className='font-bold text-xl'>{state.indentItemList.variable.values.returned}</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{indentItemType.keys.requisted}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='number' onChange={onIndentItemInputChange} value={state.indentItemList.variable.values.requisted} name='requisted' />,
                                                <div className='font-bold text-xl'>{state.indentItemList.variable.values.requisted}</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{indentItemType.keys.consumed}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='number' onChange={onIndentItemInputChange} value={state.indentItemList.variable.values.consumed} name='consumed' />,
                                                <div className='font-bold text-xl'>{state.indentItemList.variable.values.consumed}</div>
                                            )
                                        }
                                    </Item>
                                    <Item justify='center' align='center'>
                                        <Button onClick={() => dispatch(['indentItemList', 'addVariable'])}>Add</Button>
                                    </Item>
                                </Container>
                            </div>
                        </Drawer>
                    </Item>
                    <Table area={Grid2.table} state={state['indentItemList']} updatePage={updatePage('indentItemList')} variables={state.indentItemList.variables.filter(variable => applyFilter(state['indentItemList'].query, variable)).toArray()} columns={state['indentItemList'].columns.toArray()} />
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
