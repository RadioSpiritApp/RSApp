set :stage, :staging

server '13.59.64.203', user: 'ubuntu', roles: %w{app web db}

role :app, %w{ubuntu@13.59.64.203}
role :web, %w{ubuntu@13.59.64.203}
role :db,  %w{ubuntu@13.59.64.203}


set :branch, 'staging'

set :user, "ubuntu"
