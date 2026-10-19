import type { ReactNode } from 'react';

interface StatusScreenProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function StatusScreen({ title, description, action }: StatusScreenProps) {
  return (
    <section className="card status-card">
      <div className="status-icon" aria-hidden="true">🎄</div>
      <h1 className="status-title">{title}</h1>
      {description && <p className="muted">{description}</p>}
      {action}
    </section>
  );
}

export function LoadingScreen() {
  return (
    <div className="loading" role="status">
      <span className="loading-dot" />
      <span className="loading-dot" />
      <span className="loading-dot" />
      <span className="visually-hidden">Carregando</span>
    </div>
  );
}
