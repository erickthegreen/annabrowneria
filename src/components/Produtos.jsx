// Produtos.jsx
// Grid responsivo de produtos com animações whileInView, skeleton loading e botão de carrinho.
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Check } from 'lucide-react'
import { useProdutos } from '../hooks/useProdutos'
import { useCarrinho } from '../context/CarrinhoContext'

const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

// Card individual com animação de entrada e hover
function ProdutoCard({ produto, index }) {
  const { adicionarItem } = useCarrinho()
  const [adicionado, setAdicionado] = useState(false)

  const handleAdd = () => {
    adicionarItem(produto)
    setAdicionado(true)
    setTimeout(() => setAdicionado(false), 1800)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      style={{
        background: 'var(--chocolate-mid)',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        transition: 'box-shadow 0.3s',
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 20px 50px rgba(212,168,67,0.15)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      {/* Imagem */}
      <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '3/2' }}>
        <motion.img
          src={produto.url_img}
          alt={produto.nome}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {/* Overlay sutil no hover */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, transparent 50%, rgba(26,14,8,0.7) 100%)',
        }} />
      </div>

      {/* Conteúdo do card */}
      <div style={{ padding: '1.5rem' }}>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.4rem',
          fontWeight: 500,
          color: 'var(--cream-lt)',
          marginBottom: '0.5rem',
        }}>
          {produto.nome}
        </h3>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.875rem',
          color: 'var(--text-muted)',
          lineHeight: 1.6,
          marginBottom: '1.25rem',
          minHeight: '2.8em',
        }}>
          {produto.descricao}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            fontWeight: 600,
            color: 'var(--gold)',
          }}>
            {fmt(produto.preco)}
          </span>

          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={handleAdd}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.6rem 1.1rem',
              background: adicionado
                ? 'linear-gradient(135deg, #3a7c3a, #5ab05a)'
                : 'linear-gradient(135deg, var(--caramel), var(--gold))',
              color: 'var(--chocolate)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-body)',
              transition: 'background 0.3s',
            }}
          >
            <AnimatePresence mode="wait">
              {adicionado ? (
                <motion.span key="check"
                  initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <Check size={14} /> Adicionado
                </motion.span>
              ) : (
                <motion.span key="add"
                  initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <ShoppingBag size={14} /> Adicionar
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.article>
  )
}

// Skeleton de loading
function SkeletonCard() {
  return (
    <div style={{ background: 'var(--chocolate-mid)', border: '1px solid var(--border)', overflow: 'hidden' }}>
      <div className="skeleton" style={{ aspectRatio: '3/2', width: '100%' }} />
      <div style={{ padding: '1.5rem' }}>
        <div className="skeleton" style={{ height: '1.4rem', width: '60%', marginBottom: '0.75rem', borderRadius: '2px' }} />
        <div className="skeleton" style={{ height: '0.875rem', width: '100%', marginBottom: '0.4rem', borderRadius: '2px' }} />
        <div className="skeleton" style={{ height: '0.875rem', width: '75%', marginBottom: '1.25rem', borderRadius: '2px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="skeleton" style={{ height: '1.5rem', width: '30%', borderRadius: '2px' }} />
          <div className="skeleton" style={{ height: '2.2rem', width: '38%', borderRadius: '2px' }} />
        </div>
      </div>
    </div>
  )
}

export default function Produtos() {
  const { produtos, loading, error } = useProdutos()

  return (
    <section id="produtos" style={{ padding: 'clamp(4rem, 10vw, 8rem) 2rem' }}>
      {/* Cabeçalho da seção */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 6vw, 5rem)' }}
      >
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.75rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
          marginBottom: '1rem',
        }}>
          Nosso cardápio
        </p>
        <h2 className="section-title">
          Feito com <span>amor</span>
        </h2>
        <div className="gold-line" />
        <p style={{
          fontFamily: 'var(--font-body)',
          color: 'var(--text-muted)',
          fontSize: '1rem',
          maxWidth: '500px',
          margin: '0 auto',
          lineHeight: 1.7,
        }}>
          Cada brownie é produzido artesanalmente sob encomenda, garantindo máxima frescura.
        </p>
      </motion.div>

      {/* Mensagem de erro (não bloqueia — produtos mock são exibidos) */}
      {error && (
        <div style={{
          textAlign: 'center',
          padding: '0.75rem',
          marginBottom: '2rem',
          background: 'rgba(201,125,58,0.1)',
          border: '1px solid rgba(201,125,58,0.3)',
          color: 'var(--caramel)',
          fontSize: '0.85rem',
          fontFamily: 'var(--font-body)',
        }}>
          {error}
        </div>
      )}

      {/* Grid */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '2rem',
      }}>
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : produtos.map((p, i) => <ProdutoCard key={p.id} produto={p} index={i} />)
        }
      </div>
    </section>
  )
}
