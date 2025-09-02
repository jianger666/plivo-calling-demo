// 格式化电话号码
export const formatPhoneNumber = (phoneNumber: string): string => {
  return phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
};

// 解锁浏览器音频权限
export const unlockAudioContext = async (): Promise<void> => {
  if (typeof window === 'undefined') return; // 服务器端直接返回
  
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const audioContext = new AudioContextClass();
    const buffer = audioContext.createBuffer(1, 1, 22050);
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start();
    await audioContext.resume();
  } catch {
    // 忽略音频权限错误
  }
};

// API 请求封装
export const apiRequest = async (url: string, options: RequestInit = {}): Promise<{ token?: string; callId?: string; [key: string]: unknown }> => {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`请求失败: ${response.status}`);
  }

  return response.json();
};


