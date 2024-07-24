import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const TopBar = () => {
    const handleStreakClick = () => {

    }
    const handleEditClick = () => {

    }
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleStreakClick} style={styles.button}>
                <MaterialIcons name="local-fire-department" size={24} color="orange" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleEditClick} style={styles.button}>
                <MaterialIcons name="mode-edit-outline" size={24} color="black" />
            </TouchableOpacity>

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
