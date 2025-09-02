'use client'

import type { CallState } from '@/types/plivo';

interface CallStatusProps {
  callState: CallState;
  onHangup: () => void;
  onToggleMute: () => void;
  onAnswer?: () => void;
  onReject?: () => void;
}

export default function CallStatus({ callState, onHangup, onToggleMute, onAnswer, onReject }: CallStatusProps) {
  if (!callState.isInCall && callState.callStatus === 'idle') {
    return null;
  }

  const getStatusText = () => {
    const isIncoming = callState.currentCall?.direction === 'inbound';
    
    switch (callState.callStatus) {
      case 'connecting':
        return '正在连接...';
      case 'ringing':
        return isIncoming ? '来电...' : '振铃中...';
      case 'connected':
        return '通话中';
      case 'ended':
        return '通话已结束';
      default:
        return '未知状态';
    }
  };

  const getStatusColor = () => {
    switch (callState.callStatus) {
      case 'connecting':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'ringing':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'connected':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'ended':
        return 'bg-gray-100 border-gray-300 text-gray-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className={`rounded-lg border-2 p-6 w-full max-w-sm mx-auto ${getStatusColor()}`}>
      <div className="text-center mb-4">
        <div className="text-2xl mb-2">
          {callState.callStatus === 'connected' ? '📞' : 
           callState.callStatus === 'ringing' ? '📳' : 
           callState.callStatus === 'connecting' ? '⏳' : '📵'}
        </div>
        <h3 className="text-lg font-semibold mb-1">
          {getStatusText()}
        </h3>
        {callState.currentCall && (
          <p className="text-sm opacity-75">
            {callState.currentCall.phoneNumber}
          </p>
        )}
      </div>

      {/* 通话控制按钮 */}
      {(callState.callStatus === 'connected' || callState.callStatus === 'ringing') && (
        <div className="flex justify-center space-x-4">
          {/* 来电按钮 - 接听/拒绝 */}
          {callState.callStatus === 'ringing' && callState.currentCall?.direction === 'inbound' && (
            <>
              <button
                onClick={onAnswer}
                className="px-6 py-2 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 transition-colors"
              >
                ✅ 接听
              </button>
              <button
                onClick={onReject}
                className="px-6 py-2 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors"
              >
                ❌ 拒绝
              </button>
            </>
          )}
          
          {/* 通话中按钮 - 静音/挂断 */}
          {callState.callStatus === 'connected' && (
            <>
              <button
                onClick={onToggleMute}
                className="px-4 py-2 rounded-full font-medium transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                🔊 静音
              </button>
              <button
                onClick={onHangup}
                className="px-6 py-2 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors"
              >
                ❌ 挂断
              </button>
            </>
          )}
          
          {/* 呼出振铃按钮 - 只有挂断 */}
          {callState.callStatus === 'ringing' && callState.currentCall?.direction === 'outbound' && (
            <button
              onClick={onHangup}
              className="px-6 py-2 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors"
            >
              ❌ 取消
            </button>
          )}
        </div>
      )}
    </div>
  );
}
