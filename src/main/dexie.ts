import Dexie from 'dexie'
import { Immutable } from 'immer'
import { Product, ProductVariable } from './variables'

class Database extends Dexie {
    products: Dexie.Table<Immutable<ProductVariable>, Product>

    constructor () {
        super('Database')
        this.version(1).stores({
            products: '&variableName'
        })
        this.products = this.table('products')
    }
}

export const db = new Database()
