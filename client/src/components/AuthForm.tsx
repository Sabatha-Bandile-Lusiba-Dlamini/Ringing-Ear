import {useState} from 'react' //accesses, tracks and updates data
import api from '../services/api'
import {useAuth} from '../context/AuthContext'

/* 

These are the only two states of authentication being explicitly defined

interface only defines object structures
type reps any data type including primitives, unions and tuples

primitive - data that is not an object and has no methods
(string, number, null, boolean, undefined etc.)

tuple - immutable collection of related heterogeneous data

e.g. ("Alice", 28, "Engineer", True)

*/


type AuthMode = 'login'|'register'

interface FormData {
    username: string
    email: string
    password: string
}

function AuthForm(){
    //destructuring assignement - pulls 'login' out of 'useAuth'
    const {login} = useAuth()
    const [mode, setMode] = useState<AuthMode>('login')
    const [formData, setFormData] = useState<FormData>({
        username: '',
        email: '',
        password:''
    })

    const [error, setError] = useState<string| null>(null)
    const [loading, setLoading] = useState(false)

   //React.ChangeEvent<HTMLInputElement> - generic type for form change events
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>{

        /*... lets you update one field without affecting the other 
        ones. 
        
        [e.target.name] - square brackets make it a dynamic key.
        Instead of hardcoding which field to update, it reads
        the name attribute of whatever input triggered the change.
        That's why this one function works for all six inputs. */
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    //e - event object passed into event handler function
    // React.FormEvent - type for generic submission
    const handleSubmit = async (e: React.FormEvent) =>{
        e.preventDefault()//blocks default page reload
        setLoading(true)
        setError(null)
    

    try{
        if(mode ==='register'){
        try {
        await api.post('/api/auth/register', formData)
      } catch (err: any) {
        setError('Registration failed. Email may already exist.')
        setLoading(false)
        return
      }
    }

        const response = await api.post('/api/auth/login',{
            email: formData.email,
            password: formData.password
        })

        login(response.data.user, response.data.token)

        /*catch-block's error type is unknown by default 
        under TS strict mode. The object stucture of the 
        error is unpredictable. Could be just a string message,
        could be just an error code, could be both as one object.

        any: means that TS stops checking entirely,*/
    } catch (err:any){
        setError('Invalid email or password')

      /*always runs, regardless of failure or success.

      return, throw, break or continue inside this block 
      will override matching statements in try/catch. So don't 
      use those here

      try catch blocks operate on synchronous timelines,
      asynchronous tasks are handed off to the browser or Node.js
      runtime and executed laater
      
      
      */
    } finally { 
        setLoading(false)
    }
}
    const toggleMode = () => {
        /* ternary operator expression
        if mode is equal to login, the expression evaluates to register,
        if mode is anything else, it evaluates to login */
        setMode(mode === 'login' ? 'register': 'login')
        setError(null)
    }

  return (
  <div style={{
    display: 'flex',
    minHeight: '100vh',
    margin: '-2rem -1rem',
  }}>
    {/* Left side — screenshot preview */}
    <div style={{
      flex: '0 0 55%',
      background: '#0f0f0f',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '3rem',
      borderRight: '1px solid #1a1a1a',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{
          color: '#ff4d4d',
          fontSize: '2.5rem',
          letterSpacing: '3px',
          marginBottom: '0.75rem'
        }}>
          Ringing Ear 
        </h1>
        <p style={{
          color: '#888888',
          fontSize: '0.95rem',
          lineHeight: '1.7',
          maxWidth: '380px'
        }}>
          Discover, rate, and review underground artists.
        </p>
      </div>

      <img
        src="/Ringing Ear.png"
        alt="Ringing Ear preview"
        style={{
          width: '100%',
          maxWidth: '480px',
          borderRadius: '12px',
          border: '1px solid #222222',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
        }}
      />

      {/* Fade at bottom */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '120px',
        background: 'linear-gradient(transparent, #0f0f0f)',
        pointerEvents: 'none'
      }} />
    </div>

    {/* Right side — auth form */}
    <div style={{
      flex: '0 0 45%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '3rem',
      background: '#080808'
    }}>
      <div style={{ width: '100%', maxWidth: '360px' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.3rem' }}>
          {mode === 'login' ? 'Welcome back' : 'Create an account'}
        </h2>

        {error && (
          <p style={{
            color: '#ff4444',
            marginBottom: '1rem',
            fontSize: '0.9rem',
            background: '#ff44441a',
            padding: '0.75rem',
            borderRadius: '6px'
          }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {mode === 'register' && (
            <input
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          )}
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
          </button>
          <p
            onClick={toggleMode}
            style={{
              color: '#ff4d4d',
              cursor: 'pointer',
              fontSize: '0.85rem',
              textAlign: 'center',
              marginTop: '0.5rem'
            }}
          >
            {mode === 'login'
              ? "Don't have an account? Register"
              : 'Already have an account? Login'}
          </p>
        </form>
      </div>
    </div>
  </div>
)
}

export default AuthForm