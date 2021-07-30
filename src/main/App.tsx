import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import Navbar from './Navbar'
import { Container, Item, none } from './commons'
import * as Grid from './grids'
import { types } from './types'
import ShowRegion from '../components/Geography/Region/Show'
import ListRegion from '../components/Geography/Region/List'
import ShowCountry from '../components/Geography/Country/Show'
import ListCountry from '../components/Geography/Country/List'
import ShowStateType from '../components/Geography/StateType/Show'
import ListStateType from '../components/Geography/StateType/List'
import ShowDistrict from '../components/Geography/District/Show'
import ListDistrict from '../components/Geography/District/List'
import ShowSubdistrict from '../components/Geography/Subdistrict/Show'
import ListSubdistrict from '../components/Geography/Subdistrict/List'
import ShowPostalCode from '../components/Geography/PostalCode/Show'
import ListPostalCode from '../components/Geography/PostalCode/List'
import ShowAddress from '../components/Geography/Address/Show'
import ListAddress from '../components/Geography/Address/List'
import ShowCompany from '../components/IT/Company/Show'
import ListCompany from '../components/IT/Company/List'
import ShowCompanyAddress from '../components/IT/CompanyAddress/Show'
import ListCompanyAddress from '../components/IT/CompanyAddress/List'
import ShowCompanyTagGroup from '../components/IT/CompanyTagGroup/Show'
import ListCompanyTagGroup from '../components/IT/CompanyTagGroup/List'
import ShowCompanyTag from '../components/IT/CompanyTag/Show'
import ListCompanyTag from '../components/IT/CompanyTag/List'
import ShowMappingCompanyTag from '../components/IT/MappingCompanyTag/Show'
import ListMappingCompanyTag from '../components/IT/MappingCompanyTag/List'
import ShowContact from '../components/IT/Contact/Show'
import ListContact from '../components/IT/Contact/List'
import ShowContactAddress from '../components/IT/ContactAddress/Show'
import ListContactAddress from '../components/IT/ContactAddress/List'
import ShowCompanyContact from '../components/IT/CompanyContact/Show'
import ListCompanyContact from '../components/IT/CompanyContact/List'
import ShowCurrency from '../components/Banking/Currency/Show'
import ListCurrency from '../components/Banking/Currency/List'
import ShowCurrencyRate from '../components/Banking/CurrencyRate/Show'
import ListCurrencyRate from '../components/Banking/CurrencyRate/List'
import ShowMemo from '../components/Accounts/Memo/Show'
import ListMemo from '../components/Accounts/Memo/List'
import ShowBank from '../components/Banking/Bank/Show'
import ListBank from '../components/Banking/Bank/List'
import ShowBankBranch from '../components/Banking/BankBranch/Show'
import ListBankBranch from '../components/Banking/BankBranch/List'
import ShowBankAccount from '../components/Banking/BankAccount/Show'
import ListBankAccount from '../components/Banking/BankAccount/List'
import ShowBankTransaction from '../components/Banking/BankTransaction/Show'
import ListBankTransaction from '../components/Banking/BankTransaction/List'
import ShowCompanyBankAccount from '../components/IT/CompanyBankAccount/Show'
import ListCompanyBankAccount from '../components/IT/CompanyBankAccount/List'
import ShowProductCategoryGroup from '../components/IT/ProductCategoryGroup/Show'
import ListProductCategoryGroup from '../components/IT/ProductCategoryGroup/List'
import ShowProductCategory from '../components/IT/ProductCategory/Show'
import ListProductCategory from '../components/IT/ProductCategory/List'
import ShowProduct from '../components/IT/Product/Show'
import ListProduct from '../components/IT/Product/List'
import ShowCompanyProduct from '../components/IT/CompanyProduct/Show'
import ListCompanyProduct from '../components/IT/CompanyProduct/List'
import ShowProductTagGroup from '../components/IT/ProductTagGroup/Show'
import ListProductTagGroup from '../components/IT/ProductTagGroup/List'
import ShowProductTag from '../components/IT/ProductTag/Show'
import ListProductTag from '../components/IT/ProductTag/List'
import ShowMappingProductTag from '../components/IT/MappingProductTag/Show'
import ListMappingProductTag from '../components/IT/MappingProductTag/List'
import ShowUOM from '../components/IT/UOM/Show'
import ListUOM from '../components/IT/UOM/List'
import ShowIndent from '../components/Production/Indent/Show'
import ListIndent from '../components/Production/Indent/List'
import ShowIndentItem from '../components/Production/IndentItem/Show'
import ListIndentItem from '../components/Production/IndentItem/List'
import ShowQuotation from '../components/Purchase/Quotation/Show'
import ListQuotation from '../components/Purchase/Quotation/List'
import ShowQuotationItem from '../components/Purchase/QuotationItem/Show'
import ListQuotationItem from '../components/Purchase/QuotationItem/List'
import ShowPurchaseOrder from '../components/Purchase/PurchaseOrder/Show'
import ListPurchaseOrder from '../components/Purchase/PurchaseOrder/List'
import ShowPurchaseOrderItem from '../components/Purchase/PurchaseOrderItem/Show'
import ListPurchaseOrderItem from '../components/Purchase/PurchaseOrderItem/List'
import ShowPurchaseInvoice from '../components/Store/PurchaseInvoice/Show'
import ListPurchaseInvoice from '../components/Store/PurchaseInvoice/List'
import ShowPurchaseInvoiceItem from '../components/Store/PurchaseInvoiceItem/Show'
import ListPurchaseInvoiceItem from '../components/Store/PurchaseInvoiceItem/List'
import ShowMaterialApprovalSlip from '../components/Quality/MaterialApprovalSlip/Show'
import ListMaterialApprovalSlip from '../components/Quality/MaterialApprovalSlip/List'
import ShowMaterialApprovalSlipItem from '../components/Quality/MaterialApprovalSlipItem/Show'
import ListMaterialApprovalSlipItem from '../components/Quality/MaterialApprovalSlipItem/List'
import ShowMaterialRejectionSlip from '../components/Quality/MaterialRejectionSlip/Show'
import ListMaterialRejectionSlip from '../components/Quality/MaterialRejectionSlip/List'
import ShowMaterialRejectionSlipItem from '../components/Quality/MaterialRejectionSlipItem/Show'
import ListMaterialRejectionSlipItem from '../components/Quality/MaterialRejectionSlipItem/List'
import ShowMaterialReturnSlip from '../components/Purchase/MaterialReturnSlip/Show'
import ListMaterialReturnSlip from '../components/Purchase/MaterialReturnSlip/List'
import ShowMaterialReturnSlipItem from '../components/Purchase/MaterialReturnSlipItem/Show'
import ListMaterialReturnSlipItem from '../components/Purchase/MaterialReturnSlipItem/List'
import ShowMaterialRequistionSlip from '../components/Production/MaterialRequistionSlip/Show'
import ListMaterialRequistionSlip from '../components/Production/MaterialRequistionSlip/List'
import ShowMaterialRequistionSlipItem from '../components/Production/MaterialRequistionSlipItem/Show'
import ListMaterialRequistionSlipItem from '../components/Production/MaterialRequistionSlipItem/List'
import ShowBOM from '../components/Production/BOM/Show'
import ListBOM from '../components/Production/BOM/List'
import ShowBOMItem from '../components/Production/BOMItem/Show'
import ListBOMItem from '../components/Production/BOMItem/List'
import ShowProductionPreparationSlip from '../components/Production/ProductionPreparationSlip/Show'
import ListProductionPreparationSlip from '../components/Production/ProductionPreparationSlip/List'
import ShowProductionPreparationSlipItem from '../components/Production/ProductionPreparationSlipItem/Show'
import ListProductionPreparationSlipItem from '../components/Production/ProductionPreparationSlipItem/List'
import ShowScrapMaterialSlip from '../components/Quality/ScrapMaterialSlip/Show'
import ListScrapMaterialSlip from '../components/Quality/ScrapMaterialSlip/List'
import ShowTransferMaterialSlip from '../components/Quality/TransferMaterialSlip/Show'
import ListTransferMaterialSlip from '../components/Quality/TransferMaterialSlip/List'
import ShowWarehouseAcceptanceSlip from '../components/Warehouse/WarehouseAcceptanceSlip/Show'
import ListWarehouseAcceptanceSlip from '../components/Warehouse/WarehouseAcceptanceSlip/List'

