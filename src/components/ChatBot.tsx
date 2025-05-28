
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send, Minimize2, Maximize2, X, Phone, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
  isThinking?: boolean;
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
  const [isThinking, setIsThinking] = useState(false);
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

  const analyzeQuestion = (question: string, language: string): string => {
    const analysisSteps = [];
    const keywords = question.toLowerCase().split(' ');
    
    // Language detection
    const swahiliWords = ['habari', 'jambo', 'asante', 'karibu', 'daktari', 'hospitali', 'afya', 'mgonjwa'];
    const hasSwahili = swahiliWords.some(word => keywords.includes(word));
    
    if (hasSwahili && language === 'english') {
      analysisSteps.push("Detecting Swahili words in question");
    }
    
    // Medical context detection
    const medicalKeywords = {
      english: ['doctor', 'hospital', 'medicine', 'pain', 'symptoms', 'appointment', 'health', 'treatment'],
      swahili: ['daktari', 'hospitali', 'dawa', 'maumivu', 'dalili', 'miadi', 'afya', 'matibabu']
    };
    
    const currentMedicalKeywords = medicalKeywords[language as keyof typeof medicalKeywords];
    const hasMedicalContext = currentMedicalKeywords.some(word => keywords.includes(word));
    
    if (hasMedicalContext) {
      analysisSteps.push("Medical context detected");
    }
    
    // Urgency detection
    const urgencyWords = {
      english: ['urgent', 'emergency', 'help', 'pain', 'serious'],
      swahili: ['haraka', 'dharura', 'msaada', 'maumivu', 'kali']
    };
    
    const currentUrgencyWords = urgencyWords[language as keyof typeof urgencyWords];
    const hasUrgency = currentUrgencyWords.some(word => keywords.includes(word));
    
    if (hasUrgency) {
      analysisSteps.push("Urgency indicators found");
    }
    
    return analysisSteps.join(" → ");
  };

  const generateBotResponse = (userMessage: string): { response: string; thinking: string } => {
    const message = userMessage.toLowerCase();
    const customerServiceNumber = '+254 74 709 7433';
    
    // Generate thinking process
    const thinking = analyzeQuestion(userMessage, language);
    
    // Enhanced medical knowledge base
    const medicalResponses = {
      english: {
        fever: "For fever, rest and stay hydrated. If temperature exceeds 39°C (102°F) or persists for more than 3 days, please contact a healthcare provider immediately at " + customerServiceNumber,
        headache: "Common headaches can be managed with rest, hydration, and over-the-counter pain relievers. If severe or persistent, please consult a doctor at " + customerServiceNumber,
        cough: "For persistent cough, stay hydrated and avoid irritants. If accompanied by fever, difficulty breathing, or blood, seek immediate medical attention at " + customerServiceNumber,
        appointment: "To schedule an appointment, please call our customer service at " + customerServiceNumber + ". They can help you find available slots with appropriate specialists.",
        medication: "For medication questions, please consult with a healthcare provider. You can reach our medical team at " + customerServiceNumber,
        emergency: "If this is a medical emergency, please call emergency services immediately or contact our urgent care line at " + customerServiceNumber
      },
      swahili: {
        homa: "Kwa homa, pumzika na kunywa maji mengi. Ikiwa joto ni zaidi ya 39°C au linaendelea kwa siku 3, wasiliana na daktari mara moja kwa " + customerServiceNumber,
        kichwa: "Maumivu ya kichwa yanaweza kupunguzwa kwa kupumzika na kunywa maji. Ikiwa ni makali, wasiliana na daktari kwa " + customerServiceNumber,
        kikohozi: "Kwa kikohozi kinachoendelea, nywa maji mengi. Ikiwa kina homa au ugumu wa kupumua, tafuta msaada wa haraka kwa " + customerServiceNumber,
        miadi: "Kupanga miadi, piga simu " + customerServiceNumber + ". Watakusaidia kupata nafasi za madaktari.",
        dawa: "Kwa maswali ya dawa, ongea na daktari. Unaweza kuwasiliana nao kwa " + customerServiceNumber,
        dharura: "Ikiwa hii ni dharura ya kiafya, piga simu ya dharura au wasiliana nasi kwa " + customerServiceNumber
      }
    };

    // General responses
    const generalResponses = {
      english: {
        greeting: [
          `Hello ${userName}! I'm ARIA, your AI health assistant. I can help with basic health information and guide you to appropriate care. How can I assist you today?`,
          `Good ${getTimeOfDay()} ${userName}! I'm here to help with health questions and connect you with our medical team when needed.`,
          `Hi ${userName}! I can provide health guidance and help you access our services. What would you like to know?`
        ],
        fallback: [
          `I understand your concern, but for detailed medical advice, please contact our healthcare professionals at ${customerServiceNumber}. They can provide personalized guidance.`,
          `This is an important question that requires professional medical attention. Please call our medical team at ${customerServiceNumber} for proper assistance.`,
          `For your safety and best care, I recommend speaking with our qualified medical staff at ${customerServiceNumber} about this matter.`
        ],
        thanks: [
          "You're welcome! Remember, for any medical concerns, our team at " + customerServiceNumber + " is here to help.",
          "Happy to assist! Don't hesitate to call our medical professionals at " + customerServiceNumber + " for detailed care.",
          "My pleasure! Our healthcare team at " + customerServiceNumber + " is available for comprehensive medical support."
        ]
      },
      swahili: {
        greeting: [
          `Habari ${userName}! Mimi ni ARIA, msaidizi wako wa afya. Ninaweza kusaidia na taarifa za kimsingi za afya na kukuelekeza mahali pa huduma. Ninaweza kukusaidiaje?`,
          `Habari za ${getTimeOfDay()} ${userName}! Niko hapa kusaidia na maswali ya afya na kukuunganisha na timu yetu ya matibabu inapohitajika.`,
          `Hujambo ${userName}! Ninaweza kutoa mwongozo wa afya na kukusaidia kupata huduma zetu. Ungependa kujua nini?`
        ],
        fallback: [
          `Naelewa wasiwasi wako, lakini kwa ushauri wa kina wa matibabu, tafadhali wasiliana na wataalamu wetu wa afya kwa ${customerServiceNumber}. Wanaweza kutoa mwongozo maalum.`,
          `Hili ni swali muhimu linalohitaji uangalifu wa kitaalamu wa matibabu. Tafadhali piga simu timu yetu ya matibabu kwa ${customerServiceNumber} kwa msaada sahihi.`,
          `Kwa usalama wako na huduma bora, napendekeza uongee na wafanyakazi wetu wa kimatibabu kwa ${customerServiceNumber} kuhusu jambo hili.`
        ],
        thanks: [
          "Karibu! Kumbuka, kwa wasiwasi wowote wa kimatibabu, timu yetu kwa " + customerServiceNumber + " iko tayari kusaidia.",
          "Nimefurahi kusaidia! Usisite kupiga simu wataalamu wetu wa matibabu kwa " + customerServiceNumber + " kwa huduma kamili.",
          "Karibu sana! Timu yetu ya afya kwa " + customerServiceNumber + " inapatikana kwa msaada kamili wa kimatibabu."
        ]
      }
    };

    // Check for specific medical topics
    const currentMedicalResponses = medicalResponses[language as keyof typeof medicalResponses];
    for (const [topic, response] of Object.entries(currentMedicalResponses)) {
      if (message.includes(topic)) {
        return { response, thinking };
      }
    }

    // Check for greetings
    if (message.includes('hello') || message.includes('hi') || message.includes('hey') || 
        (language === 'swahili' && (message.includes('hujambo') || message.includes('jambo') || message.includes('habari')))) {
      return { 
        response: getRandomResponse(generalResponses[language].greeting), 
        thinking 
      };
    }

    // Check for thanks
    if (message.includes('thank') || message.includes('thanks') || 
        (language === 'swahili' && (message.includes('asante') || message.includes('shukrani')))) {
      return { 
        response: getRandomResponse(generalResponses[language].thanks), 
        thinking 
      };
    }

    // Fallback to customer service
    return { 
      response: getRandomResponse(generalResponses[language].fallback), 
      thinking 
    };
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
    setIsThinking(true);

    // Show thinking process
    setTimeout(() => {
      const { response, thinking } = generateBotResponse(inputValue);
      
      if (thinking) {
        const thinkingMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `🤔 ${language === 'english' ? 'Thinking' : 'Ninafikiria'}: ${thinking}`,
          isBot: true,
          timestamp: new Date(),
          isThinking: true
        };
        setMessages(prev => [...prev, thinkingMessage]);
      }

      setIsThinking(false);
      setIsTyping(true);

      // Show actual response after thinking
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 2).toString(),
          content: response,
          isBot: true,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 1500);
    }, 1000);
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

  const openWhatsApp = () => {
    const message = language === 'english' 
      ? "Hello, I need medical assistance" 
      : "Hujambo, nahitaji msaada wa kimatibabu";
    window.open(`https://wa.me/254747097433?text=${encodeURIComponent(message)}`);
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
              ARIA - {language === 'english' ? 'AI Health Assistant' : 'Msaidizi wa Afya wa AI'}
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
                  onClick={openWhatsApp}
                  className="text-white hover:bg-white/20 p-1"
                  title={language === 'english' ? 'WhatsApp support' : 'Msaada wa WhatsApp'}
                >
                  <MessageCircle className="h-4 w-4" />
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
                <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                  <p className="text-sm">
                    {language === 'english'
                      ? "Hi! I'm ARIA, your AI health assistant. Ask me anything about health in English or Swahili!"
                      : "Habari! Mimi ni ARIA, msaidizi wako wa afya wa AI. Niulize chochote kuhusu afya kwa Kiingereza au Kiswahili!"
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
                        ? message.isThinking
                          ? "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-700"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
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
              
              {(isTyping || isThinking) && (
                <div className="flex justify-start mb-4">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 shadow-md">
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

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    language === 'english'
                      ? "Ask me about health in English or Swahili..."
                      : "Niulize kuhusu afya kwa Kiingereza au Kiswahili..."
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputValue.trim()}
                  className="medical-gradient text-white hover:opacity-90 transition-opacity px-3"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                {language === 'english' 
                  ? `Need help? Call: +254 74 709 7433 | WhatsApp available`
                  : `Unahitaji msaada? Piga: +254 74 709 7433 | WhatsApp inapatikana`}
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ChatBot;
