import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
// 🔑 Replace with your project values from Supabase dashboard → Project Settings → API
const SUPABASE_URL = "https://yehxgeybjfnsdvgyzjiy.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllaHhnZXliamZuc2R2Z3l6aml5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4ODQ3OTQsImV4cCI6MjA3MjQ2MDc5NH0.85_pLRpCmUQjalNvsY7wXdn_-Vhutz1ysJaNvKJcvs4"

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
