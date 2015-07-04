var Games = new Mongo.Collection("games")
var Users = new Mongo.Collection("users")

if(Meteor.isClient) {
    var user_id = Users.insert({})
    Session.set("user_id", user_id)

    Router.route("/", function() {
        var game_code = "awesomesauce"
        var game = Games.findOne({
            "code": game_code
        })
        var user_id = Session.get("user_id")
        var user = Users.findOne({
            "_id": user_id
        })

        if(!game) {
            this.render("nogame")
            return
        }

        if(false) {
            this.render("voice", {
                "data": {
                    "game_code": game_code,
                    "user_id": user_id
                }
            })
        } else {
            this.render("newvoice", {
                "data": {
                    "game_code": game_code,
                    "user_id": user_id
                }
            })
        }
    })

    Template.newvoice.events({
        "submit form": function(event) {
            event.preventDefault()
            var name = event.target.name.value
            console.log(this)
        }
    })
}

if(Meteor.isServer) {
    Meteor.startup(function() {
        Users.remove({})
        Games.remove({})
        Games.insert({
            "name": "Adventures of Awesomesauce",
            "code": "awesomesauce",
            "users": {}
        })
    })
}
