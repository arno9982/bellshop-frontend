# 📚 Documentation Complète - API Bellshop Backend

**Date:** Juillet 2026  
**Version:** 1.0.0  
**Framework:** Spring Boot 3.x  
**Base de données:** PostgreSQL  
**Authentification:** JWT (JSON Web Tokens)

---

## 🎯 Vue d'ensemble

Bellshop est une API REST pour gérer une boutique de tricots sur-mesure et prêt-à-porter. Elle offre :

- **Vitrine produits** : Accès public aux produits disponibles
- **Gestion des commandes** : Achat direct ou sur-mesure
- **Authentification Admin** : Dashboard sécurisé avec JWT
- **API complète** : CRUD pour produits et commandes

### Environnement de développement

```
URL de base : http://localhost:8080
Frontend : http://localhost:3000
Documentation Swagger : http://localhost:8080/swagger-ui.html
```

---

## 🔐 Authentification & Sécurité

### Principe JWT (JSON Web Tokens)

Tous les appels API protégés nécessitent un en-tête **Authorization** avec un token JWT.

#### Flux d'authentification

```
1. POST /api/auth/login (username + password)
   ↓
2. Backend retourne un token JWT
   ↓
3. Frontend stocke le token (localStorage ou SessionStorage)
   ↓
4. Frontend envoie le token dans chaque requête protégée
   En-tête : Authorization: Bearer <token>
   ↓
5. Backend valide le token et traite la requête
```

### Configuration de sécurité

- **Mot de passe** : Haché en BCrypt (stockage sécurisé)
- **CORS activé** : Accepte uniquement `http://localhost:3000`
- **Session** : Sans état (Stateless) - Chaque requête est indépendante
- **CSRF** : Désactivé (JWT est résistant aux attaques CSRF)

---

## 📡 Endpoints API

### 1️⃣ AUTHENTIFICATION

#### Login Admin
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "Admin123"
}
```

**Réponse (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Erreurs possibles:**
- `401 Unauthorized` : Identifiants incorrects
- `400 Bad Request` : Format de requête invalide

**Utilisation du token:**
```javascript
// Dans chaque requête protégée, ajouter l'en-tête
headers: {
  'Authorization': 'Bearer ' + token,
  'Content-Type': 'application/json'
}
```

---

### 2️⃣ PRODUITS (Tricots)

#### 2.1 Lister tous les produits disponibles (PUBLIC)
```http
GET /api/products
```

**Réponse (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Pull Laine Merinos",
    "description": "Pull chaud et confortable",
    "price": 45.99,
    "imageUrl": "https://...",
    "category": "PULL",
    "available": true,
    "createdAt": "2026-07-04T10:30:00"
  },
  {
    "id": 2,
    "title": "T-shirt Coton Bio",
    "description": "T-shirt écologique",
    "price": 25.50,
    "imageUrl": "https://...",
    "category": "TSHIRT",
    "available": true,
    "createdAt": "2026-07-04T11:15:00"
  }
]
```

---

#### 2.2 Récupérer un produit par ID (PUBLIC)
```http
GET /api/products/{id}
```

**Exemple:**
```http
GET /api/products/1
```

**Réponse (200 OK):**
```json
{
  "id": 1,
  "title": "Pull Laine Merinos",
  "description": "Pull chaud et confortable",
  "price": 45.99,
  "imageUrl": "https://...",
  "category": "PULL",
  "available": true,
  "createdAt": "2026-07-04T10:30:00"
}
```

**Erreurs possibles:**
- `404 Not Found` : Produit inexistant

---

#### 2.3 Filtrer produits par catégorie (PUBLIC)
```http
GET /api/products/category/{category}
```

**Exemples:**
```http
GET /api/products/category/PULL
GET /api/products/category/TSHIRT
GET /api/products/category/CHEMISE
```

