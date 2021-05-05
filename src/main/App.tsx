import Product from '../components/management/product/Product'
import { store } from './store'
import { Diff } from './layers'
import { Vector } from 'prelude-ts'
import { stat } from 'node:fs'

const diff3: Diff = {
  active: true,
  Product: {
    replace: Vector.of(),
    remove: Vector.of()
  },
  Supplier: {
    replace: Vector.of(
      {
        variableName: "QWE",
        values: {
          product: "Laptop"
        }
      }),
    remove: Vector.of()
  }
}

function App() {
  const [variables, addDiff] = store(state => [state.variables(), state.addDiff])
  console.log(variables)
  // addDiff(diff3)
  // console.log(variables)
  return (
    <div className="App font-nunito">
      <Product />
    </div>
  );
}

export default App;
