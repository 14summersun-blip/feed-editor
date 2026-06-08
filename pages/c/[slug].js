import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Card({ card }) {
  if (!card) return <div style={{padding:40}}>Card not found</div>
  const img = card.images?.[0] || ''
  return (
    <div style={{background:'#000',color:'#fff',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <div style={{maxWidth:420,width:'100%',background:'#111',borderRadius:24,overflow:'hidden'}}>
        {img && <img src={img} alt={card.title} style={{width:'100%',display:'block'}}/>}
        <div style={{padding:20}}>
          <h1 style={{margin:0,fontSize:28}}>{card.title}</h1>
          {card.description && <p style={{opacity:.8,marginTop:8}}>{card.description}</p>}
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps({ params }) {
  const { data } = await supabase.from('cards').select('*').eq('slug', params.slug).single()
  return { props: { card: data || null } }
}
