import Product from '../components/management/product/Product';
import { validateOrEvaluateExpression, LispExpression } from './lisp/LispUtils'

const expression: LispExpression = {
  expectedReturnType: 'Number',
  op: '*',
  types: ['Decimal', 'Decimal'],
  args: [1, 2, 3, {
      op: '+',
      types: ['Decimal'],
      args: [2, 3]
  }]
}

function App() {
  const result = validateOrEvaluateExpression(expression)
  console.log(result, typeof result)
  return (
    <div className="App font-nunito">
      <Product />
    </div>
  );
}

export default App;
