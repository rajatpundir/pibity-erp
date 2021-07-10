import React, { useCallback, useEffect } from 'react'
import { Immutable, Draft } from 'immer'
import { useImmerReducer } from 'use-immer'
import tw from 'twin.macro'
import { types } from '../../../main/types'
import { Container, Item, none } from '../../../main/commons'
import { ProductionPreparationSlip, ProductionPreparationSlipVariable, ScrapMaterialSlip, ScrapMaterialSlipVariable } from '../../../main/variables'
import * as Grid from './grids/Show'
import { withRouter } from 'react-router-dom'
import { executeCircuit } from '../../../main/circuit'
import { circuits } from '../../../main/circuits'
import { iff, when } from '../../../main/utils'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../main/dexie'
import { DiffRow, ProductionPreparationSlipRow, ScrapMaterialSlipRow } from '../../../main/rows'
import { HashSet } from 'prelude-ts'
import { updateVariable } from '../../../main/mutation'

type State = Immutable<{
    mode: 'create' | 'update' | 'show'
    variable: ScrapMaterialSlipVariable
    updatedVariableName: ScrapMaterialSlip
}>

export type Action =
    | ['toggleMode']
    | ['resetVariable', State]

    | ['variable', 'values', 'productionPreparationSlip', ProductionPreparationSlip]
    | ['variable', 'values', 'quantity', number]

    | ['replace', 'variable', ScrapMaterialSlipVariable]

