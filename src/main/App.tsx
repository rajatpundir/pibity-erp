import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Navbar from './Navbar'
import { Container, Item, none } from './commons'
import * as Grid from './grids'
import Product from '../components/management/product/Product'
import Products from '../components/management/product/Products'
import Suppliers from '../components/management/supplier/Suppliers'
import Indent from '../components/production/indent/Indent'
import Indents from '../components/production/indent/Indents'

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
            </Switch>
          </Item>
        </Container>
      </BrowserRouter>
    </div>
  )
}

export default App
