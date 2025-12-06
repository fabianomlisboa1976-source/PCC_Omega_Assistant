import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Trash2, Edit } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

const AI_PROVIDERS = [
  { id: "openai", name: "ChatGPT (OpenAI)" },
  { id: "gemini", name: "Gemini (Google)" },
  { id: "manus", name: "Manus" },
  { id: "deepseek", name: "Deepseek" },
  { id: "grok", name: "Grok (xAI)" },
  { id: "claude", name: "Claude (Anthropic)" },
  { id: "mistral", name: "Mistral AI" },
  { id: "llama", name: "Llama (Meta)" },
  { id: "falcon", name: "Falcon (TII)" },
  { id: "cohere", name: "Cohere" },
  { id: "vertex", name: "Vertex AI (Google)" },
  { id: "huggingface", name: "Hugging Face" },
  { id: "perplexity", name: "Perplexity AI" },
  { id: "you", name: "You.com" },
  { id: "bing", name: "Bing AI (Microsoft)" },
  { id: "ernie", name: "ERNIE Bot (Baidu)" },
];

export default function Settings() {
  const { user } = useAuth();
  const [fontSize, setFontSize] = useState(14);
  const [aiCredentials, setAiCredentials] = useState<any[]>([]);
  const [specialists, setSpecialists] = useState<any[]>([]);
  const [newAiProvider, setNewAiProvider] = useState("");
  const [newApiKey, setNewApiKey] = useState("");

  const handleAddAiCredential = () => {
    if (newAiProvider && newApiKey) {
      setAiCredentials([
        ...aiCredentials,
        {
          id: Date.now(),
          provider: newAiProvider,
          apiKey: newApiKey.substring(0, 10) + "...",
          isActive: true,
        },
      ]);
      setNewAiProvider("");
      setNewApiKey("");
    }
  };

  const handleRemoveAiCredential = (id: number) => {
    setAiCredentials(aiCredentials.filter((c) => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontSize: `${fontSize}px` }}>
      {/* Header */}
      <div className="bg-gray-950 border-b border-gray-800 p-4 flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold">Configurações</h1>
      </div>

      {/* Settings Tabs */}
      <div className="p-4">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="bg-gray-900 border border-gray-800 w-full">
            <TabsTrigger value="general" className="flex-1">
              Geral
            </TabsTrigger>
            <TabsTrigger value="ias" className="flex-1">
              IAs
            </TabsTrigger>
            <TabsTrigger value="specialists" className="flex-1">
              Especialistas
            </TabsTrigger>
            <TabsTrigger value="metacognition" className="flex-1">
              Metacognição
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-4 mt-4">
            <Card className="bg-gray-900 border-gray-800 p-4">
              <h2 className="text-lg font-semibold mb-4">Configurações Gerais</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Tamanho da Fonte</label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="range"
                      min="10"
                      max="24"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-400 w-12">{fontSize}px</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-2">Tema</label>
                  <div className="flex gap-2">
                    <Button variant="outline" className="bg-gray-800 border-gray-700">
                      Escuro Extremo
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* AI Credentials */}
          <TabsContent value="ias" className="space-y-4 mt-4">
            <Card className="bg-gray-900 border-gray-800 p-4">
              <h2 className="text-lg font-semibold mb-4">Gerenciar IAs Remotas</h2>
              <div className="space-y-4">
                {/* Add new AI */}
                <div className="border border-gray-700 rounded p-4 space-y-3">
                  <select
                    value={newAiProvider}
                    onChange={(e) => setNewAiProvider(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                  >
                    <option value="">Selecione uma IA...</option>
                    {AI_PROVIDERS.map((provider) => (
                      <option key={provider.id} value={provider.id}>
                        {provider.name}
                      </option>
                    ))}
                  </select>
                  <Input
                    type="password"
                    placeholder="Chave de API"
                    value={newApiKey}
                    onChange={(e) => setNewApiKey(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  <Button
                    onClick={handleAddAiCredential}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar IA
                  </Button>
                </div>

                {/* List of configured AIs */}
                <div className="space-y-2">
                  {aiCredentials.map((cred) => (
                    <div
                      key={cred.id}
                      className="flex items-center justify-between bg-gray-800 p-3 rounded border border-gray-700"
                    >
                      <div>
                        <p className="font-medium">
                          {AI_PROVIDERS.find((p) => p.id === cred.provider)?.name}
                        </p>
                        <p className="text-sm text-gray-400">{cred.apiKey}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveAiCredential(cred.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Specialists */}
          <TabsContent value="specialists" className="space-y-4 mt-4">
            <Card className="bg-gray-900 border-gray-800 p-4">
              <h2 className="text-lg font-semibold mb-4">Especialistas (Perninhas)</h2>
              <p className="text-sm text-gray-400 mb-4">
                Crie especialistas personalizados para análise de respostas
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Novo Especialista
              </Button>
            </Card>
          </TabsContent>

          {/* Metacognition */}
          <TabsContent value="metacognition" className="space-y-4 mt-4">
            <Card className="bg-gray-900 border-gray-800 p-4">
              <h2 className="text-lg font-semibold mb-4">Configuração de Metacognição</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Prompt do Sistema</label>
                  <textarea
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                    rows={6}
                    placeholder="Digite o prompt do sistema..."
                  />
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Salvar Configurações
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
