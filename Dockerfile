FROM ruby:2.7.1

RUN apt-get update -qq \
    && apt-get install -y curl \
    && curl -sL https://deb.nodesource.com/setup_12.x | bash - \
    && curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
    && apt-get install -y cowsay \
    && apt-get update -qq \
    && apt-get install -y nodejs yarn postgresql-client \
    && rm -rf /var/lib/apt/lists/* \
    && npm rebuild node-sass

# Specify everything will happen within the /app folder inside the container
RUN mkdir /app
WORKDIR /app

# Copy Gemfile from our current application to the /app container
COPY Gemfile Gemfile.lock ./

# Install all the backend dependencies
RUN bundle install

# Install all the frontend dependencies
RUN yarn

# Copy all the files from our current application to the /app 
COPY . .

# Add a script to be executed on every container start
COPY init.sh /usr/bin/
RUN chmod +x /usr/bin/init.sh
ENTRYPOINT ["init.sh"]

# Expose the port
EXPOSE 3030 1234
