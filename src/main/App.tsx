import Product from '../components/management/product/Product'
import create from 'zustand'
import { Vector } from 'prelude-ts'
import { Layer, Diff, applyDiff } from './layers'


const base: Layer = {
  Product: Vector.of(),
  Supplier: Vector.of(
    {
      variableName: "ABC",
      values: {
        z: 2
      }
    }
  )
}

const diff1: Diff = {
  active: true,
  Product: {
    replace: Vector.of(
      {
        variableName: "PC",
        values: {
          x: 2
        }
      }
    ),
    remove: Vector.of("Books")
  },
  Supplier: {
    replace: Vector.of(),
    remove: Vector.of()
  }
}

const diff2: Diff = {
  active: true,
  Product: {
    replace: Vector.of(),
    remove: Vector.of()
  },
  Supplier: {
    replace: Vector.of(
      {
        variableName: "XYZ",
        values: {
          product: "Laptop"
        }
      }),
    remove: Vector.of()
  }
}

function App() {
  console.log(applyDiff(applyDiff(base, diff1), diff2))
  return (
    <div className="App font-nunito">
      <Product />
    </div>
  );
}

export default App;
