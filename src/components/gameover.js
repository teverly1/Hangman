import Misses from "./misses";
function GameOver({onNewGame, onReset, gameOver=1, word="", missedCount=0}){
//todo add button to show the word on a loss
    let statusMessage = gameOver===1?"You Win!":"Game Over";
    return <div className="modal">
        <div className="gameover">
            <div>
                {
                    gameOver===1?<p>{word}</p>:''
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