import { useState, useEffect } from "react";
import LetterButton from "./letterbutton";
import Misses from "./misses";
import Word from "./word";
import GameOver from "./gameover";
import DifficultySelector from "./difficultyselector";
import DynamicVideoLoader from './dynamicvideoloader';

function Gameboard(props) {
    const [word, setWord] = useState("eabcefg"),
        [wordLength, setWordLength] = useState(7),
        [loading, setLoading] = useState(false),
        [uniqueLetters, setUniqueLetters] = useState(getUniqueLetters(word)),
        [allGuesses, setAllGuesses] = useState({}),
        [correctGuesses, setCorrectGuesses] = useState({}),
        [missedCount, setMissedCount] = useState(0),
        [gameOver, setGameOver] = useState(0),
        failedCount = 5;

    async function getAWord() {
        setLoading(true);
        try {
            const response = await fetch(`https://random-word-api.herokuapp.com/word?length=${wordLength}&number=1`);
            const data = await response.json();

            if (Array.isArray(data) && data.length > 0) {
                const newWord = data[0].toUpperCase();
                setWord(newWord);
                setUniqueLetters(getUniqueLetters(newWord));
            }
        } catch (error) {
            console.error("Fetch failed:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        restart(); // Automatically get a new word with the new length
    }, [wordLength])

    useEffect(() => {
        const handlePhysicalKeyDown = (event) => {
            // 1. Only capture A-Z keys
            const key = event.key.toUpperCase();

            // Check if it's a single letter between A and Z
            if (key.length === 1 && key >= 'A' && key <= 'Z') {
                // 2. Call your existing guess handler
                onLetterGuessed(key);
            }
        };

        // Add the listener to the window
        window.addEventListener('keydown', handlePhysicalKeyDown);

        // Cleanup function: Remove the listener when the component is destroyed
        return () => {
            window.removeEventListener('keydown', handlePhysicalKeyDown);
        };
    }, [onLetterGuessed]); // Dependency ensures the listener uses the latest handler logic

    function onLetterGuessed(letter) {
        let newAllGuesses = { ...allGuesses },
            newCorrectGuesses,
            newMissedCount = 0,
            isWinner = 0;

        if (!allGuesses[letter]) {
            //update all guesses so we know which letters have been guessed
            newAllGuesses[letter] = true;
            setAllGuesses(newAllGuesses);
            if (word.includes(letter)) {
                //keep track of the guesses that are correct
                newCorrectGuesses = { ...correctGuesses };
                newCorrectGuesses[letter] = true;
                setCorrectGuesses(newCorrectGuesses);
                //check if we have a winning guess
                isWinner = Object.keys(newCorrectGuesses).length === Object.keys(uniqueLetters).length;
                if (isWinner) {
                    setGameOver(1);
                }
            }
            else {
                newMissedCount = missedCount + 1;
                setMissedCount(newMissedCount);
                if (newMissedCount >= failedCount) {
                    setGameOver(2);
                }
            }
        }
    }

    function reset() {
        setAllGuesses({});
        setCorrectGuesses({});
        setMissedCount(0);
        setGameOver(0);
    }

    function restart() {
        reset();
        getAWord();
    }

    function getUniqueLetters(word = "") {
        return word.split('').reduce((acc, curr) => (acc[curr] = '', acc), {})
    }

    function handleDifficultyChange(newLength) {
        setWordLength(newLength);
    }

    // Generate buttons A-Z
    const buttons = Array.from({ length: 26 }, (_, i) => {
        const letter = String.fromCharCode(65 + i);
        return (
            <LetterButton
                letter={letter}
                key={letter}
                guessed={!!allGuesses[letter] || !!gameOver || loading}
                handler={() => onLetterGuessed(letter)} // Pass letter directly
            />
        );
    });

    let videoName = '',//'9666927-sd_426_240_25fps',
        fragment = '#t=10,20';
    if (gameOver) {
        fragment = '';
        videoName = gameOver === 2 ? '2657691-sd_426_240_30fps' : '365-136081982_tiny';
    }

    return <div className="gameboard">
        {videoName === '' ? <></> : <DynamicVideoLoader videoName={videoName} fragment={fragment} ></DynamicVideoLoader>}
        <DifficultySelector
            onSelect={handleDifficultyChange}
            currentDifficulty={wordLength}
        />
        {loading ? <div><p className="loading-text">Loading </p><div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div> :
            <Word word={word} guesses={allGuesses}></Word>}
        <div className="misses-wrapper">
            <Misses missedCount={missedCount}></Misses>
        </div>
        <div className="letters">
            {buttons}
        </div>
        {gameOver ? <GameOver onNewGame={restart} onReset={reset} gameOver={gameOver} word={word} missedCount={missedCount}></GameOver> : null}
    </div>
}

export default Gameboard;