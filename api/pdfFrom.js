import { getPdf } from '../service/convert.js';
import { stdResponse, invalidRequest, stdPostBody } from "../service/requestHelpers.js";
// Cache header max age
const maxAge = 24 * 60 * 60

export default async function handler(req, res) {
  // destructing GET params after ? available in this object
  var { url, type, responseType } = req.query;
  // use this if POST data is what's being sent
  const body = stdPostBody(req);
  // fallback support for post on both values
  if (!url && body && body.url) {
    url = body.url;
  }
  if (!type && body && body.type) {
    type = body.type;
  }
  if (!responseType && body && body.responseType) {
    responseType = body.responseType;
  }
  // type allows switching between html or link but is optional
  if (type === null) {
    type = 'link';
  }
  // type allows switching between html or link but is optional
  if (responseType === null) {
    responseType = 'application/pdf';
  }
  // url required
  if (url === null) {
    res = invalidRequest(res, 'missing `url` param');
  }
  else {
    console.log(`Converting: ${ url }`)		
    const pdfBuffer = await getPdf(url, type)
		if (!pdfBuffer) {
      res = invalidRequest(res, 'Error: could not generate PDF', 400);
    }
    else {
      stdResponse(res, pdfBuffer,{methods: "GET,OPTIONS", cache: maxAge, type: responseType});
    }
  }
}