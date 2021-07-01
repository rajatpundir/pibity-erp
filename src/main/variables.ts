import { immerable } from 'immer'
import { AddressRow, BankAccountRow, BankBranchRow, BankRow, BOMItemRow, BOMRow, CompanyTypeRow, CountryRow, DistrictRow, IndentItemRow, IndentRow, MaterialApprovalSlipItemRow, MaterialApprovalSlipRow, MaterialRejectionSlipItemRow, MaterialRejectionSlipRow, MaterialRequistionSlipItemRow, MaterialRequistionSlipRow, MaterialReturnSlipItemRow, MaterialReturnSlipRow, PostalCodeRow, ProductionPreparationSlipItemRow, ProductionPreparationSlipRow, ProductRow, PurchaseInvoiceItemRow, PurchaseInvoiceRow, PurchaseOrderItemRow, PurchaseOrderRow, QuotationItemRow, QuotationRow, RegionRow, ScrapMaterialSlipRow, ServiceAreaRow, StateRow, SubdistrictRow, CompanyAddressRow, CompanyBankAccountRow, CompanyContactRow, CompanyProductRow, CompanyRow, TransferMaterialSlipRow, UOMRow, WarehouseAcceptanceSlipRow } from './rows'
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
    | ServiceAreaVariable
    | CompanyTypeVariable
    | CountryVariable
    | BankVariable
    | BankBranchVariable
    | BankAccountVariable
    | CompanyVariable
    | CompanyAddressVariable
    | CompanyContactVariable
    | CompanyBankAccountVariable
    | ProductVariable
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

export type VariableName =
    | Region
    | Country
    | State
    | District
    | Subdistrict
    | PostalCode
    | Address
    | ServiceArea
    | CompanyType
    | Bank
    | BankAccount
    | Company
    | CompanyAddress
    | CompanyContact
    | CompanyBankAccount
    | Product
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
    constructor(private variableName: string) { }

    equals(other: Region): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class RegionVariable {
    [immerable] = true
    readonly typeName = 'Region'
    variableName: Region
    values: {}

    constructor(variableName: string, values: {}) {
        this.variableName = new Region(variableName)
        this.values = values
    }

    equals(other: RegionVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName.equals(other.variableName)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): RegionRow {
        return new RegionRow(this.variableName.toString(), this.values)
    }
}

export class Country {
    constructor(private variableName: string) { }

    equals(other: Country): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class CountryVariable {
    [immerable] = true
    readonly typeName = 'Country'
    variableName: Country
    values: {
        // UNQ(region, name)
        region: Region
        name: Text
    }

    constructor(variableName: string, values: { region: Region, name: Text }) {
        this.variableName = new Country(variableName)
        this.values = values
    }

    equals(other: CountryVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.region.equals(other.values.region) && this.values.name === other.values.name
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): CountryRow {
        return new CountryRow(this.variableName.toString(), {
            region: this.values.region.toString(),
            name: this.values.name
        })
    }
}

export class State {
    constructor(private variableName: string) { }

    equals(other: State): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class StateVariable {
    [immerable] = true
    readonly typeName = 'State'
    variableName: State
    values: {
        // UNQ(country, name)
        country: Country
        name: Text
    }

    constructor(variableName: string, values: { country: Country, name: Text }) {
        this.variableName = new State(variableName)
        this.values = values
    }

    equals(other: StateVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.country.equals(other.values.country) && this.values.name === other.values.name
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): StateRow {
        return new StateRow(this.variableName.toString(), {
            country: this.values.country.toString(),
            name: this.values.name
        })
    }
}

export class District {
    constructor(private variableName: string) { }

    equals(other: District): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class DistrictVariable {
    [immerable] = true
    readonly typeName = 'District'
    variableName: District
    values: {
        // UNQ(state, name)
        state: State
        name: Text
    }

    constructor(variableName: string, values: { state: State, name: Text }) {
        this.variableName = new District(variableName)
        this.values = values
    }

    equals(other: DistrictVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.state.equals(other.values.state) && this.values.name === other.values.name
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): DistrictRow {
        return new DistrictRow(this.variableName.toString(), {
            state: this.values.state.toString(),
            name: this.values.name
        })
    }
}

export class Subdistrict {
    constructor(private variableName: string) { }

    equals(other: Subdistrict): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class SubdistrictVariable {
    [immerable] = true
    readonly typeName = 'Subdistrict'
    variableName: Subdistrict
    values: {
        // UNQ(district, name)
        district: District
        name: Text
    }

    constructor(variableName: string, values: { district: District, name: Text }) {
        this.variableName = new Subdistrict(variableName)
        this.values = values
    }

    equals(other: SubdistrictVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.district.equals(other.values.district) && this.values.name === other.values.name
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): SubdistrictRow {
        return new SubdistrictRow(this.variableName.toString(), {
            district: this.values.district.toString(),
            name: this.values.name
        })
    }
}

export class PostalCode {
    constructor(private variableName: string) { }

    equals(other: PostalCode): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class PostalCodeVariable {
    [immerable] = true
    readonly typeName = 'PostalCode'
    variableName: PostalCode
    values: {
        // UNQ(subdistrict, name)
        subdistrict: Subdistrict
        name: Text
    }

    constructor(variableName: string, values: { subdistrict: Subdistrict, name: Text }) {
        this.variableName = new PostalCode(variableName)
        this.values = values
    }

    equals(other: PostalCodeVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.subdistrict.equals(other.values.subdistrict) && this.values.name === other.values.name
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): PostalCodeRow {
        return new PostalCodeRow(this.variableName.toString(), {
            subdistrict: this.values.subdistrict.toString(),
            name: this.values.name
        })
    }
}

export class Address {
    constructor(private variableName: string) { }

