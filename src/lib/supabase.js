import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rypthbrmgenhgxgjgvme.supabase.co'
const supabaseKey = 'sb_publishable_8tTNXzQ80B_hmJtUjUHCeQ_o-2xf4-7'

export const supabase = createClient(supabaseUrl, supabaseKey)