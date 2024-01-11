function LetterButton({letter,guessed,handler}){

    return <button onClick={handler} disabled={guessed}>{letter}</button>
}

export default LetterButton;