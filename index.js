const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;
const path = './user_restart_log.json';

const token = process.env.BOT_TOKEN || '7514683360:AAE3krLLlXY8jm7poIN2mFivA6udWIVOfLY';
const bot = new TelegramBot(token, { polling: true });

// Web Server لتشغيل البوت بدون توقف مع UptimeRobot
app.get('/', (req, res) => {
  res.send('Bot is running ✅');
});
app.listen(port, () => {
  console.log(`Web server running on port ${port}`);
});

// /start أو "ريستارت"
bot.onText(/\/start|ريستارت/i, (msg) => {
  handleStart(msg.chat.id, msg.from.username);
});

// عند الضغط على زر "إعادة التفعيل"
bot.on('callback_query', (callbackQuery) => {
  const msg = callbackQuery.message;
  const username = callbackQuery.from.username;
  const userId = callbackQuery.from.id.toString();
  const chatId = msg.chat.id;
  const now = Date.now();

  bot.answerCallbackQuery(callbackQuery.id).then(() => {
    handleStart(chatId, username);

    // تسجيل وقت الضغط
    let data = {};
    if (fs.existsSync(path)) {
      data = JSON.parse(fs.readFileSync(path));
    }
    data[userId] = { last_restart: now };
    fs.writeFileSync(path, JSON.stringify(data, null, 2));

    // جدولة رسالة بعد 30 ثانية (بدل 3 أيام مؤقتًا للتجربة)
    setTimeout(() => {
      const updatedData = JSON.parse(fs.readFileSync(path));
      const lastRestart = updatedData[userId]?.last_restart;

      // ✅ التصحيح هنا: التأكد من مرور 30 ثانية
      if (lastRestart && Date.now() - lastRestart >= 30000) {
        const reminderMessage = `مرحبًا، نود فقط تنبيهك بأنك لم تُكمل تسجيل طلبك حتى الآن. لدينا عدد كبير من العضوات الجادات ينضممن يوميًا، وجميعهن يبحثن عن شريك جاد ومناسب.

نحن نقدّر وقتك، لذلك لا نرسل لك رسائل عبثية، ولكننا نؤمن أن فرصًا حقيقية قد تكون فاتتك بالفعل بسبب تأخرك في التسجيل.

طلبك محفوظ ورابطك لا يزال فعالًا. يمكنك التقديم في أي وقت تشاء، والعودة إلى هذه المحادثة وقتما ترغب. لكن كل يوم تأجيل يعني أنك تتأخر عن فرصة جديدة ربما كانت مناسبة تمامًا لك.

لا تؤجل أكثر… ابدأ الآن.`;

        bot.sendMessage(chatId, reminderMessage, {
          reply_markup: {
            inline_keyboard: [
              [{ text: 'استمرار التسجيل في الطلب', callback_data: 'restart' }]
            ]
          }
        });
      }
    }, 30000); // 30 ثانية للتجربة
  });
});

// دالة تنفيذ /start أو restart
function handleStart(chatId, username) {
  if (username) {
    const link = `https://www.arab-club.com/p/register-form?user=${username}`;
    const message = `مرحبًا بك عزيزي 👋💖  
شكرًا لانضمامك وسط آلاف الأعضاء الذين ينضمون لدينا كل يوم من الإناث والرجال 👥💫

يسعدنا انضمامك معنا ونعتز بثقتك بنا 🤝

لقد قمنا بإرسال الرابط الخاص بك لتسجيل الطلب ✍️  
يرجى تعبئة البيانات المطلوبة بدقة، لأننا سنعتمد على هذه المعلومات في استكمال الطلب معك بالشكل الصحيح ✅

بعد تعبئة الاستمارة، سيتم التواصل معك خلال 24 ساعة القادمة من خلال إحدى موظفاتنا المختصات  
لمتابعة طلبك وعرض الفتيات المناسبات لك بناءً على اختياراتك 💬👩‍💼

🔗 رابط التسجيل الخاص بك:  
${link}

يرجى ملاحظة أنه يمكنك التقديم في أي وقت، لأن لديك رابط استمارة خاص بك  
فقط ارجع إلى هذه المحادثة متى شئت وابدأ التقديم مرة أخرى بسهولة 😊

نحن هنا لخدمتك دائمًا، ونتمنى لك تجربة راقية ومميزة معنا 💐🌟`;

    bot.sendMessage(chatId, message, {
      reply_markup: {
        remove_keyboard: true
      }
    });

  } else {
    const message = `مرحبًا عزيزي، نود إبلاغك بأن حسابك على تيليجرام مرتبط برقم هاتف فقط دون اسم مستخدم (Username)  
وهذا يتعارض مع سياسات الخصوصية الخاصة بنا، حيث نعتمد دائمًا على اسم المستخدم لضمان سرية وخصوصية تامة لكل عضو  
لهذا السبب لم يتم إنشاء رابط الاستمارة الخاص بك تلقائيًا

ما المطلوب منك الآن؟  
يرجى إضافة اسم مستخدم (Username) لحسابك على تيليجرام  
تمامًا كما تفعل في تطبيقات مثل إنستقرام  
ويُفضّل أن يكون الاسم واضحًا وسهل القراءة

طريقة إضافة اسم المستخدم:

1. افتح تطبيق تيليجرام  
2. اضغط على القائمة (≡) في الزاوية العلوية  
3. اختر "الإعدادات" (Settings)  
4. اضغط على "اسم المستخدم" أو "Username"  
5. اكتب الاسم الذي تريده (بالإنجليزية فقط وبدون مسافات)  
6. إذا كان متاحًا، اضغط "حفظ" (✔️)

⏳ بعد أن تقوم بإضافة اسم المستخدم  
يرجى الضغط على الزر الموجود في الأسفل لإعادة تفعيل طلبك

نحن نقوم بذلك لأن كل عضو يحصل على رابط استمارة خاص به  
ونحن نعمل باحترافية عالية ونضمن لكل عضو الخصوصية والتميّز

💡 يمكنك تقديم الطلب في أي وقت  
طالما لديك رابط الاستمارة، يمكنك العودة إلى هذه المحادثة والتقديم بسهولة وقتما تشاء`;

    bot.sendMessage(chatId, message, {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'إعادة تفعيل طلبي✅', callback_data: 'restart' }]
        ]
      }
    });
  }
}
