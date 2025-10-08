import React, { useEffect, useState } from "react";
import useSensorialLogic from "./useSensorialLogic";

export default function PulsoMusical() {
  const {
    startTimer,
    incrementCorrect,
    incrementError,
    finish,
    state
  } = useSensorialLogic({
    userId: "test_user",
    moduleName: "Sensorial",
    activityId: "pulso_musical_01",
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [beat, setBeat] = useState(false);
  const [round, setRound] = useState(0);
  const [finished, setFinished] = useState(false);

  // ritmo cada X ms (ej. 1 seg)
  const BEAT_INTERVAL = 1000;
  const TOTAL_ROUNDS = 10;

  useEffect(() => {
    if (!isPlaying) return;
    startTimer();
    const interval = setInterval(() => {
      setBeat(true);
      setTimeout(() => setBeat(false), 200);
      setRound((r) => r + 1);
    }, BEAT_INTERVAL);

    const end = setTimeout(async () => {
      clearInterval(interval);
      setFinished(true);
      await finish();
    }, TOTAL_ROUNDS * BEAT_INTERVAL + 500);

    return () => {
      clearInterval(interval);
      clearTimeout(end);
    };
  }, [isPlaying]);

  function handleTap() {
    if (!isPlaying || finished) return;
    const now = performance.now();
    const timeFromBeat = now % BEAT_INTERVAL;
    const tolerance = 150; // ms de margen
    if (timeFromBeat < tolerance || timeFromBeat > BEAT_INTERVAL - tolerance) {
      incrementCorrect();
    } else {
      incrementError();
    }
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-indigo-100">
      {!isPlaying && !finished && (
        <button
          onClick={() => setIsPlaying(true)}
          className="bg-indigo-500 text-white px-6 py-3 rounded-lg text-lg"
        >
          🎵 Iniciar Pulso Musical
        </button>
      )}

      {isPlaying && !finished && (
        <>
          <div
            className={`w-32 h-32 rounded-full transition-all duration-150 ${
              beat ? "bg-indigo-600 scale-125" : "bg-indigo-300 scale-100"
            }`}
          ></div>

          <button
            onClick={handleTap}
            className="mt-8 bg-purple-500 text-white px-6 py-3 rounded-lg text-lg"
          >
            Pulsa al ritmo
          </button>

          <p className="mt-4 text-lg text-indigo-700">
            Ronda {round}/{TOTAL_ROUNDS}
          </p>
          <p className="text-sm text-gray-600">
            Aciertos: {state.correct} | Errores: {state.errors}
          </p>
        </>
      )}

      {finished && (
        <div className="text-center text-indigo-800">
          <h2 className="text-2xl font-bold mb-2">¡Buen ritmo! 🥁</h2>
          <p>
            Lograste {state.correct} aciertos y {state.errors} errores.
          </p>
        </div>
      )}
    </div>
  );
}
