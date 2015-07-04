var Games = new Mongo.Collection("games")
var Users = new Mongo.Collection("users")

if(Meteor.isClient) {
    var user_id = Users.insert({})
    Session.set("user_id", user_id)

    Router.route("/game/:game_code", function() {
        var game_code = this.params.game_code
        var game = Games.findOne({
            "code": game_code
        })
        var user_id = Session.get("user_id")
        var user = Users.findOne({
            "_id": user_id
        })

        if(!game) {
            this.render("nogame", {
                data: {
                    "game_code": game_code
                }
            })
        } else if(game.master == user_id) {
            Router.go("game/:game_code/gm", {
                "game_code": game_code
            })
        } else {
            Router.go("game/:game_code/voice", {
                "game_code": game_code
            })
        }
    }, {name: "game/:game_code"})

    Router.route("/game/:game_code/gm", function() {
        var game_code = this.params.game_code
        var game = Games.findOne({
            "code": game_code
        })
        var user_id = Session.get("user_id")
        var user = Users.findOne({
            "_id": user_id
        })

        if(game.master == user_id) {
            this.render("master")
        } else {
            Router.go("game/:game_code")
        }
    }, {name: "game/:game_code/gm"})

    Router.route("/game/:game_code/voice", function() {
        var game_code = this.params.game_code
        var game = Games.findOne({
            "code": game_code
        })
        var user_id = Session.get("user_id")
        var user = Users.findOne({
            "_id": user_id
        })
        var voice = game.voices[game.voices.indexOf(user_id)]
        if(!voice) {
            //make a new user
        } else {
            Router.go("game/:game_code/voice/:voice_code", {
                "game_code": game_code,
                "voice_code": voice.code
            })
        }
    }, {name: "game/:game_code/voice"})

    Router.route("/game/:game_code/voice/:voice_code", function() {
        var game_code = this.params.game_code
        var voice_code = this.params.voice_code
        this.render("voice", {
            "game_code": game_code,
            "voice_code": voice_code
        })
    }, {name: "game/:game_code/voice/:voice_code"})

    Template.registerHelper("print", function() {
        console.log(this)
    })
}

if(Meteor.isServer) {
    Meteor.startup(function() {
        Users.remove({})
        Games.remove({})
        Games.insert({
            "name": "Adventures of Awesomesauce",
            "code": "awesomesauce",
            "users": {
                "master": "PM9LKALL2ATCY27VV",
            },
            "chats": new Array()
        })
    })
}
