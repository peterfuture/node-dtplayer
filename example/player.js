//first set dt prebuild lib path
g_dtp = process.cwd();

//start player
var ref = require('ref');
var ffi = require('ffi');
var Struct = require('ref-struct');
var dtplayer = require('../index.js');

// type def
var int64_t = ref.types.int64;
var voidptr = ref.refType(ref.types.void);

// structure def
var dtp_state = Struct( {
  cur_status: 'int',
  last_status: 'int',
  cur_time_ms: int64_t,
  cur_time: int64_t,
  full_time: int64_t,
  start_time: int64_t,
  discontinue_point_ms: int64_t
});
var dtp_state_ptr = ref.refType(dtp_state);

var dtp_para = Struct( {
  file_name: 'string',
  video_index: 'int',
  audio_index: 'int',
  sub_index: 'int',
  loop_mode: 'int',
  disable_audio: 'int',
  disable_video: 'int',
  disable_sub: 'int',
  disable_avsync: 'int',
  disable_hw_acodec: 'int',
  disable_hw_vcodec: 'int',
  disable_hw_scodec: 'int',
  video_pixel_format: 'int',
  width: 'int',
  height: 'int',
  cookie: voidptr,
  update_cb: voidptr
});
var dtp_para_ptr = ref.refType(dtp_para);

var player_status = {
  PLAYER_STATUS_INVALID:-1,
  PLAYER_STATUS_IDLE:           0,

  PLAYER_STATUS_INIT_ENTER:     1,
  PLAYER_STATUS_INIT_EXIT:      2,

  PLAYER_STATUS_PREPARE_START:  3,
  PLAYER_STATUS_PREPARED:       4,

  PLAYER_STATUS_START:          5,
  PLAYER_STATUS_RUNNING:        6,

  PLAYER_STATUS_PAUSED:         7,
  PLAYER_STATUS_RESUME:         8,
  PLAYER_STATUS_SEEK_ENTER:     9,
  PLAYER_STATUS_SEEK_EXIT:      10,

  PLAYER_STATUS_ERROR:          11,
  PLAYER_STATUS_STOP:           12,
  PLAYER_STATUS_PLAYEND:        13,
  PLAYER_STATUS_EXIT:           14
};

//reg vo

var canvas_vo = {
  id: 1000,
  name: 'canvas render',
  vo_init:
  function(p) {
      console.log('yeah, canvas init ok');
  },
  vo_stop:
  function(p) {
      console.log('yeah, canvas stop ok');
  },
  vo_render:
  function(p, pic) {
      var picture = pic.deref();
      var data = picture.data0;
      var rgb_data = data.reinterpret(720 * 480 * 3)
  }
};

var g_player = null;
var dtp_cb = ffi.Callback('int', [voidptr, dtp_state_ptr], function(cookie, state)
{
    var info = state.deref();
    var sta;
    switch (info.cur_status) {
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
        return 0;
    };

    console.log('cur time(s):' + info.cur_time + '  status:' + sta + '  full time:' + info.full_time);

    if (info.cur_status == player_status.PLAYER_STATUS_EXIT && g_player) {
        g_player.emit('play_end');
    }
    return 0;
});

var url = process.argv[2];
var no_audio = -1;
var no_video = -1
               var width = 720;
var height = 480;

process.argv.forEach(function(val, index, array)
{
    switch (val) {
    case '-w':
        width = process.argv[index + 1];
        break;
    case '-h':
        height = process.argv[index + 1];
        break;
    case '-noaudio':
        no_audio = process.argv[index + 1];
        break;
    case '-novideo':
        no_video = process.argv[index + 1];
        break;
    default:
        break;
    }
});

var para = new dtp_para;
para.file_name = url;
para.audio_index = -1;
para.video_index = -1;
para.sub_index = -1;

para.loop_mode = 0;
para.disable_audio = 0;
para.disable_video = 0;
para.disable_sub = 0;
para.disable_avsync = 0;

para.disable_hw_acodec = 0;
para.disable_hw_vcodec = 0;
para.disable_hw_scodec = 0;
para.video_pixel_format = 2;

para.width = -1;
para.height = -1;
para.cookie = null;

para.update_cb = dtp_cb;

g_player = new dtplayer;
//reg vo
g_player.reg_vo(canvas_vo);

g_player.init(para);
g_player.start();

//read cmd from stdin
var stdin = process.openStdin();
process.stdin.setRawMode(true);
process.stdin.resume();

stdin.on('data', function(trunk)
{
    process.stdout.write('get key:' + trunk + '\n');
    //console.log('get key:'+trunk);
    if (trunk == 'q') {
        g_player.stop();
        process.exit();

    } else if (trunk == 'p') {
        g_player.pause();
    } else if (trunk == '+') {
        g_player.seek(60);
    } else if (trunk == '-') {
        g_player.seek(-60);
    } else {
        console.log('invalid cmd: ' + trunk);
    }
}
);
