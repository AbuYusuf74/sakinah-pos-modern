import { supabase } from '../supabaseClient'

// GET DATA
export async function getBarang() {
  const { data, error } = await supabase
    .from('Barang')
    .select('*')
    .order('id', { ascending: false })

  if (error) throw error
  return data
}

// INSERT
export async function addBarang(barang) {
  const { error } = await supabase
    .from('Barang')
    .insert([barang])

  if (error) throw error
}

// UPDATE
export async function updateBarang(id, barang) {
  const { error } = await supabase
    .from('Barang')
    .update(barang)
    .eq('id', id)

  if (error) throw error
}

// DELETE
export async function deleteBarang(id) {
  const { error } = await supabase
    .from('Barang')
    .delete()
    .eq('id', id)

  if (error) throw error
}