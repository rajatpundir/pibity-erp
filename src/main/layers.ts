import { HashSet, Vector } from 'prelude-ts'
import { immerable, Immutable } from 'immer'
import { Variable, VariableId, ProductVariable, UOMVariable, IndentVariable, IndentItemVariable, CompanyVariable, CompanyProductVariable, QuotationVariable, QuotationItemVariable, PurchaseOrderVariable, PurchaseOrderItemVariable, PurchaseInvoiceVariable, PurchaseInvoiceItemVariable, MaterialApprovalSlipVariable, MaterialApprovalSlipItemVariable, MaterialRejectionSlipVariable, MaterialRejectionSlipItemVariable, MaterialReturnSlipVariable, MaterialReturnSlipItemVariable, MaterialRequistionSlipVariable, MaterialRequistionSlipItemVariable, BOMVariable, BOMItemVariable, ProductionPreparationSlipVariable, ProductionPreparationSlipItemVariable, ScrapMaterialSlipVariable, TransferMaterialSlipVariable, WarehouseAcceptanceSlipVariable, Product, UOM, Indent, IndentItem, Company, CompanyProduct, Quotation, QuotationItem, PurchaseOrder, PurchaseOrderItem, PurchaseInvoice, PurchaseInvoiceItem, MaterialApprovalSlip, MaterialApprovalSlipItem, MaterialRejectionSlip, MaterialRejectionSlipItem, MaterialReturnSlip, MaterialReturnSlipItem, MaterialRequistionSlip, MaterialRequistionSlipItem, BOM, BOMItem, ProductionPreparationSlip, ProductionPreparationSlipItem, ScrapMaterialSlip, TransferMaterialSlip, WarehouseAcceptanceSlip, RegionVariable, Region, CountryVariable, Country, StateVariable, State, DistrictVariable, District, SubdistrictVariable, Subdistrict, PostalCodeVariable, PostalCode, AddressVariable, Address, BankVariable, Bank, BankBranchVariable, BankBranch, BankAccountVariable, BankAccount, CompanyAddressVariable, CompanyAddress, CompanyContactVariable, CompanyContact, CompanyBankAccountVariable, CompanyBankAccount, BankTransaction, BankTransactionVariable, CompanyTag, CompanyTagGroup, CompanyTagGroupVariable, CompanyTagVariable, Contact, ContactAddress, ContactAddressVariable, ContactVariable, Currency, CurrencyRate, CurrencyRateVariable, CurrencyVariable, MappingCompanyTag, MappingCompanyTagVariable, MappingProductTag, MappingProductTagVariable, Memo, MemoVariable, ProductCategory, ProductCategoryGroup, ProductCategoryGroupVariable, ProductCategoryVariable, ProductTag, ProductTagGroup, ProductTagGroupVariable, ProductTagVariable } from './variables'
import { NonPrimitiveType } from './types'
import { AddressRow, BankAccountRow, BankBranchRow, BankRow, BOMItemRow, BOMRow, CountryRow, DiffRow, DistrictRow, IndentItemRow, IndentRow, MaterialApprovalSlipItemRow, MaterialApprovalSlipRow, MaterialRejectionSlipItemRow, MaterialRejectionSlipRow, MaterialRequistionSlipItemRow, MaterialRequistionSlipRow, MaterialReturnSlipItemRow, MaterialReturnSlipRow, PostalCodeRow, ProductionPreparationSlipItemRow, ProductionPreparationSlipRow, ProductRow, PurchaseInvoiceItemRow, PurchaseInvoiceRow, PurchaseOrderItemRow, PurchaseOrderRow, QuotationItemRow, QuotationRow, RegionRow, ScrapMaterialSlipRow, StateRow, SubdistrictRow, CompanyAddressRow, CompanyBankAccountRow, CompanyContactRow, CompanyProductRow, CompanyRow, TransferMaterialSlipRow, UOMRow, WarehouseAcceptanceSlipRow, BankTransactionRow, CompanyTagGroupRow, CompanyTagRow, ContactAddressRow, ContactRow, CurrencyRateRow, CurrencyRow, MappingCompanyTagRow, MappingProductTagRow, MemoRow, ProductCategoryGroupRow, ProductCategoryRow, ProductTagGroupRow, ProductTagRow } from './rows'
import { db } from './dexie'

export function mergeDiffs(diffs: ReadonlyArray<DiffVariable>): DiffVariable {
    const result = diffs.reduce((acc, diff) => {
        Object.keys(diff.variables).forEach(typeName => {
            acc.variables[typeName].replace = acc.variables[typeName].replace.filter((x: Variable) => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).addAll(diff.variables[typeName].replace)
            acc.variables[typeName].remove = acc.variables[typeName].remove.filter((x: VariableId) => !diff.variables[typeName].replace.anyMatch(y => x.hashCode() === y.variableName.hashCode())).addAll(diff.variables[typeName].remove)
        })
        return acc
    }, new DiffVariable())
    return result
}

