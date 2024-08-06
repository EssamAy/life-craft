import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import React from "react";
import auth from "@react-native-firebase/auth";
import {router} from "expo-router";
import {useAppSelector} from "@/hooks/state";
import {selectUser} from "@/store/authSlice";

export default function Profilecreen() {

    const user = useAppSelector(selectUser)

    const signOut = async () => {
        await auth().signOut()
    }
    if (!user) {
        router.navigate(`/screens/auth/SignIn`);
    }
    return (
        <SafeAreaView style={styles.container}>

            <View style={{
                backgroundColor: '#fff',
                borderRadius: 10,
                padding: 10,
                justifyContent: "space-between",
                flexDirection: 'row',
                alignItems: "center"
            }}>
                <View>
                    <Text style={{fontWeight: 'bold', fontSize: 16}}>{user?.displayName}</Text>
                    <Text>{user?.email}</Text>
                </View>
                {
                    user?.photoURL && user?.photoURL?.length && <Image style={{
                    width: 50, height: 50, borderRadius: 50
                }} source={{
                    uri: user?.photoURL
                }}/>
                }

            </View>

            <Pressable onPress={signOut}>

                <Text>Logout</Text>
            </Pressable>

        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "space-between"
    },
});