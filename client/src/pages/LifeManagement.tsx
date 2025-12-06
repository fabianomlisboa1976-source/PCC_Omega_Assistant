import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CheckCircle2, Users, TrendingUp, Plus, ArrowLeft } from "lucide-react";

export default function LifeManagement() {
  const [selectedTab, setSelectedTab] = useState("calendar");

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-950 border-b border-gray-800 p-4 flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold">Gerenciamento de Vida</h1>
      </div>

      {/* Tabs */}
      <div className="p-4">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="bg-gray-900 border border-gray-800 w-full grid grid-cols-4">
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Agenda</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span className="hidden sm:inline">Tarefas</span>
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Contatos</span>
            </TabsTrigger>
            <TabsTrigger value="crm" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">CRM</span>
            </TabsTrigger>
          </TabsList>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-4 mt-4">
            <Card className="bg-gray-900 border-gray-800 p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Agenda</h2>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Evento
                </Button>
              </div>
              <div className="space-y-2">
                <p className="text-gray-400 text-sm">Nenhum evento agendado</p>
              </div>
            </Card>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-4 mt-4">
            <Card className="bg-gray-900 border-gray-800 p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Tarefas</h2>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Tarefa
                </Button>
              </div>
              <div className="space-y-2">
                <p className="text-gray-400 text-sm">Nenhuma tarefa criada</p>
              </div>
            </Card>
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts" className="space-y-4 mt-4">
            <Card className="bg-gray-900 border-gray-800 p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Contatos</h2>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Contato
                </Button>
              </div>
              <div className="space-y-2">
                <p className="text-gray-400 text-sm">Nenhum contato adicionado</p>
              </div>
            </Card>
          </TabsContent>

          {/* CRM Tab */}
          <TabsContent value="crm" className="space-y-4 mt-4">
            <Card className="bg-gray-900 border-gray-800 p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">CRM</h2>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Registro
                </Button>
              </div>
              <div className="space-y-2">
                <p className="text-gray-400 text-sm">Nenhum registro CRM criado</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
