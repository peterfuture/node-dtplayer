var Ffmpeg = require('../index'),
  path = require('path'),
  testhelper = require('./helpers'),
  assert = require('assert');

// kinda nasty...
var ext = new Ffmpeg({ source: path.join(__dirname, 'assets', 'testvideo-43.avi'), logger: testhelper.logger });
describe('Extensions', function() {
  describe('parseVersionString', function() {
    it('should parse the major/minor/patch version correctly', function() {
      var ret = ext.parseVersionString('4.5.123');
      ret.should.have.property('major').with.valueOf(4);
      ret.should.have.property('minor').with.valueOf(5);
      ret.should.have.property('patch').with.valueOf(123);
    });
  });

  describe('atLeastVersion', function() {
    it('should correctly compare a full version number', function() {
      ext.atLeastVersion('2.3.4532', '2.3.4531').should.be.true;
    });
    it('should correctly compare a version number without patch version', function() {
      ext.atLeastVersion('2.3', '2.2.32').should.be.true;
    });
    it('should correctly compare a major version number', function() {
      ext.atLeastVersion('3', '2.9.912').should.be.true;
    });
    it('should correctly compare an exact version match', function() {
      ext.atLeastVersion('1.2.34', '1.2.34').should.be.true;
    });
  });

  describe('ffmpegTimemarkToSeconds', function() {
    it('should correctly convert a simple timestamp', function() {
      ext.ffmpegTimemarkToSeconds('00:02:00.00').should.be.equal(120);
    });
    it('should correctly convert a complex timestamp', function() {
      ext.ffmpegTimemarkToSeconds('00:08:09.10').should.be.equal(489.1);
    });
    it('should correclty convert a simple float timestamp', function() {
      ext.ffmpegTimemarkToSeconds('132.44').should.be.equal(132.44);
    });
  });
});
