/*
Copyright 2020 SHARKE Technologies. Licensed under The MIT License. http://opensource.org/licenses/MIT 
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

    /*
   https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/PH_masterlist/FeatureServer/0?f=json
   https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/OF_masterlist/FeatureServer/0?f=json
   https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/FN_masterlist/FeatureServer/0?f=json
   https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/hosplevel12018/FeatureServer/0?f=json
   https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/hosplevel22018/FeatureServer/0?f=json
   https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/hosplevel32018/FeatureServer/0?f=json
   https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/conf_fac_tracking/FeatureServer/0?f=json
   https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/PUI_fac_tracing/FeatureServer/0?f=json
   https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/age_group/FeatureServer/0?f=json
   https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/confirmed/FeatureServer/0?f=json
   https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/slide_fig/FeatureServer/0?f=json
   https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/PUI_graph/FeatureServer/0?f=json
   https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/commodities/FeatureServer/0?f=json
    */

    "PH_masterlist": {
        endpoint: `/PH_masterlist/FeatureServer/0/query`,
        defaults: {
            orderByFields: `sequ desc`,
        },
        stats: {
            "count_by_residence": {
                groupByFieldsForStatistics: `residence`,
                outStatistics: `[{"statisticType":"count","onStatisticField":"FID","outStatisticFieldName":"value"}]`,
                orderByFields: `value desc`,
            }
        }
    },

    "OF_masterlist": {
        endpoint: `/OF_masterlist/FeatureServer/0/query`,
        defaults: {
            orderByFields: `num desc`,
        }
    },

    "FN_masterlist": {
        endpoint: `/FN_masterlist/FeatureServer/0/query`,
        defaults: {
            orderByFields: `FID desc`,
        }
    },

    "conf_fac_tracking": {
        endpoint: `/conf_fac_tracking/FeatureServer/0/query`,
        defaults: {
            orderByFields: `ObjectId asc`,
        }
    },

    "age_group": {
        endpoint: `/age_group/FeatureServer/0/query`,
        defaults: {},
        stats: {
            "count_by_age_group": {
                groupByFieldsForStatistics: `age_categ,sex`,
                outStatistics: `[{"statisticType":"count","onStatisticField":"FID","outStatisticFieldName":"value"}]`,
            }
        }
    },

    "slide_fig": {
        endpoint: `/slide_fig/FeatureServer/0/query`,
        defaults: {},
    },

    "confirmed": {
        endpoint: `/confirmed/FeatureServer/0/query`,
        defaults: {
            orderByFields: `date asc`,
        }
    },

    "PUI_fac_tracing": {
        endpoint: `/PUI_fac_tracing/FeatureServer/0/query`,
    },

    "hosplevel12018": {
        endpoint: `/hosplevel12018/FeatureServer/0/query`,
    },

    "hosplevel22018": {
        endpoint: `/hosplevel22018/FeatureServer/0/query`,
    },

    "hosplevel32018": {
        endpoint: `/hosplevel32018/FeatureServer/0/query`,
    },

    "PUI_graph": {
        endpoint: `/PUI_graph/FeatureServer/0/query`,
    },

    "commodities": {
        endpoint: `/commodities/FeatureServer/0/query`,
    },


    /*
    https://services.arcgis.com/5T5nSi527N4F7luB/arcgis/rest/services/nCoV_dashboard_time_stamp/FeatureServer/0?f=json
    https://services.arcgis.com/5T5nSi527N4F7luB/arcgis/rest/services/Historic_adm0_v3/FeatureServer/0?f=json
    https://services.arcgis.com/5T5nSi527N4F7luB/arcgis/rest/services/Cases_by_country_pt_V3/FeatureServer/0?f=json
    https://services.arcgis.com/5T5nSi527N4F7luB/arcgis/rest/services/COVID_19_CasesByAdm1(pt)_VIEW/FeatureServer/0?f=json
    https://services.arcgis.com/5T5nSi527N4F7luB/arcgis/rest/services/COVID_19_CasesByCountry(pt)_VIEW/FeatureServer/0?f=json
    https://services.arcgis.com/5T5nSi527N4F7luB/arcgis/rest/services/COVID_19_CasesByCountry(pl)_VIEW/FeatureServer/0?f=json
    */

    "nCoV_dashboard_time_stamp": {
        url: `https://services.arcgis.com/5T5nSi527N4F7luB/arcgis/rest/services`,
        endpoint: `/nCoV_dashboard_time_stamp/FeatureServer/0/query`,
        defaults: {
            resultOffset: 0,
            resultRecordCount: 1,
        }
    },

    "Historic_adm0_v3": {
        url: `https://services.arcgis.com/5T5nSi527N4F7luB/arcgis/rest/services`,
        endpoint: `/Historic_adm0_v3/FeatureServer/0/query`,
    },

    "Cases_by_country_pt_V3": {
        url: `https://services.arcgis.com/5T5nSi527N4F7luB/arcgis/rest/services`,
        endpoint: `/Cases_by_country_pt_V3/FeatureServer/0/query`,
    },

    "COVID_19_CasesByAdm1(pt)_VIEW": {
        url: `https://services.arcgis.com/5T5nSi527N4F7luB/arcgis/rest/services`,
        endpoint: `/COVID_19_CasesByAdm1(pt)_VIEW/FeatureServer/0/query`,
    },

    "COVID_19_CasesByCountry(pt)_VIEW": {
        url: `https://services.arcgis.com/5T5nSi527N4F7luB/arcgis/rest/services`,
        endpoint: `/COVID_19_CasesByCountry(pt)_VIEW/FeatureServer/0/query`,
    },

    "COVID_19_CasesByCountry(pl)_VIEW": {
        url: `https://services.arcgis.com/5T5nSi527N4F7luB/arcgis/rest/services`,
        endpoint: `/COVID_19_CasesByCountry(pl)_VIEW/FeatureServer/0/query`,
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

    request(endpoint, params = {}, method = 'GET') {

        return new Promise((resolve, reject) => {

            let url = this._url;
            let req = endpoints[endpoint];
            let args = { ...defaultRequestParams };

            if (!req) {
                reject('endpoint not found');
                return;
            }

            if (req.url) {
                url = req.url;
            }

            if (req.defaults) {
                for (var key in req.defaults) {
                    args[key] = req.defaults[key];
                }
            }

            if (params.stats && req.stats[params.stats]) {
                let stats = req.stats[params.stats];
                for (var key in stats) {
                    args[key] = stats[key];
                }
            }

            if (params.custom) {
                for (var key in params.custom) {
                    args[key] = params.custom[key];
                }
            }

            Request({
                url: url + req.endpoint,
                method: method,
                qs: args,
                agent: this._agent,
                json: true,
            }, (e, res, body) => {

                if (e) {
                    reject(e);
                    throw (e);
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