    equals(other: Address): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class AddressVariable {
    [immerable] = true
    readonly typeName = 'Address'
    variableName: Address
    values: {
        // UNQ(postalCode, line1, line2)
        postalCode: PostalCode
        line1: Text
        line2: Text
        latitude: Decimal
        longitude: Decimal
    }

    constructor(variableName: string, values: { postalCode: PostalCode, line1: Text, line2: Text, latitude: Decimal, longitude: Decimal }) {
        this.variableName = new Address(variableName)
        this.values = values
    }

    equals(other: AddressVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.postalCode.equals(other.values.postalCode) && this.values.line1 === other.values.line1 && this.values.line2 === other.values.line2
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): AddressRow {
        return new AddressRow(this.variableName.toString(), {
            postalCode: this.values.postalCode.toString(),
            line1: this.values.line1,
            line2: this.values.line2,
            latitude: this.values.latitude,
            longitude: this.values.longitude
        })
    }
}

export class ServiceArea {
    constructor(private variableName: string) { }

    equals(other: ServiceArea): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class ServiceAreaVariable {
    [immerable] = true
    readonly typeName = 'ServiceArea'
    variableName: ServiceArea
    values: {}

    constructor(variableName: string) {
        this.variableName = new ServiceArea(variableName)
        this.values = {}
    }

    equals(other: ServiceAreaVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName.equals(other.variableName)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): ServiceAreaRow {
        return new ServiceAreaRow(this.variableName.toString(), this.values)
    }
}

export class CompanyType {
    constructor(private variableName: string) { }

    equals(other: CompanyType): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class CompanyTypeVariable {
    [immerable] = true
    readonly typeName = 'CompanyType'
    variableName: CompanyType
    values: {}

    constructor(variableName: string) {
        this.variableName = new CompanyType(variableName)
        this.values = {}
    }

    equals(other: CompanyTypeVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName.equals(other.variableName)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): CompanyTypeRow {
        return new CompanyTypeRow(this.variableName.toString(), this.values)
    }
}

export class Bank {
    constructor(private variableName: string) { }

    equals(other: Bank): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class BankVariable {
    [immerable] = true
    readonly typeName = 'Bank'
    variableName: Bank
    values: {
        // UNQ(country, name)
        country: Country
        name: Text
        website: Text
    }

    constructor(variableName: string, values: { country: Country, name: Text, website: Text }) {
        this.variableName = new Bank(variableName)
        this.values = values
    }

    equals(other: BankVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.country.equals(other.values.country) && this.values.name === other.values.name
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): BankRow {
        return new BankRow(this.variableName.toString(), {
            country: this.values.country.toString(),
            name: this.values.name,
            website: this.values.website
        })
    }
}

export class BankBranch {
    constructor(private variableName: string) { }

    equals(other: BankBranch): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class BankBranchVariable {
    [immerable] = true
    readonly typeName = 'BankBranch'
    variableName: BankBranch
    values: {
        // UNQ(bank, name)
        bank: Bank
        name: Text
        ifsc: Text
        address: Address
    }

    constructor(variableName: string, values: { bank: Bank, name: Text, ifsc: Text, address: Address }) {
        this.variableName = new BankBranch(variableName)
        this.values = values
    }

    equals(other: BankBranchVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.bank.equals(other.values.bank) && this.values.name === other.values.name
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): BankBranchRow {
        return new BankBranchRow(this.variableName.toString(), {
            bank: this.values.bank.toString(),
            name: this.values.name,
            ifsc: this.values.ifsc,
            address: this.values.address.toString()
        })
    }
}

export class BankAccount {
    constructor(private variableName: string) { }

    equals(other: BankAccount): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class BankAccountVariable {
    [immerable] = true
    readonly typeName = 'BankAccount'
    variableName: BankAccount
    values: {
        // UNQ(bank, accountNumber)
        bank: Bank
        bankBranch: BankBranch
        accountNumber: Text
    }

    constructor(variableName: string, values: { bank: Bank, bankBranch: BankBranch, accountNumber: Text }) {
        this.variableName = new BankAccount(variableName)
        this.values = values
    }

    equals(other: BankAccountVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.bank.equals(other.values.bank) && this.values.accountNumber === other.values.accountNumber
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): BankAccountRow {
        return new BankAccountRow(this.variableName.toString(), {
            bank: this.values.bank.toString(),
            bankBranch: this.values.bankBranch.toString(),
            accountNumber: this.values.accountNumber
        })
    }
}

export class Company {
    constructor(private variableName: string) { }

    equals(other: Company): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class CompanyVariable {
    [immerable] = true
    readonly typeName = 'Company'
    variableName: Company
    values: {
        email: Text
        telephone: Text
        mobile: Text
        website: Text
        companyType: CompanyType
        serviceArea: ServiceArea
        gstin: Text
        pan: Text
        iec: Text
    }

    constructor(variableName: string, values: { email: Text, telephone: Text, mobile: Text, website: Text, companyType: CompanyType, serviceArea: ServiceArea, gstin: Text, pan: Text, iec: Text }) {
        this.variableName = new Company(variableName)
        this.values = values
    }

    equals(other: CompanyVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName.equals(other.variableName) || this.values.gstin === other.values.gstin || this.values.pan === other.values.pan || this.values.iec === other.values.iec
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): CompanyRow {
        return new CompanyRow(this.variableName.toString(), {
            email: this.values.email,
            telephone: this.values.telephone,
            mobile: this.values.mobile,
            website: this.values.website,
            companyType: this.values.companyType.toString(),
            serviceArea: this.values.serviceArea.toString(),
            gstin: this.values.gstin,
            pan: this.values.pan,
            iec: this.values.iec
        })
    }
}

export class CompanyAddress {
    constructor(private variableName: string) { }

    equals(other: CompanyAddress): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class CompanyAddressVariable {
    [immerable] = true
    readonly typeName = 'CompanyAddress'
    variableName: CompanyAddress
    values: {
        // UNQ(company, name)
        // UNQ(company, address)
        company: Company
        name: Text
        address: Address
    }

    constructor(variableName: string, values: { company: Company, name: Text, address: Address }) {
        this.variableName = new CompanyAddress(variableName)
        this.values = values
    }

    equals(other: CompanyAddressVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.company.equals(other.values.company) && this.values.name === other.values.name && this.values.address.equals(other.values.address)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): CompanyAddressRow {
        return new CompanyAddressRow(this.variableName.toString(), {
            company: this.values.company.toString(),
            name: this.values.name,
            address: this.values.address.toString()
        })
    }
}

export class CompanyContact {
    constructor(private variableName: string) { }

