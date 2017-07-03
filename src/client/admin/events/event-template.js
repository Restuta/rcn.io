export default ({id, name, shortId}) => `{
  "id": "${id}",
  "name": "${name}",
  "status": "", // Canceled or Moved
  // "cancelationReason" : "plain text reason given by promoter",
  // "movedToEventId": "id of event it is moved to or leave empty",
  "type": "",
  "discipline": "Road",
  "date": "",
  "usacPermit": "",
  "location": {
    // "name": "",
    "streetAddress": "",
    "city": "",
    "state": "",
    // "zip": "",
    // "lat": null,
    // "long": null
  },
  // "websiteUrl": null,
  // "resultsUrl": null,
  // "promoters": [],
  // "promoterInfo": null,
  // "registrationUrl": "",
  // "flyer": {
  //   "name": "",
  //   "url": "",
  //   "mimeType": "application/pdf"
  // },
  // "series": [],
  "isDraft" : false,
  "_shortId" : "${shortId}"
}`
