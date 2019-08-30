var db = require("../models");

module.exports = function(app) {
    app.get("/api/members", (req, res) => {
        db.TeamMember.findAll({}).then(function(dbTeamMember) {
          res.json(dbTeamMember);
        });
    });  

}