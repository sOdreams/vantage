import { Alert } from 'react-native';
import { tap } from './haptics';

/** Explains features that arrive later in the plan, instead of a button that does nothing. */
export function comingSoon(what: string, day: number) {
  tap();
  Alert.alert(`${what} is coming`, `This arrives on Day ${day} of the build plan.`);
}
