import { Immutable } from 'immer';
import { NonPrimitiveType } from './types';
import { when } from './utils';
import { DiffVariable, getRemoveVariableDiff, getReplaceVariableDiff, getVariable, mergeDiffs } from './layers'
import { Variable, Region, RegionVariable, Country, CountryVariable, StateType, StateTypeVariable, District, DistrictVariable, Subdistrict, SubdistrictVariable, PostalCode, PostalCodeVariable, Address, AddressVariable, Company, CompanyVariable, CompanyAddress, CompanyAddressVariable, CompanyTagGroup, CompanyTagGroupVariable, CompanyTag, CompanyTagVariable, MappingCompanyTag, MappingCompanyTagVariable, Contact, ContactVariable, ContactAddress, ContactAddressVariable, CompanyContact, CompanyContactVariable, Currency, CurrencyVariable, CurrencyRate, CurrencyRateVariable, Memo, MemoVariable, Bank, BankVariable, BankBranch, BankBranchVariable, BankAccount, BankAccountVariable, BankTransaction, BankTransactionVariable, CompanyBankAccount, CompanyBankAccountVariable, ProductCategoryGroup, ProductCategoryGroupVariable, ProductCategory, ProductCategoryVariable, Product, ProductVariable, CompanyProduct, CompanyProductVariable, ProductTagGroup, ProductTagGroupVariable, ProductTag, ProductTagVariable, MappingProductTag, MappingProductTagVariable, UOM, UOMVariable, Indent, IndentVariable, IndentItem, IndentItemVariable, Quotation, QuotationVariable, QuotationItem, QuotationItemVariable, PurchaseOrder, PurchaseOrderVariable, PurchaseOrderItem, PurchaseOrderItemVariable, PurchaseInvoice, PurchaseInvoiceVariable, PurchaseInvoiceItem, PurchaseInvoiceItemVariable, MaterialApprovalSlip, MaterialApprovalSlipVariable, MaterialApprovalSlipItem, MaterialApprovalSlipItemVariable, MaterialRejectionSlip, MaterialRejectionSlipVariable, MaterialRejectionSlipItem, MaterialRejectionSlipItemVariable, MaterialReturnSlip, MaterialReturnSlipVariable, MaterialReturnSlipItem, MaterialReturnSlipItemVariable, MaterialRequistionSlip, MaterialRequistionSlipVariable, MaterialRequistionSlipItem, MaterialRequistionSlipItemVariable, BOM, BOMVariable, BOMItem, BOMItemVariable, ProductionPreparationSlip, ProductionPreparationSlipVariable, ProductionPreparationSlipItem, ProductionPreparationSlipItemVariable, ScrapMaterialSlip, ScrapMaterialSlipVariable, TransferMaterialSlip, TransferMaterialSlipVariable, WarehouseAcceptanceSlip, WarehouseAcceptanceSlipVariable } from './variables'
        
class Counter {
    private id: number = -1

    getId(): number {
        this.id -= 1
        return this.id
    }
}
export const counter = new Counter()

