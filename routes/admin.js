const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')

const dbPath = path.join(process.cwd(), 'data.json');
let data = JSON.parse(fs.readFileSync(dbPath));

router.get('/', (req, res, next) => {
  if (!req.session.isAdmin) {
    return res.send("Отказано в доступе: Сессия завершена.")
  }

  res.render('pages/admin', { title: 'Admin', skills: data.skills })
})

router.post('/skills', (req, res, next) => {
  data.skills = data.skills.map(skill => {
    return {...skill, number: req.body[skill.code]}
  });

  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

  return res.redirect('/admin')
})

router.post('/upload', (req, res, next) => {
  /* TODO:
   Реализовать сохранения объекта товара на стороне сервера с картинкой товара и описанием
    в переменной photo - Картинка товара
    в переменной name - Название товара
    в переменной price - Цена товара
    На текущий момент эта информация хранится в файле data.json  в массиве products
  */
  res.send('Реализовать сохранения объекта товара на стороне сервера')
})

module.exports = router
