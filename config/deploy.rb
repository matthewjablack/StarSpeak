# config valid only for Capistrano 3.1
lock '3.8.0'

set :application, 'StarSpeak'
set :repo_url, 'git@github.com:mattBlackDesign/StarSpeak.git'

set :deploy_to, '/home/deploy/StarSpeak'

set :linked_files, %w{config/database.yml config/webapi.yml}
set :linked_dirs, %w{log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system}


namespace :deploy do

  desc 'Restart application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      execute :touch, release_path.join('tmp/restart.txt')
    end
  end

  after :publishing, 'deploy:restart'
  after :finishing, 'deploy:cleanup'

  # after 'deploy:published', 'restart' do
	 #  invoke 'delayed_job:restart'
  # end


end

# namespace :delayed_job do

#   desc "Install Deployed Job executable if needed"
#   task :install do
#     on roles(delayed_job_roles) do |host|
#       within release_path do
#         # Only install if not already present
#         unless test("[ -f #{release_path}/#{delayed_job_bin} ]")
#           with rails_env: fetch(:rails_env) do
#             execute :bundle, :exec, :rails, :generate, :delayed_job
#           end
#         end
#       end
#     end
#   end

#   before :start, :install
#   before :restart, :install

# end