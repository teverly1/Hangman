import Misses from "./misses";

function makeBouncyLetters(word){
    const wordSplit = word.split('');
    return  wordSplit.map((letter,index) => {
        return <span key={index} className="winner-animation">{letter}</span>
    })
}

function GameOver({onNewGame, onReset, gameOver=1, word="", missedCount=0}){
//todo add button to show the word on a loss
    let statusMessage = gameOver===1?makeBouncyLetters("You Win!"):"Game Over";
    // let wordSplit = gameOver===1?word.split(''):'';
    return <div className="modal">
        <div className="gameover">
            <div>
                {
                    gameOver===1?<div>{word}</div>:''
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