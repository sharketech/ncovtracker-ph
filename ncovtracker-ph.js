/*
Copyright 2020 SHARKE Tecnhologies. Licensed under The MIT License. http://opensource.org/licenses/MIT 
Contributors:  Ariel De Castro <ariel.decastro@sharke.tech> 
*/


const Request = require('request');
const Https = require('https');


const defaultRequestParams = {
    f: `json`,
    where: `1=1`,
    returnGeometry: false,
    spatialRel: `esriSpatialRelIntersects`,
    outFields: `*`,
    resultOffset: '0',
    resultRecordCount: '1000',
    cacheHint: true
};

const endpoints = {

    "cases": {
        endpoint: `/PH_masterlist/FeatureServer/0/query`,
        defaults: {
            orderByFields: `sequ desc`,
        },
        stats : {
            "count_by_residence" : {
                groupByFieldsForStatistics: `residence`,
                outStatistics: `[{"statisticType":"count","onStatisticField":"FID","outStatisticFieldName":"value"}]`,
                orderByFields: `value desc`,
            }
        }
    },

    "cases-overseas" : {
        endpoint: `/OF_masterlist/FeatureServer/0/query`,
        defaults: {
            orderByFields: `num desc`,
        }
    },

    "cases-foreigner" : {
        endpoint: `/FN_masterlist/FeatureServer/0/query`,
        defaults: {
            orderByFields:`FID desc`,
        }
    },

    "facility": {
        endpoint: `/conf_fac_tracking/FeatureServer/0/query`,
        defaults: {
            orderByFields: `ObjectId asc`,
        }
    },

    "age_group": {
        endpoint: `/age_group/FeatureServer/0/query`,
        defaults: { },
        stats: {
            "count_by_age_group": {
                groupByFieldsForStatistics: `age_categ,sex`,
                outStatistics: `[{"statisticType":"count","onStatisticField":"FID","outStatisticFieldName":"value"}]`,
            }
        }
    },
    
    "count" : {
        endpoint: `/slide_fig/FeatureServer/0/query`,
        defaults: { },
    },

    "trend" : {
        endpoint: `/confirmed/FeatureServer/0/query`,
        defaults: {
            orderByFields: `date asc`,
        }
    },

};

class SocketClient {
    constructor() {

    }
}

class RestClient {

    constructor() {
        this._url = 'https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services';
        this._agent = new Https.Agent({
            keepAlive: true,
            maxSockets: 2,
            keepAliveMsecs: 5000
        });
    }

    request( endpoint, params= {}, method = 'GET') {

        return new Promise( (resolve, reject) => {

            let req = endpoints[endpoint];
            let args = { ...defaultRequestParams };
            
            if(!req) {
                reject('endpoint not found');
                return;
            }            

            if(req.defaults) {
                for( var key in req.defaults) {
                    args[key] = req.defaults[key];
                }
            }

            if(params.stats && req.stats[params.stats]) {
                let stats = req.stats[params.stats];
                for( var key in stats) {
                    args[key] = stats[key];
                }
            }

            if(params.custom) {
                for( var key in params.custom) {
                    args[key] = params.custom[key];
                }
            }
            
            Request({
                url: this._url+ req.endpoint,
                method: method,
                qs: args,
                agent: this._agent,
                json: true,
            }, (e, res, body) => {

                if(e) {
                    reject(e);
                    throw(e);
                }

                resolve(body);
            });
        });
    }
}

module.exports = { 
    RestClient: RestClient,
    SocketClient: SocketClient
};