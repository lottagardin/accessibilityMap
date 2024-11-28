import { Text, View, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";
import { AuthProvider } from "../components/authProvider";




export default function ProfilePage() {

    const user = AuthProvider();

    if (user) {
        return (
            <View style={styles.container}>
                <View style={{ flex: 11, alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 30, fontStyle: 'bold', textAlign: 'center' }}>User: </Text>
                        <Text style={{ fontSize: 20, fontStyle: 'bold', textAlign: 'center' }}>{user.email}</Text>
                    </View>
                    <View style={{ flex: 4 }} >
                        <Text style={{ fontSize: 25, fontStyle: 'bold', textAlign: 'center' }}>My favorite restaurants:</Text>
                    </View>
                </View>


                <View style={styles.bottomNavigation}>
                    <Link href="/" asChild>
                        <Pressable style={styles.button}>
                            <Text>Map</Text>
                        </Pressable>
                    </Link>
                    <Link href="/restaurantList" asChild>
                        <Pressable style={styles.button}>
                            <Text>List of restaurants</Text>
                        </Pressable>
                    </Link>
                </View>
            </View>

        )
    }
    else {
        return (
            <View style={styles.container}>
                <View style={{ flex: 11, width: "100%" }}>

                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 30, fontStyle: 'bold', textAlign: 'center' }}>Log in or sign up to see your profile.</Text>
                    </View>

                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-evenly", width: "100%" }}>
                        <Link href="/signInPage" asChild>
                            <Pressable>
                                <Text style={{ fontSize: 25, fontStyle: 'bold', textAlign: 'center' }}>Sign In</Text>
                            </Pressable>
                        </Link>
                        <Link href="/registrationPage" asChild>
                            <Pressable>
                                <Text style={{ fontSize: 25, fontStyle: 'bold', textAlign: 'center' }}> Register User</Text>
                            </Pressable>
                        </Link>
                    </View>

                </View>

                <View style={styles.bottomNavigation}>
                    <Link href="/" asChild>
                        <Pressable style={styles.button}>
                            <Text>Map</Text>
                        </Pressable>
                    </Link>
                    <Link href="/restaurantList" asChild>
                        <Pressable style={styles.button}>
                            <Text>List of restaurants</Text>
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
        backgroundColor: '#ededed',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 200,

    },
    bottomNavigation: {
        backgroundColor: 'grey',
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: "100%",
        alignItems: 'center'
    },
    input: {
        backgroundColor: 'white',
        height: 40,
        margin: 12,
        width: "100%",
        borderWidth: 4,
        borderColor: 'grey',
        textAlign: 'center'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 20,
        elevation: 3,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'grey',

    },

});
