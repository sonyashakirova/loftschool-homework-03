const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')
const config = require('../nodemailer.json')
const { products, skills } = require('../data.json')

router.get('/', (req, res, next) => {
  res.render('pages/index', { title: 'Главная', products, skills })
})

router.post('/', (req, res, next) => {
  if (!req.body.name || !req.body.email) {
    return res.send("Заполните все обязательные поля!")
  }

  const transporter = nodemailer.createTransport(config.mail.smtp)
  const mailOptions = {
    from: `"${req.body.name}" <${req.body.email}>`,
    to: config.mail.smtp.auth.user,
    subject: config.mail.subject,
    text: `${req.body.message.trim()}\n\n
      Отправлено с: <${req.body.email}>`
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return res.send(`При отправке письма произошла ошибка! ${error}`)
    }

    return res.send('Письмо успешно отправлено!')
  })
})

module.exports = router
