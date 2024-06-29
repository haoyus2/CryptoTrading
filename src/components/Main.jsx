import React, { useState, useEffect } from "react";
import Navigation from "./Navigation";
import { Link } from "react-router-dom";
import { auth } from "../config/firebase";
import { useUser } from "../contexts/UserContext";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { fetchStrategies } from "../dbUtils/StrategyUtils";

const Main = () => {
    const { username } = useUser();
    const [strategies, setStrategies] = useState([]);

    useEffect(() => {
        fetchStrategies().then(setStrategies);
    }, [auth.currentUser]);

    return (
        <div>
            <Navigation />
            <div className="m-36">
                <div className="bg-light-grey/50 p-10 rounded-3xl ">
                    <h1 className="font-['Lora'] font-bold text-6xl text-dark-blue ">
                        Embark on a Wonderful Journey of Cryptocurrency Trading
                        with Us!
                    </h1>
                    <p className="mt-5 font-['Lora'] font-medium text-lg text-black">
                        Trade Crypto, Zero Barriers, Pure Simplicity.
                    </p>
                    {username ? (
                        <></>
                    ) : (
                        <Link to="/signup">
                            <button className="  w-32 bg-dark-blue text-white p-2 rounded-xl">
                                Sign Up Now
                            </button>
                        </Link>
                    )}
                </div>
                <div className="mt-28 flex flex-col">
                    <h1 className="self-start font-['Lora'] px-5 font-bold text-3xl text-dark-blue ">
                        Featured Trading Strategies
                    </h1>
                    <p className=" self-start font-['Lora'] px-5 font-medium text-lg text-light-grey">
                        Discover our top-performing cryptocurrency trading
                        strategies designed to maximize your returns:
                    </p>
                    <div>
                        <Link to="/strategy">
                            <div className=" py-5 rounded-3xl flex flex-row gap-2 ">
                                {strategies.map((strategy) => (
                                    <div
                                        className=" py-5 px-20 min-h-60 rounded-[20px] self-center flex flex-row justify-between bg-light-grey/50"
                                        key={strategy.firebaseKey}
                                    >
                                        <h2 className="self-center font-['Lora'] font-bold text-base text-dark-blue">
                                            {strategy.name}:
                                        </h2>
                                        <p className="self-center font-['Lora'] font-normal text-base">
                                            {strategy.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Link>
                    </div>
                </div>
                {/* <div>
                    <h1>Explore Real-time Market Data</h1>
                    <Link to="/explore">
                        <ul>
                            <li>details</li>
                            <li>details</li>
                            <li>details</li>
                        </ul>
                    </Link>
                </div> */}
            </div>
        </div>
    );
};

export default Main;
