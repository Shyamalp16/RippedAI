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
        onbDone: null
    })

    return(
        <OnboardingContext.Provider value = {{state, setState}}>
            {children}
        </OnboardingContext.Provider>
    )
};

export const setItem = async (key, value) => {
    try{
        await AsyncStorage.setItem(key, value);
        console.log("Value Stored!!")
    }catch(error){
        console.log("Error Stroing Value", error)
    }
}


export const getItem = async (key) => {
    try{
        const value = await AsyncStorage.getItem(key);
        console.log(value)
        return value;
    }catch(error){
        console.log("Error Getting value", error)
    }
}

export const removeItem = async (key) => {
    try{
        await AsyncStorage.removeItem(key);
    }catch(error){
        console.log("Error Removing value", error)
    }
}



