import Misses from "./misses";
import confetti from 'canvas-confetti';
import { useEffect, useRef } from "react";

function makeBouncyLetters(word) {
    const wordSplit = word.split('');
    return wordSplit.map((letter, index) => {
        return <span key={index} className="winner-animation">{letter}</span>
    })
}

function GameOver({ onNewGame, onReset, gameOver = 1, word = "", missedCount = 0 }) {
    const animationFrameId = useRef(null),
        winner = gameOver === 1;
    let statusMessage = winner ? makeBouncyLetters("You Win!") : "Game Over";

    useEffect(() => {
        if (winner) {
            showConfetti();
        }
        // The cleanup function
        return stopAnnimation
    }, [])

    function showConfetti() {
        let end = Date.now() + (15 * 1000);
        const colors = ['#4A90E2', '#2ecc71', '#f1c40f'];

        (function frame() {
            const colors = ['#4A90E2', '#2ecc71', '#f1c40f'];

            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) {
                animationFrameId.current = requestAnimationFrame(frame);
            }
        }())
    }

    function stopAnnimation() {
        // Cancel the animation frame request when the component unmounts
        if (animationFrameId && animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
        }
    }

    //todo add button to show the word on a loss
    return <div className="modal">
        <div className="gameover">
            <div>
                {
                    winner ? <div>{word}</div> : ''
                }
                <p className="status">{statusMessage}</p>
                <button onClick={onReset}>Restart?</button>
                <button onClick={onNewGame}>New Game?</button>
            </div>
            <Misses missedCount={missedCount}></Misses>
        </div>
    </div>
}

export default GameOver;