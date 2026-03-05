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
    const [destination, setDestination] = useState(null);
    const [pickup, setPickup] = useState(null);
    const [distance, setDistance] = useState(null);
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

            if(!user) return;

            const { data, error} = await supabase
                .from("wallets")
                .select("balance")
                .eq("user_id", user.id)
                .single();

                if(error) {
                    console.error(error);
                } else {
                    setWalletBalance(data.balance);
                }
        }
        fetchWalletBalance();
    }, []);

    function calculateDistance(coord1, coord2) {
        const R = 6371; // Earth radius in km
        const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
        const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((coord1.lat * Math.PI) / 180) *
            Math.cos((coord2.lat * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    useEffect(() => {
        if (pickup && destination) {
            const dist = calculateDistance(pickup, destination);
            setDistance(dist);
        }
    }, [pickup, destination])

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
                                    {pickup && 
                                    (<h4 className="pickup-street-address">
                                        {pickup.lat.toFixed(4)}, {pickup.lng.toFixed(4)}
                                    </h4>)}
                                </div>
                            </div>
                            <div className="destination">
                                <div className="location-icon">
                                    <CiLocationOn size={20} color={"blue"} />
                                </div>
                                <div className="destination-address">
                                    <p>Destination</p>
                                    {destination && 
                                    (<h4 className="destination-street-address">
                                        {destination.lat.toFixed(4)}, {destination.lng.toFixed(4)}
                                    </h4>)}
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
                        <Map 
                        onLocationSelect={(coords) => setDestination(coords)}
                        onPickupDetected={(coords) => setPickup(coords)}
                        pickup={pickup}
                        destination={destination}
                        />
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}

export default HomePage;