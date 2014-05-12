// EX VO

var ref = require('ref');
var ffi = require('ffi');
var Struct = require('ref-struct');

var voidptr = ref.refType(ref.types.void);

var EX_VO = Struct(
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
 	data:voidptr,
	linesize:voidptr,
    pts:'int',
	dts:'int',
	duration:'int'
}
);
pic_ptr = ref.refType(pic_t);


/*
function EX_VO()
{
	var id;
	var name;
	this.handle = null;
	this.next = null;
	this.vo_priv = null;
}*/

var vo_ex_init = ffi.Callback('int',[],function()
{
	console.log('init');
	return 0;	
});

var vo_ex_stop = ffi.Callback('int',[],function()
{
	console.log('stop');
	return 0;	
});

var vo_ex_render = ffi.Callback('int',[pic_ptr],function(pic)
{
	console.log('render one frame');
	return 0;	
});

exports.getVO = function ()
{
	//var vo = new EX_VO();
	var vo = ref.alloc(EX_VO)
	vo.id = 0;
	vo.name = 'ex vo';
	vo.vo_init = vo_ex_init;
	vo.vo_stop = vo_ex_stop;
	vo_vo_render = vo_ex_render;
	return vo;
}

//test
/*
var ex_vo = new EX_VO();
ex_vo.id = 0;
ex_vo.name = 'ex vo';

console.log(ex_vo.id);
console.log(ex_vo.name);
ex_vo.vo_init();
ex_vo.vo_stop();
ex_vo.vo_render();
*/
