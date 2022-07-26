// Import environment variables
require('dotenv').config();

// Import libs
const axios = require('axios');
const { chromium } = require('playwright');

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

    GetLoginData: async function(username, password) {
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

    GetLoginDataURI: async function(username, password) {
        const data = await this.GetLoginData(username, password);

        if (!data) {
            return false;
        }

        data.encryptedPassword = encodeURIComponent(data.encryptedPassword);
        return data;
    },

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
        let url = process.env.ENDPOINT + process.env.API_WEBACCESS;

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

    InputAttendCode: async function(username, password, code) {
        const browser = await chromium.launch({
            headless: true,
        });

        const url = await this.GetHomeUrl(username, password);
        const page = await browser.newPage();
        await page.goto(url);


        try {
            await page.evaluate(() => {
            // eslint-disable-next-line no-undef
                $('#menuPanel').panel('open');
            });
            await page.locator('.ui-link:has-text("出席登録(スマートフォン)")').click();

            await page.waitForNavigation();
            if (await page.locator('label:has-text("出席確認終了")').count() > 0) {
                const screenshot = (await page.screenshot()).toString('base64');
                await browser.close();
                return screenshot;
            }

            const inputs = page.locator('div.mainContent input');

            for (let i = 0; i < 4; i++) {
                await inputs.nth(i).fill(code[i], {
                    timeout: 1000,
                });
            }

            await page.locator('button:has-text("出席登録する")').click({
                timeout: 1000,
            });
        }
        catch (e) {
            const screenshot = (await page.screenshot()).toString('base64');
            await browser.close();
            return screenshot;
        }

        await page.waitForNavigation();
        await page.mouse.click(1, 1);
        // await page.waitForTimeout(500);
        const screenshot = (await page.screenshot()).toString('base64');

        await browser.close();
        return screenshot;
    },

    GetLectureSyllabusUrl: async function(username, password, lecture) {
        let url = process.env.ENDPOINT + process.env.API_WEBACCESS;

        let query = {
            'encryptedPassword': decodeURIComponent(password),
            'formId': 'Pkx52301',
            'funcId': 'Pkx523',
            'paramaterMap': {
                'jugyoCd': lecture.jugyoCd,
                'nendo': lecture.nendo,
            },
            'password': null,
            'userId': username,
        };
        query = JSON.stringify(query);
        query = encodeURIComponent(query);

        url += '?webApiLoginInfo=' + query;
        return url;
    },

    GetNotificationUrl: async function(username, password) {
        let url = process.env.ENDPOINT + process.env.API_WEBACCESS;

        let query = {
            'encryptedPassword': decodeURIComponent(password),
            'formId': 'Bsd50701',
            'funcId': 'Bsd507',
            'paramaterMap': null,
            'password': null,
            'userId': username,
        };

        query = JSON.stringify(query);
        query = encodeURIComponent(query);

        url += '?webApiLoginInfo=' + query;
        return url;
    },

    GetUnreadNotificationCount: async function(username, password) {
        const url = await this.GetHomeUrl(username, password);
        const browser = await chromium.launch({
            headless: true,
        });
        const page = await browser.newPage();
        await page.goto(url);

        await page.waitForLoadState('networkidle');
        try {
            const count = await page.locator('span.noticeCount').first();
            const text = await count.innerText({
                timeout: 1000,
            });
            await browser.close();
            return text;
        }
        catch (error) {
            await browser.close();
            return '0';
        }
    },
};

