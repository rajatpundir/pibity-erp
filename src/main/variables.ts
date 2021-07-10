import { immerable } from 'immer'
import { AddressRow, BankAccountRow, BankBranchRow, BankRow, BOMItemRow, BOMRow, CountryRow, DistrictRow, IndentItemRow, IndentRow, MaterialApprovalSlipItemRow, MaterialApprovalSlipRow, MaterialRejectionSlipItemRow, MaterialRejectionSlipRow, MaterialRequistionSlipItemRow, MaterialRequistionSlipRow, MaterialReturnSlipItemRow, MaterialReturnSlipRow, PostalCodeRow, ProductionPreparationSlipItemRow, ProductionPreparationSlipRow, ProductRow, PurchaseInvoiceItemRow, PurchaseInvoiceRow, PurchaseOrderItemRow, PurchaseOrderRow, QuotationItemRow, QuotationRow, RegionRow, ScrapMaterialSlipRow, StateRow, SubdistrictRow, CompanyAddressRow, CompanyBankAccountRow, CompanyContactRow, CompanyProductRow, CompanyRow, TransferMaterialSlipRow, UOMRow, WarehouseAcceptanceSlipRow, BankTransactionRow, CompanyTagGroupRow, CompanyTagRow, ContactAddressRow, ContactRow, CurrencyRateRow, CurrencyRow, MappingCompanyTagRow, MappingProductTagRow, MemoRow, ProductCategoryGroupRow, ProductCategoryRow, ProductTagGroupRow, ProductTagRow } from './rows'
import { NonPrimitiveType } from './types'

export type Text = string
export type Number = number
export type Decimal = number
export type Boolean = boolean
export type Date = number
export type Timestamp = number
export type Time = number

export type Variable =
    | RegionVariable
    | CountryVariable
    | StateVariable
    | DistrictVariable
    | SubdistrictVariable
    | PostalCodeVariable
    | AddressVariable
    | CompanyVariable
    | CompanyAddressVariable
    | CompanyTagGroupVariable
    | CompanyTagVariable
    | MappingCompanyTagVariable
    | ContactVariable
    | ContactAddressVariable
    | CompanyContactVariable
    | CurrencyVariable
    | CurrencyRateVariable
    | MemoVariable
    | BankVariable
    | BankBranchVariable
    | BankAccountVariable
    | BankTransactionVariable
    | CompanyBankAccountVariable
    | ProductCategoryGroupVariable
    | ProductCategoryVariable
    | ProductVariable
    | ProductTagGroupVariable
    | ProductTagVariable
    | MappingProductTagVariable
    | UOMVariable
    | IndentVariable
    | IndentItemVariable
    | CompanyProductVariable
    | QuotationVariable
    | QuotationItemVariable
    | PurchaseOrderVariable
    | PurchaseOrderItemVariable
    | PurchaseInvoiceVariable
    | PurchaseInvoiceItemVariable
    | MaterialApprovalSlipVariable
    | MaterialApprovalSlipItemVariable
    | MaterialRejectionSlipVariable
    | MaterialRejectionSlipItemVariable
    | MaterialReturnSlipVariable
    | MaterialReturnSlipItemVariable
    | MaterialRequistionSlipVariable
    | MaterialRequistionSlipItemVariable
    | BOMVariable
    | BOMItemVariable
    | ProductionPreparationSlipVariable
    | ProductionPreparationSlipItemVariable
    | ScrapMaterialSlipVariable
    | TransferMaterialSlipVariable
    | WarehouseAcceptanceSlipVariable

export type VariableId =
    | Region
    | Country
    | State
    | District
    | Subdistrict
    | PostalCode
    | Address
    | Company
    | CompanyAddress
    | CompanyTagGroup
    | CompanyTag
    | MappingCompanyTag
    | Contact
    | ContactAddress
    | CompanyContact
    | Currency
    | CurrencyRate
    | Memo
    | Bank
    | BankBranch
    | BankAccount
    | BankTransaction
    | CompanyBankAccount
    | ProductCategoryGroup
    | ProductCategory
    | Product
    | ProductTagGroup
    | ProductTag
    | MappingProductTag
    | UOM
    | Indent
    | IndentItem
    | CompanyProduct
    | Quotation
    | QuotationItem
    | PurchaseOrder
    | PurchaseOrderItem
    | PurchaseInvoice
    | PurchaseInvoiceItem
    | MaterialApprovalSlip
    | MaterialApprovalSlipItem
    | MaterialRejectionSlip
    | MaterialRejectionSlipItem
    | MaterialReturnSlip
    | MaterialReturnSlipItem
    | MaterialRequistionSlip
    | MaterialRequistionSlipItem
    | BOM
    | BOMItem
    | ProductionPreparationSlip
    | ProductionPreparationSlipItem
    | ScrapMaterialSlip
    | TransferMaterialSlip
    | WarehouseAcceptanceSlip

export class Region {
    constructor(private id: number) { }

    equals(other: Region): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class RegionVariable {
    [immerable] = true
    readonly typeName = 'Region'
    readonly id: Region
    values: {
        name: Text
    }

    constructor(id: number, values: { name: Text }) {
        this.id = new Region(id)
        this.values = values
    }

    equals(other: RegionVariable): boolean {
        if (!other) {
            return false;
        }
        return this.id.equals(other.id)
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): RegionRow {
        return new RegionRow(this.id.hashCode(), this.values)
    }
}

export class Country {
    constructor(private id: number) { }

    equals(other: Country): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class CountryVariable {
    [immerable] = true
    readonly typeName = 'Country'
    readonly id: Country
    values: {
        // UNQ(region, name)
        region: Region
        name: Text
    }

    constructor(id: number, values: { region: Region, name: Text }) {
        this.id = new Country(id)
        this.values = values
    }

    equals(other: CountryVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.region.equals(other.values.region) && this.values.name === other.values.name
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): CountryRow {
        return new CountryRow(this.id.hashCode(), {
            region: this.values.region.hashCode(),
            name: this.values.name
        })
    }
}

export class State {
    constructor(private id: number) { }

    equals(other: State): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class StateVariable {
    [immerable] = true
    readonly typeName = 'State'
    readonly id: State
    values: {
        // UNQ(country, name)
        country: Country
        name: Text
    }

    constructor(id: number, values: { country: Country, name: Text }) {
        this.id = new State(id)
        this.values = values
    }

    equals(other: StateVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.country.equals(other.values.country) && this.values.name === other.values.name
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): StateRow {
        return new StateRow(this.id.hashCode(), {
            country: this.values.country.hashCode(),
            name: this.values.name
        })
    }
}

export class District {
    constructor(private id: number) { }

    equals(other: District): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class DistrictVariable {
    [immerable] = true
    readonly typeName = 'District'
    readonly id: District
    values: {
        // UNQ(state, name)
        state: State
        name: Text
    }

    constructor(id: number, values: { state: State, name: Text }) {
        this.id = new District(id)
        this.values = values
    }

    equals(other: DistrictVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.state.equals(other.values.state) && this.values.name === other.values.name
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): DistrictRow {
        return new DistrictRow(this.id.hashCode(), {
            state: this.values.state.hashCode(),
            name: this.values.name
        })
    }
}

export class Subdistrict {
    constructor(private id: number) { }

    equals(other: Subdistrict): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class SubdistrictVariable {
    [immerable] = true
    readonly typeName = 'Subdistrict'
    readonly id: Subdistrict
    values: {
        // UNQ(district, name)
        district: District
        name: Text
    }

    constructor(id: number, values: { district: District, name: Text }) {
        this.id = new Subdistrict(id)
        this.values = values
    }

    equals(other: SubdistrictVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.district.equals(other.values.district) && this.values.name === other.values.name
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): SubdistrictRow {
        return new SubdistrictRow(this.id.hashCode(), {
            district: this.values.district.hashCode(),
            name: this.values.name
        })
    }
}

export class PostalCode {
    constructor(private id: number) { }

    equals(other: PostalCode): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class PostalCodeVariable {
    [immerable] = true
    readonly typeName = 'PostalCode'
    readonly id: PostalCode
    values: {
        // UNQ(subdistrict, name)
        subdistrict: Subdistrict
        name: Text
    }

    constructor(id: number, values: { subdistrict: Subdistrict, name: Text }) {
        this.id = new PostalCode(id)
        this.values = values
    }

    equals(other: PostalCodeVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.subdistrict.equals(other.values.subdistrict) && this.values.name === other.values.name
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): PostalCodeRow {
        return new PostalCodeRow(this.id.hashCode(), {
            subdistrict: this.values.subdistrict.hashCode(),
            name: this.values.name
        })
    }
}

export class Address {
    constructor(private id: number) { }

