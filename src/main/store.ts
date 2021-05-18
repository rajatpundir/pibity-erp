import { HashSet } from 'prelude-ts'
import create from 'zustand/vanilla'
import { Layer, Diff, compose } from './layers'
import { devtools } from 'zustand/middleware'

const base: Layer = {
    Product: HashSet.of(),
    UOM: HashSet.of(),
    Indent: HashSet.of(),
    IndentItem: HashSet.of(),
    Supplier: HashSet.of(),
    SupplierProduct: HashSet.of(),
    Quotation: HashSet.of(),
    QuotationItem: HashSet.of(),
    PurchaseOrder: HashSet.of(),
    PurchaseOrderItem: HashSet.of(),
    PurchaseInvoice: HashSet.of(),
    PurchaseInvoiceItem: HashSet.of(),
    MaterialApprovalSlip: HashSet.of(),
    MaterialApprovalSlipItem: HashSet.of(),
    MaterialRejectionSlip: HashSet.of(),
    MaterialRejectionSlipItem: HashSet.of(),
    MaterialReturnSlip: HashSet.of(),
    MaterialReturnSlipItem: HashSet.of(),
    MaterialRequistionSlip: HashSet.of(),
    MaterialRequistionSlipItem: HashSet.of(),
    BOM: HashSet.of(),
    BOMItem: HashSet.of(),
    ProductionPreparationSlip: HashSet.of(),
    ProductionPreparationSlipItem: HashSet.of(),
    ScrapMaterialSlip: HashSet.of(),
    TransferMaterialSlip: HashSet.of(),
    WarehouseAcceptanceSlip: HashSet.of()
}

export const noDiff: Diff = {
    id: -1,
    active: true,
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
    Supplier: {
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

export const { getState, setState, subscribe, destroy } = store
