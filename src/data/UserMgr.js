import axios from "axios";
import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8'


class UserMgr {

  constructor(managementApiOptions) {
    this.managementApiOptions = managementApiOptions;
    this.AutorizationToken = Base64.stringify(Utf8.parse(`${window._env_.APP_ID}:${window._env_.APP_SECRET}`))
  }

  loginUser(user, pass, responseSet) {
    if (!user || !pass) {
      return responseSet({ success: false, msg: "Preencha os campos de utilizador e password." });
    }
    var data = JSON.stringify({
      "name": user,
      "password": pass
    });

    var config = {
      method: 'post',
      url: `http://${this.managementApiOptions.keyRockIp}:${this.managementApiOptions.keyRockPort}/v1/auth/tokens`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        responseSet({ success: true, token: response.headers['x-subject-token'] })
        console.info("Login Success");
      })
      .catch(function (error) {
        console.info("Login Failed");
        console.info(error);
        responseSet({ success: false, errorMsg: 'Erro' })
      });
  }


  getUserId = (token, setId) => {
    var config = {
      method: 'get',
      url: `http://${this.managementApiOptions.keyRockIp}:${this.managementApiOptions.keyRockPort}/v1/auth/tokens`,
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-token': token,
        'X-Subject-token': token
      }
    };

    axios(config)
      .then(function (response) {
        setId(response.data.User.id);
      })
      .catch(function (error) {
        console.log(error)
      });
  }

  getAccessToken(user, pass, setAccessToken) {
    let data = `grant_type=password&username=${user}&password=${pass}&scope=permanent`
    let config = {
      method: 'post',
      url: `http://${this.managementApiOptions.keyRockIp}:${this.managementApiOptions.keyRockPort}/oauth2/token`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Authorization': 'Basic ' + this.AutorizationToken
      },
      data: data
    };
    axios(config)
      .then(function (response) {
        setAccessToken(response.data.access_token);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  isUserAdmin = (userData, setAdmin) => {
    let config = {
      method: 'get',
      url: `http://${this.managementApiOptions.keyRockIp}:${this.managementApiOptions.keyRockPort}/v1/applications/${userData.appId}/users/${userData.id}/roles`,
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-token': userData.token,
        'X-Subject-token': userData.token
      }
    };

    axios(config)
      .then(function (response) {
        setAdmin(false);
        response.data.role_user_assignments.forEach((el) => {
          if (el.role_id === userData.roleAdminId) {
            setAdmin(true);
            return;
          }
        })

      })
      .catch(function (error) {
        console.log(error)
      });
  }

  getRoleAdminId = (userData, setRoleAdminId) => {
    const adminRoleName = this.managementApiOptions.adminRoleName;
    var config = {
      method: 'get',
      url: `http://${this.managementApiOptions.keyRockIp}:${this.managementApiOptions.keyRockPort}/v1/applications/${userData.appId}/roles`,
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-token': userData.token,
        'X-Subject-token': userData.token
      }
    };

    axios(config)
      .then(function (response) {
        response.data.roles.forEach((el) => {
          if (el.name === adminRoleName) {
            setRoleAdminId(el.id);
            return;
          }
        })
      })
      .catch(function (error) {
        console.log(error)
      });
  }


  getAppIdInIDM = (token, setAppId) => {
    const appNameIdm = this.managementApiOptions.appNameIDM;
    var config = {
      method: 'get',
      url: `http://${this.managementApiOptions.keyRockIp}:${this.managementApiOptions.keyRockPort}/v1/applications`,
      headers: {
        'Content-Type': 'application/json',
        //'withCredentials': true,
        'X-Auth-token': token,
        'X-Subject-token': token
      }
    };

    axios(config)
      .then(function (response) {
        response.data.applications.forEach((el) => {
          if (el.name === appNameIdm) {
            setAppId(el.id);
            return;
          }
        })
      })
      .catch(function (error) {
        console.log(error)
      });
  }

}


export default UserMgr;