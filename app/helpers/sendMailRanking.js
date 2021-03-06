require('dotenv').config();
const debug = require('debug')('sendMailEndPeriod helper');
const sendMailService = require('./sendMail');

const sendMailRanking = {
  // to send a mail with ranking to a user
  async sendMail(usersWithScore) {
    debug('usersWithScore ', usersWithScore);
    // message formatage
    let message = `    <style type="text/css">
    .tftable {font-size:12px;color:#333333;width:100%;border-width: 1px;border-color: #729ea5;border-collapse: collapse;}
    .tftable th {font-size:12px;background-color:#acc8cc;border-width: 1px;padding: 8px;border-style: solid;border-color: #729ea5;text-align:left;}
    .tftable tr {background-color:#d4e3e5;}
    .tftable td {font-size:12px;border-width: 1px;padding: 8px;border-style: solid;border-color: #729ea5;}
    .tftable tr:hover {background-color:#ffffff;}
    </style>
    <table class="tftable" border="1">
    <tr><th>pseudonym</th><th>rank</th><th>score</th></tr>`;
    usersWithScore.users.forEach((user) => {
      message += `<tr><td> ${user.pseudonym} </td><td> ${user.rank} </td><td> ${user.score} </td></tr>`;
    });
    message += '</table>';
    debug(message);
    // pour chaque user on envoie un mail
    const mailsToSend = [];
    usersWithScore.users.forEach((user) => {
      debug('user :', user.email);

      const mail = sendMailService(user.email, 'Cduprops score semaine ', message);

      mailsToSend.push(mail);
    });

    await Promise.all(mailsToSend);
    debug('done dans sendMailEndPeriod');
    return ('mails envoyés');
  },
};

module.exports = sendMailRanking;