export function createVariable(typeName: NonPrimitiveType, values: object): [Variable, DiffVariable] {
    const id: number = counter.getId()
    const variable: Variable = when(typeName, {
        'Region': () => new RegionVariable(id, {
            name: String(values['name'])
        }) as Variable,
        'Country': () => new CountryVariable(id, {
            region: new Region(parseInt(String(values['region']))),
            name: String(values['name'])
        }) as Variable,
        'StateType': () => new StateTypeVariable(id, {
            country: new Country(parseInt(String(values['country']))),
            name: String(values['name'])
        }) as Variable,
        'District': () => new DistrictVariable(id, {
            state: new StateType(parseInt(String(values['state']))),
            name: String(values['name'])
        }) as Variable,
        'Subdistrict': () => new SubdistrictVariable(id, {
            district: new District(parseInt(String(values['district']))),
            name: String(values['name'])
        }) as Variable,
        'PostalCode': () => new PostalCodeVariable(id, {
            subdistrict: new Subdistrict(parseInt(String(values['subdistrict']))),
            name: String(values['name'])
        }) as Variable,
        'Address': () => new AddressVariable(id, {
            postalCode: new PostalCode(parseInt(String(values['postalCode']))),
            line1: String(values['line1']),
            line2: String(values['line2']),
            latitude: parseInt(String(values['latitude'])),
            longitude: parseInt(String(values['longitude']))
        }) as Variable,
        'Company': () => new CompanyVariable(id, {
            name: String(values['name']),
            email: String(values['email']),
            telephone: String(values['telephone']),
            mobile: String(values['mobile']),
            website: String(values['website']),
            gstin: String(values['gstin']),
            pan: String(values['pan']),
            iec: String(values['iec'])
        }) as Variable,
        'CompanyAddress': () => new CompanyAddressVariable(id, {
            company: new Company(parseInt(String(values['company']))),
            name: String(values['name']),
            address: new Address(parseInt(String(values['address'])))
        }) as Variable,
        'CompanyTagGroup': () => new CompanyTagGroupVariable(id, {
            name: String(values['name'])
        }) as Variable,
        'CompanyTag': () => new CompanyTagVariable(id, {
            group: new CompanyTagGroup(parseInt(String(values['group']))),
            name: String(values['name'])
        }) as Variable,
        'MappingCompanyTag': () => new MappingCompanyTagVariable(id, {
            company: new Company(parseInt(String(values['company']))),
            tag: new CompanyTag(parseInt(String(values['tag'])))
        }) as Variable,
        'Contact': () => new ContactVariable(id, {
            name: String(values['name']),
            email: String(values['email']),
            telephone: String(values['telephone']),
            mobile: String(values['mobile']),
            website: String(values['website'])
        }) as Variable,
        'ContactAddress': () => new ContactAddressVariable(id, {
            contact: new Contact(parseInt(String(values['contact']))),
            name: String(values['name']),
            address: new Address(parseInt(String(values['address'])))
        }) as Variable,
        'CompanyContact': () => new CompanyContactVariable(id, {
            company: new Company(parseInt(String(values['company']))),
            contact: new Contact(parseInt(String(values['contact']))),
            role: String(values['role']),
            email: String(values['email']),
            telephone: String(values['telephone']),
            mobile: String(values['mobile'])
        }) as Variable,
        'Currency': () => new CurrencyVariable(id, {
            name: String(values['name'])
        }) as Variable,
        'CurrencyRate': () => new CurrencyRateVariable(id, {
            currency: new Currency(parseInt(String(values['currency']))),
            conversionRate: parseFloat(String(values['conversionRate'])),
            startTime: parseInt(String(values['startTime'])),
            endTime: parseInt(String(values['endTime']))
        }) as Variable,
        'Memo': () => new MemoVariable(id, {
            company: new Company(parseInt(String(values['company']))),
            currency: new Currency(parseInt(String(values['currency']))),
            amount: parseFloat(String(values['amount'])),
            unsettled: parseFloat(String(values['unsettled']))
        }) as Variable,
        'Bank': () => new BankVariable(id, {
            country: new Country(parseInt(String(values['country']))),
            name: String(values['name']),
            website: String(values['website'])
        }) as Variable,
        'BankBranch': () => new BankBranchVariable(id, {
            bank: new Bank(parseInt(String(values['bank']))),
            name: String(values['name']),
            ifsc: String(values['ifsc']),
            address: new Address(parseInt(String(values['address'])))
        }) as Variable,
        'BankAccount': () => new BankAccountVariable(id, {
            bank: new Bank(parseInt(String(values['bank']))),
            bankBranch: new BankBranch(parseInt(String(values['bankBranch']))),
            accountNumber: String(values['accountNumber']),
            accountName: String(values['accountName']),
            currency: new Currency(parseInt(String(values['currency'])))
        }) as Variable,
        'BankTransaction': () => new BankTransactionVariable(id, {
            timestamp: parseInt(String(values['timestamp'])),
            memo: new Memo(parseInt(String(values['memo']))),
            currencyRate: new CurrencyRate(parseInt(String(values['currencyRate']))),
            bankAccount: new BankAccount(parseInt(String(values['bankAccount']))),
            fromToAccount: new BankAccount(parseInt(String(values['fromToAccount']))),
            credit: parseFloat(String(values['credit'])),
            debit: parseFloat(String(values['debit']))
        }) as Variable,
        'CompanyBankAccount': () => new CompanyBankAccountVariable(id, {
            company: new Company(parseInt(String(values['company']))),
            bankAccount: new BankAccount(parseInt(String(values['bankAccount'])))
        }) as Variable,
        'ProductCategoryGroup': () => new ProductCategoryGroupVariable(id, {
            parent: new ProductCategoryGroup(parseInt(String(values['parent']))),
            name: String(values['name']),
            length: parseInt(String(values['length']))
        }) as Variable,
        'ProductCategory': () => new ProductCategoryVariable(id, {
            parent: new ProductCategory(parseInt(String(values['parent']))),
            group: new ProductCategoryGroup(parseInt(String(values['group']))),
            name: String(values['name']),
            code: String(values['code']),
            derivedCode: String(values['derivedCode']),
            childCount: parseInt(String(values['childCount']))
        }) as Variable,
        'Product': () => new ProductVariable(id, {
            name: String(values['name']),
            category: new ProductCategory(parseInt(String(values['category']))),
            code: String(values['code']),
            sku: String(values['sku'])
        }) as Variable,
        'CompanyProduct': () => new CompanyProductVariable(id, {
            company: new Company(parseInt(String(values['company']))),
            product: new Product(parseInt(String(values['product'])))
        }) as Variable,
        'ProductTagGroup': () => new ProductTagGroupVariable(id, {
            name: String(values['name'])
        }) as Variable,
        'ProductTag': () => new ProductTagVariable(id, {
            group: new ProductTagGroup(parseInt(String(values['group']))),
            name: String(values['name'])
        }) as Variable,
        'MappingProductTag': () => new MappingProductTagVariable(id, {
            product: new Product(parseInt(String(values['product']))),
            tag: new ProductTag(parseInt(String(values['tag'])))
        }) as Variable,
        'UOM': () => new UOMVariable(id, {
            product: new Product(parseInt(String(values['product']))),
            name: String(values['name']),
            conversionRate: parseFloat(String(values['conversionRate']))
        }) as Variable,
        'Indent': () => new IndentVariable(id, {

        }) as Variable,
        'IndentItem': () => new IndentItemVariable(id, {
            indent: new Indent(parseInt(String(values['indent']))),
            product: new Product(parseInt(String(values['product']))),
            quantity: parseInt(String(values['quantity'])),
            uom: new UOM(parseInt(String(values['uom']))),
            ordered: parseInt(String(values['ordered'])),
            received: parseInt(String(values['received'])),
            approved: parseInt(String(values['approved'])),
            rejected: parseInt(String(values['rejected'])),
            returned: parseInt(String(values['returned'])),
            requisted: parseInt(String(values['requisted'])),
            consumed: parseInt(String(values['consumed']))
        }) as Variable,
        'Quotation': () => new QuotationVariable(id, {
            indent: new Indent(parseInt(String(values['indent']))),
            company: new Company(parseInt(String(values['company'])))
        }) as Variable,
        'QuotationItem': () => new QuotationItemVariable(id, {
            quotation: new Quotation(parseInt(String(values['quotation']))),
            indentItem: new IndentItem(parseInt(String(values['indentItem']))),
            quantity: parseInt(String(values['quantity']))
        }) as Variable,
        'PurchaseOrder': () => new PurchaseOrderVariable(id, {
            quotation: new Quotation(parseInt(String(values['quotation'])))
        }) as Variable,
        'PurchaseOrderItem': () => new PurchaseOrderItemVariable(id, {
            purchaseOrder: new PurchaseOrder(parseInt(String(values['purchaseOrder']))),
            quotationItem: new QuotationItem(parseInt(String(values['quotationItem']))),
            quantity: parseInt(String(values['quantity'])),
            price: parseFloat(String(values['price'])),
            received: parseInt(String(values['received']))
        }) as Variable,
        'PurchaseInvoice': () => new PurchaseInvoiceVariable(id, {
            purchaseOrder: new PurchaseOrder(parseInt(String(values['purchaseOrder'])))
        }) as Variable,
        'PurchaseInvoiceItem': () => new PurchaseInvoiceItemVariable(id, {
            purchaseInvoice: new PurchaseInvoice(parseInt(String(values['purchaseInvoice']))),
            purchaseOrderItem: new PurchaseOrderItem(parseInt(String(values['purchaseOrderItem']))),
            quantity: parseInt(String(values['quantity'])),
            approved: parseInt(String(values['approved'])),
            rejected: parseInt(String(values['rejected']))
        }) as Variable,
        'MaterialApprovalSlip': () => new MaterialApprovalSlipVariable(id, {
            purchaseInvoice: new PurchaseInvoice(parseInt(String(values['purchaseInvoice'])))
        }) as Variable,
        'MaterialApprovalSlipItem': () => new MaterialApprovalSlipItemVariable(id, {
            materialApprovalSlip: new MaterialApprovalSlip(parseInt(String(values['materialApprovalSlip']))),
            purchaseInvoiceItem: new PurchaseInvoiceItem(parseInt(String(values['purchaseInvoiceItem']))),
            quantity: parseInt(String(values['quantity'])),
            requisted: parseInt(String(values['requisted']))
        }) as Variable,
        'MaterialRejectionSlip': () => new MaterialRejectionSlipVariable(id, {
            purchaseInvoice: new PurchaseInvoice(parseInt(String(values['purchaseInvoice'])))
        }) as Variable,
        'MaterialRejectionSlipItem': () => new MaterialRejectionSlipItemVariable(id, {
            materialRejectionSlip: new MaterialRejectionSlip(parseInt(String(values['materialRejectionSlip']))),
            purchaseInvoiceItem: new PurchaseInvoiceItem(parseInt(String(values['purchaseInvoiceItem']))),
            quantity: parseInt(String(values['quantity'])),
            returned: parseInt(String(values['returned']))
        }) as Variable,
        'MaterialReturnSlip': () => new MaterialReturnSlipVariable(id, {
            materialRejectionSlip: new MaterialRejectionSlip(parseInt(String(values['materialRejectionSlip'])))
        }) as Variable,
        'MaterialReturnSlipItem': () => new MaterialReturnSlipItemVariable(id, {
            materialReturnSlip: new MaterialReturnSlip(parseInt(String(values['materialReturnSlip']))),
            materialRejectionSlipItem: new MaterialRejectionSlipItem(parseInt(String(values['materialRejectionSlipItem']))),
            quantity: parseInt(String(values['quantity']))
        }) as Variable,
        'MaterialRequistionSlip': () => new MaterialRequistionSlipVariable(id, {
            materialApprovalSlip: new MaterialApprovalSlip(parseInt(String(values['materialApprovalSlip'])))
        }) as Variable,
        'MaterialRequistionSlipItem': () => new MaterialRequistionSlipItemVariable(id, {
            materialRequistionSlip: new MaterialRequistionSlip(parseInt(String(values['materialRequistionSlip']))),
            materialApprovalSlipItem: new MaterialApprovalSlipItem(parseInt(String(values['materialApprovalSlipItem']))),
            quantity: parseInt(String(values['quantity'])),
            consumed: parseInt(String(values['consumed']))
        }) as Variable,
        'BOM': () => new BOMVariable(id, {
            name: String(values['name'])
        }) as Variable,
        'BOMItem': () => new BOMItemVariable(id, {
            bom: new BOM(parseInt(String(values['bom']))),
            product: new Product(parseInt(String(values['product']))),
            quantity: parseInt(String(values['quantity'])),
            uom: new UOM(parseInt(String(values['uom'])))
        }) as Variable,
        'ProductionPreparationSlip': () => new ProductionPreparationSlipVariable(id, {
            bom: new BOM(parseInt(String(values['bom']))),
            approved: parseInt(String(values['approved'])),
            scrapped: parseInt(String(values['scrapped']))
        }) as Variable,
        'ProductionPreparationSlipItem': () => new ProductionPreparationSlipItemVariable(id, {
            productionPreparationSlip: new ProductionPreparationSlip(parseInt(String(values['productionPreparationSlip']))),
            bomItem: String(values['bomItem']),
            materialRequistionSlipItem: new MaterialRequistionSlipItem(parseInt(String(values['materialRequistionSlipItem'])))
        }) as Variable,
        'ScrapMaterialSlip': () => new ScrapMaterialSlipVariable(id, {
            productionPreparationSlip: new ProductionPreparationSlip(parseInt(String(values['productionPreparationSlip']))),
            quantity: parseInt(String(values['quantity']))
        }) as Variable,
        'TransferMaterialSlip': () => new TransferMaterialSlipVariable(id, {
            productionPreparationSlip: new ProductionPreparationSlip(parseInt(String(values['productionPreparationSlip']))),
            quantity: parseInt(String(values['quantity'])),
            transferred: parseInt(String(values['transferred']))
        }) as Variable,
        'WarehouseAcceptanceSlip': () => new WarehouseAcceptanceSlipVariable(id, {
            transferMaterialSlip: new TransferMaterialSlip(parseInt(String(values['transferMaterialSlip']))),
            quantity: parseInt(String(values['quantity']))
        }) as Variable
    })
    return [variable, getReplaceVariableDiff(variable)]
}

