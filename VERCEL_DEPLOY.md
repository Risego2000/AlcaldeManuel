# Instrucciones para Deploy en Vercel

## 🚀 Opción 1: Deploy desde la Web (MÁS FÁCIL)

### Paso 1: Ir a Vercel
1. Abre tu navegador y ve a: **https://vercel.com**
2. Haz clic en **"Sign Up"** o **"Log In"**
3. Inicia sesión con tu cuenta de **GitHub**

### Paso 2: Importar el proyecto
1. Una vez dentro, haz clic en **"Add New..."** → **"Project"**
2. Vercel te mostrará tus repositorios de GitHub
3. Busca **"AlcaldeDigital"** y haz clic en **"Import"**

### Paso 3: Configurar el proyecto
1. **Framework Preset**: Vercel detectará automáticamente **"Vite"** ✅
2. **Root Directory**: Dejar como está (`.`)
3. **Build Command**: `npm run build` (ya está configurado)
4. **Output Directory**: `dist` (ya está configurado)

### Paso 4: Configurar Variables de Entorno
1. Expande la sección **"Environment Variables"**
2. Añade la siguiente variable:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: `AIzaSyBZwPV0TkgFxC8omWmasPmEIRyuks34_D0`
3. Haz clic en **"Add"**

### Paso 5: Deploy
1. Haz clic en **"Deploy"**
2. Espera 1-2 minutos mientras Vercel construye tu aplicación
3. ¡Listo! Tu app estará disponible en una URL como:
   **https://alcalde-digital-xxx.vercel.app**

---

## 💻 Opción 2: Deploy desde la Terminal

### Paso 1: Login en Vercel
```bash
vercel login
```
- Se abrirá tu navegador
- Ingresa el código que aparece en la terminal
- Autoriza la aplicación

### Paso 2: Deploy
```bash
vercel --prod
```
- Responde las preguntas:
  - **Set up and deploy?** → `Y`
  - **Which scope?** → Selecciona tu cuenta
  - **Link to existing project?** → `N`
  - **What's your project's name?** → `alcalde-digital` (o el que prefieras)
  - **In which directory is your code located?** → `./` (presiona Enter)
  - **Want to override the settings?** → `N`

### Paso 3: Configurar la API Key
```bash
vercel env add GEMINI_API_KEY
```
- Pega tu API key: `AIzaSyBZwPV0TkgFxC8omWmasPmEIRyuks34_D0`
- Selecciona: **Production**, **Preview**, **Development** (todas)

### Paso 4: Re-deploy con la variable
```bash
vercel --prod
```

---

## 🔄 Deploy Automático

Una vez configurado, Vercel hará deploy automático cada vez que hagas `git push` a GitHub.

### Configurar deploy automático:
1. Ve a tu proyecto en: **https://vercel.com/dashboard**
2. Haz clic en tu proyecto **"alcalde-digital"**
3. Ve a **Settings** → **Git**
4. Asegúrate de que **"Production Branch"** esté en `main`
5. ✅ Cada push a `main` = deploy automático

---

## 📝 Ventajas de Vercel vs GitHub Pages

| Característica | Vercel | GitHub Pages |
|----------------|--------|--------------|
| Velocidad de deploy | ⚡ 1-2 min | 🐌 3-5 min |
| HTTPS automático | ✅ Sí | ✅ Sí |
| Variables de entorno | ✅ UI fácil | ⚠️ Secretos de GitHub |
| Dominio personalizado | ✅ Gratis | ✅ Gratis |
| Analytics | ✅ Incluido | ❌ No |
| Deploy automático | ✅ Sí | ✅ Sí |

---

## 🌐 URLs de tu aplicación

Después del deploy, tendrás:
- **URL de producción**: `https://alcalde-digital.vercel.app`
- **URL de preview**: Se genera automáticamente para cada PR
- **Dominio personalizado**: Puedes configurar `daganzo.es` o similar

---

## 🆘 Solución de problemas

### Error: "The specified token is not valid"
- Ejecuta: `vercel logout`
- Luego: `vercel login`
- Intenta de nuevo

### Error: "Build failed"
- Verifica que `npm run build` funcione localmente
- Revisa los logs en el dashboard de Vercel

### La app no carga
- Verifica que la variable `GEMINI_API_KEY` esté configurada
- Ve a **Settings** → **Environment Variables**
- Haz un nuevo deploy: `vercel --prod --force`

---

## ✅ Recomendación

**Usa Vercel desde la web (Opción 1)** - Es más fácil y visual.
