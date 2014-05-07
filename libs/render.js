//av render module

var ref = require('ref');
var ffi = require('ffi');
var Struct = require('ref-struct');

// type def
var int64_t = ref.types.int64;
var voidptr = ref.refType(ref.types.void); // void *

var DTAO = require('./audio');
var dtao = new DTAO();

var DTVO = require('./video');
var dtvo = new DTVO();

//=========================================
// EX VO

function EX_AO()
{
    var id;
    var name;
    var ao_priv;
    var next;
    var para;

    this.ao_init = function(ppara)
    {
        para = ppara;
        console.log('init ok');
    };
    
    this.ao_start = function()
    {
        console.log('start ok');
    };
    
    this.ao_pause = function()
    {
        console.log('pause ok');
    };
    
    this.ao_resume = function()
    {
        console.log('resume ok');
    };
    
    this.ao_stop = function()
    {
        console.log('stop ok');
    };
    
    this.ao_latency = function()
    {
        console.log('get latency ok');
    };
    
    this.ao_level = function()
    {
        console.log('level ok');
    };
    
    this.ao_write = function()
    {
        console.log('write ok');
    };

}

module.exports = EX_AO;

//ex ao test code
/* 
var ao = new EX_AO();
ao.id = 0x10000;
ao.name = "EX AO";
console.log("id: %d name:%s",ao.id,ao.name);

var para = new Object();
para.channels = para.dst_channels = 2;
para.samplerate = para.dst_samplerate = 44100;
para.data_width = 16;
para.bps = 16;
para.num = para.den = 1;
para.extradata_size = 0;
para.extradata = null;
para.afmt = 1;
para.audio_filter = -1;
para.audio_output = -1;
para.avctx_priv = null;

ao.ao_init(para);
*/





//=========================================
// EX VO








