import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, Settings, Calendar, LogOut } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Carregando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">PCCΩ+ Assistant V7.0</h1>
          <p className="text-gray-400 text-lg">Seu assistente pessoal avançado com IA</p>
          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
          >
            Entrar com Manus
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-950 border-b border-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">PCCΩ+ Assistant V7.0</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">{user?.name}</span>
          <Button variant="ghost" size="icon" onClick={logout}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Chat Card */}
          <Card
            className="bg-gray-900 border-gray-800 p-6 cursor-pointer hover:border-blue-600 transition"
            onClick={() => setLocation("/chat")}
          >
            <div className="flex items-start gap-4">
              <MessageSquare className="w-8 h-8 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold mb-2">Chat de IA</h2>
                <p className="text-gray-400 text-sm">
                  Converse com múltiplas IAs simultaneamente com análise de metacognição
                </p>
              </div>
            </div>
          </Card>

          {/* Life Management Card */}
          <Card
            className="bg-gray-900 border-gray-800 p-6 cursor-pointer hover:border-blue-600 transition"
            onClick={() => setLocation("/life-management")}
          >
            <div className="flex items-start gap-4">
              <Calendar className="w-8 h-8 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold mb-2">Gerenciamento de Vida</h2>
                <p className="text-gray-400 text-sm">
                  Agenda, tarefas, contatos, CRM e acompanhamento de objetivos
                </p>
              </div>
            </div>
          </Card>

          {/* Settings Card */}
          <Card
            className="bg-gray-900 border-gray-800 p-6 cursor-pointer hover:border-blue-600 transition"
            onClick={() => setLocation("/settings")}
          >
            <div className="flex items-start gap-4">
              <Settings className="w-8 h-8 text-purple-500 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold mb-2">Configurações</h2>
                <p className="text-gray-400 text-sm">
                  Configure IAs, especialistas, metacognição e preferências do app
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
