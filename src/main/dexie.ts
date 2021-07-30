import Dexie from 'dexie'
import { Immutable } from 'immer'
import { DiffRow, RegionRow, CountryRow, StateTypeRow, DistrictRow, SubdistrictRow, PostalCodeRow, AddressRow, CompanyRow, CompanyAddressRow, CompanyTagGroupRow, CompanyTagRow, MappingCompanyTagRow, ContactRow, ContactAddressRow, CompanyContactRow, CurrencyRow, CurrencyRateRow, MemoRow, BankRow, BankBranchRow, BankAccountRow, BankTransactionRow, CompanyBankAccountRow, ProductCategoryGroupRow, ProductCategoryRow, ProductRow, CompanyProductRow, ProductTagGroupRow, ProductTagRow, MappingProductTagRow, UomRow, IndentRow, IndentItemRow, QuotationRow, QuotationItemRow, PurchaseOrderRow, PurchaseOrderItemRow, PurchaseInvoiceRow, PurchaseInvoiceItemRow, MaterialApprovalSlipRow, MaterialApprovalSlipItemRow, MaterialRejectionSlipRow, MaterialRejectionSlipItemRow, MaterialReturnSlipRow, MaterialReturnSlipItemRow, MaterialRequistionSlipRow, MaterialRequistionSlipItemRow, BomRow, BomItemRow, ProductionPreparationSlipRow, ProductionPreparationSlipItemRow, ScrapMaterialSlipRow, TransferMaterialSlipRow, WarehouseAcceptanceSlipRow } from './rows'

