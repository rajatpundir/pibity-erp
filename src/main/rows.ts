import { Immutable } from 'immer'
import { HashSet } from 'prelude-ts'
import { DiffVariable } from './layers'
import { Region, RegionVariable, Country, CountryVariable, StateType, StateTypeVariable, District, DistrictVariable, Subdistrict, SubdistrictVariable, PostalCode, PostalCodeVariable, Address, AddressVariable, Company, CompanyVariable, CompanyAddress, CompanyAddressVariable, CompanyTagGroup, CompanyTagGroupVariable, CompanyTag, CompanyTagVariable, MappingCompanyTag, MappingCompanyTagVariable, Contact, ContactVariable, ContactAddress, ContactAddressVariable, CompanyContact, CompanyContactVariable, Currency, CurrencyVariable, CurrencyRate, CurrencyRateVariable, Memo, MemoVariable, Bank, BankVariable, BankBranch, BankBranchVariable, BankAccount, BankAccountVariable, BankTransaction, BankTransactionVariable, CompanyBankAccount, CompanyBankAccountVariable, ProductCategoryGroup, ProductCategoryGroupVariable, ProductCategory, ProductCategoryVariable, Product, ProductVariable, CompanyProduct, CompanyProductVariable, ProductTagGroup, ProductTagGroupVariable, ProductTag, ProductTagVariable, MappingProductTag, MappingProductTagVariable, Uom, UomVariable, Indent, IndentVariable, IndentItem, IndentItemVariable, Quotation, QuotationVariable, QuotationItem, QuotationItemVariable, PurchaseOrder, PurchaseOrderVariable, PurchaseOrderItem, PurchaseOrderItemVariable, PurchaseInvoice, PurchaseInvoiceVariable, PurchaseInvoiceItem, PurchaseInvoiceItemVariable, MaterialApprovalSlip, MaterialApprovalSlipVariable, MaterialApprovalSlipItem, MaterialApprovalSlipItemVariable, MaterialRejectionSlip, MaterialRejectionSlipVariable, MaterialRejectionSlipItem, MaterialRejectionSlipItemVariable, MaterialReturnSlip, MaterialReturnSlipVariable, MaterialReturnSlipItem, MaterialReturnSlipItemVariable, MaterialRequistionSlip, MaterialRequistionSlipVariable, MaterialRequistionSlipItem, MaterialRequistionSlipItemVariable, Bom, BomVariable, BomItem, BomItemVariable, ProductionPreparationSlip, ProductionPreparationSlipVariable, ProductionPreparationSlipItem, ProductionPreparationSlipItemVariable, ScrapMaterialSlip, ScrapMaterialSlipVariable, TransferMaterialSlip, TransferMaterialSlipVariable, WarehouseAcceptanceSlip, WarehouseAcceptanceSlipVariable} from './variables'

export type Row =
    | RegionRow
    | CountryRow
    | StateTypeRow
    | DistrictRow
    | SubdistrictRow
    | PostalCodeRow
    | AddressRow
    | CompanyRow
    | CompanyAddressRow
    | CompanyTagGroupRow
    | CompanyTagRow
    | MappingCompanyTagRow
    | ContactRow
    | ContactAddressRow
    | CompanyContactRow
    | CurrencyRow
    | CurrencyRateRow
    | MemoRow
    | BankRow
    | BankBranchRow
    | BankAccountRow
    | BankTransactionRow
    | CompanyBankAccountRow
    | ProductCategoryGroupRow
    | ProductCategoryRow
    | ProductRow
    | CompanyProductRow
    | ProductTagGroupRow
    | ProductTagRow
    | MappingProductTagRow
    | UomRow
    | IndentRow
    | IndentItemRow
    | QuotationRow
    | QuotationItemRow
    | PurchaseOrderRow
    | PurchaseOrderItemRow
    | PurchaseInvoiceRow
    | PurchaseInvoiceItemRow
    | MaterialApprovalSlipRow
    | MaterialApprovalSlipItemRow
    | MaterialRejectionSlipRow
    | MaterialRejectionSlipItemRow
    | MaterialReturnSlipRow
    | MaterialReturnSlipItemRow
    | MaterialRequistionSlipRow
    | MaterialRequistionSlipItemRow
    | BomRow
    | BomItemRow
    | ProductionPreparationSlipRow
    | ProductionPreparationSlipItemRow
    | ScrapMaterialSlipRow
    | TransferMaterialSlipRow
    | WarehouseAcceptanceSlipRow
export class RegionRow {
    readonly typeName = 'Region'
    readonly id: number
    readonly name: string
    values: {
        name: string 
    }

    constructor(id: number, values: { name: string }) {
        this.id = id
        this.values = values
        this.name = values.name
    }

    static toVariable(row: RegionRow): RegionVariable {
        return new RegionVariable(row.id, {
            name: row.values.name
        })
    }
}

export class CountryRow {
    readonly typeName = 'Country'
    readonly id: number
    readonly region: number
    readonly name: string
    values: {
        region: number
        name: string 
    }

    constructor(id: number, values: { region: number, name: string }) {
        this.id = id
        this.values = values
        this.region = values.region
        this.name = values.name
    }

    static toVariable(row: CountryRow): CountryVariable {
        return new CountryVariable(row.id, {
            region: new Region(row.values.region),
            name: row.values.name
        })
    }
}

export class StateTypeRow {
    readonly typeName = 'StateType'
    readonly id: number
    readonly country: number
    readonly name: string
    values: {
        country: number
        name: string 
    }

    constructor(id: number, values: { country: number, name: string }) {
        this.id = id
        this.values = values
        this.country = values.country
        this.name = values.name
    }

    static toVariable(row: StateTypeRow): StateTypeVariable {
        return new StateTypeVariable(row.id, {
            country: new Country(row.values.country),
            name: row.values.name
        })
    }
}

export class DistrictRow {
    readonly typeName = 'District'
    readonly id: number
    readonly state: number
    readonly name: string
    values: {
        state: number
        name: string 
    }

    constructor(id: number, values: { state: number, name: string }) {
        this.id = id
        this.values = values
        this.state = values.state
        this.name = values.name
    }

    static toVariable(row: DistrictRow): DistrictVariable {
        return new DistrictVariable(row.id, {
            state: new StateType(row.values.state),
            name: row.values.name
        })
    }
}

export class SubdistrictRow {
    readonly typeName = 'Subdistrict'
    readonly id: number
    readonly district: number
    readonly name: string
    values: {
        district: number
        name: string 
    }

    constructor(id: number, values: { district: number, name: string }) {
        this.id = id
        this.values = values
        this.district = values.district
        this.name = values.name
    }

    static toVariable(row: SubdistrictRow): SubdistrictVariable {
        return new SubdistrictVariable(row.id, {
            district: new District(row.values.district),
            name: row.values.name
        })
    }
}

export class PostalCodeRow {
    readonly typeName = 'PostalCode'
    readonly id: number
    readonly subdistrict: number
    readonly name: string
    values: {
        subdistrict: number
        name: string 
    }

    constructor(id: number, values: { subdistrict: number, name: string }) {
        this.id = id
        this.values = values
        this.subdistrict = values.subdistrict
        this.name = values.name
    }

    static toVariable(row: PostalCodeRow): PostalCodeVariable {
        return new PostalCodeVariable(row.id, {
            subdistrict: new Subdistrict(row.values.subdistrict),
            name: row.values.name
        })
    }
}

export class AddressRow {
    readonly typeName = 'Address'
    readonly id: number
    readonly postalCode: number
    readonly line1: string
    readonly line2: string
    values: {
        postalCode: number
        line1: string
        line2: string
        latitude: number
        longitude: number 
    }

    constructor(id: number, values: { postalCode: number, line1: string, line2: string, latitude: number, longitude: number }) {
        this.id = id
        this.values = values
        this.postalCode = values.postalCode
        this.line1 = values.line1
        this.line2 = values.line2
    }

    static toVariable(row: AddressRow): AddressVariable {
        return new AddressVariable(row.id, {
            postalCode: new PostalCode(row.values.postalCode),
            line1: row.values.line1,
            line2: row.values.line2,
            latitude: row.values.latitude,
            longitude: row.values.longitude
        })
    }
}

export class CompanyRow {
    readonly typeName = 'Company'
    readonly id: number
    readonly name: string
    values: {
        name: string
        email: string
        telephone: string
        mobile: string
        website: string
        gstin: string
        pan: string
        iec: string 
    }

    constructor(id: number, values: { name: string, email: string, telephone: string, mobile: string, website: string, gstin: string, pan: string, iec: string }) {
        this.id = id
        this.values = values
        this.name = values.name
    }

