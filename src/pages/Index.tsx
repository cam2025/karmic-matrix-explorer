
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/LoginForm';
import ProfileForm from '@/components/ProfileForm';
import IntroSection from '@/components/IntroSection';
import { getCurrentUser, isLoggedIn, getUserData, logout } from '@/lib/auth';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user is logged in
    try {
      const loggedIn = isLoggedIn();
      setUserLoggedIn(loggedIn);
      console.log("Index: Usuário logado?", loggedIn);
      
      if (loggedIn) {
        // Check if user has created profile
        const email = getCurrentUser();
        if (email) {
          const userData = getUserData(email);
          console.log("Index: Dados do usuário:", userData);
          if (userData && userData.name) {
            console.log("Usuário já tem perfil completo");
            setHasProfile(true);
          } else {
            console.log("Usuário logado, mas sem perfil");
            setHasProfile(false);
          }
        }
      } else {
        // Make sure hasProfile is false when not logged in
        setHasProfile(false);
      }
    } catch (error) {
      console.error("Erro ao verificar login:", error);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Watch for storage changes (logout events)
  useEffect(() => {
    const handleStorageChange = () => {
      const isUserLoggedIn = isLoggedIn();
      if (userLoggedIn && !isUserLoggedIn) {
        // User has logged out, reset state
        setUserLoggedIn(false);
        setHasProfile(false);
        // Force reload to clear any cached state
        window.location.reload();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [userLoggedIn]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Você saiu do sistema com sucesso."
    });
    setUserLoggedIn(false);
    setHasProfile(false);
    // Force reload to clear any cached state
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-karmic-100 to-white py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-karmic-700 border-r-transparent"></div>
          <p className="mt-4 text-karmic-700">Carregando...</p>
        </div>
      </div>
    );
  }

  // Função para navegar para a matriz quando o usuário tiver feito login e tiver perfil
  const handleAccessMatrix = () => {
    console.log("Acessando matriz...");
    navigate('/matrix');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-karmic-100 to-white py-12">
      <div className="container max-w-5xl mx-auto px-4">
        {userLoggedIn && (
          <div className="flex justify-end mb-4">
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="karmic-button-outline flex items-center"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        )}
        
        <IntroSection />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-md mx-auto bg-white rounded-xl p-8 shadow-sm border border-karmic-200"
        >
          <h2 className="text-2xl font-serif text-center text-karmic-800 mb-6">
            {userLoggedIn && !hasProfile 
              ? 'Complete seu Perfil'
              : userLoggedIn && hasProfile
                ? 'Acesse sua Matriz Kármica'
                : 'Faça Login para Acessar'}
          </h2>
          
          {userLoggedIn && !hasProfile ? (
            <ProfileForm />
          ) : userLoggedIn && hasProfile ? (
            <div className="text-center">
              <p className="mb-4 text-karmic-600">Você já está logado e seu perfil está completo.</p>
              <button 
                onClick={handleAccessMatrix}
                className="karmic-button w-full group"
              >
                Acessar Minha Matriz Kármica
              </button>
            </div>
          ) : (
            <LoginForm />
          )}
          
          <div className="mt-6 pt-6 border-t border-karmic-200 text-center">
            <p className="text-sm text-karmic-600">
              Adquira sua Matriz Kármica Pessoal 2025 e transforme sua jornada espiritual.
            </p>
          </div>
        </motion.div>
        
        {/* Admin Access Link */}
        <div className="mt-8 text-center">
          <Link 
            to="/admin" 
            className="text-sm text-karmic-500 hover:text-karmic-700 underline"
          >
            Acesso Administrativo
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
