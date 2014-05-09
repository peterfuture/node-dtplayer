// dtplayer.js

var os = require('os');
var ref = require('ref');
var ffi = require('ffi');

var fs = require('fs');
var events = require('events');
var util = require('util');

var voidptr = ref.refType(ref.types.void);

var dtpLibPath;
if(os.platform() === 'linux')
{
    if(os.arch() === 'x64')
        dtpLibPath = 'vendor/linux_x64/libdtp';
    else
        dtpLibPath = 'vendor/linux_x86/libdtp';
}
else if(os.platform() === 'win32')
{
    console.log("not support win32 yet");
}
else if(os.platform() === 'win64')
{
    console.log("not support win64 yet");
}
else if(os.platform() === 'darwin')
{
    console.log("not support mac yet");
}

if(!dtpLibPath)
{
    console.log('can not find dtp lib, quit \n');
}

// open shared lib
var dtplib =ffi.Library(dtpLibPath,
{
    "player_register_all":['void',[]],
	"register_ext_ao":['void',[voidptr]],
	"register_ext_vo":['void',[voidptr]],
	"dtplayer_init":['pointer',[voidptr]],
    "dtplayer_start":['int',[voidptr]],
}
);


module.exports = dtplayer;

function errHandler(err) {
    if (err) throw err;
        return false;
}

function dtplayer()
{
    var para;
    var priv;
    
    this.bindEvents();
    events.EventEmitter.call(this);
    console.log('[node-js] : dtplayer constructer');
}

util.inherits(dtplayer, events.EventEmitter);

dtplayer.prototype.init = function(p)
{
	this.para = p;
    dtplib.player_register_all();
    this.priv = dtplib.dtplayer_init(this.para.ref());
}


//start play one file
/*
 * start playing file stored in para
 *
 * */
dtplayer.prototype.start = function()
{
    //dtplib.dtplayer_start.async(this.priv,function(err,res){console.log('play end' + err)});
    dtplib.dtplayer_start(this.priv);
}

dtplayer.prototype.pause = function()
{
    return 0;
}

dtplayer.prototype.resume = function()
{
    return 0;
}

dtplayer.prototype.seek = function()
{
    return 0;
}

/*
 * stop playing and unpipe stream.
 * No params for now
 *
 * */
dtplayer.prototype.stop = function()
{
    
    return 0;
}

/*
 * Bind some useful events
 * @events.playing: on playing, keeping play history up to date. 
 *
 * */
dtplayer.prototype.bindEvents = function()
{
    this.on('playing',function(){console.log("receive playing signal")});
    this.on('update_info',function()
    {
		console.log('update info occured');
    }        
    );

}
