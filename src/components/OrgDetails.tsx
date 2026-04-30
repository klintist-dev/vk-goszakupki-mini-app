import { FC } from 'react';
import { Panel, PanelHeader, Group, Div, Text, Title, Button, Header } from '@vkontakte/vkui';

interface OrgDetailsProps {
  id: string;
  data: {
    name: string;
    inn: string;
    ogrn?: string;
    registrationDate?: string;
    director?: string;
    kpp?: string;
  };
  onBack: () => void;
}

export const OrgDetails: FC<OrgDetailsProps> = ({ id, data, onBack }) => {
  return (
    <Panel id={id}>
      <PanelHeader before={<Button onClick={onBack} size="s" mode="tertiary">← Назад</Button>}>
        Карточка организации
      </PanelHeader>

      <Group>
        <Div style={{ padding: '16px' }}>
          <Title level="2" style={{ color: 'var(--accent)', marginBottom: 16 }}>
            {data.name}
          </Title>

          <Group header={<Header>Основные реквизиты</Header>}>
            <Div style={{ background: 'var(--background)', borderRadius: 12, padding: 12 }}>
              <Text style={{ marginBottom: 8 }}><b>ИНН:</b> {data.inn}</Text>
              {data.kpp && <Text style={{ marginBottom: 8 }}><b>КПП:</b> {data.kpp}</Text>}
              {data.ogrn && <Text style={{ marginBottom: 8 }}><b>ОГРН:</b> {data.ogrn}</Text>}
              {data.registrationDate && <Text style={{ marginBottom: 8 }}><b>Дата регистрации:</b> {data.registrationDate}</Text>}
            </Div>
          </Group>

          {data.director && (
            <Group header={<Header>Руководитель</Header>}>
              <Div style={{ background: 'var(--background)', borderRadius: 12, padding: 12 }}>
                <Text style={{ fontWeight: 500 }}>{data.director}</Text>
              </Div>
            </Group>
          )}
        </Div>
      </Group>
    </Panel>
  );
};