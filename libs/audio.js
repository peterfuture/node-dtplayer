// audio render with node-speaker

// for now , have not found one proper ao
// so use dtplayer buildin ao as default

//var ao_real = require('');

function AO_EX()
{
    var id;
    var name;
    var ao_priv;
    var next;
    var para;

    this.ao_init = function(ppara)
    {
        console.log(this.id);
        para = ppara;
        console.log(para.dst_channels);
        console.log(para.dst_samplerate);
        console.log(para.bps);
        console.log(para.data_width);

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

module.exports = AO_EX;

var ao = new AO_EX();
ao.id = 0; // 0 as defautl ex ao id
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
