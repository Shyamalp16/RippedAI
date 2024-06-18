import { createContext, useContext, useState, useEffect } from "react";
import { getAuth , onAuthStateChanged } from 'firebase/auth';
import { firebase_auth } from "../lib/FirebaseConfig";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const auth = getAuth()
    useEffect(() => {
        onAuthStateChanged(firebase_auth, (user) => {
            // console.log(user)
            setIsLoading(true)
            if(user){
                setIsLoggedIn(true)
                setUser(user)
                const uid = user.uid
                
            }else{
                setIsLoggedIn(false)
                setUser(null)
            }
            setIsLoading(false)
        })
    }, []);
    return (
        <GlobalContext.Provider value={{
            isLoggedIn, setIsLoggedIn, user, setUser, isLoading, setIsLoading
        }}>
            {!isLoading && children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider