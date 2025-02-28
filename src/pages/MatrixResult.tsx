
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { getCurrentUser, getUserData, logout } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import KarmicMatrix from '@/components/KarmicMatrix';
import MatrixInterpretations from '@/components/MatrixInterpretations';
import { LogOut, RefreshCw, FileText, Image } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { motion } from 'framer-motion';
import { supabaseClient, isInOfflineMode } from '@/lib/supabase';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const MatrixResult = () => {
  const [userData, setUserData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        const email = getCurrentUser();
        
        if (!email) {
          toast({
            title: "Sessão expirada",
            description: "Por favor, faça login novamente.",
            variant: "destructive"
          });
          navigate('/');
          return;
        }
        
        const data = getUserData(email);
        
        if (!data || !data.karmicNumbers) {
          toast({
            title: "Perfil incompleto",
            description: "Por favor, complete seu perfil com uma data de nascimento válida.",
            variant: "destructive"
          });
          navigate('/');
          return;
        }
        
        // Pequeno delay para garantir que tudo seja carregado corretamente
        setTimeout(() => {
          setUserData(data);
          setLoading(false);
        }, 300);
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Houve um problema ao carregar seus dados. Por favor, tente novamente.",
          variant: "destructive"
        });
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [navigate]);
  
  // Função para gerar e baixar apenas a matriz como PNG
  const handleDownloadMatrix = async () => {
    try {
      setSending(true);
      
      // Capturar apenas a matriz como imagem
      const matrixElement = document.querySelector('.karmic-matrix-container');
      if (!matrixElement) {
        throw new Error("Não foi possível encontrar a matriz para baixar");
      }
      
      const canvas = await html2canvas(matrixElement as HTMLElement, {
        scale: 2, // Melhor qualidade
        backgroundColor: "#ffffff",
        logging: false,
      });
      
      // Criar um link de download para a imagem
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `Matriz-Karmica-${userData?.name || 'Pessoal'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download concluído",
        description: "Sua Matriz Kármica foi baixada com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao gerar download da matriz:", error);
      toast({
        title: "Erro ao gerar download",
        description: "Não foi possível baixar a matriz. Por favor, tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };
  
  // Nova função para baixar apenas as interpretações como PDF
  const handleDownloadInterpretations = async () => {
    try {
      setSending(true);
      
      // Capturar apenas as interpretações
      const interpretationsElement = document.querySelector('.matrix-interpretations');
      if (!interpretationsElement) {
        throw new Error("Não foi possível encontrar as interpretações para baixar");
      }
      
      const canvas = await html2canvas(interpretationsElement as HTMLElement, {
        scale: 1.5, // Qualidade adequada para PDF
        backgroundColor: "#ffffff",
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      // Criar PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
      });
      
      // Adicionar título
      pdf.setFontSize(16);
      pdf.text("Interpretações da Matriz Kármica", 105, 15, { align: 'center' });
      pdf.setFontSize(12);
      pdf.text(`${userData?.name || 'Cliente'} - ${userData?.birthDate || 'Data não informada'}`, 105, 25, { align: 'center' });
      
      // Calcular dimensões para manter proporções
      const imgWidth = 190;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      // Adicionar imagem ao PDF
      pdf.addImage(imgData, 'JPEG', 10, 35, imgWidth, imgHeight);
      
      // Baixar o PDF
      pdf.save(`Interpretações-Matriz-Karmica-${userData?.name || 'Pessoal'}.pdf`);
      
      toast({
        title: "Download concluído",
        description: "As interpretações da sua Matriz Kármica foram baixadas com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao gerar PDF das interpretações:", error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Não foi possível baixar as interpretações. Por favor, tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Você saiu do sistema com sucesso."
    });
    navigate('/');
  };

  const handleRefresh = () => {
    setRefreshing(true);
    toast({
      title: "Atualizando",
      description: "Recarregando sua Matriz Kármica..."
    });
    
    // Simular um pequeno delay e então recarregar
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-karmic-100 to-white">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-karmic-600 animate-spin mx-auto mb-4" />
          <p className="text-karmic-700 text-lg">Carregando sua Matriz Kármica...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-karmic-100 to-white py-12 print:bg-white print:py-0">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 print:hidden">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-serif font-medium text-karmic-800">
              Matriz Kármica Pessoal 2025
            </h1>
            <p className="text-karmic-600">
              Olá, <span className="font-medium">{userData?.name || "Visitante"}</span>
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            <Button 
              onClick={handleRefresh}
              variant="outline"
              className="karmic-button-outline flex items-center"
              disabled={refreshing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            
            <Button 
              onClick={handleDownloadInterpretations}
              variant="outline"
              className="karmic-button-outline flex items-center"
              disabled={sending}
            >
              <FileText className="mr-2 h-4 w-4" />
              Baixar Interpretação
            </Button>
            
            <Button 
              onClick={handleDownloadMatrix}
              className="karmic-button flex items-center"
              disabled={sending}
            >
              <Image className="mr-2 h-4 w-4" />
              Baixar Matriz
            </Button>
            
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="karmic-button-outline flex items-center"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 print:mb-5"
        >
          <h2 className="text-xl md:text-2xl font-serif font-medium text-karmic-800 mb-2">
            Sua Matriz Kármica
          </h2>
          <p className="text-karmic-600 mb-6 print:mb-3">
            Data de Nascimento: <span className="font-medium">{userData?.birthDate || "Não informada"}</span>
          </p>
          
          <div className="karmic-matrix-container">
            <KarmicMatrix karmicData={userData?.karmicNumbers} />
          </div>
        </motion.div>
        
        <div className="matrix-interpretations">
          <MatrixInterpretations karmicData={userData?.karmicNumbers} />
        </div>
      </div>
    </div>
  );
};

export default MatrixResult;
