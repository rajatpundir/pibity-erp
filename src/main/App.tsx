import Product from '../components/management/product/Product'
import { validateOrEvaluateExpression, LispExpression } from './lisp/LispUtils'

const expression: LispExpression = {
  expectedReturnType: 'Boolean',
  op: 'or',
  types: ['Boolean'],
  args: [false, false, false, {
      op: '==',
      types: ['Decimal'],
      args: [3, 3]
  }]
}

function App() {
  const result = validateOrEvaluateExpression(expression)
  console.log(String(result), typeof result)
  return (
    <div className="App font-nunito">
      <Product />
    </div>
  );
}

export default App;
