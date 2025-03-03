
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface KarmicMatrixProps {
  karmicData: any;
  backgroundImage?: string;
}

const KarmicMatrix: React.FC<KarmicMatrixProps> = ({ 
  karmicData,
  backgroundImage = "https://darkorange-goldfinch-896244.hostingersite.com/wp-content/uploads/2025/02/Design-sem-nome-1.png"
}) => {
  const [imgSrc, setImgSrc] = useState(backgroundImage);
  
  console.log("KarmicMatrix: Dados recebidos:", karmicData);
  
  // Criar dados kármicos seguros (garantindo valores padrão para campos ausentes)
  const safeKarmicData = {
    karmicSeal: karmicData?.karmicSeal || 0,
    destinyCall: karmicData?.destinyCall || 0,
    karmaPortal: karmicData?.karmaPortal || 0,
    karmicInheritance: karmicData?.karmicInheritance || 0,
    karmicReprogramming: karmicData?.karmicReprogramming || 0,
    cycleProphecy: karmicData?.cycleProphecy || 0,
    spiritualMark: karmicData?.spiritualMark || 0,
    manifestationEnigma: karmicData?.manifestationEnigma || 0
  };
  
  console.log("KarmicMatrix: Dados seguros:", safeKarmicData);
  
  // Pré-carrega a imagem para garantir que ela esteja disponível
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      console.log("KarmicMatrix: Imagem carregada com sucesso");
    };
    img.onerror = () => {
      console.error("KarmicMatrix: Erro ao carregar imagem. Usando fallback.");
      setImgSrc("/placeholder.svg");
    };
    img.src = backgroundImage;
  }, [backgroundImage]);
  
  // Posições corrigidas dos números baseadas no HTML fornecido
  const numberPositions = {
    karmicSeal: { top: "5.5%", left: "47%" },       // selo_karmico
    destinyCall: { top: "24%", left: "25%" },       // chamado_destino
    karmaPortal: { top: "24%", left: "72%" },       // portal_karma
    karmicInheritance: { top: "48%", left: "25%" }, // heranca_karmica
    karmicReprogramming: { top: "75%", left: "47%" }, // codex_reprogramacao
    cycleProphecy: { top: "58%", left: "72%" },     // profecia_ciclos - CORRIGIDO: movido para BAIXO, abaixo da árvore
    spiritualMark: { top: "72%", left: "25%" },     // marca_espiritual
    manifestationEnigma: { top: "85%", left: "72%" } // enigma_manifestacao
  };

  // Mapeamento entre nossos nomes de chaves e os do HTML
  const numbersToDisplay = [
    { key: 'karmicSeal', value: safeKarmicData.karmicSeal, title: "Selo Kármico 2025" },
    { key: 'destinyCall', value: safeKarmicData.destinyCall, title: "Chamado do Destino 2025" },
    { key: 'karmaPortal', value: safeKarmicData.karmaPortal, title: "Portal do Karma 2025" },
    { key: 'karmicInheritance', value: safeKarmicData.karmicInheritance, title: "Herança Kármica 2025" },
    { key: 'karmicReprogramming', value: safeKarmicData.karmicReprogramming, title: "Códex da Reprogramação 2025" },
    { key: 'cycleProphecy', value: safeKarmicData.cycleProphecy, title: "Profecia dos Ciclos 2025" },
    { key: 'spiritualMark', value: safeKarmicData.spiritualMark, title: "Marca Espiritual 2025" },
    { key: 'manifestationEnigma', value: safeKarmicData.manifestationEnigma, title: "Enigma da Manifestação 2025" }
  ];

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Background matrix image */}
      <div 
        className="w-full h-auto aspect-square"
        style={{ 
          backgroundImage: `url(${imgSrc})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          border: '1px solid #EAE6E1',
          borderRadius: '8px',
          minHeight: '300px' // Altura mínima para evitar colapso enquanto carrega
        }}
      >
        {/* Renderizar os números */}
        {numbersToDisplay.map((item, index) => {
          const position = numberPositions[item.key];
          return (
            <div
              key={item.key}
              className="absolute print:!opacity-100"
              style={{ 
                top: position.top, 
                left: position.left,
                transform: "translate(-50%, -50%)"
              }}
            >
              <div className="flex items-center justify-center">
                <span className="bg-white bg-opacity-80 rounded-full w-12 h-12 flex items-center justify-center text-lg font-serif font-bold text-karmic-800 shadow-lg print:shadow-none print:border print:border-karmic-300">
                  {item.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KarmicMatrix;
