defmodule LdndWeb.PageController do
  use LdndWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
