import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import Navbar from './Navbar'
import { Container, Item, none } from './commons'
import * as Grid from './grids'
import CreateProduct from '../components/IT/Product/Create'
import ListProduct from '../components/IT/Product/List'
import CreateSupplier from '../components/IT/Supplier/Create'
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
import CreateMaterialReturnNote from '../components/Purchase/MaterialReturn/Create'
import ListMaterialReturnNote from '../components/Purchase/MaterialReturn/List'
import CreateMaterialRequistion from '../components/Production/MaterialRequistion/Create'
import ListMaterialRequistion from '../components/Production/MaterialRequistion/List'
import CreateBOM from '../components/Production/BOM/Create'
import ListBOM from '../components/Production/BOM/List'
import CreateMaterialTransferred from '../components/Quality/MaterialTransferred/Create'
import ListMaterialTransferred from '../components/Quality/MaterialTransferred/List'
import CreateMaterialScrapped from '../components/Quality/MaterialScrapped/Create'
import ListMaterialScrapped from '../components/Quality/MaterialScrapped/List'
import CreateWarehouseReceipt from '../components/Warehouse/Receipt/Create'
import ListWarehouseReceipt from '../components/Warehouse/Receipt/List'
import { executeCircuit } from './circuit'
import { circuits } from './circuits'
import { getState } from './store'

function App() {
  const [a, b, c] = executeCircuit(circuits.createProduct, {
    sku: 'abc',
    name: 'name',
    orderable: true,
    consumable: true,
    producable: true,
    uoms: [{
      name: 'kg',
      conversionRate: 1
    }]
  })
  console.log(a, b)
  getState().addDiff(c)
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
              <Route exact path='/supplier'><CreateSupplier /></Route>
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
              <Route exact path='/return'><CreateMaterialReturnNote /></Route>
              <Route exact path='/returns'><ListMaterialReturnNote /></Route>
              <Route exact path='/requistion'><CreateMaterialRequistion /></Route>
              <Route exact path='/requistions'><ListMaterialRequistion /></Route>
              <Route exact path='/bom'><CreateBOM /></Route>
              <Route exact path='/boms'><ListBOM /></Route>
              <Route exact path='/material-transferred'><CreateMaterialTransferred /></Route>
              <Route exact path='/materials-transferred'><ListMaterialTransferred /></Route>
              <Route exact path='/material-scrapped'><CreateMaterialScrapped /></Route>
              <Route exact path='/materials-scrapped'><ListMaterialScrapped /></Route>
              <Route exact path='/warehouse-receipt'><CreateWarehouseReceipt /></Route>
              <Route exact path='/warehouse-receipts'><ListWarehouseReceipt /></Route>
              <Route path='/'><Redirect to='/products' /></Route>
            </Switch>
          </Item>
        </Container>
      </BrowserRouter>
    </div>
  )
}

export default App
