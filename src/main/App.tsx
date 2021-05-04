import Product from '../components/management/product/Product'
import { validateOrEvaluateExpression, LispExpression, Symbols } from './lisp'

const expression: LispExpression = {
  expectedReturnType: 'Decimal',
  op: '+',
  types: ['Decimal'],
  args: [{
    expectedReturnType: 'Decimal',
    op: '.',
    types: [],
    args: ['abc', 'x']
  }, {
    op: 'if',
    types: ['Decimal'],
    args: [{
      op: '==',
      types: ['Decimal'],
      args: [5, 7]
    }, {
      op: '+',
      types: ['Decimal'],
      args: [2, 3]
    }, {
      op: '+',
      types: ['Decimal'],
      args: [3, {
        op: 'id',
        types: ['Decimal'],
        args: ['3.2']
      }]
    }]
  }]
}

const expression2: LispExpression = {
  expectedReturnType: 'Decimal',
  op: '.',
  types: [],
  args: ['abc', 'x']
}

const symbols: Symbols = {
  'abc': {
    type: 'Text',
    value: 'jkkk',
    values: {
      'x': {
        type: 'Decimal',
        value: 4.2
      },
      'y': {
        type: 'Number',
        value: 7.2,
        values: {
          'z': {
            type: 'Boolean',
            value: true
          }
        }
      }
    }
  }
}

function App() {
  const result = validateOrEvaluateExpression(expression, symbols)
  console.log(String(result), typeof result)
  return (
    <div className="App font-nunito">
      <Product />
    </div>
  );
}

export default App;
