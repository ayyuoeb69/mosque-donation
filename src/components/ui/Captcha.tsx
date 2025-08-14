"use client";

import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";

interface CaptchaProps {
  onVerify: (isValid: boolean) => void;
  className?: string;
}

export default function Captcha({ onVerify, className = "" }: CaptchaProps) {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isValid, setIsValid] = useState(false);

  const generateCaptcha = () => {
    const newNum1 = Math.floor(Math.random() * 20) + 1;
    const newNum2 = Math.floor(Math.random() * 20) + 1;
    setNum1(newNum1);
    setNum2(newNum2);
    setUserAnswer("");
    setIsValid(false);
    onVerify(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const answer = e.target.value;
    setUserAnswer(answer);

    const correctAnswer = num1 + num2;
    const isCorrect = parseInt(answer) === correctAnswer;

    setIsValid(isCorrect);
    onVerify(isCorrect);
  };

  const handleRefresh = () => {
    generateCaptcha();
  };

  return (
    <div className={`border rounded-lg p-4 bg-gray-50 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-gray-700">
          Verifikasi Keamanan <span className="text-red-500">*</span>
        </label>
        <button
          type="button"
          onClick={handleRefresh}
          className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
          title="Refresh captcha"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 text-lg font-mono bg-white px-3 py-2 rounded border-2 border-dashed border-emerald-300">
          <span className="font-bold text-emerald-700">{num1}</span>
          <span className="text-gray-600">+</span>
          <span className="font-bold text-emerald-700">{num2}</span>
          <span className="text-gray-600">=</span>
          <span className="text-gray-400">?</span>
        </div>

        <input
          type="number"
          value={userAnswer}
          onChange={handleAnswerChange}
          placeholder="Jawaban"
          className={`w-full px-3 py-2 border rounded-md text-center font-mono transition-colors ${
            userAnswer
              ? isValid
                ? "border-green-500 bg-green-50 text-green-700"
                : "border-red-500 bg-red-50 text-red-700"
              : "border-gray-300"
          }`}
        />
      </div>

      <div className="mt-2">
        {userAnswer && (
          <p
            className={`text-xs ${isValid ? "text-green-600" : "text-red-600"}`}
          >
            {isValid ? (
              <span className="flex items-center">✓ Verifikasi berhasil</span>
            ) : (
              <span className="flex items-center">
                ✗ Jawaban tidak benar, coba lagi
              </span>
            )}
          </p>
        )}
        {!userAnswer && (
          <p className="text-xs text-gray-500">
            Silakan selesaikan perhitungan di atas untuk melanjutkan
          </p>
        )}
      </div>
    </div>
  );
}
