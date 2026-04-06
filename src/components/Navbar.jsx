// Navbar.jsx
// Transparente no topo, sólida + blur ao rolar. Badge do carrinho via context.
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useCarrinho } from '../context/CarrinhoContext'

const links = [
  { href: '#inicio',   label: 'Início' },
  { href: '#produtos', label: 'Produtos' },
  { href: '#sobre',    label: 'Sobre' },
  { href: '#contato',  label: 'Contato' },
]

export default function Navbar({ onOpenCarrinho }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { totalItens } = useCarrinho()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'background 0.4s, backdrop-filter 0.4s, border-bottom 0.4s',
        background: scrolled ? 'rgba(26,14,8,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(212,168,67,0.15)' : '1px solid transparent',
      }}
    >
      {/* Logo */}
      <a href="#inicio" style={{ textDecoration: 'none' }}>
        <motion.div whileHover={{ scale: 1.03 }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.6rem',
            fontWeight: 600,
            color: 'var(--gold)',
            letterSpacing: '0.04em',
            lineHeight: 1,
          }}>
            Anna<span style={{ color: 'var(--cream)', fontWeight: 300, fontStyle: 'italic' }}>Browneria</span>
          </span>
        </motion.div>
      </a>

      {/* Links desktop */}
      <nav style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}
           className="hidden-mobile">
        {links.map(link => (
          <a key={link.href} href={link.href} style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 400,
            fontSize: '0.82rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.target.style.color = 'var(--gold)'}
          onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* Carrinho + menu mobile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenCarrinho}
          style={{
            position: 'relative',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--cream)',
            padding: '0.4rem',
          }}
        >
          <ShoppingBag size={22} />
          {totalItens > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'var(--caramel)',
                color: 'var(--chocolate)',
                fontSize: '0.65rem',
                fontWeight: 700,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {totalItens}
            </motion.span>
          )}
        </motion.button>

        {/* Botão menu mobile */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cream)' }}
          className="show-mobile"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'rgba(26,14,8,0.97)',
              backdropFilter: 'blur(16px)',
              borderBottom: '1px solid var(--border)',
              padding: '1.5rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
          >
            {links.map(link => (
              <a key={link.href} href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.1rem',
                  color: 'var(--text-main)',
                  textDecoration: 'none',
                  letterSpacing: '0.08em',
                }}
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 768px) {
          .hidden-mobile { display: flex !important; }
          .show-mobile { display: none !important; }
        }
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </motion.header>
  )
}
