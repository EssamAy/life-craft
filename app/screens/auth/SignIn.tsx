import {Pressable, StyleSheet, Text} from "react-native";
import {Colors} from "@/constants/Colors";
import React from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import auth from '@react-native-firebase/auth';
import {router} from "expo-router";
import {useAppSelector} from "@/hooks/state";
import {selectAuthChecked, selectUser} from "@/store/authSlice";

export default function SignIn() {
    GoogleSignin.configure({
        webClientId: '596944786720-4mlb6jjdm1i1a28v1ua6sjk6ni0d7iav.apps.googleusercontent.com',
    });

    const user = useAppSelector(selectUser)
    const authChecked = useAppSelector(selectAuthChecked)

    if (authChecked && user) {
        router.navigate(`/`);
    }

    const signIn = async () => {
        try {
            const {idToken} = await GoogleSignin.signIn();

            const credentials = auth.GoogleAuthProvider.credential(idToken)
            auth().signInWithCredential(credentials).then(() => {
                router.navigate('/')
            });
        } catch (err) {
            console.error(err)
        }

    }
    return <SafeAreaView style={styles.container}>
        <Pressable style={{backgroundColor: Colors.primary, padding: 10, borderRadius: 10}} onPress={signIn}>
            <Text style={{color: "#fff", fontSize: 18}}>Login with Google</Text>
        </Pressable>
    </SafeAreaView>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
});