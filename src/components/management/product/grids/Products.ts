import { Vector } from 'prelude-ts'
import { GridLayout, Area, none, validateLayout } from '../../../../main/commons'

export const header: Area = new Area('header')
export const filter: Area = new Area('filter')
export const table: Area = new Area('table')

export const layouts: { [index: string]: GridLayout } = {
    main: validateLayout({
        margin: 0,
        rowGap: '1rem',
        columnGap: '0rem',
        layout_mobile: {
            rows: Vector.of('6rem', '1fr'),
            columns: Vector.of('1fr', '1fr'),
            areas: Vector.of(
                Vector.of(header, filter),
                Vector.of(table, table)
            )
        },
        layout_sm: {
            rows: Vector.of('6rem', '1fr'),
            columns: Vector.of('1fr', '1fr'),
            areas: Vector.of(
                Vector.of(header, filter),
                Vector.of(table, table)
            )
        },
        layout_md: {
            rows: Vector.of('6rem', '1fr '),
            columns: Vector.of('1fr', '10fr', '10fr', '1fr'),
            areas: Vector.of(
                Vector.of(none, header, filter, none),
                Vector.of(none, table, table, none) 
            )
        },
        layout_lg: {
            rows: Vector.of('6rem', '1fr '),
            columns: Vector.of('1fr', '10fr', '10fr', '1fr'),
            areas: Vector.of(
                Vector.of(none, header, filter, none),
                Vector.of(none, table, table, none) 
            )
        },
        layout_xl: {
            rows: Vector.of('6rem', '1fr '),
            columns: Vector.of('1fr', '10fr', '10fr', '1fr'),
            areas: Vector.of(
                Vector.of(none, header, filter, none),
                Vector.of(none, table, table, none) 
            )
        }
    }),
    query: validateLayout({
        margin: 0,
        rowGap: '1rem',
        columnGap: '0rem',
        layout_mobile: {
            rows: Vector.of('1fr'),
            columns: Vector.of('1fr'),
            areas: Vector.of()
        },
        layout_sm: {
            rows: Vector.of('1fr'),
            columns: Vector.of('1fr'),
            areas: Vector.of()
        },
        layout_md: {
            rows: Vector.of('1fr'),
            columns: Vector.of('1fr'),
            areas: Vector.of()
        },
        layout_lg: {
            rows: Vector.of('1fr'),
            columns: Vector.of('1fr'),
            areas: Vector.of()
        },
        layout_xl: {
            rows: Vector.of('1fr'),
            columns: Vector.of('1fr'),
            areas: Vector.of()
        }
    })
}
