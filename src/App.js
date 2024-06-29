import "./App.css";
import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Main from "./components/Main";
import Dashboard from "./components/Dashboard";
import Strategy from "./components/Strategy";
import Market from "./components/Explore";
import Settings from "./components/Settings";
import Detail from "./components/Detail";
import BackendConnector from './components/BackendConnector';



function App() {

    return (
        <div className="App">
            <BackendConnector />
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/" element={<Main />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/strategy" element={<Strategy />} />
                    <Route path="/explore" element={<Market />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route
                        path="/currencies/:currencyId"
                        element={<Detail />}
                    />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
