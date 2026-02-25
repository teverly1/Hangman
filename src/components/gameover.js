import Misses from "./misses";
import { startConfettiCannon } from "../utils/effects";
import { useEffect, useRef, useState } from "react";

function GameOver({ onNewGame, onReset, gameOver = 1, word = "", missedCount = 0 }) {
    const animationFrameId = useRef(null);
    const hasFetched = useRef(false);
    const [meanings, setMeanings] = useState([]); // Store array of parts of speech
    const [loading, setLoading] = useState(false);

    const winner = gameOver === 1;

    useEffect(() => {
        if (winner) startConfettiCannon(animationFrameId, 5);
        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, [winner]);

    const handleMouseEnter = async () => {
        if (hasFetched.current || loading) return;

        setLoading(true);
        try {
            const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const data = await res.json();

            if (data[0]?.meanings) {
                setMeanings(data[0].meanings); // Set the array of meanings
                hasFetched.current = true;
            }
        } catch (error) {
            console.error("Failed to load definitions");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal">
            <div className="gameover">
                <div>
                    <div className="word-definition-container" onMouseEnter={handleMouseEnter}>
                        {winner?<div className="reveal-word">
                            {word}
                            <svg
                                className="help-icon"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                        </div>:''}

                        <div className="definition-tooltip scrollable">
                            {loading && <p>Loading definitions...</p>}
                            {!loading && meanings.length === 0 && <p>No definitions found.</p>}

                            {meanings.map((m, idx) => (
                                <div key={idx} className="meaning-section">
                                    <span className="part-of-speech">{m.partOfSpeech}</span>
                                    <ul className="definition-list">
                                        {m.definitions.slice(0, 2).map((d, i) => (
                                            <li key={i}>{d.definition}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="status">{winner ? "You Win!" : "Game Over"}</p>
                    <button onClick={onReset}>Restart?</button>
                    <button onClick={onNewGame}>New Game?</button>
                </div>
                <Misses missedCount={missedCount}></Misses>
            </div>
        </div>
    );
}

export default GameOver;