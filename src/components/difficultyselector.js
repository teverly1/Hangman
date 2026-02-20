import React from 'react';

function DifficultySelector({ onSelect, currentDifficulty }) {
    const levels = [
        { label: 'Easy', length: 12 },
        { label: 'Normal', length: 7 },
        { label: 'Hard', length: 5 }
    ];

    return (
        <div className="difficulty-wrapper">
            <div className="difficulty-buttons">
                {levels.map((level) => (
                    <button
                        key={level.label}
                        className={`diff-btn ${currentDifficulty === level.length ? 'active' : ''}`}
                        onClick={() => onSelect(level.length)}
                    >
                        {level.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default DifficultySelector;