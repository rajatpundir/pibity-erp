import { Vector } from 'prelude-ts'
import { GridLayout, GridArea, none, validateLayout } from '../../../../main/commons'

export const header: GridArea = new GridArea('header')
export const filter: GridArea = new GridArea('filter')
export const table: GridArea = new GridArea('table')

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
                Vector.of(header, none, none, filter),
                Vector.of(table, table, table, table) 
            )
        },
        layout_lg: {
            rows: Vector.of('6rem', '1fr '),
            columns: Vector.of('1fr', '10fr', '10fr', '1fr'),
            areas: Vector.of(
                Vector.of(header, none, none, filter),
                Vector.of(table, table, table, table) 
            )
        },
        layout_xl: {
            rows: Vector.of('6rem', '1fr '),
            columns: Vector.of('1fr', '10fr', '10fr', '1fr'),
            areas: Vector.of(
                Vector.of(header, none, none, filter),
                Vector.of(table, table, table, table) 
            )
        }
    })
}