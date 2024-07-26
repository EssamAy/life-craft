import {Text, View} from "react-native";
import React, {useEffect, useState} from "react";
import {Card} from "@/models/card";
import {readableNextReviewActionTime} from "@/utils/time";
import {Colors} from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";

export interface ReviewTimeProps {
    card: Card
}

const ReviewTime = ({card}: ReviewTimeProps) => {
    const [color, setColor] = useState<string>(Colors.primary)
    const [iconVisible, setIconVisible] = useState<boolean>(false)
    const [readableTime, setReadableTime] = useState<string>(false)

    useEffect(() => {
        const aDayInSeconds = 86400;

        const midNightTimeInSeconds = ((new Date()).setHours(24,0,0,0)) / 1000


        if(card.interval <= 0) {
            setColor(Colors.darkGray)
            setIconVisible(false)
            setReadableTime('Not studied')
            return;
        }

        if(card.nextReview < Date.now() / 1000) {
            setColor(Colors.success)
            setIconVisible(false)
            setReadableTime('Ready')
            return;
        }

        if(card.nextReview < midNightTimeInSeconds) {
            setColor(Colors.primary)
            setIconVisible(true)
            setReadableTime('In ' + readableNextReviewActionTime(card.nextReview - Date.now() / 1000))
            return;
        }



        if(card.nextReview < midNightTimeInSeconds + aDayInSeconds) {
            setColor(Colors.darkGray)
            setIconVisible(true)
            setReadableTime('Tomorrow')
            return;
        }

        const diffFromNow = card.nextReview - (Date.now() / 1000)
        const diffToMidnight = midNightTimeInSeconds - (Date.now() / 1000)
        const numberOfDays = Math.floor((diffFromNow + diffToMidnight) / aDayInSeconds)

        setColor(Colors.darkGray)
        setIconVisible(true)
        setReadableTime(`In ${numberOfDays} days`)
        return;
    }, []);




        return (

            <View style={{flexDirection: "row", alignItems: "center"}}>
                {iconVisible && <Ionicons name="time-outline" color={color} size={10}/>}
                <Text style={{
                    color: color,
                    fontSize: 10
                }}> {readableTime}</Text>
            </View>

        );
}

export default ReviewTime