import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

let spotifyToken: string = ''
let tokenExpiry: number = 0

const getSpotifyToken = async (): Promise<string> =>{

    if(spotifyToken && Date.now() < tokenExpiry){
        return spotifyToken
    }

    const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        'grant_type=client_credentials',
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${Buffer.from(
                    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
                ).toString('base64')}`
            }
        }
    )

    spotifyToken = response.data.access_token
    tokenExpiry = Date.now() + response.data.expires_in * 1000
    return spotifyToken
}

export const searchMusic = async (query:string): Promise<any> => {
    const token = await getSpotifyToken()

    try {
    const response = await axios.get(
      'https://api.spotify.com/v1/search',
      {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          q: query,
          type: 'album,track',
          limit: 10
        }
      }
    )
    return response.data
  } catch (err: any) {
    console.error('Spotify search error:', JSON.stringify(err.response?.data, null, 2))
    throw err
  }
}
export const getArtistFollowers = async (artistId: string): Promise<number> => {
  const token = await getSpotifyToken()

  const response = await axios.get(
    `https://api.spotify.com/v1/artists/${artistId}`,
    {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Accept': 'application/json'
      }
    }
  )

  console.log('Full artist data:', JSON.stringify(response.data, null, 2))
  return response.data.followers?.total ?? 0
}