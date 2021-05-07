import { Vector } from 'prelude-ts'
import { GridLayout, Area, isoArea, none, validateLayout } from '../../../../main/commons'

export const body: Area = isoArea.wrap('body')
export const footer: Area = isoArea.wrap('footer')

export const layouts: { [index: string]: GridLayout } = {
    main: validateLayout({
        margin: 1,
        rowGap: '1rem',
        columnGap: '0rem',
        layout_mobile: {
            rows: Vector.of('1fr', '3rem'),
            columns: Vector.of('1fr'),
            areas: Vector.of(
                Vector.of(body),
                Vector.of(footer)
            )
        },
        layout_sm: {
            rows: Vector.of('1fr', '3rem'),
            columns: Vector.of('1fr'),
            areas: Vector.of(
                Vector.of(body),
                Vector.of(footer)
            )
        },
        layout_md: {
            rows: Vector.of('1fr', '3rem'),
            columns: Vector.of('1fr'),
            areas: Vector.of(
                Vector.of(body),
                Vector.of(footer)
            )
        },
        layout_lg: {
            rows: Vector.of('1fr', '3rem'),
            columns: Vector.of('1fr', '4fr', '1fr'),
            areas: Vector.of(
                Vector.of(none, body, none),
                Vector.of(none, footer, none)
            )
        },
        layout_xl: {
            rows: Vector.of('1fr', '3rem'),
            columns: Vector.of('1fr', '4fr', '1fr'),
            areas: Vector.of(
                Vector.of(none, body, none),
                Vector.of(none, footer, none)
            )
        }
    }),
    body: validateLayout({
        rowGap: '0rem',
        columnGap: '0rem',
        layout_mobile: {
            rows: Vector.of('reapeat(10, 1fr)'),
            columns: Vector.of('1fr'),
            areas: Vector.of()
        },
        layout_sm: {
            rows: Vector.of('reapeat(10, 1fr)'),
            columns: Vector.of('1fr'),
            areas: Vector.of()
        },
        layout_md: {
            rows: Vector.of('reapeat(10, 1fr)'),
            columns: Vector.of('1fr'),
            areas: Vector.of()
        },
        layout_lg: {
            rows: Vector.of('reapeat(10, 1fr)'),
            columns: Vector.of('1fr'),
            areas: Vector.of()
        },
        layout_xl: {
            rows: Vector.of('reapeat(10, 1fr)'),
            columns: Vector.of('1fr'),
            areas: Vector.of()
        }
    }),
    footer: validateLayout({
        rowGap: '0rem',
        columnGap: '0rem',
        layout_mobile: {
            rows: Vector.of('1fr'),
            columns: Vector.of('1fr', '1fr'),
            areas: Vector.of()
        },
        layout_sm: {
            rows: Vector.of('1fr'),
            columns: Vector.of('1fr', '1fr'),
            areas: Vector.of()
        },
        layout_md: {
            rows: Vector.of('1fr'),
            columns: Vector.of('1fr', '1fr'),
            areas: Vector.of()
        },
        layout_lg: {
            rows: Vector.of('1fr'),
            columns: Vector.of('1fr', '1fr'),
            areas: Vector.of()
        },
        layout_xl: {
            rows: Vector.of('1fr'),
            columns: Vector.of('1fr', '1fr'),
            areas: Vector.of()
        }
    })
}
