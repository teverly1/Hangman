function Word({word = "",guesses={}}){
    let wordSplit = word.split(''),
        letters = [];
    
    return <div className="word">{wordSplit.map((letter,index) => {
        return <span key={index}>{guesses[letter]?letter:'\u00A0'}</span>
    })}</div>
}

export default Word;