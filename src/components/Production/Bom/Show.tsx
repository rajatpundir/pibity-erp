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
import { DiffRow, BomRow, BomItemRow, ProductRow, UomRow } from '../../../main/rows'
import { Bom, BomVariable, BomItemVariable, Product, ProductVariable, Uom, UomVariable } from '../../../main/variables'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: BomVariable
    bomItemList: {
        typeName: 'BomItem'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<Array<string>>
        variable: BomItemVariable
        variables: HashSet<Immutable<BomItemVariable>>
    }
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 
    | ['variable', 'name', string]

    | ['bomItemList', 'limit', number]
    | ['bomItemList', 'offset', number]
    | ['bomItemList', 'page', number]
    | ['bomItemList', 'query', Args]
    | ['bomItemList', 'variable', 'bom', Bom]
    | ['bomItemList', 'variable', 'product', Product]
    | ['bomItemList', 'variable', 'quantity', number]
    | ['bomItemList', 'variable', 'uom', Uom]
    | ['bomItemList', 'addVariable']
    | ['replace', 'variable', BomVariable]
    | ['replace', 'bomItemList', HashSet<BomItemVariable>]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new BomVariable(-1, { name: '' }),
        bomItemList: {
            typeName: 'BomItem',
            query: getQuery('BomItem'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'bom'], ['values', 'product'], ['values', 'quantity'], ['values', 'uom']),
            variable: new BomItemVariable(-1, { bom: new Bom(-1), product: new Product(-1), quantity: 0, uom: new Uom(-1) }),
            variables: HashSet.of<BomItemVariable>()
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
                    default: {
                        const _exhaustiveCheck: never = action;
                        return _exhaustiveCheck;
                    }
                }
                break
            }
            
            case 'bomItemList': {
                switch (action[1]) {
                    case 'limit': {
                        state[action[0]].limit = Math.max(initialState.bomItemList.limit, action[2])
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
                            case 'bom': {
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
                            default: {
                                const _exhaustiveCheck: never = action;
                                return _exhaustiveCheck;
                            }
                        }
                        break
                    }
                    case 'addVariable': {
                        state.bomItemList.variables = state.bomItemList.variables.add(new BomItemVariable(-1, {bom: new Bom(state.bomItemList.variable.values.bom.hashCode()), product: new Product(state.bomItemList.variable.values.product.hashCode()), quantity: state.bomItemList.variable.values.quantity, uom: new Uom(state.bomItemList.variable.values.uom.hashCode())}))
                        state.bomItemList.variable = initialState.bomItemList.variable
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
                    case 'bomItemList': {
                        state.bomItemList.variables = action[2]
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

    const bomType = types['Bom']
    const bomItemType = types['BomItem']
    
    const [addBomItemDrawer, toggleAddBomItemDrawer] = useState(false)
    const [bomItemFilter, toggleBomItemFilter] = useState(false)
    
    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.Bom.toArray()
            var composedVariables = HashSet.of<Immutable<BomVariable>>().addAll(rows ? rows.map(x => BomRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as BomVariable])

                const bomItemRows = await db.BomItem.toArray()
                var composedBomItemVariables = HashSet.of<Immutable<BomItemVariable>>().addAll(bomItemRows ? bomItemRows.map(x => BomItemRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedBomItemVariables = composedBomItemVariables.filter(x => !diff.variables[state.bomItemList.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.bomItemList.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.bomItemList.variable.typeName].replace)
                })
                dispatch(['replace', 'bomItemList', composedBomItemVariables.filter(variable => variable.values.bom.hashCode() === props.match.params[0]) as HashSet<BomItemVariable>])
            }
        }
    }, [state.variable.typeName, state.bomItemList.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

    const bomRows = useLiveQuery(() => db.Bom.toArray())?.map(x => BomRow.toVariable(x))
    var bomList = HashSet.of<Immutable<BomVariable>>().addAll(bomRows ? bomRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        bomList = bomList.filter(x => !diff.variables.Bom.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.Bom.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.Bom.replace)
    })

    const bomItemRows = useLiveQuery(() => db.BomItem.toArray())?.map(x => BomItemRow.toVariable(x))
    var bomItemList = HashSet.of<Immutable<BomItemVariable>>().addAll(bomItemRows ? bomItemRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        bomItemList = bomItemList.filter(x => !diff.variables.BomItem.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.BomItem.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.BomItem.replace)
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

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'name': {
                dispatch(['variable', event.target.name, String(event.target.value)])
                break
            }
        }
    }
    const onBomItemInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'bom': {
                dispatch(['bomItemList', 'variable', event.target.name, new Bom(parseInt(String(event.target.value)))])
                break
            }
            case 'product': {
                dispatch(['bomItemList', 'variable', event.target.name, new Product(parseInt(String(event.target.value)))])
                break
            }
            case 'quantity': {
                dispatch(['bomItemList', 'variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
            case 'uom': {
                dispatch(['bomItemList', 'variable', event.target.name, new Uom(parseInt(String(event.target.value)))])
                break
            }
        }
    }

    const updateItemsQuery = (list: 'bomItemList') => {
        const fx = (args: Args) => {
            switch (list) {
                case 'bomItemList': {
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

    const updatePage = (list: 'bomItemList') => {
        const fx = (args: ['limit', number] | ['offset', number] | ['page', number]) => {
            dispatch([list, args[0], args[1]])
        }
        return fx
    }

    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createBom, {
            name: state.variable.values.name,
            bomItemList: state.bomItemList.variables.toArray().map(variable => {
                return {
                    bom: variable.values.bom.hashCode(),
                    product: variable.values.product.hashCode(),
                    quantity: variable.values.quantity,
                    uom: variable.values.uom.hashCode()
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteBom, {
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
                        'create': `Create Bom`,
                        'update': `Update Bom`,
                        'show': `Bom`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/bom-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/bom-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/bom-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{bomType.keys.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='text' onChange={onVariableInputChange} value={state.variable.values.name} name='name' />,
                                <div className='font-bold text-xl'>{state.variable.values.name}</div>
                            )
                        }
                    </Item>
                </Container>
                <Container area={Grid.bomItemArea} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title> Bom Item List</Title>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <button onClick={() => toggleAddBomItemDrawer(true)} className='text-3xl font-bold text-white bg-gray-800 rounded-md px-2 h-10 focus:outline-none'>+</button>,
                                undefined
                            )
                        }
                    </Item>
                    <Item area={Grid2.filter} justify='end' align='center' className='flex'>
                        <Button onClick={() => toggleBomItemFilter(true)}>Filter</Button>
                        <Drawer open={bomItemFilter} onClose={() => toggleBomItemFilter(false)} anchor={'right'}>
                            <Filter typeName='BomItem' query={state['bomItemList'].query} updateQuery={updateItemsQuery('bomItemList')} />
                        </Drawer>
                        <Drawer open={addBomItemDrawer} onClose={() => toggleAddBomItemDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add {bomItemType.name}</div>
                                <Container area={none} layout={Grid.layouts.uom} className=''>
                                    <Item>
                                        <Label>{bomItemType.keys.bom}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onBomItemInputChange} value={state.bomItemList.variable.values.bom.hashCode()} name='bom'>
                                                    <option value='' selected disabled hidden>Select BOM</option>
                                                    {bomList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(bomList.filter(x => x.id.hashCode() === state.bomItemList.variable.values.bom.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = bomList.filter(x => x.id.hashCode() === state.bomItemList.variable.values.bom.hashCode()).toArray()[0] as BomVariable
                                                            return <Link to={`/bom/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/bom/${state.bomItemList.variable.values.bom.hashCode()}`}>{state.bomItemList.variable.values.bom.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{bomItemType.keys.product}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onBomItemInputChange} value={state.bomItemList.variable.values.product.hashCode()} name='product'>
                                                    <option value='' selected disabled hidden>Select Product</option>
                                                    {productList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(productList.filter(x => x.id.hashCode() === state.bomItemList.variable.values.product.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = productList.filter(x => x.id.hashCode() === state.bomItemList.variable.values.product.hashCode()).toArray()[0] as ProductVariable
                                                            return <Link to={`/product/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/product/${state.bomItemList.variable.values.product.hashCode()}`}>{state.bomItemList.variable.values.product.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{bomItemType.keys.quantity}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='number' onChange={onBomItemInputChange} value={state.bomItemList.variable.values.quantity} name='quantity' />,
                                                <div className='font-bold text-xl'>{state.bomItemList.variable.values.quantity}</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{bomItemType.keys.uom}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onBomItemInputChange} value={state.bomItemList.variable.values.uom.hashCode()} name='uom'>
                                                    <option value='' selected disabled hidden>Select Uom</option>
                                                    {uomList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(uomList.filter(x => x.id.hashCode() === state.bomItemList.variable.values.uom.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = uomList.filter(x => x.id.hashCode() === state.bomItemList.variable.values.uom.hashCode()).toArray()[0] as UomVariable
                                                            return <Link to={`/uom/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/uom/${state.bomItemList.variable.values.uom.hashCode()}`}>{state.bomItemList.variable.values.uom.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item justify='center' align='center'>
                                        <Button onClick={() => dispatch(['bomItemList', 'addVariable'])}>Add</Button>
                                    </Item>
                                </Container>
                            </div>
                        </Drawer>
                    </Item>
                    <Table area={Grid2.table} state={state['bomItemList']} updatePage={updatePage('bomItemList')} variables={state.bomItemList.variables.filter(variable => applyFilter(state['bomItemList'].query, variable)).toArray()} columns={state['bomItemList'].columns.toArray()} />
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
