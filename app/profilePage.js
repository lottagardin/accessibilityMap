import { Text, View, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";
import { AuthProvider } from "../components/authProvider";




export default function ProfilePage() {

    const user = AuthProvider();

    if (user) {
        return (
            <View style={styles.container}>
                <View style={{ flex: 11 }}>
                    <Text>Email: </Text>
                    <Text>{user.email}</Text>
                </View>



                <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-evenly", width: "100%" }}>
                    <Link href="/" asChild>
                        <Pressable>
                            <Text>Map</Text>
                        </Pressable>
                    </Link>
                    <Link href="/restaurantList" asChild>
                        <Pressable>
                            <Text>A list of the restaurants</Text>
                        </Pressable>
                    </Link>
                </View>
            </View>

        )
    }
    else {
        return (
            <View style={styles.container}>
                <Text>Log in or sign up to see your profile.</Text>
                <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-evenly", width: "100%" }}>
                    <Link href="/signInPage" asChild>
                        <Pressable>
                            <Text>Sign In</Text>
                        </Pressable>
                    </Link>
                    <Link href="/registrationPage" asChild>
                        <Pressable>
                            <Text>Register User</Text>
                        </Pressable>
                    </Link>
                </View>
            </View>
        )
    }


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