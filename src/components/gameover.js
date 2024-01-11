function GameOver({onNewGame, onReset, gameOver=1, word=""}){
//todo add button to show the word on a loss
    let message = gameOver===1?"You Win!":"Game Over";
    return <div className="gameover">
        <div>
            <p >{message}</p>
            <button onClick={onReset}>Restart?</button>
            <button onClick={onNewGame}>New Game?</button>
        </div>
    </div>
}

export default GameOver;