// takes either a unix time number, string or a Date object and returns time string

export const readableNextReviewActionTime = (seconds: number): string => {

    const time_formats = [
        [61, "s", "<1m"], // 60
        [120, "1m ago", "1m"], // 60*2
        [3600, "m", 60], // 60*60, 60
        [7200, "1h ago", "1h"], // 60*60*2
        [86400, "h", 3600], // 60*60*24, 60*60
        [172800, "yesterday", "24h"], // 60*60*24*2
        [604800, "d", 86400], // 60*60*24*7, 60*60*24
        [1209600, "last week", "1w"], // 60*60*24*7*4*2
        [2419200, "w", 604800], // 60*60*24*7*4, 60*60*24*7
        [4838400, "last month", "1month"], // 60*60*24*7*4*2
        [29030400, "months", 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
        [58060800, "last year", "1y"], // 60*60*24*7*4*12*2
        [2903040000, "y", 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
        [5806080000, "last century", "1c"], // 60*60*24*7*4*12*100*2
        [58060800000, "c", 2903040000], // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
    ];

    // future time
    let    list_choice = 2;

    let i = 0,
        format;

    while ((format = time_formats[i++]))
        if (seconds < Number(format[0])) {
            if (typeof format[2] == "string") return format[list_choice];
            else
                return Math.floor(seconds / format[2]) + "" + format[1];
        }
    return seconds.toString();
};

export const readableCardAvailabilityTime = (dateInSeconds: number): string => {
    const aDayInSeconds = 86400;

    const midNightTimeInSeconds = ((new Date()).setHours(24,0,0,0)) / 1000


    if(dateInSeconds < midNightTimeInSeconds) {
        return 'Today'
    }



    if(dateInSeconds < midNightTimeInSeconds + aDayInSeconds) {
        return 'Tomorrow'
    }

    const diffFromNow = dateInSeconds - (Date.now() / 1000)
    const diffToMidnight = midNightTimeInSeconds - (Date.now() / 1000)
    const numberOfDays = Math.floor((diffFromNow + diffToMidnight) / aDayInSeconds)
    return `In ${numberOfDays} days`;
};