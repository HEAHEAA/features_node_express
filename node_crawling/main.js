const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const sql = require('./db/sql');
const postgres = require('./db/postgresdb');
const nows = require('./util/date');



const crawling = async () => {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get('https://mw.genie.co.kr/newest');

        const musicTitle = await driver.findElement(By.xpath('/html/body/section/ul[2]')).getText();
        const replaceMusic = musicTitle.replace(/\n/g, ",");
        const splitMusic = replaceMusic.split(',');

        let title = [];
        let name = [];
        for (let i = 0; i < splitMusic.length; i++) {
            //곡
            if (i % 3 === 0) {
                title.push(splitMusic[i]);
            }
            //가수
            if (i % 3 === 1) {
                name.push(splitMusic[i]);
            }
        }

        for (let i = 0; i < title.length; i++) {
            let value = [
                title[i],
                name[i],
                nows + ' 00:00'
            ]
            postgres.query(sql.sql, value, function (err, row, fields) {
                if (err) console.log(err);
                console.log("Data Insert!!");
            })

        }





    } catch (e) {
        console.log(e);
    } finally {
        console.log('success')
    }
}

crawling();
