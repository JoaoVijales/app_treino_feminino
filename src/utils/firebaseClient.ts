import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Adicionar as credenciais do Firebase no arquivo .env
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Firebase Authentication e obtém uma referência ao serviço
export const auth = getAuth(app);

/*
Para completar a configuração:
1. Crie um projeto no Firebase (https://console.firebase.google.com/).
2. Adicione um aplicativo da Web ao seu projeto.
3. Copie as credenciais de configuração do Firebase.
4. Crie um arquivo `.env` na raiz do projeto.
5. Adicione as seguintes variáveis de ambiente ao arquivo `.env` com suas credenciais:
   REACT_APP_FIREBASE_API_KEY=...
   REACT_APP_FIREBASE_AUTH_DOMAIN=...
   REACT_APP_FIREBASE_PROJECT_ID=...
   REACT_APP_FIREBASE_STORAGE_BUCKET=...
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
   REACT_APP_FIREBASE_APP_ID=...
*/
