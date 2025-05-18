import { useState, useEffect } from "react";
import Card from "./Card";

function Cards() {
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(4);
  const [items, setItems] = useState([]);
  const [prev, setPrev] = useState(-1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const imageFiles = [
    "/img/1.jpg", "/img/2.png", "/img/3.jpg", "/img/4.jpg",
    "/img/5.jpeg", "/img/6.jpeg", "/img/7.png", "/img/8.png",
  ];

  const generateCards = () => {
    const totalCards = rows * cols;
    if (totalCards % 2 !== 0) {
      alert("Le nombre total de cartes doit être pair !");
      return;
    }
    const pairs = totalCards / 2;
    if (pairs > imageFiles.length) {
      alert(`Il faut au moins ${pairs} images dans /public/img/`);
      return;
    }

    let cards = [];
    for (let i = 0; i < pairs; i++) {
      const img = imageFiles[i];
      cards.push({ id: i, img, stat: "active" }); // visible pour preview
      cards.push({ id: i, img, stat: "active" });
    }

    cards = cards.sort(() => Math.random() - 0.5);
    setItems(cards);
    setPrev(-1);
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    setShowPreview(true);

    //  Lancer la prévisualisation pendant 10 secondes
    setTimeout(() => {
      setItems((prevCards) =>
        prevCards.map((card) => ({ ...card, stat: "" }))
      );
      setShowPreview(false);
    }, 3000);
  };

  const resetGame = () => {
    setItems([]);
    setPrev(-1);
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    setShowPreview(true);
  };

  // ⏱ Gérer le timer après la prévisualisation
  useEffect(() => {
    if (items.length === 0 || gameOver || showPreview) return;

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setGameOver(true);
    }
  }, [timeLeft, gameOver, items, showPreview]);

  // ✅ Vérification des cartes
  function check(current) {
    setItems((prevItems) => {
      const updated = [...prevItems];

      if (updated[current].id === updated[prev].id) {
        updated[current].stat = "correct";
        updated[prev].stat = "correct";
        setScore((s) => s + 10);
      } else {
        updated[current].stat = "wrong";
        updated[prev].stat = "wrong";

        // ⏳ Retour rapide après 300 ms
        setTimeout(() => {
          setItems((prevReset) => {
            const reset = [...prevReset];
            reset[current].stat = "";
            reset[prev].stat = "";
            return reset;
          });
        }, 10);
      }

      return updated;
    });

    setPrev(-1);
  }

  // 🔁 Gestion du clic sur une carte
  function handleClick(id) {
    if (
      gameOver ||
      showPreview ||
      items[id].stat === "correct" ||
      items[id].stat === "active"
    ) {
      return;
    }

    const updated = [...items];
    updated[id].stat = "active";
    setItems(updated);

    if (prev === -1) {
      setPrev(id);
    } else {
      setTimeout(() => check(id), 0); // attendre avant check
    }
  }

  return (
    <div style={{ width: "100%", padding: "1rem" }}>
      {/* Configuration avant le démarrage */}
      {items.length === 0 && (
        <div className="config">
           <p>Jeu de Mémoire</p> 
          <h4>Choix du niveau :</h4>
          <label>Lignes : </label>
          <input
            type="number"
            value={rows}
            min="2"
            max="6"
            onChange={(e) => setRows(Number(e.target.value))}
          />
          <label> Colonnes : </label>
          <input
            type="number"
            value={cols}
            min="2"
            max="6"
            onChange={(e) => setCols(Number(e.target.value))}
          />
          <br />
          <button onClick={generateCards} style={{ marginTop: "10px" }}>
            ▶️ Démarrer
          </button>
        </div>
      )}

      {/* Score + Timer après démarrage */}
      {items.length > 0 && !showPreview && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              maxWidth: "600px",
              margin: "0 auto 10px auto",
              padding: "0 1rem",
            }}
          >
            <h2 style={{ margin: 0 }}>Score : {score}</h2>
            <h2 style={{ margin: 0 }}>⏱ Temps : {timeLeft}s</h2>
          </div>

          {gameOver && (
            <h3 style={{ textAlign: "center" }}>
              ⏰ Temps écoulé ! Score final : {score}
            </h3>
          )}

          <button
            onClick={resetGame}
            style={{ margin: "10px auto", display: "block" }}
          >
            ⏹️ Quitter
          </button>
        </>
      )}

      {/* Grille de cartes */}
      <div
        className="contenu"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: "10px",
          justifyContent: "center",
          marginTop: "20px",
          maxWidth: "90vw",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {items.map((item, index) => (
          <Card key={index} item={item} id={index} handleClick={handleClick} />
        ))}
      </div>
    </div>
  );
}

export default Cards;
