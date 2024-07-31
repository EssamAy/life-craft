import * as firestore from "@react-native-firebase/firestore";
import {Card, CardsData, responseToCard, toUpsertPayload} from "@/models/card";
import {Deck} from "@/models/deck";

export const flashCardsApi = {
    createDeck: async  (name: string) => {
        return await firestore.getFirestore().collection('decks').add({
            name: name,
        })
    },
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
    createCard: async (card: any) => {
        return await firestore.getFirestore().collection<Card>('cards').add(card)
    },
    getReadyToStudyCountByDeckId: async (deckId: string) => {
        const readyToStudy = await firestore.getFirestore().collection<Card>('cards')
            .where("deckId", "==", deckId)
            .where("nextReview", "<=", Date.now() / 1000)
            .count()
            .get()
        return readyToStudy.data().count
    },
    getAllCardsDataByDeckId: async (deckId: string): Promise<CardsData> => {
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
            .where("nextReview", ">", 0)
            .where("nextReview", "<=", Date.now() / 1000)
            .count()
            .get()
        const dataPromise = dataQuery.limit(50).get()
        const totalCountPromise = dataQuery.count().get();

        const [dataResponse, totalCountResponse, notStudiedCountResponse, toReviewCountResponse] = await Promise.all([dataPromise, totalCountPromise, notStudiedCountPromise, toReviewCountPromise])

        return {
            totalCount: totalCountResponse.data().count,
            toReviewCount: toReviewCountResponse.data().count,
            notStudiedCount: notStudiedCountResponse.data().count,
            readyToStudyCount: toReviewCountResponse.data().count + notStudiedCountResponse.data().count,
            cards: dataResponse.docs.map(doc => {
                return {
                    ...responseToCard(doc.data()),
                    id: doc.id,
                    createdAt: Number(doc.get('createdAt.seconds'))
                }
            })
        }
    },
    getCardsPageByDeckId: async (deckId: string, startAfter: Card): Promise<Card[]> =>{
        let dataResponse =  await firestore.getFirestore().collection<Card>('cards')
            .where("deckId", "==", deckId)
            .orderBy("nextReview", "asc")
            .startAfter(startAfter.nextReview)
            .limit(50)
            .get()

        return dataResponse.docs.map(doc => {
            return {
                ...responseToCard(doc.data()),
                id: doc.id,
                createdAt: Number(doc.get('createdAt.seconds'))
            }
        })
    },
    getCardsToStudyByDeckId: async (deckId: string) => {
        const response = await firestore.getFirestore().collection<Card>('cards')
            .where("deckId", "==", deckId)
            .where("nextReview", "<=", Date.now() / 1000)
            .orderBy("nextReview", "asc")
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
        return await firestore.getFirestore().collection<Card>('cards').doc(card.id).update(toUpsertPayload(card))
    }
}