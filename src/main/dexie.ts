import Dexie from 'dexie'
import { Immutable } from 'immer'
import { AddressRow, BankAccountRow, BankBranchRow, BankRow, BOMItemRow, BOMRow, CompanyTypeRow, CountryRow, DiffRow, DistrictRow, IndentItemRow, IndentRow, MaterialApprovalSlipItemRow, MaterialApprovalSlipRow, MaterialRejectionSlipItemRow, MaterialRejectionSlipRow, MaterialRequistionSlipItemRow, MaterialRequistionSlipRow, MaterialReturnSlipItemRow, MaterialReturnSlipRow, PostalCodeRow, ProductionPreparationSlipItemRow, ProductionPreparationSlipRow, ProductRow, PurchaseInvoiceItemRow, PurchaseInvoiceRow, PurchaseOrderItemRow, PurchaseOrderRow, QuotationItemRow, QuotationRow, RegionRow, ScrapMaterialSlipRow, ServiceAreaRow, StateRow, SubdistrictRow, CompanyAddressRow, CompanyBankAccountRow, CompanyContactRow, CompanyProductRow, CompanyRow, TransferMaterialSlipRow, UOMRow, WarehouseAcceptanceSlipRow } from './rows'

class Database extends Dexie {
    diffs: Dexie.Table<Immutable<DiffRow>, number>
    regions: Dexie.Table<Immutable<RegionRow>, string>
    countries: Dexie.Table<Immutable<CountryRow>, string>
    states: Dexie.Table<Immutable<StateRow>, string>
    districts: Dexie.Table<Immutable<DistrictRow>, string>
    subdistricts: Dexie.Table<Immutable<SubdistrictRow>, string>
    postalCodes: Dexie.Table<Immutable<PostalCodeRow>, string>
    addresses: Dexie.Table<Immutable<AddressRow>, string>
    serviceAreas: Dexie.Table<Immutable<ServiceAreaRow>, string>
    companyTypes: Dexie.Table<Immutable<CompanyTypeRow>, string>
    banks: Dexie.Table<Immutable<BankRow>, string>
    bankBranches: Dexie.Table<Immutable<BankBranchRow>, string>
    bankAccounts: Dexie.Table<Immutable<BankAccountRow>, string>
    companies: Dexie.Table<Immutable<CompanyRow>, string>
    companyAddresses: Dexie.Table<Immutable<CompanyAddressRow>, string>
    companyContacts: Dexie.Table<Immutable<CompanyContactRow>, string>
    companyBankAccounts: Dexie.Table<Immutable<CompanyBankAccountRow>, string>
    products: Dexie.Table<Immutable<ProductRow>, string>
    uoms: Dexie.Table<Immutable<UOMRow>, string>
    indents: Dexie.Table<Immutable<IndentRow>, string>
    indentItems: Dexie.Table<Immutable<IndentItemRow>, string>
    companyProducts: Dexie.Table<Immutable<CompanyProductRow>, string>
    quotations: Dexie.Table<Immutable<QuotationRow>, string>
    quotationItems: Dexie.Table<Immutable<QuotationItemRow>, string>
    purchaseOrders: Dexie.Table<Immutable<PurchaseOrderRow>, string>
    purchaseOrderItems: Dexie.Table<Immutable<PurchaseOrderItemRow>, string>
    purchaseInvoices: Dexie.Table<Immutable<PurchaseInvoiceRow>, string>
    purchaseInvoiceItems: Dexie.Table<Immutable<PurchaseInvoiceItemRow>, string>
    materialApprovalSlips: Dexie.Table<Immutable<MaterialApprovalSlipRow>, string>
    materialApprovalSlipItems: Dexie.Table<Immutable<MaterialApprovalSlipItemRow>, string>
    materialRejectionSlips: Dexie.Table<Immutable<MaterialRejectionSlipRow>, string>
    materialRejectionSlipItems: Dexie.Table<Immutable<MaterialRejectionSlipItemRow>, string>
    materialReturnSlips: Dexie.Table<Immutable<MaterialReturnSlipRow>, string>
    materialReturnSlipItems: Dexie.Table<Immutable<MaterialReturnSlipItemRow>, string>
    materialRequistionSlips: Dexie.Table<Immutable<MaterialRequistionSlipRow>, string>
    materialRequistionSlipItems: Dexie.Table<Immutable<MaterialRequistionSlipItemRow>, string>
    boms: Dexie.Table<Immutable<BOMRow>, string>
    bomItems: Dexie.Table<Immutable<BOMItemRow>, string>
    productionPreparationSlips: Dexie.Table<Immutable<ProductionPreparationSlipRow>, string>
    productionPreparationSlipItems: Dexie.Table<Immutable<ProductionPreparationSlipItemRow>, string>
    scrapMaterialSlips: Dexie.Table<Immutable<ScrapMaterialSlipRow>, string>
    transferMaterialSlips: Dexie.Table<Immutable<TransferMaterialSlipRow>, string>
    warehouseAcceptanceSlips: Dexie.Table<Immutable<WarehouseAcceptanceSlipRow>, string>

