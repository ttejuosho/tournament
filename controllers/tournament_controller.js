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
    res.redirect('/index');
});

router.get('/index', (req, res) => {
    return res.render("index");
});

router.get('/admin', (req, res) => {
    db.TeamMember.findAll({})
        .then((dbTeamMember) => {
            var hbsObject = {
                teamMember: dbTeamMember
            };
            return res.render("admin", hbsObject);
        });
});

router.post('/member/new', (req, res) => {
    db.TeamMember.findOne({
        where: {
            Name: req.body.Name
        }
    }).then((dbTeamMember) => {
        if (dbTeamMember == null) {
            db.TeamMember.create({
                Name: req.body.Name,
                TeamName: req.body.TeamName,
                EmailAddress: req.body.EmailAddress,
                PhoneNumber: formatPhoneNumber(req.body.PhoneNumber),
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
            res.render("index", err);
        }
    });
});

router.get('/member/:id/update', (req, res) => {
    db.TeamMember.findByPk(req.params.id)
        .then((dbTeamMember) => {
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
        res.redirect('/admin');
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
            res.render('view', dbTeamMember.dataValues);
        }).catch((err) => {
            res.render('error', err);
        });
});

module.exports = router;