import { Immutable } from 'immer';
import { DiffVariable, getRemoveVariableDiff, getReplaceVariableDiff, getVariable, mergeDiffs } from './layers'
import { NonPrimitiveType } from './types';
import { when } from './utils';
import { Variable, ProductVariable, UOMVariable, IndentVariable, IndentItemVariable, CompanyVariable, CompanyProductVariable, QuotationVariable, QuotationItemVariable, PurchaseOrderVariable, PurchaseOrderItemVariable, PurchaseInvoiceVariable, PurchaseInvoiceItemVariable, MaterialApprovalSlipVariable, MaterialApprovalSlipItemVariable, MaterialRejectionSlipVariable, MaterialRejectionSlipItemVariable, MaterialReturnSlipVariable, MaterialReturnSlipItemVariable, MaterialRequistionSlipVariable, MaterialRequistionSlipItemVariable, BOMVariable, BOMItemVariable, ProductionPreparationSlipVariable, ProductionPreparationSlipItemVariable, ScrapMaterialSlipVariable, TransferMaterialSlipVariable, WarehouseAcceptanceSlipVariable, Product, UOM, Indent, IndentItem, Company, Quotation, QuotationItem, PurchaseOrder, PurchaseOrderItem, PurchaseInvoice, PurchaseInvoiceItem, MaterialApprovalSlip, MaterialApprovalSlipItem, MaterialRejectionSlip, MaterialRejectionSlipItem, MaterialReturnSlip, MaterialRequistionSlip, MaterialRequistionSlipItem, BOM, ProductionPreparationSlip, TransferMaterialSlip, RegionVariable, CountryVariable, Region, StateVariable, DistrictVariable, SubdistrictVariable, PostalCodeVariable, AddressVariable, BankVariable, BankBranchVariable, BankAccountVariable, CompanyAddressVariable, CompanyContactVariable, CompanyBankAccountVariable, Country, State, District, Subdistrict, PostalCode, Bank, Address, BankBranch, BankAccount, CompanyTagGroupVariable, CompanyTagVariable, CompanyTagGroup, MappingCompanyTagVariable, CompanyTag, Contact, CurrencyVariable, ContactAddressVariable, ContactVariable, Currency, CurrencyRateVariable, MemoVariable, BankTransactionVariable, Memo, CurrencyRate, ProductTagGroupVariable, ProductTagVariable, ProductTagGroup, MappingProductTagVariable, ProductTag, ProductCategoryGroupVariable, ProductCategoryGroup, ProductCategoryVariable, ProductCategory } from './variables'

