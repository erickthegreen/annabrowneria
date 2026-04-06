// supabase/functions/criar-preferencia/index.ts
// Edge Function que cria preferência de pagamento no Mercado Pago de forma segura.
// A chave secreta MERCADOPAGO_ACCESS_TOKEN fica APENAS aqui, nunca no frontend.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { pedido_id, total, nome_cliente, itens } = await req.json()

    if (!pedido_id || !total || !nome_cliente || !itens) {
      return new Response(
        JSON.stringify({ error: 'Dados incompletos.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const mpToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN')
    if (!mpToken) throw new Error('Token do Mercado Pago não configurado.')

    // Monta os itens no formato aceito pelo Mercado Pago
    const mpItens = itens.map((item: any) => ({
      id:          item.produto_id,
      title:       item.nome,
      quantity:    item.quantidade,
      unit_price:  Number(item.preco),
      currency_id: 'BRL',
    }))

    // Cria preferência na API do Mercado Pago
    const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mpToken}`,
      },
      body: JSON.stringify({
        items: mpItens,
        payer: { name: nome_cliente },
        external_reference: pedido_id,
        auto_return: 'approved',
        back_urls: {
          success: `${Deno.env.get('VITE_SITE_URL') || 'http://localhost:5173'}/?status=success`,
          failure: `${Deno.env.get('VITE_SITE_URL') || 'http://localhost:5173'}/?status=failure`,
        },
      }),
    })

    if (!mpRes.ok) {
      const err = await mpRes.text()
      throw new Error(`Mercado Pago error: ${err}`)
    }

    const mpData = await mpRes.json()
    const preference_id = mpData.id

    // Atualiza o pedido no Supabase com o preference_id
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )
    await supabase
      .from('pedidos')
      .update({ mp_preference_id: preference_id })
      .eq('id', pedido_id)

    return new Response(
      JSON.stringify({ preference_id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
