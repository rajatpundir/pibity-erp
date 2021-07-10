import { immerable, Immutable } from 'immer'
import { HashSet } from 'prelude-ts'
import { DiffVariable } from './layers'
import { Number, Decimal, ProductVariable, UOMVariable, IndentVariable, IndentItemVariable, CompanyVariable, CompanyProductVariable, QuotationVariable, QuotationItemVariable, PurchaseOrderVariable, PurchaseOrderItemVariable, PurchaseInvoiceVariable, PurchaseInvoiceItemVariable, MaterialApprovalSlipVariable, MaterialApprovalSlipItemVariable, MaterialRejectionSlipVariable, MaterialRejectionSlipItemVariable, MaterialReturnSlipVariable, MaterialReturnSlipItemVariable, MaterialRequistionSlipVariable, MaterialRequistionSlipItemVariable, BOMVariable, BOMItemVariable, ProductionPreparationSlipVariable, ProductionPreparationSlipItemVariable, ScrapMaterialSlipVariable, TransferMaterialSlipVariable, WarehouseAcceptanceSlipVariable, Product, UOM, Indent, IndentItem, Company, Quotation, QuotationItem, PurchaseOrder, PurchaseOrderItem, PurchaseInvoice, PurchaseInvoiceItem, MaterialApprovalSlip, MaterialApprovalSlipItem, MaterialRejectionSlip, MaterialRejectionSlipItem, MaterialReturnSlip, MaterialRequistionSlip, MaterialRequistionSlipItem, BOM, ProductionPreparationSlip, TransferMaterialSlip, MaterialReturnSlipItem, BOMItem, ProductionPreparationSlipItem, ScrapMaterialSlip, WarehouseAcceptanceSlip, CompanyProduct, RegionVariable, CountryVariable, Region, StateVariable, Country, DistrictVariable, State, SubdistrictVariable, District, PostalCodeVariable, Subdistrict, AddressVariable, PostalCode, BankVariable, BankBranchVariable, Bank, Address, BankAccountVariable, BankBranch, CompanyAddressVariable, CompanyContactVariable, CompanyBankAccountVariable, BankAccount, CompanyAddress, CompanyContact, CompanyBankAccount, CompanyTagGroupVariable, CompanyTagVariable, CompanyTagGroup, MappingCompanyTagVariable, CompanyTag, ContactVariable, ContactAddressVariable, Contact, CurrencyVariable, CurrencyRateVariable, Currency, MemoVariable, BankTransactionVariable, Memo, CurrencyRate, ProductCategoryGroupVariable, ProductCategoryGroup, ProductCategoryVariable, ProductCategory, ProductTagGroupVariable, ProductTagVariable, ProductTagGroup, MappingProductTagVariable, ProductTag, BankTransaction, MappingProductTag, ContactAddress, MappingCompanyTag } from './variables'

export type Row =
    | RegionRow
    | CountryRow
    | StateRow
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
    | ProductTagGroupRow
    | ProductTagRow
    | MappingProductTagRow
    | UOMRow
    | CompanyProductRow
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
    | BOMRow
    | BOMItemRow
    | ProductionPreparationSlipRow
    | ProductionPreparationSlipItemRow
    | ScrapMaterialSlipRow
    | TransferMaterialSlipRow
    | WarehouseAcceptanceSlipRow

export class RegionRow {
    readonly typeName = 'Region'
    readonly variableName: string
    readonly name: string
    values: {
        name: string
    }

    constructor(variableName: string, values: { name: string }) {
        this.variableName = variableName
        this.values = values
        this.name = values.name
    }

    static toVariable(row: RegionRow): RegionVariable {
        return new RegionVariable(row.variableName, {
            name: row.values.name
        })
    }
}

export class CountryRow {
    readonly typeName = 'Country'
    readonly variableName: string
    readonly region: string
    readonly name: string
    values: {
        // UNQ(region, name)
        region: string
        name: string
    }

    constructor(variableName: string, values: { region: string, name: string }) {
        this.variableName = variableName
        this.values = values
        this.region = values.region
        this.name = values.name
    }

    static toVariable(row: CountryRow): CountryVariable {
        return new CountryVariable(row.variableName, {
            region: new Region(row.values.region),
            name: row.values.name
        })
    }
}

export class StateRow {
    readonly typeName = 'State'
    readonly variableName: string
    readonly country: string
    readonly name: string
    values: {
        // UNQ(country, name)
        country: string
        name: string
    }

    constructor(variableName: string, values: { country: string, name: string }) {
        this.variableName = variableName
        this.values = values
        this.country = values.country
        this.name = values.name
    }

    static toVariable(row: StateRow): StateVariable {
        return new StateVariable(row.variableName, {
            country: new Country(row.values.country),
            name: row.values.name
        })
    }
}

export class DistrictRow {
    readonly typeName = 'District'
    readonly variableName: string
    readonly state: string
    readonly name: string
    values: {
        // UNQ(state, name)
        state: string
        name: string
    }

    constructor(variableName: string, values: { state: string, name: string }) {
        this.variableName = variableName
        this.values = values
        this.state = values.state
        this.name = values.name
    }

    static toVariable(row: DistrictRow): DistrictVariable {
        return new DistrictVariable(row.variableName, {
            state: new State(row.values.state),
            name: row.values.name
        })
    }
}

export class SubdistrictRow {
    readonly typeName = 'Subdistrict'
    readonly variableName: string
    readonly district: string
    readonly name: string
    values: {
        // UNQ(district, name)
        district: string
        name: string
    }

    constructor(variableName: string, values: { district: string, name: string }) {
        this.variableName = variableName
        this.values = values
        this.district = values.district
        this.name = values.name
    }

    static toVariable(row: SubdistrictRow): SubdistrictVariable {
        return new SubdistrictVariable(row.variableName, {
            district: new District(row.values.district),
            name: row.values.name
        })
    }
}

export class PostalCodeRow {
    readonly typeName = 'PostalCode'
    readonly variableName: string
    readonly subdistrict: string
    readonly name: string
    values: {
        // UNQ(subdistrict, name)
        subdistrict: string
        name: string
    }

    constructor(variableName: string, values: { subdistrict: string, name: string }) {
        this.variableName = variableName
        this.values = values
        this.subdistrict = values.subdistrict
        this.name = values.name
    }

    static toVariable(row: PostalCodeRow): PostalCodeVariable {
        return new PostalCodeVariable(row.variableName, {
            subdistrict: new Subdistrict(row.values.subdistrict),
            name: row.values.name
        })
    }
}

export class AddressRow {
    readonly typeName = 'Address'
    readonly variableName: string
    readonly postalCode: string
    readonly line1: string
    readonly line2: string
    values: {
        // UNQ(postalCode, line1, line2)
        postalCode: string
        line1: string
        line2: string
        latitude: number
        longitude: number
    }

    constructor(variableName: string, values: { postalCode: string, line1: string, line2: string, latitude: number, longitude: number }) {
        this.variableName = variableName
        this.values = values
        this.postalCode = values.postalCode
        this.line1 = values.line1
        this.line2 = values.line2
    }

