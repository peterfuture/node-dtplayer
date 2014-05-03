//av render module

var ref = require('ref');
var Struct = require('ref-struct');

// type def
var int64_t = ref.types.int64;
var voidptr = ref.refType(ref.types.void); // void *

var DTAO = require('./audio');
var dtao = new DTAO();

//var video = require('./video');

// structure def
var dtao = Struct(
{
    id:'int',
    name:'string',
    ao_init:voidptr,
    ao_start:voidptr,
    ao_resume:voidptr,
    ao_stop:voidptr,
    ao_latency:voidptr,
    ao_level:voidptr,
    ao_write:voidptr,
    next:voidptr,
    ao_priv:voidptr,
    parent:voidptr
}
);

var dtao_ref = ref.refType(dtao);

function ao_ex_init(wrapper,p)
{
	dtao.init();
	console.log("ao_ext init ok");
	return 0;
}

function ao_ex_pause(wrapper)
{
	dtao.pause();
	console.log("ao_ext pause ok");
	return 0;
}

var ex_ao = new dtao();
ex_ao.id = 0x1000; // no one use
ex_ao.name = "EX AO";
ex_ao.ao_init = ao_ex_init;
ex_ao.ao_pause = ao_ex_pause;
