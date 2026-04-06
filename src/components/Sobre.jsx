// Sobre.jsx
// Seção dividida com imagem + texto. Parallax sutil na imagem. Números em destaque.
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const STATS = [
  { valor: '200+', label: 'Clientes satisfeitos' },
  { valor: '4',    label: 'Anos de receita' },
  { valor: '12',   label: 'Sabores exclusivos' },
  { valor: '100%', label: 'Feito à mão' },
]

export default function Sobre() {
  const imgRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: imgRef, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <section
      id="sobre"
      style={{
        background: 'var(--chocolate-mid)',
        padding: 'clamp(4rem, 10vw, 8rem) 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Detalhe decorativo de fundo */}
      <div style={{
        position: 'absolute',
        top: '-30%',
        right: '-10%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,168,67,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 'clamp(2rem, 6vw, 5rem)',
        alignItems: 'center',
      }}>
        {/* Imagem com parallax */}
        <motion.div
          ref={imgRef}
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          {/* Borda dourada decorativa */}
          <div style={{
            position: 'absolute',
            top: '-12px',
            left: '-12px',
            right: '12px',
            bottom: '12px',
            border: '1px solid var(--border)',
            zIndex: 0,
            pointerEvents: 'none',
          }} />

          <motion.img
            style={{ y: imgY }}
            src="/brownie2.png"
            alt="Anna preparando brownies artesanais"
            loading="lazy"
            css={{ display: 'block', position: 'relative', zIndex: 1 }}
            onError={e => { e.target.src = 'https://placehold.co/700x800/2d1810/d4a843?text=AnnaBrowneria' }}
          />
          <img
            style={{
              display: 'block',
              position: 'relative',
              zIndex: 1,
              width: '100%',
              aspectRatio: '4/5',
              objectFit: 'cover',
            }}
            src="https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=700&q=80&auto=format&fit=crop"
            alt="Brownies artesanais saindo do forno"
            loading="lazy"
            onError={e => { e.target.src = 'https://placehold.co/700x800/2d1810/d4a843?text=AnnaBrowneria' }}
          />
        </motion.div>

        {/* Texto */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            marginBottom: '1rem',
          }}>
            Nossa história
          </p>

          <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '0' }}>
            Feita com <span>paixão</span>,<br />servida com amor.
          </h2>

          <div style={{
            width: '50px',
            height: '1px',
            background: 'linear-gradient(90deg, var(--gold), transparent)',
            margin: '1.5rem 0',
          }} />

          <p style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--text-muted)',
            lineHeight: 1.9,
            fontSize: '0.95rem',
            marginBottom: '1.25rem',
          }}>
            Tudo começou em 2021, quando Anna decidiu transformar sua paixão por confeitaria em um negócio.
            Em sua cozinha, ela testou dezenas de receitas até encontrar a combinação perfeita: chocolate belga
            de alta qualidade, manteiga artesanal e o tempo certo de forno.
          </p>

          <p style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--text-muted)',
            lineHeight: 1.9,
            fontSize: '0.95rem',
            marginBottom: '2.5rem',
          }}>
            Hoje, cada brownie é produzido sob encomenda, garantindo que você receba sempre o produto
            mais fresco e saboroso. Sem conservantes, sem pressa, apenas ingredientes selecionados e muito carinho.
          </p>

          {/* Stats em grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.5rem',
          }}>
            {STATS.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                style={{
                  borderLeft: '2px solid var(--caramel)',
                  paddingLeft: '1rem',
                }}
              >
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2.2rem',
                  fontWeight: 600,
                  color: 'var(--gold)',
                  lineHeight: 1,
                  marginBottom: '0.3rem',
                }}>
                  {stat.valor}
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
