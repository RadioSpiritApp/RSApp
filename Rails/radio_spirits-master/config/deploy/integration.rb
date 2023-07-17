set :stage, :integration

server '18.219.150.128', user: 'ubuntu', roles: %w{app web db}

role :app, %w{ubuntu@18.219.150.128}
role :web, %w{ubuntu@18.219.150.128}
role :db,  %w{ubuntu@18.219.150.128}


set :branch, 'integration'

set :user, "ubuntu"
