# Configuration Supabase - Guide de dépannage

## 🔍 Vérifications à faire dans votre dashboard Supabase

### 1. **Vérifier l'URL et la clé**
- URL: `https://adveiddumizjbtwjzafc.supabase.co`
- Clé publique: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 2. **Vérifier l'authentification**
1. Allez dans **Authentication** → **Settings**
2. Vérifiez que **Enable email confirmations** est **DÉSACTIVÉ** (pour les tests)
3. Vérifiez que **Enable email change confirmations** est **DÉSACTIVÉ**

### 3. **Vérifier les tables**
1. Allez dans **Table Editor**
2. Vérifiez que vous avez les tables:
   - ✅ `properties`
   - ✅ `simulations`

### 4. **Vérifier les politiques RLS**
1. Allez dans **Authentication** → **Policies**
2. Vérifiez que vous avez les politiques pour `properties`:
   - ✅ "Users can view their own properties"
   - ✅ "Users can insert their own properties"
   - ✅ "Users can update their own properties"
   - ✅ "Users can delete their own properties"

### 5. **Vérifier les logs**
1. Allez dans **Logs** → **Auth**
2. Regardez s'il y a des erreurs lors des tentatives de connexion

## 🚨 Problèmes courants

### Problème 1: "Invalid login credentials"
- **Cause**: Email/mot de passe incorrect
- **Solution**: Vérifiez les identifiants

### Problème 2: "Email not confirmed"
- **Cause**: Confirmation d'email activée
- **Solution**: Désactivez la confirmation d'email dans Settings

### Problème 3: "User not found"
- **Cause**: L'utilisateur n'existe pas
- **Solution**: Créez d'abord un compte avec l'inscription

### Problème 4: "RLS policy violation"
- **Cause**: Politiques de sécurité mal configurées
- **Solution**: Vérifiez les politiques RLS

## 🧪 Test rapide

1. **Ouvrez la console du navigateur** (F12)
2. **Allez sur votre app** (http://localhost:5173)
3. **Regardez les logs** dans la console
4. **Essayez de vous inscrire** et regardez les erreurs

## 📞 Si rien ne fonctionne

1. **Vérifiez les logs** dans la console du navigateur
2. **Vérifiez les logs** dans Supabase → Logs → Auth
3. **Testez avec un email différent**
4. **Vérifiez que les tables existent** dans Table Editor
