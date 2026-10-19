# 🎁 Amigo Secreto

App web para sortear o amigo secreto. Cada pessoa cria a própria conta com nome completo e senha, entra com `nome.sobrenome`, clica em **Sortear amigo secreto** e descobre quem tirou. Ninguém além da própria pessoa vê o resultado, nem o organizador.

Feito com React + TypeScript (Vite) e Firebase (Authentication, Firestore e Hosting), tudo no plano gratuito.

## Como funciona

- **Primeiro acesso:** o site mostra a tela "Bem-vindo, organizador!" para criar a conta de administrador. Ela só aparece uma vez.
- **Criar conta:** na tela de login, "Criar conta" pede o nome completo e a senha. O login vira primeiro nome + último sobrenome (`João da Silva Santos` → `joao.santos`). As inscrições fecham quando o sorteio é liberado.
- **Organizador:** copia o convite com o link, acompanha quem já sorteou e quem falta preencher a sugestão de presente, libera ou reinicia o sorteio e também pode participar.
- **Participante:** preenche a sugestão de presente (obrigatória), clica em sortear e vê o nome sorteado com a sugestão dele logo abaixo. Se entrar de novo, vê o mesmo resultado.
- **Regras do sorteio:** ninguém tira a si mesmo, ninguém é tirado duas vezes e o último a sortear nunca fica sem opção.
- **Segurança:** as regras do Firestore (`firestore.rules`) garantem que cada pessoa só lê o próprio resultado e impedem sorteio duplicado ou forjado.

## Colocando no ar (passo a passo)

### 1. Criar o projeto no Firebase

1. Acesse <https://console.firebase.google.com> e clique em **Adicionar projeto**. O Google Analytics pode ficar desligado.
2. No menu **Criação > Authentication**, clique em **Vamos começar**, escolha **E-mail/senha** e ative a primeira opção.
3. No menu **Criação > Firestore Database**, clique em **Criar banco de dados**, escolha a região `southamerica-east1 (São Paulo)` e o **modo de produção**.
4. Em **Configurações do projeto** (engrenagem) > **Seus apps**, clique no ícone **Web `</>`**, registre o app (sem marcar Hosting) e copie os valores do `firebaseConfig`.

### 2. Configurar o projeto local

```bash
npm install
cp .env.example .env
```

Preencha o `.env` com os valores copiados do `firebaseConfig` e troque `SEU-PROJETO-FIREBASE` no arquivo `.firebaserc` pelo ID do projeto (`projectId`).

### 3. Publicar

```bash
npx firebase login
npm run deploy
```

O deploy publica o site e as regras de segurança. O endereço fica `https://<id-do-projeto>.web.app`. Abra, crie a conta de organizador e mande o convite para a turma.

## Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | Roda o app local conectado ao Firebase real (usa o `.env`) |
| `npm run dev:local` | Roda o app com emuladores do Firebase, sem tocar no projeto real (precisa de Java 11+) |
| `npm test` | Testes da lógica de sorteio e de usuários |
| `npm run test:rules` | Testes das regras de segurança no emulador (precisa de Java 11+) |
| `npm run build` | Gera a versão de produção em `dist/` |
| `npm run deploy` | Build + publicação no Firebase Hosting e nas regras do Firestore |

## Observações

- O login `nome.sobrenome` vira internamente um e-mail `nome.sobrenome@amigo-secreto.app` no Firebase Authentication. O participante nunca precisa saber disso.
- As senhas ficam guardadas pelo Firebase Authentication de forma criptografada. Ninguém consegue vê-las, nem o organizador. Cada participante pode trocar a própria senha pelo botão **Trocar senha**.
- Remover um participante (permitido só com o sorteio fechado) tira o acesso dele ao app. Para a pessoa se cadastrar de novo com o mesmo nome, apague antes a conta dela em **Authentication > Usuários** no console do Firebase.
- Duas pessoas com o mesmo primeiro nome e último sobrenome geram o mesmo login. A segunda deve colocar outro sobrenome no final do nome completo.
- Para começar do zero, apague as contas em **Authentication > Usuários** e os dados com `npx firebase firestore:delete --all-collections`. Sem apagar os dados, o marcador de organizador antigo continua valendo.
- **Reiniciar sorteio** apaga todos os resultados e fecha o sorteio para você liberar de novo.
