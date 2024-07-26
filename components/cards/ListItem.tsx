import {StyleSheet, Text, View} from "react-native";
import React from "react";
import {Card} from "@/models/card";
import {Colors} from "@/constants/Colors";
import ReviewTime from "@/components/cards/ReviewTime";

export interface ListItemProps {
    card:  Card
}
const ListItem = ({ card }: ListItemProps) => {
    return (
        <View style={styles.flashcard}>
            <ReviewTime card={card}></ReviewTime>
            <Text>{card.front}</Text>
            <Text style={{color: Colors.darkGray, fontSize: 12}}>{card.back}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    flashcard: {
        backgroundColor: '#fff',
        padding: 10,
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 10,
        fontSize: 20
    }
});

export default ListItem