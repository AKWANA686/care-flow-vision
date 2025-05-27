import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send, Minimize2, Maximize2, X, Phone } from 'lucide-react';
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
  const [language, setLanguage] = useState<'english' | 'swahili'>('english');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return language === 'swahili' ? 'asubuhi' : 'morning';
    if (hour < 17) return language === 'swahili' ? 'mchana' : 'afternoon';
    return language === 'swahili' ? 'jioni' : 'evening';
  };

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    const customerServiceNumber = '+254 74 709 7433';
    
    // General responses in both languages
    const generalResponses = {
      english: {
        greeting: [
          `Hello ${userName}! I'm ARIA, your AI assistant. How can I help you today?`,
          `Good ${getTimeOfDay()} ${userName}! What can I do for you?`,
          `Hi there ${userName}! Ask me anything and I'll do my best to help.`
        ],
        fallback: [
          `I'm not entirely sure about that one. For more complex questions, please contact our customer service at ${customerServiceNumber}.`,
          `That's an interesting question! For detailed assistance, you might want to call our support team at ${customerServiceNumber}.`,
          `I'm still learning! For this question, please reach out to our customer care: ${customerServiceNumber}`
        ],
        thanks: [
          "You're welcome! Is there anything else I can help with?",
          "Happy to help! Don't hesitate to ask if you have more questions.",
          "My pleasure! Feel free to ask me anything else."
        ],
        help: [
          "I can answer questions about health, appointments, medications, and more. What would you like to know?",
          "I'm here to help with medical information, scheduling, and general health questions. Ask me anything!",
          "How can I assist you today? I can provide health information, appointment details, and medication reminders."
        ]
      },
      swahili: {
        greeting: [
          `Habari ${userName}! Mimi ni ARIA, msaidizi wako wa AI. Ninaweza kukusaidiaje leo?`,
          `Habari za ${getTimeOfDay()} ${userName}! Nifanyie nini leo?`,
          `Hujambo ${userName}! Niulize chochote na nitajaribu kukusaidia.`
        ],
        fallback: [
          `Sijui jibu kamili la hilo. Kwa maswali magumu zaidi, tafadhali wasiliana na huduma ya wateja kwa ${customerServiceNumber}.`,
          `Hilo ni swali zuri! Kwa msaada zaidi, unaweza kupiga simu kwa timu yetu ya usaidizi: ${customerServiceNumber}.`,
          `Bado najifunza! Kwa swali hili, tafadhali wasiliana na huduma yetu ya wateja: ${customerServiceNumber}`
        ],
        thanks: [
          "Karibu! Kuna kitu kingine ninachoweza kukusaidia?",
          "Nimefurahi kukusaidia! Usisite kuuliza ikiwa una maswali zaidi.",
          "Nimefurahi! Unaweza kuuliza kitu chochote."
        ],
        help: [
          "Naweza kujibu maswali kuhusu afya, miadi, dawa, na mengineyo. Ungependa kujua nini?",
          "Niko hapa kusaidia kwa taarifa za matibabu, kupanga ratiba, na maswali ya afya ya jumla. Niulize chochote!",
          "Ninaweza kukusaidiaje leo? Naweza kutoa taarifa za afya, maelezo ya miadi, na kumbusho za dawa."
        ]
      }
    };

    // Check for greetings
    if (message.includes('hello') || message.includes('hi') || message.includes('hey') || 
        (language === 'swahili' && (message.includes('hujambo') || message.includes('jambo') || message.includes('habari')))) {
      return getRandomResponse(generalResponses[language].greeting);
    }

    // Check for thanks
    if (message.includes('thank') || message.includes('thanks') || 
        (language === 'swahili' && (message.includes('asante') || message.includes('shukrani')))) {
      return getRandomResponse(generalResponses[language].thanks);
    }

    // Check for help requests
    if (message.includes('help') || (language === 'swahili' && message.includes('msaada'))) {
      return getRandomResponse(generalResponses[language].help);
    }

    // Try to understand the question using keywords
    const understood = tryToUnderstandQuestion(message, language);
    if (understood) return understood;

    // Fallback response if question isn't understood
    return getRandomResponse(generalResponses[language].fallback);
  };

  const tryToUnderstandQuestion = (message: string, language: string): string | null => {
    // Medical keywords in both languages
    const medicalKeywords = {
      english: ['pain', 'hurt', 'symptom', 'fever', 'headache', 'medicine', 'pill', 'drug', 'appointment', 'doctor', 'hospital'],
      swahili: ['maumivu', 'umwa', 'dalili', 'homa', 'kichwa', 'dawa', 'kidonge', 'dawa', 'miadi', 'daktari', 'hospitali']
    };

    const currentLanguageKeywords = medicalKeywords[language as keyof typeof medicalKeywords];
    
    // Check if message contains any medical keywords
    const hasMedicalKeyword = currentLanguageKeywords.some(keyword => message.includes(keyword));
    
    if (hasMedicalKeyword) {
      return language === 'english' 
        ? "I see you're asking about a medical topic. While I can provide general information, please consult a healthcare professional for personalized advice."
        : "Naona unauliza kuhusu mada ya matibabu. Ingawa naweza kutoa taarifa ya jumla, tafadhali shauriana na mtaalamu wa afya kwa ushauri maalum.";
    }

    return null;
  };

  const getRandomResponse = (responses: string[]) => {
    return responses[Math.floor(Math.random() * responses.length)];
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

    // Simulate typing delay
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

  const toggleLanguage = () => {
    setLanguage(language === 'english' ? 'swahili' : 'english');
  };

  const callCustomerService = () => {
    window.open(`tel:+254747097433`);
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
              ARIA - {language === 'english' ? 'AI Assistant' : 'Msaidizi wa AI'}
            </h3>
          </div>
          <div className="flex space-x-2">
            {!isMinimized && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLanguage}
                  className="text-white hover:bg-white/20 p-1 text-xs"
                >
                  {language === 'english' ? 'SW' : 'EN'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={callCustomerService}
                  className="text-white hover:bg-white/20 p-1"
                  title={language === 'english' ? 'Call support' : 'Piga simu kwa usaidizi'}
                >
                  <Phone className="h-4 w-4" />
                </Button>
              </>
            )}
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
                    {language === 'english'
                      ? "Hi! I'm ARIA, your AI assistant. Ask me anything in English or Swahili!"
                      : "Habari! Mimi ni ARIA, msaidizi wako wa AI. Niulize chochote kwa Kiingereza au Kiswahili!"
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
                  placeholder={
                    language === 'english'
                      ? "Ask me anything in English or Swahili..."
                      : "Niulize chochote kwa Kiingereza au Kiswahili..."
                  }
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
              <div className="mt-2 text-xs text-gray-500 text-center">
                {language === 'english' 
                  ? `Can't answer? Call support: +254 74 709 7433`
                  : `Hawezi kujibu? Piga usaidizi: +254 74 709 7433`}
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ChatBot;