export async function updateVariable(variable: Immutable<Variable>, values: object): Promise<[Variable, DiffVariable]> {
    let updatedVariable: Variable
    switch (variable.typeName) {
        case 'Region': {
            updatedVariable = new RegionVariable(variable.id.hashCode(), {
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name
            })
            break
        }
        case 'Country': {
            updatedVariable = new CountryVariable(variable.id.hashCode(), {
                region: values['region'] !== undefined ? new Region(parseInt(String(values['region']))) : new Region(variable.values.region.hashCode()),
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name
            })
            break
        }
        case 'StateType': {
            updatedVariable = new StateTypeVariable(variable.id.hashCode(), {
                country: values['country'] !== undefined ? new Country(parseInt(String(values['country']))) : new Country(variable.values.country.hashCode()),
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name
            })
            break
        }
        case 'District': {
            updatedVariable = new DistrictVariable(variable.id.hashCode(), {
                state: values['state'] !== undefined ? new StateType(parseInt(String(values['state']))) : new StateType(variable.values.state.hashCode()),
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name
            })
            break
        }
        case 'Subdistrict': {
            updatedVariable = new SubdistrictVariable(variable.id.hashCode(), {
                district: values['district'] !== undefined ? new District(parseInt(String(values['district']))) : new District(variable.values.district.hashCode()),
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name
            })
            break
        }
        case 'PostalCode': {
            updatedVariable = new PostalCodeVariable(variable.id.hashCode(), {
                subdistrict: values['subdistrict'] !== undefined ? new Subdistrict(parseInt(String(values['subdistrict']))) : new Subdistrict(variable.values.subdistrict.hashCode()),
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name
            })
            break
        }
        case 'Address': {
            updatedVariable = new AddressVariable(variable.id.hashCode(), {
                postalCode: values['postalCode'] !== undefined ? new PostalCode(parseInt(String(values['postalCode']))) : new PostalCode(variable.values.postalCode.hashCode()),
                line1: values['line1'] !== undefined ? String(values['line1']) : variable.values.line1,
                line2: values['line2'] !== undefined ? String(values['line2']) : variable.values.line2,
                latitude: values['latitude'] !== undefined ? parseInt(String(values['latitude'])) : variable.values.latitude,
                longitude: values['longitude'] !== undefined ? parseInt(String(values['longitude'])) : variable.values.longitude
            })
            break
        }
        case 'Company': {
            updatedVariable = new CompanyVariable(variable.id.hashCode(), {
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name,
                email: values['email'] !== undefined ? String(values['email']) : variable.values.email,
                telephone: values['telephone'] !== undefined ? String(values['telephone']) : variable.values.telephone,
                mobile: values['mobile'] !== undefined ? String(values['mobile']) : variable.values.mobile,
                website: values['website'] !== undefined ? String(values['website']) : variable.values.website,
                gstin: values['gstin'] !== undefined ? String(values['gstin']) : variable.values.gstin,
                pan: values['pan'] !== undefined ? String(values['pan']) : variable.values.pan,
                iec: values['iec'] !== undefined ? String(values['iec']) : variable.values.iec
            })
            break
        }
        case 'CompanyAddress': {
            updatedVariable = new CompanyAddressVariable(variable.id.hashCode(), {
                company: values['company'] !== undefined ? new Company(parseInt(String(values['company']))) : new Company(variable.values.company.hashCode()),
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name,
                address: values['address'] !== undefined ? new Address(parseInt(String(values['address']))) : new Address(variable.values.address.hashCode())
            })
            break
        }
        case 'CompanyTagGroup': {
            updatedVariable = new CompanyTagGroupVariable(variable.id.hashCode(), {
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name
            })
            break
        }
        case 'CompanyTag': {
            updatedVariable = new CompanyTagVariable(variable.id.hashCode(), {
                group: values['group'] !== undefined ? new CompanyTagGroup(parseInt(String(values['group']))) : new CompanyTagGroup(variable.values.group.hashCode()),
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name
            })
            break
        }
        case 'MappingCompanyTag': {
            updatedVariable = new MappingCompanyTagVariable(variable.id.hashCode(), {
                company: values['company'] !== undefined ? new Company(parseInt(String(values['company']))) : new Company(variable.values.company.hashCode()),
                tag: values['tag'] !== undefined ? new CompanyTag(parseInt(String(values['tag']))) : new CompanyTag(variable.values.tag.hashCode())
            })
            break
        }
        case 'Contact': {
            updatedVariable = new ContactVariable(variable.id.hashCode(), {
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name,
                email: values['email'] !== undefined ? String(values['email']) : variable.values.email,
                telephone: values['telephone'] !== undefined ? String(values['telephone']) : variable.values.telephone,
                mobile: values['mobile'] !== undefined ? String(values['mobile']) : variable.values.mobile,
                website: values['website'] !== undefined ? String(values['website']) : variable.values.website
            })
            break
        }
        case 'ContactAddress': {
            updatedVariable = new ContactAddressVariable(variable.id.hashCode(), {
                contact: values['contact'] !== undefined ? new Contact(parseInt(String(values['contact']))) : new Contact(variable.values.contact.hashCode()),
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name,
                address: values['address'] !== undefined ? new Address(parseInt(String(values['address']))) : new Address(variable.values.address.hashCode())
            })
            break
        }
        case 'CompanyContact': {
            updatedVariable = new CompanyContactVariable(variable.id.hashCode(), {
                company: values['company'] !== undefined ? new Company(parseInt(String(values['company']))) : new Company(variable.values.company.hashCode()),
                contact: values['contact'] !== undefined ? new Contact(parseInt(String(values['contact']))) : new Contact(variable.values.contact.hashCode()),
                role: values['role'] !== undefined ? String(values['role']) : variable.values.role,
                email: values['email'] !== undefined ? String(values['email']) : variable.values.email,
                telephone: values['telephone'] !== undefined ? String(values['telephone']) : variable.values.telephone,
                mobile: values['mobile'] !== undefined ? String(values['mobile']) : variable.values.mobile
            })
            break
        }
        case 'Currency': {
            updatedVariable = new CurrencyVariable(variable.id.hashCode(), {
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name
            })
            break
        }
        case 'CurrencyRate': {
            updatedVariable = new CurrencyRateVariable(variable.id.hashCode(), {
                currency: values['currency'] !== undefined ? new Currency(parseInt(String(values['currency']))) : new Currency(variable.values.currency.hashCode()),
                conversionRate: values['conversionRate'] !== undefined ? parseFloat(String(values['conversionRate'])) : variable.values.conversionRate,
                startTime: values['startTime'] !== undefined ? parseInt(String(values['startTime'])) : variable.values.startTime,
                endTime: values['endTime'] !== undefined ? parseInt(String(values['endTime'])) : variable.values.endTime
            })
            break
        }
        case 'Memo': {
            updatedVariable = new MemoVariable(variable.id.hashCode(), {
                company: values['company'] !== undefined ? new Company(parseInt(String(values['company']))) : new Company(variable.values.company.hashCode()),
                currency: values['currency'] !== undefined ? new Currency(parseInt(String(values['currency']))) : new Currency(variable.values.currency.hashCode()),
                amount: values['amount'] !== undefined ? parseFloat(String(values['amount'])) : variable.values.amount,
                unsettled: values['unsettled'] !== undefined ? parseFloat(String(values['unsettled'])) : variable.values.unsettled
            })
            break
        }
        case 'Bank': {
            updatedVariable = new BankVariable(variable.id.hashCode(), {
                country: values['country'] !== undefined ? new Country(parseInt(String(values['country']))) : new Country(variable.values.country.hashCode()),
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name,
                website: values['website'] !== undefined ? String(values['website']) : variable.values.website
            })
            break
        }
        case 'BankBranch': {
            updatedVariable = new BankBranchVariable(variable.id.hashCode(), {
                bank: values['bank'] !== undefined ? new Bank(parseInt(String(values['bank']))) : new Bank(variable.values.bank.hashCode()),
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name,
                ifsc: values['ifsc'] !== undefined ? String(values['ifsc']) : variable.values.ifsc,
                address: values['address'] !== undefined ? new Address(parseInt(String(values['address']))) : new Address(variable.values.address.hashCode())
            })
            break
        }
        case 'BankAccount': {
            updatedVariable = new BankAccountVariable(variable.id.hashCode(), {
                bank: values['bank'] !== undefined ? new Bank(parseInt(String(values['bank']))) : new Bank(variable.values.bank.hashCode()),
                bankBranch: values['bankBranch'] !== undefined ? new BankBranch(parseInt(String(values['bankBranch']))) : new BankBranch(variable.values.bankBranch.hashCode()),
                accountNumber: values['accountNumber'] !== undefined ? String(values['accountNumber']) : variable.values.accountNumber,
                accountName: values['accountName'] !== undefined ? String(values['accountName']) : variable.values.accountName,
                currency: values['currency'] !== undefined ? new Currency(parseInt(String(values['currency']))) : new Currency(variable.values.currency.hashCode())
            })
            break
        }
        case 'BankTransaction': {
            updatedVariable = new BankTransactionVariable(variable.id.hashCode(), {
                timestamp: values['timestamp'] !== undefined ? parseInt(String(values['timestamp'])) : variable.values.timestamp,
                memo: values['memo'] !== undefined ? new Memo(parseInt(String(values['memo']))) : new Memo(variable.values.memo.hashCode()),
                currencyRate: values['currencyRate'] !== undefined ? new CurrencyRate(parseInt(String(values['currencyRate']))) : new CurrencyRate(variable.values.currencyRate.hashCode()),
                bankAccount: values['bankAccount'] !== undefined ? new BankAccount(parseInt(String(values['bankAccount']))) : new BankAccount(variable.values.bankAccount.hashCode()),
                fromToAccount: values['fromToAccount'] !== undefined ? new BankAccount(parseInt(String(values['fromToAccount']))) : new BankAccount(variable.values.fromToAccount.hashCode()),
                credit: values['credit'] !== undefined ? parseFloat(String(values['credit'])) : variable.values.credit,
                debit: values['debit'] !== undefined ? parseFloat(String(values['debit'])) : variable.values.debit
            })
            break
        }
        case 'CompanyBankAccount': {
            updatedVariable = new CompanyBankAccountVariable(variable.id.hashCode(), {
                company: values['company'] !== undefined ? new Company(parseInt(String(values['company']))) : new Company(variable.values.company.hashCode()),
                bankAccount: values['bankAccount'] !== undefined ? new BankAccount(parseInt(String(values['bankAccount']))) : new BankAccount(variable.values.bankAccount.hashCode())
            })
            break
        }
        case 'ProductCategoryGroup': {
            updatedVariable = new ProductCategoryGroupVariable(variable.id.hashCode(), {
                parent: values['parent'] !== undefined ? new ProductCategoryGroup(parseInt(String(values['parent']))) : new ProductCategoryGroup(variable.values.parent.hashCode()),
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name,
                length: values['length'] !== undefined ? parseInt(String(values['length'])) : variable.values.length
            })
            break
        }
        case 'ProductCategory': {
            updatedVariable = new ProductCategoryVariable(variable.id.hashCode(), {
                parent: values['parent'] !== undefined ? new ProductCategory(parseInt(String(values['parent']))) : new ProductCategory(variable.values.parent.hashCode()),
                group: values['group'] !== undefined ? new ProductCategoryGroup(parseInt(String(values['group']))) : new ProductCategoryGroup(variable.values.group.hashCode()),
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name,
                code: values['code'] !== undefined ? String(values['code']) : variable.values.code,
                derivedCode: values['derivedCode'] !== undefined ? String(values['derivedCode']) : variable.values.derivedCode,
                childCount: values['childCount'] !== undefined ? parseInt(String(values['childCount'])) : variable.values.childCount
            })
            break
        }
        case 'Product': {
            updatedVariable = new ProductVariable(variable.id.hashCode(), {
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name,
                category: values['category'] !== undefined ? new ProductCategory(parseInt(String(values['category']))) : new ProductCategory(variable.values.category.hashCode()),
                code: values['code'] !== undefined ? String(values['code']) : variable.values.code,
                sku: values['sku'] !== undefined ? String(values['sku']) : variable.values.sku
            })
            break
        }
        case 'CompanyProduct': {
            updatedVariable = new CompanyProductVariable(variable.id.hashCode(), {
                company: values['company'] !== undefined ? new Company(parseInt(String(values['company']))) : new Company(variable.values.company.hashCode()),
                product: values['product'] !== undefined ? new Product(parseInt(String(values['product']))) : new Product(variable.values.product.hashCode())
            })
            break
        }
        case 'ProductTagGroup': {
            updatedVariable = new ProductTagGroupVariable(variable.id.hashCode(), {
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name
            })
            break
        }
        case 'ProductTag': {
            updatedVariable = new ProductTagVariable(variable.id.hashCode(), {
                group: values['group'] !== undefined ? new ProductTagGroup(parseInt(String(values['group']))) : new ProductTagGroup(variable.values.group.hashCode()),
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name
            })
            break
        }
        case 'MappingProductTag': {
            updatedVariable = new MappingProductTagVariable(variable.id.hashCode(), {
                product: values['product'] !== undefined ? new Product(parseInt(String(values['product']))) : new Product(variable.values.product.hashCode()),
                tag: values['tag'] !== undefined ? new ProductTag(parseInt(String(values['tag']))) : new ProductTag(variable.values.tag.hashCode())
            })
            break
        }
        case 'UOM': {
            updatedVariable = new UOMVariable(variable.id.hashCode(), {
                product: values['product'] !== undefined ? new Product(parseInt(String(values['product']))) : new Product(variable.values.product.hashCode()),
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name,
                conversionRate: values['conversionRate'] !== undefined ? parseFloat(String(values['conversionRate'])) : variable.values.conversionRate
            })
            break
        }
        case 'Indent': {
            updatedVariable = new IndentVariable(variable.id.hashCode(), {

            })
            break
        }
        case 'IndentItem': {
            updatedVariable = new IndentItemVariable(variable.id.hashCode(), {
                indent: values['indent'] !== undefined ? new Indent(parseInt(String(values['indent']))) : new Indent(variable.values.indent.hashCode()),
                product: values['product'] !== undefined ? new Product(parseInt(String(values['product']))) : new Product(variable.values.product.hashCode()),
                quantity: values['quantity'] !== undefined ? parseInt(String(values['quantity'])) : variable.values.quantity,
                uom: values['uom'] !== undefined ? new UOM(parseInt(String(values['uom']))) : new UOM(variable.values.uom.hashCode()),
                ordered: values['ordered'] !== undefined ? parseInt(String(values['ordered'])) : variable.values.ordered,
                received: values['received'] !== undefined ? parseInt(String(values['received'])) : variable.values.received,
                approved: values['approved'] !== undefined ? parseInt(String(values['approved'])) : variable.values.approved,
                rejected: values['rejected'] !== undefined ? parseInt(String(values['rejected'])) : variable.values.rejected,
                returned: values['returned'] !== undefined ? parseInt(String(values['returned'])) : variable.values.returned,
                requisted: values['requisted'] !== undefined ? parseInt(String(values['requisted'])) : variable.values.requisted,
                consumed: values['consumed'] !== undefined ? parseInt(String(values['consumed'])) : variable.values.consumed
            })
            break
        }
        case 'Quotation': {
            updatedVariable = new QuotationVariable(variable.id.hashCode(), {
                indent: values['indent'] !== undefined ? new Indent(parseInt(String(values['indent']))) : new Indent(variable.values.indent.hashCode()),
                company: values['company'] !== undefined ? new Company(parseInt(String(values['company']))) : new Company(variable.values.company.hashCode())
            })
            break
        }
        case 'QuotationItem': {
            updatedVariable = new QuotationItemVariable(variable.id.hashCode(), {
                quotation: values['quotation'] !== undefined ? new Quotation(parseInt(String(values['quotation']))) : new Quotation(variable.values.quotation.hashCode()),
                indentItem: values['indentItem'] !== undefined ? new IndentItem(parseInt(String(values['indentItem']))) : new IndentItem(variable.values.indentItem.hashCode()),
                quantity: values['quantity'] !== undefined ? parseInt(String(values['quantity'])) : variable.values.quantity
            })
            break
        }
        case 'PurchaseOrder': {
            updatedVariable = new PurchaseOrderVariable(variable.id.hashCode(), {
                quotation: values['quotation'] !== undefined ? new Quotation(parseInt(String(values['quotation']))) : new Quotation(variable.values.quotation.hashCode())
            })
            break
        }
        case 'PurchaseOrderItem': {
            updatedVariable = new PurchaseOrderItemVariable(variable.id.hashCode(), {
                purchaseOrder: values['purchaseOrder'] !== undefined ? new PurchaseOrder(parseInt(String(values['purchaseOrder']))) : new PurchaseOrder(variable.values.purchaseOrder.hashCode()),
                quotationItem: values['quotationItem'] !== undefined ? new QuotationItem(parseInt(String(values['quotationItem']))) : new QuotationItem(variable.values.quotationItem.hashCode()),
                quantity: values['quantity'] !== undefined ? parseInt(String(values['quantity'])) : variable.values.quantity,
                price: values['price'] !== undefined ? parseFloat(String(values['price'])) : variable.values.price,
                received: values['received'] !== undefined ? parseInt(String(values['received'])) : variable.values.received
            })
            break
        }
        case 'PurchaseInvoice': {
            updatedVariable = new PurchaseInvoiceVariable(variable.id.hashCode(), {
                purchaseOrder: values['purchaseOrder'] !== undefined ? new PurchaseOrder(parseInt(String(values['purchaseOrder']))) : new PurchaseOrder(variable.values.purchaseOrder.hashCode())
            })
            break
        }
        case 'PurchaseInvoiceItem': {
            updatedVariable = new PurchaseInvoiceItemVariable(variable.id.hashCode(), {
                purchaseInvoice: values['purchaseInvoice'] !== undefined ? new PurchaseInvoice(parseInt(String(values['purchaseInvoice']))) : new PurchaseInvoice(variable.values.purchaseInvoice.hashCode()),
                purchaseOrderItem: values['purchaseOrderItem'] !== undefined ? new PurchaseOrderItem(parseInt(String(values['purchaseOrderItem']))) : new PurchaseOrderItem(variable.values.purchaseOrderItem.hashCode()),
                quantity: values['quantity'] !== undefined ? parseInt(String(values['quantity'])) : variable.values.quantity,
                approved: values['approved'] !== undefined ? parseInt(String(values['approved'])) : variable.values.approved,
                rejected: values['rejected'] !== undefined ? parseInt(String(values['rejected'])) : variable.values.rejected
            })
            break
        }
        case 'MaterialApprovalSlip': {
            updatedVariable = new MaterialApprovalSlipVariable(variable.id.hashCode(), {
                purchaseInvoice: values['purchaseInvoice'] !== undefined ? new PurchaseInvoice(parseInt(String(values['purchaseInvoice']))) : new PurchaseInvoice(variable.values.purchaseInvoice.hashCode())
            })
            break
        }
        case 'MaterialApprovalSlipItem': {
            updatedVariable = new MaterialApprovalSlipItemVariable(variable.id.hashCode(), {
                materialApprovalSlip: values['materialApprovalSlip'] !== undefined ? new MaterialApprovalSlip(parseInt(String(values['materialApprovalSlip']))) : new MaterialApprovalSlip(variable.values.materialApprovalSlip.hashCode()),
                purchaseInvoiceItem: values['purchaseInvoiceItem'] !== undefined ? new PurchaseInvoiceItem(parseInt(String(values['purchaseInvoiceItem']))) : new PurchaseInvoiceItem(variable.values.purchaseInvoiceItem.hashCode()),
                quantity: values['quantity'] !== undefined ? parseInt(String(values['quantity'])) : variable.values.quantity,
                requisted: values['requisted'] !== undefined ? parseInt(String(values['requisted'])) : variable.values.requisted
            })
            break
        }
        case 'MaterialRejectionSlip': {
            updatedVariable = new MaterialRejectionSlipVariable(variable.id.hashCode(), {
                purchaseInvoice: values['purchaseInvoice'] !== undefined ? new PurchaseInvoice(parseInt(String(values['purchaseInvoice']))) : new PurchaseInvoice(variable.values.purchaseInvoice.hashCode())
            })
            break
        }
        case 'MaterialRejectionSlipItem': {
            updatedVariable = new MaterialRejectionSlipItemVariable(variable.id.hashCode(), {
                materialRejectionSlip: values['materialRejectionSlip'] !== undefined ? new MaterialRejectionSlip(parseInt(String(values['materialRejectionSlip']))) : new MaterialRejectionSlip(variable.values.materialRejectionSlip.hashCode()),
                purchaseInvoiceItem: values['purchaseInvoiceItem'] !== undefined ? new PurchaseInvoiceItem(parseInt(String(values['purchaseInvoiceItem']))) : new PurchaseInvoiceItem(variable.values.purchaseInvoiceItem.hashCode()),
                quantity: values['quantity'] !== undefined ? parseInt(String(values['quantity'])) : variable.values.quantity,
                returned: values['returned'] !== undefined ? parseInt(String(values['returned'])) : variable.values.returned
            })
            break
        }
        case 'MaterialReturnSlip': {
            updatedVariable = new MaterialReturnSlipVariable(variable.id.hashCode(), {
                materialRejectionSlip: values['materialRejectionSlip'] !== undefined ? new MaterialRejectionSlip(parseInt(String(values['materialRejectionSlip']))) : new MaterialRejectionSlip(variable.values.materialRejectionSlip.hashCode())
            })
            break
        }
        case 'MaterialReturnSlipItem': {
            updatedVariable = new MaterialReturnSlipItemVariable(variable.id.hashCode(), {
                materialReturnSlip: values['materialReturnSlip'] !== undefined ? new MaterialReturnSlip(parseInt(String(values['materialReturnSlip']))) : new MaterialReturnSlip(variable.values.materialReturnSlip.hashCode()),
                materialRejectionSlipItem: values['materialRejectionSlipItem'] !== undefined ? new MaterialRejectionSlipItem(parseInt(String(values['materialRejectionSlipItem']))) : new MaterialRejectionSlipItem(variable.values.materialRejectionSlipItem.hashCode()),
                quantity: values['quantity'] !== undefined ? parseInt(String(values['quantity'])) : variable.values.quantity
            })
            break
        }
        case 'MaterialRequistionSlip': {
            updatedVariable = new MaterialRequistionSlipVariable(variable.id.hashCode(), {
                materialApprovalSlip: values['materialApprovalSlip'] !== undefined ? new MaterialApprovalSlip(parseInt(String(values['materialApprovalSlip']))) : new MaterialApprovalSlip(variable.values.materialApprovalSlip.hashCode())
            })
            break
        }
        case 'MaterialRequistionSlipItem': {
            updatedVariable = new MaterialRequistionSlipItemVariable(variable.id.hashCode(), {
                materialRequistionSlip: values['materialRequistionSlip'] !== undefined ? new MaterialRequistionSlip(parseInt(String(values['materialRequistionSlip']))) : new MaterialRequistionSlip(variable.values.materialRequistionSlip.hashCode()),
                materialApprovalSlipItem: values['materialApprovalSlipItem'] !== undefined ? new MaterialApprovalSlipItem(parseInt(String(values['materialApprovalSlipItem']))) : new MaterialApprovalSlipItem(variable.values.materialApprovalSlipItem.hashCode()),
                quantity: values['quantity'] !== undefined ? parseInt(String(values['quantity'])) : variable.values.quantity,
                consumed: values['consumed'] !== undefined ? parseInt(String(values['consumed'])) : variable.values.consumed
            })
            break
        }
        case 'BOM': {
            updatedVariable = new BOMVariable(variable.id.hashCode(), {
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name
            })
            break
        }
        case 'BOMItem': {
            updatedVariable = new BOMItemVariable(variable.id.hashCode(), {
                bom: values['bom'] !== undefined ? new BOM(parseInt(String(values['bom']))) : new BOM(variable.values.bom.hashCode()),
                product: values['product'] !== undefined ? new Product(parseInt(String(values['product']))) : new Product(variable.values.product.hashCode()),
                quantity: values['quantity'] !== undefined ? parseInt(String(values['quantity'])) : variable.values.quantity,
                uom: values['uom'] !== undefined ? new UOM(parseInt(String(values['uom']))) : new UOM(variable.values.uom.hashCode())
            })
            break
        }
        case 'ProductionPreparationSlip': {
            updatedVariable = new ProductionPreparationSlipVariable(variable.id.hashCode(), {
                bom: values['bom'] !== undefined ? new BOM(parseInt(String(values['bom']))) : new BOM(variable.values.bom.hashCode()),
                approved: values['approved'] !== undefined ? parseInt(String(values['approved'])) : variable.values.approved,
                scrapped: values['scrapped'] !== undefined ? parseInt(String(values['scrapped'])) : variable.values.scrapped
            })
            break
        }
        case 'ProductionPreparationSlipItem': {
            updatedVariable = new ProductionPreparationSlipItemVariable(variable.id.hashCode(), {
                productionPreparationSlip: values['productionPreparationSlip'] !== undefined ? new ProductionPreparationSlip(parseInt(String(values['productionPreparationSlip']))) : new ProductionPreparationSlip(variable.values.productionPreparationSlip.hashCode()),
                bomItem: values['bomItem'] !== undefined ? String(values['bomItem']) : variable.values.bomItem,
                materialRequistionSlipItem: values['materialRequistionSlipItem'] !== undefined ? new MaterialRequistionSlipItem(parseInt(String(values['materialRequistionSlipItem']))) : new MaterialRequistionSlipItem(variable.values.materialRequistionSlipItem.hashCode())
            })
            break
        }
        case 'ScrapMaterialSlip': {
            updatedVariable = new ScrapMaterialSlipVariable(variable.id.hashCode(), {
                productionPreparationSlip: values['productionPreparationSlip'] !== undefined ? new ProductionPreparationSlip(parseInt(String(values['productionPreparationSlip']))) : new ProductionPreparationSlip(variable.values.productionPreparationSlip.hashCode()),
                quantity: values['quantity'] !== undefined ? parseInt(String(values['quantity'])) : variable.values.quantity
            })
            break
        }
        case 'TransferMaterialSlip': {
            updatedVariable = new TransferMaterialSlipVariable(variable.id.hashCode(), {
                productionPreparationSlip: values['productionPreparationSlip'] !== undefined ? new ProductionPreparationSlip(parseInt(String(values['productionPreparationSlip']))) : new ProductionPreparationSlip(variable.values.productionPreparationSlip.hashCode()),
                quantity: values['quantity'] !== undefined ? parseInt(String(values['quantity'])) : variable.values.quantity,
                transferred: values['transferred'] !== undefined ? parseInt(String(values['transferred'])) : variable.values.transferred
            })
            break
        }
        case 'WarehouseAcceptanceSlip': {
            updatedVariable = new WarehouseAcceptanceSlipVariable(variable.id.hashCode(), {
                transferMaterialSlip: values['transferMaterialSlip'] !== undefined ? new TransferMaterialSlip(parseInt(String(values['transferMaterialSlip']))) : new TransferMaterialSlip(variable.values.transferMaterialSlip.hashCode()),
                quantity: values['quantity'] !== undefined ? parseInt(String(values['quantity'])) : variable.values.quantity
            })
            break
        }
        default: {
            const _exhaustiveCheck: never = variable
            return _exhaustiveCheck
        }
    }
    return [updatedVariable, mergeDiffs([getRemoveVariableDiff(variable.typeName, variable.id.hashCode()), getReplaceVariableDiff(updatedVariable)])]
}

