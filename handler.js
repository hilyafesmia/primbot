'use strict';
const rp = require('request-promise');
const TELEGRAM_TOKEN = '5534630540:AAF6Q76rFYGr-W7c5tKblGypbCm4GROc_bE';

const pasaran = ['Pon', 'Wage', 'Kliwon', 'Legi', 'Pahing'];
const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

async function sendToUser(chat_id, text) {
  const options = {
    method: 'GET',
    uri: `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
    qs: {
      chat_id,
      parse_mode: 'Markdown',
      text
    }
  };

  return rp(options);
}

function hitungDays(tgl) {
  const panutan = new Date("1/1/1905");
  const target = new Date(tgl);
  const hasil = Math.floor((target-panutan)/1000/3600/24);
  return hasil;
}

function getHari(daysElapsed) {
  const index = daysElapsed % 7;
  return hari[index];
}

function getPasaran(daysElapsed) {
  const index = daysElapsed % 5;
  return pasaran[index];
}

module.exports.primbot = async (event) => {
  const body = JSON.parse(event.body);
  const {chat, text} = body.message;

  const tglRegex = /[0-9]{2}\/[0-9]{2}\/[0-9]{4}/;

  const helpText = 'Tersedia beberapa command yang dapat digunakan pada bot ini:\n\n/weton untuk mencari tahu hari pasaran Anda\n/help untuk mendapat bantuan';
  const notMatchText = 'Tolong pastikan tanggal mengikuti format mm/dd/yyyy';
  const promptWetonText = 'Masukkan tanggal lahir dengan format mm/dd/yyyy\n\nContoh: 3 Januari 1990 ditulis sebagai 01/03/1990)';
  const errText = 'Maaf saya tidak mengerti 🥺\n\nGunakan command /help untuk mendapat cara penggunaan bot ini';
  const welcomeText = 'Selamat datang di Hitung Primbon Bot\n\n' + helpText;

  if (text == '/start') {
    await sendToUser(chat.id, welcomeText);
  }
  else if (text == '/weton') {
    await sendToUser(chat.id, promptWetonText);
  }
  else if (tglRegex.test(text)) {
    const daysElapsed = hitungDays(text);
    const output = `Tanggal lahir: ${text}\nMaka hari pasaran Anda adalah ${getHari(daysElapsed)} ${getPasaran(daysElapsed)}`;

    await sendToUser(chat.id, output);
  }
  else if (text == '/help') {
    await sendToUser(chat.id, helpText);
  }
  else {
    await sendToUser(chat.id, errText);
  }
  return { statusCode: 200 };
};
