import { useEffect, useState } from 'react';

const Typewriter = ({ textArray }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentText, setCurrentText] = useState(' ');

  useEffect(() => {
    let intervalId;

    if (currentIndex < textArray.length) {
      intervalId = setInterval(() => {
        setCurrentText((prevText) => {
          if (prevText === textArray[currentIndex]) {
            clearInterval(intervalId);
            setCurrentIndex((prevIndex) => (prevIndex + 1) % textArray.length);
            return '';
          }
          return textArray[currentIndex].substring(0, prevText.length + 1);
        });
      }, 300); // Typing speed, adjust as needed
    }

    return () => clearInterval(intervalId);
  }, [currentIndex, textArray]);

  return <>{currentText}</>;
};

const TypeWriterCom = () => {
  const textArray = ["Scholars!","", "Doctors!","", "Engineers!","", "Scientists!"];

  return <Typewriter textArray={textArray} />;
};

export default TypeWriterCom;
