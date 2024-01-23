function Word({word = "",guesses={}}){
    let wordSplit = word.split('');
    
    return <div><p>Guess the word</p> 
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