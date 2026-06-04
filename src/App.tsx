import { useState, useEffect, ReactNode } from 'react';
import bridge, { UserInfo } from '@vkontakte/vk-bridge';
import { View, SplitLayout, SplitCol, ScreenSpinner, Div } from '@vkontakte/vkui';

import { Home, Profile } from './panels';
import { OrgDetails } from './components/OrgDetails';
import { useSubscriptions } from './hooks/useSubscriptions';

export const App = () => {
  const [fetchedUser, setUser] = useState<UserInfo | undefined>();
  const [userId, setUserId] = useState<number | undefined>();
  const [popout, setPopout] = useState<ReactNode | null>(<ScreenSpinner />);
  const [activePanel, setActivePanel] = useState('home');
  const [showOrgDetails, setShowOrgDetails] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<any>(null);

  // Подключаем хук подписок
  const {
    subscriptions,
    removeSubscription,
  } = useSubscriptions();

  useEffect(() => {
    async function fetchData() {
      try {
        const user = await bridge.send('VKWebAppGetUserInfo');
        setUser(user);
        setUserId(user.id);

        // ЗАПРОС РАЗРЕШЕНИЯ НА УВЕДОМЛЕНИЯ
        try {
          await bridge.send('VKWebAppAllowNotifications');
          console.log('Разрешение на уведомления получено');
        } catch (notifError) {
          console.log('Пользователь запретил уведомления');
        }

      } catch (e) {
        console.error('Ошибка получения данных:', e);
      } finally {
        setPopout(null);
      }
    }
    fetchData();
  }, []);

  const handleOrgClick = (orgData: any) => {
    setSelectedOrg(orgData);
    setShowOrgDetails(true);
  };

  const handleBackToHome = () => {
    setShowOrgDetails(false);
    setSelectedOrg(null);
  };

  const handleRemoveSubscription = (inn: string) => {
    removeSubscription(inn);
  };

  // Футер со ссылками на документы
  const footer = (
    <Div style={{
      textAlign: 'center',
      padding: '16px',
      fontSize: '12px',
      color: 'var(--text-secondary)',
      borderTop: '1px solid var(--border)',
      marginTop: '20px'
    }}>
      <span
        onClick={() => window.open('https://burodev.ru/privacy.html', '_blank')}
        style={{ cursor: 'pointer', marginRight: '16px' }}
      >
        Политика конфиденциальности
      </span>
      <span
        onClick={() => window.open('https://burodev.ru/terms.html', '_blank')}
        style={{ cursor: 'pointer' }}
      >
        Пользовательское соглашение
      </span>
    </Div>
  );

  if (showOrgDetails && selectedOrg) {
    return (
      <SplitLayout>
        <SplitCol>
          <OrgDetails
            id="org-details"
            data={selectedOrg}
            onBack={handleBackToHome}
          />
        </SplitCol>
        {popout}
      </SplitLayout>
    );
  }

  return (
    <SplitLayout>
      <SplitCol>
        <View activePanel={activePanel}>
          <Home
            id="home"
            fetchedUser={fetchedUser}
            userId={userId}
            onNavigateToProfile={() => setActivePanel('profile')}
            onOrgClick={handleOrgClick}
          />
          <Profile
            id="profile"
            fetchedUser={fetchedUser}
            subscriptions={subscriptions}
            onRemoveSubscription={handleRemoveSubscription}
            onNavigateToHome={() => setActivePanel('home')}
          />
        </View>
        {footer}
      </SplitCol>
      {popout}
    </SplitLayout>
  );
};