type DiffVariables = {
    Region: {
        replace: HashSet<Immutable<RegionVariable>>,
        remove: HashSet<Immutable<Region>>
    },
    Country: {
        replace: HashSet<Immutable<CountryVariable>>,
        remove: HashSet<Immutable<Country>>
    },
    State: {
        replace: HashSet<Immutable<StateVariable>>,
        remove: HashSet<Immutable<State>>
    },
    District: {
        replace: HashSet<Immutable<DistrictVariable>>,
        remove: HashSet<Immutable<District>>
    },
    Subdistrict: {
        replace: HashSet<Immutable<SubdistrictVariable>>,
        remove: HashSet<Immutable<Subdistrict>>
    },
    PostalCode: {
        replace: HashSet<Immutable<PostalCodeVariable>>,
        remove: HashSet<Immutable<PostalCode>>
    },
    Address: {
        replace: HashSet<Immutable<AddressVariable>>,
        remove: HashSet<Immutable<Address>>
    },
    Company: {
        replace: HashSet<Immutable<CompanyVariable>>,
        remove: HashSet<Immutable<Company>>
    },
    CompanyAddress: {
        replace: HashSet<Immutable<CompanyAddressVariable>>,
        remove: HashSet<Immutable<CompanyAddress>>
    },
    CompanyTagGroup: {
        replace: HashSet<Immutable<CompanyTagGroupVariable>>,
        remove: HashSet<Immutable<CompanyTagGroup>>
    },
    CompanyTag: {
        replace: HashSet<Immutable<CompanyTagVariable>>,
        remove: HashSet<Immutable<CompanyTag>>
    },
    MappingCompanyTag: {
        replace: HashSet<Immutable<MappingCompanyTagVariable>>,
        remove: HashSet<Immutable<MappingCompanyTag>>
    },
    Contact: {
        replace: HashSet<Immutable<ContactVariable>>,
        remove: HashSet<Immutable<Contact>>
    },
    ContactAddress: {
        replace: HashSet<Immutable<ContactAddressVariable>>,
        remove: HashSet<Immutable<ContactAddress>>
    },
    CompanyContact: {
        replace: HashSet<Immutable<CompanyContactVariable>>,
        remove: HashSet<Immutable<CompanyContact>>
    },
    Currency: {
        replace: HashSet<Immutable<CurrencyVariable>>,
        remove: HashSet<Immutable<Currency>>
    },
    CurrencyRate: {
        replace: HashSet<Immutable<CurrencyRateVariable>>,
        remove: HashSet<Immutable<CurrencyRate>>
    },
    Memo: {
        replace: HashSet<Immutable<MemoVariable>>,
        remove: HashSet<Immutable<Memo>>
    },
    Bank: {
        replace: HashSet<Immutable<BankVariable>>,
        remove: HashSet<Immutable<Bank>>
    },
    BankBranch: {
        replace: HashSet<Immutable<BankBranchVariable>>,
        remove: HashSet<Immutable<BankBranch>>
    },
    BankAccount: {
        replace: HashSet<Immutable<BankAccountVariable>>,
        remove: HashSet<Immutable<BankAccount>>
    },
    BankTransaction: {
        replace: HashSet<Immutable<BankTransactionVariable>>,
        remove: HashSet<Immutable<BankTransaction>>
    },
    CompanyBankAccount: {
        replace: HashSet<Immutable<CompanyBankAccountVariable>>,
        remove: HashSet<Immutable<CompanyBankAccount>>
    },
    ProductCategoryGroup: {
        replace: HashSet<Immutable<ProductCategoryGroupVariable>>,
        remove: HashSet<Immutable<ProductCategoryGroup>>
    },
    ProductCategory: {
        replace: HashSet<Immutable<ProductCategoryVariable>>,
        remove: HashSet<Immutable<ProductCategory>>
    },
    Product: {
        replace: HashSet<Immutable<ProductVariable>>,
        remove: HashSet<Immutable<Product>>
    },
    ProductTagGroup: {
        replace: HashSet<Immutable<ProductTagGroupVariable>>,
        remove: HashSet<Immutable<ProductTagGroup>>
    },
    ProductTag: {
        replace: HashSet<Immutable<ProductTagVariable>>,
        remove: HashSet<Immutable<ProductTag>>
    },
    MappingProductTag: {
        replace: HashSet<Immutable<MappingProductTagVariable>>,
        remove: HashSet<Immutable<MappingProductTag>>
    },
    UOM: {
        replace: HashSet<Immutable<UOMVariable>>,
        remove: HashSet<Immutable<UOM>>
    },
    Indent: {
        replace: HashSet<Immutable<IndentVariable>>,
        remove: HashSet<Immutable<Indent>>
    },
    IndentItem: {
        replace: HashSet<Immutable<IndentItemVariable>>,
        remove: HashSet<Immutable<IndentItem>>
    },
    CompanyProduct: {
        replace: HashSet<Immutable<CompanyProductVariable>>,
        remove: HashSet<Immutable<CompanyProduct>>
    },
    Quotation: {
        replace: HashSet<Immutable<QuotationVariable>>,
        remove: HashSet<Immutable<Quotation>>
    },
    QuotationItem: {
        replace: HashSet<Immutable<QuotationItemVariable>>,
        remove: HashSet<Immutable<QuotationItem>>
    },
    PurchaseOrder: {
        replace: HashSet<Immutable<PurchaseOrderVariable>>,
        remove: HashSet<Immutable<PurchaseOrder>>
    },
    PurchaseOrderItem: {
        replace: HashSet<Immutable<PurchaseOrderItemVariable>>,
        remove: HashSet<Immutable<PurchaseOrderItem>>
    },
    PurchaseInvoice: {
        replace: HashSet<Immutable<PurchaseInvoiceVariable>>,
        remove: HashSet<Immutable<PurchaseInvoice>>
    },
    PurchaseInvoiceItem: {
        replace: HashSet<Immutable<PurchaseInvoiceItemVariable>>,
        remove: HashSet<Immutable<PurchaseInvoiceItem>>
    },
    MaterialApprovalSlip: {
        replace: HashSet<Immutable<MaterialApprovalSlipVariable>>,
        remove: HashSet<Immutable<MaterialApprovalSlip>>
    },
    MaterialApprovalSlipItem: {
        replace: HashSet<Immutable<MaterialApprovalSlipItemVariable>>,
        remove: HashSet<Immutable<MaterialApprovalSlipItem>>
    },
    MaterialRejectionSlip: {
        replace: HashSet<Immutable<MaterialRejectionSlipVariable>>,
        remove: HashSet<Immutable<MaterialRejectionSlip>>
    },
    MaterialRejectionSlipItem: {
        replace: HashSet<Immutable<MaterialRejectionSlipItemVariable>>,
        remove: HashSet<Immutable<MaterialRejectionSlipItem>>
    },
    MaterialReturnSlip: {
        replace: HashSet<Immutable<MaterialReturnSlipVariable>>,
        remove: HashSet<Immutable<MaterialReturnSlip>>
    },
    MaterialReturnSlipItem: {
        replace: HashSet<Immutable<MaterialReturnSlipItemVariable>>,
        remove: HashSet<Immutable<MaterialReturnSlipItem>>
    },
    MaterialRequistionSlip: {
        replace: HashSet<Immutable<MaterialRequistionSlipVariable>>,
        remove: HashSet<Immutable<MaterialRequistionSlip>>
    },
    MaterialRequistionSlipItem: {
        replace: HashSet<Immutable<MaterialRequistionSlipItemVariable>>,
        remove: HashSet<Immutable<MaterialRequistionSlipItem>>
    },
    BOM: {
        replace: HashSet<Immutable<BOMVariable>>,
        remove: HashSet<Immutable<BOM>>
    },
    BOMItem: {
        replace: HashSet<Immutable<BOMItemVariable>>,
        remove: HashSet<Immutable<BOMItem>>
    },
    ProductionPreparationSlip: {
        replace: HashSet<Immutable<ProductionPreparationSlipVariable>>,
        remove: HashSet<Immutable<ProductionPreparationSlip>>
    },
    ProductionPreparationSlipItem: {
        replace: HashSet<Immutable<ProductionPreparationSlipItemVariable>>,
        remove: HashSet<Immutable<ProductionPreparationSlipItem>>
    },
    ScrapMaterialSlip: {
        replace: HashSet<Immutable<ScrapMaterialSlipVariable>>,
        remove: HashSet<Immutable<ScrapMaterialSlip>>
    },
    TransferMaterialSlip: {
        replace: HashSet<Immutable<TransferMaterialSlipVariable>>,
        remove: HashSet<Immutable<TransferMaterialSlip>>
    },
    WarehouseAcceptanceSlip: {
        replace: HashSet<Immutable<WarehouseAcceptanceSlipVariable>>,
        remove: HashSet<Immutable<WarehouseAcceptanceSlip>>
    }
}

