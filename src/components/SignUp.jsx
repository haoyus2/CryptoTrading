import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import Navigation from "./Navigation";
import { writeUserData, checkUserExists } from "../dbUtils/UserUtils";
import "./SignUp.css";

const SignUp = () => {
    const [signUpError, setSignUpError] = useState(null);
    const navigate = useNavigate();

    const signUpWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // check user already signed up
            const userExists = await checkUserExists(user.uid);
            if (userExists) {
                setSignUpError("Account already exists, please go to login.");
            } else {
                writeUserData(user.uid, user.displayName, user.email);
                navigate("/");
            }
        } catch (error) {
            console.error("Error signing up with Google:", error);
            setSignUpError("Failed to sign up with Google. Please try again.");
        }
    };

    return (
        <div>
            <Navigation />
            <div className="signupContainer">
                <div className="signupArea">
                    <div className="signupTitle">Create an Account</div>
                    <div className="googleSignup">
                        <button onClick={signUpWithGoogle}>
                            <img src="/google-icon.png" alt="Google" />
                            Sign up with Google
                        </button>
                        <div className="loginIfHaveAccount">
                            <div>Already have an account?&nbsp;</div>
                            <Link to="/login" className="linkToLogin">
                                Login
                            </Link>
                        </div>
                        <div className="signup_error">
                            {signUpError && <p>{signUpError}</p>}
                        </div>
                    </div>
                    <p className="signupInfo">
                        By clicking continue, you agree to our Terms of Service
                        and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
