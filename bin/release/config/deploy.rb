# config valid only for current version of Capistrano
lock "3.8.1"

set :application, "MYukkuriVoice"
set :package_name, "MYukkuriVoice-darwin-x64"
set :repo_url, "git@github.com:taku-o/myukkurivoice.git"
set :electron_packager, "../../../node_modules/.bin/electron-packager"

# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp

# Default deploy_to directory is /var/www/my_app_name
# set :deploy_to, "/var/www/my_app_name"

# Default value for :format is :airbrussh.
# set :format, :airbrussh

# You can configure the Airbrussh format using :format_options.
# These are the defaults.
# set :format_options, command_output: true, log_file: "log/capistrano.log", color: :auto, truncate: :auto

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
# append :linked_files, "config/database.yml", "config/secrets.yml"

# Default value for linked_dirs is []
# append :linked_dirs, "log", "tmp/pids", "tmp/cache", "tmp/sockets", "public/system"

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for keep_releases is 5
# set :keep_releases, 5

task :clean do
  run_locally do
    application = fetch :application
    execute "rm -rf #{application}"
  end
end

task :package do
  run_locally do
    application = fetch :application
    package_name = fetch :package_name
    electron_packager = fetch :electron_packager

    # fetch source code
    execute "git clone #{fetch :repo_url} #{application}"

    # npm install
    execute "cd #{application}; npm install --only=production"

    # git init
    execute "cd #{application}; git submodule update --init"

    # build
    execute "cd #{application}; #{electron_packager} . #{application} --platform=darwin --arch=x64 --electronVersion=1.7.9 --icon=icns/myukkurivoice.icns --overwrite --asar.unpackDir=vendor " +
      ' --ignore="^/MYukkuriVoice-darwin-x64" ' +
      ' --ignore="^/README.md" ' +
      ' --ignore="^/\.git" ' +
      ' --ignore="^/\.gitignore" ' +
      ' --ignore="^/\.gitmodules" ' +
      ' --ignore="^/bin" ' +
      ' --ignore="^/docs" ' +
      ' --ignore="^/icns" ' +
      ' --ignore="^/test" ' +
      ' --ignore="^/vendor/\.gitignore" ' +
      ' --ignore="^/vendor/aqk2k_mac" ' +
      ' --ignore="^/vendor/aqtk1-mac" ' +
      ' --ignore="^/vendor/aqtk10-mac" ' +
      ' --ignore="^/vendor/aqtk2-mac" ' +
      ' --ignore="^/js/apps.spec.js" ' +    # is test code
      ' --ignore="^/contents-spec.html" ' + # is test code
      ' --ignore="^/package-lock.json" ' +
      ' --ignore="^/tsconfig.json" ' +
      ' --ignore="^/.+\.ts" ' +
      ' --ignore="^/js/.+\.ts" ' +
      ' --ignore="^/Gemfile" ' +
      ' --ignore="^/Gemfile.lock" ' +
      ' --ignore=".DS_Store" ' +
      ' --ignore=".babelrc" ' +
      ' --ignore=".editorconfig" ' +
      ' --ignore=".eslintrc" ' +
      ' --ignore=".eslintrc.json" ' +
      ' --ignore=".jshintrc" ' +
      ' --ignore=".npmignore" ' +
      ' --ignore=".prettierrc.json" ' +
      ' --ignore=".stylelintrc.json" ' +
      ' --ignore=".travis.yml" ' +
      ' --ignore="^/node_modules/about-window/LICENSE.txt" ' +
      ' --ignore="^/node_modules/about-window/README.md" ' +
      ' --ignore="^/node_modules/angular-input-highlight/README.md" ' +
      ' --ignore="^/node_modules/angular-input-highlight/test" ' +
      ' --ignore="^/node_modules/angular/LICENSE.md" ' +
      ' --ignore="^/node_modules/angular/README.md" ' +
      ' --ignore="^/node_modules/async/CHANGELOG.md" ' +
      ' --ignore="^/node_modules/async/LICENSE" ' +
      ' --ignore="^/node_modules/async/README.md" ' +
      ' --ignore="^/node_modules/audio-buffer-stream/README.md" ' +
      ' --ignore="^/node_modules/audio-buffer-stream/test" ' +
      ' --ignore="^/node_modules/balanced-match/LICENSE.md" ' +
      ' --ignore="^/node_modules/balanced-match/README.md" ' +
      ' --ignore="^/node_modules/bindings/README.md" ' +
      ' --ignore="^/node_modules/brace-expansion/README.md" ' +
      ' --ignore="^/node_modules/concat-map/LICENSE" ' +
      ' --ignore="^/node_modules/concat-map/README.markdown" ' +
      ' --ignore="^/node_modules/concat-map/example" ' +
      ' --ignore="^/node_modules/concat-map/test" ' +
      ' --ignore="^/node_modules/conf/license" ' +
      ' --ignore="^/node_modules/conf/readme.md" ' +
      ' --ignore="^/node_modules/core-util-is/LICENSE" ' +
      ' --ignore="^/node_modules/core-util-is/README.md" ' +
      ' --ignore="^/node_modules/core-util-is/test.js" ' +
      ' --ignore="^/node_modules/cryptico.js/README.md" ' +
      ' --ignore="^/node_modules/cryptico.js/sample" ' +
      ' --ignore="^/node_modules/debug/CHANGELOG.md" ' +
      ' --ignore="^/node_modules/debug/LICENSE" ' +
      ' --ignore="^/node_modules/debug/Makefile" ' +
      ' --ignore="^/node_modules/debug/README.md" ' +
      ' --ignore="^/node_modules/dot-prop/license" ' +
      ' --ignore="^/node_modules/dot-prop/readme.md" ' +
      ' --ignore="^/node_modules/electron-config/license" ' +
      ' --ignore="^/node_modules/electron-config/readme.md" ' +
      ' --ignore="^/node_modules/electron-is-accelerator/LICENSE" ' +
      ' --ignore="^/node_modules/electron-is-accelerator/README.md" ' +
      ' --ignore="^/node_modules/electron-is-accelerator/test.js" ' +
      ' --ignore="^/node_modules/electron-json-storage/CHANGELOG.md" ' +
      ' --ignore="^/node_modules/electron-json-storage/README.md" ' +
      ' --ignore="^/node_modules/electron-json-storage/doc" ' +
      ' --ignore="^/node_modules/electron-json-storage/tests" ' +
      ' --ignore="^/node_modules/electron-localshortcut/license" ' +
      ' --ignore="^/node_modules/electron-localshortcut/readme.md" ' +
      ' --ignore="^/node_modules/electron-log/LICENSE" ' +
      ' --ignore="^/node_modules/electron-log/README.md" ' +
      ' --ignore="^/node_modules/env-paths/license" ' +
      ' --ignore="^/node_modules/env-paths/readme.md" ' +
      ' --ignore="^/node_modules/exists-file/CHANGELOG.md" ' +
      ' --ignore="^/node_modules/exists-file/LICENSE.md" ' +
      ' --ignore="^/node_modules/ffi/CHANGELOG.md" ' +
      ' --ignore="^/node_modules/ffi/LICENSE" ' +
      ' --ignore="^/node_modules/ffi/README.md" ' +
      ' --ignore="^/node_modules/ffi/deps" ' +
      ' --ignore="^/node_modules/ffi/example" ' +
      ' --ignore="^/node_modules/ffi/src" ' +
      ' --ignore="^/node_modules/ffi/test" ' +
      ' --ignore="^/node_modules/find-up/license" ' +
      ' --ignore="^/node_modules/find-up/readme.md" ' +
      ' --ignore="^/node_modules/fs.realpath/LICENSE" ' +
      ' --ignore="^/node_modules/fs.realpath/README.md" ' +
      ' --ignore="^/node_modules/glob/LICENSE" ' +
      ' --ignore="^/node_modules/glob/README.md" ' +
      ' --ignore="^/node_modules/glob/changelog.md" ' +
      ' --ignore="^/node_modules/inflight/LICENSE" ' +
      ' --ignore="^/node_modules/inflight/README.md" ' +
      ' --ignore="^/node_modules/inherits/LICENSE" ' +
      ' --ignore="^/node_modules/inherits/README.md" ' +
      ' --ignore="^/node_modules/intro.js/CODE_OF_CONDUCT.md" ' +
      ' --ignore="^/node_modules/intro.js/CONTRIBUTING.md" ' +
      ' --ignore="^/node_modules/intro.js/Makefile" ' +
      ' --ignore="^/node_modules/intro.js/README.md" ' +
      ' --ignore="^/node_modules/intro.js/changelog.md" ' +
      ' --ignore="^/node_modules/intro.js/docs" ' +
      ' --ignore="^/node_modules/intro.js/example" ' +
      ' --ignore="^/node_modules/intro.js/license.md" ' +
      ' --ignore="^/node_modules/is-obj/license" ' +
      ' --ignore="^/node_modules/is-obj/readme.md" ' +
      ' --ignore="^/node_modules/isarray/README.md" ' +
      ' --ignore="^/node_modules/lodash/LICENSE" ' +
      ' --ignore="^/node_modules/lodash/README.md" ' +
      ' --ignore="^/node_modules/minimatch/LICENSE" ' +
      ' --ignore="^/node_modules/minimatch/README.md" ' +
      ' --ignore="^/node_modules/minimist/LICENSE" ' +
      ' --ignore="^/node_modules/minimist/example" ' +
      ' --ignore="^/node_modules/minimist/readme.markdown" ' +
      ' --ignore="^/node_modules/minimist/test" ' +
      ' --ignore="^/node_modules/mkdirp/LICENSE" ' +
      ' --ignore="^/node_modules/mkdirp/bin/usage.txt" ' +
      ' --ignore="^/node_modules/mkdirp/examples" ' +
      ' --ignore="^/node_modules/mkdirp/readme.markdown" ' +
      ' --ignore="^/node_modules/mkdirp/test" ' +
      ' --ignore="^/node_modules/ms/LICENSE.md" ' +
      ' --ignore="^/node_modules/ms/README.md" ' +
      ' --ignore="^/node_modules/nan/CHANGELOG.md" ' +
      ' --ignore="^/node_modules/nan/LICENSE.md" ' +
      ' --ignore="^/node_modules/nan/README.md" ' +
      ' --ignore="^/node_modules/nan/doc" ' +
      ' --ignore="^/node_modules/nan/nan.h" ' +
      ' --ignore="^/node_modules/nan/nan_callbacks.h" ' +
      ' --ignore="^/node_modules/nan/nan_callbacks_12_inl.h" ' +
      ' --ignore="^/node_modules/nan/nan_callbacks_pre_12_inl.h" ' +
      ' --ignore="^/node_modules/nan/nan_converters.h" ' +
      ' --ignore="^/node_modules/nan/nan_converters_43_inl.h" ' +
      ' --ignore="^/node_modules/nan/nan_converters_pre_43_inl.h" ' +
      ' --ignore="^/node_modules/nan/nan_implementation_12_inl.h" ' +
      ' --ignore="^/node_modules/nan/nan_implementation_pre_12_inl.h" ' +
      ' --ignore="^/node_modules/nan/nan_maybe_43_inl.h" ' +
      ' --ignore="^/node_modules/nan/nan_maybe_pre_43_inl.h" ' +
      ' --ignore="^/node_modules/nan/nan_new.h" ' +
      ' --ignore="^/node_modules/nan/nan_object_wrap.h" ' +
      ' --ignore="^/node_modules/nan/nan_persistent_12_inl.h" ' +
      ' --ignore="^/node_modules/nan/nan_persistent_pre_12_inl.h" ' +
      ' --ignore="^/node_modules/nan/nan_string_bytes.h" ' +
      ' --ignore="^/node_modules/nan/nan_typedarray_contents.h" ' +
      ' --ignore="^/node_modules/nan/nan_weak.h" ' +
      ' --ignore="^/node_modules/nan/tools/README.md" ' +
      ' --ignore="^/node_modules/once/LICENSE" ' +
      ' --ignore="^/node_modules/once/README.md" ' +
      ' --ignore="^/node_modules/os-tmpdir/license" ' +
      ' --ignore="^/node_modules/os-tmpdir/readme.md" ' +
      ' --ignore="^/node_modules/path-exists/license" ' +
      ' --ignore="^/node_modules/path-exists/readme.md" ' +
      ' --ignore="^/node_modules/path-is-absolute/license" ' +
      ' --ignore="^/node_modules/path-is-absolute/readme.md" ' +
      ' --ignore="^/node_modules/photon/CNAME" ' +
      ' --ignore="^/node_modules/photon/CONTRIBUTING.md" ' +
      ' --ignore="^/node_modules/photon/LICENSE" ' +
      ' --ignore="^/node_modules/photon/README.md" ' +
      ' --ignore="^/node_modules/photon/docs" ' +
      ' --ignore="^/node_modules/photon/sass" ' +
      ' --ignore="^/node_modules/pinkie-promise/license" ' +
      ' --ignore="^/node_modules/pinkie-promise/readme.md" ' +
      ' --ignore="^/node_modules/pinkie/license" ' +
      ' --ignore="^/node_modules/pinkie/readme.md" ' +
      ' --ignore="^/node_modules/pkg-up/license" ' +
      ' --ignore="^/node_modules/pkg-up/readme.md" ' +
      ' --ignore="^/node_modules/readable-stream/LICENSE" ' +
      ' --ignore="^/node_modules/readable-stream/README.md" ' +
      ' --ignore="^/node_modules/ref-struct/History.md" ' +
      ' --ignore="^/node_modules/ref-struct/README.md" ' +
      ' --ignore="^/node_modules/ref/CHANGELOG.md" ' +
      ' --ignore="^/node_modules/ref/README.md" ' +
      ' --ignore="^/node_modules/ref/build/Makefile" ' +
      ' --ignore="^/node_modules/ref/build/Release/.deps/Release/obj.target/binding/src" ' +
      ' --ignore="^/node_modules/ref/build/Release/obj.target/binding/src" ' +
      ' --ignore="^/node_modules/ref/build/binding.Makefile" ' +
      ' --ignore="^/node_modules/ref/build/binding.target.mk" ' +
      ' --ignore="^/node_modules/ref/docs" ' +
      ' --ignore="^/node_modules/ref/src" ' +
      ' --ignore="^/node_modules/ref/test" ' +
      ' --ignore="^/node_modules/rimraf/LICENSE" ' +
      ' --ignore="^/node_modules/rimraf/README.md" ' +
      ' --ignore="^/node_modules/stream-parser/History.md" ' +
      ' --ignore="^/node_modules/stream-parser/LICENSE" ' +
      ' --ignore="^/node_modules/stream-parser/README.md" ' +
      ' --ignore="^/node_modules/stream-parser/node_modules/debug/.npmignore" ' +
      ' --ignore="^/node_modules/stream-parser/node_modules/debug/History.md" ' +
      ' --ignore="^/node_modules/stream-parser/node_modules/debug/Makefile" ' +
      ' --ignore="^/node_modules/stream-parser/node_modules/debug/Readme.md" ' +
      ' --ignore="^/node_modules/stream-parser/node_modules/ms/license.md" ' +
      ' --ignore="^/node_modules/stream-parser/node_modules/ms/README.md" ' +
      ' --ignore="^/node_modules/stream-parser/test" ' +
      ' --ignore="^/node_modules/string_decoder/LICENSE" ' +
      ' --ignore="^/node_modules/string_decoder/README.md" ' +
      ' --ignore="^/node_modules/temp/LICENSE" ' +
      ' --ignore="^/node_modules/temp/README.md" ' +
      ' --ignore="^/node_modules/temp/examples" ' +
      ' --ignore="^/node_modules/temp/node_modules/rimraf/AUTHORS" ' +
      ' --ignore="^/node_modules/temp/node_modules/rimraf/LICENSE" ' +
      ' --ignore="^/node_modules/temp/node_modules/rimraf/README.md" ' +
      ' --ignore="^/node_modules/temp/node_modules/rimraf/test" ' +
      ' --ignore="^/node_modules/temp/test" ' +
      ' --ignore="^/node_modules/tunajs/CONTRIBUTE.md" ' +
      ' --ignore="^/node_modules/tunajs/README.md" ' +
      ' --ignore="^/node_modules/tunajs/tests" ' +
      ' --ignore="^/node_modules/wav/History.md" ' +
      ' --ignore="^/node_modules/wav/README.md" ' +
      ' --ignore="^/node_modules/wav/examples" ' +
      ' --ignore="^/node_modules/wav/test" ' +
      ' --ignore="^/node_modules/wave-recorder/README.md" ' +
      ' --ignore="^/node_modules/wave-recorder/example.js" ' +
      ' --ignore="^/node_modules/wrappy/LICENSE" ' +
      ' --ignore="^/node_modules/wrappy/README.md" ' +
      ' --ignore="^/node_modules/xtend/LICENCE" ' +
      ' --ignore="^/node_modules/xtend/Makefile" ' +
      ' --ignore="^/node_modules/xtend/README.md" ' +
      ' --ignore="^/node_modules/xtend/test.js" '

    # packaging
    execute "cd #{application}; ditto -c -k --sequesterRsrc --keepParent #{package_name} #{package_name}.zip"

    # open with finder
    execute "open #{application}/#{package_name}"

    # TODO release

  end
end


