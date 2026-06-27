import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/moods";

const MOOD_OPTIONS = [
  { emoji: "😊", name: "Happy" },
  { emoji: "🤩", name: "Excited" },
  { emoji: "😌", name: "Neutral" },
  { emoji: "😔", name: "Sad" },
  { emoji: "😡", name: "Angry" },
];

function App() {
  const [moods, setMoods] = useState([]);
  const [mood, setMood] = useState("Happy");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    getMoods();
  }, []);

  async function getMoods() {
    try {
      const res = await axios.get(API_URL);
      setMoods(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function addMood(e) {
    e.preventDefault();

    if (!note.trim()) return;

    try {
      await axios.post(API_URL, {
        mood,
        note,
        date,
      });

      setNote("");
      setMood("Happy");
      setDate(new Date().toISOString().slice(0, 10));

      getMoods();
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteMood(id) {
    try {
      await axios.delete(`${API_URL}/${id}`);
      getMoods();
    } catch (err) {
      console.error(err);
    }
  }

  const stats = {
    Happy: moods.filter((m) => m.mood === "Happy").length,
    Excited: moods.filter((m) => m.mood === "Excited").length,
    Neutral: moods.filter((m) => m.mood === "Neutral").length,
    Sad: moods.filter((m) => m.mood === "Sad").length,
    Angry: moods.filter((m) => m.mood === "Angry").length,
  };

  const getEmoji = (mood) => {
    const found = MOOD_OPTIONS.find((m) => m.name === mood);
    return found ? found.emoji : "🙂";
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 px-6 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-semibold tracking-tight">
            Mood Journal
          </h1>
          <p className="text-stone-500 mt-3 text-sm max-w-md mx-auto">
            Track your emotions and reflect on your daily state of mind.
          </p>
        </header>

        {/* Form */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6">
          <form onSubmit={addMood}>
            <div className="flex flex-wrap gap-2 mb-5">
              {MOOD_OPTIONS.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setMood(item.name)}
                  className={`px-4 py-2 rounded-full text-sm border transition
                    ${
                      mood === item.name
                        ? "bg-stone-900 text-white border-stone-900"
                        : "bg-white hover:bg-stone-100 border-stone-200"
                    }`}
                >
                  {item.emoji} {item.name}
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              placeholder="Write a short note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border border-stone-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-stone-400"
            />

            <div className="flex items-center justify-between mt-4">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border border-stone-200 rounded-lg px-3 py-2 text-sm"
              />

              <button className="bg-stone-900 text-white px-5 py-2 rounded-lg text-sm hover:bg-stone-800">
                Save Entry
              </button>
            </div>
          </form>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-8">
          {MOOD_OPTIONS.map((item) => (
            <div
              key={item.name}
              className="bg-white border border-stone-200 rounded-xl p-4 text-center"
            >
              <div className="text-xl">{item.emoji}</div>
              <div className="text-lg font-semibold mt-1">
                {stats[item.name]}
              </div>
              <div className="text-xs text-stone-500">{item.name}</div>
            </div>
          ))}
        </div>

        {/* Entries */}
        <div className="mt-10">
          <h2 className="text-lg font-medium mb-4">Entries</h2>

          <div className="space-y-3">
            {moods.length === 0 ? (
              <div className="text-center text-stone-400 py-10 border border-dashed rounded-xl bg-white">
                No entries yet
              </div>
            ) : (
              moods.map((item) => (
                <div
                  key={item._id}
                  className="bg-white border border-stone-200 rounded-xl p-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <span className="text-xl">{getEmoji(item.mood)}</span>

                      <div>
                        <div className="text-sm font-medium">{item.mood}</div>
                        <div className="text-xs text-stone-500">
                          {new Date(item.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteMood(item._id)}
                      className="text-xs text-stone-400 hover:text-red-500"
                    >
                      Delete
                    </button>
                  </div>

                  <p className="text-sm text-stone-600 mt-3 leading-relaxed">
                    {item.note}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-stone-400 mt-12">
          Built with React • Express • MongoDB
        </footer>
      </div>
    </div>
  );
}

export default App;
