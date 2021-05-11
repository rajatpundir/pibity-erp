import { Vector } from 'prelude-ts'
import { GridLayout, Area, isoArea, none, validateLayout } from '../../../../main/commons'

export const header: Area = isoArea.wrap('header')
export const query: Area = isoArea.wrap('query')
export const table: Area = isoArea.wrap('table')

export const layouts: { [index: string]: GridLayout } = {
    main: validateLayout({
        margin: 0,
        rowGap: '1rem',
        columnGap: '0rem',
        layout_mobile: {
            rows: Vector.of('6rem', '1fr', '1fr'),
            columns: Vector.of('1fr'),
            areas: Vector.of(
                Vector.of(header),
                Vector.of(query),
                Vector.of(table)
            )
        },
        layout_sm: {
            rows: Vector.of('6rem', '1fr', '1fr'),
            columns: Vector.of('1fr'),
            areas: Vector.of(
                Vector.of(header),
                Vector.of(query),
                Vector.of(table)
            )
        },
        layout_md: {
            rows: Vector.of('6rem', '1fr', '1fr'),
            columns: Vector.of('1fr', '40fr', '1fr'),
            areas: Vector.of(
                Vector.of(none, header, none),
                Vector.of(none, query, none),
                Vector.of(none, table, none)
            )
        },
        layout_lg: {
            rows: Vector.of('6rem', '1fr', '1fr'),
            columns: Vector.of('1fr', '40fr', '1fr'),
            areas: Vector.of(
                Vector.of(none, header, none),
                Vector.of(none, query, none),
                Vector.of(none, table, none)
            )
        },
        layout_xl: {
            rows: Vector.of('6rem', '1fr', '1fr'),
            columns: Vector.of('0.8fr', '10fr', '0.8fr'),
            areas: Vector.of(
                Vector.of(none, header, none),
                Vector.of(none, query, none),
                Vector.of(none, table, none)
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
