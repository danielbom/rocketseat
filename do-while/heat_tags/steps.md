# Install
asdf plugin-add erlang
asdf plugin-add elixir
asdf install elixir 1.12.3
asdf global elixir 1.12.3
asdf install erlang 24.1.2
asdf global erlang 24.1.2
mix archive.install hex phx_new

# Initialize
mix phx.new heat_tags --no-html --no-assets

# Startup
mix ecto.create
mix phx.server

# Create migrations
mix ecto.gen.migration create_messages
mix ecto.migrate

# Open repl
iex -S mix
```iex-console
# Reload changes on project
recompile 

# Get docs
# ex: h Module.function
h Ecto.Changeset.validate_length
```
