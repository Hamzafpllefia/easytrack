// ============================================
// INDEX.JS — Lógica de la página principal
// ============================================

// ── Selector de método de seguimiento ──────────────────────────────
const radioEmail    = document.getElementById('email');
const radioWhatsapp = document.getElementById('whatsapp');
const contenedorEmail    = document.querySelector('.email');
const contenedorWhatsapp = document.querySelector('.whatsapp');

if (radioEmail) {
    radioEmail.addEventListener('change', function () {
        contenedorEmail.classList.add('selected');
        contenedorWhatsapp.classList.remove('selected');
    });
}

if (radioWhatsapp) {
    radioWhatsapp.addEventListener('change', function () {
        contenedorWhatsapp.classList.add('selected');
        contenedorEmail.classList.remove('selected');
    });
}

// ── Referencias del header ──────────────────────────────────────────
const loginBtn   = document.getElementById('login-btn');
const userProfile = document.getElementById('user-profile');
const userEmail  = document.getElementById('user-email');
const avatar     = document.getElementById('avatar');
const userMenu   = document.getElementById('user-menu');
const logoutBtn  = document.getElementById('logout-btn');

if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        window.location.href = 'login.html';
    });
}

// ── Verificar sesión activa ─────────────────────────────────────────
async function checkUserSession() {
    try {
        const sb = window.supabaseClient;
        if (!sb) return;

        const { data: { user } } = await sb.auth.getUser();

        if (user) {
            // Ocultar botón de login, mostrar perfil
            if (loginBtn)    loginBtn.style.display    = 'none';
            if (userProfile) userProfile.style.display = 'flex';

            // Email del usuario
            if (userEmail) {
                userEmail.textContent = user.email || 'Usuario';
            }

            // Iniciales del avatar
            const nombre = user.user_metadata?.nombre
                        || user.email?.split('@')[0]
                        || 'U';

            const iniciales = nombre
                .split(' ')
                .map(w => w.charAt(0).toUpperCase())
                .slice(0, 2)
                .join('');

            if (avatar) {
                avatar.textContent = iniciales || 'U';

                // Abrir / cerrar menú al hacer clic en el avatar
                avatar.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const visible = userMenu.style.display === 'block';
                    userMenu.style.display = visible ? 'none' : 'block';
                });
            }

            // Cerrar sesión desde el menú
            if (logoutBtn) {
                logoutBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    try {
                        await sb.auth.signOut();
                    } catch (err) {
                        console.error('Error al cerrar sesión:', err);
                    } finally {
                        window.location.href = 'index.html';
                    }
                });
            }

            // Cerrar menú al hacer clic fuera
            document.addEventListener('click', (e) => {
                if (avatar && userMenu &&
                    !avatar.contains(e.target) &&
                    !userMenu.contains(e.target)) {
                    userMenu.style.display = 'none';
                }
            });

        } else {
            // No hay sesión: mostrar botón de login
            if (loginBtn)    loginBtn.style.display    = 'block';
            if (userProfile) userProfile.style.display = 'none';
        }
    } catch (err) {
        console.error('Error al verificar sesión:', err);
    }
}

document.addEventListener('DOMContentLoaded', checkUserSession);
