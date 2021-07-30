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
import { DiffRow, MaterialApprovalSlipRow, MaterialApprovalSlipItemRow, MaterialRequistionSlipRow, MaterialRequistionSlipItemRow } from '../../../main/rows'
import { MaterialApprovalSlip, MaterialApprovalSlipVariable, MaterialApprovalSlipItem, MaterialApprovalSlipItemVariable, MaterialRequistionSlip, MaterialRequistionSlipVariable, MaterialRequistionSlipItem, MaterialRequistionSlipItemVariable } from '../../../main/variables'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: MaterialRequistionSlipVariable
    materialRequistionSlipItemList: {
        typeName: 'MaterialRequistionSlipItem'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<Array<string>>
        variable: MaterialRequistionSlipItemVariable
        variables: HashSet<Immutable<MaterialRequistionSlipItemVariable>>
    }
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 
    | ['variable', 'materialApprovalSlip', MaterialApprovalSlip]

    | ['materialRequistionSlipItemList', 'limit', number]
    | ['materialRequistionSlipItemList', 'offset', number]
    | ['materialRequistionSlipItemList', 'page', number]
    | ['materialRequistionSlipItemList', 'query', Args]
    | ['materialRequistionSlipItemList', 'variable', 'materialRequistionSlip', MaterialRequistionSlip]
    | ['materialRequistionSlipItemList', 'variable', 'materialApprovalSlipItem', MaterialApprovalSlipItem]
    | ['materialRequistionSlipItemList', 'variable', 'quantity', number]
    | ['materialRequistionSlipItemList', 'variable', 'consumed', number]
    | ['materialRequistionSlipItemList', 'addVariable']
    | ['replace', 'variable', MaterialRequistionSlipVariable]
    | ['replace', 'materialRequistionSlipItemList', HashSet<MaterialRequistionSlipItemVariable>]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new MaterialRequistionSlipVariable(-1, { materialApprovalSlip: new MaterialApprovalSlip(-1) }),
        materialRequistionSlipItemList: {
            typeName: 'MaterialRequistionSlipItem',
            query: getQuery('MaterialRequistionSlipItem'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'materialRequistionSlip'], ['values', 'materialApprovalSlipItem'], ['values', 'quantity'], ['values', 'consumed']),
            variable: new MaterialRequistionSlipItemVariable(-1, { materialRequistionSlip: new MaterialRequistionSlip(-1), materialApprovalSlipItem: new MaterialApprovalSlipItem(-1), quantity: 0, consumed: 0 }),
            variables: HashSet.of<MaterialRequistionSlipItemVariable>()
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
                    case 'materialApprovalSlip': {
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
            
            case 'materialRequistionSlipItemList': {
                switch (action[1]) {
                    case 'limit': {
                        state[action[0]].limit = Math.max(initialState.materialRequistionSlipItemList.limit, action[2])
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
                            case 'materialRequistionSlip': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'materialApprovalSlipItem': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'quantity': {
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
                        state.materialRequistionSlipItemList.variables = state.materialRequistionSlipItemList.variables.add(new MaterialRequistionSlipItemVariable(-1, {materialRequistionSlip: new MaterialRequistionSlip(state.materialRequistionSlipItemList.variable.values.materialRequistionSlip.hashCode()), materialApprovalSlipItem: new MaterialApprovalSlipItem(state.materialRequistionSlipItemList.variable.values.materialApprovalSlipItem.hashCode()), quantity: state.materialRequistionSlipItemList.variable.values.quantity, consumed: state.materialRequistionSlipItemList.variable.values.consumed}))
                        state.materialRequistionSlipItemList.variable = initialState.materialRequistionSlipItemList.variable
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
                    case 'materialRequistionSlipItemList': {
                        state.materialRequistionSlipItemList.variables = action[2]
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

    const materialRequistionSlipType = types['MaterialRequistionSlip']
    const materialRequistionSlipItemType = types['MaterialRequistionSlipItem']
    
    const [addMaterialRequistionSlipItemDrawer, toggleAddMaterialRequistionSlipItemDrawer] = useState(false)
    const [materialRequistionSlipItemFilter, toggleMaterialRequistionSlipItemFilter] = useState(false)
    
    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.MaterialRequistionSlip.toArray()
            var composedVariables = HashSet.of<Immutable<MaterialRequistionSlipVariable>>().addAll(rows ? rows.map(x => MaterialRequistionSlipRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as MaterialRequistionSlipVariable])

                const materialRequistionSlipItemRows = await db.MaterialRequistionSlipItem.toArray()
                var composedMaterialRequistionSlipItemVariables = HashSet.of<Immutable<MaterialRequistionSlipItemVariable>>().addAll(materialRequistionSlipItemRows ? materialRequistionSlipItemRows.map(x => MaterialRequistionSlipItemRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedMaterialRequistionSlipItemVariables = composedMaterialRequistionSlipItemVariables.filter(x => !diff.variables[state.materialRequistionSlipItemList.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.materialRequistionSlipItemList.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.materialRequistionSlipItemList.variable.typeName].replace)
                })
                dispatch(['replace', 'materialRequistionSlipItemList', composedMaterialRequistionSlipItemVariables.filter(variable => variable.values.materialRequistionSlip.hashCode() === props.match.params[0]) as HashSet<MaterialRequistionSlipItemVariable>])
            }
        }
    }, [state.variable.typeName, state.materialRequistionSlipItemList.variable.typeName, props.match.params, dispatch])

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

    const materialRequistionSlipRows = useLiveQuery(() => db.MaterialRequistionSlip.toArray())?.map(x => MaterialRequistionSlipRow.toVariable(x))
    var materialRequistionSlipList = HashSet.of<Immutable<MaterialRequistionSlipVariable>>().addAll(materialRequistionSlipRows ? materialRequistionSlipRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        materialRequistionSlipList = materialRequistionSlipList.filter(x => !diff.variables.MaterialRequistionSlip.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.MaterialRequistionSlip.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.MaterialRequistionSlip.replace)
    })

    const materialRequistionSlipItemRows = useLiveQuery(() => db.MaterialRequistionSlipItem.toArray())?.map(x => MaterialRequistionSlipItemRow.toVariable(x))
    var materialRequistionSlipItemList = HashSet.of<Immutable<MaterialRequistionSlipItemVariable>>().addAll(materialRequistionSlipItemRows ? materialRequistionSlipItemRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        materialRequistionSlipItemList = materialRequistionSlipItemList.filter(x => !diff.variables.MaterialRequistionSlipItem.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.MaterialRequistionSlipItem.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.MaterialRequistionSlipItem.replace)
    })

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'materialApprovalSlip': {
                dispatch(['variable', event.target.name, new MaterialApprovalSlip(parseInt(String(event.target.value)))])
                break
            }
        }
    }
    const onMaterialRequistionSlipItemInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'materialRequistionSlip': {
                dispatch(['materialRequistionSlipItemList', 'variable', event.target.name, new MaterialRequistionSlip(parseInt(String(event.target.value)))])
                break
            }
            case 'materialApprovalSlipItem': {
                dispatch(['materialRequistionSlipItemList', 'variable', event.target.name, new MaterialApprovalSlipItem(parseInt(String(event.target.value)))])
                break
            }
            case 'quantity': {
                dispatch(['materialRequistionSlipItemList', 'variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
            case 'consumed': {
                dispatch(['materialRequistionSlipItemList', 'variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
        }
    }

    const updateItemsQuery = (list: 'materialRequistionSlipItemList') => {
        const fx = (args: Args) => {
            switch (list) {
                case 'materialRequistionSlipItemList': {
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

    const updatePage = (list: 'materialRequistionSlipItemList') => {
        const fx = (args: ['limit', number] | ['offset', number] | ['page', number]) => {
            dispatch([list, args[0], args[1]])
        }
        return fx
    }

    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createMaterialRequistionSlip, {
            materialApprovalSlip: state.variable.values.materialApprovalSlip.hashCode(),
            materialRequistionSlipItemList: state.materialRequistionSlipItemList.variables.toArray().map(variable => {
                return {
                    materialRequistionSlip: variable.values.materialRequistionSlip.hashCode(),
                    materialApprovalSlipItem: variable.values.materialApprovalSlipItem.hashCode(),
                    quantity: variable.values.quantity,
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteMaterialRequistionSlip, {
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
                        'create': `Create Material Requistion Slip`,
                        'update': `Update Material Requistion Slip`,
                        'show': `Material Requistion Slip`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/material-requistion-slip-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/material-requistion-slip-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/material-requistion-slip-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{materialRequistionSlipType.keys.materialApprovalSlip}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.materialApprovalSlip.hashCode()} name='materialApprovalSlip'>
                                    <option value='' selected disabled hidden>Select Material Approval Slip</option>
                                    {materialApprovalSlipList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(materialApprovalSlipList.filter(x => x.id.hashCode() === state.variable.values.materialApprovalSlip.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = materialApprovalSlipList.filter(x => x.id.hashCode() === state.variable.values.materialApprovalSlip.hashCode()).toArray()[0] as MaterialApprovalSlipVariable
                                            return <Link to={`/material-approval-slip/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/material-approval-slip/${state.variable.values.materialApprovalSlip.hashCode()}`}>{state.variable.values.materialApprovalSlip.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                </Container>
                <Container area={Grid.materialRequistionSlipItemArea} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title> Material Requistion Slip Item List</Title>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <button onClick={() => toggleAddMaterialRequistionSlipItemDrawer(true)} className='text-3xl font-bold text-white bg-gray-800 rounded-md px-2 h-10 focus:outline-none'>+</button>,
                                undefined
                            )
                        }
                    </Item>
                    <Item area={Grid2.filter} justify='end' align='center' className='flex'>
                        <Button onClick={() => toggleMaterialRequistionSlipItemFilter(true)}>Filter</Button>
                        <Drawer open={materialRequistionSlipItemFilter} onClose={() => toggleMaterialRequistionSlipItemFilter(false)} anchor={'right'}>
                            <Filter typeName='MaterialRequistionSlipItem' query={state['materialRequistionSlipItemList'].query} updateQuery={updateItemsQuery('materialRequistionSlipItemList')} />
                        </Drawer>
                        <Drawer open={addMaterialRequistionSlipItemDrawer} onClose={() => toggleAddMaterialRequistionSlipItemDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add {materialRequistionSlipItemType.name}</div>
                                <Container area={none} layout={Grid.layouts.uom} className=''>
                                    <Item>
                                        <Label>{materialRequistionSlipItemType.keys.materialRequistionSlip}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onMaterialRequistionSlipItemInputChange} value={state.materialRequistionSlipItemList.variable.values.materialRequistionSlip.hashCode()} name='materialRequistionSlip'>
                                                    <option value='' selected disabled hidden>Select Material Requistion Slip</option>
                                                    {materialRequistionSlipList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(materialRequistionSlipList.filter(x => x.id.hashCode() === state.materialRequistionSlipItemList.variable.values.materialRequistionSlip.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = materialRequistionSlipList.filter(x => x.id.hashCode() === state.materialRequistionSlipItemList.variable.values.materialRequistionSlip.hashCode()).toArray()[0] as MaterialRequistionSlipVariable
                                                            return <Link to={`/material-requistion-slip/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/material-requistion-slip/${state.materialRequistionSlipItemList.variable.values.materialRequistionSlip.hashCode()}`}>{state.materialRequistionSlipItemList.variable.values.materialRequistionSlip.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{materialRequistionSlipItemType.keys.materialApprovalSlipItem}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onMaterialRequistionSlipItemInputChange} value={state.materialRequistionSlipItemList.variable.values.materialApprovalSlipItem.hashCode()} name='materialApprovalSlipItem'>
                                                    <option value='' selected disabled hidden>Select Material Approval Slip Item</option>
                                                    {materialApprovalSlipItemList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(materialApprovalSlipItemList.filter(x => x.id.hashCode() === state.materialRequistionSlipItemList.variable.values.materialApprovalSlipItem.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = materialApprovalSlipItemList.filter(x => x.id.hashCode() === state.materialRequistionSlipItemList.variable.values.materialApprovalSlipItem.hashCode()).toArray()[0] as MaterialApprovalSlipItemVariable
                                                            return <Link to={`/material-approval-slip-item/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/material-approval-slip-item/${state.materialRequistionSlipItemList.variable.values.materialApprovalSlipItem.hashCode()}`}>{state.materialRequistionSlipItemList.variable.values.materialApprovalSlipItem.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{materialRequistionSlipItemType.keys.quantity}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='number' onChange={onMaterialRequistionSlipItemInputChange} value={state.materialRequistionSlipItemList.variable.values.quantity} name='quantity' />,
                                                <div className='font-bold text-xl'>{state.materialRequistionSlipItemList.variable.values.quantity}</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{materialRequistionSlipItemType.keys.consumed}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='number' onChange={onMaterialRequistionSlipItemInputChange} value={state.materialRequistionSlipItemList.variable.values.consumed} name='consumed' />,
                                                <div className='font-bold text-xl'>{state.materialRequistionSlipItemList.variable.values.consumed}</div>
                                            )
                                        }
                                    </Item>
                                    <Item justify='center' align='center'>
                                        <Button onClick={() => dispatch(['materialRequistionSlipItemList', 'addVariable'])}>Add</Button>
                                    </Item>
                                </Container>
                            </div>
                        </Drawer>
                    </Item>
                    <Table area={Grid2.table} state={state['materialRequistionSlipItemList']} updatePage={updatePage('materialRequistionSlipItemList')} variables={state.materialRequistionSlipItemList.variables.filter(variable => applyFilter(state['materialRequistionSlipItemList'].query, variable)).toArray()} columns={state['materialRequistionSlipItemList'].columns.toArray()} />
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
