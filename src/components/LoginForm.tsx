
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login, getUserData, isAuthorizedEmail, saveUserData } from '@/lib/auth';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { MoveRight } from "lucide-react";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!email.trim()) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, insira seu email para acessar o sistema.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    // Normaliza o email para minúsculas
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check if email is authorized
    if (!isAuthorizedEmail(normalizedEmail)) {
      toast({
        title: "Acesso negado",
        description: "Este email não está autorizado a acessar o sistema.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    // Login the user
    console.log("Tentativa de login para:", normalizedEmail);
    
    // Verificar se o usuário já existe, se não, criar um registro básico
    let userData = getUserData(normalizedEmail);
    
    if (!userData) {
      console.log("Usuário não encontrado, criando registro inicial");
      // Cria um registro básico para o usuário
      saveUserData({
        email: normalizedEmail,
        name: "",
        id: crypto.randomUUID()
      });
    }
    
    const success = login(normalizedEmail);
    if (success) {
      console.log("Login realizado com sucesso para:", normalizedEmail);
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao Sistema de Matriz Kármica Pessoal 2025.",
      });
      
      // Check if user has already completed profile
      userData = getUserData(normalizedEmail);
      console.log("Obtendo dados do usuário. Email:", normalizedEmail, "Dados:", userData);
      
      setTimeout(() => {
        setIsSubmitting(false);
        // Agora não redirecionamos automaticamente para a matriz
        // Em vez disso, atualizamos a página para mostrar o estado correto
        window.location.reload();
      }, 1000);
    } else {
      console.log("Falha no login para:", normalizedEmail);
      toast({
        title: "Erro no login",
        description: "Houve um problema ao processar seu login. Por favor, tente novamente.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-karmic-700">
          Seu Email de Compra
        </label>
        <Input
          id="email"
          type="email"
          placeholder="seuemail@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="transition-all duration-200 focus:ring-karmic-500"
          disabled={isSubmitting}
          required
        />
        <p className="text-xs text-karmic-500">
          Informe o mesmo email utilizado na compra do produto.
        </p>
      </div>
      
      <Button 
        type="submit" 
        className="karmic-button w-full group"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Verificando...' : 'Acessar Minha Matriz Kármica'}
        <MoveRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Button>
    </form>
  );
};

export default LoginForm;
