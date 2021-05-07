import styled from '@emotion/styled'
import { Vector } from 'prelude-ts'
import { Newtype, iso } from 'newtype-ts'

export interface Area extends Newtype<{ readonly Area: unique symbol }, string> { }
export const isoArea = iso<Area>()

export const none: Area = isoArea.wrap('.')

const breakpoints: { [index: string]: number } = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280
}

function getTemplateRows(layout: Layout): string {
    return layout.rows.fold('', (acc, x) => `${acc} ${x}`)
}

function getTemplateColumns(layout: Layout): string {
    return layout.columns.fold('', (acc, x) => `${acc} ${x}`)
}

function getTemplateAreas(layout: Layout): string {
    return isoArea.unwrap(layout.areas.map(row => row.fold(isoArea.wrap(''), (acc, x) => isoArea.wrap(`${isoArea.unwrap(acc)} ${isoArea.unwrap(x)}`))).fold(isoArea.wrap(''), (acc, x) => isoArea.wrap(`${isoArea.unwrap(acc)}"${isoArea.unwrap(x)}" `)))
}

export function validateLayout(layout: GridLayout): GridLayout {
    console.assert(layout.layout_mobile.areas.foldLeft(true, (acc, x) => acc && x.length() === layout.layout_mobile.columns.length())
        && layout.layout_sm.areas.foldLeft(true, (acc, x) => acc && x.length() === layout.layout_sm.columns.length())
        && layout.layout_md.areas.foldLeft(true, (acc, x) => acc && x.length() === layout.layout_md.columns.length())
        && layout.layout_lg.areas.foldLeft(true, (acc, x) => acc && x.length() === layout.layout_lg.columns.length())
        && layout.layout_xl.areas.foldLeft(true, (acc, x) => acc && x.length() === layout.layout_xl.columns.length())
        , 'Error in defining Grid Layout')
    return layout
}

type Layout = {
    rows: Vector<string>
    columns: Vector<string>
    areas: Vector<Vector<Area>>
}

export type GridLayout = {
    margin?: number
    rowGap: string
    columnGap: string
    autoFlow?: 'row' | 'column'
    justify?: 'start' | 'center' | 'end' | 'stretch'
    align?: 'start' | 'center' | 'end' | 'stretch'
    layout_mobile: Layout,
    layout_sm: Layout,
    layout_md: Layout,
    layout_lg: Layout,
    layout_xl: Layout
}

type GridContainer = {
    area: Area
    layout: GridLayout
}

export const Container = styled.div<GridContainer>`
    grid-area: ${props => isoArea.unwrap(props.area)};
    margin: ${props => props.layout.margin ? props.layout.margin + 'rem' : '0rem'};
    display: grid;
    grid-template-rows: ${props => getTemplateRows(props.layout.layout_mobile)};
    grid-template-columns: ${props => getTemplateColumns(props.layout.layout_mobile)};
    grid-template-areas: ${props => getTemplateAreas(props.layout.layout_mobile)};
    gap: ${props => props.layout.columnGap} ${props => props.layout.rowGap};
    justify-items: ${props => props.layout.justify ? props.layout.justify : 'stretch'};
    align-items: ${props => props.layout.align ? props.layout.align : 'stretch'};
    grid-auto-flow: ${props => props.layout.autoFlow ? props.layout.autoFlow : 'row'};
    @media (min-width: ${breakpoints.sm}px) {
        /* background-color: aquamarine; */
        grid-template-rows: ${props => getTemplateRows(props.layout.layout_sm)};
        grid-template-columns: ${props => getTemplateColumns(props.layout.layout_sm)};
        grid-template-areas: ${props => getTemplateAreas(props.layout.layout_sm)};
    }
    @media (min-width: ${breakpoints.md}px) {
        /* background-color: red; */
        grid-template-rows: ${props => getTemplateRows(props.layout.layout_md)};
        grid-template-columns: ${props => getTemplateColumns(props.layout.layout_md)};
        grid-template-areas: ${props => getTemplateAreas(props.layout.layout_md)};
    }
    @media (min-width: ${breakpoints.lg}px) {
        /* background-color: green; */
        grid-template-rows: ${props => getTemplateRows(props.layout.layout_lg)};
        grid-template-columns: ${props => getTemplateColumns(props.layout.layout_lg)};
        grid-template-areas: ${props => getTemplateAreas(props.layout.layout_lg)};
    }
    @media (min-width: ${breakpoints.xl}px) {
        /* background-color: yellow; */
        grid-template-rows: ${props => getTemplateRows(props.layout.layout_xl)};
        grid-template-columns: ${props => getTemplateColumns(props.layout.layout_xl)};
        grid-template-areas: ${props => getTemplateAreas(props.layout.layout_xl)};
    }
`

export type GridItem = {
    area?: Area
    justify?: 'start' | 'center' | 'end' | 'stretch'
    align?: 'start' | 'center' | 'end' | 'stretch'
}

export const Item = styled.div<GridItem>`
    grid-area: ${props => props.area ? isoArea.unwrap(props.area) : '.'};
    justify-self: ${props => props.justify ? props.justify : 'stretch'};
    align-self: ${props => props.align ? props.align : 'stretch'};
    /* background-color: aquamarine; */
`

type TableContainer = {
    area: Area
    margin?: number
    rowGap?: string
    columnGap?: string
    autoFlow?: 'row' | 'column'
    justify?: 'start' | 'center' | 'end' | 'stretch'
    align?: 'start' | 'center' | 'end' | 'stretch'
}

export const Table = styled.div<TableContainer>`
    grid-area: ${props => isoArea.unwrap(props.area)};
    margin: ${props => props.margin ? props.margin + 'rem' : '0rem'};
    display: grid;
    gap: ${props => props.columnGap ? props.columnGap : '0rem'} ${props => props.rowGap ? props.rowGap : '0rem'};
    justify-items: ${props => props.justify ? props.justify : 'stretch'};
    align-items: ${props => props.align ? props.align : 'stretch'};
    grid-auto-rows: '120rem';
    grid-auto-flow: ${props => props.autoFlow ? props.autoFlow : 'row'};
`

export type CellItem = {
    row: string
    column: string
    justify?: 'start' | 'center' | 'end' | 'stretch'
    align?: 'start' | 'center' | 'end' | 'stretch'
}

export const Cell = styled.div<CellItem>`
    grid-row: ${props => props.row};
    grid-column: ${props => props.column};
    justify-self: ${props => props.justify ? props.justify : 'stretch'};
    align-self: ${props => props.align ? props.align : 'stretch'};
    /* background-color: aquamarine; */
`
