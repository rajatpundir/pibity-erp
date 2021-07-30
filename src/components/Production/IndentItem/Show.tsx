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
import { DiffRow, IndentRow, IndentItemRow, ProductRow, UomRow } from '../../../main/rows'
import { Indent, IndentVariable, IndentItemVariable, Product, ProductVariable, Uom, UomVariable } from '../../../main/variables'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: IndentItemVariable
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]
 
    | ['variable', 'indent', Indent]
    | ['variable', 'product', Product]
    | ['variable', 'quantity', number]
    | ['variable', 'uom', Uom]
    | ['variable', 'ordered', number]
    | ['variable', 'received', number]
    | ['variable', 'approved', number]
    | ['variable', 'rejected', number]
    | ['variable', 'returned', number]
    | ['variable', 'requisted', number]
    | ['variable', 'consumed', number]

    | ['replace', 'variable', IndentItemVariable]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new IndentItemVariable(-1, { indent: new Indent(-1), product: new Product(-1), quantity: 0, uom: new Uom(-1), ordered: 0, received: 0, approved: 0, rejected: 0, returned: 0, requisted: 0, consumed: 0 })
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
                    case 'indent': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'product': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'quantity': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'uom': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'ordered': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'received': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'approved': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'rejected': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'returned': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'requisted': {
                        state[action[0]][action[1]] = action[2]
                        break
                    }
                    case 'consumed': {
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

    const indentItemType = types['IndentItem']
    
    
    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.IndentItem.toArray()
            var composedVariables = HashSet.of<Immutable<IndentItemVariable>>().addAll(rows ? rows.map(x => IndentItemRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.hashCode() === x.id.hashCode())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.hashCode() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as IndentItemVariable])
            }
        }
    }, [state.variable.typeName, props.match.params, dispatch])

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

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            case 'indent': {
                dispatch(['variable', event.target.name, new Indent(parseInt(String(event.target.value)))])
                break
            }
            case 'product': {
                dispatch(['variable', event.target.name, new Product(parseInt(String(event.target.value)))])
                break
            }
            case 'quantity': {
                dispatch(['variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
            case 'uom': {
                dispatch(['variable', event.target.name, new Uom(parseInt(String(event.target.value)))])
                break
            }
            case 'ordered': {
                dispatch(['variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
            case 'received': {
                dispatch(['variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
            case 'approved': {
                dispatch(['variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
            case 'rejected': {
                dispatch(['variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
            case 'returned': {
                dispatch(['variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
            case 'requisted': {
                dispatch(['variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
            case 'consumed': {
                dispatch(['variable', event.target.name, parseInt(String(event.target.value))])
                break
            }
        }
    }



    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createIndentItem, {
            indent: state.variable.values.indent.hashCode(),
            product: state.variable.values.product.hashCode(),
            quantity: state.variable.values.quantity,
            uom: state.variable.values.uom.hashCode(),
            ordered: state.variable.values.ordered,
            received: state.variable.values.received,
            approved: state.variable.values.approved,
            rejected: state.variable.values.rejected,
            returned: state.variable.values.returned,
            requisted: state.variable.values.requisted,
            consumed: state.variable.values.consumed
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
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteIndentItem, {
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
                        'create': `Create Indent Item`,
                        'update': `Update Indent Item`,
                        'show': `Indent Item`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/indent-item-list')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/indent-item-list')
                                    }}>Update</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/indent-item-list')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{indentItemType.keys.indent}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.indent.hashCode()} name='indent'>
                                    <option value='' selected disabled hidden>Select Indent</option>
                                    {indentList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(indentList.filter(x => x.id.hashCode() === state.variable.values.indent.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = indentList.filter(x => x.id.hashCode() === state.variable.values.indent.hashCode()).toArray()[0] as IndentVariable
                                            return <Link to={`/indent/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/indent/${state.variable.values.indent.hashCode()}`}>{state.variable.values.indent.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{indentItemType.keys.product}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.product.hashCode()} name='product'>
                                    <option value='' selected disabled hidden>Select Product</option>
                                    {productList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(productList.filter(x => x.id.hashCode() === state.variable.values.product.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = productList.filter(x => x.id.hashCode() === state.variable.values.product.hashCode()).toArray()[0] as ProductVariable
                                            return <Link to={`/product/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/product/${state.variable.values.product.hashCode()}`}>{state.variable.values.product.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{indentItemType.keys.quantity}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='number' onChange={onVariableInputChange} value={state.variable.values.quantity} name='quantity' />,
                                <div className='font-bold text-xl'>{state.variable.values.quantity}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{indentItemType.keys.uom}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.uom.hashCode()} name='uom'>
                                    <option value='' selected disabled hidden>Select Uom</option>
                                    {uomList.toArray().map(x => <option value={x.id.hashCode()}>{x.id.hashCode()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{
                                    iff(uomList.filter(x => x.id.hashCode() === state.variable.values.uom.hashCode()).length() !== 0,
                                        () => {
                                            const referencedVariable = uomList.filter(x => x.id.hashCode() === state.variable.values.uom.hashCode()).toArray()[0] as UomVariable
                                            return <Link to={`/uom/${referencedVariable.id.hashCode()}`}>{referencedVariable.id.hashCode()}</Link>
                                        }, <Link to={`/uom/${state.variable.values.uom.hashCode()}`}>{state.variable.values.uom.hashCode()}</Link>)
                                }</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{indentItemType.keys.ordered}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='number' onChange={onVariableInputChange} value={state.variable.values.ordered} name='ordered' />,
                                <div className='font-bold text-xl'>{state.variable.values.ordered}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{indentItemType.keys.received}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='number' onChange={onVariableInputChange} value={state.variable.values.received} name='received' />,
                                <div className='font-bold text-xl'>{state.variable.values.received}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{indentItemType.keys.approved}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='number' onChange={onVariableInputChange} value={state.variable.values.approved} name='approved' />,
                                <div className='font-bold text-xl'>{state.variable.values.approved}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{indentItemType.keys.rejected}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='number' onChange={onVariableInputChange} value={state.variable.values.rejected} name='rejected' />,
                                <div className='font-bold text-xl'>{state.variable.values.rejected}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{indentItemType.keys.returned}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='number' onChange={onVariableInputChange} value={state.variable.values.returned} name='returned' />,
                                <div className='font-bold text-xl'>{state.variable.values.returned}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{indentItemType.keys.requisted}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='number' onChange={onVariableInputChange} value={state.variable.values.requisted} name='requisted' />,
                                <div className='font-bold text-xl'>{state.variable.values.requisted}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{indentItemType.keys.consumed}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='number' onChange={onVariableInputChange} value={state.variable.values.consumed} name='consumed' />,
                                <div className='font-bold text-xl'>{state.variable.values.consumed}</div>
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
