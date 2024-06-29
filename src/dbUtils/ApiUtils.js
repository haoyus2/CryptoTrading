import { ref, set } from "firebase/database";
import { db } from "../config/firebase";
// import axios from 'axios';


const marketUrl = 'https://api.exchange.coinbase.com';


export const fetchCryptocurrencies = async () => {
    const baseUrl = `${marketUrl}/products`;
    const selectedCurrencies = ['BTC-USD', 'ETH-USD', 'LTC-USD', 'XRP-USD', 'BCH-USD', 'EOS-USD', 'XLM-USD', 'ADA-USD', 'XTZ-USD', 'LINK-USD'];
    try {
        const detailedProducts = await Promise.all(selectedCurrencies.map(async (currencyId) => {
            const tickerUrl = `${baseUrl}/${currencyId}/ticker`;
            try {
                const tickerResponse = await fetch(tickerUrl);
                if (!tickerResponse.ok) throw new Error('Failed to fetch ticker data');
                const tickerData = await tickerResponse.json();
                return {
                    id: currencyId,
                    name: currencyId,  // Assuming name is the same as the ID
                    price: tickerData.price,
                    volume_24h: tickerData.volume,
                };
            } catch (error) {
                console.error(`Error fetching ticker data for ${currencyId}:`, error);
                return null; // Skip adding this currency if there's an error
            }
        }));

        return detailedProducts.filter(product => product !== null);  // Filter out any null results from failed requests
    } catch (error) {
        console.error('Error fetching cryptocurrencies:', error);
        throw error;
    }
};

export const fetchCurrencyDetails = async (productId) => {
    const url =  `${marketUrl}/products/${productId}/ticker`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch currency details');
        }
        const data = await response.json();
        return {
            name: productId, 
            price: data.price,
            volume: data.volume,
            // Add more details as needed based on the API response
        };
    } catch (error) {
        console.error('Error fetching currency details:', error);
        throw error;
    }
};

export const fetchHistoricalData = async (productId) => {
    const granularity = 86400; // Daily data, in seconds
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);

    const url = `${marketUrl}/products/${productId}/candles?granularity=${granularity}&start=${startDate.toISOString()}&end=${endDate.toISOString()}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch historical data');
        }
        const data = await response.json();
        const formattedData = data.map(item => ({
            time: item[0] * 1000, 
            low: item[1],
            high: item[2],
            open: item[3],
            close: item[4],
            volume: item[5]
        }));

        return formattedData.reverse();
    } catch (error) {
        console.error('Error fetching historical data:', error);
        throw error;
    }
};





















// Function to sign the Coinbase request
const signMessage = async (secret, method, requestPath, body, timestamp) => {
    const encoder = new TextEncoder();
    const key = encoder.encode(window.atob(secret)); // Decode from Base64
    const data = encoder.encode(timestamp + method + requestPath + body);

    const cryptoKey = await window.crypto.subtle.importKey(
        "raw",
        key,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );
    const signature = await window.crypto.subtle.sign("HMAC", cryptoKey, data);
    return window.btoa(String.fromCharCode(...new Uint8Array(signature))); // Encode to Base64
};

export const fetchMarketData = (
    uid,
    apiKey,
    apiSecret,
    passphrase,
    productId
) => {
    const url = `https://api-public.sandbox.pro.coinbase.com/products/${productId}/ticker`;
    const method = "GET";
    const requestPath = `/products/${productId}/ticker`;
    const body = "";
    const timestamp = Math.floor(Date.now() / 1000).toString();

    const signature = signMessage(
        apiSecret,
        method,
        requestPath,
        body,
        timestamp
    );

    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        "CB-ACCESS-KEY": apiKey,
        "CB-ACCESS-SIGN": signature,
        "CB-ACCESS-TIMESTAMP": timestamp,
        "CB-ACCESS-PASSPHRASE": passphrase,
    };

    fetch(url, { method, headers })
        .then((response) => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.json();
        })
        .then((data) => {
            // Store or handle the data as needed
            console.log("Market Data:", data);
            // Optionally update user data with the latest fetched market data
            set(ref(db, `users/${uid}/marketData`), {
                lastFetched: new Date().toISOString(),
                data: data,
            });
        })
        .catch((error) => {
            console.error("Failed to fetch market data:", error);
        });
};

export const formatData = (data) => {
    let finalData = {
        labels: [],
        datasets: [
            {
                label: "Price",
                data: [],
                backgroundColor: "rgb(255, 99, 132, 0.8)",
                borderColor: "rgba(255, 99, 132, 0.2)",
                fill: false,
            },
        ],
    };

    let dates = data.map((val) => {
        const ts = val[0];
        let date = new Date(ts * 1000);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        let final = `${month}-${day}-${year}`;
        return final;
    });

    let priceArr = data.map((val) => {
        return val[4];
    });

    priceArr.reverse();
    dates.reverse();
    finalData.labels = dates;
    finalData.datasets[0].data = priceArr;

    return finalData;
};
