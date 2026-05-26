var radioEmail = document.getElementById('email');
var radioWhatsapp = document.getElementById('whatsapp');

var contenedorEmail = document.querySelector('.email');
var contenedorWhatsapp = document.querySelector('.whatsapp');

radioEmail.addEventListener('change', function() {
    contenedorEmail.classList.add('selected');
    contenedorWhatsapp.classList.remove('selected');
});

radioWhatsapp.addEventListener('change', function() {
    contenedorWhatsapp.classList.add('selected');
    contenedorEmail.classList.remove('selected');
});

// ============================================
// BOTÓN DE LOGIN
// ============================================
const loginBtn = document.getElementById('login-btn');
const userProfile = document.getElementById('user-profile');
const userEmail = document.getElementById('user-email');
const avatar = document.getElementById('avatar');
const userMenu = document.getElementById('user-menu');
const logoutBtn = document.getElementById('logout-btn');

if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        window.location.href = 'login.html';
    });
}

// ============================================
// MOSTRAR PERFIL DEL USUARIO LOGUEADO
// ============================================
async function checkUserSession() {
    try {
        // Importar Supabase (si está disponible)
        if (typeof window.supabase !== 'undefined') {
            const { data: { user } } = await window.supabase.auth.getUser();
            
            if (user) {
                // El usuario está logueado
                loginBtn.style.display = 'none';
                userProfile.style.display = 'flex';
                
                // Mostrar email
                userEmail.textContent = user.email || user.user_metadata?.email || 'Usuario';
                
                // Obtener nombre del usuario
                const nombre = user.user_metadata?.nombre || user.email?.split('@')[0] || 'U';
                
                // Crear iniciales (primeras 2 letras)
                const iniciales = nombre
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase())
                    .slice(0, 2)
                    .join('');
                
                // Mostrar en avatar
                avatar.textContent = iniciales || 'U';
                
                // Click en avatar para abrir menú
                avatar.addEventListener('click', () => {
                    if (userMenu.style.display === 'none') {
                        userMenu.style.display = 'block';
                    } else {
                        userMenu.style.display = 'none';
                    }
                });
                
                // Cerrar sesión
                logoutBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    
                    try {
                        await window.supabase.auth.signOut();
                        localStorage.removeItem('user');
                        window.location.href = 'index.html';
                    } catch (err) {
                        console.error('Error al cerrar sesión:', err);
                        alert('Error al cerrar sesión');
                    }
                });
                
                // Cerrar menú al hacer click fuera
                document.addEventListener('click', (e) => {
                    if (!avatar.contains(e.target) && !userMenu.contains(e.target)) {
                        userMenu.style.display = 'none';
                    }
                });
            } else {
                // No está logueado, mostrar botón de login
                loginBtn.style.display = 'block';
                userProfile.style.display = 'none';
            }
        }
    } catch (err) {
        console.error('Error al verificar sesión:', err);
    }
}

// Verificar sesión cuando carga la página
document.addEventListener('DOMContentLoaded', checkUserSession);
