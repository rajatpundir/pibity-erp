import { Vector } from 'prelude-ts'
import { GridLayout, GridArea, none, validateLayout } from '../../../../main/commons'

export const header: GridArea = new GridArea('header')
export const button: GridArea = new GridArea('button')
export const details: GridArea = new GridArea('details')
export const contactAddressArea: GridArea = new GridArea('contactAddressArea')
export const companyContactArea: GridArea = new GridArea('companyContactArea')

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
Vector.of(contactAddressArea),
Vector.of(companyContactArea)

            )
        },
        layout_sm: {
            rows: Vector.of('auto'),
            columns: Vector.of('1fr', '1fr'),
            areas: Vector.of(
                Vector.of(header, button),
                Vector.of(details, details),
Vector.of(contactAddressArea, contactAddressArea),
Vector.of(companyContactArea, companyContactArea)

            )
        },
        layout_md: {
            rows: Vector.of('auto'),
            columns: Vector.of('1fr', '1fr', '1fr'),
            areas: Vector.of(
                Vector.of(header, header, button),
                Vector.of(details, details, details),
Vector.of(contactAddressArea, contactAddressArea, contactAddressArea),
Vector.of(companyContactArea, companyContactArea, companyContactArea)

            )
        },
        layout_lg: {
            rows: Vector.of('auto'),
            columns: Vector.of('0.25fr', '1fr', '1fr', '1fr', '1fr', '0.30fr'),
            areas: Vector.of(
                Vector.of(none, header, header, none, button, none),
                Vector.of(none, details, details, details, details, none),
Vector.of(none, contactAddressArea, contactAddressArea, contactAddressArea, contactAddressArea, none),
Vector.of(none, companyContactArea, companyContactArea, companyContactArea, companyContactArea, none)

            )
        },
        layout_xl: {
            rows: Vector.of('auto'),
            columns: Vector.of('0.25fr', '1fr', '1fr', '1fr', '1fr', '0.30fr'),
            areas: Vector.of(
                Vector.of(none, header, header, none, button, none),
                Vector.of(none, details, details, details, details, none),
Vector.of(none, contactAddressArea, contactAddressArea, contactAddressArea, contactAddressArea, none),
Vector.of(none, companyContactArea, companyContactArea, companyContactArea, companyContactArea, none)

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