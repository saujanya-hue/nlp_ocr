import React, { useState, useEffect } from "react";
import Chatbot from './components/Chatbot';
import Layout from "./components/Layout";
import Card from "./components/ui/Card";
import Button from "./components/ui/Button";

function OCRPage() {
  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("ocr_history");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("ocr_history", JSON.stringify(history));
  }, [history]);

  const handleImageUpload = (event) => {
    setImage(event.target.files[0]);
  };

  const extractText = async () => {
    if (!image) return alert("Please upload an image first.");
    const formData = new FormData();
    formData.append("image", image);
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.text) {
        setExtractedText(data.text);
        const newItem = {
          id: Date.now(),
          text: data.text.substring(0, 50) + (data.text.length > 50 ? "..." : ""),
          fullText: data.text,
          date: new Date().toLocaleString(),
          fileName: image.name
        };
        setHistory(prev => [newItem, ...prev].slice(0, 10)); // Keep last 10
      } else {
        throw new Error(data.error || "Failed to extract text");
      }
    } catch (error) {
      alert("Error processing image: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const convertTextToSpeech = async () => {
    if (!extractedText) return alert("No text to convert.");
    try {
      const response = await fetch("http://localhost:5000/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: extractedText }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to convert text to speech.");
      }
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error("TTS Error:", error.message);
      alert("Error converting text to speech.");
    }
  };

  const deleteHistoryItem = (id) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const loadFromHistory = (item) => {
    setExtractedText(item.fullText);
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Upload Image */}
        <Card title="Upload Image" className="flex flex-col gap-4">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                </svg>
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
                <p className="text-xs text-gray-500">SVG, PNG, JPG (MAX. 800x400px)</p>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          </div>
          {image && <p className="text-sm text-gray-600 truncate">Selected: {image.name}</p>}
          <Button onClick={extractText} disabled={loading} className="w-full">
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Extracting...
              </span>
            ) : "Extract Text"}
          </Button>
        </Card>

        {/* Text Extraction */}
        <Card title="Text Extraction" className="md:col-span-2 lg:col-span-2">
          <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto border border-gray-200">
            {extractedText ? (
              <p className="whitespace-pre-wrap text-gray-700">{extractedText}</p>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 italic text-sm">
                No text extracted yet. Upload an image to start.
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-between items-center">
            <Button
              variant="secondary"
              onClick={convertTextToSpeech}
              disabled={!extractedText}
              className="flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>
              Speak
            </Button>
            <Button variant="secondary" onClick={() => navigator.clipboard.writeText(extractedText)} disabled={!extractedText}>
              Copy Text
            </Button>
          </div>
        </Card>

        {/* AI Assistant */}
        <Card title="AI Assistant" className="md:col-span-2 lg:col-span-1 border-t-4 border-indigo-500">
          <Chatbot text={extractedText} />
        </Card>

        {/* History */}
        <Card title="Recent History" className="md:col-span-1 lg:col-span-2">
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {history.length > 0 ? history.map((item) => (
              <div key={item.id} className="group p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-indigo-200 transition-all flex justify-between items-center">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => loadFromHistory(item)}
                >
                  <p className="text-sm font-semibold text-gray-800 truncate">{item.fileName}</p>
                  <p className="text-xs text-gray-500">{item.date}</p>
                </div>
                <button
                  onClick={() => deleteHistoryItem(item.id)}
                  className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            )) : (
              <p className="text-gray-400 text-sm italic text-center py-8">Your history will appear here.</p>
            )}
          </div>
        </Card>
      </div>
    </Layout>
  );
}

export default OCRPage;
