import { useState, useEffect, ReactNode } from 'react';
import bridge, { UserInfo } from '@vkontakte/vk-bridge';
import { View, SplitLayout, SplitCol, ScreenSpinner } from '@vkontakte/vkui';

import { Home, Profile } from './panels';
import { OrgDetails } from './components/OrgDetails';

export const App = () => {
  const [fetchedUser, setUser] = useState<UserInfo | undefined>();
  const [popout, setPopout] = useState<ReactNode | null>(<ScreenSpinner />);
  const [activePanel, setActivePanel] = useState('home');
  const [showOrgDetails, setShowOrgDetails] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<any>(null);

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

  const handleOrgClick = (orgData: any) => {
    setSelectedOrg(orgData);
    setShowOrgDetails(true);
  };

  const handleBackToHome = () => {
    setShowOrgDetails(false);
    setSelectedOrg(null);
  };

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
            onNavigateToProfile={() => setActivePanel('profile')}
            onOrgClick={handleOrgClick}
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