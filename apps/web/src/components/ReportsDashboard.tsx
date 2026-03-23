'use client';

import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useApi } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';

const COLORS = ['#00D46A', '#F5A623', '#3B82F6', '#10B981', '#8B5CF6', '#EF4444', '#EAB308', '#10B981'];

export function ReportsDashboard() {
  const [cashFlowData, setCashFlowData] = useState<any[]>([]);
  const [expenseData, setExpenseData] = useState<any[]>([]);
  const [netWorthData, setNetWorthData] = useState<any[]>([]);
  const [budgetData, setBudgetData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'3' | '6' | '12'>('12');
  const { request } = useApi();

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const [cashFlow, expenses, netWorth, budget] = await Promise.all([
          request<any>(`/api/reports?action=cash-flow&months=${period}`, 'GET'),
          request<any>(`/api/reports?action=expenses&months=${period}`, 'GET'),
          request<any>(`/api/reports?action=net-worth&months=${period}`, 'GET'),
          request<any>(`/api/reports?action=budget`, 'GET'),
        ]);

        if (cashFlow?.data) setCashFlowData(cashFlow.data);
        if (expenses?.data) setExpenseData(expenses.data);
        if (netWorth?.data) setNetWorthData(netWorth.data);
        if (budget?.data) setBudgetData(budget.data);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [period, request]);

  const handleExportCsv = async (type: string) => {
    try {
      const response = await fetch(`/api/reports?action=export-csv&type=${type}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export-${type}-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleExportPdf = async (type: string) => {
    try {
      await request('/api/reports?action=export-pdf', 'POST', { type });
      alert('PDF sendo gerado. Você receberá um email em breve!');
    } catch (error) {
      console.error('PDF export failed:', error);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-400 py-12">Carregando relatórios...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Period Selector */}
      <div className="flex gap-4 mb-6">
        <Button
          variant={period === '3' ? 'default' : 'outline'}
          onClick={() => setPeriod('3')}
          className={period === '3' ? 'bg-green-500' : ''}
        >
          3 Meses
        </Button>
        <Button
          variant={period === '6' ? 'default' : 'outline'}
          onClick={() => setPeriod('6')}
          className={period === '6' ? 'bg-green-500' : ''}
        >
          6 Meses
        </Button>
        <Button
          variant={period === '12' ? 'default' : 'outline'}
          onClick={() => setPeriod('12')}
          className={period === '12' ? 'bg-green-500' : ''}
        >
          12 Meses
        </Button>
      </div>

      {/* Cash Flow Chart */}
      <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Fluxo de Caixa</h2>
          <Button onClick={() => handleExportCsv('transactions')} size="sm" className="bg-gray-700 text-white hover:bg-gray-600">
            Exportar CSV
          </Button>
        </div>
        {cashFlowData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cashFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="month" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #444', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="income" fill="#00D46A" name="Receita" />
              <Bar dataKey="expenses" fill="#EF4444" name="Despesa" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-400">Sem dados de fluxo de caixa</p>
        )}
      </div>

      {/* Expenses by Category */}
      <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Despesas por Categoria</h2>
        {expenseData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={expenseData} dataKey="amount" nameKey="category" cx="50%" cy="50%" outerRadius={100} label>
                {expenseData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #444', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-400">Sem dados de despesas</p>
        )}
      </div>

      {/* Net Worth History */}
      <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Evolução do Patrimônio</h2>
        {netWorthData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={netWorthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #444', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="netWorth" stroke="#00D46A" strokeWidth={2} name="Patrimônio" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-400">Sem dados de patrimônio</p>
        )}
      </div>

      {/* Budget Status */}
      <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Status dos Orçamentos</h2>
          <Button onClick={() => handleExportPdf('budget')} size="sm" className="bg-gray-700 text-white hover:bg-gray-600">
            Gerar PDF
          </Button>
        </div>
        {budgetData.length > 0 ? (
          <div className="space-y-4">
            {budgetData.map((budget: any, idx: number) => (
              <div key={idx} className="bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium">{budget.category}</span>
                  <span className="text-gray-400">
                    R$ {budget.spent.toFixed(2)} / R$ {budget.budgeted.toFixed(2)}
                  </span>
                </div>
                <div className="bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${budget.percentage > 100 ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                  />
                </div>
                <span className={`text-sm ${budget.percentage > 100 ? 'text-red-400' : 'text-green-400'}`}>
                  {budget.percentage.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">Sem orçamentos definidos</p>
        )}
      </div>

      {/* Export Options */}
      <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">Exportar Dados</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => handleExportCsv('transactions')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Transações CSV
          </Button>
          <Button
            onClick={() => handleExportCsv('accounts')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Contas CSV
          </Button>
          <Button
            onClick={() => handleExportCsv('bills')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Contas a Pagar CSV
          </Button>
        </div>
      </div>
    </div>
  );
}
