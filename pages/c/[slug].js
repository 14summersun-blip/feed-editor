import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Card({ card, error }) {
  if (error) return <pre style={{padding:40}}>ERROR: {error}</pre>
  if (!card) return <div style={{padding:40}}>Card not found</div>
  const img = card.images?.[0] || ''
  return (
    <div style={{background:'#000',color:'#fff',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div>
        <h1>{card.title}</h1>
        {img && <img src={img} width="400"/>}
      </div>
    </div>
  )
}

export async function getServerSideProps({ params }) {
  const { data, error } = await supabase.from('cards').select('*').eq('slug', params.slug).maybeSingle()
  return { props: { card: data || null, error: error?.message || null } }
}
