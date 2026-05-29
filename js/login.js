// ============================================
// LOGIN.JS — Lógica completa de autenticación
// ============================================

document.addEventListener('DOMContentLoaded', async () => {

    const sb = window.supabaseClient;

    // --- Elementos del DOM ---
    const loginForm       = document.getElementById('login-form');
    const registerForm    = document.getElementById('register-form');
    const btnGoogle       = document.getElementById('btn-google');
    const btnShowRegister = document.getElementById('btn-show-register');
    const btnShowLogin    = document.getElementById('btn-show-login');
    const errorMsg        = document.getElementById('error-message');
    const successMsg      = document.getElementById('success-message');
    const loginTitle      = document.getElementById('login-title');
    const loginSubtitle   = document.getElementById('login-subtitle');

    // ── Si ya hay sesión activa, redirigir directamente ──────────────
    const { data: { session } } = await sb.auth.getSession();
    if (session) {
        window.location.href = 'index.html';
        return;
    }

    // ── Utilidades ───────────────────────────────────────────────────
    function showError(msg) {
        errorMsg.textContent  = msg;
        errorMsg.style.display = 'block';
        successMsg.style.display = 'none';
    }

    function showSuccess(msg) {
        successMsg.textContent  = msg;
        successMsg.style.display = 'block';
        errorMsg.style.display  = 'none';
    }

    function hideMessages() {
        errorMsg.style.display   = 'none';
        successMsg.style.display = 'none';
    }

    function setLoading(btn, loading) {
        btn.disabled = loading;
        btn.textContent = loading ? 'Cargando...' : btn.dataset.label;
    }

    // ── Alternar entre Login y Registro ──────────────────────────────
    btnShowRegister?.addEventListener('click', (e) => {
        e.preventDefault();
        hideMessages();
        loginForm.style.display    = 'none';
        registerForm.style.display = 'block';
        loginTitle.textContent    = 'Crear Cuenta';
        loginSubtitle.textContent = 'Únete a EasyTrack gratis';
        btnShowRegister.parentElement.style.display = 'none';
        btnShowLogin.parentElement.style.display    = 'block';
    });

    btnShowLogin?.addEventListener('click', (e) => {
        e.preventDefault();
        hideMessages();
        registerForm.style.display = 'none';
        loginForm.style.display    = 'block';
        loginTitle.textContent    = 'Iniciar Sesión';
        loginSubtitle.textContent = 'Accede a tu cuenta de EasyTrack';
        btnShowLogin.parentElement.style.display    = 'none';
        btnShowRegister.parentElement.style.display = 'block';
    });

    // ── INICIAR SESIÓN ───────────────────────────────────────────────
    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideMessages();

        const email    = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        const submitBtn = loginForm.querySelector('button[type="submit"]');

        if (!email || !password) {
            showError('Por favor, rellena todos los campos.');
            return;
        }

        setLoading(submitBtn, true);

        const { data, error } = await sb.auth.signInWithPassword({ email, password });

        setLoading(submitBtn, false);

        if (error) {
            // Traducir errores comunes al español
            const errores = {
                'Invalid login credentials':       'Email o contraseña incorrectos.',
                'Email not confirmed':              'Confirma tu correo electrónico antes de entrar.',
                'Too many requests':               'Demasiados intentos. Espera un momento.',
            };
            showError(errores[error.message] || error.message);
            return;
        }

        if (data.user) {
            window.location.href = 'index.html';
        }
    });

    // ── CREAR CUENTA ─────────────────────────────────────────────────
    registerForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideMessages();

        const nombre    = document.getElementById('reg-nombre').value.trim();
        const email     = document.getElementById('reg-email').value.trim();
        const password  = document.getElementById('reg-password').value;
        const password2 = document.getElementById('reg-password2').value;
        const submitBtn = registerForm.querySelector('button[type="submit"]');

        if (!nombre || !email || !password || !password2) {
            showError('Por favor, rellena todos los campos.');
            return;
        }
        if (password !== password2) {
            showError('Las contraseñas no coinciden.');
            return;
        }
        if (password.length < 6) {
            showError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        setLoading(submitBtn, true);

        const { data, error } = await sb.auth.signUp({
            email,
            password,
            options: {
                data: { nombre }   // guarda el nombre en user_metadata
            }
        });

        if (error) {
            setLoading(submitBtn, false);
            const errores = {
                'User already registered': 'Ya existe una cuenta con ese correo.',
                'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres.',
            };
            showError(errores[error.message] || error.message);
            return;
        }

        // Insertar perfil en la tabla profiles
        if (data.user) {
            const { error: profileError } = await sb
                .from('profiles')
                .insert({
                    id:     data.user.id,
                    email:  email,
                    nombre: nombre,
                });

            if (profileError) {
                // Si ya existe el perfil (por ejemplo si se repite) no es error crítico
                console.warn('Perfil ya existente o error al insertar:', profileError.message);
            }
        }

        setLoading(submitBtn, false);

        showSuccess('¡Cuenta creada! Revisa tu correo y confirma tu cuenta para poder iniciar sesión.');
        registerForm.reset();
    });

    // ── GOOGLE OAUTH ─────────────────────────────────────────────────
    btnGoogle?.addEventListener('click', async () => {
        hideMessages();
        const { error } = await sb.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/index.html'
            }
        });
        if (error) {
            showError('Error al conectar con Google: ' + error.message);
        }
    });

});