    equals(other: CompanyContact): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class CompanyContactVariable {
    [immerable] = true
    readonly typeName = 'CompanyContact'
    variableName: CompanyContact
    values: {
        // UNQ(company, name)
        company: Company
        name: Text
        designation: Text
        email: Text
        telephone: Text
        mobile: Text
    }

    constructor(variableName: string, values: { company: Company, name: Text, designation: Text, email: Text, telephone: Text, mobile: Text }) {
        this.variableName = new CompanyContact(variableName)
        this.values = values
    }

    equals(other: CompanyContactVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.company.equals(other.values.company) && this.values.name === other.values.name
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): CompanyContactRow {
        return new CompanyContactRow(this.variableName.toString(), {
            company: this.values.company.toString(),
            name: this.values.name,
            designation: this.values.designation,
            email: this.values.email,
            telephone: this.values.telephone,
            mobile: this.values.mobile
        })
    }
}

export class CompanyBankAccount {
    constructor(private variableName: string) { }

    equals(other: CompanyBankAccount): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class CompanyBankAccountVariable {
    [immerable] = true
    readonly typeName = 'CompanyBankAccount'
    variableName: CompanyBankAccount
    values: {
        // UNQ(company, bankAccount)
        company: Company
        bankAccount: BankAccount
    }

    constructor(variableName: string, values: { company: Company, bankAccount: BankAccount }) {
        this.variableName = new CompanyBankAccount(variableName)
        this.values = values
    }

    equals(other: CompanyBankAccountVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.company.equals(other.values.company) && this.values.bankAccount.equals(other.values.bankAccount)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): CompanyBankAccountRow {
        return new CompanyBankAccountRow(this.variableName.toString(), {
            company: this.values.company.toString(),
            bankAccount: this.values.bankAccount.toString()
        })
    }
}

export class Product {
    constructor(private variableName: string) { }

    equals(other: Product): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class ProductVariable {
    [immerable] = true
    readonly typeName = 'Product'
    variableName: Product
    values: {
        // UNQ(SKU)
        name: Text
        orderable: Boolean
        consumable: Boolean
        producable: Boolean
    }

    constructor(variableName: string, values: { name: Text, orderable: Boolean, consumable: Boolean, producable: Boolean }) {
        this.variableName = new Product(variableName)
        this.values = values
    }

    equals(other: ProductVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName.equals(other.variableName)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): ProductRow {
        return new ProductRow(this.variableName.toString(), this.values)
    }
}

export class UOM {
    constructor(private variableName: string) { }

    equals(other: UOM): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class UOMVariable {
    [immerable] = true
    readonly typeName = 'UOM'
    variableName: UOM
    values: {
        // UNQ(product, name)
        product: Product
        name: Text
        conversionRate: Decimal
    }

    constructor(variableName: string, values: { product: Product, name: Text, conversionRate: Decimal }) {
        this.variableName = new UOM(variableName)
        this.values = values
    }

    equals(other: UOMVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.product.equals(other.values.product) && this.values.name === other.values.name
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): UOMRow {
        return new UOMRow(this.variableName.toString(), {
            product: this.values.product.toString(),
            name: this.values.name,
            conversionRate: this.values.conversionRate
        })
    }
}

export class Indent {
    constructor(private variableName: string) { }

    equals(other: Indent): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class IndentVariable {
    [immerable] = true
    readonly typeName = 'Indent'
    variableName: Indent
    values: {
        // timestamp: Timestamp // redundant field
        // subspace: Subspace
        // approver: Subspace
        // approved: Boolean
    }

    constructor(variableName: string, values: {}) {
        this.variableName = new Indent(variableName)
        this.values = values
    }

    equals(other: IndentVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName.equals(other.variableName)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): IndentRow {
        return new IndentRow(this.variableName.toString(), this.values)
    }
}

export class IndentItem {
    constructor(private variableName: string) { }

