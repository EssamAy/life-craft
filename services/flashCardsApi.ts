import * as firestore from "@react-native-firebase/firestore";
import {Card, CardsData, responseToCard, toUpsertPayload} from "@/models/card";
import {Deck} from "@/models/deck";

export const flashCardsApi = {
    getAllDecks: async () => {
        const response =  await firestore.getFirestore().collection<Deck>('decks').get()
        return response.docs.map(doc => {
            return {
                ...doc.data(),
                id: doc.id,
                cardsForToday: 5,
                createdAt: Number(doc.get('createdAt.seconds'))
            }
        })
    },
    getAllCardsDataByDeckId: async (deckId: string): Promise<CardsData> => {
        console.log('get all cards')
        const dataQuery =  firestore.getFirestore().collection<Card>('cards')
            .where("deckId", "==", deckId)
            .orderBy("nextReview", "asc")
        const notStudiedCountPromise = firestore.getFirestore().collection<Card>('cards')
            .where("deckId", "==", deckId)
            .where("nextReview", "<=", 0)
            .count()
            .get()
        const toReviewCountPromise = firestore.getFirestore().collection<Card>('cards')
            .where("deckId", "==", deckId)
            .where("nextReview", ">=", Date.now() / 1000)
            .count()
            .get()
        const dataPromise = dataQuery.limit(10).get()
        const totalCountPromise = dataQuery.count().get();

        const [dataResponse, totalCountResponse, notStudiedCountResponse, toReviewCountResponse] = await Promise.all([dataPromise, totalCountPromise, notStudiedCountPromise, toReviewCountPromise])

        return {
            totalCount: totalCountResponse.data().count,
            toReviewCount: toReviewCountResponse.data().count,
            notStudiedCount: notStudiedCountResponse.data().count,
            cards: dataResponse.docs.map(doc => {
                return {
                    ...responseToCard(doc.data()),
                    id: doc.id,
                    createdAt: Number(doc.get('createdAt.seconds'))
                }
            })
        }
    },
    getCardsPageByDeckId: async (deckId: string, startAfter: number = 0): Promise<Card[]> =>{
        console.log('get page')
        let dataQuery =  firestore.getFirestore().collection<Card>('cards')
            .where("deckId", "==", deckId)
            .orderBy("nextReview", "asc")
            .startAfter(startAfter)
            .limit(10)


        console.log('startAfter', startAfter)

        const dataResponse = await dataQuery.get();
        console.log('page resp', dataResponse.docs)
        return dataResponse.docs.map(doc => {
            return {
                ...responseToCard(doc.data()),
                id: doc.id,
                createdAt: Number(doc.get('createdAt.seconds'))
            }
        })
    },
    getCardsToStudyByDeckId: async (deckId: string, limit: number) => {
        const response = await firestore.getFirestore().collection<Card>('cards')
            .where("deckId", "==", deckId)
            .orderBy("nextReview", "asc")
            .limit(limit)
            .get()
        return response.docs.map(doc => {
            return {
                ...responseToCard(doc.data()),
                id: doc.id,
                createdAt: Number(doc.get('createdAt.seconds'))
            }
        })
    },
    updateCard: async(card: Card) => {
        await firestore.getFirestore().collection<Card>('cards').doc(card.id).update(toUpsertPayload(card))
    }
}