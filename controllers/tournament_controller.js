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

router.get('/index', (req, res) => {
    return res.render("index", {layout: 'mainx'});
});

router.get('/admin', (req, res) => {
    db.TeamMember.findAll({})
        .then((dbTeamMember) => {
            var hbsObject = {
                teamMember: dbTeamMember,
                layout: 'mainx'
            };
            return res.render("admin", hbsObject);
        });
});

router.post('/member/new', (req, res) => {
    console.log("NEW MEMBER");
    db.TeamMember.findOne({
        where: {
            Name: req.body.Name1
        }
    }).then((dbTeamMember)=>{
    if (dbTeamMember == null) {
        db.TeamMember.findOne({
            where: {
                Name: req.body.Name2
            }
    }).then((dbTeamMember) => {
        if (dbTeamMember == null) {
            if(req.body.Name2.length > 0){
                db.TeamMember.create({
                    Name: req.body.Name2,
                    TeamName: req.body.TeamName,
                    EmailAddress: req.body.EmailAddress2,
                    PhoneNumber: formatPhoneNumber(req.body.PhoneNumber2),
                    Amount: req.body.Amount
                });
            }

            db.TeamMember.create({
                Name: req.body.Name1,
                TeamName: req.body.TeamName,
                EmailAddress: req.body.EmailAddress1,
                PhoneNumber: formatPhoneNumber(req.body.PhoneNumber1),
                Amount: req.body.Amount
            }).then((dbTeamMember) => {
                return res.render("added", dbTeamMember);
            }).catch((err) => {
                res.render('error', err);
            });
        } else {
            var err = {
                error: dbTeamMember.Name.toUpperCase() + " already exists in the database"
            }
            res.render("landing", err);
        }
    });
}
});
});

router.get('/member/:id/update', (req, res) => {
    db.TeamMember.findByPk(req.params.id)
        .then((dbTeamMember) => {
            dbTeamMember.dataValues['layout'] = 'mainx';
            res.render('update', dbTeamMember.dataValues);
        }).catch((err) => {
            res.render('error', err);
        });
});

router.put('/member/:id/update', (req, res) => {
    const dbTeamMember = {
        Name: req.body.Name,
        TeamName: req.body.TeamName,
        EmailAddress: req.body.EmailAddress,
        PhoneNumber: req.body.PhoneNumber,
        Amount: req.body.Amount
    };

    db.TeamMember.update(dbTeamMember, {
        where: {
            id: req.params.id
        }
    }).then((dbTeamMember) => {
        res.redirect('/admin', { layout: 'mainx'});
    }).catch((err) => {
        res.render('error', err);
    });
});

router.get('/member/:id/delete', (req, res) => {
    db.TeamMember.findByPk(req.params.id)
        .then((dbTeamMember) => {
            db.TeamMember.destroy({
                where: {
                    id: dbTeamMember.dataValues.id
                }
            }).then(() => {
                res.redirect('/admin');
            }).catch((err) => {
                res.render('error', err)
            })
        });
});

router.get('/member/:id', (req, res) => {
    db.TeamMember.findByPk(req.params.id)
        .then((dbTeamMember) => {
            dbTeamMember.dataValues['layout'] = 'mainx';
            res.render('view', dbTeamMember.dataValues);
        }).catch((err) => {
            res.render('error', err);
        });
});

module.exports = router;