export function createVariable(typeName: NonPrimitiveType, variableName: string, values: object): [Variable, DiffVariable] {
    const variable: Variable = when(typeName, {
        'Region': () => new RegionVariable(variableName, {
            name: String(values['name'])
        }),
        'Country': () => new CountryVariable(variableName, {
            region: new Region(String(values['region'])),
            name: String(values['name'])
        }),
        'State': () => new StateVariable(variableName, {
            country: new Country(String(values['country'])),
            name: String(values['name'])
        }),
        'District': () => new DistrictVariable(variableName, {
            state: new State(String(values['state'])),
            name: String(values['name'])
        }),
        'Subdistrict': () => new SubdistrictVariable(variableName, {
            district: new District(String(values['district'])),
            name: String(values['name'])
        }),
        'PostalCode': () => new PostalCodeVariable(variableName, {
            subdistrict: new Subdistrict(String(values['subdistrict'])),
            name: String(values['name'])
        }),
        'Address': () => new AddressVariable(variableName, {
            postalCode: new PostalCode(String(values['postalCode'])),
            line1: String(values['line1']),
            line2: String(values['line2']),
            latitude: parseFloat(String(values['latitude'])),
            longitude: parseFloat(String(values['longitude']))
        }),
        'Company': () => new CompanyVariable(variableName, {
            name: String(values['name']),
            email: String(values['email']),
            telephone: String(values['telephone']),
            mobile: String(values['mobile']),
            website: String(values['website']),
            gstin: String(values['gstin']),
            pan: String(values['pan']),
            iec: String(values['iec'])
        }),
        'CompanyAddress': () => new CompanyAddressVariable(variableName, {
            company: new Company(String(values['company'])),
            name: String(values['name']),
            address: new Address(String(values['address']))
        }),
        'CompanyTagGroup': () => new CompanyTagGroupVariable(variableName, {
            name: String(values['name'])
        }),
        'CompanyTag': () => new CompanyTagVariable(variableName, {
            group: new CompanyTagGroup(String(values['group'])),
            name: String(values['name'])
        }),
        'MappingCompanyTag': () => new MappingCompanyTagVariable(variableName, {
            company: new Company(String(values['company'])),
            tag: new CompanyTag(String(values['tag']))
        }),
        'Contact': () => new ContactVariable(variableName, {
            name: String(values['name']),
            email: String(values['email']),
            telephone: String(values['telephone']),
            mobile: String(values['mobile']),
            website: String(values['website'])
        }),
        'ContactAddress': () => new ContactAddressVariable(variableName, {
            contact: new Contact(String(values['contact'])),
            name: String(values['name']),
            address: new Address(String(values['address']))
        }),
        'CompanyContact': () => new CompanyContactVariable(variableName, {
            company: new Company(String(values['company'])),
            contact: new Contact(String(values['contact'])),
            role: String(values['role']),
            email: String(values['email']),
            telephone: String(values['telephone']),
            mobile: String(values['mobile'])
        }),
        'Currency': () => new CurrencyVariable(variableName, {
            name: String(values['name'])
        }),
        'CurrencyRate': () => new CurrencyRateVariable(variableName, {
            currency: new Currency(String(values['currency'])),
            conversionRate: parseFloat(String(values['conversionRate'])),
            startTime: parseInt(String(values['startTime'])),
            endTime: parseInt(String(values['endTime']))
        }),
        'Memo': () => new MemoVariable(variableName, {
            company: new Company(String(values['company'])),
            currency: new Currency(String(values['currency'])),
            amount: parseFloat(String(values['amount'])),
            unsettled: parseFloat(String(values['unsettled']))
        }),
        'Bank': () => new BankVariable(variableName, {
            country: new Country(String(values['country'])),
            name: String(values['name']),
            website: String(values['website'])
        }),
        'BankBranch': () => new BankBranchVariable(variableName, {
            bank: new Bank(String(values['bank'])),
            name: String(values['name']),
            ifsc: String(values['ifsc']),
            address: new Address(String(values['address']))
        }),
        'BankAccount': () => new BankAccountVariable(variableName, {
            bank: new Bank(String(values['bank'])),
            bankBranch: new BankBranch(String(values['bankBranch'])),
            accountNumber: String(values['accountNumber']),
            accountName: String(values['accountName']),
            currency: new Currency(String(values['currency']))
        }),
        'BankTransaction': () => new BankTransactionVariable(variableName, {
            timestamp: parseInt(String(values['timestamp'])),
            memo: new Memo(String(values['memo'])),
            currencyRate: new CurrencyRate(String(values['currencyRate'])),
            bankAccount: new BankAccount(String(values['bankAccount'])),
            fromToAccount: new BankAccount(String(values['fromToAccount'])),
            credit: parseFloat(String(values['credit'])),
            debit: parseFloat(String(values['debit']))
        }),
        'CompanyBankAccount': () => new CompanyBankAccountVariable(variableName, {
            company: new Company(String(values['company'])),
            bankAccount: new BankAccount(String(values['bankAccount']))
        }),
        'ProductCategoryGroup': () => new ProductCategoryGroupVariable(variableName, {
            parent: new ProductCategoryGroup(String(values['parent'])),
            name: String(values['name']),
            length: parseInt(String(values['length']))
        }),
        'ProductCategory': () => new ProductCategoryVariable(variableName, {
            parent: new ProductCategory(String(values['parent'])),
            group: new ProductCategoryGroup(String(values['group'])),
            name: String(values['name']),
            code: String(values['code']),
            derivedCode: String(values['derivedCode']),
            childCount: parseInt(String(values['childCount']))
        }),
        'Product': () => new ProductVariable(variableName, {
            name: String(values['name']),
            category: new ProductCategory(String(values['category'])),
            code: String(values['code']),
            sku: String(values['sku'])
        }) as Variable,
        'ProductTagGroup': () => new ProductTagGroupVariable(variableName, {
            name: String(values['name'])
        }),
        'ProductTag': () => new ProductTagVariable(variableName, {
            group: new ProductTagGroup(String(values['group'])),
            name: String(values['name'])
        }),
        'MappingProductTag': () => new MappingProductTagVariable(variableName, {
            product: new Product(String(values['product'])),
            tag: new ProductTag(String(values['tag']))
        }),
        'UOM': () => new UOMVariable(variableName, {
            product: new Product(values['product']),
            name: String(values['name']),
            conversionRate: parseFloat(String(values['conversionRate']))
        }),
        'Indent': () => new IndentVariable(variableName, {}),
        'IndentItem': () => new IndentItemVariable(variableName, {
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
        }),
        'CompanyProduct': () => new CompanyProductVariable(variableName, {
            company: new Company(values['company']),
            product: new Product(values['product'])
        }),
        'Quotation': () => new QuotationVariable(variableName, {
            indent: new Indent(values['indent']),
            company: new Company(values['company'])
        }),
        'QuotationItem': () => new QuotationItemVariable(variableName, {
            quotation: new Quotation(values['quotation']),
            indentItem: new IndentItem(values['indentItem']),
            quantity: parseInt(String(values['quantity']))
        }),
        'PurchaseOrder': () => new PurchaseOrderVariable(variableName, {
            quotation: new Quotation(values['quotation'])
        }),
        'PurchaseOrderItem': () => new PurchaseOrderItemVariable(variableName, {
            purchaseOrder: new PurchaseOrder(values['purchaseOrder']),
            quotationItem: new QuotationItem(values['quotationItem']),
            quantity: parseInt(String(values['quantity'])),
            price: parseFloat(String(values['price'])),
            received: parseInt(String(values['received']))
        }),
        'PurchaseInvoice': () => new PurchaseInvoiceVariable(variableName, {
            purchaseOrder: new PurchaseOrder(values['purchaseOrder'])
        }),
        'PurchaseInvoiceItem': () => new PurchaseInvoiceItemVariable(variableName, {
            purchaseInvoice: new PurchaseInvoice(values['purchaseInvoice']),
            purchaseOrderItem: new PurchaseOrderItem(values['purchaseOrderItem']),
            quantity: parseInt(String(values['quantity'])),
            approved: parseInt(String(values['approved'])),
            rejected: parseInt(String(values['rejected']))
        }),
        'MaterialApprovalSlip': () => new MaterialApprovalSlipVariable(variableName, {
            purchaseInvoice: new PurchaseInvoice(values['purchaseInvoice'])
        }),
        'MaterialApprovalSlipItem': () => new MaterialApprovalSlipItemVariable(variableName, {
            materialApprovalSlip: new MaterialApprovalSlip(values['materialApprovalSlip']),
            purchaseInvoiceItem: new PurchaseInvoiceItem(values['purchaseInvoiceItem']),
            quantity: parseInt(String(values['quantity'])),
            requisted: parseInt(String(values['requisted']))
        }),
        'MaterialRejectionSlip': () => new MaterialRejectionSlipVariable(variableName, {
            purchaseInvoice: new PurchaseInvoice(values['purchaseInvoice'])
        }),
        'MaterialRejectionSlipItem': () => new MaterialRejectionSlipItemVariable(variableName, {
            materialRejectionSlip: new MaterialRejectionSlip(values['materialRejectionSlip']),
            purchaseInvoiceItem: new PurchaseInvoiceItem(values['purchaseInvoiceItem']),
            quantity: parseInt(String(values['quantity'])),
            returned: parseInt(String(values['returned']))
        }),
        'MaterialReturnSlip': () => new MaterialReturnSlipVariable(variableName, {
            materialRejectionSlip: new MaterialRejectionSlip(values['materialRejectionSlip'])
        }),
        'MaterialReturnSlipItem': () => new MaterialReturnSlipItemVariable(variableName, {
            materialReturnSlip: new MaterialReturnSlip(values['materialReturnSlip']),
            materialRejectionSlipItem: new MaterialRejectionSlipItem(values['materialRejectionSlipItem']),
            quantity: parseInt(String(values['quantity']))
        }),
        'MaterialRequistionSlip': () => new MaterialRequistionSlipVariable(variableName, {
            materialApprovalSlip: new MaterialApprovalSlip(values['materialApprovalSlip'])
        }),
        'MaterialRequistionSlipItem': () => new MaterialRequistionSlipItemVariable(variableName, {
            materialRequistionSlip: new MaterialRequistionSlip(values['materialRequistionSlip']),
            materialApprovalSlipItem: new MaterialApprovalSlipItem(values['materialApprovalSlipItem']),
            quantity: parseInt(String(values['quantity'])),
            consumed: parseInt(String(values['consumed']))
        }),
        'BOM': () => new BOMVariable(variableName, {
            name: String(values['name'])
        }),
        'BOMItem': () => new BOMItemVariable(variableName, {
            bom: new BOM(values['bom']),
            product: new Product(values['product']),
            quantity: parseInt(String(values['quantity'])),
            uom: new UOM(values['uom'])
        }),
        'ProductionPreparationSlip': () => new ProductionPreparationSlipVariable(variableName, {
            bom: new BOM(values['bom']),
            approved: parseInt(String(values['approved'])),
            scrapped: parseInt(String(values['scrapped']))
        }),
        'ProductionPreparationSlipItem': () => new ProductionPreparationSlipItemVariable(variableName, {
            productionPreparationSlip: new ProductionPreparationSlip(values['productionPreparationSlip']),
            bomItem: String(values['bomItem']),
            materialRequistionSlipItem: new MaterialRequistionSlipItem(values['materialRequistionSlipItem'])
        }),
        'ScrapMaterialSlip': () => new ScrapMaterialSlipVariable(variableName, {
            productionPreparationSlip: new ProductionPreparationSlip(values['productionPreparationSlip']),
            quantity: parseInt(String(values['quantity']))
        }),
        'TransferMaterialSlip': () => new TransferMaterialSlipVariable(variableName, {
            productionPreparationSlip: new ProductionPreparationSlip(values['productionPreparationSlip']),
            quantity: parseInt(String(values['quantity'])),
            transferred: parseInt(String(values['quatransferedntity']))
        }),
        'WarehouseAcceptanceSlip': () => new WarehouseAcceptanceSlipVariable(variableName, {
            transferMaterialSlip: new TransferMaterialSlip(values['transferMaterialSlip']),
            quantity: parseInt(String(values['quantity']))
        })
    })
    return [variable, getReplaceVariableDiff(variable)]
}

