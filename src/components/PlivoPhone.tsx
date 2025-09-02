'use client'

import { usePlivoClient } from '@/hooks/usePlivoClient';
import DialPad from './DialPad';
import CallStatus from './CallStatus';

export default function PlivoPhone() {
  const {
    callState,
    isClientReady,
    login,
    makeCall,
    hangupCall,
    toggleMute,
    answerCall,
    rejectCall,
    logout,
  } = usePlivoClient();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('登录失败:', error);
    }
  };

  const handleCall = async (phoneNumber: string) => {
    try {
      await makeCall(phoneNumber);
    } catch (error) {
      console.error('拨打失败:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Plivo 通话测试
          </h1>
          <p className="text-gray-600">
            使用 Plivo Browser SDK 进行 WebRTC 通话
          </p>
        </div>

        {/* 连接状态 - 内联组件 */}
        <div className="mb-6 text-center space-y-2">
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
            callState.isConnected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              callState.isConnected ? 'bg-green-500' : 'bg-gray-400'
            }`} />
            {callState.isConnected ? '已连接' : '未连接'}
          </div>
          
          {callState.isConnected && (
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              isClientReady ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                isClientReady ? 'bg-blue-500' : 'bg-yellow-500'
              }`} />
              {isClientReady ? '客户端就绪' : '客户端同步中...'}
            </div>
          )}
        </div>

        {/* 错误显示 - 内联组件 */}
        {callState.error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
            <p className="text-red-800 text-sm">❌ {callState.error}</p>
          </div>
        )}

        {/* 登录按钮 - 内联组件 */}
        <div className="mb-6">
          {!callState.isConnected ? (
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              🔐 连接 Plivo
            </button>
          ) : (
            <button
              onClick={logout}
              className="w-full py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
            >
              🚪 断开连接
            </button>
          )}
        </div>

        {/* 通话状态显示 */}
        <div className="mb-6">
          <CallStatus
            callState={callState}
            onHangup={hangupCall}
            onToggleMute={toggleMute}
            onAnswer={() => answerCall(callState.currentCall?.callUUID)}
            onReject={() => rejectCall(callState.currentCall?.callUUID)}
          />
        </div>

        {/* 拨号器 */}
        <DialPad
          onCall={handleCall}
          isConnected={callState.isConnected}
          isInCall={callState.isInCall}
          isClientReady={isClientReady}
        />

        {/* 调试信息 */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs">
            <details>
              <summary className="font-semibold cursor-pointer">调试信息</summary>
              <pre className="mt-2 text-gray-600">
                {JSON.stringify(callState, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
