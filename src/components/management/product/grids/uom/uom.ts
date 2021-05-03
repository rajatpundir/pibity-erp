import { Vector } from 'prelude-ts'
import { GridLayout, Area, isoArea, none, validateLayout } from '../../../../../main/commons'

export const header: Area = isoArea.wrap('header')
export const rows: Area = isoArea.wrap('rows')

export const layout: GridLayout = validateLayout({
    rowGap: '1rem',
    columnGap: '1rem',
    layout_mobile: {
        rows: Vector.of('auto'),
        columns: Vector.of('1fr'),
        areas: Vector.of(
            Vector.of(header),
            Vector.of(rows),
        )
    },
    layout_sm: {
        rows: Vector.of('auto'),
        columns: Vector.of('1fr'),
        areas: Vector.of(
            Vector.of(header),
            Vector.of(rows),
        )
    },
    layout_md: {
        rows: Vector.of('auto'),
        columns: Vector.of('1fr'),
        areas: Vector.of(
            Vector.of(header),
            Vector.of(rows),
        )
    },
    layout_lg: {
        rows: Vector.of('auto'),
        columns: Vector.of('1fr'),
        areas: Vector.of(
            Vector.of(header),
            Vector.of(rows),
        )
    },
    layout_xl: {
        rows: Vector.of('auto'),
        columns: Vector.of('1fr'),
        areas: Vector.of(
            Vector.of(header),
            Vector.of(rows),
        )
    }
})
