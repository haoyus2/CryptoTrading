import {
    getDatabase,
    ref,
    set,
    get,
    update,
    remove,
    onValue,
} from "firebase/database";
import { db } from "../config/firebase";

// Users Collection

// create new user
export const writeUserData = (uid, username, email) => {
    set(ref(db, `users/${uid}`), {
        username: username,
        email: email,
        // apiKey,
        // apiSecret,
        // passphrase,
        // selected_strategy
    });
};

// check user existance
export const checkUserExists = async (userId) => {
    const userRef = ref(db, `users/${userId}`);
    const snapshot = await get(userRef);
    return snapshot.exists();
};

// read user data by userId
export const readUserData = (userId, callback) => {
    const userRef = ref(db, `users/${userId}`);
    onValue(
        userRef,
        (snapshot) => {
            const data = snapshot.val();
            callback(data);
        },
        {
            onlyOnce: true,
        }
    );
};

// // read user strategy by userId
// export const fetchUserStrategy = (userId, callback) => {
//     const userRef = ref(db, `users/${userId}`);
//     onValue(
//         userRef,
//         (snapshot) => {
//             const data = snapshot.val();
//             callback(data);
//         },
//         {
//             onlyOnce: true,
//         }
//     );
// };

// change username by userId
export const changeUsername = (userId, newUsername) => {
    const userRef = ref(db, `users/${userId}`);
    return update(userRef, {
        username: newUsername,
    });
};

// change API settings by userId
export const changeUserAPI = (userId, apiKey, apiSecret, passphrase) => {
    const userRef = ref(db, `users/${userId}`);
    return update(userRef, {
        apiKey: apiKey,
        apiSecret: apiSecret,
        passphrase: passphrase,
    });
};

// select a strategy for a user
export const selectStrategy = (userId, strategyId) => {
    const userStrategyRef = ref(db, `users/${userId}`);
    // console.log(strategyId)
    return update(userStrategyRef, {
        selectedStrategy: strategyId,
    });
};

// unselect a strategy for a user
export const unselectStrategy = (userId) => {
    const userStrategyRef = ref(db, `users/${userId}`);
    return update(userStrategyRef, {
        selectedStrategy: null,
    });
};

// get user's trading history
export const fetchTradingHistory = async (userId) => {
    const historyRef = ref(db, `tradingHistory/${userId}`);
    const snapshot = await get(historyRef);
    if (snapshot.exists()) {
        return snapshot.val();
    } else {
        console.error("No trading history found");
        return {};
    }
};