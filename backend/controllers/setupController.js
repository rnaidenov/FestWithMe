const Festival = require ('../models/festivalModel');

module.exports = (app) => {


  app.get("/api/setupFestivals",(req, res) => {


    const festivals = [
      {
        name: "No Bounds Festival"
      },
      {
        name: "DGTL × Paradise with Jamie Jones, Dubfire ..."
      },
      {
        name: "HYTE ADE Pres. Frrc with Ricardo Villalobos ..."
      },
      {
        name: "VERKNIPT ADE Special - Day 1"
      },
      {
        name: "VERKNIPT ADE Special - Day 2"
      },
      {
        name: "25 Years of RAM Records"
      }
    ]


    Festival.create(festivals, (err, data) => {
      res.send(data);
    });

  })

}
