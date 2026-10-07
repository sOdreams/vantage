import { useLocalSearchParams } from 'expo-router';
import { SpotScreen } from '@/spot/SpotScreen';

export default function SpotRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <SpotScreen id={String(id)} />;
}