export class DiffVariable {
    [immerable] = true
    // readonly id: number
    active: boolean
    variables: DiffVariables

    constructor(id: number = -1, active: boolean = true, variables: DiffVariables = {
        Region: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        Country: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        State: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        District: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        Subdistrict: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        PostalCode: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        Address: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        Company: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        CompanyAddress: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        CompanyTagGroup: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        CompanyTag: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        MappingCompanyTag: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        Contact: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        ContactAddress: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        CompanyContact: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        Currency: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        CurrencyRate: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        Memo: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        Bank: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        BankBranch: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        BankAccount: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        BankTransaction: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        CompanyBankAccount: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        ProductCategoryGroup: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        ProductCategory: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        Product: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        ProductTagGroup: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        ProductTag: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        MappingProductTag: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        UOM: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        Indent: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        IndentItem: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        CompanyProduct: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        Quotation: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        QuotationItem: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        PurchaseOrder: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        PurchaseOrderItem: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        PurchaseInvoice: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        PurchaseInvoiceItem: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        MaterialApprovalSlip: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        MaterialApprovalSlipItem: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        MaterialRejectionSlip: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        MaterialRejectionSlipItem: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        MaterialReturnSlip: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        MaterialReturnSlipItem: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        MaterialRequistionSlip: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        MaterialRequistionSlipItem: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        BOM: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        BOMItem: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        ProductionPreparationSlip: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        ProductionPreparationSlipItem: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        ScrapMaterialSlip: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        TransferMaterialSlip: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        WarehouseAcceptanceSlip: {
            replace: HashSet.of(),
            remove: HashSet.of()
        }
    }) {
        // this.id = id
        this.active = active
        this.variables = variables
    }

