const { Builder, Browser, By, Key, until, Dimension, Button } = require('selenium-webdriver')
const fs = require('fs')


async function researchUrbeNews() {
    let arrNews = []
    let driver = await new Builder().forBrowser(Browser.CHROME).withCapabilities({}).build()
    try {

        await driver.get('https://campus.urbe.edu/')
        await driver.wait(until.elementLocated(By.className('mat-mdc-form-field-subscript-wrapper')), 15000).then(async () => {
            console.log('Page loaded')

            await driver.findElement(By.className("title-section-container"), 10000).then(async (iframe) => {
                await driver.actions()
                    .scroll(0, 0, 0, 200, iframe)
                    .perform()
                //console.log("scrolling") we good
            })

            let aElement = await driver.findElements(By.css('a')); //find a elements

            for (let element of aElement) { //loop through a elements

                let string = await element.getAttribute('href') //get href attribute

                //console.log(string)

                if (string != null && string.includes('/noticia/')) { //find the URL pattern
                    let addIt = 0

                    arrNews.forEach((item) => {

                        if (item.url === string) {
                            addIt++;
                        }
                    })

                    if (addIt > 0) {
                        //not been added
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
                    console.log("scrolling 3") //we good
                    await driver.findElement(By.xpath("/html/body/app-root/app-home/div[2]/section[2]/div[2]/div[2]/button[2]"), 20000).then(async (button) => {
                        if (button.isEnabled) {
                            let aElement = await driver.findElements(By.css('a')); //find a elements

                            for (let element of aElement) { //loop through a elements

                                let string = await element.getAttribute('href') //get href attribute

                                //console.log(string)

                                if (string != null && string.includes('/noticia/')) { //find the URL pattern
                                    let addIt = 0

                                    arrNews.forEach((item) => {

                                        if (item.url === string) {
                                            addIt++;
                                        }
                                    })

                                    if (addIt > 0) {
                                        //not been added
                                    } else {
                                        console.log({ url: string })
                                        arrNews.push({ url: string })
                                    }
                                }
                            }
                            button.click()
                        } else {
                            existNews = false
                        }

                    })
                })
            }

            /*
             let existNews = true
             while (existNews) {
                 await driver.findElement(By.className("arrow-container"), 10000).then(async (iframe) => {
                     await driver.actions()
                         .scroll(0, 0, 0, 200, iframe)
                         .perform()
                     //console.log("scrolling") we good
                     await driver.findElement(By.css("mat-icon"), 10000).then(async (iframe) => {
                         await driver.actions()
                             .scroll(0, 0, 0, 200, iframe)
                             .perform()
                         console.log("scrolling 2") //we good
                     })
                 })
             }
            */


        });

    } catch (error) {
        console.log(error)
        await driver.quit()

    }

    fs.writeFileSync('urbe-news.json', JSON.stringify(arrNews), (err) => {
        if (err) {
            console.log(err)
        }

    })

}



researchUrbeNews()