function App() {
  console.log(JSON.stringify(types, null, 4))
  return (
    <div className='App font-nunito bg-gray-100'>
      <BrowserRouter>
        <Container area={none} layout={Grid.layouts.main} className='h-screen'>
          <Item area={Grid.navbar} className='bg-gray-900 text-gray-100 overflow-y-auto'>
            <Navbar />
          </Item>
          <Item area={Grid.content} className='overflow-y-auto py-8'>
            <Switch>
              <Route exact path='/region-list'><ListRegion /></Route>
              <Route exact path='/region/*'><ShowRegion /></Route>
              <Route exact path='/region'><ShowRegion /></Route>
              <Route exact path='/country-list'><ListCountry /></Route>
              <Route exact path='/country/*'><ShowCountry /></Route>
              <Route exact path='/country'><ShowCountry /></Route>
              <Route exact path='/state-type-list'><ListStateType /></Route>
              <Route exact path='/state-type/*'><ShowStateType /></Route>
              <Route exact path='/state-type'><ShowStateType /></Route>
              <Route exact path='/district-list'><ListDistrict /></Route>
              <Route exact path='/district/*'><ShowDistrict /></Route>
              <Route exact path='/district'><ShowDistrict /></Route>
              <Route exact path='/subdistrict-list'><ListSubdistrict /></Route>
              <Route exact path='/subdistrict/*'><ShowSubdistrict /></Route>
              <Route exact path='/subdistrict'><ShowSubdistrict /></Route>
              <Route exact path='/postal-code-list'><ListPostalCode /></Route>
              <Route exact path='/postal-code/*'><ShowPostalCode /></Route>
              <Route exact path='/postal-code'><ShowPostalCode /></Route>
              <Route exact path='/address-list'><ListAddress /></Route>
              <Route exact path='/address/*'><ShowAddress /></Route>
              <Route exact path='/address'><ShowAddress /></Route>
              <Route exact path='/company-list'><ListCompany /></Route>
              <Route exact path='/company/*'><ShowCompany /></Route>
              <Route exact path='/company'><ShowCompany /></Route>
              <Route exact path='/company-address-list'><ListCompanyAddress /></Route>
              <Route exact path='/company-address/*'><ShowCompanyAddress /></Route>
              <Route exact path='/company-address'><ShowCompanyAddress /></Route>
              <Route exact path='/company-tag-group-list'><ListCompanyTagGroup /></Route>
              <Route exact path='/company-tag-group/*'><ShowCompanyTagGroup /></Route>
              <Route exact path='/company-tag-group'><ShowCompanyTagGroup /></Route>
              <Route exact path='/company-tag-list'><ListCompanyTag /></Route>
              <Route exact path='/company-tag/*'><ShowCompanyTag /></Route>
              <Route exact path='/company-tag'><ShowCompanyTag /></Route>
              <Route exact path='/mapping-company-tag-list'><ListMappingCompanyTag /></Route>
              <Route exact path='/mapping-company-tag/*'><ShowMappingCompanyTag /></Route>
              <Route exact path='/mapping-company-tag'><ShowMappingCompanyTag /></Route>
              <Route exact path='/contact-list'><ListContact /></Route>
              <Route exact path='/contact/*'><ShowContact /></Route>
              <Route exact path='/contact'><ShowContact /></Route>
              <Route exact path='/contact-address-list'><ListContactAddress /></Route>
              <Route exact path='/contact-address/*'><ShowContactAddress /></Route>
              <Route exact path='/contact-address'><ShowContactAddress /></Route>
              <Route exact path='/company-contact-list'><ListCompanyContact /></Route>
              <Route exact path='/company-contact/*'><ShowCompanyContact /></Route>
              <Route exact path='/company-contact'><ShowCompanyContact /></Route>
              <Route exact path='/currency-list'><ListCurrency /></Route>
              <Route exact path='/currency/*'><ShowCurrency /></Route>
              <Route exact path='/currency'><ShowCurrency /></Route>
              <Route exact path='/currency-rate-list'><ListCurrencyRate /></Route>
              <Route exact path='/currency-rate/*'><ShowCurrencyRate /></Route>
              <Route exact path='/currency-rate'><ShowCurrencyRate /></Route>
              <Route exact path='/memo-list'><ListMemo /></Route>
              <Route exact path='/memo/*'><ShowMemo /></Route>
              <Route exact path='/memo'><ShowMemo /></Route>
              <Route exact path='/bank-list'><ListBank /></Route>
              <Route exact path='/bank/*'><ShowBank /></Route>
              <Route exact path='/bank'><ShowBank /></Route>
              <Route exact path='/bank-branch-list'><ListBankBranch /></Route>
              <Route exact path='/bank-branch/*'><ShowBankBranch /></Route>
              <Route exact path='/bank-branch'><ShowBankBranch /></Route>
              <Route exact path='/bank-account-list'><ListBankAccount /></Route>
              <Route exact path='/bank-account/*'><ShowBankAccount /></Route>
              <Route exact path='/bank-account'><ShowBankAccount /></Route>
              <Route exact path='/bank-transaction-list'><ListBankTransaction /></Route>
              <Route exact path='/bank-transaction/*'><ShowBankTransaction /></Route>
              <Route exact path='/bank-transaction'><ShowBankTransaction /></Route>
              <Route exact path='/company-bank-account-list'><ListCompanyBankAccount /></Route>
              <Route exact path='/company-bank-account/*'><ShowCompanyBankAccount /></Route>
              <Route exact path='/company-bank-account'><ShowCompanyBankAccount /></Route>
              <Route exact path='/product-category-group-list'><ListProductCategoryGroup /></Route>
              <Route exact path='/product-category-group/*'><ShowProductCategoryGroup /></Route>
              <Route exact path='/product-category-group'><ShowProductCategoryGroup /></Route>
              <Route exact path='/product-category-list'><ListProductCategory /></Route>
              <Route exact path='/product-category/*'><ShowProductCategory /></Route>
              <Route exact path='/product-category'><ShowProductCategory /></Route>
              <Route exact path='/product-list'><ListProduct /></Route>
              <Route exact path='/product/*'><ShowProduct /></Route>
              <Route exact path='/product'><ShowProduct /></Route>
              <Route exact path='/company-product-list'><ListCompanyProduct /></Route>
              <Route exact path='/company-product/*'><ShowCompanyProduct /></Route>
              <Route exact path='/company-product'><ShowCompanyProduct /></Route>
              <Route exact path='/product-tag-group-list'><ListProductTagGroup /></Route>
              <Route exact path='/product-tag-group/*'><ShowProductTagGroup /></Route>
              <Route exact path='/product-tag-group'><ShowProductTagGroup /></Route>
              <Route exact path='/product-tag-list'><ListProductTag /></Route>
              <Route exact path='/product-tag/*'><ShowProductTag /></Route>
              <Route exact path='/product-tag'><ShowProductTag /></Route>
              <Route exact path='/mapping-product-tag-list'><ListMappingProductTag /></Route>
              <Route exact path='/mapping-product-tag/*'><ShowMappingProductTag /></Route>
              <Route exact path='/mapping-product-tag'><ShowMappingProductTag /></Route>
              <Route exact path='/u-o-m-list'><ListUOM /></Route>
              <Route exact path='/u-o-m/*'><ShowUOM /></Route>
              <Route exact path='/u-o-m'><ShowUOM /></Route>
              <Route exact path='/indent-list'><ListIndent /></Route>
              <Route exact path='/indent/*'><ShowIndent /></Route>
              <Route exact path='/indent'><ShowIndent /></Route>
              <Route exact path='/indent-item-list'><ListIndentItem /></Route>
              <Route exact path='/indent-item/*'><ShowIndentItem /></Route>
              <Route exact path='/indent-item'><ShowIndentItem /></Route>
              <Route exact path='/quotation-list'><ListQuotation /></Route>
              <Route exact path='/quotation/*'><ShowQuotation /></Route>
              <Route exact path='/quotation'><ShowQuotation /></Route>
              <Route exact path='/quotation-item-list'><ListQuotationItem /></Route>
              <Route exact path='/quotation-item/*'><ShowQuotationItem /></Route>
              <Route exact path='/quotation-item'><ShowQuotationItem /></Route>
              <Route exact path='/purchase-order-list'><ListPurchaseOrder /></Route>
              <Route exact path='/purchase-order/*'><ShowPurchaseOrder /></Route>
              <Route exact path='/purchase-order'><ShowPurchaseOrder /></Route>
              <Route exact path='/purchase-order-item-list'><ListPurchaseOrderItem /></Route>
              <Route exact path='/purchase-order-item/*'><ShowPurchaseOrderItem /></Route>
              <Route exact path='/purchase-order-item'><ShowPurchaseOrderItem /></Route>
              <Route exact path='/purchase-invoice-list'><ListPurchaseInvoice /></Route>
              <Route exact path='/purchase-invoice/*'><ShowPurchaseInvoice /></Route>
              <Route exact path='/purchase-invoice'><ShowPurchaseInvoice /></Route>
              <Route exact path='/purchase-invoice-item-list'><ListPurchaseInvoiceItem /></Route>
              <Route exact path='/purchase-invoice-item/*'><ShowPurchaseInvoiceItem /></Route>
              <Route exact path='/purchase-invoice-item'><ShowPurchaseInvoiceItem /></Route>
              <Route exact path='/material-approval-slip-list'><ListMaterialApprovalSlip /></Route>
              <Route exact path='/material-approval-slip/*'><ShowMaterialApprovalSlip /></Route>
              <Route exact path='/material-approval-slip'><ShowMaterialApprovalSlip /></Route>
              <Route exact path='/material-approval-slip-item-list'><ListMaterialApprovalSlipItem /></Route>
              <Route exact path='/material-approval-slip-item/*'><ShowMaterialApprovalSlipItem /></Route>
              <Route exact path='/material-approval-slip-item'><ShowMaterialApprovalSlipItem /></Route>
              <Route exact path='/material-rejection-slip-list'><ListMaterialRejectionSlip /></Route>
              <Route exact path='/material-rejection-slip/*'><ShowMaterialRejectionSlip /></Route>
              <Route exact path='/material-rejection-slip'><ShowMaterialRejectionSlip /></Route>
              <Route exact path='/material-rejection-slip-item-list'><ListMaterialRejectionSlipItem /></Route>
              <Route exact path='/material-rejection-slip-item/*'><ShowMaterialRejectionSlipItem /></Route>
              <Route exact path='/material-rejection-slip-item'><ShowMaterialRejectionSlipItem /></Route>
              <Route exact path='/material-return-slip-list'><ListMaterialReturnSlip /></Route>
              <Route exact path='/material-return-slip/*'><ShowMaterialReturnSlip /></Route>
              <Route exact path='/material-return-slip'><ShowMaterialReturnSlip /></Route>
              <Route exact path='/material-return-slip-item-list'><ListMaterialReturnSlipItem /></Route>
              <Route exact path='/material-return-slip-item/*'><ShowMaterialReturnSlipItem /></Route>
              <Route exact path='/material-return-slip-item'><ShowMaterialReturnSlipItem /></Route>
              <Route exact path='/material-requistion-slip-list'><ListMaterialRequistionSlip /></Route>
              <Route exact path='/material-requistion-slip/*'><ShowMaterialRequistionSlip /></Route>
              <Route exact path='/material-requistion-slip'><ShowMaterialRequistionSlip /></Route>
              <Route exact path='/material-requistion-slip-item-list'><ListMaterialRequistionSlipItem /></Route>
              <Route exact path='/material-requistion-slip-item/*'><ShowMaterialRequistionSlipItem /></Route>
              <Route exact path='/material-requistion-slip-item'><ShowMaterialRequistionSlipItem /></Route>
              <Route exact path='/b-o-m-list'><ListBOM /></Route>
              <Route exact path='/b-o-m/*'><ShowBOM /></Route>
              <Route exact path='/b-o-m'><ShowBOM /></Route>
              <Route exact path='/b-o-m-item-list'><ListBOMItem /></Route>
              <Route exact path='/b-o-m-item/*'><ShowBOMItem /></Route>
              <Route exact path='/b-o-m-item'><ShowBOMItem /></Route>
              <Route exact path='/production-preparation-slip-list'><ListProductionPreparationSlip /></Route>
              <Route exact path='/production-preparation-slip/*'><ShowProductionPreparationSlip /></Route>
              <Route exact path='/production-preparation-slip'><ShowProductionPreparationSlip /></Route>
              <Route exact path='/production-preparation-slip-item-list'><ListProductionPreparationSlipItem /></Route>
              <Route exact path='/production-preparation-slip-item/*'><ShowProductionPreparationSlipItem /></Route>
              <Route exact path='/production-preparation-slip-item'><ShowProductionPreparationSlipItem /></Route>
              <Route exact path='/scrap-material-slip-list'><ListScrapMaterialSlip /></Route>
              <Route exact path='/scrap-material-slip/*'><ShowScrapMaterialSlip /></Route>
              <Route exact path='/scrap-material-slip'><ShowScrapMaterialSlip /></Route>
              <Route exact path='/transfer-material-slip-list'><ListTransferMaterialSlip /></Route>
              <Route exact path='/transfer-material-slip/*'><ShowTransferMaterialSlip /></Route>
              <Route exact path='/transfer-material-slip'><ShowTransferMaterialSlip /></Route>
              <Route exact path='/warehouse-acceptance-slip-list'><ListWarehouseAcceptanceSlip /></Route>
              <Route exact path='/warehouse-acceptance-slip/*'><ShowWarehouseAcceptanceSlip /></Route>
              <Route exact path='/warehouse-acceptance-slip'><ShowWarehouseAcceptanceSlip /></Route>
              <Route path='/'><Redirect to='/regions' /></Route>
            </Switch>
          </Item>
        </Container>
      </BrowserRouter>
    </div>
  )
}

export default App

