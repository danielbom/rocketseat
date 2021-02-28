defmodule RocketpayWeb.PageController do
  use RocketpayWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
