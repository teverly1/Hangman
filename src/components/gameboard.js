import LetterButton from "./letterbutton";
import Misses from "./misses";
import Word from "./word";
import GameOver from "./gameover";
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

    // when the word changes we need to do a couple of things
    useEffect(() => {
        let upperWord = word.toUpperCase();
        setWord(upperWord); //ensure that the word is uppercase, it makes comparison easier later on
        setUniqueLetters(getUniqueLetters(upperWord)); //get the unique letters in the word. It makes the comparison for a win super easy
    },[word]);

    // get a new word when the app is loaded
    useEffect(() =>{
        getAWord();
    },[])

    function getAWord(){
        setLoading(true)
        fetch(`https://random-word-api.herokuapp.com/word?length=${wordLength}&number=1`).then(
            res => {
                res.json().then(r=>{
                    if(Array.isArray(r))
                    {
                        setWord(r[0]);
                        setLoading(false);
                    }
                    console.log(r);
                })
            }
        )
    }

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

    let buttons = [];
    for(let x = 65; x < 91; x++) //Go from A(65)-Z(91) to create the buttons for the game
    {
        const letter = String.fromCharCode(x)
        buttons.push(<LetterButton 
            letter={letter}
            key={x}
            guessed={allGuesses[letter] || gameOver}
            handler={onLetterGuessed}
        ></LetterButton>);
    }

    return <div className="gameboard">
        <Word word={word} guesses={allGuesses}></Word>
        <Misses missedCount={missedCount}></Misses>
        <div className="letters">
            {buttons}
        </div>
        {gameOver?<GameOver onNewGame={restart} onReset={reset} gameOver={gameOver} word={word}></GameOver>:null}
    </div>
}

export default Gameboard;