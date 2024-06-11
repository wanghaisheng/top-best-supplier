"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CookieConsent from "react-cookie-consent";

function SiteCookieConsent() {
  const [cookieConsent, setCookieConsent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user has given consent to use cookies
    const cookieConsentStatus = localStorage.getItem("cookieConsent");
    if (cookieConsentStatus === "true") {
      setCookieConsent(true);
    }
  }, []);

  const handleCookieAccept = () => {
    // Set cookie consent status to true
    localStorage.setItem("cookieConsent", "true");
    setCookieConsent(true);
  };

  return (
    <>
      {!cookieConsent && (
        <CookieConsent
          location="bottom"
          buttonText="I Accept"
          onAccept={handleCookieAccept}
        >
          This website uses cookies to enhance the user experience. By
          continuing to use this site, you consent to the use of cookies in
          accordance with our <a href="/privacy-policy">Privacy Policy</a>.
        </CookieConsent>
      )}
    </>
  );
}

export default SiteCookieConsent;
