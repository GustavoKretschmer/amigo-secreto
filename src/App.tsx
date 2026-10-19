import { useState, type ReactNode } from 'react';
import { Snowfall } from './components/Snowfall';
import { LoadingScreen, StatusScreen } from './components/StatusScreen';
import { useAdminExists, useAuthUser, useMember } from './hooks/liveData';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';
import { ParticipantPage } from './pages/ParticipantPage';
import { SetupPage } from './pages/SetupPage';
import { SignUpPage } from './pages/SignUpPage';
import { signOutCurrentUser } from './services/session';

export function App() {
  return (
    <div className="app">
      <Snowfall />
      <CurrentScreen />
    </div>
  );
}

function CurrentScreen() {
  const authUser = useAuthUser();
  const adminExists = useAdminExists();
  if (authUser === undefined || adminExists === undefined) return <CenteredScreen><LoadingScreen /></CenteredScreen>;
  if (authUser === null) return <CenteredScreen>{adminExists ? <AuthScreens /> : <SetupPage />}</CenteredScreen>;
  return <SignedInScreen uid={authUser.uid} />;
}

function AuthScreens() {
  const [isSigningUp, setIsSigningUp] = useState(false);
  return isSigningUp
    ? <SignUpPage onSwitchToLogin={() => setIsSigningUp(false)} />
    : <LoginPage onSwitchToSignUp={() => setIsSigningUp(true)} />;
}

function SignedInScreen({ uid }: { uid: string }) {
  const member = useMember(uid);
  if (member === undefined) return <CenteredScreen><LoadingScreen /></CenteredScreen>;
  if (member === null) return <CenteredScreen><MissingAccountScreen /></CenteredScreen>;
  return member.role === 'admin' ? <AdminPage admin={member} /> : <ParticipantPage member={member} />;
}

function MissingAccountScreen() {
  return (
    <StatusScreen
      title="Cadastro não encontrado"
      description="Seu acesso não está ativo. Fale com o organizador do amigo secreto."
      action={<button className="button button-primary" onClick={() => void signOutCurrentUser()}>Voltar ao login</button>}
    />
  );
}

function CenteredScreen({ children }: { children: ReactNode }) {
  return <main className="centered">{children}</main>;
}
