import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';


export const OnboardingContext = createContext({});

export const AppProvider = ({children}) => {
    const [state, setState] = useState({
        fullName: '',
        gender: null,
        height: null,
        weight: null,
        age: null,
        goals: [],
        other: '',
        onbDone: false
    })

    useEffect(() => {
        const loadOnboardingState = async() => {
            try{
                const storedState = await AsyncStorage.getItem('onboardingState')
                if(storedState){
                    setState({...state, onbDone: JSON.parse(storedState)})
                }
            }catch(error){
                console.error("Failed To load", error)
            }
        }
        loadOnboardingState();
    }, [])

    useEffect(() => {
        const saveOnboardingState = async() => {
            try{
                await AsyncStorage.setItem('onboardingState', JSON.stringify(state.onbDone))
            }catch(error){
                console.error("Failed to save onboarding state", error)
            }
        }
        saveOnboardingState()
    },[state])

    return(
        <OnboardingContext.Provider value = {{state, setState}}>
            {children}
        </OnboardingContext.Provider>
    )
};


