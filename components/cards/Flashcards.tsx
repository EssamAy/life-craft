import {BackHandler, Modal, Pressable, StyleSheet, Text, View} from "react-native";
import {
    fetchCardsToStudy,
    finishFlashCardsSession,
    revealCurrentStudyingCard,
    selectCardsToStudyCount,
    selectCurrentStudyingCard,
    selectCurrentStudyingCardRevealed,
    updateCurrentCardAndMoveToTheNext
} from "@/store/flashCardsSlice";
import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/state";
import {readableNextReviewActionTime} from "@/utils/time";
import calculateNextReviewTime from "@/utils/sm2";
import LottieView from "lottie-react-native";
import {Colors} from "@/constants/Colors";
import WebView from "react-native-webview";
import {Ionicons} from "@expo/vector-icons";
import {router} from "expo-router";

export default function Flashcards() {
    const dispatch = useAppDispatch();
    const currentStudyingCard = useAppSelector(selectCurrentStudyingCard)
    const isCardRevealed = useAppSelector(selectCurrentStudyingCardRevealed)
    const count = useAppSelector(selectCardsToStudyCount)

    const [glosebeVisible, setGlosbeVisible] = useState(false)
    const [googleTranslateVisible, setGoogleTranslateVisible] = useState(false)


    const handleOnCardPress = () => {
        dispatch(revealCurrentStudyingCard())
    }
    const handleOnActionPress = (rating: 'again'|'hard'|'good'|'easy') => {
        dispatch(updateCurrentCardAndMoveToTheNext(rating))
    }
    useEffect(() => {
        setGlosbeVisible(false)
    }, [currentStudyingCard]);

    const closeTranslationModals = () => {
        setGlosbeVisible(false)
        setGoogleTranslateVisible(false)
        return true
    }

    useEffect(() => {

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            closeTranslationModals,
        );

        return () => backHandler.remove();
    }, []);

    return <View style={styles.container}>
        {
            currentStudyingCard &&

            <View style={styles.cardsContgainer}>
                <Pressable onPress={handleOnCardPress} style={styles.cardContent}>
                    <View style={{padding: 20}}>
                        <Text style={styles.cardText}>{currentStudyingCard.front}</Text>
                        {
                            isCardRevealed &&
                            <>
                                <View style={{borderTopWidth: 2, borderColor: '#e4e4e4'}}>
                                    <Text style={styles.cardText}>{currentStudyingCard.back}</Text>
                                </View>
                                <View style={{flexDirection: "row", gap: 5}}>
                                    <Pressable style={{backgroundColor: Colors.gray, padding: 5, borderRadius: 5}}
                                               onPress={() => setGlosbeVisible(!glosebeVisible)}>
                                        <Text>Glosbe</Text>
                                    </Pressable>
                                    <Pressable style={{backgroundColor: Colors.gray, padding: 5, borderRadius: 5}}
                                               onPress={() => setGoogleTranslateVisible(!googleTranslateVisible)}>
                                        <Text>Google translate</Text>
                                    </Pressable>
                                </View>

                            </>
                        }
                </View>

                </Pressable>
                {isCardRevealed &&
                    <View style={styles.actionsContainer}>
                        <Pressable onPress={() => handleOnActionPress('again')} style={[styles.action, styles.again]}>
                            <Text style={[styles.actionText, styles.againText]}>Again</Text>
                            <Text style={[styles.actionText, styles.againText]}>{readableNextReviewActionTime( calculateNextReviewTime(currentStudyingCard,'again').interval)}</Text>
                        </Pressable>
                        <Pressable onPress={() => handleOnActionPress('hard')} style={[styles.action, styles.hard]}>
                            <Text style={[styles.actionText, styles.hardText]}>Hard</Text>
                            <Text style={[styles.actionText, styles.hardText]}>{readableNextReviewActionTime(calculateNextReviewTime(currentStudyingCard,'hard').interval)}</Text>
                        </Pressable>
                        <Pressable onPress={() => handleOnActionPress('good')} style={[styles.action, styles.good]}>
                            <Text style={[styles.actionText, styles.goodText]}>Good</Text>
                            <Text style={[styles.actionText, styles.goodText]}>{readableNextReviewActionTime(calculateNextReviewTime(currentStudyingCard,'good').interval)}</Text>
                        </Pressable>
                        <Pressable onPress={() => handleOnActionPress('easy')} style={[styles.action, styles.easy]}>
                            <Text style={[styles.actionText, styles.easyText]}>Easy</Text>
                            <Text style={[styles.actionText, styles.easyText]}>{readableNextReviewActionTime(calculateNextReviewTime(currentStudyingCard,'easy').interval)}</Text>
                        </Pressable>
                    </View>
                }
                {!isCardRevealed &&
                    <Text style={styles.note}>Tap on the card to show answer</Text>
                }
            </View>


        }
        {
            !currentStudyingCard && count > 0 &&
            <View style={{
                flex: 1,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#fff'
            }}>

                <LottieView
                    source={require('../../assets/confetti.json')}
                    autoPlay
                    loop
                    style={styles.animation}
                />
                <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 5}}>Amazing, you've
                    reviewed all cards for now!</Text>
                <Text style={{color: '#d1d0d0', fontWeight: 'bold'}}>New cards will appear soon</Text>
            </View>
        }
        <Modal visible={glosebeVisible || googleTranslateVisible} animationType="fade" onRequestClose={() => () => {setGlosbeVisible(false); setGoogleTranslateVisible(false)}}>
            <View style={{flex: 1}}>
                <View style={{
                    flexDirection: "row", justifyContent: "space-between",
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    height: 56,
                    backgroundColor: '#fff',
                    borderBottomWidth: 1,
                    borderBottomColor: '#ddd'
                }}>
                    <Text style={{fontWeight: "bold"}}>{currentStudyingCard?.front}</Text>
                    <Ionicons onPress={() => {setGlosbeVisible(false); setGoogleTranslateVisible(false)}} name="close" size={24} color="black"/>
                </View>
                {
                    glosebeVisible &&
                    <WebView
                        scrollEnabled={true}
                        source={{uri: 'https://glosbe.com/it/ar/' + currentStudyingCard?.front}}
                    />
                }

                {googleTranslateVisible &&
                    <WebView
                        scrollEnabled={true}
                        source={{uri: 'https://translate.google.com/?sl=it&tl=ar&text='+ currentStudyingCard?.front +'&op=translate'}}
                    />
                }

            </View>

        </Modal>
    </View>


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cardsContgainer: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    animation: {
        width: 250,
        height: 250
    },
    cardContent: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        // padding: 20,
        borderRadius: 20,
        backgroundColor: "#fff",
    },
    cardText: {
        fontSize: 30,
        paddingVertical: 20,
        textAlign: "center",
    },
    note: {
        padding: 20,
        fontWeight: 'bold',
        textAlign: "center",
        marginVertical: 10,
    },
    actionsContainer: {
        flexDirection: "row",
        marginVertical: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        gap: 5
    },
    action: {
        flex: 1,
        padding: 5,
        borderRadius: 5
    },
    actionText: {
        textAlign: 'center',
        fontWeight: 'bold'
    },
    again: {
        backgroundColor: '#fff0f5',
    },
    againText: {
        color: '#ff4160'
    },
    hard: {
        backgroundColor: '#fffbe5',
    },
    hardText: {
        color: '#d8a23e'
    },
    good: {
        backgroundColor: '#f7feee',
    },
    goodText: {
        color: '#93df6a'
    },
    easy: {
        backgroundColor: '#ebf8fe',
    },
    easyText: {
        color: '#289adb'
    }
});