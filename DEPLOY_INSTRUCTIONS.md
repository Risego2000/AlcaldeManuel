# Instrucciones para completar el Deploy en GitHub Pages

## ✅ Cambios realizados:
1. ✅ Workflow de GitHub Actions creado (`.github/workflows/deploy.yml`)
2. ✅ Configuración de Vite actualizada para GitHub Pages
3. ✅ Cambios pusheados a GitHub

## 🔧 Pasos para completar el deploy:

### 1. Configurar el secreto de la API Key
1. Ve a tu repositorio: https://github.com/Risego2000/AlcaldeDigital
2. Haz clic en **Settings** (Configuración)
3. En el menú lateral, haz clic en **Secrets and variables** → **Actions**
4. Haz clic en **New repository secret**
5. Nombre: `GEMINI_API_KEY`
6. Valor: `AIzaSyBZwPV0TkgFxC8omWmasPmEIRyuks34_D0`
7. Haz clic en **Add secret**

### 2. Habilitar GitHub Pages
1. En **Settings** de tu repositorio
2. Haz clic en **Pages** en el menú lateral
3. En **Source**, selecciona: **GitHub Actions**
4. Guarda los cambios

### 3. Verificar el deploy
1. Ve a la pestaña **Actions** de tu repositorio
2. Deberías ver un workflow ejecutándose llamado "Deploy to GitHub Pages"
3. Espera a que termine (tarda ~2-3 minutos)
4. Una vez completado, tu app estará disponible en:
   **https://risego2000.github.io/AlcaldeDigital/**

## 🚀 Deploy automático
Cada vez que hagas `git push` a la rama `main`, GitHub Pages se actualizará automáticamente.

## 📝 Notas importantes:
- El workflow usa Node.js 20
- El build se genera en la carpeta `dist/`
- La API key se inyecta de forma segura desde los secretos de GitHub
