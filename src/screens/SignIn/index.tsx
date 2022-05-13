import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
   StatusBar,
   KeyboardAvoidingView,
   TouchableWithoutFeedback,
   Keyboard,
   Alert,
} from 'react-native';
import { useTheme } from 'styled-components';
import * as Yup from 'yup';

import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { PasswordInput } from '../../components/PasswordInput';
import { useAuth } from '../../hooks/auth';

import {
   Container,
   Header,
   Title,
   Subtitle,
   Footer,
   Form,
} from './styles';

export function SignIn() {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const theme = useTheme();
   const navigation = useNavigation();
   const { signIn } = useAuth();

   async function handleSignIn() {
      try {
         const schema = Yup.object().shape({
            email: Yup.string()
               .required('E-mail obrigatório.')
               .email('Digite um e-mail válido.'),
            password: Yup.string()
               .required('A senha é obrigatória.'),
         });
         await schema.validate({ email, password });
         await signIn({ email, password });
      } catch (error) {
         if (error instanceof Yup.ValidationError) {
            return Alert.alert('Opa!', error.message);
         }
         return Alert.alert(
            'Erro na autenticação', 
            'Ocorreu um erro ao fazer login, verifique as credenciais.'
         );
      }
   }

   function handleNewAccount() {
      navigation.navigate('SignUpFirstStep');
   }

   return (
      <KeyboardAvoidingView
         behavior='position'
         enabled
      >
         <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
         >
            <Container>
               <StatusBar
                  barStyle='dark-content'
                  backgroundColor='transparent'
                  translucent
               />
               <Header>
                  <Title>Estamos{'\n'}quase lá.</Title>
                  <Subtitle>
                     Faça seu login para começar{'\n'}
                     uma experiência incrível.
                  </Subtitle>
               </Header>

               <Form>
                  <Input
                     iconName='mail'
                     placeholder='E-mail'
                     keyboardType='email-address'
                     autoCorrect={false}
                     autoCapitalize='none'
                     onChangeText={setEmail}
                     value={email}
                  />
                  <PasswordInput
                     iconName='lock'
                     placeholder='Senha'
                     onChangeText={setPassword}
                     value={password}
                  />
               </Form>

               <Footer>
                  <Button
                     title='Login'
                     onPress={handleSignIn}
                     disabled={false}
                     loading={false}
                  />
                  <Button
                     title='Criar Conta Gratuita'
                     color={theme.colors.background_secondary}
                     onPress={handleNewAccount}
                     light
                  />
               </Footer>
            </Container>
         </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
   );
}