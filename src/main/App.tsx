import { BrowserRouter, Switch, Route } from "react-router-dom";
import Product from '../components/management/product/Product'
import Products from '../components/management/product/Products'
import { Container, Item, none } from './commons';
import { functions, executeFunction } from "./function";
import * as Grid from './grids'
import Navbar from './Navbar'

function App() {
  console.log(executeFunction(functions['add'], {
    a: 2.88,
    b: 3.99
  }))
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
