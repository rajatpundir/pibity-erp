import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import Navbar from './Navbar'
import { Container, Item, none } from './commons'
import * as Grid from './grids'
import ShowProduct from '../components/IT/Product/Show'
import ListProduct from '../components/IT/Product/List'
import ShowSupplier from '../components/IT/Supplier/Show'
import ListSupplier from '../components/IT/Supplier/List'
import ShowIndent from '../components/Production/Indent/Show'
import ListIndent from '../components/Production/Indent/List'
import ShowQuotation from '../components/Purchase/Quotation/Show'
import ListQuotation from '../components/Purchase/Quotation/List'
import ShowPurchaseOrder from '../components/Purchase/PurchaseOrder/Show'
import ListPurchaseOrder from '../components/Purchase/PurchaseOrder/List'
import ShowPurchaseInvoice from '../components/Store/PurchaseInvoice/Show'
import ListPurchaseInvoice from '../components/Store/PurchaseInvoice/List'
import ShowMaterialApproved from '../components/Quality/MaterialApproved/Show'
import ListMaterialApproved from '../components/Quality/MaterialApproved/List'
import ShowMaterialRejected from '../components/Quality/MaterialRejected/Show'
import ListMaterialRejected from '../components/Quality/MaterialRejected/List'
import ShowMaterialReturnNote from '../components/Purchase/MaterialReturn/Show'
import ListMaterialReturnNote from '../components/Purchase/MaterialReturn/List'
import ShowMaterialRequistion from '../components/Production/MaterialRequistion/Show'
import ListMaterialRequistion from '../components/Production/MaterialRequistion/List'
import ShowBOM from '../components/Production/BOM/Show'
import ListBOM from '../components/Production/BOM/List'
import ShowMaterialTransferred from '../components/Quality/MaterialTransferred/Show'
import ListMaterialTransferred from '../components/Quality/MaterialTransferred/List'
import ShowMaterialScrapped from '../components/Quality/MaterialScrapped/Show'
import ListMaterialScrapped from '../components/Quality/MaterialScrapped/List'
import ShowWarehouseReceipt from '../components/Warehouse/Receipt/Show'
import ListWarehouseReceipt from '../components/Warehouse/Receipt/List'
// import createDemoData from './createDemoData'

// createDemoData()

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
              <Route exact path='/products'><ListProduct /></Route>
              <Route exact path='/product/*'><ShowProduct /></Route>
              <Route exact path='/product'><ShowProduct /></Route>
              <Route exact path='/suppliers'><ListSupplier /></Route>
              <Route exact path='/supplier/*'><ShowSupplier /></Route>
              <Route exact path='/supplier'><ShowSupplier /></Route>
              <Route exact path='/indents'><ListIndent /></Route>
              <Route exact path='/indent/*'><ShowIndent /></Route>
              <Route exact path='/indent'><ShowIndent /></Route>
              <Route exact path='/quotations'><ListQuotation /></Route>
              <Route exact path='/quotation/*'><ShowQuotation /></Route>
              <Route exact path='/quotation'><ShowQuotation /></Route>
              <Route exact path='/purchase-orders'><ListPurchaseOrder /></Route>
              <Route exact path='/purchase-order/*'><ShowPurchaseOrder /></Route>
              <Route exact path='/purchase-order'><ShowPurchaseOrder /></Route>
              <Route exact path='/purchase-invoices'><ListPurchaseInvoice /></Route>
              <Route exact path='/purchase-invoice/*'><ShowPurchaseInvoice /></Route>
              <Route exact path='/purchase-invoice'><ShowPurchaseInvoice /></Route>
              <Route exact path='/materials-approved'><ListMaterialApproved /></Route>
              <Route exact path='/material-approved/*'><ShowMaterialApproved /></Route>
              <Route exact path='/material-approved'><ShowMaterialApproved /></Route>
              <Route exact path='/materials-rejected'><ListMaterialRejected /></Route>
              <Route exact path='/material-rejected/*'><ShowMaterialRejected /></Route>
              <Route exact path='/material-rejected'><ShowMaterialRejected /></Route>
              <Route exact path='/returns'><ListMaterialReturnNote /></Route>
              <Route exact path='/return/*'><ShowMaterialReturnNote /></Route>
              <Route exact path='/return'><ShowMaterialReturnNote /></Route>
              <Route exact path='/requistions'><ListMaterialRequistion /></Route>
              <Route exact path='/requistion/*'><ShowMaterialRequistion /></Route>
              <Route exact path='/requistion'><ShowMaterialRequistion /></Route>
              <Route exact path='/boms'><ListBOM /></Route>
              <Route exact path='/bom/*'><ShowBOM /></Route>
              <Route exact path='/bom'><ShowBOM /></Route>
              <Route exact path='/materials-transferred'><ListMaterialTransferred /></Route>
              <Route exact path='/material-transferred/*'><ShowMaterialTransferred /></Route>
              <Route exact path='/material-transferred'><ShowMaterialTransferred /></Route>
              <Route exact path='/materials-scrapped'><ListMaterialScrapped /></Route>
              <Route exact path='/material-scrapped/*'><ShowMaterialScrapped /></Route>
              <Route exact path='/material-scrapped'><ShowMaterialScrapped /></Route>
              <Route exact path='/warehouse-receipts'><ListWarehouseReceipt /></Route>
              <Route exact path='/warehouse-receipt/*'><ShowWarehouseReceipt /></Route>
              <Route exact path='/warehouse-receipt'><ShowWarehouseReceipt /></Route>
              <Route path='/'><Redirect to='/products' /></Route>
            </Switch>
          </Item>
        </Container>
      </BrowserRouter>
    </div>
  )
}

export default App
