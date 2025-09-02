'use client'

import { useState, useEffect, useRef, useCallback } from 'react';
import type { PlivoClient, CallState } from '@/types/plivo';
import { PLIVO_CONFIG } from '@/config/plivo';
import { formatPhoneNumber, unlockAudioContext, apiRequest } from '@/utils/plivo';

export const usePlivoClient = () => {
  const [callState, setCallState] = useState<CallState>({
    isConnected: false,
    isInCall: false,
    currentCall: null,
    callStatus: 'idle',
    error: null,
  });

  const [isClientReady, setIsClientReady] = useState(false);
  
  const plivoBrowserSdkRef = useRef<{ client:  PlivoClient } | null>(null);
  const userInitiatedHangupRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initializePlivoSDK = async () => {
      try {
        // 动态导入 Plivo SDK 避免 SSR 问题
        const { default: Plivo } = await import('plivo-browser-sdk');
        const plivoBrowserSdk = new Plivo(PLIVO_CONFIG.SDK_OPTIONS) as unknown as { client: PlivoClient };
        plivoBrowserSdkRef.current = plivoBrowserSdk;

        // 事件监听 - 简化版本
        const { client } = plivoBrowserSdk;

      client.on('onLogin', () => {
        setCallState(prev => ({ ...prev, isConnected: true, error: null }));
        setTimeout(() => setIsClientReady(true), PLIVO_CONFIG.CLIENT_READY_DELAY);
      });

      client.on('onLogout', () => {
        setCallState({ isConnected: false, isInCall: false, currentCall: null, callStatus: 'idle', error: null });
        setIsClientReady(false);
      });

      client.on('onLoginFailed', (error: Error) => {
        setCallState(prev => ({ ...prev, isConnected: false, error: `登录失败: ${error?.message}` }));
      });

      client.on('onCallTerminated', () => {
        setCallState(prev => ({ ...prev, isInCall: false, currentCall: null, callStatus: 'ended' }));
        setTimeout(() => setCallState(prev => ({ ...prev, callStatus: 'idle' })), PLIVO_CONFIG.STATUS_RESET_DELAY);
      });

      client.on('onCallAnswered', () => {
        setCallState(prev => ({ ...prev, callStatus: 'connected' }));
      });

      client.on('onCallRemoteRinging', () => {
        setCallState(prev => ({ ...prev, callStatus: 'ringing' }));
      });

      client.on('onCallFailed', (callInfo: { reason?: string }) => {
        // 如果是用户主动挂断，不显示错误
        if (userInitiatedHangupRef.current) {
          userInitiatedHangupRef.current = false;
          setCallState(prev => ({
            ...prev,
            isInCall: false,
            currentCall: null,
            callStatus: 'idle',
          }));
        } else {
          setCallState(prev => ({
            ...prev,
            isInCall: false,
            currentCall: null,
            callStatus: 'idle',
            error: `通话失败: ${callInfo.reason || '未知错误'}`,
          }));
        }
      });

      client.on('onIncomingCall', (callFrom: unknown, callUUID: unknown, extraHeaders: unknown) => {
        const phoneNumber = typeof callFrom === 'string' ? callFrom.replace('@phone.plivo.com', '') : undefined;
        let incomingCallUUID: string | undefined;
        if (extraHeaders && typeof extraHeaders === 'object') {
          const extraHeadersObj = extraHeaders as Record<string, unknown>;
          incomingCallUUID = (extraHeadersObj.callUUID as string) || (extraHeadersObj.call_uuid as string);
        }
        
        setCallState(prev => ({
          ...prev,
          isInCall: true,
          currentCall: {
            callUUID: incomingCallUUID,
            phoneNumber,
            startTime: new Date(),
            direction: 'inbound',
          },
          callStatus: 'ringing',
        }));
        });

      } catch {
        setCallState(prev => ({ ...prev, error: '初始化失败' }));
      }
    };

    initializePlivoSDK();

    return () => {
      plivoBrowserSdkRef.current?.client.logout();
    };
  }, []);



  // 创建一个通用的客户端检查函数
  const getClient = () => plivoBrowserSdkRef.current?.client;

  const login = useCallback(async () => {
    const client = getClient();
    if (!client) throw new Error('客户端未初始化');

    setCallState(prev => ({ ...prev, error: null }));
    const data = await apiRequest(PLIVO_CONFIG.TOKEN_URL, { method: 'POST' });
    if (!data.token) throw new Error('API响应中缺少token字段');
    await client.loginWithAccessToken(data.token);
  }, []);

  const makeCall = useCallback(async (phoneNumber: string) => {
    const client = getClient();
    if (!client) throw new Error('客户端未初始化');

    setCallState(prev => ({ ...prev, error: null, callStatus: 'connecting' }));
    await unlockAudioContext();

    const toNumber = formatPhoneNumber(phoneNumber);
    const data = await apiRequest(PLIVO_CONFIG.PREPARE_CALL_URL, {
      method: 'POST',
      body: JSON.stringify({ phoneNumber: toNumber }),
    });

    if (!data.callId) throw new Error('API响应中缺少callId字段');
    const success = client.call(data.callId, { 'X-PH-callerId': data.callId, 'X-PH-direction': 'outbound' });
    if (!success) throw new Error('拨打失败');

    setCallState(prev => ({
      ...prev,
      isInCall: true,
      currentCall: {
        callId: data.callId,
        phoneNumber: toNumber,
        startTime: new Date(),
        direction: 'outbound',
      },
    }));
  }, []);

  const hangupCall = useCallback(() => {
    const client = getClient();
    if (!client) return;

    // 标记为用户主动挂断
    userInitiatedHangupRef.current = true;
    
    try {
      client.hangup();
      setCallState(prev => ({ ...prev, isInCall: false, currentCall: null, callStatus: 'idle' }));
    } catch {
      userInitiatedHangupRef.current = false; // 重置状态
      setCallState(prev => ({ ...prev, error: '挂断失败' }));
    }
  }, []);

  const toggleMute = useCallback(() => {
    const client = getClient();
    if (!client) return;
    
    try {
      const muteResult = client.mute();
      if (!muteResult) client.unmute();
    } catch (error) {
      console.error('静音切换失败:', error);
    }
  }, []);

  const answerCall = useCallback((callUUID?: string) => {
    const client = getClient();
    if (!client || !callUUID) return;

    try {
      client.answer(callUUID, 'ignore');
    } catch {
      setCallState(prev => ({ ...prev, error: '接听失败' }));
    }
  }, []);

  const rejectCall = useCallback((callUUID?: string) => {
    const client = getClient();
    if (!client || !callUUID) return;

    // 标记为用户主动操作
    userInitiatedHangupRef.current = true;

    try {
      client.reject(callUUID);
      setCallState(prev => ({ ...prev, isInCall: false, currentCall: null, callStatus: 'idle' }));
    } catch {
      userInitiatedHangupRef.current = false; // 重置状态
      setCallState(prev => ({ ...prev, error: '拒绝失败' }));
    }
  }, []);

  const logout = useCallback(() => getClient()?.logout(), []);

  return {
    callState,
    isClientReady,
    login,
    makeCall,
    hangupCall,
    toggleMute,
    answerCall,
    rejectCall,
    logout,
  };
};
