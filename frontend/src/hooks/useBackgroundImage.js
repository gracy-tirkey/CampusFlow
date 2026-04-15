import { useEffect, useState } from "react";

const images = Array.from({ length: 10 }, (_, i) => `/images/lc-${i}.jpg`);
const getRandomImage = () => images[Math.floor(Math.random() * images.length)];

export default function useBackgroundImage() {
  const [bg, setBg] = useState(getRandomImage);

  useEffect(() => {
    const interval = setInterval(() => {
      setBg(getRandomImage());
    }, 60000); // change every 1 min

    return () => clearInterval(interval);
  }, []);

  return bg;
}
