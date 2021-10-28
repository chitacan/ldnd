defmodule LdndWeb.SortableLive do
  use LdndWeb, :live_view
  use LdndWeb.LiveView.ReactHelpers, container_name: "Sortable"

  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  def render(assigns) do
    ~H"""
    <h2 class="text-2xl font-bold">Sortable</h2>
    <SortableLive.render_react />
    """
  end
end
