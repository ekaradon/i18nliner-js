var fs;

var maybeLoadJSON = function (path){
  fs = fs || require("fs");
  var data = {}
  if (fs.existsSync(path)) {
    try {
      data = JSON.parse(fs.readFileSync(path).toString());
    } catch (e) {
      console.log(e);
    }
  }
  return data;
}

var I18nliner = {
  ignore () {
    fs = fs || require("fs");
    var ignores = [];
    if (fs.existsSync(".i18nignore")) {
      ignores = fs.readFileSync(".i18nignore").toString().trim().split(/\r?\n|\r/);
    }
    return ignores;
  },

  set (key, value, fn) {
    var prevValue = this.config[key];
    this.config[key] = value;
    if (fn) {
      try {
        fn();
      }
      finally {
        this.config[key] = prevValue;
      }
    }
  },

  loadConfig () {
    var config = maybeLoadJSON(".i18nrc");

    for (var key in config) {
      if (key !== "plugins") {
        this.set(key, config[key]);
      }
    }

  },

  config: {
    inferredKeyFormat: 'underscored_crc32',
    /*
      literal:
        Just use the literal string as its translation key
      underscored:
        Underscored ascii representation of the string, truncated to
        <underscoredKeyLength> bytes
      underscored_crc32:
        Underscored, with a checksum at the end to avoid collisions
    */

    underscoredKeyLength: 50,

    basePath: ".",
    /*
      Where to look for files. Additionally, the output json file
      will be relative to this.
     */

    directories: []
    /*
      Further limit extraction to these directories. If empty,
      I18nliner will look everywhere under <basePath>
     */
  }
};

export default I18nliner;
