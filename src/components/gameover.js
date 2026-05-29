import Misses from "./misses";
import { startConfettiCannon } from "../utils/effects";
import { useEffect, useRef, useState } from "react";

function GameOver({ onNewGame, onReset, gameOver = 1, word = "", missedCount = 0 }) {
    const animationFrameId = useRef(null);
    const hasFetched = useRef(false);
    const buttonNewRef = useRef(null);
    const buttonResetRef = useRef(null);
    const [meanings, setMeanings] = useState([]); // Store array of parts of speech
    const [loading, setLoading] = useState(false);

    const winner = gameOver === 1;

    useEffect(() => {
        let current = null,
            focusRef = buttonResetRef;
        if (winner) {
            current = startConfettiCannon(animationFrameId, 5);
            focusRef = buttonNewRef;
        }
        if (focusRef.current) {
            focusRef.current.focus();
        }
        return () => {
            if (current) cancelAnimationFrame(current);
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
                        {winner ? <div className="reveal-word">
                            {word}
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="help-icon" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                <path d="M12 17V15.5M12 13.5C13.5 13.5 15 12.5 15 10.5C15 8.5 13.5 7 11.5 7C9.7 7 8.5 8.2 8.1 9.5"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round" />
                            </svg>
                        </div> : ''}

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
                    <button onClick={onReset} ref={buttonResetRef}>Restart?</button>
                    <button onClick={onNewGame} ref={buttonNewRef}>New Game?</button>
                </div>
                <Misses missedCount={missedCount}></Misses>
            </div>
        </div>
    );
}

export default GameOver;