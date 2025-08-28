# 🎨 Gestion des Favicons - Heritage Tracker

## 📁 Structure des fichiers

```
public/
├── favicon.svg          # Favicon principal (SVG vectoriel)
├── favicon.ico          # Favicon ICO pour compatibilité
├── favicon-16x16.png    # Favicon 16x16 pixels
├── favicon-32x32.png    # Favicon 32x32 pixels
├── apple-touch-icon.png # Icône pour iOS (180x180)
└── site.webmanifest     # Manifest PWA
```

## 🎯 Favicon SVG personnalisé

Le favicon SVG principal (`favicon.svg`) représente :
- **Fond bleu marine** (#1e3a8a) - Couleur principale de l'app
- **Bâtiment doré** (#f59e0b) - Symbole immobilier
- **Toit rouge** (#dc2626) - Accent visuel
- **Fenêtres et porte bleues** - Détails architecturaux
- **Drapeau rouge** - Élément décoratif

## 🔧 Génération des favicons PNG

Pour générer les différentes tailles de favicons PNG :

### Option 1 : Outil en ligne
1. Allez sur [favicon.io](https://favicon.io/favicon-converter/)
2. Uploadez le fichier `favicon.svg`
3. Téléchargez le pack complet
4. Remplacez les fichiers dans le dossier `public/`

### Option 2 : ImageMagick (ligne de commande)
```bash
# Convertir SVG en PNG 16x16
convert favicon.svg -resize 16x16 favicon-16x16.png

# Convertir SVG en PNG 32x32
convert favicon.svg -resize 32x32 favicon-32x32.png

# Convertir SVG en PNG 180x180 (Apple Touch Icon)
convert favicon.svg -resize 180x180 apple-touch-icon.png
```

### Option 3 : GIMP/Photoshop
1. Ouvrez le fichier SVG
2. Redimensionnez à la taille souhaitée
3. Exportez en PNG
4. Optimisez avec un outil comme TinyPNG

## 📱 Support des appareils

- **Desktop** : SVG, ICO, PNG 16x16, PNG 32x32
- **iOS** : apple-touch-icon.png (180x180)
- **Android** : site.webmanifest avec theme-color
- **PWA** : Manifest complet pour installation

## 🎨 Personnalisation

### Couleurs actuelles
- **Primaire** : #1e3a8a (bleu marine)
- **Secondaire** : #f59e0b (doré)
- **Accent** : #dc2626 (rouge)
- **Fond** : #f8fafc (gris clair)

### Modifier le favicon SVG
1. Éditez `public/favicon.svg`
2. Changez les couleurs dans les attributs `fill` et `stroke`
3. Modifiez les formes si nécessaire
4. Régénérez les PNG si besoin

## 🚀 Déploiement

Les favicons sont automatiquement inclus dans le build Vite et servis depuis le dossier `public/`.

### Vérification
1. Ouvrez l'application dans le navigateur
2. Vérifiez que l'icône apparaît dans l'onglet
3. Testez sur mobile (icône de raccourci)
4. Vérifiez la console pour les erreurs 404

## 📚 Ressources utiles

- [Favicon Generator](https://realfavicongenerator.net/)
- [Favicon.io](https://favicon.io/)
- [MDN Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [SVG Optimizer](https://jakearchibald.github.io/svgomg/)
