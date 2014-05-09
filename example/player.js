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
    full_time:dt_int64,
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


var player_status = {
    PLAYER_STATUS_INVALID:   -1,
    PLAYER_STATUS_IDLE:       0,
    
    PLAYER_STATUS_INIT_ENTER: 1,
    PLAYER_STATUS_INIT_EXIT:  2,

    PLAYER_STATUS_START:      3,
    PLAYER_STATUS_RUNNING:    4,

    PLAYER_STATUS_PAUSED:     5,
    PLAYER_STATUS_RESUME:     6,
    PLAYER_STATUS_SEEK_ENTER: 7,
    PLAYER_STATUS_SEEK_EXIT:  8,

    PLAYER_STATUS_ERROR:      9,
    PLAYER_STATUS_STOP:      10,
    PLAYER_STATUS_PLAYEND:   11,
    PLAYER_STATUS_EXIT:      12
};

var ply = new dtplayer();

var dtp_cb = ffi.Callback('void',[dtp_state_ptr],function(state)
{
	var info = state.deref();
    //ply.emit('update_info');

    var sta;
    switch(info.cur_status){
        case player_status.PLAYER_STATUS_EXIT:
             sta = '-exit-';
             break;
        case player_status.PLAYER_STATUS_RUNNING:
             sta = '-playing-';
             break;
        case player_status.PLAYER_EVENT_PAUSE:
             sta = '-pause-';
             break;
        case player_status.PLAYER_STATUS_SEEK_ENTER:
             sta = '-seeking-';
             break
        default:
             return '-unkown-';
    };

    console.log('cur time(s):' + info.cur_time + '  status:' + sta + '  full time:' + info.full_time);

    if(info.cur_status == player_status.PLAYER_STATUS_EXIT)
        ply.emit('play_end');
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
            width = process.argv[index+1];
            break;
        case '-h':
            height = process.argv[index+1];
            break;
        case '-noaudio':
            no_audio = process.argv[index+1];
            break;
        case '-novideo':
            no_video = process.argv[index+1];
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

