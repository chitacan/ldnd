defmodule LdndWeb.SnapLive do
  use LdndWeb, :live_view

  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  def render(assigns) do
    ~H"""
    <h2 class="text-2xl font-bold">snap live</h2>
    <%= render_react "Snap" %>
    """
  end
end
