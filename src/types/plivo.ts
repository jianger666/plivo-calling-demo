// 直接导出 Plivo SDK 的类型
export type { Client as PlivoClient } from 'plivo-browser-sdk/client';

// 应用状态类型
export interface CallState {
  isConnected: boolean;
  isInCall: boolean;
  currentCall: {
    callId?: string;
    callUUID?: string;
    phoneNumber?: string;
    startTime?: Date;
    direction?: 'inbound' | 'outbound';
  } | null;
  callStatus: 'idle' | 'connecting' | 'ringing' | 'connected' | 'ended';
  error: string | null;
}
