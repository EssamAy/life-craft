import {Card} from "@/models/card";

const initialIntervals = {
    again: 60, // 1 minute in seconds
    hard: 900, // 15 minutes in seconds
    good: 86400, // 24 hours in seconds
    easy: 172800 // 2 days in seconds
};

const minInterval = 60; // minimum interval in seconds (1 minute)
const maxInterval = 31536000; // maximum interval in seconds (1 year)

function calculateNextReviewTime(card: Card, rating: 'again'|'hard'|'good'|'easy'): Card {
    const now = Math.floor(Date.now() / 1000); // current time in seconds
    const { easeFactor, repetition, interval  } = card;

    let newInterval: number;
    let newRepetition = repetition;
    let newEaseFactor = easeFactor;

    // Determine the initial interval based on the rating if first review
    if (repetition === 0) {
        newInterval = initialIntervals[rating];
        newRepetition = rating === 'again' ? 0 : 1;
    } else {
        // Adjust the ease factor based on the rating
        switch (rating) {
            case 'again':
                newEaseFactor = Math.max(1.3, easeFactor - 0.2);
                newRepetition = 0;
                newInterval = initialIntervals['again'];
                break;
            case 'hard':
                newEaseFactor = Math.max(1.3, easeFactor - 0.15);
                newRepetition += 1;
                newInterval = interval * 1.2;
                break;
            case 'good':
                newRepetition += 1;
                newInterval = interval * easeFactor;
                break;
            case 'easy':
                newEaseFactor += 0.15;
                newRepetition += 1;
                newInterval = interval * easeFactor * 1.5;
                break;
            default:
                throw new Error("Invalid rating");
        }

        // Ensure intervals are within reasonable bounds
        newInterval = Math.max(minInterval, newInterval);
        newInterval = Math.min(maxInterval, newInterval);
    }

    // Return the updated card information
    return {
        ...card,
        lastReview: now,
        easeFactor: newEaseFactor,
        repetition: newRepetition,
        interval: newInterval,
        nextReview: now + newInterval
    };
}

export default calculateNextReviewTime;
