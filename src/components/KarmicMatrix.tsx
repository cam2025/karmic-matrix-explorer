
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface KarmicMatrixProps {
  karmicData: any;
  backgroundImage?: string;
}

const KarmicMatrix: React.FC<KarmicMatrixProps> = ({ 
  karmicData,
  backgroundImage = "https://darkorange-goldfinch-896244.hostingersite.com/wp-content/uploads/2025/02/Design-sem-nome-1.png"
}) => {
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
  
  // Mapeamento entre os IDs do HTML e as chaves dos dados kármicos
  const idToKeyMap = {
    selo_karmico: 'karmicSeal',
    chamado_destino: 'destinyCall',
    portal_karma: 'karmaPortal',
    heranca_karmica: 'karmicInheritance',
    codex_reprogramacao: 'karmicReprogramming',
    profecia_ciclos: 'cycleProphecy',
    marca_espiritual: 'spiritualMark',
    enigma_manifestacao: 'manifestationEnigma'
  };
  
  // Mapeamento inverso para exibir os títulos corretos
  const keyToTitleMap = {
    karmicSeal: "Selo Kármico 2025",
    destinyCall: "Chamado do Destino 2025",
    karmaPortal: "Portal do Karma 2025",
    karmicInheritance: "Herança Kármica 2025",
    karmicReprogramming: "Códex da Reprogramação 2025",
    cycleProphecy: "Profecia dos Ciclos 2025",
    spiritualMark: "Marca Espiritual 2025",
    manifestationEnigma: "Enigma da Manifestação 2025"
  };
  
  // Função para baixar a matriz como HTML
  const downloadMatrixAsHtml = () => {
    // Cria um objeto com os dados da matriz para o HTML
    const matrizKarmica = {
      selo_karmico: safeKarmicData.karmicSeal,
      chamado_destino: safeKarmicData.destinyCall,
      portal_karma: safeKarmicData.karmaPortal,
      heranca_karmica: safeKarmicData.karmicInheritance,
      codex_reprogramacao: safeKarmicData.karmicReprogramming,
      profecia_ciclos: safeKarmicData.cycleProphecy,
      marca_espiritual: safeKarmicData.spiritualMark,
      enigma_manifestacao: safeKarmicData.manifestationEnigma
    };
    
    // Gerar o HTML para download
    const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Matriz Kármica 2025</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            background-color: #f4f4f4;
        }
        .container {
            width: 100%;
            max-width: 800px;
            height: 800px;
            margin: 20px auto;
            position: relative;
            background-image: url('${backgroundImage}');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
        }
        .numero {
            position: absolute;
            background: rgba(255, 255, 255, 0.9);
            padding: 15px;
            border-radius: 50%;
            font-size: 1.5em;
            font-weight: bold;
            text-align: center;
            color: #333;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 2px 2px 10px rgba(0,0,0,0.2);
        }
        /* Ajuste fino das posições exatas para os números */
        #selo_karmico { top: 5%; left: 47%; }
        #chamado_destino { top: 25%; left: 15%; }
        #portal_karma { top: 25%; left: 57%; }
        #heranca_karmica { top: 45%; left: 20%; }
        #codex_reprogramacao { top: 50%; left: 47%; }
        #profecia_ciclos { top: 25%; left: 85%; }
        #marca_espiritual { top: 85%; left: 10%; }
        #enigma_manifestacao { top: 85%; left: 75%; }
    </style>
</head>
<body>
    <div class="container">
        <div id="selo_karmico" class="numero">${matrizKarmica.selo_karmico}</div>
        <div id="chamado_destino" class="numero">${matrizKarmica.chamado_destino}</div>
        <div id="portal_karma" class="numero">${matrizKarmica.portal_karma}</div>
        <div id="heranca_karmica" class="numero">${matrizKarmica.heranca_karmica}</div>
        <div id="codex_reprogramacao" class="numero">${matrizKarmica.codex_reprogramacao}</div>
        <div id="profecia_ciclos" class="numero">${matrizKarmica.profecia_ciclos}</div>
        <div id="marca_espiritual" class="numero">${matrizKarmica.marca_espiritual}</div>
        <div id="enigma_manifestacao" class="numero">${matrizKarmica.enigma_manifestacao}</div>
    </div>
</body>
</html>
    `;
    
    // Criar um Blob com o conteúdo HTML
    const blob = new Blob([htmlContent], { type: 'text/html' });
    
    // Criar um link de download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const usernamePart = localStorage.getItem('currentUser') ? localStorage.getItem('currentUser').split('@')[0] : 'usuario';
    a.download = `Matriz-Karmica-${usernamePart || 'Usuario'}.html`;
    document.body.appendChild(a);
    
    // Disparar o download
    a.click();
    
    // Limpar recursos
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Container da matriz com posicionamento absoluto para os números */}
      <div className="w-full max-w-[800px] mx-auto relative print:shadow-none" 
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          height: '800px'
        }}>
        
        {/* Números kármicos com posicionamento absoluto */}
        {Object.entries(idToKeyMap).map(([htmlId, dataKey]) => {
          // Estilo de posicionamento para cada número
          const positionStyle = {};
          
          // Definir posição de acordo com o ID
          switch(htmlId) {
            case 'selo_karmico':
              Object.assign(positionStyle, { top: '5%', left: '47%' });
              break;
            case 'chamado_destino':
              Object.assign(positionStyle, { top: '25%', left: '15%' });
              break;
            case 'portal_karma':
              Object.assign(positionStyle, { top: '25%', left: '57%' });
              break;
            case 'heranca_karmica':
              Object.assign(positionStyle, { top: '45%', left: '20%' });
              break;
            case 'codex_reprogramacao':
              Object.assign(positionStyle, { top: '50%', left: '47%' });
              break;
            case 'profecia_ciclos':
              Object.assign(positionStyle, { top: '25%', left: '85%' });
              break;
            case 'marca_espiritual':
              Object.assign(positionStyle, { top: '85%', left: '10%' });
              break;
            case 'enigma_manifestacao':
              Object.assign(positionStyle, { top: '85%', left: '75%' });
              break;
          }
          
          return (
            <div 
              key={htmlId}
              id={htmlId}
              className="absolute bg-white bg-opacity-90 rounded-full text-xl font-bold text-gray-800 shadow-md flex items-center justify-center"
              style={{
                ...positionStyle,
                width: '50px',
                height: '50px',
                padding: '15px'
              }}
              title={keyToTitleMap[dataKey]}
            >
              {safeKarmicData[dataKey]}
            </div>
          );
        })}
      </div>
      
      {/* Botão de download */}
      <div className="mt-4 text-center print:hidden">
        <Button 
          onClick={downloadMatrixAsHtml}
          className="karmic-button flex items-center"
        >
          <Download className="mr-2 h-4 w-4" />
          Baixar Matriz Kármica
        </Button>
      </div>
    </div>
  );
};

export default KarmicMatrix;
