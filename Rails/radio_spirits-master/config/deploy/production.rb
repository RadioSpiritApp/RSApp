set :stage, :production

server '18.224.235.48', user: 'ubuntu', roles: %w{app web db}

role :app, %w{ubuntu@18.224.235.48}
role :web, %w{ubuntu@18.224.235.48}
role :db,  %w{ubuntu@18.224.235.48}


set :branch, 'master'

set :user, "ubuntu"
