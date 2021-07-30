import { NavLink } from 'react-router-dom'
import createDemoData from './createDemoData'

const navbar: { [index: string]: { [index: string]: string } } = {
    'Geography': {
        'Region': '/region-list',
        'Country': '/country-list',
        'State Type': '/state-type-list',
        'District': '/district-list',
        'Subdistrict': '/subdistrict-list',
        'Postal Code': '/postal-code-list',
        'Address': '/address-list'
    },
    'IT': {
        'Company': '/company-list',
        'Company Address': '/company-address-list',
        'Company Tag Group': '/company-tag-group-list',
        'Company Tag': '/company-tag-list',
        'Mapping Company Tag': '/mapping-company-tag-list',
        'Contact': '/contact-list',
        'Contact Address': '/contact-address-list',
        'Company Contact': '/company-contact-list',
        'Company Bank Account': '/company-bank-account-list',
        'Product Category Group': '/product-category-group-list',
        'Product Category': '/product-category-list',
        'Product': '/product-list',
        'Company Product': '/company-product-list',
        'Product Tag Group': '/product-tag-group-list',
        'Product Tag': '/product-tag-list',
        'Mapping Product Tag': '/mapping-product-tag-list',
        'Uom': '/uom-list'
    },
    'Banking': {
        'Currency': '/currency-list',
        'Currency Rate': '/currency-rate-list',
        'Bank': '/bank-list',
        'Bank Branch': '/bank-branch-list',
        'Bank Account': '/bank-account-list',
        'Bank Transaction': '/bank-transaction-list'
    },
    'Accounts': {
        'Memo': '/memo-list'
    },
    'Production': {
        'Indent': '/indent-list',
        'Indent Item': '/indent-item-list',
        'Material Requistion Slip': '/material-requistion-slip-list',
        'Material Requistion Slip Item': '/material-requistion-slip-item-list',
        'Bom': '/bom-list',
        'Bom Item': '/bom-item-list',
        'Production Preparation Slip': '/production-preparation-slip-list',
        'Production Preparation Slip Item': '/production-preparation-slip-item-list'
    },
    'Purchase': {
        'Quotation': '/quotation-list',
        'Quotation Item': '/quotation-item-list',
        'Purchase Order': '/purchase-order-list',
        'Purchase Order Item': '/purchase-order-item-list',
        'Material Return Slip': '/material-return-slip-list',
        'Material Return Slip Item': '/material-return-slip-item-list'
    },
    'Store': {
        'Purchase Invoice': '/purchase-invoice-list',
        'Purchase Invoice Item': '/purchase-invoice-item-list'
    },
    'Quality': {
        'Material Approval Slip': '/material-approval-slip-list',
        'Material Approval Slip Item': '/material-approval-slip-item-list',
        'Material Rejection Slip': '/material-rejection-slip-list',
        'Material Rejection Slip Item': '/material-rejection-slip-item-list',
        'Scrap Material Slip': '/scrap-material-slip-list',
        'Transfer Material Slip': '/transfer-material-slip-list'
    },
    'Warehouse': {
        'Warehouse Acceptance Slip': '/warehouse-acceptance-slip-list'
    }
}

const icons = {
    'Geography': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mx-l-1 align-text-bottom" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>,
    'IT': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mx-l-1 align-text-bottom" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>,
    'Banking': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mx-l-1 align-text-bottom" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>,
    'Accounts': '',
    'Production': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mx-l-1 align-text-bottom" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>,
    'Purchase': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mx-l-1 align-text-bottom" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>,
    'Store': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mx-l-1 align-text-bottom" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>,
    'Quality': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mx-l-1 align-text-bottom" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>,
    'Warehouse': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mx-l-1 align-text-bottom" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
    </svg>
}

export default function Navbar() {
    return (<>
        <div className="font-extrabold p-4 text-2xl">
            Pibity ERP
        </div>
        <ul className="px-2">
            {
                Object.keys(navbar).map(module => {
                    return (<li key={module} className="py-2 mb-1 border-gray-800 border-t-2">
                        <div className="m-2 font-bold text-lg text-gray-50">
                            {icons[module] || ''} {module}
                        </div>
                        <ul className="px-7">
                            {
                                Object.keys(navbar[module]).map(key => {
                                    return (<li key={key} className="whitespace-nowrap">
                                        <NavLink activeClassName="font-extrabold text-lg text-white" to={navbar[module][key]}>{key}</NavLink>
                                    </li>)
                                })
                            }
                        </ul>
                    </li>)
                })
            }
        </ul>
        <button className='bg-gray-800 font-bold text-lg w-full' onClick={createDemoData}>RESET DATA</button>
    </>)
}
