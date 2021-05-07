import { Container, Item, none, Table, GridItem } from '../../../main/commons'
import * as Grid from './grids/ProductsX'
import tw from 'twin.macro'
import { store } from '../../../main/store'
import { isoProduct, ProductVariable } from '../../../main/types'
import { Vector } from 'prelude-ts'

// Note: Implement table with Implicit Grid and grid-auto-rows instead
function getItems(products: Vector<ProductVariable>): Vector<unknown> {
    var counter = 0
    var items = Vector.of()
    products.forEach(product => {
        items = items.append(<Item key={counter} className="font-bold">{isoProduct.unwrap(product.variableName)}</Item>)
        counter += 1
        items = items.append(<Item key={counter}>{product.values.sku}</Item>)
        counter += 1
        items = items.append(<Item key={counter}>{product.values.orderable ? 'Yes' : 'No'}</Item>)
        counter += 1
        items = items.append(<Item key={counter}>{product.values.consumable ? 'Yes' : 'No'}</Item>)
        counter += 1
        items = items.append(<Item key={counter}>{product.values.producable ? 'Yes' : 'No'}</Item>)
        counter += 1
    })
    return items
}

export default function ProductsX() {
    const products = store(state => state.variables.Product)
    const limit = 10
    const offset = 0
    const start = limit * offset
    const end = start + limit
    const emptyRows = limit - Math.min(limit, products.length() - offset * limit);
    console.log('limit', limit)
    console.log('offset', offset)
    console.log('start', start)
    console.log('end', end)
    console.log('emptyRows', emptyRows)
    return (
        <Container area={none} layout={Grid.layouts.main} className="bg-gray-100 rounded-lg shadow-lg border-gray-200 border-2">
            <Container area={Grid.header} layout={Grid.layouts.header}>
                <Label className="rounded-tl-lg">Name</Label>
                <Label>SKU</Label>
                <Label>Orderable</Label>
                <Label>Consumable</Label>
                <Label className="rounded-tr-lg">Producable</Label>
            </Container>
            <Table area={Grid.body} rows={limit} columns={5}>
                {
                    getItems(products)
                }
                {/* {
                    products.toArray().slice(start, end).map((product: ProductVariable, index) => {
                        return (
                            <Container area={none} layout={Grid.layouts.row} key={isoProduct.unwrap(product.variableName)} className="odd:bg-gray-500">
                                <Item>{isoProduct.unwrap(product.variableName)}</Item>
                                <Item>{product.values.sku}</Item>
                                <Item>{product.values.orderable ? 'Yes' : 'No'}</Item>
                                <Item>{product.values.consumable ? 'Yes' : 'No'}</Item>
                                <Item>{product.values.producable ? 'Yes' : 'No'}</Item>
                            </Container>
                        )
                    })
                } */}
                {
                    Array(emptyRows * 5).fill(0).map((x, index) => <Container area={none} layout={Grid.layouts.row} key={index} className="odd:bg-gray-500" />)
                }
            </Table>
            <Container area={Grid.footer} layout={Grid.layouts.footer} className="bg-gray-50 border-t-2">
                <Item justify='start' align='center' className="mx-8">
                    Page: {offset + 1} Rows: {limit}
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
                    {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg> */}
                </Item>
            </Container>
        </Container>
    )
}

const Label = tw.label`whitespace-nowrap font-bold text-white w-full text-left p-4 border-b-4 bg-black`
