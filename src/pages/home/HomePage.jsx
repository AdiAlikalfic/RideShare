import "./HomePage.css";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { LiaCarSideSolid, LiaHandHoldingHeartSolid } from "react-icons/lia";
import { LuLogOut } from "react-icons/lu";


function HomePage() {
    const navigate = useNavigate();

    async function handleLogout() {
        const {error} = await supabase.auth.signOut();

        if(error) {
            console.error(error);
        }

        navigate("/auth", { replace: true });
    }

    return (
        <div className="home-page-wrapper">
            <div className="nav">
                <div className="left-side">
                    <div className="logo-icon">
                    <LiaCarSideSolid className="auth-block-header-icon" size={25} color={"white"}/>
                </div>
                <div className="header">
                    <h2>RideShare</h2>
                    <p>Welcome back!</p>
                </div>
                </div>
                <div className="logout-btn">
                    <button className="logout" onClick={handleLogout}>
                        <span>
                            <LuLogOut size={20} color={"black"}/>
                        </span>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    )
}

export default HomePage;