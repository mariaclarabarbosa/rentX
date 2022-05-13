import React, { 
   createContext, 
   useState, 
   useContext, 
   ReactNode,
   useEffect,
} from 'react';
import { Alert } from 'react-native';
import { api } from '../services/api';
import { database } from '../database';
import { User as ModelUser } from '../database/model/User';

interface User {
   id: string;
   user_id: string;
   email: string;
   name: string;
   driver_license: string;
   avatar: string;
   token: string;
};

interface SignInCredentials {
   email: string;
   password: string;
}

interface AuthProviderProps {
   children: ReactNode;
}

interface AuthContextData {
   user: User;
   signIn: (credential: SignInCredentials) => Promise<void>;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
   const [data, setData] = useState<User>({} as User);

   async function signIn({ email, password }: SignInCredentials) {
      try {
         const response = await api.post('/sessions', {
            email,
            password,
         });
         const { token, user } = response.data;
         api.defaults.headers.Authorization = `Bearer ${token}`;

         const usersCollection = database.get<ModelUser>('users');
         const newUser = usersCollection.create(newUser => {
            newUser.user_id = user.user_id;
            newUser.name = user.name;
            newUser.email = user.email;
            newUser.avatar = user.avatar;
            newUser.driver_license = user.driver_license;
            newUser.token = token;
          })
   
         setData({ ...user, token});
      } catch (error) {
         throw new Error(error);
      }
   }

   useEffect(() => {
      async function loadUserData() {
         const usersCollection = database.get<ModelUser>('users');
         const response = await usersCollection.query().fetch();

         if (response.length > 0) {
            const userData = response[0]._raw as unknown as User;
            api.defaults.headers.Authorization = `Bearer ${userData.token}`;
            setData(userData);
         }

      };
      loadUserData();
   }, [])

   return (
      <AuthContext.Provider value={{
         user: data,
         signIn,
      }}>
         {children}
      </AuthContext.Provider>
   )
};

function useAuth(): AuthContextData {
   return useContext(AuthContext);
};

export {
   AuthProvider,
   useAuth,
}