    static toVariable(row: CompanyRow): CompanyVariable {
        return new CompanyVariable(row.id, {
            name: row.values.name,
            email: row.values.email,
            telephone: row.values.telephone,
            mobile: row.values.mobile,
            website: row.values.website,
            gstin: row.values.gstin,
            pan: row.values.pan,
            iec: row.values.iec
        })
    }
}

export class CompanyAddressRow {
    readonly typeName = 'CompanyAddress'
    readonly id: number
    readonly company: number
    readonly name: string
    readonly address: number
    values: {
        company: number
        name: string
        address: number 
    }

    constructor(id: number, values: { company: number, name: string, address: number }) {
        this.id = id
        this.values = values
        this.company = values.company
        this.name = values.name
        this.address = values.address
    }

    static toVariable(row: CompanyAddressRow): CompanyAddressVariable {
        return new CompanyAddressVariable(row.id, {
            company: new Company(row.values.company),
            name: row.values.name,
            address: new Address(row.values.address)
        })
    }
}

export class CompanyTagGroupRow {
    readonly typeName = 'CompanyTagGroup'
    readonly id: number
    readonly name: string
    values: {
        name: string 
    }

    constructor(id: number, values: { name: string }) {
        this.id = id
        this.values = values
        this.name = values.name
    }

    static toVariable(row: CompanyTagGroupRow): CompanyTagGroupVariable {
        return new CompanyTagGroupVariable(row.id, {
            name: row.values.name
        })
    }
}

export class CompanyTagRow {
    readonly typeName = 'CompanyTag'
    readonly id: number
    readonly group: number
    readonly name: string
    values: {
        group: number
        name: string 
    }

    constructor(id: number, values: { group: number, name: string }) {
        this.id = id
        this.values = values
        this.group = values.group
        this.name = values.name
    }

    static toVariable(row: CompanyTagRow): CompanyTagVariable {
        return new CompanyTagVariable(row.id, {
            group: new CompanyTagGroup(row.values.group),
            name: row.values.name
        })
    }
}

export class MappingCompanyTagRow {
    readonly typeName = 'MappingCompanyTag'
    readonly id: number
    readonly company: number
    readonly tag: number
    values: {
        company: number
        tag: number 
    }

    constructor(id: number, values: { company: number, tag: number }) {
        this.id = id
        this.values = values
        this.company = values.company
        this.tag = values.tag
    }

    static toVariable(row: MappingCompanyTagRow): MappingCompanyTagVariable {
        return new MappingCompanyTagVariable(row.id, {
            company: new Company(row.values.company),
            tag: new CompanyTag(row.values.tag)
        })
    }
}

export class ContactRow {
    readonly typeName = 'Contact'
    readonly id: number
    readonly name: string
    values: {
        name: string
        email: string
        telephone: string
        mobile: string
        website: string 
    }

    constructor(id: number, values: { name: string, email: string, telephone: string, mobile: string, website: string }) {
        this.id = id
        this.values = values
        this.name = values.name
    }

    static toVariable(row: ContactRow): ContactVariable {
        return new ContactVariable(row.id, {
            name: row.values.name,
            email: row.values.email,
            telephone: row.values.telephone,
            mobile: row.values.mobile,
            website: row.values.website
        })
    }
}

export class ContactAddressRow {
    readonly typeName = 'ContactAddress'
    readonly id: number
    readonly contact: number
    readonly name: string
    readonly address: number
    values: {
        contact: number
        name: string
        address: number 
    }

    constructor(id: number, values: { contact: number, name: string, address: number }) {
        this.id = id
        this.values = values
        this.contact = values.contact
        this.name = values.name
        this.address = values.address
    }

    static toVariable(row: ContactAddressRow): ContactAddressVariable {
        return new ContactAddressVariable(row.id, {
            contact: new Contact(row.values.contact),
            name: row.values.name,
            address: new Address(row.values.address)
        })
    }
}

export class CompanyContactRow {
    readonly typeName = 'CompanyContact'
    readonly id: number
    readonly company: number
    readonly contact: number
    values: {
        company: number
        contact: number
        role: string
        email: string
        telephone: string
        mobile: string 
    }

    constructor(id: number, values: { company: number, contact: number, role: string, email: string, telephone: string, mobile: string }) {
        this.id = id
        this.values = values
        this.company = values.company
        this.contact = values.contact
    }

    static toVariable(row: CompanyContactRow): CompanyContactVariable {
        return new CompanyContactVariable(row.id, {
            company: new Company(row.values.company),
            contact: new Contact(row.values.contact),
            role: row.values.role,
            email: row.values.email,
            telephone: row.values.telephone,
            mobile: row.values.mobile
        })
    }
}

export class CurrencyRow {
    readonly typeName = 'Currency'
    readonly id: number
    readonly name: string
    values: {
        name: string 
    }

    constructor(id: number, values: { name: string }) {
        this.id = id
        this.values = values
        this.name = values.name
    }

    static toVariable(row: CurrencyRow): CurrencyVariable {
        return new CurrencyVariable(row.id, {
            name: row.values.name
        })
    }
}

export class CurrencyRateRow {
    readonly typeName = 'CurrencyRate'
    readonly id: number
    values: {
        currency: number
        conversionRate: number
        startTime: number
        endTime: number 
    }

    constructor(id: number, values: { currency: number, conversionRate: number, startTime: number, endTime: number }) {
        this.id = id
        this.values = values
    }

    static toVariable(row: CurrencyRateRow): CurrencyRateVariable {
        return new CurrencyRateVariable(row.id, {
            currency: new Currency(row.values.currency),
            conversionRate: row.values.conversionRate,
            startTime: row.values.startTime,
            endTime: row.values.endTime
        })
    }
}

export class MemoRow {
    readonly typeName = 'Memo'
    readonly id: number
    values: {
        company: number
        currency: number
        amount: number
        unsettled: number 
    }

    constructor(id: number, values: { company: number, currency: number, amount: number, unsettled: number }) {
        this.id = id
        this.values = values
    }

    static toVariable(row: MemoRow): MemoVariable {
        return new MemoVariable(row.id, {
            company: new Company(row.values.company),
            currency: new Currency(row.values.currency),
            amount: row.values.amount,
            unsettled: row.values.unsettled
        })
    }
}

export class BankRow {
    readonly typeName = 'Bank'
    readonly id: number
    readonly country: number
    readonly name: string
    values: {
        country: number
        name: string
        website: string 
    }

    constructor(id: number, values: { country: number, name: string, website: string }) {
        this.id = id
        this.values = values
        this.country = values.country
        this.name = values.name
    }

    static toVariable(row: BankRow): BankVariable {
        return new BankVariable(row.id, {
            country: new Country(row.values.country),
            name: row.values.name,
            website: row.values.website
        })
    }
}

export class BankBranchRow {
    readonly typeName = 'BankBranch'
    readonly id: number
    readonly bank: number
    readonly name: string
    readonly ifsc: string
    values: {
        bank: number
        name: string
        ifsc: string
        address: number 
    }

    constructor(id: number, values: { bank: number, name: string, ifsc: string, address: number }) {
        this.id = id
        this.values = values
        this.bank = values.bank
        this.name = values.name
        this.ifsc = values.ifsc
    }

    static toVariable(row: BankBranchRow): BankBranchVariable {
        return new BankBranchVariable(row.id, {
            bank: new Bank(row.values.bank),
            name: row.values.name,
            ifsc: row.values.ifsc,
            address: new Address(row.values.address)
        })
    }
}

export class BankAccountRow {
    readonly typeName = 'BankAccount'
    readonly id: number
    readonly bank: number
    readonly accountNumber: string
    values: {
        bank: number
        bankBranch: number
        accountNumber: string
        accountName: string
        currency: number 
    }

    constructor(id: number, values: { bank: number, bankBranch: number, accountNumber: string, accountName: string, currency: number }) {
        this.id = id
        this.values = values
        this.bank = values.bank
        this.accountNumber = values.accountNumber
    }

    static toVariable(row: BankAccountRow): BankAccountVariable {
        return new BankAccountVariable(row.id, {
            bank: new Bank(row.values.bank),
            bankBranch: new BankBranch(row.values.bankBranch),
            accountNumber: row.values.accountNumber,
            accountName: row.values.accountName,
            currency: new Currency(row.values.currency)
        })
    }
}

export class BankTransactionRow {
    readonly typeName = 'BankTransaction'
    readonly id: number
    values: {
        timestamp: number
        memo: number
        currencyRate: number
        bankAccount: number
        fromToAccount: number
        credit: number
        debit: number 
    }

    constructor(id: number, values: { timestamp: number, memo: number, currencyRate: number, bankAccount: number, fromToAccount: number, credit: number, debit: number }) {
        this.id = id
        this.values = values
    }

