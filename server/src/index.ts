import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import pool from './db'
import authRoutes from './routes/auth'
import reviewRoutes from './routes/reviews'
import searchRoutes from './routes/search'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

pool.connect()
.then(() => console.log('PostgresSQL connected'))
.catch((err: Error) => console.log('DB connection error:', err))

app.use('/api/auth', authRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/search', searchRoutes)

app.get('/',(req,res) =>{
    res.json({message: 'Ringing Ear API is running'})
})

const PORT = process.env.PORT || 5001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))