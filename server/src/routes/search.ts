import express, {Request, Response} from 'express'
import { searchMusic, getArtistFollowers } from '../services/spotify'
import pool from '../db'

const router = express.Router()


router.get('/', async (req: Request, res: Response) => {
    const {q} = req.query

    if(!q){
        return res.status(400).json({error: 'Search query required'})
    }

    try{
        const spotifyData = await searchMusic(q as string)
        const albums = spotifyData.albums?.items || []

       const results = albums.map((album: any) => {
  return {
    spotify_id: album.id,
    title: album.name,
    artist: album.artists[0].name,
    album_type: album.album_type,
    release_date: album.release_date,
    artwork_url: album.images[0]?.url || '',
    followers: 0
  }
}).filter(Boolean)

res.status(200).json(results)
    } catch(err){
        console.error(err)
        res.status(500).json({error: 'Server error'})
    }
})

export default router