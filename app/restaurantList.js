import { Text, View, StyleSheet, TextInput, FlatList, Pressable } from "react-native";
import { useState } from 'react';
import { Link } from "expo-router";



export default function RavintolaListaus() {

    const addRestaurant = () => {

    }

    return (
        <View style={styles.container}>
            <View style={{ flex: 11 }}>
                <Text>This will have the list of the restaurants.</Text>
                <Text>This page will also have a button where you can add restaurants (but you have to be a logged in admin to do that)</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Link href="/" asChild>
                    <Pressable>
                        <Text>Back to the map</Text>
                    </Pressable>
                </Link>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
    },
});