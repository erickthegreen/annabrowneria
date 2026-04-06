// lib/notificarWhatsapp.js
// Monta mensagem formatada e abre o WhatsApp da vendedora com o pedido completo.

const fmt = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

/**
 * Abre o WhatsApp da vendedora com o pedido formatado.
 *
 * @param {object} params
 * @param {string} params.nomeCliente    - Nome do cliente
 * @param {Array}  params.itens          - Array de { produto, quantidade }
 * @param {number} params.total          - Total numérico
 * @param {string} params.pedidoId       - ID do pedido (UUID)
 * @param {string} [params.telefoneVendedora] - Sobrescreve VITE_WHATSAPP_VENDEDORA
 */
export function notificarWhatsapp({ nomeCliente, itens, total, pedidoId, telefoneVendedora }) {
  const tel = telefoneVendedora
    || import.meta.env.VITE_WHATSAPP_VENDEDORA
    || '5599991077379'

  // Monta linhas de itens
  const linhasItens = itens
    .map(({ produto, quantidade }) =>
      `${quantidade}x ${produto.nome} — ${fmt(produto.preco * quantidade)}`
    )
    .join('\n')

  // ID curto: primeiros 8 chars em maiúsculo
  const idCurto = pedidoId.slice(0, 8).toUpperCase()

  const mensagem = [
    `Olá! Segue meu pedido:`,
    ``,
    linhasItens,
    `──────────────────`,
    `Total: ${fmt(total)}`,
    `Pedido: #${idCurto}`,
    ``,
    `Obrigada pela preferência! 🍫`,
  ].join('\n')

  const url = `https://wa.me/${tel}?text=${encodeURIComponent(mensagem)}`

  // Abre em nova aba; trata bloqueio de popup
  const janela = window.open(url, '_blank', 'noopener,noreferrer')

  if (!janela || janela.closed || typeof janela.closed === 'undefined') {
    // Popup bloqueado — fallback: redireciona na mesma aba
    window.location.href = url
  }
}
