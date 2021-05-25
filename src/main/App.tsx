import { BrowserRouter, Switch, Route } from 'react-router-dom'
import ProductX from '../components/management/product/Product'
import Products from '../components/management/product/Products'
import Suppliers from '../components/management/supplier/Suppliers'
import Navbar from './Navbar'
import { Container, Item, none } from './commons'
import * as Grid from './grids'
import { circuits, executeCircuit } from './circuit'
import { executeFunction } from './function'
import { functions } from './functions'
import { executeMapper, mappers } from './mapper'
import { getState } from './store'

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
                <ProductX />
              </Route>
              <Route exact path='/products'>
                <Products />
              </Route>
              <Route exact path='/suppliers'>
                <Suppliers />
              </Route>
            </Switch>
          </Item>
        </Container>
      </BrowserRouter>
    </div>
  )
}

export default App