    static toVariable(row: BankTransactionRow): BankTransactionVariable {
        return new BankTransactionVariable(row.id, {
            timestamp: row.values.timestamp,
            memo: new Memo(row.values.memo),
            currencyRate: new CurrencyRate(row.values.currencyRate),
            bankAccount: new BankAccount(row.values.bankAccount),
            fromToAccount: new BankAccount(row.values.fromToAccount),
            credit: row.values.credit,
            debit: row.values.debit
        })
    }
}

export class CompanyBankAccountRow {
    readonly typeName = 'CompanyBankAccount'
    readonly id: number
    readonly company: number
    readonly bankAccount: number
    values: {
        company: number
        bankAccount: number 
    }

    constructor(id: number, values: { company: number, bankAccount: number }) {
        this.id = id
        this.values = values
        this.company = values.company
        this.bankAccount = values.bankAccount
    }

    static toVariable(row: CompanyBankAccountRow): CompanyBankAccountVariable {
        return new CompanyBankAccountVariable(row.id, {
            company: new Company(row.values.company),
            bankAccount: new BankAccount(row.values.bankAccount)
        })
    }
}

export class ProductCategoryGroupRow {
    readonly typeName = 'ProductCategoryGroup'
    readonly id: number
    readonly parent: number
    values: {
        parent: number
        name: string
        length: number 
    }

    constructor(id: number, values: { parent: number, name: string, length: number }) {
        this.id = id
        this.values = values
        this.parent = values.parent
    }

    static toVariable(row: ProductCategoryGroupRow): ProductCategoryGroupVariable {
        return new ProductCategoryGroupVariable(row.id, {
            parent: new ProductCategoryGroup(row.values.parent),
            name: row.values.name,
            length: row.values.length
        })
    }
}

export class ProductCategoryRow {
    readonly typeName = 'ProductCategory'
    readonly id: number
    readonly parent: number
    readonly name: string
    readonly code: string
    values: {
        parent: number
        group: number
        name: string
        code: string
        derivedCode: string
        childCount: number 
    }

    constructor(id: number, values: { parent: number, group: number, name: string, code: string, derivedCode: string, childCount: number }) {
        this.id = id
        this.values = values
        this.parent = values.parent
        this.name = values.name
        this.code = values.code
    }

    static toVariable(row: ProductCategoryRow): ProductCategoryVariable {
        return new ProductCategoryVariable(row.id, {
            parent: new ProductCategory(row.values.parent),
            group: new ProductCategoryGroup(row.values.group),
            name: row.values.name,
            code: row.values.code,
            derivedCode: row.values.derivedCode,
            childCount: row.values.childCount
        })
    }
}

export class ProductRow {
    readonly typeName = 'Product'
    readonly id: number
    readonly name: string
    values: {
        name: string
        category: number
        code: string
        sku: string 
    }

    constructor(id: number, values: { name: string, category: number, code: string, sku: string }) {
        this.id = id
        this.values = values
        this.name = values.name
    }

    static toVariable(row: ProductRow): ProductVariable {
        return new ProductVariable(row.id, {
            name: row.values.name,
            category: new ProductCategory(row.values.category),
            code: row.values.code,
            sku: row.values.sku
        })
    }
}

export class CompanyProductRow {
    readonly typeName = 'CompanyProduct'
    readonly id: number
    readonly company: number
    readonly product: number
    values: {
        company: number
        product: number 
    }

    constructor(id: number, values: { company: number, product: number }) {
        this.id = id
        this.values = values
        this.company = values.company
        this.product = values.product
    }

    static toVariable(row: CompanyProductRow): CompanyProductVariable {
        return new CompanyProductVariable(row.id, {
            company: new Company(row.values.company),
            product: new Product(row.values.product)
        })
    }
}

export class ProductTagGroupRow {
    readonly typeName = 'ProductTagGroup'
    readonly id: number
    readonly name: string
    values: {
        name: string 
    }

    constructor(id: number, values: { name: string }) {
        this.id = id
        this.values = values
        this.name = values.name
    }

    static toVariable(row: ProductTagGroupRow): ProductTagGroupVariable {
        return new ProductTagGroupVariable(row.id, {
            name: row.values.name
        })
    }
}

export class ProductTagRow {
    readonly typeName = 'ProductTag'
    readonly id: number
    readonly group: number
    readonly name: string
    values: {
        group: number
        name: string 
    }

    constructor(id: number, values: { group: number, name: string }) {
        this.id = id
        this.values = values
        this.group = values.group
        this.name = values.name
    }

    static toVariable(row: ProductTagRow): ProductTagVariable {
        return new ProductTagVariable(row.id, {
            group: new ProductTagGroup(row.values.group),
            name: row.values.name
        })
    }
}

export class MappingProductTagRow {
    readonly typeName = 'MappingProductTag'
    readonly id: number
    readonly product: number
    readonly tag: number
    values: {
        product: number
        tag: number 
    }

    constructor(id: number, values: { product: number, tag: number }) {
        this.id = id
        this.values = values
        this.product = values.product
        this.tag = values.tag
    }

    static toVariable(row: MappingProductTagRow): MappingProductTagVariable {
        return new MappingProductTagVariable(row.id, {
            product: new Product(row.values.product),
            tag: new ProductTag(row.values.tag)
        })
    }
}

export class UomRow {
    readonly typeName = 'Uom'
    readonly id: number
    readonly product: number
    readonly name: string
    values: {
        product: number
        name: string
        conversionRate: number 
    }

    constructor(id: number, values: { product: number, name: string, conversionRate: number }) {
        this.id = id
        this.values = values
        this.product = values.product
        this.name = values.name
    }

    static toVariable(row: UomRow): UomVariable {
        return new UomVariable(row.id, {
            product: new Product(row.values.product),
            name: row.values.name,
            conversionRate: row.values.conversionRate
        })
    }
}

export class IndentRow {
    readonly typeName = 'Indent'
    readonly id: number
    values: {}

    constructor(id: number, values: {  }) {
        this.id = id
        this.values = values
    }

    static toVariable(row: IndentRow): IndentVariable {
        return new IndentVariable(row.id, {})
    }
}

export class IndentItemRow {
    readonly typeName = 'IndentItem'
    readonly id: number
    readonly indent: number
    readonly product: number
    values: {
        indent: number
        product: number
        quantity: number
        uom: number
        ordered: number
        received: number
        approved: number
        rejected: number
        returned: number
        requisted: number
        consumed: number 
    }

    constructor(id: number, values: { indent: number, product: number, quantity: number, uom: number, ordered: number, received: number, approved: number, rejected: number, returned: number, requisted: number, consumed: number }) {
        this.id = id
        this.values = values
        this.indent = values.indent
        this.product = values.product
    }

    static toVariable(row: IndentItemRow): IndentItemVariable {
        return new IndentItemVariable(row.id, {
            indent: new Indent(row.values.indent),
            product: new Product(row.values.product),
            quantity: row.values.quantity,
            uom: new Uom(row.values.uom),
            ordered: row.values.ordered,
            received: row.values.received,
            approved: row.values.approved,
            rejected: row.values.rejected,
            returned: row.values.returned,
            requisted: row.values.requisted,
            consumed: row.values.consumed
        })
    }
}

export class QuotationRow {
    readonly typeName = 'Quotation'
    readonly id: number
    values: {
        indent: number
        company: number 
    }

    constructor(id: number, values: { indent: number, company: number }) {
        this.id = id
        this.values = values
    }

    static toVariable(row: QuotationRow): QuotationVariable {
        return new QuotationVariable(row.id, {
            indent: new Indent(row.values.indent),
            company: new Company(row.values.company)
        })
    }
}

export class QuotationItemRow {
    readonly typeName = 'QuotationItem'
    readonly id: number
    readonly quotation: number
    readonly indentItem: number
    values: {
        quotation: number
        indentItem: number
        quantity: number 
    }

    constructor(id: number, values: { quotation: number, indentItem: number, quantity: number }) {
        this.id = id
        this.values = values
        this.quotation = values.quotation
        this.indentItem = values.indentItem
    }

    static toVariable(row: QuotationItemRow): QuotationItemVariable {
        return new QuotationItemVariable(row.id, {
            quotation: new Quotation(row.values.quotation),
            indentItem: new IndentItem(row.values.indentItem),
            quantity: row.values.quantity
        })
    }
}

export class PurchaseOrderRow {
    readonly typeName = 'PurchaseOrder'
    readonly id: number
    values: {
        quotation: number 
    }

    constructor(id: number, values: { quotation: number }) {
        this.id = id
        this.values = values
    }

    static toVariable(row: PurchaseOrderRow): PurchaseOrderVariable {
        return new PurchaseOrderVariable(row.id, {
            quotation: new Quotation(row.values.quotation)
        })
    }
}

