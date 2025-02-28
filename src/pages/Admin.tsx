
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailManager from '@/components/admin/EmailManager';
import InterpretationEditor from '@/components/admin/InterpretationEditor';
import { Users, Book, Info } from 'lucide-react';

const Admin = () => {
  const [showInfoBox, setShowInfoBox] = useState(true);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-karmic-100 to-white py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-medium text-karmic-800 mb-2">
            Painel Administrativo
          </h1>
          <p className="text-karmic-600">
            Gerencie emails autorizados e interpretações da Matriz Kármica.
          </p>
        </div>
        
        {showInfoBox && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Importante:</strong> Seus dados são armazenados no navegador. Para evitar perda de dados, utilize as 
                  funções "Exportar" e "Importar" para fazer backup das suas interpretações regularmente.
                </p>
              </div>
              <button 
                onClick={() => setShowInfoBox(false)} 
                className="ml-auto flex-shrink-0 text-blue-400 hover:text-blue-500"
              >
                ✕
              </button>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-karmic-200">
          <Tabs defaultValue="interpretations" className="space-y-6">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="emails" className="flex items-center justify-center">
                <Users className="h-4 w-4 mr-2" />
                Emails Autorizados
              </TabsTrigger>
              <TabsTrigger value="interpretations" className="flex items-center justify-center">
                <Book className="h-4 w-4 mr-2" />
                Interpretações
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="emails">
              <EmailManager />
            </TabsContent>
            
            <TabsContent value="interpretations">
              <InterpretationEditor />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;
