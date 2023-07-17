# config valid only for current version of Capistrano
set :application, "radio_spirits"
set :repo_url, "git@gitlab.com:systango/ror/radio_spirits.git"

set :rvm_ruby_version, 'ruby-2.5.1'
set :rvm_type, :user
# git is our SCM
set :scm, :git


# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp
app_dir = "/var/www/radio_spirits"
# Default deploy_to directory is /var/www/my_app_name
set :deploy_to, "#{app_dir}"

# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp

# Default deploy_to directory is /var/www/my_app_name
# set :deploy_to, "/var/www/my_app_name"
set :puma_bind, "unix://#{shared_path}/tmp/sockets/puma.sock"
set :puma_state, "#{shared_path}/tmp/pids/puma.state"
set :puma_pid, "#{shared_path}/tmp/pids/puma.pid"
# Default value for :format is :airbrussh.
# set :format, :airbrussh

# You can configure the Airbrussh format using :format_options.
# These are the defaults.
# set :format_options, command_output: true, log_file: "log/capistrano.log", color: :auto, truncate: :auto

# Default value for :pty is false
set :pty, false
set :ssh_options, {
   keys: %w(~/.ssh/id_rsa),
   forward_agent: false
}
# Default value for :linked_files is []
# append :linked_files, "config/database.yml", "config/secrets.yml"
set :linked_files, fetch(:linked_files, []).push('config/database.yml', 'config/master.key')

# Default value for linked_dirs is []
# append :linked_dirs, "log", "tmp/pids", "tmp/cache", "tmp/sockets", "public/system"
set :linked_dirs, fetch(:linked_dirs, []).push('log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'public/uploads')
# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for keep_releases is 5
# set :keep_releases, 5
# Puma:
set :puma_conf, "#{shared_path}/config/puma.rb"

# Sidekiq
set :sidekiq_roles, :app
set :sidekiq_default_hooks, true
set :sidekiq_pid, File.join(shared_path, 'tmp', 'pids', 'sidekiq.pid') # ensure this path exists in production before deploying.
set :sidekiq_env, fetch(:rack_env, fetch(:rails_env, fetch(:stage)))
set :sidekiq_log, File.join(shared_path, 'log', 'sidekiq.log')

# sidekiq systemd options
set :sidekiq_service_unit_name, 'sidekiq'
set :sidekiq_service_unit_user, :system
set :sidekiq_enable_lingering, true
set :sidekiq_lingering_user, nil

namespace :puma do
  desc 'Create Directories for Puma Pids and Socket'
  task :make_dirs do
    on roles(:app) do
      execute "mkdir #{shared_path}/tmp/sockets -p"
      execute "mkdir #{shared_path}/tmp/pids -p"
    end
  end

  before :start, :make_dirs
end

desc 'Restart application'
task :restart do
  on roles(:app), in: :sequence, wait: 5 do
    invoke 'puma:restart'
  end
end

set :use_sudo, false
