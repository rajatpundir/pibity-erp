import { HashSet, Vector } from 'prelude-ts'
import { immerable, Immutable } from 'immer'
import { Variable, VariableName, ProductVariable, UOMVariable, IndentVariable, IndentItemVariable, SupplierVariable, SupplierProductVariable, QuotationVariable, QuotationItemVariable, PurchaseOrderVariable, PurchaseOrderItemVariable, PurchaseInvoiceVariable, PurchaseInvoiceItemVariable, MaterialApprovalSlipVariable, MaterialApprovalSlipItemVariable, MaterialRejectionSlipVariable, MaterialRejectionSlipItemVariable, MaterialReturnSlipVariable, MaterialReturnSlipItemVariable, MaterialRequistionSlipVariable, MaterialRequistionSlipItemVariable, BOMVariable, BOMItemVariable, ProductionPreparationSlipVariable, ProductionPreparationSlipItemVariable, ScrapMaterialSlipVariable, TransferMaterialSlipVariable, WarehouseAcceptanceSlipVariable, Product, UOM, Indent, IndentItem, Supplier, SupplierProduct, Quotation, QuotationItem, PurchaseOrder, PurchaseOrderItem, PurchaseInvoice, PurchaseInvoiceItem, MaterialApprovalSlip, MaterialApprovalSlipItem, MaterialRejectionSlip, MaterialRejectionSlipItem, MaterialReturnSlip, MaterialReturnSlipItem, MaterialRequistionSlip, MaterialRequistionSlipItem, BOM, BOMItem, ProductionPreparationSlip, ProductionPreparationSlipItem, ScrapMaterialSlip, TransferMaterialSlip, WarehouseAcceptanceSlip, RegionVariable, Region, CountryVariable, Country, StateVariable, State, DistrictVariable, District, SubdistrictVariable, Subdistrict, PostalCodeVariable, PostalCode, AddressVariable, Address, ServiceAreaVariable, ServiceArea, CompanyTypeVariable, CompanyType, BankVariable, Bank, BankBranchVariable, BankBranch, BankAccountVariable, BankAccount, SupplierAddressVariable, SupplierAddress, SupplierContactVariable, SupplierContact, SupplierBankAccountVariable, SupplierBankAccount } from './variables'
import { NonPrimitiveType } from './types'
import { AddressRow, BankAccountRow, BankBranchRow, BankRow, BOMItemRow, BOMRow, CompanyTypeRow, CountryRow, DiffRow, DistrictRow, IndentItemRow, IndentRow, MaterialApprovalSlipItemRow, MaterialApprovalSlipRow, MaterialRejectionSlipItemRow, MaterialRejectionSlipRow, MaterialRequistionSlipItemRow, MaterialRequistionSlipRow, MaterialReturnSlipItemRow, MaterialReturnSlipRow, PostalCodeRow, ProductionPreparationSlipItemRow, ProductionPreparationSlipRow, ProductRow, PurchaseInvoiceItemRow, PurchaseInvoiceRow, PurchaseOrderItemRow, PurchaseOrderRow, QuotationItemRow, QuotationRow, RegionRow, ScrapMaterialSlipRow, ServiceAreaRow, StateRow, SubdistrictRow, SupplierAddressRow, SupplierBankAccountRow, SupplierContactRow, SupplierProductRow, SupplierRow, TransferMaterialSlipRow, UOMRow, WarehouseAcceptanceSlipRow } from './rows'
import { db } from './dexie'

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
    ServiceArea: {
        replace: HashSet<Immutable<ServiceAreaVariable>>,
        remove: HashSet<Immutable<ServiceArea>>
    },
    CompanyType: {
        replace: HashSet<Immutable<CompanyTypeVariable>>,
        remove: HashSet<Immutable<CompanyType>>
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
    Supplier: {
        replace: HashSet<Immutable<SupplierVariable>>,
        remove: HashSet<Immutable<Supplier>>
    },
    SupplierAddress: {
        replace: HashSet<Immutable<SupplierAddressVariable>>,
        remove: HashSet<Immutable<SupplierAddress>>
    },
    SupplierContact: {
        replace: HashSet<Immutable<SupplierContactVariable>>,
        remove: HashSet<Immutable<SupplierContact>>
    },
    SupplierBankAccount: {
        replace: HashSet<Immutable<SupplierBankAccountVariable>>,
        remove: HashSet<Immutable<SupplierBankAccount>>
    },
    Product: {
        replace: HashSet<Immutable<ProductVariable>>
        remove: HashSet<Immutable<Product>>
    }
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
    SupplierProduct: {
        replace: HashSet<Immutable<SupplierProductVariable>>,
        remove: HashSet<Immutable<SupplierProduct>>
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
        ServiceArea: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        CompanyType: {
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
        Supplier: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        SupplierAddress: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        SupplierContact: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        SupplierBankAccount: {
            replace: HashSet.of(),
            remove: HashSet.of()
        },
        Product: {
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
        SupplierProduct: {
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
                remove: this.variables.Region.remove.toArray().map(x => x.toString())
            },
            Country: {
                replace: this.variables.Country.replace.toArray().map(x => x.toRow()),
                remove: this.variables.Country.remove.toArray().map(x => x.toString())
            },
            State: {
                replace: this.variables.State.replace.toArray().map(x => x.toRow()),
                remove: this.variables.State.remove.toArray().map(x => x.toString())
            },
            District: {
                replace: this.variables.District.replace.toArray().map(x => x.toRow()),
                remove: this.variables.District.remove.toArray().map(x => x.toString())
            },
            Subdistrict: {
                replace: this.variables.Subdistrict.replace.toArray().map(x => x.toRow()),
                remove: this.variables.Subdistrict.remove.toArray().map(x => x.toString())
            },
            PostalCode: {
                replace: this.variables.PostalCode.replace.toArray().map(x => x.toRow()),
                remove: this.variables.PostalCode.remove.toArray().map(x => x.toString())
            },
            Address: {
                replace: this.variables.Address.replace.toArray().map(x => x.toRow()),
                remove: this.variables.Address.remove.toArray().map(x => x.toString())
            },
            ServiceArea: {
                replace: this.variables.ServiceArea.replace.toArray().map(x => x.toRow()),
                remove: this.variables.ServiceArea.remove.toArray().map(x => x.toString())
            },
            CompanyType: {
                replace: this.variables.CompanyType.replace.toArray().map(x => x.toRow()),
                remove: this.variables.CompanyType.remove.toArray().map(x => x.toString())
            },
            Bank: {
                replace: this.variables.Bank.replace.toArray().map(x => x.toRow()),
                remove: this.variables.Bank.remove.toArray().map(x => x.toString())
            },
            BankBranch: {
                replace: this.variables.BankBranch.replace.toArray().map(x => x.toRow()),
                remove: this.variables.BankBranch.remove.toArray().map(x => x.toString())
            },
            BankAccount: {
                replace: this.variables.BankAccount.replace.toArray().map(x => x.toRow()),
                remove: this.variables.BankAccount.remove.toArray().map(x => x.toString())
            },
            Supplier: {
                replace: this.variables.Supplier.replace.toArray().map(x => x.toRow()),
                remove: this.variables.Supplier.remove.toArray().map(x => x.toString())
            },
            SupplierAddress: {
                replace: this.variables.SupplierAddress.replace.toArray().map(x => x.toRow()),
                remove: this.variables.SupplierAddress.remove.toArray().map(x => x.toString())
            },
            SupplierContact: {
                replace: this.variables.SupplierContact.replace.toArray().map(x => x.toRow()),
                remove: this.variables.SupplierContact.remove.toArray().map(x => x.toString())
            },
            SupplierBankAccount: {
                replace: this.variables.SupplierBankAccount.replace.toArray().map(x => x.toRow()),
                remove: this.variables.SupplierBankAccount.remove.toArray().map(x => x.toString())
            },
            Product: {
                replace: this.variables.Product.replace.toArray().map(x => x.toRow()),
                remove: this.variables.Product.remove.toArray().map(x => x.toString())
            },
            UOM: {
                replace: this.variables.UOM.replace.toArray().map(x => x.toRow()),
                remove: this.variables.UOM.remove.toArray().map(x => x.toString())
            },
            Indent: {
                replace: this.variables.Indent.replace.toArray().map(x => x.toRow()),
                remove: this.variables.Indent.remove.toArray().map(x => x.toString())
            },
            IndentItem: {
                replace: this.variables.IndentItem.replace.toArray().map(x => x.toRow()),
                remove: this.variables.IndentItem.remove.toArray().map(x => x.toString())
            },
            SupplierProduct: {
                replace: this.variables.SupplierProduct.replace.toArray().map(x => x.toRow()),
                remove: this.variables.SupplierProduct.remove.toArray().map(x => x.toString())
            },
            Quotation: {
                replace: this.variables.Quotation.replace.toArray().map(x => x.toRow()),
                remove: this.variables.Quotation.remove.toArray().map(x => x.toString())
            },
            QuotationItem: {
                replace: this.variables.QuotationItem.replace.toArray().map(x => x.toRow()),
                remove: this.variables.QuotationItem.remove.toArray().map(x => x.toString())
            },
            PurchaseOrder: {
                replace: this.variables.PurchaseOrder.replace.toArray().map(x => x.toRow()),
                remove: this.variables.PurchaseOrder.remove.toArray().map(x => x.toString())
            },
            PurchaseOrderItem: {
                replace: this.variables.PurchaseOrderItem.replace.toArray().map(x => x.toRow()),
                remove: this.variables.PurchaseOrderItem.remove.toArray().map(x => x.toString())
            },
            PurchaseInvoice: {
                replace: this.variables.PurchaseInvoice.replace.toArray().map(x => x.toRow()),
                remove: this.variables.PurchaseInvoice.remove.toArray().map(x => x.toString())
            },
            PurchaseInvoiceItem: {
                replace: this.variables.PurchaseInvoiceItem.replace.toArray().map(x => x.toRow()),
                remove: this.variables.PurchaseInvoiceItem.remove.toArray().map(x => x.toString())
            },
            MaterialApprovalSlip: {
                replace: this.variables.MaterialApprovalSlip.replace.toArray().map(x => x.toRow()),
                remove: this.variables.MaterialApprovalSlip.remove.toArray().map(x => x.toString())
            },
            MaterialApprovalSlipItem: {
                replace: this.variables.MaterialApprovalSlipItem.replace.toArray().map(x => x.toRow()),
                remove: this.variables.MaterialApprovalSlipItem.remove.toArray().map(x => x.toString())
            },
            MaterialRejectionSlip: {
                replace: this.variables.MaterialRejectionSlip.replace.toArray().map(x => x.toRow()),
                remove: this.variables.MaterialRejectionSlip.remove.toArray().map(x => x.toString())
            },
            MaterialRejectionSlipItem: {
                replace: this.variables.MaterialRejectionSlipItem.replace.toArray().map(x => x.toRow()),
                remove: this.variables.MaterialRejectionSlipItem.remove.toArray().map(x => x.toString())
            },
            MaterialReturnSlip: {
                replace: this.variables.MaterialReturnSlip.replace.toArray().map(x => x.toRow()),
                remove: this.variables.MaterialReturnSlip.remove.toArray().map(x => x.toString())
            },
            MaterialReturnSlipItem: {
                replace: this.variables.MaterialReturnSlipItem.replace.toArray().map(x => x.toRow()),
                remove: this.variables.MaterialReturnSlipItem.remove.toArray().map(x => x.toString())
            },
            MaterialRequistionSlip: {
                replace: this.variables.MaterialRequistionSlip.replace.toArray().map(x => x.toRow()),
                remove: this.variables.MaterialRequistionSlip.remove.toArray().map(x => x.toString())
            },
            MaterialRequistionSlipItem: {
                replace: this.variables.MaterialRequistionSlipItem.replace.toArray().map(x => x.toRow()),
                remove: this.variables.MaterialRequistionSlipItem.remove.toArray().map(x => x.toString())
            },
            BOM: {
                replace: this.variables.BOM.replace.toArray().map(x => x.toRow()),
                remove: this.variables.BOM.remove.toArray().map(x => x.toString())
            },
            BOMItem: {
                replace: this.variables.BOMItem.replace.toArray().map(x => x.toRow()),
                remove: this.variables.BOMItem.remove.toArray().map(x => x.toString())
            },
            ProductionPreparationSlip: {
                replace: this.variables.ProductionPreparationSlip.replace.toArray().map(x => x.toRow()),
                remove: this.variables.ProductionPreparationSlip.remove.toArray().map(x => x.toString())
            },
            ProductionPreparationSlipItem: {
                replace: this.variables.ProductionPreparationSlipItem.replace.toArray().map(x => x.toRow()),
                remove: this.variables.ProductionPreparationSlipItem.remove.toArray().map(x => x.toString())
            },
            ScrapMaterialSlip: {
                replace: this.variables.ScrapMaterialSlip.replace.toArray().map(x => x.toRow()),
                remove: this.variables.ScrapMaterialSlip.remove.toArray().map(x => x.toString())
            },
            TransferMaterialSlip: {
                replace: this.variables.TransferMaterialSlip.replace.toArray().map(x => x.toRow()),
                remove: this.variables.TransferMaterialSlip.remove.toArray().map(x => x.toString())
            },
            WarehouseAcceptanceSlip: {
                replace: this.variables.WarehouseAcceptanceSlip.replace.toArray().map(x => x.toRow()),
                remove: this.variables.WarehouseAcceptanceSlip.remove.toArray().map(x => x.toString())
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
        case 'ServiceArea': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'CompanyType': {
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
        case 'Supplier': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'SupplierAddress': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'SupplierContact': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'SupplierBankAccount': {
            diff.variables[variable.typeName].replace = diff.variables[variable.typeName].replace.add(variable)
            break
        }
        case 'Product': {
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
        case 'SupplierProduct': {
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

export function getRemoveVariableDiff(typeName: NonPrimitiveType, variableName: string): DiffVariable {
    const diff: DiffVariable = new DiffVariable()
    switch (typeName) {
        case 'Region': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new Region(variableName))
            break
        }
        case 'Country': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new Country(variableName))
            break
        }
        case 'State': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new State(variableName))
            break
        }
        case 'District': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new District(variableName))
            break
        }
        case 'Subdistrict': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new Subdistrict(variableName))
            break
        }
        case 'PostalCode': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new PostalCode(variableName))
            break
        }
        case 'Address': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new Address(variableName))
            break
        }
        case 'ServiceArea': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new ServiceArea(variableName))
            break
        }
        case 'CompanyType': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new CompanyType(variableName))
            break
        }
        case 'Bank': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new Bank(variableName))
            break
        }
        case 'BankBranch': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new BankBranch(variableName))
            break
        }
        case 'BankAccount': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new BankAccount(variableName))
            break
        }
        case 'Supplier': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new Supplier(variableName))
            break
        }
        case 'SupplierAddress': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new SupplierAddress(variableName))
            break
        }
        case 'SupplierContact': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new SupplierContact(variableName))
            break
        }
        case 'SupplierBankAccount': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new SupplierBankAccount(variableName))
            break
        }
        case 'Product': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new Product(variableName))
            break
        }
        case 'UOM': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new UOM(variableName))
            break
        }
        case 'Indent': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new Indent(variableName))
            break
        }
        case 'IndentItem': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new IndentItem(variableName))
            break
        }
        case 'SupplierProduct': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new SupplierProduct(variableName))
            break
        }
        case 'Quotation': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new Quotation(variableName))
            break
        }
        case 'QuotationItem': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new QuotationItem(variableName))
            break
        }
        case 'PurchaseOrder': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new PurchaseOrder(variableName))
            break
        }
        case 'PurchaseOrderItem': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new PurchaseOrderItem(variableName))
            break
        }
        case 'PurchaseInvoice': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new PurchaseInvoice(variableName))
            break
        }
        case 'PurchaseInvoiceItem': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new PurchaseInvoiceItem(variableName))
            break
        }
        case 'MaterialApprovalSlip': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new MaterialApprovalSlip(variableName))
            break
        }
        case 'MaterialApprovalSlipItem': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new MaterialApprovalSlipItem(variableName))
            break
        }
        case 'MaterialRejectionSlip': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new MaterialRejectionSlip(variableName))
            break
        }
        case 'MaterialRejectionSlipItem': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new MaterialRejectionSlipItem(variableName))
            break
        }
        case 'MaterialReturnSlip': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new MaterialReturnSlip(variableName))
            break
        }
        case 'MaterialReturnSlipItem': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new MaterialReturnSlipItem(variableName))
            break
        }
        case 'MaterialRequistionSlip': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new MaterialRequistionSlip(variableName))
            break
        }
        case 'MaterialRequistionSlipItem': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new MaterialRequistionSlipItem(variableName))
            break
        }
        case 'BOM': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new BOM(variableName))
            break
        }
        case 'BOMItem': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new BOMItem(variableName))
            break
        }
        case 'ProductionPreparationSlip': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new ProductionPreparationSlip(variableName))
            break
        }
        case 'ProductionPreparationSlipItem': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new ProductionPreparationSlipItem(variableName))
            break
        }
        case 'ScrapMaterialSlip': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new ScrapMaterialSlip(variableName))
            break
        }
        case 'TransferMaterialSlip': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new TransferMaterialSlip(variableName))
            break
        }
        case 'WarehouseAcceptanceSlip': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new WarehouseAcceptanceSlip(variableName))
            break
        }
        default: {
            const _exhaustiveCheck: never = typeName
            return _exhaustiveCheck
        }
    }
    return diff
}