    constructor() {
        super('Database')
        this.version(1).stores({
            diffs: '++id',
            regions: '&variableName',     
            countries: 'variableName, [region+name], region, name',
            states: 'variableName, [country+name], country, name',
            districts: 'variableName, [state+name], state, name',
            subdistricts: 'variableName, [district+name], district, name',
            postalCodes: 'variableName, [subdistrict+name], subdistrict, name',
            addresses: 'variableName, [postalCode+line1+line2], postalCode',
            serviceAreas: '&variableName',
            companyTypes: '&variableName',
            banks: 'variableName, [country+name], country, name',
            bankBranches: 'variableName, [bank+name], bank, name',
            bankAccounts: 'variableName, [bank+accountNumber], bank',
            companies: '&variableName',
            companyAddresses: 'variableName, [company+name], [company+address]',
            companyContacts: 'variableName, [company+name]',
            companyBankAccounts: 'variableName, [company+bankAccount]',
            products: '&variableName',
            uoms: 'variableName, [product+name], product',
            indents: '&variableName',
            indentItems: 'variableName, [indent+product], indent',
            companyProducts: 'variableName, [company+product], company',
            quotations: '&variableName',
            quotationItems: 'variableName, [quotation+indentItem], quotation',
            purchaseOrders: '&variableName',
            purchaseOrderItems: 'variableName, [purchaseOrder+quotationItem], purchaseOrder',
            purchaseInvoices: '&variableName',
            purchaseInvoiceItems: 'variableName, [purchaseInvoice+purchaseOrderItem], purchaseInvoice',
            materialApprovalSlips: '&variableName',
            materialApprovalSlipItems: 'variableName, [materialApprovalSlip+PurchaseInvoiceItem], materialApprovalSlip',
            materialRejectionSlips: '&variableName',
            materialRejectionSlipItems: 'variableName, [materialRejectionSlip+purchaseInvoiceItem], materialRejectionSlip',
            materialReturnSlips: '&variableName',
            materialReturnSlipItems: 'variableName, [materialReturnSlip+materialRejectionSlipItem], materialReturnSlip',
            materialRequistionSlips: '&variableName',
            materialRequistionSlipItems: 'variableName, [materialRequistionSlip+materialApprovalSlipItem], materialRequistionSlip',
            boms: '&variableName',
            bomItems: 'variableName, [bom+product], bom',
            productionPreparationSlips: '&variableName',
            productionPreparationSlipItems: 'variableName, [productionPreparationSlip+bomItem], productionPreparationSlip',
            scrapMaterialSlips: '&variableName',
            transferMaterialSlips: '&variableName',
            warehouseAcceptanceSlips: '&variableName'
        })

        this.diffs = this.table('diffs')
        this.regions = this.table('regions')
        this.countries = this.table('countries')
        this.states = this.table('states')
        this.districts = this.table('districts')
        this.subdistricts = this.table('subdistricts')
        this.postalCodes = this.table('postalCodes')
        this.addresses = this.table('addresses')
        this.serviceAreas = this.table('serviceAreas')
        this.companyTypes = this.table('companyTypes')
        this.banks = this.table('banks')
        this.bankBranches = this.table('bankBranches')
        this.bankAccounts = this.table('bankAccounts')
        this.companies = this.table('companies')
        this.companyAddresses = this.table('companyAddresses')
        this.companyContacts = this.table('companyContacts')
        this.companyBankAccounts = this.table('companyBankAccounts')
        this.products = this.table('products')
        this.uoms = this.table('uoms')
        this.indents = this.table('indents')
        this.indentItems = this.table('indentItems')
        this.companyProducts = this.table('companyProducts')
        this.quotations = this.table('quotations')
        this.quotationItems = this.table('quotationItems')
        this.purchaseOrders = this.table('purchaseOrders')
        this.purchaseOrderItems = this.table('purchaseOrderItems')
        this.purchaseInvoices = this.table('purchaseInvoices')
        this.purchaseInvoiceItems = this.table('purchaseInvoiceItems')
        this.materialApprovalSlips = this.table('materialApprovalSlips')
        this.materialApprovalSlipItems = this.table('materialApprovalSlipItems')
        this.materialRejectionSlips = this.table('materialRejectionSlips')
        this.materialRejectionSlipItems = this.table('materialRejectionSlipItems')
        this.materialReturnSlips = this.table('materialReturnSlips')
        this.materialReturnSlipItems = this.table('materialReturnSlipItems')
        this.materialRequistionSlips = this.table('materialRequistionSlips')
        this.materialRequistionSlipItems = this.table('materialRequistionSlipItems')
        this.boms = this.table('boms')
        this.bomItems = this.table('bomItems')
        this.productionPreparationSlips = this.table('productionPreparationSlips')
        this.productionPreparationSlipItems = this.table('productionPreparationSlipItems')
        this.scrapMaterialSlips = this.table('scrapMaterialSlips')
        this.transferMaterialSlips = this.table('transferMaterialSlips')
        this.warehouseAcceptanceSlips = this.table('warehouseAcceptanceSlips')

        this.diffs.mapToClass(DiffRow)
        this.regions.mapToClass(RegionRow)
        this.countries.mapToClass(CountryRow)
        this.states.mapToClass(StateRow)
        this.districts.mapToClass(DistrictRow)
        this.subdistricts.mapToClass(SubdistrictRow)
        this.postalCodes.mapToClass(PostalCodeRow)
        this.addresses.mapToClass(AddressRow)
        this.serviceAreas.mapToClass(ServiceAreaRow)
        this.companyTypes.mapToClass(CompanyTypeRow)
        this.banks.mapToClass(BankRow)
        this.bankBranches.mapToClass(BankBranchRow)
        this.bankAccounts.mapToClass(BankAccountRow)
        this.companies.mapToClass(CompanyRow)
        this.companyAddresses.mapToClass(CompanyAddressRow)
        this.companyContacts.mapToClass(CompanyContactRow)
        this.companyBankAccounts.mapToClass(CompanyBankAccountRow)
        this.products.mapToClass(ProductRow)
        this.uoms.mapToClass(UOMRow)
        this.indents.mapToClass(IndentRow)
        this.indentItems.mapToClass(IndentItemRow)
        this.companies.mapToClass(CompanyRow)
        this.companyProducts.mapToClass(CompanyProductRow)
        this.quotations.mapToClass(QuotationRow)
        this.quotationItems.mapToClass(QuotationItemRow)
        this.purchaseOrders.mapToClass(PurchaseOrderRow)
        this.purchaseOrderItems.mapToClass(PurchaseOrderItemRow)
        this.purchaseInvoices.mapToClass(PurchaseInvoiceRow)
        this.purchaseInvoiceItems.mapToClass(PurchaseInvoiceItemRow)
        this.materialApprovalSlips.mapToClass(MaterialApprovalSlipRow)
        this.materialApprovalSlipItems.mapToClass(MaterialApprovalSlipItemRow)
        this.materialRejectionSlips.mapToClass(MaterialRejectionSlipRow)
        this.materialRejectionSlipItems.mapToClass(MaterialRejectionSlipItemRow)
        this.materialReturnSlips.mapToClass(MaterialReturnSlipRow)
        this.materialReturnSlipItems.mapToClass(MaterialReturnSlipItemRow)
        this.materialRequistionSlips.mapToClass(MaterialRequistionSlipRow)
        this.materialRequistionSlipItems.mapToClass(MaterialRequistionSlipItemRow)
        this.boms.mapToClass(BOMRow)
        this.bomItems.mapToClass(BOMItemRow)
        this.productionPreparationSlips.mapToClass(ProductionPreparationSlipRow)
        this.productionPreparationSlipItems.mapToClass(ProductionPreparationSlipItemRow)
        this.scrapMaterialSlips.mapToClass(ScrapMaterialSlipRow)
        this.transferMaterialSlips.mapToClass(TransferMaterialSlipRow)
        this.warehouseAcceptanceSlips.mapToClass(WarehouseAcceptanceSlipRow)
    }
}

export const db = new Database()
