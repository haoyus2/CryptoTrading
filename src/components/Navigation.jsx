import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../config/firebase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useUser } from "../contexts/UserContext";
import { readUserData } from "../dbUtils/UserUtils";
import "./Navigation.css";

const Navigation = () => {
    const { username } = useUser();


    const logout = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="h-24">
            <div className="naviContainer">
                <Link to="/" className="homeLink">
                    <header className="homeLogo">Home</header>
                </Link>
                <div className="subpageLinks">
                    <Link to="/strategy" className="naviLink">
                        <header className="naviHeader">Strategy</header>
                    </Link>
                    <Link to="/explore" className="naviLink">
                        <header className="naviHeader">Explore</header>
                    </Link>
                    <Link to="/dashboard" className="naviLink">
                        <header className="naviHeader">Dashboard</header>
                    </Link>
                    {username ? (
                        <div className="naviUsername">
                            <button className="naviUserBtn">{username}</button>
                            <div className="dropdown-menu">
                                <Link to="/settings">User Settings</Link>
                                <a href="#" onClick={logout}>
                                    Logout
                                </a>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="naviUserLogin">
                            <button className="naviUserBtn">Login</button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navigation;
