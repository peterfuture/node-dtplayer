//start player
var ref = require('ref');
var ffi = require('ffi');
var Struct = require('ref-struct');

var fs = require('fs');
var events = require('events');
var async = require('async');
var util = require('util');

var dtplayer = require('../index.js');

// type def
var dt_int = ref.types.int;
var dt_int64 = ref.types.int64;
var dt_char = ref.types.char;
var voidptr = ref.refType(ref.types.void);
// structure def
var dtp_state = Struct(
{
    cur_status:dt_int,
    last_status:dt_int,
    cur_time_ms:dt_int64,
    cur_time:dt_int64,
    start_time:dt_int64
}
);
var dtp_state_ptr = ref.refType(dtp_state);

var dtp_para = Struct(
{
    file_name:'string',
    video_index:dt_int,
    audio_index:dt_int,
    sub_index:dt_int,
    loop_mode:dt_int,
    no_audio:dt_int,
    no_video:dt_int,
    no_sub:dt_int,
    sync_enable:dt_int,
    width:dt_int,
    height:dt_int,
    update_cb:voidptr
}
);
var dtp_para_ptr = ref.refType(dtp_para);

var ply = new dtplayer();

var dtp_cb = ffi.Callback('void',[dtp_state_ptr],function(state)
{
	var info = state.deref();
    console.log("cur time:" + state.deref().cur_time);
    console.log("status:" + state.deref().cur_status);
    console.log("last status:" + state.deref().last_status);
	ply.emit('update_info');
});

var url = process.argv[2];
var no_audio = -1;
var no_video = -1
var width = 720;
var height = 480;

console.log(url);
process.argv.forEach(function (val, index, array) {
    switch(val)
    {
        case '-w':
            width = val;
            break;
        case '-h':
            height = val;
            break;
        case 'noaudio':
            no_audio = val;
            break;
        case 'novideo':
            no_video = val;
            break;
        default:
            break;
    }
});

var para = new dtp_para();
para.file_name = url;
para.no_audio = no_audio;
para.no_video = no_video;
para.width = width;
para.height = height;
para.update_cb = dtp_cb;

ply.init(para);
ply.start();

