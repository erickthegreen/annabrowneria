// CarrinhoContext.jsx
// Context API simples para gerenciar o carrinho global com persistência em localStorage.
import { createContext, useContext, useState, useEffect } from 'react'

const CarrinhoContext = createContext(null)

export function CarrinhoProvider({ children }) {
  // Inicializa do localStorage para persistência entre recarregamentos
  const [itens, setItens] = useState(() => {
    try {
      const salvo = localStorage.getItem('annabrowneria_carrinho')
      return salvo ? JSON.parse(salvo) : []
    } catch {
      return []
    }
  })

  // Sincroniza com localStorage toda vez que itens mudar
  useEffect(() => {
    localStorage.setItem('annabrowneria_carrinho', JSON.stringify(itens))
  }, [itens])

  // Adiciona produto; se já existe, incrementa quantidade
  const adicionarItem = (produto) => {
    setItens(prev => {
      const existe = prev.find(i => i.produto.id === produto.id)
      if (existe) {
        return prev.map(i =>
          i.produto.id === produto.id
            ? { ...i, quantidade: i.quantidade + 1 }
            : i
        )
      }
      return [...prev, { produto, quantidade: 1 }]
    })
  }

  // Remove item completamente do carrinho
  const removerItem = (produtoId) => {
    setItens(prev => prev.filter(i => i.produto.id !== produtoId))
  }

  // Altera quantidade; remove se chegar a 0
  const alterarQuantidade = (produtoId, delta) => {
    setItens(prev =>
      prev
        .map(i => i.produto.id === produtoId
          ? { ...i, quantidade: i.quantidade + delta }
          : i
        )
        .filter(i => i.quantidade > 0)
    )
  }

  const limparCarrinho = () => setItens([])

  // Getters computados
  const totalItens = itens.reduce((acc, i) => acc + i.quantidade, 0)

  const totalPreco = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(
    itens.reduce((acc, i) => acc + i.produto.preco * i.quantidade, 0)
  )

  const totalPrecoNum = itens.reduce((acc, i) => acc + i.produto.preco * i.quantidade, 0)

  return (
    <CarrinhoContext.Provider value={{
      itens,
      adicionarItem,
      removerItem,
      alterarQuantidade,
      limparCarrinho,
      totalItens,
      totalPreco,
      totalPrecoNum,
    }}>
      {children}
    </CarrinhoContext.Provider>
  )
}

export const useCarrinho = () => {
  const ctx = useContext(CarrinhoContext)
  if (!ctx) throw new Error('useCarrinho deve ser usado dentro de CarrinhoProvider')
  return ctx
}
