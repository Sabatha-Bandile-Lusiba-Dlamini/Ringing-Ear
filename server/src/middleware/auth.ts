import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'

interface AuthRequest extends Request{
    user?:{
        id: number
        username: string
    }
}

/* next:NextFunction - allows the use of next() */

const authMiddleware = (req: AuthRequest, res:Response, next:NextFunction): void => {
    
    /* headers - key-value pairs containing metadata and context */
    const authHeader = req.headers.authorization

    if(!authHeader){
        res.status(401).json({error:'No token provided'})
        return
    }

    /*split(' ') - splits the string into an array using the 
    space character as a seperator
    
    [0] - auth type (Bearer) 
    
    [1] - actual token*/

    const token = authHeader.split(' ')[1]

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            id: number
            username: string 
        }
        req.user = decoded
        next()
    
    } catch (err){
        res.status(401).json({error: 'Invalid or expired token'})
    }


}

export default authMiddleware