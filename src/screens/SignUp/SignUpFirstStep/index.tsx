import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
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
import { Input } from '../../../components/Input';

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

export function SignUpFirstStep(){
   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [driverLicense, setDriverLicense] = useState('');
   const navigation = useNavigation();

   async function handleGoNextStep() {
      try {
         const schema = Yup.object().shape({
            driverLicense: Yup.string()
               .required('CNH é obrigatório.'),
            email: Yup.string()
               .required('E-mail obrigatório.')
               .email('Digite um e-mail válido.'),
            name: Yup.string()
               .required('Nome é obrigatório.'),
            
         });
         const data = { name, email, driverLicense };

         await schema.validate(data);

         navigation.navigate('SignUpSecondStep', { user: data });
      } catch (error) {
         if (error instanceof Yup.ValidationError) {
            return Alert.alert('Opa!', error.message);
         }
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
                     <Bullet active />
                     <Bullet />
                  </Steps>
               </Header>


               <Title>Crie sua{'\n'}conta</Title>
               <Subtitle>
                  Faça seu cadastro de{'\n'}
                  forma rápida e fácil.
               </Subtitle>

               <Form>
                  <FormTitle>1. Dados</FormTitle>
                  <Input
                     iconName='user'
                     placeholder='Nome'
                     autoCorrect={false}
                     autoCapitalize='none'
                     onChangeText={setName}
                     value={name}
                  />
                  <Input
                     iconName='mail'
                     placeholder='E-mail'
                     keyboardType='email-address'
                     autoCorrect={false}
                     autoCapitalize='none'
                     onChangeText={setEmail}
                     value={email}
                  />
                  <Input
                     iconName='credit-card'
                     placeholder='CNH'
                     autoCorrect={false}
                     autoCapitalize='none'
                     keyboardType='numeric'
                     onChangeText={setDriverLicense}
                     value={driverLicense}
                  />
               </Form>

               <Footer>
                  <Button
                     title='Próximo'
                     onPress={handleGoNextStep}
                     disabled={
                        !name 
                        || !email
                        || !driverLicense
                     }
                  />
               </Footer>
            </Container>
         </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
   );
}