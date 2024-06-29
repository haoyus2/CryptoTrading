import React, { useState, useEffect } from "react";
import Navigation from "./Navigation";
import { readUserData, fetchTradingHistory } from "../dbUtils/UserUtils";
import { getStrategyDetails } from "../dbUtils/StrategyUtils";
import { auth } from "../config/firebase";
import "./Dashboard.css";

const Dashboard = () => {
    const [strategyId, setStrategyId] = useState(null);
    const [strategyName, setStrategyName] = useState("");
    const [tradingHistory, setTradingHistory] = useState([]);

    useEffect(() => {
        const handleAuthChange = async (user) => {
            if (user) {
                readUserData(user.uid, async (data) => {
                    if (data && data.selectedStrategy) {
                        setStrategyId(data.selectedStrategy);
                        const strategyDetails = await getStrategyDetails(
                            data.selectedStrategy
                        );
                        if (strategyDetails) {
                            setStrategyName(strategyDetails.name);
                        }
                        const history = await fetchTradingHistory(user.uid);
                        setTradingHistory(history);
                    } else {
                        // Reset states if no strategy is selected or user data is incomplete
                        setStrategyId(null);
                        setStrategyName("");
                        setTradingHistory([]);
                    }
                });
            } else {
                // Reset states when there is no user logged in
                setStrategyId(null);
                setStrategyName("");
            }
        };

        auth.onAuthStateChanged(handleAuthChange);

        return () => auth.onAuthStateChanged(handleAuthChange);
    }, [auth]);

    return (
        <div>
            <Navigation />
            <div>
                <div className="chosenStrategyContainer">
                    <div className="chosenStrategy">
                        <header className="dashboardStrategyHeader">
                            Current Strategy
                        </header>
                        <p className="dashboardStrategyContent">
                            {strategyName ? strategyName : "None"}
                        </p>
                        {strategyId ? (
                            <div className="chosenStrategyPerformance">
                                <div className="chosenStrategyPerformanceDetail">
                                    <header className="dashboardStrategyHeader">
                                        Performance
                                    </header>
                                    <p className="dashboardStrategyContent">
                                        xx%
                                    </p>
                                </div>
                                <div className="chosenStrategyPerformanceDetail">
                                    <header className="dashboardStrategyHeader">
                                        Profit
                                    </header>
                                    <p className="dashboardStrategyContent">
                                        $0
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p></p>
                        )}
                    </div>
                </div>
                <div className="historyContainer">
                    <div className="history">
                        <header className="dashboardStrategyHeader">
                            Trading History
                        </header>
                        <table className=" mt-5 table-auto">
                            <thead>
                                <tr className="text-dark-blue/80 bg-light-grey/50">
                                    <th className="px-5 py-5 uppercase tracking-wider rounded-tl-lg rounded-tr-lg">Product</th>
                                    <th className="px-5 py-5 uppercase tracking-wider">Side</th>
                                    <th className="px-5 py-5 uppercase tracking-wider">Price</th>
                                    <th className="px-5 py-5 uppercase tracking-wider rounded-tr-lg rounded-tl-lg">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tradingHistory &&
                                    Object.entries(tradingHistory).map(
                                        ([key, value],  index, array) => (
                                            <tr key={key} className={`bg-light-grey/50 ${index === array.length - 1 ? 'rounded-bl-lg rounded-br-lg' : ''} mb-2`}>
                                                <td class="px-5 py-4  text-sm">
                                                    {value.product_id}
                                                </td>
                                                <td class="px-5 py-4  text-sm">
                                                    {value.side}
                                                </td>
                                                <td class="px-5 py-4 text-sm">
                                                    {value.price.toFixed(2)}
                                                </td>
                                                <td class="px-5 py-4 text-sm">
                                                    {new Date(
                                                        value.time
                                                    ).toLocaleString()}
                                                </td>
                                            </tr>
                                        )
                                    )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
