import React, { useState } from 'react';
import Button from './ui/Button';

function Chatbot({ text }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch("http://localhost:5000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, question }),
      });

      const result = await response.json();

      if (!response.ok) {
        setAnswer(result.error || "Failed to get answer from AI assistant.");
        return;
      }

      setAnswer(result.answer || "I couldn't find an answer to that.");
    } catch (error) {
      console.error("Chatbot error:", error);
      setAnswer("Error: Could not connect to the backend server. Please ensure the backend is running and reachable.");
    } finally {
      setLoading(false);
    }
  };

  const speakAnswer = () => {
    if ('speechSynthesis' in window && answer) {
      const utterance = new SpeechSynthesisUtterance(answer);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Speech synthesis not supported in this browser.");
    }
  };

  return (
    <div className="flex flex-col h-[450px]">
      <div className="flex-1 overflow-y-auto space-y-4 bg-gray-50 rounded-lg p-4 border border-gray-100 mb-4">
        {!answer && !loading && (
          <p className="text-gray-400 text-sm italic text-center mt-8">
            Ask any question about the document above.
          </p>
        )}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-indigo-100 text-indigo-800 rounded-2xl px-4 py-2 text-sm animate-pulse">
              AI is thinking...
            </div>
          </div>
        )}

        {answer && (
          <div className="space-y-3">
            <div className="flex justify-start">
              <div className="bg-white border border-indigo-100 text-gray-800 rounded-2xl px-4 py-3 text-sm shadow-sm">
                <p className="font-semibold text-indigo-600 mb-1">Response:</p>
                <div className="whitespace-pre-wrap">{answer}</div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                variant="secondary"
                onClick={speakAnswer}
                className="text-xs py-1 px-3 flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>
                Listen
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && askQuestion()}
          placeholder="Type your question..."
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
        />
        <Button onClick={askQuestion} disabled={loading || !question.trim()}>
          Ask
        </Button>
      </div>
    </div>
  );
}

export default Chatbot;