export function deleteVariable(typeName: NonPrimitiveType, id: number): DiffVariable {
    return getRemoveVariableDiff(typeName, id)
}

export type Multiqueue = Record<string, ReadonlyArray<
    | {
        typeName: NonPrimitiveType
        op: 'create'
        values: object
    } | {
        typeName: NonPrimitiveType
        op: 'update'
        id: number
        active?: boolean
        values: object
    } | {
        typeName: NonPrimitiveType
        op: 'delete'
        id: number
    }>>

export async function executeQueue(multiqueue: Multiqueue): Promise<[Record<string, Array<any>>, DiffVariable]> {
    const diffs: Array<DiffVariable> = []
    const result: Record<string, Array<any>> = {}
    for (const queueName in multiqueue) {
        const queue = multiqueue[queueName]
        result[queueName] = []
        var symbolFlag = true
        for (const mutation of queue) {
            if (symbolFlag) {
                switch (mutation.op) {
                    case 'create': {
                        const [variable, diff] = createVariable(mutation.typeName, mutation.values)
                        result[queueName].push(variable)
                        diffs.push(diff)
                        break
                    }
                    case 'update': {
                        const variable = await getVariable(mutation.typeName, mutation.id)
                        if (variable !== undefined) {
                            const [updatedVariable, diff] = await updateVariable(variable, mutation.values)
                            result[queueName].push(updatedVariable)
                            diffs.push(diff)
                        } else {
                            result[queueName].push({})
                            symbolFlag = false
                        }
                        break
                    }
                    case 'delete': {
                        const variable = await getVariable(mutation.typeName, mutation.id)
                        if (variable !== undefined) {
                            result[queueName].push(variable)
                        } else {
                            result[queueName].push({})
                        }
                        const diff = deleteVariable(mutation.typeName, mutation.id)
                        diffs.push(diff)
                        break
                    }
                    default: {
                        const _exhaustiveCheck: never = mutation
                        return _exhaustiveCheck
                    }
                }
            }
        }
    }
    return [result, mergeDiffs(diffs)]
}
