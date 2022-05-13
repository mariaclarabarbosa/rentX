import SpeedSvg from '../assets/svg/speed.svg';
import AccelerationSvg from '../assets/svg/acceleration.svg';
import ForceSvg from '../assets/svg/force.svg';
import GasolineSvg from '../assets/svg/gasoline.svg';
import EnergySvg from '../assets/svg/energy.svg';
import HybridSvg from '../assets/svg/hybrid.svg';
import ExchangeSvg from '../assets/svg/exchange.svg';
import PeopleSvg from '../assets/svg/people.svg';
import CarSvg from '../assets/svg/car.svg';

export function getAccessoryIcon(type: string) {
   switch (type) {
      case 'speed':
         return SpeedSvg;
      case 'acceleration':
         return AccelerationSvg;
      case 'turning_diameter':
         return ForceSvg;
      case 'gasoline_motor':
         return GasolineSvg;
      case 'eletric_motor':
         return EnergySvg;
      case 'hybrid_motor':
         return HybridSvg;
      case 'exchange':
         return ExchangeSvg;
      case 'seats':
         return PeopleSvg;
      default:
         return CarSvg;
   }
};