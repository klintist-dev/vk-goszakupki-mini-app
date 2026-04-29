// Тип для подписки
export interface Subscription {
  inn: string;
  name: string;
  type: 'supplier' | 'customer';
}

// Тип для пропсов компонента ResultCard
export interface ResultCardProps {
  orgName?: string;
  inn?: string;
  status?: string;
  sum?: string;
  date?: string;
  pdfLink?: string;
  contractLink?: string;
  error?: string;
  customContent?: React.ReactNode;
}
