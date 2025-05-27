
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CreditCard, Download, Calendar, DollarSign, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'subscription' | 'appointment' | 'consultation' | 'records';
  description: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  paymentMethod: string;
}

const TransactionHistory = () => {
  const [transactions] = useState<Transaction[]>([
    {
      id: 'TXN-001',
      type: 'subscription',
      description: 'Premium Plan - Monthly',
      amount: 49.99,
      status: 'completed',
      date: '2024-01-15',
      paymentMethod: '**** 4532'
    },
    {
      id: 'TXN-002',
      type: 'consultation',
      description: 'Video Consultation - Dr. Johnson',
      amount: 75.00,
      status: 'completed',
      date: '2024-01-10',
      paymentMethod: '**** 4532'
    },
    {
      id: 'TXN-003',
      type: 'records',
      description: 'Medical Records Request',
      amount: 15.00,
      status: 'pending',
      date: '2024-01-08',
      paymentMethod: '**** 4532'
    },
    {
      id: 'TXN-004',
      type: 'appointment',
      description: 'In-Person Appointment',
      amount: 120.00,
      status: 'completed',
      date: '2024-01-05',
      paymentMethod: '**** 4532'
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'subscription':
        return <CreditCard className="w-4 h-4" />;
      case 'appointment':
        return <Calendar className="w-4 h-4" />;
      case 'consultation':
        return <Calendar className="w-4 h-4" />;
      case 'records':
        return <Download className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const totalSpent = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <Card className="glass-effect border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Transaction History
          </CardTitle>
          <Badge variant="secondary" className="flex items-center">
            <DollarSign className="w-3 h-3 mr-1" />
            ${totalSpent.toFixed(2)} total
          </Badge>
        </div>
        <CardDescription>
          Your payment history and billing details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-full">
                    {getTypeIcon(transaction.type)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">
                      {transaction.description}
                    </h4>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>{transaction.date}</span>
                      <span>•</span>
                      <span>{transaction.paymentMethod}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sm">
                    ${transaction.amount.toFixed(2)}
                  </div>
                  <div className="flex items-center justify-end mt-1">
                    {getStatusIcon(transaction.status)}
                    <Badge 
                      variant="outline" 
                      className={`ml-1 text-xs ${getStatusColor(transaction.status)}`}
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" className="flex-1">
            <CreditCard className="w-4 h-4 mr-2" />
            Payment Methods
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
