class PagesController < ApplicationController
	def privacy
		Rails.logger.info "Remote IP: " + request.remote_ip
		Rails.logger.info "IP: " + request.ip
		Rails.logger.info "Remote Address: " + request.env['REMOTE_ADDR']
	end

	def terms
	end

	def help
	end

	def upload
	end
end