    static toVariable(row: AddressRow): AddressVariable {
        return new AddressVariable(row.variableName, {
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
    readonly variableName: string
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

    constructor(variableName: string, values: { name: string, email: string, telephone: string, mobile: string, website: string, gstin: string, pan: string, iec: string }) {
        this.variableName = variableName
        this.values = values
        this.name = values.name
    }

    static toVariable(row: CompanyRow): CompanyVariable {
        return new CompanyVariable(row.variableName, {
            name: row.values.name,
            email: row.values.email,
            telephone: row.values.telephone,
            mobile: row.values.mobile,
            website: row.values.website,
            gstin: row.values.gstin,
            pan: row.values.pan,
            iec: row.values.iec,
        })
    }
}

export class CompanyAddressRow {
    readonly typeName = 'CompanyAddress'
    readonly variableName: string
    readonly company: string
    readonly name: string
    readonly address: string
    values: {
        // UNQ(company, name)
        // UNQ(company, address)
        company: string
        name: string
        address: string
    }

    constructor(variableName: string, values: { company: string, name: string, address: string }) {
        this.variableName = variableName
        this.values = values
        this.company = values.company
        this.name = values.name
        this.address = values.address
    }

    static toVariable(row: CompanyAddressRow): CompanyAddressVariable {
        return new CompanyAddressVariable(row.variableName, {
            company: new Company(row.values.company),
            name: row.values.name,
            address: new Address(row.values.address)
        })
    }
}

export class CompanyTagGroupRow {
    readonly typeName = 'CompanyTagGroup'
    readonly variableName: string
    readonly name: string
    values: {
        name: string
    }

    constructor(variableName: string, values: { name: string }) {
        this.variableName = variableName
        this.values = values
        this.name = values.name
    }

    static toVariable(row: CompanyTagGroupRow): CompanyTagGroupVariable {
        return new CompanyTagGroupVariable(row.variableName, {
            name: row.values.name
        })
    }
}

export class CompanyTagRow {
    readonly typeName = 'CompanyTag'
    readonly variableName: string
    readonly group: string
    readonly name: string
    values: {
        group: string
        name: string
    }

    constructor(variableName: string, values: { group: string, name: string }) {
        this.variableName = variableName
        this.values = values
        this.group = values.group
        this.name = values.name
    }

    static toVariable(row: CompanyTagRow): CompanyTagVariable {
        return new CompanyTagVariable(row.variableName, {
            group: new CompanyTagGroup(row.values.group),
            name: row.values.name
        })
    }
}

export class MappingCompanyTagRow {
    readonly typeName = 'MappingCompanyTag'
    readonly variableName: string
    readonly company: string
    readonly tag: string
    values: {
        company: string
        tag: string
    }

    constructor(variableName: string, values: { company: string, tag: string }) {
        this.variableName = variableName
        this.values = values
        this.company = values.company
        this.tag = values.tag
    }

    static toVariable(row: MappingCompanyTagRow): MappingCompanyTagVariable {
        return new MappingCompanyTagVariable(row.variableName, {
            company: new Company(row.values.company),
            tag: new CompanyTag(row.values.tag)
        })
    }
}

export class ContactRow {
    readonly typeName = 'Contact'
    readonly variableName: string
    readonly name: string
    values: {
        name: string
        email: string
        telephone: string
        mobile: string
        website: string
    }

    constructor(variableName: string, values: { name: string, email: string, telephone: string, mobile: string, website: string }) {
        this.variableName = variableName
        this.values = values
        this.name = values.name
    }

    static toVariable(row: ContactRow): ContactVariable {
        return new ContactVariable(row.variableName, {
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
    readonly variableName: string
    readonly contact: string
    readonly name: string
    readonly address: string
    values: {
        // UNQ(contact, name)
        // UNQ(contact, address)
        contact: string
        name: string
        address: string
    }

    constructor(variableName: string, values: { contact: string, name: string, address: string }) {
        this.variableName = variableName
        this.values = values
        this.contact = values.contact
        this.name = values.name
        this.address = values.address
    }

    static toVariable(row: ContactAddressRow): ContactAddressVariable {
        return new ContactAddressVariable(row.variableName, {
            contact: new Contact(row.values.contact),
            name: row.values.name,
            address: new Address(row.values.address)
        })
    }
}

export class CompanyContactRow {
    readonly typeName = 'CompanyContact'
    readonly variableName: string
    readonly company: string
    readonly contact: string
    values: {
        // UNQ(company, name)
        company: string
        contact: string
        role: string
        email: string
        telephone: string
        mobile: string
    }

    constructor(variableName: string, values: { company: string, contact: string, role: string, email: string, telephone: string, mobile: string }) {
        this.variableName = variableName
        this.values = values
        this.company = values.company
        this.contact = values.contact
    }

    static toVariable(row: CompanyContactRow): CompanyContactVariable {
        return new CompanyContactVariable(row.variableName, {
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
    readonly variableName: string
    readonly name: string
    values: {
        name: string
    }

    constructor(variableName: string, values: { name: string }) {
        this.variableName = variableName
        this.values = values
        this.name = values.name
    }

    static toVariable(row: CurrencyRow): CurrencyVariable {
        return new CurrencyVariable(row.variableName, {
            name: row.values.name
        })
    }
}

export class CurrencyRateRow {
    readonly typeName = 'CurrencyRate'
    readonly variableName: string
    readonly currency: string
    readonly startTime: number
    readonly endTime: number
    values: {
        currency: string
        conversionRate: number
        startTime: number
        endTime: number
    }

    constructor(variableName: string, values: { currency: string, conversionRate: number, startTime: number, endTime: number }) {
        this.variableName = variableName
        this.values = values
        this.currency = values.currency
        this.startTime = values.startTime
        this.endTime = values.endTime
    }

    static toVariable(row: CurrencyRateRow): CurrencyRateVariable {
        return new CurrencyRateVariable(row.variableName, {
            currency: new Currency(row.values.currency),
            conversionRate: row.values.conversionRate,
            startTime: row.values.startTime,
            endTime: row.values.endTime
        })
    }
}

export class MemoRow {
    readonly typeName = 'Memo'
    readonly variableName: string
    readonly company: string
    values: {
        company: string
        currency: string
        amount: number
        unsettled: number
    }

    constructor(variableName: string, values: { company: string, currency: string, amount: number, unsettled: number }) {
        this.variableName = variableName
        this.values = values
        this.company = values.company
    }

    static toVariable(row: MemoRow): MemoVariable {
        return new MemoVariable(row.variableName, {
            company: new Company(row.values.company),
            currency: new Currency(row.values.currency),
            amount: row.values.amount,
            unsettled: row.values.unsettled
        })
    }
}

export class BankRow {
    readonly typeName = 'Bank'
    readonly variableName: string
    readonly country: string
    readonly name: string
    values: {
        // UNQ(country, name)
        country: string
        name: string
        website: string
    }

    constructor(variableName: string, values: { country: string, name: string, website: string }) {
        this.variableName = variableName
        this.values = values
        this.country = values.country
        this.name = values.name
    }

    static toVariable(row: BankRow): BankVariable {
        return new BankVariable(row.variableName, {
            country: new Country(row.values.country),
            name: row.values.name,
            website: row.values.website
        })
    }
}

export class BankBranchRow {
    readonly typeName = 'BankBranch'
    readonly variableName: string
    readonly bank: string
    readonly name: string
    values: {
        // UNQ(bank, name)
        bank: string
        name: string
        ifsc: string
        address: string
    }

    constructor(variableName: string, values: { bank: string, name: string, ifsc: string, address: string }) {
        this.variableName = variableName
        this.values = values
        this.bank = values.bank
        this.name = values.name
    }

    static toVariable(row: BankBranchRow): BankBranchVariable {
        return new BankBranchVariable(row.variableName, {
            bank: new Bank(row.values.bank),
            name: row.values.name,
            ifsc: row.values.ifsc,
            address: new Address(row.values.address)
        })
    }
}

export class BankAccountRow {
    readonly typeName = 'BankAccount'
    readonly variableName: string
    readonly bank: string
    readonly accountNumber: string
    values: {
        // UNQ(bank, accountNumber)
        bank: string
        bankBranch: string
        accountNumber: string
        accountName: string
        currency: string
    }

    constructor(variableName: string, values: { bank: string, bankBranch: string, accountNumber: string, accountName: string, currency: string }) {
        this.variableName = variableName
        this.values = values
        this.bank = values.bank
        this.accountNumber = values.accountNumber
    }

    static toVariable(row: BankAccountRow): BankAccountVariable {
        return new BankAccountVariable(row.variableName, {
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
    readonly variableName: string
    readonly memo: string
    readonly bankAccount: string
    values: {
        timestamp: number
        memo: string
        currencyRate: string
        bankAccount: string
        fromToAccount: string
        credit: number
        debit: number
    }

    constructor(variableName: string, values: { timestamp: number, memo: string, currencyRate: string, bankAccount: string, fromToAccount: string, credit: number, debit: number }) {
        this.variableName = variableName
        this.values = values
        this.memo = values.memo
        this.bankAccount = values.bankAccount
    }

    static toVariable(row: BankTransactionRow): BankTransactionVariable {
        return new BankTransactionVariable(row.variableName, {
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
    readonly variableName: string
    readonly company: string
    readonly bankAccount: string
    values: {
        // UNQ(company, bankAccount)
        company: string
        bankAccount: string
    }

    constructor(variableName: string, values: { company: string, bankAccount: string }) {
        this.variableName = variableName
        this.values = values
        this.company = values.company
        this.bankAccount = values.bankAccount
    }

    static toVariable(row: CompanyBankAccountRow): CompanyBankAccountVariable {
        return new CompanyBankAccountVariable(row.variableName, {
            company: new Company(row.values.company),
            bankAccount: new BankAccount(row.values.bankAccount)
        })
    }
}

export class ProductCategoryGroupRow {
    readonly typeName = 'ProductCategoryGroup'
    readonly variableName: string
    readonly parent: string
    values: {
        // UNQ(parent)
        parent: string
        name: string
        length: number
    }

    constructor(variableName: string, values: { parent: string, name: string, length: number }) {
        this.variableName = variableName
        this.values = values
        this.parent = values.parent
    }

    static toVariable(row: ProductCategoryGroupRow): ProductCategoryGroupVariable {
        return new ProductCategoryGroupVariable(row.variableName, {
            parent: new ProductCategoryGroup(row.values.parent),
            name: row.values.name,
            length: row.values.length
        })
    }
}

export class ProductCategoryRow {
    readonly typeName = 'ProductCategory'
    readonly variableName: string
    readonly parent: string
    readonly code: string
    readonly name: string
    values: {
        // UNQ(parent, name)
        // UNQ(parent, code)
        parent: string
        group: string
        name: string
        code: string
        derivedCode: string
        childCount: number
    }

    constructor(variableName: string, values: { parent: string, group: string, name: string, code: string, derivedCode: string, childCount: number }) {
        this.variableName = variableName
        this.values = values
        this.parent = values.parent
        this.code = values.code
        this.name = values.name
    }

    static toVariable(row: ProductCategoryRow): ProductCategoryVariable {
        return new ProductCategoryVariable(row.variableName, {
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
    readonly variableName: string
    readonly name: string
    values: {
        name: string
        category: string
        code: string
        sku: string
    }

    constructor(variableName: string, values: { name: string, category: string, code: string, sku: string }) {
        this.variableName = variableName
        this.values = values
        this.name = values.name
    }

    static toVariable(row: ProductRow): ProductVariable {
        return new ProductVariable(row.variableName, {
            name: row.values.name,
            category: new ProductCategory(row.values.category),
            code: row.values.code,
            sku: row.values.sku
        })
    }
}

export class ProductTagGroupRow {
    readonly typeName = 'ProductTagGroup'
    readonly variableName: string
    readonly name: string
    values: {
        name: string
    }

    constructor(variableName: string, values: { name: string }) {
        this.variableName = variableName
        this.values = values
        this.name = values.name
    }

    static toVariable(row: ProductTagGroupRow): ProductTagGroupVariable {
        return new ProductTagGroupVariable(row.variableName, {
            name: row.values.name
        })
    }
}

export class ProductTagRow {
    readonly typeName = 'ProductTag'
    readonly variableName: string
    readonly group: string
    readonly name: string
    values: {
        group: string
        name: string
    }

    constructor(variableName: string, values: { group: string, name: string }) {
        this.variableName = variableName
        this.values = values
        this.group = values.group
        this.name = values.name
    }

    static toVariable(row: ProductTagRow): ProductTagVariable {
        return new ProductTagVariable(row.variableName, {
            group: new ProductTagGroup(row.values.group),
            name: row.values.name
        })
    }
}

export class MappingProductTagRow {
    readonly typeName = 'MappingProductTag'
    readonly variableName: string
    readonly product: string
    readonly tag: string
    values: {
        product: string
        tag: string
    }

    constructor(variableName: string, values: { product: string, tag: string }) {
        this.variableName = variableName
        this.values = values
        this.product = values.product
        this.tag = values.tag
    }

    static toVariable(row: MappingProductTagRow): MappingProductTagVariable {
        return new MappingProductTagVariable(row.variableName, {
            product: new Product(row.values.product),
            tag: new ProductTag(row.values.tag)
        })
    }
}

export class UOMRow {
    readonly typeName = 'UOM'
    readonly variableName: string
    readonly product: string
    readonly name: string
    values: {
        // UNQ(product, name)
        product: string
        name: string
        conversionRate: Decimal
    }

    constructor(variableName: string, values: { product: string, name: string, conversionRate: Decimal }) {
        this.variableName = variableName
        this.values = values
        this.product = values.product
        this.name = values.name
    }

    static toVariable(row: UOMRow): UOMVariable {
        return new UOMVariable(row.variableName, {
            product: new Product(row.values.product),
            name: row.values.name,
            conversionRate: row.values.conversionRate
        })
    }
}

export class IndentRow {
    readonly typeName = 'Indent'
    readonly variableName: string
    values: {
        // timestamp: Timestamp // redundant field
        // subspace: Subspace
        // approver: Subspace
        // approved: boolean
    }

    constructor(variableName: string, values: {}) {
        this.variableName = variableName
        this.values = values
    }

    static toVariable(row: IndentRow): IndentVariable {
        return new IndentVariable(row.variableName, row.values)
    }
}

export class IndentItemRow {
    readonly typeName = 'IndentItem'
    readonly variableName: string
    readonly indent: string
    readonly product: string
    values: {
        // UNQ(indent, product)
        indent: string
        product: string
        quantity: Number
        // assertion(uom.product == product && product.orderable == true && quantity > 0)
        uom: string
        // assertion((ordered - rejected) <= quantity && (ordered - rejected) >= 0)
        // assertion(ordered >= 0 && received >=0 && approved >= 0 && rejected >= 0 && returned >= 0 && requisted >= 0 && consumed >= 0)
        ordered: Number
        // assertion(received <= ordered)
        received: Number
        // assertion((approved + rejected) <= received)
        approved: Number
        rejected: Number
        // assertion(returned <= rejected)
        returned: Number
        // assertion(requisted <= approved)
        requisted: Number
        // assertion(consumed <= requisted)
        consumed: Number
    }

    constructor(variableName: string, values: { indent: string, product: string, quantity: Number, uom: string, ordered: Number, received: Number, approved: Number, rejected: Number, returned: Number, requisted: Number, consumed: Number }) {
        this.variableName = variableName
        this.values = values
        this.indent = values.indent
        this.product = values.product
    }

    static toVariable(row: IndentItemRow): IndentItemVariable {
        return new IndentItemVariable(row.variableName, {
            indent: new Indent(row.values.indent),
            product: new Product(row.values.product),
            quantity: row.values.quantity,
            uom: new UOM(row.values.uom),
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

export class CompanyProductRow {
    readonly typeName = 'CompanyProduct'
    readonly variableName: string
    readonly company: string
    readonly product: string
    values: {
        // UNQ(company, product)
        company: string
        product: string
    }

    constructor(variableName: string, values: { company: string, product: string }) {
        this.variableName = variableName
        this.values = values
        this.company = values.company
        this.product = values.product
    }

    static toVariable(row: CompanyProductRow): CompanyProductVariable {
        return new CompanyProductVariable(row.variableName, {
            company: new Company(row.values.company),
            product: new Product(row.values.product)
        })
    }
}

export class QuotationRow {
    readonly typeName = 'Quotation'
    readonly variableName: string
    values: {
        indent: string
        company: string
    }

    constructor(variableName: string, values: { indent: string, company: string }) {
        this.variableName = variableName
        this.values = values
    }

    static toVariable(row: QuotationRow): QuotationVariable {
        return new QuotationVariable(row.variableName, {
            indent: new Indent(row.values.indent),
            company: new Company(row.values.company)
        })
    }
}

export class QuotationItemRow {
    readonly typeName = 'QuotationItem'
    readonly variableName: string
    readonly quotation: string
    readonly indentItem: string
    values: {
        // UNQ(quotation, indentItem)
        quotation: string
        // assertion(quotation.indent == indentItem.indent)
        indentItem: string
        // assertion(quantity <= (indentItem.quantity - (ordered - rejected)) && quantity > 0)
        quantity: Number
    }

    constructor(variableName: string, values: { quotation: string, indentItem: string, quantity: Number }) {
        this.variableName = variableName
        this.values = values
        this.quotation = values.quotation
        this.indentItem = values.indentItem
    }

    static toVariable(row: QuotationItemRow): QuotationItemVariable {
        return new QuotationItemVariable(row.variableName, {
            quotation: new Quotation(row.values.quotation),
            indentItem: new IndentItem(row.values.indentItem),
            quantity: row.values.quantity
        })
    }
}

export class PurchaseOrderRow {
    readonly typeName = 'PurchaseOrder'
    readonly variableName: string
    values: {
        quotation: string
    }

    constructor(variableName: string, values: { quotation: string }) {
        this.variableName = variableName
        this.values = values
    }

    static toVariable(row: PurchaseOrderRow): PurchaseOrderVariable {
        return new PurchaseOrderVariable(row.variableName, {
            quotation: new Quotation(row.values.quotation)
        })
    }
}

export class PurchaseOrderItemRow {
    readonly typeName = 'PurchaseOrderItem'
    readonly variableName: string
    readonly purchaseOrder: string
    readonly quotationItem: string
    values: {
        // UNQ(purchaseOrder, quotationItem)
        purchaseOrder: string
        // assertion(purchaseOrder.quotation == quotationItem.quotation)
        quotationItem: string
        // assertion(quantity <= quotationItem.quantity && quantity > 0)
        quantity: Number // { quotationItem.indentItem.ordered += quantity }
        price: Decimal
        // assertion(received >= 0 && received <= quantity)
        received: Number
    }

    constructor(variableName: string, values: { purchaseOrder: string, quotationItem: string, quantity: Number, price: Decimal, received: Number }) {
        this.variableName = variableName
        this.values = values
        this.purchaseOrder = values.purchaseOrder
        this.quotationItem = values.quotationItem
    }

    static toVariable(row: PurchaseOrderItemRow): PurchaseOrderItemVariable {
        return new PurchaseOrderItemVariable(row.variableName, {
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
    readonly variableName: string
    values: {
        purchaseOrder: string
    }

    constructor(variableName: string, values: { purchaseOrder: string }) {
        this.variableName = variableName
        this.values = values
    }

    static toVariable(row: PurchaseInvoiceRow): PurchaseInvoiceVariable {
        return new PurchaseInvoiceVariable(row.variableName, {
            purchaseOrder: new PurchaseOrder(row.values.purchaseOrder)
        })
    }
}

export class PurchaseInvoiceItemRow {
    [immerable] = true
    readonly typeName = 'PurchaseInvoiceItem'
    readonly variableName: string
    readonly purchaseInvoice: string
    readonly purchaseOrderItem: string
    values: {
        // UNQ(purchaseInvoice, purchaseOrderItem)
        purchaseInvoice: string
        // assertion(purchaseInvoice.purchaseOrder == purchaseOrderItem.purchaseOrder)
        purchaseOrderItem: string
        // assertion(quantity <= purchaseOrderItem.quantity && quantity > 0)
        quantity: Number // { purchaseOrderItem.received += quantity && purchaseOrderItem.quotationOrderItem.indentOrderItem.received += quantity }
        // assertion((approved + rejected) <= quantity && approved >= 0 && rejeted >= 0)
        approved: Number
        rejected: Number
    }

    constructor(variableName: string, values: { purchaseInvoice: string, purchaseOrderItem: string, quantity: Number, approved: Number, rejected: Number }) {
        this.variableName = variableName
        this.values = values
        this.purchaseInvoice = values.purchaseInvoice
        this.purchaseOrderItem = values.purchaseOrderItem
    }

    static toVariable(row: PurchaseInvoiceItemRow): PurchaseInvoiceItemVariable {
        return new PurchaseInvoiceItemVariable(row.variableName, {
            purchaseInvoice: new PurchaseInvoice(row.values.purchaseInvoice),
            purchaseOrderItem: new PurchaseOrderItem(row.values.purchaseOrderItem),
            quantity: row.values.quantity,
            approved: row.values.approved,
            rejected: row.values.rejected
        })
    }
}

export class MaterialApprovalSlipRow {
    [immerable] = true
    readonly typeName = 'MaterialApprovalSlip'
    readonly variableName: string
    values: {
        purchaseInvoice: string
    }

    constructor(variableName: string, values: { purchaseInvoice: string }) {
        this.variableName = variableName
        this.values = values
    }

    static toVariable(row: MaterialApprovalSlipRow): MaterialApprovalSlipVariable {
        return new MaterialApprovalSlipVariable(row.variableName, {
            purchaseInvoice: new PurchaseInvoice(row.values.purchaseInvoice)
        })
    }
}

export class MaterialApprovalSlipItemRow {
    readonly typeName = 'MaterialApprovalSlipItem'
    readonly variableName: string
    readonly materialApprovalSlip: string
    readonly purchaseInvoiceItem: string
    values: {
        // UNQ(materialApprovalSlip, purchaseInvoiceItem)
        materialApprovalSlip: string
        // assertion(materialApprovalSlip.purchaseInvoice == purchaseInvoiceItem.purchaseInvoice)
        purchaseInvoiceItem: string
        // assertion(quantity <= purchaseInvoiceItem.quantity && quantity > 0)
        quantity: Number // { purchaseInvoiceItem.approved += quantity && purchaseInvoiceItem.purchaseOrderItem.quotationItem.indentItem.approved += quantity }
        // assertion(requisted <= quantity && requisted >= 0)
        requisted: Number
    }

    constructor(variableName: string, values: { materialApprovalSlip: string, purchaseInvoiceItem: string, quantity: Number, requisted: Number }) {
        this.variableName = variableName
        this.values = values
        this.materialApprovalSlip = values.materialApprovalSlip
        this.purchaseInvoiceItem = values.purchaseInvoiceItem
    }

    static toVariable(row: MaterialApprovalSlipItemRow): MaterialApprovalSlipItemVariable {
        return new MaterialApprovalSlipItemVariable(row.variableName, {
            materialApprovalSlip: new MaterialApprovalSlip(row.values.materialApprovalSlip),
            purchaseInvoiceItem: new PurchaseInvoiceItem(row.values.purchaseInvoiceItem),
            quantity: row.values.quantity,
            requisted: row.values.requisted
        })
    }
}

export class MaterialRejectionSlipRow {
    readonly typeName = 'MaterialRejectionSlip'
    readonly variableName: string
    values: {
        purchaseInvoice: string
    }

    constructor(variableName: string, values: { purchaseInvoice: string }) {
        this.variableName = variableName
        this.values = values
    }

    static toVariable(row: MaterialRejectionSlipRow): MaterialRejectionSlipVariable {
        return new MaterialRejectionSlipVariable(row.variableName, {
            purchaseInvoice: new PurchaseInvoice(row.values.purchaseInvoice)
        })
    }
}

export class MaterialRejectionSlipItemRow {
    readonly typeName = 'MaterialRejectionSlipItem'
    readonly variableName: string
    readonly materialRejectionSlip: string
    readonly purchaseInvoiceItem: string
    values: {
        // UNQ(materialRejectionSlip, purchaseInvoiceItem)
        materialRejectionSlip: string
        // assertion(materialRejectionSlip.purchaseInvoice == purchaseInvoiceItem.purchaseInvoice)
        purchaseInvoiceItem: string
        // assertion(quantity <= purchaseInvoiceItem.quantity && quantity > 0)
        quantity: Number // { purchaseInvoiceItem.rejected += quantity && purchaseInvoiceItem.purchaseOrderItem.quotationItem.indentItem.rejected += quantity  }
        // assertion(returned <= quantity && returned >= 0)
        returned: Number
    }

    constructor(variableName: string, values: { materialRejectionSlip: string, purchaseInvoiceItem: string, quantity: Number, returned: Number }) {
        this.variableName = variableName
        this.values = values
        this.materialRejectionSlip = values.materialRejectionSlip
        this.purchaseInvoiceItem = values.purchaseInvoiceItem
    }

    static toVariable(row: MaterialRejectionSlipItemRow): MaterialRejectionSlipItemVariable {
        return new MaterialRejectionSlipItemVariable(row.variableName, {
            materialRejectionSlip: new MaterialRejectionSlip(row.values.materialRejectionSlip),
            purchaseInvoiceItem: new PurchaseInvoiceItem(row.values.purchaseInvoiceItem),
            quantity: row.values.quantity,
            returned: row.values.returned
        })
    }
}

export class MaterialReturnSlipRow {
    readonly typeName = 'MaterialReturnSlip'
    readonly variableName: string
    values: {
        materialRejectionSlip: string
    }

    constructor(variableName: string, values: { materialRejectionSlip: string }) {
        this.variableName = variableName
        this.values = values
    }

    static toVariable(row: MaterialReturnSlipRow): MaterialReturnSlipVariable {
        return new MaterialReturnSlipVariable(row.variableName, {
            materialRejectionSlip: new MaterialRejectionSlip(row.values.materialRejectionSlip)
        })
    }
}

export class MaterialReturnSlipItemRow {
    readonly typeName = 'MaterialReturnSlipItem'
    readonly variableName: string
    readonly materialReturnSlip: string
    readonly materialRejectionSlipItem: string
    values: {
        // UNQ(materialReturnSlip, materialRejectionSlipItem)
        materialReturnSlip: string
        // assertion(materialReturnSlip.materialRejectionSlip == materialRejectionSlipItem.materialRejectionSlip)
        materialRejectionSlipItem: string
        // assertion(quantity <= materialRejectionSlipItem.quantity && quantity > 0)
        quantity: Number // { materialRejectionSlipItem.returned += quantity && materialRejectionSlipItem.purchaseInvoiceItem.purchaseOrderItem.quotationItem.indentItem.returned += quantity }
    }

    constructor(variableName: string, values: { materialReturnSlip: string, materialRejectionSlipItem: string, quantity: Number }) {
        this.variableName = variableName
        this.values = values
        this.materialReturnSlip = values.materialReturnSlip
        this.materialRejectionSlipItem = values.materialRejectionSlipItem
    }

    static toVariable(row: MaterialReturnSlipItemRow): MaterialReturnSlipItemVariable {
        return new MaterialReturnSlipItemVariable(row.variableName, {
            materialReturnSlip: new MaterialReturnSlip(row.values.materialReturnSlip),
            materialRejectionSlipItem: new MaterialRejectionSlipItem(row.values.materialRejectionSlipItem),
            quantity: row.values.quantity
        })
    }
}

export class MaterialRequistionSlipRow {
    readonly typeName = 'MaterialRequistionSlip'
    readonly variableName: string
    values: {
        materialApprovalSlip: string
    }

    constructor(variableName: string, values: { materialApprovalSlip: string }) {
        this.variableName = variableName
        this.values = values
    }

    static toVariable(row: MaterialRequistionSlipRow): MaterialRequistionSlipVariable {
        return new MaterialRequistionSlipVariable(row.variableName, {
            materialApprovalSlip: new MaterialApprovalSlip(row.values.materialApprovalSlip)
        })
    }
}

export class MaterialRequistionSlipItemRow {
    readonly typeName = 'MaterialRequistionSlipItem'
    readonly variableName: string
    readonly materialRequistionSlip: string
    readonly materialApprovalSlipItem: string
    values: {
        // UNQ(materialRequistionSlip, materialApprovalSlipItem)
        materialRequistionSlip: string
        // assertion(materialRequistionSlip.materialApprovalSlip == materialApprovalSlipItem.materialApprovalSlip)
        materialApprovalSlipItem: string
        // assertion(quantity <= materialApprovalSlipItem.quantity && quantity > 0)
        quantity: Number // { materialApprovalSlipItem.requisted += quantity && materialApprovalSlipItem.purchaseInvoiceItem.purchaseOrderItem.quotationItem.indentItem.requisted += quantity }
        // assertion(consumed <= quantity && consumed >= 0)
        consumed: Number
    }

    constructor(variableName: string, values: { materialRequistionSlip: string, materialApprovalSlipItem: string, quantity: Number, consumed: Number }) {
        this.variableName = variableName
        this.values = values
        this.materialRequistionSlip = values.materialRequistionSlip
        this.materialApprovalSlipItem = values.materialApprovalSlipItem
    }

    static toVariable(row: MaterialRequistionSlipItemRow): MaterialRequistionSlipItemVariable {
        return new MaterialRequistionSlipItemVariable(row.variableName, {
            materialRequistionSlip: new MaterialRequistionSlip(row.values.materialRequistionSlip),
            materialApprovalSlipItem: new MaterialApprovalSlipItem(row.values.materialApprovalSlipItem),
            quantity: row.values.quantity,
            consumed: row.values.consumed
        })
    }
}

export class BOMRow {
    readonly typeName = 'BOM'
    readonly variableName: string
    readonly name: string
    values: {
        name: string
    }

    constructor(variableName: string, values: { name: string }) {
        this.variableName = variableName
        this.values = values
        this.name = values.name
    }

    static toVariable(row: BOMRow): BOMVariable {
        return new BOMVariable(row.variableName, {
            name: row.values.name
        })
    }
}

export class BOMItemRow {
    readonly typeName = 'BOMItem'
    readonly variableName: string
    readonly bom: string
    readonly product: string
    values: {
        // UNQ(bom, product)
        bom: string
        // assertion(product.consumable == true)
        product: string
        // assertion(quantity > 0 && uom.product == product)
        quantity: Number
        uom: string
    }

    constructor(variableName: string, values: { bom: string, product: string, quantity: Number, uom: string }) {
        this.variableName = variableName
        this.values = values
        this.bom = values.bom
        this.product = values.product
    }

    static toVariable(row: BOMItemRow): BOMItemVariable {
        return new BOMItemVariable(row.variableName, {
            bom: new BOM(row.values.bom),
            product: new Product(row.values.product),
            quantity: row.values.quantity,
            uom: new UOM(row.values.uom)
        })
    }
}

export class ProductionPreparationSlipRow {
    readonly typeName = 'ProductionPreparationSlip'
    readonly variableName: string
    values: {
        bom: string
        // assertion((approved + scrapped) <= quantity && approved >= 0 && scrapped >= 0)
        approved: Number
        scrapped: Number
    }

    constructor(variableName: string, values: { bom: string, approved: Number, scrapped: Number }) {
        this.variableName = variableName
        this.values = values
    }

    static toVariable(row: ProductionPreparationSlipRow): ProductionPreparationSlipVariable {
        return new ProductionPreparationSlipVariable(row.variableName, {
            bom: new BOM(row.values.bom),
            approved: row.values.approved,
            scrapped: row.values.scrapped
        })
    }
}

export class ProductionPreparationSlipItemRow {
    readonly typeName = 'ProductionPreparationSlipItem'
    readonly variableName: string
    readonly productionPreparationSlip: string
    readonly bomItem: string
    values: {
        // UNQ(productionPreparationSlip, bomItem)
        productionPreparationSlip: string
        bomItem: string
        // assertion(bomItem.product == materialRequistionSlipItem.materialApprovalSlipItem.purchaseInvoiceItem.purchaseOrderItem.quotationItem.indentItem.product)
        materialRequistionSlipItem: string
        // { materialRequistionSlipItem.consumed += bomItem.quantity * materialRequistionSlipItem.materialApprovalSlipItem.purchaseInvoiceItem.purchaseOrderItem.quotationItem.indentItem.uom.conversionRate / bomItem.product.uom.conversionRate }
        // { materialRequistionSlipItem.materialApprovalSlipItem.purchaseInvoiceItem.purchaseOrderItem.quotationItem.indentItem.consumed += bomItem.quantity * materialRequistionSlipItem.materialApprovalSlipItem.purchaseInvoiceItem.purchaseOrderItem.quotationItem.indentItem.uom.conversionRate / bomItem.product.uom.conversionRate }
    }

    constructor(variableName: string, values: { productionPreparationSlip: string, bomItem: string, materialRequistionSlipItem: string }) {
        this.variableName = variableName
        this.values = values
        this.productionPreparationSlip = values.productionPreparationSlip
        this.bomItem = values.bomItem
    }

    static toVariable(row: ProductionPreparationSlipItemRow): ProductionPreparationSlipItemVariable {
        return new ProductionPreparationSlipItemVariable(row.variableName, {
            productionPreparationSlip: new ProductionPreparationSlip(row.values.productionPreparationSlip),
            bomItem: row.values.bomItem,
            materialRequistionSlipItem: new MaterialRequistionSlipItem(row.values.materialRequistionSlipItem)
        })
    }
}

export class ScrapMaterialSlipRow {
    readonly typeName = 'ScrapMaterialSlip'
    readonly variableName: string
    values: {
        productionPreparationSlip: string
        // assertion(quantity <= productionPreparationSlip.bom.quantity && quantity > 0)
        quantity: Number // { productionPreparationSlip.scrapped += quantity }
    }

    constructor(variableName: string, values: { productionPreparationSlip: string, quantity: Number }) {
        this.variableName = variableName
        this.values = values
    }

    static toVariable(row: ScrapMaterialSlipRow): ScrapMaterialSlipVariable {
        return new ScrapMaterialSlipVariable(row.variableName, {
            productionPreparationSlip: new ProductionPreparationSlip(row.values.productionPreparationSlip),
            quantity: row.values.quantity
        })
    }
}

export class TransferMaterialSlipRow {
    readonly typeName = 'TransferMaterialSlip'
    readonly variableName: string
    values: {
        productionPreparationSlip: string
        // assertion(quantity <= productionPreparationSlip.bom.quantity && quantity > 0)
        quantity: Number // { productionPreparationSlip.approved += quantity }
        // assertion(transfered <= quantity && transfered >= 0)
        transferred: Number
    }

    constructor(variableName: string, values: { productionPreparationSlip: string, quantity: Number, transferred: Number }) {
        this.variableName = variableName
        this.values = values
    }

    static toVariable(row: TransferMaterialSlipRow): TransferMaterialSlipVariable {
        return new TransferMaterialSlipVariable(row.variableName, {
            productionPreparationSlip: new ProductionPreparationSlip(row.values.productionPreparationSlip),
            quantity: row.values.quantity,
            transferred: row.values.transferred
        })
    }
}

export class WarehouseAcceptanceSlipRow {
    readonly typeName = 'WarehouseAcceptanceSlip'
    readonly variableName: string
    values: {
        transferMaterialSlip: string
        // assertion(quantity <= transferMaterialSlip.quantity && quantity > 0)
        quantity: Number // { transferMaterialSlip.transfered += quantity }
    }

    constructor(variableName: string, values: { transferMaterialSlip: string, quantity: Number }) {
        this.variableName = variableName
        this.values = values
    }

    static toVariable(row: WarehouseAcceptanceSlipRow): WarehouseAcceptanceSlipVariable {
        return new WarehouseAcceptanceSlipVariable(row.variableName, {
            transferMaterialSlip: new TransferMaterialSlip(row.values.transferMaterialSlip),
            quantity: row.values.quantity
        })
    }
}

export class DiffRow {
    readonly id?: number
    active: boolean
    variables: {
        Region: {
            replace: Array<RegionRow>
            remove: Array<string>
        },
        Country: {
            replace: Array<CountryRow>
            remove: Array<string>
        },
        State: {
            replace: Array<StateRow>
            remove: Array<string>
        },
        District: {
            replace: Array<DistrictRow>
            remove: Array<string>
        },
        Subdistrict: {
            replace: Array<SubdistrictRow>
            remove: Array<string>
        },
        PostalCode: {
            replace: Array<PostalCodeRow>
            remove: Array<string>
        },
        Address: {
            replace: Array<AddressRow>
            remove: Array<string>
        },
        Company: {
            replace: Array<CompanyRow>
            remove: Array<string>
        },
        CompanyAddress: {
            replace: Array<CompanyAddressRow>
            remove: Array<string>
        },
        CompanyTagGroup: {
            replace: Array<CompanyTagGroupRow>
            remove: Array<string>
        },
        CompanyTag: {
            replace: Array<CompanyTagRow>
            remove: Array<string>
        },
        MappingCompanyTag: {
            replace: Array<MappingCompanyTagRow>
            remove: Array<string>
        },
        Contact: {
            replace: Array<ContactRow>
            remove: Array<string>
        },
        ContactAddress: {
            replace: Array<ContactAddressRow>
            remove: Array<string>
        },
        CompanyContact: {
            replace: Array<CompanyContactRow>
            remove: Array<string>
        },
        Currency: {
            replace: Array<CurrencyRow>
            remove: Array<string>
        },
        CurrencyRate: {
            replace: Array<CurrencyRateRow>
            remove: Array<string>
        },
        Memo: {
            replace: Array<MemoRow>
            remove: Array<string>
        },
        Bank: {
            replace: Array<BankRow>
            remove: Array<string>
        },
        BankBranch: {
            replace: Array<BankBranchRow>
            remove: Array<string>
        },
        BankAccount: {
            replace: Array<BankAccountRow>
            remove: Array<string>
        },
        BankTransaction: {
            replace: Array<BankTransactionRow>
            remove: Array<string>
        },
        CompanyBankAccount: {
            replace: Array<CompanyBankAccountRow>
            remove: Array<string>
        },
        ProductCategoryGroup: {
            replace: Array<ProductCategoryGroupRow>
            remove: Array<string>
        },
        ProductCategory: {
            replace: Array<ProductCategoryRow>
            remove: Array<string>
        },
        Product: {
            replace: Array<ProductRow>
            remove: Array<string>
        },
        ProductTagGroup: {
            replace: Array<ProductTagGroupRow>
            remove: Array<string>
        },
        ProductTag: {
            replace: Array<ProductTagRow>
            remove: Array<string>
        },
        MappingProductTag: {
            replace: Array<MappingProductTagRow>
            remove: Array<string>
        },
        UOM: {
            replace: Array<UOMRow>
            remove: Array<string>
        },
        Indent: {
            replace: Array<IndentRow>
            remove: Array<string>
        },
        IndentItem: {
            replace: Array<IndentItemRow>
            remove: Array<string>
        },
        CompanyProduct: {
            replace: Array<CompanyProductRow>
            remove: Array<string>
        },
        Quotation: {
            replace: Array<QuotationRow>
            remove: Array<string>
        },
        QuotationItem: {
            replace: Array<QuotationItemRow>
            remove: Array<string>
        },
        PurchaseOrder: {
            replace: Array<PurchaseOrderRow>
            remove: Array<string>
        },
        PurchaseOrderItem: {
            replace: Array<PurchaseOrderItemRow>
            remove: Array<string>
        },
        PurchaseInvoice: {
            replace: Array<PurchaseInvoiceRow>
            remove: Array<string>
        },
        PurchaseInvoiceItem: {
            replace: Array<PurchaseInvoiceItemRow>
            remove: Array<string>
        },
        MaterialApprovalSlip: {
            replace: Array<MaterialApprovalSlipRow>
            remove: Array<string>
        },
        MaterialApprovalSlipItem: {
            replace: Array<MaterialApprovalSlipItemRow>
            remove: Array<string>
        },
        MaterialRejectionSlip: {
            replace: Array<MaterialRejectionSlipRow>
            remove: Array<string>
        },
        MaterialRejectionSlipItem: {
            replace: Array<MaterialRejectionSlipItemRow>
            remove: Array<string>
        },
        MaterialReturnSlip: {
            replace: Array<MaterialReturnSlipRow>
            remove: Array<string>
        },
        MaterialReturnSlipItem: {
            replace: Array<MaterialReturnSlipItemRow>
            remove: Array<string>
        },
        MaterialRequistionSlip: {
            replace: Array<MaterialRequistionSlipRow>
            remove: Array<string>
        },
        MaterialRequistionSlipItem: {
            replace: Array<MaterialRequistionSlipItemRow>
            remove: Array<string>
        },
        BOM: {
            replace: Array<BOMRow>
            remove: Array<string>
        },
        BOMItem: {
            replace: Array<BOMItemRow>
            remove: Array<string>
        },
        ProductionPreparationSlip: {
            replace: Array<ProductionPreparationSlipRow>
            remove: Array<string>
        },
        ProductionPreparationSlipItem: {
            replace: Array<ProductionPreparationSlipItemRow>
            remove: Array<string>
        },
        ScrapMaterialSlip: {
            replace: Array<ScrapMaterialSlipRow>
            remove: Array<string>
        },
        TransferMaterialSlip: {
            replace: Array<TransferMaterialSlipRow>
            remove: Array<string>
        },
        WarehouseAcceptanceSlip: {
            replace: Array<WarehouseAcceptanceSlipRow>
            remove: Array<string>
        }
    }

    constructor(variables: {
        Region: {
            replace: Array<RegionRow>
            remove: Array<string>
        },
        Country: {
            replace: Array<CountryRow>
            remove: Array<string>
        },
        State: {
            replace: Array<StateRow>
            remove: Array<string>
        },
        District: {
            replace: Array<DistrictRow>
            remove: Array<string>
        },
        Subdistrict: {
            replace: Array<SubdistrictRow>
            remove: Array<string>
        },
        PostalCode: {
            replace: Array<PostalCodeRow>
            remove: Array<string>
        },
        Address: {
            replace: Array<AddressRow>
            remove: Array<string>
        },
        Company: {
            replace: Array<CompanyRow>
            remove: Array<string>
        },
        CompanyAddress: {
            replace: Array<CompanyAddressRow>
            remove: Array<string>
        },
        CompanyTagGroup: {
            replace: Array<CompanyTagGroupRow>
            remove: Array<string>
        },
        CompanyTag: {
            replace: Array<CompanyTagRow>
            remove: Array<string>
        },
        MappingCompanyTag: {
            replace: Array<MappingCompanyTagRow>
            remove: Array<string>
        },
        Contact: {
            replace: Array<ContactRow>
            remove: Array<string>
        },
        ContactAddress: {
            replace: Array<ContactAddressRow>
            remove: Array<string>
        },
        CompanyContact: {
            replace: Array<CompanyContactRow>
            remove: Array<string>
        },
        Currency: {
            replace: Array<CurrencyRow>
            remove: Array<string>
        },
        CurrencyRate: {
            replace: Array<CurrencyRateRow>
            remove: Array<string>
        },
        Memo: {
            replace: Array<MemoRow>
            remove: Array<string>
        },
        Bank: {
            replace: Array<BankRow>
            remove: Array<string>
        },
        BankBranch: {
            replace: Array<BankBranchRow>
            remove: Array<string>
        },
        BankAccount: {
            replace: Array<BankAccountRow>
            remove: Array<string>
        },
        BankTransaction: {
            replace: Array<BankTransactionRow>
            remove: Array<string>
        },
        CompanyBankAccount: {
            replace: Array<CompanyBankAccountRow>
            remove: Array<string>
        },
        ProductCategoryGroup: {
            replace: Array<ProductCategoryGroupRow>
            remove: Array<string>
        },
        ProductCategory: {
            replace: Array<ProductCategoryRow>
            remove: Array<string>
        },
        Product: {
            replace: Array<ProductRow>
            remove: Array<string>
        },
        ProductTagGroup: {
            replace: Array<ProductTagGroupRow>
            remove: Array<string>
        },
        ProductTag: {
            replace: Array<ProductTagRow>
            remove: Array<string>
        },
        MappingProductTag: {
            replace: Array<MappingProductTagRow>
            remove: Array<string>
        },
        UOM: {
            replace: Array<UOMRow>
            remove: Array<string>
        },
        Indent: {
            replace: Array<IndentRow>
            remove: Array<string>
        },
        IndentItem: {
            replace: Array<IndentItemRow>
            remove: Array<string>
        },
        CompanyProduct: {
            replace: Array<CompanyProductRow>
            remove: Array<string>
        },
        Quotation: {
            replace: Array<QuotationRow>
            remove: Array<string>
        },
        QuotationItem: {
            replace: Array<QuotationItemRow>
            remove: Array<string>
        },
        PurchaseOrder: {
            replace: Array<PurchaseOrderRow>
            remove: Array<string>
        },
        PurchaseOrderItem: {
            replace: Array<PurchaseOrderItemRow>
            remove: Array<string>
        },
        PurchaseInvoice: {
            replace: Array<PurchaseInvoiceRow>
            remove: Array<string>
        },
        PurchaseInvoiceItem: {
            replace: Array<PurchaseInvoiceItemRow>
            remove: Array<string>
        },
        MaterialApprovalSlip: {
            replace: Array<MaterialApprovalSlipRow>
            remove: Array<string>
        },
        MaterialApprovalSlipItem: {
            replace: Array<MaterialApprovalSlipItemRow>
            remove: Array<string>
        },
        MaterialRejectionSlip: {
            replace: Array<MaterialRejectionSlipRow>
            remove: Array<string>
        },
        MaterialRejectionSlipItem: {
            replace: Array<MaterialRejectionSlipItemRow>
            remove: Array<string>
        },
        MaterialReturnSlip: {
            replace: Array<MaterialReturnSlipRow>
            remove: Array<string>
        },
        MaterialReturnSlipItem: {
            replace: Array<MaterialReturnSlipItemRow>
            remove: Array<string>
        },
        MaterialRequistionSlip: {
            replace: Array<MaterialRequistionSlipRow>
            remove: Array<string>
        },
        MaterialRequistionSlipItem: {
            replace: Array<MaterialRequistionSlipItemRow>
            remove: Array<string>
        },
        BOM: {
            replace: Array<BOMRow>
            remove: Array<string>
        },
        BOMItem: {
            replace: Array<BOMItemRow>
            remove: Array<string>
        },
        ProductionPreparationSlip: {
            replace: Array<ProductionPreparationSlipRow>
            remove: Array<string>
        },
        ProductionPreparationSlipItem: {
            replace: Array<ProductionPreparationSlipItemRow>
            remove: Array<string>
        },
        ScrapMaterialSlip: {
            replace: Array<ScrapMaterialSlipRow>
            remove: Array<string>
        },
        TransferMaterialSlip: {
            replace: Array<TransferMaterialSlipRow>
            remove: Array<string>
        },
        WarehouseAcceptanceSlip: {
            replace: Array<WarehouseAcceptanceSlipRow>
            remove: Array<string>
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
            State: {
                replace: HashSet.of<StateVariable>().addAll(diff.variables.State.replace.map(x => StateRow.toVariable(x))),
                remove: HashSet.of<State>().addAll(diff.variables.State.remove.map(x => new State(x)))
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
            UOM: {
                replace: HashSet.of<UOMVariable>().addAll(diff.variables.UOM.replace.map(x => UOMRow.toVariable(x))),
                remove: HashSet.of<UOM>().addAll(diff.variables.UOM.remove.map(x => new UOM(x)))
            },
            Indent: {
                replace: HashSet.of<IndentVariable>().addAll(diff.variables.Indent.replace.map(x => IndentRow.toVariable(x))),
                remove: HashSet.of<Indent>().addAll(diff.variables.Indent.remove.map(x => new Indent(x)))
            },
            IndentItem: {
                replace: HashSet.of<IndentItemVariable>().addAll(diff.variables.IndentItem.replace.map(x => IndentItemRow.toVariable(x))),
                remove: HashSet.of<IndentItem>().addAll(diff.variables.IndentItem.remove.map(x => new IndentItem(x)))
            },
            CompanyProduct: {
                replace: HashSet.of<CompanyProductVariable>().addAll(diff.variables.CompanyProduct.replace.map(x => CompanyProductRow.toVariable(x))),
                remove: HashSet.of<CompanyProduct>().addAll(diff.variables.CompanyProduct.remove.map(x => new CompanyProduct(x)))
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
            BOM: {
                replace: HashSet.of<BOMVariable>().addAll(diff.variables.BOM.replace.map(x => BOMRow.toVariable(x))),
                remove: HashSet.of<BOM>().addAll(diff.variables.BOM.remove.map(x => new BOM(x)))
            },
            BOMItem: {
                replace: HashSet.of<BOMItemVariable>().addAll(diff.variables.BOMItem.replace.map(x => BOMItemRow.toVariable(x))),
                remove: HashSet.of<BOMItem>().addAll(diff.variables.BOMItem.remove.map(x => new BOMItem(x)))
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
