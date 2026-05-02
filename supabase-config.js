// Supabase Configuration
const SUPABASE_URL = 'https://jxmnfyqaivtkhqnjyzip.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4bW5meXFhaXZ0a2hxbmp5emlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2ODk5MjEsImV4cCI6MjA5MzI2NTkyMX0.ujCYohv5siF-tDoOKDWXdyr8_eOX_k-ei6jNym0z9rI';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fetchCMS() {
    try {
        const { data, error } = await supabaseClient
            .from('site_content')
            .select('data')
            .eq('id', 1)
            .single();

        if (error) throw error;
        return data.data;
    } catch (err) {
        console.error('Error fetching CMS from Supabase:', err);
        return null;
    }
}

async function updateCMS(newData) {
    try {
        const { error } = await supabaseClient
            .from('site_content')
            .upsert({ id: 1, data: newData, updated_at: new Date() });

        if (error) throw error;
        return { success: true };
    } catch (err) {
        console.error('Error updating CMS in Supabase:', err);
        return { success: false, message: err.message || 'Unknown error' };
    }
}
