import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export async function generateNarrative(section: string, data: any) {
  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing. Please set it in your environment variables.");
    return "⚠️ **Konfigurasi API Key Hilang**\n\nSistem tidak dapat menghasilkan analisis karena `GEMINI_API_KEY` belum dikonfigurasi di server (Cloudflare). Silakan tambahkan API Key pada pengaturan Environment Variables di Cloudflare Pages Anda dan lakukan deploy ulang.";
  }

  try {
    const prompt = `
      Anda adalah seorang ahli demografi senior dan analis data strategis profesional. 
      Tugas Anda adalah memberikan analisis data yang KOMPREHENSIF, MENDETAIL, dan STRATEGIS berdasarkan data berikut untuk bagian "${section}".
      
      Data: ${JSON.stringify(data)}
      
      Struktur Analisis yang Diharapkan:
      1. Ringkasan Eksekutif: Gambaran umum tentang apa yang ditunjukkan oleh data.
      2. Analisis Mendalam: Bedah data secara mendetail, hubungkan antar variabel jika memungkinkan (misalnya hubungan kepadatan dengan migrasi, atau pendidikan dengan pekerjaan).
      3. Identifikasi Tren & Anomali: Jelaskan pola yang muncul dan poin data yang tidak biasa.
      4. Implikasi & Rekomendasi: Apa dampak dari data ini bagi pembangunan daerah dan saran kebijakan konkret apa yang bisa diambil.
      
      Bahasa: Gunakan bahasa Indonesia yang formal, berwibawa, namun tetap mengalir dan menarik untuk dibaca oleh pengambil keputusan.
      Format: Gunakan paragraf yang terstruktur dengan baik. Anda boleh menggunakan poin-poin untuk rekomendasi.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text || "Gagal memuat narasi AI.";
  } catch (error) {
    console.error("AI Narrative Error:", error);
    return "Maaf, sistem AI sedang sibuk. Silakan coba lagi nanti.";
  }
}
