const express = require('express')
const router = express.Router()
const { admins } = require('../data.json')

router.get('/', (req, res, next) => {
  res.render('pages/login', { title: 'Авторизация' })
})

router.post('/', (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.send("Заполните все обязательные поля!")
  }

  admins.forEach(admin => {
    if (req.body.email === admin.email && req.body.password === admin.password) {
      req.session.isAdmin = true

      return res.redirect('/admin')
    }
  })

  return res.send("Отказано в доступе: Пользователь не найден в базе данных.")
})

module.exports = router
