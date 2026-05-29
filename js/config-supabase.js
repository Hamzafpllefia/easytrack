// ============================================
// CONFIGURACIÓN DE SUPABASE
// ============================================

const SUPABASE_URL = 'https://djhyplvznakxaayskaju.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqaHlwbHZ6bmFreGFheXNrYWp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDcwODYsImV4cCI6MjA5NTMyMzA4Nn0.FshawGDh4_m9gCz8NnX1i9npZizaD_9KxvD406q_cnc';

// Inicializar Supabase
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Exportar para uso en otros archivos
window.supabaseClient = supabaseClient;
console.log('✅ Supabase configurado correctamente');
