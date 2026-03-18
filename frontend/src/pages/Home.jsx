import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useBackgroundImage from "../hooks/useBackgroundImage";


function Home() {
  const bgImage = useBackgroundImage();

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
        <div className="relative z-10 px-4">
          <h1 className="text-5xl font-bold mb-6 text-white">
            Welcome to NoteNest
          </h1>

          <p className="text-gray-200 max-w-xl">
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
