import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./components/ui/Button";

function LoginPage() {
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/ocr");
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="relative w-full max-w-md h-[500px] perspective-1000">
        <div
          className={`relative w-full h-full duration-700 preserve-3d transition-all ${isFlipped ? "rotate-y-180" : ""}`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* FRONT: Sign Up */}
          <div className="absolute w-full h-full bg-white rounded-2xl shadow-2xl backface-hidden flex flex-col items-center justify-center p-8">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Sign Up</h2>
            <form onSubmit={handleLogin} className="w-full space-y-4">
              <input
                type="text"
                placeholder="Username"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                required
              />
              <Button type="submit" variant="primary" className="w-full py-3 text-lg bg-purple-600 hover:bg-purple-700">
                Sign Up
              </Button>
            </form>
            <p
              onClick={handleFlip}
              className="mt-6 text-sm text-gray-500 cursor-pointer hover:text-purple-600 font-medium"
            >
              Already have an account? Sign In
            </p>
          </div>

          {/* BACK: Sign In */}
          <div
            className="absolute w-full h-full bg-white rounded-2xl shadow-2xl backface-hidden rotate-y-180 flex flex-col items-center justify-center p-8"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Sign In</h2>
            <form onSubmit={handleLogin} className="w-full space-y-4">
              <input
                type="text"
                placeholder="Username"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                required
              />
              <Button type="submit" variant="primary" className="w-full py-3 text-lg bg-pink-600 hover:bg-pink-700 border-none ring-pink-500">
                Sign In
              </Button>
            </form>
            <p
              onClick={handleFlip}
              className="mt-6 text-sm text-gray-500 cursor-pointer hover:text-pink-600 font-medium"
            >
              New user? Sign Up
            </p>
          </div>
        </div>
      </div>
      <style jsx>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </div>
  );
}

export default LoginPage;