    equals(other: DiffVariable): boolean {
        if (!other) {
            return false;
        }
        return false
        // return this.id === other.id
    }

    hashCode(): number {
        return 0
    }

    toString(): string {
        return JSON.stringify(this, null, 2)
    }

    toRow(): DiffRow {
        return new DiffRow({
            Region: {
                replace: this.variables.Region.replace.toArray().map(x => x.toRow()),
                remove: this.variables.Region.remove.toArray().map(x => x.hashCode())
            },
            Country: {
                replace: this.variables.Country.replace.toArray().map(x => x.toRow()),
                remove: this.variables.Country.remove.toArray().map(x => x.hashCode())
            },
            State: {
                replace: this.variables.State.replace.toArray().map(x => x.toRow()),
                remove: this.variables.State.remove.toArray().map(x => x.hashCode())
            },
            District: {
                replace: this.variables.District.replace.toArray().map(x => x.toRow()),
                remove: this.variables.District.remove.toArray().map(x => x.hashCode())
            },
            Subdistrict: {
                replace: this.variables.Subdistrict.replace.toArray().map(x => x.toRow()),
                remove: this.variables.Subdistrict.remove.toArray().map(x => x.hashCode())
            },
            PostalCode: {
                replace: this.variables.PostalCode.replace.toArray().map(x => x.toRow()),
                remove: this.variables.PostalCode.remove.toArray().map(x => x.hashCode())
            },
            Address: {
                replace: this.variables.Address.replace.toArray().map(x => x.toRow()),
                remove: this.variables.Address.remove.toArray().map(x => x.hashCode())
            },
            Company: {
                replace: this.variables.Company.replace.toArray().map(x => x.toRow()),
                remove: this.variables.Company.remove.toArray().map(x => x.hashCode())
            },
            CompanyAddress: {
                replace: this.variables.CompanyAddress.replace.toArray().map(x => x.toRow()),
                remove: this.variables.CompanyAddress.remove.toArray().map(x => x.hashCode())
            },
            CompanyTagGroup: {
                replace: this.variables.CompanyTagGroup.replace.toArray().map(x => x.toRow()),
                remove: this.variables.CompanyTagGroup.remove.toArray().map(x => x.hashCode())
            },
            CompanyTag: {
                replace: this.variables.CompanyTag.replace.toArray().map(x => x.toRow()),
                remove: this.variables.CompanyTag.remove.toArray().map(x => x.hashCode())
            },
            MappingCompanyTag: {
                replace: this.variables.MappingCompanyTag.replace.toArray().map(x => x.toRow()),
                remove: this.variables.MappingCompanyTag.remove.toArray().map(x => x.hashCode())
            },
            Contact: {
                replace: this.variables.Contact.replace.toArray().map(x => x.toRow()),
                remove: this.variables.Contact.remove.toArray().map(x => x.hashCode())
            },
            ContactAddress: {
                replace: this.variables.ContactAddress.replace.toArray().map(x => x.toRow()),
                remove: this.variables.ContactAddress.remove.toArray().map(x => x.hashCode())
            },
            CompanyContact: {
                replace: this.variables.CompanyContact.replace.toArray().map(x => x.toRow()),
                remove: this.variables.CompanyContact.remove.toArray().map(x => x.hashCode())
            },
            Currency: {
                replace: this.variables.Currency.replace.toArray().map(x => x.toRow()),
                remove: this.variables.Currency.remove.toArray().map(x => x.hashCode())
            },
            CurrencyRate: {
                replace: this.variables.CurrencyRate.replace.toArray().map(x => x.toRow()),
                remove: this.variables.CurrencyRate.remove.toArray().map(x => x.hashCode())
            },
            Memo: {
                replace: this.variables.Memo.replace.toArray().map(x => x.toRow()),
                remove: this.variables.Memo.remove.toArray().map(x => x.hashCode())
            },
            Bank: {
                replace: this.variables.Bank.replace.toArray().map(x => x.toRow()),
                remove: this.variables.Bank.remove.toArray().map(x => x.hashCode())
            },
            BankBranch: {
                replace: this.variables.BankBranch.replace.toArray().map(x => x.toRow()),
                remove: this.variables.BankBranch.remove.toArray().map(x => x.hashCode())
            },
            BankAccount: {
                replace: this.variables.BankAccount.replace.toArray().map(x => x.toRow()),
                remove: this.variables.BankAccount.remove.toArray().map(x => x.hashCode())
            },
            BankTransaction: {
                replace: this.variables.BankTransaction.replace.toArray().map(x => x.toRow()),
                remove: this.variables.BankTransaction.remove.toArray().map(x => x.hashCode())
            },
            CompanyBankAccount: {
                replace: this.variables.CompanyBankAccount.replace.toArray().map(x => x.toRow()),
                remove: this.variables.CompanyBankAccount.remove.toArray().map(x => x.hashCode())
            },
            ProductCategoryGroup: {
                replace: this.variables.ProductCategoryGroup.replace.toArray().map(x => x.toRow()),
                remove: this.variables.ProductCategoryGroup.remove.toArray().map(x => x.hashCode())
            },
            ProductCategory: {
                replace: this.variables.ProductCategory.replace.toArray().map(x => x.toRow()),
                remove: this.variables.ProductCategory.remove.toArray().map(x => x.hashCode())
            },
            Product: {
                replace: this.variables.Product.replace.toArray().map(x => x.toRow()),
                remove: this.variables.Product.remove.toArray().map(x => x.hashCode())
            },
            ProductTagGroup: {
                replace: this.variables.ProductTagGroup.replace.toArray().map(x => x.toRow()),
                remove: this.variables.ProductTagGroup.remove.toArray().map(x => x.hashCode())
            },
            ProductTag: {
                replace: this.variables.ProductTag.replace.toArray().map(x => x.toRow()),
                remove: this.variables.ProductTag.remove.toArray().map(x => x.hashCode())
            },
            MappingProductTag: {
                replace: this.variables.MappingProductTag.replace.toArray().map(x => x.toRow()),
                remove: this.variables.MappingProductTag.remove.toArray().map(x => x.hashCode())
            },
            UOM: {
                replace: this.variables.UOM.replace.toArray().map(x => x.toRow()),
                remove: this.variables.UOM.remove.toArray().map(x => x.hashCode())
            },
            Indent: {
                replace: this.variables.Indent.replace.toArray().map(x => x.toRow()),
                remove: this.variables.Indent.remove.toArray().map(x => x.hashCode())
            },
            IndentItem: {
                replace: this.variables.IndentItem.replace.toArray().map(x => x.toRow()),
                remove: this.variables.IndentItem.remove.toArray().map(x => x.hashCode())
            },
            CompanyProduct: {
                replace: this.variables.CompanyProduct.replace.toArray().map(x => x.toRow()),
                remove: this.variables.CompanyProduct.remove.toArray().map(x => x.hashCode())
            },
            Quotation: {
                replace: this.variables.Quotation.replace.toArray().map(x => x.toRow()),
                remove: this.variables.Quotation.remove.toArray().map(x => x.hashCode())
            },
            QuotationItem: {
                replace: this.variables.QuotationItem.replace.toArray().map(x => x.toRow()),
                remove: this.variables.QuotationItem.remove.toArray().map(x => x.hashCode())
            },
            PurchaseOrder: {
                replace: this.variables.PurchaseOrder.replace.toArray().map(x => x.toRow()),
                remove: this.variables.PurchaseOrder.remove.toArray().map(x => x.hashCode())
            },
            PurchaseOrderItem: {
                replace: this.variables.PurchaseOrderItem.replace.toArray().map(x => x.toRow()),
                remove: this.variables.PurchaseOrderItem.remove.toArray().map(x => x.hashCode())
            },
            PurchaseInvoice: {
                replace: this.variables.PurchaseInvoice.replace.toArray().map(x => x.toRow()),
                remove: this.variables.PurchaseInvoice.remove.toArray().map(x => x.hashCode())
            },
            PurchaseInvoiceItem: {
                replace: this.variables.PurchaseInvoiceItem.replace.toArray().map(x => x.toRow()),
                remove: this.variables.PurchaseInvoiceItem.remove.toArray().map(x => x.hashCode())
            },
            MaterialApprovalSlip: {
                replace: this.variables.MaterialApprovalSlip.replace.toArray().map(x => x.toRow()),
                remove: this.variables.MaterialApprovalSlip.remove.toArray().map(x => x.hashCode())
            },
            MaterialApprovalSlipItem: {
                replace: this.variables.MaterialApprovalSlipItem.replace.toArray().map(x => x.toRow()),
                remove: this.variables.MaterialApprovalSlipItem.remove.toArray().map(x => x.hashCode())
            },
            MaterialRejectionSlip: {
                replace: this.variables.MaterialRejectionSlip.replace.toArray().map(x => x.toRow()),
                remove: this.variables.MaterialRejectionSlip.remove.toArray().map(x => x.hashCode())
            },
            MaterialRejectionSlipItem: {
                replace: this.variables.MaterialRejectionSlipItem.replace.toArray().map(x => x.toRow()),
                remove: this.variables.MaterialRejectionSlipItem.remove.toArray().map(x => x.hashCode())
            },
            MaterialReturnSlip: {
                replace: this.variables.MaterialReturnSlip.replace.toArray().map(x => x.toRow()),
                remove: this.variables.MaterialReturnSlip.remove.toArray().map(x => x.hashCode())
            },
            MaterialReturnSlipItem: {
                replace: this.variables.MaterialReturnSlipItem.replace.toArray().map(x => x.toRow()),
                remove: this.variables.MaterialReturnSlipItem.remove.toArray().map(x => x.hashCode())
            },
            MaterialRequistionSlip: {
                replace: this.variables.MaterialRequistionSlip.replace.toArray().map(x => x.toRow()),
                remove: this.variables.MaterialRequistionSlip.remove.toArray().map(x => x.hashCode())
            },
            MaterialRequistionSlipItem: {
                replace: this.variables.MaterialRequistionSlipItem.replace.toArray().map(x => x.toRow()),
                remove: this.variables.MaterialRequistionSlipItem.remove.toArray().map(x => x.hashCode())
            },
            BOM: {
                replace: this.variables.BOM.replace.toArray().map(x => x.toRow()),
                remove: this.variables.BOM.remove.toArray().map(x => x.hashCode())
            },
            BOMItem: {
                replace: this.variables.BOMItem.replace.toArray().map(x => x.toRow()),
                remove: this.variables.BOMItem.remove.toArray().map(x => x.hashCode())
            },
            ProductionPreparationSlip: {
                replace: this.variables.ProductionPreparationSlip.replace.toArray().map(x => x.toRow()),
                remove: this.variables.ProductionPreparationSlip.remove.toArray().map(x => x.hashCode())
            },
            ProductionPreparationSlipItem: {
                replace: this.variables.ProductionPreparationSlipItem.replace.toArray().map(x => x.toRow()),
                remove: this.variables.ProductionPreparationSlipItem.remove.toArray().map(x => x.hashCode())
            },
            ScrapMaterialSlip: {
                replace: this.variables.ScrapMaterialSlip.replace.toArray().map(x => x.toRow()),
                remove: this.variables.ScrapMaterialSlip.remove.toArray().map(x => x.hashCode())
            },
            TransferMaterialSlip: {
                replace: this.variables.TransferMaterialSlip.replace.toArray().map(x => x.toRow()),
                remove: this.variables.TransferMaterialSlip.remove.toArray().map(x => x.hashCode())
            },
            WarehouseAcceptanceSlip: {
                replace: this.variables.WarehouseAcceptanceSlip.replace.toArray().map(x => x.toRow()),
                remove: this.variables.WarehouseAcceptanceSlip.remove.toArray().map(x => x.hashCode())
            }
        })
    }
}

