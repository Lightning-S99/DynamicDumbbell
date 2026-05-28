/* ═══════════════════════════════════════════
   DYNAMIC DUMBBELL — Backend Sunucusu
   Express + Nodemailer (SMTP E-posta)
   ═══════════════════════════════════════════ */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
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
// SMTP TRANSPORTER OLUŞTURMA
// ══════════════════════════════════════
// Nodemailer SMTP transporter'ı .env dosyasındaki
// bilgileri kullanarak oluşturulur.
//
// Desteklenen servisler:
//   Gmail      → smtp.gmail.com:587 (STARTTLS)
//   Yandex     → smtp.yandex.com:465 (SSL/TLS)
//   Outlook    → smtp-mail.outlook.com:587 (STARTTLS)
//   Özel SMTP  → mail.sizindomain.com:465/587

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: process.env.SMTP_SECURE === 'true', // true = port 465 (SSL), false = port 587 (STARTTLS)
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    // ── Localhost sorun giderme ayarları ──
    tls: {
        // Sertifika doğrulamayı görmezden gel
        // (kendinden imzalı veya uyumsuz sertifikalarda bağlantı hatasını önler)
        rejectUnauthorized: false,
    },
    // Bağlantı zaman aşımları
    connectionTimeout: 10000,  // 10 saniye
    greetingTimeout: 10000,
    socketTimeout: 15000,
});

// ══════════════════════════════════════
// SMTP BAĞLANTI TESTİ (Sunucu başlatılırken)
// ══════════════════════════════════════
transporter.verify()
    .then(() => {
        console.log('✅ SMTP bağlantısı başarılı — E-posta göndermeye hazır');
    })
    .catch((error) => {
        console.error('❌ SMTP bağlantı hatası:', error.message);
        console.error('─────────────────────────────────────────');
        console.error('Kontrol edin:');
        console.error('  1. .env dosyasındaki SMTP bilgileri doğru mu?');
        console.error('  2. Gmail ise "Uygulama Şifresi" kullanıyor musunuz?');
        console.error('  3. Port (587/465) firewall tarafından engelleniyor mu?');
        console.error('  4. İnternet bağlantınız aktif mi?');
        console.error('─────────────────────────────────────────');
    });

