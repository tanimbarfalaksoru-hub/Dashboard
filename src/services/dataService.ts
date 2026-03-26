/// <reference types="vite/client" />
import { Users, UserCheck, Home, TrendingUp, FileText, HeartPulse, Briefcase, GraduationCap } from 'lucide-react';

// Fallback mock data in case the API fails or is not configured
export const FALLBACK_DATA = {
  summary: [
    { label: "Total Penduduk", value: 134293, iconName: "Users", color: "bg-blue-500" },
    { label: "Laki-laki", value: 67314, iconName: "UserCheck", color: "bg-indigo-500" },
    { label: "Perempuan", value: 66979, iconName: "UserCheck", color: "bg-pink-500" },
    { label: "Kepala Keluarga", value: 38439, iconName: "Home", color: "bg-emerald-500" },
    { label: "Usia Produktif", value: 87481, iconName: "TrendingUp", color: "bg-amber-500" },
    { label: "CBR", value: 5.46, iconName: "HeartPulse", color: "bg-rose-500" },
    { label: "GFR", value: 20.17, iconName: "HeartPulse", color: "bg-rose-600" },
    { label: "CDR", value: 5.44, iconName: "HeartPulse", color: "bg-rose-700" },
    { label: "Kelahiran", value: 728, iconName: "Users", color: "bg-teal-500" },
    { label: "Migrasi Masuk", value: 4464, iconName: "TrendingUp", color: "bg-emerald-500" },
    { label: "Migrasi Keluar", value: 8033, iconName: "TrendingUp", color: "bg-orange-500" },
    { label: "Pertumbuhan", value: 1.46, iconName: "TrendingUp", color: "bg-blue-600" },
  ],
  kecamatan: [
    { name: "Tanimbar Selatan", value: 40253, density: 49, sexRatio: 100, growth: 1.69, gfr: 22.01, cbr: 6.23, cdr: 6.31, kawinRate: 11.04, in: 46, out: 72 },
    { name: "Selaru", value: 15853, density: 19, sexRatio: 100, growth: 1.18, gfr: 16.51, cbr: 4.39, cdr: 4.64, kawinRate: 5.8, in: 24, out: 53 },
    { name: "Tanimbar Utara", value: 15257, density: 18, sexRatio: 99, growth: 1.04, gfr: 15.81, cbr: 4.29, cdr: 5.21, kawinRate: 5.5, in: 28, out: 51 },
    { name: "Wermaktian", value: 14524, density: 5, sexRatio: 104, growth: 1.23, gfr: 15.7, cbr: 4.29, cdr: 2.42, kawinRate: 5.2, in: 21, out: 41 },
    { name: "Wertamrian", value: 12478, density: 10, sexRatio: 98, growth: 1.38, gfr: 21.44, cbr: 5.55, cdr: 7.56, kawinRate: 5.9, in: 36, out: 74 },
    { name: "Wuarlabobar", value: 9572, density: 16, sexRatio: 106, growth: 2.56, gfr: 13.59, cbr: 3.68, cdr: 5.15, kawinRate: 5.1, in: 41, out: 62 },
    { name: "Nirunmas", value: 8922, density: 9, sexRatio: 98, growth: 1.96, gfr: 32.31, cbr: 8.37, cdr: 3.51, kawinRate: 6.2, in: 27, out: 39 },
    { name: "Kormomolin", value: 8073, density: 9, sexRatio: 101, growth: 1.55, gfr: 21.78, cbr: 5.43, cdr: 8.4, kawinRate: 6.5, in: 27, out: 59 },
    { name: "Fordata", value: 5142, density: 65, sexRatio: 99, growth: -1.11, gfr: 18.5, cbr: 4.67, cdr: 3.5, kawinRate: 5.6, in: 28, out: 85 },
    { name: "Molu Maru", value: 4219, density: 66, sexRatio: 101, growth: 2.06, gfr: 33.51, cbr: 8.94, cdr: 6.52, kawinRate: 2.66, in: 15, out: 37 }
  ],
  pendidikan: [
    { name: "Tidak Sekolah", value: 21753 },
    { name: "SD", value: 23032 },
    { name: "SLTP", value: 21171 },
    { name: "SLTA", value: 39396 },
    { name: "Diploma", value: 2165 },
    { name: "S1", value: 7254 },
    { name: "S2/S3", value: 256 },
  ],
  pekerjaan: [
    { name: "Pelajar", value: 39887 },
    { name: "Tidak Bekerja", value: 36787 },
    { name: "Petani", value: 29925 },
    { name: "URT", value: 9324 },
    { name: "Nelayan", value: 3087 },
    { name: "Wiraswasta", value: 3887 },
    { name: "PNS", value: 2587 },
    { name: "Lainnya", value: 8816 },
  ],
  agama: [
    { name: "Kristen", value: 82331 },
    { name: "Katolik", value: 44220 },
    { name: "Islam", value: 7683 },
    { name: "Lainnya", value: 59 },
  ],
  dokumen: [
    { name: "KK", value: 95.10 },
    { name: "KTP-El", value: 92.96 },
    { name: "KIA", value: 23.51 },
    { name: "Akta 0-17", value: 98.84 },
    { name: "Akta 0-5", value: 97.38 },
    { name: "Akta Semua", value: 60.74 },
    { name: "Akta Nikah", value: 71.40 },
  ]
};

const ICON_MAP: Record<string, any> = {
  Users, UserCheck, Home, TrendingUp, FileText, HeartPulse, Briefcase, GraduationCap
};

// URL Web App dari Google Apps Script (Ganti dengan URL Anda nanti)
const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || "";

export async function fetchDashboardData() {
  if (!APPS_SCRIPT_URL) {
    console.log("Menggunakan data lokal (Apps Script URL belum diatur)");
    return mapIcons(FALLBACK_DATA);
  }

  try {
    const response = await fetch(APPS_SCRIPT_URL);
    if (!response.ok) throw new Error("Gagal mengambil data dari Apps Script");
    
    const data = await response.json();
    return mapIcons(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    console.log("Jatuh kembali ke data lokal");
    return mapIcons(FALLBACK_DATA);
  }
}

function mapIcons(data: any) {
  if (!data.summary) return data;
  
  return {
    ...data,
    summary: data.summary.map((item: any) => ({
      ...item,
      icon: ICON_MAP[item.iconName] || Users
    }))
  };
}
