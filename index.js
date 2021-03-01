const app = require('express')();
const puppeteer = require('puppeteer');

app.get('/:userName', async (req, res) => {
  const userName = req.params.userName;
  const url = `https://www.instagram.com/${userName}`;
  console.log(url);
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.192 Safari/537.36'
    );
    await page.goto(url, {
      waitUntil: 'networkidle2',
    });
    await page.waitForTimeout(5000);
    const username = await page.$eval('.nZSzR > ._7UhW9', (el) => el.innerText);
    const posts = await page.$eval(
      '.-nal3',
      (el) => el.innerText.split(' ')[0]
    );
    const followers = await page.$eval(
      ':nth-child(2) > .-nal3 > .g47SY',
      (el) => el.innerText
    );
    const following = await page.$eval(
      ':nth-child(3) > .-nal3 > .g47SY',
      (el) => el.innerText
    );
    let userInfo = await page.$eval('.-vDIg', (el) => el.innerText);
    await browser.close();
    console.log('fetched data successfully');
    userInfo = userInfo.split('\n');
    console.log(userInfo);
    userInfo.pop();
    const fullName = userInfo[0];
    let bio = '';
    for (let i = 1; i < userInfo.length; i++) {
      console.log('loop is here');
      bio += userInfo[i];
    }
    return res.json({
      Username: username,
      'Posted Posts': posts,
      'Number of Followers': followers,
      'Persons User is Following': following,
      'Full Name': fullName,
      BIO: bio,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      message: 'Unable to get data',
      error: error,
    });
  }
});
const port = 8000;
app.listen(port, console.log(`running @ ${port}`));
