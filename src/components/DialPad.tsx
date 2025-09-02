'use client'

import { useState } from 'react';

interface DialPadProps {
  onCall: (phoneNumber: string) => void;
  isConnected: boolean;
  isInCall: boolean;
  isClientReady?: boolean;
}

export default function DialPad({ onCall, isConnected, isInCall, isClientReady = false }: DialPadProps) {
  const [phoneNumber, setPhoneNumber] = useState('13322309337');

  const handleDigitClick = (digit: string) => {
    setPhoneNumber(prev => prev + digit);
  };

  const handleBackspace = () => {
    setPhoneNumber(prev => prev.slice(0, -1));
  };

  const handleCall = () => {
    if (phoneNumber.trim()) {
      onCall(phoneNumber);
    }
  };

  const digits = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#'],
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          拨号器
        </h2>
        
        {/* 电话号码显示 */}
        <div className="relative mb-4">
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="输入电话号码"
            className="w-full p-4 text-lg text-center border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
          />
          {phoneNumber && (
            <button
              onClick={handleBackspace}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ⌫
            </button>
          )}
        </div>
      </div>

      {/* 拨号键盘 */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {digits.map((row) =>
          row.map((digit) => (
            <button
              key={digit}
              onClick={() => handleDigitClick(digit)}
              className="w-16 h-16 bg-gray-100 hover:bg-gray-200 rounded-full text-xl font-semibold text-gray-700 transition-colors duration-150 active:scale-95 transform"
            >
              {digit}
            </button>
          ))
        )}
      </div>

      {/* 拨打按钮 */}
      <button
        onClick={handleCall}
        disabled={!isConnected || !phoneNumber.trim() || isInCall || !isClientReady}
        className={`w-full py-4 rounded-full text-white font-semibold text-lg transition-all duration-200 ${
          !isConnected || !phoneNumber.trim() || isInCall || !isClientReady
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-green-500 hover:bg-green-600 active:scale-95 transform'
        }`}
      >
        {!isConnected 
          ? '未连接' 
          : !isClientReady
          ? '客户端同步中...'
          : isInCall 
          ? '通话中...' 
          : '📞 拨打'
        }
      </button>
    </div>
  );
}
