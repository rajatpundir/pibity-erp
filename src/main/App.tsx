import Product from '../components/management/product/Product'
import Products from '../components/management/product/Products'
import { Container, Item, none } from './commons';
import * as Grid from './grids'

function App() {
  return (
    <div className="App font-nunito bg-gray-100">
      <Container area={none} layout={Grid.layouts.main} className="h-screen">
        <Item area={Grid.navbar} className="bg-black text-white">
          Navbar
        </Item>
        <Item area={Grid.content} className="overflow-y-scroll">
          <Product />
          <Products />
          <Products />
          <Products />
          <Products />
          <Products />
        </Item>
      </Container>
    </div>
  );
}

export default App;
