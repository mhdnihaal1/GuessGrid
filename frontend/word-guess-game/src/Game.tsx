import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { words } from "./words";
import { Menu } from "lucide-react";  
import axios from "axios";


function Game() {
  const [correctWord, setCorrectWord] = useState(
    words[Math.floor(Math.random() * words.length)]
  );
  const [refresh, setRefresh] = useState(false);
const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [board, setBoard] = useState<string[][]>(
    Array(6)
      .fill(null)
      .map(() => Array(5).fill(""))
  );
  const [currentRow, setCurrentRow] = useState(0);
  const [guess, setGuess] = useState("");
  const [showSidebar, setShowSidebar] = useState(false); 
  const [users, setUsers] = useState<any[]>([]);  

    useEffect(() => {
    const fetchScores = async () => {
        try {
        const res = await axios.post("http://localhost:5000/api/auth/fetchAllScore");
         console.log(1,res.data.data); 
        setUsers(res.data.data);  
    
        } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to fetch scores");
        }
    };

    fetchScores();
    }, [refresh]);

 

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentRow >= 6) return;
      if (/^[a-zA-Z]$/.test(e.key)) {
        setGuess((prev) =>
          prev.length < 5 ? prev + e.key.toUpperCase() : prev
        );
      } else if (e.key === "Backspace") {
        setGuess((prev) => prev.slice(0, -1));
      } else if (e.key === "Enter") {
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [guess, currentRow, correctWord]);

  const handleSubmit = async () => {
    if (guess.length !== 5) return toast.error("Word must be 5 letters!");
    const updatedBoard = [...board];
    updatedBoard[currentRow] = guess.split("");
    setBoard(updatedBoard);

    if (guess === correctWord) {
         try {
        let email = user.email;
      const res = await axios.post("http://localhost:5000/api/auth/addScore",{email}); 
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch scores");
    }
        setRefresh(prev => !prev); // 👈 triggers useEffect again

      toast.success("🎉 You guessed it right!");
      
      setTimeout(() => toast(`Word: ${correctWord}`, { icon: "🏆" }), 500);
     
      setCurrentRow(6);
    } else if (currentRow === 5) {
      toast.error(`❌ Out of tries! Word was ${correctWord}`);
      setCurrentRow(6);
    } else {
      setCurrentRow(currentRow + 1);
    }
    setGuess("");
  };

  const getBoxColor = (row: number, col: number) => {
    const letter = board[row][col];
    if (!letter) return "bg-[#0d2a33] border border-[#1c4452]";
    if (correctWord[col] === letter)
      return "bg-green-500 border-green-500 text-white";
    if (correctWord.includes(letter))
      return "bg-yellow-500 border-yellow-500 text-white";
    return "bg-gray-700 border-gray-700 text-white";
  };

  const handleKeyPress = (key: string) => {
    if (currentRow >= 6) return;
    if (key === "⌫") {
      setGuess((prev) => prev.slice(0, -1));
    } else if (key === "ENTER") {
      handleSubmit();
    } else {
      setGuess((prev) => (prev.length < 5 ? prev + key : prev));
    }
  };

  const restartGame = () => {
    setCorrectWord(words[Math.floor(Math.random() * words.length)]);
    setBoard(
      Array(6)
        .fill(null)
        .map(() => Array(5).fill(""))
    );
    setCurrentRow(0);
    setGuess("");
    toast("🔄 New Game Started!");
  };

  const keyboardRows = [
    "QWERTYUIOP".split(""),
    "ASDFGHJKL".split(""),
    ["ENTER", ..."ZXCVBNM".split(""), "⌫"],
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#031621] to-[#062a3b] text-white font-sans flex flex-col md:flex-row items-center justify-center p-6 relative ">
      <Toaster position="top-center" />

      {/* Mobile Top Bar */}
      <div className="w-full flex justify-between items-center  mb-4 md:hidden">
        <h1 className="text-2xl font-bold text-sky-300">WORD GUESS</h1>
        <button onClick={() => setShowSidebar(!showSidebar)}>
          <Menu size={28} className="text-white" />
        </button>
      </div>

      {/* Sidebar for Small Screens (overlay) */}
      {showSidebar && (
        <div className="fixed inset-0 bg-black/60 z-20 flex justify-end">
          <div className="bg-[#0b2a38]/95 w-72 p-6 flex flex-col justify-between border-l border-[#1e4d58]">
            {/* Leaderboard */}
            <div>
              <h2 className="text-xl font-bold mb-4 text-sky-300 text-center">
                🏆 Leaderboard
              </h2>
              <ul className="space-y-3">
                {users.map((user, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-[#133341] px-4 py-2 rounded-lg"
                  >
                    <span>{user.username}</span>
                    <span className="text-sky-400 font-bold">{user.score}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Color Legend */}
            <div className="mt-0">
              <h3 className="font-semibold text-sky-300 mb-2">
                🎨 Color Guide
              </h3>
              <div className="flex gap-2 items-center mb-1">
                <div className="w-4 h-4 bg-green-500 rounded-sm" />{" "}
                <span>Correct Spot</span>
              </div>
              <div className="flex gap-2 items-center mb-1">
                <div className="w-4 h-4 bg-yellow-500 rounded-sm" />{" "}
                <span>Right Letter</span>
              </div>
              <div className="flex gap-2 items-center">
                <div className="w-4 h-4 bg-gray-700 rounded-sm" />{" "}
                <span>Wrong Letter</span>
              </div>
            </div>

            <button
              onClick={() => setShowSidebar(false)}
              className="mt-6 bg-sky-600 py-2 rounded-lg hover:bg-sky-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Main Game and Desktop Layout */}
      <div className="flex flex-col md:flex-row items-start justify-center w-full max-w-7xl gap-8">
        {/* Game Center */}
        <div className="flex-1 flex justify-center">
          <div className="bg-[#0b2a38]/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-[#1e4d58]/40 w-full max-w-md p-8 flex flex-col items-center">
            <h1 className="hidden md:block text-4xl font-extrabold tracking-widest mb-6 text-sky-300 drop-shadow-lg">
              WORD GUESS
            </h1>

            <button
              onClick={restartGame}
              className="mb-6 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200 shadow-md"
            >
              🔄 Restart
            </button>

            {/* Game Board */}
            <div className="grid grid-rows-6 gap-3 mb-6">
              {board.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-3">
                  {row.map((letter, colIndex) => (
                    <div
                      key={colIndex}
                      className={`w-14 h-14 flex items-center justify-center rounded-xl text-2xl font-bold transition-all duration-300 ${
                        rowIndex === currentRow && guess[colIndex]
                          ? "border-2 border-sky-400 bg-[#143a4a]"
                          : getBoxColor(rowIndex, colIndex)
                      }`}
                    >
                      {rowIndex === currentRow ? guess[colIndex] || "" : letter}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Keyboard */}
            <div className="flex flex-col gap-2 items-center w-full mt-auto">
              {keyboardRows.map((row, i) => (
                <div key={i} className="flex justify-center gap-2">
                  {row.map((key) => (
                    <button
                      key={key}
                      onClick={() => handleKeyPress(key)}
                      className={`${
                        key === "ENTER" || key === "⌫"
                          ? "bg-sky-500 hover:bg-sky-600 px-6"
                          : "bg-[#1a3b47] hover:bg-[#235564] px-4"
                      } py-3 rounded-lg text-sm font-semibold shadow-sm transition-all duration-150`}
                    >
                      {key}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar for Desktop */}
        <div className="hidden md:block bg-[#0b2a38]/80 backdrop-blur-md p-6 rounded-2xl shadow-lg w-full max-w-xs border border-[#1e4d58]/40 h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 text-sky-300 text-center">
            🏆 Leaderboard
          </h2>
          <ul className="space-y-3">
            {users.map((user, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-[#133341] px-4 py-2 rounded-lg shadow-sm"
              >
                <span>{user.username}</span>
                <span className="text-sky-400 font-bold">{user.score}</span>
              </li>
            ))}
          </ul>

          {/* Color Legend */}
          <div className="mt-9">
            <h3 className="font-semibold text-sky-300 mb-2">🎨 Color Guide</h3>  
            <div className="flex gap-2 items-center mb-1">                       
              <div className="w-4 h-4 bg-green-500 rounded-sm" />{" "}
              <span>Correct Spot</span>
            </div>
            <div className="flex gap-2 items-center mb-1">
              <div className="w-4 h-4 bg-yellow-500 rounded-sm" />{" "}
              <span>Right Letter</span>
            </div>
            <div className="flex gap-2 items-center">
              <div className="w-4 h-4 bg-gray-700 rounded-sm" />{" "}
              <span>Wrong Letter</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;
