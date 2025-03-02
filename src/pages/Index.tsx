
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '@/components/LoginForm';
import ProfileForm from '@/components/ProfileForm';
import IntroSection from '@/components/IntroSection';
import { getCurrentUser, isLoggedIn, getUserData, getAllUserDataByEmail } from '@/lib/auth';

const Index = () => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [forceCreateNew, setForceCreateNew] = useState(false);
  const [showProfileSection, setShowProfileSection] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Check for URL parameters
    const queryParams = new URLSearchParams(location.search);
    const createMode = queryParams.get('create');
    const viewMode = queryParams.get('view');
    
    const shouldCreateNew = createMode === 'new';
    const shouldShowMaps = viewMode === 'maps';
    
    setForceCreateNew(shouldCreateNew);
    setShowProfileSection(shouldShowMaps);
    
    console.log("Index: create=new parameter:", shouldCreateNew, "view=maps parameter:", shouldShowMaps);
    
    // Check if user is logged in
    try {
      const loggedIn = isLoggedIn();
      setUserLoggedIn(loggedIn);
      console.log("Index: Usuário logado?", loggedIn);
      
      if (loggedIn) {
        // Check if user has created profile
        const email = getCurrentUser();
        if (email) {
          // Obter todos os mapas válidos do usuário
          const userMaps = getAllUserDataByEmail();
          console.log("Index: Mapas do usuário:", userMaps);
          
          // Verificar se existem mapas válidos
          const hasValidMaps = userMaps && userMaps.length > 0 && 
                              userMaps.some(map => map && map.id && map.birthDate);
          
          if (hasValidMaps && !shouldCreateNew && !shouldShowMaps) {
            console.log("Usuário já tem mapas válidos, redirecionando para matriz");
            setHasProfile(true);
            // Redirect to matrix page with a small delay to ensure state is updated
            setTimeout(() => {
              navigate('/matrix');
            }, 100);
          } else {
            console.log("Usuário logado, mostrar formulário para criar novo perfil ou ver mapas existentes");
            setHasProfile(false);
          }
        }
      }
    } catch (error) {
      console.error("Erro ao verificar login:", error);
    } finally {
      setIsLoading(false);
    }
  }, [navigate, location.search]);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-karmic-100 to-white py-12">
      <div className="container max-w-5xl mx-auto px-4">
        <IntroSection />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-md mx-auto bg-white rounded-xl p-8 shadow-sm border border-karmic-200"
        >
          <h2 className="text-2xl font-serif text-center text-karmic-800 mb-6">
            {userLoggedIn && (forceCreateNew || showProfileSection || !hasProfile) 
              ? (showProfileSection ? 'Meus Mapas Kármicos' : 'Complete seu Perfil')
              : 'Acesse sua Matriz Kármica'}
          </h2>
          
          {userLoggedIn && (forceCreateNew || showProfileSection || !hasProfile) ? (
            <ProfileForm viewMode={showProfileSection ? 'maps' : 'create'} />
          ) : (
            <LoginForm />
          )}
          
          <div className="mt-6 pt-6 border-t border-karmic-200 text-center">
            <p className="text-sm text-karmic-600">
              Adquira sua Matriz Kármica Pessoal 2025 e transforme sua jornada espiritual.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
