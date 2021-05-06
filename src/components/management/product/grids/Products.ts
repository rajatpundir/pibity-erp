import { Vector } from 'prelude-ts'
import { GridLayout, Area, isoArea, none, validateLayout } from '../../../../main/commons'

export const header: Area = isoArea.wrap('header')
export const details: Area = isoArea.wrap('details')

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
                Vector.of(details)
            )
        },
        layout_sm: {
            rows: Vector.of('auto'),
            columns: Vector.of('1fr', '1fr'),
            areas: Vector.of(
                Vector.of(header, none),
                Vector.of(details, details)
            )
        },
        layout_md: {
            rows: Vector.of('auto'),
            columns: Vector.of('1fr', '1fr', '1fr'),
            areas: Vector.of(
                Vector.of(header, header, none),
                Vector.of(details, details, details)
            )
        },
        layout_lg: {
            rows: Vector.of('auto'),
            columns: Vector.of('1fr', '1fr', '1fr', '1fr', '1fr', '1fr'),
            areas: Vector.of(
                Vector.of(none, header, header, none, none, none),
                Vector.of(none, details, details, details, details, none)
            )
        },
        layout_xl: {
            rows: Vector.of('auto'),
            columns: Vector.of('1fr', '1fr', '1fr', '1fr', '1fr', '1fr'),
            areas: Vector.of(
                Vector.of(none, header, header, none, none, none),
                Vector.of(none, details, details, details, details, none)
            )
        }
    })
}
