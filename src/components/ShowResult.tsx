import { FC } from 'react';
import { Text, Button, Card } from '@vkontakte/vkui';
import { ResultCard } from './ResultCard';

interface ShowResultProps {
  result: string;
  onPageChange?: (page: number) => void;
}

export const ShowResult: FC<ShowResultProps> = ({ result, onPageChange }) => {
  if (!result || result === 'Готов к работе') return null;

  try {
    const data = JSON.parse(result);

    // Отладка — после объявления data
    console.log('🔍 ShowResult получил данные:', data);
    console.log('🔍 totalPages =', data.totalPages);
    console.log('🔍 contracts.length =', data.contracts?.length);
    console.log('🔍 status =', data.status);

    // Выписка из ЕГРЮЛ (PDF)
    if (data.status === 'success' && data.data?.download_link) {
      return (
        <ResultCard
          orgName={data.data.org_name || "Организация"}
          inn={data.data.inn}
          pdfLink={data.data.download_link}
        />
      );
    }

    // Проверка ИНН / Поиск по названию (текстовый результат)
    if (data.status === 'success' && data.data?.raw) {
      return (
        <ResultCard
          customContent={
            <div
              style={{
                background: 'var(--card-background)',
                padding: 10,
                borderRadius: 6,
                marginTop: 8,
                color: 'var(--text-secondary)'
              }}
              dangerouslySetInnerHTML={{
                __html: data.data.raw
                  .replace(/\*\*(.*?)\*\*/g, `<strong style="color:var(--accent)">$1</strong>`)
                  .replace(/`(.*?)`/g, `<code style="color:var(--text-secondary);background:var(--card-background);padding:2px 4px;border-radius:4px">$1</code>`)
                  .replace(/\n/g, '<br/>')
              }}
            />
          }
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

      console.log('📄 Рендерим контракты, totalPages =', totalPages, 'currentPage =', currentPage);

      return (
        <div>
          <Text style={{ marginBottom: 12, color: 'var(--text-secondary)' }}>
            📋 Найдено контрактов: <strong style={{ color: 'var(--accent)' }}>{total}</strong>
            {shown < total && ` (показано ${shown} из ${total})`}
          </Text>

          {/* Пагинация сверху */}
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
              <Text style={{ padding: '6px 12px' }}>
                Страница {currentPage} из {totalPages}
              </Text>
              <Button
                size="s"
                mode="secondary"
                disabled={currentPage === totalPages}
                onClick={() => {
                      console.log('🖱️ Нажата кнопка Вперед, currentPage =', currentPage);
                      onPageChange?.(currentPage + 1);
                }}
              >
                Вперед ▶
              </Button>
            </div>
          )}

          {/* Список контрактов на текущей странице */}
          {data.contracts.map((contract: any, idx: number) => (
            <Card key={idx} mode="outline" style={{ marginBottom: 16, padding: 12, borderColor: 'var(--border)', background: 'var(--card-background)' }}>
              <Text weight="2" style={{ color: 'var(--accent)', marginBottom: 8 }}>
                Контракт №{((currentPage - 1) * 20) + idx + 1}: {contract.number}
              </Text>
              <Text style={{ marginBottom: 4, color: 'var(--text-primary)' }}><b>Статус:</b> {contract.status}</Text>
              <Text style={{ marginBottom: 4, color: 'var(--text-primary)' }}><b>Сумма:</b> <span style={{ color: 'var(--accent)' }}>{contract.price}</span></Text>
              <Text style={{ marginBottom: 4, fontSize: 12, color: 'var(--text-secondary)' }}><b>Заказчик:</b> {contract.customer}</Text>
              <Text style={{ marginBottom: 4, fontSize: 12, color: 'var(--text-secondary)' }}><b>Дата:</b> {contract.date}</Text>
              <Text style={{ marginBottom: 8, fontSize: 12, color: 'var(--text-secondary)' }}><b>Объект:</b> {contract.object}</Text>
              <Button href={contract.url} target="_blank" size="s" mode="secondary">
                🔗 Перейти к контракту
              </Button>
            </Card>
          ))}

          {/* Пагинация снизу */}
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
              <Text style={{ padding: '6px 12px' }}>
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
        customContent={<pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(data, null, 2)}</pre>}
      />
    );
  } catch (e) {
    console.error('Ошибка в ShowResult:', e);
    return null;
  }
};