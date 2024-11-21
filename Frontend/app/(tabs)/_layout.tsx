import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import useGlobalStyle from '../hooks/GlobalStyleContext';


export default function TabLayout() {
    const styles = useGlobalStyle()
    return (
        <Tabs

            screenOptions={{
                tabBarActiveTintColor: styles.colors.primary,
                tabBarInactiveTintColor: styles.colors.secondary,
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: styles.colors.bgColor, // Set tab bar background color
                    borderTopWidth: 0,
                    height: 65,
                    paddingTop: 5,


                },
                tabBarLabelStyle: {
                    fontFamily: styles.fontStyle.textFont, // Set custom font family
                    fontSize: styles.fontSize.xs, // Set custom font size
                    fontWeight: 'bold', // Optional: Set font weight
                },

            }}
        >
            <Tabs.Screen
                name="Home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="home" size={size + 5} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="Video"
                options={{
                    title: 'Video',
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="video-camera" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="Settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="settings" size={size} color={color} />
                    ),
                }}
            />

        </Tabs>
    )
}