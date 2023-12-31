const status = require('http-status')
const CodeError = require('../util/CodeError.js')
const has = require('has-keys')
const routeModel = require('../models/routes.js')
const placeModel = require('../models/places.js')
// eslint-disable-next-line no-unused-vars
const routesPlaces = require('../models/routesPlaces.js')

module.exports = {
  async getRoutes (req, res) {
    // #swagger.tags = ['Routes']
    // #swagger.summary = 'Get all public routes'
    // #swagger.parameters['x-access-token'] = { in: 'header', description: 'JWT token', required: 'true', type: 'string' }
    // #swagger.responses[200] = {description: 'Returning all public routes', schema: {$data: [{$id: '1', $title: 'Walk in the woods', $coordinates: {data: { latitude: [20.234, 40.123], longitude: [12.3674, 45.32789]}}, $estimatedDistance: 2, $estimatedTime: 2, $isPrivate: false, $score: 0.0, $nbVoters: 0, $activityType: 'walk' }]}}
    const data = await routeModel.findAll({
      attributes: { exclude: ['isPrivate'] },
      where: { isPrivate: false }
    })
    res.json({ status: status.OK, message: 'Tous les parcours publics', data })
  },

  async getRoute (req, res) {
    // #swagger.tags = ['Routes']
    // #swagger.summary = 'Get all public routes'
    // #swagger.parameters['id'] = {in: 'path', type: 'integer', description: 'id of the route', required: 'true'}
    // #swagger.parameters['x-access-token'] = { in: 'header', description: 'JWT token', required: 'true', type: 'string' }
    // #swagger.reponses[400] = { description: 'id parameter missing'}
    if (!has(req.params, 'id')) { throw new CodeError('ID manquant', status.BAD_REQUEST) }
    const data = await routeModel.findOne({
      where: { id: req.params.id },
      include: { model: placeModel, attributes: ['title', 'description', 'latitude', 'longitude'] }
    })

    // #swagger.responses[200] = {description: 'Returning details of a specific route', schema: {$data: {$id: '1', $title: 'Walk in the woods', $coordinates: {data: { latitude: [20.234, 40.123], longitude: [12.3674, 45.32789]}}, $estimatedDistance: 2, $estimatedTime: 2, $isPrivate: false, $score: 0.0, $nbVoters: 0, $activityType: 'walk' }}}
    res.json({ status: status.OK, message: 'Parcours récupéré', data })
  },

  async getRoutesByUserId (req, res) {
    // #swagger.tags = ['Routes']
    // #swagger.summary = 'Get all routes of an user (only the specific user can call this route or an admin)'
    // #swagger.parameters['id'] = {in: 'path', type: 'integer', description: 'id of the user', required: 'true'}
    // #swagger.parameters['x-access-token'] = { in: 'header', description: 'JWT token', required: 'true', type: 'string' }
    // #swagger.reponses[400] = { description: 'id parameter missing'}
    if (!has(req.params, 'id')) { throw new CodeError('ID manquant', status.BAD_REQUEST) }
    const data = await routeModel.findAll({
      where: { userId: req.params.id }
    })
    // #swagger.responses[200] = { description: 'Returning all routes generated by user', schema: [{$data: {$id: '1', $title: 'Walk in the woods', $coordinates: {data: { latitude: [20.234, 40.123], longitude: [12.3674, 45.32789]}}, $estimatedDistance: 2, $estimatedTime: 2, $isPrivate: false, $score: 0.0, $nbVoters: 0, $activityType: 'walk' }}, {$data: {$id: '5', $title: 'Seaside', $coordinates: {data: { latitude: [26.129, 98.123], longitude: [93.3674, 19.7219]}}, $estimatedDistance: 6, $estimatedTime: 3, $isPrivate: true, $score: 3.5, $nbVoters: 10, $activityType: 'run' }}] }
    res.json({
      status: status.OK,
      message: "Tous les parcours de l'utilisateur",
      data
    })
  },

  async newRoute (req, res) {
    // #swagger.tags = ['Routes']
    // #swagger.summary = 'Create a new route'
    // #swagger.parameters['x-access-token'] = { in: 'header', description: 'JWT token', required: 'true', type: 'string' }
    // #swagger.parameters['data'] = { in: 'body', schema: { $title: 'Walk in the woods', places : { ids: [1,2,3] }, $coordinates: {data: {latitude: [0, 2], longitude: [0, 2]}}, $estimatedDistance: 2, $estimatedTime: 2, $activityType: 'walk', $isPrivate: true }}
    // #swagger.reponses[400] = { description: 'Missing data attribute'}
    if (!req.body.data) {
      throw new CodeError(
        "Vous devez donner un parcours dans 'data'",
        status.BAD_REQUEST
      )
    }
    const dataJSON = JSON.parse(req.body.data)
    const data = await routeModel.create({
      title: dataJSON.title,
      coordinates: dataJSON.coordinates,
      estimatedDistance: dataJSON.estimatedDistance,
      estimatedTime: dataJSON.estimatedTime,
      activityType: dataJSON.activityType,
      isPrivate: dataJSON.isPrivate,
      userId: req.user.id
    })

    // Add collection of references of places in the route after its creation
    if (dataJSON.places && dataJSON.places.ids) {
      const { ids } = dataJSON.places
      ids.forEach(async (id) => {
        const place = await placeModel.findOne({ where: { id: id } })
        await data.addPlace(place)
      })
    }
    // #swagger.reponses[201] = { description: 'New route successfully added.'}
    return res
      .status(201)
      .send({ status: status.CREATED, message: 'Nouveau parcours créé', data })
  },
  async deleteRoute (req, res) {
    // #swagger.tags = ['Routes']
    // #swagger.summary = 'Delete a route by id'
    // #swagger.parameters['id'] = { in: 'path', type: 'integer', description: 'id of the route', required: 'true' }
    // #swagger.parameters['x-access-token'] = { in: 'header', description: 'JWT token', required: 'true', type: 'string' }
    // #swagger.responses[200] = { description: 'Route successfully deleted'}

    if (!has(req.params, 'id')) throw new CodeError('ID manquant', status.BAD_REQUEST)
    const routeExists = await routeModel.findOne({
      where: { id: req.params.id }
    })

    // #swagger.responses[404] = { description: 'Route not found'}
    if (!routeExists) {
      throw new CodeError("Le parcours n'existe pas", status.NOT_FOUND)
    }

    await routeModel.destroy({ where: { id: req.params.id } })
    res.json({ status: status.OK, message: 'Parcours supprimé' })
  }
}
