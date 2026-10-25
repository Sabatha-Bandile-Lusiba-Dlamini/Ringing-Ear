/*
Axios - makes HTTP requests to your API

Automatically parses json
Throws error messages for client (4..) & server (5...)
Sets base URL 
*/
import axios from 'axios'

/* || - in this context, this is a fallback operator

Think of it as a condensed version of an "If else" statement
*/
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

const api = axios.create({
    baseURL: API_URL
})

/* Modifies requests before they are sent to the server 

- Every API call is automatically authenticated
- Ensures every request has standard headers
- Loading spinner animation during API request
- Measures API performance and logs standard request formats for 
debugging

Bearer Token is a security credential

issued after successful login

possession = access (think of it like a concert ticket).
They're the standard way apps connect to OAuth 2.0 webAPIs.
Shit expires quick incase someone steals it.

Stateless: 

Carries all necessary permissions in it that can be 
checked on the spot. No need to query the database to validate
details about the Session ID every time you click a page.

config - request object that allows you to modify headers

follows DRY (Don't Repeat Yourself) principle

*/
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')

    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default api