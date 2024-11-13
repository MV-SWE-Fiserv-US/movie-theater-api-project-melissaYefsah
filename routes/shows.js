const { Router } = require('express')
const showRouter = Router()
const { User, Show } = require('../models/index.js')

showRouter.get('/', async (req, res) => {
  const shows = await Show.findAll()
  res.json(shows)
})
showRouter.get('/:id', async (req, res) => {
  const param = req.params.id
  const shows = await Show.findByPk(param)
  res.json(shows)
})
showRouter.get('/:showId/users', async (req, res) => {
  try {
    const show = await Show.findByPk(req.params.showId, {
      include: {
        model: User
      }
    })
    if (!show) return res.status(404).json({ error: 'Show not found' })

    res.json(show.users)
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching users' })
  }
})
showRouter.put('/:id/available', async (req, res) => {
  const showId = req.params.id
  const newAvailability = req.body.available

  try {
    const updatedRecords = await Show.update(
      { available: newAvailability },
      { where: { id: showId } }
    )

    if (updatedRecords[0] === 0) {
      return res.status(404).json({ message: 'Show not found' })
    }

    res.json({ message: 'Availability updated successfully' })
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' })
  }
})
showRouter.delete('/:id', async (req, res) => {
  const param = req.params.id
  const deletedShow = await Show.destroy({ where: { id: param } })
  res.json(deletedShow)
})
// Define the route to get shows by genre
showRouter.get('/:genre', async (req, res) => {
  try {
    const genre = req.params.genre
    console.log('Requested genre:', genre)
    if (!genre) {
      return res.status(400).json({ error: 'Genre is required' })
    }

    const foundShows = await Show.findAll({
      where: { genre: genre }
    })

    if (foundShows.length === 0) {
      return res.status(404).json({ error: 'No shows found for this genre' })
    }

    res.json(foundShows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred while querying the database' })
  }
})

module.exports = showRouter
