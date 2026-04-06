// ModalCheckout.jsx
// Modal de finalização em 3 etapas: formulário → pagamento → sucesso
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Phone, ChevronRight, CheckCircle } from 'lucide-react'
import { useCarrinho } from '../context/CarrinhoContext'
import { notificarWhatsapp } from '../lib/notificarWhatsapp'

const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

// Máscara de telefone: (99) 99999-9999
function maskPhone(value) {
  return value
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
}

// ─── ETAPA 1: Formulário ───────────────────────────────────────────────────
function FormularioCliente({ onContinuar }) {
  const [nome, setNome]       = useState('')
  const [telefone, setTelefone] = useState('')
  const [errors, setErrors]   = useState({})

  const validate = () => {
    const e = {}
    if (!nome.trim() || nome.trim().length < 3)   e.nome     = 'Informe seu nome completo.'
    if (telefone.replace(/\D/g, '').length < 10)  e.telefone = 'Telefone inválido.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (validate()) onContinuar({ nome: nome.trim(), telefone })
  }

  return (
    <motion.div
      key="formulario"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--cream-lt)', marginBottom: '0.4rem' }}>
        Seus dados
      </h3>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
        Para confirmarmos seu pedido.
      </p>

      {/* Campo nome */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
          Nome completo
        </label>
        <div style={{ position: 'relative' }}>
          <User size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={nome}
            onChange={e => setNome(e.target.value)}
            placeholder="Anna Silva"
            style={{
              width: '100%', padding: '0.85rem 1rem 0.85rem 2.75rem',
              background: 'var(--chocolate)', border: `1px solid ${errors.nome ? '#e05555' : 'var(--border)'}`,
              color: 'var(--cream)', fontFamily: 'var(--font-body)', fontSize: '0.95rem', outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--gold)'}
            onBlur={e => e.target.style.borderColor = errors.nome ? '#e05555' : 'var(--border)'}
          />
        </div>
        {errors.nome && <p style={{ color: '#e05555', fontSize: '0.78rem', marginTop: '0.3rem', fontFamily: 'var(--font-body)' }}>{errors.nome}</p>}
      </div>

      {/* Campo telefone */}
      <div style={{ marginBottom: '2rem' }}>
        <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
          WhatsApp / Telefone
        </label>
        <div style={{ position: 'relative' }}>
          <Phone size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="tel"
            value={telefone}
            onChange={e => setTelefone(maskPhone(e.target.value))}
            placeholder="(98) 99999-9999"
            style={{
              width: '100%', padding: '0.85rem 1rem 0.85rem 2.75rem',
              background: 'var(--chocolate)', border: `1px solid ${errors.telefone ? '#e05555' : 'var(--border)'}`,
              color: 'var(--cream)', fontFamily: 'var(--font-body)', fontSize: '0.95rem', outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--gold)'}
            onBlur={e => e.target.style.borderColor = errors.telefone ? '#e05555' : 'var(--border)'}
          />
        </div>
        {errors.telefone && <p style={{ color: '#e05555', fontSize: '0.78rem', marginTop: '0.3rem', fontFamily: 'var(--font-body)' }}>{errors.telefone}</p>}
      </div>

      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleSubmit}
        className="btn-primary"
        style={{ width: '100%', justifyContent: 'center', gap: '0.5rem' }}
      >
        Continuar <ChevronRight size={16} />
      </motion.button>
    </motion.div>
  )
}

// ─── ETAPA 2: Resumo + envio via WhatsApp (substitui Mercado Pago quando não configurado) ─
function ResumoEConfirmacao({ cliente, onConfirmar, loading }) {
  const { itens, totalPreco, totalPrecoNum } = useCarrinho()

  return (
    <motion.div
      key="resumo"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--cream-lt)', marginBottom: '1.5rem' }}>
        Resumo do pedido
      </h3>

      {/* Lista de itens */}
      <div style={{ marginBottom: '1.5rem' }}>
        {itens.map(({ produto, quantidade }) => (
          <div key={produto.id} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '0.65rem 0', borderBottom: '1px solid var(--border)',
          }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text-main)' }}>
              {quantidade}× {produto.nome}
            </span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--gold)' }}>
              {fmt(produto.preco * quantidade)}
            </span>
          </div>
        ))}

        {/* Total */}
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--cream)' }}>Total</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--gold)', fontWeight: 600 }}>
            {totalPreco}
          </span>
        </div>
      </div>

      {/* Dados do cliente */}
      <div style={{
        padding: '1rem', background: 'var(--chocolate)', border: '1px solid var(--border)', marginBottom: '1.5rem',
      }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Pedido para:</p>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--cream)', fontSize: '0.95rem' }}>{cliente.nome}</p>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{cliente.telefone}</p>
      </div>

      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => onConfirmar({ cliente, itens, totalPrecoNum })}
        disabled={loading}
        className="btn-primary"
        style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
      >
        {loading ? 'Processando...' : 'Confirmar Pedido'}
      </motion.button>
    </motion.div>
  )
}