export async function updateVariable(variable: Immutable<Variable>, values: object, updatedVariableName?: string): Promise<[Variable, DiffVariable]> {
    let updatedVariable: Variable
    switch (variable.typeName) {
        case 'Region': {
            updatedVariable = new RegionVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name
            })
            break
        }
        case 'Country': {
            updatedVariable = new CountryVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                region: values['region'] !== undefined ? new Region(String(values['region'])) : new Region(variable.values.region.toString()),
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name
            })
            break
        }
        case 'State': {
            updatedVariable = new StateVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                country: values['country'] !== undefined ? new Country(String(values['country'])) : new Country(variable.values.country.toString()),
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name
            })
            break
        }
        case 'District': {
            updatedVariable = new DistrictVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                state: values['state'] !== undefined ? new State(String(values['state'])) : new State(variable.values.state.toString()),
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name
            })
            break
        }
        case 'Subdistrict': {
            updatedVariable = new SubdistrictVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                district: values['district'] !== undefined ? new District(String(values['district'])) : new District(variable.values.district.toString()),
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name
            })
            break
        }
        case 'PostalCode': {
            updatedVariable = new PostalCodeVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                subdistrict: values['subdistrict'] !== undefined ? new Subdistrict(String(values['subdistrict'])) : new Subdistrict(variable.values.subdistrict.toString()),
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name
            })
            break
        }
        case 'Address': {
            updatedVariable = new AddressVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                postalCode: values['postalCode'] !== undefined ? new PostalCode(String(values['postalCode'])) : new PostalCode(variable.values.postalCode.toString()),
                line1: values['line1'] !== undefined ? String(values['line1']) : variable.values.line1,
                line2: values['line1'] !== undefined ? String(values['line2']) : variable.values.line2,
                latitude: values['latitude'] !== undefined ? parseFloat(String(values['latitude'])) : variable.values.latitude,
                longitude: values['longitude'] !== undefined ? parseFloat(String(values['longitude'])) : variable.values.longitude
            })
            break
        }
        case 'Company': {
            updatedVariable = new CompanyVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name,
                email: values['email'] !== undefined ? String(values['email']) : variable.values.email,
                telephone: values['telephone'] !== undefined ? String(values['telephone']) : variable.values.telephone,
                mobile: values['mobile'] !== undefined ? String(values['mobile']) : variable.values.mobile,
                website: values['website'] !== undefined ? String(values['website']) : variable.values.website,
                gstin: values['gstin'] !== undefined ? String(values['gstin']) : variable.values.gstin,
                pan: values['pan'] !== undefined ? String(values['pan']) : variable.values.pan,
                iec: values['iec'] !== undefined ? String(values['iec']) : variable.values.iec,
            })
            break
        }
        case 'CompanyAddress': {
            updatedVariable = new CompanyAddressVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                company: values['company'] !== undefined ? new Company(String(values['company'])) : new Company(variable.values.company.toString()),
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name,
                address: values['address'] !== undefined ? new Address(String(values['address'])) : new Address(variable.values.address.toString())
            })
            break
        }
        case 'CompanyTagGroup': {
            updatedVariable = new CompanyTagGroupVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name
            })
            break
        }
        case 'CompanyTag': {
            updatedVariable = new CompanyTagVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                group: values['group'] !== undefined ? new CompanyTagGroup(String(values['group'])) : new CompanyTagGroup(variable.values.group.toString()),
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name
            })
            break
        }
        case 'MappingCompanyTag': {
            updatedVariable = new MappingCompanyTagVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                company: values['company'] !== undefined ? new Company(String(values['company'])) : new Company(variable.values.company.toString()),
                tag: values['tag'] !== undefined ? new CompanyTag(String(values['tag'])) : new CompanyTag(variable.values.tag.toString())
            })
            break
        }
        case 'Contact': {
            updatedVariable = new ContactVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name,
                email: values['email'] !== undefined ? String(values['email']) : variable.values.email,
                telephone: values['telephone'] !== undefined ? String(values['telephone']) : variable.values.telephone,
                mobile: values['mobile'] !== undefined ? String(values['mobile']) : variable.values.mobile,
                website: values['website'] !== undefined ? String(values['website']) : variable.values.website
            })
            break
        }
        case 'ContactAddress': {
            updatedVariable = new ContactAddressVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                contact: values['contact'] !== undefined ? new Contact(String(values['contact'])) : new Contact(variable.values.contact.toString()),
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name,
                address: values['address'] !== undefined ? new Address(String(values['address'])) : new Address(variable.values.address.toString())
            })
            break
        }
        case 'CompanyContact': {
            updatedVariable = new CompanyContactVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                company: values['company'] !== undefined ? new Company(String(values['company'])) : new Company(variable.values.company.toString()),
                contact: values['contact'] !== undefined ? new Contact(String(values['contact'])) : new Contact(variable.values.contact.toString()),
                role: values['role'] !== undefined ? String(values['role']) : variable.values.role,
                email: values['email'] !== undefined ? String(values['email']) : variable.values.email,
                telephone: values['telephone'] !== undefined ? String(values['telephone']) : variable.values.telephone,
                mobile: values['mobile'] !== undefined ? String(values['mobile']) : variable.values.mobile
            })
            break
        }
        case 'Currency': {
            updatedVariable = new CurrencyVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name
            })
            break
        }
        case 'CurrencyRate': {
            updatedVariable = new CurrencyRateVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                currency: values['currency'] !== undefined ? new Currency(String(values['currency'])) : new Currency(variable.values.currency.toString()),
                conversionRate: values['conversionRate'] !== undefined ? parseFloat(values['conversionRate']) : variable.values.conversionRate,
                startTime: values['startTime'] !== undefined ? parseInt(values['startTime']) : variable.values.startTime,
                endTime: values['endTime'] !== undefined ? parseInt(values['endTime']) : variable.values.endTime
            })
            break
        }
        case 'Memo': {
            updatedVariable = new MemoVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                company: values['company'] !== undefined ? new Company(String(values['company'])) : new Company(variable.values.company.toString()),
                currency: values['currency'] !== undefined ? new Currency(String(values['currency'])) : new Currency(variable.values.currency.toString()),
                amount: values['amount'] !== undefined ? parseFloat(values['amount']) : variable.values.amount,
                unsettled: values['unsettled'] !== undefined ? parseFloat(values['unsettled']) : variable.values.unsettled
            })
            break
        }
        case 'Bank': {
            updatedVariable = new BankVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                country: values['country'] !== undefined ? new Country(String(values['country'])) : new Country(variable.values.country.toString()),
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name,
                website: values['website'] !== undefined ? String(values['website']) : variable.values.website
            })
            break
        }
        case 'BankBranch': {
            updatedVariable = new BankBranchVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                bank: values['bank'] !== undefined ? new Bank(String(values['bank'])) : new Bank(variable.values.bank.toString()),
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name,
                ifsc: values['ifsc'] !== undefined ? String(values['ifsc']) : variable.values.ifsc,
                address: values['address'] !== undefined ? new Address(String(values['address'])) : new Address(variable.values.address.toString())
            })
            break
        }
        case 'BankAccount': {
            updatedVariable = new BankAccountVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                bank: values['bank'] !== undefined ? new Bank(String(values['bank'])) : new Bank(variable.values.bank.toString()),
                bankBranch: values['bankBranch'] !== undefined ? new BankBranch(String(values['bankBranch'])) : new BankBranch(variable.values.bankBranch.toString()),
                accountNumber: values['accountNumber'] !== undefined ? String(values['accountNumber']) : variable.values.accountNumber,
                accountName: values['accountName'] !== undefined ? String(values['accountName']) : variable.values.accountName,
                currency: values['currency'] !== undefined ? new Currency(String(values['currency'])) : new Currency(variable.values.currency.toString())
            })
            break
        }
        case 'BankTransaction': {
            updatedVariable = new BankTransactionVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                timestamp: values['timestamp'] !== undefined ? parseInt(values['timestamp']) : variable.values.timestamp,
                memo: values['memo'] !== undefined ? new Memo(String(values['memo'])) : new Memo(variable.values.memo.toString()),
                currencyRate: values['currencyRate'] !== undefined ? new CurrencyRate(String(values['currencyRate'])) : new CurrencyRate(variable.values.currencyRate.toString()),
                bankAccount: values['bankAccount'] !== undefined ? new BankAccount(String(values['bankAccount'])) : new BankAccount(variable.values.bankAccount.toString()),
                fromToAccount: values['fromToAccount'] !== undefined ? new BankAccount(String(values['fromToAccount'])) : new BankAccount(variable.values.fromToAccount.toString()),
                credit: values['credit'] !== undefined ? parseFloat(values['credit']) : variable.values.credit,
                debit: values['debit'] !== undefined ? parseFloat(values['debit']) : variable.values.debit
            })
            break
        }
        case 'CompanyBankAccount': {
            updatedVariable = new CompanyBankAccountVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                company: values['company'] !== undefined ? new Company(String(values['company'])) : new Company(variable.values.company.toString()),
                bankAccount: values['bankAccount'] !== undefined ? new BankAccount(String(values['bankAccount'])) : new BankAccount(variable.values.bankAccount.toString())
            })
            break
        }
        case 'ProductCategoryGroup': {
            updatedVariable = new ProductCategoryGroupVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                parent: values['parent'] !== undefined ? new ProductCategoryGroup(String(values['parent'])) : new ProductCategoryGroup(variable.values.parent.toString()),
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name,
                length: values['length'] !== undefined ? parseInt(values['length']) : variable.values.length
            })
            break
        }
        case 'ProductCategory': {
            updatedVariable = new ProductCategoryVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                parent: values['parent'] !== undefined ? new ProductCategory(String(values['parent'])) : new ProductCategory(variable.values.parent.toString()),
                group: values['group'] !== undefined ? new ProductCategoryGroup(String(values['group'])) : new ProductCategoryGroup(variable.values.group.toString()),
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name,
                code: values['code'] !== undefined ? String(values['code']) : variable.values.code,
                derivedCode: values['derivedCode'] !== undefined ? String(values['derivedCode']) : variable.values.derivedCode,
                childCount: values['childCount'] !== undefined ? parseInt(values['childCount']) : variable.values.childCount
            })
            break
        }
        case 'Product': {
            updatedVariable = new ProductVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name,
                category: values['category'] !== undefined ? new ProductCategory(String(values['category'])) : new ProductCategory(variable.values.category.toString()),
                code: values['code'] !== undefined ? String(values['code']) : variable.values.code,
                sku: values['sku'] !== undefined ? String(values['sku']) : variable.values.sku
            })
            break
        }
        case 'ProductTagGroup': {
            updatedVariable = new ProductTagGroupVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name
            })
            break
        }
        case 'ProductTag': {
            updatedVariable = new ProductTagVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                group: values['group'] !== undefined ? new ProductTagGroup(String(values['group'])) : new ProductTagGroup(variable.values.group.toString()),
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name
            })
            break
        }
        case 'MappingProductTag': {
            updatedVariable = new MappingProductTagVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                product: values['product'] !== undefined ? new Product(String(values['product'])) : new Product(variable.values.product.toString()),
                tag: values['tag'] !== undefined ? new ProductTag(String(values['tag'])) : new ProductTag(variable.values.tag.toString())
            })
            break
        }
        case 'UOM': {
            updatedVariable = new UOMVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                product: values['product'] !== undefined ? new Product(String(values['product'])) : new Product(variable.values.product.toString()),
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name,
                conversionRate: values['conversionRate'] !== undefined ? parseInt(values['conversionRate']) : variable.values.conversionRate
            })
            break
        }
        case 'Indent': {
            updatedVariable = new IndentVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {})
            break
        }
        case 'IndentItem': {
            updatedVariable = new IndentItemVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                indent: values['indent'] !== undefined ? new Indent(String(values['indent'])) : new Indent(variable.values.indent.toString()),
                product: values['product'] !== undefined ? new Product(String(values['product'])) : new Product(variable.values.product.toString()),
                quantity: values['quantity'] !== undefined ? parseInt(values['quantity']) : variable.values.quantity,
                uom: values['uom'] !== undefined ? new UOM(String(values['uom'])) : new UOM(variable.values.uom.toString()),
                ordered: values['ordered'] !== undefined ? parseInt(values['ordered']) : variable.values.ordered,
                received: values['received'] !== undefined ? parseInt(values['received']) : variable.values.received,
                approved: values['approved'] !== undefined ? parseInt(values['approved']) : variable.values.approved,
                rejected: values['rejected'] !== undefined ? parseInt(values['rejected']) : variable.values.rejected,
                returned: values['returned'] !== undefined ? parseInt(values['returned']) : variable.values.returned,
                requisted: values['requisted'] !== undefined ? parseInt(values['requisted']) : variable.values.requisted,
                consumed: values['consumed'] !== undefined ? parseInt(values['consumed']) : variable.values.consumed
            })
            break
        }
        case 'CompanyProduct': {
            updatedVariable = new CompanyProductVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                company: values['company'] !== undefined ? new Company(String(values['company'])) : new Company(variable.values.company.toString()),
                product: values['product'] !== undefined ? new Product(String(values['product'])) : new Product(variable.values.product.toString())
            })
            break
        }
        case 'Quotation': {
            updatedVariable = new QuotationVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                indent: values['indent'] !== undefined ? new Indent(String(values['indent'])) : new Indent(variable.values.indent.toString()),
                company: values['company'] !== undefined ? new Company(String(values['company'])) : new Company(variable.values.company.toString())
            })
            break
        }
        case 'QuotationItem': {
            updatedVariable = new QuotationItemVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                quotation: values['quotation'] !== undefined ? new Quotation(String(values['quotation'])) : new Quotation(variable.values.quotation.toString()),
                indentItem: values['indentItem'] !== undefined ? new IndentItem(String(values['indentItem'])) : new IndentItem(variable.values.indentItem.toString()),
                quantity: values['quantity'] !== undefined ? parseInt(values['quantity']) : variable.values.quantity
            })
            break
        }
        case 'PurchaseOrder': {
            updatedVariable = new PurchaseOrderVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                quotation: values['quotation'] !== undefined ? new Quotation(String(values['quotation'])) : new Quotation(variable.values.quotation.toString())
            })
            break
        }
        case 'PurchaseOrderItem': {
            updatedVariable = new PurchaseOrderItemVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                purchaseOrder: values['purchaseOrder'] !== undefined ? new PurchaseOrder(String(values['purchaseOrder'])) : new PurchaseOrder(variable.values.purchaseOrder.toString()),
                quotationItem: values['quotationItem'] !== undefined ? new QuotationItem(String(values['quotationItem'])) : new QuotationItem(variable.values.quotationItem.toString()),
                quantity: values['quantity'] !== undefined ? parseInt(values['quantity']) : variable.values.quantity,
                price: values['price'] !== undefined ? parseFloat(values['price']) : variable.values.price,
                received: values['received'] !== undefined ? parseInt(values['received']) : variable.values.received
            })
            break
        }
        case 'PurchaseInvoice': {
            updatedVariable = new PurchaseInvoiceVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                purchaseOrder: values['purchaseOrder'] !== undefined ? new PurchaseOrder(String(values['purchaseOrder'])) : new PurchaseOrder(variable.values.purchaseOrder.toString())
            })
            break
        }
        case 'PurchaseInvoiceItem': {
            updatedVariable = new PurchaseInvoiceItemVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                purchaseInvoice: values['purchaseInvoice'] !== undefined ? new PurchaseInvoice(String(values['purchaseInvoice'])) : new PurchaseInvoice(variable.values.purchaseInvoice.toString()),
                purchaseOrderItem: values['purchaseOrderItem'] !== undefined ? new PurchaseOrderItem(String(values['purchaseOrderItem'])) : new PurchaseOrderItem(variable.values.purchaseOrderItem.toString()),
                quantity: values['quantity'] !== undefined ? parseInt(values['quantity']) : variable.values.quantity,
                approved: values['approved'] !== undefined ? parseInt(values['approved']) : variable.values.approved,
                rejected: values['rejected'] !== undefined ? parseInt(values['rejected']) : variable.values.rejected
            })
            break
        }
        case 'MaterialApprovalSlip': {
            updatedVariable = new MaterialApprovalSlipVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                purchaseInvoice: values['purchaseInvoice'] !== undefined ? new PurchaseInvoice(String(values['purchaseInvoice'])) : new PurchaseInvoice(variable.values.purchaseInvoice.toString())
            })
            break
        }
        case 'MaterialApprovalSlipItem': {
            updatedVariable = new MaterialApprovalSlipItemVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                materialApprovalSlip: values['materialApprovalSlip'] !== undefined ? new MaterialApprovalSlip(String(values['materialApprovalSlip'])) : new MaterialApprovalSlip(variable.values.materialApprovalSlip.toString()),
                purchaseInvoiceItem: values['purchaseInvoiceItem'] !== undefined ? new PurchaseInvoiceItem(String(values['purchaseInvoiceItem'])) : new PurchaseInvoiceItem(variable.values.purchaseInvoiceItem.toString()),
                quantity: values['quantity'] !== undefined ? parseInt(values['quantity']) : variable.values.quantity,
                requisted: values['requisted'] !== undefined ? parseInt(values['requisted']) : variable.values.requisted
            })
            break
        }
        case 'MaterialRejectionSlip': {
            updatedVariable = new MaterialRejectionSlipVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                purchaseInvoice: values['purchaseInvoice'] !== undefined ? new PurchaseInvoice(String(values['purchaseInvoice'])) : new PurchaseInvoice(variable.values.purchaseInvoice.toString())
            })
            break
        }
        case 'MaterialRejectionSlipItem': {
            updatedVariable = new MaterialRejectionSlipItemVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                materialRejectionSlip: values['materialRejectionSlip'] !== undefined ? new MaterialRejectionSlip(String(values['materialRejectionSlip'])) : new MaterialRejectionSlip(variable.values.materialRejectionSlip.toString()),
                purchaseInvoiceItem: values['purchaseInvoiceItem'] !== undefined ? new PurchaseInvoiceItem(String(values['purchaseInvoiceItem'])) : new PurchaseInvoiceItem(variable.values.purchaseInvoiceItem.toString()),
                quantity: values['quantity'] !== undefined ? parseInt(values['quantity']) : variable.values.quantity,
                returned: values['returned'] !== undefined ? parseInt(values['returned']) : variable.values.returned
            })
            break
        }
        case 'MaterialReturnSlip': {
            updatedVariable = new MaterialReturnSlipVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                materialRejectionSlip: values['materialRejectionSlip'] !== undefined ? new MaterialRejectionSlip(String(values['materialRejectionSlip'])) : new MaterialRejectionSlip(variable.values.materialRejectionSlip.toString())
            })
            break
        }
        case 'MaterialReturnSlipItem': {
            updatedVariable = new MaterialReturnSlipItemVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                materialReturnSlip: values['materialReturnSlip'] !== undefined ? new MaterialReturnSlip(String(values['materialReturnSlip'])) : new MaterialReturnSlip(variable.values.materialReturnSlip.toString()),
                materialRejectionSlipItem: values['materialRejectionSlipItem'] !== undefined ? new MaterialRejectionSlipItem(String(values['materialRejectionSlipItem'])) : new MaterialRejectionSlipItem(variable.values.materialRejectionSlipItem.toString()),
                quantity: values['quantity'] !== undefined ? parseInt(values['quantity']) : variable.values.quantity
            })
            break
        }
        case 'MaterialRequistionSlip': {
            updatedVariable = new MaterialRequistionSlipVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                materialApprovalSlip: values['materialApprovalSlip'] !== undefined ? new MaterialApprovalSlip(String(values['materialApprovalSlip'])) : new MaterialApprovalSlip(variable.values.materialApprovalSlip.toString())
            })
            break
        }
        case 'MaterialRequistionSlipItem': {
            updatedVariable = new MaterialRequistionSlipItemVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                materialRequistionSlip: values['materialRequistionSlip'] !== undefined ? new MaterialRequistionSlip(String(values['materialRequistionSlip'])) : new MaterialRequistionSlip(variable.values.materialRequistionSlip.toString()),
                materialApprovalSlipItem: values['materialApprovalSlipItem'] !== undefined ? new MaterialApprovalSlipItem(String(values['materialApprovalSlipItem'])) : new MaterialApprovalSlipItem(variable.values.materialApprovalSlipItem.toString()),
                quantity: values['quantity'] !== undefined ? parseInt(values['quantity']) : variable.values.quantity,
                consumed: values['consumed'] !== undefined ? parseInt(values['consumed']) : variable.values.consumed
            })
            break
        }
        case 'BOM': {
            updatedVariable = new BOMVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                name: values['name'] !== undefined ? String(values['name']) : variable.values.name
            })
            break
        }
        case 'BOMItem': {
            updatedVariable = new BOMItemVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                bom: values['bom'] !== undefined ? new BOM(String(values['bom'])) : new BOM(variable.values.bom.toString()),
                product: values['product'] !== undefined ? new Product(String(values['product'])) : new Product(variable.values.product.toString()),
                quantity: values['quantity'] !== undefined ? parseInt(values['quantity']) : variable.values.quantity,
                uom: values['uom'] !== undefined ? new UOM(String(values['uom'])) : new UOM(variable.values.uom.toString())
            })
            break
        }
        case 'ProductionPreparationSlip': {
            updatedVariable = new ProductionPreparationSlipVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                bom: values['bom'] !== undefined ? new BOM(String(values['bom'])) : new BOM(variable.values.bom.toString()),
                approved: values['approved'] !== undefined ? parseInt(values['approved']) : variable.values.approved,
                scrapped: values['scrapped'] !== undefined ? parseInt(values['scrapped']) : variable.values.scrapped
            })
            break
        }
        case 'ProductionPreparationSlipItem': {
            updatedVariable = new ProductionPreparationSlipItemVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                productionPreparationSlip: values['productionPreparationSlip'] !== undefined ? new ProductionPreparationSlip(String(values['productionPreparationSlip'])) : new ProductionPreparationSlip(variable.values.productionPreparationSlip.toString()),
                bomItem: values['bomItem'] !== undefined ? String(values['bomItem']) : variable.values.bomItem,
                materialRequistionSlipItem: values['materialRequistionSlipItem'] !== undefined ? new MaterialRequistionSlipItem(String(values['materialRequistionSlipItem'])) : new MaterialRequistionSlipItem(variable.values.materialRequistionSlipItem.toString())
            })
            break
        }
        case 'ScrapMaterialSlip': {
            updatedVariable = new ScrapMaterialSlipVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                productionPreparationSlip: values['productionPreparationSlip'] !== undefined ? new ProductionPreparationSlip(String(values['productionPreparationSlip'])) : new ProductionPreparationSlip(variable.values.productionPreparationSlip.toString()),
                quantity: values['quantity'] !== undefined ? parseInt(values['quantity']) : variable.values.quantity
            })
            break
        }
        case 'TransferMaterialSlip': {
            updatedVariable = new TransferMaterialSlipVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                productionPreparationSlip: values['productionPreparationSlip'] !== undefined ? new ProductionPreparationSlip(String(values['productionPreparationSlip'])) : new ProductionPreparationSlip(variable.values.productionPreparationSlip.toString()),
                quantity: values['quantity'] !== undefined ? parseInt(values['quantity']) : variable.values.quantity,
                transferred: values['transferred'] !== undefined ? parseInt(values['transferred']) : variable.values.transferred
            })
            break
        }
        case 'WarehouseAcceptanceSlip': {
            updatedVariable = new WarehouseAcceptanceSlipVariable(updatedVariableName !== undefined ? updatedVariableName : variable.id.toString(), {
                transferMaterialSlip: values['transferMaterialSlip'] !== undefined ? new TransferMaterialSlip(String(values['transferMaterialSlip'])) : new TransferMaterialSlip(variable.values.transferMaterialSlip.toString()),
                quantity: values['quantity'] !== undefined ? parseInt(values['quantity']) : variable.values.quantity
            })
            break
        }
        default: {
            const _exhaustiveCheck: never = variable
            return _exhaustiveCheck
        }
    }
    return [updatedVariable, mergeDiffs([getRemoveVariableDiff(variable.typeName, variable.id.toString()), getReplaceVariableDiff(updatedVariable)])]
}