export class PurchaseOrderItemRow {
    readonly typeName = 'PurchaseOrderItem'
    readonly id: number
    readonly purchaseOrder: number
    readonly quotationItem: number
    values: {
        purchaseOrder: number
        quotationItem: number
        quantity: number
        price: number
        received: number 
    }

    constructor(id: number, values: { purchaseOrder: number, quotationItem: number, quantity: number, price: number, received: number }) {
        this.id = id
        this.values = values
        this.purchaseOrder = values.purchaseOrder
        this.quotationItem = values.quotationItem
    }

    static toVariable(row: PurchaseOrderItemRow): PurchaseOrderItemVariable {
        return new PurchaseOrderItemVariable(row.id, {
            purchaseOrder: new PurchaseOrder(row.values.purchaseOrder),
            quotationItem: new QuotationItem(row.values.quotationItem),
            quantity: row.values.quantity,
            price: row.values.price,
            received: row.values.received
        })
    }
}

export class PurchaseInvoiceRow {
    readonly typeName = 'PurchaseInvoice'
    readonly id: number
    values: {
        purchaseOrder: number 
    }

    constructor(id: number, values: { purchaseOrder: number }) {
        this.id = id
        this.values = values
    }

    static toVariable(row: PurchaseInvoiceRow): PurchaseInvoiceVariable {
        return new PurchaseInvoiceVariable(row.id, {
            purchaseOrder: new PurchaseOrder(row.values.purchaseOrder)
        })
    }
}

export class PurchaseInvoiceItemRow {
    readonly typeName = 'PurchaseInvoiceItem'
    readonly id: number
    readonly purchaseInvoice: number
    readonly purchaseOrderItem: number
    values: {
        purchaseInvoice: number
        purchaseOrderItem: number
        quantity: number
        approved: number
        rejected: number 
    }

    constructor(id: number, values: { purchaseInvoice: number, purchaseOrderItem: number, quantity: number, approved: number, rejected: number }) {
        this.id = id
        this.values = values
        this.purchaseInvoice = values.purchaseInvoice
        this.purchaseOrderItem = values.purchaseOrderItem
    }

    static toVariable(row: PurchaseInvoiceItemRow): PurchaseInvoiceItemVariable {
        return new PurchaseInvoiceItemVariable(row.id, {
            purchaseInvoice: new PurchaseInvoice(row.values.purchaseInvoice),
            purchaseOrderItem: new PurchaseOrderItem(row.values.purchaseOrderItem),
            quantity: row.values.quantity,
            approved: row.values.approved,
            rejected: row.values.rejected
        })
    }
}

export class MaterialApprovalSlipRow {
    readonly typeName = 'MaterialApprovalSlip'
    readonly id: number
    values: {
        purchaseInvoice: number 
    }

    constructor(id: number, values: { purchaseInvoice: number }) {
        this.id = id
        this.values = values
    }

    static toVariable(row: MaterialApprovalSlipRow): MaterialApprovalSlipVariable {
        return new MaterialApprovalSlipVariable(row.id, {
            purchaseInvoice: new PurchaseInvoice(row.values.purchaseInvoice)
        })
    }
}

export class MaterialApprovalSlipItemRow {
    readonly typeName = 'MaterialApprovalSlipItem'
    readonly id: number
    readonly materialApprovalSlip: number
    readonly purchaseInvoiceItem: number
    values: {
        materialApprovalSlip: number
        purchaseInvoiceItem: number
        quantity: number
        requisted: number 
    }

    constructor(id: number, values: { materialApprovalSlip: number, purchaseInvoiceItem: number, quantity: number, requisted: number }) {
        this.id = id
        this.values = values
        this.materialApprovalSlip = values.materialApprovalSlip
        this.purchaseInvoiceItem = values.purchaseInvoiceItem
    }

    static toVariable(row: MaterialApprovalSlipItemRow): MaterialApprovalSlipItemVariable {
        return new MaterialApprovalSlipItemVariable(row.id, {
            materialApprovalSlip: new MaterialApprovalSlip(row.values.materialApprovalSlip),
            purchaseInvoiceItem: new PurchaseInvoiceItem(row.values.purchaseInvoiceItem),
            quantity: row.values.quantity,
            requisted: row.values.requisted
        })
    }
}

export class MaterialRejectionSlipRow {
    readonly typeName = 'MaterialRejectionSlip'
    readonly id: number
    values: {
        purchaseInvoice: number 
    }

    constructor(id: number, values: { purchaseInvoice: number }) {
        this.id = id
        this.values = values
    }

    static toVariable(row: MaterialRejectionSlipRow): MaterialRejectionSlipVariable {
        return new MaterialRejectionSlipVariable(row.id, {
            purchaseInvoice: new PurchaseInvoice(row.values.purchaseInvoice)
        })
    }
}

export class MaterialRejectionSlipItemRow {
    readonly typeName = 'MaterialRejectionSlipItem'
    readonly id: number
    readonly materialRejectionSlip: number
    readonly purchaseInvoiceItem: number
    values: {
        materialRejectionSlip: number
        purchaseInvoiceItem: number
        quantity: number
        returned: number 
    }

    constructor(id: number, values: { materialRejectionSlip: number, purchaseInvoiceItem: number, quantity: number, returned: number }) {
        this.id = id
        this.values = values
        this.materialRejectionSlip = values.materialRejectionSlip
        this.purchaseInvoiceItem = values.purchaseInvoiceItem
    }

    static toVariable(row: MaterialRejectionSlipItemRow): MaterialRejectionSlipItemVariable {
        return new MaterialRejectionSlipItemVariable(row.id, {
            materialRejectionSlip: new MaterialRejectionSlip(row.values.materialRejectionSlip),
            purchaseInvoiceItem: new PurchaseInvoiceItem(row.values.purchaseInvoiceItem),
            quantity: row.values.quantity,
            returned: row.values.returned
        })
    }
}

export class MaterialReturnSlipRow {
    readonly typeName = 'MaterialReturnSlip'
    readonly id: number
    values: {
        materialRejectionSlip: number 
    }

    constructor(id: number, values: { materialRejectionSlip: number }) {
        this.id = id
        this.values = values
    }

    static toVariable(row: MaterialReturnSlipRow): MaterialReturnSlipVariable {
        return new MaterialReturnSlipVariable(row.id, {
            materialRejectionSlip: new MaterialRejectionSlip(row.values.materialRejectionSlip)
        })
    }
}

export class MaterialReturnSlipItemRow {
    readonly typeName = 'MaterialReturnSlipItem'
    readonly id: number
    readonly materialReturnSlip: number
    readonly materialRejectionSlipItem: number
    values: {
        materialReturnSlip: number
        materialRejectionSlipItem: number
        quantity: number 
    }

    constructor(id: number, values: { materialReturnSlip: number, materialRejectionSlipItem: number, quantity: number }) {
        this.id = id
        this.values = values
        this.materialReturnSlip = values.materialReturnSlip
        this.materialRejectionSlipItem = values.materialRejectionSlipItem
    }

    static toVariable(row: MaterialReturnSlipItemRow): MaterialReturnSlipItemVariable {
        return new MaterialReturnSlipItemVariable(row.id, {
            materialReturnSlip: new MaterialReturnSlip(row.values.materialReturnSlip),
            materialRejectionSlipItem: new MaterialRejectionSlipItem(row.values.materialRejectionSlipItem),
            quantity: row.values.quantity
        })
    }
}

export class MaterialRequistionSlipRow {
    readonly typeName = 'MaterialRequistionSlip'
    readonly id: number
    values: {
        materialApprovalSlip: number 
    }

    constructor(id: number, values: { materialApprovalSlip: number }) {
        this.id = id
        this.values = values
    }

    static toVariable(row: MaterialRequistionSlipRow): MaterialRequistionSlipVariable {
        return new MaterialRequistionSlipVariable(row.id, {
            materialApprovalSlip: new MaterialApprovalSlip(row.values.materialApprovalSlip)
        })
    }
}

export class MaterialRequistionSlipItemRow {
    readonly typeName = 'MaterialRequistionSlipItem'
    readonly id: number
    readonly materialRequistionSlip: number
    readonly materialApprovalSlipItem: number
    values: {
        materialRequistionSlip: number
        materialApprovalSlipItem: number
        quantity: number
        consumed: number 
    }

    constructor(id: number, values: { materialRequistionSlip: number, materialApprovalSlipItem: number, quantity: number, consumed: number }) {
        this.id = id
        this.values = values
        this.materialRequistionSlip = values.materialRequistionSlip
        this.materialApprovalSlipItem = values.materialApprovalSlipItem
    }

    static toVariable(row: MaterialRequistionSlipItemRow): MaterialRequistionSlipItemVariable {
        return new MaterialRequistionSlipItemVariable(row.id, {
            materialRequistionSlip: new MaterialRequistionSlip(row.values.materialRequistionSlip),
            materialApprovalSlipItem: new MaterialApprovalSlipItem(row.values.materialApprovalSlipItem),
            quantity: row.values.quantity,
            consumed: row.values.consumed
        })
    }
}

