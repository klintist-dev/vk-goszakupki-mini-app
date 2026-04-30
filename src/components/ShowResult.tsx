import { FC } from 'react';
import { Text, Button, Card } from '@vkontakte/vkui';
import { ResultCard } from './ResultCard';

interface ShowResultProps {
  result: string;
  onPageChange?: (page: number) => void;
  onOrgClick?: (orgData: any) => void;
}

export const ShowResult: FC<ShowResultProps> = ({ result, onPageChange, onOrgClick }) => {
  if (!result || result === 'Готов к работе') return null;

  try {
    const data = JSON.parse(result);

    // Выписка из ЕГРЮЛ (PDF)
    if (data.status === 'success' && data.data?.download_link) {
      return (
        <ResultCard
          orgName={data.data.org_name || "Организация"}
          inn={data.data.inn}
          pdfLink={data.data.download_link}
          onOrgClick={onOrgClick}
        />
      );
    }

    // Проверка ИНН / Поиск по названию (текстовый результат)
    if (data.status === 'success' && data.data?.raw) {
      const raw = data.data.raw;

      // Извлекаем название
      const nameMatch = raw.match(/\*\*Организация найдена\*\*\n\n\*\*(.+?)\*\*/);
      const orgName = nameMatch ? nameMatch[1] : '';

      // Извлекаем ИНН
      const innMatch = raw.match(/ИНН:\s*`?(\d+)`?/);
      const inn = innMatch ? innMatch[1] : '';

      // Извлекаем ОГРН
      const ogrnMatch = raw.match(/ОГРН:\s*(\d+)/);
      const ogrn = ogrnMatch ? ogrnMatch[1] : '';

      // Извлекаем дату регистрации
      const dateMatch = raw.match(/Дата регистрации:\s*(\d{2}\.\d{2}\.\d{4})/);
      const registrationDate = dateMatch ? dateMatch[1] : '';

      // Извлекаем руководителя
      const directorMatch = raw.match(/Руководитель:\s*(.+?)(?:\n|$)/);
      const director = directorMatch ? directorMatch[1].trim() : '';

      // Извлекаем КПП (только цифры)
      const kppMatch = raw.match(/КПП:\s*(\d{9})/);
      const kpp = kppMatch ? kppMatch[1] : '';
      console.log('📦 Извлечённый КПП:', kpp);

      return (
        <ResultCard
          orgName={orgName}
          inn={inn}
          ogrn={ogrn}
          registrationDate={registrationDate}
          director={director}
          kpp={kpp}
          onOrgClick={onOrgClick}
        />
      );
    }

    // Ошибка
    if (data.status === 'error' || data.error) {
      return <ResultCard error={data.message || data.error} />;
    }

    // Контракты по госзакупкам (с пагинацией)
    if (data.status === 'success' && data.contracts && Array.isArray(data.contracts)) {
      const total = data.total;
      const shown = data.shown;
      const currentPage = data.currentPage || 1;
      const totalPages = data.totalPages || 1;

      return (
        <div>
          <Text style={{ marginBottom: 12, color: 'var(--text-secondary)' }}>
            📋 Найдено контрактов: <strong style={{ color: 'var(--accent)' }}>{total}</strong>
            {shown < total && ` (показано ${shown} из ${total})`}
          </Text>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              <Button
                size="s"
                mode="secondary"
                disabled={currentPage === 1}
                onClick={() => onPageChange?.(currentPage - 1)}
              >
                ◀ Назад
              </Button>
              <Text style={{ padding: '6px 12px', color: 'var(--text-secondary)' }}>
                Страница {currentPage} из {totalPages}
              </Text>
              <Button
                size="s"
                mode="secondary"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange?.(currentPage + 1)}
              >
                Вперед ▶
              </Button>
            </div>
          )}

          {data.contracts.map((contract: any, idx: number) => (
            <Card key={idx} mode="outline" style={{ marginBottom: 16, padding: 12, borderColor: 'var(--border)', background: 'var(--card-background)' }}>
              <Text weight="2" style={{ color: 'var(--accent)', marginBottom: 8 }}>
                Контракт №{((currentPage - 1) * 20) + idx + 1}: {contract.number}
              </Text>
              <Text style={{ marginBottom: 4, color: 'var(--text-primary)' }}><b>Статус:</b> {contract.status}</Text>
              <Text style={{ marginBottom: 4, color: 'var(--text-primary)' }}><b>Сумма:</b> <span style={{ color: 'var(--accent)' }}>{contract.price}</span></Text>
              <Text style={{ marginBottom: 4, fontSize: 12, color: 'var(--text-secondary)' }}><b>Заказчик:</b> {contract.customer}</Text>
              <Text style={{ marginBottom: 4, fontSize: 12, color: 'var(--text-secondary)' }}><b>Дата публикации:</b> {contract.publish_date}</Text>
              <Text style={{ marginBottom: 8, fontSize: 12, color: 'var(--text-secondary)' }}><b>Объект закупки:</b> {contract.object}</Text>
              <Button href={contract.url} target="_blank" size="s" mode="secondary">
                🔗 Перейти к контракту
              </Button>
            </Card>
          ))}

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
              <Button
                size="s"
                mode="secondary"
                disabled={currentPage === 1}
                onClick={() => onPageChange?.(currentPage - 1)}
              >
                ◀ Назад
              </Button>
              <Text style={{ padding: '6px 12px', color: 'var(--text-secondary)' }}>
                Страница {currentPage} из {totalPages}
              </Text>
              <Button
                size="s"
                mode="secondary"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange?.(currentPage + 1)}
              >
                Вперед ▶
              </Button>
            </div>
          )}
        </div>
      );
    }

    // Универсальный случай
    return (
      <ResultCard
        customContent={<pre style={{ whiteSpace: 'pre-wrap', color: 'var(--text-primary)' }}>{JSON.stringify(data, null, 2)}</pre>}
      />
    );
  } catch (e) {
    console.error('Ошибка в ShowResult:', e);
    return null;
  }
};