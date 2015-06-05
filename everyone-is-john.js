var names = [
    "John",
    "Jon",
    "Jonathon",
    "Johnny",
    "Johnson",
    "Jean"
]

var Skills = new Mongo.Collection("skills")
var Obsessions = new Mongo.Collection("obsessions")

var DefaultSkills = [
    "Lying",
    "Climbing",
    "Kick-boxing",
    "Lock-picking",
    "Pick-pocketing",
    "Starting fires",
    "Eating way too much",
    "Giving motivational speeches",
    "Surviving falls from great heights",
    "Assembling and detonating explosives",
    "Creating and using improvisational weapons",
    "Performing magic tricks with a deck of cards",
    "Dropping an assortment of expletives",
    "Running for long distances",
    "Hiding anywhere",
    "Parallel parking",
    "Break dancing",
    "Parkour",
]

var DefaultObsessions = [
    [
        "Eat candy",
        "Yell at a child",
        "Take a nap in public",
        "Do a barrel roll",
        "Play a game of golf",
    ],
    [
        "Prepare for the oncoming apocalypse",
        "Reenact a scene from Les Misérables",
        "Pretend to be a bird",
        "Sell your organs on the black market",
        "Punch somebody in a uniform"
    ],
    [
        "Convince someone that this is a game of 'Everone is John'",
        "Have burgers with the president of the United States of America",
        "Get away with murder",
        "Go to the moon",
        "Ride a dinosaur",
        "Walk away from an explosion like an action hero"
    ]
]

var getSkillcap = function(willpower) {
    return ((13 - willpower) / 3) + 1
}

var getRandomSkills = function(skillcap) {
    var returnables = new Array()
    for(var index = 0; index < skillcap; index++) {
        var skill = Skills.findOne({}, {sort: {"key": 1}})
        Skills.update(skill._id, {$inc: {"key": 1 + Math.random()}})
        returnables.push(skill.value)
    }
    return returnables
}

var getRandomObsessions = function() {
    var returnables = new Array()
    for(var index = 0; index < 3; index++) {
        var obsession = Obsessions.findOne({"level": index + ""}, {sort: {"key": 1}})
        Obsessions.update(obsession._id, {$inc: {"key": 1 + Math.random()}})
        returnables.push(obsession.value)
    }
    return returnables
}

if(Meteor.isClient) {
    
    Session.set("view", false)
    Session.set("name", names[Math.floor(Math.random() * names.length)])
    Session.set("willpower", 10)
    
    Template.registerHelper("view", function() {
        return Session.get("view")
    })
    Template.registerHelper("name", function() {
        return Session.get("name")
    })
    Template.registerHelper("willpower", function() {
        return Session.get("willpower")
    })
    Template.registerHelper("skills", function() {
        return Session.get("skills")
    })
    Template.registerHelper("obsessions", function() {
        return Session.get("obsessions")
    })
    
    Template.configure.helpers({
        isChecked: function(willpower) {
            if(Session.get("willpower") == willpower) {
                return "checked"
            }
        }
    })
    
    Template.configure.events({
        "submit form": function(event) {
            event.preventDefault()
            var name = event.target.name.value
            var willpower = event.target.willpower.value
            if(name == "" || willpower == "") {
                alert("To generate your character, we need "
                    + "a name, and how much willpower you're "
                    + "willing to trade for skills. Thanks!!")
            } else {
                var skillcap = getSkillcap(willpower)
                var skills = getRandomSkills(skillcap)
                var obsessions = getRandomObsessions()
                Session.set("name", name)
                Session.set("willpower", willpower)
                Session.set("skills", skills)
                Session.set("obsessions", obsessions)
                Session.set("view", true)
            }
        }
    })
    
    Template.generate.events({
        "click #configure": function() {
            Session.set("view", false)
        },
        "click #randomize": function() {
            var willpower = Session.get("willpower")
            var skillcap = getSkillcap(willpower)
            var skills = getRandomSkills(skillcap)
            Session.set("skills", skills)
            
            var obsessions = getRandomObsessions()
            Session.set("obsessions", obsessions)
        },
        "click #download": function() {
            var pdf = new jsPDF()
            pdf.setFont("times")
            
            pdf.setFontSize(32)
            pdf.text(20, 20+8, "Everyone is John")
            
            pdf.setFontSize(16)
            pdf.text(20, 20+8+8, "...this is still in development. :(")
            
            var name = Session.get("name")
            pdf.save(name + ".pdf")
            pdf.output("dataurlnewwindow");
        }
    })
}

if(Meteor.isServer) {
    Meteor.startup(function() {
        
        Skills.remove({})
        Obsessions.remove({})
        
        for(var index in DefaultSkills) {
            var skill = DefaultSkills[index]
            if(typeof skill == "string") {
                Skills.insert({
                    "value": skill,
                    "key": Math.random()
                })
            }
        }
        for(var level in DefaultObsessions) {
            for(var index in DefaultObsessions[level]) {
                var obsession = DefaultObsessions[level][index]
                if(typeof obsession == "string") {
                    Obsessions.insert({
                        "level": level,
                        "value": obsession,
                        "key": Math.random()
                    })
                }
            }
        }
    })
}
