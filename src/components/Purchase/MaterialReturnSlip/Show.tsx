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
import { DiffRow, MaterialRejectionSlipRow, MaterialRejectionSlipItemRow, MaterialReturnSlipRow, MaterialReturnSlipItemRow } from '../../../main/rows'
import { MaterialRejectionSlip, MaterialRejectionSlipVariable, MaterialRejectionSlipItem, MaterialRejectionSlipItemVariable, MaterialReturnSlip, MaterialReturnSlipVariable, MaterialReturnSlipItemVariable } from '../../../main/variables'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: MaterialReturnSlipVariable
    materialReturnSlipItemList: {
        typeName: 'MaterialReturnSlipItem'
        query: Query
        limit: number
        offset: number
        page: number
        columns: Vector<Array<string>>
        variable: MaterialReturnSlipItemVariable
        variables: HashSet<Immutable<MaterialReturnSlipItemVariable>>
    }
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 
    | ['variable', 'materialRejectionSlip', MaterialRejectionSlip]

    | ['materialReturnSlipItemList', 'limit', number]
    | ['materialReturnSlipItemList', 'offset', number]
    | ['materialReturnSlipItemList', 'page', number]
    | ['materialReturnSlipItemList', 'query', Args]
    | ['materialReturnSlipItemList', 'variable', 'materialReturnSlip', MaterialReturnSlip]
    | ['materialReturnSlipItemList', 'variable', 'materialRejectionSlipItem', MaterialRejectionSlipItem]
    | ['materialReturnSlipItemList', 'variable', 'quantity', number]
    | ['materialReturnSlipItemList', 'addVariable']
    | ['replace', 'variable', MaterialReturnSlipVariable]
    | ['replace', 'materialReturnSlipItemList', HashSet<MaterialReturnSlipItemVariable>]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new MaterialReturnSlipVariable(-1, { materialRejectionSlip: new MaterialRejectionSlip(-1) }),
        materialReturnSlipItemList: {
            typeName: 'MaterialReturnSlipItem',
            query: getQuery('MaterialReturnSlipItem'),
            limit: 5,
            offset: 0,
            page: 1,
            columns: Vector.of(['values', 'materialReturnSlip'], ['values', 'materialRejectionSlipItem'], ['values', 'quantity']),
            variable: new MaterialReturnSlipItemVariable(-1, { materialReturnSlip: new MaterialReturnSlip(-1), materialRejectionSlipItem: new MaterialRejectionSlipItem(-1), quantity: 0 }),
            variables: HashSet.of<MaterialReturnSlipItemVariable>()
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
                    case 'materialRejectionSlip': {
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
            
            case 'materialReturnSlipItemList': {
                switch (action[1]) {
                    case 'limit': {
                        state[action[0]].limit = Math.max(initialState.materialReturnSlipItemList.limit, action[2])
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
                            case 'materialReturnSlip': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'materialRejectionSlipItem': {
                                state[action[0]][action[1]]['values'][action[2]] = action[3]
                                break
                            }
                            case 'quantity': {
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
                        state.materialReturnSlipItemList.variables = state.materialReturnSlipItemList.variables.add(new MaterialReturnSlipItemVariable(-1, {materialReturnSlip: new MaterialReturnSlip(state.materialReturnSlipItemList.variable.values.materialReturnSlip.hashCode()), materialRejectionSlipItem: new MaterialRejectionSlipItem(state.materialReturnSlipItemList.variable.values.materialRejectionSlipItem.hashCode()), quantity: state.materialReturnSlipItemList.variable.values.quantity}))
                        state.materialReturnSlipItemList.variable = initialState.materialReturnSlipItemList.variable
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
                    case 'materialReturnSlipItemList': {
                        state.materialReturnSlipItemList.variables = action[2]
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

    const materialReturnSlipType = types['MaterialReturnSlip']
    const materialReturnSlipItemType = types['MaterialReturnSlipItem']
    
    const [addMaterialReturnSlipItemDrawer, toggleAddMaterialReturnSlipItemDrawer] = useState(false)
    const [materialReturnSlipItemFilter, toggleMaterialReturnSlipItemFilter] = useState(false)
    
    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.MaterialReturnSlip.toArray()
            var composedVariables = HashSet.of<Immutable<MaterialReturnSlipVariable>>().addAll(rows ? rows.map(x => MaterialReturnSlipRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as MaterialReturnSlipVariable])

                const materialReturnSlipItemRows = await db.MaterialReturnSlipItem.toArray()
                var composedMaterialReturnSlipItemVariables = HashSet.of<Immutable<MaterialReturnSlipItemVariable>>().addAll(materialReturnSlipItemRows ? materialReturnSlipItemRows.map(x => MaterialReturnSlipItemRow.toVariable(x)) : [])
                diffs?.forEach(diff => {
                    composedMaterialReturnSlipItemVariables = composedMaterialReturnSlipItemVariables.filter(x => !diff.variables[state.materialReturnSlipItemList.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.materialReturnSlipItemList.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.materialReturnSlipItemList.variable.typeName].replace)
                })
                dispatch(['replace', 'materialReturnSlipItemList', composedMaterialReturnSlipItemVariables.filter(variable => variable.values.materialReturnSlip.hashCode() === props.match.params[0]) as HashSet<MaterialReturnSlipItemVariable>])
            }
        }
    }, [state.variable.typeName, state.materialReturnSlipItemList.variable.typeName, props.match.params, dispatch])

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

    const materialReturnSlipRows = useLiveQuery(() => db.MaterialReturnSlip.toArray())?.map(x => MaterialReturnSlipRow.toVariable(x))
    var materialReturnSlipList = HashSet.of<Immutable<MaterialReturnSlipVariable>>().addAll(materialReturnSlipRows ? materialReturnSlipRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        materialReturnSlipList = materialReturnSlipList.filter(x => !diff.variables.MaterialReturnSlip.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.MaterialReturnSlip.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.MaterialReturnSlip.replace)
    })

    const materialReturnSlipItemRows = useLiveQuery(() => db.MaterialReturnSlipItem.toArray())?.map(x => MaterialReturnSlipItemRow.toVariable(x))
    var materialReturnSlipItemList = HashSet.of<Immutable<MaterialReturnSlipItemVariable>>().addAll(materialReturnSlipItemRows ? materialReturnSlipItemRows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        materialReturnSlipItemList = materialReturnSlipItemList.filter(x => !diff.variables.MaterialReturnSlipItem.remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables.MaterialReturnSlipItem.replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables.MaterialReturnSlipItem.replace)
    })

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'materialRejectionSlip': {
                dispatch(['variable', event.target.name, new MaterialRejectionSlip(parseInt(String(event.target.value)))])
                break
            }
        }
    }
    const onMaterialReturnSlipItemInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'materialReturnSlip': {
                dispatch(['materialReturnSlipItemList', 'variable', event.target.name, new MaterialReturnSlip(parseInt(String(event.target.value)))])
                break
            }
            case 'materialRejectionSlipItem': {
                dispatch(['materialReturnSlipItemList', 'variable', event.target.name, new MaterialRejectionSlipItem(parseInt(String(event.target.value)))])
                break
            }
            case 'quantity': {
                dispatch(['materialReturnSlipItemList', 'variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
        }
    }

    const updateItemsQuery = (list: 'materialReturnSlipItemList') => {
        const fx = (args: Args) => {
            switch (list) {
                case 'materialReturnSlipItemList': {
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

    const updatePage = (list: 'materialReturnSlipItemList') => {
        const fx = (args: ['limit', number] | ['offset', number] | ['page', number]) => {
            dispatch([list, args[0], args[1]])
        }
        return fx
    }

    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createMaterialReturnSlip, {
            materialRejectionSlip: state.variable.values.materialRejectionSlip.hashCode(),
            materialReturnSlipItemList: state.materialReturnSlipItemList.variables.toArray().map(variable => {
                return {
                    materialReturnSlip: variable.values.materialReturnSlip.hashCode(),
                    materialRejectionSlipItem: variable.values.materialRejectionSlipItem.hashCode(),
                    quantity: variable.values.quantity
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteMaterialReturnSlip, {
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
                        'create': `Create Material Return Slip`,
                        'update': `Update Material Return Slip`,
                        'show': `Material Return Slip`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/material-return-slip-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/material-return-slip-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/material-return-slip-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{materialReturnSlipType.keys.materialRejectionSlip}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.materialRejectionSlip.hashCode()} name='materialRejectionSlip'>
                                    <option value='' selected disabled hidden>Select Material Rejection Slip</option>
                                    {materialRejectionSlipList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(materialRejectionSlipList.filter(x => x.id.hashCode() === state.variable.values.materialRejectionSlip.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = materialRejectionSlipList.filter(x => x.id.hashCode() === state.variable.values.materialRejectionSlip.hashCode()).toArray()[0] as MaterialRejectionSlipVariable
                                            return <Link to={`/material-rejection-slip/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/material-rejection-slip/${state.variable.values.materialRejectionSlip.hashCode()}`}>{state.variable.values.materialRejectionSlip.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                </Container>
                <Container area={Grid.materialReturnSlipItemArea} layout={Grid2.layouts.main}>
                    <Item area={Grid2.header} className='flex items-center'>
                        <Title> Material Return Slip Item List</Title>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <button onClick={() => toggleAddMaterialReturnSlipItemDrawer(true)} className='text-3xl font-bold text-white bg-gray-800 rounded-md px-2 h-10 focus:outline-none'>+</button>,
                                undefined
                            )
                        }
                    </Item>
                    <Item area={Grid2.filter} justify='end' align='center' className='flex'>
                        <Button onClick={() => toggleMaterialReturnSlipItemFilter(true)}>Filter</Button>
                        <Drawer open={materialReturnSlipItemFilter} onClose={() => toggleMaterialReturnSlipItemFilter(false)} anchor={'right'}>
                            <Filter typeName='MaterialReturnSlipItem' query={state['materialReturnSlipItemList'].query} updateQuery={updateItemsQuery('materialReturnSlipItemList')} />
                        </Drawer>
                        <Drawer open={addMaterialReturnSlipItemDrawer} onClose={() => toggleAddMaterialReturnSlipItemDrawer(false)} anchor={'right'}>
                            <div className='bg-gray-300 font-nunito h-screen overflow-y-scroll' style={{ maxWidth: '90vw' }}>
                                <div className='font-bold text-4xl text-gray-700 pt-8 px-6'>Add {materialReturnSlipItemType.name}</div>
                                <Container area={none} layout={Grid.layouts.uom} className=''>
                                    <Item>
                                        <Label>{materialReturnSlipItemType.keys.materialReturnSlip}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onMaterialReturnSlipItemInputChange} value={state.materialReturnSlipItemList.variable.values.materialReturnSlip.hashCode()} name='materialReturnSlip'>
                                                    <option value='' selected disabled hidden>Select Material Return Slip</option>
                                                    {materialReturnSlipList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(materialReturnSlipList.filter(x => x.id.hashCode() === state.materialReturnSlipItemList.variable.values.materialReturnSlip.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = materialReturnSlipList.filter(x => x.id.hashCode() === state.materialReturnSlipItemList.variable.values.materialReturnSlip.hashCode()).toArray()[0] as MaterialReturnSlipVariable
                                                            return <Link to={`/material-return-slip/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/material-return-slip/${state.materialReturnSlipItemList.variable.values.materialReturnSlip.hashCode()}`}>{state.materialReturnSlipItemList.variable.values.materialReturnSlip.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{materialReturnSlipItemType.keys.materialRejectionSlipItem}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Select onChange={onMaterialReturnSlipItemInputChange} value={state.materialReturnSlipItemList.variable.values.materialRejectionSlipItem.hashCode()} name='materialRejectionSlipItem'>
                                                    <option value='' selected disabled hidden>Select Material Rejection Slip Item</option>
                                                    {materialRejectionSlipItemList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                                </Select>,
                                                <div className='font-bold text-xl'>{
                                                    iff(materialRejectionSlipItemList.filter(x => x.id.hashCode() === state.materialReturnSlipItemList.variable.values.materialRejectionSlipItem.hashCode()).length() !== 0,
                                                        () => {
                                                            const referencedVariable = materialRejectionSlipItemList.filter(x => x.id.hashCode() === state.materialReturnSlipItemList.variable.values.materialRejectionSlipItem.hashCode()).toArray()[0] as MaterialRejectionSlipItemVariable
                                                            return <Link to={`/material-rejection-slip-item/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                                        }, <Link to={`/material-rejection-slip-item/${state.materialReturnSlipItemList.variable.values.materialRejectionSlipItem.hashCode()}`}>{state.materialReturnSlipItemList.variable.values.materialRejectionSlipItem.hashCode()}</Link>)
                                                }</div>
                                            )
                                        }
                                    </Item>
                                    <Item>
                                        <Label>{materialReturnSlipItemType.keys.quantity}</Label>
                                        {
                                            iff(state.mode === 'create' || state.mode === 'update',
                                                <Input type='number' onChange={onMaterialReturnSlipItemInputChange} value={state.materialReturnSlipItemList.variable.values.quantity} name='quantity' />,
                                                <div className='font-bold text-xl'>{state.materialReturnSlipItemList.variable.values.quantity}</div>
                                            )
                                        }
                                    </Item>
                                    <Item justify='center' align='center'>
                                        <Button onClick={() => dispatch(['materialReturnSlipItemList', 'addVariable'])}>Add</Button>
                                    </Item>
                                </Container>
                            </div>
                        </Drawer>
                    </Item>
                    <Table area={Grid2.table} state={state['materialReturnSlipItemList']} updatePage={updatePage('materialReturnSlipItemList')} variables={state.materialReturnSlipItemList.variables.filter(variable => applyFilter(state['materialReturnSlipItemList'].query, variable)).toArray()} columns={state['materialReturnSlipItemList'].columns.toArray()} />
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
