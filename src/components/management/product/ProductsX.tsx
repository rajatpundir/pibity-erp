import { Container, Item, none } from '../../../main/commons'
import * as Grid from './grids/ProductsX'
import tw from 'twin.macro'

export default function ProductsX() {
    return (
        <Container area={none} layout={Grid.layouts.main} className="bg-gray-50 rounded-lg shadow-md border-gray-200 border-2">
            <Container area={Grid.header} layout={Grid.layouts.header}>
                <Label className="rounded-tl-lg">Name</Label>
                <Label>SKU</Label>
                <Label>Orderable</Label>
                <Label>Consumable</Label>
                <Label className="rounded-tr-lg">Producable</Label>
            </Container>
            <Container area={Grid.body} layout={Grid.layouts.body}>
                <Container area={none} layout={Grid.layouts.row} className="bg-gray-100">
                    <Item>x1</Item>
                    <Item>x2</Item>
                    <Item>x3</Item>
                    <Item>x4</Item>
                    <Item>x5</Item>
                </Container>
                <Container area={none} layout={Grid.layouts.row}>
                    <Item>x1</Item>
                    <Item>x2</Item>
                    <Item>x3</Item>
                    <Item>x4</Item>
                    <Item>x5</Item>
                </Container>
                <Container area={none} layout={Grid.layouts.row} className="bg-gray-100">
                    <Item>x1</Item>
                    <Item>x2</Item>
                    <Item>x3</Item>
                    <Item>x4</Item>
                    <Item>x5</Item>
                </Container>
                <Container area={none} layout={Grid.layouts.row}>
                    <Item>x1</Item>
                    <Item>x2</Item>
                    <Item>x3</Item>
                    <Item>x4</Item>
                    <Item>x5</Item>
                </Container>
                <Container area={none} layout={Grid.layouts.row} className="bg-gray-100">
                    <Item>x1</Item>
                    <Item>x2</Item>
                    <Item>x3</Item>
                    <Item>x4</Item>
                    <Item>x5</Item>
                </Container>
                <Container area={none} layout={Grid.layouts.row}>
                    <Item>x1</Item>
                    <Item>x2</Item>
                    <Item>x3</Item>
                    <Item>x4</Item>
                    <Item>x5</Item>
                </Container>
                <Container area={none} layout={Grid.layouts.row} className="bg-gray-100">
                    <Item>x1</Item>
                    <Item>x2</Item>
                    <Item>x3</Item>
                    <Item>x4</Item>
                    <Item>x5</Item>
                </Container>
                <Container area={none} layout={Grid.layouts.row}>
                    <Item>x1</Item>
                    <Item>x2</Item>
                    <Item>x3</Item>
                    <Item>x4</Item>
                    <Item>x5</Item>
                </Container>
                <Container area={none} layout={Grid.layouts.row} className="bg-gray-100">
                    <Item>x1</Item>
                    <Item>x2</Item>
                    <Item>x3</Item>
                    <Item>x4</Item>
                    <Item>x5</Item>
                </Container>
                <Container area={none} layout={Grid.layouts.row}>
                    <Item>x1</Item>
                    <Item>x2</Item>
                    <Item>x3</Item>
                    <Item>x4</Item>
                    <Item>x5</Item>
                </Container>
            </Container>
            <Container area={Grid.footer} layout={Grid.layouts.footer}>
                <Item justify='start' align='center' className="mx-8">
                    Rows per page: 5 0-0 of 0
                </Item>
                <Item justify='end' align='center' className="mx-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                </Item>
            </Container>
        </Container>
    )
}

const Label = tw.label`whitespace-nowrap font-bold text-white w-full text-left p-4 border-b-4 bg-gray-800`
