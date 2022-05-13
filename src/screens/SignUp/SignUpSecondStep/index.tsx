import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
   Alert, 
   KeyboardAvoidingView,
   StatusBar,
   TouchableWithoutFeedback,
   Keyboard,
} from 'react-native';
import * as Yup from 'yup';

import { BackButton } from '../../../components/BackButton';
import { Bullet } from '../../../components/Bullet';
import { Button } from '../../../components/Button';

import {
   Container,
   Header,
   Steps,
   Title,
   Subtitle,
   Form,
   FormTitle,
   Footer,
} from './styles';
import { PasswordInput } from '../../../components/PasswordInput';
import { useTheme } from 'styled-components';
import { api } from '../../../services/api';

interface Params {
   user: {
      name: string;
      email: string;
      driverLicense: string;
   }
}

export function SignUpSecondStep(){
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const navigation = useNavigation();
   const route = useRoute();
   const { user } = route.params as Params;
   const theme = useTheme();

   async function handleRegister() {
      try {
         const schema = Yup.object().shape({
            confirmPassword: Yup.string()
               .required('Confirmar senha é obrigatório.')
               .equals([password], 'Senhas não conferem.'),
            password: Yup.string()
               .required('A senha é obrigatória.'),
         });
         await schema.validate({ password, confirmPassword });
         await api.post('/users', {
            name: user.name,
            email: user.email,
            password,
            driver_license: user.driverLicense,
         });
         navigation.navigate('Confirmation', {
            title: 'Conta criada!',
            nextScreenRoute: 'SignIn'
         });
      } catch (error) {
         if (error instanceof Yup.ValidationError) {
            return Alert.alert('Opa!', error.message);
         }
         return Alert.alert('Opa!', 'Não foi possível cadastrar.');
      }
   }

   return (
      <KeyboardAvoidingView
         behavior='position'
         enabled
      >
         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Container>
               <StatusBar
                  barStyle='dark-content'
                  backgroundColor='transparent'
                  translucent
               />
               <Header>
                  <BackButton />
                  <Steps>
                     <Bullet />
                     <Bullet active />
                  </Steps>
               </Header>

               <Title>Crie sua{'\n'}conta</Title>
               <Subtitle>
                  Faça seu cadastro de{'\n'}
                  forma rápida e fácil.
               </Subtitle>

               <Form>
                  <FormTitle>2. Senha</FormTitle>
                  <PasswordInput
                     iconName='lock'
                     placeholder='Senha'
                     onChangeText={setPassword}
                     value={password}
                  />
                  <PasswordInput
                     iconName='lock'
                     placeholder='Repetir Senha'
                     onChangeText={setConfirmPassword}
                     value={confirmPassword}
                  />
               </Form>

               <Footer>
                  <Button
                     title='Cadastrar'
                     onPress={handleRegister}
                     color={theme.colors.success}
                     disabled={!password || !confirmPassword}
                  />
               </Footer>
            </Container>
         </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
   );
}