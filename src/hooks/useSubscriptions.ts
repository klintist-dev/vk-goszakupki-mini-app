import { useState, useEffect, useCallback } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { Subscription } from '../types';

const API_URL = 'https://burodev.ru/api';

export const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  const showToast = (message: string) => {
    setToastMessage({ message, visible: true });
    setTimeout(() => setToastMessage({ message: '', visible: false }), 3000);
  };

  const loadSubscriptions = useCallback(async () => {
    try {
      const result = await bridge.send('VKWebAppStorageGet', { keys: ['subscriptions'] });
      if (result.keys && result.keys[0] && result.keys[0].value) {
        const loaded = JSON.parse(result.keys[0].value);
        if (loaded.length > 0 && typeof loaded[0] === 'string') {
          const converted = loaded.map((inn: string) => ({ inn, name: inn, type: 'supplier' as const }));
          setSubscriptions(converted);
          saveSubscriptions(converted);
        } else if (loaded.length > 0 && !loaded[0].type) {
          const converted = loaded.map((s: any) => ({ ...s, type: 'supplier' as const }));
          setSubscriptions(converted);
          saveSubscriptions(converted);
        } else {
          setSubscriptions(loaded);
        }
      }
    } catch (e) {
      console.error('Ошибка загрузки подписок:', e);
    }
  }, []);

  const saveSubscriptions = async (newSubscriptions: Subscription[]) => {
    try {
      await bridge.send('VKWebAppStorageSet', {
        key: 'subscriptions',
        value: JSON.stringify(newSubscriptions)
      });
      setSubscriptions(newSubscriptions);
    } catch (e) {
      console.error('Ошибка сохранения подписок:', e);
    }
  };

  const getOrgName = async (inn: string): Promise<string> => {
    try {
      const response = await fetch(`${API_URL}/fns/inn/${inn}`);
      const data = await response.json();
      if (data.status === 'success' && data.data?.raw) {
        const lines = data.data.raw.split('\n');
        for (const line of lines) {
          if (line.startsWith('**') && line.endsWith('**')) {
            return line.replace(/\*\*/g, '').trim();
          }
        }
      }
      return inn;
    } catch (e) {
      return inn;
    }
  };

  const addSubscription = async (inn: string, type: 'supplier' | 'customer') => {
    if (!inn) {
      showToast('❌ Введите ИНН');
      return false;
    }
    if (!inn.match(/^\d{10}$|^\d{12}$/)) {
      showToast('❌ ИНН должен содержать 10 или 12 цифр');
      return false;
    }
    if (subscriptions.some(s => s.inn === inn)) {
      showToast('⚠️ Вы уже подписаны на этот ИНН');
      return false;
    }

    setLoading(true);
    try {
      const orgName = await getOrgName(inn);
      const newSubscriptions = [...subscriptions, { inn, name: orgName, type }];
      await saveSubscriptions(newSubscriptions);

      const url = type === 'supplier' ? `${API_URL}/zakupki/search/${inn}` : `${API_URL}/zakupki/customer/contracts/${inn}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === 'success' || data.success) {
        const total = data.total || data.contracts?.length || 0;
        await bridge.send('VKWebAppStorageSet', {
          key: `last_count_${type}_${inn}`,
          value: total.toString()
        });
      }

      showToast(`✅ Подписка на ${orgName} добавлена`);
      return true;
    } catch (e) {
      showToast('❌ Ошибка при добавлении подписки');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeSubscription = async (inn: string) => {
    const newSubscriptions = subscriptions.filter(s => s.inn !== inn);
    await saveSubscriptions(newSubscriptions);
    const sub = subscriptions.find(s => s.inn === inn);
    showToast(`❌ Подписка на ${sub?.name || inn} удалена`);
  };

  const checkSubscription = async (sub: Subscription): Promise<number> => {
    try {
      const url = sub.type === 'supplier'
        ? `${API_URL}/zakupki/search/${sub.inn}`
        : `${API_URL}/zakupki/customer/contracts/${sub.inn}`;
      const response = await fetch(url);
      const data = await response.json();

      const total = (data.status === 'success' || data.success) ? (data.total || data.contracts?.length || 0) : 0;

      const lastCountResult = await bridge.send('VKWebAppStorageGet', { keys: [`last_count_${sub.type}_${sub.inn}`] });
      let lastCount = 0;
      if (lastCountResult.keys && lastCountResult.keys[0] && lastCountResult.keys[0].value) {
        lastCount = parseInt(lastCountResult.keys[0].value, 10);
      }

      if (total > lastCount) {
        await bridge.send('VKWebAppStorageSet', {
          key: `last_count_${sub.type}_${sub.inn}`,
          value: total.toString()
        });
        return total - lastCount;
      }
      return 0;
    } catch (e) {
      return 0;
    }
  };

  const checkAllSubscriptions = async () => {
    if (subscriptions.length === 0 || checking) return;
    setChecking(true);
    for (const sub of subscriptions) {
      const newContracts = await checkSubscription(sub);
      if (newContracts > 0) {
        const typeText = sub.type === 'supplier' ? 'Поставщик' : 'Заказчик';
        showToast(`📋 Новые контракты для ${sub.name} (${typeText}): +${newContracts}`);
      }
    }
    setChecking(false);
  };

  const manualCheck = async () => {
    if (subscriptions.length === 0) {
      showToast('❌ У вас нет активных подписок');
      return;
    }
    showToast(`🔍 Проверка ${subscriptions.length} подписок...`);
    await checkAllSubscriptions();
    showToast('✅ Проверка завершена');
  };

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

  useEffect(() => {
    const interval = setInterval(() => checkAllSubscriptions(), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [subscriptions.length]);

  return {
    subscriptions,
    loading,
    checking,
    toastMessage,
    addSubscription,
    removeSubscription,
    manualCheck,
  };
};