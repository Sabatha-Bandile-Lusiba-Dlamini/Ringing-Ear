import { useState, useEffect } from 'react'
import api from '../services/api'
import { type SearchResult } from '../types'
import EarRating from './EarRating'

interface ReviewFormData {
  ear_rating: number
  review_text: string
}

function SearchPanel({
  onReviewAdded,
  preselectedAlbum,
  onPreselectedAlbumClear
}: {
  onReviewAdded: () => void
  preselectedAlbum: any
  onPreselectedAlbumClear: () => void
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [selected, setSelected] = useState<SearchResult | null>(null)
  const [reviewData, setReviewData] = useState<ReviewFormData>({
    ear_rating: 0,
    review_text: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (preselectedAlbum) {
      setSelected(preselectedAlbum)
      setResults([])
      setQuery('')
      setReviewData({ ear_rating: 0, review_text: '' })
      setSuccess(false)
      setError(null)
      onPreselectedAlbumClear()
      window.scrollTo({ top: document.getElementById('search-panel')?.offsetTop ?? 0, behavior: 'smooth' })
    }
  }, [preselectedAlbum])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setSearching(true)
    setResults([])
    setSelected(null)
    setError(null)

    try {
      const response = await api.get(`/api/search?q=${encodeURIComponent(query)}`)
      setResults(response.data)
      if (response.data.length === 0) {
        setError('No underground SA artists found for that search.')
      }
    } catch (err) {
      setError('Search failed. Try again.')
    } finally {
      setSearching(false)
    }
  }

  const handleSelect = (result: SearchResult) => {
    setSelected(result)
    setReviewData({ ear_rating: 0, review_text: '' })
    setSuccess(false)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected || reviewData.ear_rating === 0) {
      setError('Please select a rating before submitting.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      await api.post('/api/reviews', {
        ...selected,
        ear_rating: reviewData.ear_rating,
        review_text: reviewData.review_text
      })
      setSuccess(true)
      setSelected(null)
      setResults([])
      setQuery('')
      onReviewAdded()
    } catch (err) {
      setError('Failed to submit review. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div id="search-panel" style={{ maxWidth: '600px', marginBottom: '3rem' }}>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
        Search And Review Your Favourite Underground Music
      </h2>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search artist or album..."
          style={{ flex: 1 }}
        />
        <button type="submit" disabled={searching} style={{ width: 'auto', padding: '0.75rem 1.5rem' }}>
          {searching ? '...' : 'Search'}
        </button>
      </form>

      {error && (
        <p style={{ color: '#ff4444', fontSize: '0.9rem', marginBottom: '1rem' }}>
          {error}
        </p>
      )}

      {success && (
        <p style={{ color: '#44ff88', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Review logged successfully!
        </p>
      )}

      {results.length > 0 && !selected && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
          {results.map((result) => (
            <div
              key={result.spotify_id}
              onClick={() => handleSelect(result)}
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
              {result.artwork_url && (
                <img
                  src={result.artwork_url}
                  alt={result.title}
                  style={{ width: '48px', height: '48px', borderRadius: '4px', objectFit: 'cover' }}
                />
              )}
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{result.title}</div>
                <div style={{ color: '#aaaaaa', fontSize: '0.8rem' }}>
                  {result.artist} · {result.release_date?.slice(0, 4)} · {result.album_type}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: '#1a1a1a',
            border: '1px solid #ff4d4d',
            borderRadius: '8px',
            padding: '12px'
          }}>
            {selected.artwork_url && (
              <img
                src={selected.artwork_url}
                alt={selected.title}
                style={{ width: '56px', height: '56px', borderRadius: '4px', objectFit: 'cover' }}
              />
            )}
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 600 }}>{selected.title}</div>
              <div style={{ color: '#aaaaaa', fontSize: '0.85rem' }}>{selected.artist}</div>
            </div>
          </div>

          <div>
            <p style={{ fontSize: '0.85rem', color: '#aaaaaa', marginBottom: '8px' }}>
              Your rating
            </p>
            <EarRating
              rating={reviewData.ear_rating}
              onRate={(r) => setReviewData({ ...reviewData, ear_rating: r })}
            />
          </div>

          <textarea
            placeholder="Write your review... (optional)"
            value={reviewData.review_text}
            onChange={(e) => setReviewData({ ...reviewData, review_text: e.target.value })}
            style={{ minHeight: '100px', resize: 'vertical' }}
          />

          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" disabled={submitting}>
              {submitting ? 'Logging...' : 'Log Review'}
            </button>
            <button
              type="button"
              onClick={() => setSelected(null)}
              style={{ background: '#2a2a2a' }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default SearchPanel