function Header() {
  const title = "HANGMAN";

  return (
    <header className="header-title">
      {title.split("").map((letter, index) => (
        <span key={index} className={letter.toLowerCase()}>{letter}</span>
      ))}
    </header>
  );
}

export default Header;