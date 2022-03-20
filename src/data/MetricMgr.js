import axios from "axios";

class MetricMgr {

    constructor(managementApiOptions) {
        this.managementApiOptions = managementApiOptions;
    }

    updateMetric(metricData, userData, success, error) {
        let data = JSON.stringify(
            {
                metricData: {
                    metricName: metricData.metricName,
                    scaleColors: metricData.scaleColors,
                    scaleRanges: metricData.scaleRanges
                }
            });
        let config = {
            method: 'post',
            url: `http://${this.managementApiOptions.managementApiIp}:${this.managementApiOptions.managementApiPort}/api/updatemetric`, 
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${userData.accessToken}`
            },
            data: data
        }
        console.log(config);
        axios(config)
            .then((res) => {
                success();
                console.log("Registered")
            }).catch(er => {
                error(er);
            });
    }

    getMetricRanges(userData, metric, responseSet) {
        axios.get(
            `http://${this.managementApiOptions.managementApiIp}:${this.managementApiOptions.managementApiPort}/api/colorchart`, { metric: metric,headers: {
                'Authorization': `Bearer ${userData.accessToken}`
            } }
        )
            .then((res) => {
                responseSet({ success: true, data: 'ass' })
            }).catch(error => {
                responseSet({ success: false, msg: error })
                console.log(error)
            });
    }

    getAllMetrics(userData, responseSet) {
        console.log("Tentar ->:")
        console.log(`http://${this.managementApiOptions.managementApiIp}:${this.managementApiOptions.managementApiPort}/api/getallmetrics`);
        console.log(`Bearer ${userData.accessToken}`);
        axios.get(
            `http://${this.managementApiOptions.managementApiIp}:${this.managementApiOptions.managementApiPort}/api/getallmetrics`, {
                headers: {
                    'Authorization': `Bearer ${userData.accessToken}`
                }
              }
        )
            .then((res) => {
                responseSet({ success: true, data: res.data })
            }).catch(error => {
                responseSet({ success: false, msg: error, data:[] })
                console.log("Error:->")
                console.log(error)
            });
    }

    saveNewMetric(metricData,userData, success, error) {
        
        let data = JSON.stringify(
            {
                metricData: {
                    metricName: metricData.metricName,
                    scaleColors: metricData.scaleColors,
                    scaleRanges: metricData.scaleRanges
                }
            });
        let config = {
            method: 'post',
            url:`http://${this.managementApiOptions.managementApiIp}:${this.managementApiOptions.managementApiPort}/api/addmetric`,
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${userData.accessToken}`
            },
            data: data
        }
        console.log(config);
        axios(config)
            .then((res) => {
                success();
                console.log("Registered")
            }).catch(er => {
                error(er);
            });
    }

    registerDevType(userData, devTypeName, metricsNames, registerResponseSet){
        let data = JSON.stringify(
            {
                devTypeData: {
                    devTypeName: devTypeName,
                    metricNames: metricsNames,
                }
            });
        let config = {
            method: 'post',
            url:`http://${this.managementApiOptions.managementApiIp}:${this.managementApiOptions.managementApiPort}/api/adddevtype`,
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${userData.accessToken}`
            },
            data: data
        }
        console.log(config);
        axios(config)
            .then((res) => {
                registerResponseSet({success:true})
                console.log("Dev Type Registered")
            }).catch(er => {
                registerResponseSet({success:false, msg: er.message})
                console.log("Dev Type Register error")
            });
    }

    getAllDevTypes(userData,responseSet){
        axios.get(
            `http://${this.managementApiOptions.managementApiIp}:${this.managementApiOptions.managementApiPort}/api/getalldevtype`, {
                headers: {
                    'Authorization': `Bearer ${userData.accessToken}`
                }
              }
        )
            .then((res) => {
                responseSet({ success: true, data: res.data })
            }).catch(error => {
                responseSet({ success: false, msg: error })
                console.log(error)
            });
    }

}

export default MetricMgr;