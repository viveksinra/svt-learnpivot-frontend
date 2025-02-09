import React, { useEffect } from 'react';

const TawkToChat = () => {
  useEffect(() => {
    // Create the script element
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://embed.tawk.to/66d89f9850c10f7a00a40715/1i6v2uru9';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    
    // Append the script to the body
    document.body.appendChild(script);

    // Cleanup function to remove the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []); // Empty array means this effect runs once when the component mounts

  return null; // Since the Tawk.to widget works in the background, no need to render anything
};

export default TawkToChat;
