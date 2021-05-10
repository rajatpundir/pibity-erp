import Product from '../components/management/product/Product'
import Products from '../components/management/product/Products'
import { Container, Item, none } from './commons';
import * as Grid from './grids'
import {
  BrowserRouter,
  Switch,
  Route,
  NavLink
} from "react-router-dom";

function App() {
  return (
    <div className="App font-nunito bg-gray-100">
      <BrowserRouter>
        <Container area={none} layout={Grid.layouts.main} className="h-screen">
          <Item area={Grid.navbar} className="bg-gray-900 text-gray-100 overflow-y-scroll">
            <div className="font-extrabold p-4 text-2xl">
              Pibity ERP
            </div>
            <ul className="px-2">
              <li>
                <div className="p-2 font-bold">
                  IT
                </div>
                <ul className="px-7">
                  <li>
                    <NavLink activeClassName="font-extrabold text-lg" to="/product">Product</NavLink>
                  </li>
                  <li>
                    <NavLink activeClassName="font-extrabold text-lg" to="/products">Products</NavLink>
                  </li>
                </ul>
              </li>
              <li className="py-2">
                <div className="p-2 font-bold">
                  Production
                </div>
                <ul className="px-7">
                  <li>
                    <NavLink activeClassName="font-extrabold text-lg" to="/indents">Indents</NavLink>
                  </li>
                  <li>
                    <NavLink activeClassName="font-extrabold text-lg" to="/requistions">Material Requistions</NavLink>
                  </li>
                  <li>
                    <NavLink activeClassName="font-extrabold text-lg" to="/boms">BOMs</NavLink>
                  </li>
                  <li>
                    <NavLink activeClassName="font-extrabold text-lg" to="/declarations">Declaration</NavLink>
                  </li>
                  <li>
                    <NavLink activeClassName="font-extrabold text-lg" to="/transfers">Transfers</NavLink>
                  </li>
                </ul>
              </li>
              <li className="py-2">
                <div className="px-2 py-2 font-bold">
                  Purchase
                </div>
                <ul className="px-7">
                  <li>
                    <NavLink activeClassName="font-extrabold text-lg" to="/quotations">Quotations</NavLink>
                  </li>
                  <li>
                    <NavLink activeClassName="font-extrabold text-lg" to="/orders">Purchase Orders</NavLink>
                  </li>
                  <li>
                    <NavLink activeClassName="font-extrabold text-lg" to="/invoices">Purchase Invoices</NavLink>
                  </li>
                  <li>
                    <NavLink activeClassName="font-extrabold text-lg" to="/returns">Material Return Notes</NavLink>
                  </li>
                </ul>
              </li>
              <li className="py-2">
                <div className="px-2 py-2 font-bold">
                  Store
                </div>
                <ul className="px-7">
                  <li>
                    <NavLink activeClassName="font-extrabold text-lg" to="/invoices">Purchase Invoices</NavLink>
                  </li>
                  <li>
                    <NavLink activeClassName="font-extrabold text-lg" to="/requistions">Material Requistions</NavLink>
                  </li>
                </ul>
              </li>
              <li className="py-2">
                <div className="px-2 py-2 font-bold">
                  Quality
                </div>
                <ul className="px-7">
                  <li>
                    <NavLink activeClassName="font-extrabold text-lg" to="/materials-aceepted">Materials Accepted</NavLink>
                  </li>
                  <li>
                    <NavLink activeClassName="font-extrabold text-lg" to="/materials-rejected">Materials Rejected</NavLink>
                  </li>
                  <li>
                    <NavLink activeClassName="font-extrabold text-lg" to="/transfers">Transfers</NavLink>
                  </li>
                </ul>
              </li>
              <li className="py-2">
                <div className="px-2 py-2 font-bold">
                  Warehouse
                </div>
                <ul className="px-7">
                  <li>
                    <NavLink activeClassName="font-extrabold text-lg" to="/transfers">Tansfers</NavLink>
                  </li>
                </ul>
              </li>
            </ul>
          </Item>
          <Item area={Grid.content} className="overflow-y-scroll py-16">
            <Switch>
              <Route exact path="/product">
                <Product />
              </Route>
              <Route exact path="/products">
                <Products />
              </Route>
            </Switch>
          </Item>
        </Container>
      </BrowserRouter>
    </div>
  );
}

export default App;
