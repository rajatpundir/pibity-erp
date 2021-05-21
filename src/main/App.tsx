import { BrowserRouter, Switch, Route } from "react-router-dom";
import ProductX from '../components/management/product/Product'
import Products from '../components/management/product/Products'
import Suppliers from '../components/management/supplier/Suppliers'
import { circuits, executeCircuit } from "./circuit";
import { Container, Item, none } from './commons';
import { executeFunction } from "./function";
import { functions } from "./functions";
import * as Grid from './grids'
import { executeMapper, mappers } from "./mapper";
import Navbar from './Navbar'
import { getState } from "./store";

function App() {
  // const [, , z] = executeFunction(functions.createProduct, {
  //   sku: 'SKU12349238BA',
  //   name: 'hkkjkjn',
  //   x: true,
  //   y: true,
  //   z: true
  // })
  // getState().addDiff(z)
  // const [, , t] = executeFunction(functions.createProduct, {
  //   sku: 'SKU12349238BB',
  //   name: 'hkkjkjn',
  //   x: false,
  //   y: false,
  //   z: false
  // })
  // getState().addDiff(t)
  // const [, , c] = executeMapper(mappers.mapper1, {
  //   queryParams: {
  //     orderable: true
  //   },
  //   args: [{abc: 'www'}, {abc: 'ww1'}]
  // })
  // getState().addDiff(c)
  const [d, e, f] = executeCircuit(circuits.circuit1, {
    a: 2,
    b: 3,
    c: 5,
    d: 7,
    e: 11
  })
  console.log(d, e, f)
  return (
    <div className="App font-nunito bg-gray-100">
      <BrowserRouter>
        <Container area={none} layout={Grid.layouts.main} className="h-screen">
          <Item area={Grid.navbar} className="bg-gray-900 text-gray-100 overflow-y-auto">
            <Navbar />
          </Item>
          <Item area={Grid.content} className="overflow-y-auto py-8">
            <Switch>
              <Route exact path="/product">
                <ProductX />
              </Route>
              <Route exact path="/products">
                <Products />
              </Route>
              <Route exact path="/suppliers">
                <Suppliers />
              </Route>
            </Switch>
          </Item>
        </Container>
      </BrowserRouter>
    </div>
  )
}

export default App;
