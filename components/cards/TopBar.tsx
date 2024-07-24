import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {Link} from "expo-router"; // Example: Using Ionicons for icons

const TopBar = () => {
    return (
        <View style={styles.container}>
            <Link href={`(tabs)/decks`}  style={styles.button}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </Link>

            <View style={styles.right}>
                <TouchableOpacity  style={styles.button}>
                    <Ionicons name="search" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Ionicons name="ellipsis-vertical" size={24} color="black" />
                </TouchableOpacity>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 56,
        backgroundColor: '#fff', // Customize your background color
        borderBottomWidth: 1,
        borderBottomColor: '#ddd'
    },
    button: {
        padding: 8,
    },
    right: {
        flexDirection: 'row',
    },
});

export default TopBar;
