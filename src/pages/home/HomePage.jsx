import "./HomePage.css";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { LiaCarSideSolid, LiaHandHoldingHeartSolid } from "react-icons/lia";
import { LuLogOut, LuDollarSign, LuWallet } from "react-icons/lu";
import { CiLocationOn } from "react-icons/ci";
import Map from "../../components/Map";

function HomePage() {
    const [walletBalance, setWalletBalance] = useState(0);
    const navigate = useNavigate();

    async function handleLogout() {
        const {error} = await supabase.auth.signOut();

        if(error) {
            console.error(error);
        }

        navigate("/auth", { replace: true });
    }

    useEffect(() => {
        async function fetchWalletBalance() {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if(user) return;

            const { data, error} = await supabase
                .from("profiles")
                .select("wallet_balance")
                .eq("id", user.id)
                .single();

                if(error) {
                    console.error(error);
                } else {
                    setWalletBalance(data.wallet_balance);
                }
        }
        fetchWalletBalance();
    }, []);

    return (
        <div className="home-page-wrapper">
            <div className="home-container">
                <div className="nav">
                <div className="left-side-nav">
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
            <div className="home-content">
                <div className="left-side-content">
                    <div className="wallet-block">
                        <div className="top-side">
                            <div className="wallet-icon">
                            <LuWallet size={30} color={"green"} />
                        </div>
                        <div className="wallet-balance">
                            <p>Wallet Balance</p>
                            <h2>${walletBalance}</h2>
                        </div>
                        </div>
                        <div className="add-funds-btn">
                            <button onClick={() => navigate("/add-funds")}>Add Funds</button>
                        </div>
                    </div>
                    <div className="ride-cost-block">
                        <div className="top-side">
                        <div className="dollar-icon">
                            <LuDollarSign size={30} color={"white"} />
                        </div>
                        <div className="est-ride-cost">
                            <p>Estimated ride cost</p>
                            <h2>$50</h2>
                        </div>
                        </div>
                        <hr />
                        <div className="price-note">
                            <p>Based on current location</p>
                            <p className="price-warning">Price may vary based on traffic & demand</p>
                        </div>
                    </div>
                    <div className="trip-details-block">
                        <h3>Trip details</h3>
                        <div className="locations">
                            <div className="pickup-location">
                                <div className="location-icon">
                                    <CiLocationOn size={20} color={"green"} />
                                </div>
                                <div className="pickup-location-address">
                                    <p>Pickup</p>
                                    <h4 className="pickup-street-address">
                                        123 Main St, City, State
                                    </h4>
                                </div>
                            </div>
                            <div className="destination">
                                <div className="location-icon">
                                    <CiLocationOn size={20} color={"blue"} />
                                </div>
                                <div className="destination-address">
                                    <p>Destination</p>
                                    <h4 className="destination-street-address">
                                        123 Main St, City, State
                                    </h4>
                                </div>
                            </div>
                        </div>
                        <div className="ride-request-btn">
                            <button>Request Ride</button>
                        </div>
                    </div>
                </div>
                <div className="right-side-content">
                    <h3>Your Route</h3>
                    <div className="map-container">
                        <Map />
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}

export default HomePage;