export function getReplaceVariableDiff(variable: Immutable<Variable>): DiffVariable {
    const diff: DiffVariable = new DiffVariable()
    switch (variable.typeName) {
        case 'Region': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'Country': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'State': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'District': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'Subdistrict': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'PostalCode': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'Address': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'Company': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'CompanyAddress': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'CompanyTagGroup': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'CompanyTag': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'MappingCompanyTag': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'Contact': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'ContactAddress': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'CompanyContact': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'Currency': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'CurrencyRate': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'Memo': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'Bank': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'BankBranch': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'BankAccount': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'BankTransaction': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'CompanyBankAccount': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'ProductCategoryGroup': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'ProductCategory': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'Product': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'ProductTagGroup': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'ProductTag': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'MappingProductTag': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'UOM': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'Indent': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'IndentItem': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'CompanyProduct': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'Quotation': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'QuotationItem': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'PurchaseOrder': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'PurchaseOrderItem': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'PurchaseInvoice': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'PurchaseInvoiceItem': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'MaterialApprovalSlip': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'MaterialApprovalSlipItem': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'MaterialRejectionSlip': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'MaterialRejectionSlipItem': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'MaterialReturnSlip': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'MaterialReturnSlipItem': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'MaterialRequistionSlip': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'MaterialRequistionSlipItem': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'BOM': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'BOMItem': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'ProductionPreparationSlip': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'ProductionPreparationSlipItem': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'ScrapMaterialSlip': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'TransferMaterialSlip': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'WarehouseAcceptanceSlip': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        default: {
            const _exhaustiveCheck: never = variable
            return _exhaustiveCheck
        }
    }
    return diff
}

