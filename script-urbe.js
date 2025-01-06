const { Builder, Browser, By, Key, until, Dimension, Button } = require('selenium-webdriver')
const fs = require('fs')

async function researchUrbeNews() {
    let arrNews = []
    let driver = await new Builder().forBrowser(Browser.CHROME).build() //need to update to use proxy, and headless
    try {
        await driver.get('https://campus.urbe.edu/')
        await driver.wait(until.elementLocated(By.className('mat-mdc-form-field-subscript-wrapper')), 15000).then(async () => {
            await driver.findElement(By.className("title-section-container"), 10000).then(async (iframe) => {
                await driver.actions()
                    .scroll(0, 0, 0, 200, iframe)
                    .perform()
            })
            let aElement = await driver.findElements(By.css('a')); //find a elements
            for (let element of aElement) { //loop through a elements
                let string = await element.getAttribute('href') //get href attribute
                if (string != null && string.includes('/noticia/')) { //find the URL pattern
                    let addIt = 0
                    arrNews.forEach((item) => {
                        if (item.url === string) {
                            addIt++;
                        }
                    })
                    if (addIt > 0) {
                    } else {
                        console.log({ url: string })
                        arrNews.push({ url: string })
                    }
                }
            }
            let existNews = true
            while (existNews) {
                await driver.wait(until.elementLocated(By.className('mat-mdc-form-field-subscript-wrapper')), 15000)
                await driver.findElement(By.className("ng-star-inserted"), 115000).then(async (iframe) => {
                    await driver.actions()
                        .scroll(0, 0, 0, 400, iframe)
                        .perform()
                    await driver.findElement(By.xpath("/html/body/app-root/app-home/div[2]/section[2]/div[2]/div[2]/button[2]"), 20000).then(async (button) => {
                        if (button.isEnabled) {
                            let aElement = await driver.findElements(By.css('a')); //find a elements
                            for (let element of aElement) { //loop through a elements
                                let string = await element.getAttribute('href') //get href attribute
                                if (string != null && string.includes('/noticia/')) { //find the URL pattern
                                    let addIt = 0
                                    arrNews.forEach((item) => {
                                        if (item.url === string) {
                                            addIt++;
                                        }
                                    })
                                    if (addIt > 0) {
                                    } else {
                                        console.log({ url: string })
                                        arrNews.push({ url: string })
                                    }
                                }
                            }
                            button.click()
                            await driver.wait(until.elementLocated(By.className('ng-star-inserted')), 15000)//wait for the loader to finish
                        } else {
                            await driver.quit()
                            existNews = false
                        }
                    })
                })
            }
            await driver.quit()
        });
    } catch (error) {
        await driver.quit()
    }

    fs.writeFileSync('url-news.json', JSON.stringify(arrNews), (err) => {
        if (err) {
            console.log(err)
        }
    })
    searchUrbeNews()

}

async function searchUrbeNews() {
    const arrNews = JSON.parse(fs.readFileSync('url-news.json'))
    let data = []
    let driver = await new Builder().forBrowser(Browser.CHROME).build()//need to update to use proxy, and headless
    try {
        for (let i = 0; i < arrNews.length; i++) {
            console.log(arrNews[i].url)
            await driver.get(arrNews[i].url)
            await driver.wait(until.elementLocated(By.css('body')), 15000)
            const image = await driver.findElement(By.xpath("/html/body/app-root/app-noticia/div[2]/main/div/div[2]/img"), 10000).getAttribute('src')
            const title = await driver.findElement(By.xpath("/html/body/app-root/app-noticia/div[2]/main/div/div[3]/h1"), 10000).getText()
            const text = await driver.findElement(By.className("content-new"), 10000).getText()
            const date = await driver.findElement(By.xpath("/html/body/app-root/app-noticia/div[2]/main/div/div[1]/p"), 10000).getText()
            data.push({ image, title, text, date })
        }
        fs.writeFileSync('news.json', JSON.stringify(data), (err) => {
            if (err) {
                console.log(err)
            }
        })
        await driver.quit()
    } catch (error) {
        console.log(error)
    }
}


researchUrbeNews()
