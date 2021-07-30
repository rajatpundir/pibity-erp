import { Vector } from 'prelude-ts'
import { GridLayout, GridArea, none, validateLayout } from '../../../../main/commons'

export const header: GridArea = new GridArea('header')
export const button: GridArea = new GridArea('button')
export const details: GridArea = new GridArea('details')
export const companyAddressArea: GridArea = new GridArea('companyAddressArea')
export const mappingCompanyTagArea: GridArea = new GridArea('mappingCompanyTagArea')
export const companyContactArea: GridArea = new GridArea('companyContactArea')
export const memoArea: GridArea = new GridArea('memoArea')
export const companyBankAccountArea: GridArea = new GridArea('companyBankAccountArea')

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
Vector.of(companyAddressArea),
Vector.of(mappingCompanyTagArea),
Vector.of(companyContactArea),
Vector.of(memoArea),
Vector.of(companyBankAccountArea)

            )
        },
        layout_sm: {
            rows: Vector.of('auto'),
            columns: Vector.of('1fr', '1fr'),
            areas: Vector.of(
                Vector.of(header, button),
                Vector.of(details, details),
Vector.of(companyAddressArea, companyAddressArea),
Vector.of(mappingCompanyTagArea, mappingCompanyTagArea),
Vector.of(companyContactArea, companyContactArea),
Vector.of(memoArea, memoArea),
Vector.of(companyBankAccountArea, companyBankAccountArea)

            )
        },
        layout_md: {
            rows: Vector.of('auto'),
            columns: Vector.of('1fr', '1fr', '1fr'),
            areas: Vector.of(
                Vector.of(header, header, button),
                Vector.of(details, details, details),
Vector.of(companyAddressArea, companyAddressArea, companyAddressArea),
Vector.of(mappingCompanyTagArea, mappingCompanyTagArea, mappingCompanyTagArea),
Vector.of(companyContactArea, companyContactArea, companyContactArea),
Vector.of(memoArea, memoArea, memoArea),
Vector.of(companyBankAccountArea, companyBankAccountArea, companyBankAccountArea)

            )
        },
        layout_lg: {
            rows: Vector.of('auto'),
            columns: Vector.of('0.25fr', '1fr', '1fr', '1fr', '1fr', '0.30fr'),
            areas: Vector.of(
                Vector.of(none, header, header, none, button, none),
                Vector.of(none, details, details, details, details, none),
Vector.of(none, companyAddressArea, companyAddressArea, companyAddressArea, companyAddressArea, none),
Vector.of(none, mappingCompanyTagArea, mappingCompanyTagArea, mappingCompanyTagArea, mappingCompanyTagArea, none),
Vector.of(none, companyContactArea, companyContactArea, companyContactArea, companyContactArea, none),
Vector.of(none, memoArea, memoArea, memoArea, memoArea, none),
Vector.of(none, companyBankAccountArea, companyBankAccountArea, companyBankAccountArea, companyBankAccountArea, none)

            )
        },
        layout_xl: {
            rows: Vector.of('auto'),
            columns: Vector.of('0.25fr', '1fr', '1fr', '1fr', '1fr', '0.30fr'),
            areas: Vector.of(
                Vector.of(none, header, header, none, button, none),
                Vector.of(none, details, details, details, details, none),
Vector.of(none, companyAddressArea, companyAddressArea, companyAddressArea, companyAddressArea, none),
Vector.of(none, mappingCompanyTagArea, mappingCompanyTagArea, mappingCompanyTagArea, mappingCompanyTagArea, none),
Vector.of(none, companyContactArea, companyContactArea, companyContactArea, companyContactArea, none),
Vector.of(none, memoArea, memoArea, memoArea, memoArea, none),
Vector.of(none, companyBankAccountArea, companyBankAccountArea, companyBankAccountArea, companyBankAccountArea, none)

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