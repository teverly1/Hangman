import LetterButton from "./letterbutton";
import Misses from "./misses";
import Word from "./word";
import GameOver from "./gameover";
import DifficultySelector from "./difficultyselector";
import { useState, useEffect } from "react";
function Gameboard(props){
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

    // get a new word when the app is loaded
    // useEffect(() =>{
    //     getAWord();
    // },[])

    useEffect(() =>{
        restart(); // Automatically get a new word with the new length
    },[wordLength])

    function onLetterGuessed(syntheticEvent){
        let letter = syntheticEvent.nativeEvent.srcElement.innerText,
            newAllGuesses = {...allGuesses},
            newCorrectGuesses,
            newMissedCount = 0,
            isWinner=0;
        
        //update all guesses so we know which letters have been guessed
        newAllGuesses[letter]=true;
        setAllGuesses(newAllGuesses);
        if(word.includes(letter))
        {
            //keep track of the guesses that are correct
            newCorrectGuesses = {...correctGuesses};
            newCorrectGuesses[letter]=true;
            setCorrectGuesses(newCorrectGuesses);
            //check if we have a winning guess
            isWinner = Object.keys(newCorrectGuesses).length === Object.keys(uniqueLetters).length;
            if(isWinner)
            {
                setGameOver(1);
            }
        }
        else
        {
            newMissedCount=missedCount+1
            setMissedCount(newMissedCount);
            if(newMissedCount >= failedCount)
            {
                setGameOver(2);
            }
        }
        
    }

    function reset(){
        setAllGuesses({});
        setCorrectGuesses({});
        setMissedCount(0);
        setGameOver(0);
    }

    function restart(){
        reset();
        getAWord();
    }

    function getUniqueLetters(word=""){
        return word.split('').reduce((acc,curr)=> (acc[curr]='',acc),{})
    }

    const handleDifficultyChange = (newLength) => {
        setWordLength(newLength);
        // restart(); // Automatically get a new word with the new length
    };

    let buttons = [];
    for(let x = 65; x < 91; x++) //Go from A(65)-Z(91) to create the buttons for the game
    {
        const letter = String.fromCharCode(x)
        buttons.push(<LetterButton 
            letter={letter}
            key={x}
            guessed={allGuesses[letter] || gameOver || loading}
            handler={onLetterGuessed}
        ></LetterButton>);
    }

    return <div className="gameboard">
        <DifficultySelector 
            onSelect={handleDifficultyChange} 
            currentDifficulty={wordLength} 
        />
        {loading?<div><p className="loading-text">Loading </p><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>:
        <Word word={word} guesses={allGuesses}></Word>}
        <div className="misses-wrapper">
            <Misses missedCount={missedCount}></Misses>
        </div>
        <div className="letters">
            {buttons}
        </div>
        {gameOver?<GameOver onNewGame={restart} onReset={reset} gameOver={gameOver} word={word} missedCount={missedCount}></GameOver>:null}
    </div>
}

export default Gameboard;