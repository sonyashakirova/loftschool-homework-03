import createError from 'http-errors'
import express from 'express'
import path from 'path'
import fs from 'fs'
import formidable from 'formidable'

const router = express.Router()

router.get('/', (req, res, next) => {
  if (!req.session.isAdmin) {
    next(createError(401, 'Отказано в доступе: сессия завершена'))
  }

  const { skills } = req.app.db.data
  
  res.render('pages/admin', { title: 'Admin', skills })
})

router.post('/skills', (req, res, next) => {
  req.app.db.data.skills = req.app.db.data.skills.map(skill => {
    return {...skill, number: Number(req.body[skill.code])}
  })

  req.app.db.write()

  res.render('pages/admin', {
    title: 'Admin',
    msgskill: 'Значения обновлены!',
    skills: req.app.db.data.skills
  })
})

router.post('/upload', (req, res, next) => {
  const productsPath = 'public/assets/img/products'

  const form = new formidable.IncomingForm()
  form.uploadDir = path.join(process.cwd(), productsPath)

  form.parse(req, (err, fields, files) => {
    if (err) {
      res.render('pages/admin', {
        title: 'Admin',
        msgfile: `Ошибка обработки формы: ${err}`,
        skills: req.app.db.data.skills
      })
    }

    const fileName = path.join(productsPath, files.photo.originalFilename);

    fs.rename(files.photo.filepath, fileName, (err) => {
      if (err) {
        res.render('pages/admin', {
          title: 'Admin',
          msgfile: `Ошибка при сохранении изображения: ${err.message}`,
          skills: req.app.db.data.skills
        })
      }
    })

    req.app.db.data.products.push({
      src: `./assets/img/products/${files.photo.originalFilename}`,
      name: fields.name,
      price: Number(fields.price),
    })

    req.app.db.write()
  })

  res.render('pages/admin', {
    title: 'Admin',
    msgfile: 'Новый продукт успешно сохранен!',
    skills: req.app.db.data.skills
  })
})

export default router
