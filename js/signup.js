// ============================================
// LÓGICA DE REGISTRO
// ============================================

// Elementos del DOM
const signupForm = document.getElementById('signup-form');
const fullnameInput = document.getElementById('fullname');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const passwordConfirmInput = document.getElementById('password-confirm');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');
const btnGoogle = document.getElementById('btn-google');

// Limpiar mensajes
function clearMessages() {
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
    successMessage.textContent = '';
    successMessage.style.display = 'none';
}

// Mostrar mensaje de error
function showError(message) {
    clearMessages();
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

// Mostrar mensaje de éxito
function showSuccess(message) {
    clearMessages();
    successMessage.textContent = message;
    successMessage.style.display = 'block';
}

// Validar contraseña
function validatePassword(password) {
    if (password.length < 6) {
        return 'La contraseña debe tener al menos 6 caracteres';
    }
    return null;
}

// Manejar registro
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fullname = fullnameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;
    
    // Validar campos
    if (!fullname || !email || !password || !passwordConfirm) {
        showError('Por favor completa todos los campos');
        return;
    }
    
    // Validar contraseña
    const passwordError = validatePassword(password);
    if (passwordError) {
        showError(passwordError);
        return;
    }
    
    // Validar que las contraseñas coincidan
    if (password !== passwordConfirm) {
        showError('Las contraseñas no coinciden');
        return;
    }
    
    try {
        // Mostrar estado de carga
        const button = signupForm.querySelector('button[type="submit"]');
        const originalText = button.textContent;
        button.textContent = 'Creando cuenta...';
        button.disabled = true;
        
        // Verificar conectividad
        if (!navigator.onLine) {
            button.textContent = originalText;
            button.disabled = false;
            showError('No hay conexión a internet. Verifica tu conexión y intenta de nuevo.');
            return;
        }
        
        console.log('Intentando registrar:', email);
        
        // Intentar registro
        const { data, error } = await window.supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: fullname
                }
            }
        });
        
        button.textContent = originalText;
        button.disabled = false;
        
        if (error) {
            console.error('Error de registro completo:', error);
            console.error('Mensaje:', error.message);
            console.error('Status:', error.status);
            
            if (error.message.includes('already registered')) {
                showError('Este email ya está registrado');
            } else if (error.message.includes('Invalid email')) {
                showError('Email inválido');
            } else if (error.message.includes('Failed to fetch')) {
                showError('Error de conexión con el servidor. Verifica tu conexión a internet e intenta de nuevo.');
            } else if (error.message.includes('User already exists')) {
                showError('Este email ya está registrado');
            } else {
                showError(`Error: ${error.message || 'Error desconocido'}`);
            }
            return;
        }
        
        if (data.user) {
            console.log('✅ Registro exitoso:', data.user.email);
            
            // Mostrar mensaje de éxito
            showSuccess('¡Cuenta creada exitosamente! Verifica tu email para confirmar tu cuenta. Luego podrás iniciar sesión.');
            
            // Limpiar formulario
            signupForm.reset();
            
            // Redirigir a login después de 3 segundos
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 3000);
        }
        
    } catch (error) {
        console.error('Error inesperado:', error);
        showError('Ocurrió un error inesperado. Intenta de nuevo.');
    }
});

// Manejar registro con Google
btnGoogle.addEventListener('click', async () => {
    try {
        btnGoogle.disabled = true;
        btnGoogle.textContent = 'Conectando con Google...';
        
        const { data, error } = await window.supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/login.html'
            }
        });
        
        if (error) {
            console.error('Error con Google:', error);
            showError('Error al conectar con Google. Intenta de nuevo.');
            btnGoogle.disabled = false;
            btnGoogle.textContent = 'Registrarse con Google';
        }
        
    } catch (error) {
        console.error('Error inesperado con Google:', error);
        showError('Ocurrió un error inesperado.');
        btnGoogle.disabled = false;
        btnGoogle.textContent = 'Registrarse con Google';
    }
});

// Verificar si ya hay sesión activa
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const { data: { session } } = await window.supabase.auth.getSession();
        if (session) {
            console.log('Ya hay sesión activa, redirigiendo...');
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Error al verificar sesión:', error);
    }
});

console.log('✅ Signup.js cargado correctamente');
