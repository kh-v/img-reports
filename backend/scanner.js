const axios = require('axios');
const qs = require('qs');
const htmlParser = require('node-html-parser');
const fs = require('fs');
const puppeteer = require('puppeteer');
const moment = require('moment-timezone');
const _ = require('lodash')

let lastScanned = {}

if (fs.existsSync(`${__dirname}/../storage/models/lastScanned.json`)) {
  lastScanned = JSON.parse(fs.readFileSync(`${__dirname}/../storage/models/lastScanned.json`).toString())
} else {
  fs.writeFileSync(`${__dirname}/../storage/models/lastScanned.json`, JSON.stringify(lastScanned, null, 4))
}

const updateLastScanned = (username, type) => {
  if (!lastScanned[username]) lastScanned[username] = {}
  lastScanned[username][type] = moment().format('X')
  fs.writeFileSync(`${__dirname}/../storage/models/lastScanned.json`, JSON.stringify(lastScanned, null, 4))
}


const delay = (time) => {
    return new Promise((resolve) => { 
        setTimeout(resolve, time)
    });
 }

const loginCookies = async (username, password, register=false) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // console.log(username, password)

    try {
        // Navigate the page to a URL
        await page.goto('https://img-corp.net/');
        await page.setViewport({width: 1080, height: 1024});
        await page.waitForSelector('#amember_login');
        
        await page.type('#amember_login', username);
        await page.type('#amember_pass', password);
        await page.click('#button')
        // await page.screenshot({path: 'example2.png'});
        await page.waitForSelector('.img-agent-banner');
        await page.waitForSelector('.agent-name');
        let name = await page.locator('.agent-name').waitHandle()
        name = (await name?.evaluate(el => el.textContent.replace('Hi!','').trim().split(/[\n\:]/gi))).map(e => {
            return e.trim()
        })

        let users = JSON.parse(fs.readFileSync(`${__dirname}/../storage/models/users.json`).toString())
        let userIndex = _.findIndex(users, u => u.username.toUpperCase() === name[2])
        if (userIndex !== -1) {
            let change = false
            if (users[userIndex].name !== name[0]) {
                users[userIndex].name = name[0]
                users[userIndex].rank = name[1]
                users[userIndex].username = name[2]
                users[userIndex].invalid_img_credential = false 
                change = true
            }

            if (users[userIndex].invalid_img_credential || users[userIndex].invalid_img_credential === undefined) {
                users[userIndex].invalid_img_credential = false 
                change =  true
            }

            if (change) fs.writeFileSync(`${__dirname}/../storage/models/users.json`, JSON.stringify(users,null,4))
        }

        // await page.screenshot({path: 'example1.png'});
        const cookies = await page.cookies()
        await browser.close();

        let cookieStr = []
        for (let i = 0; i < cookies.length; i++) {
            const c = cookies[i];
            cookieStr.push(`${c.name}=${c.value}`)
        }

        if (register) {
            return {
                name: name[0],
                username: name[2],
                rank: name[1],
                invalid_img_credential: false
            }
        } else {
            return cookieStr.join('; ')
        }
    } catch (error) {
        let users = JSON.parse(fs.readFileSync(`${__dirname}/../storage/models/users.json`).toString())
        let userIndex = _.findIndex(users, u => u.username.toUpperCase() === username.toUpperCase())
        if (userIndex !== -1) {
            users[userIndex].invalid_img_credential = true 
            fs.writeFileSync(`${__dirname}/../storage/models/users.json`, JSON.stringify(users,null,4))
        }

        await browser.close();
        return null;
    }
}

