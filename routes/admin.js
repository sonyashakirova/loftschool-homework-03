import express from 'express'
import path from 'path'
import fs from 'fs'
import formidable from 'formidable'

const router = express.Router()

router.get('/', (req, res, next) => {
  if (!req.session.isAdmin) {
    return res.send("Отказано в доступе: Сессия завершена.")
  }

  const { skills } = req.app.db.data
  
  res.render('pages/admin', { title: 'Admin', skills })
})

router.post('/skills', (req, res, next) => {
  req.app.db.data.skills = req.app.db.data.skills.map(skill => {
    return {...skill, number: Number(req.body[skill.code])}
  })

  req.app.db.write()

  return res.redirect('/admin')
})

router.post('/upload', (req, res, next) => {
  const productsPath = 'public/assets/img/products'

  const form = new formidable.IncomingForm()
  form.uploadDir = path.join(process.cwd(), productsPath)

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

    req.app.db.data.products.push({
      src: `./assets/img/products/${files.photo.originalFilename}`,
      name: fields.name,
      price: Number(fields.price),
    })

    req.app.db.write()
  })

  return res.send('Новый продукт успешно сохранен!')
})

export default router
