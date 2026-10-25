import { useEffect, useState } from 'react'
import api from '../services/api'
import {type Review } from '../types'
import EarRating from './EarRating'

interface ReviewWithUsername extends Review {
  username: string
}

function ReviewList({
  refreshKey,
  onViewProfile
}: {
  refreshKey: number
  onViewProfile: (username: string) => void
}) {
  const [reviews, setReviews] = useState<ReviewWithUsername[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get('/api/reviews/my')
        setReviews(response.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [refreshKey])

  if (loading) return <p style={{ color: '#aaaaaa' }}>Loading your reviews...</p>
  if (reviews.length === 0) return (
    <p style={{ color: '#aaaaaa' }}>
      No reviews yet. Search for some music above.
    </p>
  )

  return (
    <div>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Your Library</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {reviews.map((review) => (
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
                  <span
                    onClick={() => onViewProfile(review.username)}
                    style={{
                      color: '#ff4d4d',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    view profile →
                  </span>
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
              <p style={{ color: '#555555', fontSize: '0.75rem', marginTop: '8px' }}>
                {new Date(review.created_at).toLocaleDateString('en-ZA')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReviewList