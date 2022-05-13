import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import Animated, { 
   useSharedValue, 
   useAnimatedStyle,
   withTiming,
   Easing,
   interpolate,
   Extrapolate,
   runOnJS,
} from 'react-native-reanimated';

import BrandSvg from '../../assets/svg/brand.svg';
import LogoSvg from '../../assets/svg/logo.svg';

import {
    Container,
} from './styles';

export function Splash(){
   const navigation = useNavigation();
   const splashAnimation = useSharedValue(0);

   const brandStyle = useAnimatedStyle(() => {
      return {
         opacity: interpolate(
            splashAnimation.value, 
            [0, 25, 50],
            [1, 0.3, 0],
            Extrapolate.CLAMP,
         ),
         transform: [
            {
               translateX: interpolate(
                  splashAnimation.value, 
                  [0, 25, 50],
                  [0, -25, -50],
                  Extrapolate.CLAMP,
               )
            }
         ],
      }
   });

   const logoStyle = useAnimatedStyle(() => {
      return {
         opacity: interpolate(
            splashAnimation.value, 
            [0, 25, 50],
            [0, 0.3, 1],
            Extrapolate.CLAMP,
         ),
         transform: [
            {
               translateX: interpolate(
                  splashAnimation.value, 
                  [0, 25, 50],
                  [-50, -25, 0],
                  Extrapolate.CLAMP,
               )
            }
         ],
      }
   });

   function startApp() {
      navigation.reset({ index: 0, routes: [ { name: 'SignIn' }], });
   }

   useEffect(() => {
      splashAnimation.value = withTiming(
         50,
         {
            duration: 1000,
            easing: Easing.linear
         },
         () => {
            'worklet'
            runOnJS(startApp)();
         }
      )
   }, []);

    return (
        <Container>
           <Animated.View style={[brandStyle, { position: 'absolute' }]}>
               <BrandSvg width={80} height={50} />
           </Animated.View>
           <Animated.View style={[logoStyle, { position: 'absolute' }]}>
               <LogoSvg width={180} height={20} />
           </Animated.View>
        </Container>
    );
}