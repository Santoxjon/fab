const express = require('express');
const router = express.Router();
const matchesController = require('../controllers/matchesController');

/**
 * @swagger
 * /matches/nextMatch:
 *   get:
 *     description: Get the next match for a team
 *     parameters:
 *       - in: query
 *         name: teamName
 *         description: The name of the team
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Team name was not provided
 *       404:
 *         description: No upcoming matches for the specified team
 *     tags:
 *       - Matches
 */
router.get('/nextMatch', async (req, res, next) => {
  if (!req.query.teamName) {
    res.status(400).json({
      status: 'error',
      code: 400,
      errorCode: 'TEAM_NAME_NOT_PROVIDED',
      data: { message: 'Team name was not provided' },
    });
    return;
  }
  const teamName = req.query.teamName.toUpperCase();

  try {
    matchesController.getNextMatch(teamName).then((nextMatch) => {
      if (nextMatch && !nextMatch.error) {
        res.status(200).json({
          status: 'success',
          code: 200,
          data: { nextMatch },
        });
      } else {
        res.status(404).json({
          status: 'error',
          code: 404,
          errorCode: 'NO_UPCOMING_MATCHES',
          data: { message: 'No upcoming matches for the specified team.' },
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      code: 500,
      errorCode: 'INTERNAL_SERVER_ERROR',
      data: { message: 'Internal server error' },
    });
  }
});

module.exports = router;
