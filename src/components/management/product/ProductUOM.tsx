import React from 'react';
import { UOMVariable, isoProduct } from '../../../main/types'
import { Action } from './Product'
import { Item } from '../../../main/commons';

type Props = {
    variable: UOMVariable
    dispatch: React.Dispatch<Action>
}

export default function ProductUOM(props: Props) {
    return (
        <Item>
            <p>{isoProduct.unwrap(props.variable.values.product)}</p>
            <p>{props.variable.values.name}</p>
            <p>{props.variable.values.conversionRate}</p>
        </Item>
    )
}
