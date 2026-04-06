// useProdutos.js
// Hook que busca produtos. Usa dados mock enquanto Supabase não estiver configurado.
import { useState, useEffect } from 'react'

const PRODUTOS_MOCK = [
  {
    id: '1',
    nome: 'Brownie Clássico',
    descricao: 'Receita original com chocolate belga 70% cacau, crocante por fora e fudgy por dentro.',
    preco: 12.00,
    url_img: 'https://placehold.co/600x400/2d1810/d4a843?text=Brownie+Cl%C3%A1ssico',
    disponivel: true,
  },
  {
    id: '2',
    nome: 'Brownie Nutella',
    descricao: 'Massa de chocolate com recheio generoso de Nutella e avelãs torradas.',
    preco: 16.00,
    url_img: 'https://placehold.co/600x400/2d1810/d4a843?text=Brownie+Nutella',
    disponivel: true,
  },
  {
    id: '3',
    nome: 'Brownie Maracujá',
    descricao: 'Combinação surpreendente de chocolate amargo com ganache de maracujá.',
    preco: 14.00,
    url_img: 'https://placehold.co/600x400/2d1810/d4a843?text=Brownie+Maracuj%C3%A1',
    disponivel: true,
  },
  {
    id: '4',
    nome: 'Brownie Red Velvet',
    descricao: 'Massa aveludada vermelha com cream cheese cremoso e raspas de chocolate branco.',
    preco: 15.00,
    url_img: 'https://placehold.co/600x400/2d1810/d4a843?text=Brownie+Red+Velvet',
    disponivel: true,
  },
  {
    id: '5',
    nome: 'Brownie Caramelo Salgado',
    descricao: 'Chocolate ao leite com caramelo artesanal e flor de sal. O equilíbrio perfeito.',
    preco: 15.00,
    url_img: 'https://placehold.co/600x400/2d1810/d4a843?text=Brownie+Caramelo',
    disponivel: true,
  },
  {
    id: '6',
    nome: 'Brownie Oreo',
    descricao: 'Massa intensa de chocolate recheada com cream cheese e pedaços generosos de Oreo.',
    preco: 16.00,
    url_img: 'https://placehold.co/600x400/2d1810/d4a843?text=Brownie+Oreo',
    disponivel: true,
  },
]

export function useProdutos() {
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    const fetchProdutos = async () => {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

      // Sem Supabase configurado → mock direto, sem tentar conectar
      if (!supabaseUrl || !supabaseKey) {
        await new Promise(r => setTimeout(r, 600))
        setProdutos(PRODUTOS_MOCK)
        setLoading(false)
        return
      }

      try {
        const { supabase } = await import('../lib/supabase')

        // supabase pode ser null se as vars não estiverem setadas
        if (!supabase) throw new Error('Cliente Supabase não inicializado')

        const { data, error: sbError } = await supabase
          .from('produtos')
          .select('*')
          .eq('disponivel', true)
          .order('criado_em', { ascending: true })

        if (sbError) throw sbError
        setProdutos(data ?? PRODUTOS_MOCK)
      } catch (err) {
        console.error('Erro ao buscar produtos:', err)
        // Sem mostrar mensagem de erro — apenas cai no mock silenciosamente
        setError('Erro ao carregar produtos. Mostrando dados de exemplo.')
        setProdutos(PRODUTOS_MOCK)
      } finally {
        setLoading(false)
      }
    }

    fetchProdutos()
  }, [])

  return { produtos, loading, error }
}
