const Festival = require ('../models/festival');

module.exports = (app) => {


  app.get("/api/setupFestivals",(req, res) => {


    const festivals = [
      {
        name: "Glastonbury Festival 2017"
      },
      {
        name: "Awakenings Festival 2017 - Day 1"
      },
      {
        name: "Awakenings Festival 2017 - Day 2"
      },
      {
        name: "Noname 2017 • Music & Art Festival"
      },
      {
        name: "EXIT Festival 2017"
      },
      {
        name: "Kappa FuturFestival 2017"
      },
      {
        name: "Full Moon Fest 2017"
      },
      {
        name: "Crossroads 2017"
      },
      {
        name: "Farr Festival 2017"
      },
      {
        name: "DGTL Barcelona 2017"
      },
      {
        name: "Sunfall Festival 2017"
      },
      {
        name: "Lost Village 2017"
      },
      {
        name: "South West Four 2017 - Day One"
      },
      {
        name: "South West Four 2017 - Day Two"
      },
      {
        name: "Sub Club Soundsystem 2017"
      },
      {
        name: "Mysteryland 2017"
      }
    ]


    Festival.create(festivals, (err, data) => {
      res.send(data);
    });

  })

}
