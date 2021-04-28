import { Vector } from 'prelude-ts'
import { GridLayout, validateLayout } from '../../../../main/commons'

export const layout: GridLayout = validateLayout({
    rowGap: '1rem',
    columnGap: '2rem',
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
