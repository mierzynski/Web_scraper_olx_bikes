const puppeteer = require('puppeteer')
const fs = require('fs')

let textFile = fs.readFileSync('tags.txt','utf8')
let keyWords = textFile.split('\n')
let findedWords = []

function lookForKeyWords(text) {
    for (let i=0; i < keyWords.length; i++) {
        if (text.search(keyWords[i] > 0)) {
            findedWords.push(keyWords[i]);
        }
        else { console.log('No keywords'); }
    }

    console.log(findedWords)
}

async function start() {
    const browser = await puppeteer.launch({ "headless":false })
    const page = await browser.newPage()
    await page.goto("https://www.olx.pl/")
    
    const cookiesButton = await page.$x('//*[@id="onetrust-accept-btn-handler"]');
    if (cookiesButton.length > 0) {
      await cookiesButton[0].click();
      console.log('COOKIES BUTTON CLICKED');
    } else {
      console.log("No cookie button");
    }

    const inputSearch = await page.$x('//*[@id="headerSearch"]');
    if (inputSearch.length > 0) {
        await inputSearch[0].type('gravel');
        console.log('inputSearch FILLED');
        await page.keyboard.press('Enter');
        console.log('inputSearch CONFIRMED');
    } else {
        console.log("No input form");
    }

    await page.waitForTimeout(5000)

    const inputMinPrice = await page.$x('//*[@id="root"]/div[1]/div[2]/form/div[3]/div[1]/div/div[2]/div/div[1]/div/div/div/input');
    const inputMaxPrice = await page.$x('//*[@id="root"]/div[1]/div[2]/form/div[3]/div[1]/div/div[2]/div/div[2]/div/div/div/input');
    if (inputMinPrice.length > 0) {
        await inputMinPrice[0].type('2500');
        console.log('inputMinPrice FILLED');
        await inputMaxPrice[0].type('7000');
        console.log('inputMaxPrice FILLED');
        await page.keyboard.press('Enter');
        console.log('inputMinPrice AND input MaxPrice CONFIRMED');
    } else {
        console.log("No input price form");
    }

    await page.waitForTimeout(3000)

    let auctionCheck = true;
    let i_auction = 2;
    let gap = 0;
    while(auctionCheck) {
        let auctionHref = await page.$x('//*[@id="root"]/div[1]/div[2]/form/div[5]/div/div[2]/div['+ i_auction +']/a');
        if (auctionHref.length > 0) {
            console.log(i_auction);
            i_auction++;
        }
        else if (gap == 0){ i_auction++; }
        else { auctionCheck = false; }
    }

    // if (auctionTitle.length > 0) {
    //     await auctionTitle[0].click();
    //     console.log('auctionTitle CLICKED');
    // }
    // else {
    //     console.log('auctionTitle false')
    //     console.log(auctionTitle);
    // }

    // const description = await page.waitForSelector('#root > div.css-50cyfj > div.css-1on7yx1 > div:nth-child(3) > div.css-dwud4b > div.css-1wws9er > div.css-1m8mzwg > div');
    // let descriptionValue = await description.evaluate(el => el.textContent);
    // lookForKeyWords(descriptionValue)


    // await browser.close()
}

start()