    equals(other: Address): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class AddressVariable {
    [immerable] = true
    readonly typeName = 'Address'
    readonly id: Address
    values: {
        // UNQ(postalCode, line1, line2)
        postalCode: PostalCode
        line1: Text
        line2: Text
        latitude: Decimal
        longitude: Decimal
    }

    constructor(id: number, values: { postalCode: PostalCode, line1: Text, line2: Text, latitude: Decimal, longitude: Decimal }) {
        this.id = new Address(id)
        this.values = values
    }

    equals(other: AddressVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.postalCode.equals(other.values.postalCode) && this.values.line1 === other.values.line1 && this.values.line2 === other.values.line2
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): AddressRow {
        return new AddressRow(this.id.hashCode(), {
            postalCode: this.values.postalCode.hashCode(),
            line1: this.values.line1,
            line2: this.values.line2,
            latitude: this.values.latitude,
            longitude: this.values.longitude
        })
    }
}

export class Company {
    constructor(private id: number) { }

    equals(other: Company): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class CompanyVariable {
    [immerable] = true
    readonly typeName = 'Company'
    readonly id: Company
    values: {
        name: Text
        email: Text
        telephone: Text
        mobile: Text
        website: Text
        gstin: Text
        pan: Text
        iec: Text
    }

    constructor(id: number, values: { name: Text, email: Text, telephone: Text, mobile: Text, website: Text, gstin: Text, pan: Text, iec: Text }) {
        this.id = new Company(id)
        this.values = values
    }

    equals(other: CompanyVariable): boolean {
        if (!other) {
            return false;
        }
        return this.id.equals(other.id) || this.values.gstin === other.values.gstin || this.values.pan === other.values.pan || this.values.iec === other.values.iec
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): CompanyRow {
        return new CompanyRow(this.id.hashCode(), {
            name: this.values.name,
            email: this.values.email,
            telephone: this.values.telephone,
            mobile: this.values.mobile,
            website: this.values.website,
            gstin: this.values.gstin,
            pan: this.values.pan,
            iec: this.values.iec
        })
    }
}

export class CompanyAddress {
    constructor(private id: number) { }

    equals(other: CompanyAddress): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class CompanyAddressVariable {
    [immerable] = true
    readonly typeName = 'CompanyAddress'
    readonly id: CompanyAddress
    values: {
        // UNQ(company, name)
        // UNQ(company, address)
        company: Company
        name: Text
        address: Address
    }

    constructor(id: number, values: { company: Company, name: Text, address: Address }) {
        this.id = new CompanyAddress(id)
        this.values = values
    }

    equals(other: CompanyAddressVariable): boolean {
        if (!other) {
            return false;
        }
        return (this.values.company.equals(other.values.company) && this.values.name === other.values.name) && (this.values.company.equals(other.values.company) && this.values.address.equals(other.values.address))
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): CompanyAddressRow {
        return new CompanyAddressRow(this.id.hashCode(), {
            company: this.values.company.hashCode(),
            name: this.values.name,
            address: this.values.address.hashCode()
        })
    }
}

export class CompanyTagGroup {
    constructor(private id: number) { }

    equals(other: CompanyTagGroup): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class CompanyTagGroupVariable {
    [immerable] = true
    readonly typeName = 'CompanyTagGroup'
    readonly id: CompanyTagGroup
    values: {
        name: Text
    }

    constructor(id: number, values: { name: Text }) {
        this.id = new CompanyTagGroup(id)
        this.values = values
    }

    equals(other: CompanyTagGroupVariable): boolean {
        if (!other) {
            return false;
        }
        return this.id.equals(other.id)
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): CompanyTagGroupRow {
        return new CompanyTagGroupRow(this.id.hashCode(), {
            name: this.values.name
        })
    }
}

export class CompanyTag {
    constructor(private id: number) { }

    equals(other: CompanyTag): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class CompanyTagVariable {
    [immerable] = true
    readonly typeName = 'CompanyTag'
    readonly id: CompanyTag
    values: {
        // UNQ(group, name)
        group: CompanyTagGroup
        name: Text
    }

    constructor(id: number, values: { group: CompanyTagGroup, name: Text }) {
        this.id = new CompanyTag(id)
        this.values = values
    }

    equals(other: CompanyTagVariable): boolean {
        if (!other) {
            return false;
        }
        return (this.values.group.equals(other.values.group) && this.values.name === other.values.name)
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): CompanyTagRow {
        return new CompanyTagRow(this.id.hashCode(), {
            group: this.values.group.hashCode(),
            name: this.values.name
        })
    }
}

export class MappingCompanyTag {
    constructor(private id: number) { }

    equals(other: MappingCompanyTag): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class MappingCompanyTagVariable {
    [immerable] = true
    readonly typeName = 'MappingCompanyTag'
    readonly id: MappingCompanyTag
    values: {
        company: Company
        tag: CompanyTag
    }

    constructor(id: number, values: { tag: CompanyTag, company: Company }) {
        this.id = new MappingCompanyTag(id)
        this.values = values
    }

    equals(other: MappingCompanyTagVariable): boolean {
        if (!other) {
            return false;
        }
        return (this.values.company.equals(other.values.company) && this.values.tag.equals(other.values.tag))
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): MappingCompanyTagRow {
        return new MappingCompanyTagRow(this.id.hashCode(), {
            company: this.values.company.hashCode(),
            tag: this.values.tag.hashCode()
        })
    }
}

export class Contact {
    constructor(private id: number) { }

    equals(other: Contact): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class ContactVariable {
    [immerable] = true
    readonly typeName = 'Contact'
    readonly id: Contact
    values: {
        name: Text
        email: Text
        telephone: Text
        mobile: Text
        website: Text
        // Note. Below should be required in an entity which extends Contact (employee/customer)
        // aadhaar: Text
        // pan: Text
    }

    constructor(id: number, values: { name: Text, email: Text, telephone: Text, mobile: Text, website: Text }) {
        this.id = new Contact(id)
        this.values = values
    }

    equals(other: ContactVariable): boolean {
        if (!other) {
            return false;
        }
        return this.id.equals(other.id)
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): ContactRow {
        return new ContactRow(this.id.hashCode(), {
            name: this.values.name,
            email: this.values.email,
            telephone: this.values.telephone,
            mobile: this.values.mobile,
            website: this.values.website
        })
    }
}

export class ContactAddress {
    constructor(private id: number) { }

    equals(other: ContactAddress): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class ContactAddressVariable {
    [immerable] = true
    readonly typeName = 'ContactAddress'
    readonly id: ContactAddress
    values: {
        // UNQ(contact, name)
        // UNQ(contact, address)
        contact: Contact
        name: Text
        address: Address
    }

    constructor(id: number, values: { contact: Contact, name: Text, address: Address }) {
        this.id = new ContactAddress(id)
        this.values = values
    }

    equals(other: ContactAddressVariable): boolean {
        if (!other) {
            return false;
        }
        return (this.values.contact.equals(other.values.contact) && this.values.name === other.values.name) && (this.values.contact.equals(other.values.contact) && this.values.address.equals(other.values.address))
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): ContactAddressRow {
        return new ContactAddressRow(this.id.hashCode(), {
            contact: this.values.contact.hashCode(),
            name: this.values.name,
            address: this.values.address.hashCode()
        })
    }
}

export class CompanyContact {
    constructor(private id: number) { }

    equals(other: CompanyContact): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class CompanyContactVariable {
    [immerable] = true
    readonly typeName = 'CompanyContact'
    readonly id: CompanyContact
    values: {
        // UNQ(company, contact)
        company: Company
        contact: Contact
        role: Text
        email: Text
        telephone: Text
        mobile: Text
    }

    constructor(id: number, values: { company: Company, contact: Contact, role: Text, email: Text, telephone: Text, mobile: Text }) {
        this.id = new CompanyContact(id)
        this.values = values
    }

    equals(other: CompanyContactVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.company.equals(other.values.company) && this.values.contact.equals(other.values.contact)
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): CompanyContactRow {
        return new CompanyContactRow(this.id.hashCode(), {
            company: this.values.company.hashCode(),
            contact: this.values.contact.hashCode(),
            role: this.values.role,
            email: this.values.email,
            telephone: this.values.telephone,
            mobile: this.values.mobile
        })
    }
}

export class Currency {
    constructor(private id: number) { }

    equals(other: Currency): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class CurrencyVariable {
    [immerable] = true
    readonly typeName = 'Currency'
    readonly id: Currency
    values: {
        name: Text
    }

    constructor(id: number, values: { name : Text }) {
        this.id = new Currency(id)
        this.values = values
    }

    equals(other: CurrencyVariable): boolean {
        if (!other) {
            return false;
        }
        return this.id.equals(other.id)
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): CurrencyRow {
        return new CurrencyRow(this.id.hashCode(), this.values)
    }
}

export class CurrencyRate {
    constructor(private id: number) { }

