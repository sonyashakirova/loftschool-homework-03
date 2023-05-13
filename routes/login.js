import express from 'express'
import loadJSON from '../helpers/load-json.js'

const { admins } = loadJSON('../db.json')

const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('pages/login', { title: 'Авторизация' })
})

router.post('/', (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    res.render('pages/login', {
      title: 'Авторизация',
      msglogin: 'Заполните все обязательные поля!'
    })
  }

  admins.forEach(admin => {
    if (req.body.email === admin.email && req.body.password === admin.password) {
      req.session.isAdmin = true

      res.redirect('/admin')
    }
  })

  res.render('pages/login', {
    title: 'Авторизация',
    msglogin: 'Отказано в доступе: Пользователь не найден в базе данных.'
  })
})

export default router
