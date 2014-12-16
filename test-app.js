Items = new Mongo.Collection('items');

if (Meteor.isClient) {

  Template.body.helpers({
    items: function() {
      return Items.find({});
    },
    content: function() {
      return Session.get("content");
    }
  });

  Template.body.events({
    "submit #new-item": function(event) {
      var title = event.target.name.value,
        desc = event.target.desc.value,
        content = Session.get("content");

  // if diaplayed item then add subitem
      if (content) {
        Items.update({ _id: content.id },
          { $push: {
              subitems: {
                _id: content.id,
                title: title, 
                desc: desc,
                level:1
              }
            }
          });
      } else {
        Items.insert({
          title: title,
          desc: desc,
          level:0,
          subitems: []
        });
      };

      // Clear form
      event.target.name.value = "";
      event.target.desc.value = "";
      event.target.submit.disabled = true;
      // Prevent default form submit
      return false;
    },
    "click #del": function() {
      var content = Session.get("content");

      if (content.level === 0) {
        Items.remove({_id: content.id});
      } else {
        Items.update({_id: content.id}, {
          $pull: { subitems:{ title: content.title }}
        });
      };
      
      // Clear content
      Session.set("content", null);

      return false;
    },
    "click ul>li>a": function() {
      Session.set("content", {
        id: this._id,
        title: this.title, 
        desc: this.desc,
        level: this.level
      });

      // if displayed item submenu, set disabled input
      if (!this.level) {
        item.name.disabled = false;
        item.desc.disabled = false;
      } else {
        item.name.disabled = true;
        item.desc.disabled = true;
      };

      return false;
    },
    "click li span": function() {
      Session.set("content", null);
    },
    // if form empty then btn is disabled
    "keyup input[name='name']": function() {
      if (item.name.value)
        item.submit.disabled = false;
      else
        item.submit.disabled = true;
    }

  });
};

if (Meteor.isServer) {
 Meteor.startup(function () {
    // code to run on server at startup
  });
}
