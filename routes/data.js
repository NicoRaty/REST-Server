import express from 'express'
const router = express.Router()

var data = [
  {
    "id": 1,
    "forename": "John",
    "surname": "Johnes"
  },
  {
    "id": 3,
    "forename": "Donald",
    "surname": "Duck"
  }
  {
    "id": 4,
    "forename": "Peter",
    "surname": "Parket"
  }
]

function getDataById(id) {
  return data.find(item => item.id === id)
}

function updateData(id, updatedData) {
  let existing = getDataById(id)
  const nextId = data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1
  const newId = { id: nextId }
  const newUser = { ...newId, ...updatedData }

  if (existing) {
    for (const [key, value] of Object.entries(updatedData)) {
      existing[key] = value
    }
    return existing
  }

  data.push(newUser)
  return newUser
}

router.get('/', function(req, res, next) {
  res.json( data ).status(200).end()
})

router.post('/', function(req, res, next) {
  const newData = req.body
  const format = req.accepts('application/json')

  if (!format) {
    res.status(415).json({"Error": "Unsupported Media Type"}).end()
    return
  }

  data.push(newData)
  res.json( newData ).status(201).end()
})

router.delete('/:id', function(req, res, next) {
  const id = parseInt(req.params.id)

  if (!data.find(item => item.id === id)) {
    res.status(404).json({"Error": "Not Found"}).end()
    return
  }

  data = data.filter(item => item.id !== id)
  res.status(204).end()
})

router.put('/:id', function(req, res, next) {
  const id = parseInt(req.params.id)
  const updatedData = req.body
  const format = req.accepts('application/json')

  if (!format) {
    res.status(415).json({"Error": "Unsupported Media Type"}).end()
    return
  }

  const exists = !!getDataById(id)
  const saved = updateData(id, updatedData)

  if (exists) {
    res.status(200).json(saved).end()
    return
  }

  res.status(201).json(saved).end()
})

router.post('/search', function(req, res, next) {
  const { forename, surname } = req.body
  
  const result = data.filter(item => {
    if (forename && surname) {
      return item.forename.toLowerCase() === forename.toLowerCase() && 
             item.surname.toLowerCase() === surname.toLowerCase()
    } else if (forename) {
      return item.forename.toLowerCase() === forename.toLowerCase()
    } else if (surname) {
      return item.surname.toLowerCase() === surname.toLowerCase()
    }
    return true
  })
  if (result.length === 0) {
    res.status(404).json({"Error": "Not Found"}).end()
    return
  }
  res.status(200).json(result).end()
})

export default router