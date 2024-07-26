import {Tabs} from 'expo-router';


import {TabBarIcon} from '@/components/navigation/TabBarIcon';
import {Colors} from '@/constants/Colors';
import {useColorScheme} from '@/hooks/useColorScheme';


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (

    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
        <Tabs.Screen
            name="index"
            options={{
                title: 'Dashboard',
                tabBarLabel: 'Dashboard',
                tabBarShowLabel: true,
                tabBarIcon: ({ color, focused }) => (
                    <TabBarIcon name='dashboard' color={color} />
                ),
            }}
        />
      <Tabs.Screen
        name="decks"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name='class' color={color} />
          ),
        }}
      />

        <Tabs.Screen
            name="profile"
            options={{
                title: 'Profile',
                tabBarIcon: ({ color, focused }) => (
                    <TabBarIcon name='person' color={color} />
                ),
            }}
        />
    </Tabs>
  );
}