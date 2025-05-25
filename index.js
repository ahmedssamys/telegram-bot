const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const token = process.env.BOT_TOKEN || '7514683360:AAE3krLLlXY8jm7poIN2mFivA6udWIVOfLY';
const bot = new TelegramBot(token, { polling: true });

// لتشغيل البوت دائمًا على سيرفر مجاني
app.get('/', (req, res) => {
  res.send('Bot is running ✅');
});
app.listen(port, () => {
  console.log(`Web server running on port ${port}`);
});

// 💾 ذاكرة مؤقتة داخل الرام (بدون ملفات)
let pendingReminders = [];

// زر "إعادة التفعيل"
bot.on('callback_query', (callbackQuery) => {
  const msg = callbackQuery.message;
  const chatId = msg.chat.id;
  const username = callbackQuery.from.username;

  bot.answerCallbackQuery(callbackQuery.id);

  handleStart(chatId, username);

  // 🕒 حفظ وقت الضغط في الرام
  pendingReminders.push({
    chatId: chatId,
    time: Date.now()
  });
});

// /start أو "ريستارت"
bot.onText(/\/start|ريستارت/i, (msg) => {
  handleStart(msg.chat.id, msg.from.username);
});

// ⏰ فحص دوري كل 5 ثواني لو فيه ناس مرّ عليها 30 ثانية
setInterval(() => {
  const now = Date.now();

  pendingReminders = pendingReminders.filter((entry) => {
    if (now - entry.time >= 30000) {
      // بعد 30 ثانية ابعت الرسالة
      const reminderMessage = `مرحبًا، نود فقط تنبيهك بأنك لم تُكمل تسجيل طلبك حتى الآن. لدينا عدد كبير من العضوات الجادات ينضممن يوميًا، وجميعهن يبحثن عن شريك جاد ومناسب.

نحن نقدّر وقتك، لذلك لا نرسل لك رسائل عبثية، ولكننا نؤمن أن فرصًا حقيقية قد تكون فاتتك بالفعل بسبب تأخرك في التسجيل.

طلبك محفوظ ورابطك لا يزال فعالًا. يمكنك التقديم في أي وقت تشاء، والعودة إلى هذه المحادثة وقتما ترغب. لكن كل يوم تأجيل يعني أنك تتأخر عن فرصة جديدة ربما كانت مناسبة تمامًا لك.

لا تؤجل أكثر… ابدأ الآن.`;

      bot.sendMessage(entry.chatId, reminderMessage, {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'استمرار التسجيل في الطلب', callback_data: 'restart' }]
          ]
        }
      });

      return false; // احذفه بعد ما تبعت له
    }

    return true; // لسه ما وصلش 30 ثانية
  });
}, 5000);

// دالة إرسال الرابط أو الرسالة حسب وجود اليوزر
function handleStart(chatId, username) {
  if (username) {
    const link = `https://www.arab-club.com/p/register-form?user=${username}`;
    const message = `مرحبًا بك عزيزي 👋💖  
شكرًا لانضمامك وسط آلاف الأعضاء الذين ينضمون لدينا كل يوم من الإناث والرجال 👥💫

يسعدنا انضمامك معنا ونعتز بثقتك بنا 🤝

لقد قمنا بإرسال الرابط الخاص بك لتسجيل الطلب ✍️  
يرجى تعبئة البيانات المطلوبة بدقة، لأننا سنعتمد على هذه المعلومات في استكمال الطلب معك بالشكل الصحيح ✅

🔗 رابط التسجيل الخاص بك:  
${link}

يمكنك الرجوع لهذه المحادثة وإرسال طلبك في أي وقت 😊  
نتمنى لك تجربة راقية ومميزة معنا 💐🌟`;

    bot.sendMessage(chatId, message);

  } else {
    const message = `مرحبًا عزيزي، حسابك على تيليجرام لا يحتوي على اسم مستخدم (Username)  
لضمان الخصوصية، نطلب منك إضافة اسم مستخدم أولًا.

طريقة الإضافة:
1. افتح تيليجرام
2. الإعدادات > اسم المستخدم
3. أضف اسم واضح (بالإنجليزية)

ثم اضغط الزر بالأسفل لبدء التسجيل من جديد`;

    bot.sendMessage(chatId, message, {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'إعادة تفعيل طلبي✅', callback_data: 'restart' }]
        ]
      }
    });
  }
}
