import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Navbar from './Navbar'
import { Container, Item, none } from './commons'
import * as Grid from './grids'
import Product from '../components/management/product/Product'
import Products from '../components/management/product/Products'
import Suppliers from '../components/management/supplier/Suppliers'
import Indent from '../components/production/indent/Indent'
import Indents from '../components/production/indent/Indents'
import Quotation from '../components/production/quotation/Quotations'
import Quotations from '../components/production/quotation/Quotation'
import PurchaseOrder from '../components/production/purchaseOrder/PurchaseOrder'
import PurchaseOrders from '../components/production/purchaseOrder/PurchaseOrders'
import PurchaseInvoice from '../components/production/purchaseInvoice/PurchaseInvoice'
import PurchaseInvoices from '../components/production/purchaseInvoice/PurchaseInvoices'
import MaterialAccepted from '../components/production/materialAccepted/MaterialAccepted'
import MaterialAccepteds from '../components/production/materialAccepted/MaterialAccepteds'
import MaterialRejected from '../components/production/materialRejected/MaterialRejected'
import MaterialRejecteds from '../components/production/materialRejected/MaterialRejecteds'

function App() {
  return (
    <div className='App font-nunito bg-gray-100'>
      <BrowserRouter>
        <Container area={none} layout={Grid.layouts.main} className='h-screen'>
          <Item area={Grid.navbar} className='bg-gray-900 text-gray-100 overflow-y-auto'>
            <Navbar />
          </Item>
          <Item area={Grid.content} className='overflow-y-auto py-8'>
            <Switch>
              <Route exact path='/product'>
                <Product />
              </Route>
              <Route exact path='/products'>
                <Products />
              </Route>
              <Route exact path='/suppliers'>
                <Suppliers />
              </Route>
              <Route exact path='/indent'>
                <Indent />
              </Route>
              <Route exact path='/indents'>
                <Indent />
              </Route>
              <Route exact path='/quotation'>
                <Quotation />
              </Route>
              <Route exact path='/quotations'>
                <Quotations />
              </Route>
              <Route exact path='/orders'>
                <PurchaseOrder />
              </Route>
              <Route exact path='/orders'>
                <PurchaseOrders />
              </Route>
              <Route exact path='/invoices'>
                <PurchaseInvoice />
              </Route>
              <Route exact path='/invoices'>
                <PurchaseInvoices />
              </Route>
              <Route exact path='/materials-aceepted'>
                <MaterialAccepted />
              </Route>
              <Route exact path='/materials-aceepted'>
                <MaterialAccepteds />
              </Route>
              <Route exact path='/materials-rejected'>
                <MaterialRejected />
              </Route>
              <Route exact path='/materials-rejected'>
                <MaterialRejecteds />
              </Route>
            </Switch>
          </Item>
        </Container>
      </BrowserRouter>
    </div>
  )
}

export default App
