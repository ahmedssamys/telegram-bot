const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Web Server لتشغيل البوت بدون توقف مع UptimeRobot
app.get('/', (req, res) => {
  res.send('Bot is running ✅');
});
app.listen(port, () => {
  console.log(`Web server running on port ${port}`);
});

// توكن البوت من البيئة
const token = process.env.BOT_TOKEN || '7514683360:AAE3krLLlXY8jm7poIN2mFivA6udWIVOfLY';
const bot = new TelegramBot(token, { polling: true });

// عند /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username;

  if (username) {
    const link = `https://www.arab-club.com/p/register-form?user=${username}`;
    const message = `مرحبًا بك عزيزي 👋💖  
شكرًا لانضمامك وسط آلاف الأعضاء الذين ينضمون لدينا كل يوم من الإناث والرجال 👥💫

يسعدنا انضمامك معنا ونعتز بثقتك بنا 🤝

لقد قمنا بإرسال الرابط الخاص بك لتسجيل الطلب ✍️  
يرجى تعبئة البيانات المطلوبة بدقة، لأننا سنعتمد على هذه المعلومات في استكمال الطلب معك بالشكل الصحيح ✅

بعد تعبئة الاستمارة، سيتم التواصل معك خلال 24 ساعة القادمة من خلال إحدى موظفاتنا المختصات،  
لمتابعة طلبك وعرض الفتيات المناسبات لك بناءً على اختياراتك 💬👩‍💼

🔗 رابط التسجيل الخاص بك:  
${link}

نحن هنا لخدمتك دائمًا، ونتمنى لك تجربة راقية ومميزة معنا 💐🌟`;

    bot.sendMessage(chatId, message);
  } else {
    bot.sendMessage(chatId, `لم نتمكن من قراءة اسم المستخدم (Username) الخاص بك على تيليجرام.
إذا لم تكن قد فعّلت اسم مستخدم لحسابك (مثل: @example)، فلن يتمكن البوت من التعرف عليك إلا من خلال رقم هاتفك.
لذلك، يجب الضغط على زر " التسجيل برقمي" في الأسفل، حتى يتم إرسال رقمك لنا وتوليد رابط استمارة خاص بك لاستكمال الطلب.
يرجى ملاحظة أن البوت لا يمكنه قراءة رقم الهاتف إلا بإذن صريح منك`, {
      reply_markup: {
        keyboard: [
          [
            {
              text: 'إرسال رقمي',
              request_contact: true
            }
          ]
        ],
        one_time_keyboard: true
      }
    });
  }
});

// استقبال الرقم بعد الضغط على الزر
bot.on('contact', (msg) => {
  const chatId = msg.chat.id;
  const phoneNumber = msg.contact.phone_number;

  const link = `https://www.arab-club.com/p/register-form?user=${phoneNumber}`;
  const message = `شكرًا لانضمامك وسط آلاف الأعضاء الذين ينضمون لدينا كل يوم من الإناث والرجال 👥💫

مرحبًا بك عزيزي 👋💖  
يسعدنا انضمامك معنا ونعتز بثقتك بنا 🤝

لقد قمنا بإرسال الرابط الخاص بك لتسجيل الطلب ✍️  
يرجى تعبئة البيانات المطلوبة بدقة، لأننا سنعتمد على هذه المعلومات في استكمال الطلب معك بالشكل الصحيح ✅

بعد تعبئة الاستمارة، سيتم التواصل معك خلال 24 ساعة القادمة من خلال إحدى موظفاتنا المختصات،  
لمتابعة طلبك وعرض الفتيات المناسبات لك بناءً على اختياراتك 💬👩‍💼

🔗 رابط التسجيل الخاص بك:  
${link}

نحن هنا لخدمتك دائمًا، ونتمنى لك تجربة راقية ومميزة معنا 💐🌟`;

  bot.sendMessage(chatId, message);
});
