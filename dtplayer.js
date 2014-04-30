// dtplayer.js

var ref = require('ref');
var ffi = require('ffi');
var refstruct = require('ref-struct');

// type def
var dt_int = ref.types.int;
var dt_int64 = ref.types.int64;
var dt_char = ref.types.char;

// structure def
var dtp_state = refstruct(
{
    cur_status:dt_int,
    last_status:dt_int,
    cur_time_ms:dt_int64,
    cur_time:dt_int64,
    start_time:dt_int64
}
);
var dtp_state_ptr = ref.refType(dtp_state);

var dtp_para = refstruct(
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
    update_cb:dtp_state_ptr
}
);
var dtp_para_ptr = ref.refType(dtp_para);

// callback def
var cb = function(state)
{
    console.log("cur time:" + state.deref().cur_time);
    console.log("status:" + state.deref().cur_status);
    console.log("last status:" + state.deref().last_status);
}
var dtp_cb = ffi.Callback('void',[dtp_state_ptr],cb);

// open shared lib
var dtplib =ffi.Library('vendor/linux_x64/libdtp',
{
    "player_register_all":['void',[]],
    "dtplayer_init":['pointer',[dtp_para_ptr]],
}
);

/*-----------------------------------------------*/
//start player
var para = new dtp_para();
para.file_name = "../1.aac";
para.width = 720;
para.height = 480;
para.update_cb = dtp_cb;
console.log("file name:%s ",para.file_name);

dtplib.player_register_all();
var priv = dtplib.dtplayer_init(para.ref());
