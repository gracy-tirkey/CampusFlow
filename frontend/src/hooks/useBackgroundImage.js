import { useEffect, useState } from "react";

const images = Array.from({ length: 10 }, (_, i) => `/images/lc-${i}.jpg`);

export default function useBackgroundImage() {
  const [bg, setBg] = useState(images[Math.floor(Math.random() * images.length)]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomImage = images[Math.floor(Math.random() * images.length)];
      setBg(randomImage);
    }, 60000); // change every 1 min

    return () => clearInterval(interval);
  }, []);

  return bg;
}
