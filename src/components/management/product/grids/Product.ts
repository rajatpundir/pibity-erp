import { Vector } from 'prelude-ts'
import { GridLayout, Area, none, validateLayout } from '../../../../main/commons'

export const header: Area = new Area('header')
export const button: Area = new Area('button')
export const details: Area = new Area('details')
export const uom: Area = new Area('uom')

export const layouts: { [index: string]: GridLayout } = {
    main: validateLayout({
        margin: 1,
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
            columns: Vector.of('0.25fr', '1fr', '1fr', '1fr', '1fr', '0.30fr'),
            areas: Vector.of(
                Vector.of(none, header, header, none, button, none),
                Vector.of(none, details, details, details, details, none),
                Vector.of(none, uom, uom, none, none, none)
            )
        },
        layout_xl: {
            rows: Vector.of('auto'),
            columns: Vector.of('0.25fr', '1fr', '1fr', '1fr', '1fr', '0.30fr'),
            areas: Vector.of(
                Vector.of(none, header, header, none, button, none),
                Vector.of(none, details, details, details, details, none),
                Vector.of(none, uom, uom, uom, uom, none)
            )
        }
    }),
    details: validateLayout({
        margin: 1,
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
