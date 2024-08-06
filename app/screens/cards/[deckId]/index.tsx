import {FlatList, Pressable, StyleSheet, View} from 'react-native';
import React, {useEffect} from "react";
import TopBar from "@/components/cards/TopBar";
import ListItem from "@/components/cards/ListItem";
import HeroSection from "@/components/cards/Hero";
import {useAppDispatch, useAppSelector} from "@/hooks/state";
import {
    fetchCardsByDeckId,
    selectCardsByDeckId,
    selectDeckById,
    setCreateCardModalVisible
} from "@/store/flashCardsSlice";
import {router, useLocalSearchParams} from "expo-router";
import {SafeAreaView} from 'react-native-safe-area-context';
import {AntDesign} from "@expo/vector-icons";
import {Colors} from "@/constants/Colors";
import AddCard from "@/components/cards/AddCard";
import {selectUser} from "@/store/authSlice";


export default function Deck() {
    const params = useLocalSearchParams()
    const deck = useAppSelector(selectDeckById(params.deckId))
    const cards = useAppSelector(selectCardsByDeckId(params.deckId))
    const user = useAppSelector(selectUser)

    if (!user) {
        router.navigate(`/screens/auth/SignIn`);
    }

    const dispatch = useAppDispatch()

    const fetchData = (paginate: boolean = true) => {

        dispatch(fetchCardsByDeckId(params.deckId, paginate))

    }
    useEffect(() => {
        fetchData(false)
    }, [params.deckId, dispatch]);


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
                    onEndReached={() => fetchData(true)}
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
                <AddCard deckId={params.deckId}></AddCard>
                <Pressable
                    style={{
                        position: 'absolute',
                        bottom: 10,
                        right: 10,
                        backgroundColor: Colors.primary,
                        height: 56,
                        width: 56,
                        borderRadius: 56,
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                    onPress={() => dispatch(setCreateCardModalVisible(true))}
                >
                    <AntDesign name="pluscircleo" color="white" size={32}/>
                </Pressable>
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
