import axios from "axios";

class deviceMgr {

    constructor(managementApiOptions) {
        this.managementApiOptions = managementApiOptions;
    }

    // managementApiOptions.managementApiIp = process.env.MANAGEMENT_API_IP || managementApiConfigOptions.managementApiIp
    // managementApiOptions.managementApiPort = process.env.MANAGEMENT_API_Port || managementApiConfigOptions.managementApiPort

    registerDevice(userData, devId, devEui, optAttrib, responseSet) {
        if (!devId) {
            return responseSet({ success: false, msg: "DevID não foi indicado." });
        }
        let attributes = [];
        if (optAttrib)
            attributes = optAttrib.map(el => {
                return { 'object_id': el, 'name': el, 'type': 'Number' }
            }
            )
        axios.post(
            `http://${this.managementApiOptions.managementApiIp}:${this.managementApiOptions.managementApiPort}/api/registerdevice`,
            {
                devID: devId,
                devEui: devEui,
                optionalAttributes: attributes
            },
            {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${userData.accessToken}`
                }
            }
        ).then((res) => {
            responseSet({ success: true, msg: res.data })
            console.log("Registered")
        }).catch(error => {
            responseSet({ success: false, msg: error })
            console.log(error)
        });
    }

    unregisterDevice(userData, devId, responseSet) {
        if (!devId) {
            return responseSet({ success: false, msg: "DevID não foi indicado." });
        }
        axios.post(
            `http://${this.managementApiOptions.managementApiIp}:${this.managementApiOptions.managementApiPort}/api/unregisterdevice`,
            {
                devID: devId
            },
            {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${userData.accessToken}`
                }
            }
        ).then((res) => {
            responseSet({ success: true, msg: res.data })
            console.log("Unregistered")
        }).catch(error => {
            responseSet({ success: false, msg: error })
            console.log(error)
        });
    }

    listRegisteredDevices(userData, responseSet) {
        console.log("List Devices")
        axios.get(
            `http://${this.managementApiOptions.managementApiIp}:${this.managementApiOptions.managementApiPort}/api/devices`,
            {headers:{
                'Authorization': `Bearer ${userData.accessToken}`}}
        )
            .then((res) => {
                let devices = [];
                res.data.devicesIotAgent.map(
                    (dev) => {
                        return devices.push(dev.device_id)
                    })
                console.log("Get Devices:")
                console.log(devices);
                console.log(res.data);
                responseSet({ success: true, data: devices })
            }).catch(error => {
                responseSet({ success: false, msg: error })
                console.log(error)
            });
    }

    async listActiveDevices(userData) {
        //await axios.get(this.managementApiOptions.orionURI + "entities/",
        let res = await axios.get(`http://${this.managementApiOptions.orionIp}:${this.managementApiOptions.orionPort}/v2/entities/`,
            {
                headers: {
                    "Fiware-Service": this.managementApiOptions.fiwareService,
                    "Fiware-ServicePath": this.managementApiOptions.fiwareServicePath,
                    'Authorization': `Bearer ${userData.accessToken}`
                },
                params: {
                    type: this.managementApiOptions.deviceType
                }
            });
        return res.data;
    }

    async GetLastMonthMaxReadings(userData, deviceName, attributeName, beginDate, endDate, resolution, aggregationType) {
        const url = `http://${this.managementApiOptions.sthIp}:${this.managementApiOptions.sthPort}/STH/v1/contextEntities/type/LoraDevice/id/${deviceName}/attributes/${attributeName}`;
        const headers = {
            "fiware-service": this.managementApiOptions.fiwareService,
            "fiware-servicepath": this.managementApiOptions.fiwareServicePath,
            'Authorization': `Bearer ${userData.accessToken}`,
            "Origin":"*"
        };
        const parameters = {
            aggrMethod: aggregationType,
            aggrPeriod: resolution,
            dateFrom: beginDate.toISOString(),
            dateTo: endDate.toISOString()
        };
        try {
            let res = await axios.get(
                url,
                {
                    headers: headers,
                    params: parameters
                }
            );
            let results = {}
            if (res.data.contextResponses) {
                res.data.contextResponses[0].contextElement.attributes[0].values.forEach(el => {
                    const origin = new Date(el._id.origin);
                    let key = new Date();
                    el.points.forEach(read => {
                        key.setDate(origin.getDate() + read.offset - 1)
                        if (read[aggregationType])
                            results[key.toISOString()] = read[aggregationType]
                    })
                })

            }
            return results;
        }
        catch (error) {
            console.log(error)
        }

    }

}

export default deviceMgr;