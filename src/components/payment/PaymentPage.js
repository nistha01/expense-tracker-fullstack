import React, { useState } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import { createOrder, fetchStatusFromDB } from "../api";
import { useAuth } from "../auth/authContext";
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        amount: "",
        phone: ""
    });

    const [paymentStatus, setPaymentStatus] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const { setPremium } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePay = async () => {
        if (!formData.amount || !formData.phone) {
            alert("Please fill all the fields.");
            return;
        }

        setIsProcessing(true);



        console.log("first try")
        try {
            const user = JSON.parse(sessionStorage.getItem("authUser"));
            const response = await createOrder({
                userId: user.userID,
                orderAmount: formData.amount,
                email: user.email,
                customer_phone: formData.phone
            });
            console.log("Backend Response: ", response.data);

            const { paymentSessionId, orderId } = response.data;

            const cashfree = await load({ mode: "sandbox" });

            let checkoutOptions = {
                paymentSessionId: paymentSessionId,
                redirectTarget: document.getElementById("cf_checkout"),
                appearance: {
                    layout: "POPUP",
                    theme: "LIGHT",
                    width: "425px",
                    height: "800px",
                    borderRadius: "8px"
                },
            };

            cashfree.checkout(checkoutOptions).then(async (result) => {
                if (result.error) {
                    console.log("Payment Error:", result.error);
                    setIsProcessing(false);
                }

                if (result.redirect) {
                    console.log("Payment will be redirected.");
                }

                if (result.paymentDetails) {
                    console.log("Payment Completed.");
                    console.log(result.paymentDetails.paymentMessage);

                    try {
                        const statusResponse = await fetchStatusFromDB(orderId);
                        console.log("Fetched Payment Status Raw: ", statusResponse);

                        const status = statusResponse?.data?.order_status || statusResponse?.data?.status;

                        setPaymentStatus(status || "Unknown");

                        if (status === "SUCCESS") {
                            sessionStorage.setItem("isPremium", "true");
                            console.log("Premium set to true");
                            
                        }
                        navigate("/");

                    } catch (statusError) {
                        console.error("Error fetching payment status:", statusError);
                        setPaymentStatus("Error fetching status");
                    }
                }

                setIsProcessing(false);
            });
        } catch (error) {
            console.error("Payment initialization failed", error);
            alert("Payment failed. Try again.");
            setIsProcessing(false);
        }
    };

    return (
        <div className="payment-page">
            <h2>Premium Payment</h2>
            <input
                type="number"
                name="amount"
                placeholder="Enter Amount"
                value={formData.amount}
                onChange={handleChange}
            />

            <input
                type="text"
                name="phone"
                placeholder="Enter Phone"
                value={formData.phone}
                onChange={handleChange}
            />

            <button onClick={handlePay} disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Pay Now"}
            </button>

            <div id="cf_checkout" style={{ marginTop: "20px", marginLeft: "500px" }}></div>

            {paymentStatus && (
                <div style={{ marginTop: "20px" }}>
                    <h4>Payment Status: {paymentStatus}</h4>
                </div>
            )}
        </div>
    );
};

export default PaymentPage;
