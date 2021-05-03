import { Vector } from 'prelude-ts'
import { GridLayout, Area, isoArea, none, validateLayout } from '../../../../../main/commons'

export const header: Area = isoArea.wrap('header')
export const button: Area = isoArea.wrap('button')
export const details: Area = isoArea.wrap('details')
export const uom: Area = isoArea.wrap('uom')

export const layout: GridLayout = validateLayout({
    rowGap: '1rem',
    columnGap: '1rem',
    layout_mobile: {
        rows: Vector.of('auto'),
        columns: Vector.of('1fr'),
        areas: Vector.of(
            Vector.of(header),
            Vector.of(details),
            Vector.of(button),
            Vector.of(uom)
        )
    },
    layout_sm: {
        rows: Vector.of('auto'),
        columns: Vector.of('1fr', '1fr'),
        areas: Vector.of(
            Vector.of(header, button),
            Vector.of(details, details),
            Vector.of(uom, uom)
        )
    },
    layout_md: {
        rows: Vector.of('auto'),
        columns: Vector.of('1fr', '1fr', '1fr'),
        areas: Vector.of(
            Vector.of(header, header, button),
            Vector.of(details, details, details),
            Vector.of(uom, uom, none)
        )
    },
    layout_lg: {
        rows: Vector.of('auto'),
        columns: Vector.of('1fr', '1fr', '1fr', '1fr', '1fr', '1fr'),
        areas: Vector.of(
            Vector.of(none, header, header, none, button, none),
            Vector.of(none, details, details, details, details, none),
            Vector.of(none, uom, uom, none, none, none)
        )
    },
    layout_xl: {
        rows: Vector.of('auto'),
        columns: Vector.of('1fr', '1fr', '1fr', '1fr', '1fr', '1fr'),
        areas: Vector.of(
            Vector.of(none, header, header, none, button, none),
            Vector.of(none, details, details, details, details, none),
            Vector.of(none, uom, uom, none, none, none)
        )
    }
})
