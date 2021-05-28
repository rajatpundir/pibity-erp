import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Navbar from './Navbar'
import { Container, Item, none } from './commons'
import * as Grid from './grids'
import CreateProduct from '../components/IT/Product/Create'
import ListProduct from '../components/IT/Product/List'
import ListSupplier from '../components/IT/Supplier/List'
import CreateIndent from '../components/Production/Indent/Create'
import ListIndent from '../components/Production/Indent/List'
import CreateQuotation from '../components/Purchase/Quotation/Create'
import ListQuotation from '../components/Purchase/Quotation/List'
import CreatePurchaseOrder from '../components/Purchase/PurchaseOrder/Create'
import ListPurchaseOrder from '../components/Purchase/PurchaseOrder/List'
import CreatePurchaseInvoice from '../components/Store/PurchaseInvoice/Create'
import ListPurchaseInvoice from '../components/Store/PurchaseInvoice/List'
import CreateMaterialApproved from '../components/Quality/MaterialApproved/Create'
import ListMaterialApproved from '../components/Quality/MaterialApproved/List'
import CreateMaterialRejected from '../components/Quality/MaterialRejected/Create'
import ListMaterialRejected from '../components/Quality/MaterialRejected/List'

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
              <Route exact path='/product'><CreateProduct /></Route>
              <Route exact path='/products'><ListProduct /></Route>
              <Route exact path='/suppliers'><ListSupplier /></Route>
              <Route exact path='/indent'><CreateIndent /></Route>
              <Route exact path='/indents'><ListIndent /></Route>
              <Route exact path='/quotation'><CreateQuotation /></Route>
              <Route exact path='/quotations'><ListQuotation /></Route>
              <Route exact path='/purchase-order'><CreatePurchaseOrder /></Route>
              <Route exact path='/purchase-orders'><ListPurchaseOrder /></Route>
              <Route exact path='/purchase-invoice'><CreatePurchaseInvoice /></Route>
              <Route exact path='/purchase-invoices'><ListPurchaseInvoice /></Route>
              <Route exact path='/material-approved'><CreateMaterialApproved /></Route>
              <Route exact path='/materials-approved'><ListMaterialApproved /></Route>
              <Route exact path='/material-rejected'><CreateMaterialRejected /></Route>
              <Route exact path='/materials-rejected'><ListMaterialRejected /></Route>
            </Switch>
          </Item>
        </Container>
      </BrowserRouter>
    </div>
  )
}

export default App
