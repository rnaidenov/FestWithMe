const User = require ('../models/user');

module.exports = (app) => {


  app.get("/api/setupUsers",(req, res) => {


    const staterUsers = [
      {
        username : 'kick420',
        firstName : 'Deyan',
        lastName : 'Velev',
        likedFestivals : [{
          festivalId : 1,
          festivalName : 'Awakenings'
        },
        {
          festivalId : 2,
          festivalName : 'Solar Summer'
        }]
      },
      {
        username : 'rnaidenov',
        firstName : 'Radoslav',
        lastName : 'Naydenov',
        likedFestivals : [{
          festivalId : 1,
          festivalName : 'Awakenings'
        },
        {
          festivalId : 3,
          festivalName : 'Junction 2'
        }]
      },
      {
        username : 'kamisese',
        firstName : 'Kamelia',
        lastName : 'Mateeva',
        likedFestivals : [{
          festivalId : 4,
          festivalName : 'Time Warp'
        },
        {
          festivalId : 2,
          festivalName : 'Solar Summer'
        }]
      }
    ]


    User.create(staterUsers, (err, data) => {
      res.send(data);
    });

  })

}
