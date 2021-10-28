defmodule LdndWeb.SnapLive do
  use LdndWeb, :live_view
  use LdndWeb.LiveView.ReactHelpers, container_name: "Snap"

  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  def a, do: @external_resource

  def render(assigns) do
    ~H"""
    <h2 class="text-2xl font-bold">snap live</h2>
    <SnapLive.render_react />
    """
  end
end
