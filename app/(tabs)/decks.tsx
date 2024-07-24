import {Animated, Pressable, StyleSheet} from 'react-native';
import React, {useEffect} from "react";
import AddDeck from "@/components/decks/AddDeck";
import TopBar from "@/components/decks/TopBar";
import ListItem from "@/components/decks/ListItem";
import {useAppDispatch, useAppSelector} from "@/hooks/state";
import {fetchDecks, selectDecks, setCreateDeckModalVisible} from "@/store/flashCardsSlice";
import {AntDesign} from '@expo/vector-icons';
import {SafeAreaView} from 'react-native-safe-area-context';
import ScrollView = Animated.ScrollView;


export default function Decks() {

    const dispatch = useAppDispatch()
    const decks = useAppSelector(selectDecks)


    useEffect(() => {
        dispatch(fetchDecks())
    }, []);

    const handleOpenModal = () => {
        dispatch(setCreateDeckModalVisible(true));
    };

    return (
        <SafeAreaView style={styles.container}>
                <TopBar/>
                <ScrollView>
                    {decks.map((deck, index) => (
                        <ListItem key={deck.id} deck={deck}/>
                    ))}
                </ScrollView>
                <AddDeck/>
                <Pressable
                    style={{
                        position: 'absolute',
                        bottom: 10,
                        right: 10,
                        backgroundColor: '#3074ee',
                        height: 56,
                        width: 56,
                        borderRadius: 56,
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                    onPress={handleOpenModal}
                >
                    <AntDesign name="pluscircleo" color="white" size={32}/>
                </Pressable>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
    }
});