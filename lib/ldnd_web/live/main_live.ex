defmodule LdndWeb.MainLive do
  use LdndWeb, :live_view

  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  def render(assigns) do
    ~H"""
    <h1>hello liveview & react-dnd</h1>
    """
  end
end
