import Dexie from 'dexie'
import { Immutable } from 'immer'
import { BOMItemRow, BOMRow, DiffRow, IndentItemRow, IndentRow, MaterialApprovalSlipItemRow, MaterialApprovalSlipRow, MaterialRejectionSlipItemRow, MaterialRejectionSlipRow, MaterialRequistionSlipItemRow, MaterialRequistionSlipRow, MaterialReturnSlipItemRow, MaterialReturnSlipRow, ProductionPreparationSlipItemRow, ProductionPreparationSlipRow, ProductRow, PurchaseInvoiceItemRow, PurchaseInvoiceRow, PurchaseOrderItemRow, PurchaseOrderRow, QuotationItemRow, QuotationRow, ScrapMaterialSlipRow, SupplierProductRow, SupplierRow, TransferMaterialSlipRow, UOMRow, WarehouseAcceptanceSlipRow } from './rows'

class Database extends Dexie {
    diffs: Dexie.Table<Immutable<DiffRow>, number>
    products: Dexie.Table<Immutable<ProductRow>, string>
    uoms: Dexie.Table<Immutable<UOMRow>, string>
    indents: Dexie.Table<Immutable<IndentRow>, string>
    indentItems: Dexie.Table<Immutable<IndentItemRow>, string>
    suppliers: Dexie.Table<Immutable<SupplierRow>, string>
    supplierProducts: Dexie.Table<Immutable<SupplierProductRow>, string>
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
            products: '&variableName',
            uoms: '[product+name]',
            indents: '&variableName',
            indentItems: '[indent+product]',
            suppliers: '&variableName',
            supplierProducts: '[supplier+product]',
            quotations: '&variableName',
            quotationItems: '[quotation+indentItem]',
            purchaseOrders: '&variableName',
            purchaseOrderItems: '[purchaseOrder+quotationItem]',
            purchaseInvoices: '&variableName',
            purchaseInvoiceItems: '[purchaseInvoice+purchaseOrderItem]',
            materialApprovalSlips: '&variableName',
            materialApprovalSlipItems: '[materialApprovalSlip+PurchaseInvoiceItem]',
            materialRejectionSlips: '&variableName',
            materialRejectionSlipItems: '[materialRejectionSlip+purchaseInvoiceItem]',
            materialReturnSlips: '&variableName',
            materialReturnSlipItems: '[materialReturnSlip+materialRejectionSlipItem]',
            materialRequistionSlips: '&variableName',
            materialRequistionSlipItems: '[materialRequistionSlip+materialApprovalSlipItem]',
            boms: '&variableName',
            bomItems: '[bom+product]',
            productionPreparationSlips: '&variableName',
            productionPreparationSlipItems: '[productionPreparationSlip+bomItem]',
            scrapMaterialSlips: '&variableName',
            transferMaterialSlips: '&variableName',
            warehouseAcceptanceSlips: '&variableName'
        })

        this.diffs = this.table('diffs')
        this.products = this.table('products')
        this.uoms = this.table('uoms')
        this.indents = this.table('indents')
        this.indentItems = this.table('indentItems')
        this.suppliers = this.table('suppliers')
        this.supplierProducts = this.table('supplierProducts')
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
        this.products.mapToClass(ProductRow)
        this.uoms.mapToClass(UOMRow)
        this.indents.mapToClass(IndentRow)
        this.indentItems.mapToClass(IndentItemRow)
        this.suppliers.mapToClass(SupplierRow)
        this.supplierProducts.mapToClass(SupplierProductRow)
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
