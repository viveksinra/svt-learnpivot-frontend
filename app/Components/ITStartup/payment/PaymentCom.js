import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDateToShortMonth } from "@/app/utils/dateFormat";

const PaymentCom = ({ data, isLoading = false, onRefresh }) => {
  const [pollingActive, setPollingActive] = useState(false);

  // Add useEffect for polling when status is not succeeded
  useEffect(() => {
    let intervalId;
    
    // Start polling only when we have data and status is not succeeded
    if (data && data.status && data.status.toLowerCase() !== "succeeded") {
      console.log("Starting payment status polling...");
      setPollingActive(true);
      
      intervalId = setInterval(() => {
        console.log("Polling payment status...");
        onRefresh(); // This calls the API to check the latest status
      }, 10000); // Poll every 10 seconds
    } else if (data && data.status && data.status.toLowerCase() === "succeeded") {
      console.log("Payment succeeded, stopping polling");
      setPollingActive(false);
    }
    
    // Cleanup function
    return () => {
      if (intervalId) {
        console.log("Clearing polling interval");
        clearInterval(intervalId);
      }
    };
  }, [data, onRefresh]);

  if (isLoading) {
    return (
      <div className="overview-area ptb-100">
        <div className="container">
          <div className="overview-box it-overview">
            <div className="overview-content">
              <div className="content">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="h-4 bg-gray-200 rounded w-3/4"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  // Helper function to determine payment state
  const getPaymentState = (status) => {
    if (!status) return "pending";
    switch (status.toLowerCase()) {
      case "succeeded":
        return "success";
      case "processing":
        return "processing";
      default:
        return "failed";
    }
  };

  const paymentState = getPaymentState(data.status);

  const paymentDetails = {
    amount: data.amount ? data.amount.toFixed(2) : "N/A",
    refNo: data.refNo || "N/A",
    paymentDate: data.paymentDate ? formatDateToShortMonth(data.paymentDate) : "N/A",
    status: data.status || "pending",
    testUrl: data.testUrl || "#",
  };

  const stateConfig = {
    success: {
      title: "Payment Successful",
      description: "Congratulations! Your payment was successful.",
      image: "/images/services/it-service1.png",
      imageAlt: "success image",
      imageWidth: 852,
      imageHeight: 580,
      buttonText: "Go to Dashboard",
      buttonUrl: "/userDash",
      showButton: true,
    },
    processing: {
      title: "Payment Processing",
      description: "Your payment is currently being processed. Please wait.",
      image: "/images/services/it-service1.png",
      imageAlt: "processing image",
      imageWidth: 852,
      imageHeight: 580,
      buttonText: "Buy Again",
      buttonUrl: paymentDetails.testUrl,
      showButton: true,
    },
    pending: {
      title: "Payment Pending",
      description: "Your payment is pending confirmation.",
      image: "/images/services/it-service1.png",
      imageAlt: "pending image",
      imageWidth: 852,
      imageHeight: 580,
      buttonText: "Buy Again",
      buttonUrl: paymentDetails.testUrl,
      showButton: true,
    },
    failed: {
      title: "Payment Failed",
      description: "Payment failed description",
      image: "/images/services/it-service2.png",
      imageAlt: "failure image",
      imageWidth: 770,
      imageHeight: 582,
      buttonText: "Try Again",
      buttonUrl: paymentDetails.testUrl,
      showButton: true,
    },
  };

  const content = stateConfig[paymentState];

  const PaymentInfo = () => (
    <div className="content">
      <h2>{content.title}</h2>
      <p>{content.description}</p>
      <ul className="features-list">
        <li>
          <span>
            <i className="bx bxs-badge-check"></i> Amount: £{paymentDetails.amount}
          </span>
        </li>
        <li>
          <span>
            <i className="bx bxs-badge-check"></i> Ref : {paymentDetails.refNo}
          </span>
        </li>
        <li>
          <span>
            <i className="bx bxs-badge-check"></i> Payment Date: {paymentDetails.paymentDate}
          </span>
        </li>
        <li>
          <span>
            <i className="bx bxs-badge-check"></i> Status: {paymentDetails.status === "succeeded" ? "Completed" : paymentDetails.status}
          </span>
        </li>
      </ul>
      {content.showButton && (
        <div className="rm-btn">
          <Link href={content.buttonUrl} className="default-btn gradient-btn">
            {content.buttonText} <span></span>
          </Link>
          {paymentState === "processing" && (
            <button onClick={onRefresh} className="default-btn gradient-btn ml-2">
              Refresh <span></span>
            </button>
          )}
        </div>
      )}
    </div>
  );

  const PaymentImage = () => (
    <div
      className="overview-image"
      data-aos="fade-up"
      data-aos-duration="800"
      data-aos-delay="100"
      data-aos-once="true"
    >
      <div className="image">
        <Image
          src={content.image}
          alt={content.imageAlt}
          width={content.imageWidth}
          height={content.imageHeight}
          loading="lazy"
        />
      </div>
    </div>
  );

  return (
    <div className="overview-area ptb-100">
      <div className="container">
        <div className="overview-box it-overview">
          {paymentState === "failed" ? (
            <>
              <div className="overview-content">
                <PaymentInfo />
              </div>
              <PaymentImage />
            </>
          ) : (
            <>
              <PaymentImage />
              <div className="overview-content">
                <PaymentInfo />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentCom;