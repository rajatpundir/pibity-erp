import { Vector } from 'prelude-ts'
import styled from '@emotion/styled';
import { GridLayout, GridArea, isoArea, validateLayout } from '../../../../main/commons'

export const layout: GridLayout = validateLayout({
    rowGap: '1rem',
    columnGap: '1rem',
    layout_mobile: {
        rows: Vector.of('auto'),
        columns: Vector.of('1fr'),
        areas: Vector.of()
    },
    layout_sm: {
        rows: Vector.of('auto'),
        columns: Vector.of('1fr', '1fr'),
        areas: Vector.of()
    },
    layout_md: {
        rows: Vector.of('auto'),
        columns: Vector.of('1fr', '1fr', '1fr'),
        areas: Vector.of()
    },
    layout_lg: {
        rows: Vector.of('auto'),
        columns: Vector.of('1fr', '1fr', '1fr', '1fr', '1fr', '1fr'),
        areas: Vector.of()
    },
    layout_xl: {
        rows: Vector.of('auto'),
        columns: Vector.of('1fr', '1fr', '1fr', '1fr', '1fr', '1fr'),
        areas: Vector.of()
    }
})

export const GridItem = styled.div<GridArea>`
    grid-area: ${props => isoArea.unwrap(props.area)};
    place-self: stretch/stretch;
    /* border: 2px solid black; */
`
