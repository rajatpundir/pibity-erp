import { executeCircuit } from "./circuit"
import { circuits } from "./circuits"
import { getState } from "./store"


export default function trialDataExecute() {

    const [, , c2] = executeCircuit(circuits.createProduct, {
        sku: 'R1',
        name: ' 510kΩ 0.25W ±5% SMD(1206 package) ',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 1
        }]
    })
    getState().addDiff(c2)

    const [, , c3] = executeCircuit(circuits.createProduct, {
        sku: 'R2',
        name: '3.9Ω 0.125W ±1% SMD(0805 package) ',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }]
    })
    getState().addDiff(c3)

    const [, , c4] = executeCircuit(circuits.createProduct, {
        sku: 'R3',
        name: '470kΩ 0.125W ±5% SMD(0805 package) ',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 1
        }]
    })
    getState().addDiff(c4)

    const [, , c5] = executeCircuit(circuits.createProduct, {
        sku: 'R4',
        name: '100kΩ 0.125W ±5% SMD(0805 package)',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }]
    })
    getState().addDiff(c5)

    const [, , c6] = executeCircuit(circuits.createProduct, {
        sku: 'RL1',
        name: '56kΩ 0.125W ±5% SMD(0805 package)',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 1
        }]
    })
    getState().addDiff(c6)

    const [, , c8] = executeCircuit(circuits.createProduct, {
        sku: 'Fuse',
        name: 'RES-AXI- 10 Ω/1WS (mini size) L=5.0±0.5mm Horizontal Mounting ',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 1
        }]
    })
    getState().addDiff(c8)

    const [, , c9] = executeCircuit(circuits.createProduct, {
        sku: 'Varistor (VR1 & VR2)',
        name: '07D511K L=5.0±0.5mm ',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }]
    })
    getState().addDiff(c9)

    const [, , p1] = executeCircuit(circuits.createProduct, {
        sku: 'C1',
        name: '100 nF / 450V ±5% ； P=10mm L=5.0±0.5mm CBB capacitor',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }]
    })
    getState().addDiff(p1)

    const [, , p2] = executeCircuit(circuits.createProduct, {
        sku: 'Cx1',
        name: '22nfd / 275V P10 L=5±0.2mm W13*H11*T5mm ',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }]
    })
    getState().addDiff(p2)

    const [, , p3] = executeCircuit(circuits.createProduct, {
        sku: 'C2',
        name: '4.7μF / 50V ±20% 105℃ φ5*11mm L=5.0±0.5mm Electrolytic cap 10000 Hrs.',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }]
    })
    getState().addDiff(p3)

    const [, , p4] = executeCircuit(circuits.createProduct, {
        sku: 'C3',
        name: '100μF / 63V ±20% 105℃ φ8*16mm L=5.0±0.5mm Electrolytic cap 10000Hrs.',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }]
    })
    getState().addDiff(p4)

    const [, , p5] = executeCircuit(circuits.createProduct, {
        sku: 'C5',
        name: ' 0.22μF/ 25V 0805 ±20﹪,X7R SMD(0805 package)',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }]
    })
    getState().addDiff(p5)

    const [, , p6] = executeCircuit(circuits.createProduct, {
        sku: 'BD1',
        name: 'MB10F 1A/1KV SOP-4 Package',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }]
    })
    getState().addDiff(p6)

    const [, , p7] = executeCircuit(circuits.createProduct, {
        sku: 'D5',
        name: 'ES1J 1A / 600V SMA',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }]
    })
    getState().addDiff(p7)

    const [, , p8] = executeCircuit(circuits.createProduct, {
        sku: 'D7',
        name: 'RS1M 1A / 600V SMA',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }]
    })
    getState().addDiff(p8)

    const [, , p9] = executeCircuit(circuits.createProduct, {
        sku: 'IC',
        name: 'RT8497C SOP-8 Package',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }]
    })
    getState().addDiff(p9)

    const [, , p10] = executeCircuit(circuits.createProduct, {
        sku: 'LED',
        name: 'LED-2835 - 0.5W - 150mA - 3.0 - 3.2V - 5400 - 6000K - 60 - 65lm - Ra80 ',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }]
    })
    getState().addDiff(p10)

    const [, , pr1] = executeCircuit(circuits.createProduct, {
        sku: 'Drum filter',
        name: 'φ6*10mm P=3.0 10mH±10%(with sleeve) L=5.0±0.5mm WD=0.1',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }]
    })
    getState().addDiff(pr1)

    const [, , pr2] = executeCircuit(circuits.createProduct, {
        sku: 'Transformer',
        name: '9W TR-EE10-1.0mH±3%-180Ts-WD=0.21mm-V1.0 Tape color: Yellow & Blue ',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }]
    })
    getState().addDiff(pr2)

    const [, , pr3] = executeCircuit(circuits.createProduct, {
        sku: 'Oputput Wire Red',
        name: '0.20mm²*50mm-red Drive side=3mm Led side=5mm (V+) ',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }]
    })
    getState().addDiff(pr3)

    const [, , pr4] = executeCircuit(circuits.createProduct, {
        sku: 'Oputput Wire Black',
        name: '0.20mm²*50mm-black Drive side=3mm Led side=5mm (V-)',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }]
    })
    getState().addDiff(pr4)

    const [, , pr5] = executeCircuit(circuits.createProduct, {
        sku: 'Supply Wire Yellow',
        name: '0.20mm²*38mm-yellow Drive side=5mm Cap side=6mm (L)',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }]
    })
    getState().addDiff(pr5)

    const [, , pr6] = executeCircuit(circuits.createProduct, {
        sku: 'Supply Wire White',
        name: '0.20mm²*44mm-white Drive side=5mm Cap side=6mm (N)',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }]
    })
    getState().addDiff(pr6)

    //createSupplier
    const [, , s1] = executeCircuit(circuits.createSupplier, {
        name: 'Royal'
    })
    getState().addDiff(s1)

    const [, , s11] = executeCircuit(circuits.createSupplier, {
        name: 'Fenghua'
    })
    getState().addDiff(s11)

    const [, , s12] = executeCircuit(circuits.createSupplier, {
        name: 'Yageo'
    })
    getState().addDiff(s12)

    const [, , s13] = executeCircuit(circuits.createSupplier, {
        name: 'Samsung'
    })
    getState().addDiff(s13)

    const [, , s14] = executeCircuit(circuits.createSupplier, {
        name: 'CCTC'
    })
    getState().addDiff(s14)

    const [, , s21] = executeCircuit(circuits.createSupplier, {
        name: 'Dafu'
    })
    getState().addDiff(s21)

    const [, , s22] = executeCircuit(circuits.createSupplier, {
        name: 'Keming'
    })
    getState().addDiff(s22)

    const [, , s23] = executeCircuit(circuits.createSupplier, {
        name: 'Nicholed'
    })
    getState().addDiff(s23)

    const [, , s24] = executeCircuit(circuits.createSupplier, {
        name: 'CCO'
    })
    getState().addDiff(s24)

    const [, , s3] = executeCircuit(circuits.createSupplier, {
        name: 'Chengdong'
    })
    getState().addDiff(s3)

    const [, , s31] = executeCircuit(circuits.createSupplier, {
        name: 'Weidy'
    })
    getState().addDiff(s31)

    const [, , s32] = executeCircuit(circuits.createSupplier, {
        name: 'Yinyan'
    })
    getState().addDiff(s32)
 
    const [, , s5] = executeCircuit(circuits.createSupplier, {
        name: 'TBOR'
    })
    getState().addDiff(s5)

    const [, , s51] = executeCircuit(circuits.createSupplier, {
        name: 'Topaz'
    })
    getState().addDiff(s51)

    const [, , s6] = executeCircuit(circuits.createSupplier, {
        name: 'Aishi'
    })
    getState().addDiff(s6)

    const [, , s7] = executeCircuit(circuits.createSupplier, {
        name: 'Weisheng'
    })
    getState().addDiff(s7)

    const [, , s8] = executeCircuit(circuits.createSupplier, {
        name: 'Xinhaifu'
    })
    getState().addDiff(s8)

    const [, , s81] = executeCircuit(circuits.createSupplier, {
        name: 'Shibiyou'
    })
    getState().addDiff(s81)

    const [, , s9] = executeCircuit(circuits.createSupplier, {
        name: 'Gelvshi'
    })
    getState().addDiff(s9)
 
    const [, , su6] = executeCircuit(circuits.createSupplier, {
        name: 'DLUE'
    })
    getState().addDiff(su6)

    const [, , su61] = executeCircuit(circuits.createSupplier, {
        name: 'BL'
    })
    getState().addDiff(su61)

    const [, , su62] = executeCircuit(circuits.createSupplier, {
        name: 'STS'
    })
    getState().addDiff(su62)

    const [, , su64] = executeCircuit(circuits.createSupplier, {
        name: 'Jilin Sino'
    })
    getState().addDiff(su64)

    const [, , su63] = executeCircuit(circuits.createSupplier, {
        name: 'Goodark'
    })
    getState().addDiff(su63)

    const [, , su7] = executeCircuit(circuits.createSupplier, {
        name: 'Richteck'
    })
    getState().addDiff(su7)

    const [, , su8] = executeCircuit(circuits.createSupplier, {
        name: 'Edison'
    })
    getState().addDiff(su8)

    const [, , su9] = executeCircuit(circuits.createSupplier, {
        name: 'Everlight'
    })
    getState().addDiff(su9)

    const [, , sup1] = executeCircuit(circuits.createSupplier, {
        name: 'Quanyou'
    })
    getState().addDiff(sup1)

    const [, , sup11] = executeCircuit(circuits.createSupplier, {
        name: 'zhonghe'
    })
    getState().addDiff(sup11)

    const [, , sup12] = executeCircuit(circuits.createSupplier, {
        name: 'Qinda'
    })
    getState().addDiff(sup12)

    //createIndent
    const [, , i1] = executeCircuit(circuits.createIndent, {
        items: [{
            product: 'abc',
            quantity: 50,
            uom: 'kg'
        }]
    })
    getState().addDiff(i1)

    const [, , i2] = executeCircuit(circuits.createIndent, {
        items: [{
            product: 'ResistorR1',
            quantity: 100,
            uom: 'NO'
        }]
    })
    getState().addDiff(i2)

    const [, , i3] = executeCircuit(circuits.createIndent, {
        items: [{
            product: 'ResistorR2',
            quantity: 150,
            uom: 'No'
        }]
    })
    getState().addDiff(i3)

    const [, , i4] = executeCircuit(circuits.createIndent, {
        items: [{
            product: 'ResistorR3',
            quantity: 5,
            uom: 'No'
        }]
    })
    getState().addDiff(i4)

    const [, , i5] = executeCircuit(circuits.createIndent, {
        items: [{
            product: 'ResistorR4',
            quantity: 5,
            uom: 'No'
        }]
    })
    getState().addDiff(i5)

    const [, , i6] = executeCircuit(circuits.createIndent, {
        items: [{
            product: 'ResistorR5',
            quantity: 150,
            uom: 'No'
        }]
    })
    getState().addDiff(i6)

    const [, , i7] = executeCircuit(circuits.createIndent, {
        items: [{
            product: 'ResistorR6',
            quantity: 500,
            uom: 'No'
        }]
    })
    getState().addDiff(i7)

    //createQuoation
    //im not able too see indent on page but wen i create from there it is showing ?? why
    const [, , q1] = executeCircuit(circuits.createQuotation, {
        indent: 'a7889b2a-4a65-4bc1-bd8a-3f991a7188de',
        supplier: 'Royal/Fenghua/Yageo/Samsung/CCTC',
        items: [{
            indentItem: '27ad397c-bb28-4808-ac3a-7c56a98a8da9',
            quantity: 1
        }]
    })
    getState().addDiff(q1)

    const [, , q2] = executeCircuit(circuits.createQuotation, {
        indent: '',
        supplier: '',
        items: [{
            indentItem: '',
            quantity: 1
        }]
    })
    getState().addDiff(q2)

    const [, , q3] = executeCircuit(circuits.createQuotation, {
        indent: '',
        supplier: '',
        items: [{
            indentItem: '',
            quantity: 1
        }]
    })
    getState().addDiff(q3)

    const [, , q4] = executeCircuit(circuits.createQuotation, {
        indent: '',
        supplier: '',
        items: [{
            indentItem: '',
            quantity: 1
        }]
    })
    getState().addDiff(q4)

    const [, , q5] = executeCircuit(circuits.createQuotation, {
        indent: '',
        supplier: '',
        items: [{
            indentItem: '',
            quantity: 1
        }]
    })
    getState().addDiff(q5)

    const [, , q6] = executeCircuit(circuits.createQuotation, {
        indent: '',
        supplier: '',
        items: [{
            indentItem: '',
            quantity: 1
        }]
    })
    getState().addDiff(q6)

    const [, , q7] = executeCircuit(circuits.createQuotation, {
        indent: '',
        supplier: '',
        items: [{
            indentItem: '',
            quantity: 1
        }]
    })
    getState().addDiff(q7)

    //createPurchaseOrder
    const [, , po1] = executeCircuit(circuits.createPurchaseOrder, {
        quotation: '',
        items: [{
            quotationItem: '',
            quantity: 1,
            price: 100
        }]
    })
    getState().addDiff(po1)

    const [, , po2] = executeCircuit(circuits.createPurchaseOrder, {
        quotation: '',
        items: [{
            quotationItem: '',
            quantity: 1,
            price: 100
        }]
    })
    getState().addDiff(po2)

    const [, , po3] = executeCircuit(circuits.createPurchaseOrder, {
        quotation: '',
        items: [{
            quotationItem: '',
            quantity: 1,
            price: 100
        }]
    })
    getState().addDiff(po3)

    const [, , po4] = executeCircuit(circuits.createPurchaseOrder, {
        quotation: '',
        items: [{
            quotationItem: '',
            quantity: 1,
            price: 100
        }]
    })
    getState().addDiff(po4)

    const [, , po5] = executeCircuit(circuits.createPurchaseOrder, {
        quotation: '',
        items: [{
            quotationItem: '',
            quantity: 1,
            price: 100
        }]
    })
    getState().addDiff(po5)

    const [, , po6] = executeCircuit(circuits.createPurchaseOrder, {
        quotation: '',
        items: [{
            quotationItem: '',
            quantity: 1,
            price: 100
        }]
    })
    getState().addDiff(po6)

    //createPurchaseInvoice
    const [, , pi1] = executeCircuit(circuits.createPurchaseInvoice, {
        purchaseOrder: '',
        items: [{
            purchaseOrderItem: '',
            quantity: 1
        }]
    })
    getState().addDiff(pi1)

    const [, , pi2] = executeCircuit(circuits.createPurchaseInvoice, {
        purchaseOrder: '',
        items: [{
            purchaseOrderItem: '',
            quantity: 1
        }]
    })
    getState().addDiff(pi2)

    const [, , pi3] = executeCircuit(circuits.createPurchaseInvoice, {
        purchaseOrder: '',
        items: [{
            purchaseOrderItem: '',
            quantity: 1
        }]
    })
    getState().addDiff(pi3)

    const [, , pi4] = executeCircuit(circuits.createPurchaseInvoice, {
        purchaseOrder: '',
        items: [{
            purchaseOrderItem: '',
            quantity: 1
        }]
    })
    getState().addDiff(pi4)

    const [, , pi5] = executeCircuit(circuits.createPurchaseInvoice, {
        purchaseOrder: '',
        items: [{
            purchaseOrderItem: '',
            quantity: 1
        }]
    })
    getState().addDiff(pi5)

    //createMaterialApprovalSlip
    const [, , ma1] = executeCircuit(circuits.createMaterialApprovalSlip, {
        purchaseInvoice: '',
        items: [{
            purchaseInvoiceItem: '',
            quantity: 1
        }]
    })
    getState().addDiff(ma1)

    //createMaterialRejectionSlip
    const [, , mr1] = executeCircuit(circuits.createMaterialRejectionSlip, {
        purchaseInvoice: '',
        items: [{
            purchaseInvoiceItem: '',
            quantity: 1
        }]
    })
    getState().addDiff(mr1)

    //createMaterialReturnSlip
    const [, , mre1] = executeCircuit(circuits.createMaterialReturnSlip, {
        materialRejectionSlip: '',
        items: [{
            materialRejectionSlipItem: '',
            quantity: 1
        }]
    })
    getState().addDiff(mre1)

    //createMaterialRequistionSlip
    const [, , mrq1] = executeCircuit(circuits.createMaterialRequistionSlip, {
        materialApprovalSlip: '',
        items: [{
            materialApprovalSlipItem: '',
            quantity: 1
        }]
    })
    getState().addDiff(mrq1)
}