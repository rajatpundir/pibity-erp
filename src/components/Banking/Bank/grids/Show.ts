import { Vector } from 'prelude-ts'
import { GridLayout, GridArea, none, validateLayout } from '../../../../main/commons'

export const header: GridArea = new GridArea('header')
export const button: GridArea = new GridArea('button')
export const details: GridArea = new GridArea('details')
export const bankBranchArea: GridArea = new GridArea('bankBranchArea')

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
Vector.of(bankBranchArea)

            )
        },
        layout_sm: {
            rows: Vector.of('auto'),
            columns: Vector.of('1fr', '1fr'),
            areas: Vector.of(
                Vector.of(header, button),
                Vector.of(details, details),
Vector.of(bankBranchArea, bankBranchArea)

            )
        },
        layout_md: {
            rows: Vector.of('auto'),
            columns: Vector.of('1fr', '1fr', '1fr'),
            areas: Vector.of(
                Vector.of(header, header, button),
                Vector.of(details, details, details),
Vector.of(bankBranchArea, bankBranchArea, bankBranchArea)

            )
        },
        layout_lg: {
            rows: Vector.of('auto'),
            columns: Vector.of('0.25fr', '1fr', '1fr', '1fr', '1fr', '0.30fr'),
            areas: Vector.of(
                Vector.of(none, header, header, none, button, none),
                Vector.of(none, details, details, details, details, none),
Vector.of(none, bankBranchArea, bankBranchArea, bankBranchArea, bankBranchArea, none)

            )
        },
        layout_xl: {
            rows: Vector.of('auto'),
            columns: Vector.of('0.25fr', '1fr', '1fr', '1fr', '1fr', '0.30fr'),
            areas: Vector.of(
                Vector.of(none, header, header, none, button, none),
                Vector.of(none, details, details, details, details, none),
Vector.of(none, bankBranchArea, bankBranchArea, bankBranchArea, bankBranchArea, none)

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
    uom: validateLayout({
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
            columns: Vector.of('1fr'),
            areas: Vector.of()
        },
        layout_md: {
            rows: Vector.of('auto'),
            columns: Vector.of('1fr'),
            areas: Vector.of()
        },
        layout_lg: {
            rows: Vector.of('auto'),
            columns: Vector.of('1fr'),
            areas: Vector.of()
        },
        layout_xl: {
            rows: Vector.of('auto'),
            columns: Vector.of('1fr'),
            areas: Vector.of()
        }
    })
}