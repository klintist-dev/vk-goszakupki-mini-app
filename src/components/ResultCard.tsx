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
  ogrn,
  registrationDate,
  director,
  kpp,
  status,
  sum,
  date,
  pdfLink,
  contractLink,
  error,
  customContent,
  onOrgClick,
}) => {
  // Обработчик ошибки
  if (error) {
    const errorText = error.startsWith('❌') ? error : `❌ ${error}`;
    return (
      <Card mode="outline" style={{ borderColor: 'var(--error)', marginBottom: 16, background: 'var(--card-background)' }}>
        <Spacing size={16}>
          <Text style={{ color: 'var(--error)', fontWeight: 'bold', fontSize: 16 }}>
            {errorText}
          </Text>
        </Spacing>
      </Card>
    );
  }

  // Обработчик клика по названию организации
  const handleOrgClick = () => {
    if (onOrgClick && orgName && inn) {
      onOrgClick({
        name: orgName,
        inn: inn,
        ogrn: ogrn,
        registrationDate: registrationDate,
        director: director,
        kpp: kpp,
      });
    }
  };

  return (
    <Card mode="outline" style={{ marginBottom: 16, borderColor: 'var(--border)', background: 'var(--card-background)' }}>
      <Spacing size={16}>
        {/* Название организации — кликабельное с иконкой */}
        {orgName && (
          <div
            onClick={handleOrgClick}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: 8,
              flexWrap: 'wrap'
            }}
          >
            <Title
              level="3"
              weight="2"
              style={{
                color: 'var(--accent)',
                textDecoration: 'underline',
                margin: 0
              }}
            >
              {orgName}
            </Title>
            <span style={{ color: 'var(--accent)', fontSize: '14px' }}>🔗</span>
          </div>
        )}

        {/* ИНН */}
        {inn && (
          <Text style={{ color: 'var(--text-primary)' }}>
            <b>ИНН:</b> <span style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{inn}</span>
          </Text>
        )}

        {/* КПП */}
        {/*{kpp && (
          <Text style={{ color: 'var(--text-primary)' }}>
            <b>КПП:</b> <span style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{kpp}</span>
          </Text>
        )}*/}

        {/* ОГРН */}
        {ogrn && (
          <Text style={{ color: 'var(--text-primary)' }}>
            <b>ОГРН:</b> <span style={{ color: 'var(--text-secondary)' }}>{ogrn}</span>
          </Text>
        )}

        {/* Дата регистрации */}
        {registrationDate && (
          <Text style={{ color: 'var(--text-primary)' }}>
            <b>Дата регистрации:</b> <span style={{ color: 'var(--text-secondary)' }}>{registrationDate}</span>
          </Text>
        )}

        {/* Руководитель */}
        {director && (
          <Text style={{ color: 'var(--text-primary)' }}>
            <b>Руководитель:</b> <span style={{ color: 'var(--text-secondary)' }}>{director}</span>
          </Text>
        )}

        {/* Статус */}
        {status && (
          <Text style={{
            color: status === "Действующее" ? 'var(--success)' : 'var(--error)',
            fontWeight: 500
          }}>
            <b>Статус:</b> {status}
          </Text>
        )}

        {/* Сумма */}
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

        {/* Кнопка контракта */}
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