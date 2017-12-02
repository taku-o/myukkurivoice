# config valid only for current version of Capistrano
lock "3.8.1"

set :application, "MYukkuriVoice"
set :package_name, "MYukkuriVoice-darwin-x64"
set :repo_url, "git@github.com:taku-o/myukkurivoice.git"

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

    # fetch source code
    execute "git clone #{fetch :repo_url} #{application}"

    # git init
    execute "cd #{application}; git submodule update --init"

    # build
    execute "cd #{application}; electron-packager . MYukkuriVoice --platform=darwin --arch=x64 --electronVersion=1.7.9 --icon=icns/myukkurivoice.icns --overwrite --asar.unpackDir=vendor " +
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
      ' --ignore="^/js/spec.js" ' +
      ' --ignore="^/spec.html" ' +
      ' --ignore="\.DS_Store" '

    # packaging
    execute "cd #{application}; ditto -c -k --sequesterRsrc --keepParent #{package_name} #{package_name}.zip"

    # open with finder
    execute "open #{application}/#{package_name}"

    # TODO release

  end
end

