import { Text, View, StyleSheet, TextInput, FlatList, Pressable } from "react-native";

import { Link } from "expo-router";



export default function ProfilePage() {



    return (
        <View style={styles.container}>
            <View style={{ flex: 11, justifyContent: "space-evenly" }}>
                <Text>If the user is logged in, this will have the user's profile picture and username, favorited restaurants and a link to their ratings
                </Text>
                <Text>If the user is not logged in, this will take them to the login page where they can either log in or create a new user</Text>
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