// ─── ETAPA 3: Sucesso ──────────────────────────────────────────────────────
function Sucesso({ pedidoId, cliente, onWhatsApp, onFechar }) {
  return (
    <motion.div
      key="sucesso"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ textAlign: 'center' }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 12 }}
        style={{ marginBottom: '1.5rem' }}
      >
        <CheckCircle size={64} color="var(--gold)" strokeWidth={1.2} style={{ margin: '0 auto' }} />
      </motion.div>

      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--cream-lt)', marginBottom: '0.5rem' }}>
        Pedido confirmado!
      </h3>

      <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
        Obrigada, {cliente.nome}! 🍫
      </p>

      {pedidoId && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Pedido #{pedidoId.slice(0, 8).toUpperCase()}
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onWhatsApp}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
            padding: '1rem', background: 'linear-gradient(135deg, #25d366, #128c7e)',
            color: '#fff', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.95rem',
          }}
        >
          Enviar pedido pelo WhatsApp
        </motion.button>

        <button onClick={onFechar} className="btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
          Voltar ao início
        </button>
      </div>
    </motion.div>
  )
}

// ─── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────
export default function ModalCheckout({ isOpen, onClose }) {
  const { itens, totalPrecoNum, limparCarrinho } = useCarrinho()
  const [etapa, setEtapa]     = useState('formulario') // formulario | resumo | sucesso
  const [cliente, setCliente] = useState(null)
  const [pedidoId, setPedidoId] = useState(null)
  const [loading, setLoading]  = useState(false)

  const handleContinuar = (dadosCliente) => {
    setCliente(dadosCliente)
    setEtapa('resumo')
  }

  const handleConfirmar = async ({ cliente, itens, totalPrecoNum }) => {
    setLoading(true)
    try {
      // Tenta salvar no Supabase se configurado
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      if (supabaseUrl) {
        const { supabase } = await import('../lib/supabase')
        const itensSalvos = itens.map(({ produto, quantidade }) => ({
          produto_id: produto.id,
          nome: produto.nome,
          preco: produto.preco,
          quantidade,
        }))
        const { data } = await supabase.from('pedidos').insert({
          nome_cliente: cliente.nome,
          telefone: cliente.telefone,
          itens: itensSalvos,
          total: totalPrecoNum,
          status: 'pendente',
        }).select().single()

        if (data) setPedidoId(data.id)
      } else {
        // Sem Supabase: gera um ID fictício
        setPedidoId(crypto.randomUUID())
      }
      setEtapa('sucesso')
    } catch (err) {
      console.error('Erro ao salvar pedido:', err)
      setPedidoId(crypto.randomUUID())
      setEtapa('sucesso')
    } finally {
      setLoading(false)
    }
  }

  const handleWhatsApp = () => {
    notificarWhatsapp({
      nomeCliente: cliente.nome,
      itens,
      total: totalPrecoNum,
      pedidoId: pedidoId || 'N/A',
    })
  }

  const handleFechar = () => {
    limparCarrinho()
    setEtapa('formulario')
    setCliente(null)
    setPedidoId(null)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={etapa !== 'sucesso' ? onClose : undefined}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(6px)',
              zIndex: 1300,
            }}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            style={{
              position: 'fixed',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'min(520px, calc(100vw - 2rem))',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: 'var(--chocolate-mid)',
              border: '1px solid var(--border)',
              zIndex: 1400,
              padding: '2rem',
            }}
          >
            {/* Botão fechar */}
            {etapa !== 'sucesso' && (
              <button onClick={onClose} style={{
                position: 'absolute', top: '1.25rem', right: '1.25rem',
                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
              }}>
                <X size={20} />
              </button>
            )}

            {/* Indicador de progresso */}
            {etapa !== 'sucesso' && (
              <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '2rem' }}>
                {['formulario', 'resumo'].map((e) => (
                  <div key={e} style={{
                    height: '2px', flex: 1,
                    background: etapa === e || (e === 'formulario' && etapa === 'resumo')
                      ? 'var(--gold)' : 'var(--border)',
                    transition: 'background 0.3s',
                  }} />
                ))}
              </div>
            )}

            <AnimatePresence mode="wait">
              {etapa === 'formulario' && (
                <FormularioCliente key="form" onContinuar={handleContinuar} />
              )}
              {etapa === 'resumo' && (
                <ResumoEConfirmacao
                  key="resumo"
                  cliente={cliente}
                  onConfirmar={handleConfirmar}
                  loading={loading}
                />
              )}
              {etapa === 'sucesso' && (
                <Sucesso
                  key="sucesso"
                  pedidoId={pedidoId}
                  cliente={cliente}
                  onWhatsApp={handleWhatsApp}
                  onFechar={handleFechar}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
