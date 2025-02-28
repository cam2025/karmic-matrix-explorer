

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { getInterpretation } from "@/lib/interpretations";

// Definição dos tipos
interface MatrixInterpretationsProps {
  karmicData: {
    karmicSeal: number;
    destinyCall: number;
    karmaPortal: number;
    karmicInheritance: number;
    karmicReprogramming: number;
    cycleProphecy: number;
    spiritualMark: number;
    manifestationEnigma: number;
  } | undefined;
}

interface InterpretationItemProps {
  title: string;
  number: number;
  interpretation: string;
  isOpen?: boolean;
  onToggle?: () => void;
  initialExpanded?: boolean;
}

const InterpretationCard: React.FC<InterpretationItemProps> = ({
  title,
  number,
  interpretation,
  initialExpanded = false
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const isMobile = useIsMobile();
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Função para processar emojis no texto
  const processContent = (content: string) => {
    return content;
  };

  // Corrigir o HTML que vem da interpretação
  const sanitizeHtml = (html: string) => {
    // Remover quebras de linha extras e espaços
    return html.replace(/\n\s*\n/g, '\n').trim();
  };
  
  return (
    <div className="karmic-card">
      <div className="flex justify-between items-center cursor-pointer" onClick={toggleExpand}>
        <div className="flex items-center">
          <div className="karmic-number mr-3">{number}</div>
          <h3 className="text-lg font-serif font-medium text-karmic-800">{title}</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="interpretation-toggle p-1 h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            toggleExpand();
          }}
        >
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </Button>
      </div>
      
      <div className={`interpretation-content ${isExpanded ? '' : 'hidden'}`}>
        {interpretation && (
          <div 
            className="prose-karmic karmic-content"
            dangerouslySetInnerHTML={{ 
              __html: sanitizeHtml(processContent(interpretation)) 
            }}
          />
        )}
      </div>
    </div>
  );
};

// Componente principal para exibir as interpretações da matriz
const MatrixInterpretations: React.FC<MatrixInterpretationsProps> = ({ karmicData }) => {
  const [interpretations, setInterpretations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Carregar interpretações
  const loadInterpretations = async () => {
    setLoading(true);
    try {
      if (!karmicData) {
        throw new Error("Dados kármicos não disponíveis");
      }
      
      const allInterpretations: Record<string, string> = {};
      
      // Obter interpretações para cada número kármico
      const keys = Object.keys(karmicData) as Array<keyof typeof karmicData>;
      
      for (const key of keys) {
        const number = karmicData[key];
        const interpretation = await getInterpretation(key, number);
        // Fix: Extract the content from Interpretation object
        allInterpretations[key] = typeof interpretation === 'string' 
          ? interpretation 
          : interpretation.content || "Interpretação não disponível no momento.";
      }
      
      setInterpretations(allInterpretations);
    } catch (error) {
      console.error("Erro ao carregar interpretações:", error);
      toast({
        title: "Erro ao carregar interpretações",
        description: "Não foi possível obter as interpretações dos números kármicos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (karmicData) {
      loadInterpretations();
    }
  }, [karmicData]);
  
  const forceReloadInterpretations = () => {
    toast({
      title: "Recarregando interpretações",
      description: "Aguarde enquanto atualizamos as interpretações kármicas..."
    });
    loadInterpretations();
  };
  
  // Definir os títulos para cada número kármico
  const numberTitles = {
    karmicSeal: "Selo Kármico 2025",
    destinyCall: "Chamado do Destino 2025",
    karmaPortal: "Portal do Karma 2025",
    karmicInheritance: "Herança Kármica 2025",
    karmicReprogramming: "Códex da Reprogramação 2025",
    cycleProphecy: "Profecia dos Ciclos 2025",
    spiritualMark: "Marca Espiritual 2025",
    manifestationEnigma: "Enigma da Manifestação 2025"
  };
  
  if (!karmicData) {
    return (
      <div className="p-6 bg-amber-50 rounded-lg text-center text-amber-800">
        Dados kármicos não disponíveis. Por favor, verifique sua data de nascimento.
      </div>
    );
  }
  
  // Ordenar as interpretações na ordem desejada
  const interpretationOrder = [
    'karmicSeal',
    'destinyCall',
    'karmaPortal', 
    'karmicInheritance',
    'karmicReprogramming',
    'cycleProphecy',
    'spiritualMark',
    'manifestationEnigma'
  ];
  
  return (
    <div className="matrix-interpretations">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-serif font-medium text-karmic-800 mb-4 md:mb-0">
          Interpretações da sua Matriz
        </h2>
        
        <Button
          variant="outline"
          size="sm"
          onClick={forceReloadInterpretations}
          className="h-8 text-xs border-amber-400 text-amber-700 hover:bg-amber-100 mb-4"
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Recarregar Interpretações
        </Button>
      </div>
      
      <Separator className="mb-8 bg-karmic-200" />
      
      {loading ? (
        <div className="text-center py-10">
          <RefreshCw className="h-8 w-8 text-karmic-600 animate-spin mx-auto mb-4" />
          <p className="text-karmic-700">Carregando interpretações kármicas...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {interpretationOrder.map((key, index) => {
            const karmicKey = key as keyof typeof karmicData;
            const number = karmicData[karmicKey];
            const title = numberTitles[karmicKey as keyof typeof numberTitles];
            const interpretation = interpretations[karmicKey] || "Interpretação não disponível.";
            
            return (
              <InterpretationCard
                key={karmicKey}
                title={title}
                number={number}
                interpretation={interpretation}
                initialExpanded={index === 0} // Primeiro item expandido por padrão
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MatrixInterpretations;
