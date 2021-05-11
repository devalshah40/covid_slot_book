const puppeteer = require("puppeteer");
const axios = require("axios");
(async () => {
  const date = new Date(); // M-D-YYYY

  const d = date.getDate();
  const m = date.getMonth() + 1;
  const y = date.getFullYear();

  const dateString =
    (d <= 9 ? "0" + d : d) + "-" + (m <= 9 ? "0" + m : m) + "-" + y;
  console.log(dateString);
  try {
    axios.interceptors.request.use(
      function (config) {
        config.headers = {
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "accept-language": "en-US,en;q=0.9",
          "sec-ch-ua":
            '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
          "sec-ch-ua-mobile": "?0",
          "sec-fetch-dest": "document",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "none",
          "sec-fetch-user": "?1",
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
          "upgrade-insecure-requests": "1",
        };

        return config;
      },
      null,
      { synchronous: true }
    );
    // Query by district_id
    const { data: slotDetails } = await axios.get(
      `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=770&date=${dateString}`
    );
    const combinedResponse = slotDetails.centers;

    // Query by Pincode
    // const { data: slotDetails } = await axios.get(
    //   `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=380019&date=${dateString}`
    // );
    // console.log(slotDetails);
    // const { data: slotDetails2 } = await axios.get(
    //   `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=380005&date=${dateString}`
    // );
    // const combinedResponse = slotDetails.centers.concat(
    //   slotDetails2.centers || []
    // );
    // console.log(combinedResponse);
    // console.log(slotDetails2);

    let isSlotAvailable = false;
    for (const centerData of combinedResponse) {
      if (isSlotAvailable) {
        break;
      }
      // console.log(centerData);
      if (centerData.fee_type === "Free") {
        for (const sessions of centerData.sessions || []) {
          // console.log(sessions);
          if (
            parseInt(sessions.min_age_limit) === 18 &&
            parseInt(sessions.available_capacity) > 0
          ) {
            console.log(centerData);
            console.log(sessions);
            isSlotAvailable = true;
            break;
          }
        }
      }
    }

    if (isSlotAvailable) {
      const browser = await puppeteer.launch({
        headless: false,
      });
      const page = await browser.newPage();
      // Open page.
      await page.goto(
        `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=380019&date=${dateString}`
      );
      // Keep the browser open.
      // browser.close();
    } else {
      console.log(`No slots for ${new Date().toString()}`);
    }
  } catch (error) {
    console.log(error);
  }
})();
