
export interface Message {
  id: string;
  sender: 'caller' | 'user' | 'system';
  text: string;
  timestamp: string;
  isRisky?: boolean;
}

export interface DetectedSignal {
  id: string;
  type: 'impersonation' | 'urgency' | 'financial' | 'manipulation';
  label: string;
  description: string;
  detected: boolean;
  status: 'scanning' | 'detected' | 'idle';
}

export interface CallState {
  isActive: boolean;
  duration: number;
  riskScore: number;
  transcript: Message[];
  signals: DetectedSignal[];
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  trustedContact: {
    name: string;
    phone: string;
  };
  protectionLevel: 'low' | 'standard' | 'high';
}
