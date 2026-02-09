import * as XML2JS from 'xml2js';

export const parseXml2Js = async (responseValue: string): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    XML2JS.parseString(responseValue, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};
