import {Stack} from 'expo-router';
import {useEffect} from 'react';
import 'react-native-reanimated';
import auth from "@react-native-firebase/auth";
import {useAppDispatch} from "@/hooks/state";
import {setUser} from "@/store/authSlice";
import {toUser} from "@/models/user";

export default function Routes() {
    const dispatch = useAppDispatch()

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged((newUser) => {
            dispatch(setUser(toUser(newUser)))
        })
        return () => unsubscribe();
    }, []);


    return <Stack>
        <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
        <Stack.Screen name="screens/cards/[deckId]/index" options={{headerShown: false}}/>
        <Stack.Screen name="screens/cards/[deckId]/study" options={{headerShown: false}}/>
        <Stack.Screen name="screens/auth/SignIn" options={{headerShown: false}}/>
        <Stack.Screen name="+not-found"/>
    </Stack>


}
