
var events = require('events');
var eventEmitter = new events.EventEmitter();
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'poojahy62@gmail.com',
    pass: 'poojahemant2'
  }
});


//this section used to read json file from directory that is mailbox

var fs = require('fs');
fs.readdir('./MailBox', function (err, files) {
 if (err)
    throw err;
 for (var index in files) {
	var content = fs.readFileSync("./MailBox/"+files[index]);
	var jsonContent = JSON.parse(content);
	sendmail_fun(files[index],jsonContent);
 }
 });
 
 
 
 
 function sendmail_fun(files,jsonContent)
{
transporter.sendMail(jsonContent, function(error, info){
if (error) {
     fail(files,jsonContent);
  } else {
    success(files,jsonContent);
  }
});
}



var copyFileInInbox = function (files,jsonContent) {
    var myJSON = JSON.stringify(jsonContent);
    const fs = require('fs');
    fs.writeFile("./Inbox/"+files+".json", myJSON, function(err) {
        if(err) {
            return console.log(err);
        }
    }); 
}

var copyFileInDraft =  function (files,jsonContent) {
    var myJSON = JSON.stringify(jsonContent);
    const fs = require('fs');
    fs.writeFile("./Draft/"+files+".json", myJSON, function(err) {
        if(err) {
            return console.log(err);
        }
    }); 
}

eventEmitter.on('copyFileInInbox', copyFileInInbox);
eventEmitter.on('copyFileInDraft', copyFileInDraft);

function success(files,jsonContent){
    eventEmitter.emit('copyFileInInbox',files,jsonContent);
}

function fail(files,jsonContent){
eventEmitter.emit('copyFileInDraft',files,jsonContent);
}