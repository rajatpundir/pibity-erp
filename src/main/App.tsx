import Product from '../components/management/product/Product'
import { store } from './store'
import { Diff } from './layers'
import { Vector } from 'prelude-ts'

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
  const [variables, diffs, addDiff] = store(state => [state.variables, state.diffs, state.addDiff])
  console.log(variables())
  const q = Vector.of<Diff>().appendAll(diffs)
  console.log(diffs)
  if(!q.anyMatch(x => x.id === diff3.id))
    addDiff(diff3)
    // diffs.push(diff3)
  console.log(diffs)
  console.log(variables())
  return (
    <div className="App font-nunito">
      <Product />
    </div>
  );
}

export default App;
