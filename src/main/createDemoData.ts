import { Vector } from "prelude-ts"
import { executeCircuit } from "./circuit"
import { DiffVariable, mergeDiffs } from "./layers"
import { circuits } from "./circuits"
import { db } from "./dexie"

export default async function createDemoData() {
    db.diffs.clear()
    var diffs = Vector.of<DiffVariable>()

    const [, , s1] = await executeCircuit(circuits.createCompany, {
        variableName: 'Vistas LLP',
        email: 'vistaselectricals@gmail.com',
        telephone: '',
        mobile: '9540406429',
        website: '',
        companyType: 'LLP',
        serviceArea: 'National',
        gstin: '09AAQFV5708G1ZO',
        pan: 'AAQFV5708G',
        iec: 'AAQFV5708G',
        addresses: [],
        contacts: [],
        bankAccounts: [],
        products: []
    })
    diffs = diffs.append(s1)

    const [, , s2] = await executeCircuit(circuits.createCompany, {
        variableName: 'Victor Component PVT Ltd',
        email: '',
        telephone: '',
        mobile: '9716624976',
        website: '',
        companyType: 'Pvt Ltd',
        serviceArea: 'National',
        gstin: '09AAACV1927G1ZD',
        pan: 'AAACV1927G',
        iec: 'AAACV1927G',
        addresses: [],
        contacts: [],
        bankAccounts: [],
        products: []
    })
    diffs = diffs.append(s2)

    const [, , s3] = await executeCircuit(circuits.createCompany, {
        variableName: 'Hob Nob Electronics Pvt. Ltd',
        email: 'yash.arya@jyyautomation.com',
        telephone: '',
        mobile: '9953132379',
        website: '',
        companyType: 'Pvt Ltd',
        serviceArea: 'National',
        gstin: '09AAACH6202N1ZI',
        pan: 'AAACH6202N1',
        iec: 'AAACH6202N1',
        addresses: [],
        contacts: [],
        bankAccounts: [],
        products: []
    })
    diffs = diffs.append(s3)

    const [, , s4] = await executeCircuit(circuits.createCompany, {
        variableName: 'Purnima Lighting PVT Ltd',
        email: 'shailendra.singh@purnimasolarindia.com',
        telephone: '',
        mobile: '9871622628',
        website: '',
        companyType: 'Pvt Ltd',
        serviceArea: 'National',
        gstin: '09AABCL2371F1ZO',
        pan: 'AABCL2371F1',
        iec: 'AABCL2371F1',
        addresses: [],
        contacts: [],
        bankAccounts: [],
        products: []
    })
    diffs = diffs.append(s4)

    const [, , s5] = await executeCircuit(circuits.createCompany, {
        variableName: 'Relish Overses',
        email: 'nautiyal131@gmail.com',
        telephone: '',
        mobile: '9810533617',
        website: '',
        companyType: 'Pvt Ltd',
        serviceArea: 'National',
        gstin: '09AASFR6912Q1Z5',
        pan: 'AASFR6912Q1',
        iec: 'AASFR6912Q1',
        addresses: [],
        contacts: [],
        bankAccounts: [],
        products: []
    })
    diffs = diffs.append(s5)

    const [, , s6] = await executeCircuit(circuits.createCompany, {
        variableName: 'Bright Westech PVT Ltd',
        email: 'info@westechindia.co.in',
        telephone: '',
        mobile: '7600784757',
        website: '',
        companyType: 'Pvt Ltd',
        serviceArea: 'National',
        gstin: '09AAHCB5661Q1ZY',
        pan: 'AAHCB5661Q1',
        iec: 'AAHCB5661Q1',
        addresses: [],
        contacts: [],
        bankAccounts: [],
        products: []
    })
    diffs = diffs.append(s6)

    const [, , s7] = await executeCircuit(circuits.createCompany, {
        variableName: 'SS Electronics PVT Ltd',
        email: 'upesh.gupta@sselectronic.co.in',
        telephone: '',
        mobile: '9560889978',
        website: '',
        companyType: 'Pvt Ltd',
        serviceArea: 'National',
        gstin: '09ABDPS6852J1Z3',
        pan: 'ABDPS6852J1',
        iec: 'ABDPS6852J1',
        addresses: [],
        contacts: [],
        bankAccounts: [],
        products: []
    })
    diffs = diffs.append(s7)

    const [, , s8] = await executeCircuit(circuits.createCompany, {
        variableName: 'Samtayo Tech India Pvt. Ltd',
        email: 'bharat@samtaiyotech.co.in',
        telephone: '',
        mobile: '9810036857',
        website: '',
        companyType: 'Pvt Ltd',
        serviceArea: 'National',
        gstin: '09ABACS5561L1ZX',
        pan: 'ABACS5561L',
        iec: 'ABACS5561L',
        addresses: [],
        contacts: [],
        bankAccounts: [],
        products: []
    })
    diffs = diffs.append(s8)

    const [, , s9] = await executeCircuit(circuits.createCompany, {
        variableName: 'JYY Automation Technologies PVT Ltd',
        email: 'yash.arya@jyyautomation.com',
        telephone: '',
        mobile: '8126891337',
        website: 'www.jyyautomation.com',
        companyType: 'Pvt Ltd',
        serviceArea: 'National',
        gstin: '09AAECJ5755E1ZF',
        pan: 'AAECJ5755E',
        iec: 'AAECJ5755E',
        addresses: [],
        contacts: [],
        bankAccounts: [],
        products: []
    })
    diffs = diffs.append(s9)

    const [, , p1] = await executeCircuit(circuits.createProduct, {
        sku: 'R0',
        name: ' 510kΩ 0.25W ±5% SMD(1206 package)',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 1
        }],
        companies: []
    })
    diffs = diffs.append(p1)

    const [, , p2] = await executeCircuit(circuits.createProduct, {
        sku: 'R1',
        name: ' 510kΩ 0.25W ±5% SMD(1206 package)',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 1
        }],
        companies: []
    })
    diffs = diffs.append(p2)

    const [, , p3] = await executeCircuit(circuits.createProduct, {
        sku: 'R2',
        name: '3.9Ω 0.125W ±1% SMD(0805 package)',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }],
        companies: []
    })
    diffs = diffs.append(p3)

    const [, , p4] = await executeCircuit(circuits.createProduct, {
        sku: 'R3',
        name: '470kΩ 0.125W ±5% SMD(0805 package)',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 1
        }],
        companies: []
    })
    diffs = diffs.append(p4)

    const [, , p5] = await executeCircuit(circuits.createProduct, {
        sku: 'R4',
        name: '100kΩ 0.125W ±5% SMD(0805 package)',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }],
        companies: []
    })
    diffs = diffs.append(p5)

    const [, , p6] = await executeCircuit(circuits.createProduct, {
        sku: 'RL1',
        name: '56kΩ 0.125W ±5% SMD(0805 package)',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 1
        }],
        companies: []
    })
    diffs = diffs.append(p6)

    const [, , p7] = await executeCircuit(circuits.createProduct, {
        sku: 'Fuse',
        name: 'RES-AXI- 10 Ω/1WS (mini size) L=5.0±0.5mm Horizontal Mounting',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 1
        }],
        companies: []
    })
    diffs = diffs.append(p7)

    const [, , p8] = await executeCircuit(circuits.createProduct, {
        sku: 'Varistor (VR1 & VR2)',
        name: '07D511K L=5.0±0.5mm',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }],
        companies: []
    })
    diffs = diffs.append(p8)

    const [, , p9] = await executeCircuit(circuits.createProduct, {
        sku: 'C1',
        name: '100 nF / 450V ±5% ； P=10mm L=5.0±0.5mm CBB capacitor',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }],
        companies: []
    })
    diffs = diffs.append(p9)

    const [, , p10] = await executeCircuit(circuits.createProduct, {
        sku: 'Cx1',
        name: '22nfd / 275V P10 L=5±0.2mm W13*H11*T5mm',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }],
        companies: []
    })
    diffs = diffs.append(p10)

    const [, , p11] = await executeCircuit(circuits.createProduct, {
        sku: 'C2',
        name: '4.7μF / 50V ±20% 105℃ φ5*11mm L=5.0±0.5mm Electrolytic cap 10000 Hrs.',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }],
        companies: []
    })
    diffs = diffs.append(p11)

    const [, , p12] = await executeCircuit(circuits.createProduct, {
        sku: 'C3',
        name: '100μF / 63V ±20% 105℃ φ8*16mm L=5.0±0.5mm Electrolytic cap 10000Hrs.',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }],
        companies: []
    })
    diffs = diffs.append(p12)

    const [, , p13] = await executeCircuit(circuits.createProduct, {
        sku: 'C5',
        name: ' 0.22μF/ 25V 0805 ±20﹪,X7R SMD(0805 package)',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }],
        companies: []
    })
    diffs = diffs.append(p13)

    const [, , p14] = await executeCircuit(circuits.createProduct, {
        sku: 'BD1',
        name: 'MB10F 1A/1KV SOP-4 Package',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }],
        companies: []
    })
    diffs = diffs.append(p14)

    const [, , p15] = await executeCircuit(circuits.createProduct, {
        sku: 'D5',
        name: 'ES1J 1A / 600V SMA',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }],
        companies: []
    })
    diffs = diffs.append(p15)

    const [, , p16] = await executeCircuit(circuits.createProduct, {
        sku: 'D7',
        name: 'RS1M 1A / 600V SMA',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }],
        companies: []
    })
    diffs = diffs.append(p16)

    const [, , p17] = await executeCircuit(circuits.createProduct, {
        sku: 'IC',
        name: 'RT8497C SOP-8 Package',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }],
        companies: []
    })
    diffs = diffs.append(p17)

    const [, , p18] = await executeCircuit(circuits.createProduct, {
        sku: 'LED',
        name: 'LED-2835 - 0.5W - 150mA - 3.0 - 3.2V - 5400 - 6000K - 60 - 65lm - Ra80',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }],
        companies: []
    })
    diffs = diffs.append(p18)

    const [, , p19] = await executeCircuit(circuits.createProduct, {
        sku: 'Drum filter',
        name: 'φ6*10mm P=3.0 10mH±10%(with sleeve) L=5.0±0.5mm WD=0.1',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }],
        companies: []
    })
    diffs = diffs.append(p19)

    const [, , p20] = await executeCircuit(circuits.createProduct, {
        sku: 'Transformer',
        name: '9W TR-EE10-1.0mH±3%-180Ts-WD=0.21mm-V1.0 Tape color: Yellow & Blue',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }],
        companies: []
    })
    diffs = diffs.append(p20)

    const [, , p21] = await executeCircuit(circuits.createProduct, {
        sku: 'Output Wire Red',
        name: '0.20mm²*50mm-red Drive side=3mm Led side=5mm (V+)',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }],
        companies: []
    })
    diffs = diffs.append(p21)

    const [, , p22] = await executeCircuit(circuits.createProduct, {
        sku: 'Output Wire Black',
        name: '0.20mm²*50mm-black Drive side=3mm Led side=5mm (V-)',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }],
        companies: []
    })
    diffs = diffs.append(p22)

    const [, , p23] = await executeCircuit(circuits.createProduct, {
        sku: 'Supply Wire Yellow',
        name: '0.20mm²*38mm-yellow Drive side=5mm Cap side=6mm (L)',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }],
        companies: []
    })
    diffs = diffs.append(p23)

    const [, , p24] = await executeCircuit(circuits.createProduct, {
        sku: 'Supply Wire White',
        name: '0.20mm²*44mm-white Drive side=5mm Cap side=6mm (N)',
        orderable: true,
        consumable: true,
        producable: true,
        uoms: [{
            name: 'No',
            conversionRate: 2
        }],
        companies: []
    })
    diffs = diffs.append(p24)

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
    diffs = diffs.append(r2)

    const [, , r3] = await executeCircuit(circuits.createRegion, {
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
    diffs = diffs.append(r3)

    const [, , r4] = await executeCircuit(circuits.createRegion, {
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
    diffs = diffs.append(r4)

    const [, , r5] = await executeCircuit(circuits.createRegion, {
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
    diffs = diffs.append(r5)

    const [res_r6, , r6] = await executeCircuit(circuits.createRegion, {
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
    diffs = diffs.append(r6)

    db.diffs.put(mergeDiffs(diffs.toArray()).toRow())
    diffs = Vector.of()

    const country_india: string = res_r6['countries'].filter(x => x['country'].values.name === 'India')[0]['country']['variableName']

    const [, , st1] = await executeCircuit(circuits.createState, {
        country: country_india,
        name: 'Andhra Pradesh',
        items: [
            { name: 'Ananthapur' },
            { name: 'Cuddapah' },
            { name: 'Chittoor' },
            { name: 'Kurnool' },
            { name: 'Prakasam' },
            { name: 'West Godavari' },
            { name: 'Krishna' },
            { name: 'Nellore' },
            { name: 'Guntur' },
            { name: 'East Godavari' },
            { name: 'Visakhapatnam' },
            { name: 'Vizianagaram' },
            { name: 'Srikakulam' }
        ]
    })
    diffs = diffs.append(st1)

    const [, , st2] = await executeCircuit(circuits.createState, {
        country: country_india,
        name: 'Arunachal Pradesh',
        items: [
            { name: 'Lower Dibang Valley' },
            { name: 'East Siang' },
            { name: 'Dibang Valley' },
            { name: 'West Siang' },
            { name: 'Lohit' },
            { name: 'Papum Pare' },
            { name: 'Tawang' },
            { name: 'West Kameng' },
            { name: 'East Kameng' },
            { name: 'Lower Subansiri' },
            { name: 'Changlang' },
            { name: 'Tirap' },
            { name: 'Kurung Kumey' },
            { name: 'Upper Siang' },
            { name: 'Upper Subansiri' }
        ]
    })
    diffs = diffs.append(st2)

    const [, , st3] = await executeCircuit(circuits.createState, {
        country: country_india,
        name: 'Assam',
        items: [
            { name: 'Lakhimpur' },
            { name: 'Dibrugarh' },
            { name: 'Dhemaji' },
            { name: 'Marigaon' },
            { name: 'Nagaon' },
            { name: 'Karbi Anglong' },
            { name: 'Golaghat' },
            { name: 'Sibsagar' },
            { name: 'Jorhat' },
            { name: 'Tinsukia' },
            { name: 'Karimganj' },
            { name: 'Hailakandi' },
            { name: 'Cachar' },
            { name: 'North Cachar Hills' },
            { name: 'Darrang' },
            { name: 'Sonitpur' },
            { name: 'Bongaigaon' },
            { name: 'Kokrajhar' },
            { name: 'Goalpara' },
            { name: 'Dhubri' },
            { name: 'Kamrup' },
            { name: 'Nalbari' },
            { name: 'Barpeta' }
        ]
    })
    diffs = diffs.append(st3)

    const [, , st4] = await executeCircuit(circuits.createState, {
        country: country_india,
        name: 'Bihar',
        items: [
            { name: 'Begusarai' },
            { name: 'Khagaria' },
            { name: 'Darbhanga' },
            { name: 'Madhubani' },
            { name: 'Muzaffarpur' },
            { name: 'Samastipur' },
            { name: 'Sitamarhi' },
            { name: 'East Champaran' },
            { name: 'Supaul' },
            { name: 'Vaishali' },
            { name: 'Purnia' },
            { name: 'Araria' },
            { name: 'Katihar' },
            { name: 'Kishanganj' },
            { name: 'Madhepura' },
            { name: 'Saharsa' },
            { name: 'Saran' },
            { name: 'Siwan' },
            { name: 'Bhojpur' },
            { name: 'Sheohar' },
            { name: 'Gopalganj' },
            { name: 'West Champaran' },
            { name: 'Gaya' },
            { name: 'Aurangabad(BH)' },
            { name: 'Arwal' },
            { name: 'Bhagalpur' },
            { name: 'Banka' },
            { name: 'Munger' },
            { name: 'Buxar' },
            { name: 'Jehanabad' },
            { name: 'Patna' },
            { name: 'Sheikhpura' },
            { name: 'Jamui' },
            { name: 'Lakhisarai' },
            { name: 'Nalanda' },
            { name: 'Nawada' },
            { name: 'Rohtas' },
            { name: 'Kaimur (Bhabua)' }
        ]
    })
    diffs = diffs.append(st4)

    const [, , st5] = await executeCircuit(circuits.createState, {
        country: country_india,
        name: 'Chattisgarh',
        items: [
            { name: 'Kanker' },
            { name: 'Bastar' },
            { name: 'Dantewada' },
            { name: 'Bijapur(CGH)' },
            { name: 'Narayanpur' },
            { name: 'Bilaspur(CGH)' },
            { name: 'Janjgir-champa' },
            { name: 'Korba' },
            { name: 'Durg' },
            { name: 'Rajnandgaon' },
            { name: 'Kawardha' },
            { name: 'Surguja' },
            { name: 'Raigarh' },
            { name: 'Jashpur' },
            { name: 'Koriya' },
            { name: 'Raipur' },
            { name: 'Mahasamund' },
            { name: 'Dhamtari' },
            { name: 'Gariaband' }
        ]
    })
    diffs = diffs.append(st5)

    const [, , st6] = await executeCircuit(circuits.createState, {
        country: country_india,
        name: 'Gujarat',
        items: [
            { name: 'Ahmedabad' },
            { name: 'Gandhi Nagar' },
            { name: 'Banaskantha' },
            { name: 'Mahesana' },
            { name: 'Surendra Nagar' },
            { name: 'Patan' },
            { name: 'Sabarkantha' },
            { name: 'Amreli' },
            { name: 'Rajkot' },
            { name: 'Junagadh' },
            { name: 'Bhavnagar' },
            { name: 'Jamnagar' },
            { name: 'Porbandar' },
            { name: 'Kachchh' },
            { name: 'Anand' },
            { name: 'Kheda' },
            { name: 'Surat' },
            { name: 'The Dangs' },
            { name: 'Tapi' },
            { name: 'Navsari' },
            { name: 'Vadodara' },
            { name: 'Bharuch' },
            { name: 'Narmada' },
            { name: 'Dahod' },
            { name: 'Panch Mahals' },
            { name: 'Valsad' }
        ]
    })
    diffs = diffs.append(st6)

    const [, , st7] = await executeCircuit(circuits.createState, {
        country: country_india,
        name: 'Haryana',
        items: [
            { name: 'Ambala' },
            { name: 'Yamuna Nagar' },
            { name: 'Panchkula' },
            { name: 'Bhiwani' },
            { name: 'Faridabad' },
            { name: 'Gurgaon' },
            { name: 'Rewari' },
            { name: 'Mahendragarh' },
            { name: 'Hisar' },
            { name: 'Sirsa' },
            { name: 'Fatehabad' },
            { name: 'Karnal' },
            { name: 'Panipat' },
            { name: 'Jind' },
            { name: 'Kaithal' },
            { name: 'Kurukshetra' },
            { name: 'Jhajjar' },
            { name: 'Rohtak' },
            { name: 'Sonipat' }
        ]
    })
    diffs = diffs.append(st7)

    const [, , st8] = await executeCircuit(circuits.createState, {
        country: country_india,
        name: 'Himachal Pradesh',
        items: [
            { name: 'Chamba' },
            { name: 'Kangra' },
            { name: 'Bilaspur (HP)' },
            { name: 'Hamirpur(HP)' },
            { name: 'Una' },
            { name: 'Mandi' },
            { name: 'Kullu' },
            { name: 'Lahul & Spiti' },
            { name: 'Kinnaur' },
            { name: 'Shimla' },
            { name: 'Sirmaur' },
            { name: 'Solan' }
        ]
    })
    diffs = diffs.append(st8)

    const [, , st9] = await executeCircuit(circuits.createState, {
        country: country_india,
        name: 'Jharkhand',
        items: [
            { name: 'Dhanbad' },
            { name: 'Bokaro' },
            { name: 'Giridh' },
            { name: 'Hazaribag' },
            { name: 'Chatra' },
            { name: 'Ramgarh' },
            { name: 'Koderma' },
            { name: 'Latehar' },
            { name: 'Garhwa' },
            { name: 'Palamau' },
            { name: 'Ranchi' },
            { name: 'Gumla' },
            { name: 'Simdega' },
            { name: 'Lohardaga' },
            { name: 'West Singhbhum' },
            { name: 'Khunti' },
            { name: 'Deoghar' },
            { name: 'Godda' },
            { name: 'Jamtara' },
            { name: 'Sahibganj' },
            { name: 'Dumka' },
            { name: 'Pakur' },
            { name: 'Seraikela-kharsawan' },
            { name: 'East Singhbhum' }
        ]
    })
    diffs = diffs.append(st9)

    const [, , st10] = await executeCircuit(circuits.createState, {
        country: country_india,
        name: 'Karnataka',
        items: [
            { name: 'Bangalore' },
            { name: 'Bangalore Rural' },
            { name: 'Ramanagar' },
            { name: 'Bagalkot' },
            { name: 'Bijapur(KAR)' },
            { name: 'Belgaum' },
            { name: 'Davangere' },
            { name: 'Bellary' },
            { name: 'Bidar' },
            { name: 'Dharwad' },
            { name: 'Gadag' },
            { name: 'Koppal' },
            { name: 'Yadgir' },
            { name: 'Gulbarga' },
            { name: 'Haveri' },
            { name: 'Uttara Kannada' },
            { name: 'Raichur' },
            { name: 'Chickmagalur' },
            { name: 'Chitradurga' },
            { name: 'Hassan' },
            { name: 'Kodagu' },
            { name: 'Chikkaballapur' },
            { name: 'Kolar' },
            { name: 'Mandya' },
            { name: 'Dakshina Kannada' },
            { name: 'Udupi' },
            { name: 'Mysore' },
            { name: 'Chamrajnagar' },
            { name: 'Shimoga' },
            { name: 'Tumkur' }
        ]
    })
    diffs = diffs.append(st10)

    const [, , st11] = await executeCircuit(circuits.createState, {
        country: country_india,
        name: 'Kerala',
        items: [
            { name: 'Wayanad' },
            { name: 'Kozhikode' },
            { name: 'Malappuram' },
            { name: 'Kannur' },
            { name: 'Kasargod' },
            { name: 'Palakkad' },
            { name: 'Alappuzha' },
            { name: 'Ernakulam' },
            { name: 'Kottayam' },
            { name: 'Pathanamthitta' },
            { name: 'Idukki' },
            { name: 'Thrissur' },
            { name: 'Kollam' },
            { name: 'Thiruvananthapuram' }
        ]
    })
    diffs = diffs.append(st11)

    const [, , st12] = await executeCircuit(circuits.createState, {
        country: country_india,
        name: 'Madhya Pradesh',
        items: [
            { name: 'Seoni' },
            { name: 'Balaghat' },
            { name: 'Mandla' },
            { name: 'Dindori' },
            { name: 'Bhopal' },
            { name: 'Raisen' },
            { name: 'Chhatarpur' },
            { name: 'Tikamgarh' },
            { name: 'Panna' },
            { name: 'Betul' },
            { name: 'Chhindwara' },
            { name: 'Hoshangabad' },
            { name: 'Narsinghpur' },
            { name: 'Harda' },
            { name: 'Satna' },
            { name: 'Rewa' },
            { name: 'Damoh' },
            { name: 'Sagar' },
            { name: 'Anuppur' },
            { name: 'Umaria' },
            { name: 'Shahdol' },
            { name: 'Sidhi' },
            { name: 'Singrauli' },
            { name: 'Vidisha' },
            { name: 'Ashok Nagar' },
            { name: 'Shivpuri' },
            { name: 'Guna' },
            { name: 'Gwalior' },
            { name: 'Datia' },
            { name: 'Bhind' },
            { name: 'Morena' },
            { name: 'Sheopur' },
            { name: 'Indore' },
            { name: 'Dewas' },
            { name: 'Dhar' },
            { name: 'Katni' },
            { name: 'Jabalpur' },
            { name: 'East Nimar' },
            { name: 'West Nimar' },
            { name: 'Barwani' },
            { name: 'Khandwa' },
            { name: 'Burhanpur' },
            { name: 'Khargone' },
            { name: 'Neemuch' },
            { name: 'Mandsaur' },
            { name: 'Jhabua' },
            { name: 'Ratlam' },
            { name: 'Alirajpur' },
            { name: 'Sehore' },
            { name: 'Rajgarh' },
            { name: 'Ujjain' },
            { name: 'Shajapur' }
        ]
    })
    diffs = diffs.append(st12)

    const [, , st13] = await executeCircuit(circuits.createState, {
        country: country_india,
        name: 'Maharashtra',
        items: [
            { name: 'Jalna' },
            { name: 'Aurangabad' },
            { name: 'Beed' },
            { name: 'Jalgaon' },
            { name: 'Dhule' },
            { name: 'Nandurbar' },
            { name: 'Nashik' },
            { name: 'Nanded' },
            { name: 'Latur' },
            { name: 'Osmanabad' },
            { name: 'Hingoli' },
            { name: 'Parbhani' },
            { name: 'Kolhapur' },
            { name: 'Ratnagiri' },
            { name: 'Sindhudurg' },
            { name: 'Satara' },
            { name: 'Sangli' },
            { name: 'Mumbai' },
            { name: 'Raigarh(MH)' },
            { name: 'Thane' },
            { name: 'Akola' },
            { name: 'Washim' },
            { name: 'Amravati' },
            { name: 'Buldhana' },
            { name: 'Gadchiroli' },
            { name: 'Chandrapur' },
            { name: 'Nagpur' },
            { name: 'Gondia' },
            { name: 'Bhandara' },
            { name: 'Wardha' },
            { name: 'Yavatmal' },
            { name: 'Ahmed Nagar' },
            { name: 'Solapur' },
            { name: 'Pune' }
        ]
    })
    diffs = diffs.append(st13)

    const [, , st14] = await executeCircuit(circuits.createState, {
        country: country_india,
        name: 'Manipur',
        items: [
            { name: 'Imphal West' },
            { name: 'Churachandpur' },
            { name: 'Chandel' },
            { name: 'Thoubal' },
            { name: 'Tamenglong' },
            { name: 'Ukhrul' },
            { name: 'Imphal East' },
            { name: 'Bishnupur' },
            { name: 'Senapati' }
        ]
    })
    diffs = diffs.append(st14)

    const [, , st15] = await executeCircuit(circuits.createState, {
        country: country_india,
        name: 'Meghalaya',
        items: [
            { name: 'West Garo Hills' },
            { name: 'East Garo Hills' },
            { name: 'Jaintia Hills' },
            { name: 'East Khasi Hills' },
            { name: 'South Garo Hills' },
            { name: 'Ri Bhoi' },
            { name: 'West Khasi Hills' }
        ]
    })
    diffs = diffs.append(st15)

    const [, , st16] = await executeCircuit(circuits.createState, {
        country: country_india,
        name: 'Mizoram',
        items: [
            { name: 'Aizawl' },
            { name: 'Mammit' },
            { name: 'Lunglei' },
            { name: 'Kolasib' },
            { name: 'Lawngtlai' },
            { name: 'Champhai' },
            { name: 'Saiha' },
            { name: 'Serchhip' }

        ]
    })
    diffs = diffs.append(st16)

    const [, , st17] = await executeCircuit(circuits.createState, {
        country: country_india,
        name: 'Nagaland',
        items: [
            { name: 'Zunhebotto' },
            { name: 'Dimapur' },
            { name: 'Wokha' },
            { name: 'Phek' },
            { name: 'Mokokchung' },
            { name: 'Kiphire' },
            { name: 'Tuensang' },
            { name: 'Mon' },
            { name: 'Kohima' },
            { name: 'Peren' },
            { name: 'Longleng' }
        ]
    })
    diffs = diffs.append(st17)

    const [, , st18] = await executeCircuit(circuits.createState, {
        country: country_india,
        name: 'Odisha',
        items: [
            { name: 'Ganjam' },
            { name: 'Gajapati' },
            { name: 'Kalahandi' },
            { name: 'Nuapada' },
            { name: 'Koraput' },
            { name: 'Rayagada' },
            { name: 'Nabarangapur' },
            { name: 'Malkangiri' },
            { name: 'Kandhamal' },
            { name: 'Boudh' },
            { name: 'Baleswar' },
            { name: 'Bhadrak' },
            { name: 'Kendujhar' },
            { name: 'Khorda' },
            { name: 'Puri' },
            { name: 'Cuttack' },
            { name: 'Jajapur' },
            { name: 'Kendrapara' },
            { name: 'Jagatsinghapur' },
            { name: 'Mayurbhanj' },
            { name: 'Nayagarh' },
            { name: 'Balangir' },
            { name: 'Sonapur' },
            { name: 'Angul' },
            { name: 'Dhenkanal' },
            { name: 'Sambalpur' },
            { name: 'Bargarh' },
            { name: 'Jharsuguda' },
            { name: 'Debagarh' },
            { name: 'Sundergarh' }

        ]
    })
    diffs = diffs.append(st18)

    const [, , st19] = await executeCircuit(circuits.createState, {
        country: country_india,
        name: 'Punjab',
        items: [
            { name: 'Ropar' },
            { name: 'Mohali' },
            { name: 'Rupnagar' },
            { name: 'Patiala' },
            { name: 'Ludhiana' },
            { name: 'Fatehgarh Sahib' },
            { name: 'Sangrur' },
            { name: 'Barnala' },
            { name: 'Amritsar' },
            { name: 'Tarn Taran' },
            { name: 'Bathinda' },
            { name: 'Mansa' },
            { name: 'Muktsar' },
            { name: 'Moga' },
            { name: 'Faridkot' },
            { name: 'Firozpur' },
            { name: 'Fazilka' },
            { name: 'Gurdaspur' },
            { name: 'Pathankot' },
            { name: 'Hoshiarpur' },
            { name: 'Nawanshahr' },
            { name: 'Jalandhar' },
            { name: 'Kapurthala' }
        ]
    })
    diffs = diffs.append(st19)

    const [, , st20] = await executeCircuit(circuits.createState, {
        country: country_india,
        name: 'Rajasthan',
        items: [
            { name: 'Ajmer' },
            { name: 'Rajsamand' },
            { name: 'Bhilwara' },
            { name: 'Chittorgarh' },
            { name: 'Banswara' },
            { name: 'Dungarpur' },
            { name: 'Kota' },
            { name: 'Baran' },
            { name: 'Jhalawar' },
            { name: 'Bundi' },
            { name: 'Tonk' },
            { name: 'Udaipur' },
            { name: 'Alwar' },
            { name: 'Bharatpur' },
            { name: 'Dholpur' },
            { name: 'Jaipur' },
            { name: 'Dausa' },
            { name: 'Sawai Madhopur' },
            { name: 'Karauli' },
            { name: 'Barmer' },
            { name: 'Bikaner' },
            { name: 'Churu' },
            { name: 'Jhujhunu' },
            { name: 'Jodhpur' },
            { name: 'Jaisalmer' },
            { name: 'Nagaur' },
            { name: 'Pali' },
            { name: 'Sikar' },
            { name: 'Sirohi' },
            { name: 'Jalor' },
            { name: 'Ganganagar' },
            { name: 'Hanumangarh' }
        ]
    })
    diffs = diffs.append(st20)

    const [, , st21] = await executeCircuit(circuits.createState, {
        country: country_india,
        name: 'Sikkim',
        items: [
            { name: 'East Sikkim' },
            { name: 'West Sikkim' },
            { name: 'South Sikkim' },
            { name: 'North Sikkim' }
        ]
    })
    diffs = diffs.append(st21)

    const [, , st22] = await executeCircuit(circuits.createState, {
        country: country_india,
        name: 'Tamilnadu',
        items: [
            { name: 'Chennai' },
            { name: 'Vellore' },
            { name: 'Tiruvannamalai' },
            { name: 'Kanchipuram' },
            { name: 'Tiruvallur' },
            { name: 'Villupuram' },
            { name: 'Cuddalore' },
            { name: 'Coimbatore' },
            { name: 'Dharmapuri' },
            { name: 'Salem' },
            { name: 'Erode' },
            { name: 'Karur' },
            { name: 'Namakkal' },
            { name: 'Krishnagiri' },
            { name: 'Nilgiris' },
            { name: 'Dindigul' },
            { name: 'Kanyakumari' },
            { name: 'Sivaganga' },
            { name: 'Ramanathapuram' },
            { name: 'Tuticorin' },
            { name: 'Tirunelveli' },
            { name: 'Madurai' },
            { name: 'Theni' },
            { name: 'Virudhunagar' },
            { name: 'Ariyalur' },
            { name: 'Tiruchirappalli' },
            { name: 'Pudukkottai' },
            { name: 'Tiruvarur' },
            { name: 'Thanjavur' },
            { name: 'Nagapattinam' },
            { name: 'Perambalur' }
        ]
    })
    diffs = diffs.append(st22)

    const [, , st23] = await executeCircuit(circuits.createState, {
        country: country_india,
        name: 'Telangana',
        items: [
            { name: 'Adilabad' },
            { name: 'Warangal' },
            { name: 'Karim Nagar' },
            { name: 'Mahabub Nagar' },
            { name: 'K.V.Rangareddy' },
            { name: 'Medak' },
            { name: 'Nalgonda' },
            { name: 'Nizamabad' },
            { name: 'Hyderabad' },
            { name: 'Khammam' }
        ]
    })
    diffs = diffs.append(st23)

    const [, , st24] = await executeCircuit(circuits.createState, {
        country: country_india,
        name: 'Tripura',
        items: [
            { name: 'South Tripura' },
            { name: 'West Tripura' },
            { name: 'Dhalai' },
            { name: 'North Tripura' }
        ]
    })
    diffs = diffs.append(st24)

    const [, , st25] = await executeCircuit(circuits.createState, {
        country: country_india,
        name: 'West Bengal',
        items: [
            { name: 'Kolkata' },
            { name: 'North 24 Parganas' },
            { name: 'South 24 Parganas' },
            { name: 'Birbhum' },
            { name: 'Murshidabad' },
            { name: 'Nadia' },
            { name: 'Cooch Behar' },
            { name: 'Jalpaiguri' },
            { name: 'Darjiling' },
            { name: 'Malda' },
            { name: 'South Dinajpur' },
            { name: 'North Dinajpur' },
            { name: 'Bardhaman' },
            { name: 'Bankura' },
            { name: 'West Midnapore' },
            { name: 'East Midnapore' },
            { name: 'Hooghly' },
            { name: 'Howrah' },
            { name: 'Medinipur' },
            { name: 'Puruliya' }
        ]
    })
    diffs = diffs.append(st25)

    const [, , st26] = await executeCircuit(circuits.createState, {
        country: country_india,
        name: 'Uttarakhand',
        items: [
            { name: 'Haridwar' },
            { name: 'Almora' },
            { name: 'Bageshwar' },
            { name: 'Chamoli' },
            { name: 'Rudraprayag' },
            { name: 'Dehradun' },
            { name: 'Udham Singh Nagar' },
            { name: 'Nainital' },
            { name: 'Champawat' },
            { name: 'Pauri Garhwal' },
            { name: 'Pithoragarh' },
            { name: 'Tehri Garhwal' },
            { name: 'Uttarkashi' }
        ]
    })
    diffs = diffs.append(st26)

    const [res_st27, , st27] = await executeCircuit(circuits.createState, {
        country: country_india,
        name: 'Uttar Pradesh',
        items: [
            { name: 'Agra' },
            { name: 'Aligarh' },
            { name: 'Hathras' },
            { name: 'Bulandshahr' },
            { name: 'Gautam Buddha Nagar' },
            { name: 'Etah' },
            { name: 'Firozabad' },
            { name: 'Etawah' },
            { name: 'Auraiya' },
            { name: 'Jhansi' },
            { name: 'Jalaun' },
            { name: 'Lalitpur' },
            { name: 'Mainpuri' },
            { name: 'Mathura' },
            { name: 'Azamgarh' },
            { name: 'Allahabad' },
            { name: 'Kaushambi' },
            { name: 'Ghazipur' },
            { name: 'Jaunpur' },
            { name: 'Sonbhadra' },
            { name: 'Mirzapur' },
            { name: 'Pratapgarh' },
            { name: 'Varanasi' },
            { name: 'Chandauli' },
            { name: 'Sant Ravidas Nagar' },
            { name: 'Pilibhit' },
            { name: 'Bareilly' },
            { name: 'Bijnor' },
            { name: 'Budaun' },
            { name: 'Hardoi' },
            { name: 'Kheri' },
            { name: 'Meerut' },
            { name: 'Bagpat' },
            { name: 'Moradabad' },
            { name: 'Jyotiba Phule Nagar' },
            { name: 'Rampur' },
            { name: 'Muzaffarnagar' },
            { name: 'Saharanpur' },
            { name: 'Shahjahanpur' },
            { name: 'Mau' },
            { name: 'Shrawasti' },
            { name: 'Bahraich' },
            { name: 'Ballia' },
            { name: 'Siddharthnagar' },
            { name: 'Sant Kabir Nagar' },
            { name: 'Basti' },
            { name: 'Deoria' },
            { name: 'Kushinagar' },
            { name: 'Gonda' },
            { name: 'Balrampur' },
            { name: 'Gorakhpur' },
            { name: 'Maharajganj' },
            { name: 'Banda' },
            { name: 'Chitrakoot' },
            { name: 'Mahoba' },
            { name: 'Hamirpur' },
            { name: 'Kannauj' },
            { name: 'Farrukhabad' },
            { name: 'Fatehpur' },
            { name: 'Kanpur Nagar' },
            { name: 'Unnao' },
            { name: 'Kanpur Dehat' },
            { name: 'Barabanki' },
            { name: 'Faizabad' },
            { name: 'Ambedkar Nagar' },
            { name: 'Ghaziabad' },
            { name: 'Lucknow' },
            { name: 'Raebareli' },
            { name: 'Sitapur' },
            { name: 'Sultanpur' }
        ]
    })
    diffs = diffs.append(st27)

    db.diffs.put(mergeDiffs(diffs.toArray()).toRow())

    diffs = Vector.of()
    const district_ga: string = res_st27['districts'].filter(x => x['district'].values.name === 'Gautam Buddha Nagar')[0]['district']['variableName']
    const [res_sd1, , sd1] = await executeCircuit(circuits.createSubdistrict, {
        district: district_ga,
        name: 'Noida',
        items: [
            { name: '201305' }
        ]
    })
    diffs = diffs.append(sd1)
    db.diffs.put(mergeDiffs(diffs.toArray()).toRow())

    diffs = Vector.of()
    const postal_code_201305: string = res_sd1['postalCodes'].filter(x => x['postalCode'].values.name === '201305')[0]['postalCode']['variableName']
    const [, , ad1] = await executeCircuit(circuits.createAddress, {
        postalCode: postal_code_201305,
        line1: 'Plot No. 18',
        line2: 'Sector 140A ',
        latitude: 28.51168212296573,
        longitude: 77.4217063944774
    })
    diffs = diffs.append(ad1)
    db.diffs.put(mergeDiffs(diffs.toArray()).toRow())

}
