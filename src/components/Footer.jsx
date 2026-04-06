// Footer.jsx
// Rodapé simples com logo, links rápidos e copyright.
import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--chocolate-mid)',
      borderTop: '1px solid var(--border)',
      padding: '3rem 2rem',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '2rem',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.4rem',
            fontWeight: 600,
            color: 'var(--gold)',
          }}>
            Anna<span style={{ color: 'var(--cream)', fontWeight: 300, fontStyle: 'italic' }}>Browneria</span>
          </span>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            marginTop: '0.4rem',
          }}>
            Confeitaria artesanal com amor.
          </p>
        </div>

        {/* Links rápidos */}
        <nav style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {['#inicio', '#produtos', '#sobre', '#contato'].map((href, i) => {
            const labels = ['Início', 'Produtos', 'Sobre', 'Contato']
            return (
              <a key={href} href={href} style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                textDecoration: 'none',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.target.style.color = 'var(--gold)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
              >
                {labels[i]}
              </a>
            )
          })}
        </nav>

        {/* Copyright */}
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.04em',
        }}>
          © {new Date().getFullYear()} AnnaBrowneria. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
