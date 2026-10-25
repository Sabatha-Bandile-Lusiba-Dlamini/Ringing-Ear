import { useEffect, useState } from 'react'
import api from '../services/api'

interface CommunityUser {
  username: string
  total_reviews: string
  average_rating: string
}

function Community({ onViewProfile }: { onViewProfile: (username: string) => void }) {
  const [users, setUsers] = useState<CommunityUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const response = await api.get('/api/reviews/community')
        setUsers(response.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCommunity()
  }, [])

  if (loading || users.length === 0) return null

  return (
    <div style={{ marginBottom: '3rem' }}>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Community</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {users.map((user) => (
          <div
            key={user.username}
            onClick={() => onViewProfile(user.username)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: '8px',
              padding: '12px 16px',
              cursor: 'pointer',
              transition: 'border-color 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#ff4d4d')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#2a2a2a')}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                ● {user.username}
              </div>
              <div style={{ color: '#aaaaaa', fontSize: '0.8rem' }}>
                {user.total_reviews} {Number(user.total_reviews) === 1 ? 'review' : 'reviews'}
              </div>
            </div>
            <div style={{ color: '#ff4d4d', fontSize: '0.9rem', fontWeight: 600 }}>
              {user.average_rating} 👂
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Community