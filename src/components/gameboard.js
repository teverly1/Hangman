import { useState, useEffect, useCallback } from "react";
import LetterButton from "./letterbutton";
import Misses from "./misses";
import Word from "./word";
import GameOver from "./gameover";
import DifficultySelector from "./difficultyselector";
import DynamicVideoLoader from './dynamicvideoloader';

// import jsonUrl from '../data/test.json?url';

let controller=null,
    response = null;

function getUniqueLetters(word = "") {
    return word.split('').reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
    }, {})
}

async function getAWord(wordLength, loadingFn) {
    if(controller)
    {
        controller.abort('Request Canceled');
        await Promise.allSettled([response]);
    }
    if (typeof loadingFn === 'function') {
        loadingFn(true);
    }
    try {
        controller = new AbortController();
        response = await fetch(`https://random-word-api.herokuapp.com/word?length=${wordLength}&number=1`,{signal:controller.signal});
        const data = await response.json();
        // const response = await fetch(`${jsonUrl}?length=${wordLength}&number=1`);
        // const data = ["pending"]

        if (Array.isArray(data) && data.length > 0) {
            const newWord = data[0].toUpperCase();
            return { word: newWord, uniqueLetters: getUniqueLetters(newWord) };
        }
    } catch (error) {
        console.error("Fetch failed:", error);
    } finally {
        if (typeof loadingFn === 'function') {
            loadingFn(false);
        }
    }
}

function Gameboard(props) {
    const defaultWord = "MISSING",
        [word, setWord] = useState(defaultWord),
        [wordLength, setWordLength] = useState(defaultWord.length),
        [loading, setLoading] = useState(false),
        [uniqueLetters, setUniqueLetters] = useState(getUniqueLetters(defaultWord)),
        [allGuesses, setAllGuesses] = useState({}),
        [correctGuesses, setCorrectGuesses] = useState({}),
        [gameOver, setGameOver] = useState(0),
        failedCount = 5;

    const onLetterGuessed = useCallback((letter) => {
        let newAllGuesses = { ...allGuesses },
            newCorrectGuesses,
            isWinner = 0;

        if (loading) { return; }
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
                if(Object.keys(allGuesses).length - Object.keys(correctGuesses).length >= failedCount){
                    setGameOver(2);
                }
            }
        }
    }, [allGuesses, correctGuesses, uniqueLetters, word, loading]);

    useEffect(() => {
        getAWord(defaultWord.length, setLoading).then(o => {
            if (!o) return;
            setWord(o.word);
            setUniqueLetters(o.uniqueLetters);
        })
    }, []);

    useEffect(() => {
        const handlePhysicalKeyDown = (event) => {
            // 1. Only capture A-Z keys
            const key = event.key.toUpperCase();

            // Check if it's a single letter between A and Z
            if (key.length === 1 && key >= 'A' && key <= 'Z') {
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

    function reset() {
        setAllGuesses({});
        setCorrectGuesses({});
        setGameOver(0);
    }

    function restart(newLength) {
        reset();
        let length = typeof newLength ==='number'?newLength:wordLength;
        getAWord(length, setLoading).then(o => {
            if (!o) return;
            setWord(o.word);
            setUniqueLetters(o.uniqueLetters);
        })
    }

    function handleDifficultyChange(newLength) {
        setWordLength(newLength);
        restart(newLength);
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

    let videoName = '',
        fragment = '#t=10,20';
    if (gameOver) {
        fragment = '';
        videoName = gameOver === 2 ? '2657691-sd_426_240_30fps' : '365-136081982_tiny';
    }

    const missedCount = Object.keys(allGuesses).length - Object.keys(correctGuesses).length;
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