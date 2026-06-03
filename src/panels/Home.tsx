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
  onOrgClick?: (orgData: any) => void;
}

export const Home: FC<HomeProps> = ({ id, fetchedUser, onNavigateToProfile, onOrgClick }) => {
  // Регионы России (код -> название)
  const regions = [
    { code: "01", name: "Республика Адыгея (Адыгея)" },
    { code: "02", name: "Республика Башкортостан" },
    { code: "03", name: "Республика Бурятия" },
    { code: "04", name: "Республика Алтай" },
    { code: "05", name: "Республика Дагестан" },
    { code: "06", name: "Республика Ингушетия" },
    { code: "07", name: "Кабардино-Балкарская Республика" },
    { code: "08", name: "Республика Калмыкия" },
    { code: "09", name: "Карачаево-Черкесская Республика" },
    { code: "10", name: "Республика Карелия" },
    { code: "11", name: "Республика Коми" },
    { code: "12", name: "Республика Марий Эл" },
    { code: "13", name: "Республика Мордовия" },
    { code: "14", name: "Республика Саха (Якутия)" },
    { code: "15", name: "Республика Северная Осетия - Алания" },
    { code: "16", name: "Республика Татарстан (Татарстан)" },
    { code: "17", name: "Республика Тыва" },
    { code: "18", name: "Удмуртская Республика" },
    { code: "19", name: "Республика Хакасия" },
    { code: "20", name: "Чеченская Республика" },
    { code: "21", name: "Чувашская Республика - Чувашия" },
    { code: "22", name: "Алтайский край" },
    { code: "23", name: "Краснодарский край" },
    { code: "24", name: "Красноярский край" },
    { code: "25", name: "Приморский край" },
    { code: "26", name: "Ставропольский край" },
    { code: "27", name: "Хабаровский край" },
    { code: "28", name: "Амурская область" },
    { code: "29", name: "Архангельская область" },
    { code: "30", name: "Астраханская область" },
    { code: "31", name: "Белгородская область" },
    { code: "32", name: "Брянская область" },
    { code: "33", name: "Владимирская область" },
    { code: "34", name: "Волгоградская область" },
    { code: "35", name: "Вологодская область" },
    { code: "36", name: "Воронежская область" },
    { code: "37", name: "Ивановская область" },
    { code: "38", name: "Иркутская область" },
    { code: "39", name: "Калининградская область" },
    { code: "40", name: "Калужская область" },
    { code: "41", name: "Камчатский край" },
    { code: "42", name: "Кемеровская область" },
    { code: "43", name: "Кировская область" },
    { code: "44", name: "Костромская область" },
    { code: "45", name: "Курганская область" },
    { code: "46", name: "Курская область" },
    { code: "47", name: "Ленинградская область" },
    { code: "48", name: "Липецкая область" },
    { code: "49", name: "Магаданская область" },
    { code: "50", name: "Московская область" },
    { code: "51", name: "Мурманская область" },
    { code: "52", name: "Нижегородская область" },
    { code: "53", name: "Новгородская область" },
    { code: "54", name: "Новосибирская область" },
    { code: "55", name: "Омская область" },
    { code: "56", name: "Оренбургская область" },
    { code: "57", name: "Орловская область" },
    { code: "58", name: "Пензенская область" },
    { code: "59", name: "Пермский край" },
    { code: "60", name: "Псковская область" },
    { code: "61", name: "Ростовская область" },
    { code: "62", name: "Рязанская область" },
    { code: "63", name: "Самарская область" },
    { code: "64", name: "Саратовская область" },
    { code: "65", name: "Сахалинская область" },
    { code: "66", name: "Свердловская область" },
    { code: "67", name: "Смоленская область" },
    { code: "68", name: "Тамбовская область" },
    { code: "69", name: "Тверская область" },
    { code: "70", name: "Томская область" },
    { code: "71", name: "Тульская область" },
    { code: "72", name: "Тюменская область" },
    { code: "73", name: "Ульяновская область" },
    { code: "74", name: "Челябинская область" },
    { code: "75", name: "Забайкальский край" },
    { code: "76", name: "Ярославская область" },
    { code: "77", name: "г. Москва" },
    { code: "78", name: "Санкт-Петербург" },
    { code: "79", name: "Еврейская автономная область" },
    { code: "83", name: "Ненецкий автономный округ" },
    { code: "86", name: "Ханты-Мансийский автономный округ - Югра" },
    { code: "87", name: "Чукотский автономный округ" },
    { code: "89", name: "Ямало-Ненецкий автономный округ" },
    { code: "99", name: "Иные территории, включая город и космодром Байконур" },
  ];

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

  // Пагинация для поставщика
  const [supplierContracts, setSupplierContracts] = useState<any[]>([]);
  const [supplierTotal, setSupplierTotal] = useState(0);
  const [supplierTotalPages, setSupplierTotalPages] = useState(0);
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

  const handleAddSubscription = async () => {
    const success = await addSubscription(subscribeInn, subscriptionType);
    if (success) {
      setSubscribeInn('');
    }
  };

  const handleOrgClick = (orgData: any) => {
    if (onOrgClick) {
      onOrgClick(orgData);
    }
  };

  // Обработчик ошибок сети
  const handleNetworkError = (error: any, setResult: (value: string) => void) => {
    if (error.message === 'Failed to fetch' || error.name === 'TypeError' || error.message?.includes('NetworkError')) {
      setResult(JSON.stringify({ error: "Нет соединения с интернетом. Проверьте подключение." }));
    } else {
      setResult(JSON.stringify({ error: error.message || 'Произошла ошибка' }));
    }
  };

  const testINN = async () => {
    if (!inn) { setResult1(JSON.stringify({ error: "Введите ИНН" })); return; }
    setLoading1(true);
    try {
      const response = await fetch(`${API_URL}/fns/inn/${inn}`);
      if (!response.ok) throw new Error(`Ошибка ${response.status}`);
      const data = await response.json();
      setResult1(JSON.stringify(data, null, 2));
    } catch (error: any) {
      handleNetworkError(error, setResult1);
    } finally {
      setLoading1(false);
    }
  };

  const searchByName = async () => {
    if (!searchQuery.trim()) { setResult2(JSON.stringify({ error: "Введите название организации" })); return; }
    if (!region) { setResult2(JSON.stringify({ error: "Выберите регион из списка" })); return; }
    setLoading2(true);
    let url = `${API_URL}/fns/search/${encodeURIComponent(searchQuery)}`;
    if (region.trim()) url += `/region/${region.trim()}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Ошибка ${response.status}`);
      const data = await response.json();
      setResult2(JSON.stringify(data, null, 2));
    } catch (error: any) {
      handleNetworkError(error, setResult2);
    } finally {
      setLoading2(false);
    }
  };

  const getExtract = async () => {
    if (!extractInn) { setResult3(JSON.stringify({ error: "Введите ИНН для выписки" })); return; }
    setLoading3(true);
    try {
      const response = await fetch(`${API_URL}/fns/extract/${extractInn}`);
      if (!response.ok) throw new Error(`Ошибка ${response.status}`);
      const data = await response.json();
      setResult3(JSON.stringify(data, null, 2));
    } catch (error: any) {
      handleNetworkError(error, setResult3);
    } finally {
      setLoading3(false);
    }
  };

  const searchByPassport = async () => {
    if (!passportSeria || !passportNumber) {
      setResult4(JSON.stringify({ error: "Введите серию и номер паспорта" }));
      return;
    }
    setLoading4(true);
    try {
      const response = await fetch(`${API_URL}/fns/passport/${passportSeria}/${passportNumber}`);
      if (!response.ok) throw new Error(`Ошибка ${response.status}`);
      const data = await response.json();

      // Если в ответе есть raw и он содержит "не найден" — показываем ошибку
      if (data.data?.raw && (data.data.raw.includes('не найден') || data.data.raw.includes('❌'))) {
        setResult4(JSON.stringify({ error: data.data.raw }));
        return;
      }

      setResult4(JSON.stringify(data, null, 2));
    } catch (error: any) {
      handleNetworkError(error, setResult4);
    } finally {
      setLoading4(false);
    }
  };

  const searchZakupki = async () => {
    if (!zakupkiInn) {
      setResult5(JSON.stringify({ error: "Введите ИНН организации" }));
      return;
    }
    setLoading5(true);
    try {
      const response = await fetch(`${API_URL}/zakupki/search/${zakupkiInn}`);
      if (!response.ok) throw new Error(`Ошибка ${response.status}`);
      const data = await response.json();
      if (data.status === 'success') {
        const contracts = data.contracts;
        const total = data.total;
        if (total === 0) {
          setResult5(JSON.stringify({ error: "📭 Контрактов не найдено" }));
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
      handleNetworkError(error, setResult5);
    } finally {
      setLoading5(false);
    }
  };

  const searchCustomerContracts = async (page: number = 1) => {
    if (!customerInn) {
      setResult6(JSON.stringify({ error: "Введите ИНН организации" }));
      return;
    }
    setLoading6(true);
    try {
      const url = `${API_URL}/zakupki/customer/contracts/${customerInn}?page=${page}&limit=${ITEMS_PER_PAGE}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Ошибка ${response.status}`);
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
      handleNetworkError(error, setResult6);
    } finally {
      setLoading6(false);
    }
  };

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
      {/* Шапка — только кнопка Профиль (без заголовка) для неавторизованных */}
      {!fetchedUser && (
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          padding: '12px 16px',
          background: 'var(--card-background)',
          borderBottom: '1px solid var(--border)'
        }}>
          <Button size="s" mode="primary" onClick={onNavigateToProfile}>
            👤 Профиль
          </Button>
        </div>
      )}

      {/* Приветствие */}
      <Group>
        <Div style={{ textAlign: 'center' }}>
          <Title level="2" style={{ color: 'var(--accent)' }}>Привет, {fetchedUser ? first_name : 'гость'}!</Title>
          <Text>🔍 Введите ИНН, название организации или паспортные данные</Text>
        </Div>
      </Group>

      {/* Если пользователь авторизован — показываем информацию и кнопку в одной строке */}
      {fetchedUser && (
        <Group header={<Header>Пользователь</Header>}>
          <Div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <span>👤 {first_name} {last_name} {city?.title && `| ${city.title}`}</span>
            <Button size="s" mode="primary" onClick={onNavigateToProfile}>
              Профиль
            </Button>
          </Div>
        </Group>
      )}

      <Group header={<Header>1. Проверка ИНН</Header>}>
        <Div>
          <Input placeholder="Введите ИНН (10 или 12 цифр)" value={inn} onChange={(e) => setInn(e.target.value)} style={{ marginBottom: 10 }} />
          <Button onClick={testINN} disabled={loading1} size="m" mode="primary">🏢 Проверить ИНН</Button>
          {loading1 && <Spinner size="m" style={{ marginTop: 10 }} />}
          <ShowResult result={result1} onOrgClick={handleOrgClick} />
        </Div>
      </Group>

      <Group header={<Header>2. Поиск по названию</Header>}>
        <Div>
          <Input placeholder="Название организации" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ marginBottom: 10 }} />
          <Text style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
          * Код региона обязателен для поиска по названию
          </Text>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              marginBottom: '10px',
              background: 'var(--card-background)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              color: 'var(--text-primary)',
              fontSize: '15px'
          }}