export class BomRow {
    readonly typeName = 'Bom'
    readonly id: number
    readonly name: string
    values: {
        name: string 
    }

    constructor(id: number, values: { name: string }) {
        this.id = id
        this.values = values
        this.name = values.name
    }

    static toVariable(row: BomRow): BomVariable {
        return new BomVariable(row.id, {
            name: row.values.name
        })
    }
}

export class BomItemRow {
    readonly typeName = 'BomItem'
    readonly id: number
    readonly bom: number
    readonly product: number
    values: {
        bom: number
        product: number
        quantity: number
        uom: number 
    }

    constructor(id: number, values: { bom: number, product: number, quantity: number, uom: number }) {
        this.id = id
        this.values = values
        this.bom = values.bom
        this.product = values.product
    }

    static toVariable(row: BomItemRow): BomItemVariable {
        return new BomItemVariable(row.id, {
            bom: new Bom(row.values.bom),
            product: new Product(row.values.product),
            quantity: row.values.quantity,
            uom: new Uom(row.values.uom)
        })
    }
}

export class ProductionPreparationSlipRow {
    readonly typeName = 'ProductionPreparationSlip'
    readonly id: number
    values: {
        bom: number
        approved: number
        scrapped: number 
    }

    constructor(id: number, values: { bom: number, approved: number, scrapped: number }) {
        this.id = id
        this.values = values
    }

    static toVariable(row: ProductionPreparationSlipRow): ProductionPreparationSlipVariable {
        return new ProductionPreparationSlipVariable(row.id, {
            bom: new Bom(row.values.bom),
            approved: row.values.approved,
            scrapped: row.values.scrapped
        })
    }
}

export class ProductionPreparationSlipItemRow {
    readonly typeName = 'ProductionPreparationSlipItem'
    readonly id: number
    readonly productionPreparationSlip: number
    readonly bomItem: string
    values: {
        productionPreparationSlip: number
        bomItem: string
        materialRequistionSlipItem: number 
    }

    constructor(id: number, values: { productionPreparationSlip: number, bomItem: string, materialRequistionSlipItem: number }) {
        this.id = id
        this.values = values
        this.productionPreparationSlip = values.productionPreparationSlip
        this.bomItem = values.bomItem
    }

    static toVariable(row: ProductionPreparationSlipItemRow): ProductionPreparationSlipItemVariable {
        return new ProductionPreparationSlipItemVariable(row.id, {
            productionPreparationSlip: new ProductionPreparationSlip(row.values.productionPreparationSlip),
            bomItem: row.values.bomItem,
            materialRequistionSlipItem: new MaterialRequistionSlipItem(row.values.materialRequistionSlipItem)
        })
    }
}

export class ScrapMaterialSlipRow {
    readonly typeName = 'ScrapMaterialSlip'
    readonly id: number
    values: {
        productionPreparationSlip: number
        quantity: number 
    }

    constructor(id: number, values: { productionPreparationSlip: number, quantity: number }) {
        this.id = id
        this.values = values
    }

    static toVariable(row: ScrapMaterialSlipRow): ScrapMaterialSlipVariable {
        return new ScrapMaterialSlipVariable(row.id, {
            productionPreparationSlip: new ProductionPreparationSlip(row.values.productionPreparationSlip),
            quantity: row.values.quantity
        })
    }
}

export class TransferMaterialSlipRow {
    readonly typeName = 'TransferMaterialSlip'
    readonly id: number
    values: {
        productionPreparationSlip: number
        quantity: number
        transferred: number 
    }

    constructor(id: number, values: { productionPreparationSlip: number, quantity: number, transferred: number }) {
        this.id = id
        this.values = values
    }

    static toVariable(row: TransferMaterialSlipRow): TransferMaterialSlipVariable {
        return new TransferMaterialSlipVariable(row.id, {
            productionPreparationSlip: new ProductionPreparationSlip(row.values.productionPreparationSlip),
            quantity: row.values.quantity,
            transferred: row.values.transferred
        })
    }
}

export class WarehouseAcceptanceSlipRow {
    readonly typeName = 'WarehouseAcceptanceSlip'
    readonly id: number
    values: {
        transferMaterialSlip: number
        quantity: number 
    }

    constructor(id: number, values: { transferMaterialSlip: number, quantity: number }) {
        this.id = id
        this.values = values
    }

