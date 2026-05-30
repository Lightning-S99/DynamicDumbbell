/* ═══════════════════════════════════════════
   DYNAMIC DUMBBELL — Backend Sunucusu
   Express
   ═══════════════════════════════════════════ */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Statik Dosyalar (Frontend) ──
app.use(express.static(path.join(__dirname)));

// ══════════════════════════════════════
// API ENDPOINT: POST /api/preorder
// ══════════════════════════════════════
app.post('/api/preorder', async (req, res) => {
    try {
        const { firstName, lastName, email } = req.body;

        // ── Sunucu tarafı doğrulama ──
        if (!firstName || !lastName || !email) {
            return res.status(400).json({
                success: false,
                message: 'Tüm alanlar zorunludur (firstName, lastName, email).'
            });
        }

        if (firstName.trim().length < 2 || lastName.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: 'İsim ve soyisim en az 2 karakter olmalıdır.'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({
                success: false,
                message: 'Geçerli bir e-posta adresi giriniz.'
            });
        }

        // Sadece arayüz (UI) simülasyonu için başarılı yanıt dön (Mail gönderme iptal edildi)
        console.log(`✅ Ön sipariş alındı (Sadece UI Testi - Mail gönderilmedi): ${firstName} ${lastName} - ${email}`);

        // İşlemin başarıyla tamamlandığını simüle etmek için kısa bir gecikme eklenebilir
        setTimeout(() => {
            res.json({
                success: true,
                message: 'Ön sipariş başarıyla oluşturuldu.',
            });
        }, 500);

    } catch (error) {
        console.error('❌ Sipariş hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası oluştu.',
        });
    }
});

// ══════════════════════════════════════
// SUNUCU BAŞLAT
// ══════════════════════════════════════
app.listen(PORT, () => {
    console.log('');
    console.log('═══════════════════════════════════════════');
    console.log('  🏋️ Dynamic Dumbbell Backend Sunucusu');
    console.log('═══════════════════════════════════════════');
    console.log(`  🌐 Frontend : http://localhost:${PORT}`);
    console.log(`  📡 API      : http://localhost:${PORT}/api/preorder`);
    console.log('═══════════════════════════════════════════');
    console.log('');
});
