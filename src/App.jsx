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
    const res = await axios.get(API_URL);
    setMoods(res.data);
  }

  async function addMood(e) {
    e.preventDefault();
    if (!note.trim()) return;

    await axios.post(API_URL, { mood, note, date });

    setNote("");
    setMood("Happy");
    setDate(new Date().toISOString().slice(0, 10));

    getMoods();
  }

  async function deleteMood(id) {
    await axios.delete(`${API_URL}/${id}`);
    getMoods();
  }

  const stats = MOOD_OPTIONS.reduce((acc, m) => {
    acc[m.name] = moods.filter((x) => x.mood === m.name).length;
    return acc;
  }, {});

  const getEmoji = (m) => MOOD_OPTIONS.find((x) => x.name === m)?.emoji || "🙂";

  return (
    <div className="min-h-screen bg-[#f7f1e3] text-[#3b2f2f]">
      {/* HEADER */}
      <div className="bg-[#fff7ed] border-b border-[#eadccf] py-10">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h1 className="text-4xl font-semibold tracking-tight">
            Mood Journal
          </h1>
          <p className="text-sm text-[#7c6f64] mt-2">
            A calm space to write, reflect, and understand your emotions
          </p>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* FORM */}
        <div className="bg-[#fffaf3] border border-[#eadccf] rounded-2xl p-6 shadow-sm">
          {/* Mood Buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            {MOOD_OPTIONS.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => setMood(item.name)}
                className={`px-4 py-2 rounded-full text-sm border transition
                  ${
                    mood === item.name
                      ? "bg-[#c97b63] text-white border-[#c97b63]"
                      : "bg-white hover:bg-[#f3e6d6] border-[#eadccf]"
                  }`}
              >
                {item.emoji} {item.name}
              </button>
            ))}
          </div>

          {/* Note */}
          <textarea
            rows={3}
            placeholder="Write your thoughts..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-white border border-[#eadccf] rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e6c7a7]"
          />

          {/* Bottom row */}
          <div className="flex justify-between items-center mt-4">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-white border border-[#eadccf] rounded-lg px-3 py-2 text-sm"
            />

            <button className="bg-[#c97b63] text-white px-5 py-2 rounded-lg text-sm hover:opacity-90 transition">
              Save Entry
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
          {MOOD_OPTIONS.map((item) => (
            <div
              key={item.name}
              className="bg-[#fffaf3] border border-[#eadccf] rounded-xl p-4 text-center shadow-sm"
            >
              <div className="text-lg">{item.emoji}</div>
              <div className="text-xl font-semibold mt-1">
                {stats[item.name]}
              </div>
              <div className="text-xs text-[#7c6f64]">{item.name}</div>
            </div>
          ))}
        </div>

        {/* ENTRIES */}
        <div className="mt-8 space-y-3">
          {moods.length === 0 ? (
            <div className="text-center text-[#9b8f85] py-10 border border-dashed border-[#e3d3c3] rounded-xl bg-[#fffaf3]">
              No entries yet 🌿
            </div>
          ) : (
            moods.map((item) => (
              <div
                key={item._id}
                className="bg-[#fffaf3] border border-[#eadccf] rounded-xl p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <span className="text-lg">{getEmoji(item.mood)}</span>

                    <div>
                      <div className="font-medium">{item.mood}</div>
                      <div className="text-xs text-[#9b8f85]">
                        {new Date(item.date).toDateString()}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteMood(item._id)}
                    className="text-xs text-[#9b8f85] hover:text-red-500"
                  >
                    Delete
                  </button>
                </div>

                <p className="text-sm text-[#5c4b3f] mt-3 leading-relaxed">
                  {item.note}
                </p>
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        <div className="text-center text-xs text-[#9b8f85] mt-10 pb-6">
          Made with warmth • React • Express • MongoDB
        </div>
      </div>
    </div>
  );
}

export default App;
