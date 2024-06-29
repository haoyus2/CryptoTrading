import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, getIdToken } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { db } from "../config/firebase";
import axios from "axios";

const BackendConnector = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const auth = getAuth();

        // Listener for authentication state changes
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                setUser(null);
            }
        });

        return () => {
            unsubscribeAuth();
        };
    }, []);

    useEffect(() => {
        if (user) {
            const userRef = ref(db, `users/${user.uid}`);
            const unsubscribeData = onValue(userRef, async (snapshot) => {
                const userData = snapshot.val();
                if (userData) {
                    console.log("User data updated:", userData);
                    const idToken = await getIdToken(user, true);
                    initializeBackendClient(idToken);
                }
            });

            return () => {
                unsubscribeData();
            };
        }
    }, [user]);

    const initializeBackendClient = async (idToken) => {
        try {
            const response = await axios.post("http://localhost:5000/initialize-client", { idToken });
            console.log("Backend initialization successful:", response.data);
        } catch (error) {
            console.error("Error communicating with the backend:", error);
        }
    };

    return <div />;
};

export default BackendConnector;