// ══════════════════════════════════════
// HTML E-POSTA ŞABLONU
// ══════════════════════════════════════
function createEmailHTML(firstName, lastName) {
    return `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#050505;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#050505;">
        <tr>
            <td align="center" style="padding:40px 20px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color:#0f0f0f;border-radius:16px;border:1px solid rgba(255,255,255,0.06);overflow:hidden;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background:linear-gradient(135deg,rgba(132,204,22,0.15),rgba(34,211,238,0.1));padding:40px 40px 30px;text-align:center;">
                            <div style="font-size:28px;margin-bottom:8px;">◆</div>
                            <h1 style="margin:0;color:#f5f5f5;font-size:24px;font-weight:700;letter-spacing:-0.02em;">
                                Dynamic<span style="color:#84cc16;">Dumbbell</span>
                            </h1>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding:40px;">
                            <!-- Success Badge -->
                            <div style="text-align:center;margin-bottom:30px;">
                                <div style="display:inline-block;background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.3);border-radius:50px;padding:8px 20px;">
                                    <span style="color:#22c55e;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;">✓ Ön Sipariş Onaylandı</span>
                                </div>
                            </div>

                            <h2 style="color:#f5f5f5;font-size:22px;font-weight:600;margin:0 0 16px;text-align:center;">
                                Merhaba ${firstName} ${lastName},
                            </h2>
                            
                            <p style="color:#a1a1a1;font-size:15px;line-height:1.7;margin:0 0 24px;text-align:center;">
                                Ön siparişiniz başarıyla oluşturuldu! Dynamic Dumbbell'in ilk üretim partisinde 
                                sizin için bir yer ayırdık. Lansman tarihi yaklaştığında sizi bilgilendireceğiz.
                            </p>

                            <!-- Divider -->
                            <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:30px 0;">

                            <!-- Features Summary -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td width="33%" style="text-align:center;padding:16px 8px;">
                                        <div style="font-size:24px;margin-bottom:6px;">⚖️</div>
                                        <div style="color:#84cc16;font-size:18px;font-weight:700;">4-24 KG</div>
                                        <div style="color:#6b6b6b;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;">Ağırlık Aralığı</div>
                                    </td>
                                    <td width="33%" style="text-align:center;padding:16px 8px;">
                                        <div style="font-size:24px;margin-bottom:6px;">🌱</div>
                                        <div style="color:#84cc16;font-size:18px;font-weight:700;">%87</div>
                                        <div style="color:#6b6b6b;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;">Karbon Tasarrufu</div>
                                    </td>
                                    <td width="33%" style="text-align:center;padding:16px 8px;">
                                        <div style="font-size:24px;margin-bottom:6px;">📦</div>
                                        <div style="color:#84cc16;font-size:18px;font-weight:700;">~200g</div>
                                        <div style="color:#6b6b6b;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;">Kargo Ağırlığı</div>
                                    </td>
                                </tr>
                            </table>

                            <!-- Divider -->
                            <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:30px 0;">

                            <p style="color:#6b6b6b;font-size:13px;line-height:1.6;margin:0;text-align:center;">
                                Herhangi bir sorunuz varsa bize 
                                <a href="mailto:${process.env.MAIL_FROM_ADDRESS}" style="color:#84cc16;text-decoration:none;">e-posta</a> 
                                ile ulaşabilirsiniz.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background:rgba(255,255,255,0.02);padding:24px 40px;text-align:center;border-top:1px solid rgba(255,255,255,0.06);">
                            <p style="color:#6b6b6b;font-size:12px;margin:0;">
                                © 2026 Dynamic Dumbbell. Tüm hakları saklıdır.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

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

        // ── E-posta gönderimi ──
        const mailOptions = {
            from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
            to: email.trim(),
            subject: 'Dynamic Dumbbell — Ön Siparişiniz Başarıyla Alındı! ✓',
            html: createEmailHTML(firstName.trim(), lastName.trim()),
            // Düz metin alternatifi (HTML desteklemeyen istemciler için)
            text: `Merhaba ${firstName.trim()} ${lastName.trim()},\n\nÖn siparişiniz başarıyla oluşturuldu!\n\nDynamic Dumbbell'in ilk üretim partisinde sizin için bir yer ayırdık.\nLansman tarihi yaklaştığında sizi bilgilendireceğiz.\n\n---\n© 2026 Dynamic Dumbbell`,
        };

        const info = await transporter.sendMail(mailOptions);

        console.log(`📧 E-posta gönderildi → ${email} (Message ID: ${info.messageId})`);

        res.json({
            success: true,
            message: 'Ön sipariş kaydedildi ve onay e-postası gönderildi.',
            messageId: info.messageId,
        });

    } catch (error) {
        console.error('❌ E-posta gönderim hatası:', error);

        // Kullanıcıya anlamlı hata mesajı
        let userMessage = 'E-posta gönderilirken bir hata oluştu.';

        if (error.code === 'EAUTH') {
            userMessage = 'SMTP kimlik doğrulama hatası. Lütfen yöneticiyle iletişime geçin.';
        } else if (error.code === 'ECONNREFUSED') {
            userMessage = 'E-posta sunucusuna bağlanılamadı.';
        } else if (error.code === 'ETIMEDOUT') {
            userMessage = 'E-posta sunucusu yanıt vermedi (zaman aşımı).';
        } else if (error.responseCode === 550) {
            userMessage = 'Alıcı e-posta adresi geçersiz veya reddedildi.';
        }

        res.status(500).json({
            success: false,
            message: userMessage,
            // Geliştirme ortamı için detaylı hata
            ...(process.env.NODE_ENV !== 'production' && { debug: error.message }),
        });
    }
});

// ══════════════════════════════════════
// SMTP TEST ENDPOINT (Geliştirme için)
// ══════════════════════════════════════
app.get('/api/smtp-test', async (req, res) => {
    try {
        await transporter.verify();
        res.json({
            success: true,
            message: 'SMTP bağlantısı başarılı!',
            config: {
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: process.env.SMTP_SECURE,
                user: process.env.SMTP_USER ? '***' + process.env.SMTP_USER.slice(-10) : 'tanımsız',
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'SMTP bağlantı hatası',
            error: error.message,
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
    console.log(`  🔧 SMTP Test: http://localhost:${PORT}/api/smtp-test`);
    console.log('═══════════════════════════════════════════');
    console.log('');
});
