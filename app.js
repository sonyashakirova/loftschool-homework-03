import createError from 'http-errors'
import express from 'express'
import session from 'express-session'
import path from 'path'
import logger from 'morgan'
import url from 'url'
import mainRouter from './routes/index.js'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

const app = express()

const adapter = new JSONFile(path.join(__dirname, 'db.json'))
const defaultData = { products: [], skills: [] }
const db = new Low(adapter, defaultData)

await db.read()

app.db = db

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

process.env.NODE_ENV === 'development'
  ? app.use(logger('dev'))
  : app.use(logger('short'))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(
  session({
    secret: 'authorization',
    key: 'KHnXBUk1DykWR4Wv96yQXg0',
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: 600000
    },
    saveUninitialized: false,
    resave: false
  })
)

app.use(express.static(path.join(__dirname, 'public')))

app.use('/', mainRouter)

// catch 404 and forward to error handler
app.use((req, __, next) => {
  next(
    createError(404, `Ой, извините, но по пути ${req.url} ничего не найдено!`)
  )
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

app.listen(3000, () => {})
