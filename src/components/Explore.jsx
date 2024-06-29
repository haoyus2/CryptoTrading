import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navigation from "./Navigation";
import { fetchCryptocurrencies } from "../dbUtils/ApiUtils";
import "./variables.css";

const Explore = () => {
    const [currencies, setCurrencies] = useState([]);

    useEffect(() => {
        const loadCurrencies = async () => {
            try {
                const data = await fetchCryptocurrencies();
                setCurrencies(data);
            } catch (error) {
                console.error("Failed to load currencies:", error);
            }
        };
        loadCurrencies();
    }, []);

    return (
        <div>
            <Navigation />
            <div style={{ padding: "20px" }}>
                <h1
                    style={{
                        fontSize: "38px",
                        fontFamily: "'Lora', serif",
                        color: "var(--dark-blue)",
                    }}
                >
                    Explore Cryptocurrency
                </h1>
                <ul style={{ listStyleType: "none", padding: "20px 15%" }}>
                    <li
                        style={{
                            textDecoration: "none",
                            fontFamily: "'Lora', serif",
                            fontSize: "24px",
                            color: "var(--dark-blue)",
                            paddingBottom: "10px",
                            fontWeight: "bold",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "left",
                        }}
                    >
                        <span style={{ flex: 1.5, textAlign: 'center' }}>Name</span>
                        <span style={{ flex: 1, textAlign: 'left' }}>Price</span>
                        <span style={{ flex: 1, textAlign: 'left' }} >24h Volume</span>
                    </li>
                    {currencies.map((currency) => (
                        <li
                            key={currency.id}
                            style={{
                                margin: "10px 0",
                                backgroundColor: "rgba(226, 226, 226, 0.5)",
                                padding: "15px",
                                borderRadius: "5px",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            }}
                        >
                            <Link
                                to={`/currencies/${currency.id}`}
                                style={{
                                    textDecoration: "none",
                                    color: "black",
                                    fontWeight: "bold",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "left",
                                }}
                            >
                                <span style={{ flex: 1.5, textAlign: 'center' }}>{currency.name}</span>
                                <span style={{ flex: 1, textAlign: 'left' }}>${currency.price}</span>
                                <span style={{ flex: 1, textAlign: 'left' }}>
                                    ${currency.volume_24h.toLocaleString()}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Explore;
