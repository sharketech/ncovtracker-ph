/*
Copyright 2020 SHARKE Technologies. Licensed under The MIT License. http://opensource.org/licenses/MIT 
Contributors:  Ariel De Castro <ariel.decastro@sharke.tech> 
*/


const NcovTrackerPH = require('../ncovtracker-ph');
const client = new NcovTrackerPH.RestClient();


(async () => {

    // get last update date/time
    await client.request('nCoV_dashboard_time_stamp')
        .then(res => console.log(res.features))
        .catch(err => console.error(err));

    // get number of tests|confirmed|PUMs|PUIs|recovered|deaths
    await client.request('slide_fig')
        .then(res => console.log(res.features))
        .catch(err => console.error(err));

    // get number of confirmed cases
    await client.request('slide_fig', {
        custom: {
            outStatistics: `[{"statisticType":"sum","onStatisticField":"confirmed","outStatisticFieldName":"value"}]`,
            resultOffset: '',
            resultRecordCount: '',
        }
    })
        .then(res => console.log(res.features))
        .catch(err => console.error(err));

    // list of cases in the Philippines
    await client.request('PH_masterlist', {
        custom: {
            resultOffset: 0,
            resultRecordCount: 1000,
        }
    })
        .then(res => console.log(res.features))
        .catch(err => console.error(err));

    // list of cases for Filipino in other countries
    await client.request('OF_masterlist')
        .then(res => console.log(res.features))
        .catch(err => console.error(err));

    // list of cases for foreigners in the Philippines
    await client.request('FN_masterlist')
        .then(res => console.log(res.features))
        .catch(err => console.error(err));

    // count cases by residence
    await client.request('PH_masterlist', { stats: "count_by_residence" })
        .then(res => console.log(res.features))
        .catch(err => console.error(err));

    // count cases by age group
    await client.request('age_group', { stats: "count_by_age_group" })
        .then(res => console.log(res.features))
        .catch(err => console.error(err));

    // count cases by health facility
    await client.request('conf_fac_tracking')
        .then(res => console.log(res.features))
        .catch(err => console.error(err));

    // get trend
    await client.request('confirmed')
        .then(res => console.log(res.features))
        .catch(err => console.error(err));

})();



