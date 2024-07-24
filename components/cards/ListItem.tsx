import {StyleSheet, Text, View} from "react-native";
import React from "react";
import {Card} from "@/models/card";
import {readableCardAvailabilityTime, readableNextReviewActionTime} from "@/utils/time";

export interface ListItemProps {
    card:  Card
}
const ListItem = ({ card }: ListItemProps) => {
    // console.log(card.front, card.nextReview)
    return (
        <View style={styles.flashcard}>
            {
                card.nextReview > 0 &&
                <Text>{readableCardAvailabilityTime(card.nextReview)}</Text>
            }
            <Text style={{fontWeight: "bold"}}>{card.front}</Text>
            <Text>{card.back}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    flashcard: {
        backgroundColor: '#fff',
        padding: 10,
        margin: 5,
        borderRadius: 10,
        fontSize: 20
    }
});

export default ListItem