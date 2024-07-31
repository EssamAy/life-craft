import {FirebaseAuthTypes} from "@react-native-firebase/auth";

export interface User {
    uid: string,
    displayName:  string | null ,
    email:  string | null ,
    photoURL:  string | undefined
}

export const toUser = (response: FirebaseAuthTypes.User | null): User | null => {
    if(response === null) return null
    return {
        uid: response.uid,
        displayName: response.displayName,
        email: response.email,
        photoURL: response.photoURL || undefined
    }

}