class Database extends Dexie {
    diffs: Dexie.Table<Immutable<DiffRow>, number>
    Region: Dexie.Table<Immutable<RegionRow>, number>
    Country: Dexie.Table<Immutable<CountryRow>, number>
    StateType: Dexie.Table<Immutable<StateTypeRow>, number>
    District: Dexie.Table<Immutable<DistrictRow>, number>
    Subdistrict: Dexie.Table<Immutable<SubdistrictRow>, number>
    PostalCode: Dexie.Table<Immutable<PostalCodeRow>, number>
    Address: Dexie.Table<Immutable<AddressRow>, number>
    Company: Dexie.Table<Immutable<CompanyRow>, number>
    CompanyAddress: Dexie.Table<Immutable<CompanyAddressRow>, number>
    CompanyTagGroup: Dexie.Table<Immutable<CompanyTagGroupRow>, number>
    CompanyTag: Dexie.Table<Immutable<CompanyTagRow>, number>
    MappingCompanyTag: Dexie.Table<Immutable<MappingCompanyTagRow>, number>
    Contact: Dexie.Table<Immutable<ContactRow>, number>
    ContactAddress: Dexie.Table<Immutable<ContactAddressRow>, number>
    CompanyContact: Dexie.Table<Immutable<CompanyContactRow>, number>
    Currency: Dexie.Table<Immutable<CurrencyRow>, number>
    CurrencyRate: Dexie.Table<Immutable<CurrencyRateRow>, number>
    Memo: Dexie.Table<Immutable<MemoRow>, number>
    Bank: Dexie.Table<Immutable<BankRow>, number>
    BankBranch: Dexie.Table<Immutable<BankBranchRow>, number>
    BankAccount: Dexie.Table<Immutable<BankAccountRow>, number>
    BankTransaction: Dexie.Table<Immutable<BankTransactionRow>, number>
    CompanyBankAccount: Dexie.Table<Immutable<CompanyBankAccountRow>, number>
    ProductCategoryGroup: Dexie.Table<Immutable<ProductCategoryGroupRow>, number>
    ProductCategory: Dexie.Table<Immutable<ProductCategoryRow>, number>
    Product: Dexie.Table<Immutable<ProductRow>, number>
    CompanyProduct: Dexie.Table<Immutable<CompanyProductRow>, number>
    ProductTagGroup: Dexie.Table<Immutable<ProductTagGroupRow>, number>
    ProductTag: Dexie.Table<Immutable<ProductTagRow>, number>
    MappingProductTag: Dexie.Table<Immutable<MappingProductTagRow>, number>
    Uom: Dexie.Table<Immutable<UomRow>, number>
    Indent: Dexie.Table<Immutable<IndentRow>, number>
    IndentItem: Dexie.Table<Immutable<IndentItemRow>, number>
    Quotation: Dexie.Table<Immutable<QuotationRow>, number>
    QuotationItem: Dexie.Table<Immutable<QuotationItemRow>, number>
    PurchaseOrder: Dexie.Table<Immutable<PurchaseOrderRow>, number>
    PurchaseOrderItem: Dexie.Table<Immutable<PurchaseOrderItemRow>, number>
    PurchaseInvoice: Dexie.Table<Immutable<PurchaseInvoiceRow>, number>
    PurchaseInvoiceItem: Dexie.Table<Immutable<PurchaseInvoiceItemRow>, number>
    MaterialApprovalSlip: Dexie.Table<Immutable<MaterialApprovalSlipRow>, number>
    MaterialApprovalSlipItem: Dexie.Table<Immutable<MaterialApprovalSlipItemRow>, number>
    MaterialRejectionSlip: Dexie.Table<Immutable<MaterialRejectionSlipRow>, number>
    MaterialRejectionSlipItem: Dexie.Table<Immutable<MaterialRejectionSlipItemRow>, number>
    MaterialReturnSlip: Dexie.Table<Immutable<MaterialReturnSlipRow>, number>
    MaterialReturnSlipItem: Dexie.Table<Immutable<MaterialReturnSlipItemRow>, number>
    MaterialRequistionSlip: Dexie.Table<Immutable<MaterialRequistionSlipRow>, number>
    MaterialRequistionSlipItem: Dexie.Table<Immutable<MaterialRequistionSlipItemRow>, number>
    Bom: Dexie.Table<Immutable<BomRow>, number>
    BomItem: Dexie.Table<Immutable<BomItemRow>, number>
    ProductionPreparationSlip: Dexie.Table<Immutable<ProductionPreparationSlipRow>, number>
    ProductionPreparationSlipItem: Dexie.Table<Immutable<ProductionPreparationSlipItemRow>, number>
    ScrapMaterialSlip: Dexie.Table<Immutable<ScrapMaterialSlipRow>, number>
    TransferMaterialSlip: Dexie.Table<Immutable<TransferMaterialSlipRow>, number>
    WarehouseAcceptanceSlip: Dexie.Table<Immutable<WarehouseAcceptanceSlipRow>, number>

