import express, { Request, Response } from 'express'
import pool from '../db'
import authMiddleware from '../middleware/auth'

interface AuthRequest extends Request {
  user?: { id: number; username: string }
}

const router = express.Router()

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const {
    spotify_id, title, artist, album_type,
    release_date, artwork_url, ear_rating, review_text
  } = req.body

  const userId = req.user!.id

  try {
    const result = await pool.query(
      `INSERT INTO reviews 
       (user_id, spotify_id, title, artist, album_type, release_date, artwork_url, ear_rating, review_text)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [userId, spotify_id, title, artist, album_type, release_date, artwork_url, ear_rating, review_text]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/my', authMiddleware, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id

  try {
    const result = await pool.query(
      `SELECT r.*, u.username FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.user_id = $1 
       ORDER BY release_date ASC`,
      [userId]
    )
    res.status(200).json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/top', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `WITH global AS (
        SELECT AVG(ear_rating) as global_avg,
               COUNT(*) as total_reviews
        FROM reviews
      )
      SELECT 
        spotify_id,
        title,
        artist,
        artwork_url,
        release_date,
        COUNT(*) as review_count,
        ROUND(AVG(ear_rating), 1) as average_rating,
        ROUND(
          (COUNT(*) * AVG(ear_rating) + global.total_reviews * global.global_avg) 
          / (COUNT(*) + global.total_reviews)
        , 1) as weighted_rating
      FROM reviews, global
      GROUP BY spotify_id, title, artist, artwork_url, release_date, global.global_avg, global.total_reviews
      HAVING COUNT(*) >= 1
      ORDER BY weighted_rating DESC, review_count DESC
      LIMIT 20`
    )
    res.status(200).json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/community', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT u.username, 
              COUNT(r.id) as total_reviews,
              ROUND(AVG(r.ear_rating), 1) as average_rating
       FROM users u
       JOIN reviews r ON r.user_id = u.id
       GROUP BY u.username
       ORDER BY total_reviews DESC`
    )
    res.status(200).json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/artists', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `WITH global AS (
        SELECT AVG(ear_rating) as global_avg,
               COUNT(*) as total_reviews
        FROM reviews
      )
      SELECT 
        artist,
        MAX(artwork_url) as artwork_url,
        COUNT(*) as total_reviews,
        ROUND(AVG(ear_rating), 1) as average_rating,
        ROUND(
          (COUNT(*) * AVG(ear_rating) + global.total_reviews * global.global_avg)
          / (COUNT(*) + global.total_reviews)
        , 1) as weighted_rating
      FROM reviews, global
      GROUP BY artist, global.global_avg, global.total_reviews
      ORDER BY weighted_rating DESC, total_reviews DESC`
    )
    res.status(200).json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/artists/:artist', async (req: Request, res: Response) => {
  try {
    const { artist } = req.params

    const stats = await pool.query(
      `SELECT 
        artist,
        MAX(artwork_url) as artwork_url,
        ROUND(AVG(ear_rating), 1) as average_rating,
        COUNT(*) as total_reviews
       FROM reviews
       WHERE artist = $1
       GROUP BY artist`,
      [artist]
    )

    if (stats.rows.length === 0) {
      return res.status(404).json({ error: 'Artist not found' })
    }

    const reviews = await pool.query(
      `SELECT 
        r.title,
        r.release_date,
        r.artwork_url,
        ROUND(AVG(r.ear_rating), 1) as average_rating,
        COUNT(*) as review_count,
        array_agg(u.username) as reviewers,
        array_agg(r.ear_rating) as ratings,
        array_agg(r.review_text) as review_texts
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.artist = $1
       GROUP BY r.title, r.release_date, r.artwork_url
       ORDER BY average_rating DESC`,
      [artist]
    )

    const best = await pool.query(
      `SELECT 
        r.title,
        r.release_date,
        r.artwork_url,
        ROUND(AVG(r.ear_rating), 1) as average_rating,
        array_agg(u.username) as reviewers,
        array_agg(r.ear_rating) as ratings,
        array_agg(r.review_text) as review_texts
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.artist = $1
       GROUP BY r.title, r.release_date, r.artwork_url
       ORDER BY average_rating DESC
       LIMIT 1`,
      [artist]
    )

    const worst = await pool.query(
      `SELECT 
        r.title,
        r.release_date,
        r.artwork_url,
        ROUND(AVG(r.ear_rating), 1) as average_rating,
        array_agg(u.username) as reviewers,
        array_agg(r.ear_rating) as ratings,
        array_agg(r.review_text) as review_texts
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.artist = $1
       GROUP BY r.title, r.release_date, r.artwork_url
       ORDER BY average_rating ASC
       LIMIT 1`,
      [artist]
    )

    res.status(200).json({
      stats: stats.rows[0],
      reviews: reviews.rows,
      best: best.rows[0],
      worst: worst.rows[0]
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/user/:username', async (req: Request, res: Response) => {
  try {
    const { username } = req.params

    const userResult = await pool.query(
      `SELECT id, username, created_at FROM users WHERE username = $1`,
      [username]
    )

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    const user = userResult.rows[0]

    const reviews = await pool.query(
      `SELECT * FROM reviews WHERE user_id = $1 ORDER BY release_date ASC`,
      [user.id]
    )

    const stats = await pool.query(
      `SELECT 
        COUNT(*) as total_reviews,
        ROUND(AVG(ear_rating), 1) as average_rating,
        COUNT(DISTINCT artist) as unique_artists
       FROM reviews WHERE user_id = $1`,
      [user.id]
    )

    res.status(200).json({
      user,
      reviews: reviews.rows,
      stats: stats.rows[0]
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router