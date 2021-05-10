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
    return (<>
        <div className="font-extrabold p-4 text-2xl">
            Pibity ERP
            </div>
        <ul className="px-2">
            {
                Object.keys(navbar).map(module => {
                    return (<li key={module} className="py-2">
                        <div className="p-2 font-bold">
                            {module}
                        </div>
                        <ul className="px-7">
                            {
                                Object.keys(navbar[module]).map(key => {
                                    return (<li key={key}>
                                        <NavLink activeClassName="font-extrabold text-lg" to={navbar[module][key]}>{key}</NavLink>
                                    </li>)
                                })
                            }
                        </ul>
                    </li>)
                })
            }
        </ul>
    </>)
}
