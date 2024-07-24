// HalfScreenModal.js
import React, {useState} from 'react';
import {
    NativeSyntheticEvent,
    StyleSheet,
    Text,
    TextInput,
    TextInputChangeEventData,
    TouchableOpacity,
    View
} from 'react-native';
import * as firestore from '@react-native-firebase/firestore';
import {Link, useLocalSearchParams} from "expo-router";
import {MaterialIcons} from "@expo/vector-icons";
import {useAppDispatch, useAppSelector} from "@/hooks/state";
import {selectCardsByDeckId, setCardsData} from "@/store/flashCardsSlice";
import {Card} from "@/models/card";
import { SafeAreaView } from 'react-native-safe-area-context';


export interface AddDeckProps {
    visible: boolean,
    onClose: () => void,
    onDeckCreated?: () => void,
}

const AddCard = () => {
    const params = useLocalSearchParams()

    const cards = useAppSelector(selectCardsByDeckId(params.deckId))

    const dispatch = useAppDispatch()

    const [front, setFront] = useState('')
    const [back, setBack] = useState('')

    const handleFrontValueChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
        setFront(e.nativeEvent.text || '')
    }
    const handleBackValueChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
        setBack(e.nativeEvent.text || '')
    }

    const handleCreateCard = async () => {
        try {

            const card: Card = {
                front: front,
                back: back,
                deckId: params.deckId,
                reverse: true,
                lastReviewPeriod: 0,
                nextReview: 0
            }
            // TODO: use Thunk
            const result = await firestore.getFirestore().collection<Card>('cards').add(card)
            setFront('')
            setBack('')
            dispatch(setCardsData({
                deckId: card.deckId,
                cards: [
                    ...cards,
                    {
                        ...card,
                        id: result.id
                    }
                ]
            }))
        } catch (error) {
            console.error('Error adding card:', error);
        }
    }
    return (

        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Link href={`screens/cards/${params.deckId}`} style={styles.buttonLeft}>
                    <MaterialIcons name="arrow-back" size={24} color="black"/>
                </Link>


                <TouchableOpacity onPress={handleCreateCard} style={styles.buttonRight}>
                    <MaterialIcons name="check" size={24} color="white"/>
                </TouchableOpacity>


            </View>
            <View style={styles.formContainer}>
                <Text style={{color: '#333'}}>Front side</Text>
                <TextInput style={styles.textInput} onChange={handleFrontValueChange} value={front}
                           placeholder="Enter text here"/>
                <Text style={{color: '#333'}}>Back side</Text>
                <TextInput style={styles.textInput} onChange={handleBackValueChange} value={back}
                           placeholder="Enter text here"/>
            </View>

        </SafeAreaView>
    );
};

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
    formContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff"
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
    },
    buttonLeft: {
        padding: 4,
    },
    buttonRight: {
        padding: 4,
        backgroundColor: '#3074ee',
        borderRadius: 5,
        paddingHorizontal: 16
    },
});

export default AddCard;
