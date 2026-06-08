import { supabase } from '../../lib/supabaseClient'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export async function getServerSideProps({ params }) {
  const { data: card } = await supabase.from('cards').select('*, albums(*)').eq('slug', params.slug).single()
  const { data: comments } = await supabase.from('comments').select('*').eq('card_id', card.id).order('created_at', { ascending: false })
  return { props: { card, commentsInitial: comments } }
}

export default function CardPage({ card, commentsInitial }) {
  const [likes, setLikes] = useState(card.likes)
  const [comments, setComments] = useState(commentsInitial)
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  const ogImage = card.images?.[0] || card.albums.cover_image

  const handleLike = async () => {
    const newLikes = likes + 1
    setLikes(newLikes)
    await supabase.from('cards').update({ likes: newLikes }).eq('id', card.id)
  }

  const handleComment = async (e) => {
    e.preventDefault()
    const { data } = await supabase.from('comments').insert({ card_id: card.id, name, content }).select().single()
    setComments([data, ...comments])
    setName(''); setContent('')
  }

  const share = () => {
    if (navigator.share) {
      navigator.share({ title: card.title, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link disalin!')
    }
  }

  const videoEmbed = () => {
    if (!card.video_url) return null
    if (card.video_url.includes('youtube')) {
      const id = card.video_url.split('v=')[1]?.split('&')[0]
      return <iframe width="100%" height="220" src={`https://www.youtube.com/embed/${id}`} frameBorder="0" allowFullScreen></iframe>
    }
    if (card.video_url.includes('vimeo')) {
      const id = card.video_url.split('/').pop()
      return <iframe src={`https://player.vimeo.com/video/${id}`} width="100%" height="220" frameBorder="0" allowFullScreen></iframe>
    }
    return <video src={card.video_url} controls style={{ width:'100%' }} />
  }

  return (
    <>
      <Head>
        <title>{card.title} - {card.albums.title}</title>
        <meta property="og:title" content={card.title} />
        <meta property="og:description" content={card.description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={`${siteUrl}/c/${card.slug}`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <div className="container">
        <div className="card" style={{ background: card.card_color, borderRadius: card.border_radius, minHeight:'90vh' }}>
          <div className="carousel">
            {card.images?.map((img,i) => <img key={i} src={img} alt="" />)}
          </div>
          {videoEmbed()}
          <h1 style={{ fontFamily: card.title_font, fontSize: card.title_size, color: card.title_color }}>{card.title}</h1>
          <p style={{ fontFamily: card.desc_font, fontSize: card.desc_size, color: card.desc_color }}>{card.description}</p>
          <a href={card.cta_url} className="btn" style={{ background: card.cta_bg, color: card.cta_color, borderRadius: card.cta_radius }}>{card.cta_text}</a>
          
          <div style={{ marginTop:24, display:'flex', gap:12 }}>
            <button onClick={handleLike}>❤️ {likes}</button>
            <button onClick={share}>Share</button>
          </div>

          <form onSubmit={handleComment} style={{ marginTop:20 }}>
            <input placeholder="Nama" value={name} onChange={e=>setName(e.target.value)} required style={{ width:'100%', marginBottom:8, padding:8 }} />
            <textarea placeholder="Komentar..." value={content} onChange={e=>setContent(e.target.value)} required style={{ width:'100%', padding:8 }} />
            <button type="submit" style={{ marginTop:8 }}>Kirim</button>
          </form>

          <div style={{ marginTop:16 }}>
            {comments.map(c => (
              <div key={c.id} style={{ borderTop:'1px solid #eee', padding:'8px 0' }}>
                <strong>{c.name}</strong><br/>{c.content}
              </div>
            ))}
          </div>
        </div>
        <div className="footer-back">
          <Link href={`/album/${card.albums.slug}`}>← Lihat semua produk {card.albums.title}</Link>
        </div>
      </div>
    </>
  )
}
