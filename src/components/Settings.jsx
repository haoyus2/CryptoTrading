import React, { useState } from "react";
import { auth } from "../config/firebase";
import Navigation from "./Navigation";
import { changeUsername, changeUserAPI } from "../dbUtils/UserUtils";
import { useUser } from "../contexts/UserContext";
import "./Settings.css";

export default function Settings() {
    const { setUsername } = useUser();
    const [localUsername, setLocalUsername] = useState("");
    const [message, setMessage] = useState("");
    const [apiKey, setAPIKey] = useState("");
    const [apiSecret, setAPISecret] = useState("");
    const [passphrase, setPassphrase] = useState("");
    const [showUserForm, setShowUserForm] = useState(true);
    const [showAPIForm, setShowAPIForm] = useState(false);

    const handleChangeUsername = (event) => {
        setLocalUsername(event.target.value);
    };

    const handleSubmitUsername = async (event) => {
        event.preventDefault();
        if (!localUsername) {
            setMessage("Please enter a valid username.");
            return;
        }
        try {
            const userId = auth.currentUser.uid;
            await changeUsername(userId, localUsername);
            setUsername(localUsername);
            setMessage("Username updated successfully!");
            setLocalUsername("");
        } catch (error) {
            console.error("Failed to update username:", error);
            setMessage("Failed to update username. Please try again.");
        }
    };

    const handleSubmitAPIChange = async (event) => {
        event.preventDefault();
        try {
            const userId = auth.currentUser.uid;
            await changeUserAPI(userId, apiKey, apiSecret, passphrase);
            setMessage("Username updated successfully!");
            setAPIKey("");
            setAPISecret("");
            setPassphrase("");
        } catch (error) {
            console.error("Failed to update username:", error);
            setMessage("Failed to update username. Please try again.");
        }
    };

    const isDisabled = !apiKey || !apiSecret || !passphrase;
    const toggleUserFormVisibility = () => {
        setShowUserForm(true);
        setShowAPIForm(false);
        setLocalUsername("");
    };
    const toggleAPIFormVisibility = () => {
        setShowUserForm(false);
        setShowAPIForm(true);
        setAPIKey("");
        setAPISecret("");
        setPassphrase("");
    };

    return (
        <div>
            <Navigation />
            <div className="font-['Inter'] flex flex-col mt-10">
                <div className=" self-center w-2/3 mt-10 flex flex-row gap-3 px-10">
                    <button
                        className="manageBtn"
                        onClick={toggleUserFormVisibility}
                    >
                        Change Username
                    </button>
                    <button
                        className="manageBtn"
                        onClick={toggleAPIFormVisibility}
                    >
                        Manage API Settings
                    </button>
                </div>
                <div className=" self-center w-2/3 p-20 rounded-3xl bg-white/60 ">
                    {showUserForm && (
                        <form
                            className="setUsername"
                            onSubmit={handleSubmitUsername}
                        >
                            <div className="UsernameInputs">
                                <div className="flex flex-col">
                                    <p className="self-start pl-1">username</p>
                                    <input
                                        className="changeUsernameInput"
                                        type="text"
                                        value={localUsername}
                                        onChange={handleChangeUsername}
                                        placeholder="Enter new username"
                                    />
                                </div>
                            </div>
                            <button type="submit" className="changeUsernameBtn">
                                Change
                            </button>
                        </form>
                    )}
                    {showAPIForm && (
                        <form
                            onSubmit={handleSubmitAPIChange}
                            className="setAPI"
                        >
                            <div className="APIInputs">
                                <div className="flex flex-col">
                                    <p className="self-start pl-1">API Key</p>
                                    <input
                                        type="password"
                                        value={apiKey}
                                        onChange={(e) =>
                                            setAPIKey(e.target.value)
                                        }
                                        placeholder="API key"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <p className="self-start pl-1">
                                        API Secret
                                    </p>
                                    <input
                                        type="password"
                                        value={apiSecret}
                                        onChange={(e) =>
                                            setAPISecret(e.target.value)
                                        }
                                        placeholder="API Secret"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <p className="self-start pl-1">
                                        Passphrase
                                    </p>
                                    <input
                                        type="password"
                                        value={passphrase}
                                        onChange={(e) =>
                                            setPassphrase(e.target.value)
                                        }
                                        placeholder="Passphrase"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isDisabled}
                                className="changeAPIBtn"
                            >
                                Submit
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
