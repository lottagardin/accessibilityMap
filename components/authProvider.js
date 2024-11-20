import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState } from "react";
import { app } from "./firebaseConfig";

const [user, setUser] = useState(null)

export const AuthProvider = () => {
    const auth = getAuth(app);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            }
        })
    }, []);

    return user;
};

