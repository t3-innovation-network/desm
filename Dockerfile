FROM ruby:2.7

RUN apt-get update -qq \
    && apt-get install -y curl \
    && curl -sL https://deb.nodesource.com/setup_12.x | bash - \
    && cowsay \
    && curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
    && apt-get update -qq \
    && apt-get install -y nodejs yarn postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Specify everything will happen within the /app folder inside the container
RUN mkdir /app
WORKDIR /app

# Copy Gemfile from our current application to the /app container
COPY Gemfile Gemfile.lock ./

# Install all the dependencies
RUN bundle install

# Copy all the files from our current application to the /app 
COPY . .

# Add a script to be executed on every container start
COPY init.sh /usr/bin/
RUN chmod +x /usr/bin/init.sh
ENTRYPOINT ["init.sh"]

# Expose the port
EXPOSE 3000

# Start the main process.
CMD ["rails", "server", "-b", "0.0.0.0"]
