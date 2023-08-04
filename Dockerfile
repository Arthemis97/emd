# Use the official PHP-FPM image as the base image
FROM php:8.2-fpm

# Set the working directory inside the container
WORKDIR /var/www/html

# Install system dependencies and PHP extensions required for Laravel
RUN apt-get update && apt-get install -y libpng-dev libjpeg-dev zip git unzip && \
	docker-php-ext-configure gd --with-jpeg && \
	docker-php-ext-install gd pdo pdo_mysql

# Install Composer globally
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install Node.js and npm
RUN apt-get install -y curl && \
	curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
	apt-get install -y nodejs

# Copy the Laravel project files to the container
COPY . .

# Install PHP and Node.js dependencies using Composer and npm
RUN composer install --ignore-platform-reqs && \
	npm install

# Expose the container's port if needed (e.g., if using php artisan serve)
EXPOSE 9000

# Start PHP-FPM
CMD ["php-fpm"]
