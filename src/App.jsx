import { useState, useEffect } from "react";
import "./App.css";

function App() {
const [phase, setPhase] = useState("idle");
const [startTime, setStartTime] = useState(null);
const [reactionTime, setReactionTime] = useState(null);
const [results, setResults] = useState([]);
const [difficulty, setDifficulty] = useState("medium")

const getDelayRange = () => {
  switch (difficulty) {
    case "easy":
      return [3000, 6000];
    case "hard":
      return [500, 2000];
    default:
      return [1000, 4000];
  }
};

const bestScore = results.length
  ? Math.min(...results)
  : null;

useEffect(() => {
  if (phase === "waiting") {
    const [min, max] = getDelayRange();
    const delay = Math.random() * (max - min) + min;

    const timeout = setTimeout(() => {
      setPhase("ready");
      setStartTime(Date.now());
    }, delay);

    return () => clearTimeout(timeout);
  }
}, [phase]);

  return (
    <div className="App">
      <h1>Reaction Time Tester</h1>

      {phase === "idle" && (
        <button onClick={() => setPhase("waiting")}>
          Start
        </button>
      )}

      <div className="difficulty">
          <button
          onClick={() => setDifficulty("easy")}
          disabled={phase !== "idle"}
          >
            Easy
          </button>
          <button 
          onClick={() => setDifficulty("medium")}
          disabled={phase !== "idle"}
          >
            Medium
          </button>
          <button 
          onClick={() => setDifficulty("hard")}
          disabled={phase !== "idle"}
          >
            Hard
          </button>
      </div>

      <div
        className={`game-box ${phase}`}
        onClick={() => {
          if (phase === "ready") {
            const time = Date.now() - startTime;
            setReactionTime(time);
            setResults(prev => [time, ...prev.slice(0, 4)]);
            setPhase("finished");
          } else if (phase === "waiting") {
            setPhase("idle");
            alert("Too early!");
          }
        }}
      >
        {phase === "waiting" && <p>Wait for green...</p>}
        {phase === "ready" && <p>CLICK!</p>}
        {phase === "finished" && (
          <>
          <p>Your reaction time: {reactionTime} ms</p>
          <button onClick={() => setPhase("idle")}>
            Try Again
          </button>
          </>
        )}
      </div>

      {bestScore && (
        <p className="best">
          Best Score: {bestScore} ms
        </p>
      )
      }

      {results.length > 0 && (
        <div className="history">
          <h3>Last Attempts</h3>
          <ul>
            {results.map((res, index) => (
              <li key={index}>{res} ms</li>
            ))}
          </ul>
          </div>
        )}
    </div>
  );
}

export default App;