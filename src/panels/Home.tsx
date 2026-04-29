import { FC, useState } from 'react';
import {
  Panel,
  Header,
  Group,
  Div,
  Spinner,
  Input,
  Button,
  Title,
  Text,
} from '@vkontakte/vkui';
import { UserInfo } from '@vkontakte/vk-bridge';
import { ShowResult } from '../components/ShowResult';
import { useSubscriptions } from '../hooks/useSubscriptions';

export interface HomeProps {
  id: string;
  fetchedUser?: UserInfo;
  onNavigateToProfile?: () => void;
}

export const Home: FC<HomeProps> = ({ id, fetchedUser, onNavigateToProfile }) => {
  // Состояния для API запросов
  const [loading1, setLoading1] = useState(false);
  const [result1, setResult1] = useState('');
  const [loading2, setLoading2] = useState(false);
  const [result2, setResult2] = useState('');
  const [loading3, setLoading3] = useState(false);
  const [result3, setResult3] = useState('');
  const [loading4, setLoading4] = useState(false);
  const [result4, setResult4] = useState('');
  const [inn, setInn] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [region, setRegion] = useState('');
  const [extractInn, setExtractInn] = useState('');
  const [passportSeria, setPassportSeria] = useState('');
  const [passportNumber, setPassportNumber] = useState('');

  // Состояния для госзакупок
  const [searchType, setSearchType] = useState<'supplier' | 'customer'>('supplier');
  const [zakupkiInn, setZakupkiInn] = useState('');
  const [loading5, setLoading5] = useState(false);
  const [result5, setResult5] = useState('');
  const [customerInn, setCustomerInn] = useState('');
  const [loading6, setLoading6] = useState(false);
  const [result6, setResult6] = useState('');

  // Пагинация для поставщика (контракты хранятся локально)
  const [supplierContracts, setSupplierContracts] = useState<any[]>([]);
  const [supplierTotal, setSupplierTotal] = useState(0);
  const [supplierTotalPages, setSupplierTotalPages] = useState(0);

  // Для заказчика храним только номер текущей страницы
  const [customerTotalPages, setCustomerTotalPages] = useState(0);

  const [subscribeInn, setSubscribeInn] = useState('');
  const [subscriptionType, setSubscriptionType] = useState<'supplier' | 'customer'>('supplier');

  const {
    subscriptions,
    loading: subscriptionsLoading,
    checking,
    toastMessage,
    addSubscription,
    removeSubscription,
    manualCheck,
  } = useSubscriptions();

  const API_URL = 'https://burodev.ru';
  const ITEMS_PER_PAGE = 20;

  // Обработчик добавления подписки
  const handleAddSubscription = async () => {
    const success = await addSubscription(subscribeInn, subscriptionType);
    if (success) {
      setSubscribeInn('');
    }
  };

  // ========== Функции API ==========
  const testINN = async () => {
    if (!inn) { setResult1(JSON.stringify({ error: "Введите ИНН" })); return; }
    setLoading1(true);
    try {
      const response = await fetch(`${API_URL}/fns/inn/${inn}`);
      const data = await response.json();
      setResult1(JSON.stringify(data, null, 2));
    } catch (error: any) {
      setResult1(JSON.stringify({ error: error.message }));
    } finally {
      setLoading1(false);
    }
  };

  const searchByName = async () => {
    if (!searchQuery.trim()) { setResult2(JSON.stringify({ error: "Введите название организации" })); return; }
    setLoading2(true);
    let url = `${API_URL}/fns/search/${encodeURIComponent(searchQuery)}`;
    if (region.trim()) url += `/region/${region.trim()}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setResult2(JSON.stringify(data, null, 2));
    } catch (error: any) {
      setResult2(JSON.stringify({ error: error.message }));
    } finally {
      setLoading2(false);
    }
  };

  const getExtract = async () => {
    if (!extractInn) { setResult3(JSON.stringify({ error: "Введите ИНН для выписки" })); return; }
    setLoading3(true);
    try {
      const response = await fetch(`${API_URL}/fns/extract/${extractInn}`);
      const data = await response.json();
      setResult3(JSON.stringify(data, null, 2));
    } catch (error: any) {
      setResult3(JSON.stringify({ error: error.message }));
    } finally {
      setLoading3(false);
    }
  };

  const searchByPassport = async () => {
    if (!passportSeria || !passportNumber) { setResult4(JSON.stringify({ error: "Введите серию и номер паспорта" })); return; }
    setLoading4(true);
    try {
      const response = await fetch(`${API_URL}/fns/passport/${passportSeria}/${passportNumber}`);
      const data = await response.json();
      setResult4(JSON.stringify(data, null, 2));
    } catch (error: any) {
      setResult4(JSON.stringify({ error: error.message }));
    } finally {
      setLoading4(false);
    }
  };

  // ========== Госзакупки: поставщик ==========
  const searchZakupki = async () => {
    if (!zakupkiInn) {
      setResult5(JSON.stringify({ error: "Введите ИНН организации" }));
      return;
    }
    setLoading5(true);
    try {
      const response = await fetch(`${API_URL}/zakupki/search/${zakupkiInn}`);
      const data = await response.json();
      if (data.status === 'success') {
        const contracts = data.contracts;
        const total = data.total;
        if (total === 0) {
          setResult5(JSON.stringify({ status: 'success', customContent: '📭 Контрактов не найдено' }));
          setSupplierContracts([]);
          setSupplierTotal(0);
          setSupplierTotalPages(0);
        } else {
          setSupplierContracts(contracts);
          setSupplierTotal(total);
          const pages = Math.ceil(contracts.length / ITEMS_PER_PAGE);
          setSupplierTotalPages(pages);
          const contractsForPage = contracts.slice(0, ITEMS_PER_PAGE);
          setResult5(JSON.stringify({
            status: 'success',
            contracts: contractsForPage,
            total: total,
            shown: contractsForPage.length,
            currentPage: 1,
            totalPages: pages
          }));
        }
      } else {
        setResult5(JSON.stringify({ error: data.message || 'Ошибка поиска' }));
      }
    } catch (error: any) {
      setResult5(JSON.stringify({ error: error.message }));
    } finally {
      setLoading5(false);
    }
  };

  // ========== Госзакупки: заказчик (с пагинацией на бэкенде) ==========
  const searchCustomerContracts = async (page: number = 1) => {
    if (!customerInn) {
      setResult6(JSON.stringify({ error: "Введите ИНН организации" }));
      return;
    }
    setLoading6(true);
    try {
      const url = `${API_URL}/zakupki/customer/contracts/${customerInn}?page=${page}&limit=${ITEMS_PER_PAGE}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        const contracts = data.contracts;
        const total = data.total;

        if (total === 0) {
          setResult6(JSON.stringify({ status: 'success', customContent: '📭 Контрактов не найдено' }));
        } else {
          const pages = Math.ceil(total / ITEMS_PER_PAGE);
          setCustomerTotalPages(pages);

          setResult6(JSON.stringify({
            status: 'success',
            contracts: contracts,
            total: total,
            shown: contracts.length,
            currentPage: page,
            totalPages: pages
          }));
        }
      } else {
        setResult6(JSON.stringify({ error: data.error || 'Ошибка поиска' }));
      }
    } catch (error: any) {
      setResult6(JSON.stringify({ error: error.message }));
    } finally {
      setLoading6(false);
    }
  };

  // ========== Пагинация ==========
  const goToPage = (page: number) => {
    if (searchType === 'supplier') {
      if (page < 1 || page > supplierTotalPages) return;
      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const contractsForPage = supplierContracts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
      setResult5(JSON.stringify({
        status: 'success',
        contracts: contractsForPage,
        total: supplierTotal,
        shown: contractsForPage.length,
        currentPage: page,
        totalPages: supplierTotalPages
      }));
    } else {
      if (page < 1 || page > customerTotalPages) return;
      searchCustomerContracts(page);
    }
  };

  const { first_name, last_name, city } = { ...fetchedUser };

  return (
    <Panel id={id}>
      {/* Шапка */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        background: 'var(--card-background)',
        borderBottom: '1px solid var(--border)'
      }}>
        <Title level="2" style={{ color: 'var(--accent)', margin: 0 }}>БюрократЪ</Title>
        <Button size="s" mode="primary" onClick={onNavigateToProfile}>
          👤 Профиль
        </Button>
      </div>

      {/* Приветствие */}
      <Group>
        <Div style={{ textAlign: 'center' }}>
          <Title level="2" style={{ color: 'var(--accent)' }}>Привет, {fetchedUser ? first_name : 'гость'}!</Title>
          <Text>🔍 Введите ИНН, название организации или паспортные данные</Text>
        </Div>
      </Group>

      {fetchedUser && (
        <Group header={<Header>Пользователь</Header>}>
          <Div>👤 {first_name} {last_name} {city?.title && `| ${city.title}`}</Div>
        </Group>
      )}

      {/* 1. Проверка ИНН */}
      <Group header={<Header>1. Проверка ИНН</Header>}>
        <Div>
          <Input placeholder="Введите ИНН (10 или 12 цифр)" value={inn} onChange={(e) => setInn(e.target.value)} style={{ marginBottom: 10 }} />
          <Button onClick={testINN} disabled={loading1} size="m" mode="primary">🏢 Проверить ИНН</Button>
          {loading1 && <Spinner size="m" style={{ marginTop: 10 }} />}
          <ShowResult result={result1} />
        </Div>
      </Group>

      {/* 2. Поиск по названию */}
      <Group header={<Header>2. Поиск по названию</Header>}>
        <Div>
          <Input placeholder="Название организации" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ marginBottom: 10 }} />
          <Input placeholder="Код региона (например: 77)" value={region} onChange={(e) => setRegion(e.target.value)} style={{ marginBottom: 10 }} />
          <Button onClick={searchByName} disabled={loading2} size="m" mode="primary">🔍 Найти по названию</Button>
          {loading2 && <Spinner size="m" style={{ marginTop: 10 }} />}
          <ShowResult result={result2} />
        </Div>
      </Group>

      {/* 3. Выписка из ЕГРЮЛ */}
      <Group header={<Header>3. Выписка из ЕГРЮЛ</Header>}>
        <Div>
          <Input placeholder="ИНН организации" value={extractInn} onChange={(e) => setExtractInn(e.target.value)} style={{ marginBottom: 10 }} />
          <Button onClick={getExtract} disabled={loading3} size="m" mode="primary">📄 Получить выписку (PDF)</Button>
          {loading3 && <Spinner size="m" style={{ marginTop: 10 }} />}
          <ShowResult result={result3} />
        </Div>
      </Group>

      {/* 4. Поиск ИНН по паспорту */}
      <Group header={<Header>4. Поиск ИНН по паспорту</Header>}>
        <Div>
          <Input placeholder="Серия паспорта" value={passportSeria} onChange={(e) => setPassportSeria(e.target.value)} style={{ marginBottom: 10 }} />
          <Input placeholder="Номер паспорта" value={passportNumber} onChange={(e) => setPassportNumber(e.target.value)} style={{ marginBottom: 10 }} />
          <Button onClick={searchByPassport} disabled={loading4} size="m" mode="primary">🆔 Найти ИНН по паспорту</Button>
          {loading4 && <Spinner size="m" style={{ marginTop: 10 }} />}
          <ShowResult result={result4} />
        </Div>
      </Group>

      {/* 5. Госзакупки */}
      <Group header={<Header>5. Госзакупки (контракты по ИНН)</Header>}>
        <Div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <Button size="s" mode={searchType === 'supplier' ? 'primary' : 'secondary'} onClick={() => setSearchType('supplier')}>📦 Поставщик</Button>
            <Button size="s" mode={searchType === 'customer' ? 'primary' : 'secondary'} onClick={() => setSearchType('customer')}>🏛 Заказчик</Button>
          </div>

          <Input
            placeholder={searchType === 'supplier' ? "ИНН поставщика" : "ИНН заказчика"}
            value={searchType === 'supplier' ? zakupkiInn : customerInn}
            onChange={(e) => {
              if (searchType === 'supplier') setZakupkiInn(e.target.value);
              else setCustomerInn(e.target.value);
            }}
            style={{ marginBottom: 10 }}
          />

          <Button
            onClick={searchType === 'supplier' ? searchZakupki : () => searchCustomerContracts(1)}
            disabled={loading5 || loading6}
            size="m"
            mode="primary"
          >
            {searchType === 'supplier' ? '📋 Найти контракты (поставщик)' : '🏛 Найти контракты (заказчик)'}
          </Button>

          {(loading5 || loading6) && <Spinner size="m" style={{ marginTop: 10 }} />}

          {searchType === 'supplier' && result5 && <ShowResult result={result5} onPageChange={goToPage} />}
          {searchType === 'customer' && result6 && <ShowResult result={result6} onPageChange={goToPage} />}
        </Div>
      </Group>

      {/* 6. Уведомления */}
      <Group header={<Header>6. 🔔 Уведомления о новых контрактах</Header>}>
        <Div>
          <Text style={{ marginBottom: 12 }}>Подпишитесь на ИНН, чтобы получать уведомления о новых контрактах. Проверка каждые 5 минут.</Text>

          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <Button size="s" mode={subscriptionType === 'supplier' ? 'primary' : 'secondary'} onClick={() => setSubscriptionType('supplier')}>📦 Поставщик</Button>
            <Button size="s" mode={subscriptionType === 'customer' ? 'primary' : 'secondary'} onClick={() => setSubscriptionType('customer')}>🏛 Заказчик</Button>
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <Input
              placeholder={subscriptionType === 'supplier' ? "ИНН поставщика" : "ИНН заказчика"}
              value={subscribeInn}
              onChange={(e) => setSubscribeInn(e.target.value)}
              style={{ flex: 1 }}
            />
            <Button onClick={handleAddSubscription} disabled={subscriptionsLoading} mode="primary">🔔 Подписаться</Button>
            {subscriptions.length > 0 && <Button onClick={manualCheck} disabled={checking} mode="secondary">🔄 Проверить</Button>}
          </div>

          {subscriptions.length > 0 && (
            <>
              <Text>Ваши подписки ({subscriptions.length}):</Text>
              <div style={{ maxHeight: '200px', overflowY: 'auto', marginTop: 8 }}>
                {subscriptions.map((sub, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <Text>{sub.name}</Text>
                      <Text style={{ fontSize: 12 }}>ИНН: {sub.inn} | Тип: {sub.type === 'supplier' ? 'Поставщик' : 'Заказчик'}</Text>
                    </div>
                    <Button onClick={() => removeSubscription(sub.inn)} size="s" mode="secondary">Отписаться</Button>
                  </div>
                ))}
              </div>
            </>
          )}
        </Div>
      </Group>

      {/* Toast */}
      {toastMessage.visible && (
        <div style={{
          position: 'fixed',
          bottom: 30,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--accent)',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: 12,
          zIndex: 1000,
          textAlign: 'center'
        }}>
          {toastMessage.message}
        </div>
      )}
    </Panel>
  );
};