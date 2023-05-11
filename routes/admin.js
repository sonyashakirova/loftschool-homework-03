const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const formidable = require('formidable')

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
    return {...skill, number: Number(req.body[skill.code])}
  });

  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

  return res.redirect('/admin')
})

router.post('/upload', (req, res, next) => {
  const newProduct = {};
  const productsPath = 'public/assets/img/products';

  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(process.cwd(), productsPath);

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.send(`Ошибка обработки формы: ${err}`)
    }

    const fileName = path.join(productsPath, files.photo.originalFilename);

    fs.rename(files.photo.filepath, fileName, (err) => {
      if (err) {
        return res.send(`Ошибка при сохранении изображения: ${err.message}`)
      }
    })

    newProduct.src = `./assets/img/products/${files.photo.originalFilename}`;
    newProduct.name = fields.name;
    newProduct.price = Number(fields.price);

    data.products.push(newProduct);

    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  })

  return res.send('Новый продукт успешно сохранен!')
})

module.exports = router
