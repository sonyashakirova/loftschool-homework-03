import express from 'express'
import nodemailer from 'nodemailer'
import loadJSON from '../helpers/load-json.js'

const config = loadJSON('../nodemailer.json')

const router = express.Router()

router.get('/', (req, res, next) => {
  const { products, skills } = req.app.db.data

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
    text: `${req.body.message.trim()}\n\nОтправлено с: <${req.body.email}>`
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return res.send(`При отправке письма произошла ошибка! ${error}`)
    }

    return res.send('Письмо успешно отправлено!')
  })
})

export default router
