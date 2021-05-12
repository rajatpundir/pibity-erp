import { NavLink } from 'react-router-dom'

const navbar: { [index: string]: { [index: string]: string } } = {
    'IT': {
        'Product': '/product',
        'Products': '/products',
        'Suppliers': '/suppliers'
    },
    'Production': {
        'Indents': '/indents',
        'Material Requistions': '/requistions',
        'BOMs': '/boms',
        'Declarations': '/declarations',
        'Transfers': '/transfers'
    },
    'Purchase': {
        'Quotations': '/quotations',
        'Purchase Orders': '/orders',
        'Purchase Invoices': 'invoices',
        'Material Return Notes': '/returns'
    },
    'Store': {
        'Purchase Invoices': '/invoices',
        'Material Requistions': '/requistions'
    },
    'Quality': {
        'Materials Accepted': '/materials-aceepted',
        'Materials Rejected': '/materials-rejected',
        'Transfers': '/transfers'
    },
    'Warehouse': {
        'Transfers': '/transfers'
    }
}

export default function Navbar() {
    const icons = [
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mx-l-1 align-text-bottom" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>,
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mx-l-1 align-text-bottom" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>,
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mx-l-1 align-text-bottom" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>,
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mx-l-1 align-text-bottom" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>,
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mx-l-1 align-text-bottom" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>,
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mx-l-1 align-text-bottom" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
    ]
    return (<>
        <div className="font-extrabold p-4 text-2xl">
            Pibity ERP
            </div>
        <ul className="px-2">
            {
                Object.keys(navbar).map((module, index) => {
                    return (<>
                        <li key={module} className="py-2 mb-1 border-gray-800 border-t-2">
                            <div className="m-2 font-bold text-lg text-gray-50">
                                {icons[index]} {module}
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
                        </li>
                    </>)
                })
            }
        </ul>
    </>)
}
