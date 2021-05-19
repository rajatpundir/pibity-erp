import { Vector } from 'prelude-ts'
import { GridLayout, Area, validateLayout } from './commons'

export const navbar: Area = new Area('navbar')
export const content: Area = new Area('content')

export const layouts: { [index: string]: GridLayout } = {
    main: validateLayout({
        margin: 0,
        rowGap: '0rem',
        columnGap: '0rem',
        layout_mobile: {
            rows: Vector.of('16rem', '1fr'),
            columns: Vector.of('1fr'),
            areas: Vector.of(
                Vector.of(navbar),
                Vector.of(content)
            )
        },
        layout_sm: {
            rows: Vector.of('16rem', '1fr'),
            columns: Vector.of('1fr'),
            areas: Vector.of(
                Vector.of(navbar),
                Vector.of(content)
            )
        },
        layout_md: {
            rows: Vector.of('1fr'),
            columns: Vector.of('16rem', '1fr'),
            areas: Vector.of(
                Vector.of(navbar, content)
            )
        },
        layout_lg: {
            rows: Vector.of('1fr'),
            columns: Vector.of('16rem', '1fr'),
            areas: Vector.of(
                Vector.of(navbar, content)
            )
        },
        layout_xl: {
            rows: Vector.of('1fr'),
            columns: Vector.of('16rem', '1fr'),
            areas: Vector.of(
                Vector.of(navbar, content)
            )
        }
    })
}
