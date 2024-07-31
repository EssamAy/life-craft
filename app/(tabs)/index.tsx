import {StyleSheet, Text, View} from 'react-native';
import React from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {Link} from "expo-router";

export default function DashboardScreen() {

  return (
      <SafeAreaView style={styles.container}>
        <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 5}}>Flashcards</Text>
        <View style={{
          backgroundColor: '#fff',
          padding: 10,
          borderRadius: 10
        }}>
          <Text>Total cards</Text>
          <Text>15</Text>
        </View>

      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5
  },
});
