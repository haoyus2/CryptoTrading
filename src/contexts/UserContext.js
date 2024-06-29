import React, { createContext, useState, useContext, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { readUserData } from "../dbUtils/UserUtils";

export const UserContext = createContext({
    username: null,
    setUsername: () => {}
});

export const UserProvider = ({ children }) => {
    const [username, setUsername] = useState(null);
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                readUserData(user.uid, (userData) => {
                    if (userData) {
                        setUsername(userData.username);
                    } else {
                        console.error("User data not found");
                        setUsername(null);
                    }
                });
            } else {
                setUsername(null);
            }
        });
        return () => unsubscribe();
    }, [auth]);

  
    // const initializeClient = (idToken) => {
    //     axios.post('http://localhost:5000/')
    //     .then(response => {
    //         console.log('Backend initialization successful:', response.data);
    //     })
    //     .catch(error => {
    //         console.error('Failed to initialize backend:', error);
    //     });
    //     // axios.post('http://localhost:5000/initialize-client', { idToken })
    //     //     .then(response => {
    //     //         console.log('Backend initialization successful:', response.data);
    //     //     })
    //     //     .catch(error => {
    //     //         console.error('Failed to initialize backend:', error);
    //     //     });
    // };

    return (
        <UserContext.Provider value={{ username, setUsername }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