    constructor() {
        super('Database')
        this.version(1).stores({
            diffs: '++id',
            Region:'++id, [name]',
            Country:'++id, [region+name]',
            StateType:'++id, [country+name]',
            District:'++id, [state+name]',
            Subdistrict:'++id, [district+name]',
            PostalCode:'++id, [subdistrict+name]',
            Address:'++id, [postalCode+line1+line2]',
            Company:'++id, [name]',
            CompanyAddress:'++id, [company+name], [company+address]',
            CompanyTagGroup:'++id, [name]',
            CompanyTag:'++id, [group+name]',
            MappingCompanyTag:'++id, [company+tag]',
            Contact:'++id, [name]',
            ContactAddress:'++id, [contact+name], [contact+address]',
            CompanyContact:'++id, [company+contact]',
            Currency:'++id, [name]',
            CurrencyRate:'++id',
            Memo:'++id',
            Bank:'++id, [country+name]',
            BankBranch:'++id, [bank+name], [bank+ifsc]',
            BankAccount:'++id, [bank+accountNumber]',
            BankTransaction:'++id',
            CompanyBankAccount:'++id, [company+bankAccount]',
            ProductCategoryGroup:'++id, [parent]',
            ProductCategory:'++id, [parent+name], [parent+code]',
            Product:'++id, [name]',
            CompanyProduct:'++id, [company+product]',
            ProductTagGroup:'++id, [name]',
            ProductTag:'++id, [group+name]',
            MappingProductTag:'++id, [product+tag]',
            Uom:'++id, [product+name]',
            Indent:'++id',
            IndentItem:'++id, [indent+product]',
            Quotation:'++id',
            QuotationItem:'++id, [quotation+indentItem]',
            PurchaseOrder:'++id',
            PurchaseOrderItem:'++id, [purchaseOrder+quotationItem]',
            PurchaseInvoice:'++id',
            PurchaseInvoiceItem:'++id, [purchaseInvoice+purchaseOrderItem]',
            MaterialApprovalSlip:'++id',
            MaterialApprovalSlipItem:'++id, [materialApprovalSlip+purchaseInvoiceItem]',
            MaterialRejectionSlip:'++id',
            MaterialRejectionSlipItem:'++id, [materialRejectionSlip+purchaseInvoiceItem]',
            MaterialReturnSlip:'++id',
            MaterialReturnSlipItem:'++id, [materialReturnSlip+materialRejectionSlipItem]',
            MaterialRequistionSlip:'++id',
            MaterialRequistionSlipItem:'++id, [materialRequistionSlip+materialApprovalSlipItem]',
            Bom:'++id, [name]',
            BomItem:'++id, [bom+product]',
            ProductionPreparationSlip:'++id',
            ProductionPreparationSlipItem:'++id, [productionPreparationSlip+bomItem]',
            ScrapMaterialSlip:'++id',
            TransferMaterialSlip:'++id',
            WarehouseAcceptanceSlip:'++id'
        })
        
        this.diffs = this.table('diffs')
        this.Region = this.table('Region')
        this.Country = this.table('Country')
        this.StateType = this.table('StateType')
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
        this.CompanyProduct = this.table('CompanyProduct')
        this.ProductTagGroup = this.table('ProductTagGroup')
        this.ProductTag = this.table('ProductTag')
        this.MappingProductTag = this.table('MappingProductTag')
        this.Uom = this.table('Uom')
        this.Indent = this.table('Indent')
        this.IndentItem = this.table('IndentItem')
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
        this.Bom = this.table('Bom')
        this.BomItem = this.table('BomItem')
        this.ProductionPreparationSlip = this.table('ProductionPreparationSlip')
        this.ProductionPreparationSlipItem = this.table('ProductionPreparationSlipItem')
        this.ScrapMaterialSlip = this.table('ScrapMaterialSlip')
        this.TransferMaterialSlip = this.table('TransferMaterialSlip')
        this.WarehouseAcceptanceSlip = this.table('WarehouseAcceptanceSlip')

        this.diffs.mapToClass(DiffRow)
        this.Region.mapToClass(RegionRow)
        this.Country.mapToClass(CountryRow)
        this.StateType.mapToClass(StateTypeRow)
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
        this.CompanyProduct.mapToClass(CompanyProductRow)
        this.ProductTagGroup.mapToClass(ProductTagGroupRow)
        this.ProductTag.mapToClass(ProductTagRow)
        this.MappingProductTag.mapToClass(MappingProductTagRow)
        this.Uom.mapToClass(UomRow)
        this.Indent.mapToClass(IndentRow)
        this.IndentItem.mapToClass(IndentItemRow)
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
        this.Bom.mapToClass(BomRow)
        this.BomItem.mapToClass(BomItemRow)
        this.ProductionPreparationSlip.mapToClass(ProductionPreparationSlipRow)
        this.ProductionPreparationSlipItem.mapToClass(ProductionPreparationSlipItemRow)
        this.ScrapMaterialSlip.mapToClass(ScrapMaterialSlipRow)
        this.TransferMaterialSlip.mapToClass(TransferMaterialSlipRow)
        this.WarehouseAcceptanceSlip.mapToClass(WarehouseAcceptanceSlipRow)
    }
}

export const db = new Database()
