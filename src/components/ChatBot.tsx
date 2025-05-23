
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send, Minimize2, Maximize2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatBotProps {
  userType?: 'patient' | 'doctor';
  userName?: string;
}

const ChatBot = ({ userType = 'patient', userName = 'User' }: ChatBotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Jarvis-like responses for doctors
    const doctorResponses = {
      greeting: [
        `Good ${getTimeOfDay()}, Dr. ${userName}. I am ARIA - your Adaptive Response Intelligence Assistant. How may I assist you in your medical practice today?`,
        `Welcome back, Dr. ${userName}. ARIA at your service. Shall we review your patient queue or would you prefer to discuss a specific case?`,
        `Dr. ${userName}, I have been monitoring your schedule. How may I optimize your workflow today?`
      ],
      patients: [
        "Accessing patient database... I have identified 3 patients requiring immediate attention and 7 pending follow-ups. Shall I prioritize them by risk assessment?",
        "Patient analytics indicate a 15% improvement in treatment compliance this quarter. Would you like me to generate a detailed report?",
        "I've detected anomalous patterns in Patient ID 2847's vitals. Recommend immediate consultation."
      ],
      schedule: [
        "Your schedule optimization algorithm suggests rearranging appointments 3 and 5 for maximum efficiency. Shall I implement these changes?",
        "I have blocked 30 minutes for emergency consultations based on historical data patterns.",
        "Dr. ${userName}, your next patient has a complex medical history. Pulling relevant case files now."
      ],
      default: [
        "I'm processing your request, Dr. ${userName}. Could you provide more specific parameters?",
        "My medical knowledge database is at your disposal. How may I assist with your clinical decision-making?",
        "I am continuously learning from our interactions to better serve your practice, Doctor."
      ]
    };

    // Jarvis-like responses for patients
    const patientResponses = {
      greeting: [
        `Hello ${userName}. I am ARIA, your personal health companion. Think of me as your medical assistant - always here to help you stay on track with your health journey.`,
        `Welcome to CareFlow Vision, ${userName}. I'm ARIA, designed to make your healthcare experience seamless. How may I assist you today?`,
        `Good ${getTimeOfDay()}, ${userName}. ARIA here, ready to help you manage your health with precision and care.`
      ],
      appointments: [
        "I see you have an upcoming appointment on Thursday at 2 PM with Dr. Smith. Would you like me to set a reminder or help you prepare questions?",
        "Based on your medical history, I recommend scheduling your annual check-up. Shall I find available appointments with your preferred physician?",
        "Your last visit indicated follow-up blood work was needed. I can help you locate the nearest lab facility."
      ],
      symptoms: [
        "I understand your concern. While I cannot diagnose, I can help you track your symptoms and determine if immediate medical attention is needed.",
        "Your symptom log shows improvement over the past week. This is encouraging progress. Continue monitoring and I'll alert you to any concerning patterns.",
        "Based on your input, I recommend consulting with your healthcare provider. Shall I help you schedule an appointment?"
      ],
      medications: [
        "Your medication schedule is optimized for maximum effectiveness. I'll send you gentle reminders to maintain consistency.",
        "I notice you missed your evening medication yesterday. Consistency is crucial for your treatment plan. Shall I adjust your reminder settings?",
        "Your prescription refill is due in 3 days. I can notify your pharmacy or help you contact your doctor for renewals."
      ],
      default: [
        `I'm here to support your health journey, ${userName}. Whether it's tracking symptoms, scheduling appointments, or medication reminders, I'm at your service.`,
        "My capabilities include health monitoring, appointment management, and providing general wellness guidance. How may I assist you today?",
        "I'm continuously learning to better serve your healthcare needs. Please feel free to ask me anything health-related."
      ]
    };

    const responses = userType === 'doctor' ? doctorResponses : patientResponses;

    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return getRandomResponse(responses.greeting);
    }
    
    if (userType === 'doctor') {
      if (message.includes('patient') || message.includes('case')) {
        return getRandomResponse(responses.patients);
      }
      if (message.includes('schedule') || message.includes('appointment')) {
        return getRandomResponse(responses.schedule);
      }
    } else {
      if (message.includes('appointment') || message.includes('schedule')) {
        return getRandomResponse(responses.appointments);
      }
      if (message.includes('symptom') || message.includes('pain') || message.includes('feel')) {
        return getRandomResponse(responses.symptoms);
      }
      if (message.includes('medication') || message.includes('pill') || message.includes('medicine')) {
        return getRandomResponse(responses.medications);
      }
    }
    
    return getRandomResponse(responses.default);
  };

  const getRandomResponse = (responses: string[]) => {
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay for more realistic interaction
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateBotResponse(inputValue),
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="medical-gradient text-white rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={cn(
        "transition-all duration-300 shadow-2xl border-0",
        isMinimized ? "w-80 h-16" : "w-96 h-[500px]"
      )}>
        <CardHeader className="flex flex-row items-center justify-between p-4 medical-gradient text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <h3 className="font-semibold">
              ARIA {userType === 'doctor' ? '- Medical Assistant' : '- Health Companion'}
            </h3>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:bg-white/20 p-1"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[436px]">
            <ScrollArea className="flex-1 p-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                  <p className="text-sm">
                    {userType === 'doctor' 
                      ? "Hello Doctor. I'm ARIA, your medical AI assistant. How may I assist you today?"
                      : "Hi! I'm ARIA, your personal health companion. Ask me anything about your health journey."
                    }
                  </p>
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex mb-4",
                    message.isBot ? "justify-start" : "justify-end"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg p-3 shadow-md",
                      message.isBot
                        ? "bg-gray-100 text-gray-800"
                        : "medical-gradient text-white"
                    )}
                  >
                    <div className="flex items-start space-x-2">
                      {message.isBot && <Bot className="h-4 w-4 mt-1 text-blue-500" />}
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      {!message.isBot && <User className="h-4 w-4 mt-1" />}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start mb-4">
                  <div className="bg-gray-100 rounded-lg p-3 shadow-md">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-blue-500" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </ScrollArea>

            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={userType === 'doctor' ? "Ask ARIA about patients, schedules, or medical insights..." : "Ask ARIA about your health, appointments, or medications..."}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputValue.trim()}
                  className="medical-gradient text-white hover:opacity-90 transition-opacity px-3"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ChatBot;