export function getRemoveVariableDiff(typeName: NonPrimitiveType, id: number): DiffVariable {
    const diff: DiffVariable = new DiffVariable()
    switch (typeName) {
        case 'Region': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new Region(id))
            break
        }
        case 'Country': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new Country(id))
            break
        }
        case 'State': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new State(id))
            break
        }
        case 'District': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new District(id))
            break
        }
        case 'Subdistrict': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new Subdistrict(id))
            break
        }
        case 'PostalCode': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new PostalCode(id))
            break
        }
        case 'Address': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new Address(id))
            break
        }
        case 'Company': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new Company(id))
            break
        }
        case 'CompanyAddress': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new CompanyAddress(id))
            break
        }
        case 'CompanyTagGroup': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new CompanyTagGroup(id))
            break
        }
        case 'CompanyTag': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new CompanyTag(id))
            break
        }
        case 'MappingCompanyTag': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new MappingCompanyTag(id))
            break
        }
        case 'Contact': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new Contact(id))
            break
        }
        case 'ContactAddress': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new ContactAddress(id))
            break
        }
        case 'CompanyContact': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new CompanyContact(id))
            break
        }
        case 'Currency': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new Currency(id))
            break
        }
        case 'CurrencyRate': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new CurrencyRate(id))
            break
        }
        case 'Memo': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new Memo(id))
            break
        }
        case 'Bank': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new Bank(id))
            break
        }
        case 'BankBranch': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new BankBranch(id))
            break
        }
        case 'BankAccount': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new BankAccount(id))
            break
        }
        case 'BankTransaction': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new BankTransaction(id))
            break
        }
        case 'CompanyBankAccount': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new CompanyBankAccount(id))
            break
        }
        case 'ProductCategoryGroup': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new ProductCategoryGroup(id))
            break
        }
        case 'ProductCategory': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new ProductCategory(id))
            break
        }
        case 'Product': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new Product(id))
            break
        }
        case 'ProductTagGroup': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new ProductTagGroup(id))
            break
        }
        case 'ProductTag': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new ProductTag(id))
            break
        }
        case 'MappingProductTag': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new MappingProductTag(id))
            break
        }
        case 'UOM': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new UOM(id))
            break
        }
        case 'Indent': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new Indent(id))
            break
        }
        case 'IndentItem': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new IndentItem(id))
            break
        }
        case 'CompanyProduct': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new CompanyProduct(id))
            break
        }
        case 'Quotation': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new Quotation(id))
            break
        }
        case 'QuotationItem': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new QuotationItem(id))
            break
        }
        case 'PurchaseOrder': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new PurchaseOrder(id))
            break
        }
        case 'PurchaseOrderItem': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new PurchaseOrderItem(id))
            break
        }
        case 'PurchaseInvoice': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new PurchaseInvoice(id))
            break
        }
        case 'PurchaseInvoiceItem': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new PurchaseInvoiceItem(id))
            break
        }
        case 'MaterialApprovalSlip': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new MaterialApprovalSlip(id))
            break
        }
        case 'MaterialApprovalSlipItem': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new MaterialApprovalSlipItem(id))
            break
        }
        case 'MaterialRejectionSlip': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new MaterialRejectionSlip(id))
            break
        }
        case 'MaterialRejectionSlipItem': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new MaterialRejectionSlipItem(id))
            break
        }
        case 'MaterialReturnSlip': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new MaterialReturnSlip(id))
            break
        }
        case 'MaterialReturnSlipItem': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new MaterialReturnSlipItem(id))
            break
        }
        case 'MaterialRequistionSlip': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new MaterialRequistionSlip(id))
            break
        }
        case 'MaterialRequistionSlipItem': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new MaterialRequistionSlipItem(id))
            break
        }
        case 'BOM': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new BOM(id))
            break
        }
        case 'BOMItem': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new BOMItem(id))
            break
        }
        case 'ProductionPreparationSlip': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new ProductionPreparationSlip(id))
            break
        }
        case 'ProductionPreparationSlipItem': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new ProductionPreparationSlipItem(id))
            break
        }
        case 'ScrapMaterialSlip': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new ScrapMaterialSlip(id))
            break
        }
        case 'TransferMaterialSlip': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new TransferMaterialSlip(id))
            break
        }
        case 'WarehouseAcceptanceSlip': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new WarehouseAcceptanceSlip(id))
            break
        }
        default: {
            const _exhaustiveCheck: never = typeName
            return _exhaustiveCheck
        }
    }
    return diff
}

