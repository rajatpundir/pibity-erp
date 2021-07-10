import Dexie from 'dexie'
import { Immutable } from 'immer'
import { AddressRow, BankAccountRow, BankBranchRow, BankRow, BOMItemRow, BOMRow, CountryRow, DiffRow, DistrictRow, IndentItemRow, IndentRow, MaterialApprovalSlipItemRow, MaterialApprovalSlipRow, MaterialRejectionSlipItemRow, MaterialRejectionSlipRow, MaterialRequistionSlipItemRow, MaterialRequistionSlipRow, MaterialReturnSlipItemRow, MaterialReturnSlipRow, PostalCodeRow, ProductionPreparationSlipItemRow, ProductionPreparationSlipRow, ProductRow, PurchaseInvoiceItemRow, PurchaseInvoiceRow, PurchaseOrderItemRow, PurchaseOrderRow, QuotationItemRow, QuotationRow, RegionRow, ScrapMaterialSlipRow, StateRow, SubdistrictRow, CompanyAddressRow, CompanyBankAccountRow, CompanyContactRow, CompanyProductRow, CompanyRow, TransferMaterialSlipRow, UOMRow, WarehouseAcceptanceSlipRow, CompanyTagGroupRow, CompanyTagRow, MappingCompanyTagRow, ContactRow, ContactAddressRow, CurrencyRow, CurrencyRateRow, MemoRow, BankTransactionRow, MappingProductTagRow, ProductCategoryGroupRow, ProductCategoryRow, ProductTagGroupRow, ProductTagRow } from './rows'

class Database extends Dexie {
    diffs: Dexie.Table<Immutable<DiffRow>, number>
    Region: Dexie.Table<Immutable<RegionRow>, string>
    Country: Dexie.Table<Immutable<CountryRow>, string>
    State: Dexie.Table<Immutable<StateRow>, string>
    District: Dexie.Table<Immutable<DistrictRow>, string>
    Subdistrict: Dexie.Table<Immutable<SubdistrictRow>, string>
    PostalCode: Dexie.Table<Immutable<PostalCodeRow>, string>
    Address: Dexie.Table<Immutable<AddressRow>, string>
    Company: Dexie.Table<Immutable<CompanyRow>, string>
    CompanyAddress: Dexie.Table<Immutable<CompanyAddressRow>, string>
    CompanyTagGroup: Dexie.Table<Immutable<CompanyTagGroupRow>, string>
    CompanyTag: Dexie.Table<Immutable<CompanyTagRow>, string>
    MappingCompanyTag: Dexie.Table<Immutable<MappingCompanyTagRow>, string>
    Contact: Dexie.Table<Immutable<ContactRow>, string>
    ContactAddress: Dexie.Table<Immutable<ContactAddressRow>, string>
    CompanyContact: Dexie.Table<Immutable<CompanyContactRow>, string>
    Currency: Dexie.Table<Immutable<CurrencyRow>, string>
    CurrencyRate: Dexie.Table<Immutable<CurrencyRateRow>, string>
    Memo: Dexie.Table<Immutable<MemoRow>, string>
    Bank: Dexie.Table<Immutable<BankRow>, string>
    BankBranch: Dexie.Table<Immutable<BankBranchRow>, string>
    BankAccount: Dexie.Table<Immutable<BankAccountRow>, string>
    BankTransaction: Dexie.Table<Immutable<BankTransactionRow>, string>
    CompanyBankAccount: Dexie.Table<Immutable<CompanyBankAccountRow>, string>
    ProductCategoryGroup: Dexie.Table<Immutable<ProductCategoryGroupRow>, string>
    ProductCategory: Dexie.Table<Immutable<ProductCategoryRow>, string>
    Product: Dexie.Table<Immutable<ProductRow>, string>
    ProductTagGroup: Dexie.Table<Immutable<ProductTagGroupRow>, string>
    ProductTag: Dexie.Table<Immutable<ProductTagRow>, string>
    MappingProductTag: Dexie.Table<Immutable<MappingProductTagRow>, string>
    UOM: Dexie.Table<Immutable<UOMRow>, string>
    Indent: Dexie.Table<Immutable<IndentRow>, string>
    IndentItem: Dexie.Table<Immutable<IndentItemRow>, string>
    CompanyProduct: Dexie.Table<Immutable<CompanyProductRow>, string>
    Quotation: Dexie.Table<Immutable<QuotationRow>, string>
    QuotationItem: Dexie.Table<Immutable<QuotationItemRow>, string>
    PurchaseOrder: Dexie.Table<Immutable<PurchaseOrderRow>, string>
    PurchaseOrderItem: Dexie.Table<Immutable<PurchaseOrderItemRow>, string>
    PurchaseInvoice: Dexie.Table<Immutable<PurchaseInvoiceRow>, string>
    PurchaseInvoiceItem: Dexie.Table<Immutable<PurchaseInvoiceItemRow>, string>
    MaterialApprovalSlip: Dexie.Table<Immutable<MaterialApprovalSlipRow>, string>
    MaterialApprovalSlipItem: Dexie.Table<Immutable<MaterialApprovalSlipItemRow>, string>
    MaterialRejectionSlip: Dexie.Table<Immutable<MaterialRejectionSlipRow>, string>
    MaterialRejectionSlipItem: Dexie.Table<Immutable<MaterialRejectionSlipItemRow>, string>
    MaterialReturnSlip: Dexie.Table<Immutable<MaterialReturnSlipRow>, string>
    MaterialReturnSlipItem: Dexie.Table<Immutable<MaterialReturnSlipItemRow>, string>
    MaterialRequistionSlip: Dexie.Table<Immutable<MaterialRequistionSlipRow>, string>
    MaterialRequistionSlipItem: Dexie.Table<Immutable<MaterialRequistionSlipItemRow>, string>
    BOM: Dexie.Table<Immutable<BOMRow>, string>
    BOMItem: Dexie.Table<Immutable<BOMItemRow>, string>
    ProductionPreparationSlip: Dexie.Table<Immutable<ProductionPreparationSlipRow>, string>
    ProductionPreparationSlipItem: Dexie.Table<Immutable<ProductionPreparationSlipItemRow>, string>
    ScrapMaterialSlip: Dexie.Table<Immutable<ScrapMaterialSlipRow>, string>
    TransferMaterialSlip: Dexie.Table<Immutable<TransferMaterialSlipRow>, string>
    WarehouseAcceptanceSlip: Dexie.Table<Immutable<WarehouseAcceptanceSlipRow>, string>

