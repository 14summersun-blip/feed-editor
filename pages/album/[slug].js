import { supabase } from '../../lib/supabaseClient'
import Head from 'next/head'
import Link from 'next/link'

export async function getServerSideProps({ params }) {
  const { data: album } = await supabase.from('albums').select('*').eq('slug', params.slug).single()
  const { data: cards } = await supabase.from('cards').select('*').eq('album_id', album.id).order('created_at')
  return { props: { album, cards } }
}

export default function Album({ album, cards }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  return (
    <>
      <Head>
        <title>{album.title}</title>
        <meta property="og:title" content={album.title} />
        <meta property="og:image" content={album.cover_image} />
        <meta property="og:url" content={`${siteUrl}/album/${album.slug}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container">
        {cards.map(card => (
          <div key={card.id} className="card" style={{ background: card.card_color, borderRadius: card.border_radius }}>
            <div className="carousel">
              <img src={card.images[0]} alt={card.title} />
            </div>
            <h2 style={{ fontFamily: card.title_font, fontSize: card.title_size, color: card.title_color }}>{card.title}</h2>
            <p style={{ fontFamily: card.desc_font, fontSize: card.desc_size, color: card.desc_color }}>{card.description}</p>
            <Link href={`/c/${card.slug}`} className="btn" style={{ background: card.cta_bg, color: card.cta_color, borderRadius: card.cta_radius }}>{card.cta_text}</Link>
          </div>
        ))}
      </div>
    </>
  )
}