    equals(other: CurrencyRate): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class CurrencyRateVariable {
    [immerable] = true
    readonly typeName = 'CurrencyRate'
    readonly id: CurrencyRate
    values: {
        currency: Currency
        conversionRate: Decimal
        startTime: Timestamp
        endTime: Timestamp
    }

    constructor(id: number, values: { currency: Currency, conversionRate: Decimal, startTime: Timestamp, endTime: Timestamp }) {
        this.id = new CurrencyRate(id)
        this.values = values
    }

    equals(other: CurrencyRateVariable): boolean {
        if (!other) {
            return false;
        }
        return this.id.equals(other.id)
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): CurrencyRateRow {
        return new CurrencyRateRow(this.id.hashCode(), {
            currency: this.values.currency.hashCode(),
            conversionRate: this.values.conversionRate,
            startTime: this.values.startTime,
            endTime: this.values.endTime
        })
    }
}

export class Memo {
    constructor(private id: number) { }

    equals(other: Memo): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class MemoVariable {
    [immerable] = true
    readonly typeName = 'Memo'
    readonly id: Memo
    values: {
        company: Company
        currency: Currency
        amount: Decimal
        unsettled: Decimal
    }

    constructor(id: number, values: { company: Company, currency: Currency, amount: Decimal, unsettled: Timestamp }) {
        this.id = new Memo(id)
        this.values = values
    }

    equals(other: MemoVariable): boolean {
        if (!other) {
            return false;
        }
        return this.id.equals(other.id)
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): MemoRow {
        return new MemoRow(this.id.hashCode(), {
            company: this.values.company.hashCode(),
            currency: this.values.currency.hashCode(),
            amount: this.values.amount,
            unsettled: this.values.unsettled
        })
    }
}

export class Bank {
    constructor(private id: number) { }

    equals(other: Bank): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class BankVariable {
    [immerable] = true
    readonly typeName = 'Bank'
    readonly id: Bank
    values: {
        // UNQ(country, name)
        country: Country
        name: Text
        website: Text
    }

    constructor(id: number, values: { country: Country, name: Text, website: Text }) {
        this.id = new Bank(id)
        this.values = values
    }

    equals(other: BankVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.country.equals(other.values.country) && this.values.name === other.values.name
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): BankRow {
        return new BankRow(this.id.hashCode(), {
            country: this.values.country.hashCode(),
            name: this.values.name,
            website: this.values.website
        })
    }
}

export class BankBranch {
    constructor(private id: number) { }

    equals(other: BankBranch): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class BankBranchVariable {
    [immerable] = true
    readonly typeName = 'BankBranch'
    readonly id: BankBranch
    values: {
        // UNQ(bank, name)
        // UNQ(bank, ifsc)
        bank: Bank
        name: Text
        ifsc: Text
        address: Address
    }

    constructor(id: number, values: { bank: Bank, name: Text, ifsc: Text, address: Address }) {
        this.id = new BankBranch(id)
        this.values = values
    }

    equals(other: BankBranchVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.bank.equals(other.values.bank) && this.values.name === other.values.name
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): BankBranchRow {
        return new BankBranchRow(this.id.hashCode(), {
            bank: this.values.bank.hashCode(),
            name: this.values.name,
            ifsc: this.values.ifsc,
            address: this.values.address.hashCode()
        })
    }
}

export class BankAccount {
    constructor(private id: number) { }

    equals(other: BankAccount): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class BankAccountVariable {
    [immerable] = true
    readonly typeName = 'BankAccount'
    readonly id: BankAccount
    values: {
        // UNQ(bank, accountNumber)
        bank: Bank
        bankBranch: BankBranch
        accountNumber: Text
        accountName: Text
        currency: Currency
    }

    constructor(id: number, values: { bank: Bank, bankBranch: BankBranch, accountNumber: Text, accountName: Text, currency: Currency }) {
        this.id = new BankAccount(id)
        this.values = values
    }

    equals(other: BankAccountVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.bank.equals(other.values.bank) && this.values.accountNumber === other.values.accountNumber
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): BankAccountRow {
        return new BankAccountRow(this.id.hashCode(), {
            bank: this.values.bank.hashCode(),
            bankBranch: this.values.bankBranch.hashCode(),
            accountNumber: this.values.accountNumber,
            accountName: this.values.accountName,
            currency: this.values.currency.hashCode()
        })
    }
}

export class BankTransaction {
    constructor(private id: number) { }

    equals(other: BankTransaction): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class BankTransactionVariable {
    [immerable] = true
    readonly typeName = 'BankTransaction'
    readonly id: BankTransaction
    values: {
        timestamp: Timestamp
        memo: Memo
        currencyRate: CurrencyRate
        bankAccount: BankAccount
        fromToAccount: BankAccount
        credit: Decimal
        debit: Decimal
    }

    constructor(id: number, values: { timestamp: Timestamp, memo: Memo, currencyRate: CurrencyRate, bankAccount: BankAccount, fromToAccount: BankAccount, credit: Decimal, debit: Decimal }) {
        this.id = new BankTransaction(id)
        this.values = values
    }

    equals(other: BankTransactionVariable): boolean {
        if (!other) {
            return false;
        }
        return this.id.equals(other.id)
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): BankTransactionRow {
        return new BankTransactionRow(this.id.hashCode(), {
            timestamp: this.values.timestamp,
            memo: this.values.memo.hashCode(),
            currencyRate: this.values.currencyRate.hashCode(),
            bankAccount: this.values.bankAccount.hashCode(),
            fromToAccount: this.values.fromToAccount.hashCode(),
            credit: this.values.credit,
            debit: this.values.debit
        })
    }
}

export class CompanyBankAccount {
    constructor(private id: number) { }

    equals(other: CompanyBankAccount): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class CompanyBankAccountVariable {
    [immerable] = true
    readonly typeName = 'CompanyBankAccount'
    readonly id: CompanyBankAccount
    values: {
        // UNQ(company, bankAccount)
        company: Company
        bankAccount: BankAccount
    }

    constructor(id: number, values: { company: Company, bankAccount: BankAccount }) {
        this.id = new CompanyBankAccount(id)
        this.values = values
    }

    equals(other: CompanyBankAccountVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.company.equals(other.values.company) && this.values.bankAccount.equals(other.values.bankAccount)
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): CompanyBankAccountRow {
        return new CompanyBankAccountRow(this.id.hashCode(), {
            company: this.values.company.hashCode(),
            bankAccount: this.values.bankAccount.hashCode()
        })
    }
}

export class ProductCategoryGroup {
    constructor(private id: number) { }

    equals(other: ProductCategoryGroup): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class ProductCategoryGroupVariable {
    [immerable] = true
    readonly typeName = 'ProductCategoryGroup'
    readonly id: ProductCategoryGroup
    values: {
        // UNQ(parent)
        parent: ProductCategoryGroup
        name: Text
        length: Number
    }

    constructor(id: number, values: { parent: ProductCategoryGroup, name: Text, length: Number }) {
        this.id = new ProductCategoryGroup(id)
        this.values = values
    }

    equals(other: ProductCategoryGroupVariable): boolean {
        if (!other) {
            return false;
        }
        return this.id.equals(other.id) && this.values.parent.equals(other.values.parent)
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): ProductCategoryGroupRow {
        return new ProductCategoryGroupRow(this.id.hashCode(), {
            parent: this.values.parent.hashCode(),
            name: this.values.name,
            length: this.values.length
        })
    }
}

export class ProductCategory {
    constructor(private id: number) { }

    equals(other: ProductCategory): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class ProductCategoryVariable {
    [immerable] = true
    readonly typeName = 'ProductCategory'
    readonly id: ProductCategory
    values: {
        // UNQ(parent, name)
        // UNQ(parent, code)
        parent: ProductCategory
        group: ProductCategoryGroup
        name: Text
        code: Text
        derivedCode: Text
        childCount: Number
    }

    constructor(id: number, values: { parent: ProductCategory, group: ProductCategoryGroup, name: Text, code: Text, derivedCode: Text, childCount: Number }) {
        this.id = new ProductCategory(id)
        this.values = values
    }

    equals(other: ProductCategoryVariable): boolean {
        if (!other) {
            return false;
        }
        return (this.values.parent.equals(other.values.parent) && this.values.name === other.values.name) || (this.values.parent.equals(other.values.parent) && this.values.code === other.values.code)
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): ProductCategoryRow {
        return new ProductCategoryRow(this.id.hashCode(), {
            parent: this.values.parent.hashCode(),
            group: this.values.group.hashCode(),
            name: this.values.name,
            code: this.values.code,
            derivedCode: this.values.derivedCode,
            childCount: this.values.childCount
        })
    }
}

export class Product {
    constructor(private id: number) { }

    equals(other: Product): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class ProductVariable {
    [immerable] = true
    readonly typeName = 'Product'
    readonly id: Product
    values: {
        name: Text
        category: ProductCategory
        code: Text
        sku: Text
    }

    constructor(id: number, values: { name: Text, category: ProductCategory, code: Text, sku: Text }) {
        this.id = new Product(id)
        this.values = values
    }

    equals(other: ProductVariable): boolean {
        if (!other) {
            return false;
        }
        return this.id.equals(other.id)
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): ProductRow {
        return new ProductRow(this.id.hashCode(), {
            name: this.values.name,
            category: this.values.category.hashCode(),
            code: this.values.code,
            sku: this.values.sku
        })
    }
}

export class ProductTagGroup {
    constructor(private id: number) { }

