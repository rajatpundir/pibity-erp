import { Vector } from "prelude-ts"
import { executeCircuit } from "./circuit"
import { DiffVariable, mergeDiffs } from "./layers"
import { circuits } from "./circuits"
import { db } from "./dexie"

export default async function createDemoData() {
    db.diffs.clear()
    var diffs = Vector.of<DiffVariable>()

    const [, , c2] = await executeCircuit(circuits.createProduct, {
        sku: 'R1',
        name: ' 510kΩ 0.25W ±5% SMD(1206 package)',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 1
        }],
        suppliers: []
    })
    diffs = diffs.append(c2)

    const [, , c3] = await executeCircuit(circuits.createProduct, {
        sku: 'R2',
        name: '3.9Ω 0.125W ±1% SMD(0805 package)',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }],
        suppliers: []
    })
    diffs = diffs.append(c3)

    const [, , c4] = await executeCircuit(circuits.createProduct, {
        sku: 'R3',
        name: '470kΩ 0.125W ±5% SMD(0805 package)',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 1
        }],
        suppliers: []
    })
    diffs = diffs.append(c4)

    const [, , c5] = await executeCircuit(circuits.createProduct, {
        sku: 'R4',
        name: '100kΩ 0.125W ±5% SMD(0805 package)',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }],
        suppliers: []
    })
    diffs = diffs.append(c5)

    const [, , c6] = await executeCircuit(circuits.createProduct, {
        sku: 'RL1',
        name: '56kΩ 0.125W ±5% SMD(0805 package)',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 1
        }],
        suppliers: []
    })
    diffs = diffs.append(c6)

    const [, , c8] = await executeCircuit(circuits.createProduct, {
        sku: 'Fuse',
        name: 'RES-AXI- 10 Ω/1WS (mini size) L=5.0±0.5mm Horizontal Mounting',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 1
        }],
        suppliers: []
    })
    diffs = diffs.append(c8)

    const [, , c9] = await executeCircuit(circuits.createProduct, {
        sku: 'Varistor (VR1 & VR2)',
        name: '07D511K L=5.0±0.5mm',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }],
        suppliers: []
    })
    diffs = diffs.append(c9)

    const [, , p1] = await executeCircuit(circuits.createProduct, {
        sku: 'C1',
        name: '100 nF / 450V ±5% ； P=10mm L=5.0±0.5mm CBB capacitor',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }],
        suppliers: []
    })
    diffs = diffs.append(p1)

    const [, , p2] = await executeCircuit(circuits.createProduct, {
        sku: 'Cx1',
        name: '22nfd / 275V P10 L=5±0.2mm W13*H11*T5mm',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }],
        suppliers: []
    })
    diffs = diffs.append(p2)

    const [, , p3] = await executeCircuit(circuits.createProduct, {
        sku: 'C2',
        name: '4.7μF / 50V ±20% 105℃ φ5*11mm L=5.0±0.5mm Electrolytic cap 10000 Hrs.',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }],
        suppliers: []
    })
    diffs = diffs.append(p3)

    const [, , p4] = await executeCircuit(circuits.createProduct, {
        sku: 'C3',
        name: '100μF / 63V ±20% 105℃ φ8*16mm L=5.0±0.5mm Electrolytic cap 10000Hrs.',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }],
        suppliers: []
    })
    diffs = diffs.append(p4)

    const [, , p5] = await executeCircuit(circuits.createProduct, {
        sku: 'C5',
        name: ' 0.22μF/ 25V 0805 ±20﹪,X7R SMD(0805 package)',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }],
        suppliers: []
    })
    diffs = diffs.append(p5)

    const [, , p6] = await executeCircuit(circuits.createProduct, {
        sku: 'BD1',
        name: 'MB10F 1A/1KV SOP-4 Package',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }],
        suppliers: []
    })
    diffs = diffs.append(p6)

    const [, , p7] = await executeCircuit(circuits.createProduct, {
        sku: 'D5',
        name: 'ES1J 1A / 600V SMA',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }],
        suppliers: []
    })
    diffs = diffs.append(p7)

    const [, , p8] = await executeCircuit(circuits.createProduct, {
        sku: 'D7',
        name: 'RS1M 1A / 600V SMA',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }],
        suppliers: []
    })
    diffs = diffs.append(p8)

    const [, , p9] = await executeCircuit(circuits.createProduct, {
        sku: 'IC',
        name: 'RT8497C SOP-8 Package',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }],
        suppliers: []
    })
    diffs = diffs.append(p9)

    const [, , p10] = await executeCircuit(circuits.createProduct, {
        sku: 'LED',
        name: 'LED-2835 - 0.5W - 150mA - 3.0 - 3.2V - 5400 - 6000K - 60 - 65lm - Ra80',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }],
        suppliers: []
    })
    diffs = diffs.append(p10)

    const [, , pr1] = await executeCircuit(circuits.createProduct, {
        sku: 'Drum filter',
        name: 'φ6*10mm P=3.0 10mH±10%(with sleeve) L=5.0±0.5mm WD=0.1',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }],
        suppliers: []
    })
    diffs = diffs.append(pr1)

    const [, , pr2] = await executeCircuit(circuits.createProduct, {
        sku: 'Transformer',
        name: '9W TR-EE10-1.0mH±3%-180Ts-WD=0.21mm-V1.0 Tape color: Yellow & Blue',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }],
        suppliers: []
    })
    diffs = diffs.append(pr2)

    const [, , pr3] = await executeCircuit(circuits.createProduct, {
        sku: 'Output Wire Red',
        name: '0.20mm²*50mm-red Drive side=3mm Led side=5mm (V+)',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }],
        suppliers: []
    })
    diffs = diffs.append(pr3)

    const [, , pr4] = await executeCircuit(circuits.createProduct, {
        sku: 'Output Wire Black',
        name: '0.20mm²*50mm-black Drive side=3mm Led side=5mm (V-)',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }],
        suppliers: []
    })
    diffs = diffs.append(pr4)

    const [, , pr5] = await executeCircuit(circuits.createProduct, {
        sku: 'Supply Wire Yellow',
        name: '0.20mm²*38mm-yellow Drive side=5mm Cap side=6mm (L)',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }],
        suppliers: []
    })
    diffs = diffs.append(pr5)

    const [, , pr6] = await executeCircuit(circuits.createProduct, {
        sku: 'Supply Wire White',
        name: '0.20mm²*44mm-white Drive side=5mm Cap side=6mm (N)',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }],
        suppliers: []
    })
    diffs = diffs.append(pr6)

    const [, , r1] = await executeCircuit(circuits.createRegion, {
        variableName: 'Africa',
        items: [
            { name: 'Algeria' },
            { name: 'Angola' },
            { name: 'Benin' },
            { name: 'Botswana' },
            { name: 'Burkina Faso' },
            { name: 'Burundi' },
            { name: 'Cameroon' },
            { name: 'Cabo Verde' },
            { name: 'Central African Republic' },
            { name: 'Chad' },
            { name: 'Comoros' },
            { name: 'Congo' },
            { name: "Congo (Democratic Republic of the)" },
            { name: "Cte d'Ivoire" },
            { name: 'Djibouti' },
            { name: 'Egypt' },
            { name: 'Equatorial Guinea' },
            { name: 'Eritrea' },
            { name: 'Ethiopia' },
            { name: 'Gabon' },
            { name: 'Gambia' },
            { name: 'Ghana' },
            { name: 'Guinea' },
            { name: 'Guinea-Bissau' },
            { name: 'Kenya' },
            { name: 'Lesotho' },
            { name: 'Liberia' },
            { name: 'Libya' },
            { name: 'Madagascar' },
            { name: 'Malawi' },
            { name: 'Mali' },
            { name: 'Mauritania' },
            { name: 'Mauritius' },
            { name: 'Mayotte' },
            { name: 'Morocco' },
            { name: 'Mozambique' },
            { name: 'Namibia' },
            { name: 'Niger' },
            { name: 'Nigeria' },
            { name: 'R騏nion' },
            { name: 'Rwanda' },
            { name: "Saint Helena, Ascension and Tristan da Cunha" },
            { name: 'Sao Tome and Principe' },
            { name: 'Senegal' },
            { name: 'Seychelles' },
            { name: 'Sierra Leone' },
            { name: 'Somalia' },
            { name: 'South Africa' },
            { name: 'South Sudan' },
            { name: 'Sudan' },
            { name: 'Swaziland' },
            { name: 'Tanzania, United Republic of' },
            { name: 'Togo' },
            { name: 'Tunisia' },
            { name: 'Uganda' },
            { name: 'Western Sahara' },
            { name: 'Zambia' },
            { name: 'Zimbabwe' }
        ]
    })
    diffs = diffs.append(r1)

    const [, , r2] = await executeCircuit(circuits.createRegion, {
        variableName: 'Asia',
        items: [
            { name: 'Afghanistan' },
            { name: 'Armenia' },
            { name: 'Azerbaijan' },
            { name: 'Bahrain' },
            { name: 'Bangladesh' },
            { name: 'Bhutan' },
            { name: 'Brunei Darussalam' },
            { name: 'Cambodia' },
            { name: 'China' },
            { name: 'Cyprus' },
            { name: 'Georgia' },
            { name: 'Hong Kong' },
            { name: 'Indonesia' },
            { name: 'Iran (Islamic Republic of)' },
            { name: 'Iraq' },
            { name: 'Israel' },
            { name: 'Japan' },
            { name: 'Jordan' },
            { name: 'Kazakhstan' },
            { name: "Korea (Democratic People's Republic of)" },
            { name: 'Korea (Republic of)' },
            { name: 'Kuwait' },
            { name: 'Kyrgyzstan' },
            { name: "Lao People's Democratic Republic" },
            { name: 'Lebanon' },
            { name: 'Macao' },
            { name: 'Malaysia' },
            { name: 'Maldives' },
            { name: 'Mongolia' },
            { name: 'Myanmar' },
            { name: 'Nepal' },
            { name: 'Oman' },
            { name: 'Pakistan' },
            { name: 'Palestine, State of' },
            { name: 'Philippines' },
            { name: 'Qatar' },
            { name: 'Saudi Arabia' },
            { name: 'Singapore' },
            { name: 'Sri Lanka' },
            { name: 'Syrian Arab Republic' },
            { name: 'Taiwan, Province of China' },
            { name: 'Tajikistan' },
            { name: 'Thailand' },
            { name: 'Timor-Leste' },
            { name: 'Turkey' },
            { name: 'Turkmenistan' },
            { name: 'United Arab Emirates' },
            { name: 'Uzbekistan' },
            { name: 'Viet Nam' },
            { name: 'Yemen' },
            { name: 'India' }
        ]
    })
    diffs = diffs.append(r2)

    const [, , r3] = await executeCircuit(circuits.createRegion, {
        variableName: 'Europe',
        items: [
            { name: 'Albania' },
            { name: 'Andorra' },
            { name: 'Austria' },
            { name: 'Belarus' },
            { name: 'Belgium' },
            { name: 'Bosnia and Herzegovina' },
            { name: 'Bulgaria' },
            { name: 'Croatia' },
            { name: 'Czech Republic' },
            { name: 'Denmark' },
            { name: 'Estonia' },
            { name: 'Faroe Islands' },
            { name: 'Finland' },
            { name: 'France' },
            { name: 'Germany' },
            { name: 'Gibraltar' },
            { name: 'Greece' },
            { name: 'Guernsey' },
            { name: 'Holy See' },
            { name: 'Hungary' },
            { name: 'Iceland' },
            { name: 'Ireland' },
            { name: 'Isle of Man' },
            { name: 'Italy' },
            { name: 'Jersey' },
            { name: 'Latvia' },
            { name: 'Liechtenstein' },
            { name: 'Lithuania' },
            { name: 'Luxembourg' },
            { name: 'Macedonia (the former Yugoslav Republic of)' },
            { name: 'Malta' },
            { name: 'Moldova (Republic of)' },
            { name: 'Monaco' },
            { name: 'Montenegro' },
            { name: 'Netherlands' },
            { name: 'Norway' },
            { name: 'Poland' },
            { name: 'Portugal' },
            { name: 'Romania' },
            { name: 'Russian Federation' },
            { name: 'San Marino' },
            { name: 'Serbia' },
            { name: 'Slovakia' },
            { name: 'Slovenia' },
            { name: 'Spain' },
            { name: 'Svalbard and Jan Mayen' },
            { name: 'Sweden' },
            { name: 'Switzerland' },
            { name: 'Ukraine' },
            { name: 'United Kingdom of Great Britain and Northern Ireland' }
        ]
    })
    diffs = diffs.append(r3)

    const [, , r4] = await executeCircuit(circuits.createRegion, {
        variableName: 'North America',
        items: [
            { name: 'Bermuda' },
            { name: 'Canada' },
            { name: 'Greenland' },
            { name: 'Saint Pierre and Miquelon' },
            { name: 'United States of America' },
            { name: 'Belize' },
            { name: 'Costa Rica' },
            { name: 'El Salvador' },
            { name: 'Guatemala' },
            { name: 'Honduras' },
            { name: 'Mexico' },
            { name: 'Nicaragua' },
            { name: 'Panama' },
            { name: 'Anguilla' },
            { name: 'Antigua and Barbuda' },
            { name: 'Aruba' },
            { name: 'Bahamas' },
            { name: 'Barbados' },
            { name: 'Bonaire, Sint Eustatius and Saba' },
            { name: 'Cayman Islands' },
            { name: 'Cuba' },
            { name: 'Curacao' },
            { name: 'Dominica' },
            { name: 'Dominican Republic' },
            { name: 'Grenada' },
            { name: 'Guadeloupe' },
            { name: 'Haiti' },
            { name: 'Jamaica' },
            { name: 'Martinique' },
            { name: 'Montserrat' },
            { name: 'Puerto Rico' },
            { name: 'Saint Barth駘emy' },
            { name: 'Saint Kitts and Nevis' },
            { name: 'Saint Lucia' },
            { name: 'Saint Martin (French part)' },
            { name: 'Saint Vincent and the Grenadines' },
            { name: 'Sint Maarten (Dutch part)' },
            { name: 'Trinidad and Tobago' },
            { name: 'Turks and Caicos Islands' },
            { name: 'Virgin Islands (British)' },
            { name: 'Virgin Islands (U.S.)' }
        ]
    })
    diffs = diffs.append(r4)

    const [, , r5] = await executeCircuit(circuits.createRegion, {
        variableName: 'South America',
        items: [
            { name: 'Argentina' },
            { name: 'Bolivia (Plurinational State of)' },
            { name: 'Brazil' },
            { name: 'Chile' },
            { name: 'Colombia' },
            { name: 'Ecuador' },
            { name: 'Falkland Islands (Malvinas)' },
            { name: 'French Guiana' },
            { name: 'Guyana' },
            { name: 'Paraguay' },
            { name: 'Peru' },
            { name: 'Suriname' },
            { name: 'Uruguay' },
            { name: 'Venezuela (Bolivarian Republic of)' }
        ]
    })
    diffs = diffs.append(r5)

    const [, , r6] = await executeCircuit(circuits.createRegion, {
        variableName: 'Australia',
        items: [
            { name: 'American Samoa' },
            { name: 'Australia' },
            { name: 'Cook Islands' },
            { name: 'Fiji' },
            { name: 'French Polynesia' },
            { name: 'Guam' },
            { name: 'Kiribati' },
            { name: 'Marshall Islands' },
            { name: 'Micronesia (Federated States of)' },
            { name: 'Nauru' },
            { name: 'New Caledonia' },
            { name: 'New Zealand' },
            { name: 'Niue' },
            { name: 'Norfolk Island' },
            { name: 'Northern Mariana Islands' },
            { name: 'Palau' },
            { name: 'Papua New Guinea' },
            { name: 'Pitcairn' },
            { name: 'Samoa' },
            { name: 'Solomon Islands' },
            { name: 'Tokelau' },
            { name: 'Tonga' },
            { name: 'Tuvalu' },
            { name: 'Vanuatu' },
            { name: 'Wallis and Futuna' }
        ]
    })
    diffs = diffs.append(r6)

    //createSupplier
    // const [, , s1] = await executeCircuit(circuits.createSupplier, {
    //     name: 'Royal'
    // })
    // diffs = diffs.append(s1)

    // const [, , s11] = await executeCircuit(circuits.createSupplier, {
    //     name: 'Fenghua'
    // })
    // diffs = diffs.append(s11)

    // const [, , s12] = await executeCircuit(circuits.createSupplier, {
    //     name: 'Yageo'
    // })
    // diffs = diffs.append(s12)

    // const [, , s13] = await executeCircuit(circuits.createSupplier, {
    //     name: 'Samsung'
    // })
    // diffs = diffs.append(s13)

    // const [, , s14] = await executeCircuit(circuits.createSupplier, {
    //     name: 'CCTC'
    // })
    // diffs = diffs.append(s14)

    // const [, , s21] = await executeCircuit(circuits.createSupplier, {
    //     name: 'Dafu'
    // })
    // diffs = diffs.append(s21)

    // const [, , s22] = await executeCircuit(circuits.createSupplier, {
    //     name: 'Keming'
    // })
    // diffs = diffs.append(s22)

    // const [, , s23] = await executeCircuit(circuits.createSupplier, {
    //     name: 'Nicholed'
    // })
    // diffs = diffs.append(s23)

    // const [, , s24] = await executeCircuit(circuits.createSupplier, {
    //     name: 'CCO'
    // })
    // diffs = diffs.append(s24)

    // const [, , s3] = await executeCircuit(circuits.createSupplier, {
    //     name: 'Chengdong'
    // })
    // diffs = diffs.append(s3)

    // const [, , s31] = await executeCircuit(circuits.createSupplier, {
    //     name: 'Weidy'
    // })
    // diffs = diffs.append(s31)

    // const [, , s32] = await executeCircuit(circuits.createSupplier, {
    //     name: 'Yinyan'
    // })
    // diffs = diffs.append(s32)

    // const [, , s5] = await executeCircuit(circuits.createSupplier, {
    //     name: 'TBOR'
    // })
    // diffs = diffs.append(s5)

    // const [, , s51] = await executeCircuit(circuits.createSupplier, {
    //     name: 'Topaz'
    // })
    // diffs = diffs.append(s51)

    // const [, , s6] = await executeCircuit(circuits.createSupplier, {
    //     name: 'Aishi'
    // })
    // diffs = diffs.append(s6)

    // const [, , s7] = await executeCircuit(circuits.createSupplier, {
    //     name: 'Weisheng'
    // })
    // diffs = diffs.append(s7)

    // const [, , s8] = await executeCircuit(circuits.createSupplier, {
    //     name: 'Xinhaifu'
    // })
    // diffs = diffs.append(s8)

    // const [, , s81] = await executeCircuit(circuits.createSupplier, {
    //     name: 'Shibiyou'
    // })
    // diffs = diffs.append(s81)

    // const [, , s9] = await executeCircuit(circuits.createSupplier, {
    //     name: 'Gelvshi'
    // })
    // diffs = diffs.append(s9)

    // const [, , su6] = await executeCircuit(circuits.createSupplier, {
    //     name: 'DLUE'
    // })
    // diffs = diffs.append(su6)

    // const [, , su61] = await executeCircuit(circuits.createSupplier, {
    //     name: 'BL'
    // })
    // diffs = diffs.append(su61)

    // const [, , su62] = await executeCircuit(circuits.createSupplier, {
    //     name: 'STS'
    // })
    // diffs = diffs.append(su62)

    // const [, , su64] = await executeCircuit(circuits.createSupplier, {
    //     name: 'Jilin Sino'
    // })
    // diffs = diffs.append(su64)

    // const [, , su63] = await executeCircuit(circuits.createSupplier, {
    //     name: 'Goodark'
    // })
    // diffs = diffs.append(su63)

    // const [, , su7] = await executeCircuit(circuits.createSupplier, {
    //     name: 'Richteck'
    // })
    // diffs = diffs.append(su7)

    // const [, , su8] = await executeCircuit(circuits.createSupplier, {
    //     name: 'Edison'
    // })
    // diffs = diffs.append(su8)

    // const [, , su9] = await executeCircuit(circuits.createSupplier, {
    //     name: 'Everlight'
    // })
    // diffs = diffs.append(su9)

    // const [, , sup1] = await executeCircuit(circuits.createSupplier, {
    //     name: 'Quanyou'
    // })
    // diffs = diffs.append(sup1)

    // const [, , sup11] = await executeCircuit(circuits.createSupplier, {
    //     name: 'zhonghe'
    // })
    // diffs = diffs.append(sup11)

    // const [, , sup12] = await executeCircuit(circuits.createSupplier, {
    //     name: 'Qinda'
    // })
    // diffs = diffs.append(sup12)

    db.diffs.put(mergeDiffs(diffs.toArray()).toRow())

    //createIndent
    // const [, , i1] = await executeCircuit(circuits.createIndent, {
    //     items: [{
    //         product:'abc',
    //         quantity: 50,
    //         uom:'kg'
    //     }]
    // })
    // diffs = diffs.append(i1)

    // const [, , i2] = await executeCircuit(circuits.createIndent, {
    //     items: [{
    //         product:'ResistorR1',
    //         quantity: 100,
    //         uom:'NO'
    //     }]
    // })
    // diffs = diffs.append(i2)

    // const [, , i3] = await executeCircuit(circuits.createIndent, {
    //     items: [{
    //         product:'ResistorR2',
    //         quantity: 150,
    //         uom:'No'
    //     }]
    // })
    // diffs = diffs.append(i3)

    // const [, , i4] = await executeCircuit(circuits.createIndent, {
    //     items: [{
    //         product:'ResistorR3',
    //         quantity: 5,
    //         uom:'No'
    //     }]
    // })
    // diffs = diffs.append(i4)

    // const [, , i5] = await executeCircuit(circuits.createIndent, {
    //     items: [{
    //         product:'ResistorR4',
    //         quantity: 5,
    //         uom:'No'
    //     }]
    // })
    // diffs = diffs.append(i5)

    // const [, , i6] = await executeCircuit(circuits.createIndent, {
    //     items: [{
    //         product:'ResistorR5',
    //         quantity: 150,
    //         uom:'No'
    //     }]
    // })
    // diffs = diffs.append(i6)

    // const [, , i7] = await executeCircuit(circuits.createIndent, {
    //     items: [{
    //         product:'ResistorR6',
    //         quantity: 500,
    //         uom:'No'
    //     }]
    // })
    // diffs = diffs.append(i7)

    // //createQuoation
    // //im not able too see indent on page but wen i create from there it is showing ?? why
    // const [, , q1] = await executeCircuit(circuits.createQuotation, {
    //     indent:'a7889b2a-4a65-4bc1-bd8a-3f991a7188de',
    //     supplier:'Royal/Fenghua/Yageo/Samsung/CCTC',
    //     items: [{
    //         indentItem:'27ad397c-bb28-4808-ac3a-7c56a98a8da9',
    //         quantity: 1
    //     }]
    // })
    // diffs = diffs.append(q1)

    // const [, , q2] = await executeCircuit(circuits.createQuotation, {
    //     indent:'',
    //     supplier:'',
    //     items: [{
    //         indentItem:'',
    //         quantity: 1
    //     }]
    // })
    // diffs = diffs.append(q2)

    // const [, , q3] = await executeCircuit(circuits.createQuotation, {
    //     indent:'',
    //     supplier:'',
    //     items: [{
    //         indentItem:'',
    //         quantity: 1
    //     }]
    // })
    // diffs = diffs.append(q3)

    // const [, , q4] = await executeCircuit(circuits.createQuotation, {
    //     indent:'',
    //     supplier:'',
    //     items: [{
    //         indentItem:'',
    //         quantity: 1
    //     }]
    // })
    // diffs = diffs.append(q4)

    // const [, , q5] = await executeCircuit(circuits.createQuotation, {
    //     indent:'',
    //     supplier:'',
    //     items: [{
    //         indentItem:'',
    //         quantity: 1
    //     }]
    // })
    // diffs = diffs.append(q5)

    // const [, , q6] = await executeCircuit(circuits.createQuotation, {
    //     indent:'',
    //     supplier:'',
    //     items: [{
    //         indentItem:'',
    //         quantity: 1
    //     }]
    // })
    // diffs = diffs.append(q6)

    // const [, , q7] = await executeCircuit(circuits.createQuotation, {
    //     indent:'',
    //     supplier:'',
    //     items: [{
    //         indentItem:'',
    //         quantity: 1
    //     }]
    // })
    // diffs = diffs.append(q7)

    // //createPurchaseOrder
    // const [, , po1] = await executeCircuit(circuits.createPurchaseOrder, {
    //     quotation:'',
    //     items: [{
    //         quotationItem:'',
    //         quantity: 1,
    //         price: 100
    //     }]
    // })
    // diffs = diffs.append(po1)

    // const [, , po2] = await executeCircuit(circuits.createPurchaseOrder, {
    //     quotation:'',
    //     items: [{
    //         quotationItem:'',
    //         quantity: 1,
    //         price: 100
    //     }]
    // })
    // diffs = diffs.append(po2)

    // const [, , po3] = await executeCircuit(circuits.createPurchaseOrder, {
    //     quotation:'',
    //     items: [{
    //         quotationItem:'',
    //         quantity: 1,
    //         price: 100
    //     }]
    // })
    // diffs = diffs.append(po3)

    // const [, , po4] = await executeCircuit(circuits.createPurchaseOrder, {
    //     quotation:'',
    //     items: [{
    //         quotationItem:'',
    //         quantity: 1,
    //         price: 100
    //     }]
    // })
    // diffs = diffs.append(po4)

    // const [, , po5] = await executeCircuit(circuits.createPurchaseOrder, {
    //     quotation:'',
    //     items: [{
    //         quotationItem:'',
    //         quantity: 1,
    //         price: 100
    //     }]
    // })
    // diffs = diffs.append(po5)

    // const [, , po6] = await executeCircuit(circuits.createPurchaseOrder, {
    //     quotation:'',
    //     items: [{
    //         quotationItem:'',
    //         quantity: 1,
    //         price: 100
    //     }]
    // })
    // diffs = diffs.append(po6)

    // //createPurchaseInvoice
    // const [, , pi1] = await executeCircuit(circuits.createPurchaseInvoice, {
    //     purchaseOrder:'',
    //     items: [{
    //         purchaseOrderItem:'',
    //         quantity: 1
    //     }]
    // })
    // diffs = diffs.append(pi1)

    // const [, , pi2] = await executeCircuit(circuits.createPurchaseInvoice, {
    //     purchaseOrder:'',
    //     items: [{
    //         purchaseOrderItem:'',
    //         quantity: 1
    //     }]
    // })
    // diffs = diffs.append(pi2)

    // const [, , pi3] = await executeCircuit(circuits.createPurchaseInvoice, {
    //     purchaseOrder:'',
    //     items: [{
    //         purchaseOrderItem:'',
    //         quantity: 1
    //     }]
    // })
    // diffs = diffs.append(pi3)

    // const [, , pi4] = await executeCircuit(circuits.createPurchaseInvoice, {
    //     purchaseOrder:'',
    //     items: [{
    //         purchaseOrderItem:'',
    //         quantity: 1
    //     }]
    // })
    // diffs = diffs.append(pi4)

    // const [, , pi5] = await executeCircuit(circuits.createPurchaseInvoice, {
    //     purchaseOrder:'',
    //     items: [{
    //         purchaseOrderItem:'',
    //         quantity: 1
    //     }]
    // })
    // diffs = diffs.append(pi5)

    // //createMaterialApprovalSlip
    // const [, , ma1] = await executeCircuit(circuits.createMaterialApprovalSlip, {
    //     purchaseInvoice:'',
    //     items: [{
    //         purchaseInvoiceItem:'',
    //         quantity: 1
    //     }]
    // })
    // diffs = diffs.append(ma1)

    // //createMaterialRejectionSlip
    // const [, , mr1] = await executeCircuit(circuits.createMaterialRejectionSlip, {
    //     purchaseInvoice:'',
    //     items: [{
    //         purchaseInvoiceItem:'',
    //         quantity: 1
    //     }]
    // })
    // diffs = diffs.append(mr1)

    // //createMaterialReturnSlip
    // const [, , mre1] = await executeCircuit(circuits.createMaterialReturnSlip, {
    //     materialRejectionSlip:'',
    //     items: [{
    //         materialRejectionSlipItem:'',
    //         quantity: 1
    //     }]
    // })
    // diffs = diffs.append(mre1)

    // //createMaterialRequistionSlip
    // const [, , mrq1] = await executeCircuit(circuits.createMaterialRequistionSlip, {
    //     materialApprovalSlip:'',
    //     items: [{
    //         materialApprovalSlipItem:'',
    //         quantity: 1
    //     }]
    // })
    // diffs = diffs.append(mrq1)
}
