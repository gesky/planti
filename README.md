# Planti 🩺

Marketplace de profissionais de saúde para plantões e coberturas.  
Conecta enfermeiros, técnicos, cuidadores e outros profissionais a clínicas, hospitais e casas de repouso.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Front-end | HTML + CSS + JS vanilla (ES Modules) |
| Hospedagem | GitHub Pages |
| Banco de dados | Firebase Firestore |
| Autenticação | Firebase Auth (e-mail/senha) |
| Arquivos | Firebase Storage |
| PWA | manifest.json + Service Worker |

---

## Como rodar localmente

```bash
# 1. Clone o repositório
git clone https://github.com/SEU_USUARIO/planti.git
cd planti

# 2. Instale um servidor local simples (necessário para ES Modules)
npx serve .
# ou
python3 -m http.server 8080

# 3. Abra no navegador
# http://localhost:5000 (serve) ou http://localhost:8080 (python)
```

> ⚠️ Não abra `index.html` diretamente pelo sistema de arquivos.  
> ES Modules exigem um servidor HTTP.

---

## Configurar Firebase

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Crie um projeto chamado `planti`
3. Ative **Authentication** → método E-mail/senha
4. Ative **Firestore Database** → modo de produção
5. Ative **Storage**
6. Em **Configurações do projeto → Seus apps**, copie o objeto `firebaseConfig`
7. Cole no arquivo `js/firebase-config.js` substituindo os `"COLE_AQUI"`

### Regras do Firestore (cole no console)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Usuário lê/edita apenas o próprio perfil
    match /users/{uid} {
      allow read:  if request.auth != null;
      allow write: if request.auth.uid == uid;
    }

    // Disponibilidades: qualquer usuário logado lê; só o dono escreve
    match /disponibilidades/{id} {
      allow read:  if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.profissionalId;
    }

    // Vagas: qualquer logado lê; só o dono escreve
    match /vagas/{id} {
      allow read:  if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.contratanteId;
    }

    // Conversas: apenas os dois participantes
    match /conversas/{id} {
      allow read, write: if request.auth.uid == resource.data.profissionalId
                         || request.auth.uid == resource.data.contratanteId;
      allow create: if request.auth != null;

      match /mensagens/{msgId} {
        allow read, write: if request.auth != null;
      }
    }

    // Avaliações: qualquer logado lê; só o avaliador escreve
    match /avaliacoes/{id} {
      allow read:  if request.auth != null;
      allow create: if request.auth.uid == request.resource.data.avaliadorId;
    }
  }
}
```

---

## Deploy no GitHub Pages

```bash
# 1. Crie um repositório no GitHub chamado "planti"

# 2. Suba os arquivos
git init
git add .
git commit -m "feat: MVP inicial"
git remote add origin https://github.com/SEU_USUARIO/planti.git
git push -u origin main

# 3. No GitHub: Settings → Pages → Source: Deploy from branch → main / root
# Aguarde ~1 minuto e acesse: https://SEU_USUARIO.github.io/planti
```

> **PWA no iPhone:**  
> Abra `https://SEU_USUARIO.github.io/planti` no Safari →  
> Toque em Compartilhar (⬆) → "Adicionar à Tela de Início" → "Adicionar"  
> O app abrirá em tela cheia sem a barra do Safari, igual a um app nativo.

---

## Estrutura de arquivos

```
planti/
├── index.html              ← Shell da SPA
├── manifest.json           ← PWA manifest
├── sw.js                   ← Service Worker (cache offline)
├── css/
│   ├── base.css            ← Reset, tokens, layout
│   └── components.css      ← Componentes reutilizáveis
├── js/
│   ├── app.js              ← Entry point
│   ├── firebase-config.js  ← Config + estrutura do Firestore
│   ├── auth.js             ← Login, cadastro, logout
│   ├── router.js           ← Navegação SPA
│   └── utils.js            ← Helpers (toast, máscaras, formatação)
├── pages/
│   ├── disponibilidade.js  ← Tela de lançar plantões (profissional)
│   ├── chat.js             ← Lista de conversas + chat
│   ├── perfil.js           ← Tela de perfil
│   └── vaga.js             ← Publicar vagas (contratante)
└── icons/
    ├── icon-192.png        ← Ícone PWA (gerar em realfavicongenerator.net)
    └── icon-512.png
```

---

## Próximos passos (Fase 2)

- [ ] Notificações push (Firebase Cloud Messaging)
- [ ] Gateway de pagamento com split (Pagar.me)
- [ ] Verificação automática de COREN via API
- [ ] Painel administrativo para aprovar perfis
- [ ] Sistema de avaliação pós-plantão
- [ ] Filtro por geolocalização (raio em km)
- [ ] Plano premium para contratantes (acesso a perfis em destaque)
