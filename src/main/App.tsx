import Product from '../components/management/product/Product';
import { ChakraProvider } from "@chakra-ui/react"

function App() {
  return (
    <ChakraProvider>
      <div className="App">
        <Product />
      </div>
    </ChakraProvider>
  );
}

export default App;
