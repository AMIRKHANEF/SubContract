import './styles/index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './store/store.ts'
import ContractRelayer from './relayers/ContractRelayers.tsx'

export default function Main() {
  return (
    <StrictMode>
      <Provider store={store}>
        <ContractRelayer />
        <App />
      </Provider>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<Main />);
