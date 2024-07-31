import {BackHandler, Pressable, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import React, {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/state";
import { getAuth } from "firebase/auth";
import {
    fetchCardsToStudy,
    finishFlashCardsSession,
    selectCardsToStudyCount,
    selectCurrentStudyingCardIndex
} from "@/store/flashCardsSlice";
import {router, useLocalSearchParams} from "expo-router";
import Flashcards from "@/components/cards/Flashcards";
import {SafeAreaView} from 'react-native-safe-area-context';


export default function Study() {
    const params = useLocalSearchParams()
    const dispatch = useAppDispatch();
    const index = useAppSelector(selectCurrentStudyingCardIndex)
    const count = useAppSelector(selectCardsToStudyCount)

    const finishSession = () => {
        dispatch(finishFlashCardsSession(params.deckId))
        router.replace(`/screens/cards/${params.deckId}`)
        return true
    }

    useEffect(() => {
        dispatch(fetchCardsToStudy(params.deckId))

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            finishSession,
        );

        return () => backHandler.remove();
    }, [params.deckId]);
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={finishSession} style={styles.buttonLeft}>
                    <Ionicons name="close" size={24} color="black"/>
                </Pressable>
                {
                    index < count && <Text style={{
                        backgroundColor: '#f2f2f2',
                        paddingHorizontal: 5,
                        paddingVertical: 2,
                        borderRadius: 5
                    }}>{index + 1}/{count}</Text>
                }

                <TouchableOpacity style={styles.buttonRight}>
                    <Ionicons name="ellipsis-vertical" size={24} color="black"/>
                </TouchableOpacity>
            </View>

            <Flashcards></Flashcards>

        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 56,
        backgroundColor: '#fff', // Customize your background color
        borderBottomWidth: 1,
        borderBottomColor: '#ddd'
    },

    buttonLeft: {
        padding: 4,
    },
    buttonRight: {
        padding: 4,
    },
});
