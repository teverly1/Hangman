function Word({word = "",guesses={}}){
    let wordSplit = word.split('');
    
    return <div className="wordy"><p>Guess the word ({word.length} letters)</p> 
        <div className="word">
            {
                wordSplit.map((letter,index) => {
                    return <span key={index}>{guesses[letter]?letter:'\u00A0'}</span>
                })
            }
        </div>
    </div>
}

export default Word;