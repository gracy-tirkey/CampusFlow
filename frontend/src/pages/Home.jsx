import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useBackgroundImage from "../hooks/useBackgroundImage";
import { useEffect, useState } from "react";

function Home() {
  const bgImage = useBackgroundImage();
  const [showContent, setShowContent] = useState(false);
  const [animatedText, setAnimatedText] = useState("");

  const fullText = "Welcome to CampusFlow!";

  useEffect(() => {
    setShowContent(true);

    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setAnimatedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar showLogo={true} />

      <div
        className="flex flex-col items-center justify-center h-[80vh] relative text-center overflow-hidden"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-dark/60 backdrop-blur-sm z-0"></div>

        {/* Content */}
        <div className={`relative z-10 px-4 transition-all duration-1000 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
            {animatedText.split("CampusFlow!")[0]}
            <span className="text-primary">
              {animatedText.includes("CampusFlow!") ? "CampusFlow!" : ""}
            </span>
          </h1>

          <p className={`text-gray-200 max-w-xl text-sm sm:text-base md:text-lg transition-all duration-1000 delay-1000 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            A platform where students and teachers can share notes,
            solve doubts, chat, and participate in quizzes.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Home;
