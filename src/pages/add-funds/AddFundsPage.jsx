import "./AddFundsPage.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { FiArrowLeft } from "react-icons/fi";
import { LuWallet } from "react-icons/lu";
import { LuCreditCard } from "react-icons/lu";
import { LuLock } from "react-icons/lu";
import Input from "../../components/Input";
import Button from "../../components/Button";


function AddFundsPage() {
    const navigate = useNavigate();
    const [walletBalance, setWalletBalance] = useState(0);
    const [amount, setAmount] = useState("");
    const [error, setError] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cardholderName, setCardholderName] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");
    const [loading, setLoading] = useState(false);

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

        function validateCardDetails() {
            if(!cardNumber || !cardholderName || !expiryDate || !cvv) {
                setError("All fields are required!");
                return false;
            }

            if(Number(amount) < 5) {
                setError("Minimum amount is $5");
                return false;
            }

            setError("");
            return true;
        }

        async function handleAddFunds() {
            if(!validateCardDetails()) return;

            try {
                setLoading(true);

                //Get logged in user
                const {
                    data: {user},
                } = await supabase.auth.getUser();

                if(!user) {
                    setError("User not authenticated");
                    setLoading(false);
                    return;
                }

                //Payment processing delay 
                await new Promise((resolve) => setTimeout(resolve, 2000));

                //Get current wallet balance
                const { data: wallet, error: walletError} = await supabase
                    .from("wallets")
                    .select("balance")
                    .eq("user_id", user.id)
                    .single();

                    if(walletError) {
                        console.error(walletError);
                        setError("Failed to retrieve wallet balance");
                        setLoading(false);
                        return;
                    }

                    const newBalance = Number(wallet.balance) + Number(amount);

                    //Update wallet balance
                    const {error: updateError} = await supabase
                        .from("wallets")
                        .update({balance: newBalance})
                        .eq("user_id", user.id);

                        if(updateError) {
                            console.error(updateError);
                            setError("Failed to update wallet balance");
                            setLoading(false);
                            return;
                        }

                        setWalletBalance(newBalance);

                        navigate("/home");
            } catch (err) {
                console.error(err);
                setError("An unexpected error occurred. Please try again.");
            } finally {
                setLoading(false);
            }
        }

    return (
        <div className="add-funds-page-wrapper">
            <div className="add-funds-nav">
                <div className="back-btn">
                    <button className="back" onClick={() => navigate("/home")}>
                        <span><FiArrowLeft /></span>
                        Back
                    </button>
                </div>
                <h3>Add Funds</h3>
            </div>
            <div className="current-balance-block">
                <div className="current-balance-block-top-side">
                    <div className="add-funds-wallet-icon">
                        <LuWallet size={27} color={"white"} />
                    </div>
                    <p>Current Balance</p>
                </div>
                <div className="current-balance">
                    <h1>${walletBalance}</h1>
                </div>
            </div>
            <div className="details-wrapper">
                <div className="amount-select">
                    <p>Select Amount</p>
                    <div className="amount-btns">
                        <button className="amount-btn" onClick={() => setAmount("10")}>
                            $10
                        </button>
                        <button className="amount-btn" onClick={() => setAmount("25")}>
                            $25
                        </button>
                        <button className="amount-btn" onClick={() => setAmount("50")}>
                            $50
                        </button>
                        <button className="amount-btn" onClick={() => setAmount("100")}>
                            $100
                        </button>
                    </div>
                </div>
                <div className="amount-input">
                    <Input type="number" placeholder="Enter custom amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
                <hr className="add-funds-line"/>
                <div className="card-details-section">
                    <div className="card-icon">
                        <LuCreditCard size={20} />
                        <p>Card Details</p>
                    </div>
                    <div className="card-input-fields">
                        <div className="card-number-field">
                        <p>Card Number</p>
                        <Input 
                        type="text"
                        placeholder="1234 5678 9012 3456" 
                        value={cardNumber}
                        onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
                            value = value.substring(0, 16); // Limit to 16 digits

                            const formattedValue = value.match(/.{1,4}/g)?.join(" ") || ""; // Add space after every 4 digits
                            setCardNumber(formattedValue);
                            setError("");
                        }}
                        />
                        </div>
                        <div className="cardholder-name-field">
                        <p>Cardholder Name</p>
                        <Input
                        type="text" 
                        placeholder="John Doe" 
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        />
                        </div>
                        <div className="expiry-date-and-cvv">
                            <div className="expiry-date">
                                <p>Expiry Date</p>
                                <Input
                                type="text" 
                                placeholder="MM/YY" 
                                value={expiryDate}
                                onChange={(e) => {
                                    let value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
                                    value = value.substring(0, 4); // Limit to 4 digits

                                    if (value.length >= 3) {
                                        value = value.substring(0, 2) + "/" + value.substring(2); // Add slash after 2 digits
                                    }

                                    setExpiryDate(value);
                                    setError("");
                                }}
                                />
                            </div>
                            <div className="cvv-number">
                                <p>CVV</p>
                                <Input 
                                type="password" 
                                placeholder="123" 
                                maxLength={3}
                                value={cvv}
                                inputMode="numeric"
                                onChange={(e) => {
                                    let value = e.target.value.replace(/\D/g, ""); // remove non-digits
                                    value = value.substring(0, 3); // limit to 3 digits
                                    setCvv(value);
                                    setError("");
                                }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="secure-payment-note">
                    <div className="security-icon">
                        <LuLock size={20} color={"blue"} />
                        <p>Secure payment</p>
                    </div>
                    <div className="secure-payment-text">
                        <p>Your payment information is encrypted and secure.</p>
                    </div>
                </div>
                <div className="add-to-wallet-btn">
                    {error && <p className="error-message">{error}</p>}
                <Button
                variant="primary"
                onClick={handleAddFunds}
                disabled={loading}
                >
                {loading ? "Processing..." : `Add $${amount || "0.00"} to wallet`}
                </Button>
                </div>
            </div>
        </div>
    )
}

export default AddFundsPage;