// EX VO

var ref = require('ref');
var ffi = require('ffi');
var Struct = require('ref-struct');

var voidptr = ref.refType(ref.types.void);
var int64_t = ref.types.int64;
var intptr = ref.refType(ref.types.int);
var uint8_ptr = ref.refType(ref.types.uint8);

var ext_vo = null; // user defined vo

var dtvo = Struct(
{
    id:'int',
    name:'string',
    
	vo_init:voidptr,
    vo_stop:voidptr,
    vo_render:voidptr,
    
	handle:voidptr,
    next:voidptr,
    vo_priv:voidptr,
}
);

var pic_t = Struct(
{
    data0:uint8_ptr,
    data1:uint8_ptr,
    data2:uint8_ptr,
    data3:uint8_ptr,
    data4:uint8_ptr,
    data5:uint8_ptr,
    data6:uint8_ptr,
    data7:uint8_ptr,
    linesize0:'int',
    linesize1:'int',
    linesize2:'int',
    linesize3:'int',
    linesize4:'int',
    linesize5:'int',
    linesize6:'int',
    linesize7:'int',
    pts:int64_t,
    dts:int64_t,
    duration:'int'
}
);
var picptr = ref.refType(pic_t);

var vo_ex_init = ffi.Callback('int',[],function()
{
    if(ext_vo)
        ext_vo.vo_init();
    else
	    console.log('nodejs - no ext vo, init do nothing');
    return 0;
});

var vo_ex_stop = ffi.Callback('int',[],function()
{
    if(ext_vo)
        ext_vo.vo_stop();
    else
	    console.log('nodejs - no ext vo, stop do nothing');
	return 0;	
});

var vo_ex_render = ffi.Callback('int',[picptr],function(pic)
{
    if(ext_vo)
        ext_vo.vo_render(pic);
    else
	    console.log('nodejs- no ext vo, render do nothing');
	return 0;	
});

exports.reg_vo = function(vo)
{
    ext_vo = vo;
}

exports.getvo = function ()
{
    var vo = new dtvo();
    vo.id = 0;
    vo.name = 'ex vo';
    vo.vo_init = vo_ex_init;
    vo.vo_stop = vo_ex_stop;
    vo.vo_render = vo_ex_render;
    
    vo.handle = null;
    vo.next = null;
    vo.vo_priv = null;
    return vo;
}
