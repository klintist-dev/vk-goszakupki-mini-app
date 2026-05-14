import { FC, useState } from 'react';
import {
  Panel,
  PanelHeader,
  Header,
  Group,
  Div,
  Text,
  Button,
  Card,
  Title,
  Input,
} from '@vkontakte/vkui';
import { UserInfo } from '@vkontakte/vk-bridge';

interface Subscription {
  inn: string;
  name: string;
  type: 'supplier' | 'customer';
}

export interface ProfileProps {
  id: string;
  fetchedUser?: UserInfo;
  subscriptions: Subscription[];
  onRemoveSubscription: (inn: string) => void;
  onNavigateToHome?: () => void;  // Функция для возврата на главную
}

export const Profile: FC<ProfileProps> = ({
  id,
  fetchedUser,
  subscriptions,
  onRemoveSubscription,
  onNavigateToHome,
}) => {
  const { first_name, last_name, city } = { ...fetchedUser };
  const [searchTerm, setSearchTerm] = useState('');

  // Фильтрация подписок по поиску
  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.inn.includes(searchTerm)
  );

  return (
    <Panel id={id} style={{ background: 'var(--background)', minHeight: '100vh' }}>
      <PanelHeader
        before={
          <Button
            size="s"
            mode="tertiary"
            onClick={onNavigateToHome}
            style={{ color: 'var(--accent)' }}
          >
            ← Назад
          </Button>
        }
      >
        Личный кабинет
      </PanelHeader>

      {/* Информация о пользователе */}
      <Group header={<Header size="s">👤 Пользователь</Header>}>
        <Div
          style={{
            background: 'var(--card-background)',
            borderRadius: 12,
            border: '1px solid var(--border)',
          }}
        >
          <Text style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
            {first_name} {last_name}
          </Text>
          {city?.title && (
            <Text style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
              📍 {city.title}
            </Text>
          )}
        </Div>
      </Group>

      {/* Статистика */}
      <Group header={<Header size="s">📊 Статистика</Header>}>
        <Div
          style={{
            background: 'var(--card-background)',
            borderRadius: 12,
            border: '1px solid var(--border)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              textAlign: 'center',
            }}
          >
            <div>
              <Title level="3" style={{ color: 'var(--accent)' }}>
                {subscriptions.length}
              </Title>
              <Text style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                Всего подписок
              </Text>
            </div>
            <div>
              <Title level="3" style={{ color: 'var(--accent)' }}>
                {subscriptions.filter(s => s.type === 'supplier').length}
              </Title>
              <Text style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                Поставщики
              </Text>
            </div>
            <div>
              <Title level="3" style={{ color: 'var(--accent)' }}>
                {subscriptions.filter(s => s.type === 'customer').length}
              </Title>
              <Text style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                Заказчики
              </Text>
            </div>
          </div>
        </Div>
      </Group>

      {/* Мои подписки */}
      <Group header={<Header size="s">🔔 Мои подписки</Header>}>
        <Div
          style={{
            background: 'var(--card-background)',
            borderRadius: 12,
            border: '1px solid var(--border)',
          }}
        >
          <Input
            placeholder="🔍 Поиск по названию или ИНН"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              marginBottom: 16,
              background: 'var(--background)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
            }}
          />

          {filteredSubscriptions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 16px' }}>
              <Text style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                {subscriptions.length === 0
                  ? '😢 У вас пока нет подписок\n\nДобавьте их на главном экране в разделе "Уведомления"'
                  : '🔍 Ничего не найдено'}
              </Text>
            </div>
          ) : (
            filteredSubscriptions.map((sub, idx) => (
              <Card
                key={idx}
                mode="outline"
                style={{
                  marginBottom: 12,
                  padding: 12,
                  borderColor: 'var(--border)',
                  background: 'var(--background)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: 'var(--accent)',
                        fontWeight: 600,
                        marginBottom: 4,
                      }}
                    >
                      {sub.name}
                    </Text>
                    <Text
                      style={{
                        color: 'var(--text-secondary)',
                        fontSize: 12,
                        fontFamily: 'monospace',
                      }}
                    >
                      ИНН: {sub.inn}
                    </Text>
                    <Text
                      style={{
                        color:
                          sub.type === 'supplier'
                            ? 'var(--success)'
                            : 'var(--accent)',
                        fontSize: 11,
                        marginTop: 4,
                      }}
                    >
                      {sub.type === 'supplier' ? '📦 Поставщик' : '🏛 Заказчик'}
                    </Text>
                  </div>
                  <Button
                    onClick={() => onRemoveSubscription(sub.inn)}
                    size="s"
                    mode="secondary"
                    style={{
                      color: 'var(--error)',
                      borderColor: 'var(--error)',
                      background: 'var(--background)',
                    }}
                  >
                    Отписаться
                  </Button>
                </div>
              </Card>
            ))
          )}
        </Div>
      </Group>

      {/* Информация о работе уведомлений */}
      <Group header={<Header size="s">ℹ️ Об уведомлениях</Header>}>
        <Div
          style={{
            background: 'var(--card-background)',
            borderRadius: 12,
            border: '1px solid var(--border)',
          }}
        >
          <Text style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            • Уведомления приходят автоматически каждые 5 минут
            <br />
            • Вы получите сообщение, если у организации появились новые контракты
            <br />
            • Данные обновляются с задержкой до 1 часа
          </Text>
        </Div>
      </Group>
    </Panel>
  );
};