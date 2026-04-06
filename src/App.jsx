// App.jsx — monta todas as seções e gerencia estado global de UI
import { useState } from 'react'
import { CarrinhoProvider } from './context/CarrinhoContext'
import Navbar          from './components/Navbar'
import Hero            from './components/Hero'
import Produtos        from './components/Produtos'
import Sobre           from './components/Sobre'
import Contato         from './components/Contato'
import Footer          from './components/Footer'
import Carrinho        from './components/Carrinho'
import ModalCheckout   from './components/ModalCheckout'

function AppInner() {
  const [carrinhoOpen,  setCarrinhoOpen]  = useState(false)
  const [checkoutOpen,  setCheckoutOpen]  = useState(false)

  const handleCheckout = () => {
    setCarrinhoOpen(false)
    setTimeout(() => setCheckoutOpen(true), 300)
  }

  return (
    <div className="grain">
      <Navbar onOpenCarrinho={() => setCarrinhoOpen(true)} />
      <main>
        <Hero />
        <Produtos />
        <Sobre />
        <Contato />
      </main>
      <Footer />
      <Carrinho
        isOpen={carrinhoOpen}
        onClose={() => setCarrinhoOpen(false)}
        onCheckout={handleCheckout}
      />
      <ModalCheckout
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </div>
  )
}

export default function App() {
  return (
    <CarrinhoProvider>
      <AppInner />
    </CarrinhoProvider>
  )
}
