// Import environment variables
require('dotenv').config();

// Import libs
const axios = require('axios');

module.exports = {

    // GET request
    GET: async (url, path, query) => {
        return new Promise((resolve) => {
            axios.get(url + path, {
                params: query,
            })
                .then(res => {
                    resolve({
                        success: true,
                        data: res.data,
                        error: null,
                    });
                })
                .catch(err => {
                    resolve({
                        success: false,
                        data: null,
                        error: err,
                    });
                });
        });
    },

    // POST request
    POST: async (url, path, data) => {
        return new Promise((resolve) => {
            axios.post(url + path, data)
                .then(res => {
                    resolve({
                        success: true,
                        data: res.data,
                        error: null,
                    });
                })
                .catch(err => {
                    resolve({
                        success: false,
                        data: null,
                        error: err,
                    });
                });
        });
    },

    Login: async function(username, password) {
        let res = await this.POST(process.env.ENDPOINT, process.env.API_LOGIN,
            {
                'data':{
                    'encryptedLoginPassword': null,
                    'judgeLoginPossibleFlg': false,
                    'loginUserId': username,
                    'plainLoginPassword': password,
                },
                'encryptedLoginPassword': password,
                'langCd': '',
                'loginUserId': username,
                'plainLoginPassword': null,
                'productCd': 'ap',
                'subProductCd': 'apa',
            });

        if (!res.success) {
            return false;
        }

        res = res.data;
        res = decodeURIComponent(res);
        res = JSON.parse(res);

        return res.data;
    },

    LoginURI: async function(username, password) {
        const data = await this.Login(username, password);

        if (!data) {
            return false;
        }

        data.encryptedPassword = encodeURIComponent(data.encryptedPassword);
        return data;
    },

    // GetEncryptedPasswordPure: async function(username, password) {
    //     let res = await this.POST(process.env.ENDPOINT, process.env.API_LOGIN,
    //         {
    //             'data':{
    //                 'encryptedLoginPassword': null,
    //                 'judgeLoginPossibleFlg': false,
    //                 'loginUserId': username,
    //                 'plainLoginPassword': password,
    //             },
    //             'encryptedLoginPassword': password,
    //             'langCd': '',
    //             'loginUserId': username,
    //             'plainLoginPassword': null,
    //             'productCd': 'ap',
    //             'subProductCd': 'apa',
    //         });

    //     if (!res.success) {
    //         return false;
    //     }

    //     res = res.data;
    //     res = decodeURIComponent(res);
    //     res = JSON.parse(res);

    //     return res.data.encryptedPassword;
    // },

    // GetEncryptedPasswordURI: async function(username, password) {
    //     const enPass = await this.GetEncryptedPasswordPure(username, password);

    //     if (!enPass) {
    //         return false;
    //     }

    //     return encodeURIComponent(enPass);
    // },

    GetSchedule: async function(username, encryptedPassword, semester = 0, term = 0) {
        let res = await this.POST(process.env.ENDPOINT, process.env.API_SCHEDULE,
            {
                'data':{
                    'gakkiNo': semester,
                    'kaikoNendo': term,
                },
                'encryptedLoginPassword':encryptedPassword,
                'langCd':'',
                'loginUserId': username,
                'plainLoginPassword':null,
                'productCd':'ap',
                'subProductCd':'apa',
            });

        if (!res.success) {
            return false;
        }

        res = res.data;
        res = decodeURIComponent(res);
        res = JSON.parse(res);
        return {
            'origin': res,

            'semester': res.data.gakkiNo,
            'term': res.data.nendo,
            'termDisplayName': res.data.gakkiName,
            'schedule': res.data.jgkmDtoList,
        };
    },

    GetLectureStatus: async function(username, encryptedPassword, lecture) {
        let res = await this.POST(process.env.ENDPOINT, process.env.API_LECTURE,
            {
                'data': {
                    'gakkiNo': lecture.gakkiNo,
                    'jigenNo': lecture.jigenNo,
                    'jugyoCd': lecture.jugyoCd,
                    'jugyoKbn': lecture.jugyoKbn,
                    'kaikoNendo': lecture.kaikoNendo,
                    'kaikoYobi': lecture.kaikoYobi,
                    'nendo': lecture.nendo,
                },
                'encryptedLoginPassword': encryptedPassword,
                'langCd': '',
                'loginUserId': username,
                'plainLoginPassword': null,
                'productCd': 'ap',
                'subProductCd': 'apa',
            });

        if (!res.success) {
            return false;
        }

        res = res.data;
        res = decodeURIComponent(res);
        res = JSON.parse(res);
        return res;
    },

    GetHomeUrl: async function(username, password) {
        let url = process.env.ENDPOINT + process.env.API_HOME;

        let query = {
            'encryptedPassword': decodeURIComponent(password),
            'formId': null,
            'funcId': null,
            'paramaterMap': null,
            'password': null,
            'userId': username,
        };
        query = JSON.stringify(query);
        query = encodeURIComponent(query);

        url += '?webApiLoginInfo=' + query;

        return url;
    },
};

