import "./AuthPage.css";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { LiaCarSideSolid, LiaHandHoldingHeartSolid } from "react-icons/lia";
import Input from "../../components/Input";
import Button from "../../components/Button";

function AuthPage() {
    const [isSignIn, setIsSignIn] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    function toggleAuthMode() {
        setIsSignIn(isSignIn => !isSignIn);
        setError("");
        setEmail("");
        setPassword("");
        setName("");
    }

    async function handleSignIn() {
        const {data, error} = 
        await supabase.auth.signInWithPassword({
            email,
            password
        });

        if(error) {
            console.log(error.message);
            setError(error.message);
            return;
        }

        navigate("/home", { replace: true });
    }

    async function handleSignUp() {

        if(confirmPassword !== password) {
            setError("Passwords do not match");
            return;
        } else if (!name || !email || !password || !confirmPassword) {
            setError("All fields are required!");
            return;
        }

        setError("");

        const {data, error} =
        await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name,
                },
            },
        });

        if(error) {
            console.log(error.message);
            return;
        }

        alert("Account created, you can now Sign In!");
        setIsSignIn(true);
    }

    useEffect(() => {
        supabase.auth.getSession().then(({data}) =>{
            if (data.session) {
                navigate("/home", { replace: true });
            }
        });
    }, []);
    

    return (
        <div className="main-wrapper">
            <div className="auth-block">
                <div className="auth-block-header">
                    <div className="logo-icon">
                    <LiaCarSideSolid className="auth-block-header-icon" size={40} color={"white"}/>
                    </div>
                    <div className="header">
                        <h1>RideShare</h1>
                        <p>Welcome back!</p>
                    </div>
                    </div>
                    <div className="input-fields">
                        {error && <p className="signin-error">{error}</p>}
                        {!isSignIn && <div className="name-field">
                        <p>Name</p>
                        <Input 
                        type="text" 
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        />
                        </div>}
                        <div className="email-field">
                        <p>Email</p>
                        <Input 
                        type="text" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        />
                        </div>
                        <div className="password-field">
                        <p>Password</p>
                        <Input 
                        type="password" 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />
                        </div>
                        {!isSignIn && <div className="confirm-password-field">
                        <p>Confirm Password</p>
                        <Input 
                        type="password" 
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        </div>}
                    </div>
                    <p className="forgot-password">Forgot password?</p>
                    <div className="signin-button">
                        <Button variant="primary" onClick={isSignIn ? handleSignIn : handleSignUp}>
                            {isSignIn ? "Sign In" : "Create Account"}
                        </Button>
                    </div>
                    <div className="sign-up-link">
                        {isSignIn ? <p>Don't have an account? <span className="sign-up" onClick={toggleAuthMode}>Sign Up</span></p>
                        :
                        <p>Already have an account? <span className="sign-up" onClick={toggleAuthMode}>Sign In</span></p>}
                    </div>
            </div>
        </div>
    )
}

export default AuthPage;