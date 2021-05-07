import { Container, Item, none, Table, Cell } from '../../../main/commons'
import * as Grid from './grids/ProductsX'
import tw from 'twin.macro'
import { store } from '../../../main/store'
import { isoProduct, ProductVariable } from '../../../main/types'
import { Vector } from 'prelude-ts'

function getCells(products: Vector<ProductVariable>, limit: number, offset: number): Vector<unknown> {
    var counter = 0
    var cells = Vector.of()
    const start = limit * offset
    const end = start + limit
    products.toArray().slice(start, end).forEach((product, index) => {
        cells = cells.append(<Cell key={counter} className="font-bold m-2" row={`${index + 2}/${index + 3}`} column="1/2">{isoProduct.unwrap(product.variableName)}</Cell>)
        counter += 1
        cells = cells.append(<Cell key={counter} className="m-2" justify='start' row={`${index + 2}/${index + 3}`} column="2/3">{product.values.sku}</Cell>)
        counter += 1
        cells = cells.append(<Cell key={counter} className="m-2" row={`${index + 2}/${index + 3}`} column="3/4">{product.values.orderable ? 'Yes' : 'No'}</Cell>)
        counter += 1
        cells = cells.append(<Cell key={counter} className="m-2" row={`${index + 2}/${index + 3}`} column="4/5">{product.values.consumable ? 'Yes' : 'No'}</Cell>)
        counter += 1
        cells = cells.append(<Cell key={counter} className="m-2" row={`${index + 2}/${index + 3}`} column="5/6">{product.values.producable ? 'Yes' : 'No'}</Cell>)
        counter += 1
    })
    return cells
}

export default function ProductsX() {
    const products = store(state => state.variables.Product)
    const limit = 3
    const offset = 0
    return (
        <Container area={none} layout={Grid.layouts.main} className="bg-gray-100 rounded-lg shadow-lg border-gray-200 border-2">
            <Table area={Grid.body}>
                <Cell row="1/2" column="1/2" className="bg-black rounded-tl-lg">
                    <Label>Name</Label>
                </Cell>
                <Cell row="1/2" column="2/3" className="bg-black">
                    <Label>SKU</Label>
                </Cell>
                <Cell row="1/2" column="3/4" className="bg-black">
                    <Label>Orderable</Label>
                </Cell>
                <Cell row="1/2" column="4/5" className="bg-black">
                    <Label>Consumable</Label>
                </Cell>
                <Cell row="1/2" column="5/6" className="bg-black rounded-tr-lg">
                    <Label>Producable</Label>
                </Cell>
                {
                    getCells(products, limit, offset)
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                </Item>
            </Container>
        </Container>
    )
}

const Label = tw.div`text-white font-medium text-xl py-3 px-2 text-left`
