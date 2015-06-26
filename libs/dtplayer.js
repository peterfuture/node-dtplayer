// dtplayer.js

var os = require('os');
var ref = require('ref');
var ffi = require('ffi');

var fs = require('fs');
var events = require('events');
var util = require('util');

var dt_vo = require('./video.js');
var ex_vo = dt_vo.getvo();

var voidptr = ref.refType(ref.types.void);

var dtpLibPath;
if(os.platform() === 'linux')
{
    if(os.arch() === 'x64')
        dtpLibPath = g_dtp + '/library/linux_x64/libdtp';
    else
        dtpLibPath = g_dtp + '/library/linux_x86/libdtp';
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
    process.exit();
}

// open shared lib
console.log('load so :'+dtpLibPath);
var dtplib =ffi.Library(dtpLibPath,
{
	"dtplayer_register_ext_ao":['void',[voidptr]],
	"dtplayer_register_ext_vo":['void',[voidptr]],
	"dtplayer_init":['pointer',[voidptr]],
    "dtplayer_start":['int',[voidptr]],
    "dtplayer_pause":['int',[voidptr]],
    "dtplayer_resume":['int',[voidptr]],
    "dtplayer_seek":['int',[voidptr,'int']],
    "dtplayer_stop":['int',[voidptr]],
}
);


function errHandler(err) {
    if (err) throw err;
        return false;
}

function dtplayer()
{
    var para;
    var priv;
    var beat_timer;

    this.bindEvents();
    events.EventEmitter.call(this);
    console.log('[node-js] : dtplayer constructer');
}

util.inherits(dtplayer, events.EventEmitter);

dtplayer.prototype.init = function(p)
{
	this.para = p;
	dtplib.dtplayer_register_ext_vo(ex_vo.ref());
    this.priv = dtplib.dtplayer_init(this.para.ref());
}

dtplayer.prototype.start = function()
{
    //dtplib.dtplayer_start.async(this.priv,function(err,res){console.log('play end' + err)});
    dtplib.dtplayer_start(this.priv);
    this.emit('playing');
}

dtplayer.prototype.pause = function()
{
    dtplib.dtplayer_pause(this.priv);
}

dtplayer.prototype.resume = function()
{
    dtplib.dtplayer_resume(this.priv);
}

dtplayer.prototype.seek = function(pos)
{
    dtplib.dtplayer_seek(this.priv,pos);
}

dtplayer.prototype.stop = function()
{
    dtplib.dtplayer_stop(this.priv);
}

dtplayer.prototype.reg_vo = function(vo)
{
    dt_vo.reg_vo(vo);
}


dtplayer.prototype.bindEvents = function()
{
    this.on('playing',function(){
        console.log("start playing");
    });

    this.on('update_info',function()
    {
		//console.log('update info occured');
    }
    );

    this.on('play_end',function(){
		console.log('player end events occured ');
		//process.exit();
    }
    );
}

module.exports = dtplayer;
