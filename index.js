const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const axios = require('axios'); // تأكد من تنصيبها: npm install axios

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot is running ✅');
});

app.listen(port, () => {
  console.log(Web server running on port ${port});
});

// ضع هنا رابط Google Apps Script (رابط الـ Web App)
const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SHEET_WEBAPP_URL || 'https://script.google.com/macros/s/AKfycbyswROtKpUvJ5Ld7PrbnO7diAdVU91CtLr0tIl-4z53SzPwp7E3qHf1txAv5xzpSc_D/exec';

// توكن البوت من البيئة أو ثابت للتجربة
const token = process.env.BOT_TOKEN || '7768431998:AAExA8h-zLakDN1Qui-jAV3FSwfG7v6K87M';
const bot = new TelegramBot(token, { polling: true });

// دالة ترسل بيانات restart إلى Google Sheets
async function sendRestartToSheet(userId, username) {
  try {
    await axios.post(GOOGLE_SCRIPT_URL, {
      user_id: userId,
      username: username || ''
    });
    console.log(Restart data sent for user ${userId});
  } catch (error) {
    console.error('Failed to send restart data:', error.message);
  }
}

// عند /start أو "ريستارت"
bot.onText(/\/start|ريستارت/i, async (msg) => {
  await sendRestartToSheet(msg.chat.id, msg.from.username);
  handleStart(msg.chat.id, msg.from.username);
});

// عند الضغط على زر "إعادة التفعيل"
bot.on('callback_query', async (callbackQuery) => {
  const msg = callbackQuery.message;
  const username = callbackQuery.from.username;
  await bot.answerCallbackQuery(callbackQuery.id);
  await sendRestartToSheet(msg.chat.id, username);
  handleStart(msg.chat.id, username);
});

// الدالة الأساسية لإرسال الرسائل بناءً على وجود username
function handleStart(chatId, username) {
  if (username) {
    const link = https://www.arab-club.com/p/register-form?user=${username};
    const linnk = https://www.arab-club.com/p/girls-subscription?user=${username};
    const message = مرحبًا بك عزيزي 👋💖
شكرًا لانضمامك وسط آلاف الأعضاء الذين ينضمون لدينا كل يوم من الإناث والرجال 👥💫
يسعدنا انضمامك معنا ونعتز بثقتك بنا 🤝
لقد قمنا بإرسال الرابط الخاص بك لتسجيل الطلب ✍️
يرجى تعبئة البيانات المطلوبة بدقة، لأننا سنعتمد على هذه المعلومات في استكمال الطلب معك بالشكل الصحيح ✅
بعد تعبئة الاستمارة، سيتم التواصل معك خلال 24 ساعة القادمة من خلال إحدى موظفاتنا المختصات لمتابعة طلبك وعرض الفتيات المناسبات لك بناءً على اختياراتك 💬👩‍💼
🔗 رابط التسجيل الخاص بك كـ عضو ذكر 👨: ${link}
🔗 رابط التسجيل الخاص بك كـ عضوة أنثى 👩: ${linnk}
يرجى ملاحظة أنه يمكنك التقديم في أي وقت، لأن لديك رابط استمارة خاص بك فقط ارجع إلى هذه المحادثة متى شئت وابدأ التقديم مرة أخرى بسهولة 😊
نحن هنا لخدمتك دائمًا، ونتمنى لك تجربة راقية ومميزة معنا 💐🌟;
    bot.sendMessage(chatId, message, {
      reply_markup: {
        remove_keyboard: true
      }
    });
  } else {
    const message = مرحبًا عزيزي، نود إبلاغك بأن حسابك على تيليجرام مرتبط برقم هاتف فقط دون اسم مستخدم (Username)
وهذا يتعارض مع سياسات الخصوصية الخاصة بنا، حيث نعتمد دائمًا على اسم المستخدم لضمان سرية وخصوصية تامة لكل عضو
لهذا السبب لم يتم إنشاء رابط الاستمارة الخاص بك تلقائيًا

ما المطلوب منك الآن؟
يرجى إضافة اسم مستخدم (Username) لحسابك على تيليجرام تمامًا كما تفعل في تطبيقات مثل إنستقرام
ويُفضّل أن يكون الاسم واضحًا وسهل القراءة

طريقة إضافة اسم المستخدم:
1. افتح تطبيق تيليجرام
2. اضغط على القائمة (≡) في الزاوية العلوية
3. اختر "الإعدادات" (Settings)
4. اضغط على "اسم المستخدم" أو "Username"
5. اكتب الاسم الذي تريده (بالإنجليزية فقط وبدون مسافات)
6. إذا كان متاحًا، اضغط "حفظ" (✔️)

بعد أن تقوم بإضافة اسم المستخدم يرجى الضغط على الزر الموجود في الأسفل لإعادة تفعيل طلبك

نحن نقوم بذلك لأن كل عضو يحصل على رابط استمارة خاص به ونحن نعمل باحترافية عالية ونضمن لكل عضو الخصوصية والتميّز💡
يمكنك تقديم الطلب في أي وقت طالما لديك رابط الاستمارة، يمكنك العودة إلى هذه المحادثة والتقديم بسهولة وقتما تشاء;
    bot.sendMessage(chatId, message, {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'إعادة تفعيل طلبي✅', callback_data: 'restart' }]
        ]
      }
    });
  }
}