export function deleteVariable(typeName: NonPrimitiveType, variableName: string): DiffVariable {
    return getRemoveVariableDiff(typeName, variableName)
}

export type Multiqueue = Record<string, ReadonlyArray<
    | {
        typeName: NonPrimitiveType
        op: 'create'
        variableName: string
        values: object
    } | {
        typeName: NonPrimitiveType
        op: 'update'
        variableName: string
        updatedVariableName?: string
        active?: boolean
        values: object
    } | {
        typeName: NonPrimitiveType
        op: 'delete'
        variableName: string
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
                        const [variable, diff] = createVariable(mutation.typeName, mutation.variableName, mutation.values)
                        result[queueName].push(variable)
                        diffs.push(diff)
                        break
                    }
                    case 'update': {
                        const variable = await getVariable(mutation.typeName, mutation.variableName)
                        if (variable !== undefined) {
                            const [updatedVariable, diff] = await updateVariable(variable, mutation.values, mutation.updatedVariableName)
                            result[queueName].push(updatedVariable)
                            diffs.push(diff)
                        } else {
                            result[queueName].push({})
                            symbolFlag = false
                        }
                        break
                    }
                    case 'delete': {
                        const variable = await getVariable(mutation.typeName, mutation.variableName)
                        if (variable !== undefined) {
                            result[queueName].push(variable)
                        } else {
                            result[queueName].push({})
                        }
                        const diff = deleteVariable(mutation.typeName, mutation.variableName)
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
