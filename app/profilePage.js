import { Text, View, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";
import { AuthProvider } from "../components/authProvider";




export default function ProfilePage() {

    const user = AuthProvider();

    if (user) {
        return (
            <Text>{user.email}</Text>
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