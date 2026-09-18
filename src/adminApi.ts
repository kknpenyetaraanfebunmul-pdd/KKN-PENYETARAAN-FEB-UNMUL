import { supabase } from './lib/supabase';

export const ADMIN_SESSION_KEY = 'kkn-admin-session';

export async function verifyPasscode(passcode: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('verify_admin_passcode', {
    input_passcode: passcode,
  });
  if (error) {
    console.error('Passcode verification error:', error);
    return false;
  }
  return data === true;
}

export function isAdminLoggedIn(): boolean {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
}

export function setAdminLoggedIn(value: boolean) {
  if (value) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
  } else {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  }
}

// ---- Site settings (hero, footer) ----

export async function saveSetting(section: string, data: unknown, passcode: string): Promise<void> {
  const { error } = await supabase.rpc('admin_upsert_setting', {
    p_passcode: passcode,
    p_section: section,
    p_data: data,
  });
  if (error) throw new Error(error.message);
}

// ---- Struktur ----

export async function upsertStruktur(
  passcode: string,
  values: { jabatan: string; deskripsi: string; urutan: number },
  id?: string
): Promise<string> {
  const { data, error } = await supabase.rpc('admin_upsert_struktur', {
    p_passcode: passcode,
    p_jabatan: values.jabatan,
    p_deskripsi: values.deskripsi,
    p_urutan: values.urutan,
    p_id: id ?? null,
  });
  if (error) throw new Error(error.message);
  return data as string;
}

// ---- Program Kerja ----

export async function upsertProgram(
  passcode: string,
  values: {
    key: string;
    icon: string;
    judul: string;
    subjudul: string;
    deskripsi_lengkap: string;
    kegiatan: string[];
    info: { sasaran: string; jadwal: string; lokasi: string; target: string };
    urutan: number;
  },
  id?: string
): Promise<string> {
  const { data, error } = await supabase.rpc('admin_upsert_program', {
    p_passcode: passcode,
    p_key: values.key,
    p_icon: values.icon,
    p_judul: values.judul,
    p_subjudul: values.subjudul,
    p_deskripsi_lengkap: values.deskripsi_lengkap,
    p_kegiatan: values.kegiatan,
    p_info: values.info,
    p_urutan: values.urutan,
    p_id: id ?? null,
  });
  if (error) throw new Error(error.message);
  return data as string;
}

// ---- Gallery ----

export async function upsertGallery(
  passcode: string,
  values: { tipe: string; url: string; judul: string; deskripsi: string; urutan: number },
  id?: string
): Promise<string> {
  const { data, error } = await supabase.rpc('admin_upsert_gallery', {
    p_passcode: passcode,
    p_tipe: values.tipe,
    p_url: values.url,
    p_judul: values.judul,
    p_deskripsi: values.deskripsi,
    p_urutan: values.urutan,
    p_id: id ?? null,
  });
  if (error) throw new Error(error.message);
  return data as string;
}

// ---- Contact ----

export async function upsertContact(
  passcode: string,
  values: { platform: string; value: string; url: string; urutan: number },
  id?: string
): Promise<string> {
  const { data, error } = await supabase.rpc('admin_upsert_contact', {
    p_passcode: passcode,
    p_platform: values.platform,
    p_value: values.value,
    p_url: values.url,
    p_urutan: values.urutan,
    p_id: id ?? null,
  });
  if (error) throw new Error(error.message);
  return data as string;
}

// ---- Partners ----

export async function upsertPartner(
  passcode: string,
  values: { grup: string; nama: string; logo_url: string; urutan: number },
  id?: string
): Promise<string> {
  const { data, error } = await supabase.rpc('admin_upsert_partner', {
    p_passcode: passcode,
    p_grup: values.grup,
    p_nama: values.nama,
    p_logo_url: values.logo_url,
    p_urutan: values.urutan,
    p_id: id ?? null,
  });
  if (error) throw new Error(error.message);
  return data as string;
}

// ---- Generic delete ----

export async function deleteRow(passcode: string, table: string, id: string): Promise<void> {
  const { error } = await supabase.rpc('admin_delete_row', {
    p_passcode: passcode,
    p_table: table,
    p_id: id,
  });
  if (error) throw new Error(error.message);
}