    equals(other: IndentItem): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class IndentItemVariable {
    [immerable] = true
    readonly typeName = 'IndentItem'
    variableName: IndentItem
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

    constructor(variableName: string, values: { indent: Indent, product: Product, quantity: Number, uom: UOM, ordered: Number, received: Number, approved: Number, rejected: Number, returned: Number, requisted: Number, consumed: Number }) {
        this.variableName = new IndentItem(variableName)
        this.values = values
    }

    equals(other: IndentItemVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.indent.equals(other.values.indent) && this.values.product.equals(other.values.product)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): IndentItemRow {
        return new IndentItemRow(this.variableName.toString(), {
            indent: this.values.indent.toString(),
            product: this.values.product.toString(),
            quantity: this.values.quantity,
            uom: this.values.uom.toString(),
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
    constructor(private variableName: string) { }

    equals(other: CompanyProduct): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class CompanyProductVariable {
    [immerable] = true
    readonly typeName = 'CompanyProduct'
    variableName: CompanyProduct
    values: {
        // UNQ(company, product)
        company: Company
        product: Product
    }

    constructor(variableName: string, values: { company: Company, product: Product }) {
        this.variableName = new CompanyProduct(variableName)
        this.values = values
    }

    equals(other: CompanyProductVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.company.equals(other.values.company) && this.values.product.equals(other.values.product)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): CompanyProductRow {
        return new CompanyProductRow(this.variableName.toString(), {
            company: this.values.company.toString(),
            product: this.values.product.toString()
        })
    }
}

export class Quotation {
    constructor(private variableName: string) { }

    equals(other: Quotation): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class QuotationVariable {
    [immerable] = true
    readonly typeName = 'Quotation'
    variableName: Quotation
    values: {
        indent: Indent
        company: Company
    }

    constructor(variableName: string, values: { indent: Indent, company: Company }) {
        this.variableName = new Quotation(variableName)
        this.values = values
    }

    equals(other: QuotationVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName.equals(other.variableName)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): QuotationRow {
        return new QuotationRow(this.variableName.toString(), {
            indent: this.values.indent.toString(),
            company: this.values.company.toString()
        })
    }
}

export class QuotationItem {
    constructor(private variableName: string) { }

    equals(other: QuotationItem): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class QuotationItemVariable {
    [immerable] = true
    readonly typeName = 'QuotationItem'
    variableName: QuotationItem
    values: {
        // UNQ(quotation, indentItem)
        quotation: Quotation
        // assertion(quotation.indent == indentItem.indent)
        indentItem: IndentItem
        // assertion(quantity <= (indentItem.quantity - (ordered - rejected)) && quantity > 0)
        quantity: Number
    }

    constructor(variableName: string, values: { quotation: Quotation, indentItem: IndentItem, quantity: Number }) {
        this.variableName = new QuotationItem(variableName)
        this.values = values
    }

    equals(other: QuotationItemVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.quotation.equals(other.values.quotation) && this.values.indentItem.equals(other.values.indentItem)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): QuotationItemRow {
        return new QuotationItemRow(this.variableName.toString(), {
            quotation: this.values.quotation.toString(),
            indentItem: this.values.indentItem.toString(),
            quantity: this.values.quantity
        })
    }
}

export class PurchaseOrder {
    constructor(private variableName: string) { }

    equals(other: PurchaseOrder): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class PurchaseOrderVariable {
    [immerable] = true
    readonly typeName = 'PurchaseOrder'
    variableName: PurchaseOrder
    values: {
        quotation: Quotation
    }

    constructor(variableName: string, values: { quotation: Quotation }) {
        this.variableName = new PurchaseOrder(variableName)
        this.values = values
    }

    equals(other: PurchaseOrderVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName.equals(other.variableName)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): PurchaseOrderRow {
        return new PurchaseOrderRow(this.variableName.toString(), {
            quotation: this.values.quotation.toString()
        })
    }
}

export class PurchaseOrderItem {
    constructor(private variableName: string) { }

    equals(other: PurchaseOrderItem): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class PurchaseOrderItemVariable {
    [immerable] = true
    readonly typeName = 'PurchaseOrderItem'
    variableName: PurchaseOrderItem
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

    constructor(variableName: string, values: { purchaseOrder: PurchaseOrder, quotationItem: QuotationItem, quantity: Number, price: Decimal, received: Number }) {
        this.variableName = new PurchaseOrderItem(variableName)
        this.values = values
    }

    equals(other: PurchaseOrderItemVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.purchaseOrder.equals(other.values.purchaseOrder) && this.values.quotationItem.equals(other.values.quotationItem)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): PurchaseOrderItemRow {
        return new PurchaseOrderItemRow(this.variableName.toString(), {
            purchaseOrder: this.values.purchaseOrder.toString(),
            quotationItem: this.values.quotationItem.toString(),
            quantity: this.values.quantity,
            price: this.values.price,
            received: this.values.received
        })
    }
}

export class PurchaseInvoice {
    constructor(private variableName: string) { }

    equals(other: PurchaseInvoice): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class PurchaseInvoiceVariable {
    [immerable] = true
    readonly typeName = 'PurchaseInvoice'
    variableName: PurchaseInvoice
    values: {
        purchaseOrder: PurchaseOrder
    }

    constructor(variableName: string, values: { purchaseOrder: PurchaseOrder }) {
        this.variableName = new PurchaseInvoice(variableName)
        this.values = values
    }

    equals(other: PurchaseInvoiceVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName.equals(other.variableName)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): PurchaseInvoiceRow {
        return new PurchaseInvoiceRow(this.variableName.toString(), {
            purchaseOrder: this.values.purchaseOrder.toString()
        })
    }
}

export class PurchaseInvoiceItem {
    constructor(private variableName: string) { }

    equals(other: PurchaseInvoiceItem): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class PurchaseInvoiceItemVariable {
    [immerable] = true
    readonly typeName = 'PurchaseInvoiceItem'
    variableName: PurchaseInvoiceItem
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

    constructor(variableName: string, values: { purchaseInvoice: PurchaseInvoice, purchaseOrderItem: PurchaseOrderItem, quantity: Number, approved: Number, rejected: Number }) {
        this.variableName = new PurchaseInvoiceItem(variableName)
        this.values = values
    }

    equals(other: PurchaseInvoiceItemVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.purchaseInvoice.equals(other.values.purchaseInvoice) && this.values.purchaseOrderItem.equals(other.values.purchaseOrderItem)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): PurchaseInvoiceItemRow {
        return new PurchaseInvoiceItemRow(this.variableName.toString(), {
            purchaseInvoice: this.values.purchaseInvoice.toString(),
            purchaseOrderItem: this.values.purchaseOrderItem.toString(),
            quantity: this.values.quantity,
            approved: this.values.approved,
            rejected: this.values.approved
        })
    }
}

export class MaterialApprovalSlip {
    constructor(private variableName: string) { }

    equals(other: MaterialApprovalSlip): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class MaterialApprovalSlipVariable {
    [immerable] = true
    readonly typeName = 'MaterialApprovalSlip'
    variableName: MaterialApprovalSlip
    values: {
        purchaseInvoice: PurchaseInvoice
    }

    constructor(variableName: string, values: { purchaseInvoice: PurchaseInvoice }) {
        this.variableName = new MaterialApprovalSlip(variableName)
        this.values = values
    }

    equals(other: MaterialApprovalSlipVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName.equals(other.variableName)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): MaterialApprovalSlipRow {
        return new MaterialApprovalSlipRow(this.variableName.toString(), {
            purchaseInvoice: this.values.purchaseInvoice.toString()
        })
    }
}

export class MaterialApprovalSlipItem {
    constructor(private variableName: string) { }

    equals(other: MaterialApprovalSlipItem): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class MaterialApprovalSlipItemVariable {
    [immerable] = true
    readonly typeName = 'MaterialApprovalSlipItem'
    variableName: MaterialApprovalSlipItem
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

    constructor(variableName: string, values: { materialApprovalSlip: MaterialApprovalSlip, purchaseInvoiceItem: PurchaseInvoiceItem, quantity: Number, requisted: Number }) {
        this.variableName = new MaterialApprovalSlipItem(variableName)
        this.values = values
    }

    equals(other: MaterialApprovalSlipItemVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.materialApprovalSlip.equals(other.values.materialApprovalSlip) && this.values.purchaseInvoiceItem.equals(other.values.purchaseInvoiceItem)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): MaterialApprovalSlipItemRow {
        return new MaterialApprovalSlipItemRow(this.variableName.toString(), {
            materialApprovalSlip: this.values.materialApprovalSlip.toString(),
            purchaseInvoiceItem: this.values.purchaseInvoiceItem.toString(),
            quantity: this.values.quantity,
            requisted: this.values.requisted
        })
    }
}

export class MaterialRejectionSlip {
    constructor(private variableName: string) { }

    equals(other: MaterialRejectionSlip): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class MaterialRejectionSlipVariable {
    [immerable] = true
    readonly typeName = 'MaterialRejectionSlip'
    variableName: MaterialRejectionSlip
    values: {
        purchaseInvoice: PurchaseInvoice
    }

    constructor(variableName: string, values: { purchaseInvoice: PurchaseInvoice }) {
        this.variableName = new MaterialRejectionSlip(variableName)
        this.values = values
    }

    equals(other: MaterialRejectionSlipVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName.equals(other.variableName)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): MaterialRejectionSlipRow {
        return new MaterialRejectionSlipRow(this.variableName.toString(), {
            purchaseInvoice: this.values.purchaseInvoice.toString()
        })
    }
}

export class MaterialRejectionSlipItem {
    constructor(private variableName: string) { }

    equals(other: MaterialRejectionSlipItem): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class MaterialRejectionSlipItemVariable {
    [immerable] = true
    readonly typeName = 'MaterialRejectionSlipItem'
    variableName: MaterialRejectionSlipItem
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

    constructor(variableName: string, values: { materialRejectionSlip: MaterialRejectionSlip, purchaseInvoiceItem: PurchaseInvoiceItem, quantity: Number, returned: Number }) {
        this.variableName = new MaterialRejectionSlipItem(variableName)
        this.values = values
    }

    equals(other: MaterialRejectionSlipItemVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.materialRejectionSlip.equals(other.values.materialRejectionSlip) && this.values.purchaseInvoiceItem.equals(other.values.purchaseInvoiceItem)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): MaterialRejectionSlipItemRow {
        return new MaterialRejectionSlipItemRow(this.variableName.toString(), {
            materialRejectionSlip: this.values.materialRejectionSlip.toString(),
            purchaseInvoiceItem: this.values.purchaseInvoiceItem.toString(),
            quantity: this.values.quantity,
            returned: this.values.returned
        })
    }
}

export class MaterialReturnSlip {
    constructor(private variableName: string) { }

    equals(other: MaterialReturnSlip): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class MaterialReturnSlipVariable {
    [immerable] = true
    readonly typeName = 'MaterialReturnSlip'
    variableName: MaterialReturnSlip
    values: {
        materialRejectionSlip: MaterialRejectionSlip
    }

    constructor(variableName: string, values: { materialRejectionSlip: MaterialRejectionSlip }) {
        this.variableName = new MaterialReturnSlip(variableName)
        this.values = values
    }

    equals(other: MaterialReturnSlipVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName.equals(other.variableName)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): MaterialReturnSlipRow {
        return new MaterialReturnSlipRow(this.variableName.toString(), {
            materialRejectionSlip: this.values.materialRejectionSlip.toString()
        })
    }
}

export class MaterialReturnSlipItem {
    constructor(private variableName: string) { }

    equals(other: MaterialReturnSlipItem): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class MaterialReturnSlipItemVariable {
    [immerable] = true
    readonly typeName = 'MaterialReturnSlipItem'
    variableName: MaterialReturnSlipItem
    values: {
        // UNQ(materialReturnSlip, materialRejectionSlipItem)
        materialReturnSlip: MaterialReturnSlip
        // assertion(materialReturnSlip.materialRejectionSlip == materialRejectionSlipItem.materialRejectionSlip)
        materialRejectionSlipItem: MaterialRejectionSlipItem
        // assertion(quantity <= materialRejectionSlipItem.quantity && quantity > 0)
        quantity: Number // { materialRejectionSlipItem.returned += quantity && materialRejectionSlipItem.purchaseInvoiceItem.purchaseOrderItem.quotationItem.indentItem.returned += quantity }
    }

    constructor(variableName: string, values: { materialReturnSlip: MaterialReturnSlip, materialRejectionSlipItem: MaterialRejectionSlipItem, quantity: Number }) {
        this.variableName = new MaterialReturnSlipItem(variableName)
        this.values = values
    }

    equals(other: MaterialReturnSlipItemVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.materialReturnSlip.equals(other.values.materialReturnSlip) && this.values.materialRejectionSlipItem.equals(other.values.materialRejectionSlipItem)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): MaterialReturnSlipItemRow {
        return new MaterialReturnSlipItemRow(this.variableName.toString(), {
            materialReturnSlip: this.values.materialReturnSlip.toString(),
            materialRejectionSlipItem: this.values.materialRejectionSlipItem.toString(),
            quantity: this.values.quantity
        })
    }
}

export class MaterialRequistionSlip {
    constructor(private variableName: string) { }

    equals(other: MaterialRequistionSlip): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class MaterialRequistionSlipVariable {
    [immerable] = true
    readonly typeName = 'MaterialRequistionSlip'
    variableName: MaterialRequistionSlip
    values: {
        materialApprovalSlip: MaterialApprovalSlip
    }

    constructor(variableName: string, values: { materialApprovalSlip: MaterialApprovalSlip }) {
        this.variableName = new MaterialRequistionSlip(variableName)
        this.values = values
    }

    equals(other: MaterialRequistionSlipVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName.equals(other.variableName)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): MaterialRequistionSlipRow {
        return new MaterialRequistionSlipRow(this.variableName.toString(), {
            materialApprovalSlip: this.values.materialApprovalSlip.toString()
        })
    }
}

export class MaterialRequistionSlipItem {
    constructor(private variableName: string) { }

    equals(other: MaterialRequistionSlipItem): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class MaterialRequistionSlipItemVariable {
    [immerable] = true
    readonly typeName = 'MaterialRequistionSlipItem'
    variableName: MaterialRequistionSlipItem
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

    constructor(variableName: string, values: { materialRequistionSlip: MaterialRequistionSlip, materialApprovalSlipItem: MaterialApprovalSlipItem, quantity: Number, consumed: Number }) {
        this.variableName = new MaterialRequistionSlipItem(variableName)
        this.values = values
    }

    equals(other: MaterialRequistionSlipItemVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.materialRequistionSlip.equals(other.values.materialRequistionSlip) && this.values.materialApprovalSlipItem.equals(other.values.materialApprovalSlipItem)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): MaterialRequistionSlipItemRow {
        return new MaterialRequistionSlipItemRow(this.variableName.toString(), {
            materialRequistionSlip: this.values.materialRequistionSlip.toString(),
            materialApprovalSlipItem: this.values.materialApprovalSlipItem.toString(),
            quantity: this.values.quantity,
            consumed: this.values.consumed
        })
    }
}

export class BOM {
    constructor(private variableName: string) { }

    equals(other: BOM): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class BOMVariable {
    [immerable] = true
    readonly typeName = 'BOM'
    variableName: BOM
    values: {}

    constructor(variableName: string, values: {}) {
        this.variableName = new BOM(variableName)
        this.values = values
    }

    equals(other: BOMVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName.equals(other.variableName)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): BOMRow {
        return new BOMRow(this.variableName.toString(), this.values)
    }
}

export class BOMItem {
    constructor(private variableName: string) { }

    equals(other: BOMItem): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class BOMItemVariable {
    [immerable] = true
    readonly typeName = 'BOMItem'
    variableName: BOMItem
    values: {
        // UNQ(bom, product)
        bom: BOM
        // assertion(product.consumable == true)
        product: Product
        // assertion(quantity > 0 && uom.product == product)
        quantity: Number
        uom: UOM
    }

    constructor(variableName: string, values: { bom: BOM, product: Product, quantity: Number, uom: UOM }) {
        this.variableName = new BOMItem(variableName)
        this.values = values
    }

    equals(other: BOMItemVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.bom.equals(other.values.bom) && this.values.product.equals(other.values.product)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): BOMItemRow {
        return new BOMItemRow(this.variableName.toString(), {
            bom: this.values.bom.toString(),
            product: this.values.product.toString(),
            quantity: this.values.quantity,
            uom: this.values.uom.toString()
        })
    }
}

export class ProductionPreparationSlip {
    constructor(private variableName: string) { }

    equals(other: ProductionPreparationSlip): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class ProductionPreparationSlipVariable {
    [immerable] = true
    readonly typeName = 'ProductionPreparationSlip'
    variableName: ProductionPreparationSlip
    values: {
        bom: BOM
        // assertion((approved + scrapped) <= quantity && approved >= 0 && scrapped >= 0)
        approved: Number
        scrapped: Number
    }

    constructor(variableName: string, values: { bom: BOM, approved: Number, scrapped: Number }) {
        this.variableName = new ProductionPreparationSlip(variableName)
        this.values = values
    }

    equals(other: ProductionPreparationSlipVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName.equals(other.variableName)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): ProductionPreparationSlipRow {
        return new ProductionPreparationSlipRow(this.variableName.toString(), {
            bom: this.values.bom.toString(),
            approved: this.values.approved,
            scrapped: this.values.scrapped
        })
    }
}

export class ProductionPreparationSlipItem {
    constructor(private variableName: string) { }

    equals(other: ProductionPreparationSlipItem): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class ProductionPreparationSlipItemVariable {
    [immerable] = true
    readonly typeName = 'ProductionPreparationSlipItem'
    variableName: ProductionPreparationSlipItem
    values: {
        // UNQ(productionPreparationSlip, bomItem)
        productionPreparationSlip: ProductionPreparationSlip
        bomItem: string
        // assertion(bomItem.product == materialRequistionSlipItem.materialApprovalSlipItem.purchaseInvoiceItem.purchaseOrderItem.quotationItem.indentItem.product)
        materialRequistionSlipItem: MaterialRequistionSlipItem
        // { materialRequistionSlipItem.consumed += bomItem.quantity * materialRequistionSlipItem.materialApprovalSlipItem.purchaseInvoiceItem.purchaseOrderItem.quotationItem.indentItem.uom.conversionRate / bomItem.product.uom.conversionRate }
        // { materialRequistionSlipItem.materialApprovalSlipItem.purchaseInvoiceItem.purchaseOrderItem.quotationItem.indentItem.consumed += bomItem.quantity * materialRequistionSlipItem.materialApprovalSlipItem.purchaseInvoiceItem.purchaseOrderItem.quotationItem.indentItem.uom.conversionRate / bomItem.product.uom.conversionRate }
    }

    constructor(variableName: string, values: { productionPreparationSlip: ProductionPreparationSlip, bomItem: string, materialRequistionSlipItem: MaterialRequistionSlipItem }) {
        this.variableName = new ProductionPreparationSlipItem(variableName)
        this.values = values
    }

    equals(other: ProductionPreparationSlipItemVariable): boolean {
        if (!other) {
            return false;
        }
        return this.values.productionPreparationSlip.equals(other.values.productionPreparationSlip) && this.values.bomItem === other.values.bomItem
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): ProductionPreparationSlipItemRow {
        return new ProductionPreparationSlipItemRow(this.variableName.toString(), {
            productionPreparationSlip: this.values.productionPreparationSlip.toString(),
            bomItem: this.values.bomItem,
            materialRequistionSlipItem: this.values.materialRequistionSlipItem.toString()
        })
    }
}

export class ScrapMaterialSlip {
    constructor(private variableName: string) { }

    equals(other: ScrapMaterialSlip): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class ScrapMaterialSlipVariable {
    [immerable] = true
    readonly typeName = 'ScrapMaterialSlip'
    variableName: ScrapMaterialSlip
    values: {
        productionPreparationSlip: ProductionPreparationSlip
        // assertion(quantity <= productionPreparationSlip.bom.quantity && quantity > 0)
        quantity: Number // { productionPreparationSlip.scrapped += quantity }
    }

    constructor(variableName: string, values: { productionPreparationSlip: ProductionPreparationSlip, quantity: Number }) {
        this.variableName = new ScrapMaterialSlip(variableName)
        this.values = values
    }

    equals(other: ScrapMaterialSlipVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName.equals(other.variableName)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): ScrapMaterialSlipRow {
        return new ScrapMaterialSlipRow(this.variableName.toString(), {
            productionPreparationSlip: this.values.productionPreparationSlip.toString(),
            quantity: this.values.quantity
        })
    }
}

export class TransferMaterialSlip {
    constructor(private variableName: string) { }

    equals(other: TransferMaterialSlip): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class TransferMaterialSlipVariable {
    [immerable] = true
    readonly typeName = 'TransferMaterialSlip'
    variableName: TransferMaterialSlip
    values: {
        productionPreparationSlip: ProductionPreparationSlip
        // assertion(quantity <= productionPreparationSlip.bom.quantity && quantity > 0)
        quantity: Number // { productionPreparationSlip.approved += quantity }
        // assertion(transfered <= quantity && transfered >= 0)
        transferred: Number
    }

    constructor(variableName: string, values: { productionPreparationSlip: ProductionPreparationSlip, quantity: Number, transferred: Number }) {
        this.variableName = new TransferMaterialSlip(variableName)
        this.values = values
    }

    equals(other: TransferMaterialSlipVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName.equals(other.variableName)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): TransferMaterialSlipRow {
        return new TransferMaterialSlipRow(this.variableName.toString(), {
            productionPreparationSlip: this.values.productionPreparationSlip.toString(),
            quantity: this.values.quantity,
            transferred: this.values.transferred
        })
    }
}

export class WarehouseAcceptanceSlip {
    constructor(private variableName: string) { }

    equals(other: WarehouseAcceptanceSlip): boolean {
        if (!other) {
            return false;
        }
        return this.variableName === other.variableName
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return this.variableName
    }
}

export class WarehouseAcceptanceSlipVariable {
    [immerable] = true
    readonly typeName = 'WarehouseAcceptanceSlip'
    variableName: WarehouseAcceptanceSlip
    values: {
        transferMaterialSlip: TransferMaterialSlip
        // assertion(quantity <= transferMaterialSlip.quantity && quantity > 0)
        quantity: Number // { transferMaterialSlip.transfered += quantity }
    }

    constructor(variableName: string, values: { transferMaterialSlip: TransferMaterialSlip, quantity: Number }) {
        this.variableName = new WarehouseAcceptanceSlip(variableName)
        this.values = values
    }

    equals(other: WarehouseAcceptanceSlipVariable): boolean {
        if (!other) {
            return false;
        }
        return this.variableName.equals(other.variableName)
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): WarehouseAcceptanceSlipRow {
        return new WarehouseAcceptanceSlipRow(this.variableName.toString(), {
            transferMaterialSlip: this.values.transferMaterialSlip.toString(),
            quantity: this.values.quantity
        })
    }
}

export function replaceVariable(typeName: NonPrimitiveType, variableName: string, values: object) {
    switch (typeName) {
        case 'Region': {
            return new RegionVariable(variableName, {})
        }
        case 'Country': {
            return new CountryVariable(variableName, {
                region: new Region(String(values['region'])),
                name: String(values['name'])
            })
        }
        case 'State': {
            return new StateVariable(variableName, {
                country: new Country(String(values['country'])),
                name: String(values['name'])
            })
        }
        case 'District': {
            return new DistrictVariable(variableName, {
                state: new State(String(values['state'])),
                name: String(values['name'])
            })
        }
        case 'Subdistrict': {
            return new SubdistrictVariable(variableName, {
                district: new District(String(values['district'])),
                name: String(values['name'])
            })
        }
        case 'PostalCode': {
            return new PostalCodeVariable(variableName, {
                subdistrict: new Subdistrict(String(values['subdistrict'])),
                name: String(values['name'])
            })
        }
        case 'Address': {
            return new AddressVariable(variableName, {
                postalCode: new PostalCode(String(values['postalCode'])),
                line1: String(values['line1']),
                line2: String(values['line2']),
                latitude: parseFloat(String(values['latitude'])),
                longitude: parseFloat(String(values['longitude']))
            })
        }
        case 'ServiceArea': {
            return new ServiceAreaVariable(variableName)
        }
        case 'CompanyType': {
            return new CompanyTypeVariable(variableName)
        }
        case 'Bank': {
            return new BankVariable(variableName, {
                country: new Country(String(values['country'])),
                name: String(values['name']),
                website: String(values['website'])
            })
        }
        case 'BankBranch': {
            return new BankBranchVariable(variableName, {
                bank: new Bank(String(values['bank'])),
                name: String(values['name']),
                ifsc: String(values['ifsc']),
                address: new Address(String(values['address']))
            })
        }
        case 'BankAccount': {
            return new BankAccountVariable(variableName, {
                bank: new Bank(String(values['bank'])),
                bankBranch: new BankBranch(String(values['bankBranch'])),
                accountNumber: String(values['accountNumber'])
            })
        }
        case 'Company': {
            return new CompanyVariable(variableName, {
                email: String(values['email']),
                telephone: String(values['telephone']),
                mobile: String(values['mobile']),
                website: String(values['website']),
                companyType: new CompanyType(String(values['companyType'])),
                serviceArea: new ServiceArea(String(values['serviceArea'])),
                gstin: String(values['gstin']),
                pan: String(values['pan']),
                iec: String(values['iec'])
            })
        }
        case 'CompanyAddress': {
            return new CompanyAddressVariable(variableName, {
                company: new Company(String(values['company'])),
                name: String(values['name']),
                address: new Address(String(values['address']))
            })
        }
        case 'CompanyContact': {
            return new CompanyContactVariable(variableName, {
                company: new Company(String(values['company'])),
                name: String(values['name']),
                designation: String(values['designation']),
                email: String(values['email']),
                telephone: String(values['telephone']),
                mobile: String(values['mobile'])
            })
        }
        case 'CompanyBankAccount': {
            return new CompanyBankAccountVariable(variableName, {
                company: new Company(String(values['company'])),
                bankAccount: new BankAccount(String(values['bankAccount']))
            })
        }
        case 'Product': {
            return new ProductVariable(variableName, {
                name: String(values['name']),
                orderable: Boolean(values['orderable']).valueOf(),
                consumable: Boolean(values['consumable']).valueOf(),
                producable: Boolean(values['producable']).valueOf()
            })
        }
        case 'UOM': {
            return new UOMVariable(variableName, {
                product: new Product(values['product']),
                name: String(values['name']),
                conversionRate: parseFloat(String(values['conversionRate']))
            })
        }
        case 'Indent': {
            return new IndentVariable(variableName, {})
        }
        case 'IndentItem': {
            return new IndentItemVariable(variableName, {
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
            return new CompanyProductVariable(variableName, {
                company: new Company(values['company']),
                product: new Product(values['product'])
            })
        }
        case 'Quotation': {
            return new QuotationVariable(variableName, {
                indent: new Indent(values['indent']),
                company: new Company(values['company'])
            })
        }
        case 'QuotationItem': {
            return new QuotationItemVariable(variableName, {
                quotation: new Quotation(values['quotation']),
                indentItem: new IndentItem(values['indentItem']),
                quantity: parseInt(String(values['quantity']))
            })
        }
        case 'PurchaseOrder': {
            return new PurchaseOrderVariable(variableName, {
                quotation: new Quotation(values['quotation'])
            })
        }
        case 'PurchaseOrderItem': {
            return new PurchaseOrderItemVariable(variableName, {
                purchaseOrder: new PurchaseOrder(values['purchaseOrder']),
                quotationItem: new QuotationItem(values['quotationItem']),
                quantity: parseInt(String(values['quantity'])),
                price: parseFloat(String(values['price'])),
                received: parseInt(String(values['received']))
            })
        }
        case 'PurchaseInvoice': {
            return new PurchaseInvoiceVariable(variableName, {
                purchaseOrder: new PurchaseOrder(values['purchaseOrder'])
            })
        }
        case 'PurchaseInvoiceItem': {
            return new PurchaseInvoiceItemVariable(variableName, {
                purchaseInvoice: new PurchaseInvoice(values['purchaseInvoice']),
                purchaseOrderItem: new PurchaseOrderItem(values['purchaseOrderItem']),
                quantity: parseInt(String(values['quantity'])),
                approved: parseInt(String(values['approved'])),
                rejected: parseInt(String(values['rejected']))
            })
        }
        case 'MaterialApprovalSlip': {
            return new MaterialApprovalSlipVariable(variableName, {
                purchaseInvoice: new PurchaseInvoice(values['purchaseInvoice'])
            })
        }
        case 'MaterialApprovalSlipItem': {
            return new MaterialApprovalSlipItemVariable(variableName, {
                materialApprovalSlip: new MaterialApprovalSlip(values['materialApprovalSlip']),
                purchaseInvoiceItem: new PurchaseInvoiceItem(values['purchaseInvoiceItem']),
                quantity: parseInt(String(values['quantity'])),
                requisted: parseInt(String(values['requisted']))
            })
        }
        case 'MaterialRejectionSlip': {
            return new MaterialRejectionSlipVariable(variableName, {
                purchaseInvoice: new PurchaseInvoice(values['purchaseInvoice'])
            })
        }
        case 'MaterialRejectionSlipItem': {
            return new MaterialRejectionSlipItemVariable(variableName, {
                materialRejectionSlip: new MaterialRejectionSlip(values['materialRejectionSlip']),
                purchaseInvoiceItem: new PurchaseInvoiceItem(values['purchaseInvoiceItem']),
                quantity: parseInt(String(values['quantity'])),
                returned: parseInt(String(values['returned']))
            })
        }
        case 'MaterialReturnSlip': {
            return new MaterialReturnSlipVariable(variableName, {
                materialRejectionSlip: new MaterialRejectionSlip(values['materialRejectionSlip'])
            })
        }
        case 'MaterialReturnSlipItem': {
            return new MaterialReturnSlipItemVariable(variableName, {
                materialReturnSlip: new MaterialReturnSlip(values['materialReturnSlip']),
                materialRejectionSlipItem: new MaterialRejectionSlipItem(values['materialRejectionSlipItem']),
                quantity: parseInt(String(values['quantity']))
            })
        }
        case 'MaterialRequistionSlip': {
            return new MaterialRequistionSlipVariable(variableName, {
                materialApprovalSlip: new MaterialApprovalSlip(values['materialApprovalSlip'])
            })
        }
        case 'MaterialRequistionSlipItem': {
            return new MaterialRequistionSlipItemVariable(variableName, {
                materialRequistionSlip: new MaterialRequistionSlip(values['materialRequistionSlip']),
                materialApprovalSlipItem: new MaterialApprovalSlipItem(values['materialApprovalSlipItem']),
                quantity: parseInt(String(values['quantity'])),
                consumed: parseInt(String(values['consumed']))
            })
        }
        case 'BOM': {
            return new BOMVariable(variableName, {})
        }
        case 'BOMItem': {
            return new BOMItemVariable(variableName, {
                bom: new BOM(values['bom']),
                product: new Product(values['product']),
                quantity: parseInt(String(values['quantity'])),
                uom: new UOM(values['uom'])
            })
        }
        case 'ProductionPreparationSlip': {
            return new ProductionPreparationSlipVariable(variableName, {
                bom: new BOM(values['bom']),
                approved: parseInt(String(values['approved'])),
                scrapped: parseInt(String(values['scrapped']))
            })
        }
        case 'ProductionPreparationSlipItem': {
            return new ProductionPreparationSlipItemVariable(variableName, {
                productionPreparationSlip: new ProductionPreparationSlip(values['productionPreparationSlip']),
                bomItem: String(values['bomItem']),
                materialRequistionSlipItem: new MaterialRequistionSlipItem(values['materialRequistionSlipItem'])
            })
        }
        case 'ScrapMaterialSlip': {
            return new ScrapMaterialSlipVariable(variableName, {
                productionPreparationSlip: new ProductionPreparationSlip(values['productionPreparationSlip']),
                quantity: parseInt(String(values['quantity']))
            })
        }
        case 'TransferMaterialSlip': {
            return new TransferMaterialSlipVariable(variableName, {
                productionPreparationSlip: new ProductionPreparationSlip(values['productionPreparationSlip']),
                quantity: parseInt(String(values['quantity'])),
                transferred: parseInt(String(values['quatransferedntity']))
            })
        }
        case 'WarehouseAcceptanceSlip': {
            return new WarehouseAcceptanceSlipVariable(variableName, {
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
