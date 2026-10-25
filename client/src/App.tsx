import { useState } from 'react'
import { useAuth } from './context/AuthContext'
import AuthForm from './components/AuthForm'
import SearchPanel from './components/SearchPanel'
import ReviewList from './components/ReviewList'
import TopRated from './components/TopRated'
import Community from './components/Community'
import ArtistList from './components/ArtistList'
import ArtistPage from './components/ArtistPage'
import ProfilePage from './components/ProfilePage'

function App() {
  const { user, loading, logout } = useAuth()
  const [refreshKey, setRefreshKey] = useState(0)
  const [viewingProfile, setViewingProfile] = useState<string | null>(null)
  const [viewingArtist, setViewingArtist] = useState<string | null>(null)
  const [preselectedAlbum, setPreselectedAlbum] = useState<any>(null)

  if (loading) return null
  if (!user) return <AuthForm />

  if (viewingProfile) {
    return (
      <div style={{ maxWidth: '700px', margin: '0 auto', paddingTop: '2rem' }}>
        <ProfilePage
          username={viewingProfile}
          onBack={() => setViewingProfile(null)}
        />
      </div>
    )
  }

  if (viewingArtist) {
    return (
      <div style={{ maxWidth: '700px', margin: '0 auto', paddingTop: '2rem' }}>
        <ArtistPage
          artist={viewingArtist}
          onBack={() => setViewingArtist(null)}
          onViewProfile={(username) => setViewingProfile(username)}
          onReviewAlbum={(album) => {
            setPreselectedAlbum(album)
            setViewingArtist(null)
          }}
        />
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0',
        paddingBottom: '1rem',
        borderBottom: '1px solid #ff4d4d22'
      }}>
        <h1 style={{ color: '#ff4d4d', letterSpacing: '2px' }}>Ringing Ear</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span
            onClick={() => setViewingProfile(user.username)}
            style={{ color: '#ff4d4d', fontSize: '0.9rem', cursor: 'pointer' }}
          >
            ● {user.username}
          </span>
          <button onClick={logout} style={{ width: 'auto', padding: '0.5rem 1rem' }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ marginTop: '2.5rem' }}>
        <TopRated />
        <ArtistList onViewArtist={(artist) => setViewingArtist(artist)} />
        <Community onViewProfile={(username) => setViewingProfile(username)} />
        <SearchPanel
          onReviewAdded={() => setRefreshKey(k => k + 1)}
          preselectedAlbum={preselectedAlbum}
          onPreselectedAlbumClear={() => setPreselectedAlbum(null)}
        />
        <ReviewList
          refreshKey={refreshKey}
          onViewProfile={(username) => setViewingProfile(username)}
        />
      </div>
    </div>
  )
}

export default App