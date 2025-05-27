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

interface DoctorResponses {
  greeting: string[];
  patients: string[];
  schedule: string[];
  default: string[];
}

interface PatientResponses {
  greeting: string[];
  appointments: string[];
  symptoms: string[];
  medications: string[];
  default: string[];
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
    
    // Doctor responses in both languages
    const doctorResponses: Record<'english' | 'swahili', DoctorResponses> = {
      english: {
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
          `Dr. ${userName}, your next patient has a complex medical history. Pulling relevant case files now.`
        ],
        default: [
          `I'm processing your request, Dr. ${userName}. Could you provide more specific parameters?`,
          "My medical knowledge database is at your disposal. How may I assist with your clinical decision-making?",
          "I am continuously learning from our interactions to better serve your practice, Doctor."
        ]
      },
      swahili: {
        greeting: [
          `Habari za ${getTimeOfDay()}, Daktari ${userName}. Mimi ni ARIA - Msaidizi Wako wa Ujasusi wa Majibu Yanayobadilika. Ninaweza kukusaidiaje katika mazoezi yako ya matibabu leo?`,
          `Karibu tena, Daktari ${userName}. ARIA yupo kwa huduma yako. Tupitie foleni ya wagonjwa au ungependa kujadili kesi fulani?`,
          `Daktari ${userName}, nimekuwa nikifuatilia ratiba yako. Ninaweza kukuwezesha kazi yako leo vipi?`
        ],
        patients: [
          "Kupata hifadhidata ya wagonjwa... Nimegundua wagonjwa 3 wanaohitaji umakini wa haraka na ufuatiliaji 7 unaosubiri. Je, niwaweke kipaumbele kulingana na tathmini ya hatari?",
          "Uchambuzi wa wagonjwa unaonyesha kuboresha kwa 15% katika utii wa matibabu robo hii. Ungependa nitengeneze ripoti ya kina?",
          "Nimegundua mifumo isiyo ya kawaida katika viashiria vya afya ya Mgonjwa ID 2847. Napendekeza ushauri wa haraka."
        ],
        schedule: [
          "Algorithmu yako ya uboreshaji wa ratiba inapendekeza kupanga upya miadi 3 na 5 kwa ufanisi wa juu. Je, nitekeleze mabadiliko haya?",
          "Nimezuia dakika 30 kwa mashauriano ya dharura kulingana na mifumo ya data ya kihistoria.",
          `Daktari ${userName}, mgonjwa wako ujao ana historia tata ya matibabu. Nimeanza kuchakura faili zinazohusiana.`
        ],
        default: [
          `Ninaichakura ombi lako, Daktari ${userName}. Unaweza kutoa vigezo zaidi?`,
          "Hifadhidata yangu ya ujuzi wa matibabu iko tayari kwa matumizi yako. Ninaweza kusaidiaje katika uamuzi wako wa kliniki?",
          "Ninaendelea kujifunza kutokana na mazungumzo yetu ili kukuhudumia vyema zaidi, Daktari."
        ]
      }
    };

    // Patient responses in both languages
    const patientResponses: Record<'english' | 'swahili', PatientResponses> = {
      english: {
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
      },
      swahili: {
        greeting: [
          `Hujambo ${userName}. Mimi ni ARIA, mwenzi wako wa afya binafsi. Nifikirie kama msaidizi wako wa matibabu - niko hapa kila wakati kukusaidia kudumisha safari yako ya afya.`,
          `Karibu kwenye CareFlow Vision, ${userName}. Mimi ni ARIA, nimeundwa kufanya uzoefu wako wa huduma za afya uwe rahisi. Ninaweza kukusaidiaje leo?`,
          `Habari za ${getTimeOfDay()}, ${userName}. ARIA yupo, tayari kukusaidia kudhibiti afya yako kwa uangalifu na upendo.`
        ],
        appointments: [
          "Naona una mkutano ujao Alhamisi saa 8 jioni na Daktari Smith. Ungependa nikuweke kumbusho au nikusaidie kuandaa maswali?",
          "Kulingana na historia yako ya matibabu, napendekeza upange uchunguzi wako wa mwaka. Je, nitafute miadi inayopatikana na daktari wako unayempendelea?",
          "Ziara yako ya mwisho ilionyesha kwamba uchunguzi wa damu wa ufuatiliaji ulihitajika. Ninaweza kukusaidia kupata kituo cha maabara kilicho karibu zaidi."
        ],
        symptoms: [
          "Ninaelewa wasiwasi wako. Ingawa siwezi kutoa utambuzi, ninaweza kukusaidia kufuatilia dalili zako na kubaini ikiwa unahitaji matibabu ya haraka.",
          "Kumbukumbu yako ya dalili inaonyesha mabadiliko chanya katika wiki iliyopita. Hii ni maendeleo yenye kuhimiza. Endelea kufuatilia na nitakutaarifu kuhusu mifumo yoyote ya wasiwasi.",
          "Kulingana na maelezo yako, napendekeza ushauri na mtoa huduma zako za afya. Je, nikusaidie kupanga mkutano?"
        ],
        medications: [
          "Ratiba yako ya dawa imeboreshwa kwa ufanisi wa juu zaidi. Nitakutumia kumbusho za upole kudumisha uthabiti.",
          "Nimeona ulikosa dawa yako ya jioni jana. Uthabiti ni muhimu kwa mpango wako wa matibabu. Je, nibadilishe mipangilio yako ya kumbusho?",
          "Kujaza upya dawa yako kunahitajika katika siku 3. Ninaweza kutaarifu duka lako la dawa au kukusaidia kuwasiliana na daktari wako kwa ajili ya kuvuja upya."
        ],
        default: [
          `Niko hapa kusaidia safari yako ya afya, ${userName}. Ikiwa ni kufuatilia dalili, kupanga miadi, au kumbusho za dawa, nipo kwa huduma yako.`,
          "Uwezo wangu ni pamoja na ufuatiliaji wa afya, usimamizi wa miadi, na kutoa mwongozo wa ustawi wa jumla. Ninaweza kukusaidiaje leo?",
          "Ninaendelea kujifunza ili kukuhudumia vyema zaidi kwa mahitaji yako ya afya. Tafadhali jisikie huru kuniuliza chochote kuhusu afya."
        ]
      }
    };

    const currentDoctorResponses = doctorResponses[language];
    const currentPatientResponses = patientResponses[language];

    if (message.includes('hello') || message.includes('hi') || message.includes('hey') || 
        (language === 'swahili' && (message.includes('hujambo') || message.includes('jambo') || message.includes('habari')))) {
      return getRandomResponse(userType === 'doctor' ? currentDoctorResponses.greeting : currentPatientResponses.greeting);
    }
    
    if (userType === 'doctor') {
      if (message.includes('patient') || message.includes('case') || 
          (language === 'swahili' && (message.includes('mgonjwa') || message.includes('kesi')))) {
        return getRandomResponse(currentDoctorResponses.patients);
      }
      if (message.includes('schedule') || message.includes('appointment') || 
          (language === 'swahili' && (message.includes('ratiba') || message.includes('muda')))) {
        return getRandomResponse(currentDoctorResponses.schedule);
      }
      return getRandomResponse(currentDoctorResponses.default);
    } else {
      if (message.includes('appointment') || message.includes('schedule') || 
          (language === 'swahili' && (message.includes('miadi') || message.includes('muda')))) {
        return getRandomResponse(currentPatientResponses.appointments);
      }
      if (message.includes('symptom') || message.includes('pain') || message.includes('feel') || 
          (language === 'swahili' && (message.includes('dalili') || message.includes('maumivu') || message.includes('hisia')))) {
        return getRandomResponse(currentPatientResponses.symptoms);
      }
      if (message.includes('medication') || message.includes('pill') || message.includes('medicine') || 
          (language === 'swahili' && (message.includes('dawa') || message.includes('vidonge')))) {
        return getRandomResponse(currentPatientResponses.medications);
      }
      return getRandomResponse(currentPatientResponses.default);
    }
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

  const toggleLanguage = () => {
    setLanguage(language === 'english' ? 'swahili' : 'english');
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
            {!isMinimized && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="text-white hover:bg-white/20 p-1 text-xs"
              >
                {language === 'english' ? 'SW' : 'EN'}
              </Button>
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
                    {userType === 'doctor' 
                      ? language === 'english' 
                        ? "Hello Doctor. I'm ARIA, your medical AI assistant. How may I assist you today?"
                        : "Hujambo Daktari. Mimi ni ARIA, msaidizi wako wa AI wa matibabu. Ninaweza kukusaidiaje leo?"
                      : language === 'english'
                        ? "Hi! I'm ARIA, your personal health companion. Ask me anything about your health journey."
                        : "Habari! Mimi ni ARIA, mwenzi wako wa afya binafsi. Niulize chochote kuhusu safari yako ya afya."
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
                    userType === 'doctor' 
                      ? language === 'english'
                        ? "Ask ARIA about patients, schedules, or medical insights..."
                        : "Uliza ARIA kuhusu wagonjwa, ratiba, au maarifa ya matibabu..."
                      : language === 'english'
                        ? "Ask ARIA about your health, appointments, or medications..."
                        : "Uliza ARIA kuhusu afya yako, miadi, au dawa..."
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
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ChatBot;