    equals(other: ProductTagGroup): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class ProductTagGroupVariable {
    [immerable] = true
    readonly typeName = 'ProductTagGroup'
    readonly id: ProductTagGroup
    values: {
        name: Text
    }

    constructor(id: number, values: { name: Text }) {
        this.id = new ProductTagGroup(id)
        this.values = values
    }

    equals(other: ProductTagGroupVariable): boolean {
        if (!other) {
            return false;
        }
        return this.id.equals(other.id)
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): ProductTagGroupRow {
        return new ProductTagGroupRow(this.id.hashCode(), {
            name: this.values.name
        })
    }
}

export class ProductTag {
    constructor(private id: number) { }

    equals(other: ProductTag): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class ProductTagVariable {
    [immerable] = true
    readonly typeName = 'ProductTag'
    readonly id: ProductTag
    values: {
        // UNQ(group, name)
        group: ProductTagGroup
        name: Text
    }

    constructor(id: number, values: { group: ProductTagGroup, name: Text }) {
        this.id = new ProductTag(id)
        this.values = values
    }

    equals(other: ProductTagVariable): boolean {
        if (!other) {
            return false;
        }
        return (this.values.group.equals(other.values.group) && this.values.name === other.values.name)
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): ProductTagRow {
        return new ProductTagRow(this.id.hashCode(), {
            group: this.values.group.hashCode(),
            name: this.values.name
        })
    }
}

export class MappingProductTag {
    constructor(private id: number) { }

    equals(other: MappingProductTag): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class MappingProductTagVariable {
    [immerable] = true
    readonly typeName = 'MappingProductTag'
    readonly id: MappingProductTag
    values: {
        product: Product
        tag: ProductTag
    }

    constructor(id: number, values: { tag: ProductTag, product: Product }) {
        this.id = new MappingProductTag(id)
        this.values = values
    }

    equals(other: MappingProductTagVariable): boolean {
        if (!other) {
            return false;
        }
        return (this.values.product.equals(other.values.product) && this.values.tag.equals(other.values.tag))
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): MappingProductTagRow {
        return new MappingProductTagRow(this.id.hashCode(), {
            product: this.values.product.hashCode(),
            tag: this.values.tag.hashCode()
        })
    }
}

export class UOM {
    constructor(private id: number) { }

    equals(other: UOM): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class UOMVariable {
    [immerable] = true
    readonly typeName = 'UOM'
    readonly id: UOM
    values: {
        // UNQ(product, name)
        product: Product
        name: Text
        conversionRate: Decimal
    }

    constructor(id: number, values: { product: Product, name: Text, conversionRate: Decimal }) {
        this.id = new UOM(id)
        this.values = values
    }

    equals(other: UOMVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.product.equals(other.values.product) && this.values.name === other.values.name
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): UOMRow {
        return new UOMRow(this.id.hashCode(), {
            product: this.values.product.hashCode(),
            name: this.values.name,
            conversionRate: this.values.conversionRate
        })
    }
}

export class Indent {
    constructor(private id: number) { }

    equals(other: Indent): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class IndentVariable {
    [immerable] = true
    readonly typeName = 'Indent'
    readonly id: Indent
    values: {
        // timestamp: Timestamp // redundant field
        // subspace: Subspace
        // approver: Subspace
        // approved: Boolean
    }

    constructor(id: number, values: {}) {
        this.id = new Indent(id)
        this.values = values
    }

    equals(other: IndentVariable): boolean {
        if (!other) {
            return false;
        }
        return this.id.equals(other.id)
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): IndentRow {
        return new IndentRow(this.id.hashCode(), this.values)
    }
}

export class IndentItem {
    constructor(private id: number) { }

