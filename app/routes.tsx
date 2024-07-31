import {Stack} from 'expo-router';
import {useEffect} from 'react';
import 'react-native-reanimated';
import auth from "@react-native-firebase/auth";
import {useAppDispatch, useAppSelector} from "@/hooks/state";
import {selectUser, setUser} from "@/store/authSlice";
import {toUser} from "@/models/user";

export default function Routes() {
    const dispatch = useAppDispatch()
    const user = useAppSelector(selectUser)



    useEffect(() => {
         const unsubscribe = auth().onAuthStateChanged((user) => {
                dispatch(setUser(toUser(user)))
            })
            return () => unsubscribe();
    }, []);



    if (user) {
        return <Stack>
            <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
            <Stack.Screen name="screens/auth/SignIn" options={{headerShown: false}}/>
            <Stack.Screen name="screens/cards/[deckId]/index" options={{headerShown: false}}/>
            <Stack.Screen name="screens/cards/[deckId]/study" options={{headerShown: false}}/>
            <Stack.Screen name="+not-found"/>
        </Stack>
    }
    return <Stack>
        <Stack.Screen name="screens/auth/SignIn" options={{headerShown: false}}/>
    </Stack>


}
