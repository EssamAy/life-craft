import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Deck} from "@/models/deck";
import {AppThunk, RootState} from "@/store/store";
import {flashCardsApi} from "@/services/flashCardsApi";
import {Card, CardsData} from "@/models/card";
import calculateNextReviewTime from "@/utils/sm2";

interface FlashCardsSliceState {
    settings: {
        cardsPerStudySession: number
    },
    decks: Deck[],
    createDeckModalVisible: boolean,
    cards: Record<string, CardsData>,
    cardsToStudy: Card[],
    currentStudyingCardIndex: number
    currentStudyingCardRevealed: boolean
}

const initialState: FlashCardsSliceState = {
    settings: {
        cardsPerStudySession: 10
    },
    decks: [],
    createDeckModalVisible: false,
    cards: {},
    cardsToStudy: [],
    currentStudyingCardIndex: 0,
    currentStudyingCardRevealed: false
}

export const flashCardsSlice = createSlice({
    name: 'flashCards',
    initialState,
    reducers: {
        setDecks: (state, action: PayloadAction<Deck[]>) => {
            state.decks = action.payload;
        },
        setCreateDeckModalVisible: (state, action: PayloadAction<boolean>) => {
            state.createDeckModalVisible = action.payload;
        },
        setCardsData: (state, action: PayloadAction<{
            deckId: string,
            cardsData: CardsData
        }>) => {
            state.cards[action.payload.deckId] = action.payload.cardsData;
        },
        addCardsToDeck: (state, action: PayloadAction<{
            deckId: string,
            cards: Card[]
        }>) => {
            state.cards[action.payload.deckId].cards.push(...action.payload.cards)
        },
        setCardsToStudy: (state, action: PayloadAction<Card[]>) => {
            state.cardsToStudy = action.payload;
        },
        revealCurrentStudyingCard: (state) => {
            state.currentStudyingCardRevealed = true
        },
        studyNextCard: (state) => {
            state.currentStudyingCardIndex++;
            state.currentStudyingCardRevealed = false
        },
        resetStudying: (state) => {
            state.currentStudyingCardIndex = 0;
            state.currentStudyingCardRevealed = false
        }
    },
});

export const {
    setDecks,
    setCardsData,
    addCardsToDeck,
    setCardsToStudy,
    setCreateDeckModalVisible,
    revealCurrentStudyingCard,
    studyNextCard,
    resetStudying
} = flashCardsSlice.actions;


export const updateCurrentCardAndMoveToTheNext = (rating: 'again'|'hard'|'good'|'easy'): AppThunk =>
    async (dispatch, getState) => {
        const {flashCards} = getState()
        try {
            await flashCardsApi.updateCard(calculateNextReviewTime(flashCards.cardsToStudy[flashCards.currentStudyingCardIndex], rating))
        }catch (err) {
            console.error(err)
        }
        dispatch(studyNextCard())
    }

export const fetchDecks = (): AppThunk =>
    async (dispatch, getState) => {
        const {flashCards} = getState()
        if (flashCards.decks.length === 0) {
            try {
                const allDecks = await flashCardsApi.getAllDecks();
                dispatch(setDecks(allDecks))
            } catch (err) {
                console.error(err)
                dispatch(setDecks([]))
            }
        }
    }

export const fetchCardsByDeckId = (deckId: string): AppThunk =>
    async (dispatch, getState) => {
        const {flashCards} = getState()
        if (!flashCards.cards[deckId] || flashCards.cards[deckId].cards.length === 0) {
            try {
                const cardsData = await flashCardsApi.getAllCardsDataByDeckId(deckId);
                dispatch(setCardsData({
                    deckId,
                    cardsData
                }))
            } catch (err) {
                console.error('Error', err)
            }
        } else {
            try {
                const cards = await flashCardsApi.getCardsPageByDeckId(deckId, flashCards.cards[deckId].cards.length)
                dispatch(addCardsToDeck({
                    deckId,
                    cards
                }))
            }  catch (err) {
                console.error('Error', err)
            }
        }
    }

export const fetchCardsToStudy = (deckId: string): AppThunk =>
    async (dispatch, getState) => {
        const {flashCards} = getState()
        try {
            dispatch(resetStudying())
            const cards = await flashCardsApi.getCardsToStudyByDeckId(deckId, flashCards.settings.cardsPerStudySession);
            dispatch(setCardsToStudy(cards))
        } catch (err) {
            console.error(err)
            dispatch(setCardsToStudy([]))
        }
    }

export const selectDecks = (state: RootState) => state.flashCards.decks
export const selectDeckById = (id: string) => (state: RootState) => state.flashCards.decks.find(deck => deck.id === id)
export const selectCreateDeckModalVisible = (state: RootState) => state.flashCards.createDeckModalVisible
export const selectCards = (state: RootState) => state.flashCards.cards
export const selectCardsDataByDeckId = (deckId: string) => createSelector(selectCards, (cards) => cards[deckId] || {cards:[], toReviewCount: 0, notStudiedCount: 0, totalCount:0})
export const selectCardsByDeckId = (deckId: string) => createSelector(selectCardsDataByDeckId(deckId), (cardsData) => cardsData.cards || [])
export const selectCardsTotalCountByDeckId = (deckId: string) => createSelector(selectCardsDataByDeckId(deckId), (cardsData) => cardsData.totalCount || 0)
export const selectCardsToReviewCountByDeckId = (deckId: string) => createSelector(selectCardsDataByDeckId(deckId), (cardsData) => cardsData.toReviewCount || 0)
export const selectCardsNotStudiedCountByDeckId = (deckId: string) => createSelector(selectCardsDataByDeckId(deckId), (cardsData) => cardsData.notStudiedCount || 0)
export const selectCardsToStudy = (state: RootState) => state.flashCards.cardsToStudy
export const selectCardsToStudyCount = (state: RootState) => state.flashCards.cardsToStudy.length
export const selectCurrentStudyingCardIndex = (state: RootState) => state.flashCards.currentStudyingCardIndex
export const selectCurrentStudyingCardRevealed = (state: RootState) => state.flashCards.currentStudyingCardRevealed
export const selectCurrentStudyingCard = createSelector(selectCardsToStudy, selectCurrentStudyingCardIndex, (cards, index) => {
    if (index >= cards.length) return null;
    return cards[index]
})