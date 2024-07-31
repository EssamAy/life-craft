import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Deck} from "@/models/deck";
import {AppThunk, RootState} from "@/store/store";
import {flashCardsApi} from "@/services/flashCardsApi";
import {Card, CardsData, responseToCard} from "@/models/card";
import calculateNextReviewTime from "@/utils/sm2";

interface FlashCardsSliceState {
    settings: {
        // cardsPerStudySession: number
    },
    decks: Deck[],
    createDeckModal: {
        visible: boolean,
        name: string
    }
    cards: Record<string, CardsData>,
    createCardModal: {
        visible: boolean,
        front: string,
        back: string,
        reverse: boolean,
    }
    cardsToStudy: Card[],
    currentStudyingCardIndex: number
    currentStudyingCardRevealed: boolean
}

const initialState: FlashCardsSliceState = {
    settings: {
        // cardsPerStudySession: 10
    },
    decks: [],
    createDeckModal: {
        visible: false,
        name: ''
    },
    cards: {},
    cardsToStudy: [],
    createCardModal: {
        visible: false,
        front: '',
        back: '',
        reverse: false,
    },
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
        setReadyToStudyCount: (state, action: PayloadAction<{
            deckId: string,
            readyToStudyCount: number
        }>) => {
            state.cards[action.payload.deckId] = {
                ...state.cards[action.payload.deckId],
                readyToStudyCount: action.payload.readyToStudyCount
            };
        },
        setCreateDeckModalVisible: (state, action: PayloadAction<boolean>) => {
            state.createDeckModal.visible = action.payload;
        },
        setCreateDeckName: (state, action: PayloadAction<string>) => {
            state.createDeckModal.name = action.payload;
        },
        setCardsData: (state, action: PayloadAction<{
            deckId: string,
            cardsData: CardsData
        }>) => {
            state.cards[action.payload.deckId] = {
                ...state.cards[action.payload.deckId],
                ...action.payload.cardsData
            };
        },
        setCreateCardModalVisible: (state, action: PayloadAction<boolean>) => {
            state.createCardModal.visible = action.payload;
        },
        setCreateCardModalFront: (state, action: PayloadAction<string>) => {
            state.createCardModal.front = action.payload;
        },
        setCreateCardModalBack: (state, action: PayloadAction<string>) => {
            state.createCardModal.back = action.payload;
        },
        setCreateCardModalReverse: (state, action: PayloadAction<boolean>) => {
            state.createCardModal.reverse = action.payload;
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
    setReadyToStudyCount,
    setCardsData,
    addCardsToDeck,
    setCreateCardModalVisible,
    setCreateCardModalFront,
    setCreateCardModalBack,
    setCreateCardModalReverse,
    setCardsToStudy,
    setCreateDeckModalVisible,
    setCreateDeckName,
    revealCurrentStudyingCard,
    studyNextCard,
    resetStudying
} = flashCardsSlice.actions;


export const createDeck = (): AppThunk =>
    async (dispatch, getState) => {
        try {
            const {flashCards} = getState()
            const createdDeck = await flashCardsApi.createDeck(flashCards.createDeckModal.name)
            dispatch(setDecks([
                {
                    id: createdDeck.id,
                    name: flashCards.createDeckModal.name,
                    createdAt: Date.now() / 1000,
                },
                ...flashCards.decks
            ]))
            dispatch(setCreateDeckName(''))
            dispatch(setCreateDeckModalVisible(false))
        } catch (error) {
            console.error('Error adding deck:', error);
        }
    }


export const createCard = (deckId: string): AppThunk =>
    async (dispatch, getState) => {
        const {flashCards} = getState()
        try {

            const card = {
                front: flashCards.createCardModal.front,
                back: flashCards.createCardModal.back,
                deckId: deckId,
                reverse: flashCards.createCardModal.reverse,
                lastReview: 0,
                nextReview: 0
            }
            const result = await flashCardsApi.createCard(card);
            dispatch(setCreateCardModalFront(''))
            dispatch(setCreateCardModalBack(''))
            dispatch(setCreateCardModalReverse(false))
            const payload = {
                deckId: deckId,
                cardsData: {
                    ...flashCards.cards[deckId],
                    totalCount: flashCards.cards[deckId].totalCount++,
                    readyToStudyCount: flashCards.cards[deckId].readyToStudyCount ? flashCards.cards[deckId].readyToStudyCount++ : 1,
                    notStudiedCount: flashCards.cards[deckId].notStudiedCount++,
                    cards: [
                        {
                            ...responseToCard(card),
                            id: result.id
                        },
                        ...flashCards.cards[deckId].cards,
                    ]
                }
            }
            dispatch(setCardsData(payload))
        } catch (error) {
            console.error('Error adding card:', error);
        }
    }

export const fetchReadyToStudyCountByDeckId = (deckId: string): AppThunk =>
    async (dispatch, getState) => {
        const {flashCards} = getState()
        if (!flashCards.cards[deckId] || !flashCards.cards[deckId].readyToStudyCount) {
            try {
                const readyToStudyCount = await flashCardsApi.getReadyToStudyCountByDeckId(deckId)
                dispatch(setReadyToStudyCount({
                    deckId,
                    readyToStudyCount
                }))
            } catch (err) {
                console.error(err)
            }
        }

    }

export const updateCurrentCardAndMoveToTheNext = (rating: 'again'|'hard'|'good'|'easy'): AppThunk =>
    async (dispatch, getState) => {
        const {flashCards} = getState()
        try {
            const card = flashCards.cardsToStudy[flashCards.currentStudyingCardIndex]
            await flashCardsApi.updateCard(calculateNextReviewTime(card, rating))
        }catch (err) {
            console.error(err)
        }
        dispatch(studyNextCard())
    }
export const finishFlashCardsSession = (deckId: string): AppThunk =>
    async (dispatch, getState) => {
        dispatch(fetchCardsByDeckId(deckId, false, true))
    }

export const reCalculateStatsForAllDecks = (): AppThunk =>
    async (dispatch, getState) => {
        const {flashCards} = getState()
        flashCards.decks.forEach(deck => {
            dispatch(reCalculateStatsByDeckId(deck.id))
        })
    }
export const reCalculateStatsByDeckId = (deckId: string): AppThunk =>
    async (dispatch, getState) => {
        const {flashCards} = getState()
        if(flashCards.cards[deckId] && flashCards.cards[deckId].cards && flashCards.cards[deckId].cards.length >0 && flashCards.cards[deckId].cards[0].nextReview <= Date.now() / 1000) {
            const notStudied = flashCards.cards[deckId] && flashCards.cards[deckId].cards.filter(card => card.lastReview === 0).length
            const readyToReview = flashCards.cards[deckId] && flashCards.cards[deckId].cards.filter(card => card.nextReview < Date.now() /1000 && card.lastReview !== 0).length
            if((flashCards.cards[deckId].readyToStudyCount || 0) < notStudied + readyToReview) {
                dispatch(setCardsData({
                    deckId,
                    cardsData: {
                        ...flashCards.cards[deckId],
                        notStudiedCount: notStudied,
                        toReviewCount: readyToReview,
                        readyToStudyCount: readyToReview + notStudied
                    }
                }))
            }

        }
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

export const fetchCardsByDeckId = (deckId: string, paginate: boolean, forceReload: boolean = false): AppThunk =>
    async (dispatch, getState) => {
        const {flashCards} = getState()
        if (forceReload || !flashCards.cards[deckId] || !flashCards.cards[deckId].cards || flashCards.cards[deckId].cards.length === 0) {
            try {
                const cardsData = await flashCardsApi.getAllCardsDataByDeckId(deckId);
                dispatch(setCardsData({
                    deckId,
                    cardsData
                }))
            } catch (err) {
                console.error('Error', err)
            }
        } else if (paginate) {
            try {
                const cards = await flashCardsApi.getCardsPageByDeckId(deckId, flashCards.cards[deckId].cards[flashCards.cards[deckId].cards.length - 1])
                dispatch(addCardsToDeck({
                    deckId,
                    cards
                }))
            }  catch (err) {
                console.error('Error', err)
            }
        } else {
            dispatch(reCalculateStatsByDeckId(deckId))
        }
    }

export const fetchCardsToStudy = (deckId: string): AppThunk =>
    async (dispatch, getState) => {
        const {flashCards} = getState()
        try {
            dispatch(resetStudying())
            const cards = await flashCardsApi.getCardsToStudyByDeckId(deckId);
            dispatch(setCardsToStudy(cards))
        } catch (err) {
            console.error(err)
            dispatch(setCardsToStudy([]))
        }
    }

export const selectDecks = (state: RootState) => state.flashCards.decks
export const selectDeckById = (id: string) => (state: RootState) => state.flashCards.decks.find(deck => deck.id === id)
export const selectCreateDeckModalVisible = (state: RootState) => state.flashCards.createDeckModal.visible
export const selectCreateDeckName = (state: RootState) => state.flashCards.createDeckModal.name

export const selectCards = (state: RootState) => state.flashCards.cards
export const selectCardsDataByDeckId = (deckId: string) => createSelector(selectCards, (cards) => cards[deckId]? cards[deckId] : {cards:[], toReviewCount: 0, notStudiedCount: 0, totalCount:0, readyToStudyCount: 0})
export const selectCardsByDeckId = (deckId: string) => createSelector(selectCardsDataByDeckId(deckId), (cardsData) => cardsData?.cards || [])
export const selectCreateCardModalVisible = (state: RootState) => state.flashCards.createCardModal.visible
export const selectCreateCardFront = (state: RootState) => state.flashCards.createCardModal.front
export const selectCreateCardBack = (state: RootState) => state.flashCards.createCardModal.back


export const selectCardsTotalCountByDeckId = (deckId: string) => createSelector(selectCardsDataByDeckId(deckId), (cardsData) => cardsData?.totalCount || 0)
export const selectCardsToReviewCountByDeckId = (deckId: string) => createSelector(selectCardsDataByDeckId(deckId), (cardsData) => cardsData?.toReviewCount || 0)
export const selectCardsToStudyCountByDeckId = (deckId: string) => createSelector(selectCardsDataByDeckId(deckId), (cardsData) => cardsData?.readyToStudyCount || 0)
export const selectCardsNotStudiedCountByDeckId = (deckId: string) => createSelector(selectCardsDataByDeckId(deckId), (cardsData) => cardsData.notStudiedCount || 0)
export const selectCardsToStudyCount = (state: RootState) => state.flashCards.cardsToStudy.length

export const selectCardsToStudy = (state: RootState) => state.flashCards.cardsToStudy
export const selectCurrentStudyingCardIndex = (state: RootState) => state.flashCards.currentStudyingCardIndex
export const selectCurrentStudyingCardRevealed = (state: RootState) => state.flashCards.currentStudyingCardRevealed
export const selectCurrentStudyingCard = createSelector(selectCardsToStudy, selectCurrentStudyingCardIndex, (cards, index) => {
    if (index >= cards.length) return null;
    return cards[index]
})