import { useEffect, useState } from 'react'
import api from '../services/api'
import {type TopRated as TopRatedType } from '../types'
import EarRating from './EarRating'

function TopRated() {
  const [topRated, setTopRated] = useState<TopRatedType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        const response = await api.get('/api/reviews/top')
        setTopRated(response.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTopRated()
  }, [])

  if (loading || topRated.length === 0) return null

  return (
    <div style={{ marginBottom: '3rem' }}>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
      Top Rated Music
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
       {topRated.map((item, index) => (
  <div
    key={item.spotify_id}
    style={{
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
      background: '#1a1a1a',
      border: '1px solid #2a2a2a',
      borderRadius: '8px',
      padding: '12px'
    }}
  >
    <span style={{ color: '#ff4d4d', fontWeight: 700, width: '24px', fontSize: '0.9rem' }}>
      #{index + 1}
    </span>
    {item.artwork_url && (
      <img
        src={item.artwork_url}
        alt={item.title}
        style={{ width: '48px', height: '48px', borderRadius: '4px', objectFit: 'cover' }}
      />
    )}
    <div style={{ flex: 1 }}>
      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.title}</div>
      <div style={{ color: '#aaaaaa', fontSize: '0.8rem' }}>
        {item.artist} · {item.release_date?.slice(0, 4)}
      </div>
      <a
        href={`https://open.spotify.com/search/${encodeURIComponent(item.title + ' ' + item.artist)}`}
        target="_blank"
        rel="noreferrer"
        style={{ color: '#1db954', fontSize: '0.75rem', display: 'block', marginTop: '4px' }}
      >
        ▶ Listen on Spotify
      </a>
    </div>
    <div style={{ textAlign: 'right' }}>
      <EarRating rating={Math.round(Number(item.average_rating))} readOnly />
      <div style={{ color: '#aaaaaa', fontSize: '0.75rem', marginTop: '2px' }}>
        {item.review_count} {Number(item.review_count) === 1 ? 'review' : 'reviews'}
      </div>
    </div>
  </div>
))}
      </div>
    </div>
  )
}

export default TopRated