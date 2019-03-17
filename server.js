var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');

var fs = require('fs'),
    path = require('path');

var courses = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
 '11', '12', '14', '15', '16', '17', '18', '20',
 '21', '21A', 'CMS', '21W', '21G', '21H', '21L', '21M', 'WGS',
  '22', '24', 'CC', 'EC', 'EM', 'ES', 'HST', 'IDS', 'MAS', 'SCM', 'STS']
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message == '!mashup') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        var gen_msg_text = mashup();
        bot.sendMessage({
            to: channelID,
            message: gen_msg_text
        });
        /*args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
            break;
            // Just add any case commands if you want to..

         }*/
     }
});
function mashup() {
  var course_a = courses[Math.floor(Math.random() * courses.length)];
  var course_b = courses[Math.floor(Math.random() * courses.length)];
  // courses should be different
  while (course_a == course_b) {
    course_b = courses[Math.floor(Math.random() * courses.length)];
  }
  var class_a = randomClass("courses/" + course_a + ".json");
  var msg_a = "Title: " + class_a.title + ", Number: " + class_a.number + ", Desc: " + class_a.description;
  //console.log(msg_a);

  var class_b = randomClass("courses/" + course_b + ".json");
  var msg_b = "Title: " + class_b.title + ", Number: " + class_b.number + ", Desc: " + class_b.description;
  //console.log(msg_b);

  var new_title = zip(class_a.title, class_b.title);
  var new_number = class_a.number.substring(0, class_a.number.indexOf(".")) + class_b.number.substring(class_b.number.indexOf("."));
  var new_description = zip(class_a.description, class_b.description);
  var output = "Class: " + new_title + "\n"
  output += "Course Number: " + class_a.number + " & " + class_b.number + " = " + new_number + "\n"
  output += "Description: " + new_description;
  return output;
};

function randomClass(filepath) {
  let rawdata = fs.readFileSync(filepath);
  let all_classes = JSON.parse(rawdata);
  var obj_keys = Object.keys(all_classes);
  var ran_key = obj_keys[Math.floor(Math.random() *obj_keys.length)];
  var ran_class = all_classes[ran_key];
  return ran_class
};

function zip(a, b) {
  var array_a = a.split(" ");
  var array_b = b.split(" ");
  var c = ""
  var i = 0;
  for (i = 0; i < Math.min(array_a.length, array_b.length-1); i+=2) {
    c += array_a[i] + " " + array_b[i+1] + " ";
  }
  if (array_a.length > array_b.length) {
    c += array_a.slice(i).join(" ");
  }
  else {
    c += array_b.slice(i).join(" ");
  }
  return c;
};
