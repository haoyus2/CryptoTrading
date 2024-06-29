import { ref, get, set, push } from "firebase/database";
import { db } from "../config/firebase";

// only for initialize strategy database
export const storeStrategy = (strategy) => {
    const strategyRef = ref(db, "strategies");
    const newStrategyRef = push(strategyRef);
    return set(newStrategyRef, strategy);
};

// read all strategies data including firebase key
export const fetchStrategies = async () => {
    const strategiesRef = ref(db, 'strategies');  
    try {
        const snapshot = await get(strategiesRef);
        if (snapshot.exists()) {
            const strategies = snapshot.val();
            // Map the strategy data to include the Firebase key
            return Object.keys(strategies).map(key => ({
                ...strategies[key],
                firebaseKey: key 
            }));
        } else {
            console.log("No strategies found in the database.");
            return [];  
        }
    } catch (error) {
        console.error("Error fetching strategies:", error);
        return []; 
    }
};

//read strategy data
export const getStrategyDetails = async (strategyId) => {
    const strategyRef = ref(db, `strategies/${strategyId}`);
    try {
        const snapshot = await get(strategyRef);
        if (snapshot.exists()) {
            return snapshot.val(); // returns the entire strategy object
        } else {
            console.log("No strategy found with ID:", strategyId);
            return null; 
        }
    } catch (error) {
        console.error("Error fetching strategy details:", error);
        throw error;
    }
};
