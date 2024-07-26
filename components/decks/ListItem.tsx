import {StyleSheet, Text, View} from "react-native";
import React, {useEffect} from "react";
import {Deck} from "@/models/deck";
import {Link} from "expo-router";
import {useAppDispatch, useAppSelector} from "@/hooks/state";
import {fetchReadyToStudyCountByDeckId, selectCardsToStudyCountByDeckId} from "@/store/flashCardsSlice";
import {Colors} from "@/constants/Colors";

interface ListItemProps {
    deck: Deck
}
export default function ListItem({deck}: Readonly<ListItemProps>) {

    const dispatch = useAppDispatch()
    const readyToStudyCount = useAppSelector(selectCardsToStudyCountByDeckId(deck.id))

    useEffect(() => {
        dispatch(fetchReadyToStudyCountByDeckId(deck.id))
    }, [deck]);

    return <Link href={"screens/cards/" + deck.id} style={styles.deckListItem}>
        <View >
            <Text style={{fontWeight: 'bold'}}>{deck.name}</Text>
            {
                readyToStudyCount > 0 && <Text style={{color: Colors.darkGray}}>Ready to study: {readyToStudyCount}</Text>
            }
            {
                readyToStudyCount <= 0 && <Text style={{color: Colors.success}}>Completed for now</Text>
            }
        </View>
    </Link>

}

const styles = StyleSheet.create({
    deckListItem: {
        backgroundColor: '#fff',
        padding: 15,
        borderBottomWidth: 1,
        borderColor: '#f2f2f2',
    }
});