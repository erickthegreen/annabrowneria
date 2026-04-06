// Carrinho.jsx
// Drawer lateral animado com lista de itens, controles de quantidade e botão de checkout.
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCarrinho } from '../context/CarrinhoContext'

export default function Carrinho({ isOpen, onClose, onCheckout }) {
  const { itens, removerItem, alterarQuantidade, totalPreco, totalItens } = useCarrinho()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(4px)',
              zIndex: 1100,
            }}
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: 'min(420px, 100vw)',
              background: 'var(--chocolate-mid)',
              borderLeft: '1px solid var(--border)',
              zIndex: 1200,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header do drawer */}
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ShoppingBag size={20} color="var(--gold)" />
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  fontWeight: 500,
                  color: 'var(--cream-lt)',
                }}>
                  Meu Carrinho
                </h2>
                {totalItens > 0 && (
                  <span style={{
                    background: 'var(--caramel)',
                    color: 'var(--chocolate)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '20px',
                  }}>
                    {totalItens}
                  </span>
                )}
              </div>
              <button onClick={onClose} style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: '0.25rem',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.target.style.color = 'var(--cream)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
              >
                <X size={22} />
              </button>
            </div>

            {/* Itens */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
              {itens.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    gap: '1rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  <ShoppingBag size={48} strokeWidth={1} />
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem' }}>
                    Seu carrinho está vazio
                  </p>
                  <button onClick={onClose} className="btn-outline" style={{ fontSize: '0.78rem' }}>
                    Ver produtos
                  </button>
                </motion.div>
              ) : (
                <AnimatePresence>
                  {itens.map(({ produto, quantidade }) => (
                    <motion.div
                      key={produto.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        padding: '1rem 0',
                        borderBottom: '1px solid var(--border)',
                        alignItems: 'center',
                      }}
                    >
                      {/* Miniatura */}
                      <img
                        src={produto.url_img}
                        alt={produto.nome}
                        style={{
                          width: '64px',
                          height: '64px',
                          objectFit: 'cover',
                          flexShrink: 0,
                        }}
                      />

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.05rem',
                          color: 'var(--cream-lt)',
                          marginBottom: '0.25rem',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                          {produto.nome}
                        </p>
                        <p style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.85rem',
                          color: 'var(--gold)',
                        }}>
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.preco * quantidade)}
                        </p>
                      </div>

                      {/* Controles de quantidade */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          onClick={() => alterarQuantidade(produto.id, -1)}
                          style={{
                            width: '28px', height: '28px',
                            border: '1px solid var(--border)',
                            background: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--caramel)'; e.currentTarget.style.color = 'var(--caramel)' }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.9rem',
                          color: 'var(--cream)',
                          minWidth: '20px',
                          textAlign: 'center',
                        }}>
                          {quantidade}
                        </span>
                        <button
                          onClick={() => alterarQuantidade(produto.id, 1)}
                          style={{
                            width: '28px', height: '28px',
                            border: '1px solid var(--border)',
                            background: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--caramel)'; e.currentTarget.style.color = 'var(--caramel)' }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
                        >
                          <Plus size={12} />
                        </button>

                        <button
                          onClick={() => removerItem(produto.id)}
                          style={{
                            background: 'none', border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                            padding: '0.25rem',
                            marginLeft: '0.25rem',
                            transition: 'color 0.2s',
                          }}
                          onMouseEnter={e => e.target.style.color = '#e05555'}
                          onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer do drawer — total + CTA */}
            {itens.length > 0 && (
              <div style={{
                padding: '1.5rem',
                borderTop: '1px solid var(--border)',
                background: 'rgba(26,14,8,0.5)',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.25rem',
                }}>
                  <span style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    Total
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.8rem',
                    fontWeight: 600,
                    color: 'var(--gold)',
                  }}>
                    {totalPreco}
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onCheckout}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.9rem' }}
                >
                  Finalizar Pedido
                </motion.button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
