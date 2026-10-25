import { useEffect, useState } from 'react'
import api from '../services/api'
import { type Review } from '../types'
import EarRating from './EarRating'

interface ProfileData {
  user: {
    id: number
    username: string
    created_at: string
  }
  reviews: Review[]
  stats: {
    total_reviews: string
    average_rating: string
    unique_artists: string
  }
}

function ProfilePage({
  username,
  onBack
}: {
  username: string
  onBack: () => void
}) {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/api/reviews/user/${username}`)
        setProfile(response.data)
      } catch (err) {
        setError('User not found')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [username])

  if (loading) return <p style={{ color: '#aaaaaa' }}>Loading profile...</p>
  if (error || !profile) return (
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
        style={{
          width: 'auto',
          padding: '0.5rem 1rem',
          marginBottom: '2rem',
          background: '#2a2a2a'
        }}
      >
        ← Back
      </button>

      <div style={{
        background: '#1a1a1a',
        border: '1px solid #2a2a2a',
        borderRadius: '8px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h2 style={{ color: '#ff4d4d', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
          {profile.user.username}
        </h2>
        <p style={{ color: '#aaaaaa', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          Member since {new Date(profile.user.created_at).toLocaleDateString('en-ZA')}
        </p>

        <div style={{ display: 'flex', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ff4d4d' }}>
              {profile.stats.total_reviews}
            </div>
            <div style={{ color: '#aaaaaa', fontSize: '0.8rem' }}>Reviews</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ff4d4d' }}>
              {profile.stats.average_rating || '—'}
            </div>
            <div style={{ color: '#aaaaaa', fontSize: '0.8rem' }}>Avg Rating</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ff4d4d' }}>
              {profile.stats.unique_artists}
            </div>
            <div style={{ color: '#aaaaaa', fontSize: '0.8rem' }}>Artists</div>
          </div>
        </div>
      </div>

      <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>
        {profile.user.username}'s Library
      </h3>

      {profile.reviews.length === 0 ? (
        <p style={{ color: '#aaaaaa' }}>No reviews yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {profile.reviews.map((review) => (
            <div
              key={review.id}
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
              {review.artwork_url && (
                <img
                  src={review.artwork_url}
                  alt={review.title}
                  style={{
                    width: '64px',
                    height: '64px',
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
                    <h3 style={{ fontSize: '1rem', marginBottom: '2px' }}>{review.title}</h3>
                    <p style={{ color: '#aaaaaa', fontSize: '0.85rem' }}>
                      {review.artist} · {review.release_date?.slice(0, 4)}
                    </p>
                  </div>
                  <EarRating rating={review.ear_rating} readOnly />
                </div>
                {review.review_text && (
                  <p style={{
                    color: '#cccccc',
                    fontSize: '0.85rem',
                    marginTop: '8px',
                    lineHeight: '1.5'
                  }}>
                    {review.review_text}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProfilePage