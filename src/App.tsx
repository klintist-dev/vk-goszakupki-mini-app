import { useState, useEffect, ReactNode } from 'react';
import bridge, { UserInfo } from '@vkontakte/vk-bridge';
import { View, SplitLayout, SplitCol, ScreenSpinner } from '@vkontakte/vkui';

import { Home, Profile } from './panels';

export const App = () => {
  const [fetchedUser, setUser] = useState<UserInfo | undefined>();
  const [popout, setPopout] = useState<ReactNode | null>(<ScreenSpinner />);
  const [activePanel, setActivePanel] = useState('home');

  useEffect(() => {
    async function fetchData() {
      try {
        const user = await bridge.send('VKWebAppGetUserInfo');
        setUser(user);
      } catch (e) {
        console.error('Ошибка получения данных:', e);
      } finally {
        setPopout(null);
      }
    }
    fetchData();
  }, []);

  console.log('🟢 App рендерится, activePanel =', activePanel);

  return (
    <SplitLayout>
      <SplitCol>
        <View activePanel={activePanel}>
          <Home
            id="home"
            fetchedUser={fetchedUser}
            onNavigateToProfile={() => {
              console.log('🔵 Нажата кнопка Профиль!');
              setActivePanel('profile');
            }}
          />
          <Profile
            id="profile"
            fetchedUser={fetchedUser}
            subscriptions={[]}
            onRemoveSubscription={(inn) => console.log('Удалить', inn)}
            onNavigateToHome={() => setActivePanel('home')}
          />
        </View>
      </SplitCol>
      {popout}
    </SplitLayout>
  );
};