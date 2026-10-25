import {createContext, useState, useContext, useEffect} from 'react'
import type {ReactNode} from 'react'
import type {User} from '../types'

/* | - union operator (acts as an "or" in this context)
For example, the variable named user could hold the User object
OR be null (no user exists yet or user logged out) 

=> void function executes an action, but doesn't return any values

*/

interface AuthContextType {
    user: User | null
    token: string | null
    login: (userData:User, tokenData:string) => void
    logout: () => void
    loading: boolean
}

/* 

Shares authentication state across the whole component folder
without prop drilling (manually passing data through multiple
nested components)

createContext creates a data broadcasting channel that lets any component 
inside a <Provider> instantly grab data using useContext. Instead of 
passing props down manually step-by-step, the component looks up its family 
tree and reads the value from the nearest matching <Provider> above it.

<> - generic parameter

<AuthContextType | null> - can only ever be two things...
An object matching AuthContextType's structure or nothing.

TypeScript needs to know what type of value the context 
will hold at the point of creation.

(null) - initial default state
*/

const AuthContext = createContext<AuthContextType | null> (null)

/*
export - can be imported as "import {AuthProvider} from './AuthContext"

function AuthProvider - starts with capital letters and returns UI components,
which makes it a Functional Component

{children} - extracts children property directly out of the 
incoming object (JavaScript Destructuring)

The above code is cleaner than "function AuthProvider(props)" and 
referencing it as "props.children" (No destructring)

{children: ReactNode} - the key "children" expects the value "react node"
This is a TypeScript Type Annotation
The incoming object must have a property named "children" and its
data type must be a react node

React Node - reps anything React can render (strings, numbers,
JSX elements, null/undefined, arrays, etc.)
This is a highly flexible data type

*/

export function AuthProvider({children}:{children: ReactNode}){

    /* 
    Array Destructuring - unpack values from an array and assign them
    to distinct variables in a single line

    user - current state value, setUser - updated value 
    
    useState - A React hook that allows functional components to
    maintain local state. It returns a stateful value (user) and a 
    function to update it (setUser). "Hook" means it accesses 
    React state and lifecycle features without writing a class component.

    state - data that remembers its value between renders (e.g. form input)

    stateful value - data stored in a component that can 
    change over time and triggers a re-render to the UI when it's 
    updated. Changing this value tells React to update the DOM
    so the user sees changes immediately.
    
    Basically, every keystroke updates formData via handlechange.
    Without it, input values reset on every re-render. Think of it 
    as short term memory.

    Setter Function: The second element returned by the useState array 
    destructuring (conventionally named setSomething). When invoked with
    a new value, it schedules a re-render of the component with the 
    updated state.

    <User | null>: A TypeScript union type (|) passed as a 
    generic parameter (<>)


    */

    const [user, setUser] = useState <User | null>(null)
    const [token, setToken] = useState<string| null>(null)
    const [loading, setLoading] = useState(true)

    /* Fetches data from the API, sets up timer, and
    Manipulates DOM (Document Object Model) 
    
    JS -> DOM -> HTML

    In this case, it's fetching the token and user 
    when the component first pops up on screen

    [] -> Dependency Array - Runs useEffect once when the 
     page first loads (prevents infinite loop)

     localStorage.getItem - makes sure the user stays 
     logged in after a successful initial login by fetching 
     their token

     Storing the user object means the app can instantly 
     restore both the token for API authen. and the user 
     data for UI display in one go, with zero extra work
    
    */

    useEffect(() =>{
        const savedToken = localStorage.getItem('token')
        const savedUser = localStorage.getItem('user')

        if (savedToken && savedUser){
            setToken(savedToken)
            setUser(JSON.parse(savedUser))
        }
 
        setLoading(false)
    },[])

    const login = (userData: User, tokenData: string) =>{
        setUser(userData)
        setToken(tokenData)
        localStorage.setItem('token', tokenData)
        localStorage.setItem('user', JSON.stringify(userData))
    }

    const logout = () =>{
        setUser(null)
        setToken(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    return (
    
        /*

        broadcasts auth data to every component nested inside it
        
        every context object in React (via createContext)
         comes with a built-in .Provider component

         value - required prop on React Context Provider
         (dictates exactly what's being broadcasted)

         children - renders whatever is in AuthProvider 
         (injects your actual website layout: 
        router, navigation bar, sidebars, and pages)

     outer braces { } tell React, 
     "Hey, I am writing JavaScript inside this JSX."
      The inner braces { } create a literal JavaScript object.

        */
        <AuthContext.Provider value={{user, token, login, logout, loading}}>
            
            {children} 
        </AuthContext.Provider>
    )
}
/*
Custom React hook made to safely accept AuthContext without 
manually checking for undefined values every time it's used.

*/
export function useAuth(): AuthContextType{
    
    const context = useContext(AuthContext)
    if(!context) throw new Error('useAuth must be used within AuthProvider')
   return context     
}

/*
e.g. main.tsx

<AuthProvider>
<App/>
</AuthProvider>

AuthProvider -> Provider
App, LoginForm, SessionList etc. -> Components 
User, token, login, logout, loading -> accessed by calling useAuth()
No <AuthProvider> -> null is returned and the error is thrown

*/