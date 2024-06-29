import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../config/firebase";
import {
    GoogleAuthProvider,
    signInWithPopup,
    // getAuth,
    deleteUser,
} from "firebase/auth";

import Navigation from "./Navigation";
import { checkUserExists } from "../dbUtils/UserUtils";
import "./Login.css";

const Login = () => {
    const [signInError, setSignInError] = useState(null);
    const navigate = useNavigate();

    const signInWithGoogle = async () => {
        // const auth = getAuth();
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // check user already exists
            const userExists = await checkUserExists(user.uid);
            if (userExists) {
                console.log("User exists, login successful.");
                navigate("/");
            } else {
                await deleteUser(user);
                setSignInError("No account found. Please sign up.");
            }
        } catch (error) {
            console.error("Error signing in with Google:", error);
            setSignInError("Failed to sign in with Google. Please try again.");
        }
    };

    return (
        <div>
            <Navigation />
            <div className="loginContainer">
                <div className="loginArea">
                    <div className="loginTitle">
                        <header>Login</header>
                    </div>
                    <div className="googleLogin">
                        <button onClick={signInWithGoogle}>
                            <img src="/google-icon.png" alt="Google" />
                            Sign in with Google
                        </button>
                        <div className="signupIfNoAccount">
                            <div>Don’t have an account?&nbsp;</div>
                            <Link to="/signup" className="linkToSignUp">
                                Sign up
                            </Link>
                        </div>
                        <div className="login_error">
                            {signInError && <p>{signInError}</p>}
                        </div>
                    </div>
                    <p className="loginInfo">
                        By clicking continue, you agree to our Terms of Service
                        and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
