import Dexie from 'dexie'
import { Immutable } from 'immer'
import { ProductRow } from './rows'

class Database extends Dexie {
    products: Dexie.Table<Immutable<ProductRow>, string>

    constructor () {
        super('Database')
        this.version(1).stores({
            products: '&variableName'
        })
        this.products = this.table('products')
    }
}

export const db = new Database()
