import React, { useState, useEffect } from "react";
import useSensorialLogic from "./useSensorialLogic";

export default function LucesQueCalman() {
  const { startTimer, finish } = useSensorialLogic({
    userId: "test_user",
    moduleName: "Sensorial",
    activityId: "lights_calm_01",
  });

  const [pos, setPos] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    startTimer();
    const interval = setInterval(() => {
      setPos((p) => (p + 1) % 100);
    }, 100);

    const end = setTimeout(async () => {
      clearInterval(interval);
      setFinished(true);
      await finish();
    }, 15000); // 15 segundos de duración

    return () => {
      clearInterval(interval);
      clearTimeout(end);
    };
  }, []);

  if (finished) {
    return (
      <div className="flex items-center justify-center h-screen bg-green-100">
        <h2 className="text-2xl font-semibold text-green-800">
          🌈 ¡Muy bien! Mantuiste la calma.
        </h2>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-gradient-to-b from-blue-200 to-blue-100 overflow-hidden">
      <div
        className="absolute w-12 h-12 bg-blue-500 rounded-full opacity-80 transition-all duration-300"
        style={{
          top: `${40 + 30 * Math.sin(pos / 10)}%`,
          left: `${pos}%`,
        }}
      ></div>
      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-blue-800 text-lg">
        Sigue la luz con la mirada... 🌙
      </p>
    </div>
  );
}