>
  <option value="">-- Выберите регион --</option>
  {regions.map((r) => (
    <option key={r.code} value={r.code}>
      {r.code} — {r.name}
    </option>
  ))}
</select>
          <Button onClick={searchByName} disabled={loading2} size="m" mode="primary">🔍 Найти по названию</Button>
          {loading2 && <Spinner size="m" style={{ marginTop: 10 }} />}
          <ShowResult result={result2} onOrgClick={handleOrgClick} />
        </Div>
      </Group>

      <Group header={<Header>3. Выписка из ЕГРЮЛ</Header>}>
        <Div>
          <Input placeholder="ИНН организации" value={extractInn} onChange={(e) => setExtractInn(e.target.value)} style={{ marginBottom: 10 }} />
          <Button onClick={getExtract} disabled={loading3} size="m" mode="primary">📄 Получить выписку (PDF)</Button>
          {loading3 && <Spinner size="m" style={{ marginTop: 10 }} />}
          <ShowResult result={result3} onOrgClick={handleOrgClick} />
        </Div>
      </Group>

      <Group header={<Header>4. Поиск ИНН по паспорту</Header>}>
        <Div>
          <Input placeholder="Серия паспорта" value={passportSeria} onChange={(e) => setPassportSeria(e.target.value)} style={{ marginBottom: 10 }} />
          <Input placeholder="Номер паспорта" value={passportNumber} onChange={(e) => setPassportNumber(e.target.value)} style={{ marginBottom: 10 }} />
          <Button onClick={searchByPassport} disabled={loading4} size="m" mode="primary">🆔 Найти ИНН по паспорту</Button>
          {loading4 && <Spinner size="m" style={{ marginTop: 10 }} />}
          <ShowResult result={result4} />
        </Div>
      </Group>

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

      {/* Футер со ссылками на документы */}
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
    </Panel>
  );
};