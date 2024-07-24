export interface CardsData {
    cards: Card[],
    totalCount: number,
    toReviewCount: number,
    notStudiedCount: number,
}
export interface Card {
    id: string,
    front: string,
    back: string,
    deckId: string,
    reverse: boolean,
    lastReview: number,
    interval: number,
    nextReview: number,
    easeFactor: number,
    repetition: number,
    createdAt: number
}

export function responseToCard(card: Card): Card {
    return {
        ...card,
        lastReview: card.lastReview || 0,
        interval: card.interval || 0,
        nextReview: card.nextReview || 60,
        easeFactor: card.easeFactor || 2.5,
        repetition: card.repetition || 0,
    }
}

export function toUpsertPayload(card: Card) {
    return {
        front: card.front,
        back: card.back,
        deckId: card.deckId,
        reverse: card.reverse,
        lastReview: card.lastReview || 0,
        interval: card.interval || 0,
        nextReview: card.nextReview || 0,
        easeFactor: card.easeFactor  || 2.5,
        repetition: card.repetition || 0
    }
}