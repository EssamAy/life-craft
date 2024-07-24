// HeroSection.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {Deck} from "@/models/deck";
import { MaterialIcons } from '@expo/vector-icons';
import {Link, useLocalSearchParams} from "expo-router";
import {useAppSelector} from "@/hooks/state";
import {selectCardsNotStudiedCountByDeckId, selectCardsToReviewCountByDeckId} from "@/store/flashCardsSlice";


interface HeroSectionProps {
    deck: Deck
}
const HeroSection = ({deck}: HeroSectionProps) => {
    const params = useLocalSearchParams()
    const notStudied = useAppSelector(selectCardsNotStudiedCountByDeckId(params.deckId))
    const toReview = useAppSelector(selectCardsToReviewCountByDeckId(params.deckId))
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{deck.name}</Text>
                <Text style={styles.subtitle}>
                    Learning algorithm:
                    General spaced repetition</Text>
            </View>
            <View style={styles.statsContainer}>
                <Text style={styles.title}>Cards for today</Text>
                <View style={styles.stats}>
                    <View style={styles.statItem}>
                        <View style={styles.cardsCountPerType}>
                            <MaterialIcons name="library-add" color="gray" size={32}/>
                            <Text style={{fontWeight: "bold", fontSize: 20}}>{notStudied}</Text>
                        </View>
                        <Text>Not studied</Text>
                    </View>
                    <View style={styles.statItem}>
                        <View style={styles.cardsCountPerType}>
                            <MaterialIcons name="assignment" color="green" size={32}/>
                            <Text style={{fontWeight: "bold", fontSize: 20}}>{toReview}</Text>
                        </View>
                        <Text>To review</Text>
                    </View>
                </View>
                <Link href={"screens/cards/" + deck.id + "/study"} style={styles.studyButton}>Study cards</Link>

            </View>

        </View>

    );
};

const styles = StyleSheet.create({

    container: {
        backgroundColor: '#fff', // Customize your background color
    },
    header: {
        paddingVertical: 20,
        paddingHorizontal: 16,
        marginBottom: 5
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#777',
    },
    statsContainer: {
        margin: 20,
    },
    stats: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#f2f2f2',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20
    },
    statItem: {
        justifyContent: "center",
        alignItems: "center",
    },
    cardsCountPerType: {
        flexDirection: "row",
        marginHorizontal: 40,
        alignItems: "center"
    },
    studyButton: {
        backgroundColor: '#3074ee',
        color: "white",
        textAlign: "center",
        padding:18,
        borderRadius: 10,
        fontWeight: "bold"
    }
});

export default HeroSection;
