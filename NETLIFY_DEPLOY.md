# Deploy en Netlify - Instrucciones

## 🚀 Pasos para Deploy en Netlify

### 1. Ir a Netlify
Abre tu navegador y ve a: **https://app.netlify.com**

### 2. Iniciar sesión
- Haz clic en **"Sign up"** o **"Log in"**
- Selecciona **"GitHub"** para iniciar sesión con tu cuenta de GitHub
- Autoriza Netlify para acceder a tus repositorios

### 3. Importar el proyecto
1. Una vez dentro, haz clic en **"Add new site"** → **"Import an existing project"**
2. Selecciona **"Deploy with GitHub"**
3. Busca y selecciona el repositorio: **"Risego2000/AlcaldeDigital"**
4. Haz clic en el repositorio para seleccionarlo

### 4. Configurar el build
Netlify detectará automáticamente la configuración desde `netlify.toml`:
- ✅ **Build command**: `npm run build` (ya configurado)
- ✅ **Publish directory**: `dist` (ya configurado)
- ✅ **Node version**: 20 (ya configurado)

### 5. Configurar Variables de Entorno
**IMPORTANTE:** Antes de hacer deploy, configura la API key:

1. Haz clic en **"Show advanced"** o **"Advanced build settings"**
2. En la sección **"Environment variables"**, haz clic en **"New variable"**
3. Añade:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: `AIzaSyBZwPV0TkgFxC8omWmasPmEIRyuks34_D0`
4. Haz clic en **"Add"**

### 6. Deploy
1. Haz clic en **"Deploy site"** o **"Deploy [nombre-del-sitio]"**
2. Espera 2-3 minutos mientras Netlify construye tu aplicación
3. ¡Listo! Tu app estará disponible en una URL como:
   **https://alcalde-digital.netlify.app**

---

## 🔄 Deploy Automático

Una vez configurado, Netlify hará deploy automático cada vez que hagas `git push` a GitHub.

---

## 🌐 Configurar Dominio Personalizado (Opcional)

1. Ve a **Site settings** → **Domain management**
2. Haz clic en **"Add custom domain"**
3. Ingresa tu dominio (ej: `daganzo.es`)
4. Sigue las instrucciones para configurar los DNS

---

## 📊 Ventajas de Netlify

| Característica | Netlify |
|----------------|---------|
| Deploy automático | ✅ Sí |
| HTTPS automático | ✅ Sí |
| Variables de entorno | ✅ Fácil configuración |
| Dominio personalizado | ✅ Gratis |
| Analytics | ✅ Disponible |
| Formularios | ✅ Incluido |
| Functions | ✅ Serverless functions |

---

## 🆘 Solución de problemas

### La página está en blanco
1. Ve a **Deploys** → Último deploy → **Deploy log**
2. Verifica que no haya errores en el build
3. Asegúrate de que la variable `GEMINI_API_KEY` esté configurada
4. Ve a **Site settings** → **Environment variables** para verificar

### Error en el build
1. Verifica que `npm run build` funcione localmente
2. Revisa los logs del deploy en Netlify
3. Asegúrate de que todas las dependencias estén en `package.json`

### La app no carga el avatar
1. Verifica que `public/Manuel.png` exista en el repositorio
2. Haz un nuevo deploy: **Deploys** → **Trigger deploy** → **Deploy site**

---

## ✅ Checklist Final

Antes de hacer deploy, verifica:
- ✅ `netlify.toml` está en el repositorio
- ✅ `public/Manuel.png` existe
- ✅ Variable `GEMINI_API_KEY` configurada
- ✅ `npm run build` funciona localmente

---

## 🎯 URL Final

Tu aplicación estará disponible en:
**https://[nombre-aleatorio].netlify.app**

Puedes cambiar el nombre en: **Site settings** → **Site details** → **Change site name**

---

¡Listo! Ahora sigue estos pasos y tu aplicación estará en línea en Netlify. 🚀