function Component(props) {

    const initialState: State = {
        mode: props.match.params[0] ? 'show' : 'create',
        variable: new ScrapMaterialSlipVariable('', { productionPreparationSlip: new ProductionPreparationSlip(''), quantity: 0 }),
        updatedVariableName: new ScrapMaterialSlip('')
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
                    case 'values': {
                        switch (action[2]) {
                            case 'productionPreparationSlip': {
                                state[action[0]][action[1]][action[2]] = action[3]
                                break
                            }
                            case 'quantity': {
                                state[action[0]][action[1]][action[2]] = action[3]
                                break
                            }
                            default: {
                                const _exhaustiveCheck: never = action;
                                return _exhaustiveCheck;
                            }
                        }
                    }
                }
                break
            }
        }
    }

    const [state, dispatch] = useImmerReducer<State, Action>(reducer, initialState)

    const setVariable = useCallback(async () => {
        if (props.match.params[0]) {
            const rows = await db.ScrapMaterialSlip.toArray()
            var composedVariables = HashSet.of<Immutable<ScrapMaterialSlipVariable>>().addAll(rows ? rows.map(x => ScrapMaterialSlipRow.toVariable(x)) : [])
            const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[state.variable.typeName].remove.anyMatch(y => x.id.toString() === y.toString())).filter(x => !diff.variables[state.variable.typeName].replace.anyMatch(y => y.id.toString() === x.id.toString())).addAll(diff.variables[state.variable.typeName].replace)
            })
            const variables = composedVariables.filter(variable => variable.id.toString() === props.match.params[0])
            if (variables.length() === 1) {
                const variable = variables.toArray()[0]
                dispatch(['replace', 'variable', variable as ScrapMaterialSlipVariable])
            }
        }
    }, [state.variable.typeName, props.match.params, dispatch])

    useEffect(() => { setVariable() }, [setVariable])

    const rows = useLiveQuery(() => db.ProductionPreparationSlip.toArray())?.map(x => ProductionPreparationSlipRow.toVariable(x))
    var productionPreparationSlips = HashSet.of<Immutable<ProductionPreparationSlipVariable>>().addAll(rows ? rows : [])
    useLiveQuery(() => db.diffs.toArray())?.map(x => DiffRow.toVariable(x))?.forEach(diff => {
        productionPreparationSlips = productionPreparationSlips.filter(x => !diff.variables.ProductionPreparationSlip.remove.anyMatch(y => x.id.toString() === y.toString())).filter(x => !diff.variables.ProductionPreparationSlip.replace.anyMatch(y => y.id.toString() === x.id.toString())).addAll(diff.variables.ProductionPreparationSlip.replace)
    })

    const scrapMaterialSlip = types['ScrapMaterialSlip']

    const onVariableInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (event.target.name) {
            default: {
                switch (event.target.name) {
                    case 'productionPreparationSlip': {
                        dispatch(['variable', 'values', event.target.name, new ProductionPreparationSlip(event.target.value)])
                        break
                    }
                    case 'quantity': {
                        dispatch(['variable', 'values', event.target.name, parseInt(event.target.value)])
                        break
                    }
                }
            }
        }
    }


    const createVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.createScrapMaterialSlip, {
            productionPreparationSlip: state.variable.values.productionPreparationSlip,
            quantity: state.variable.values.quantity
        })
        console.log(result, symbolFlag)
        if (symbolFlag) {
            db.diffs.put(diff.toRow())
        }
    }

    const modifyVariable = async () => {
        const [, diff] = await iff(state.variable.id.toString() !== state.updatedVariableName.toString(),
            updateVariable(state.variable, state.variable.toRow().values, state.updatedVariableName.toString()),
            updateVariable(state.variable, state.variable.toRow().values)
        )
        console.log(diff)
        db.diffs.put(diff.toRow())
    }

    const deleteVariable = async () => {
        const [result, symbolFlag, diff] = await executeCircuit(circuits.deleteScrapMaterialSlip, {
            variableName: state.variable.id.toString()
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
                        'create': `Create ${scrapMaterialSlip.name}`,
                        'update': `Update ${scrapMaterialSlip.name}`,
                        'show': `${scrapMaterialSlip.name}`
                    })}</Title>
                </Item>
                <Item area={Grid.button} justify='end' align='center' className='flex'>
                    {
                        iff(state.mode === 'create',
                            <Button onClick={async () => {
                                await createVariable()
                                props.history.push('/materials-scrapped')
                            }}>Save</Button>,
                            iff(state.mode === 'update',
                                <>
                                    <Button onClick={() => {
                                        dispatch(['toggleMode'])
                                        setVariable()
                                    }}>Cancel</Button>
                                    <Button onClick={async () => {
                                        await modifyVariable()
                                        props.history.push('/materials-scrapped')
                                    }}>Save</Button>
                                </>,
                                <>
                                    <Button onClick={async () => {
                                        await deleteVariable()
                                        props.history.push('/materials-scrapped')
                                    }}>Delete</Button>
                                    <Button onClick={async () => dispatch(['toggleMode'])}>Edit</Button>
                                </>))
                    }
                </Item>
                <Container area={Grid.details} layout={Grid.layouts.details}>
                    <Item>
                        <Label>{scrapMaterialSlip.keys.productionPreparationSlip.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Select onChange={onVariableInputChange} value={state.variable.values.productionPreparationSlip.toString()} name='productionPreparationSlip'>
                                    <option value='' selected disabled hidden>Select item</option>
                                    {productionPreparationSlips.toArray().map(x => <option value={x.id.toString()}>{x.id.toString()}</option>)}
                                </Select>,
                                <div className='font-bold text-xl'>{state.variable.values.productionPreparationSlip.toString()}</div>
                            )
                        }
                    </Item>
                    <Item>
                        <Label>{scrapMaterialSlip.keys.quantity.name}</Label>
                        {
                            iff(state.mode === 'create' || state.mode === 'update',
                                <Input type='number' onChange={onVariableInputChange} value={state.variable.values.quantity} name='quantity' />,
                                <div className='font-bold text-xl'>{state.variable.values.quantity.toString()}</div>
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

const Input = tw.input`p-1.5 text-gray-500 leading-tight border border-gray-400 shadow-inner hover:border-gray-600 w-full rounded-sm`

const Select = tw.select`p-1.5 text-gray-500 leading-tight border border-gray-400 shadow-inner hover:border-gray-600 w-full rounded-sm`

const Button = tw.button`bg-gray-900 text-white text-center font-bold p-2 mx-1 uppercase w-40 h-full max-w-sm rounded-lg focus:outline-none inline-block`
