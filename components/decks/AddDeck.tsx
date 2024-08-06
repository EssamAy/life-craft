import React from 'react';
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
import {Ionicons} from "@expo/vector-icons";
import {useAppDispatch, useAppSelector} from "@/hooks/state";
import {
    createDeck,
    selectCreateDeckModalVisible,
    selectCreateDeckName,
    setCreateDeckModalVisible,
    setCreateDeckName
} from "@/store/flashCardsSlice";
import {useTranslation} from "react-i18next";


const AddDeck = () => {
    const {t} = useTranslation();

    const dispatch = useAppDispatch()
    const name = useAppSelector(selectCreateDeckName)

    const isCreateDeckModalVisible = useAppSelector(selectCreateDeckModalVisible);

    const onChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
        dispatch(setCreateDeckName(e.nativeEvent.text || ''))
    }

    const closeModal = () => {
        dispatch(setCreateDeckModalVisible(false));
    }
    const handleCreateDeck = async () => {
        dispatch(createDeck())
    }
    return (
        <Modal animationType="fade" transparent={true} visible={isCreateDeckModalVisible}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>{t('flashcards.decks.newDeck')}</Text>
                        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="black"/>
                        </TouchableOpacity>

                    </View>
                    <View style={styles.formContainer}>
                        <Text style={styles.description}>
                            <Text style={{fontWeight: 'bold'}}>Create your own deck.</Text>
                            <Text style={{color: '#333'}}> you get the best results from the cards you create yourself</Text>
                        </Text>

                        <TextInput style={styles.textInput} onChange={onChange} value={name} placeholder="Deck name"/>
                        <Button
                            title="Create new deck"
                            onPress={handleCreateDeck}
                        ></Button>
                    </View>

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
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,

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
    },
    description: {
        marginBottom: 10,
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

export default AddDeck;