**Réponse (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Pull Laine Merinos",
    "description": "Pull chaud et confortable",
    "price": 45.99,
    "imageUrl": "https://...",
    "category": "PULL",
    "available": true,
    "createdAt": "2026-07-04T10:30:00"
  },
  {
    "id": 3,
    "title": "Pull Coton",
    "description": "Pull léger pour l'été",
    "price": 35.00,
    "imageUrl": "https://...",
    "category": "PULL",
    "available": true,
    "createdAt": "2026-07-04T09:45:00"
  }
]
```

---

#### 2.4 Admin - Lister TOUS les produits (même indisponibles) [PROTÉGÉ]
```http
GET /api/products/admin/all
Authorization: Bearer <token>
```

**Réponse (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Pull Laine Merinos",
    "description": "Pull chaud et confortable",
    "price": 45.99,
    "imageUrl": "https://...",
    "category": "PULL",
    "isAvailable": true,
    "createdAt": "2026-07-04T10:30:00"
  },
  {
    "id": 2,
    "title": "Produit Retiré",
    "description": "Ce produit n'est plus disponible",
    "price": 99.99,
    "imageUrl": "https://...",
    "category": "ANCIEN",
    "isAvailable": false,
    "createdAt": "2026-06-15T14:20:00"
  }
]
```

---

#### 2.5 Admin - Créer un nouveau produit [PROTÉGÉ]
```http
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Pull Laine Merinos",
  "description": "Pull chaud et confortable",
  "price": 45.99,
  "imageUrl": "https://example.com/images/pull.jpg",
  "category": "PULL",
  "available": true
}
```

**Réponse (201 Created):**
```json
{
  "id": 1,
  "title": "Pull Laine Merinos",
  "description": "Pull chaud et confortable",
  "price": 45.99,
  "imageUrl": "https://example.com/images/pull.jpg",
  "category": "PULL",
  "available": true,
  "createdAt": "2026-07-04T10:30:00"
}
```

**Champs requis:**
- `title` (string, max 100 caractères)
- `price` (nombre décimal)
- `category` (string, max 50 caractères)

