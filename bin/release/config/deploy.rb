# config valid only for current version of Capistrano
lock "3.7.1"

set :application, "myukkurivoice"
set :package_name, "myukkurivoice-darwin-x64"
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
    execute "cd #{application}; electron-packager . myukkurivoice --platform=darwin --arch=x64 --version=1.4.12 --icon=icns/myukkurivoice.icns --overwrite --ignore=\"(\.gitignore|\.gitmodules|docs|icns|README.md|vendor/aqk2k_mac|vendor/aqtk1-mac|vendor/aqtk2-mac)\" --asar.unpackDir=vendor"

    # packaging
    execute "cd #{application}; zip -r #{package_name} #{package_name}"

    # TODO release

  end
end

