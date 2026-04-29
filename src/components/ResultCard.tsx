import { FC } from 'react';
import {
  Card,
  Spacing,
  Text,
  Title,
  Button,
} from '@vkontakte/vkui';
import { ResultCardProps } from '../types';

export const ResultCard: FC<ResultCardProps> = ({
  orgName,
  inn,
  status,
  sum,
  date,
  pdfLink,
  contractLink,
  error,
  customContent,
}) => {
  // Ошибка — красная карточка
  if (error) {
    return (
      <Card mode="outline" style={{ borderColor: 'var(--error)', marginBottom: 16, background: 'var(--card-background)' }}>
        <Spacing size={16}>
          <Text style={{ color: 'var(--error)', fontWeight: 'bold', fontSize: 16 }}>
            ❌ {error}
          </Text>
        </Spacing>
      </Card>
    );
  }

  // Обычная карточка с данными
  return (
    <Card mode="outline" style={{ marginBottom: 16, borderColor: 'var(--border)', background: 'var(--card-background)' }}>
      <Spacing size={16}>
        {/* Название организации — акцентный цвет */}
        {orgName && (
          <Title level="3" weight="2" style={{ color: 'var(--accent)' }}>
            {orgName}
          </Title>
        )}
        <Spacing size={8} />

        {/* ИНН */}
        {inn && (
          <Text style={{ color: 'var(--text-primary)' }}>
            <b>ИНН:</b> <span style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{inn}</span>
          </Text>
        )}

        {/* Статус — зелёный или красный */}
        {status && (
          <Text style={{
            color: status === "Действующее" ? 'var(--success)' : 'var(--error)',
            fontWeight: 500
          }}>
            <b>Статус:</b> {status}
          </Text>
        )}

        {/* Сумма — акцентный цвет */}
        {sum && (
          <Text style={{ color: 'var(--text-primary)' }}>
            <b>Сумма:</b> <span style={{ color: 'var(--accent)', fontWeight: 500 }}>{sum}</span>
          </Text>
        )}

        {/* Дата */}
        {date && (
          <Text style={{ color: 'var(--text-secondary)' }}>
            <b>Дата:</b> {date}
          </Text>
        )}

        {/* Кастомный контент */}
        {customContent}

        {/* Кнопка PDF */}
        {pdfLink && (
          <Button
            href={pdfLink}
            target="_blank"
            size="m"
            mode="primary"
            style={{ marginTop: 12 }}
          >
            📄 Скачать PDF
          </Button>
        )}

        {/* Кнопка "Посмотреть контракт" */}
        {contractLink && (
          <Button
            href={contractLink}
            target="_blank"
            size="m"
            mode="secondary"
            style={{ marginTop: 10 }}
          >
            📋 Посмотреть контракт
          </Button>
        )}
      </Spacing>
    </Card>
  );
};