**Champs optionnels:**
- `description` (texte long)
- `imageUrl` (URL vers l'image)
- `available` (booléen, par défaut true)

---

#### 2.6 Admin - Modifier un produit [PROTÉGÉ]
```http
PUT /api/products/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Pull Laine Merinos Premium",
  "description": "Pull ultra chaud et confortable",
  "price": 55.99,
  "imageUrl": "https://example.com/images/pull-premium.jpg",
  "category": "PULL",
  "available": true
}
```

**Réponse (200 OK):**
```json
{
  "id": 1,
  "title": "Pull Laine Merinos Premium",
  "description": "Pull ultra chaud et confortable",
  "price": 55.99,
  "imageUrl": "https://example.com/images/pull-premium.jpg",
  "category": "PULL",
  "available": true,
  "createdAt": "2026-07-04T10:30:00"
}
```

---

#### 2.7 Admin - Supprimer un produit [PROTÉGÉ]
```http
DELETE /api/products/{id}
Authorization: Bearer <token>
```

**Réponse (204 No Content):**
```
(Pas de corps de réponse)
```

---

### 3️⃣ COMMANDES (Orders)

#### 3.1 Créer une nouvelle commande (PUBLIC)
```http
POST /api/orders
Content-Type: application/json

{
  "clientName": "Jean Dupont",
  "clientPhone": "06 12 34 56 78",
  "deliveryAddress": "123 Rue de la Paix, 75000 Paris",
  "isCustom": false,
  "product": {
    "id": 1
  }
}
```

**Ou pour une commande sur-mesure :**
```json
{
  "clientName": "Marie Martin",
  "clientPhone": "07 98 76 54 32",
  "deliveryAddress": "456 Avenue du Commerce, 69000 Lyon",
  "isCustom": true,
  "customDescription": "Je voudrais un pull noir avec des détails en rouge, taille L"
}
```

**Réponse (201 Created):**
```json
{
  "id": 1,
  "clientName": "Jean Dupont",
  "clientPhone": "06 12 34 56 78",
  "deliveryAddress": "123 Rue de la Paix, 75000 Paris",
  "status": "NOUVELLE",
  "isCustom": false,
  "customDescription": null,
  "product": {
    "id": 1,
    "title": "Pull Laine Merinos",
    "price": 45.99
  },
  "createdAt": "2026-07-04T10:30:00"
}
```

**Champs requis:**
- `clientName` (string)
- `clientPhone` (string)
- `deliveryAddress` (string)
- Pour achat direct : `product` avec `id`
- Pour sur-mesure : `isCustom: true` et `customDescription`

---

#### 3.2 Admin - Lister toutes les commandes [PROTÉGÉ]
```http
GET /api/orders
Authorization: Bearer <token>
```

**Réponse (200 OK):**
```json
[
  {
    "id": 1,
    "clientName": "Jean Dupont",
    "clientPhone": "06 12 34 56 78",
    "deliveryAddress": "123 Rue de la Paix, 75000 Paris",
    "status": "NOUVELLE",
    "isCustom": false,
    "customDescription": null,
    "product": {
      "id": 1,
      "title": "Pull Laine Merinos",
      "price": 45.99
    },
    "createdAt": "2026-07-04T10:30:00"
  },
  {
    "id": 2,
    "clientName": "Marie Martin",
    "clientPhone": "07 98 76 54 32",
    "deliveryAddress": "456 Avenue du Commerce, 69000 Lyon",
    "status": "VALIDEE",
    "isCustom": true,
    "customDescription": "Je voudrais un pull noir avec des détails en rouge, taille L",
    "product": null,
    "createdAt": "2026-07-04T11:15:00"
  }
]
```

---

#### 3.3 Admin - Récupérer une commande par ID [PROTÉGÉ]
```http
GET /api/orders/{id}
Authorization: Bearer <token>
```

**Exemple:**
```http
GET /api/orders/1
```

**Réponse (200 OK):**
```json
{
  "id": 1,
  "clientName": "Jean Dupont",
  "clientPhone": "06 12 34 56 78",
  "deliveryAddress": "123 Rue de la Paix, 75000 Paris",
  "status": "NOUVELLE",
  "isCustom": false,
  "customDescription": null,
  "product": {
    "id": 1,
    "title": "Pull Laine Merinos",
    "price": 45.99
  },
  "createdAt": "2026-07-04T10:30:00"
}
```

**Erreurs possibles:**
- `404 Not Found` : Commande inexistante

---

#### 3.4 Admin - Filtrer commandes par statut [PROTÉGÉ]
```http
GET /api/orders/status/{status}
Authorization: Bearer <token>
```

**Statuts possibles:**
- `NOUVELLE` : Commande fraîchement reçue
- `VALIDEE` : Commande acceptée par l'admin
- `EN_COURS_DE_PRODUCTION` : Fabrication en cours
- `PRETE` : Commande prête à être expédiée
- `EXPEDIEE` : Commande envoyée
- `LIVREE` : Commande reçue par le client
- `ANNULEE` : Commande annulée

**Exemples:**
```http
GET /api/orders/status/NOUVELLE
GET /api/orders/status/EN_PRODUCTION
GET /api/orders/status/LIVREE
```

**Réponse (200 OK):**
```json
[
  {
    "id": 1,
    "clientName": "Jean Dupont",
    "clientPhone": "06 12 34 56 78",
    "deliveryAddress": "123 Rue de la Paix, 75000 Paris",
    "status": "NOUVELLE",
    "isCustom": false,
    "customDescription": null,
    "product": {
      "id": 1,
      "title": "Pull Laine Merinos",
      "price": 45.99
    },
    "createdAt": "2026-07-04T10:30:00"
  }
]
```

---

#### 3.5 Admin - Changer le statut d'une commande [PROTÉGÉ]
```http
PUT /api/orders/{id}/status?status={NEW_STATUS}
Authorization: Bearer <token>
```

**Exemples:**
```http
PUT /api/orders/1/status?status=VALIDEE
PUT /api/orders/1/status?status=EN_COURS_DE_PRODUCTION
PUT /api/orders/1/status?status=PRETE
PUT /api/orders/1/status?status=EXPEDIEE
PUT /api/orders/1/status?status=LIVREE
```

**Réponse (200 OK):**
```json
{
  "id": 1,
  "clientName": "Jean Dupont",
  "clientPhone": "06 12 34 56 78",
  "deliveryAddress": "123 Rue de la Paix, 75000 Paris",
  "status": "VALIDEE",
  "isCustom": false,
  "customDescription": null,
  "product": {
    "id": 1,
    "title": "Pull Laine Merinos",
    "price": 45.99
  },
  "createdAt": "2026-07-04T10:30:00"
}
```

**Erreurs possibles:**
- `404 Not Found` : Commande inexistante
- `400 Bad Request` : Statut invalide

---

## 📊 Modèles de données

### Product (Produit)

| Champ | Type | Description |
|-------|------|-------------|
| `id` | Long | Identifiant unique (auto-généré) |
| `title` | String (100) | Nom du produit |
| `description` | Text | Description détaillée |
| `price` | BigDecimal | Prix en euros (2 décimales) |
| `imageUrl` | String | URL vers l'image du produit |
| `category` | String (50) | Catégorie (PULL, TSHIRT, CHEMISE, etc.) |
| `available` | Boolean | Produit disponible à la vente |
| `createdAt` | LocalDateTime | Date de création (auto-générée) |

---

### Order (Commande)

| Champ | Type | Description |
|-------|------|-------------|
| `id` | Long | Identifiant unique (auto-généré) |
| `clientName` | String (100) | Nom du client |
| `clientPhone` | String (50) | Téléphone du client |
| `deliveryAddress` | Text | Adresse de livraison |
| `status` | OrderStatus (ENUM) | Statut actuel de la commande |
| `isCustom` | Boolean | Commande sur-mesure ou achat direct |
| `customDescription` | Text | Description du tricot sur-mesure demandé |
| `product` | Product (Foreign Key) | Produit acheté (null si sur-mesure) |
| `createdAt` | LocalDateTime | Date de création (auto-générée) |

---

### Admin (Administrateur)

| Champ | Type | Description |
|-------|------|-------------|
| `id` | Long | Identifiant unique (auto-généré) |
| `username` | String (50) | Nom d'utilisateur (unique) |
| `password` | String (255) | Mot de passe haché en BCrypt |

---

### OrderStatus (Énumération des statuts)

```
NOUVELLE               → Commande reçue, en attente de validation
VALIDEE                → Commande acceptée par l'admin
EN_COURS_DE_PRODUCTION → Fabrication en cours
PRETE                  → Commande prête à être expédiée
EXPEDIEE               → Commande envoyée au client
LIVREE                 → Commande reçue par le client
ANNULEE                → Commande annulée
```

---

## 🔄 Flux métier

### Flux d'achat direct (Produit de catalogue)

```
1. Client voit la liste des produits
   GET /api/products (PUBLIC)
   ↓
2. Client clique sur un produit pour plus de détails
   GET /api/products/{id} (PUBLIC)
   ↓
3. Client remplit le formulaire de commande
   - Choisit l'adresse de livraison
   - Sélectionne le produit
   ↓
4. Client valide la commande
   POST /api/orders (PUBLIC)
   Status initial : NOUVELLE
   ↓
5. Admin voit la nouvelle commande
   GET /api/orders (PROTÉGÉ)
   ↓
6. Admin valide la commande
   PUT /api/orders/{id}/status?status=VALIDEE (PROTÉGÉ)
   ↓
7. Admin passe le statut à EN_PRODUCTION
   PUT /api/orders/{id}/status?status=EN_PRODUCTION (PROTÉGÉ)
   ↓
8. Admin envoie le colis
   PUT /api/orders/{id}/status?status=EXPEDIEE (PROTÉGÉ)
   ↓
9. Client reçoit le colis
   Admin marque comme LIVREE
   PUT /api/orders/{id}/status?status=LIVREE (PROTÉGÉ)
```

### Flux de commande sur-mesure

```
1. Client accède à la page "Commande sur-mesure"
   (aucun appel API nécessaire)
   ↓
2. Client remplit son cahier des charges
   - Nom, téléphone, adresse
   - Description détaillée du tricot souhaité
   ↓
3. Client valide sa demande
   POST /api/orders (PUBLIC)
   {
     "clientName": "...",
     "clientPhone": "...",
     "deliveryAddress": "...",
     "isCustom": true,
     "customDescription": "..."
   }
   Status initial : NOUVELLE
   ↓
4. Admin reçoit une notification
   GET /api/orders (PROTÉGÉ)
   Voit toutes les commandes avec isCustom=true
   ↓
5. Admin valide le cahier des charges
   PUT /api/orders/{id}/status?status=VALIDEE (PROTÉGÉ)
   ↓
6. Les étapes suivantes sont identiques aux commandes directes
```

---

## 🚀 Codes HTTP

| Code | Signification | Exemple |
|------|---------------|---------|
| **200** | OK | Requête réussie |
| **201** | Created | Ressource créée avec succès |
| **204** | No Content | Suppression réussie |
| **400** | Bad Request | Format invalide, données manquantes |
| **401** | Unauthorized | Token JWT manquant ou invalide |
| **403** | Forbidden | Authentifié mais pas autorisé |
| **404** | Not Found | Ressource introuvable |
| **500** | Server Error | Erreur serveur interne |

---

## 💾 Configuration base de données

**PostgreSQL** - Connexion locale

```
Hôte : localhost
Port : 5432
Base de données : bellshop
Utilisateur : postgres
Mot de passe : arno1405
```

**Migration automatique** : Hibernate crée/met à jour les tables automatiquement au démarrage.

---

## 🔑 Identifiants par défaut

```
Username : admin
Mot de passe : Admin123
```

> ⚠️ **À changer en production !** Utiliser des variables d'environnement `ADMIN_USER` et `ADMIN_PASS`.

---

## 📝 Exemple d'intégration Frontend (JavaScript/React)

### 1. Authentification

```javascript
async function login(username, password) {
  const response = await fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  if (!response.ok) throw new Error('Login failed');
  
  const data = await response.json();
  localStorage.setItem('token', data.token); // Stocker le token
  return data.token;
}
```

### 2. Requête protégée (avec token)

```javascript
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

async function getAllOrders() {
  const response = await fetch('http://localhost:8080/api/orders', {
    method: 'GET',
    headers: getAuthHeaders()
  });
  return response.json();
}
```

### 3. Créer une commande (Public)

```javascript
async function createOrder(order) {
  const response = await fetch('http://localhost:8080/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  });
  return response.json();
}
```

### 4. Lister les produits (Public)

```javascript
async function getProducts() {
  const response = await fetch('http://localhost:8080/api/products');
  return response.json();
}
```

---

## 📖 Documentation Swagger

Accédez à la documentation interactive Swagger :

```
http://localhost:8080/swagger-ui.html
```

Vous y trouverez :
- ✅ Tous les endpoints listés
- ✅ Schémas des requêtes/réponses
- ✅ Possibilité de tester les appels directement
- ✅ Codes d'erreur documentés

---

## ⚠️ Notes de sécurité

1. **Stockage du token** : Ne jamais stocker le token dans les cookies sans HttpOnly
2. **CORS** : Limité à `http://localhost:3000` - À adapter en production
3. **Mot de passe admin** : Stocké en BCrypt, jamais en clair
4. **HTTPS en production** : Obligatoire pour les tokens JWT
5. **Expiration du token** : À implémenter dans la config JWT (durée de vie du token)

---

## 🐛 Dépannage

### Erreur `401 Unauthorized` sur une requête protégée

- ✅ Vérifiez que le token est stocké correctement
- ✅ Vérifiez que l'en-tête `Authorization` est envoyé
- ✅ Vérifiez le format : `Bearer <token>` (espace après Bearer)
- ✅ Vérifiez que le token n'a pas expiré

### Erreur `403 Forbidden`

- ✅ Vous êtes authentifié mais n'avez pas les droits
- ✅ Vérifiez que vous utilisez un compte admin valide

### Erreur `404 Not Found`

- ✅ Vérifiez l'ID de la ressource
- ✅ Vérifiez l'URL de l'endpoint

### Erreur `CORS` côté frontend

- ✅ Assurez-vous que le frontend s'exécute sur `http://localhost:3000`
- ✅ Vérifiez que l'en-tête `Content-Type` est présent

---

## 📞 Support

Pour toute question ou bug découvert, consultez les logs du serveur :

```bash
# Les logs sont affichés en console du Spring Boot
# Vérifiez les erreurs SQL et les traces d'exécution
```

---

**Dernière mise à jour:** Juillet 2026
