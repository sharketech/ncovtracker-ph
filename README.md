# ncovtracker-ph
Rest client wrapper API for [ncovtracker.doh.gov.ph](https://ncovtracker.doh.gov.ph)


# Getting started
Clone the repository using something like [git](http://git-scm.com/).
You'll need [node](http://nodejs.org/) 8 or higher installed on your local machine.


# Build
Run this command to install:

``` bash
$ npm install
```


# Testing
Run this command to test the installation.

``` bash
$ npm run test
```


# List of endpoints

| Endpoint          | Description  |
| ------------------| ------------ |
| cases             | List of cases in the Philippines |
| cases-overseas    | List of cases for Filipino in other countries |
| cases-foreigner   | List of cases for foreigners in the Philippines |
| facility          | Count cases by health facilities |
| age_group         | Count cases by age group |
| count             | Count number of tests conducted, confirmed, recovered, deaths, PUMs, PUIs |
| trend             | Get trend |


# Examples


## Basic usage using Promise.

    const NcovTrackerPH = require('./ncovtracker-ph');
    const client = new NcovTrackerPH.RestClient();

    client.request('count')
        .then(res => console.log(res))
        .catch(err => console.error(err));


## Basic usage using Async/Await.

    (async  () => {
        try {
            res = await client.request('cases');
            console.log(res);
        }
        catch(e) {
            console.error(e);
        }
    })();


## Using preset statistics.

    request('cases', {
        stats: "count_by_residence"
    })


## Using custom query.

    request('count', { 
        custom: {
            outStatistics: `[{"statisticType":"sum","onStatisticField":"confirmed","outStatisticFieldName":"value"}]`,
            resultOffset: '',
            resultRecordCount: '',
        }
    })


## Notes: 
    If "sum" is used in [statisticType], [resultOffset] and [resultRecordCount] must be cleared. 
    outStatistics: `[{"statisticType":"sum","onStatisticField":"tests|confirmed|PUMs|PUIs|recovered|deaths","outStatisticFieldName":"value"}]`
    resultOffset: '',
    resultRecordCount: '',