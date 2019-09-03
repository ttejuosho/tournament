var express = require("express");
var router = express.Router();
var db = require("../models");

function formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
        return match[1] + '-' + match[2] + '-' + match[3]
    }
    return null
}

router.get('/', (req, res) => {
    res.render('landing');
});

router.get('/admin', (req, res) => {
    res.render('login');
});

router.get('/index', (req, res) => {
    return res.render("index", {layout: 'mainx'});
});

router.get('/dashboard', (req,res)=>{
    var err = {
        error: "Password Required"
    }
    return res.render('login', err);
});

router.post('/dashboard', (req, res) => {
    console.log(req.body.Password);
    if (req.body.Password === '0000'){
    db.TeamMember.findAll({})
        .then((dbTeamMember) => {
            var hbsObject = {
                teamMember: dbTeamMember,
                layout: 'mainx'
            };
        return res.render("dashboard", hbsObject);
    });
    } else {
        var err = {
            error: "Incorrect Password"
        }
        return res.render('login', err);
    }
});

router.post('/member/new', (req, res) => {
    db.TeamMember.count({//Check Number of members in the team
        where: {
          TeamName: req.body.TeamName
        }
      }).then(function(dbTeamMembers) {
        if(dbTeamMembers <= 1){//if no members in the group Check if Member2 exists          
            if (req.body.Name2.length < 1){// if theres no 2nd Member Name Value save the first and exit
                db.TeamMember.findOne({
                    where: {
                        Name: req.body.Name1
                    }
                }).then((dbTeamMember)=>{
                    if (dbTeamMember == null){//If 1st member doesnt exist, Add to db
                        db.TeamMember.create({
                            Name: req.body.Name1,
                            TeamName: req.body.TeamName,
                            EmailAddress: req.body.EmailAddress1,
                            PhoneNumber: formatPhoneNumber(req.body.PhoneNumber1),
                            Amount: req.body.Amount
                        }).then((dbTeamMember)=>{
                            return res.render("added", dbTeamMember.dataValues);
                        });
                    } //Report duplicate for Member 1
                    else {
                        var err = {
                            error: req.body.Name1.toUpperCase() + " already exists in the database"
                        }
                        return res.render("landing", err);
                    }
                }); //complete One member Add Case
            } else {
                db.TeamMember.findOne({
                where: {
                    Name: req.body.Name2
                }
            }).then((dbTeamMember)=>{
                // if member 2 doesnt exists
                if (dbTeamMember == null) {
                    db.TeamMember.create({
                        Name: req.body.Name2,
                        TeamName: req.body.TeamName,
                        EmailAddress: (req.body.EmailAddress2 !== undefined ? req.body.EmailAddress2 : ''),
                        PhoneNumber: formatPhoneNumber(req.body.PhoneNumber2),
                        Amount: req.body.Amount
                    }).then((dbTeamMember)=>{
                        db.TeamMember.findOne({
                            where: {
                                Name: req.body.Name1
                            }
                        }).then((dbTeamMember)=>{
                            if (dbTeamMember == null){//If 1st member doesnt exist, Add to db
                                db.TeamMember.create({
                                    Name: req.body.Name1,
                                    TeamName: req.body.TeamName,
                                    EmailAddress: req.body.EmailAddress1,
                                    PhoneNumber: formatPhoneNumber(req.body.PhoneNumber1),
                                    Amount: req.body.Amount
                                }).then((dbTeamMember)=>{
                                    return res.render("added", dbTeamMember.dataValues);
                                });
                            } //Report duplicate for Member 1
                            else {
                                var err = {
                                    error: req.body.Name1.toUpperCase() + " already exists in the database"
                                }
                                return res.render("landing", err);
                            }
                        })
                    });
                } //else report duplicate for member 2 here
                else {
                    var err = {
                        error: req.body.Name2.toUpperCase() + " already exists in the database"
                    }
                    return res.render("landing", err);
                }
            });
            }            
        }// Report Too many members in the Team
        else {
            var err = {
                error: "The selected team already has at least 1 member. Please press back to add a new team for you and your partner. "
            }
                return res.render("error", err);
        }
      });
});

router.get('/member/:uuid/update', (req, res) => {
    db.TeamMember.findByPk(req.params.uuid)
        .then((dbTeamMember) => {
            dbTeamMember.dataValues['layout'] = 'mainx';
            res.render('update', dbTeamMember.dataValues);
        }).catch((err) => {
            res.render('error', err);
        });
});

router.put('/member/:uuid/update', (req, res) => {
    const dbTeamMember = {
        Name: req.body.Name,
        TeamName: req.body.TeamName,
        EmailAddress: req.body.EmailAddress,
        PhoneNumber: req.body.PhoneNumber,
        Amount: req.body.Amount
    };
    db.TeamMember.update(dbTeamMember, {
        where: {
            uuid: req.params.uuid
        }
    }).then((dbTeamMember) => {
        res.redirect('/admin');
    }).catch((err) => {
        res.render('error', err);
    });
});

router.get('/member/:uuid/delete', (req, res) => {
    db.TeamMember.findByPk(req.params.uuid)
        .then((dbTeamMember) => {
            db.TeamMember.destroy({
                where: {
                    uuid: dbTeamMember.dataValues.uuid
                }
            }).then(() => {
                res.redirect('/admin');
            }).catch((err) => {
                res.render('error', err)
            })
        });
});

router.get('/member/:uuid', (req, res) => {
    db.TeamMember.findByPk(req.params.uuid)
        .then((dbTeamMember) => {
            dbTeamMember.dataValues['layout'] = 'mainx';
            res.render('view', dbTeamMember.dataValues);
        }).catch((err) => {
            res.render('error', err);
        });
});

module.exports = router;