import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { View, TextInput, Button } from "react-native-web";
import { StyleSheet } from "react-native";


const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [user, setUser] = useState(null);

export default function Registration() {

    const register = () => {
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const CurrentUser = userCredential.user;
                setUser(CurrentUser);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode);
                return (
                    Alert.alert(errorMessage)
                )
            });

    }

    return (
        <View style={styles.container}>
            <View style={styles.input}>
                <Text>Email:</Text>
                <TextInput
                    onChangeText={text => setEmail(text)}
                    value={email} />
            </View>
            <View style={styles.input}>
                <Text>Password:</Text>
                <TextInput
                    onChangeText={text => setPassword(text)}
                    value={password} />
            </View>
            <Button onPress={register} title="Register user" />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 100,
    },
    input: {
        flexDirection: "row",
        height: 40,
        margin: 12,
        width: 200,
        borderWidth: 1,
        padding: 10,
        marginTop: 200
    }
});

