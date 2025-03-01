
import { 
  getDb, 
  saveUserData as saveData, 
  getAllUserDataByEmail as getAllUsers,
  setCurrentMatrixId as setMatrixId,
  getCurrentMatrixId as getMatrixId,
  getAllAuthorizedEmails,
  addAuthorizedEmail,
  removeAuthorizedEmail
} from './db';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  birthDate?: string;
  currentMatrixId?: string;
  // Add other user profile fields as necessary
}

// Function to check if the user is logged in
export const isLoggedIn = (): boolean => {
  const user = getCurrentUser();
  return !!user;
};

// Function to get the current user
export const getCurrentUser = (): string | null => {
  return localStorage.getItem('currentUser');
};

// Function to get user data
export const getUserData = (email: string): UserProfile | null => {
  const db = getDb();
  
  // Verifica se o email existe no banco de dados
  if (db && db[email]) {
    console.log("Obtendo dados do usuário. Email:", email, "Dados:", db[email]);
    return db[email];
  }
  
  console.log("Obtendo dados do usuário. Email:", email, "ID:", { undefined });
  return null;
};

// Function to login the user
export const login = (email: string): boolean => {
  const db = getDb();
  if (db && db[email]) {
    localStorage.setItem('currentUser', email);
    return true;
  }
  return false;
};

// Function to check if the email is authorized
export const isAuthorizedEmail = (email: string): boolean => {
  const authorizedEmails = getAllAuthorizedEmails();
  return authorizedEmails.includes(email);
};

// Function to logout the user
export const logout = (): void => {
  localStorage.removeItem('currentUser');
};

// Re-export needed functions from db.ts
export const saveUserData = saveData;
export const getAllUserDataByEmail = getAllUsers;
export const setCurrentMatrixId = setMatrixId;
export const getCurrentMatrixId = getMatrixId;
export { 
  getAllAuthorizedEmails, 
  addAuthorizedEmail, 
  removeAuthorizedEmail 
};
