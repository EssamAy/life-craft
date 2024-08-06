import {StyleSheet, Text, View} from 'react-native';
import React from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {router} from "expo-router";
import {useAppSelector} from "@/hooks/state";
import {selectAuthChecked, selectUser} from "@/store/authSlice";

export default function DashboardScreen() {
    const user = useAppSelector(selectUser)
    const authChecked = useAppSelector(selectAuthChecked)
    if (authChecked && !user) {
        router.navigate(`/screens/auth/SignIn`);
    }
    return (
        <SafeAreaView style={styles.container}>
            <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 5}}>Flashcards</Text>
            <View style={{
                backgroundColor: '#fff',
                padding: 10,
                borderRadius: 10
            }}>
                <Text>Total cards</Text>
                <Text>15</Text>
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5
    },
});
