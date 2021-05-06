import Product from '../components/management/product/Product'
import Products from '../components/management/product/Products'
import { Vector } from 'prelude-ts'
import { store } from './store'
import { Diff, Layer, compose } from './layers'

const diff3: Diff = {
  id: 3,
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


  // const [base, diffs, addDiff] = store(state => [state.base, state.diffs, state.addDiff])
  // console.log(compose(base, diffs))
  // console.log(diffs)



  // if (!Vector.of<Diff>().appendAll(diffs).anyMatch(x => x.id === diff3.id))
  //   addDiff(diff3)


  // console.log(compose(base, diffs))
  // console.log(diffs)



  return (
    <div className="App font-nunito">
      <Product />
      <Products/>
    </div>
  );
}

export default App;
