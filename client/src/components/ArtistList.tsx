import { useEffect, useState } from 'react'
import api from '../services/api'

interface Artist {
  artist: string
  artwork_url: string
  total_reviews: string
  average_rating: string
}

function ArtistList({ onViewArtist }: { onViewArtist: (artist: string) => void }) {
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await api.get('/api/reviews/artists')
        setArtists(response.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchArtists()
  }, [])

  if (loading || artists.length === 0) return null

  return (
    <div style={{ marginBottom: '3rem' }}>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Artists</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {artists.map((artist) => (
          <div
            key={artist.artist}
            onClick={() => onViewArtist(artist.artist)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: '8px',
              padding: '12px',
              cursor: 'pointer',
              transition: 'border-color 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#ff4d4d')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#2a2a2a')}
          >
            {artist.artwork_url && (
              <img
                src={artist.artwork_url}
                alt={artist.artist}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  flexShrink: 0
                }}
              />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                {artist.artist}
              </div>
              <div style={{ color: '#aaaaaa', fontSize: '0.8rem' }}>
                {artist.total_reviews} {Number(artist.total_reviews) === 1 ? 'review' : 'reviews'} from the community
              </div>
            </div>
            <div style={{
              color: '#ff4d4d',
              fontWeight: 700,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {artist.average_rating} 👂
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ArtistList