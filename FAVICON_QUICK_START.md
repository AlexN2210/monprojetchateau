# 🚀 Guide Rapide - Favicons Heritage Tracker

## ✅ Ce qui est déjà configuré

- ✅ Favicon SVG personnalisé (bâtiment/château)
- ✅ Configuration HTML complète
- ✅ Manifest PWA
- ✅ Plugin Vite personnalisé
- ✅ Scripts npm

## 🎯 Prochaines étapes

### 1. Générer les favicons PNG (Recommandé)

```bash
# Installer sharp pour la génération automatique
npm install sharp

# Générer tous les favicons
npm run favicon
```

### 2. Alternative : Outil en ligne

1. Allez sur [favicon.io](https://favicon.io/favicon-converter/)
2. Uploadez le fichier `public/favicon.svg`
3. Téléchargez le pack complet
4. Remplacez les fichiers dans `public/`

### 3. Vérification

1. Ouvrez l'application dans le navigateur
2. Vérifiez l'icône dans l'onglet
3. Testez sur mobile (icône de raccourci)
4. Vérifiez la console pour les erreurs 404

## 🎨 Personnalisation rapide

### Changer les couleurs du favicon SVG

Éditez `public/favicon.svg` et modifiez :
- `fill="#1e3a8a"` → Votre couleur primaire
- `fill="#f59e0b"` → Votre couleur secondaire
- `fill="#dc2626"` → Votre couleur d'accent

### Changer le titre de l'application

Modifiez dans `index.html` :
```html
<title>Votre Titre - Gestion du Patrimoine</title>
```

## 📱 Test sur différents appareils

- **Desktop** : Chrome, Firefox, Safari, Edge
- **Mobile** : iOS Safari, Android Chrome
- **PWA** : Installation sur mobile

## 🔧 Dépannage

### Favicon ne s'affiche pas
1. Vérifiez que les fichiers sont dans `public/`
2. Videz le cache du navigateur
3. Vérifiez la console pour les erreurs 404

### Erreur 404 sur les PNG
1. Générez les PNG avec `npm run favicon`
2. Ou utilisez un outil en ligne
3. Vérifiez les noms de fichiers

### Problème de cache
1. Hard refresh (Ctrl+F5)
2. Videz le cache du navigateur
3. Redémarrez le serveur de développement

## 🎉 Résultat final

Votre application aura :
- 🏠 Favicon personnalisé dans l'onglet
- 📱 Icône sur mobile
- 🚀 Support PWA complet
- 🎨 Identité visuelle cohérente

---

**Besoin d'aide ?** Consultez `FAVICON_README.md` pour plus de détails !
