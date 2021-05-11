# Vaccine Slot Search

- Run below in root project folder
  `npm i`

This API search by `pincode` or by district `district_id`.

By district

`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=770&date=11-05-2021`

By pincode

`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=380019&date=11-05-2021`

Once slot will be available, Puppeter will launch another chrome instance so you will be notified.

Run below commands setup cron in local

`crontab -e`
`*/1 * * * * /Users/devalindravadanshah/.nvm/versions/node/v14.15.4/bin/node /Users/devalindravadanshah/nodejs/covid_slot_book/index.js >/tmp/stdout.log 2>/tmp/stderr.log`
