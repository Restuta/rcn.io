const log = require('server/utils/log')
const { keyBy, map, flow, orderBy, minBy, get, toLower, toNumber, isNaN: isNotANumber } = require('lodash/fp')
const promoters = require('client/temp/data/2017-ncnca-promoters.js')
const { normalizeSpaces } = require('../utils')
const leven = require('leven')

// gets USAC club id from urls like http://usacycling.org/clubs/index.php?club=123
const getClubIdFromUrl = url => {
  const matches = url.match(/club=(\d+)/)
  const clubId = toNumber(get('[1]', matches))

  return isNotANumber(clubId) ? '' : clubId
}

const promotersByClubId = keyBy('usacClubId')(promoters)

// const promotersById = keyBy('id', promoters)

// TODO: use const leven = require('leven');
const parsePromoter = promoterRaw => {
  const clubId = getClubIdFromUrl(promoterRaw.url)

  let matchingPromoter = promotersByClubId[clubId]

  // check if promoters name is similar to what we have, if not, fail
  // TODO: replace failure below with update of the promoter name
  if (matchingPromoter) {
    const levenDistance = leven(toLower(promoterRaw.club), toLower(matchingPromoter.name))

    if (levenDistance >= 3) {
      log.warn(
        `Found matching prmoter for usac clubId: ${clubId}, but promoter names ` +
        `do not match, USAC name: "${promoterRaw.club}", RCN name: "${matchingPromoter.name} \n"`
      )
    }
  } else {
    const normalizedPromoterName = normalizeSpaces(promoterRaw.club)
    const lowercasePromoterName = toLower(normalizedPromoterName)

    const closestMatch = flow(
      map(x =>({
        name: x.name,
        distance: `distance: ${leven(lowercasePromoterName, x.name.toLowerCase())}`
      })),
      minBy('distance'),
      orderBy(['distance'], ['asc'])
    )(promoters)

    // TODO: add slack notification
    log.error(
      `NO MATCH, club: ${promoterRaw.club}, name: ${promoterRaw.raceDirector}, id: ${clubId}` +
        `, closest match that was found: "${closestMatch.join(', ')}"`)

    matchingPromoter = {
      id: `prm-usac-${clubId}`,
      name: normalizedPromoterName,
      contactName: normalizeSpaces(promoterRaw.raceDirector),
      usacClubId: clubId
    }

    log.info(
      'Despite the error, proceeding with creation of the promoter, but make sure ' +
        'it is stored in the list of promoters:'
    )

    log.info(JSON.stringify(matchingPromoter))
    //eslint-disable-next-line
    console.log()
  }

  return [matchingPromoter]
}

module.exports = parsePromoter