export async function getVariable(typeName: NonPrimitiveType, id: number, overlay: Vector<DiffVariable> = Vector.of()): Promise<Variable | undefined> {
    const diffs: Array<DiffVariable> = (await db.diffs.orderBy('id').reverse().toArray()).map(x => DiffRow.toVariable(x))
    switch (typeName) {
        case 'Region': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return RegionRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'Country': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return CountryRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'State': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return StateRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'District': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return DistrictRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'Subdistrict': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return SubdistrictRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'PostalCode': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return PostalCodeRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'Address': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return AddressRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'Company': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return CompanyRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'CompanyAddress': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return CompanyAddressRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'CompanyTagGroup': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return CompanyTagGroupRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'CompanyTag': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return CompanyTagRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'MappingCompanyTag': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return MappingCompanyTagRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'Contact': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return ContactRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'ContactAddress': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return ContactAddressRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'CompanyContact': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return CompanyContactRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'Currency': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return CurrencyRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'CurrencyRate': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return CurrencyRateRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'Memo': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return MemoRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'Bank': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return BankRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'BankBranch': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return BankBranchRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'BankAccount': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return BankAccountRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'BankTransaction': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return BankTransactionRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'CompanyBankAccount': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return CompanyBankAccountRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'ProductCategoryGroup': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return ProductCategoryGroupRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'ProductCategory': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return ProductCategoryRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'Product': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return ProductRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'ProductTagGroup': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return ProductTagGroupRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'ProductTag': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return ProductTagRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'MappingProductTag': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return MappingProductTagRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'UOM': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return UOMRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'Indent': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return IndentRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'IndentItem': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return IndentItemRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'CompanyProduct': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return CompanyProductRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'Quotation': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return QuotationRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'QuotationItem': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return QuotationItemRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'PurchaseOrder': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return PurchaseOrderRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'PurchaseOrderItem': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return PurchaseOrderItemRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'PurchaseInvoice': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return PurchaseInvoiceRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'PurchaseInvoiceItem': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return PurchaseInvoiceItemRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'MaterialApprovalSlip': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return MaterialApprovalSlipRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'MaterialApprovalSlipItem': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return MaterialApprovalSlipItemRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'MaterialRejectionSlip': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return MaterialRejectionSlipRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'MaterialRejectionSlipItem': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return MaterialRejectionSlipItemRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'MaterialReturnSlip': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return MaterialReturnSlipRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'MaterialReturnSlipItem': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return MaterialReturnSlipItemRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'MaterialRequistionSlip': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return MaterialRequistionSlipRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'MaterialRequistionSlipItem': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return MaterialRequistionSlipItemRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'BOM': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return BOMRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'BOMItem': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return BOMItemRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'ProductionPreparationSlip': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return ProductionPreparationSlipRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'ProductionPreparationSlipItem': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return ProductionPreparationSlipItemRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'ScrapMaterialSlip': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return ScrapMaterialSlipRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'TransferMaterialSlip': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return TransferMaterialSlipRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'WarehouseAcceptanceSlip': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables[typeName].replace.toArray()) {
                    if (variable.id.hashCode() === id) {
                        return variable as Variable
                    }
                }
                if (diff.variables[typeName].remove.anyMatch(x => x.hashCode() === id)) {
                    return undefined
                }
            }
            const row = await db[typeName].get(String(id))
            if (row !== undefined) {
                return WarehouseAcceptanceSlipRow.toVariable(row) as Variable
            }
            return undefined
        }
        default: {
            const _exhaustiveCheck: never = typeName
            return _exhaustiveCheck
        }
    }
}

