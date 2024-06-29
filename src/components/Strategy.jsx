import React, { useState, useEffect } from "react";
import Navigation from "./Navigation";
import {
    selectStrategy,
    unselectStrategy,
    readUserData,
} from "../dbUtils/UserUtils";
import { fetchStrategies } from "../dbUtils/StrategyUtils";
import { auth } from "../config/firebase";

const Strategy = () => {
    // const [strategies, setStrategies] = useState([
    //     { id: 1, name: "Strategy A", description: "Description of Strategy A" },
    //     { id: 2, name: "Strategy B", description: "Description of Strategy B" },
    //     { id: 3, name: "Strategy C", description: "Description of Strategy C" },
    // ]);
    const [strategies, setStrategies] = useState([]);
    const [selectedStrategyKey, setSelectedStrategyKey] = useState(null);

    // Fetch strategies from the database on component mount
    useEffect(() => {
        fetchStrategies().then(setStrategies);

        const updateUserData = () => {
            const userId = auth.currentUser?.uid;
            if (userId) {
                readUserData(userId, (userdata) => {
                    setSelectedStrategyKey(userdata.selectedStrategy);
                });
            } else {
                // Reset selected strategy when there is no logged-in user
                setSelectedStrategyKey(null);
            }
        };

        const unsubscribe = auth.onAuthStateChanged(updateUserData);

        return () => unsubscribe();
    }, [auth.currentUser]);

    const handleSelectStrategy = (strategyFirebaseKey) => {
        const userId = auth.currentUser?.uid;
        if (!userId) {
            alert("You need to be logged in to select a strategy.");
            return;
        }
        if (selectedStrategyKey === strategyFirebaseKey) {
            unselectStrategy(userId)
                .then(() => {
                    setSelectedStrategyKey(null);
                })
                .catch((error) => {
                    console.error("Failed to unselect strategy:", error);
                });
        } else {
            // console.log(strategyFirebaseKey)
            selectStrategy(userId, strategyFirebaseKey)
                .then(() => {
                    setSelectedStrategyKey(strategyFirebaseKey);
                })
                .catch((error) => {
                    console.error("Failed to select strategy:", error);
                });
        }
    };

    return (
        <div>
            <Navigation />
            <div className="font-['Inter'] " style={{ padding: "20px" }}>
                <h1 className="mt-20 font-['Lora'] font-bold text-2xl text-dark-blue">
                    Available Strategies
                </h1>
                <div className="flex flex-col p-7 gap-8">
                    {strategies.map((strategy) => (
                        <div
                            className="w-4/5 py-5 px-20 min-h-40 rounded-[20px] self-center flex flex-row justify-between bg-white/60"
                            key={strategy.firebaseKey}
                        >
                            <h2 className="self-center font-['Lora'] font-bold text-lg text-dark-blue">
                                {strategy.name}
                            </h2>
                            <p className="self-center">
                                {strategy.description}
                            </p>
                            <div className="w-24 self-center align-bottom">
                                <button
                                    className="rounded-lg w-full shadow-lg p-4 bg-light-blue/50"
                                    onClick={() =>
                                        handleSelectStrategy(
                                            strategy.firebaseKey
                                        )
                                    }
                                >
                                    {selectedStrategyKey ===
                                    strategy.firebaseKey
                                        ? "Unselect"
                                        : "Select"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Strategy;
