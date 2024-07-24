import {Pressable, StyleSheet, Text, View} from "react-native";
import React from "react";
import {Deck} from "@/models/deck";
import {Link} from "expo-router";
import {readableNextReviewActionTime} from "@/utils/time";

interface ListItemProps {
    deck: Deck
}
export default function ListItem({deck}: Readonly<ListItemProps>) {
    return <Link href={"screens/cards/" + deck.id} style={styles.deckListItem}>
        <View >
            <Text>{deck.name}</Text>
            <Text>Cards for today: 7</Text>
        </View>
    </Link>

}

const styles = StyleSheet.create({
    deckListItem: {
        backgroundColor: '#fff',
        padding: 20,
        margin: 5,
        borderRadius: 5,
        fontSize: 20
    }
});