export async function getRenameVariableDiff(typeName: NonPrimitiveType, variableName: string, updatedVariableName: string): Promise<DiffVariable> {
    const diff: DiffVariable = new DiffVariable()
    const diffs = (await db.diffs.toArray())?.map(x => DiffRow.toVariable(x))
    switch (typeName) {
        case 'Region': {
            // Updated variableName affects references in Country
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new Region(variableName))
            const countriesRows = await db.countries.toArray()
            let countries: Vector<Immutable<CountryVariable>> = Vector.of<Immutable<CountryVariable>>().appendAll(countriesRows ? countriesRows.map(x => CountryRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                countries = countries.filter(x => !diff.variables.Country.remove.anyMatch(y => x.variableName.toString() === y.toString())).filter(x => !diff.variables.Country.replace.anyMatch(y => y.variableName.toString() === x.variableName.toString())).appendAll(diff.variables.Country.replace)
            })
            diff.variables.Country.replace = diff.variables.Country.replace.addAll(countries.filter(x => x.values.region.toString() === variableName).map(x => new CountryVariable(x.variableName.toString(), {
                region: new Region(updatedVariableName),
                name: x.values.name
            })))
            diff.variables.Country.remove = diff.variables.Country.remove.addAll(countries.filter(x => x.values.region.toString() === variableName).map(x => new Country(x.variableName.toString())))
            break
        }
        case 'Country': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new Country(variableName))
            break
        }
        case 'State': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new State(variableName))
            break
        }
        case 'District': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new District(variableName))
            break
        }
        case 'Subdistrict': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new Subdistrict(variableName))
            break
        }
        case 'PostalCode': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new PostalCode(variableName))
            break
        }
        case 'Address': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new Address(variableName))
            break
        }
        case 'ServiceArea': {
            // Updated variableName affects references in Supplier
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new ServiceArea(variableName))
            const supplierRows = await db.suppliers.toArray()
            let suppliers: Vector<Immutable<SupplierVariable>> = Vector.of<Immutable<SupplierVariable>>().appendAll(supplierRows ? supplierRows.map(x => SupplierRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                suppliers = suppliers.filter(x => !diff.variables.Supplier.remove.anyMatch(y => x.variableName.toString() === y.toString())).filter(x => !diff.variables.Supplier.replace.anyMatch(y => y.variableName.toString() === x.variableName.toString())).appendAll(diff.variables.Supplier.replace)
            })
            diff.variables.Supplier.replace = diff.variables.Supplier.replace.addAll(suppliers.filter(x => x.values.serviceArea.toString() === variableName).map(x => new SupplierVariable(x.variableName.toString(), {
                email: x.values.email,
                telephone: x.values.telephone,
                mobile: x.values.mobile,
                website: x.values.website,
                companyType: new CompanyType(x.values.companyType.toString()),
                serviceArea: new ServiceArea(updatedVariableName),
                gstin: x.values.gstin,
                pan: x.values.pan,
                iec: x.values.iec
            })))
            diff.variables.Supplier.remove = diff.variables.Supplier.remove.addAll(suppliers.filter(x => x.values.serviceArea.toString() === variableName).map(x => new Supplier(x.variableName.toString())))
            break
        }
        case 'CompanyType': {
            // Updated variableName affects references in Supplier
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new CompanyType(variableName))
            const supplierRows = await db.suppliers.toArray()
            let suppliers: Vector<Immutable<SupplierVariable>> = Vector.of<Immutable<SupplierVariable>>().appendAll(supplierRows ? supplierRows.map(x => SupplierRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                suppliers = suppliers.filter(x => !diff.variables.Supplier.remove.anyMatch(y => x.variableName.toString() === y.toString())).filter(x => !diff.variables.Supplier.replace.anyMatch(y => y.variableName.toString() === x.variableName.toString())).appendAll(diff.variables.Supplier.replace)
            })
            diff.variables.Supplier.replace = diff.variables.Supplier.replace.addAll(suppliers.filter(x => x.values.serviceArea.toString() === variableName).map(x => new SupplierVariable(x.variableName.toString(), {
                email: x.values.email,
                telephone: x.values.telephone,
                mobile: x.values.mobile,
                website: x.values.website,
                companyType: new CompanyType(updatedVariableName),
                serviceArea: new ServiceArea(x.values.serviceArea.toString()),
                gstin: x.values.gstin,
                pan: x.values.pan,
                iec: x.values.iec
            })))
            diff.variables.Supplier.remove = diff.variables.Supplier.remove.addAll(suppliers.filter(x => x.values.serviceArea.toString() === variableName).map(x => new Supplier(x.variableName.toString())))
            break
        }
        case 'Bank': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new Bank(variableName))
            break
        }
        case 'BankBranch': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new BankBranch(variableName))
            break
        }
        case 'BankAccount': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new BankAccount(variableName))
            break
        }
        case 'Supplier': {
            // Updated variableName affects references in SupplierAddress, SupplierContact, SupplierBankAccount, SupplierProduct, Quotation
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new Supplier(variableName))

            const supplierAddressRows = await db.supplierAddresses.toArray()
            let supplierAddresses = Vector.of<Immutable<SupplierAddressVariable>>().appendAll(supplierAddressRows ? supplierAddressRows.map(x => SupplierAddressRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                supplierAddresses = supplierAddresses.filter(x => !diff.variables.SupplierAddress.remove.anyMatch(y => x.variableName.toString() === y.toString())).filter(x => !diff.variables.SupplierAddress.replace.anyMatch(y => y.variableName.toString() === x.variableName.toString())).appendAll(diff.variables.SupplierAddress.replace)
            })
            diff.variables.SupplierAddress.replace = diff.variables.SupplierAddress.replace.addAll(supplierAddresses.filter(x => x.values.supplier.toString() === variableName).map(x => new SupplierAddressVariable(x.variableName.toString(), {
                supplier: new Supplier(updatedVariableName),
                name: x.values.name,
                address: new Address(x.values.address.toString())
            })))
            diff.variables.SupplierAddress.remove = diff.variables.SupplierAddress.remove.addAll(supplierAddresses.filter(x => x.values.supplier.toString() === variableName).map(x => new SupplierAddress(x.variableName.toString())))

            const supplierContactRows = await db.supplierContacts.toArray()
            let supplierContacts = Vector.of<Immutable<SupplierContactVariable>>().appendAll(supplierContactRows ? supplierContactRows.map(x => SupplierContactRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                supplierContacts = supplierContacts.filter(x => !diff.variables.SupplierContact.remove.anyMatch(y => x.variableName.toString() === y.toString())).filter(x => !diff.variables.SupplierContact.replace.anyMatch(y => y.variableName.toString() === x.variableName.toString())).appendAll(diff.variables.SupplierContact.replace)
            })
            diff.variables.SupplierContact.replace = diff.variables.SupplierContact.replace.addAll(supplierContacts.filter(x => x.values.supplier.toString() === variableName).map(x => new SupplierContactVariable(x.variableName.toString(), {
                supplier: new Supplier(updatedVariableName),
                name: x.values.name,
                designation: x.values.designation,
                email: x.values.email,
                telephone: x.values.telephone,
                mobile: x.values.mobile
            })))
            diff.variables.SupplierContact.remove = diff.variables.SupplierContact.remove.addAll(supplierContacts.filter(x => x.values.supplier.toString() === variableName).map(x => new SupplierContact(x.variableName.toString())))

            const supplierBankAccountRows = await db.supplierBankAccounts.toArray()
            let supplierBankAccounts = Vector.of<Immutable<SupplierBankAccountVariable>>().appendAll(supplierBankAccountRows ? supplierBankAccountRows.map(x => SupplierBankAccountRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                supplierBankAccounts = supplierBankAccounts.filter(x => !diff.variables.SupplierBankAccount.remove.anyMatch(y => x.variableName.toString() === y.toString())).filter(x => !diff.variables.SupplierBankAccount.replace.anyMatch(y => y.variableName.toString() === x.variableName.toString())).appendAll(diff.variables.SupplierBankAccount.replace)
            })
            diff.variables.SupplierBankAccount.replace = diff.variables.SupplierBankAccount.replace.addAll(supplierBankAccounts.filter(x => x.values.supplier.toString() === variableName).map(x => new SupplierBankAccountVariable(x.variableName.toString(), {
                supplier: new Supplier(updatedVariableName),
                bankAccount: new BankAccount(x.values.bankAccount.toString())
            })))
            diff.variables.SupplierBankAccount.remove = diff.variables.SupplierBankAccount.remove.addAll(supplierBankAccounts.filter(x => x.values.supplier.toString() === variableName).map(x => new SupplierBankAccount(x.variableName.toString())))

            const supplierProductRows = await db.supplierProducts.toArray()
            let supplierProducts = Vector.of<Immutable<SupplierProductVariable>>().appendAll(supplierProductRows ? supplierProductRows.map(x => SupplierProductRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                supplierProducts = supplierProducts.filter(x => !diff.variables.SupplierProduct.remove.anyMatch(y => x.variableName.toString() === y.toString())).filter(x => !diff.variables.SupplierProduct.replace.anyMatch(y => y.variableName.toString() === x.variableName.toString())).appendAll(diff.variables.SupplierProduct.replace)
            })
            diff.variables.SupplierProduct.replace = diff.variables.SupplierProduct.replace.addAll(supplierProducts.filter(x => x.values.supplier.toString() === variableName).map(x => new SupplierProductVariable(x.variableName.toString(), {
                supplier: new Supplier(updatedVariableName),
                product: new Product(x.values.product.toString())
            })))
            diff.variables.SupplierProduct.remove = diff.variables.SupplierProduct.remove.addAll(supplierProducts.filter(x => x.values.supplier.toString() === variableName).map(x => new SupplierProduct(x.variableName.toString())))

            const quotationRows = await db.quotations.toArray()
            let quotations = Vector.of<Immutable<QuotationVariable>>().appendAll(quotationRows ? quotationRows.map(x => QuotationRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                quotations = quotations.filter(x => !diff.variables.Quotation.remove.anyMatch(y => x.variableName.toString() === y.toString())).filter(x => !diff.variables.Quotation.replace.anyMatch(y => y.variableName.toString() === x.variableName.toString())).appendAll(diff.variables.Quotation.replace)
            })
            diff.variables.Quotation.replace = diff.variables.Quotation.replace.addAll(quotations.filter(x => x.values.supplier.toString() === variableName).map(x => new QuotationVariable(x.variableName.toString(), {
                indent: new Indent(x.values.indent.toString()),
                supplier: new Supplier(updatedVariableName)
            })))
            diff.variables.Quotation.remove = diff.variables.Quotation.remove.addAll(quotations.filter(x => x.values.supplier.toString() === variableName).map(x => new Quotation(x.variableName.toString())))

            break
        }
        case 'SupplierAddress': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new SupplierAddress(variableName))
            break
        }
        case 'SupplierContact': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new SupplierContact(variableName))
            break
        }
        case 'SupplierBankAccount': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new SupplierBankAccount(variableName))
            break
        }
        case 'Product': {
            // Updated variableName affects references in UOM, IndentItem, SupplierProduct, BOMItem
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new Product(variableName))

            const uomRows = await db.uoms.toArray()
            let uoms = Vector.of<Immutable<UOMVariable>>().appendAll(uomRows ? uomRows.map(x => UOMRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                uoms = uoms.filter(x => !diff.variables.UOM.remove.anyMatch(y => x.variableName.toString() === y.toString())).filter(x => !diff.variables.UOM.replace.anyMatch(y => y.variableName.toString() === x.variableName.toString())).appendAll(diff.variables.UOM.replace)
            })
            diff.variables.UOM.replace = diff.variables.UOM.replace.addAll(uoms.filter(x => x.values.product.toString() === variableName).map(x => new UOMVariable(x.variableName.toString(), {
                product: new Product(updatedVariableName),
                name: x.values.name,
                conversionRate: x.values.conversionRate
            })))
            diff.variables.UOM.remove = diff.variables.UOM.remove.addAll(uoms.filter(x => x.values.product.toString() === variableName).map(x => new UOM(x.variableName.toString())))

            const indentItemRows = await db.indentItems.toArray()
            let indentItems: Vector<Immutable<IndentItemVariable>> = Vector.of<Immutable<IndentItemVariable>>().appendAll(indentItemRows ? indentItemRows.map(x => IndentItemRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                indentItems = indentItems.filter(x => !diff.variables.IndentItem.remove.anyMatch(y => x.variableName.toString() === y.toString())).filter(x => !diff.variables.IndentItem.replace.anyMatch(y => y.variableName.toString() === x.variableName.toString())).appendAll(diff.variables.IndentItem.replace)
            })
            diff.variables.IndentItem.replace = diff.variables.IndentItem.replace.addAll(indentItems.filter(x => x.values.product.toString() === variableName).map(x => new IndentItemVariable(x.variableName.toString(), {
                indent: new Indent(x.values.indent.toString()),
                product: new Product(updatedVariableName),
                quantity: x.values.quantity,
                uom: new UOM(x.values.uom.toString()),
                ordered: x.values.ordered,
                received: x.values.received,
                approved: x.values.approved,
                rejected: x.values.rejected,
                returned: x.values.returned,
                requisted: x.values.requisted,
                consumed: x.values.consumed
            })))
            diff.variables.IndentItem.remove = diff.variables.IndentItem.remove.addAll(indentItems.filter(x => x.values.product.toString() === variableName).map(x => new IndentItem(x.variableName.toString())))

            const supplierProductRows = await db.supplierProducts.toArray()
            let supplierProductItems: Vector<Immutable<SupplierProductVariable>> = Vector.of<Immutable<SupplierProductVariable>>().appendAll(supplierProductRows ? supplierProductRows.map(x => SupplierProductRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                supplierProductItems = supplierProductItems.filter(x => !diff.variables.SupplierProduct.remove.anyMatch(y => x.variableName.toString() === y.toString())).filter(x => !diff.variables.SupplierProduct.replace.anyMatch(y => y.variableName.toString() === x.variableName.toString())).appendAll(diff.variables.SupplierProduct.replace)
            })
            diff.variables.SupplierProduct.replace = diff.variables.SupplierProduct.replace.addAll(supplierProductItems.filter(x => x.values.product.toString() === variableName).map(x => new SupplierProductVariable(x.variableName.toString(), {
                supplier: new Supplier(x.values.supplier.toString()),
                product: new Product(updatedVariableName)
            })))
            diff.variables.SupplierProduct.remove = diff.variables.SupplierProduct.remove.addAll(supplierProductItems.filter(x => x.values.product.toString() === variableName).map(x => new SupplierProduct(x.variableName.toString())))

            const bomItemRows = await db.bomItems.toArray()
            let bomItems: Vector<Immutable<BOMItemVariable>> = Vector.of<Immutable<BOMItemVariable>>().appendAll(bomItemRows ? bomItemRows.map(x => BOMItemRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                bomItems = bomItems.filter(x => !diff.variables.BOMItem.remove.anyMatch(y => x.variableName.toString() === y.toString())).filter(x => !diff.variables.BOMItem.replace.anyMatch(y => y.variableName.toString() === x.variableName.toString())).appendAll(diff.variables.BOMItem.replace)
            })
            diff.variables.BOMItem.replace = diff.variables.BOMItem.replace.addAll(bomItems.filter(x => x.values.product.toString() === variableName).map(x => new BOMItemVariable(x.variableName.toString(), {
                bom: new BOM(x.values.bom.toString()),
                product: new Product(updatedVariableName),
                quantity: x.values.quantity,
                uom: new UOM(x.values.uom.toString())
            })))
            diff.variables.BOMItem.remove = diff.variables.BOMItem.remove.addAll(bomItems.filter(x => x.values.product.toString() === variableName).map(x => new BOMItem(x.variableName.toString())))

            break
        }
        case 'UOM': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new UOM(variableName))
            break
        }
        case 'Indent': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new Indent(variableName))
            break
        }
        case 'IndentItem': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new IndentItem(variableName))
            break
        }
        case 'SupplierProduct': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new SupplierProduct(variableName))
            break
        }
        case 'Quotation': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new Quotation(variableName))
            break
        }
        case 'QuotationItem': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new QuotationItem(variableName))
            break
        }
        case 'PurchaseOrder': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new PurchaseOrder(variableName))
            break
        }
        case 'PurchaseOrderItem': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new PurchaseOrderItem(variableName))
            break
        }
        case 'PurchaseInvoice': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new PurchaseInvoice(variableName))
            break
        }
        case 'PurchaseInvoiceItem': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new PurchaseInvoiceItem(variableName))
            break
        }
        case 'MaterialApprovalSlip': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new MaterialApprovalSlip(variableName))
            break
        }
        case 'MaterialApprovalSlipItem': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new MaterialApprovalSlipItem(variableName))
            break
        }
        case 'MaterialRejectionSlip': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new MaterialRejectionSlip(variableName))
            break
        }
        case 'MaterialRejectionSlipItem': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new MaterialRejectionSlipItem(variableName))
            break
        }
        case 'MaterialReturnSlip': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new MaterialReturnSlip(variableName))
            break
        }
        case 'MaterialReturnSlipItem': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new MaterialReturnSlipItem(variableName))
            break
        }
        case 'MaterialRequistionSlip': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new MaterialRequistionSlip(variableName))
            break
        }
        case 'MaterialRequistionSlipItem': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new MaterialRequistionSlipItem(variableName))
            break
        }
        case 'BOM': {
            // Updated variableName affects references in BOMItem
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new BOM(variableName))
            const bomItemRows = await db.bomItems.toArray()
            let bomItems: Vector<Immutable<BOMItemVariable>> = Vector.of<Immutable<BOMItemVariable>>().appendAll(bomItemRows ? bomItemRows.map(x => BOMItemRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                bomItems = bomItems.filter(x => !diff.variables.BOMItem.remove.anyMatch(y => x.variableName.toString() === y.toString())).filter(x => !diff.variables.BOMItem.replace.anyMatch(y => y.variableName.toString() === x.variableName.toString())).appendAll(diff.variables.BOMItem.replace)
            })
            diff.variables.BOMItem.replace = diff.variables.BOMItem.replace.addAll(bomItems.filter(x => x.values.bom.toString() === variableName).map(x => new BOMItemVariable(x.variableName.toString(), {
                bom: new BOM(updatedVariableName),
                product: new Product(x.values.product.toString()),
                quantity: x.values.quantity,
                uom: new UOM(x.values.uom.toString())
            })))
            diff.variables.BOMItem.remove = diff.variables.BOMItem.remove.addAll(bomItems.filter(x => x.values.bom.toString() === variableName).map(x => new BOMItem(x.variableName.toString())))
            break
        }
        case 'BOMItem': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new BOMItem(variableName))
            break
        }
        case 'ProductionPreparationSlip': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new ProductionPreparationSlip(variableName))
            break
        }
        case 'ProductionPreparationSlipItem': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new ProductionPreparationSlipItem(variableName))
            break
        }
        case 'ScrapMaterialSlip': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new ScrapMaterialSlip(variableName))
            break
        }
        case 'TransferMaterialSlip': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new TransferMaterialSlip(variableName))
            break
        }
        case 'WarehouseAcceptanceSlip': {
            diff.variables[typeName].remove = diff.variables[typeName].remove.add(new WarehouseAcceptanceSlip(variableName))
            break
        }
        default: {
            const _exhaustiveCheck: never = typeName
            return _exhaustiveCheck
        }
    }
    return diff
}

