import { Vector } from 'prelude-ts'
import create from 'zustand'
import { Layer, Diff, compose } from './layers'
import { devtools } from 'zustand/middleware'

const base: Layer = {
    Product: Vector.of(),
    UOM: Vector.of(),
    Indent: Vector.of(),
    IndentItem: Vector.of(),
    Supplier: Vector.of(),
    SupplierProduct: Vector.of(),
    Quotation: Vector.of(),
    QuotationItem: Vector.of(),
    PurchaseOrder: Vector.of(),
    PurchaseOrderItem: Vector.of(),
    PurchaseInvoice: Vector.of(),
    PurchaseInvoiceItem: Vector.of(),
    MaterialApprovalSlip: Vector.of(),
    MaterialApprovalSlipItem: Vector.of(),
    MaterialRejectionSlip: Vector.of(),
    MaterialRejectionSlipItem: Vector.of(),
    MaterialReturnSlip: Vector.of(),
    MaterialReturnSlipItem: Vector.of(),
    MaterialRequistionSlip: Vector.of(),
    MaterialRequistionSlipItem: Vector.of(),
    BOM: Vector.of(),
    BOMItem: Vector.of(),
    ProductionPreparationSlip: Vector.of(),
    ProductionPreparationSlipItem: Vector.of(),
    ScrapMaterialSlip: Vector.of(),
    TransferMaterialSlip: Vector.of(),
    WarehouseAcceptanceSlip: Vector.of()
}

export const noDiff: Diff = {
    id: -1,
    active: true,
    Product: {
        replace: Vector.of(),
        remove: Vector.of()
    },
    UOM: {
        replace: Vector.of(),
        remove: Vector.of()
    },
    Indent: {
        replace: Vector.of(),
        remove: Vector.of()
    },
    IndentItem: {
        replace: Vector.of(),
        remove: Vector.of()
    },
    Supplier: {
        replace: Vector.of(),
        remove: Vector.of()
    },
    SupplierProduct: {
        replace: Vector.of(),
        remove: Vector.of()
    },
    Quotation: {
        replace: Vector.of(),
        remove: Vector.of()
    },
    QuotationItem: {
        replace: Vector.of(),
        remove: Vector.of()
    },
    PurchaseOrder: {
        replace: Vector.of(),
        remove: Vector.of()
    },
    PurchaseOrderItem: {
        replace: Vector.of(),
        remove: Vector.of()
    },
    PurchaseInvoice: {
        replace: Vector.of(),
        remove: Vector.of()
    },
    PurchaseInvoiceItem: {
        replace: Vector.of(),
        remove: Vector.of()
    },
    MaterialApprovalSlip: {
        replace: Vector.of(),
        remove: Vector.of()
    },
    MaterialApprovalSlipItem: {
        replace: Vector.of(),
        remove: Vector.of()
    },
    MaterialRejectionSlip: {
        replace: Vector.of(),
        remove: Vector.of()
    },
    MaterialRejectionSlipItem: {
        replace: Vector.of(),
        remove: Vector.of()
    },
    MaterialReturnSlip: {
        replace: Vector.of(),
        remove: Vector.of()
    },
    MaterialReturnSlipItem: {
        replace: Vector.of(),
        remove: Vector.of()
    },
    MaterialRequistionSlip: {
        replace: Vector.of(),
        remove: Vector.of()
    },
    MaterialRequistionSlipItem: {
        replace: Vector.of(),
        remove: Vector.of()
    },
    BOM: {
        replace: Vector.of(),
        remove: Vector.of()
    },
    BOMItem: {
        replace: Vector.of(),
        remove: Vector.of()
    },
    ProductionPreparationSlip: {
        replace: Vector.of(),
        remove: Vector.of()
    },
    ProductionPreparationSlipItem: {
        replace: Vector.of(),
        remove: Vector.of()
    },
    ScrapMaterialSlip: {
        replace: Vector.of(),
        remove: Vector.of()
    },
    TransferMaterialSlip: {
        replace: Vector.of(),
        remove: Vector.of()
    },
    WarehouseAcceptanceSlip: {
        replace: Vector.of(),
        remove: Vector.of()
    }
}

type State = {
    counter: number
    base: Layer
    diffs: Array<Diff>
    variables: Layer
    addDiff: (diff: Diff) => Diff
}

// Note: fields in store should be mutable, or change is not reflected where they are used.
// Store is limited to per page open, use Local Storage to sync store every few seconds.
export const store = create<State>(devtools((set, get) => ({
    counter: 0,
    base: base,
    diffs: [],
    variables: base,
    addDiff: (diff) => {
        const x = { ...diff, id: get().counter }
        get().diffs.push(x)
        set({ variables: compose(get().variables, get().diffs) })
        get().counter += 1
        return x
    }
})))