const commissionReports = async (ax, username) => {
    if (!fs.existsSync(`${__dirname}/../storage/data/${username}/commission`)) {
        fs.mkdirSync(`${__dirname}/../storage/data/${username}/commission/reports`, { recursive: true })
        fs.writeFileSync(`${__dirname}/../storage/data/${username}/commission/details.json`, JSON.stringify({
            start: '2020-01-01',
            end: '2020-01-01',
            first_report: null,
            last_report: null,
            first_commission: null,
            last_commission: null,
            new: true
        }, null,4))
        fs.writeFileSync(`${__dirname}/../storage/data/${username}/commission/dates.json`, '[]')
    }

    let details = JSON.parse(fs.readFileSync(`${__dirname}/../storage/data/${username}/commission/details.json`).toString())
    let all_dates = JSON.parse(fs.readFileSync(`${__dirname}/../storage/data/${username}/commission/dates.json`).toString())

    let dates = []
    let d = moment(details.start, 'YYYY-MM-DD');
    let firstChecking =  details.new 
    if (details.new) {
        details.new = false
    } else {
        d = moment(details.last_report, 'YYYY-MM-DD');
        d.add(1, 'day')
    }

    while(d <= moment()) {
        let year = d.format('YYYY')
        let month = d.format('MM')
        let last_of_month = moment(`${year}-${month}-01`, 'YYYY-MM-DD').endOf('month').format('DD')
       
        if (d < moment(`${year}-${month}-08`, 'YYYY-MM-DD')) {
            let _d = `${year}-${month}-08`
            d = moment(_d, 'YYYY-MM-DD')
            dates.push(d.format('YYYY/MM/DD'))
        } else if (d < moment(`${year}-${month}-15`, 'YYYY-MM-DD'))  {
            let _d = `${year}-${month}-15`
            d = moment(_d, 'YYYY-MM-DD')
            dates.push(d.format('YYYY/MM/DD'))
        } else if (d < moment(`${year}-${month}-22`, 'YYYY-MM-DD'))  {
            let _d = `${year}-${month}-22`
            d = moment(_d, 'YYYY-MM-DD')
            dates.push(d.format('YYYY/MM/DD'))
        } else if (d < moment(`${year}-${month}-${last_of_month}`, 'YYYY-MM-DD'))  {
            let _d = `${year}-${month}-${last_of_month}`
            d = moment(_d, 'YYYY-MM-DD')
            dates.push(d.format('YYYY/MM/DD'))
        }

        d = d.add(1, 'day')
    }   
    dates = dates.filter(d => moment(d, 'YYYY-MM-DD') <= moment())
    console.log(dates)

    let keys = [
        'Buss Type',
        'Pol No', 
        'Name of Insure',
        'Agent Name',
        'Buss Date',
        'Rate',
        'Premium',
        'Gross',
        'WTax',
        'CBR',
        'NET'
    ]

    let newReports = []
    for (let i = 0; i < dates.length; i++) {
        const date = dates[i];
        console.log(date)

        const params = qs.stringify({
            'cycle': date,
            'button': 'Generate Report' 
        });

        const config = {
            method: 'post',
            url: 'https://img-corp.net/membersonly/commission_statement_src.php',
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data : params
        };

        let entryData = []
        let withReport = false
        let _date = date.replace(/\//g, '-')
        await ax(config)
        .then(function (response) {
            if (all_dates.indexOf(_date) == -1)  all_dates.push(_date)
            let r = htmlParser.parse(response.data)
            let com_no = r.querySelector('table:nth-child(1) > tr > td:nth-child(2) > table > tr:nth-child(1) > td:nth-child(2)')
            // console.log(date, com_no.innerText.trim()  !== '' )
            if (com_no.innerText.trim() !== '') {
                withReport = true
                let entries = r.querySelectorAll('table:nth-child(5) tr')
                for (let i = 1; i < entries.length; i++) {
                    const e = entries[i];
                    let childs = e.querySelectorAll('td')
                    if (childs.length > 0) {
                        let d = {}
                        for (let ii = 0; ii < childs.length; ii++) {
                            const c = childs[ii];
                            // console.log(c.innerText)
                            
                            if (ii > 4) {
                                d[keys[ii]] = parseFloat(c.innerText.replace(/,/g,''))
                            } else {
                                d[keys[ii]] = c.innerText
                            }
                        }
                        entryData.push(d)
                    }
                }
            }
            if (withReport) {
                newReports.push(`${date} - ${ entryData.length > 0 ?  "With Commission" : "No Commission"}`)
            }
            console.log(date, withReport ? "With Data" : "No Data" )
        })
        .catch(function (error) {
            console.log(error);
        });
        
        console.log(withReport)

        if (entryData.length > 0) {
            details.last_commission = _date
            if (details.first_commission === null || details.first_commission === "") {
                details.first_commission =  _date
            }
        }

        if (withReport) {
            details.last_report = _date
            if (details.first_report === null || details.first_report === "") {
                details.first_report =  _date
            }
            fs.writeFileSync(`${__dirname}/../storage/data/${username}/commission/reports/${_date}.json`, JSON.stringify(entryData, null, 4))
        }
        details.end = _date

        fs.writeFileSync(`${__dirname}/../storage/data/${username}/commission/details.json`, JSON.stringify(details,null, 4))
    };

    all_dates = _.uniq(all_dates)
    fs.writeFileSync(`${__dirname}/../storage/data/${username}/commission/dates.json`, JSON.stringify(all_dates,null, 4))

    if (firstChecking) fs.writeFileSync(`${__dirname}/../storage/data/${username}/commission/first_scan.json`, JSON.stringify(newReports, null, 4))
    fs.writeFileSync(`${__dirname}/../storage/data/${username}/commission/last_scan.json`, JSON.stringify(newReports, null, 4))

}

const teamReport = async (ax,username) => {
    if (!fs.existsSync(`${__dirname}/../storage/data/${username}/team/reports`)) {
        fs.mkdirSync(`${__dirname}/../storage/data/${username}/team/reports`, { recursive: true })
        fs.writeFileSync(`${__dirname}/../storage/data/${username}/team/details.json`, JSON.stringify({
            start: '2020-01-01',
            end: '2020-01-01',
            first_report: null,
            last_report: null,
            new: true
        }, null,4))
        fs.writeFileSync(`${__dirname}/../storage/data/${username}/team/dates.json`, '[]')
    }

    let details = JSON.parse(fs.readFileSync(`${__dirname}/../storage/data/${username}/team/details.json`).toString())
    let all_dates = JSON.parse(fs.readFileSync(`${__dirname}/../storage/data/${username}/team/dates.json`).toString())

    let dates = []
    let d = moment(details.start, 'YYYY-MM-DD').startOf('month');

    let firstChecking =  details.new 
    if (details.new) {
        details.new = false
    } else {
        d = moment(details.end, 'YYYY-MM-DD').startOf('month');
        // d.add(1, 'day')
    }

    while(d <= moment().startOf('month')) {
        dates.push(d.format('YYYY-MM-DD'))
        d = d.add(1, 'month')
    }   

    const types = [
        'MD6',
        'MD5',
        'MD4',
        'MD3',
        'MD2',
        'MD1',
        'BASESHOP',
        'PERSONAL',
    ]

    let month_today = moment().startOf('month').format('YYYY-MM-DD')
    dates = dates.filter(d => {
        return d === month_today || all_dates.indexOf(d) === -1
    })

    let newRecruit = {}
    let todays_date = moment().tz('Asia/Manila').format('MM/DD/YYYY')
    for (let i = 0; i < dates.length; i++) {
        const date = dates[i];
        const year = moment(date,'YYYY-MM-DD').format('YYYY')
        const month = moment(date,'YYYY-MM-DD').format('MMMM')
        let dir = `${__dirname}/../storage/data/${username}/team/reports/${year}/${month}`
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
            
        let entryData = {}
        let _date = date.replace(/\//g, '-')
        for (let ii = 0; ii < types.length; ii++) {
            const type = types[ii];
            const params = qs.stringify({
                type,
                year,
                month: moment(date,'YYYY-MM-DD').format('MM'),
                button:' Generate Report'
            });

            const config = {
                method: 'post',
                url: 'https://img-corp.net/membersonly/my-team.php',
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data : params
            };

            await ax(config)
            .then(function (response) {
                if (all_dates.indexOf(_date) == -1)  all_dates.push(_date)
                let r = htmlParser.parse(response.data)
                let count = parseInt(r.querySelector('#content > div:nth-child(2) > div > p').innerText); 
                let type_entries = []
                if (count > 0) {
                    let entries = r.querySelectorAll('#content > div:nth-child(2) > div > div > table tr')
                    for (let eIdx = 1; eIdx < entries.length; eIdx++) {
                        const e = entries[eIdx];
                        let childs = e.querySelectorAll('td')

                        if (childs.length > 0) {
                            let d = {
                                name: childs[0].innerText.trim(),
                                agent_code: childs[1].innerText.trim(),
                                date_started: childs[2].innerText.trim(),
                                rank: childs[3].innerText.trim(),
                                sponsor_code: childs[4].innerText.split('-')[0].trim(),
                                sponsor_name: childs[4].innerText.split('-')[1].trim(),
                                smd_code: childs[5].innerText.split('-')[0].trim(),
                                smd_name: childs[5].innerText.split('-')[1].trim(),
                                accreditation_until: childs[3].innerText.trim()
                            }
            
                            type_entries.push(d)
                        }
                    }
                }
                entryData[type] = type_entries
            })
            .catch(function (error) {
                console.log(error);
            });
            
        }

        let moved = []
        let counter = {}
        for (let tIdx = types.length - 1; tIdx >= 0; tIdx--) {
            const t = types[tIdx];

            let data_to_write = []
            let dates_recruits = {}
            for (let teIdx = 0; teIdx < entryData[t].length; teIdx++) {
                const e = entryData[t][teIdx];

                if (moved.indexOf(e.agent_code) === -1) {
                    moved.push(e.agent_code)

                    if (!dates_recruits[e['date_started']]) dates_recruits[e['date_started']] = 0
                    dates_recruits[e['date_started']] += 1
                    data_to_write.push(e)

                    data_to_write.push(e)
                }
            }
            counter[t] = data_to_write.length

            if (firstChecking) {
                let d_keys = _.keys(dates_recruits)
                for (let dIdx = 0; dIdx < d_keys.length; dIdx++) {
                    const d_key = d_keys[dIdx];
                    if (!newRecruit[d_key]) newRecruit[d_key] = []
                    newRecruit[d_key].push(`${t} - ${dates_recruits[d_key]}`)
                }
            } else if (dates_recruits[todays_date]) {
                if (!newRecruit[todays_date]) newRecruit[todays_date] = []
                newRecruit[todays_date].push(`${t} - ${dates_recruits[todays_date]}`)
            }

            fs.writeFileSync(`${dir}/${t}.json`, JSON.stringify(data_to_write, null, 4))
        }

        fs.writeFileSync(`${dir}/summary_count.json`, JSON.stringify(counter, null, 4))

        details.end = date
        if (moved.length > 0) {
            if (!details.first_report) details.first_report = date,
            details.last_report = date
        }
        fs.writeFileSync(`${__dirname}/../storage/data/${username}/team/details.json`, JSON.stringify(details, null, 4))

        all_dates = _.uniq(all_dates)
        all_dates.push(date)
        fs.writeFileSync(`${__dirname}/../storage/data/${username}/team/dates.json`, JSON.stringify(all_dates, null, 4))
    }

    if (firstChecking) fs.writeFileSync(`${__dirname}/../storage/data/${username}/team/first_scan.json`, JSON.stringify(newRecruit, null, 4))
    fs.writeFileSync(`${__dirname}/../storage/data/${username}/team/last_scan.json`, JSON.stringify(newRecruit, null, 4))
}

const productionReport = async (ax,username) => {
    if (!fs.existsSync(`${__dirname}/../storage/data/${username}/production/reports`)) {
        fs.mkdirSync(`${__dirname}/../storage/data/${username}/production/reports`, { recursive: true })
        fs.writeFileSync(`${__dirname}/../storage/data/${username}/production/details.json`, JSON.stringify({
            start: '2020-01-01',
            end: '2020-01-01',
            first_report: null,
            last_report: null,
            new: true
        }, null,4))
        fs.writeFileSync(`${__dirname}/../storage/data/${username}/production/dates.json`, '[]')
    }

    let details = JSON.parse(fs.readFileSync(`${__dirname}/../storage/data/${username}/production/details.json`).toString())
    let all_dates = JSON.parse(fs.readFileSync(`${__dirname}/../storage/data/${username}/production/dates.json`).toString())

    let dates = []
    let d = moment(details.start, 'YYYY-MM-DD').startOf('month');
    let firstChecking =  details.new 
    if (details.new) {
        details.new = false
    } else {
        d = moment(details.end, 'YYYY-MM-DD').startOf('month');
        // d.add(1, 'day')
    }

    while(d <= moment().startOf('month')) {
        dates.push(d.format('YYYY-MM-DD'))
        d = d.add(1, 'month')
    }   

    const types = [
        'MD6',
        'MD5',
        'MD4',
        'MD3',
        'MD2',
        'MD1',
        'BASESHOP',
        'PERSONAL',
    ]

    let month_today = moment().startOf('month').format('YYYY-MM-DD')
    dates = dates.filter(d => {
        return d === month_today || all_dates.indexOf(d) === -1
    })

    // dates = ['2024-06-01']
    let newProduction = {}
    let todays_date = moment().tz('Asia/Manila').format('MM/DD/YYYY')
    for (let i = 0; i < dates.length; i++) {
        const date = dates[i];
        console.log(date);
        const year = moment(date,'YYYY-MM-DD').format('YYYY')
        const month = moment(date,'YYYY-MM-DD').format('MMMM')
        let dir = `${__dirname}/../storage/data/${username}/production/reports/${year}/${month}`
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
            
        let entryData = {}
        let _date = date.replace(/\//g, '-')
        for (let ii = 0; ii < types.length; ii++) {
            const type = types[ii];
            const params = qs.stringify({
                type,
                year,
                month: moment(date,'YYYY-MM-DD').format('MM'),
                button:' Generate Report'
            });

            const config = {
                method: 'post',
                url: 'https://img-corp.net/membersonly/production.php',
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data : params
            };

            await ax(config)
            .then(function (response) {
                if (all_dates.indexOf(_date) == -1)  all_dates.push(_date)
                let r = htmlParser.parse(response.data)
                let count = parseInt(r.querySelector('#content > div > div > p').innerText); 
                let type_entries = []
                if (count > 0) {
                    let entries = r.querySelectorAll('#content > div:nth-child(2) > div > div > table tr')
                    // console.log()
                    for (let eIdx = 1; eIdx < entries.length; eIdx++) {
                        const e = entries[eIdx];
                        let childs = e.querySelectorAll('td')

                        if (childs.length > 0) {
                            let d = {
                                provider: childs[0].innerText.trim(),
                                application_number: childs[1].innerText.trim(),
                                product_code: childs[2].innerText.trim(),
                                policy_number: childs[3].innerText.trim(),
                                policy_status: childs[4].innerText.trim(),
                                plan_holder: childs[5].innerText.trim(),
                                plan_name: childs[6].innerText.trim(),
                                plan_amount: childs[7].innerText.trim(),
                                installment_amount: childs[8].innerText.trim(),
                                business_date: childs[9].innerText.trim(),
                                agent_code_1: childs[10].innerText.trim(),
                                agent_name_1: childs[11].innerText.trim(),
                                agent_code_2: childs[12].innerText.trim(),
                                agent_name_2: childs[13].innerText.trim(),
                                baseshop: childs[14].innerText.trim(),
                                hierachy: childs[15].innerText.trim()
                            }
            
                            type_entries.push(d)
                        }
                    }
                }
                entryData[type] = type_entries
            })
            .catch(function (error) {
                console.log(error);
            });
            
        }
        // console.log(entryData);

        let moved = []
        let counter = {}
        for (let tIdx = types.length - 1; tIdx >= 0; tIdx--) {
            const t = types[tIdx];

            let data_to_write = []
            let dates_productions = {}
            for (let teIdx = 0; teIdx < entryData[t].length; teIdx++) {
                const e = entryData[t][teIdx];

                if (moved.indexOf(e.application_number) === -1) {
                    moved.push(e.application_number)

                    if (!dates_productions[e['business_date']]) dates_productions[e['business_date']] = 0
                    dates_productions[e['business_date']] += 1
                    data_to_write.push(e)
                }
            }
            counter[t] = data_to_write.length
            if (firstChecking) {
                let d_keys = _.keys(dates_productions)
                for (let dIdx = 0; dIdx < d_keys.length; dIdx++) {
                    const d_key = d_keys[dIdx];
                    if (!newProduction[d_key]) newProduction[d_key] = []
                    newProduction[d_key].push(`${t} - ${dates_productions[d_key]}`)
                }

            } else if (dates_productions[todays_date]) {
                if (!newProduction[todays_date]) newProduction[todays_date] = []
                newProduction[todays_date].push(`${t} - ${dates_productions[todays_date]}`)
            }

            fs.writeFileSync(`${dir}/${t}.json`, JSON.stringify(data_to_write, null, 4))
        }

        fs.writeFileSync(`${dir}/summary_count.json`, JSON.stringify(counter, null, 4))

        details.end = date
        if (moved.length > 0) {
            if (!details.first_report) details.first_report = date,
            details.last_report = date
        }
        fs.writeFileSync(`${__dirname}/../storage/data/${username}/production/details.json`, JSON.stringify(details, null, 4))

        all_dates = _.uniq(all_dates)
        all_dates.push(date)
        fs.writeFileSync(`${__dirname}/../storage/data/${username}/production/dates.json`, JSON.stringify(all_dates, null, 4))

    }

    if (firstChecking) fs.writeFileSync(`${__dirname}/../storage/data/${username}/production/first_scan.json`, JSON.stringify(newProduction, null, 4))
    fs.writeFileSync(`${__dirname}/../storage/data/${username}/production/last_scan.json`, JSON.stringify(newProduction, null, 4))
}


const updateReports = async (username, password, report_type) => {
    username = username.toUpperCase()
    if (!fs.existsSync(`${__dirname}/../storage/data/${username}`)) {
        fs.mkdirSync(`${__dirname}/../storage/data/${username}`, { recursive: true })
    }

    let cookies = ''

    if (fs.existsSync(`${__dirname}/../storage/data/${username}/cookie.text`)) {
        cookies = fs.readFileSync(`${__dirname}/../storage/data/${username}/cookie.text`).toString()
    } else {
        cookies = await loginCookies(username, password)
        fs.writeFileSync(`${__dirname}/../storage/data/${username}/cookie.text`, cookies)
    }

    let ax =  axios.create({
        withCredentials: true,
        baseURL: 'https://img-corp.net/',
        headers: {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "priority": "u=0, i",
            "upgrade-insecure-requests": "1",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "cookie": cookies
        }
     })

     await ax({
        method: "GET",
        url: 'https://img-corp.net/membersonly/',
        withCwithCredentials: true,
     }).then(async res => {
        let r = htmlParser.parse(res.data)
        let isCookieValid = r.querySelector('.img-agent-banner') ? true : false
        console.log(isCookieValid)

        if (!isCookieValid) {
            cookies = await loginCookies(username, password)
            fs.writeFileSync(`${__dirname}/../storage/data/${username}/cookie.text`, cookies)
            ax.defaults.headers.cookie = cookies
        }
     }).catch(err => {
        console.log(err)
     })

     let green = false 
     await ax({
        method: "GET",
        url: 'https://img-corp.net/membersonly/',
        withCwithCredentials: true,
     }).then(async res => {
        let r = htmlParser.parse(res.data)
        green = r.querySelector('.img-agent-banner') ? true : false
        if (green) {
            let name = r.querySelector('.agent-name').textContent.replace('Hi!','').trim().split(/[\n\:]/gi).map(e => {
                return e.trim()
            })

            let users = JSON.parse(fs.readFileSync(`${__dirname}/../storage/models/users.json`).toString())
            let userIndex = _.findIndex(users, u => u.username === name[2])
            if (userIndex !== -1) {
                if (users[userIndex].name !== name[0]) {
                    users[userIndex].name = name[0]
                    fs.writeFileSync(`${__dirname}/../storage/models/users.json`, JSON.stringify(users,null,4))
                }
              
                if (users[userIndex].rank !== name[1]) {
                    users[userIndex].rank = name[1]
                    fs.writeFileSync(`${__dirname}/../storage/models/users.json`, JSON.stringify(users,null,4))
                }
            }
        }
     }).catch(err => {
        console.log(err)
     })

     if (green) {
        switch(report_type) {
            case 'commission':
                await commissionReports(ax, username)
                updateLastScanned(username, 'commission')
                break
            case 'team':
                await teamReport(ax, username)
                updateLastScanned(username, 'team')
                break
            case 'production':
                await productionReport(ax, username)
                updateLastScanned(username, 'production')
                break
            default:
                console.log('Invalid Report Type')
        }
     } else {
        console.log('Invalid Cookie')
     }
}

module.exports = {
    updateReports,
    loginCookies
}
