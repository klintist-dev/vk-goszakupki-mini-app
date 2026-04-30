export interface Subscription {
  inn: string;
  name: string;
  type: 'supplier' | 'customer';
}

export interface ResultCardProps {
  orgName?: string;
  inn?: string;
  ogrn?: string;
  registrationDate?: string;
  director?: string;
  kpp?: string;
  status?: string;
  sum?: string;
  date?: string;
  pdfLink?: string;
  contractLink?: string;
  error?: string;
  customContent?: React.ReactNode;
  onOrgClick?: (orgData: {
    name: string;
    inn: string;
    ogrn?: string;
    registrationDate?: string;
    director?: string;
    kpp?: string;
  }) => void;
}