export async function getVariables(typeName: NonPrimitiveType, overlay: Vector<DiffVariable> = Vector.of()): Promise<Vector<Immutable<Variable>>> {
    const diffs: Array<DiffVariable> = (await db.diffs.orderBy('id').reverse().toArray()).map(x => DiffRow.toVariable(x))
    const rows = await db[typeName].orderBy('variableName').toArray()
    switch (typeName) {
        case 'Region': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => RegionRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'Country': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => CountryRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'State': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => StateRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'District': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => DistrictRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'Subdistrict': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => SubdistrictRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'PostalCode': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => PostalCodeRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'Address': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => AddressRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'Company': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => CompanyRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'CompanyAddress': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => CompanyAddressRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'CompanyTagGroup': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => CompanyTagGroupRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'CompanyTag': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => CompanyTagRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'MappingCompanyTag': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => MappingCompanyTagRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'Contact': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => ContactRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'ContactAddress': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => ContactAddressRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'CompanyContact': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => CompanyContactRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'Currency': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => CurrencyRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'CurrencyRate': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => CurrencyRateRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'Memo': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => MemoRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'Bank': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => BankRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'BankBranch': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => BankBranchRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'BankAccount': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => BankAccountRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'BankTransaction': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => BankTransactionRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'CompanyBankAccount': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => CompanyBankAccountRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'ProductCategoryGroup': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => ProductCategoryGroupRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'ProductCategory': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => ProductCategoryRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'Product': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => ProductRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'ProductTagGroup': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => ProductTagGroupRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'ProductTag': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => ProductTagRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'MappingProductTag': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => MappingProductTagRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'UOM': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => UOMRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'Indent': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => IndentRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'IndentItem': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => IndentItemRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'CompanyProduct': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => CompanyProductRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'Quotation': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => QuotationRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'QuotationItem': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => QuotationItemRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'PurchaseOrder': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => PurchaseOrderRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'PurchaseOrderItem': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => PurchaseOrderItemRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'PurchaseInvoice': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => PurchaseInvoiceRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'PurchaseInvoiceItem': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => PurchaseInvoiceItemRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'MaterialApprovalSlip': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => MaterialApprovalSlipRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'MaterialApprovalSlipItem': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => MaterialApprovalSlipItemRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'MaterialRejectionSlip': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => MaterialRejectionSlipRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'MaterialRejectionSlipItem': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => MaterialRejectionSlipItemRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'MaterialReturnSlip': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => MaterialReturnSlipRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'MaterialReturnSlipItem': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => MaterialReturnSlipItemRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'MaterialRequistionSlip': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => MaterialRequistionSlipRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'MaterialRequistionSlipItem': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => MaterialRequistionSlipItemRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'BOM': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => BOMRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'BOMItem': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => BOMItemRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'ProductionPreparationSlip': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => ProductionPreparationSlipRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'ProductionPreparationSlipItem': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => ProductionPreparationSlipItemRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'ScrapMaterialSlip': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => ScrapMaterialSlipRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'TransferMaterialSlip': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => TransferMaterialSlipRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'WarehouseAcceptanceSlip': {
            let composedVariables = Vector.of<Immutable<Variable>>().appendAll(rows ? rows.map(x => WarehouseAcceptanceSlipRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.id.hashCode() === y.hashCode())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        default: {
            const _exhaustiveCheck: never = typeName
            return _exhaustiveCheck
        }
    }
}