    static toVariable(row: WarehouseAcceptanceSlipRow): WarehouseAcceptanceSlipVariable {
        return new WarehouseAcceptanceSlipVariable(row.id, {
            transferMaterialSlip: new TransferMaterialSlip(row.values.transferMaterialSlip),
            quantity: row.values.quantity
        })
    }
}export class DiffRow {
  readonly id?: number
  active: boolean
  variables: {
      Region: {
          replace: Array<RegionRow>
          remove: Array<number>
      },
      Country: {
          replace: Array<CountryRow>
          remove: Array<number>
      },
      StateType: {
          replace: Array<StateTypeRow>
          remove: Array<number>
      },
      District: {
          replace: Array<DistrictRow>
          remove: Array<number>
      },
      Subdistrict: {
          replace: Array<SubdistrictRow>
          remove: Array<number>
      },
      PostalCode: {
          replace: Array<PostalCodeRow>
          remove: Array<number>
      },
      Address: {
          replace: Array<AddressRow>
          remove: Array<number>
      },
      Company: {
          replace: Array<CompanyRow>
          remove: Array<number>
      },
      CompanyAddress: {
          replace: Array<CompanyAddressRow>
          remove: Array<number>
      },
      CompanyTagGroup: {
          replace: Array<CompanyTagGroupRow>
          remove: Array<number>
      },
      CompanyTag: {
          replace: Array<CompanyTagRow>
          remove: Array<number>
      },
      MappingCompanyTag: {
          replace: Array<MappingCompanyTagRow>
          remove: Array<number>
      },
      Contact: {
          replace: Array<ContactRow>
          remove: Array<number>
      },
      ContactAddress: {
          replace: Array<ContactAddressRow>
          remove: Array<number>
      },
      CompanyContact: {
          replace: Array<CompanyContactRow>
          remove: Array<number>
      },
      Currency: {
          replace: Array<CurrencyRow>
          remove: Array<number>
      },
      CurrencyRate: {
          replace: Array<CurrencyRateRow>
          remove: Array<number>
      },
      Memo: {
          replace: Array<MemoRow>
          remove: Array<number>
      },
      Bank: {
          replace: Array<BankRow>
          remove: Array<number>
      },
      BankBranch: {
          replace: Array<BankBranchRow>
          remove: Array<number>
      },
      BankAccount: {
          replace: Array<BankAccountRow>
          remove: Array<number>
      },
      BankTransaction: {
          replace: Array<BankTransactionRow>
          remove: Array<number>
      },
      CompanyBankAccount: {
          replace: Array<CompanyBankAccountRow>
          remove: Array<number>
      },
      ProductCategoryGroup: {
          replace: Array<ProductCategoryGroupRow>
          remove: Array<number>
      },
      ProductCategory: {
          replace: Array<ProductCategoryRow>
          remove: Array<number>
      },
      Product: {
          replace: Array<ProductRow>
          remove: Array<number>
      },
      CompanyProduct: {
          replace: Array<CompanyProductRow>
          remove: Array<number>
      },
      ProductTagGroup: {
          replace: Array<ProductTagGroupRow>
          remove: Array<number>
      },
      ProductTag: {
          replace: Array<ProductTagRow>
          remove: Array<number>
      },
      MappingProductTag: {
          replace: Array<MappingProductTagRow>
          remove: Array<number>
      },
      Uom: {
          replace: Array<UomRow>
          remove: Array<number>
      },
      Indent: {
          replace: Array<IndentRow>
          remove: Array<number>
      },
      IndentItem: {
          replace: Array<IndentItemRow>
          remove: Array<number>
      },
      Quotation: {
          replace: Array<QuotationRow>
          remove: Array<number>
      },
      QuotationItem: {
          replace: Array<QuotationItemRow>
          remove: Array<number>
      },
      PurchaseOrder: {
          replace: Array<PurchaseOrderRow>
          remove: Array<number>
      },
      PurchaseOrderItem: {
          replace: Array<PurchaseOrderItemRow>
          remove: Array<number>
      },
      PurchaseInvoice: {
          replace: Array<PurchaseInvoiceRow>
          remove: Array<number>
      },
      PurchaseInvoiceItem: {
          replace: Array<PurchaseInvoiceItemRow>
          remove: Array<number>
      },
      MaterialApprovalSlip: {
          replace: Array<MaterialApprovalSlipRow>
          remove: Array<number>
      },
      MaterialApprovalSlipItem: {
          replace: Array<MaterialApprovalSlipItemRow>
          remove: Array<number>
      },
      MaterialRejectionSlip: {
          replace: Array<MaterialRejectionSlipRow>
          remove: Array<number>
      },
      MaterialRejectionSlipItem: {
          replace: Array<MaterialRejectionSlipItemRow>
          remove: Array<number>
      },
      MaterialReturnSlip: {
          replace: Array<MaterialReturnSlipRow>
          remove: Array<number>
      },
      MaterialReturnSlipItem: {
          replace: Array<MaterialReturnSlipItemRow>
          remove: Array<number>
      },
      MaterialRequistionSlip: {
          replace: Array<MaterialRequistionSlipRow>
          remove: Array<number>
      },
      MaterialRequistionSlipItem: {
          replace: Array<MaterialRequistionSlipItemRow>
          remove: Array<number>
      },
      Bom: {
          replace: Array<BomRow>
          remove: Array<number>
      },
      BomItem: {
          replace: Array<BomItemRow>
          remove: Array<number>
      },
      ProductionPreparationSlip: {
          replace: Array<ProductionPreparationSlipRow>
          remove: Array<number>
      },
      ProductionPreparationSlipItem: {
          replace: Array<ProductionPreparationSlipItemRow>
          remove: Array<number>
      },
      ScrapMaterialSlip: {
          replace: Array<ScrapMaterialSlipRow>
          remove: Array<number>
      },
      TransferMaterialSlip: {
          replace: Array<TransferMaterialSlipRow>
          remove: Array<number>
      },
      WarehouseAcceptanceSlip: {
          replace: Array<WarehouseAcceptanceSlipRow>
          remove: Array<number>
      }
  }
  
  constructor(variables: {
      Region: {
          replace: Array<RegionRow>
          remove: Array<number>
      },
      Country: {
          replace: Array<CountryRow>
          remove: Array<number>
      },
      StateType: {
          replace: Array<StateTypeRow>
          remove: Array<number>
      },
      District: {
          replace: Array<DistrictRow>
          remove: Array<number>
      },
      Subdistrict: {
          replace: Array<SubdistrictRow>
          remove: Array<number>
      },
      PostalCode: {
          replace: Array<PostalCodeRow>
          remove: Array<number>
      },
      Address: {
          replace: Array<AddressRow>
          remove: Array<number>
      },
      Company: {
          replace: Array<CompanyRow>
          remove: Array<number>
      },
      CompanyAddress: {
          replace: Array<CompanyAddressRow>
          remove: Array<number>
      },
      CompanyTagGroup: {
          replace: Array<CompanyTagGroupRow>
          remove: Array<number>
      },
      CompanyTag: {
          replace: Array<CompanyTagRow>
          remove: Array<number>
      },
      MappingCompanyTag: {
          replace: Array<MappingCompanyTagRow>
          remove: Array<number>
      },
      Contact: {
          replace: Array<ContactRow>
          remove: Array<number>
      },
      ContactAddress: {
          replace: Array<ContactAddressRow>
          remove: Array<number>
      },
      CompanyContact: {
          replace: Array<CompanyContactRow>
          remove: Array<number>
      },
      Currency: {
          replace: Array<CurrencyRow>
          remove: Array<number>
      },
      CurrencyRate: {
          replace: Array<CurrencyRateRow>
          remove: Array<number>
      },
      Memo: {
          replace: Array<MemoRow>
          remove: Array<number>
      },
      Bank: {
          replace: Array<BankRow>
          remove: Array<number>
      },
      BankBranch: {
          replace: Array<BankBranchRow>
          remove: Array<number>
      },
      BankAccount: {
          replace: Array<BankAccountRow>
          remove: Array<number>
      },
      BankTransaction: {
          replace: Array<BankTransactionRow>
          remove: Array<number>
      },
      CompanyBankAccount: {
          replace: Array<CompanyBankAccountRow>
          remove: Array<number>
      },
      ProductCategoryGroup: {
          replace: Array<ProductCategoryGroupRow>
          remove: Array<number>
      },
      ProductCategory: {
          replace: Array<ProductCategoryRow>
          remove: Array<number>
      },
      Product: {
          replace: Array<ProductRow>
          remove: Array<number>
      },
      CompanyProduct: {
          replace: Array<CompanyProductRow>
          remove: Array<number>
      },
      ProductTagGroup: {
          replace: Array<ProductTagGroupRow>
          remove: Array<number>
      },
      ProductTag: {
          replace: Array<ProductTagRow>
          remove: Array<number>
      },
      MappingProductTag: {
          replace: Array<MappingProductTagRow>
          remove: Array<number>
      },
      Uom: {
          replace: Array<UomRow>
          remove: Array<number>
      },
      Indent: {
          replace: Array<IndentRow>
          remove: Array<number>
      },
      IndentItem: {
          replace: Array<IndentItemRow>
          remove: Array<number>
      },
      Quotation: {
          replace: Array<QuotationRow>
          remove: Array<number>
      },
      QuotationItem: {
          replace: Array<QuotationItemRow>
          remove: Array<number>
      },
      PurchaseOrder: {
          replace: Array<PurchaseOrderRow>
          remove: Array<number>
      },
      PurchaseOrderItem: {
          replace: Array<PurchaseOrderItemRow>
          remove: Array<number>
      },
      PurchaseInvoice: {
          replace: Array<PurchaseInvoiceRow>
          remove: Array<number>
      },
      PurchaseInvoiceItem: {
          replace: Array<PurchaseInvoiceItemRow>
          remove: Array<number>
      },
      MaterialApprovalSlip: {
          replace: Array<MaterialApprovalSlipRow>
          remove: Array<number>
      },
      MaterialApprovalSlipItem: {
          replace: Array<MaterialApprovalSlipItemRow>
          remove: Array<number>
      },
      MaterialRejectionSlip: {
          replace: Array<MaterialRejectionSlipRow>
          remove: Array<number>
      },
      MaterialRejectionSlipItem: {
          replace: Array<MaterialRejectionSlipItemRow>
          remove: Array<number>
      },
      MaterialReturnSlip: {
          replace: Array<MaterialReturnSlipRow>
          remove: Array<number>
      },
      MaterialReturnSlipItem: {
          replace: Array<MaterialReturnSlipItemRow>
          remove: Array<number>
      },
      MaterialRequistionSlip: {
          replace: Array<MaterialRequistionSlipRow>
          remove: Array<number>
      },
      MaterialRequistionSlipItem: {
          replace: Array<MaterialRequistionSlipItemRow>
          remove: Array<number>
      },
      Bom: {
          replace: Array<BomRow>
          remove: Array<number>
      },
      BomItem: {
          replace: Array<BomItemRow>
          remove: Array<number>
      },
      ProductionPreparationSlip: {
          replace: Array<ProductionPreparationSlipRow>
          remove: Array<number>
      },
      ProductionPreparationSlipItem: {
          replace: Array<ProductionPreparationSlipItemRow>
          remove: Array<number>
      },
      ScrapMaterialSlip: {
          replace: Array<ScrapMaterialSlipRow>
          remove: Array<number>
      },
      TransferMaterialSlip: {
          replace: Array<TransferMaterialSlipRow>
          remove: Array<number>
      },
      WarehouseAcceptanceSlip: {
          replace: Array<WarehouseAcceptanceSlipRow>
          remove: Array<number>
      }
  }) {
      this.active = true
      this.variables = variables
  }

  static toVariable(diff: Immutable<DiffRow>): DiffVariable {
      return new DiffVariable(diff.id, diff.active, {
          Region: {
            replace: HashSet.of<RegionVariable>().addAll(diff.variables.Region.replace.map(x => RegionRow.toVariable(x))),
            remove: HashSet.of<Region>().addAll(diff.variables.Region.remove.map(x => new Region(x)))
          },
          Country: {
            replace: HashSet.of<CountryVariable>().addAll(diff.variables.Country.replace.map(x => CountryRow.toVariable(x))),
            remove: HashSet.of<Country>().addAll(diff.variables.Country.remove.map(x => new Country(x)))
          },
          StateType: {
            replace: HashSet.of<StateTypeVariable>().addAll(diff.variables.StateType.replace.map(x => StateTypeRow.toVariable(x))),
            remove: HashSet.of<StateType>().addAll(diff.variables.StateType.remove.map(x => new StateType(x)))
          },
          District: {
            replace: HashSet.of<DistrictVariable>().addAll(diff.variables.District.replace.map(x => DistrictRow.toVariable(x))),
            remove: HashSet.of<District>().addAll(diff.variables.District.remove.map(x => new District(x)))
          },
          Subdistrict: {
            replace: HashSet.of<SubdistrictVariable>().addAll(diff.variables.Subdistrict.replace.map(x => SubdistrictRow.toVariable(x))),
            remove: HashSet.of<Subdistrict>().addAll(diff.variables.Subdistrict.remove.map(x => new Subdistrict(x)))
          },
          PostalCode: {
            replace: HashSet.of<PostalCodeVariable>().addAll(diff.variables.PostalCode.replace.map(x => PostalCodeRow.toVariable(x))),
            remove: HashSet.of<PostalCode>().addAll(diff.variables.PostalCode.remove.map(x => new PostalCode(x)))
          },
          Address: {
            replace: HashSet.of<AddressVariable>().addAll(diff.variables.Address.replace.map(x => AddressRow.toVariable(x))),
            remove: HashSet.of<Address>().addAll(diff.variables.Address.remove.map(x => new Address(x)))
          },
          Company: {
            replace: HashSet.of<CompanyVariable>().addAll(diff.variables.Company.replace.map(x => CompanyRow.toVariable(x))),
            remove: HashSet.of<Company>().addAll(diff.variables.Company.remove.map(x => new Company(x)))
          },
          CompanyAddress: {
            replace: HashSet.of<CompanyAddressVariable>().addAll(diff.variables.CompanyAddress.replace.map(x => CompanyAddressRow.toVariable(x))),
            remove: HashSet.of<CompanyAddress>().addAll(diff.variables.CompanyAddress.remove.map(x => new CompanyAddress(x)))
          },
          CompanyTagGroup: {
            replace: HashSet.of<CompanyTagGroupVariable>().addAll(diff.variables.CompanyTagGroup.replace.map(x => CompanyTagGroupRow.toVariable(x))),
            remove: HashSet.of<CompanyTagGroup>().addAll(diff.variables.CompanyTagGroup.remove.map(x => new CompanyTagGroup(x)))
          },
          CompanyTag: {
            replace: HashSet.of<CompanyTagVariable>().addAll(diff.variables.CompanyTag.replace.map(x => CompanyTagRow.toVariable(x))),
            remove: HashSet.of<CompanyTag>().addAll(diff.variables.CompanyTag.remove.map(x => new CompanyTag(x)))
          },
          MappingCompanyTag: {
            replace: HashSet.of<MappingCompanyTagVariable>().addAll(diff.variables.MappingCompanyTag.replace.map(x => MappingCompanyTagRow.toVariable(x))),
            remove: HashSet.of<MappingCompanyTag>().addAll(diff.variables.MappingCompanyTag.remove.map(x => new MappingCompanyTag(x)))
          },
          Contact: {
            replace: HashSet.of<ContactVariable>().addAll(diff.variables.Contact.replace.map(x => ContactRow.toVariable(x))),
            remove: HashSet.of<Contact>().addAll(diff.variables.Contact.remove.map(x => new Contact(x)))
          },
          ContactAddress: {
            replace: HashSet.of<ContactAddressVariable>().addAll(diff.variables.ContactAddress.replace.map(x => ContactAddressRow.toVariable(x))),
            remove: HashSet.of<ContactAddress>().addAll(diff.variables.ContactAddress.remove.map(x => new ContactAddress(x)))
          },
          CompanyContact: {
            replace: HashSet.of<CompanyContactVariable>().addAll(diff.variables.CompanyContact.replace.map(x => CompanyContactRow.toVariable(x))),
            remove: HashSet.of<CompanyContact>().addAll(diff.variables.CompanyContact.remove.map(x => new CompanyContact(x)))
          },
          Currency: {
            replace: HashSet.of<CurrencyVariable>().addAll(diff.variables.Currency.replace.map(x => CurrencyRow.toVariable(x))),
            remove: HashSet.of<Currency>().addAll(diff.variables.Currency.remove.map(x => new Currency(x)))
          },
          CurrencyRate: {
            replace: HashSet.of<CurrencyRateVariable>().addAll(diff.variables.CurrencyRate.replace.map(x => CurrencyRateRow.toVariable(x))),
            remove: HashSet.of<CurrencyRate>().addAll(diff.variables.CurrencyRate.remove.map(x => new CurrencyRate(x)))
          },
          Memo: {
            replace: HashSet.of<MemoVariable>().addAll(diff.variables.Memo.replace.map(x => MemoRow.toVariable(x))),
            remove: HashSet.of<Memo>().addAll(diff.variables.Memo.remove.map(x => new Memo(x)))
          },
          Bank: {
            replace: HashSet.of<BankVariable>().addAll(diff.variables.Bank.replace.map(x => BankRow.toVariable(x))),
            remove: HashSet.of<Bank>().addAll(diff.variables.Bank.remove.map(x => new Bank(x)))
          },
          BankBranch: {
            replace: HashSet.of<BankBranchVariable>().addAll(diff.variables.BankBranch.replace.map(x => BankBranchRow.toVariable(x))),
            remove: HashSet.of<BankBranch>().addAll(diff.variables.BankBranch.remove.map(x => new BankBranch(x)))
          },
          BankAccount: {
            replace: HashSet.of<BankAccountVariable>().addAll(diff.variables.BankAccount.replace.map(x => BankAccountRow.toVariable(x))),
            remove: HashSet.of<BankAccount>().addAll(diff.variables.BankAccount.remove.map(x => new BankAccount(x)))
          },
          BankTransaction: {
            replace: HashSet.of<BankTransactionVariable>().addAll(diff.variables.BankTransaction.replace.map(x => BankTransactionRow.toVariable(x))),
            remove: HashSet.of<BankTransaction>().addAll(diff.variables.BankTransaction.remove.map(x => new BankTransaction(x)))
          },
          CompanyBankAccount: {
            replace: HashSet.of<CompanyBankAccountVariable>().addAll(diff.variables.CompanyBankAccount.replace.map(x => CompanyBankAccountRow.toVariable(x))),
            remove: HashSet.of<CompanyBankAccount>().addAll(diff.variables.CompanyBankAccount.remove.map(x => new CompanyBankAccount(x)))
          },
          ProductCategoryGroup: {
            replace: HashSet.of<ProductCategoryGroupVariable>().addAll(diff.variables.ProductCategoryGroup.replace.map(x => ProductCategoryGroupRow.toVariable(x))),
            remove: HashSet.of<ProductCategoryGroup>().addAll(diff.variables.ProductCategoryGroup.remove.map(x => new ProductCategoryGroup(x)))
          },
          ProductCategory: {
            replace: HashSet.of<ProductCategoryVariable>().addAll(diff.variables.ProductCategory.replace.map(x => ProductCategoryRow.toVariable(x))),
            remove: HashSet.of<ProductCategory>().addAll(diff.variables.ProductCategory.remove.map(x => new ProductCategory(x)))
          },
          Product: {
            replace: HashSet.of<ProductVariable>().addAll(diff.variables.Product.replace.map(x => ProductRow.toVariable(x))),
            remove: HashSet.of<Product>().addAll(diff.variables.Product.remove.map(x => new Product(x)))
          },
          CompanyProduct: {
            replace: HashSet.of<CompanyProductVariable>().addAll(diff.variables.CompanyProduct.replace.map(x => CompanyProductRow.toVariable(x))),
            remove: HashSet.of<CompanyProduct>().addAll(diff.variables.CompanyProduct.remove.map(x => new CompanyProduct(x)))
          },
          ProductTagGroup: {
            replace: HashSet.of<ProductTagGroupVariable>().addAll(diff.variables.ProductTagGroup.replace.map(x => ProductTagGroupRow.toVariable(x))),
            remove: HashSet.of<ProductTagGroup>().addAll(diff.variables.ProductTagGroup.remove.map(x => new ProductTagGroup(x)))
          },
          ProductTag: {
            replace: HashSet.of<ProductTagVariable>().addAll(diff.variables.ProductTag.replace.map(x => ProductTagRow.toVariable(x))),
            remove: HashSet.of<ProductTag>().addAll(diff.variables.ProductTag.remove.map(x => new ProductTag(x)))
          },
          MappingProductTag: {
            replace: HashSet.of<MappingProductTagVariable>().addAll(diff.variables.MappingProductTag.replace.map(x => MappingProductTagRow.toVariable(x))),
            remove: HashSet.of<MappingProductTag>().addAll(diff.variables.MappingProductTag.remove.map(x => new MappingProductTag(x)))
          },
          Uom: {
            replace: HashSet.of<UomVariable>().addAll(diff.variables.Uom.replace.map(x => UomRow.toVariable(x))),
            remove: HashSet.of<Uom>().addAll(diff.variables.Uom.remove.map(x => new Uom(x)))
          },
          Indent: {
            replace: HashSet.of<IndentVariable>().addAll(diff.variables.Indent.replace.map(x => IndentRow.toVariable(x))),
            remove: HashSet.of<Indent>().addAll(diff.variables.Indent.remove.map(x => new Indent(x)))
          },
          IndentItem: {
            replace: HashSet.of<IndentItemVariable>().addAll(diff.variables.IndentItem.replace.map(x => IndentItemRow.toVariable(x))),
            remove: HashSet.of<IndentItem>().addAll(diff.variables.IndentItem.remove.map(x => new IndentItem(x)))
          },
          Quotation: {
            replace: HashSet.of<QuotationVariable>().addAll(diff.variables.Quotation.replace.map(x => QuotationRow.toVariable(x))),
            remove: HashSet.of<Quotation>().addAll(diff.variables.Quotation.remove.map(x => new Quotation(x)))
          },
          QuotationItem: {
            replace: HashSet.of<QuotationItemVariable>().addAll(diff.variables.QuotationItem.replace.map(x => QuotationItemRow.toVariable(x))),
            remove: HashSet.of<QuotationItem>().addAll(diff.variables.QuotationItem.remove.map(x => new QuotationItem(x)))
          },
          PurchaseOrder: {
            replace: HashSet.of<PurchaseOrderVariable>().addAll(diff.variables.PurchaseOrder.replace.map(x => PurchaseOrderRow.toVariable(x))),
            remove: HashSet.of<PurchaseOrder>().addAll(diff.variables.PurchaseOrder.remove.map(x => new PurchaseOrder(x)))
          },
          PurchaseOrderItem: {
            replace: HashSet.of<PurchaseOrderItemVariable>().addAll(diff.variables.PurchaseOrderItem.replace.map(x => PurchaseOrderItemRow.toVariable(x))),
            remove: HashSet.of<PurchaseOrderItem>().addAll(diff.variables.PurchaseOrderItem.remove.map(x => new PurchaseOrderItem(x)))
          },
          PurchaseInvoice: {
            replace: HashSet.of<PurchaseInvoiceVariable>().addAll(diff.variables.PurchaseInvoice.replace.map(x => PurchaseInvoiceRow.toVariable(x))),
            remove: HashSet.of<PurchaseInvoice>().addAll(diff.variables.PurchaseInvoice.remove.map(x => new PurchaseInvoice(x)))
          },
          PurchaseInvoiceItem: {
            replace: HashSet.of<PurchaseInvoiceItemVariable>().addAll(diff.variables.PurchaseInvoiceItem.replace.map(x => PurchaseInvoiceItemRow.toVariable(x))),
            remove: HashSet.of<PurchaseInvoiceItem>().addAll(diff.variables.PurchaseInvoiceItem.remove.map(x => new PurchaseInvoiceItem(x)))
          },
          MaterialApprovalSlip: {
            replace: HashSet.of<MaterialApprovalSlipVariable>().addAll(diff.variables.MaterialApprovalSlip.replace.map(x => MaterialApprovalSlipRow.toVariable(x))),
            remove: HashSet.of<MaterialApprovalSlip>().addAll(diff.variables.MaterialApprovalSlip.remove.map(x => new MaterialApprovalSlip(x)))
          },
          MaterialApprovalSlipItem: {
            replace: HashSet.of<MaterialApprovalSlipItemVariable>().addAll(diff.variables.MaterialApprovalSlipItem.replace.map(x => MaterialApprovalSlipItemRow.toVariable(x))),
            remove: HashSet.of<MaterialApprovalSlipItem>().addAll(diff.variables.MaterialApprovalSlipItem.remove.map(x => new MaterialApprovalSlipItem(x)))
          },
          MaterialRejectionSlip: {
            replace: HashSet.of<MaterialRejectionSlipVariable>().addAll(diff.variables.MaterialRejectionSlip.replace.map(x => MaterialRejectionSlipRow.toVariable(x))),
            remove: HashSet.of<MaterialRejectionSlip>().addAll(diff.variables.MaterialRejectionSlip.remove.map(x => new MaterialRejectionSlip(x)))
          },
          MaterialRejectionSlipItem: {
            replace: HashSet.of<MaterialRejectionSlipItemVariable>().addAll(diff.variables.MaterialRejectionSlipItem.replace.map(x => MaterialRejectionSlipItemRow.toVariable(x))),
            remove: HashSet.of<MaterialRejectionSlipItem>().addAll(diff.variables.MaterialRejectionSlipItem.remove.map(x => new MaterialRejectionSlipItem(x)))
          },
          MaterialReturnSlip: {
            replace: HashSet.of<MaterialReturnSlipVariable>().addAll(diff.variables.MaterialReturnSlip.replace.map(x => MaterialReturnSlipRow.toVariable(x))),
            remove: HashSet.of<MaterialReturnSlip>().addAll(diff.variables.MaterialReturnSlip.remove.map(x => new MaterialReturnSlip(x)))
          },
          MaterialReturnSlipItem: {
            replace: HashSet.of<MaterialReturnSlipItemVariable>().addAll(diff.variables.MaterialReturnSlipItem.replace.map(x => MaterialReturnSlipItemRow.toVariable(x))),
            remove: HashSet.of<MaterialReturnSlipItem>().addAll(diff.variables.MaterialReturnSlipItem.remove.map(x => new MaterialReturnSlipItem(x)))
          },
          MaterialRequistionSlip: {
            replace: HashSet.of<MaterialRequistionSlipVariable>().addAll(diff.variables.MaterialRequistionSlip.replace.map(x => MaterialRequistionSlipRow.toVariable(x))),
            remove: HashSet.of<MaterialRequistionSlip>().addAll(diff.variables.MaterialRequistionSlip.remove.map(x => new MaterialRequistionSlip(x)))
          },
          MaterialRequistionSlipItem: {
            replace: HashSet.of<MaterialRequistionSlipItemVariable>().addAll(diff.variables.MaterialRequistionSlipItem.replace.map(x => MaterialRequistionSlipItemRow.toVariable(x))),
            remove: HashSet.of<MaterialRequistionSlipItem>().addAll(diff.variables.MaterialRequistionSlipItem.remove.map(x => new MaterialRequistionSlipItem(x)))
          },
          Bom: {
            replace: HashSet.of<BomVariable>().addAll(diff.variables.Bom.replace.map(x => BomRow.toVariable(x))),
            remove: HashSet.of<Bom>().addAll(diff.variables.Bom.remove.map(x => new Bom(x)))
          },
          BomItem: {
            replace: HashSet.of<BomItemVariable>().addAll(diff.variables.BomItem.replace.map(x => BomItemRow.toVariable(x))),
            remove: HashSet.of<BomItem>().addAll(diff.variables.BomItem.remove.map(x => new BomItem(x)))
          },
          ProductionPreparationSlip: {
            replace: HashSet.of<ProductionPreparationSlipVariable>().addAll(diff.variables.ProductionPreparationSlip.replace.map(x => ProductionPreparationSlipRow.toVariable(x))),
            remove: HashSet.of<ProductionPreparationSlip>().addAll(diff.variables.ProductionPreparationSlip.remove.map(x => new ProductionPreparationSlip(x)))
          },
          ProductionPreparationSlipItem: {
            replace: HashSet.of<ProductionPreparationSlipItemVariable>().addAll(diff.variables.ProductionPreparationSlipItem.replace.map(x => ProductionPreparationSlipItemRow.toVariable(x))),
            remove: HashSet.of<ProductionPreparationSlipItem>().addAll(diff.variables.ProductionPreparationSlipItem.remove.map(x => new ProductionPreparationSlipItem(x)))
          },
          ScrapMaterialSlip: {
            replace: HashSet.of<ScrapMaterialSlipVariable>().addAll(diff.variables.ScrapMaterialSlip.replace.map(x => ScrapMaterialSlipRow.toVariable(x))),
            remove: HashSet.of<ScrapMaterialSlip>().addAll(diff.variables.ScrapMaterialSlip.remove.map(x => new ScrapMaterialSlip(x)))
          },
          TransferMaterialSlip: {
            replace: HashSet.of<TransferMaterialSlipVariable>().addAll(diff.variables.TransferMaterialSlip.replace.map(x => TransferMaterialSlipRow.toVariable(x))),
            remove: HashSet.of<TransferMaterialSlip>().addAll(diff.variables.TransferMaterialSlip.remove.map(x => new TransferMaterialSlip(x)))
          },
          WarehouseAcceptanceSlip: {
            replace: HashSet.of<WarehouseAcceptanceSlipVariable>().addAll(diff.variables.WarehouseAcceptanceSlip.replace.map(x => WarehouseAcceptanceSlipRow.toVariable(x))),
            remove: HashSet.of<WarehouseAcceptanceSlip>().addAll(diff.variables.WarehouseAcceptanceSlip.remove.map(x => new WarehouseAcceptanceSlip(x)))
          }
      })
  }
}