    equals(other: IndentItem): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class IndentItemVariable {
    [immerable] = true
    readonly typeName = 'IndentItem'
    readonly id: IndentItem
    values: {
        // UNQ(indent, product)
        indent: Indent
        product: Product
        quantity: Number
        // assertion(uom.product == product && product.orderable == true && quantity > 0)
        uom: UOM
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

    constructor(id: number, values: { indent: Indent, product: Product, quantity: Number, uom: UOM, ordered: Number, received: Number, approved: Number, rejected: Number, returned: Number, requisted: Number, consumed: Number }) {
        this.id = new IndentItem(id)
        this.values = values
    }

    equals(other: IndentItemVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.indent.equals(other.values.indent) && this.values.product.equals(other.values.product)
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): IndentItemRow {
        return new IndentItemRow(this.id.hashCode(), {
            indent: this.values.indent.hashCode(),
            product: this.values.product.hashCode(),
            quantity: this.values.quantity,
            uom: this.values.uom.hashCode(),
            ordered: this.values.ordered,
            received: this.values.received,
            approved: this.values.approved,
            rejected: this.values.rejected,
            returned: this.values.returned,
            requisted: this.values.requisted,
            consumed: this.values.consumed,
        })
    }
}

export class CompanyProduct {
    constructor(private id: number) { }

    equals(other: CompanyProduct): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class CompanyProductVariable {
    [immerable] = true
    readonly typeName = 'CompanyProduct'
    readonly id: CompanyProduct
    values: {
        // UNQ(company, product)
        company: Company
        product: Product
    }

    constructor(id: number, values: { company: Company, product: Product }) {
        this.id = new CompanyProduct(id)
        this.values = values
    }

    equals(other: CompanyProductVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.company.equals(other.values.company) && this.values.product.equals(other.values.product)
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): CompanyProductRow {
        return new CompanyProductRow(this.id.hashCode(), {
            company: this.values.company.hashCode(),
            product: this.values.product.hashCode()
        })
    }
}

export class Quotation {
    constructor(private id: number) { }

    equals(other: Quotation): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class QuotationVariable {
    [immerable] = true
    readonly typeName = 'Quotation'
    readonly id: Quotation
    values: {
        indent: Indent
        company: Company
    }

    constructor(id: number, values: { indent: Indent, company: Company }) {
        this.id = new Quotation(id)
        this.values = values
    }

    equals(other: QuotationVariable): boolean {
        if (!other) {
            return false;
        }
        return this.id.equals(other.id)
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): QuotationRow {
        return new QuotationRow(this.id.hashCode(), {
            indent: this.values.indent.hashCode(),
            company: this.values.company.hashCode()
        })
    }
}

export class QuotationItem {
    constructor(private id: number) { }

    equals(other: QuotationItem): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class QuotationItemVariable {
    [immerable] = true
    readonly typeName = 'QuotationItem'
    readonly id: QuotationItem
    values: {
        // UNQ(quotation, indentItem)
        quotation: Quotation
        // assertion(quotation.indent == indentItem.indent)
        indentItem: IndentItem
        // assertion(quantity <= (indentItem.quantity - (ordered - rejected)) && quantity > 0)
        quantity: Number
    }

    constructor(id: number, values: { quotation: Quotation, indentItem: IndentItem, quantity: Number }) {
        this.id = new QuotationItem(id)
        this.values = values
    }

    equals(other: QuotationItemVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.quotation.equals(other.values.quotation) && this.values.indentItem.equals(other.values.indentItem)
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): QuotationItemRow {
        return new QuotationItemRow(this.id.hashCode(), {
            quotation: this.values.quotation.hashCode(),
            indentItem: this.values.indentItem.hashCode(),
            quantity: this.values.quantity
        })
    }
}

export class PurchaseOrder {
    constructor(private id: number) { }

    equals(other: PurchaseOrder): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class PurchaseOrderVariable {
    [immerable] = true
    readonly typeName = 'PurchaseOrder'
    readonly id: PurchaseOrder
    values: {
        quotation: Quotation
    }

    constructor(id: number, values: { quotation: Quotation }) {
        this.id = new PurchaseOrder(id)
        this.values = values
    }

    equals(other: PurchaseOrderVariable): boolean {
        if (!other) {
            return false;
        }
        return this.id.equals(other.id)
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): PurchaseOrderRow {
        return new PurchaseOrderRow(this.id.hashCode(), {
            quotation: this.values.quotation.hashCode()
        })
    }
}

export class PurchaseOrderItem {
    constructor(private id: number) { }

    equals(other: PurchaseOrderItem): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class PurchaseOrderItemVariable {
    [immerable] = true
    readonly typeName = 'PurchaseOrderItem'
    readonly id: PurchaseOrderItem
    values: {
        // UNQ(purchaseOrder, quotationItem)
        purchaseOrder: PurchaseOrder
        // assertion(purchaseOrder.quotation == quotationItem.quotation)
        quotationItem: QuotationItem
        // assertion(quantity <= quotationItem.quantity && quantity > 0)
        quantity: Number // { quotationItem.indentItem.ordered += quantity }
        price: Decimal
        // assertion(received >= 0 && received <= quantity)
        received: Number
    }

    constructor(id: number, values: { purchaseOrder: PurchaseOrder, quotationItem: QuotationItem, quantity: Number, price: Decimal, received: Number }) {
        this.id = new PurchaseOrderItem(id)
        this.values = values
    }

    equals(other: PurchaseOrderItemVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.purchaseOrder.equals(other.values.purchaseOrder) && this.values.quotationItem.equals(other.values.quotationItem)
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): PurchaseOrderItemRow {
        return new PurchaseOrderItemRow(this.id.hashCode(), {
            purchaseOrder: this.values.purchaseOrder.hashCode(),
            quotationItem: this.values.quotationItem.hashCode(),
            quantity: this.values.quantity,
            price: this.values.price,
            received: this.values.received
        })
    }
}

export class PurchaseInvoice {
    constructor(private id: number) { }

    equals(other: PurchaseInvoice): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class PurchaseInvoiceVariable {
    [immerable] = true
    readonly typeName = 'PurchaseInvoice'
    readonly id: PurchaseInvoice
    values: {
        purchaseOrder: PurchaseOrder
    }

    constructor(id: number, values: { purchaseOrder: PurchaseOrder }) {
        this.id = new PurchaseInvoice(id)
        this.values = values
    }

    equals(other: PurchaseInvoiceVariable): boolean {
        if (!other) {
            return false;
        }
        return this.id.equals(other.id)
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): PurchaseInvoiceRow {
        return new PurchaseInvoiceRow(this.id.hashCode(), {
            purchaseOrder: this.values.purchaseOrder.hashCode()
        })
    }
}

export class PurchaseInvoiceItem {
    constructor(private id: number) { }

    equals(other: PurchaseInvoiceItem): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class PurchaseInvoiceItemVariable {
    [immerable] = true
    readonly typeName = 'PurchaseInvoiceItem'
    readonly id: PurchaseInvoiceItem
    values: {
        // UNQ(purchaseInvoice, purchaseOrderItem)
        purchaseInvoice: PurchaseInvoice
        // assertion(purchaseInvoice.purchaseOrder == purchaseOrderItem.purchaseOrder)
        purchaseOrderItem: PurchaseOrderItem
        // assertion(quantity <= purchaseOrderItem.quantity && quantity > 0)
        quantity: Number // { purchaseOrderItem.received += quantity && purchaseOrderItem.quotationOrderItem.indentOrderItem.received += quantity }
        // assertion((approved + rejected) <= quantity && approved >= 0 && rejeted >= 0)
        approved: Number
        rejected: Number
    }

    constructor(id: number, values: { purchaseInvoice: PurchaseInvoice, purchaseOrderItem: PurchaseOrderItem, quantity: Number, approved: Number, rejected: Number }) {
        this.id = new PurchaseInvoiceItem(id)
        this.values = values
    }

    equals(other: PurchaseInvoiceItemVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.purchaseInvoice.equals(other.values.purchaseInvoice) && this.values.purchaseOrderItem.equals(other.values.purchaseOrderItem)
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): PurchaseInvoiceItemRow {
        return new PurchaseInvoiceItemRow(this.id.hashCode(), {
            purchaseInvoice: this.values.purchaseInvoice.hashCode(),
            purchaseOrderItem: this.values.purchaseOrderItem.hashCode(),
            quantity: this.values.quantity,
            approved: this.values.approved,
            rejected: this.values.approved
        })
    }
}

export class MaterialApprovalSlip {
    constructor(private id: number) { }

    equals(other: MaterialApprovalSlip): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class MaterialApprovalSlipVariable {
    [immerable] = true
    readonly typeName = 'MaterialApprovalSlip'
    readonly id: MaterialApprovalSlip
    values: {
        purchaseInvoice: PurchaseInvoice
    }

    constructor(id: number, values: { purchaseInvoice: PurchaseInvoice }) {
        this.id = new MaterialApprovalSlip(id)
        this.values = values
    }

    equals(other: MaterialApprovalSlipVariable): boolean {
        if (!other) {
            return false;
        }
        return this.id.equals(other.id)
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): MaterialApprovalSlipRow {
        return new MaterialApprovalSlipRow(this.id.hashCode(), {
            purchaseInvoice: this.values.purchaseInvoice.hashCode()
        })
    }
}

export class MaterialApprovalSlipItem {
    constructor(private id: number) { }

    equals(other: MaterialApprovalSlipItem): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class MaterialApprovalSlipItemVariable {
    [immerable] = true
    readonly typeName = 'MaterialApprovalSlipItem'
    readonly id: MaterialApprovalSlipItem
    values: {
        // UNQ(materialApprovalSlip, purchaseInvoiceItem)
        materialApprovalSlip: MaterialApprovalSlip
        // assertion(materialApprovalSlip.purchaseInvoice == purchaseInvoiceItem.purchaseInvoice)
        purchaseInvoiceItem: PurchaseInvoiceItem
        // assertion(quantity <= purchaseInvoiceItem.quantity && quantity > 0)
        quantity: Number // { purchaseInvoiceItem.approved += quantity && purchaseInvoiceItem.purchaseOrderItem.quotationItem.indentItem.approved += quantity }
        // assertion(requisted <= quantity && requisted >= 0)
        requisted: Number
    }

    constructor(id: number, values: { materialApprovalSlip: MaterialApprovalSlip, purchaseInvoiceItem: PurchaseInvoiceItem, quantity: Number, requisted: Number }) {
        this.id = new MaterialApprovalSlipItem(id)
        this.values = values
    }

    equals(other: MaterialApprovalSlipItemVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.materialApprovalSlip.equals(other.values.materialApprovalSlip) && this.values.purchaseInvoiceItem.equals(other.values.purchaseInvoiceItem)
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): MaterialApprovalSlipItemRow {
        return new MaterialApprovalSlipItemRow(this.id.hashCode(), {
            materialApprovalSlip: this.values.materialApprovalSlip.hashCode(),
            purchaseInvoiceItem: this.values.purchaseInvoiceItem.hashCode(),
            quantity: this.values.quantity,
            requisted: this.values.requisted
        })
    }
}

export class MaterialRejectionSlip {
    constructor(private id: number) { }

    equals(other: MaterialRejectionSlip): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class MaterialRejectionSlipVariable {
    [immerable] = true
    readonly typeName = 'MaterialRejectionSlip'
    readonly id: MaterialRejectionSlip
    values: {
        purchaseInvoice: PurchaseInvoice
    }

    constructor(id: number, values: { purchaseInvoice: PurchaseInvoice }) {
        this.id = new MaterialRejectionSlip(id)
        this.values = values
    }

    equals(other: MaterialRejectionSlipVariable): boolean {
        if (!other) {
            return false;
        }
        return this.id.equals(other.id)
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): MaterialRejectionSlipRow {
        return new MaterialRejectionSlipRow(this.id.hashCode(), {
            purchaseInvoice: this.values.purchaseInvoice.hashCode()
        })
    }
}

export class MaterialRejectionSlipItem {
    constructor(private id: number) { }

    equals(other: MaterialRejectionSlipItem): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class MaterialRejectionSlipItemVariable {
    [immerable] = true
    readonly typeName = 'MaterialRejectionSlipItem'
    readonly id: MaterialRejectionSlipItem
    values: {
        // UNQ(materialRejectionSlip, purchaseInvoiceItem)
        materialRejectionSlip: MaterialRejectionSlip
        // assertion(materialRejectionSlip.purchaseInvoice == purchaseInvoiceItem.purchaseInvoice)
        purchaseInvoiceItem: PurchaseInvoiceItem
        // assertion(quantity <= purchaseInvoiceItem.quantity && quantity > 0)
        quantity: Number // { purchaseInvoiceItem.rejected += quantity && purchaseInvoiceItem.purchaseOrderItem.quotationItem.indentItem.rejected += quantity  }
        // assertion(returned <= quantity && returned >= 0)
        returned: Number
    }

    constructor(id: number, values: { materialRejectionSlip: MaterialRejectionSlip, purchaseInvoiceItem: PurchaseInvoiceItem, quantity: Number, returned: Number }) {
        this.id = new MaterialRejectionSlipItem(id)
        this.values = values
    }

    equals(other: MaterialRejectionSlipItemVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.materialRejectionSlip.equals(other.values.materialRejectionSlip) && this.values.purchaseInvoiceItem.equals(other.values.purchaseInvoiceItem)
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): MaterialRejectionSlipItemRow {
        return new MaterialRejectionSlipItemRow(this.id.hashCode(), {
            materialRejectionSlip: this.values.materialRejectionSlip.hashCode(),
            purchaseInvoiceItem: this.values.purchaseInvoiceItem.hashCode(),
            quantity: this.values.quantity,
            returned: this.values.returned
        })
    }
}

export class MaterialReturnSlip {
    constructor(private id: number) { }

    equals(other: MaterialReturnSlip): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class MaterialReturnSlipVariable {
    [immerable] = true
    readonly typeName = 'MaterialReturnSlip'
    readonly id: MaterialReturnSlip
    values: {
        materialRejectionSlip: MaterialRejectionSlip
    }

    constructor(id: number, values: { materialRejectionSlip: MaterialRejectionSlip }) {
        this.id = new MaterialReturnSlip(id)
        this.values = values
    }

    equals(other: MaterialReturnSlipVariable): boolean {
        if (!other) {
            return false;
        }
        return this.id.equals(other.id)
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): MaterialReturnSlipRow {
        return new MaterialReturnSlipRow(this.id.hashCode(), {
            materialRejectionSlip: this.values.materialRejectionSlip.hashCode()
        })
    }
}

export class MaterialReturnSlipItem {
    constructor(private id: number) { }

    equals(other: MaterialReturnSlipItem): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class MaterialReturnSlipItemVariable {
    [immerable] = true
    readonly typeName = 'MaterialReturnSlipItem'
    readonly id: MaterialReturnSlipItem
    values: {
        // UNQ(materialReturnSlip, materialRejectionSlipItem)
        materialReturnSlip: MaterialReturnSlip
        // assertion(materialReturnSlip.materialRejectionSlip == materialRejectionSlipItem.materialRejectionSlip)
        materialRejectionSlipItem: MaterialRejectionSlipItem
        // assertion(quantity <= materialRejectionSlipItem.quantity && quantity > 0)
        quantity: Number // { materialRejectionSlipItem.returned += quantity && materialRejectionSlipItem.purchaseInvoiceItem.purchaseOrderItem.quotationItem.indentItem.returned += quantity }
    }

    constructor(id: number, values: { materialReturnSlip: MaterialReturnSlip, materialRejectionSlipItem: MaterialRejectionSlipItem, quantity: Number }) {
        this.id = new MaterialReturnSlipItem(id)
        this.values = values
    }

    equals(other: MaterialReturnSlipItemVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.materialReturnSlip.equals(other.values.materialReturnSlip) && this.values.materialRejectionSlipItem.equals(other.values.materialRejectionSlipItem)
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): MaterialReturnSlipItemRow {
        return new MaterialReturnSlipItemRow(this.id.hashCode(), {
            materialReturnSlip: this.values.materialReturnSlip.hashCode(),
            materialRejectionSlipItem: this.values.materialRejectionSlipItem.hashCode(),
            quantity: this.values.quantity
        })
    }
}

export class MaterialRequistionSlip {
    constructor(private id: number) { }

    equals(other: MaterialRequistionSlip): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class MaterialRequistionSlipVariable {
    [immerable] = true
    readonly typeName = 'MaterialRequistionSlip'
    readonly id: MaterialRequistionSlip
    values: {
        materialApprovalSlip: MaterialApprovalSlip
    }

    constructor(id: number, values: { materialApprovalSlip: MaterialApprovalSlip }) {
        this.id = new MaterialRequistionSlip(id)
        this.values = values
    }

    equals(other: MaterialRequistionSlipVariable): boolean {
        if (!other) {
            return false;
        }
        return this.id.equals(other.id)
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): MaterialRequistionSlipRow {
        return new MaterialRequistionSlipRow(this.id.hashCode(), {
            materialApprovalSlip: this.values.materialApprovalSlip.hashCode()
        })
    }
}

export class MaterialRequistionSlipItem {
    constructor(private id: number) { }

    equals(other: MaterialRequistionSlipItem): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class MaterialRequistionSlipItemVariable {
    [immerable] = true
    readonly typeName = 'MaterialRequistionSlipItem'
    readonly id: MaterialRequistionSlipItem
    values: {
        // UNQ(materialRequistionSlip, materialApprovalSlipItem)
        materialRequistionSlip: MaterialRequistionSlip
        // assertion(materialRequistionSlip.materialApprovalSlip == materialApprovalSlipItem.materialApprovalSlip)
        materialApprovalSlipItem: MaterialApprovalSlipItem
        // assertion(quantity <= materialApprovalSlipItem.quantity && quantity > 0)
        quantity: Number // { materialApprovalSlipItem.requisted += quantity && materialApprovalSlipItem.purchaseInvoiceItem.purchaseOrderItem.quotationItem.indentItem.requisted += quantity }
        // assertion(consumed <= quantity && consumed >= 0)
        consumed: Number
    }

    constructor(id: number, values: { materialRequistionSlip: MaterialRequistionSlip, materialApprovalSlipItem: MaterialApprovalSlipItem, quantity: Number, consumed: Number }) {
        this.id = new MaterialRequistionSlipItem(id)
        this.values = values
    }

    equals(other: MaterialRequistionSlipItemVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.materialRequistionSlip.equals(other.values.materialRequistionSlip) && this.values.materialApprovalSlipItem.equals(other.values.materialApprovalSlipItem)
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): MaterialRequistionSlipItemRow {
        return new MaterialRequistionSlipItemRow(this.id.hashCode(), {
            materialRequistionSlip: this.values.materialRequistionSlip.hashCode(),
            materialApprovalSlipItem: this.values.materialApprovalSlipItem.hashCode(),
            quantity: this.values.quantity,
            consumed: this.values.consumed
        })
    }
}

export class BOM {
    constructor(private id: number) { }

    equals(other: BOM): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class BOMVariable {
    [immerable] = true
    readonly typeName = 'BOM'
    readonly id: BOM
    values: {
        name: Text
    }

    constructor(id: number, values: { name: Text }) {
        this.id = new BOM(id)
        this.values = values
    }

    equals(other: BOMVariable): boolean {
        if (!other) {
            return false;
        }
        return this.id.equals(other.id)
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): BOMRow {
        return new BOMRow(this.id.hashCode(), this.values)
    }
}

export class BOMItem {
    constructor(private id: number) { }

    equals(other: BOMItem): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class BOMItemVariable {
    [immerable] = true
    readonly typeName = 'BOMItem'
    readonly id: BOMItem
    values: {
        // UNQ(bom, product)
        bom: BOM
        // assertion(product.consumable == true)
        product: Product
        // assertion(quantity > 0 && uom.product == product)
        quantity: Number
        uom: UOM
    }

    constructor(id: number, values: { bom: BOM, product: Product, quantity: Number, uom: UOM }) {
        this.id = new BOMItem(id)
        this.values = values
    }

    equals(other: BOMItemVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.bom.equals(other.values.bom) && this.values.product.equals(other.values.product)
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): BOMItemRow {
        return new BOMItemRow(this.id.hashCode(), {
            bom: this.values.bom.hashCode(),
            product: this.values.product.hashCode(),
            quantity: this.values.quantity,
            uom: this.values.uom.hashCode()
        })
    }
}

export class ProductionPreparationSlip {
    constructor(private id: number) { }

    equals(other: ProductionPreparationSlip): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class ProductionPreparationSlipVariable {
    [immerable] = true
    readonly typeName = 'ProductionPreparationSlip'
    readonly id: ProductionPreparationSlip
    values: {
        bom: BOM
        // assertion((approved + scrapped) <= quantity && approved >= 0 && scrapped >= 0)
        approved: Number
        scrapped: Number
    }

    constructor(id: number, values: { bom: BOM, approved: Number, scrapped: Number }) {
        this.id = new ProductionPreparationSlip(id)
        this.values = values
    }

    equals(other: ProductionPreparationSlipVariable): boolean {
        if (!other) {
            return false;
        }
        return this.id.equals(other.id)
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): ProductionPreparationSlipRow {
        return new ProductionPreparationSlipRow(this.id.hashCode(), {
            bom: this.values.bom.hashCode(),
            approved: this.values.approved,
            scrapped: this.values.scrapped
        })
    }
}

export class ProductionPreparationSlipItem {
    constructor(private id: number) { }

    equals(other: ProductionPreparationSlipItem): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class ProductionPreparationSlipItemVariable {
    [immerable] = true
    readonly typeName = 'ProductionPreparationSlipItem'
    readonly id: ProductionPreparationSlipItem
    values: {
        // UNQ(productionPreparationSlip, bomItem)
        productionPreparationSlip: ProductionPreparationSlip
        bomItem: string
        // assertion(bomItem.product == materialRequistionSlipItem.materialApprovalSlipItem.purchaseInvoiceItem.purchaseOrderItem.quotationItem.indentItem.product)
        materialRequistionSlipItem: MaterialRequistionSlipItem
        // { materialRequistionSlipItem.consumed += bomItem.quantity * materialRequistionSlipItem.materialApprovalSlipItem.purchaseInvoiceItem.purchaseOrderItem.quotationItem.indentItem.uom.conversionRate / bomItem.product.uom.conversionRate }
        // { materialRequistionSlipItem.materialApprovalSlipItem.purchaseInvoiceItem.purchaseOrderItem.quotationItem.indentItem.consumed += bomItem.quantity * materialRequistionSlipItem.materialApprovalSlipItem.purchaseInvoiceItem.purchaseOrderItem.quotationItem.indentItem.uom.conversionRate / bomItem.product.uom.conversionRate }
    }

    constructor(id: number, values: { productionPreparationSlip: ProductionPreparationSlip, bomItem: string, materialRequistionSlipItem: MaterialRequistionSlipItem }) {
        this.id = new ProductionPreparationSlipItem(id)
        this.values = values
    }

    equals(other: ProductionPreparationSlipItemVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.productionPreparationSlip.equals(other.values.productionPreparationSlip) && this.values.bomItem === other.values.bomItem
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): ProductionPreparationSlipItemRow {
        return new ProductionPreparationSlipItemRow(this.id.hashCode(), {
            productionPreparationSlip: this.values.productionPreparationSlip.hashCode(),
            bomItem: this.values.bomItem,
            materialRequistionSlipItem: this.values.materialRequistionSlipItem.hashCode()
        })
    }
}

export class ScrapMaterialSlip {
    constructor(private id: number) { }

    equals(other: ScrapMaterialSlip): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class ScrapMaterialSlipVariable {
    [immerable] = true
    readonly typeName = 'ScrapMaterialSlip'
    readonly id: ScrapMaterialSlip
    values: {
        productionPreparationSlip: ProductionPreparationSlip
        // assertion(quantity <= productionPreparationSlip.bom.quantity && quantity > 0)
        quantity: Number // { productionPreparationSlip.scrapped += quantity }
    }

    constructor(id: number, values: { productionPreparationSlip: ProductionPreparationSlip, quantity: Number }) {
        this.id = new ScrapMaterialSlip(id)
        this.values = values
    }

    equals(other: ScrapMaterialSlipVariable): boolean {
        if (!other) {
            return false;
        }
        return this.id.equals(other.id)
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): ScrapMaterialSlipRow {
        return new ScrapMaterialSlipRow(this.id.hashCode(), {
            productionPreparationSlip: this.values.productionPreparationSlip.hashCode(),
            quantity: this.values.quantity
        })
    }
}

export class TransferMaterialSlip {
    constructor(private id: number) { }

    equals(other: TransferMaterialSlip): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class TransferMaterialSlipVariable {
    [immerable] = true
    readonly typeName = 'TransferMaterialSlip'
    readonly id: TransferMaterialSlip
    values: {
        productionPreparationSlip: ProductionPreparationSlip
        // assertion(quantity <= productionPreparationSlip.bom.quantity && quantity > 0)
        quantity: Number // { productionPreparationSlip.approved += quantity }
        // assertion(transfered <= quantity && transfered >= 0)
        transferred: Number
    }

    constructor(id: number, values: { productionPreparationSlip: ProductionPreparationSlip, quantity: Number, transferred: Number }) {
        this.id = new TransferMaterialSlip(id)
        this.values = values
    }

    equals(other: TransferMaterialSlipVariable): boolean {
        if (!other) {
            return false;
        }
        return this.id.equals(other.id)
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): TransferMaterialSlipRow {
        return new TransferMaterialSlipRow(this.id.hashCode(), {
            productionPreparationSlip: this.values.productionPreparationSlip.hashCode(),
            quantity: this.values.quantity,
            transferred: this.values.transferred
        })
    }
}

export class WarehouseAcceptanceSlip {
    constructor(private id: number) { }

    equals(other: WarehouseAcceptanceSlip): boolean {
        if (!other) {
            return false;
        }
        return this.id === other.id
    }

    hashCode(): number {
        return this.id
    }

    toString(): string {
        return String(this.id)
    }
}

export class WarehouseAcceptanceSlipVariable {
    [immerable] = true
    readonly typeName = 'WarehouseAcceptanceSlip'
    readonly id: WarehouseAcceptanceSlip
    values: {
        transferMaterialSlip: TransferMaterialSlip
        // assertion(quantity <= transferMaterialSlip.quantity && quantity > 0)
        quantity: Number // { transferMaterialSlip.transfered += quantity }
    }

    constructor(id: number, values: { transferMaterialSlip: TransferMaterialSlip, quantity: Number }) {
        this.id = new WarehouseAcceptanceSlip(id)
        this.values = values
    }

    equals(other: WarehouseAcceptanceSlipVariable): boolean {
        if (!other) {
            return false;
        }
        return this.id.equals(other.id)
    }

    hashCode(): number {
        return this.id.hashCode()
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): WarehouseAcceptanceSlipRow {
        return new WarehouseAcceptanceSlipRow(this.id.hashCode(), {
            transferMaterialSlip: this.values.transferMaterialSlip.hashCode(),
            quantity: this.values.quantity
        })
    }
}

export function replaceVariable(typeName: NonPrimitiveType, id: number, values: object) {
    switch (typeName) {
        case 'Region': {
            return new RegionVariable(id, {
                name: String(values['name'])
            })
        }
        case 'Country': {
            return new CountryVariable(id, {
                region: new Region(values['region']),
                name: String(values['name'])
            })
        }
        case 'State': {
            return new StateVariable(id, {
                country: new Country(values['country']),
                name: String(values['name'])
            })
        }
        case 'District': {
            return new DistrictVariable(id, {
                state: new State(values['state']),
                name: String(values['name'])
            })
        }
        case 'Subdistrict': {
            return new SubdistrictVariable(id, {
                district: new District(values['district']),
                name: String(values['name'])
            })
        }
        case 'PostalCode': {
            return new PostalCodeVariable(id, {
                subdistrict: new Subdistrict(values['subdistrict']),
                name: String(values['name'])
            })
        }
        case 'Address': {
            return new AddressVariable(id, {
                postalCode: new PostalCode(values['postalCode']),
                line1: String(values['line1']),
                line2: String(values['line2']),
                latitude: parseFloat(String(values['latitude'])),
                longitude: parseFloat(String(values['longitude']))
            })
        }
        case 'Company': {
            return new CompanyVariable(id, {
                name: String(values['name']),
                email: String(values['email']),
                telephone: String(values['telephone']),
                mobile: String(values['mobile']),
                website: String(values['website']),
                gstin: String(values['gstin']),
                pan: String(values['pan']),
                iec: String(values['iec'])
            })
        }
        case 'CompanyAddress': {
            return new CompanyAddressVariable(id, {
                company: new Company(values['company']),
                name: String(values['name']),
                address: new Address(values['address'])
            })
        }
        case 'CompanyTagGroup': {
            return new CompanyTagGroupVariable(id, {
                name: String(values['name'])
            })
        }
        case 'CompanyTag': {
            return new CompanyTagVariable(id, {
                group: new CompanyTagGroup(values['group']),
                name: String(values['name'])
            })
        }
        case 'MappingCompanyTag': {
            return new MappingCompanyTagVariable(id, {
                company: new Company(values['company']),
                tag: new CompanyTag(values['tag'])
            })
        }
        case 'Contact': {
            return new ContactVariable(id, {
                name: String(values['name']),
                email: String(values['email']),
                telephone: String(values['telephone']),
                mobile: String(values['mobile']),
                website: String(values['website'])
            })
        }
        case 'ContactAddress': {
            return new ContactAddressVariable(id, {
                contact: new Contact(values['contact']),
                name: String(values['name']),
                address: new Address(values['address'])
            })
        }
        case 'CompanyContact': {
            return new CompanyContactVariable(id, {
                company: new Company(values['company']),
                contact: new Contact(values['contact']),
                role: String(values['role']),
                email: String(values['email']),
                telephone: String(values['telephone']),
                mobile: String(values['mobile'])
            })
        }
        case 'Currency': {
            return new CurrencyVariable(id, {
                name: String(values['name'])
            })
        }
        case 'CurrencyRate': {
            return new CurrencyRateVariable(id, {
                currency: new Currency(values['currency']),
                conversionRate: parseFloat(String(values['conversionRate'])),
                startTime: parseInt(String(values['startTime'])),
                endTime: parseInt(String(values['endTime']))
            })
        }
        case 'Memo': {
            return new MemoVariable(id, {
                company: new Company(values['company']),
                currency: new Currency(values['currency']),
                amount: parseFloat(String(values['amount'])),
                unsettled: parseFloat(String(values['unsettled']))
            })
        }
        case 'Bank': {
            return new BankVariable(id, {
                country: new Country(values['country']),
                name: String(values['name']),
                website: String(values['website'])
            })
        }
        case 'BankBranch': {
            return new BankBranchVariable(id, {
                bank: new Bank(values['bank']),
                name: String(values['name']),
                ifsc: String(values['ifsc']),
                address: new Address(values['address'])
            })
        }
        case 'BankAccount': {
            return new BankAccountVariable(id, {
                bank: new Bank(values['bank']),
                bankBranch: new BankBranch(values['bankBranch']),
                accountNumber: String(values['accountNumber']),
                accountName: String(values['accountName']),
                currency: new Currency(values['currency'])
            })
        }
        case 'BankTransaction': {
            return new BankTransactionVariable(id, {
                timestamp: parseInt(String(values['timestamp'])),
                memo: new Memo(values['memo']),
                currencyRate: new CurrencyRate(values['currencyRate']),
                bankAccount: new BankAccount(values['bankAccount']),
                fromToAccount: new BankAccount(values['fromToAccount']),
                credit: parseFloat(String(values['credit'])),
                debit: parseFloat(String(values['debit']))
            })
        }
        case 'CompanyBankAccount': {
            return new CompanyBankAccountVariable(id, {
                company: new Company(values['company']),
                bankAccount: new BankAccount(values['bankAccount'])
            })
        }
        case 'ProductCategoryGroup': {
            return new ProductCategoryGroupVariable(id, {
                parent: new ProductCategoryGroup(values['parent']),
                name: String(values['name']),
                length: parseInt(String(values['length']))
            })
        }
        case 'ProductCategory': {
            return new ProductCategoryVariable(id, {
                parent: new ProductCategory(values['parent']),
                group: new ProductCategoryGroup(values['group']),
                name: String(values['name']),
                code: String(values['code']),
                derivedCode: String(values['derivedCode']),
                childCount: parseInt(String(values['childCount']))
            })
        }
        case 'Product': {
            return new ProductVariable(id, {
                name: String(values['name']),
                category: new ProductCategory(values['category']),
                code: String(values['code']),
                sku: String(values['sku'])
            })
        }
        case 'ProductTagGroup': {
            return new ProductTagGroupVariable(id, {
                name: String(values['name'])
            })
        }
        case 'ProductTag': {
            return new ProductTagVariable(id, {
                group: new ProductTagGroup(values['group']),
                name: String(values['name'])
            })
        }
        case 'MappingProductTag': {
            return new MappingProductTagVariable(id, {
                product: new Product(values['product']),
                tag: new ProductTag(values['tag'])
            })
        }
        case 'UOM': {
            return new UOMVariable(id, {
                product: new Product(values['product']),
                name: String(values['name']),
                conversionRate: parseFloat(String(values['conversionRate']))
            })
        }
        case 'Indent': {
            return new IndentVariable(id, {})
        }
        case 'IndentItem': {
            return new IndentItemVariable(id, {
                indent: new Indent(values['indent']),
                product: new Product(values['product']),
                quantity: parseInt(String(values['quantity'])),
                uom: new UOM(values['uom']),
                ordered: parseInt(String(values['ordered'])),
                received: parseInt(String(values['received'])),
                approved: parseInt(String(values['approved'])),
                rejected: parseInt(String(values['rejected'])),
                returned: parseInt(String(values['returned'])),
                requisted: parseInt(String(values['requisted'])),
                consumed: parseInt(String(values['consumed']))
            })
        }
        case 'CompanyProduct': {
            return new CompanyProductVariable(id, {
                company: new Company(values['company']),
                product: new Product(values['product'])
            })
        }
        case 'Quotation': {
            return new QuotationVariable(id, {
                indent: new Indent(values['indent']),
                company: new Company(values['company'])
            })
        }
        case 'QuotationItem': {
            return new QuotationItemVariable(id, {
                quotation: new Quotation(values['quotation']),
                indentItem: new IndentItem(values['indentItem']),
                quantity: parseInt(String(values['quantity']))
            })
        }
        case 'PurchaseOrder': {
            return new PurchaseOrderVariable(id, {
                quotation: new Quotation(values['quotation'])
            })
        }
        case 'PurchaseOrderItem': {
            return new PurchaseOrderItemVariable(id, {
                purchaseOrder: new PurchaseOrder(values['purchaseOrder']),
                quotationItem: new QuotationItem(values['quotationItem']),
                quantity: parseInt(String(values['quantity'])),
                price: parseFloat(String(values['price'])),
                received: parseInt(String(values['received']))
            })
        }
        case 'PurchaseInvoice': {
            return new PurchaseInvoiceVariable(id, {
                purchaseOrder: new PurchaseOrder(values['purchaseOrder'])
            })
        }
        case 'PurchaseInvoiceItem': {
            return new PurchaseInvoiceItemVariable(id, {
                purchaseInvoice: new PurchaseInvoice(values['purchaseInvoice']),
                purchaseOrderItem: new PurchaseOrderItem(values['purchaseOrderItem']),
                quantity: parseInt(String(values['quantity'])),
                approved: parseInt(String(values['approved'])),
                rejected: parseInt(String(values['rejected']))
            })
        }
        case 'MaterialApprovalSlip': {
            return new MaterialApprovalSlipVariable(id, {
                purchaseInvoice: new PurchaseInvoice(values['purchaseInvoice'])
            })
        }
        case 'MaterialApprovalSlipItem': {
            return new MaterialApprovalSlipItemVariable(id, {
                materialApprovalSlip: new MaterialApprovalSlip(values['materialApprovalSlip']),
                purchaseInvoiceItem: new PurchaseInvoiceItem(values['purchaseInvoiceItem']),
                quantity: parseInt(String(values['quantity'])),
                requisted: parseInt(String(values['requisted']))
            })
        }
        case 'MaterialRejectionSlip': {
            return new MaterialRejectionSlipVariable(id, {
                purchaseInvoice: new PurchaseInvoice(values['purchaseInvoice'])
            })
        }
        case 'MaterialRejectionSlipItem': {
            return new MaterialRejectionSlipItemVariable(id, {
                materialRejectionSlip: new MaterialRejectionSlip(values['materialRejectionSlip']),
                purchaseInvoiceItem: new PurchaseInvoiceItem(values['purchaseInvoiceItem']),
                quantity: parseInt(String(values['quantity'])),
                returned: parseInt(String(values['returned']))
            })
        }
        case 'MaterialReturnSlip': {
            return new MaterialReturnSlipVariable(id, {
                materialRejectionSlip: new MaterialRejectionSlip(values['materialRejectionSlip'])
            })
        }
        case 'MaterialReturnSlipItem': {
            return new MaterialReturnSlipItemVariable(id, {
                materialReturnSlip: new MaterialReturnSlip(values['materialReturnSlip']),
                materialRejectionSlipItem: new MaterialRejectionSlipItem(values['materialRejectionSlipItem']),
                quantity: parseInt(String(values['quantity']))
            })
        }
        case 'MaterialRequistionSlip': {
            return new MaterialRequistionSlipVariable(id, {
                materialApprovalSlip: new MaterialApprovalSlip(values['materialApprovalSlip'])
            })
        }
        case 'MaterialRequistionSlipItem': {
            return new MaterialRequistionSlipItemVariable(id, {
                materialRequistionSlip: new MaterialRequistionSlip(values['materialRequistionSlip']),
                materialApprovalSlipItem: new MaterialApprovalSlipItem(values['materialApprovalSlipItem']),
                quantity: parseInt(String(values['quantity'])),
                consumed: parseInt(String(values['consumed']))
            })
        }
        case 'BOM': {
            return new BOMVariable(id, {
                name: String(values['name'])
            })
        }
        case 'BOMItem': {
            return new BOMItemVariable(id, {
                bom: new BOM(values['bom']),
                product: new Product(values['product']),
                quantity: parseInt(String(values['quantity'])),
                uom: new UOM(values['uom'])
            })
        }
        case 'ProductionPreparationSlip': {
            return new ProductionPreparationSlipVariable(id, {
                bom: new BOM(values['bom']),
                approved: parseInt(String(values['approved'])),
                scrapped: parseInt(String(values['scrapped']))
            })
        }
        case 'ProductionPreparationSlipItem': {
            return new ProductionPreparationSlipItemVariable(id, {
                productionPreparationSlip: new ProductionPreparationSlip(values['productionPreparationSlip']),
                bomItem: String(values['bomItem']),
                materialRequistionSlipItem: new MaterialRequistionSlipItem(values['materialRequistionSlipItem'])
            })
        }
        case 'ScrapMaterialSlip': {
            return new ScrapMaterialSlipVariable(id, {
                productionPreparationSlip: new ProductionPreparationSlip(values['productionPreparationSlip']),
                quantity: parseInt(String(values['quantity']))
            })
        }
        case 'TransferMaterialSlip': {
            return new TransferMaterialSlipVariable(id, {
                productionPreparationSlip: new ProductionPreparationSlip(values['productionPreparationSlip']),
                quantity: parseInt(String(values['quantity'])),
                transferred: parseInt(String(values['quatransferedntity']))
            })
        }
        case 'WarehouseAcceptanceSlip': {
            return new WarehouseAcceptanceSlipVariable(id, {
                transferMaterialSlip: new TransferMaterialSlip(values['transferMaterialSlip']),
                quantity: parseInt(String(values['quantity']))
            })
        }
        default: {
            const _exhaustiveCheck: never = typeName
            return _exhaustiveCheck
        }
    }
}
