import { useEffect, useState } from 'react'
import api from '../services/api'
import EarRating from './EarRating'

interface RankedRelease {
  title: string
  release_date: string
  artwork_url: string
  average_rating: string
  review_count: string
  reviewers: string[]
  ratings: number[]
  review_texts: (string | null)[]
}

interface ArtistData {
  stats: {
    artist: string
    artwork_url: string
    average_rating: string
    total_reviews: string
  }
  reviews: RankedRelease[]
  best: RankedRelease
  worst: RankedRelease
}

function ArtistPage({
  artist,
  onBack,
  onViewProfile,
  onReviewAlbum
}: {
  artist: string
  onBack: () => void
  onViewProfile: (username: string) => void
  onReviewAlbum: (album: any) => void
}) {
  const [data, setData] = useState<ArtistData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await api.get(`/api/reviews/artists/${encodeURIComponent(artist)}`)
        setData(response.data)
      } catch (err) {
        setError('Artist not found')
      } finally {
        setLoading(false)
      }
    }

    fetchArtist()
  }, [artist])

  if (loading) return <p style={{ color: '#aaaaaa' }}>Loading artist...</p>
  if (error || !data) return (
    <div>
      <button onClick={onBack} style={{ width: 'auto', padding: '0.5rem 1rem', marginBottom: '1rem' }}>
        ← Back
      </button>
      <p style={{ color: '#ff4444' }}>{error}</p>
    </div>
  )

  return (
    <div>
      <button
        onClick={onBack}
        style={{ width: 'auto', padding: '0.5rem 1rem', marginBottom: '2rem', background: '#2a2a2a' }}
      >
        ← Back
      </button>

      {/* Artist header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        background: '#1a1a1a',
        border: '1px solid #2a2a2a',
        borderRadius: '8px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        {data.stats.artwork_url && (
          <img
            src={data.stats.artwork_url}
            alt={data.stats.artist}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              objectFit: 'cover',
              flexShrink: 0
            }}
          />
        )}
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
            {data.stats.artist}
          </h2>
          <div style={{ color: '#aaaaaa', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            {data.stats.total_reviews} {Number(data.stats.total_reviews) === 1 ? 'review' : 'reviews'} from the community
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <EarRating rating={Math.round(Number(data.stats.average_rating))} readOnly />
            <span style={{ color: '#ff4d4d', fontWeight: 700 }}>
              {data.stats.average_rating}/5
            </span>
          </div>
        </div>
      </div>

      {/* Best and worst consensus */}
      {data.best && data.worst && data.reviews.length > 1 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: '#1a1a1a',
            border: '1px solid #1db95433',
            borderRadius: '8px',
            padding: '1rem'
          }}>
            <div style={{ color: '#1db954', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              COMMUNITY FAVOURITE
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>
              {data.best.title}
            </div>
            <div style={{ color: '#aaaaaa', fontSize: '0.8rem', marginBottom: '8px' }}>
              {data.best.release_date?.slice(0, 4)}
            </div>
            <EarRating rating={Math.round(Number(data.best.average_rating))} readOnly />
          </div>

          <div style={{
            background: '#1a1a1a',
            border: '1px solid #ff4d4d33',
            borderRadius: '8px',
            padding: '1rem'
          }}>
            <div style={{ color: '#ff4d4d', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              LEAST FAVOURITE
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>
              {data.worst.title}
            </div>
            <div style={{ color: '#aaaaaa', fontSize: '0.8rem', marginBottom: '8px' }}>
              {data.worst.release_date?.slice(0, 4)}
            </div>
            <EarRating rating={Math.round(Number(data.worst.average_rating))} readOnly />
          </div>
        </div>
      )}

      {/* Ranked discography */}
      <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Ranked Discography</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '2rem' }}>
        {data.reviews.map((release, index) => {
          const isBest = index === 0
          const isWorst = index === data.reviews.length - 1 && data.reviews.length > 1
          const spotifyUrl = `https://open.spotify.com/search/${encodeURIComponent(release.title + ' ' + data.stats.artist)}`

          return (
            <div
              key={release.title}
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                background: '#1a1a1a',
                border: `1px solid ${isBest ? '#1db95433' : isWorst ? '#ff4d4d33' : '#2a2a2a'}`,
                borderRadius: '8px',
                padding: '12px'
              }}
            >
              <span style={{
                color: isBest ? '#1db954' : isWorst ? '#ff4d4d' : '#555555',
                fontWeight: 700,
                width: '24px',
                fontSize: '0.9rem',
                flexShrink: 0
              }}>
                #{index + 1}
              </span>

              {release.artwork_url && (
                <img
                  src={release.artwork_url}
                  alt={release.title}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '4px',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  {release.title}
                </div>
                <div style={{ color: '#aaaaaa', fontSize: '0.75rem', marginBottom: '4px' }}>
                  {release.release_date?.slice(0, 4)} · {release.review_count} {Number(release.review_count) === 1 ? 'review' : 'reviews'}
                  {isBest && (
                    <span style={{ color: '#1db954', marginLeft: '8px' }}>● Community Favourite</span>
                  )}
                  {isWorst && (
                    <span style={{ color: '#ff4d4d', marginLeft: '8px' }}>● Least Favourite</span>
                  )}
                </div>
                <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', marginBottom: '6px' }}>
                  {release.reviewers.map((username, i) => (
                    <span
                      key={username}
                      onClick={() => onViewProfile(username)}
                      style={{
                        color: '#ff4d4d',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        marginRight: '12px'
                      }}
                    >
                      {username} ({release.ratings[i]}👂)
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <a
                    href={spotifyUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#1db954', fontSize: '0.75rem' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    ▶ Listen on Spotify
                  </a>
                  <button
                    onClick={() => onReviewAlbum({
                      spotify_id: release.title,
                      title: release.title,
                      artist: data.stats.artist,
                      album_type: 'album',
                      release_date: release.release_date,
                      artwork_url: release.artwork_url,
                      followers: 0
                    })}
                    style={{
                      width: 'auto',
                      padding: '3px 10px',
                      fontSize: '0.75rem',
                      background: '#2a2a2a'
                    }}
                  >
                    + Review
                  </button>
                </div>
              </div>

              <EarRating rating={Math.round(Number(release.average_rating))} readOnly />
            </div>
          )
        })}
      </div>

      {/* All individual reviews */}
      <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>All Reviews</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {data.reviews.flatMap((release) =>
          release.reviewers.map((username, i) => (
            <div
              key={`${release.title}-${username}`}
              style={{
                display: 'flex',
                gap: '16px',
                background: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: '8px',
                padding: '16px',
                alignItems: 'flex-start'
              }}
            >
              {release.artwork_url && (
                <img
                  src={release.artwork_url}
                  alt={release.title}
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '4px',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />
              )}
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '4px'
                }}>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', marginBottom: '2px' }}>{release.title}</h3>
                    <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                      <span
                        onClick={() => onViewProfile(username)}
                        style={{ color: '#ff4d4d', fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        {username} →
                      </span>
                    </div>
                    <a
                      href={`https://open.spotify.com/search/${encodeURIComponent(release.title + ' ' + data.stats.artist)}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: '#1db954', fontSize: '0.75rem', display: 'block', marginTop: '2px' }}
                    >
                      ▶ Listen on Spotify
                    </a>
                  </div>
                  <EarRating rating={release.ratings[i]} readOnly />
                </div>
                {release.review_texts[i] && (
                  <p style={{
                    color: '#cccccc',
                    fontSize: '0.85rem',
                    marginTop: '8px',
                    lineHeight: '1.5'
                  }}>
                    {release.review_texts[i]}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ArtistPage