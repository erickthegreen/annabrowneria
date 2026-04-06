// Hero.jsx
// Seção fullscreen com parallax real (useScroll + useTransform) e animações de entrada staggeradas.
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

// Imagem de fundo: brownie fotorrealista via placeholder temático
const BG_IMAGE = '/brownie1.png'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: i * 0.18, ease: [0.22, 1, 0.36, 1] }
  })
}

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  // Parallax: imagem sobe mais devagar que o scroll
  const bgY    = useTransform(scrollYProgress, [0, 1], ['0%', '35%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const handleScrollDown = () => {
    document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="inicio"
      ref={ref}
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Imagem de fundo com parallax */}
      <motion.div
        style={{
          position: 'absolute',
          inset: '-20%',
          y: bgY,
          backgroundImage: `url(${BG_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          willChange: 'transform',
        }}
      />

      {/* Overlay gradiente duplo — cria profundidade */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse 80% 70% at 50% 120%, rgba(26,14,8,0.0) 0%, rgba(26,14,8,0.85) 100%),
          linear-gradient(180deg, rgba(26,14,8,0.6) 0%, rgba(26,14,8,0.2) 40%, rgba(26,14,8,0.8) 100%)
        `,
      }} />

      {/* Overlay de textura sutil */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `repeating-linear-gradient(
          45deg,
          rgba(212,168,67,0.015) 0px,
          rgba(212,168,67,0.015) 1px,
          transparent 1px,
          transparent 12px
        )`,
      }} />

      {/* Conteúdo central */}
      <motion.div
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          padding: '0 1.5rem',
          maxWidth: '860px',
          opacity,
        }}
      >
        {/* Eyebrow */}
        <motion.p
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            marginBottom: '1.5rem',
          }}
        >
          Confeitaria artesanal · Desde 2021
        </motion.p>

        {/* Headline principal */}
        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3.2rem, 10vw, 7.5rem)',
            fontWeight: 300,
            lineHeight: 0.95,
            color: 'var(--cream-lt)',
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em',
          }}
        >
          O melhor{' '}
          <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>brownie</span>
          <br />
          que você já provou.
        </motion.h1>

        {/* Linha dourada decorativa */}
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="gold-line"
        />

        {/* Subtítulo */}
        <motion.p
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            fontWeight: 700,
            color: '#fff',
            marginBottom: '2.5rem',
            lineHeight: 1.7,
            maxWidth: '520px',
            margin: '0 auto 2.5rem',
          }}
        >
          Receitas exclusivas, ingredientes selecionados e muito amor em cada pedaço.
          Feito à mão, entregue com carinho.
        </motion.p>

        {/* CTA */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <motion.button
            whileHover={{ scale: 1.04, y: -3 }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary"
            onClick={handleScrollDown}
          >
            Ver Produtos
          </motion.button>
          <motion.a
            whileHover={{ scale: 1.04, y: -3 }}
            whileTap={{ scale: 0.97 }}
            href="#sobre"
            className="btn-outline"
            style={{ textDecoration: 'none' }}
          >
            Nossa história
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Seta de scroll */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        onClick={handleScrollDown}
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--gold)',
          zIndex: 2,
        }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <ChevronDown size={28} />
        </motion.div>
      </motion.button>
    </section>
  )
}
