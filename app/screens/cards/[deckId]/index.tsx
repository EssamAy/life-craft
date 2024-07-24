import {FlatList, StyleSheet, View} from 'react-native';
import React, {useEffect} from "react";
import TopBar from "@/components/cards/TopBar";
import ListItem from "@/components/cards/ListItem";
import HeroSection from "@/components/cards/Hero";
import {useAppDispatch, useAppSelector} from "@/hooks/state";
import {fetchCardsByDeckId, selectCardsByDeckId, selectDeckById} from "@/store/flashCardsSlice";
import {Link, useLocalSearchParams} from "expo-router";
import {SafeAreaView} from 'react-native-safe-area-context';


export default function Deck() {
    const params = useLocalSearchParams()
    const deck = useAppSelector(selectDeckById(params.deckId))
    const cards = useAppSelector(selectCardsByDeckId(params.deckId))

    const dispatch = useAppDispatch()

    const fetchData = () => {

        dispatch(fetchCardsByDeckId(params.deckId))

    }
    useEffect(() => {
        fetchData()
    }, [params.deckId]);


    if(!deck) {
        return <></>
    }
    return (
        <SafeAreaView style={styles.container}>

                <TopBar/>
                <FlatList
                    ListHeaderComponent={<HeroSection deck={deck} />}
                    data={cards}
                    renderItem={({item}) => <ListItem card={item} />}
                    onEndReached={fetchData}
                    onEndReachedThreshold={0.8}
                />

            <View style={{
                justifyContent: "center",
                flexDirection: "row",
                padding: 5,
                backgroundColor: "transparent",
                bottom: 0,
                width: '100%',
                position: "absolute"
            }}>
                <Link
                    style={styles.addButton}
                    href={"screens/cards/"+params.deckId+"/add"}
                >Add card</Link>
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    addButton: {
        backgroundColor: '#2e2e2e',
        color: "white",
        textAlign: "center",
        paddingHorizontal:30,
        paddingVertical:12,
        maxWidth: 200,
        borderRadius: 10
    }
});
