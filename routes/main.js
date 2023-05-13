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
  const { products, skills } = req.app.db.data

  if (!req.body.name || !req.body.email) {
    res.render('pages/index', {
      title: 'Главная',
      msgemail: 'Заполните все обязательные поля!',
      products,
      skills
    })
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
      res.render('pages/index', {
        title: 'Главная',
        msgemail: `При отправке письма произошла ошибка! ${error}`,
        products,
        skills
      })
    }

    res.render('pages/index', {
      title: 'Главная',
      msgemail: 'Письмо успешно отправлено!',
      products,
      skills
    })
  })
})

export default router
