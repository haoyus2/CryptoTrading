import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchCurrencyDetails, fetchHistoricalData } from "../dbUtils/ApiUtils";
import Navigation from "./Navigation";
import CandlestickChart from "./CandlestickChart";

export default function Detail() {
    const { currencyId } = useParams();
    const [currencyDetails, setCurrencyDetails] = useState([]);
    const [historicalData, setHistoricalData] = useState([]);

    useEffect(() => {
        const loadDetails = async () => {
            try {
                const details = await fetchCurrencyDetails(currencyId);
                setCurrencyDetails(details);
            } catch (error) {
                console.error("Failed to fetch currency details:", error);
            }
        };
        const loadHistoricalData = async () => {
            try {
                const historical_data = await fetchHistoricalData(currencyId);
                setHistoricalData(historical_data);
            } catch (error) {
                console.error("Failed to fetch historical data:", error);
            }
        };
        loadDetails();
        loadHistoricalData();
    }, [currencyId]);

    return (
        <div>
            <Navigation />
            <div className="mt-5" style={{ fontFamily: "'Lora', serif" }}>
                <h1 className=" m-2  font-bold text-2xl text-dark-blue">
                    {currencyDetails?.name}
                </h1>
                <div
                    className="m-6"
                    style={{ display: "flex", justifyContent: "space-around" }}
                >
                    <p className=" font-bold text-lg text-dark-blue">
                        Price: {currencyDetails?.price}
                    </p>
                    <p className=" font-bold text-lg text-dark-blue">
                        Volume: {currencyDetails?.volume}
                    </p>
                </div>
                <div className=" bg-light-grey/50 p-8">
                    <CandlestickChart data={historicalData} />
                </div>
            </div>
        </div>
    );
}
