import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ExploreScreen } from '@/explore/ExploreScreen';
import { type Tab, TabBar } from '@/explore/TabBar';
import { AlertsScreen } from '@/screens/AlertsScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { SavedScreen } from '@/screens/SavedScreen';
import { tap } from '@/ui/haptics';

/**
 * The home of the app: four tabs and the amber "add a spot" button.
 * Explore stays mounted so the map keeps its filter and scroll position.
 */
export default function Home() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>('explore');

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, display: tab === 'explore' ? 'flex' : 'none' }}>
          <ExploreScreen onOpenAlerts={() => setTab('alerts')} />
        </View>
        {tab === 'saved' && <SavedScreen onExplore={() => setTab('explore')} />}
        {tab === 'alerts' && <AlertsScreen />}
        {tab === 'profile' && <ProfileScreen />}
      </View>
      <TabBar
        bottomInset={insets.bottom}
        active={tab}
        onPress={(next) => {
          tap();
          // Adding a spot needs an account; it arrives with sign-in (Day 9).
          if (next !== 'add') setTab(next);
        }}
      />
    </View>
  );
}
