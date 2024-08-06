import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect, useRef} from 'react';
import 'react-native-reanimated';

import {useColorScheme} from '@/hooks/useColorScheme';
import {Provider} from "react-redux";
import {store} from "@/store/store";
import Routes from "@/app/routes";
import * as Notifications from 'expo-notifications';
import {Platform} from "react-native";
import * as Device from 'expo-device';
import '../lang/i18n';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();


  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });


  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        console.log('token', token)
        schedulePushNotification().then(() => console.log('Notification scheduled'))
      }
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('listener', notification)
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('response', response.notification.request.content);
    });

    return () => {
      notificationListener.current &&
      Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {

    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
      <Provider store={store}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Routes/>
        </ThemeProvider>
      </Provider>

  );
}


async function schedulePushNotification() {
  console.log('schedulePushNotification')
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got first notif! 📬",
      body: 'Here is the notification body',
      data: {data: 'goes here', test: {test1: 'more data'}},
    },
    trigger: {seconds: 2},
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const {status: existingStatus} = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const {status} = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.error('Failed to get push token for push notification!');
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    // EAS projectId is used here.
    // try {
    //   const projectId =
    //       Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    //   if (!projectId) {
    //     throw new Error('Project ID not found');
    //   }
    //   token = (
    //       await Notifications.getExpoPushTokenAsync({
    //         projectId,
    //       })
    //   ).data;
    // } catch (e) {
    //   token = `${e}`;
    // }
  }

  return token;
}