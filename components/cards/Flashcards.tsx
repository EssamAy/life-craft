import {Pressable, StyleSheet, Text, View} from "react-native";
import {
    finishFlashCardsSession,
    revealCurrentStudyingCard,
    selectCurrentStudyingCard,
    selectCurrentStudyingCardRevealed,
    updateCurrentCardAndMoveToTheNext
} from "@/store/flashCardsSlice";
import React from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/state";
import {readableNextReviewActionTime} from "@/utils/time";
import calculateNextReviewTime from "@/utils/sm2";

export default function Flashcards() {
    const dispatch = useAppDispatch();
    const currentStudyingCard = useAppSelector(selectCurrentStudyingCard)
    const isCardRevealed = useAppSelector(selectCurrentStudyingCardRevealed)

    const handleOnCardPress = () => {
        dispatch(revealCurrentStudyingCard())
    }
    const handleOnActionPress = (rating: 'again'|'hard'|'good'|'easy') => {
        dispatch(updateCurrentCardAndMoveToTheNext(rating))
    }

    return <View style={styles.container}>
        {
            currentStudyingCard &&
            <><Pressable onPress={handleOnCardPress} style={styles.cardContent}>
                <View>
                    <Text style={styles.cardText}>{currentStudyingCard.front}</Text>
                    {
                        isCardRevealed && <View style={{borderTopWidth: 2, borderColor: '#e4e4e4'}}><Text
                            style={styles.cardText}>{currentStudyingCard.back}</Text></View>
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
            </>


        }
        {
            !currentStudyingCard &&
            <View>
                <Text>Congrats</Text>
                {/*<LottieView*/}
                {/*    source={require('../../assets/confetti.json')}*/}
                {/*    autoPlay*/}
                {/*    loop*/}
                {/*    style={styles.animation}*/}
                {/*/>*/}
            </View>
        }

    </View>


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    animation: {
        width: 200,
        height: 200,
    },
    cardContent: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        padding: 20,
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