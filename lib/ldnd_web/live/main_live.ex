defmodule LdndWeb.MainLive do
  use LdndWeb, :live_view

  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  def render(assigns) do
    ~H"""
    <h1 class="text-2xl font-extrabold">hello liveview & react-dnd</h1>
    <%= live_redirect "single_target", to: Routes.single_path(@socket, :index), class: "text-blue-600" %>
    """
  end
end
