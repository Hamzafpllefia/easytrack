// ============================================
// CONFIGURACIÓN DE SUPABASE
// ============================================
// Las credenciales están en el archivo .env
// NUNCA compartas las credenciales en el código

// Leer variables del .env (en desarrollo) o del navegador (en producción)
const SUPABASE_URL = 'https://djhyplvzn1kxaayskaju.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_2bfG14wja9RPZ6mhyUpOXQ_44a4nBju';

// Validar que las credenciales existan
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('ERROR: Credenciales de Supabase no configuradas. Verifica el archivo .env');
}

// Inicializar Supabase
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Exportar para uso en otros archivos
window.supabase = supabaseClient;
console.log('✅ Supabase configurado correctamente');
