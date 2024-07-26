import React, {useState} from 'react';
import {
    Button,
    Modal,
    NativeSyntheticEvent,
    StyleSheet,
    Text,
    TextInput,
    TextInputChangeEventData,
    TouchableOpacity,
    View
} from 'react-native';
import * as firestore from '@react-native-firebase/firestore';
import {useLocalSearchParams} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import {useAppDispatch, useAppSelector} from "@/hooks/state";
import {
    createCard,
    selectCardsByDeckId, selectCreateCardBack, selectCreateCardFront,
    selectCreateCardModalVisible,
    setCardsData, setCreateCardModalBack, setCreateCardModalFront,
    setCreateCardModalVisible
} from "@/store/flashCardsSlice";
import {Card} from "@/models/card";


const AddCard = ({deckId}: {deckId: string}) => {
    const dispatch = useAppDispatch()
    const isCreateCardModalVisible = useAppSelector(selectCreateCardModalVisible)

    const front = useAppSelector(selectCreateCardFront)
    const back = useAppSelector(selectCreateCardBack)

    const handleFrontValueChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
        dispatch(setCreateCardModalFront(e.nativeEvent.text || ''))
    }
    const handleBackValueChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
        dispatch(setCreateCardModalBack(e.nativeEvent.text || ''))
    }

    const handleCreateCard = async () => {
        dispatch(createCard(deckId))
    }
    return (

        <Modal animationType="fade" transparent={true} visible={isCreateCardModalVisible}>
            <View style={styles.modalContainer}>
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>New card</Text>
                    <TouchableOpacity onPress={() => dispatch(setCreateCardModalVisible(false))} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color="black"/>
                    </TouchableOpacity>

                </View>


                {/*</View>*/}
                <View style={styles.formContainer}>
                    <Text style={{color: '#333'}}>Front side</Text>
                    <TextInput style={styles.textInput} onChange={handleFrontValueChange} value={front}
                               placeholder="Enter text here"/>
                    <Text style={{color: '#333'}}>Back side</Text>
                    <TextInput style={styles.textInput} onChange={handleBackValueChange} value={back}
                               placeholder="Enter text here"/>
                    <Button
                        title="Create"
                        onPress={handleCreateCard}
                    ></Button>
                </View>


            </View>

        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end', // Align modal to the bottom
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 56,
        backgroundColor: '#fff', // Customize your background color
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    title: {
        fontWeight: 'bold'
    },
    formContainer: {
        padding: 20,
        backgroundColor: "#fff"
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
    },
    closeButton: {
        alignSelf: 'flex-end',
        padding: 10,
    },
});

export default AddCard;