    constructor() {
        super('Database')
        // Note. Remove unused indexes from below.
        this.version(1).stores({
            diffs: '++id',
            Region: '&variableName, name',
            Country: '&variableName, [region+name], region, name',
            State: '&variableName, [country+name], country, name',
            District: '&variableName, [state+name], state, name',
            Subdistrict: '&variableName, [district+name], district, name',
            PostalCode: '&variableName, [subdistrict+name], subdistrict, name',
            Address: '&variableName, [postalCode+line1+line2], postalCode',
            Company: '&variableName, name',
            CompanyAddress: '&variableName, [company+name], [company+address]',
            CompanyTagGroup: '&variableName, name',
            CompanyTag: '&variableName, [group+name], group, name',
            MappingCompanyTag: '&variableName, [company+tag], company, tag',
            Contact: '&variableName, name',
            ContactAddress: '&variableName, [contact+name], [contact+address]',
            CompanyContact: '&variableName, [company+contact], company, contact',
            Currency: '&variableName, name',
            CurrencyRate: '&variableName, startTime, endTime',
            Memo: '&variableName, company',
            Bank: '&variableName, [country+name], country, name',
            BankBranch: '&variableName, [bank+name], bank, name',
            BankAccount: '&variableName, [bank+accountNumber], bank',
            BankTransaction: '&variableName, memo, bankAccount',
            CompanyBankAccount: '&variableName, [company+bankAccount]',
            ProductCategoryGroup: '&variableName, &parent',
            ProductCategory: '&variableName, [parent+name], [parent+code]',
            Product: '&variableName, name',
            ProductTagGroup: '&variableName, name',
            ProductTag: '&variableName, [group+name], group, name',
            MappingProductTag: '&variableName, [product+tag], product, tag',
            UOM: '&variableName, [product+name], product',
            Indent: '&variableName',
            IndentItem: '&variableName, [indent+product], indent',
            CompanyProduct: '&variableName, [company+product], company',
            Quotation: '&variableName',
            QuotationItem: '&variableName, [quotation+indentItem], quotation',
            PurchaseOrder: '&variableName',
            PurchaseOrderItem: '&variableName, [purchaseOrder+quotationItem], purchaseOrder',
            PurchaseInvoice: '&variableName',
            PurchaseInvoiceItem: '&variableName, [purchaseInvoice+purchaseOrderItem], purchaseInvoice',
            MaterialApprovalSlip: '&variableName',
            MaterialApprovalSlipItem: '&variableName, [materialApprovalSlip+PurchaseInvoiceItem], materialApprovalSlip',
            MaterialRejectionSlip: '&variableName',
            MaterialRejectionSlipItem: '&variableName, [materialRejectionSlip+purchaseInvoiceItem], materialRejectionSlip',
            MaterialReturnSlip: '&variableName',
            MaterialReturnSlipItem: '&variableName, [materialReturnSlip+materialRejectionSlipItem], materialReturnSlip',
            MaterialRequistionSlip: '&variableName',
            MaterialRequistionSlipItem: '&variableName, [materialRequistionSlip+materialApprovalSlipItem], materialRequistionSlip',
            BOM: '&variableName, name',
            BOMItem: '&variableName, [bom+product], bom',
            ProductionPreparationSlip: '&variableName',
            ProductionPreparationSlipItem: '&variableName, [productionPreparationSlip+bomItem], productionPreparationSlip',
            ScrapMaterialSlip: '&variableName',
            TransferMaterialSlip: '&variableName',
            WarehouseAcceptanceSlip: '&variableName'
        })

        this.diffs = this.table('diffs')
        this.Region = this.table('Region')
        this.Country = this.table('Country')
        this.State = this.table('State')
        this.District = this.table('District')
        this.Subdistrict = this.table('Subdistrict')
        this.PostalCode = this.table('PostalCode')
        this.Address = this.table('Address')
        this.Company = this.table('Company')
        this.CompanyAddress = this.table('CompanyAddress')
        this.CompanyTagGroup = this.table('CompanyTagGroup')
        this.CompanyTag = this.table('CompanyTag')
        this.MappingCompanyTag = this.table('MappingCompanyTag')
        this.Contact = this.table('Contact')
        this.ContactAddress = this.table('ContactAddress')
        this.CompanyContact = this.table('CompanyContact')
        this.Currency = this.table('Currency')
        this.CurrencyRate = this.table('CurrencyRate')
        this.Memo = this.table('Memo')
        this.Bank = this.table('Bank')
        this.BankBranch = this.table('BankBranch')
        this.BankAccount = this.table('BankAccount')
        this.BankTransaction = this.table('BankTransaction')
        this.CompanyBankAccount = this.table('CompanyBankAccount')
        this.ProductCategoryGroup = this.table('ProductCategoryGroup')
        this.ProductCategory = this.table('ProductCategory')
        this.Product = this.table('Product')
        this.ProductTagGroup = this.table('ProductTagGroup')
        this.ProductTag = this.table('ProductTag')
        this.MappingProductTag = this.table('MappingProductTag')
        this.UOM = this.table('UOM')
        this.Indent = this.table('Indent')
        this.IndentItem = this.table('IndentItem')
        this.CompanyProduct = this.table('CompanyProduct')
        this.Quotation = this.table('Quotation')
        this.QuotationItem = this.table('QuotationItem')
        this.PurchaseOrder = this.table('PurchaseOrder')
        this.PurchaseOrderItem = this.table('PurchaseOrderItem')
        this.PurchaseInvoice = this.table('PurchaseInvoice')
        this.PurchaseInvoiceItem = this.table('PurchaseInvoiceItem')
        this.MaterialApprovalSlip = this.table('MaterialApprovalSlip')
        this.MaterialApprovalSlipItem = this.table('MaterialApprovalSlipItem')
        this.MaterialRejectionSlip = this.table('MaterialRejectionSlip')
        this.MaterialRejectionSlipItem = this.table('MaterialRejectionSlipItem')
        this.MaterialReturnSlip = this.table('MaterialReturnSlip')
        this.MaterialReturnSlipItem = this.table('MaterialReturnSlipItem')
        this.MaterialRequistionSlip = this.table('MaterialRequistionSlip')
        this.MaterialRequistionSlipItem = this.table('MaterialRequistionSlipItem')
        this.BOM = this.table('BOM')
        this.BOMItem = this.table('BOMItem')
        this.ProductionPreparationSlip = this.table('ProductionPreparationSlip')
        this.ProductionPreparationSlipItem = this.table('ProductionPreparationSlipItem')
        this.ScrapMaterialSlip = this.table('ScrapMaterialSlip')
        this.TransferMaterialSlip = this.table('TransferMaterialSlip')
        this.WarehouseAcceptanceSlip = this.table('WarehouseAcceptanceSlip')

        this.diffs.mapToClass(DiffRow)
        this.Region.mapToClass(RegionRow)
        this.Country.mapToClass(CountryRow)
        this.State.mapToClass(StateRow)
        this.District.mapToClass(DistrictRow)
        this.Subdistrict.mapToClass(SubdistrictRow)
        this.PostalCode.mapToClass(PostalCodeRow)
        this.Address.mapToClass(AddressRow)
        this.Company.mapToClass(CompanyRow)
        this.CompanyAddress.mapToClass(CompanyAddressRow)
        this.CompanyTagGroup.mapToClass(CompanyTagGroupRow)
        this.CompanyTag.mapToClass(CompanyTagRow)
        this.MappingCompanyTag.mapToClass(MappingCompanyTagRow)
        this.Contact.mapToClass(ContactRow)
        this.ContactAddress.mapToClass(ContactAddressRow)
        this.CompanyContact.mapToClass(CompanyContactRow)
        this.Currency.mapToClass(CurrencyRow)
        this.CurrencyRate.mapToClass(CurrencyRateRow)
        this.Memo.mapToClass(MemoRow)
        this.Bank.mapToClass(BankRow)
        this.BankBranch.mapToClass(BankBranchRow)
        this.BankAccount.mapToClass(BankAccountRow)
        this.BankTransaction.mapToClass(BankTransactionRow)
        this.CompanyBankAccount.mapToClass(CompanyBankAccountRow)
        this.ProductCategoryGroup.mapToClass(ProductCategoryGroupRow)
        this.ProductCategory.mapToClass(ProductCategoryRow)
        this.Product.mapToClass(ProductRow)
        this.ProductTagGroup.mapToClass(ProductTagGroupRow)
        this.ProductTag.mapToClass(ProductTagRow)
        this.MappingProductTag.mapToClass(MappingProductTagRow)
        this.UOM.mapToClass(UOMRow)
        this.Indent.mapToClass(IndentRow)
        this.IndentItem.mapToClass(IndentItemRow)
        this.CompanyProduct.mapToClass(CompanyProductRow)
        this.Quotation.mapToClass(QuotationRow)
        this.QuotationItem.mapToClass(QuotationItemRow)
        this.PurchaseOrder.mapToClass(PurchaseOrderRow)
        this.PurchaseOrderItem.mapToClass(PurchaseOrderItemRow)
        this.PurchaseInvoice.mapToClass(PurchaseInvoiceRow)
        this.PurchaseInvoiceItem.mapToClass(PurchaseInvoiceItemRow)
        this.MaterialApprovalSlip.mapToClass(MaterialApprovalSlipRow)
        this.MaterialApprovalSlipItem.mapToClass(MaterialApprovalSlipItemRow)
        this.MaterialRejectionSlip.mapToClass(MaterialRejectionSlipRow)
        this.MaterialRejectionSlipItem.mapToClass(MaterialRejectionSlipItemRow)
        this.MaterialReturnSlip.mapToClass(MaterialReturnSlipRow)
        this.MaterialReturnSlipItem.mapToClass(MaterialReturnSlipItemRow)
        this.MaterialRequistionSlip.mapToClass(MaterialRequistionSlipRow)
        this.MaterialRequistionSlipItem.mapToClass(MaterialRequistionSlipItemRow)
        this.BOM.mapToClass(BOMRow)
        this.BOMItem.mapToClass(BOMItemRow)
        this.ProductionPreparationSlip.mapToClass(ProductionPreparationSlipRow)
        this.ProductionPreparationSlipItem.mapToClass(ProductionPreparationSlipItemRow)
        this.ScrapMaterialSlip.mapToClass(ScrapMaterialSlipRow)
        this.TransferMaterialSlip.mapToClass(TransferMaterialSlipRow)
        this.WarehouseAcceptanceSlip.mapToClass(WarehouseAcceptanceSlipRow)
    }
}

export const db = new Database()
