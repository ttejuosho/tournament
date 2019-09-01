var db = require("../models");

module.exports = function(app) {
    app.get("/api/members", (req, res) => {
        db.TeamMember.findAll({}).then(function(dbTeamMember) {
          res.json(dbTeamMember);
        });
    });  
    app.get("/api/team-members/:TeamName", (req,res)=>{
      db.TeamMember.findAll({
        where: {
          TeamName: req.params.TeamName
        }
      }).then(function(dbTeamMembers) {
        res.json(dbTeamMembers);
      });
    });
}