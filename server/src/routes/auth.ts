import express, {Request, Response} from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../db'

const router = express.Router()

router.post('/register', async (req: Request, res: Response) => {
  const { username, email, password } = req.body
  
  console.log('Register attempt:', { username, email })

  try {
    const userExists = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    )
    
    console.log('User exists check:', userExists.rows.length)

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    console.log('Hashing password...')
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    console.log('Inserting user...')
    const result = await pool.query(
      `INSERT INTO users (username, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, created_at`,
      [username, email, hashedPassword]
    )

    console.log('User created:', result.rows[0])
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/login', async (req: Request, res: Response) => {
    const {email, password} = req.body

    try{
        const result = await pool.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        )

        if(result.rows.length === 0){
            return res.status(401).json({error: 'Invalid credentials'})
        }

        const user = result.rows[0]
        const passwordMatch = await bcrypt.compare(password, user.password)

        if(!passwordMatch){
            return res.status(401).json({error: 'Invalid credentals'})
        }

        const token = jwt.sign(
            {id: user.id, username: user.username},
            process.env.JWT_SECRET as string,
            {expiresIn:'7d'}
        )

        res.status(200).json({
            token,
            user:{
                id:user.id,
                username:user.username,
                email:user.email
            }
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({error: 'Server error'})
    }
})

export default router