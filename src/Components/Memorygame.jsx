import React, { useEffect, useState } from "react";

const Memorygame = () => {
  const [grid, setGrid] = useState(4);
  const [cards, setCards] = useState([]);

  const [solved, setSolved] = useState([]);
  const [flipped, setFlipped] = useState([]);

  const [disabled, setDisabled] = useState(false);
  const [won, setWon] = useState(false);

  const handleGridSizeChange = (e) => {
    const size = parseInt(e.target.value);
    if (size >= 2 && size <= 10) setGrid(size);
  };

  const initiliazeGame = () => {
    const totalCards = grid * grid;
    const pairCount = Math.floor(totalCards / 2);
    const numbers = [...Array(pairCount).keys()].map((n) => n + 1);
    const shuffledCards = [...numbers, ...numbers]
      .sort(() => Math.random() - 0.5)
      .slice(0, totalCards)
      .map((number, index) => ({ id: index, number }));

    setCards(shuffledCards);
    setFlipped([]);
    setSolved([]);
    setWon(false);
  };

  useEffect(() => {
    initiliazeGame();
  }, [grid]);



  const handleClick = (id) => {
    if (disabled || won) return;

    if (flipped.includes(id) || solved.includes(id)) return;

    if (flipped.length === 0) {
      setFlipped([id]);
      return;
    }

    if (flipped.length === 1) {
      setDisabled(true);
      setFlipped([...flipped, id]);

      const firstCard = cards.find((card) => card.id === flipped[0]);
      const secondCard = cards.find((card) => card.id === id);

      if (firstCard.number === secondCard.number) {
        setSolved([...solved, flipped[0], id]);
        setFlipped([]);
        setDisabled(false);

        if (solved.length + 2 === cards.length) {
          setWon(true);
        }
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  const isFlipped = (id) => flipped.includes(id) || solved.includes(id);

  useEffect(() => {
    if(solved.length === cards.length && cards.length > 0){
      setWon(true)
    }

  }, [solved, cards])


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-grey-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Memory Game</h1>
      {/* input */}
      <div className="mb-4">
        <label htmlFor="gridSize" className="mr-2">
          Grid size: (max 10)
        </label>
        <input
          type="number"
          id="gridSize"
          min="2"
          max="10"
          value={grid}
          onChange={handleGridSizeChange}
          className="border border-gray-300 rounded-md p-2"
        />
      </div>
      {/* game board */}
      <div
        className={`grid grid-cols-${grid} gap-2 mb-4`}
        style={{ width: `min(100%, ${grid * 6}rem)`,
                gridTemplateColumns: `repeat(${grid}, minmax(0,1fr))`
      }}
      >
        {cards.map((card) => {
          return (
            <div
              key={card.id}
              onClick={() => handleClick(card.id)}
              className={`aspect-square flex items-center justify-center text-2xl font-bold rounded-lg cursor-pointer transition-all duration-300 ${
                isFlipped(card.id)
                 ? solved.includes(card.id)
                  ? "bg-fuchsia-500 text-emerald-50"
                  : "bg-fuchsia-900 text-emerald-50"
                  : "bg-gray-600 text-gray-200"
              }`}
            >
              {isFlipped(card.id) ? card.number : "?"}
            </div>
          );
        })}
      </div>
        {/* result */}
      {won && (
        <div className="mt-4 text-4xl font-bold text-green-400 animate-bounce"> You Won!!</div>
      )}


      {/* reset */}
      <button
      onClick={initiliazeGame}
      className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"> 
        {won ? "Play Again" : "Reset"}
        </button>
    </div>
  );
};

export default Memorygame;