export async function getVariable(typeName: NonPrimitiveType, variableName: string, overlay: Vector<DiffVariable> = Vector.of()): Promise<Variable | undefined> {
    const diffs: Array<DiffVariable> = (await db.diffs.orderBy('id').reverse().toArray()).map(x => DiffRow.toVariable(x))
    switch (typeName) {
        case 'Region': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.Region.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.Region.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.Region.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.Region.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.products.get(variableName)
            if (row !== undefined) {
                return ProductRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'Country': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.Country.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.Country.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.Country.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.Country.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.products.get(variableName)
            if (row !== undefined) {
                return ProductRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'State': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.State.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.State.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.State.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.State.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.products.get(variableName)
            if (row !== undefined) {
                return ProductRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'District': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.District.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.District.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.District.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.District.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.products.get(variableName)
            if (row !== undefined) {
                return ProductRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'Subdistrict': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.Subdistrict.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.Subdistrict.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.Subdistrict.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.Subdistrict.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.products.get(variableName)
            if (row !== undefined) {
                return ProductRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'PostalCode': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.PostalCode.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.PostalCode.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.PostalCode.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.PostalCode.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.products.get(variableName)
            if (row !== undefined) {
                return ProductRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'Address': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.Address.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.Address.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.Address.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.Address.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.products.get(variableName)
            if (row !== undefined) {
                return ProductRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'ServiceArea': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.ServiceArea.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.ServiceArea.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.ServiceArea.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.ServiceArea.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.products.get(variableName)
            if (row !== undefined) {
                return ProductRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'CompanyType': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.CompanyType.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.CompanyType.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.CompanyType.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.CompanyType.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.products.get(variableName)
            if (row !== undefined) {
                return ProductRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'Bank': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.Bank.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.Bank.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.Bank.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.Bank.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.products.get(variableName)
            if (row !== undefined) {
                return ProductRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'BankBranch': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.BankBranch.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.BankBranch.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.BankBranch.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.BankBranch.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.products.get(variableName)
            if (row !== undefined) {
                return ProductRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'BankAccount': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.BankAccount.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.BankAccount.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.BankAccount.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.BankAccount.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.products.get(variableName)
            if (row !== undefined) {
                return ProductRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'Supplier': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.Supplier.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.Supplier.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.Supplier.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.Supplier.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.products.get(variableName)
            if (row !== undefined) {
                return ProductRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'SupplierAddress': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.SupplierAddress.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.SupplierAddress.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.SupplierAddress.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.SupplierAddress.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.products.get(variableName)
            if (row !== undefined) {
                return ProductRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'SupplierContact': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.SupplierContact.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.SupplierContact.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.SupplierContact.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.SupplierContact.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.products.get(variableName)
            if (row !== undefined) {
                return ProductRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'SupplierBankAccount': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.SupplierBankAccount.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.SupplierBankAccount.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.SupplierBankAccount.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.SupplierBankAccount.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.products.get(variableName)
            if (row !== undefined) {
                return ProductRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'Product': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.Product.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.Product.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.Product.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.Product.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.products.get(variableName)
            if (row !== undefined) {
                return ProductRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'UOM': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.UOM.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.UOM.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.UOM.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.UOM.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.uoms.get(variableName)
            if (row !== undefined) {
                return UOMRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'Indent': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.Indent.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.Indent.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.Indent.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.Indent.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.indents.get(variableName)
            if (row !== undefined) {
                return IndentRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'IndentItem': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.IndentItem.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.IndentItem.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.IndentItem.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.IndentItem.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.indentItems.get(variableName)
            if (row !== undefined) {
                return IndentItemRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'SupplierProduct': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.SupplierProduct.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.SupplierProduct.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.SupplierProduct.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.SupplierProduct.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.supplierProducts.get(variableName)
            if (row !== undefined) {
                return SupplierProductRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'Quotation': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.Quotation.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.Quotation.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.Quotation.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.Quotation.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.quotations.get(variableName)
            if (row !== undefined) {
                return QuotationRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'QuotationItem': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.QuotationItem.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.QuotationItem.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.QuotationItem.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.QuotationItem.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.quotationItems.get(variableName)
            if (row !== undefined) {
                return QuotationItemRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'PurchaseOrder': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.PurchaseOrder.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.PurchaseOrder.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.PurchaseOrder.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.PurchaseOrder.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.purchaseOrders.get(variableName)
            if (row !== undefined) {
                return PurchaseOrderRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'PurchaseOrderItem': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.PurchaseOrderItem.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.PurchaseOrderItem.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.PurchaseOrderItem.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.PurchaseOrderItem.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.purchaseOrderItems.get(variableName)
            if (row !== undefined) {
                return PurchaseOrderItemRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'PurchaseInvoice': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.PurchaseInvoice.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.PurchaseInvoice.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.PurchaseInvoice.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.PurchaseInvoice.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.purchaseInvoices.get(variableName)
            if (row !== undefined) {
                return PurchaseInvoiceRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'PurchaseInvoiceItem': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.PurchaseInvoiceItem.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.PurchaseInvoiceItem.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.PurchaseInvoiceItem.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.PurchaseInvoiceItem.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.purchaseInvoiceItems.get(variableName)
            if (row !== undefined) {
                return PurchaseInvoiceItemRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'MaterialApprovalSlip': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.MaterialApprovalSlip.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.MaterialApprovalSlip.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.MaterialApprovalSlip.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.MaterialApprovalSlip.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.materialApprovalSlips.get(variableName)
            if (row !== undefined) {
                return MaterialApprovalSlipRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'MaterialApprovalSlipItem': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.MaterialApprovalSlipItem.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.MaterialApprovalSlipItem.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.MaterialApprovalSlipItem.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.MaterialApprovalSlipItem.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.materialApprovalSlipItems.get(variableName)
            if (row !== undefined) {
                return MaterialApprovalSlipItemRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'MaterialRejectionSlip': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.MaterialRejectionSlip.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.MaterialRejectionSlip.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.MaterialRejectionSlip.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.MaterialRejectionSlip.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.materialRejectionSlips.get(variableName)
            if (row !== undefined) {
                return MaterialRejectionSlipRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'MaterialRejectionSlipItem': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.MaterialRejectionSlipItem.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.MaterialRejectionSlipItem.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.MaterialRejectionSlipItem.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.MaterialRejectionSlipItem.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.materialRejectionSlipItems.get(variableName)
            if (row !== undefined) {
                return MaterialRejectionSlipItemRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'MaterialReturnSlip': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.MaterialReturnSlip.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.MaterialReturnSlip.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.MaterialReturnSlip.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.MaterialReturnSlip.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.materialReturnSlips.get(variableName)
            if (row !== undefined) {
                return MaterialReturnSlipRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'MaterialReturnSlipItem': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.MaterialReturnSlipItem.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.MaterialReturnSlipItem.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.MaterialReturnSlipItem.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.MaterialReturnSlipItem.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.materialReturnSlipItems.get(variableName)
            if (row !== undefined) {
                return MaterialReturnSlipItemRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'MaterialRequistionSlip': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.MaterialRequistionSlip.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.MaterialRequistionSlip.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.MaterialRequistionSlip.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.MaterialRequistionSlip.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.materialRequistionSlips.get(variableName)
            if (row !== undefined) {
                return MaterialRequistionSlipRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'MaterialRequistionSlipItem': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.MaterialRequistionSlipItem.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.MaterialRequistionSlipItem.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.MaterialRequistionSlipItem.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.MaterialRequistionSlipItem.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.materialRequistionSlipItems.get(variableName)
            if (row !== undefined) {
                return MaterialRequistionSlipItemRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'BOM': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.BOM.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.BOM.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.BOM.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.BOM.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.boms.get(variableName)
            if (row !== undefined) {
                return BOMRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'BOMItem': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.BOMItem.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.BOMItem.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.BOMItem.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.BOMItem.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.bomItems.get(variableName)
            if (row !== undefined) {
                return BOMItemRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'ProductionPreparationSlip': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.ProductionPreparationSlip.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.ProductionPreparationSlip.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.ProductionPreparationSlip.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.ProductionPreparationSlip.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.productionPreparationSlips.get(variableName)
            if (row !== undefined) {
                return ProductionPreparationSlipRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'ProductionPreparationSlipItem': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.ProductionPreparationSlipItem.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.ProductionPreparationSlipItem.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.ProductionPreparationSlipItem.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.ProductionPreparationSlipItem.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.productionPreparationSlipItems.get(variableName)
            if (row !== undefined) {
                return ProductionPreparationSlipItemRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'ScrapMaterialSlip': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.ScrapMaterialSlip.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.ScrapMaterialSlip.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.ScrapMaterialSlip.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.ScrapMaterialSlip.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.scrapMaterialSlips.get(variableName)
            if (row !== undefined) {
                return ScrapMaterialSlipRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'TransferMaterialSlip': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.TransferMaterialSlip.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.TransferMaterialSlip.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.TransferMaterialSlip.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.TransferMaterialSlip.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.transferMaterialSlips.get(variableName)
            if (row !== undefined) {
                return TransferMaterialSlipRow.toVariable(row) as Variable
            }
            return undefined
        }
        case 'WarehouseAcceptanceSlip': {
            for (const diff of overlay.reverse().toArray()) {
                for (const variable of diff.variables.WarehouseAcceptanceSlip.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.WarehouseAcceptanceSlip.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            for (const diff of diffs) {
                for (const variable of diff.variables.WarehouseAcceptanceSlip.replace.toArray()) {
                    if (variable.variableName.toString() === variableName) {
                        return variable as Variable
                    }
                }
                if (diff.variables.WarehouseAcceptanceSlip.remove.anyMatch(x => x.toString() === variableName)) {
                    return undefined
                }
            }
            const row = await db.warehouseAcceptanceSlips.get(variableName)
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
    switch (typeName) {
        case 'Region': {
            const rows = await db.regions.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<RegionVariable>>().appendAll(rows ? rows.map(x => RegionRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'Country': {
            const rows = await db.countries.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<CountryVariable>>().appendAll(rows ? rows.map(x => CountryRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'State': {
            const rows = await db.states.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<StateVariable>>().appendAll(rows ? rows.map(x => StateRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'District': {
            const rows = await db.districts.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<DistrictVariable>>().appendAll(rows ? rows.map(x => DistrictRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'Subdistrict': {
            const rows = await db.subdistricts.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<SubdistrictVariable>>().appendAll(rows ? rows.map(x => SubdistrictRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'PostalCode': {
            const rows = await db.postalCodes.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<PostalCodeVariable>>().appendAll(rows ? rows.map(x => PostalCodeRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'Address': {
            const rows = await db.addresses.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<AddressVariable>>().appendAll(rows ? rows.map(x => AddressRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'ServiceArea': {
            const rows = await db.serviceAreas.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<ServiceAreaVariable>>().appendAll(rows ? rows.map(x => ServiceAreaRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'CompanyType': {
            const rows = await db.companyTypes.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<CompanyTypeVariable>>().appendAll(rows ? rows.map(x => CompanyTypeRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'Bank': {
            const rows = await db.banks.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<BankVariable>>().appendAll(rows ? rows.map(x => BankRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'BankBranch': {
            const rows = await db.bankBranches.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<BankBranchVariable>>().appendAll(rows ? rows.map(x => BankBranchRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'BankAccount': {
            const rows = await db.bankAccounts.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<BankAccountVariable>>().appendAll(rows ? rows.map(x => BankAccountRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'Supplier': {
            const rows = await db.suppliers.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<SupplierVariable>>().appendAll(rows ? rows.map(x => SupplierRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'SupplierAddress': {
            const rows = await db.supplierAddresses.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<SupplierAddressVariable>>().appendAll(rows ? rows.map(x => SupplierAddressRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'SupplierContact': {
            const rows = await db.supplierContacts.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<SupplierContactVariable>>().appendAll(rows ? rows.map(x => SupplierContactRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'SupplierBankAccount': {
            const rows = await db.supplierBankAccounts.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<SupplierBankAccountVariable>>().appendAll(rows ? rows.map(x => SupplierBankAccountRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'Product': {
            const rows = await db.products.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<ProductVariable>>().appendAll(rows ? rows.map(x => ProductRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'UOM': {
            const rows = await db.uoms.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<UOMVariable>>().appendAll(rows ? rows.map(x => UOMRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'Indent': {
            const rows = await db.indents.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<IndentVariable>>().appendAll(rows ? rows.map(x => IndentRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'IndentItem': {
            const rows = await db.indentItems.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<IndentItemVariable>>().appendAll(rows ? rows.map(x => IndentItemRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'SupplierProduct': {
            const rows = await db.supplierProducts.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<SupplierProductVariable>>().appendAll(rows ? rows.map(x => SupplierProductRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'Quotation': {
            const rows = await db.quotations.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<QuotationVariable>>().appendAll(rows ? rows.map(x => QuotationRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'QuotationItem': {
            const rows = await db.quotationItems.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<QuotationItemVariable>>().appendAll(rows ? rows.map(x => QuotationItemRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'PurchaseOrder': {
            const rows = await db.purchaseOrders.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<PurchaseOrderVariable>>().appendAll(rows ? rows.map(x => PurchaseOrderRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'PurchaseOrderItem': {
            const rows = await db.purchaseOrderItems.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<PurchaseOrderItemVariable>>().appendAll(rows ? rows.map(x => PurchaseOrderItemRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'PurchaseInvoice': {
            const rows = await db.purchaseInvoices.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<PurchaseInvoiceVariable>>().appendAll(rows ? rows.map(x => PurchaseInvoiceRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'PurchaseInvoiceItem': {
            const rows = await db.purchaseInvoiceItems.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<PurchaseInvoiceItemVariable>>().appendAll(rows ? rows.map(x => PurchaseInvoiceItemRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'MaterialApprovalSlip': {
            const rows = await db.materialApprovalSlips.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<MaterialApprovalSlipVariable>>().appendAll(rows ? rows.map(x => MaterialApprovalSlipRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'MaterialApprovalSlipItem': {
            const rows = await db.materialApprovalSlipItems.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<MaterialApprovalSlipItemVariable>>().appendAll(rows ? rows.map(x => MaterialApprovalSlipItemRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'MaterialRejectionSlip': {
            const rows = await db.materialRejectionSlips.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<MaterialRejectionSlipVariable>>().appendAll(rows ? rows.map(x => MaterialRejectionSlipRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'MaterialRejectionSlipItem': {
            const rows = await db.materialRejectionSlipItems.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<MaterialRejectionSlipItemVariable>>().appendAll(rows ? rows.map(x => MaterialRejectionSlipItemRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'MaterialReturnSlip': {
            const rows = await db.materialReturnSlips.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<MaterialReturnSlipVariable>>().appendAll(rows ? rows.map(x => MaterialReturnSlipRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'MaterialReturnSlipItem': {
            const rows = await db.materialReturnSlipItems.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<MaterialReturnSlipItemVariable>>().appendAll(rows ? rows.map(x => MaterialReturnSlipItemRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'MaterialRequistionSlip': {
            const rows = await db.materialRequistionSlips.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<MaterialRequistionSlipVariable>>().appendAll(rows ? rows.map(x => MaterialRequistionSlipRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'MaterialRequistionSlipItem': {
            const rows = await db.materialRequistionSlipItems.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<MaterialRequistionSlipItemVariable>>().appendAll(rows ? rows.map(x => MaterialRequistionSlipItemRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'BOM': {
            const rows = await db.boms.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<BOMVariable>>().appendAll(rows ? rows.map(x => BOMRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'BOMItem': {
            const rows = await db.bomItems.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<BOMItemVariable>>().appendAll(rows ? rows.map(x => BOMItemRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'ProductionPreparationSlip': {
            const rows = await db.productionPreparationSlips.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<ProductionPreparationSlipVariable>>().appendAll(rows ? rows.map(x => ProductionPreparationSlipRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'ProductionPreparationSlipItem': {
            const rows = await db.productionPreparationSlipItems.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<ProductionPreparationSlipItemVariable>>().appendAll(rows ? rows.map(x => ProductionPreparationSlipItemRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'ScrapMaterialSlip': {
            const rows = await db.scrapMaterialSlips.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<ScrapMaterialSlipVariable>>().appendAll(rows ? rows.map(x => ScrapMaterialSlipRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'TransferMaterialSlip': {
            const rows = await db.transferMaterialSlips.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<TransferMaterialSlipVariable>>().appendAll(rows ? rows.map(x => TransferMaterialSlipRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        case 'WarehouseAcceptanceSlip': {
            const rows = await db.warehouseAcceptanceSlips.orderBy('variableName').toArray()
            let composedVariables = Vector.of<Immutable<WarehouseAcceptanceSlipVariable>>().appendAll(rows ? rows.map(x => WarehouseAcceptanceSlipRow.toVariable(x)) : [])
            diffs?.forEach(diff => {
                composedVariables = composedVariables.filter(x => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).appendAll(diff.variables[typeName].replace)
            })
            return composedVariables
        }
        default: {
            const _exhaustiveCheck: never = typeName
            return _exhaustiveCheck
        }
    }
}

export function mergeDiffs(diffs: ReadonlyArray<DiffVariable>): DiffVariable {
    const result = diffs.reduce((acc, diff) => {
        Object.keys(diff.variables).forEach(typeName => {
            acc.variables[typeName].replace = acc.variables[typeName].replace.filter((x: Variable) => !diff.variables[typeName].remove.anyMatch(y => x.variableName.toString() === y.toString())).addAll(diff.variables[typeName].replace)
            acc.variables[typeName].remove = acc.variables[typeName].remove.filter((x: VariableName) => !diff.variables[typeName].replace.anyMatch(y => x.toString() === y.variableName.toString())).addAll(diff.variables[typeName].remove)
        })
        return acc
    }, new DiffVariable())
    return result
}
